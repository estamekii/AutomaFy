#!/bin/bash

# AutomaFy Web - VPS Installation Script
# This script installs and configures AutomaFy Web on a VPS

set -e

echo "🚀 Starting AutomaFy Web VPS Installation..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (use sudo)"
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
else
    echo "✅ Docker is already installed"
fi

# Install Node.js and npm if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js is already installed"
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "⚡ Installing PM2..."
    npm install -g pm2
else
    echo "✅ PM2 is already installed"
fi

# Create automafy user if not exists
if ! id "automafy" &>/dev/null; then
    echo "👤 Creating automafy user..."
    useradd -m -s /bin/bash automafy
    usermod -aG docker automafy
else
    echo "✅ User automafy already exists"
fi

# Create application directory
echo "📁 Setting up application directory..."
APP_DIR="/opt/automafy-web"
mkdir -p $APP_DIR
chown automafy:automafy $APP_DIR

# Copy application files (assuming they're in current directory)
echo "📋 Copying application files..."
cp server.js $APP_DIR/
cp web.html $APP_DIR/
cp web-renderer.js $APP_DIR/
cp package-web.json $APP_DIR/package.json
chown -R automafy:automafy $APP_DIR

# Install dependencies
echo "📦 Installing application dependencies..."
cd $APP_DIR

# Ensure package.json exists and has correct content
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found, creating minimal version..."
    cat > package.json << 'EOF'
{
  "name": "automafy-web",
  "version": "1.0.1",
  "description": "AutomaFy Web - Application Installer for VPS",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF
    chown automafy:automafy package.json
fi

# Install dependencies with error checking
echo "📦 Installing Node.js dependencies..."
sudo -u automafy npm install --production

# Verify express was installed
if [ ! -d "node_modules/express" ]; then
    echo "❌ Express installation failed, trying manual install..."
    sudo -u automafy npm install express --save
fi

# Final verification
if [ ! -d "node_modules/express" ]; then
    echo "❌ Critical error: Express could not be installed"
    echo "🔧 Manual fix required: cd $APP_DIR && npm install express"
    exit 1
else
    echo "✅ Dependencies installed successfully"
fi

# Create systemd service
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/automafy-web.service << EOF
[Unit]
Description=AutomaFy Web Application
After=network.target

[Service]
Type=simple
User=automafy
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Install essential Docker containers
echo "📦 Installing essential Docker containers..."

# Install Redis
echo "📦 Instalando Redis..."
docker run -d \
  --name redis \
  --restart unless-stopped \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:alpine redis-server --appendonly yes

echo "🔍 Instalando RedisInsight (Interface Gráfica do Redis)..."
docker run -d \
  --name redisinsight \
  --restart unless-stopped \
  -p 8001:8001 \
  -v redisinsight_data:/db \
  redislabs/redisinsight:latest

# Install Traefik
echo "🌐 Installing Traefik..."
mkdir -p /opt/traefik
cat > /opt/traefik/traefik.yml << 'EOF'
api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@localhost
      storage: acme.json
      httpChallenge:
        entryPoint: web
EOF

docker run -d --name traefik --restart unless-stopped \
    -p 80:80 \
    -p 443:443 \
    -p 8080:8080 \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /opt/traefik/traefik.yml:/traefik.yml:ro \
    -v /opt/traefik/acme.json:/acme.json \
    traefik:v3.0

# Install Portainer
# Solicitar credenciais do Portainer
echo ""
echo "🔐 Configuração do Portainer Admin"
echo "Por favor, defina as credenciais do usuário administrador:"
read -p "👤 Nome de usuário admin: " PORTAINER_USER
while [[ ${#PORTAINER_USER} -lt 3 ]]; do
    echo "❌ O nome de usuário deve ter pelo menos 3 caracteres."
    read -p "👤 Nome de usuário admin: " PORTAINER_USER
done

read -s -p "🔑 Senha admin (mínimo 8 caracteres): " PORTAINER_PASSWORD
echo ""
while [[ ${#PORTAINER_PASSWORD} -lt 8 ]]; do
    echo "❌ A senha deve ter pelo menos 8 caracteres."
    read -s -p "🔑 Senha admin (mínimo 8 caracteres): " PORTAINER_PASSWORD
    echo ""
done

echo "🐳 Instalando Portainer..."
docker volume create portainer_data
docker run -d --name portainer --restart unless-stopped \
    -p 9000:9000 \
    -p 9443:9443 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:latest

# Aguardar Portainer inicializar
echo "⏳ Aguardando Portainer inicializar..."
sleep 15

# Criar usuário admin automaticamente
echo "👤 Configurando usuário admin..."
curl -X POST "http://localhost:9000/api/users/admin/init" \
  -H "Content-Type: application/json" \
  -d "{
    \"Username\": \"$PORTAINER_USER\",
    \"Password\": \"$PORTAINER_PASSWORD\"
  }" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Usuário admin configurado com sucesso!"
else
    echo "⚠️  Configuração manual necessária no primeiro acesso"
fi

echo "⏳ Waiting for containers to start..."
sleep 10

# Configure firewall BEFORE starting service
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall..."
    ufw allow 3000/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 8080/tcp
    ufw allow 9000/tcp
    ufw allow 8001/tcp
    ufw --force enable
    echo "✅ Firewall configured"
else
    echo "⚠️  UFW not available, please configure firewall manually"
fi

# Enable and start service
echo "🚀 Starting AutomaFy Web service..."
systemctl daemon-reload
systemctl enable automafy-web
systemctl start automafy-web

# Wait for service to start
sleep 5

# Verify service is running
if systemctl is-active --quiet automafy-web; then
    echo "✅ AutomaFy Web service started successfully"
else
    echo "❌ AutomaFy Web service failed to start"
    echo "🔍 Checking logs..."
    journalctl -u automafy-web --no-pager -n 10
    echo ""
    echo "🔧 Starting server manually as fallback..."
    
    # Kill any existing node processes on port 3000
    pkill -f "node server.js" 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
    
    # Start server manually in background
    cd $APP_DIR
    echo "🚀 Executing: cd $APP_DIR && node server.js"
    sudo -u automafy nohup node server.js > /var/log/automafy-web.log 2>&1 &
    
    # Wait a moment and check if it's running
    sleep 3
    if pgrep -f "node server.js" > /dev/null; then
        echo "✅ AutomaFy Web started manually and is running"
    else
        echo "❌ Failed to start AutomaFy Web manually"
        echo "🔧 Manual troubleshooting:"
        echo "  • Check logs: tail -f /var/log/automafy-web.log"
        echo "  • Check status: systemctl status automafy-web"
        echo "  • Manual start: cd $APP_DIR && node server.js"
    fi
fi

# Get server IP (force IPv4)
SERVER_IP=$(curl -s -4 ifconfig.me 2>/dev/null || curl -s ipv4.icanhazip.com 2>/dev/null || hostname -I | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' | head -1)

# Final verification that the server is responding
echo "🔍 Verifying AutomaFy Web is responding..."
sleep 2
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ AutomaFy Web is responding on port 3000"
elif curl -s -f http://127.0.0.1:3000 > /dev/null 2>&1; then
    echo "✅ AutomaFy Web is responding on port 3000"
else
    echo "⚠️  AutomaFy Web may not be fully ready yet"
    echo "🔧 Please wait a moment and try accessing: http://$SERVER_IP:3000"
fi

echo ""
echo "✅ AutomaFy Web installation completed!"
echo ""
echo "🌐 Access your applications at:"
echo "  • AutomaFy Web: http://$SERVER_IP:3000"
echo "  • Portainer: http://$SERVER_IP:9000"
echo "     👤 Usuário: $PORTAINER_USER"
echo "     🔑 Senha: [configurada durante instalação]"
echo "  • Traefik Dashboard: http://$SERVER_IP:8080"
echo "  • RedisInsight: http://$SERVER_IP:8001"
echo "  • Redis: $SERVER_IP:6379"
echo ""

# Auto-open browser if possible
echo "🌐 Attempting to open AutomaFy Web automatically..."
if command -v xdg-open &> /dev/null; then
    # Linux with desktop environment
    xdg-open "http://$SERVER_IP:3000" &> /dev/null &
    echo "✅ Browser opened automatically"
elif command -v open &> /dev/null; then
    # macOS
    open "http://$SERVER_IP:3000" &> /dev/null &
    echo "✅ Browser opened automatically"
elif command -v python3 &> /dev/null; then
    # Fallback using Python webbrowser module
    python3 -c "import webbrowser; webbrowser.open('http://$SERVER_IP:3000')" &> /dev/null &
    echo "✅ Browser opened automatically"
else
    echo "⚠️  Could not auto-open browser. Please manually access: http://$SERVER_IP:3000"
fi
echo ""
echo "📋 Useful commands:"
echo "  • Check AutomaFy status: systemctl status automafy-web"
echo "  • View AutomaFy logs: journalctl -u automafy-web -f"
echo "  • Check Docker containers: docker ps"
echo "  • Restart AutomaFy: systemctl restart automafy-web"
echo "  • Stop AutomaFy: systemctl stop automafy-web"
echo ""
echo "🐳 Essential services installed:"
echo "  • ✅ Docker (Container runtime)"
echo "  • ✅ Redis (Cache/Database)"
echo "  • ✅ RedisInsight (Redis GUI)"
echo "  • ✅ Traefik (Reverse proxy/Load balancer)"
echo "  • ✅ Portainer (Docker management UI)"
echo "  • ✅ AutomaFy Web (Application installer)"
echo ""
echo "📝 All services are configured with auto-restart"
echo "🔧 Use Portainer to manage your Docker containers visually"
echo ""