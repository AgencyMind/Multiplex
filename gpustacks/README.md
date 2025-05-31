# GPU Stack Setup for Creative Production Cluster

This directory contains setup instructions for the high-end creative production workstations.

## Cluster Configuration

- **Machine 1**: Windows 11 - I2V Video Generation (3x A6000)
- **Machine 2**: Ubuntu 22.04 - Image Generation (1x A6000)
- **Machine 3**: Windows 11 - Narration Visualization (1x A6000)
- **Machine 4**: Windows 11 - DeepSeek R1 Infrastructure (2x 6000 Ada)

## Architecture Overview

Each workstation runs:
1. **ComfyUI** - Native installation for GPU-accelerated workflows
2. **LangFlow** - Python-based, runs on all platforms
3. **SSH Client** - For reverse tunnels (OpenSSH on Windows, native on Ubuntu)

## Setup Instructions

### Windows 11 Machines (1, 3, 4)

1. **Install Python 3.11+**
   - Download from python.org
   - Check "Add Python to PATH" during installation

2. **Install LangFlow**
   ```powershell
   # Open PowerShell as Administrator
   python -m pip install --upgrade pip
   python -m pip install langflow
   ```

3. **Install OpenSSH Client** (if not already installed)
   - Settings → Apps → Optional Features → Add Feature → OpenSSH Client

4. **Setup Scripts**
   - Use `setup-windows.ps1` for automated setup
   - Or follow `windows-manual-setup.md` for step-by-step

### Ubuntu 22.04 Machine (2)

1. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install python3.11 python3.11-venv python3-pip
   ```

2. **Install LangFlow**
   ```bash
   python3.11 -m venv ~/langflow-venv
   source ~/langflow-venv/bin/activate
   pip install langflow
   ```

3. **Setup Script**
   - Use `setup-ubuntu.sh` for automated setup

## Network Architecture

```
Windows Workstations (1,3,4) ─┐
                              ├─── SSH Reverse Tunnels ──→ DO Coordination Server
Ubuntu Workstation (2) ───────┘
```

## Port Assignments

| Machine | OS | LangFlow Port | Tunnel Port | Purpose |
|---------|-----|--------------|-------------|---------|
| 1 | Win11 | 7861 | 8501 | I2V Video |
| 2 | Win11 | 7862 | 8502 | Image Gen |
| 3 | Win11 | 7863 | 8503 | Narration |
| 4 | Ubuntu | 7864 | 8504 | DeepSeek |

## ComfyUI Integration

Since these are creative production workstations, ComfyUI is likely already installed and configured. LangFlow will integrate with existing ComfyUI installations through:

1. **API Integration** - LangFlow calls ComfyUI API endpoints
2. **Shared Storage** - Output files accessible to both systems
3. **GPU Allocation** - Managed at OS level to prevent conflicts