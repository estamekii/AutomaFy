#!/bin/bash

# AutomaFy Web - Quick Installation Script
# Execute with: curl -fsSL https://raw.githubusercontent.com/estamekii/AutomaFy/main/quick-install.sh | sudo bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# GitHub repository information
GITHUB_USER="estamekii"  # GitHub username
GITHUB_REPO="AutomaFy"   # Repository name
GITHUB_BRANCH="main"     # Branch name

echo -e "${BLUE}🚀 AutomaFy Web - Quick Installation${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run this script as root (use sudo)${NC}"
    echo -e "${YELLOW}💡 Example: curl -fsSL https://raw.githubusercontent.com/$GITHUB_USER/$GITHUB_REPO/$GITHUB_BRANCH/quick-install.sh | sudo bash${NC}"
    exit 1
fi

# System requirements check
echo -e "${YELLOW}🔍 Checking system requirements...${NC}"

# Check available memory (minimum 1GB)
MEMORY_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEMORY_GB=$((MEMORY_KB / 1024 / 1024))
if [ $MEMORY_GB -lt 1 ]; then
    echo -e "${RED}❌ Insufficient memory: ${MEMORY_GB}GB (minimum 1GB required)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Memory: ${MEMORY_GB}GB${NC}"

# Check available disk space (minimum 10GB)
DISK_SPACE_GB=$(df / | awk 'NR==2 {print int($4/1024/1024)}')
if [ $DISK_SPACE_GB -lt 10 ]; then
    echo -e "${RED}❌ Insufficient disk space: ${DISK_SPACE_GB}GB (minimum 10GB required)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Disk space: ${DISK_SPACE_GB}GB available${NC}"

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo -e "${RED}❌ Cannot detect OS version${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Detected OS: $OS $VER${NC}"

# Check if OS is supported
case "$OS" in
    *"Ubuntu"*|*"Debian"*|*"CentOS"*|*"Red Hat"*|*"Rocky"*|*"AlmaLinux"*)
        echo -e "${GREEN}✅ Supported OS detected${NC}"
        ;;
    *)
        echo -e "${YELLOW}⚠️  OS not officially supported, but will attempt installation${NC}"
        ;;
esac

# Domain configuration
echo ""
echo -e "${BLUE}🌐 CONFIGURAÇÃO DE DOMÍNIOS${NC}"
echo -e "${BLUE}============================${NC}"
echo ""
echo -e "${YELLOW}Você pode configurar domínios personalizados para os serviços.${NC}"
echo -e "${YELLOW}Deixe em branco para usar apenas IP + porta.${NC}"
echo ""

# Get server IP
SERVER_IP=$(curl -s -4 ifconfig.me 2>/dev/null || curl -s ipv4.icanhazip.com 2>/dev/null || hostname -I | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' | head -1)
echo -e "${GREEN}IP do servidor detectado: $SERVER_IP${NC}"
echo ""

# Ask for domains
read -p "🌐 Domínio para AutomaFy Web (ex: automafy.seudominio.com): " AUTOMAFY_DOMAIN
read -p "🐳 Domínio para Portainer (ex: portainer.seudominio.com): " PORTAINER_DOMAIN
read -p "🔍 Domínio para RedisInsight (ex: redis.seudominio.com): " REDIS_DOMAIN
read -p "🌐 Domínio para Traefik Dashboard (ex: traefik.seudominio.com): " TRAEFIK_DOMAIN

# Ask for email for SSL certificates
if [ ! -z "$AUTOMAFY_DOMAIN" ] || [ ! -z "$PORTAINER_DOMAIN" ] || [ ! -z "$REDIS_DOMAIN" ] || [ ! -z "$TRAEFIK_DOMAIN" ]; then
    echo ""
    read -p "📧 Email para certificados SSL (Let's Encrypt): " SSL_EMAIL
    if [ -z "$SSL_EMAIL" ]; then
        SSL_EMAIL="admin@localhost"
    fi
fi

echo ""
echo -e "${GREEN}✅ Configuração de domínios concluída!${NC}"
echo ""

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
    apt update && apt upgrade -y
    apt install -y curl wget git unzip
elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Rocky"* ]]; then
    yum update -y
    yum install -y curl wget git unzip
else
    echo -e "${YELLOW}⚠️  Unsupported OS. Trying with apt...${NC}"
    apt update && apt upgrade -y
    apt install -y curl wget git unzip
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
else
    echo -e "${GREEN}✅ Docker is already installed${NC}"
fi

# Install Node.js and npm if not present
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Rocky"* ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
        yum install -y nodejs
    fi
    echo -e "${GREEN}✅ Node.js installed successfully${NC}"
else
    echo -e "${GREEN}✅ Node.js is already installed${NC}"
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚡ Installing PM2...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed successfully${NC}"
else
    echo -e "${GREEN}✅ PM2 is already installed${NC}"
fi

# Create automafy user if not exists
if ! id "automafy" &>/dev/null; then
    echo -e "${YELLOW}👤 Creating automafy user...${NC}"
    useradd -m -s /bin/bash automafy
    usermod -aG docker automafy
    echo -e "${GREEN}✅ User automafy created${NC}"
else
    echo -e "${GREEN}✅ User automafy already exists${NC}"
fi

# Create application directory
echo -e "${YELLOW}📁 Setting up application directory...${NC}"
APP_DIR="/opt/automafy-web"
mkdir -p $APP_DIR
cd $APP_DIR

# Download latest release from GitHub
echo -e "${YELLOW}[INFO] Downloading AutomaFy Web from GitHub...${NC}"
DOWNLOAD_URL="https://github.com/$GITHUB_USER/$GITHUB_REPO/archive/refs/heads/$GITHUB_BRANCH.zip"
wget -O automafy-web.zip "$DOWNLOAD_URL"

# Extract files
echo -e "${YELLOW}[INFO] Extracting files...${NC}"
unzip -o -q automafy-web.zip

# Move files, handling existing directories
echo -e "${YELLOW}[INFO] Updating files...${NC}"
for item in $GITHUB_REPO-$GITHUB_BRANCH/*; do
    if [ -d "$item" ]; then
        # If it's a directory, copy contents recursively
        basename_item=$(basename "$item")
        if [ -d "./$basename_item" ]; then
            echo -e "${YELLOW}   Updating directory: $basename_item${NC}"
            cp -rf "$item"/* "./$basename_item/"
        else
            mv "$item" .
        fi
    else
        # If it's a file, move it (overwrite if exists)
        mv "$item" .
    fi
done

rm -rf $GITHUB_REPO-$GITHUB_BRANCH automafy-web.zip

# Ensure package.json exists for Docker build
echo -e "${YELLOW}📦 Preparing Node.js dependencies...${NC}"
if [ -f "package-web.json" ]; then
    cp package-web.json package.json
    echo -e "${GREEN}✅ package.json created from package-web.json${NC}"
elif [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  package.json not found, creating minimal version...${NC}"
    cat > package.json << 'EOF'
{
  "name": "automafy-web",
  "version": "1.0.0",
  "description": "AutomaFy Web Application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF
    echo -e "${GREEN}✅ Minimal package.json created${NC}"
else
    echo -e "${GREEN}✅ package.json already exists${NC}"
fi

# Set correct permissions
chown -R automafy:automafy $APP_DIR

# Build Docker image for AutomaFy Web
echo -e "${YELLOW}🐳 Building AutomaFy Web Docker image...${NC}"
docker build -t automafy-web:latest .

# Verify Docker build was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed!${NC}"
    echo -e "${YELLOW}🔧 Troubleshooting tips:${NC}"
    echo -e "${YELLOW}  • Check if Dockerfile exists${NC}"
    echo -e "${YELLOW}  • Verify package.json is valid${NC}"
    echo -e "${YELLOW}  • Check Docker daemon is running${NC}"
    echo -e "${YELLOW}  • Try: docker build -t automafy-web:latest . --no-cache${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker image built successfully${NC}"

# Create AutomaFy Web container with domain configuration
echo -e "${YELLOW}🚀 Starting AutomaFy Web container...${NC}"
if [ ! -z "$AUTOMAFY_DOMAIN" ]; then
    # With custom domain
    docker run -d \
      --name automafy-web \
      --restart unless-stopped \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v $APP_DIR/compose:/app/compose \
      --label "traefik.enable=true" \
      --label "traefik.http.routers.automafy.rule=Host(\`$AUTOMAFY_DOMAIN\`)" \
      --label "traefik.http.routers.automafy.entrypoints=websecure" \
      --label "traefik.http.routers.automafy.tls.certresolver=letsencrypt" \
      --label "traefik.http.services.automafy.loadbalancer.server.port=3000" \
      automafy-web:latest
else
    # Without custom domain (port access)
    docker run -d \
      --name automafy-web \
      --restart unless-stopped \
      -p 3000:3000 \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v $APP_DIR/compose:/app/compose \
      automafy-web:latest
fi

# Install essential Docker containers
echo -e "${YELLOW}📦 Installing essential Docker containers...${NC}"

# Install Redis
echo -e "${YELLOW}📦 Installing Redis...${NC}"
docker run -d \
  --name redis \
  --restart unless-stopped \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:alpine redis-server --appendonly yes

echo -e "${YELLOW}🔍 Installing RedisInsight (Redis GUI)...${NC}"

# Create RedisInsight container with domain configuration
if [ ! -z "$REDIS_DOMAIN" ]; then
    # With custom domain
    docker run -d \
      --name redisinsight \
      --restart unless-stopped \
      -v redisinsight_data:/db \
      --label "traefik.enable=true" \
      --label "traefik.http.routers.redisinsight.rule=Host(\`$REDIS_DOMAIN\`)" \
      --label "traefik.http.routers.redisinsight.entrypoints=websecure" \
      --label "traefik.http.routers.redisinsight.tls.certresolver=letsencrypt" \
      --label "traefik.http.services.redisinsight.loadbalancer.server.port=8001" \
      redislabs/redisinsight:latest
else
    # Without custom domain (port access)
    docker run -d \
      --name redisinsight \
      --restart unless-stopped \
      -p 8001:8001 \
      -v redisinsight_data:/db \
      redislabs/redisinsight:latest
fi

# Install Traefik
echo -e "${YELLOW}🌐 Installing Traefik...${NC}"
mkdir -p /opt/traefik

# Create Traefik configuration with SSL email
cat > /opt/traefik/traefik.yml << EOF
api:
  dashboard: true
  insecure: $([ -z "$TRAEFIK_DOMAIN" ] && echo "true" || echo "false")

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entrypoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: ${SSL_EMAIL:-admin@localhost}
      storage: acme.json
      httpChallenge:
        entryPoint: web
EOF

touch /opt/traefik/acme.json
chmod 600 /opt/traefik/acme.json

# Create Traefik container with domain configuration
if [ ! -z "$TRAEFIK_DOMAIN" ]; then
    # With custom domain
    docker run -d --name traefik --restart unless-stopped \
        -p 80:80 \
        -p 443:443 \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        -v /opt/traefik/traefik.yml:/traefik.yml:ro \
        -v /opt/traefik/acme.json:/acme.json \
        --label "traefik.enable=true" \
        --label "traefik.http.routers.traefik.rule=Host(\`$TRAEFIK_DOMAIN\`)" \
        --label "traefik.http.routers.traefik.entrypoints=websecure" \
        --label "traefik.http.routers.traefik.tls.certresolver=letsencrypt" \
        --label "traefik.http.services.traefik.loadbalancer.server.port=8080" \
        traefik:v3.0
else
    # Without custom domain (port access)
    docker run -d --name traefik --restart unless-stopped \
        -p 80:80 \
        -p 443:443 \
        -p 8080:8080 \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        -v /opt/traefik/traefik.yml:/traefik.yml:ro \
        -v /opt/traefik/acme.json:/acme.json \
        traefik:v3.0
fi

# Install Portainer with automatic admin setup
echo -e "${YELLOW}🐳 Installing Portainer...${NC}"

# Generate random admin credentials
PORTAINER_USER="admin"
PORTAINER_PASSWORD=$(openssl rand -base64 12)

docker volume create portainer_data

# Create Portainer container with domain configuration
if [ ! -z "$PORTAINER_DOMAIN" ]; then
    # With custom domain
    docker run -d --name portainer --restart unless-stopped \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v portainer_data:/data \
        --label "traefik.enable=true" \
        --label "traefik.http.routers.portainer.rule=Host(\`$PORTAINER_DOMAIN\`)" \
        --label "traefik.http.routers.portainer.entrypoints=websecure" \
        --label "traefik.http.routers.portainer.tls.certresolver=letsencrypt" \
        --label "traefik.http.services.portainer.loadbalancer.server.port=9000" \
        portainer/portainer-ce:latest
else
    # Without custom domain (port access)
    docker run -d --name portainer --restart unless-stopped \
        -p 9000:9000 \
        -p 9443:9443 \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v portainer_data:/data \
        portainer/portainer-ce:latest
fi

# Wait for Portainer to initialize
echo -e "${YELLOW}⏳ Waiting for Portainer to initialize...${NC}"
sleep 20

# Create admin user automatically
echo -e "${YELLOW}👤 Configuring Portainer admin user...${NC}"
curl -X POST "http://localhost:9000/api/users/admin/init" \
  -H "Content-Type: application/json" \
  -d "{
    \"Username\": \"$PORTAINER_USER\",
    \"Password\": \"$PORTAINER_PASSWORD\"
  }" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Portainer admin user configured successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Manual configuration may be needed on first access${NC}"
fi

echo -e "${YELLOW}⏳ Waiting for all containers to start...${NC}"
sleep 15

# Verify containers are running
echo -e "${YELLOW}🔍 Verifying container status...${NC}"
CONTAINERS=("automafy-web" "redis" "redisinsight" "traefik" "portainer")
FAILED_CONTAINERS=()

for container in "${CONTAINERS[@]}"; do
    if docker ps --format "table {{.Names}}" | grep -q "^$container$"; then
        echo -e "${GREEN}✅ $container is running${NC}"
    else
        echo -e "${RED}❌ $container failed to start${NC}"
        FAILED_CONTAINERS+=("$container")
    fi
done

if [ ${#FAILED_CONTAINERS[@]} -gt 0 ]; then
    echo -e "${RED}⚠️  Some containers failed to start: ${FAILED_CONTAINERS[*]}${NC}"
    echo -e "${YELLOW}🔧 Troubleshooting commands:${NC}"
    for container in "${FAILED_CONTAINERS[@]}"; do
        echo -e "${YELLOW}  • Check $container logs: docker logs $container${NC}"
        echo -e "${YELLOW}  • Restart $container: docker restart $container${NC}"
    done
    echo ""
fi

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
    ufw allow 80/tcp   # HTTP
    ufw allow 443/tcp  # HTTPS
    
    # Only open ports if not using domains
    if [ -z "$AUTOMAFY_DOMAIN" ]; then
        ufw allow 3000/tcp
    fi
    if [ -z "$PORTAINER_DOMAIN" ]; then
        ufw allow 9000/tcp
    fi
    if [ -z "$TRAEFIK_DOMAIN" ]; then
        ufw allow 8080/tcp
    fi
    if [ -z "$REDIS_DOMAIN" ]; then
        ufw allow 8001/tcp
    fi
    
    ufw --force enable
fi

# Get server IP
SERVER_IP=$(curl -s -4 ifconfig.me 2>/dev/null || curl -s ipv4.icanhazip.com 2>/dev/null || hostname -I | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' | head -1)

# Save credentials to file
cat > /root/automafy-credentials.txt << EOF
AutomaFy Web Installation - Credentials
======================================

Portainer Admin:
  Username: $PORTAINER_USER
  Password: $PORTAINER_PASSWORD

Installation Date: $(date)
Server IP: $SERVER_IP

Domain Configuration:
$(if [ ! -z "$AUTOMAFY_DOMAIN" ]; then echo "  AutomaFy Web: https://$AUTOMAFY_DOMAIN"; else echo "  AutomaFy Web: http://$SERVER_IP:3000"; fi)
$(if [ ! -z "$PORTAINER_DOMAIN" ]; then echo "  Portainer: https://$PORTAINER_DOMAIN"; else echo "  Portainer: http://$SERVER_IP:9000"; fi)
$(if [ ! -z "$TRAEFIK_DOMAIN" ]; then echo "  Traefik Dashboard: https://$TRAEFIK_DOMAIN"; else echo "  Traefik Dashboard: http://$SERVER_IP:8080"; fi)
$(if [ ! -z "$REDIS_DOMAIN" ]; then echo "  RedisInsight: https://$REDIS_DOMAIN"; else echo "  RedisInsight: http://$SERVER_IP:8001"; fi)

$(if [ ! -z "$SSL_EMAIL" ]; then echo "SSL Email: $SSL_EMAIL"; fi)
EOF

echo ""
echo -e "${GREEN}✅ AutomaFy Web installation completed successfully!${NC}"
echo -e "${GREEN}=================================================${NC}"
echo ""
echo -e "${BLUE}🌐 Access your applications at:${NC}"

# Show URLs based on domain configuration
if [ ! -z "$AUTOMAFY_DOMAIN" ]; then
    echo -e "${YELLOW}  • AutomaFy Web: https://$AUTOMAFY_DOMAIN${NC}"
else
    echo -e "${YELLOW}  • AutomaFy Web: http://$SERVER_IP:3000${NC}"
fi

if [ ! -z "$PORTAINER_DOMAIN" ]; then
    echo -e "${YELLOW}  • Portainer: https://$PORTAINER_DOMAIN${NC}"
else
    echo -e "${YELLOW}  • Portainer: http://$SERVER_IP:9000${NC}"
fi
echo -e "${YELLOW}     👤 Username: $PORTAINER_USER${NC}"
echo -e "${YELLOW}     🔑 Password: $PORTAINER_PASSWORD${NC}"

if [ ! -z "$TRAEFIK_DOMAIN" ]; then
    echo -e "${YELLOW}  • Traefik Dashboard: https://$TRAEFIK_DOMAIN${NC}"
else
    echo -e "${YELLOW}  • Traefik Dashboard: http://$SERVER_IP:8080${NC}"
fi

if [ ! -z "$REDIS_DOMAIN" ]; then
    echo -e "${YELLOW}  • RedisInsight: https://$REDIS_DOMAIN${NC}"
else
    echo -e "${YELLOW}  • RedisInsight: http://$SERVER_IP:8001${NC}"
fi

echo -e "${YELLOW}  • Redis: $SERVER_IP:6379${NC}"
echo ""

# Auto-open browser if possible
echo -e "${BLUE}🌐 Attempting to open AutomaFy Web automatically...${NC}"
AUTOMAFY_URL=""
if [ ! -z "$AUTOMAFY_DOMAIN" ]; then
    AUTOMAFY_URL="https://$AUTOMAFY_DOMAIN"
else
    AUTOMAFY_URL="http://$SERVER_IP:3000"
fi

if command -v xdg-open &> /dev/null; then
    # Linux with desktop environment
    xdg-open "$AUTOMAFY_URL" &> /dev/null &
    echo -e "${GREEN}✅ Browser opened automatically${NC}"
elif command -v open &> /dev/null; then
    # macOS
    open "$AUTOMAFY_URL" &> /dev/null &
    echo -e "${GREEN}✅ Browser opened automatically${NC}"
elif command -v python3 &> /dev/null; then
    # Fallback using Python webbrowser module
    python3 -c "import webbrowser; webbrowser.open('$AUTOMAFY_URL')" &> /dev/null &
    echo -e "${GREEN}✅ Browser opened automatically${NC}"
else
    echo -e "${YELLOW}⚠️  Could not auto-open browser. Please manually access: $AUTOMAFY_URL${NC}"
fi
echo ""

# Show SSL information if domains are configured
if [ ! -z "$AUTOMAFY_DOMAIN" ] || [ ! -z "$PORTAINER_DOMAIN" ] || [ ! -z "$REDIS_DOMAIN" ] || [ ! -z "$TRAEFIK_DOMAIN" ]; then
    echo -e "${BLUE}🔒 SSL Certificates:${NC}"
    echo -e "${GREEN}  • ✅ Let's Encrypt certificates will be automatically generated${NC}"
    echo -e "${GREEN}  • ✅ HTTP traffic will be redirected to HTTPS${NC}"
    echo -e "${YELLOW}  • 📧 SSL Email: $SSL_EMAIL${NC}"
    echo ""
fi

echo -e "${BLUE}📋 Useful commands:${NC}"
echo -e "${YELLOW}  • Check Docker containers: docker ps${NC}"
echo -e "${YELLOW}  • View AutomaFy logs: docker logs automafy-web -f${NC}"
echo -e "${YELLOW}  • Restart AutomaFy: docker restart automafy-web${NC}"
echo -e "${YELLOW}  • Stop AutomaFy: docker stop automafy-web${NC}"
echo ""
echo -e "${BLUE}🐳 Essential services installed:${NC}"
echo -e "${GREEN}  • ✅ Docker (Container runtime)${NC}"
echo -e "${GREEN}  • ✅ Redis (Cache/Database)${NC}"
echo -e "${GREEN}  • ✅ RedisInsight (Redis GUI)${NC}"
echo -e "${GREEN}  • ✅ Traefik (Reverse proxy/Load balancer)${NC}"
echo -e "${GREEN}  • ✅ Portainer (Docker management UI)${NC}"
echo -e "${GREEN}  • ✅ AutomaFy Web (Application installer)${NC}"
echo ""
echo -e "${BLUE}📝 Important notes:${NC}"
echo -e "${YELLOW}  • All services are configured with auto-restart${NC}"
echo -e "${YELLOW}  • Credentials saved to: /root/automafy-credentials.txt${NC}"
echo -e "${YELLOW}  • Use Portainer to manage Docker containers visually${NC}"
echo -e "${YELLOW}  • AutomaFy Web provides easy installation of 50+ applications${NC}"
echo ""
echo -e "${GREEN}🎉 Installation completed! You can now start installing applications through AutomaFy Web.${NC}"