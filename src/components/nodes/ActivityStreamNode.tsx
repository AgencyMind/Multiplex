import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types/workflow';

export function ActivityStreamNode({ data }: NodeProps<NodeData>) {
  return (
    <div 
      className="w-[240px] h-[180px] rounded border backdrop-blur-xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
        border: '1px solid #252527',
        borderLeft: '3px solid #64ffda',
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
          <span className="text-xl">📡</span>
          <h3 className="text-sm font-semibold text-[#64ffda] uppercase tracking-wider"
              style={{ fontFamily: 'Space Grotesk' }}>
            Activity Stream
          </h3>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="space-y-1 text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
            {data.activities?.slice(0, 4).map((activity, idx) => (
              <div key={idx} className="text-[#9ca3af] truncate">
                <span className="text-[#64ffda]">{activity.source}:</span>{' '}
                <span className="text-[#6b7280]">{activity.message}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-2">
          <div className="h-1 bg-[#1a1a1c] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#64ffda] to-[#00e5ff] animate-pulse"
              style={{ width: '60%' }}
            />
          </div>
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