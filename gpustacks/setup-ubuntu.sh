#!/bin/bash

# LangFlow Setup Script for Ubuntu 22.04 Workstation
# Machine 2: Image Generation (1x A6000)

set -e

MACHINE_NUM=2
PROJECT_NAME="Image-Generation"
LANGFLOW_PORT=7862
TUNNEL_PORT=8502

echo "Setting up LangFlow on Ubuntu Machine $MACHINE_NUM..."

# Check Python version
echo "Checking Python installation..."
if ! python3 --version | grep -E "3\.(1[0-9]|[2-9][0-9])" > /dev/null; then
    echo "Installing Python 3.11..."
    sudo apt-get update
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository -y ppa:deadsnakes/ppa
    sudo apt-get update
    sudo apt-get install -y python3.11 python3.11-venv python3.11-dev
fi

# Create virtual environment
echo "Creating virtual environment..."
python3.11 -m venv ~/langflow-venv
source ~/langflow-venv/bin/activate

# Install LangFlow
echo "Installing LangFlow..."
pip install --upgrade pip
pip install langflow

# Create LangFlow directory and configuration
mkdir -p ~/.langflow

cat > ~/.langflow/.env << EOF
# LangFlow Configuration for Machine $MACHINE_NUM
LANGFLOW_HOST=0.0.0.0
LANGFLOW_PORT=$LANGFLOW_PORT
LANGFLOW_DATABASE_URL=sqlite:///home/$USER/.langflow/langflow-$MACHINE_NUM.db
LANGFLOW_CONFIG_DIR=/home/$USER/.langflow
LANGFLOW_BACKEND_ONLY=false
LANGFLOW_MAX_FILE_SIZE_MB=100
LANGFLOW_PROJECT_NAME=$PROJECT_NAME

# Enable MCP Server
LANGFLOW_ENABLE_MCP=true

# ComfyUI Integration (update path as needed)
COMFYUI_PATH=/home/$USER/ComfyUI
EOF

# Create systemd service for LangFlow
echo "Creating systemd service..."
sudo tee /etc/systemd/system/langflow.service > /dev/null << EOF
[Unit]
Description=LangFlow Server - Image Generation
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/.langflow
Environment="PATH=/home/$USER/langflow-venv/bin:/usr/local/bin:/usr/bin:/bin"
EnvironmentFile=/home/$USER/.langflow/.env
ExecStart=/home/$USER/langflow-venv/bin/langflow run
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create SSH tunnel configuration
mkdir -p ~/.ssh
cat > ~/.ssh/langflow-tunnel-$MACHINE_NUM.conf << EOF
# SSH Tunnel Configuration for Machine $MACHINE_NUM
# Maps local LangFlow port to remote coordination server

Host multiplex-tunnel
    HostName YOUR_DO_SERVER_IP
    User tunnel
    Port 22
    IdentityFile ~/.ssh/multiplex-tunnel-key
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ExitOnForwardFailure yes
    # Forward LangFlow MCP endpoint
    RemoteForward $TUNNEL_PORT localhost:$LANGFLOW_PORT
EOF

# Create SSH tunnel service
echo "Creating SSH tunnel service..."
sudo tee /etc/systemd/system/langflow-tunnel.service > /dev/null << EOF
[Unit]
Description=LangFlow SSH Tunnel - Image Generation
After=network.target langflow.service
Wants=langflow.service

[Service]
Type=simple
User=$USER
ExecStart=/usr/bin/ssh -N -F /home/$USER/.ssh/langflow-tunnel-$MACHINE_NUM.conf multiplex-tunnel
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
EOF

# Create start/stop scripts
cat > ~/start-langflow.sh << 'EOF'
#!/bin/bash
sudo systemctl start langflow
echo "LangFlow started. Checking status..."
sleep 3
sudo systemctl status langflow --no-pager
echo ""
echo "Access LangFlow at: http://localhost:7862"
EOF

cat > ~/start-tunnel.sh << 'EOF'
#!/bin/bash
if [ ! -f ~/.ssh/multiplex-tunnel-key ]; then
    echo "SSH key not found. Please generate it first:"
    echo "ssh-keygen -t ed25519 -f ~/.ssh/multiplex-tunnel-key"
    exit 1
fi
sudo systemctl start langflow-tunnel
echo "SSH tunnel started. Checking status..."
sleep 2
sudo systemctl status langflow-tunnel --no-pager
EOF

chmod +x ~/start-langflow.sh ~/start-tunnel.sh

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo ""
echo "1. Generate SSH key for tunneling (if not already done):"
echo "   ssh-keygen -t ed25519 -f ~/.ssh/multiplex-tunnel-key"
echo ""
echo "2. Update DO server IP in: ~/.ssh/langflow-tunnel-$MACHINE_NUM.conf"
echo ""
echo "3. Add the public key to your DO server's tunnel user:"
echo "   cat ~/.ssh/multiplex-tunnel-key.pub"
echo ""
echo "4. Reload systemd and start services:"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable langflow"
echo "   ./start-langflow.sh"
echo ""
echo "5. After configuring SSH key:"
echo "   sudo systemctl enable langflow-tunnel"
echo "   ./start-tunnel.sh"
echo ""
echo "6. Access LangFlow at: http://localhost:$LANGFLOW_PORT"
echo "   MCP endpoint: http://localhost:$LANGFLOW_PORT/api/v1/mcp/sse"
echo ""
echo "7. Check logs if needed:"
echo "   journalctl -u langflow -f"
echo "   journalctl -u langflow-tunnel -f"