// PSEUDOCODE: SSH Tunnel Manager for GPU Node Connections

/*
import { Client } from 'ssh2';
import { createServer } from 'net';

interface TunnelConfig {
  nodeId: string;
  machineId: number;
  host: string;           // Remote machine IP
  sshPort: number;        // SSH port (usually 22)
  username: string;
  privateKey: string;     // Path to SSH key
  localPort: number;      // Local port to bind
  remotePort: number;     // Remote port to forward (ComfyUI/LangFlow)
  service: 'comfyui' | 'langflow' | 'deepseek';
}

interface ActiveTunnel {
  config: TunnelConfig;
  sshClient: Client;
  localServer: any;
  status: 'connecting' | 'connected' | 'error' | 'closed';
  lastError?: Error;
  connectionTime?: number;
  reconnectAttempts: number;
}

export class SSHTunnelManager {
  private tunnels: Map<string, ActiveTunnel> = new Map();
  private reconnectInterval: NodeJS.Timer | null = null;
  
  constructor(private configs: TunnelConfig[]) {
    // Initialize with tunnel configurations
  }
  
  async establishTunnels(): Promise<void> {
    // Create SSH tunnels for all configured nodes
    console.log(`Establishing ${this.configs.length} SSH tunnels...`);
    
    const promises = this.configs.map(config => this.createTunnel(config));
    const results = await Promise.allSettled(promises);
    
    // Check results
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`Failed to establish ${failures.length} tunnels`);
    }
    
    // Start health monitoring
    this.startHealthMonitoring();
  }
  
  private async createTunnel(config: TunnelConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const sshClient = new Client();
      
      const tunnel: ActiveTunnel = {
        config,
        sshClient,
        localServer: null,
        status: 'connecting',
        reconnectAttempts: 0
      };
      
      this.tunnels.set(config.nodeId, tunnel);
      
      sshClient.on('ready', () => {
        console.log(`SSH connection established to ${config.nodeId}`);
        tunnel.status = 'connected';
        tunnel.connectionTime = Date.now();
        
        // Create local server for port forwarding
        const localServer = createServer(socket => {
          sshClient.forwardOut(
            '127.0.0.1',
            socket.localPort,
            '127.0.0.1',
            config.remotePort,
            (err, stream) => {
              if (err) {
                console.error(`Forward error for ${config.nodeId}:`, err);
                socket.end();
                return;
              }
              
              // Pipe data between local socket and SSH stream
              socket.pipe(stream).pipe(socket);
              
              socket.on('error', (err) => {
                console.error(`Socket error for ${config.nodeId}:`, err);
                stream.close();
              });
              
              stream.on('error', (err) => {
                console.error(`Stream error for ${config.nodeId}:`, err);
                socket.end();
              });
            }
          );
        });
        
        localServer.listen(config.localPort, '127.0.0.1', () => {
          console.log(`Tunnel ${config.nodeId} listening on port ${config.localPort}`);
          tunnel.localServer = localServer;
          resolve();
        });
        
        localServer.on('error', (err) => {
          console.error(`Local server error for ${config.nodeId}:`, err);
          reject(err);
        });
      });
      
      sshClient.on('error', (err) => {
        console.error(`SSH error for ${config.nodeId}:`, err);
        tunnel.status = 'error';
        tunnel.lastError = err;
        reject(err);
      });
      
      sshClient.on('close', () => {
        console.log(`SSH connection closed for ${config.nodeId}`);
        tunnel.status = 'closed';
        
        // Clean up local server
        if (tunnel.localServer) {
          tunnel.localServer.close();
        }
        
        // Schedule reconnection
        this.scheduleReconnect(config.nodeId);
      });
      
      // Read private key
      const privateKey = require('fs').readFileSync(config.privateKey);
      
      // Connect
      sshClient.connect({
        host: config.host,
        port: config.sshPort,
        username: config.username,
        privateKey: privateKey,
        keepaliveInterval: 30000, // 30 seconds
        readyTimeout: 30000,
        algorithms: {
          serverHostKey: ['rsa-sha2-512', 'rsa-sha2-256', 'ssh-rsa']
        }
      });
    });
  }
  
  private scheduleReconnect(nodeId: string): void {
    const tunnel = this.tunnels.get(nodeId);
    if (!tunnel) return;
    
    tunnel.reconnectAttempts++;
    
    // Exponential backoff with max delay
    const delay = Math.min(
      1000 * Math.pow(2, tunnel.reconnectAttempts),
      60000 // Max 1 minute
    );
    
    console.log(`Scheduling reconnect for ${nodeId} in ${delay}ms (attempt ${tunnel.reconnectAttempts})`);
    
    setTimeout(() => {
      if (tunnel.status !== 'connected') {
        this.createTunnel(tunnel.config).catch(err => {
          console.error(`Reconnection failed for ${nodeId}:`, err);
        });
      }
    }, delay);
  }
  
  private startHealthMonitoring(): void {
    // Check tunnel health every 10 seconds
    this.reconnectInterval = setInterval(() => {
      for (const [nodeId, tunnel] of this.tunnels) {
        if (tunnel.status !== 'connected') {
          console.warn(`Tunnel ${nodeId} is not connected (status: ${tunnel.status})`);
        }
        
        // Test connectivity by making a simple request
        this.testTunnelConnectivity(nodeId).catch(err => {
          console.error(`Health check failed for ${nodeId}:`, err);
        });
      }
    }, 10000);
  }
  
  private async testTunnelConnectivity(nodeId: string): Promise<void> {
    const tunnel = this.tunnels.get(nodeId);
    if (!tunnel || tunnel.status !== 'connected') return;
    
    // Make a simple HTTP request through the tunnel
    const testUrl = `http://localhost:${tunnel.config.localPort}/api/health`;
    
    try {
      const response = await fetch(testUrl, { 
        method: 'GET',
        timeout: 5000 
      });
      
      if (!response.ok) {
        throw new Error(`Health check returned ${response.status}`);
      }
    } catch (error) {
      console.error(`Health check failed for ${nodeId}:`, error);
      
      // Mark tunnel as unhealthy
      tunnel.status = 'error';
      tunnel.lastError = error as Error;
      
      // Trigger reconnection
      this.scheduleReconnect(nodeId);
    }
  }
  
  getTunnelStatus(nodeId: string): any {
    const tunnel = this.tunnels.get(nodeId);
    if (!tunnel) return null;
    
    return {
      nodeId,
      status: tunnel.status,
      localPort: tunnel.config.localPort,
      remotePort: tunnel.config.remotePort,
      service: tunnel.config.service,
      uptime: tunnel.connectionTime 
        ? Date.now() - tunnel.connectionTime 
        : 0,
      reconnectAttempts: tunnel.reconnectAttempts,
      lastError: tunnel.lastError?.message
    };
  }
  
  getAllTunnelStatuses(): any[] {
    return Array.from(this.tunnels.keys()).map(nodeId => 
      this.getTunnelStatus(nodeId)
    );
  }
  
  async closeTunnel(nodeId: string): Promise<void> {
    const tunnel = this.tunnels.get(nodeId);
    if (!tunnel) return;
    
    console.log(`Closing tunnel ${nodeId}`);
    
    // Close SSH connection
    tunnel.sshClient.end();
    
    // Close local server
    if (tunnel.localServer) {
      await new Promise<void>((resolve) => {
        tunnel.localServer.close(() => resolve());
      });
    }
    
    this.tunnels.delete(nodeId);
  }
  
  async closeAllTunnels(): Promise<void> {
    console.log('Closing all SSH tunnels...');
    
    // Stop health monitoring
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
    
    // Close all tunnels
    const promises = Array.from(this.tunnels.keys()).map(nodeId => 
      this.closeTunnel(nodeId)
    );
    
    await Promise.all(promises);
  }
  
  // Get local URLs for accessing remote services
  getServiceUrls(): Record<string, string> {
    const urls: Record<string, string> = {};
    
    for (const [nodeId, tunnel] of this.tunnels) {
      if (tunnel.status === 'connected') {
        urls[nodeId] = `http://localhost:${tunnel.config.localPort}`;
      }
    }
    
    return urls;
  }
}

// Example tunnel configurations for the 7-GPU cluster
export const TUNNEL_CONFIGS: TunnelConfig[] = [
  {
    nodeId: 'node-1',
    machineId: 1,
    host: '192.168.1.10',  // Machine 1 IP
    sshPort: 22,
    username: 'gpuuser',
    privateKey: '/home/multiplex/.ssh/gpu_cluster_key',
    localPort: 8001,
    remotePort: 8188,      // ComfyUI default port
    service: 'comfyui'
  },
  {
    nodeId: 'node-2',
    machineId: 2,
    host: '192.168.1.11',  // Machine 2 IP
    sshPort: 22,
    username: 'gpuuser',
    privateKey: '/home/multiplex/.ssh/gpu_cluster_key',
    localPort: 8002,
    remotePort: 8188,
    service: 'comfyui'
  },
  {
    nodeId: 'node-3',
    machineId: 3,
    host: '192.168.1.12',  // Machine 3 IP (Ubuntu)
    sshPort: 22,
    username: 'ubuntu',
    privateKey: '/home/multiplex/.ssh/gpu_cluster_key',
    localPort: 8003,
    remotePort: 8188,
    service: 'comfyui'
  },
  {
    nodeId: 'node-4',
    machineId: 4,
    host: '192.168.1.13',  // Machine 4 IP
    sshPort: 22,
    username: 'gpuuser',
    privateKey: '/home/multiplex/.ssh/gpu_cluster_key',
    localPort: 8004,
    remotePort: 7860,      // LangFlow default port
    service: 'langflow'
  }
];
*/

// Placeholder export
export class SSHTunnelManager {
  constructor(private configs: any[]) {}
  
  async establishTunnels(): Promise<void> {
    console.log('Establishing SSH tunnels (stub)');
  }
  
  getTunnelStatus(nodeId: string): any {
    return { nodeId, status: 'connected' };
  }
  
  getServiceUrls(): Record<string, string> {
    return {
      'node-1': 'http://localhost:8001',
      'node-2': 'http://localhost:8002',
      'node-3': 'http://localhost:8003',
      'node-4': 'http://localhost:8004'
    };
  }
  
  async closeAllTunnels(): Promise<void> {
    console.log('Closing SSH tunnels (stub)');
  }
}