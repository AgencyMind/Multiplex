import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface StoryboardData {
  label: string;
  sceneNumber?: number;
  duration?: number;
  thumbnail?: string;
  description?: string;
  status?: 'idle' | 'generating' | 'complete' | 'error';
}

export function StoryboardBlock({ data }: NodeProps<StoryboardData>) {
  const statusGlow = {
    idle: '0 0 20px rgba(156, 136, 255, 0.15)',
    generating: '0 0 25px rgba(0, 229, 255, 0.3)',
    complete: '0 0 20px rgba(100, 255, 218, 0.2)',
    error: '0 0 20px rgba(255, 87, 34, 0.25)',
  };

  return (
    <div className="relative group">
      {/* Connection handles - subtle integration */}
      <Handle 
        type="target" 
        position={Position.Top}
        className="!bg-transparent !border-0 !w-8 !h-2 !rounded-none"
        style={{
          background: 'linear-gradient(180deg, rgba(156,136,255,0.6) 0%, rgba(156,136,255,0) 100%)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
        }}
      />
      
      <div 
        className="w-[280px] h-[180px] rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,22,0.95) 0%, rgba(26,26,28,0.95) 50%, rgba(20,20,22,0.95) 100%)',
          border: '1px solid rgba(37,37,39,0.8)',
          boxShadow: `${statusGlow[data.status || 'idle']}, 0 8px 32px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Header bar with scene info */}
        <div 
          className="h-8 px-4 flex items-center justify-between relative"
          style={{
            background: 'linear-gradient(90deg, rgba(37,37,39,0.4) 0%, rgba(37,37,39,0.2) 50%, rgba(37,37,39,0.4) 100%)',
            borderBottom: '1px solid rgba(37,37,39,0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ 
                background: data.status === 'generating' ? '#00e5ff' : 
                           data.status === 'complete' ? '#64ffda' : 
                           data.status === 'error' ? '#ff5722' : '#9c88ff'
              }}
            />
            <span 
              className="text-[11px] font-medium tracking-wider"
              style={{ 
                fontFamily: 'Space Grotesk',
                color: 'rgba(156,163,175,0.9)',
                fontWeight: 500
              }}
            >
              SC{String(data.sceneNumber || 1).padStart(2, '0')}
            </span>
          </div>
          <span 
            className="text-[10px] tabular-nums"
            style={{ 
              fontFamily: 'JetBrains Mono',
              color: 'rgba(107,114,128,0.8)',
              fontWeight: 400
            }}
          >
            {data.duration || '5.0'}s
          </span>
        </div>
        
        {/* Main content area */}
        <div className="h-[120px] relative overflow-hidden">
          {data.thumbnail ? (
            <div 
              className="w-full h-full"
              style={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(156,136,255,0.05) 50%, rgba(100,255,218,0.05) 100%)',
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(10,10,11,0.8) 0%, rgba(20,20,22,0.4) 100%)',
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,37,39,0.6) 0%, rgba(26,26,28,0.6) 100%)',
                  border: '1px solid rgba(37,37,39,0.4)',
                }}
              >
                <div 
                  className="text-lg opacity-40"
                  style={{ color: 'rgba(156,136,255,0.6)' }}
                >
                  ◐
                </div>
              </div>
            </div>
          )}
          
          {/* Subtle corner accent */}
          <div 
            className="absolute top-0 right-0 w-8 h-8"
            style={{
              background: 'linear-gradient(225deg, rgba(156,136,255,0.1) 0%, transparent 70%)',
            }}
          />
        </div>
        
        {/* Description area */}
        <div className="px-4 py-3 h-[32px] flex items-center">
          <p 
            className="text-xs leading-tight truncate"
            style={{ 
              fontFamily: 'Plus Jakarta Sans',
              color: 'rgba(248,249,250,0.85)',
              fontWeight: 400
            }}
          >
            {data.description || data.label}
          </p>
        </div>
      </div>
      
      {/* Bottom connection handle */}
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-8 !h-2 !rounded-none"
        style={{
          background: 'linear-gradient(0deg, rgba(156,136,255,0.6) 0%, rgba(156,136,255,0) 100%)',
          clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
        }}
      />
    </div>
  );
}