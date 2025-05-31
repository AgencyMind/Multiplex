import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

// PSEUDOCODE: Activity Stream Hook for Real-time Monitoring

/*
interface GPUStatus {
  nodeId: string;
  machineId: number;
  gpuModel: string;
  utilization: number;  // 0-100
  vramUsed: number;     // GB
  vramTotal: number;    // GB
  temperature: number;  // Celsius
  powerDraw: number;    // Watts
  currentTask: {
    type: string;
    workflowId: string;
    progress: number;
    eta: number;
  } | null;
}

interface WorkflowEvent {
  workflowId: string;
  nodeId: string;
  type: 'started' | 'progress' | 'completed' | 'failed';
  timestamp: number;
  data: any;
}

interface NarrationUpdate {
  text: string;
  visualPrompt?: string;
  timestamp: number;
  context: {
    workflowId?: string;
    gpuActivity: Record<string, number>;
  };
}

interface NetworkMetrics {
  interNodeBandwidth: Record<string, number>; // MB/s
  totalTransferred: number; // GB
  activeTransfers: Array<{
    from: string;
    to: string;
    size: number;
    progress: number;
  }>;
}

interface ActivityStreamState {
  gpuStatus: Record<string, GPUStatus>;
  recentEvents: WorkflowEvent[];
  narrationHistory: NarrationUpdate[];
  networkMetrics: NetworkMetrics;
  aggregateMetrics: {
    totalGPUUtilization: number;
    activeWorkflows: number;
    queueDepth: number;
    avgProcessingTime: number;
  };
}

export function useActivityStream() {
  const { activityStream, onMessage } = useWebSocket();
  const [state, setState] = useState<ActivityStreamState>({
    gpuStatus: {},
    recentEvents: [],
    narrationHistory: [],
    networkMetrics: {
      interNodeBandwidth: {},
      totalTransferred: 0,
      activeTransfers: []
    },
    aggregateMetrics: {
      totalGPUUtilization: 0,
      activeWorkflows: 0,
      queueDepth: 0,
      avgProcessingTime: 0
    }
  });
  
  // Process incoming activity updates
  useEffect(() => {
    const processActivity = (activity: any) => {
      switch (activity.type) {
        case 'gpu_status':
          setState(prev => ({
            ...prev,
            gpuStatus: {
              ...prev.gpuStatus,
              [activity.nodeId]: activity.data
            }
          }));
          break;
          
        case 'workflow_event':
          setState(prev => ({
            ...prev,
            recentEvents: [
              ...prev.recentEvents.slice(-49), // Keep last 50 events
              activity.data
            ]
          }));
          break;
          
        case 'narration':
          setState(prev => ({
            ...prev,
            narrationHistory: [
              ...prev.narrationHistory.slice(-19), // Keep last 20 narrations
              activity.data
            ]
          }));
          break;
          
        case 'network_metrics':
          setState(prev => ({
            ...prev,
            networkMetrics: activity.data
          }));
          break;
          
        case 'aggregate_metrics':
          setState(prev => ({
            ...prev,
            aggregateMetrics: activity.data
          }));
          break;
      }
    };
    
    // Process existing activity stream
    activityStream.forEach(processActivity);
    
    // Listen for new activity
    return onMessage('ACTIVITY_UPDATE', processActivity);
  }, [activityStream, onMessage]);
  
  // Calculate derived metrics
  const getDerivedMetrics = useCallback(() => {
    const gpuNodes = Object.values(state.gpuStatus);
    
    // Average GPU utilization
    const avgUtilization = gpuNodes.length > 0
      ? gpuNodes.reduce((sum, gpu) => sum + gpu.utilization, 0) / gpuNodes.length
      : 0;
      
    // Total VRAM usage
    const totalVramUsed = gpuNodes.reduce((sum, gpu) => sum + gpu.vramUsed, 0);
    const totalVramCapacity = gpuNodes.reduce((sum, gpu) => sum + gpu.vramTotal, 0);
    
    // Active workflows count
    const activeWorkflows = new Set(
      gpuNodes
        .filter(gpu => gpu.currentTask)
        .map(gpu => gpu.currentTask!.workflowId)
    ).size;
    
    // Workflow completion rate (last 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentCompletions = state.recentEvents.filter(
      event => 
        event.type === 'completed' && 
        event.timestamp > fiveMinutesAgo
    ).length;
    
    return {
      avgUtilization,
      totalVramUsed,
      totalVramCapacity,
      vramUtilization: totalVramCapacity > 0 
        ? (totalVramUsed / totalVramCapacity) * 100 
        : 0,
      activeWorkflows,
      completionRate: recentCompletions / 5, // per minute
      healthScore: calculateHealthScore(state)
    };
  }, [state]);
  
  // Get activity for specific GPU node
  const getNodeMetrics = useCallback((nodeId: string) => {
    const gpu = state.gpuStatus[nodeId];
    if (!gpu) return null;
    
    // Get recent events for this node
    const nodeEvents = state.recentEvents.filter(e => e.nodeId === nodeId);
    
    // Calculate node-specific metrics
    const completedTasks = nodeEvents.filter(e => e.type === 'completed').length;
    const failedTasks = nodeEvents.filter(e => e.type === 'failed').length;
    const successRate = completedTasks > 0 
      ? completedTasks / (completedTasks + failedTasks) 
      : 0;
      
    return {
      ...gpu,
      recentEvents: nodeEvents.slice(-10),
      successRate,
      uptime: calculateUptime(nodeId, state.recentEvents)
    };
  }, [state]);
  
  // Get workflow-specific activity
  const getWorkflowActivity = useCallback((workflowId: string) => {
    const events = state.recentEvents.filter(e => e.workflowId === workflowId);
    const narrations = state.narrationHistory.filter(
      n => n.context.workflowId === workflowId
    );
    
    // Find which GPUs are working on this workflow
    const activeGPUs = Object.entries(state.gpuStatus)
      .filter(([_, gpu]) => gpu.currentTask?.workflowId === workflowId)
      .map(([nodeId, gpu]) => ({
        nodeId,
        progress: gpu.currentTask!.progress,
        eta: gpu.currentTask!.eta
      }));
      
    return {
      events,
      narrations,
      activeGPUs,
      status: determineWorkflowStatus(events),
      startTime: events[0]?.timestamp,
      estimatedCompletion: calculateETA(activeGPUs)
    };
  }, [state]);
  
  // Subscribe to specific activity types
  const subscribe = useCallback((types: string[], filter?: any) => {
    // In real implementation, would send subscription update to server
    console.log('Subscribing to activity types:', types, filter);
  }, []);
  
  // Format activity for display
  const formatActivity = useCallback((activity: any): string => {
    switch (activity.type) {
      case 'gpu_status':
        return `GPU ${activity.nodeId}: ${activity.data.utilization}% utilization`;
        
      case 'workflow_event':
        return `Workflow ${activity.data.workflowId}: ${activity.data.type}`;
        
      case 'narration':
        return activity.data.text;
        
      default:
        return JSON.stringify(activity);
    }
  }, []);
  
  // Generate activity summary
  const getActivitySummary = useCallback(() => {
    const metrics = getDerivedMetrics();
    const activeNodes = Object.values(state.gpuStatus).filter(
      gpu => gpu.currentTask !== null
    ).length;
    
    return {
      headline: `${activeNodes} of ${Object.keys(state.gpuStatus).length} GPUs active`,
      metrics: [
        `${metrics.avgUtilization.toFixed(1)}% avg utilization`,
        `${metrics.totalVramUsed.toFixed(1)}/${metrics.totalVramCapacity}GB VRAM`,
        `${metrics.activeWorkflows} active workflows`,
        `${metrics.completionRate.toFixed(1)} completions/min`
      ],
      status: metrics.healthScore > 80 ? 'healthy' : 
              metrics.healthScore > 50 ? 'degraded' : 'critical',
      lastUpdate: Date.now()
    };
  }, [state, getDerivedMetrics]);
  
  return {
    // Raw state
    ...state,
    
    // Derived metrics
    metrics: getDerivedMetrics(),
    
    // Methods
    getNodeMetrics,
    getWorkflowActivity,
    subscribe,
    formatActivity,
    getActivitySummary
  };
}

// Helper functions
function calculateHealthScore(state: ActivityStreamState): number {
  let score = 100;
  
  // Penalize high utilization (might indicate bottleneck)
  const gpus = Object.values(state.gpuStatus);
  const avgUtil = gpus.reduce((sum, gpu) => sum + gpu.utilization, 0) / gpus.length;
  if (avgUtil > 90) score -= 20;
  else if (avgUtil > 80) score -= 10;
  
  // Penalize high temperatures
  const maxTemp = Math.max(...gpus.map(gpu => gpu.temperature));
  if (maxTemp > 85) score -= 30;
  else if (maxTemp > 80) score -= 15;
  
  // Penalize recent failures
  const recentFailures = state.recentEvents.filter(
    e => e.type === 'failed' && e.timestamp > Date.now() - 300000
  ).length;
  score -= recentFailures * 10;
  
  return Math.max(0, score);
}

function calculateUptime(nodeId: string, events: WorkflowEvent[]): number {
  // Simple uptime calculation based on events
  const nodeEvents = events.filter(e => e.nodeId === nodeId);
  if (nodeEvents.length === 0) return 100;
  
  const failures = nodeEvents.filter(e => e.type === 'failed').length;
  return ((nodeEvents.length - failures) / nodeEvents.length) * 100;
}

function determineWorkflowStatus(events: WorkflowEvent[]): string {
  if (events.length === 0) return 'pending';
  
  const lastEvent = events[events.length - 1];
  if (lastEvent.type === 'completed') return 'completed';
  if (lastEvent.type === 'failed') return 'failed';
  if (lastEvent.type === 'started' || lastEvent.type === 'progress') return 'running';
  
  return 'unknown';
}

function calculateETA(activeGPUs: any[]): number | null {
  if (activeGPUs.length === 0) return null;
  
  // Return the maximum ETA among all active GPUs
  return Math.max(...activeGPUs.map(gpu => gpu.eta));
}
*/

// Placeholder implementation
export function useActivityStream() {
  const [gpuStatus, setGpuStatus] = useState<Record<string, any>>({});
  
  return {
    gpuStatus,
    recentEvents: [],
    narrationHistory: [],
    networkMetrics: {
      interNodeBandwidth: {},
      totalTransferred: 0,
      activeTransfers: []
    },
    aggregateMetrics: {
      totalGPUUtilization: 0,
      activeWorkflows: 0,
      queueDepth: 0,
      avgProcessingTime: 0
    },
    metrics: {
      avgUtilization: 0,
      totalVramUsed: 0,
      totalVramCapacity: 336, // 7 GPUs
      vramUtilization: 0,
      activeWorkflows: 0,
      completionRate: 0,
      healthScore: 100
    },
    getNodeMetrics: (nodeId: string) => null,
    getWorkflowActivity: (workflowId: string) => ({
      events: [],
      narrations: [],
      activeGPUs: [],
      status: 'pending',
      startTime: undefined,
      estimatedCompletion: null
    }),
    subscribe: (types: string[], filter?: any) => {
      console.log('Subscribe to activity (stub):', types, filter);
    },
    formatActivity: (activity: any) => JSON.stringify(activity),
    getActivitySummary: () => ({
      headline: '0 of 7 GPUs active',
      metrics: ['0% avg utilization', '0/336GB VRAM', '0 active workflows'],
      status: 'healthy' as const,
      lastUpdate: Date.now()
    })
  };
}