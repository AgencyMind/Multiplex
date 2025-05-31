import React from 'react';

const nodeTypes = [
  { type: 'intent', icon: '🎯', tooltip: 'Intent Block', color: '#00e5ff' },
  { type: 'comp-logic', icon: '⚡', tooltip: 'Logic Complement', color: '#ffc947' },
  { type: 'comp-data', icon: '📊', tooltip: 'Data Complement', color: '#ffc947' },
  { type: 'comp-transform', icon: '🔄', tooltip: 'Transform Complement', color: '#ffc947' },
  { type: 'genart-image', icon: '🖼️', tooltip: 'Generated Image', color: '#ff5722' },
  { type: 'genart-video', icon: '🎬', tooltip: 'Generated Video', color: '#ff5722' },
  { type: 'genart-audio', icon: '🎵', tooltip: 'Generated Audio', color: '#ff5722' },
  { type: 'activity', icon: '📡', tooltip: 'Activity Stream', color: '#64ffda' },
  { type: 'narration', icon: '💭', tooltip: 'Narration', color: '#9c88ff' },
  { type: 'visual-narration', icon: '🎨', tooltip: 'Visual Narration', color: '#9c88ff' },
];

export function IconPalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full py-4 flex flex-col items-center gap-3">
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className="relative group"
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
        >
          <div 
            className="w-9 h-9 flex items-center justify-center rounded cursor-move
                     text-[#6b7280] hover:text-[#f8f9fa] transition-all duration-200
                     hover:bg-[#1a1a1c] group-hover:shadow-lg"
            style={{ 
              '--hover-color': node.color 
            } as React.CSSProperties}
          >
            <span className="text-lg select-none group-hover:scale-110 transition-transform">
              {node.icon}
            </span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1c] border border-[#252527] 
                        rounded text-xs text-[#9ca3af] whitespace-nowrap opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200 z-10
                        pointer-events-none">
            {node.tooltip}
          </div>
        </div>
      ))}
    </div>
  );
}