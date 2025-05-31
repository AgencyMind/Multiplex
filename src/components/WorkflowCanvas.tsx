'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { IntentNode, CompNode, GenArtNode } from './nodes';
import { NodeData } from '@/types/workflow';

const nodeTypes = {
  intent: IntentNode,
  comp: CompNode,
  genArt: GenArtNode,
};

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'intent',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Create marketing video', 
      type: 'intent',
      status: 'pending'
    },
  },
];

interface WorkflowCanvasProps {
  onNodeAdd: (type: string, position: { x: number; y: number }) => void;
  onNodeUpdate: (nodeId: string, data: any) => void;
}

export function WorkflowCanvas({ onNodeAdd, onNodeUpdate }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nextNodeId, setNextNodeId] = useState(2);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
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

      const newNode: Node<NodeData> = {
        id: `${nextNodeId}`,
        type,
        position,
        data: {
          label: `New ${type}`,
          type: type as 'intent' | 'comp' | 'genArt',
          status: type === 'intent' ? 'pending' : undefined,
          artifactType: type === 'genArt' ? 'image' : undefined,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setNextNodeId(nextNodeId + 1);
      onNodeAdd(type, position);
    },
    [nextNodeId, setNodes, onNodeAdd]
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
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}