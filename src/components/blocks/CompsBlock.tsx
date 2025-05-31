import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CompsData {
  label: string;
  type: 'lighting' | 'camera' | 'sound' | 'mood' | 'effects';
  connections?: number;
  strength?: number;
}

export function CompsBlock({ data }: NodeProps<CompsData>) {
  const typeStyles = {
    lighting: { color: '#ffc947', accent: 'rgba(255,201,71,0.2)' },
    camera: { color: '#00e5ff', accent: 'rgba(0,229,255,0.2)' },
    sound: { color: '#9c88ff', accent: 'rgba(156,136,255,0.2)' },
    mood: { color: '#64ffda', accent: 'rgba(100,255,218,0.2)' },
    effects: { color: '#ff5722', accent: 'rgba(255,87,34,0.2)' },
  };

  const style = typeStyles[data.type] || typeStyles.mood;

  return (
    <div className="relative">
      {/* Multiple connection handles for complement relationships */}
      <Handle 
        type="target" 
        position={Position.Top}
        id="comps-in-1"
        className="!bg-transparent !border-0 !w-2 !h-2 !rounded-full"
        style={{
          background: `radial-gradient(circle, ${style.color} 0%, ${style.color}60 70%, transparent 100%)`,
          left: '25%',
        }}
      />
      <Handle 
        type="target" 
        position={Position.Top}
        id="comps-in-2"
        className="!bg-transparent !border-0 !w-2 !h-2 !rounded-full"
        style={{
          background: `radial-gradient(circle, ${style.color} 0%, ${style.color}60 70%, transparent 100%)`,
          left: '75%',
        }}
      />
      
      <div 
        className="w-[140px] h-[90px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,22,0.92) 0%, rgba(26,26,28,0.92) 70%, rgba(20,20,22,0.92) 100%)',
          border: `1px solid ${style.color}50`,
          boxShadow: `0 0 12px ${style.accent}, 0 4px 16px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header with type indicator */}
        <div 
          className="h-6 px-3 flex items-center justify-between"
          style={{
            background: `linear-gradient(90deg, ${style.accent} 0%, transparent 50%, ${style.accent} 100%)`,
            borderBottom: `1px solid ${style.color}30`,
          }}
        >
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
          {data.connections && (
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{ 
                background: style.color,
                color: 'rgba(10,10,11,0.9)',
                fontFamily: 'JetBrains Mono'
              }}
            >
              {data.connections}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3 flex-1 flex flex-col justify-between">
          <p 
            className="text-xs leading-tight font-medium"
            style={{ 
              fontFamily: 'Plus Jakarta Sans',
              color: 'rgba(248,249,250,0.9)',
              fontWeight: 500
            }}
          >
            {data.label}
          </p>
          
          {/* Strength indicator */}
          {data.strength !== undefined && (
            <div className="mt-2">
              <div 
                className="h-0.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(37,37,39,0.6)' }}
              >
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${data.strength * 100}%`,
                    background: `linear-gradient(90deg, ${style.color} 0%, ${style.color}80 100%)`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom connection handles */}
      <Handle 
        type="source" 
        position={Position.Bottom}
        id="comps-out-1"
        className="!bg-transparent !border-0 !w-2 !h-2 !rounded-full"
        style={{
          background: `radial-gradient(circle, ${style.color} 0%, ${style.color}60 70%, transparent 100%)`,
          left: '25%',
        }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom}
        id="comps-out-2"
        className="!bg-transparent !border-0 !w-2 !h-2 !rounded-full"
        style={{
          background: `radial-gradient(circle, ${style.color} 0%, ${style.color}60 70%, transparent 100%)`,
          left: '75%',
        }}
      />
    </div>
  );
}