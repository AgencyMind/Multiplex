#!/bin/bash

# Digital Ocean MCP Setup for Multiplex
# Sets up droplet and resources using DO MCP integration

set -e

echo "🌊 Setting up Digital Ocean infrastructure for Multiplex..."

# Check if doctl is authenticated
if ! ./doctl auth list | grep -q "current"; then
    echo "❌ doctl not authenticated. Please run:"
    echo "   ./doctl auth init"
    echo "   Then provide your DO API token"
    exit 1
fi

# Create dedicated VPC for multiplex
echo "📡 Creating multiplex VPC..."
VPC_ID=$(./doctl vpcs create \
    --name "multiplex-vpc" \
    --description "VPC for Multiplex AI orchestration" \
    --region "nyc3" \
    --ip-range "10.10.0.0/16" \
    --format ID --no-header)

echo "✅ VPC created: $VPC_ID"

# Create firewall rules
echo "🔥 Creating firewall rules..."
FIREWALL_ID=$(./doctl compute firewall create \
    --name "multiplex-coordination-fw" \
    --inbound-rules "protocol:tcp,ports:22,sources:0.0.0.0/0 protocol:tcp,ports:80,sources:0.0.0.0/0 protocol:tcp,ports:443,sources:0.0.0.0/0 protocol:tcp,ports:8080,sources:0.0.0.0/0" \
    --outbound-rules "protocol:tcp,ports:0,destinations:0.0.0.0/0 protocol:udp,ports:0,destinations:0.0.0.0/0" \
    --format ID --no-header)

echo "✅ Firewall created: $FIREWALL_ID"

# Create SSH key for droplet access
echo "🔑 Generating SSH key..."
ssh-keygen -t ed25519 -f ./multiplex-key -N "" -C "multiplex-coordination@starfighter.one"

# Add SSH key to DO
KEY_ID=$(./doctl compute ssh-key import \
    --public-key-file ./multiplex-key.pub \
    --name "multiplex-coordination-key" \
    --format ID --no-header)

echo "✅ SSH key added: $KEY_ID"

# Create coordination droplet
echo "🚀 Creating coordination droplet..."
DROPLET_ID=$(./doctl compute droplet create \
    --image "ubuntu-22-04-x64" \
    --size "s-2vcpu-4gb" \
    --region "nyc3" \
    --vpc-uuid "$VPC_ID" \
    --ssh-keys "$KEY_ID" \
    --tag-names "multiplex,coordination-server" \
    --name "multiplex-coord-01" \
    --user-data-file ./droplet-init.sh \
    --format ID --no-header \
    --wait)

echo "✅ Droplet created: $DROPLET_ID"

# Get droplet IP
DROPLET_IP=$(./doctl compute droplet get $DROPLET_ID --format PublicIPv4 --no-header)
echo "🌐 Droplet IP: $DROPLET_IP"

# Apply firewall to droplet
./doctl compute firewall add-droplets $FIREWALL_ID --droplet-ids $DROPLET_ID

echo ""
echo "🎉 Digital Ocean infrastructure ready!"
echo ""
echo "📋 Summary:"
echo "   VPC: $VPC_ID"
echo "   Firewall: $FIREWALL_ID" 
echo "   Droplet: $DROPLET_ID"
echo "   IP Address: $DROPLET_IP"
echo "   SSH Key: ./multiplex-key"
echo ""
echo "🔧 Next steps:"
echo "   1. Wait 2-3 minutes for droplet to boot"
echo "   2. SSH in: ssh -i ./multiplex-key root@$DROPLET_IP"
echo "   3. Deploy coordination server"
echo ""

# Save config for later use
cat > ./do-config.json << EOF
{
  "vpc_id": "$VPC_ID",
  "firewall_id": "$FIREWALL_ID", 
  "droplet_id": "$DROPLET_ID",
  "droplet_ip": "$DROPLET_IP",
  "ssh_key_id": "$KEY_ID",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "💾 Configuration saved to ./do-config.json"