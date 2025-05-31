import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface NarrationsData {
  label: string;
  text: string;
  hasImage?: boolean;
  imageUrl?: string;
  status?: 'draft' | 'complete' | 'reviewing';
}

export function NarrationsBlock({ data }: NodeProps<NarrationsData>) {
  const statusColors = {
    draft: { color: '#ffc947', glow: 'rgba(255,201,71,0.2)' },
    complete: { color: '#64ffda', glow: 'rgba(100,255,218,0.2)' },
    reviewing: { color: '#9c88ff', glow: 'rgba(156,136,255,0.2)' },
  };

  const status = statusColors[data.status || 'draft'];

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Left}
        className="!bg-transparent !border-0 !w-2 !h-8"
        style={{
          background: `linear-gradient(90deg, #64ffda60 0%, transparent 100%)`,
          borderRadius: '0 4px 4px 0',
        }}
      />
      
      <div 
        className="w-[200px] h-[140px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01]"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,22,0.92) 0%, rgba(26,26,28,0.92) 70%, rgba(20,20,22,0.92) 100%)',
          border: `1px solid #64ffda40`,
          boxShadow: `0 0 12px ${status.glow}, 0 4px 16px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header */}
        <div 
          className="h-6 px-3 flex items-center justify-between"
          style={{
            background: `linear-gradient(90deg, rgba(100,255,218,0.15) 0%, transparent 50%, rgba(100,255,218,0.15) 100%)`,
            borderBottom: `1px solid #64ffda20`,
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="text-sm"
              style={{ color: '#64ffda' }}
            >
              ◐
            </span>
            <span 
              className="text-[9px] uppercase tracking-wider font-medium"
              style={{ 
                fontFamily: 'Space Grotesk',
                color: '#64ffda',
                fontWeight: 500
              }}
            >
              NARRATION
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {data.hasImage && (
              <div 
                className="w-3 h-3 rounded-sm flex items-center justify-center text-[8px]"
                style={{ 
                  background: 'rgba(100,255,218,0.2)',
                  color: '#64ffda'
                }}
              >
                ◻
              </div>
            )}
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: status.color }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3 h-[114px] flex flex-col">
          {/* Text content */}
          <div className="flex-1 mb-2">
            <p 
              className="text-[10px] leading-relaxed text-justify overflow-hidden"
              style={{ 
                fontFamily: 'Plus Jakarta Sans',
                color: 'rgba(248,249,250,0.85)',
                fontWeight: 400,
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {data.text}
            </p>
          </div>
          
          {/* Label and status */}
          <div className="flex items-center justify-between">
            <span 
              className="text-[9px] font-medium truncate"
              style={{ 
                fontFamily: 'Plus Jakarta Sans',
                color: 'rgba(156,163,175,0.9)',
                fontWeight: 500,
                maxWidth: '120px'
              }}
            >
              {data.label}
            </span>
            
            {data.status && (
              <span 
                className="text-[8px] uppercase tracking-wider"
                style={{ 
                  fontFamily: 'Space Grotesk',
                  color: status.color,
                  fontWeight: 500
                }}
              >
                {data.status}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right}
        className="!bg-transparent !border-0 !w-2 !h-8"
        style={{
          background: `linear-gradient(270deg, #64ffda60 0%, transparent 100%)`,
          borderRadius: '4px 0 0 4px',
        }}
      />
    </div>
  );
}