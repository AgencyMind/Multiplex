# GPU Node Setup

This directory contains setup scripts and configurations for each GPU machine in the cluster.

## Architecture

Each GPU machine runs:
1. ComfyUI - The underlying workflow engine
2. LangFlow - Wraps ComfyUI workflows and exposes them via MCP
3. MCP Server - Allows the coordination server to invoke workflows
4. SSH Tunnel - Reverse tunnel to expose MCP port to DO server

## Machine Configurations

- **Machine 1**: I2V Video Generation (3x A6000)
- **Machine 2**: Image Generation (1x A6000) 
- **Machine 3**: Narration Visualization (1x A6000)
- **Machine 4**: DeepSeek R1 Infrastructure (2x 6000 Ada)

## Setup Instructions

1. Run the setup script on each machine:
   ```bash
   ./setup-node.sh <machine-number>
   ```

2. The script will:
   - Install LangFlow
   - Configure MCP server
   - Set up the reverse SSH tunnel
   - Configure systemd services for auto-start