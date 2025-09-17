#!/bin/bash

# AutomaFy Web - Installation Test Script
# This script tests the installation without actually installing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 AutomaFy Web - Installation Test${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Test 1: Check if running as root
echo -e "${YELLOW}Test 1: Checking root privileges...${NC}"
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ FAIL: Not running as root${NC}"
    echo -e "${YELLOW}💡 Run with: sudo bash test-install.sh${NC}"
    exit 1
else
    echo -e "${GREEN}✅ PASS: Running as root${NC}"
fi

# Test 2: System requirements
echo -e "${YELLOW}Test 2: Checking system requirements...${NC}"

# Check memory
MEMORY_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEMORY_GB=$((MEMORY_KB / 1024 / 1024))
if [ $MEMORY_GB -lt 1 ]; then
    echo -e "${RED}❌ FAIL: Insufficient memory: ${MEMORY_GB}GB (minimum 1GB)${NC}"
    exit 1
else
    echo -e "${GREEN}✅ PASS: Memory: ${MEMORY_GB}GB${NC}"
fi

# Check disk space
DISK_SPACE_GB=$(df / | awk 'NR==2 {print int($4/1024/1024)}')
if [ $DISK_SPACE_GB -lt 10 ]; then
    echo -e "${RED}❌ FAIL: Insufficient disk space: ${DISK_SPACE_GB}GB (minimum 10GB)${NC}"
    exit 1
else
    echo -e "${GREEN}✅ PASS: Disk space: ${DISK_SPACE_GB}GB available${NC}"
fi

# Test 3: OS Detection
echo -e "${YELLOW}Test 3: Checking OS compatibility...${NC}"
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
    echo -e "${GREEN}✅ PASS: Detected OS: $OS $VER${NC}"
    
    case "$OS" in
        *"Ubuntu"*|*"Debian"*|*"CentOS"*|*"Red Hat"*|*"Rocky"*|*"AlmaLinux"*)
            echo -e "${GREEN}✅ PASS: Supported OS${NC}"
            ;;
        *)
            echo -e "${YELLOW}⚠️  WARNING: OS not officially supported${NC}"
            ;;
    esac
else
    echo -e "${RED}❌ FAIL: Cannot detect OS${NC}"
    exit 1
fi

# Test 4: Network connectivity
echo -e "${YELLOW}Test 4: Checking network connectivity...${NC}"
if curl -s --connect-timeout 5 https://github.com > /dev/null; then
    echo -e "${GREEN}✅ PASS: GitHub connectivity${NC}"
else
    echo -e "${RED}❌ FAIL: Cannot connect to GitHub${NC}"
    exit 1
fi

if curl -s --connect-timeout 5 https://get.docker.com > /dev/null; then
    echo -e "${GREEN}✅ PASS: Docker installation source${NC}"
else
    echo -e "${RED}❌ FAIL: Cannot connect to Docker installation source${NC}"
    exit 1
fi

# Test 5: Check existing installations
echo -e "${YELLOW}Test 5: Checking existing installations...${NC}"

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "${GREEN}✅ Docker already installed: $DOCKER_VERSION${NC}"
else
    echo -e "${YELLOW}ℹ️  Docker not installed (will be installed)${NC}"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js already installed: $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}ℹ️  Node.js not installed (will be installed)${NC}"
fi

if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    echo -e "${GREEN}✅ PM2 already installed: $PM2_VERSION${NC}"
else
    echo -e "${YELLOW}ℹ️  PM2 not installed (will be installed)${NC}"
fi

# Test 6: Port availability
echo -e "${YELLOW}Test 6: Checking port availability...${NC}"

PORTS_TO_CHECK=(3000 80 443 8080 9000)
for port in "${PORTS_TO_CHECK[@]}"; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "${YELLOW}⚠️  WARNING: Port $port is already in use${NC}"
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
    fi
done

# Test 7: User permissions
echo -e "${YELLOW}Test 7: Checking user creation capability...${NC}"
if id "automafy" &>/dev/null; then
    echo -e "${YELLOW}ℹ️  User 'automafy' already exists${NC}"
else
    echo -e "${GREEN}✅ User 'automafy' can be created${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All tests passed! System is ready for AutomaFy installation.${NC}"
echo ""
echo -e "${BLUE}To install AutomaFy Web, run one of these commands:${NC}"
echo -e "${YELLOW}Quick install: curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/quick-install.sh | sudo bash${NC}"
echo -e "${YELLOW}Simple install: curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/install.sh | sudo bash${NC}"
echo ""