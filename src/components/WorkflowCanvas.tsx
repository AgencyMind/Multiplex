'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  IntentsBlock,
  CompsBlock,
  GenArtBlock,
  NarrationsBlock,
  ActivityStreamsBlock
} from './blocks';
import { NodeData } from '@/types/workflow';

// PSEUDOCODE: Import hooks for real functionality
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useWorkflowSubmission } from '@/hooks/useWorkflowSubmission';
// import { useActivityStream } from '@/hooks/useActivityStream';

const nodeTypes = {
  intents: IntentsBlock,
  comps: CompsBlock,
  genart: GenArtBlock,
  narrations: NarrationsBlock,
  activitystreams: ActivityStreamsBlock,
};

// Pre-populated sample nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'intents',
    position: { x: 200, y: 100 },
    data: { 
      label: 'Character enters room',
      sceneNumber: 1,
      duration: 5.2,
      description: 'Wide shot of character opening creaking door, revealing dimly lit interior',
      status: 'generating'
    },
  },
  {
    id: '2',
    type: 'intents',
    position: { x: 520, y: 100 },
    data: { 
      label: 'Close-up reaction',
      sceneNumber: 2,
      duration: 3.8,
      description: 'Character\'s face shows surprise and caution',
      status: 'complete'
    },
  },
  {
    id: '3',
    type: 'comps',
    position: { x: 200, y: 320 },
    data: { 
      label: 'Dim Lighting',
      type: 'lighting',
      connections: 2,
      strength: 0.8
    },
  },
  {
    id: '4',
    type: 'comps',
    position: { x: 380, y: 320 },
    data: { 
      label: 'Low Camera Angle',
      type: 'camera',
      connections: 1,
      strength: 0.6
    },
  },
  {
    id: '5',
    type: 'genart',
    position: { x: 120, y: 500 },
    data: { 
      label: 'Generated Scene',
      type: 'image',
      status: 'complete',
      url: 'generated-room-scene.jpg'
    },
  },
  {
    id: '6',
    type: 'narrations',
    position: { x: 400, y: 500 },
    data: { 
      label: 'Scene Description',
      text: 'A mysterious figure approaches the weathered door, hand trembling as shadows dance across the threshold.',
      hasImage: true
    },
  },
  {
    id: '7',
    type: 'activitystreams',
    position: { x: 750, y: 120 },
    data: { 
      label: 'GPU Cluster Status',
      activities: [
        { source: 'M1-I2V', message: 'Wan2.1 processing frame 24/120', timestamp: Date.now() },
        { source: 'M2-IMG', message: 'Flux generation complete', timestamp: Date.now() - 5000 },
        { source: 'M4-R1', message: 'DeepSeek analyzing scene', timestamp: Date.now() - 10000 },
      ],
      overallLoad: 0.73
    },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-5', 
    source: '1', 
    target: '5', 
    animated: true,
    style: { stroke: 'rgba(156,136,255,0.4)', strokeWidth: 2 }
  },
  { 
    id: 'e5-6', 
    source: '5', 
    target: '6', 
    animated: true,
    style: { stroke: 'rgba(100,255,218,0.4)', strokeWidth: 2 }
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3', 
    animated: false,
    style: { stroke: 'rgba(156,136,255,0.2)', strokeWidth: 1 }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    animated: false,
    style: { stroke: 'rgba(0,229,255,0.2)', strokeWidth: 1 }
  },
];

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  
  // PSEUDOCODE: WebSocket and workflow submission hooks
  /*
  const { 
    connected, 
    submitWorkflow: wsSubmitWorkflow,
    activityStream,
    getNodeActivity 
  } = useWebSocket();
  
  const {
    submitting,
    workflowId,
    progress,
    submitWorkflow,
    validateWorkflow
  } = useWorkflowSubmission();
  
  const {
    gpuStatus,
    metrics,
    getNodeMetrics,
    getActivitySummary
  } = useActivityStream();
  */

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('nodeType');
      if (!type) return;

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };

      const id = `${nodes.length + 1}`;
      const newNode: Node<NodeData> = {
        id,
        type,
        position,
        data: {
          label: `New ${type}`,
          type: type.includes('comp') ? 'comp' : type.includes('genart') ? 'genArt' : type as any,
          subType: type.includes('-') ? type.split('-')[1] : undefined,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  // PSEUDOCODE: Handle workflow execution
  /*
  const handleExecuteWorkflow = async () => {
    // Validate workflow structure
    const validation = await validateWorkflow(nodes, edges);
    if (!validation.valid) {
      console.error('Workflow validation failed:', validation.errors);
      return;
    }
    
    // Submit workflow
    try {
      const workflowId = await submitWorkflow({
        nodes,
        edges,
        metadata: {
          name: 'Multiplex Demo Workflow',
          priority: 'normal'
        }
      });
      
      console.log('Workflow submitted:', workflowId);
    } catch (error) {
      console.error('Failed to submit workflow:', error);
    }
  };
  
  // Update node statuses based on activity stream
  useEffect(() => {
    if (!activityStream) return;
    
    // Update node statuses based on workflow progress
    const updatedNodes = nodes.map(node => {
      const activity = getNodeActivity(node.id);
      if (activity.length > 0) {
        const latestStatus = activity[activity.length - 1];
        return {
          ...node,
          data: {
            ...node.data,
            status: latestStatus.data.status,
            progress: latestStatus.data.progress
          }
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
  }, [activityStream, nodes, getNodeActivity, setNodes]);
  
  // Show GPU status in activity stream nodes
  useEffect(() => {
    const activityNodes = nodes.filter(n => n.type === 'activitystreams');
    
    activityNodes.forEach(node => {
      const summary = getActivitySummary();
      setNodes(nds => nds.map(n => 
        n.id === node.id 
          ? {
              ...n,
              data: {
                ...n.data,
                metrics: summary.metrics,
                headline: summary.headline
              }
            }
          : n
      ));
    });
  }, [gpuStatus, nodes, setNodes, getActivitySummary]);
  */

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{ animated: true, style: { stroke: '#252527' } }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          color="#1a1a1a"
          size={1}
        />
        <Controls 
          className="!bg-[#141416] !border-[#252527]"
        />
      </ReactFlow>
      
      {/* PSEUDOCODE: Workflow execution button */}
      {/*
      <div className="absolute bottom-8 right-8 flex gap-4">
        {connected ? (
          <div className="px-3 py-1 bg-[#64ffda20] border border-[#64ffda60] rounded text-[#64ffda] text-sm">
            Connected
          </div>
        ) : (
          <div className="px-3 py-1 bg-[#ff572220] border border-[#ff572260] rounded text-[#ff5722] text-sm">
            Disconnected
          </div>
        )}
        
        <button
          onClick={handleExecuteWorkflow}
          disabled={submitting || !connected}
          className="px-6 py-2 bg-[#00e5ff] text-[#0a0a0b] rounded font-medium 
                     hover:bg-[#00d4ff] transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
        >
          {submitting ? 'Executing...' : 'Execute Workflow'}
        </button>
        
        {workflowId && (
          <div className="px-3 py-1 bg-[#9c88ff20] border border-[#9c88ff60] rounded text-[#9c88ff] text-sm">
            ID: {workflowId} ({progress}%)
          </div>
        )}
      </div>
      */}
    </div>
  );
}