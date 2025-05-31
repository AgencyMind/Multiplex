import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ResourceData {
  label: string;
  machineId: string;
  gpuLoad: number;
  memoryUsage: number;
  activeModel?: string;
  queueLength?: number;
  status: 'online' | 'busy' | 'offline' | 'error';
}

export function ResourceBlock({ data }: NodeProps<ResourceData>) {
  const statusColors = {
    online: { primary: '#64ffda', secondary: 'rgba(100,255,218,0.2)' },
    busy: { primary: '#00e5ff', secondary: 'rgba(0,229,255,0.2)' },
    offline: { primary: '#6b7280', secondary: 'rgba(107,114,128,0.1)' },
    error: { primary: '#ff5722', secondary: 'rgba(255,87,34,0.2)' },
  };

  const colors = statusColors[data.status];

  return (
    <div className="relative">
      {/* Minimal connection points */}
      <Handle 
        type="target" 
        position={Position.Left}
        className="!bg-transparent !border-0 !w-1 !h-6"
        style={{
          background: `linear-gradient(90deg, ${colors.primary}80 0%, transparent 100%)`,
          borderRadius: '0 2px 2px 0',
        }}
      />
      
      <div 
        className="w-[180px] h-[120px] rounded-md overflow-hidden transition-all duration-200 hover:scale-[1.01]"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,22,0.9) 0%, rgba(26,26,28,0.7) 70%, rgba(20,20,22,0.9) 100%)',
          border: `1px solid ${colors.primary}40`,
          boxShadow: `0 0 15px ${colors.secondary}, 0 4px 20px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header */}
        <div 
          className="h-7 px-3 flex items-center justify-between"
          style={{
            background: `linear-gradient(90deg, ${colors.secondary} 0%, transparent 50%, ${colors.secondary} 100%)`,
            borderBottom: `1px solid ${colors.primary}20`,
          }}
        >
          <span 
            className="text-[10px] tracking-wider font-medium"
            style={{ 
              fontFamily: 'Space Grotesk',
              color: colors.primary,
              fontWeight: 500
            }}
          >
            {data.machineId}
          </span>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: colors.primary }}
          />
        </div>
        
        {/* Metrics grid */}
        <div className="p-3 space-y-2.5">
          {/* GPU Load */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span 
                className="text-[9px] uppercase tracking-wider"
                style={{ 
                  fontFamily: 'Plus Jakarta Sans',
                  color: 'rgba(156,163,175,0.7)',
                  fontWeight: 500
                }}
              >
                GPU
              </span>
              <span 
                className="text-[9px] tabular-nums"
                style={{ 
                  fontFamily: 'JetBrains Mono',
                  color: 'rgba(248,249,250,0.8)',
                  fontWeight: 400
                }}
              >
                {Math.round(data.gpuLoad * 100)}%
              </span>
            </div>
            <div 
              className="h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(37,37,39,0.6)' }}
            >
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${data.gpuLoad * 100}%`,
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primary}80 100%)`
                }}
              />
            </div>
          </div>
          
          {/* Memory Usage */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span 
                className="text-[9px] uppercase tracking-wider"
                style={{ 
                  fontFamily: 'Plus Jakarta Sans',
                  color: 'rgba(156,163,175,0.7)',
                  fontWeight: 500
                }}
              >
                MEM
              </span>
              <span 
                className="text-[9px] tabular-nums"
                style={{ 
                  fontFamily: 'JetBrains Mono',
                  color: 'rgba(248,249,250,0.8)',
                  fontWeight: 400
                }}
              >
                {Math.round(data.memoryUsage * 100)}%
              </span>
            </div>
            <div 
              className="h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(37,37,39,0.6)' }}
            >
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${data.memoryUsage * 100}%`,
                  background: `linear-gradient(90deg, rgba(156,136,255,0.8) 0%, rgba(156,136,255,0.4) 100%)`
                }}
              />
            </div>
          </div>
          
          {/* Active Model */}
          {data.activeModel && (
            <div className="pt-1">
              <span 
                className="text-[9px] block truncate"
                style={{ 
                  fontFamily: 'Plus Jakarta Sans',
                  color: 'rgba(248,249,250,0.6)',
                  fontWeight: 400
                }}
              >
                {data.activeModel}
              </span>
            </div>
          )}
          
          {/* Queue indicator */}
          {data.queueLength && data.queueLength > 0 && (
            <div 
              className="absolute bottom-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{ 
                background: colors.primary,
                color: 'rgba(10,10,11,0.9)',
                fontFamily: 'JetBrains Mono'
              }}
            >
              {data.queueLength}
            </div>
          )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right}
        className="!bg-transparent !border-0 !w-1 !h-6"
        style={{
          background: `linear-gradient(270deg, ${colors.primary}80 0%, transparent 100%)`,
          borderRadius: '2px 0 0 2px',
        }}
      />
    </div>
  );
}