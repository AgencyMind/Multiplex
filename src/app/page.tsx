'use client';

import React, { useState, useCallback } from 'react';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { NodePalette } from '@/components/NodePalette';
import { ActivityStream } from '@/components/ActivityStream';
import { ActivityStream as ActivityStreamType } from '@/types/workflow';

export default function Home() {
  const [activities, setActivities] = useState<ActivityStreamType[]>([]);

  const addActivity = useCallback((source: string, message: string, metadata?: any) => {
    setActivities(prev => [...prev, {
      timestamp: Date.now(),
      source,
      message,
      metadata
    }]);
  }, []);

  const handleNodeAdd = useCallback((type: string, position: { x: number; y: number }) => {
    addActivity('Canvas', `Added new ${type} node at position ${Math.round(position.x)}, ${Math.round(position.y)}`);
  }, [addActivity]);

  const handleNodeUpdate = useCallback((nodeId: string, data: any) => {
    addActivity('Canvas', `Updated node ${nodeId}`, data);
  }, [addActivity]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Multiplex</h1>
          <p className="text-sm text-gray-600">Distributed AI Workflow Orchestrator</p>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r p-4 overflow-y-auto">
          <NodePalette />
        </aside>
        
        <main className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-100">
            <WorkflowCanvas 
              onNodeAdd={handleNodeAdd}
              onNodeUpdate={handleNodeUpdate}
            />
          </div>
          
          <div className="h-48 border-t bg-white overflow-hidden">
            <ActivityStream activities={activities} />
          </div>
        </main>
      </div>
    </div>
  );
}