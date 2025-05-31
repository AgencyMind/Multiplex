# Multiplex Implementation Guide

This document outlines all the pseudocode stubs and implementation patterns for the Multiplex distributed AI orchestration system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Digital Ocean Cloud                          │
│  ┌─────────────────────┐         ┌──────────────────────────────┐   │
│  │   Multiplex UI      │ <-----> │  Coordination Server (MCP)   │   │
│  │   (Next.js)         │   WS    │  - Workflow orchestration    │   │
│  └─────────────────────┘         │  - Resource allocation       │   │
│                                  │  - Activity aggregation       │   │
│                                  └────────────┬─────────────────┘   │
└────────────────────────────────────────────────┼───────────────────┘
                                                 │ SSH Tunnels
                            ┌────────────────────┴────────────────────┐
                            │           Local GPU Cluster             │
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│   Machine 1       │  │   Machine 2       │  │   Machine 3       │  │   Machine 4       │
│  3x A6000 (Win)   │  │  1x A6000 (Win)   │  │  1x A6000 (Ubuntu)│  │  2x 6000 Ada (Win)│
│                   │  │                   │  │                   │  │                   │
│ LangFlow + ComfyUI│  │ LangFlow + ComfyUI│  │ LangFlow + ComfyUI│  │ LangFlow+DeepSeek │
│ I2V Generation    │  │ Image Generation  │  │ Visual Narration  │  │ Text Narration    │
└───────────────────┘  └───────────────────┘  └───────────────────┘  └───────────────────┘
```

## Implementation Status

### ✅ Completed Components

1. **Frontend UI** (`/src/`)
   - React Flow canvas with drag-and-drop
   - All 5 node types with unique visual designs
   - Dark theme with sophisticated styling
   - Type-safe TypeScript implementation

2. **Basic Type Definitions**
   - Workflow types
   - Node data interfaces
   - WebSocket message types

### 🔄 Stubbed Components (Pseudocode)

#### 1. Coordination Server (`/coordination-server/src/`)

**Main Server** (`index.ts`)
- Express + WebSocket server setup
- MCP server initialization (stubbed)
- GPU node registry
- Workflow scheduler
- Activity stream aggregation
- REST API endpoints

**Key Functions to Implement:**
```typescript
// Initialize GPU connections via SSH tunnels
async function initializeGPUConnections()

// Process workflow queue and dispatch tasks
class WorkflowScheduler {
  async submitWorkflow(workflow: Workflow): Promise<string>
  private async processQueue()
  private selectOptimalNode(task: Task): string
}

// Aggregate activity from all nodes
class ActivityStreamAggregator {
  async startPolling()
  private broadcast(streamId: string, updates: ActivityUpdate[])
}
```

#### 2. MCP Integration (`/coordination-server/src/mcp/`)

**Tool Definitions** (`definitions.ts`)
- Workflow submission tools
- Resource allocation tools
- Activity stream subscription
- GPU cluster status providers

**Implementation Needed:**
```typescript
// MCP tools for workflow operations
export const workflowTools: ToolDefinition[] = [
  'submit_workflow',
  'get_workflow_status',
  'allocate_gpu_resources',
  'stream_activity'
]

// Resource providers for real-time status
export const resourceProviders: ResourceProvider[] = [
  'gpu_cluster_status',
  'workflow_templates',
  'model_capabilities'
]
```

#### 3. GPU Communication (`/coordination-server/src/gpu/`)

**ComfyUI Client** (`comfyui-client.ts`)
- Node registration and health checks
- Workflow submission via REST API
- WebSocket progress monitoring
- Output retrieval

**LangFlow Client** (`langflow-client.ts`)
- MCP tool registration for flows
- Flow execution via MCP protocol
- Specific integrations for each model

**SSH Tunnel Manager** (`ssh-tunnel-manager.ts`)
- Establish reverse SSH tunnels
- Health monitoring and reconnection
- Service URL mapping

**Key Integration Points:**
```typescript
// ComfyUI workflow builders
async buildWan21I2VWorkflow(imageData: string, duration: number)
async buildFluxImageGenWorkflow(prompt: string, style?: string)

// LangFlow executions
async executeImageGeneration(nodeId: string, prompt: string)
async executeVideoGeneration(nodeId: string, imageUrl: string)
async executeNarration(nodeId: string, activityStream: string)
```

#### 4. Workflow Engine (`/coordination-server/src/engine/`)

**Workflow Engine** (`workflow-engine.ts`)
- DAG creation from React Flow graph
- Dependency resolution
- Parallel execution scheduling
- Retry logic and error handling

**Core Logic:**
```typescript
// Parse React Flow graph into execution plan
async createExecutionPlan(nodes: Node[], edges: Edge[]): ExecutionPlan

// Execute nodes respecting dependencies
async executeWorkflow(planId: string): Promise<void>

// Node-specific execution handlers
private async executeIntentNode(node: ExecutionNode)
private async executeGenArtNode(node: ExecutionNode)
private async executeNarrationNode(node: ExecutionNode)
```

#### 5. Frontend Hooks (`/src/hooks/`)

**WebSocket Hook** (`useWebSocket.ts`)
- Connection management
- Message handling
- Activity stream subscription
- Workflow submission

**Workflow Submission Hook** (`useWorkflowSubmission.ts`)
- Validation logic
- API calls
- Progress polling
- Error handling

**Activity Stream Hook** (`useActivityStream.ts`)
- GPU status monitoring
- Workflow event tracking
- Metrics calculation
- Real-time updates

## Implementation Priorities

### Phase 1: Basic Connectivity (2 hours)
1. Get coordination server running
2. Establish WebSocket connection
3. Basic message passing
4. Simple workflow submission

### Phase 2: GPU Integration (3 hours)
1. SSH tunnel setup (manual for demo)
2. ComfyUI API integration
3. Basic image generation test
4. Activity stream from one node

### Phase 3: Workflow Execution (3 hours)
1. Simple DAG execution
2. Image → Video pipeline
3. Status updates to frontend
4. Basic error handling

### Phase 4: Polish & Demo (2 hours)
1. Clean up UI interactions
2. Add progress indicators
3. Handle edge cases
4. Prepare demo workflow

## Key Implementation Patterns

### 1. Non-blocking Pseudocode
All complex functionality is wrapped in comments to prevent runtime errors:
```typescript
// PSEUDOCODE: Complex functionality
/*
const complexFunction = async () => {
  // Detailed implementation logic
  // That would require external dependencies
}
*/

// Simple stub for testing
const complexFunction = async () => {
  console.log('Complex function (stub)');
  return mockData;
}
```

### 2. Progressive Enhancement
Start with static data, then add dynamic features:
```typescript
// Start with mock data
const gpuStatus = {
  'node-1': { utilization: 75, status: 'active' }
};

// Later replace with real monitoring
// const gpuStatus = await getGPUStatus();
```

### 3. Interface-First Development
All major components have TypeScript interfaces defined:
```typescript
interface WorkflowSubmission {
  nodes: Node[];
  edges: Edge[];
  metadata: WorkflowMetadata;
}
```

### 4. Modular Architecture
Each component is self-contained and can be developed independently:
- Frontend can run with mock data
- Coordination server can use stub GPU clients
- GPU clients can be tested with local ComfyUI

## Testing Strategy

### Unit Testing Stubs
```typescript
// Test workflow validation
describe('WorkflowEngine', () => {
  it('should detect circular dependencies', () => {
    const nodes = [/* ... */];
    const edges = [/* circular edges */];
    const result = validateWorkflow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Circular dependency detected');
  });
});
```

### Integration Testing Pattern
```typescript
// Test end-to-end workflow submission
it('should submit and execute simple workflow', async () => {
  // 1. Connect WebSocket
  // 2. Submit workflow
  // 3. Monitor progress
  // 4. Verify output
});
```

## Configuration Examples

### SSH Tunnel Configuration
```typescript
const TUNNEL_CONFIGS: TunnelConfig[] = [
  {
    nodeId: 'node-1',
    host: '192.168.1.10',      // Replace with actual IPs
    localPort: 8001,           // Local port for access
    remotePort: 8188,          // ComfyUI port
    service: 'comfyui'
  }
  // ... other nodes
];
```

### MCP Server Configuration
```typescript
const mcpConfig = {
  name: 'multiplex-coordinator',
  version: '1.0.0',
  capabilities: ['tools', 'resources'],
  transport: {
    type: 'websocket',
    port: 3001
  }
};
```

## Deployment Checklist

### Digital Ocean Setup
- [ ] Create droplet for coordination server
- [ ] Configure Coolify for deployment
- [ ] Set up environment variables
- [ ] Configure SSL/TLS

### Local GPU Cluster
- [ ] Install SSH keys on all machines
- [ ] Configure ComfyUI API access
- [ ] Set up LangFlow MCP servers
- [ ] Test connectivity from DO

### Production Considerations
- [ ] Add authentication to WebSocket
- [ ] Implement rate limiting
- [ ] Add comprehensive error logging
- [ ] Set up monitoring/alerting

## Common Issues & Solutions

### SSH Tunnel Connection Failed
```bash
# Test SSH connection manually
ssh -i ~/.ssh/gpu_cluster_key gpuuser@192.168.1.10

# Check if port forwarding works
ssh -L 8001:localhost:8188 -i ~/.ssh/gpu_cluster_key gpuuser@192.168.1.10
```

### ComfyUI API Not Responding
```bash
# Check if ComfyUI is running
curl http://localhost:8188/system_stats

# Enable API in ComfyUI settings
# --enable-api flag when starting
```

### WebSocket Connection Drops
```typescript
// Implement reconnection logic
const reconnectInterval = setInterval(() => {
  if (ws.readyState !== WebSocket.OPEN) {
    connect();
  }
}, 3000);
```

## Next Steps

1. **Implement WebSocket connection** between frontend and coordination server
2. **Set up one GPU node** with ComfyUI API access
3. **Create simple image generation** workflow
4. **Add activity stream updates** from GPU to frontend
5. **Implement workflow execution** for intent → image → video pipeline

The pseudocode provides a complete blueprint for the full implementation while allowing the current code to run without errors.