# 🔧 Lookstall - Application Installer

A modern, user-friendly desktop application for installing popular development tools and APIs using Docker containers.

## 📋 Overview

Lookstall provides a graphical interface to easily install and manage the following applications:

- 🚀 **Evolution API** - WhatsApp API for businesses
- 💬 **Typebot** - Conversational forms builder
- ⚡ **N8N** - Workflow automation tool
- 🗄️ **Supabase** - Open source Firebase alternative
- 🐘 **PostgreSQL** - Advanced open source database

## ✨ Features

- **One-Click Installation**: Install applications with a single click
- **Docker Integration**: Uses Docker containers for isolated, clean installations
- **Real-time Progress**: Live status updates during installation
- **Automatic Management**: Handles container lifecycle (start/stop/restart)
- **Modern UI**: Clean, responsive interface built with Electron
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 🛠️ Prerequisites

Before using Lookstall, ensure you have the following installed:

1. **Docker**: Required for running application containers
   - Download from [docker.com](https://www.docker.com/get-started)
   - Make sure Docker is running before using Lookstall

2. **Node.js** (for development): Version 14.0.0 or higher
   - Download from [nodejs.org](https://nodejs.org/)

## 🚀 Quick Start

### Installation

1. Clone or download the Lookstall project
2. Navigate to the project directory:
   ```bash
   cd lookstall
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

1. **Launch Lookstall** using `npm start`
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
lookstall/
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
   - Restart Lookstall after starting Docker

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

# Reinstall using Lookstall
```

## ⚠️ Important Notes

- **Data Persistence**: Some applications use Docker volumes for data persistence
- **Security**: Default passwords are used for development. Change them in production
- **Resources**: Ensure sufficient system resources (RAM, CPU, disk space)
- **Network**: Applications may require internet access for initial setup and updates

---

**Made with ❤️ for developers who want to focus on building, not configuring.**