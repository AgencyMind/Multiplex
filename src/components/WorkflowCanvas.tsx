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
  IntentNode, 
  CompNode, 
  GenArtNode,
  ActivityStreamNode,
  NarrationNode,
  VisualNarrationNode 
} from './nodes';
import { NodeData } from '@/types/workflow';

const nodeTypes = {
  intent: IntentNode,
  'comp-logic': CompNode,
  'comp-data': CompNode,
  'comp-transform': CompNode,
  'genart-image': GenArtNode,
  'genart-video': GenArtNode,
  'genart-audio': GenArtNode,
  activity: ActivityStreamNode,
  narration: NarrationNode,
  'visual-narration': VisualNarrationNode,
};

// Pre-populated sample nodes
const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'intent',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Character enters room', 
      type: 'intent',
      status: 'processing'
    },
  },
  {
    id: '2',
    type: 'activity',
    position: { x: 650, y: 80 },
    data: { 
      label: 'GPU Activity Stream',
      type: 'activity',
      activities: [
        { source: 'Machine 1', message: 'I2V processing frame 24/120', timestamp: Date.now() },
        { source: 'Machine 2', message: 'Image generation complete', timestamp: Date.now() - 5000 },
        { source: 'Machine 4', message: 'DeepSeek R1 analyzing scene', timestamp: Date.now() - 10000 },
      ]
    },
  },
  {
    id: '3',
    type: 'narration',
    position: { x: 300, y: 300 },
    data: { 
      label: 'Scene Narration',
      type: 'narration',
      content: 'The door creaks open slowly, revealing a dimly lit room. Shadows dance across weathered walls as footsteps echo on the wooden floor...'
    },
  },
  {
    id: '4',
    type: 'visual-narration',
    position: { x: 650, y: 320 },
    data: { 
      label: 'Generated Scene',
      type: 'visual-narration',
      imageUrl: '/api/placeholder/300/200',
      prompt: 'Dimly lit room with shadows on weathered walls'
    },
  },
  {
    id: '5',
    type: 'comp-logic',
    position: { x: 480, y: 150 },
    data: { 
      label: 'Lighting',
      type: 'comp',
      subType: 'logic'
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-5', source: '1', target: '5', animated: true },
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