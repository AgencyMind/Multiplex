import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function VisualNarrationNode({ data }: NodeProps<NodeData>) {
  return (
    <div 
      className="w-[200px] h-[140px] rounded border backdrop-blur-xl relative overflow-hidden"
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
      
      <div className="p-3 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🎨</span>
          <h3 className="text-xs font-semibold text-[#9c88ff] uppercase tracking-wider"
              style={{ fontFamily: 'Space Grotesk' }}>
            Visual Narration
          </h3>
        </div>
        
        <div className="flex-1 bg-[#0a0a0b] rounded overflow-hidden">
          {data.imageUrl ? (
            <div className="w-full h-full bg-gradient-to-br from-[#9c88ff]/20 to-[#00e5ff]/20 
                          flex items-center justify-center">
              <span className="text-xs text-[#6b7280]">Preview</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#9c88ff] border-t-transparent 
                            rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        <div className="mt-2">
          <p className="text-[10px] text-[#6b7280] truncate">
            {data.prompt || 'Generating...'}
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