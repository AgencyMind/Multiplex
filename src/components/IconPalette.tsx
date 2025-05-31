import React from 'react';

const nodeTypes = [
  { type: 'storyboard', symbol: '◢', tooltip: 'Storyboard', color: '#9c88ff' },
  { type: 'keyframe', symbol: '◦', tooltip: 'Keyframe', color: '#64ffda' },
  { type: 'semantic', symbol: '◈', tooltip: 'Semantic', color: '#00e5ff' },
  { type: 'resource', symbol: '◼', tooltip: 'Resource', color: '#ffc947' },
];

export function IconPalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full py-6 flex flex-col items-center gap-4">
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className="relative group"
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
        >
          <div 
            className="w-10 h-10 flex items-center justify-center cursor-move
                     transition-all duration-300 hover:scale-110"
            style={{ 
              background: `linear-gradient(135deg, rgba(20,20,22,0.9) 0%, rgba(26,26,28,0.7) 100%)`,
              border: `1px solid ${node.color}40`,
              borderRadius: '6px',
              boxShadow: `0 0 10px ${node.color}20, 0 2px 8px rgba(0,0,0,0.4)`,
            }}
          >
            <span 
              className="text-sm select-none transition-all duration-300 group-hover:scale-110"
              style={{ 
                color: node.color,
                fontFamily: 'Space Grotesk',
                fontWeight: 500
              }}
            >
              {node.symbol}
            </span>
          </div>
          
          {/* Tooltip */}
          <div 
            className="absolute left-full ml-3 px-2 py-1 rounded text-xs whitespace-nowrap 
                     opacity-0 group-hover:opacity-100 transition-all duration-200 z-10
                     pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(20,20,22,0.95) 0%, rgba(26,26,28,0.95) 100%)',
              border: '1px solid rgba(37,37,39,0.8)',
              color: 'rgba(156,163,175,0.9)',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 400,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {node.tooltip}
          </div>
        </div>
      ))}
    </div>
  );
}