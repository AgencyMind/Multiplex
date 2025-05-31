'use client';

import React, { useCallback } from 'react';
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
  StoryboardBlock,
  KeyframeBlock,
  SemanticBlock,
  ResourceBlock
} from './blocks';
import { NodeData } from '@/types/workflow';

const nodeTypes = {
  storyboard: StoryboardBlock,
  keyframe: KeyframeBlock,
  semantic: SemanticBlock,
  resource: ResourceBlock,
};

// Pre-populated sample nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'storyboard',
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
    type: 'storyboard',
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
    type: 'semantic',
    position: { x: 200, y: 320 },
    data: { 
      label: 'Mysterious Atmosphere',
      type: 'mood',
      connections: 3,
      strength: 0.8
    },
  },
  {
    id: '4',
    type: 'semantic',
    position: { x: 380, y: 320 },
    data: { 
      label: 'Protagonist',
      type: 'character',
      connections: 5,
      strength: 1.0
    },
  },
  {
    id: '5',
    type: 'keyframe',
    position: { x: 120, y: 180 },
    data: { 
      label: 'Door Open',
      timestamp: 1.2,
      property: 'rotation',
      value: '45deg',
      interpolation: 'bezier'
    },
  },
  {
    id: '6',
    type: 'keyframe',
    position: { x: 280, y: 180 },
    data: { 
      label: 'Step Forward',
      timestamp: 2.8,
      property: 'transform',
      value: 'translateX(20px)',
      interpolation: 'bezier'
    },
  },
  {
    id: '7',
    type: 'resource',
    position: { x: 750, y: 120 },
    data: { 
      label: 'Machine 1',
      machineId: 'M1-I2V',
      gpuLoad: 0.85,
      memoryUsage: 0.72,
      activeModel: 'Wan2.1-14B',
      queueLength: 2,
      status: 'busy'
    },
  },
  {
    id: '8',
    type: 'resource',
    position: { x: 750, y: 260 },
    data: { 
      label: 'Machine 2',
      machineId: 'M2-IMG',
      gpuLoad: 0.45,
      memoryUsage: 0.38,
      activeModel: 'Flux.1-dev',
      status: 'online'
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

  return (
    <div className="h-full w-full">
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
    </div>
  );
}