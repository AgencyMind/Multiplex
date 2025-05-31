import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function GenArtNode({ data }: NodeProps<NodeData>) {
  const typeIcons = {
    image: '🖼️',
    video: '🎬',
    narration: '🎙️',
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-orange-100 border-2 border-orange-400">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <div className="text-sm font-bold flex items-center gap-2">
          <span>{typeIcons[data.artifactType || 'image']}</span>
          <span>Gen.Art</span>
        </div>
        <div className="text-gray-700 text-sm">{data.label}</div>
        {data.url && (
          <div className="text-xs text-blue-600 mt-1 underline cursor-pointer">
            View artifact
          </div>
        )}
      </div>
    </div>
  );
}