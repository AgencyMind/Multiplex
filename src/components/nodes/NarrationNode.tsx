import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function NarrationNode({ data }: NodeProps<NodeData>) {
  return (
    <div 
      className="w-[300px] h-[160px] rounded border backdrop-blur-xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
        border: '1px solid #252527',
        borderLeft: '3px solid #9c88ff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#252527] !w-2 !h-2" 
      />
      
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💭</span>
          <h3 className="text-sm font-semibold text-[#9c88ff] uppercase tracking-wider"
              style={{ fontFamily: 'Space Grotesk' }}>
            {data.label}
          </h3>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <p className="text-[#f8f9fa] text-sm leading-relaxed line-clamp-4">
            {data.content || 'Generating narration...'}
          </p>
        </div>
        
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#9c88ff] rounded-full animate-pulse" />
          <span className="text-xs text-[#6b7280]">DeepSeek R1</span>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-[#252527] !w-2 !h-2" 
      />
    </div>
  );
}