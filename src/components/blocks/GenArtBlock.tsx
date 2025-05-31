import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface GenArtData {
  label: string;
  type: 'image' | 'video' | 'audio';
  status: 'idle' | 'generating' | 'complete' | 'error';
  url?: string;
  progress?: number;
  model?: string;
}

export function GenArtBlock({ data }: NodeProps<GenArtData>) {
  const typeStyles = {
    image: { color: '#ff5722', accent: 'rgba(255,87,34,0.2)', symbol: '◻' },
    video: { color: '#00e5ff', accent: 'rgba(0,229,255,0.2)', symbol: '▷' },
    audio: { color: '#9c88ff', accent: 'rgba(156,136,255,0.2)', symbol: '♪' },
  };

  const style = typeStyles[data.type] || typeStyles.image;

  const statusColors = {
    idle: { glow: 'rgba(156,136,255,0.1)' },
    generating: { glow: 'rgba(0,229,255,0.3)' },
    complete: { glow: 'rgba(100,255,218,0.2)' },
    error: { glow: 'rgba(255,87,34,0.3)' },
  };

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Top}
        className="!bg-transparent !border-0 !w-6 !h-2"
        style={{
          background: `linear-gradient(180deg, ${style.color}60 0%, transparent 100%)`,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
        }}
      />
      
      <div 
        className="w-[160px] h-[120px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,22,0.94) 0%, rgba(26,26,28,0.94) 100%)',
          border: `1px solid ${style.color}50`,
          boxShadow: `0 0 15px ${statusColors[data.status].glow}, 0 4px 16px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header */}
        <div 
          className="h-6 px-3 flex items-center justify-between"
          style={{
            background: `linear-gradient(90deg, ${style.accent} 0%, transparent 50%, ${style.accent} 100%)`,
            borderBottom: `1px solid ${style.color}30`,
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="text-sm"
              style={{ color: style.color }}
            >
              {style.symbol}
            </span>
            <span 
              className="text-[9px] uppercase tracking-wider font-medium"
              style={{ 
                fontFamily: 'Space Grotesk',
                color: style.color,
                fontWeight: 500
              }}
            >
              {data.type}
            </span>
          </div>
          
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              background: data.status === 'generating' ? '#00e5ff' : 
                         data.status === 'complete' ? '#64ffda' : 
                         data.status === 'error' ? '#ff5722' : '#6b7280'
            }}
          />
        </div>
        
        {/* Content area */}
        <div className="p-3 h-[94px] flex flex-col">
          {/* Artifact preview */}
          <div 
            className="flex-1 rounded-md mb-2 flex items-center justify-center"
            style={{
              background: data.url ? 
                'linear-gradient(135deg, rgba(100,255,218,0.05) 0%, rgba(156,136,255,0.05) 100%)' :
                'linear-gradient(135deg, rgba(37,37,39,0.6) 0%, rgba(20,20,22,0.6) 100%)',
              border: '1px solid rgba(37,37,39,0.4)',
            }}
          >
            {data.status === 'complete' && data.url ? (
              <span 
                className="text-[10px] font-medium"
                style={{ 
                  fontFamily: 'Plus Jakarta Sans',
                  color: '#64ffda',
                  fontWeight: 500
                }}
              >
                ✓ Ready
              </span>
            ) : data.status === 'generating' ? (
              <div className="text-center">
                <div 
                  className="w-8 h-1 rounded-full mb-1 overflow-hidden"
                  style={{ background: 'rgba(37,37,39,0.6)' }}
                >
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${(data.progress || 0.4) * 100}%`,
                      background: style.color
                    }}
                  />
                </div>
                <span 
                  className="text-[8px]"
                  style={{ 
                    fontFamily: 'JetBrains Mono',
                    color: 'rgba(156,163,175,0.7)',
                    fontWeight: 400
                  }}
                >
                  {Math.round((data.progress || 0.4) * 100)}%
                </span>
              </div>
            ) : (
              <span 
                className="text-lg opacity-30"
                style={{ color: style.color }}
              >
                {style.symbol}
              </span>
            )}
          </div>
          
          {/* Label and model */}
          <div>
            <p 
              className="text-[10px] font-medium truncate leading-tight"
              style={{ 
                fontFamily: 'Plus Jakarta Sans',
                color: 'rgba(248,249,250,0.9)',
                fontWeight: 500
              }}
            >
              {data.label}
            </p>
            {data.model && (
              <p 
                className="text-[8px] text-gray-400 truncate"
                style={{ 
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 400
                }}
              >
                {data.model}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-6 !h-2"
        style={{
          background: `linear-gradient(0deg, ${style.color}60 0%, transparent 100%)`,
          clipPath: 'polygon(0% 0%, 100% 0%, 75% 100%, 25% 100%)',
        }}
      />
    </div>
  );
}