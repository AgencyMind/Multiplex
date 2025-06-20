import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function GenArtNode({ data }: NodeProps<NodeData>) {
  const icons = {
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
  };

  return (
    <div 
      className="w-[200px] h-[140px] rounded border backdrop-blur-xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
        border: '1px solid #252527',
        borderLeft: '3px solid #ff5722',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#252527] !w-2 !h-2" 
      />
      
      <div className="p-3 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">
            {icons[data.subType as keyof typeof icons] || '🎨'}
          </span>
          <h3 className="text-xs font-semibold text-[#ff5722] uppercase tracking-wider"
              style={{ fontFamily: 'Space Grotesk' }}>
            Generated {data.subType || 'Art'}
          </h3>
        </div>
        
        <div className="flex-1 bg-[#0a0a0b] rounded overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            {data.url ? (
              <span className="text-xs text-[#64ffda]">✓ Ready</span>
            ) : (
              <div className="space-y-1">
                <div className="w-16 h-1 bg-[#252527] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff5722] animate-pulse" style={{ width: '70%' }} />
                </div>
                <span className="text-[10px] text-[#6b7280] block text-center">Processing</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-[10px] text-[#6b7280] truncate">
            {data.label}
          </p>
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