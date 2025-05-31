# Multiplex

**A sophisticated drag-and-drop storyboarding interface for orchestrating distributed AI workflows across multi-GPU clusters.**

## Vision

Multiplex democratizes studio-grade AI production for indie creators. What once required entire teams and massive infrastructure can now be orchestrated by a single creative mind with access to distributed GPU resources.

This is more than just another AI tool—it's a proof-of-concept for the future of creative production, where individual creators can compose complex, multi-modal narratives using distributed AI agents working in harmony across a cluster of specialized machines.

## The Problem We're Solving

Traditional AI creative workflows are fragmented. You might use one tool for text, another for images, a third for video generation, and yet another for audio. Each requires its own interface, its own workflow, and its own mental model. Scaling these workflows across multiple GPUs requires deep technical knowledge.

Multiplex changes this by providing a unified canvas where creative intent flows seamlessly between different AI models and modalities, automatically distributed across available GPU resources.

## How It Works

Multiplex introduces five primitive block types that map to the fundamental elements of creative production:

- **Intents** - Creative directives that drive the entire workflow
- **Comps** - Supporting elements like lighting, camera angles, sound design, and mood
- **Gen.Art** - Generated artifacts (images, videos, audio) with real-time progress tracking
- **Narrations** - Text and image combinations that form narrative structure
- **Activity Streams** - Real-time monitoring of your distributed GPU cluster

Connect these blocks on an infinite canvas, and watch as your creative vision gets distributed across a cluster of specialized machines, each contributing their GPU power to bring your story to life.

## Architecture

Built on the Model Context Protocol (MCP), Multiplex coordinates between:

- **Frontend**: React Flow canvas with sophisticated dark theme and real-time updates
- **Coordination Layer**: Digital Ocean MCP server managing workflow distribution
- **Execution Layer**: Multiple machines running LangFlow + ComfyUI combinations
  - 3x Windows 11 machines (A6000 GPUs)
  - 1x Ubuntu 22.04 machine (dual 6000 Ada GPUs)
  - Models: Wan2.1 (video), VACE (editing), Illustrious (anime), Flux.1-dev (text-to-image)

## Hackathon Context

This is a 24-hour proof-of-concept built at Digital Ocean's NYC headquarters, demonstrating how independent creators can leverage distributed AI infrastructure for professional-grade content creation.

The goal isn't just to build another AI tool—it's to validate the foundational patterns that will power the next generation of creative platforms, including the broader starfighter.one vision of RTS-style agent orchestration.

## Getting Started

### Prerequisites

- Node.js 18+ 
- Access to GPU cluster with LangFlow instances
- Digital Ocean account for coordination infrastructure

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the storyboarding canvas.

### Infrastructure Setup

Deploy coordination infrastructure:

```bash
# Set up Digital Ocean resources
chmod +x do-setup.sh
./do-setup.sh

# Configure GPU machines
./gpustacks/setup-windows.ps1  # On Windows machines
./gpustacks/setup-ubuntu.sh    # On Ubuntu machine
```

### Creating Your First Workflow

1. Drag an **Intent** block onto the canvas
2. Connect it to **Comp** blocks to define supporting elements
3. Add **Gen.Art** blocks for artifacts you want to create
4. Use **Narration** blocks to structure your story
5. Monitor execution with **Activity Stream** blocks

## Technology Stack

- **Frontend**: Next.js 14, React Flow, Tailwind CSS
- **Coordination**: Digital Ocean MCP server, WebSocket communication
- **GPU Execution**: LangFlow, ComfyUI, SSH reverse tunnels
- **Typography**: Space Grotesk, Plus Jakarta Sans, JetBrains Mono
- **Theme**: Custom dark theme with complex gradients and brutalist touches

## The Bigger Picture

Multiplex is the first step toward a future where creative production is truly democratized. Where a single creator with a compelling vision can orchestrate the same level of technical sophistication that once required entire studios.

This hackathon prototype validates core assumptions about distributed creative workflows and lays the groundwork for starfighter.one—a platform where creative agents work together in real-time, like units in a real-time strategy game, but for content creation instead of conquest.

## Project Status

This is a 24-hour hackathon prototype. It demonstrates the core concepts but is not production-ready. The focus is on validating the creative workflow patterns and distributed orchestration architecture.

---

*Built with [Claude Code](https://claude.ai/code) during the 24-hour Digital Ocean hackathon.*
