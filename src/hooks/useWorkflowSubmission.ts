import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

// PSEUDOCODE: Workflow Submission Hook

/*
interface WorkflowSubmission {
  nodes: Node[];
  edges: Edge[];
  metadata: {
    name?: string;
    description?: string;
    priority?: 'low' | 'normal' | 'high';
  };
}

interface SubmissionState {
  submitting: boolean;
  error: Error | null;
  workflowId: string | null;
  progress: number;
  status: 'idle' | 'validating' | 'submitting' | 'queued' | 'processing' | 'completed' | 'failed';
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  resourceRequirements: {
    estimatedTime: number;
    requiredGPUs: number;
    requiredVRAM: number;
    requiredModels: string[];
  };
}

export function useWorkflowSubmission() {
  const [state, setState] = useState<SubmissionState>({
    submitting: false,
    error: null,
    workflowId: null,
    progress: 0,
    status: 'idle'
  });
  
  // Validate workflow before submission
  const validateWorkflow = useCallback(async (
    nodes: Node[], 
    edges: Edge[]
  ): Promise<ValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for empty workflow
    if (nodes.length === 0) {
      errors.push('Workflow must contain at least one node');
    }
    
    // Check for disconnected nodes
    const connectedNodes = new Set<string>();
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });
    
    nodes.forEach(node => {
      if (!connectedNodes.has(node.id) && nodes.length > 1) {
        warnings.push(`Node "${node.data.label || node.id}" is not connected`);
      }
    });
    
    // Check for circular dependencies
    if (hasCircularDependency(nodes, edges)) {
      errors.push('Workflow contains circular dependencies');
    }
    
    // Validate node types and data
    for (const node of nodes) {
      switch (node.type) {
        case 'intent':
          if (!node.data.description || node.data.description.trim() === '') {
            errors.push(`Intent node "${node.data.label}" requires a description`);
          }
          break;
          
        case 'genart':
          if (!node.data.type) {
            errors.push(`Gen.Art node "${node.data.label}" requires a type (image/video/audio)`);
          }
          
          // Video generation requires image input
          if (node.data.type === 'video') {
            const hasImageInput = edges.some(edge => 
              edge.target === node.id && 
              nodes.find(n => n.id === edge.source)?.type === 'genart' &&
              nodes.find(n => n.id === edge.source)?.data.type === 'image'
            );
            
            if (!hasImageInput) {
              errors.push(`Video generation node "${node.data.label}" requires an image input`);
            }
          }
          break;
          
        case 'comp':
          if (!node.data.compType) {
            warnings.push(`Complement node "${node.data.label}" has no type specified`);
          }
          break;
      }
    }
    
    // Calculate resource requirements
    const resourceRequirements = calculateResourceRequirements(nodes, edges);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      resourceRequirements
    };
  }, []);
  
  // Submit workflow to coordination server
  const submitWorkflow = useCallback(async (submission: WorkflowSubmission) => {
    setState(prev => ({
      ...prev,
      submitting: true,
      error: null,
      status: 'validating'
    }));
    
    try {
      // Validate workflow
      const validation = await validateWorkflow(submission.nodes, submission.edges);
      
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      setState(prev => ({ ...prev, status: 'submitting' }));
      
      // Submit to coordination server
      const response = await fetch('http://localhost:3001/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submission,
          validation
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }
      
      const result = await response.json();
      
      setState(prev => ({
        ...prev,
        workflowId: result.workflowId,
        status: 'queued',
        submitting: false
      }));
      
      // Start polling for progress
      pollWorkflowProgress(result.workflowId);
      
      return result.workflowId;
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        submitting: false,
        error: error as Error,
        status: 'failed'
      }));
      throw error;
    }
  }, [validateWorkflow]);
  
  // Poll for workflow progress
  const pollWorkflowProgress = useCallback(async (workflowId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/workflows/${workflowId}/status`);
        const status = await response.json();
        
        setState(prev => ({
          ...prev,
          progress: status.progress || 0,
          status: status.status
        }));
        
        // Stop polling when completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval);
        }
        
      } catch (error) {
        console.error('Failed to poll workflow status:', error);
      }
    }, 1000); // Poll every second
    
    // Clean up on unmount
    return () => clearInterval(pollInterval);
  }, []);
  
  // Cancel workflow
  const cancelWorkflow = useCallback(async (workflowId: string) => {
    try {
      await fetch(`http://localhost:3001/api/workflows/${workflowId}/cancel`, {
        method: 'POST'
      });
      
      setState(prev => ({
        ...prev,
        status: 'idle',
        workflowId: null
      }));
      
    } catch (error) {
      console.error('Failed to cancel workflow:', error);
    }
  }, []);
  
  // Reset state
  const reset = useCallback(() => {
    setState({
      submitting: false,
      error: null,
      workflowId: null,
      progress: 0,
      status: 'idle'
    });
  }, []);
  
  return {
    // State
    ...state,
    
    // Methods
    validateWorkflow,
    submitWorkflow,
    cancelWorkflow,
    reset
  };
}

// Helper functions
function hasCircularDependency(nodes: Node[], edges: Edge[]): boolean {
  // Build adjacency list
  const graph = new Map<string, string[]>();
  edges.forEach(edge => {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    graph.get(edge.source)!.push(edge.target);
  });
  
  // DFS to detect cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) return true;
    }
  }
  
  return false;
}

function calculateResourceRequirements(nodes: Node[], edges: Edge[]): any {
  let estimatedTime = 0;
  let requiredVRAM = 0;
  const requiredModels = new Set<string>();
  
  // Calculate based on node types
  nodes.forEach(node => {
    switch (node.type) {
      case 'genart':
        if (node.data.type === 'image') {
          estimatedTime += 30; // 30 seconds per image
          requiredVRAM = Math.max(requiredVRAM, 12); // 12GB for Flux
          requiredModels.add('flux-1.1-dev');
        } else if (node.data.type === 'video') {
          estimatedTime += 120; // 2 minutes per video
          requiredVRAM = Math.max(requiredVRAM, 24); // 24GB for Wan2.1
          requiredModels.add('wan2.1-i2v');
        }
        break;
        
      case 'narration':
        estimatedTime += 10; // 10 seconds for narration
        requiredVRAM = Math.max(requiredVRAM, 8); // 8GB for DeepSeek
        requiredModels.add('deepseek-r1-7b');
        break;
    }
  });
  
  // Account for parallelization
  const parallelizationFactor = 0.6; // Assume 40% speedup from parallel execution
  estimatedTime *= parallelizationFactor;
  
  return {
    estimatedTime: Math.ceil(estimatedTime),
    requiredGPUs: Math.ceil(requiredVRAM / 48), // Assuming 48GB GPUs
    requiredVRAM,
    requiredModels: Array.from(requiredModels)
  };
}
*/

// Placeholder implementation
export function useWorkflowSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const submitWorkflow = useCallback(async (submission: any) => {
    console.log('Submit workflow (stub):', submission);
    setSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitting(false);
    return 'stub-workflow-id';
  }, []);
  
  return {
    submitting,
    error,
    workflowId: null,
    progress: 0,
    status: 'idle' as const,
    validateWorkflow: async (nodes: any[], edges: any[]) => ({
      valid: true,
      errors: [],
      warnings: [],
      resourceRequirements: {
        estimatedTime: 120,
        requiredGPUs: 2,
        requiredVRAM: 48,
        requiredModels: ['flux-1.1-dev', 'wan2.1-i2v']
      }
    }),
    submitWorkflow,
    cancelWorkflow: async (workflowId: string) => {
      console.log('Cancel workflow (stub):', workflowId);
    },
    reset: () => {
      setError(null);
    }
  };
}