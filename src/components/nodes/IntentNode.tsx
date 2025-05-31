import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function IntentNode({ data }: NodeProps<NodeData>) {
  const statusColors = {
    pending: '#ffc947',
    processing: '#00e5ff',
    completed: '#64ffda',
    error: '#ff5722',
  };

  return (
    <div 
      className="w-[280px] h-[140px] rounded border backdrop-blur-xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
        border: '1px solid #252527',
        borderLeft: `3px solid ${statusColors[data.status || 'pending']}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#252527] !w-2 !h-2" 
      />
      
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎯</span>
          <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider"
              style={{ fontFamily: 'Space Grotesk' }}>
            Intent Block
          </h3>
        </div>
        
        <div className="flex-1">
          <p className="text-[#f8f9fa] text-base leading-relaxed">
            {data.label}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[#6b7280]">
            Status: <span style={{ color: statusColors[data.status || 'pending'] }}>
              {data.status || 'pending'}
            </span>
          </span>
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