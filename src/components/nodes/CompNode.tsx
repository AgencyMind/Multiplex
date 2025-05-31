import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function CompNode({ data }: NodeProps<NodeData>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-400">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <div className="text-sm font-bold">Complement</div>
        <div className="text-gray-700 text-sm">{data.label}</div>
        {data.content && (
          <div className="text-xs text-gray-600 mt-1 max-w-[200px] truncate">
            {data.content}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}