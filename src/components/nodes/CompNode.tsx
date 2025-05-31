import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function CompNode({ data }: NodeProps<NodeData>) {
  const icons = {
    logic: '⚡',
    data: '📊',
    transform: '🔄',
  };

  return (
    <div 
      className="w-[72px] h-[72px] rounded-full flex items-center justify-center relative"
      style={{
        background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
        border: '2px solid #ffc947',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#ffc947] !w-2 !h-2 !border-0" 
      />
      
      <div className="text-center">
        <span className="text-2xl mb-1 block">
          {icons[data.subType as keyof typeof icons] || '🔧'}
        </span>
        <span className="text-[10px] text-[#9ca3af] font-medium">
          {data.label}
        </span>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-[#ffc947] !w-2 !h-2 !border-0" 
      />
    </div>
  );
}