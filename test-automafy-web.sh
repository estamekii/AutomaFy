#!/bin/bash

# AutomaFy Web - Quick Test Script
# This script tests if AutomaFy Web is properly installed and running

echo "🔍 AutomaFy Web - Quick Test Script"
echo "=================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (use sudo)"
    exit 1
fi

APP_DIR="/opt/automafy-web"

echo ""
echo "📁 Checking application directory..."
if [ -d "$APP_DIR" ]; then
    echo "✅ Application directory exists: $APP_DIR"
else
    echo "❌ Application directory not found: $APP_DIR"
    exit 1
fi

echo ""
echo "📋 Checking required files..."
FILES=("server.js" "web.html" "web-renderer.js" "package.json")
for file in "${FILES[@]}"; do
    if [ -f "$APP_DIR/$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "📦 Checking Node.js dependencies..."
if [ -d "$APP_DIR/node_modules/express" ]; then
    echo "✅ Express dependency installed"
else
    echo "❌ Express dependency missing"
    echo "🔧 Fixing: Installing Express..."
    cd $APP_DIR
    sudo -u automafy npm install express
    if [ -d "node_modules/express" ]; then
        echo "✅ Express installed successfully"
    else
        echo "❌ Failed to install Express"
    fi
fi

echo ""
echo "🔧 Checking systemd service..."
if systemctl list-unit-files | grep -q "automafy-web.service"; then
    echo "✅ AutomaFy Web service exists"
    
    if systemctl is-active --quiet automafy-web; then
        echo "✅ AutomaFy Web service is running"
    else
        echo "⚠️  AutomaFy Web service is not running"
        echo "🔧 Attempting to start service..."
        systemctl start automafy-web
        sleep 3
        if systemctl is-active --quiet automafy-web; then
            echo "✅ Service started successfully"
        else
            echo "❌ Failed to start service"
            echo "📋 Service logs:"
            journalctl -u automafy-web --no-pager -n 5
        fi
    fi
else
    echo "❌ AutomaFy Web service not found"
fi

echo ""
echo "🔥 Checking firewall..."
if command -v ufw &> /dev/null; then
    if ufw status | grep -q "3000/tcp.*ALLOW"; then
        echo "✅ Port 3000 is allowed in firewall"
    else
        echo "⚠️  Port 3000 not allowed in firewall"
        echo "🔧 Fixing: Opening port 3000..."
        ufw allow 3000/tcp
        echo "✅ Port 3000 opened"
    fi
else
    echo "⚠️  UFW not available, cannot check firewall"
fi

echo ""
echo "🌐 Testing web server..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404"; then
    echo "✅ Web server is responding"
else
    echo "❌ Web server is not responding"
    echo "🔧 Attempting manual start..."
    cd $APP_DIR
    timeout 5 node server.js &
    sleep 2
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404"; then
        echo "✅ Manual start successful"
        pkill -f "node server.js"
    else
        echo "❌ Manual start failed"
    fi
fi

echo ""
echo "📊 System Information:"
echo "  • Node.js version: $(node --version 2>/dev/null || echo 'Not installed')"
echo "  • NPM version: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "  • Server IP: $(curl -s -4 ifconfig.me 2>/dev/null || curl -s ipv4.icanhazip.com 2>/dev/null || hostname -I | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' | head -1)"

echo ""
echo "🎯 Quick Access URLs:"
SERVER_IP=$(curl -s -4 ifconfig.me 2>/dev/null || curl -s ipv4.icanhazip.com 2>/dev/null || hostname -I | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' | head -1)
echo "  • AutomaFy Web: http://$SERVER_IP:3000"
echo "  • Portainer: http://$SERVER_IP:9000"
echo "  • Traefik Dashboard: http://$SERVER_IP:8080"
echo "  • RedisInsight: http://$SERVER_IP:8001"

echo ""
echo "✅ Test completed!"