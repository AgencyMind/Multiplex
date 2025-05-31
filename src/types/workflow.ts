export interface Intent {
  id: string;
  description: string;
  position: { x: number; y: number };
  status: 'pending' | 'processing' | 'completed' | 'error';
  comps: Comp[];
  genArt: GenArt[];
}

export interface Comp {
  id: string;
  type: string;
  content: string;
  parentIntent: string;
}

export interface GenArt {
  id: string;
  type: 'image' | 'video' | 'narration';
  url: string;
  sourceIntent: string;
  timestamp: number;
}

export interface ActivityStream {
  timestamp: number;
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

export type NodeData = {
  label: string;
  type: 'intent' | 'comp' | 'genArt' | 'activity' | 'narration' | 'visual-narration';
  status?: Intent['status'];
  content?: string;
  url?: string;
  artifactType?: GenArt['type'];
  subType?: string;
  activities?: ActivityStream[];
  imageUrl?: string;
  prompt?: string;
};