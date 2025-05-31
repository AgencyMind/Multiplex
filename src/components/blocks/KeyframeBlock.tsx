import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface KeyframeData {
  label: string;
  timestamp: number;
  property?: string;
  value?: any;
  interpolation?: 'linear' | 'bezier' | 'step';
}

export function KeyframeBlock({ data }: NodeProps<KeyframeData>) {
  const interpolationColors = {
    linear: '#64ffda',
    bezier: '#9c88ff',
    step: '#ffc947',
  };

  const color = interpolationColors[data.interpolation || 'linear'];
  const accent = `${color}30`;

  return (
    <div className="relative group">
      {/* Timeline connection line extends upward */}
      <div 
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[1px] h-8 opacity-60"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${color} 100%)` }}
      />
      
      {/* Left connection handle */}
      <Handle 
        type="target" 
        position={Position.Left}
        className="!bg-transparent !border-0 !w-1 !h-4"
        style={{
          background: `linear-gradient(90deg, ${color}80 0%, transparent 100%)`,
          borderRadius: '0 1px 1px 0',
        }}
      />
      
      <div 
        className="w-[100px] h-[60px] rounded-md overflow-hidden transition-all duration-200 hover:scale-[1.03]"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,22,0.94) 0%, rgba(26,26,28,0.94) 100%)',
          border: `1px solid ${accent}`,
          boxShadow: `0 0 8px ${accent}, 0 3px 12px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Timestamp header */}
        <div 
          className="h-4 px-2 flex items-center justify-center"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, transparent 50%, ${accent} 100%)`,
            borderBottom: `1px solid ${color}20`,
          }}
        >
          <span 
            className="text-[8px] tabular-nums font-medium"
            style={{ 
              fontFamily: 'JetBrains Mono',
              color: color,
              fontWeight: 500
            }}
          >
            {String(Math.floor(data.timestamp / 60)).padStart(2, '0')}:
            {String(Math.floor(data.timestamp % 60)).padStart(2, '0')}.
            {String(Math.floor((data.timestamp % 1) * 100)).padStart(2, '0')}
          </span>
        </div>
        
        {/* Content */}
        <div className="px-2 py-1.5 flex flex-col justify-between h-[44px]">
          <span 
            className="text-[10px] font-medium truncate leading-tight"
            style={{ 
              fontFamily: 'Plus Jakarta Sans',
              color: 'rgba(248,249,250,0.9)',
              fontWeight: 500
            }}
          >
            {data.property || data.label}
          </span>
          
          <div className="flex items-center justify-between">
            <span 
              className="text-[8px] text-gray-400 truncate"
              style={{ 
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 400,
                maxWidth: '60px'
              }}
            >
              {data.value || '0'}
            </span>
            
            {/* Interpolation indicator */}
            <div 
              className="w-1 h-3 rounded-full"
              style={{ background: color }}
            />
          </div>
        </div>
      </div>
      
      {/* Right connection handle */}
      <Handle 
        type="source" 
        position={Position.Right}
        className="!bg-transparent !border-0 !w-1 !h-4"
        style={{
          background: `linear-gradient(270deg, ${color}80 0%, transparent 100%)`,
          borderRadius: '1px 0 0 1px',
        }}
      />
      
      {/* Timeline marker at bottom */}
      <div 
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full opacity-80"
        style={{ background: color }}
      />
    </div>
  );
}