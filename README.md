# 🔧 AutomaFy - Application Installer

A modern, user-friendly web application for installing 50+ popular development tools and APIs using Docker containers.

## 🚀 **INSTALAÇÃO RÁPIDA VPS - UM ÚNICO COMANDO**

Execute este comando na sua VPS para instalar automaticamente:

```bash
curl -fsSL https://raw.githubusercontent.com/estamekii/AutomaFy/main/quick-install.sh | sudo bash
```

**Ou use a versão simplificada:**
```bash
curl -fsSL https://raw.githubusercontent.com/estamekii/AutomaFy/main/install.sh | sudo bash
```

### 🎯 O que será instalado automaticamente:
- ✅ **Docker** + **Node.js** + **PM2**
- ✅ **Redis** + **RedisInsight** 
- ✅ **Traefik** + **Portainer**
- ✅ **AutomaFy Web** (Interface principal)
- ✅ **50+ Aplicações** prontas para instalação

**Acesso:** `http://SEU_IP:3000` após a instalação! 🌐

---

## 📋 Overview

AutomaFy provides a graphical web interface to easily install and manage 50+ applications including:

### 🎯 **Atendimento & CRM**
- 💬 **Chatwoot** - Customer support platform
- 🚀 **Evolution API** - WhatsApp API for businesses  
- 📊 **Mautic** - Marketing automation
- 💼 **TwentyCRM** - Modern CRM solution

### 🤖 **Automação & IA**
- ⚡ **N8N** - Workflow automation tool
- 🧠 **Flowise** - LLM orchestration tool
- 🔮 **Dify AI** - AI application development
- 💬 **Typebot** - Conversational forms builder

### 📊 **Analytics & Monitoramento**
- 📈 **Grafana** - Data visualization
- 🔍 **Prometheus** - Monitoring system
- ⏰ **Uptime Kuma** - Uptime monitoring
- 📊 **Metabase** - Business intelligence

### 🗄️ **Bancos & Storage**
- 🐘 **PostgreSQL** - Advanced database
- 🗄️ **Supabase** - Firebase alternative
- 📦 **MinIO** - Object storage
- 🍃 **MongoDB** - NoSQL database

### 🔒 **Segurança & Auth**
- 🔐 **Keycloak** - Identity management
- 🛡️ **Vaultwarden** - Password manager
- 🔑 **Passbolt** - Team password manager

**E muito mais!** Total de 50+ aplicações disponíveis.

## ✨ Features

- **One-Click Installation**: Install applications with a single click
- **Docker Integration**: Uses Docker containers for isolated, clean installations
- **Real-time Progress**: Live status updates during installation
- **Automatic Management**: Handles container lifecycle (start/stop/restart)
- **Modern Web UI**: Clean, responsive interface accessible from any device
- **SSL Ready**: Automatic SSL configuration with Let's Encrypt
- **Multi-Platform**: Works on any Linux VPS (Ubuntu, Debian, CentOS, etc.)

## 🛠️ Prerequisites

### For VPS Installation (Recommended):
- **VPS/Server** with Linux (Ubuntu 18.04+, Debian 9+, CentOS 7+)
- **2GB RAM** minimum (4GB+ recommended)
- **20GB Storage** minimum (50GB+ recommended)
- **Root access** or sudo privileges

### For Local Development:

### Installation

1. Clone or download the AutomaFy project
2. Navigate to the project directory:
   ```bash
   cd AutomaFy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

### Using the Application

1. **Launch AutomaFy** using `npm start`
2. **Choose an application** from the main interface
3. **Click "Install"** to begin the installation process
4. **Monitor progress** through the status updates
5. **Access your application** using the provided URLs

## 📱 Application Details

### Evolution API
- **Purpose**: WhatsApp Business API integration
- **Port**: 8080
- **Access**: http://localhost:8080
- **Docker Image**: `codechat/evolution-api:latest`

### Typebot
- **Purpose**: Create conversational forms and chatbots
- **Port**: 3000
- **Access**: http://localhost:3000
- **Docker Image**: `baptistearno/typebot-builder:latest`

### N8N
- **Purpose**: Workflow automation and integration
- **Port**: 5678
- **Access**: http://localhost:5678
- **Docker Image**: `n8nio/n8n:latest`

### Supabase
- **Purpose**: Backend-as-a-Service platform
- **Port**: 54321
- **Access**: http://localhost:54321
- **Docker Image**: `supabase/postgres:latest`

### PostgreSQL
- **Purpose**: Relational database management system
- **Port**: 5432
- **Connection**: `postgresql://user:password@localhost:5432`
- **Docker Image**: `postgres:15`

## 🏗️ Development

### Project Structure

```
AutomaFy/
├── src/
│   ├── main.js          # Electron main process
│   ├── renderer.js      # Electron renderer process
│   └── components/      # React components (if used)
├── index.html           # Main application UI
├── package.json         # Project configuration
└── README.md           # This file
```

### Building for Production

To build the application for distribution:

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 🔧 Configuration

### Docker Settings

Each application is configured with the following Docker settings:

- **Container Names**: Unique names for easy management
- **Port Mappings**: Standard ports mapped to localhost
- **Volume Mounts**: Persistent data storage where applicable
- **Environment Variables**: Required configuration variables

### Customizing Installations

To modify installation settings, edit the `appConfigs` object in `src/main.js`:

```javascript
const appConfigs = {
    'app-name': {
        name: 'Display Name',
        dockerCommand: 'docker run -d --name container-name ...',
        description: 'Installation description',
        successMessage: 'Success message with access URL'
    }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **"Docker is not installed" Error**
   - Ensure Docker Desktop is installed and running
   - Restart AutomaFy after starting Docker

2. **"Port already in use" Error**
   - Check if another application is using the required ports
   - Modify port mappings in the Docker commands if needed

3. **Container fails to start**
   - Check Docker logs: `docker logs <container-name>`
   - Ensure sufficient system resources are available

4. **Application not accessible**
   - Verify the application started successfully
   - Check firewall settings for the required ports

### Debug Mode

To run in development mode with DevTools:

```bash
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow the existing code style
2. Add proper error handling
3. Update documentation for new features
4. Test on multiple platforms when possible

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review Docker and application-specific documentation
3. Create an issue in the project repository

## 🔄 Updates

The application uses the latest available Docker images for each service. To update an installed application:

```bash
# Stop the container
docker stop <container-name>

# Remove the container
docker rm <container-name>

# Reinstall using AutomaFy
```

## ⚠️ Important Notes

- **Data Persistence**: Some applications use Docker volumes for data persistence
- **Security**: Default passwords are used for development. Change them in production
- **Resources**: Ensure sufficient system resources (RAM, CPU, disk space)
- **Network**: Applications may require internet access for initial setup and updates

---

**Made with ❤️ for developers who want to focus on building, not configuring.**
