import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function IntentNode({ data }: NodeProps<NodeData>) {
  const statusColors = {
    pending: 'bg-gray-200',
    processing: 'bg-blue-200',
    completed: 'bg-green-200',
    error: 'bg-red-200',
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 border-stone-400 ${statusColors[data.status || 'pending']}`}>
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <div className="text-lg font-bold">Intent</div>
        <div className="text-gray-700">{data.label}</div>
        {data.status && (
          <div className="text-xs text-gray-500 mt-1">
            Status: {data.status}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}