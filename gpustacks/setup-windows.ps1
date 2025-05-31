# LangFlow Setup Script for Windows 11 Workstations
# Usage: .\setup-windows.ps1 -MachineNumber <1,3,4>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet(1,3,4)]
    [int]$MachineNumber
)

Write-Host "Setting up LangFlow on Windows Machine $MachineNumber..." -ForegroundColor Green

# Configuration based on machine number
$config = switch ($MachineNumber) {
    1 { @{
        ProjectName = "I2V-Video-Generation"
        LangFlowPort = 7861
        TunnelPort = 8501
        Description = "I2V Video Generation (3x A6000)"
    }}
    3 { @{
        ProjectName = "Narration-Visualization"
        LangFlowPort = 7863
        TunnelPort = 8503
        Description = "Narration Visualization (1x A6000)"
    }}
    4 { @{
        ProjectName = "DeepSeek-R1-Infrastructure"
        LangFlowPort = 7864
        TunnelPort = 8504
        Description = "DeepSeek R1 Infrastructure (2x 6000 Ada)"
    }}
}

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python 3\.(1[0-9]|[2-9][0-9])") {
        Write-Host "Python is installed: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "Python 3.10+ is required. Please install from python.org" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Python is not installed or not in PATH. Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Create LangFlow directory
$langflowDir = "$env:USERPROFILE\.langflow"
if (!(Test-Path $langflowDir)) {
    New-Item -ItemType Directory -Path $langflowDir | Out-Null
}

# Install LangFlow
Write-Host "Installing LangFlow..." -ForegroundColor Yellow
python -m pip install --upgrade pip
python -m pip install langflow

# Create environment configuration
$envContent = @"
# LangFlow Configuration for Machine $MachineNumber
LANGFLOW_HOST=0.0.0.0
LANGFLOW_PORT=$($config.LangFlowPort)
LANGFLOW_DATABASE_URL=sqlite:///$langflowDir\langflow-$MachineNumber.db
LANGFLOW_CONFIG_DIR=$langflowDir
LANGFLOW_BACKEND_ONLY=false
LANGFLOW_MAX_FILE_SIZE_MB=100
LANGFLOW_PROJECT_NAME=$($config.ProjectName)

# Enable MCP Server
LANGFLOW_ENABLE_MCP=true

# ComfyUI Integration (update path as needed)
COMFYUI_PATH=C:\ComfyUI
"@

Set-Content -Path "$langflowDir\.env" -Value $envContent

# Create batch file to start LangFlow
$startScript = @"
@echo off
title LangFlow - Machine $MachineNumber
cd /d "$langflowDir"
python -m langflow run
pause
"@

Set-Content -Path "$langflowDir\start-langflow.bat" -Value $startScript

# Create SSH config for tunnel
$sshDir = "$env:USERPROFILE\.ssh"
if (!(Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir | Out-Null
}

$sshConfig = @"
# SSH Tunnel Configuration for Machine $MachineNumber
# Maps local LangFlow port to remote coordination server

Host multiplex-tunnel
    HostName YOUR_DO_SERVER_IP
    User tunnel
    Port 22
    IdentityFile $sshDir\multiplex-tunnel-key
    ServerAliveInterval 60
    ServerAliveCountMax 3
    # Forward LangFlow MCP endpoint
    RemoteForward $($config.TunnelPort) localhost:$($config.LangFlowPort)
"@

Set-Content -Path "$sshDir\langflow-tunnel-$MachineNumber.conf" -Value $sshConfig

# Create PowerShell script for SSH tunnel
$tunnelScript = @"
# SSH Tunnel for LangFlow Machine $MachineNumber
Write-Host "Starting SSH tunnel for LangFlow..." -ForegroundColor Green
ssh -N -F "$sshDir\langflow-tunnel-$MachineNumber.conf" multiplex-tunnel
"@

Set-Content -Path "$langflowDir\start-tunnel.ps1" -Value $tunnelScript

# Create Windows Task Scheduler tasks
Write-Host "Creating scheduled tasks..." -ForegroundColor Yellow

# Task for LangFlow
$langflowAction = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$langflowDir\start-langflow.bat`""
$langflowTrigger = New-ScheduledTaskTrigger -AtStartup
$langflowSettings = New-ScheduledTaskSettingsSet -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName "LangFlow-Machine-$MachineNumber" -Action $langflowAction -Trigger $langflowTrigger -Settings $langflowSettings -Description "$($config.Description)" -Force

Write-Host @"

=== Setup Complete! ===

Next steps:

1. Generate SSH key for tunneling (if not already done):
   ssh-keygen -t ed25519 -f "$sshDir\multiplex-tunnel-key"

2. Update DO server IP in: $sshDir\langflow-tunnel-$MachineNumber.conf

3. Add the public key to your DO server's tunnel user

4. Start LangFlow:
   - Run: $langflowDir\start-langflow.bat
   - Or use Task Scheduler (will auto-start on boot)

5. After LangFlow starts, access it at:
   http://localhost:$($config.LangFlowPort)
   
6. Start SSH tunnel (after configuring key):
   powershell -ExecutionPolicy Bypass -File "$langflowDir\start-tunnel.ps1"

7. MCP endpoint will be available at:
   http://localhost:$($config.LangFlowPort)/api/v1/mcp/sse

"@ -ForegroundColor Cyan