import React from 'react';
import { ActivityStream as ActivityStreamType } from '@/types/workflow';

interface ActivityStreamProps {
  activities: ActivityStreamType[];
}

export function ActivityStream({ activities }: ActivityStreamProps) {
  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-full overflow-auto font-mono text-sm">
      <div className="font-bold text-white mb-2">Activity Stream</div>
      <div className="space-y-1">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-gray-500">
              [{new Date(activity.timestamp).toLocaleTimeString()}]
            </span>
            <span className="text-blue-400">{activity.source}:</span>
            <span>{activity.message}</span>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-gray-500">No activity yet...</div>
        )}
      </div>
    </div>
  );
}