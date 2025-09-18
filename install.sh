#!/bin/bash

# AutomaFy Web - Installation Script
# Usage: curl -fsSL https://raw.githubusercontent.com/estamekii/AutomaFy/main/install.sh | bash

set -e

# Configuration
GITHUB_USER="estamekii"  # GitHub username
GITHUB_REPO="AutomaFy"   # Repository name
GITHUB_BRANCH="main"         # Replace with your branch name
APP_DIR="/opt/automafy-web"

echo "🚀 AutomaFy Web - Quick Install"
echo "==============================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (use sudo)"
    exit 1
fi

echo "🚀 Starting AutomaFy Web installation..."

# System requirements check
echo "🔍 Checking system requirements..."

# Check available memory (minimum 1GB)
MEMORY_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEMORY_GB=$((MEMORY_KB / 1024 / 1024))
if [ $MEMORY_GB -lt 1 ]; then
    echo "❌ Insufficient memory: ${MEMORY_GB}GB (minimum 1GB required)"
    exit 1
fi
echo "✅ Memory: ${MEMORY_GB}GB"

# Check available disk space (minimum 10GB)
DISK_SPACE_GB=$(df / | awk 'NR==2 {print int($4/1024/1024)}')
if [ $DISK_SPACE_GB -lt 10 ]; then
    echo "❌ Insufficient disk space: ${DISK_SPACE_GB}GB (minimum 10GB required)"
    exit 1
fi
echo "✅ Disk space: ${DISK_SPACE_GB}GB available"

# Update system and install dependencies
echo "📦 Installing dependencies..."
apt update && apt upgrade -y
apt install -y curl wget git unzip nodejs npm

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Create app directory and download
echo "📥 Downloading AutomaFy Web..."
mkdir -p $APP_DIR && cd $APP_DIR
wget -O app.zip "https://github.com/$GITHUB_USER/$GITHUB_REPO/archive/refs/heads/$GITHUB_BRANCH.zip"
unzip -q app.zip

# Move files, handling existing directories
echo "📁 Updating files..."
for item in $GITHUB_REPO-$GITHUB_BRANCH/*; do
    if [ -d "$item" ]; then
        # If it's a directory, copy contents recursively
        basename_item=$(basename "$item")
        if [ -d "./$basename_item" ]; then
            echo "   Updating directory: $basename_item"
            cp -rf "$item"/* "./$basename_item/"
        else
            mv "$item" .
        fi
    else
        # If it's a file, move it (overwrite if exists)
        mv "$item" .
    fi
done

rm -rf $GITHUB_REPO-$GITHUB_BRANCH app.zip

# Install app dependencies
echo "📦 Installing app dependencies..."
[ -f "package-web.json" ] && cp package-web.json package.json
npm install --production

# Create systemd service
echo "🔧 Creating service..."
cat > /etc/systemd/system/automafy-web.service << EOF
[Unit]
Description=AutomaFy Web
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server.js
Restart=always
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Start service
systemctl daemon-reload
systemctl enable automafy-web
systemctl start automafy-web

# Get IP
IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "✅ Installation complete!"
echo "🌐 Access: http://$IP:3000"
echo ""
echo "Commands:"
echo "  Status: systemctl status automafy-web"
echo "  Logs:   journalctl -u automafy-web -f"
echo "  Stop:   systemctl stop automafy-web"
echo ""