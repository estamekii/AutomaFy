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
sudo -u automafy npm install --production

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

# Enable and start service
echo "🚀 Starting AutomaFy Web service..."
systemctl daemon-reload
systemctl enable automafy-web
systemctl start automafy-web

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall..."
    ufw allow 3000/tcp
    ufw --force enable
fi

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

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