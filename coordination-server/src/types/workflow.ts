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

export interface WorkflowSubmission {
  id: string;
  intents: Intent[];
  edges: Array<{ source: string; target: string }>;
  submittedAt: number;
}

export interface MachineCapability {
  id: string;
  name: string;
  endpoint: string;
  capabilities: string[];
  gpus: string;
  status: 'online' | 'offline' | 'busy';
}

export interface WebSocketMessage {
  type: 'workflow.submit' | 'workflow.status' | 'activity.stream' | 'machine.status';
  payload: any;
  timestamp: number;
}