'use client';

import React from 'react';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { IconPalette } from '@/components/IconPalette';

export default function Home() {
  return (
    <div className="h-screen flex bg-[#0a0a0b]">
      {/* Icon Palette - 60px width */}
      <aside className="w-[60px] bg-[#0a0a0b] border-r border-[#252527] flex-shrink-0">
        <IconPalette />
      </aside>
      
      {/* Full-width Canvas */}
      <main className="flex-1 bg-[#0d0d0d]">
        <WorkflowCanvas />
      </main>
    </div>
  );
}