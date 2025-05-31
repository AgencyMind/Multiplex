import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ActivityStreamsData {
  label: string;
  activities: Array<{
    source: string;
    message: string;
    timestamp: number;
  }>;
  overallLoad?: number;
}

export function ActivityStreamsBlock({ data }: NodeProps<ActivityStreamsData>) {
  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Left}
        className="!bg-transparent !border-0 !w-1 !h-6"
        style={{
          background: `linear-gradient(90deg, #64ffda80 0%, transparent 100%)`,
          borderRadius: '0 2px 2px 0',
        }}
      />
      
      <div 
        className="w-[240px] h-[160px] rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.01]"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,22,0.9) 0%, rgba(26,26,28,0.7) 70%, rgba(20,20,22,0.9) 100%)',
          border: `1px solid #64ffda40`,
          boxShadow: `0 0 15px rgba(100,255,218,0.2), 0 4px 20px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header */}
        <div 
          className="h-7 px-3 flex items-center justify-between"
          style={{
            background: `linear-gradient(90deg, rgba(100,255,218,0.2) 0%, transparent 50%, rgba(100,255,218,0.2) 100%)`,
            borderBottom: `1px solid #64ffda20`,
          }}
        >
          <span 
            className="text-[10px] tracking-wider font-medium"
            style={{ 
              fontFamily: 'Space Grotesk',
              color: '#64ffda',
              fontWeight: 500
            }}
          >
            ACTIVITY STREAMS
          </span>
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#64ffda' }}
          />
        </div>
        
        {/* Activity feed */}
        <div className="p-3 space-y-1.5 h-[120px] overflow-hidden">
          {data.activities?.slice(0, 6).map((activity, idx) => (
            <div key={idx} className="text-[9px] flex gap-2" style={{ fontFamily: 'JetBrains Mono' }}>
              <span 
                className="text-[#64ffda] font-medium min-w-[50px] truncate"
                style={{ fontWeight: 500 }}
              >
                {activity.source}:
              </span>
              <span 
                className="text-[#9ca3af] truncate flex-1"
                style={{ fontWeight: 400 }}
              >
                {activity.message}
              </span>
            </div>
          ))}
          
          {/* Load indicator */}
          <div className="mt-3">
            <div 
              className="h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(37,37,39,0.6)' }}
            >
              <div 
                className="h-full transition-all duration-300 animate-pulse"
                style={{ 
                  width: `${(data.overallLoad || 0.7) * 100}%`,
                  background: `linear-gradient(90deg, #64ffda 0%, #00e5ff 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right}
        className="!bg-transparent !border-0 !w-1 !h-6"
        style={{
          background: `linear-gradient(270deg, #64ffda80 0%, transparent 100%)`,
          borderRadius: '2px 0 0 2px',
        }}
      />
    </div>
  );
}