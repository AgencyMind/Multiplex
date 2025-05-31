# Multiplex

A drag-and-drop storyboarding interface for orchestrating AI workflows across multi-GPU clusters.

## What It Does

Multiplex provides a unified canvas for composing visual narratives that automatically distribute AI generation tasks across available GPU resources. Instead of juggling multiple AI tools and interfaces, creators arrange story elements on a single canvas and let the system coordinate the technical execution.

## Architecture

- **Frontend**: Next.js with React Flow canvas hosted on Digital Ocean via Coolify
- **Infrastructure Management**: DigitalOcean MCP server for managing deployment infrastructure  
- **GPU Execution**: Each machine runs LangFlow with its own MCP server exposing ComfyUI workflows as tools
- **Hardware Setup**: 4 machines with 7 total GPUs
  - Machine 1 (Windows): 3x A6000 - I2V video generation (Wan2.1)
  - Machine 2 (Windows): 1x A6000 - Image generation (Flux/Illustrious)  
  - Machine 3 (Ubuntu): 1x A6000 - Narration visualization
  - Machine 4 (Windows): 2x 6000 Ada - DeepSeek R1 infrastructure narrator

## Core Components

- **Intents** - Basic narrative units ("character enters room", "close-up reaction")
- **Comps** - Supporting elements like references, notes, and generation directives
- **Gen.Art** - AI-generated artifacts that appear as processing completes
- **Narrations** - Real-time commentary on cluster activity from DeepSeek R1
- **Activity Streams** - Live monitoring of GPU utilization and workflow status

## Data Flow

1. User arranges intent blocks and comps on canvas
2. User triggers processing when ready
3. Frontend communicates with local LangFlow MCP servers
4. LangFlow instances execute ComfyUI workflows on assigned GPUs
5. Generated content flows back and appears as gen.art blocks
6. DeepSeek R1 provides real-time narration of cluster activity

---

*Vibe coded at the Hacking Agents hackathon with Claude Code.*
