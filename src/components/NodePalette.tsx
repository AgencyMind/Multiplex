import React from 'react';

const nodeTypes = [
  { type: 'intent', label: 'Intent Block', icon: '🎯', color: 'bg-gray-200' },
  { type: 'comp', label: 'Complement', icon: '🔧', color: 'bg-purple-200' },
  { type: 'genArt', label: 'Gen.Art', icon: '🎨', color: 'bg-orange-200' },
];

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-4">Node Types</h3>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className={`${node.color} p-3 rounded cursor-move border-2 border-gray-300 hover:border-gray-400 transition-colors`}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{node.icon}</span>
              <span className="font-medium">{node.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Drag nodes to the canvas
      </div>
    </div>
  );
}