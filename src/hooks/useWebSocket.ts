import { useEffect, useRef, useState, useCallback } from 'react';

// PSEUDOCODE: WebSocket Hook for Real-time Communication

/*
interface WebSocketMessage {
  type: string;
  payload?: any;
  timestamp: number;
}

interface ActivityUpdate {
  streamId: string;
  nodeId?: string;
  type: 'gpu_status' | 'workflow_progress' | 'narration' | 'error' | 'network';
  data: any;
  timestamp: number;
}

interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: Error | null;
  lastMessage: WebSocketMessage | null;
  activityStream: ActivityUpdate[];
}

export function useWebSocket(url: string = 'ws://localhost:3001') {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    lastMessage: null,
    activityStream: []
  });
  
  // Message handlers
  const messageHandlers = useRef<Map<string, (payload: any) => void>>(new Map());
  
  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;
    
    setState(prev => ({ ...prev, connecting: true, error: null }));
    
    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({ 
          ...prev, 
          connected: true, 
          connecting: false 
        }));
        
        // Subscribe to activity streams
        sendMessage('SUBSCRIBE_ACTIVITY', {
          streams: ['gpu_status', 'workflow_progress', 'narration']
        });
      };
      
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          setState(prev => ({ ...prev, lastMessage: message }));
          
          // Handle activity updates
          if (message.type === 'ACTIVITY_UPDATE') {
            setState(prev => ({
              ...prev,
              activityStream: [
                ...prev.activityStream,
                message.payload as ActivityUpdate
              ].slice(-100) // Keep last 100 updates
            }));
          }
          
          // Call registered handlers
          const handler = messageHandlers.current.get(message.type);
          if (handler) {
            handler(message.payload);
          }
          
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          error: new Error('WebSocket connection error') 
        }));
      };
      
      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setState(prev => ({ 
          ...prev, 
          connected: false, 
          connecting: false 
        }));
        
        // Attempt reconnection after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, 3000);
      };
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        connecting: false, 
        error: error as Error 
      }));
    }
  }, [url]);
  
  // Send message to server
  const sendMessage = useCallback((type: string, payload?: any) => {
    if (ws.current?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, queuing message:', type);
      return;
    }
    
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now()
    };
    
    ws.current.send(JSON.stringify(message));
  }, []);
  
  // Register message handler
  const onMessage = useCallback((type: string, handler: (payload: any) => void) => {
    messageHandlers.current.set(type, handler);
    
    // Return cleanup function
    return () => {
      messageHandlers.current.delete(type);
    };
  }, []);
  
  // Submit workflow
  const submitWorkflow = useCallback((workflow: any) => {
    sendMessage('SUBMIT_WORKFLOW', workflow);
    
    return new Promise((resolve, reject) => {
      const cleanup = onMessage('WORKFLOW_ACCEPTED', (payload) => {
        cleanup();
        resolve(payload.workflowId);
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        cleanup();
        reject(new Error('Workflow submission timeout'));
      }, 10000);
    });
  }, [sendMessage, onMessage]);
  
  // Execute intent
  const executeIntent = useCallback((intentId: string, params: any) => {
    sendMessage('EXECUTE_INTENT', { intentId, params });
  }, [sendMessage]);
  
  // Get activity for specific node
  const getNodeActivity = useCallback((nodeId: string) => {
    return state.activityStream.filter(a => a.nodeId === nodeId);
  }, [state.activityStream]);
  
  // Get latest GPU status
  const getGPUStatus = useCallback(() => {
    const gpuUpdates = state.activityStream
      .filter(a => a.type === 'gpu_status')
      .reduce((acc, update) => {
        acc[update.nodeId || 'unknown'] = update.data;
        return acc;
      }, {} as Record<string, any>);
      
    return gpuUpdates;
  }, [state.activityStream]);
  
  // Get workflow progress
  const getWorkflowProgress = useCallback((workflowId: string) => {
    return state.activityStream
      .filter(a => 
        a.type === 'workflow_progress' && 
        a.data.workflowId === workflowId
      )
      .sort((a, b) => b.timestamp - a.timestamp)[0]?.data;
  }, [state.activityStream]);
  
  // Effect to establish connection
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);
  
  return {
    // Connection state
    connected: state.connected,
    connecting: state.connecting,
    error: state.error,
    
    // Methods
    sendMessage,
    onMessage,
    submitWorkflow,
    executeIntent,
    
    // Activity data
    activityStream: state.activityStream,
    getNodeActivity,
    getGPUStatus,
    getWorkflowProgress,
    
    // Raw WebSocket reference (if needed)
    ws: ws.current
  };
}

// Example usage in a component:
/*
function WorkflowCanvas() {
  const {
    connected,
    submitWorkflow,
    activityStream,
    getGPUStatus,
    onMessage
  } = useWebSocket();
  
  // Handle workflow submission
  const handleSubmit = async (nodes, edges) => {
    try {
      const workflowId = await submitWorkflow({ nodes, edges });
      console.log('Workflow submitted:', workflowId);
    } catch (error) {
      console.error('Failed to submit workflow:', error);
    }
  };
  
  // Listen for specific messages
  useEffect(() => {
    return onMessage('GENERATION_COMPLETE', (payload) => {
      // Update UI with generated content
      console.log('Generation complete:', payload);
    });
  }, [onMessage]);
  
  // Display GPU status
  const gpuStatus = getGPUStatus();
  
  return (
    <div>
      {connected ? 'Connected' : 'Disconnected'}
      {Object.entries(gpuStatus).map(([nodeId, status]) => (
        <GPUStatusIndicator key={nodeId} status={status} />
      ))}
    </div>
  );
}
*/


// Placeholder implementation
export function useWebSocket(url: string = 'ws://localhost:3001') {
  const [connected, setConnected] = useState(false);
  const [activityStream, setActivityStream] = useState<any[]>([]);
  
  return {
    connected,
    connecting: false,
    error: null,
    sendMessage: (type: string, payload?: any) => {
      console.log('WebSocket message (stub):', type, payload);
    },
    onMessage: (type: string, handler: (payload: any) => void) => {
      return () => {};
    },
    submitWorkflow: async (workflow: any) => {
      console.log('Submit workflow (stub):', workflow);
      return 'stub-workflow-id';
    },
    executeIntent: (intentId: string, params: any) => {
      console.log('Execute intent (stub):', intentId, params);
    },
    activityStream,
    getNodeActivity: (nodeId: string) => [],
    getGPUStatus: () => ({}),
    getWorkflowProgress: (workflowId: string) => null,
    ws: null
  };
}