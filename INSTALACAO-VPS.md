# 🚀 AutomaFy Web - Instalação em VPS

## 📋 Instalação com UM ÚNICO COMANDO

### 🎯 Opção 1: Instalação Completa (Recomendada)
```bash
curl -fsSL https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/quick-install.sh | sudo bash
```

### 🎯 Opção 2: Instalação Simplificada
```bash
curl -fsSL https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/install.sh | sudo bash
```

### 🧪 Opção 3: Testar Antes de Instalar
```bash
curl -fsSL https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/test-install.sh | sudo bash
```

---

## 🛠️ Requisitos Mínimos

- **VPS/Servidor**: Linux (Ubuntu 18.04+, Debian 9+, CentOS 7+)
- **RAM**: 2GB mínimo (4GB+ recomendado)
- **Armazenamento**: 20GB mínimo (50GB+ recomendado)
- **Acesso**: Root ou sudo
- **Rede**: Conexão com internet

---

## 📦 O que será instalado automaticamente:

### 🔧 Dependências do Sistema:
- ✅ **Docker** + **Docker Compose**
- ✅ **Node.js 18.x** + **NPM**
- ✅ **PM2** (Process Manager)
- ✅ **Git**, **Curl**, **Wget**, **Unzip**

### 🐳 Containers Essenciais:
- ✅ **Redis** (Banco de dados em memória)
- ✅ **RedisInsight** (Interface para Redis)
- ✅ **Traefik** (Proxy reverso + SSL automático)
- ✅ **Portainer** (Gerenciador Docker)

### 🌐 Aplicação Principal:
- ✅ **AutomaFy Web** (Interface principal)
- ✅ **50+ Aplicações** prontas para instalação

---

## 🌐 Acessos após a instalação:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **AutomaFy Web** | `http://SEU_IP:3000` | Interface principal |
| **Portainer** | `http://SEU_IP:9000` | Gerenciador Docker |
| **Traefik Dashboard** | `http://SEU_IP:8080` | Proxy reverso |
| **RedisInsight** | `http://SEU_IP:8001` | Interface Redis |

---

## 🔐 Credenciais Padrão:

### Portainer:
- **Usuário**: `admin`
- **Senha**: Será solicitada durante a instalação

### Redis:
- **Senha**: `automafy123` (configurável)

---

## 📝 Comandos Úteis:

### Verificar status dos serviços:
```bash
sudo systemctl status automafy-web
sudo docker ps
```

### Reiniciar AutomaFy Web:
```bash
sudo systemctl restart automafy-web
```

### Ver logs do AutomaFy:
```bash
sudo journalctl -u automafy-web -f
```

### Parar/Iniciar todos os containers:
```bash
sudo docker stop $(sudo docker ps -q)
sudo docker start $(sudo docker ps -aq)
```

---

## 🔧 Personalização:

### Alterar porta do AutomaFy Web:
1. Edite o arquivo: `/opt/automafy-web/server.js`
2. Altere a linha: `const PORT = process.env.PORT || 3000;`
3. Reinicie: `sudo systemctl restart automafy-web`

### Configurar domínio personalizado:
1. Configure seu DNS para apontar para o IP da VPS
2. O Traefik automaticamente gerará certificados SSL
3. Acesse via: `https://seudominio.com`

---

## 🛡️ Segurança:

### Firewall (UFW):
```bash
# Permitir portas essenciais
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # AutomaFy Web
sudo ufw enable
```

### Backup dos dados:
```bash
# Backup dos volumes Docker
sudo docker run --rm -v automafy_data:/data -v $(pwd):/backup alpine tar czf /backup/automafy-backup.tar.gz /data
```

---

## 🚨 Solução de Problemas:

### Erro: "Port already in use"
```bash
# Verificar o que está usando a porta
sudo netstat -tulpn | grep :3000
# Parar o processo se necessário
sudo kill -9 PID_DO_PROCESSO
```

### Erro: "Docker not found"
```bash
# Reinstalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Erro: "Permission denied"
```bash
# Verificar se está executando como root
sudo su -
# Ou usar sudo antes do comando
```

### AutomaFy não inicia:
```bash
# Verificar logs
sudo journalctl -u automafy-web -n 50
# Verificar se as dependências estão instaladas
node --version
npm --version
docker --version
```

---

## 📞 Suporte:

- **GitHub Issues**: [Link do seu repositório]/issues
- **Documentação**: [Link da documentação]
- **Discord/Telegram**: [Seus canais de suporte]

---

## 🔄 Atualizações:

### Atualizar AutomaFy Web:
```bash
cd /opt/automafy-web
sudo git pull origin main
sudo npm install
sudo systemctl restart automafy-web
```

### Atualizar containers:
```bash
sudo docker-compose pull
sudo docker-compose up -d
```

---

## 📋 Checklist Pós-Instalação:

- [ ] ✅ Acessar `http://SEU_IP:3000`
- [ ] ✅ Configurar Portainer (`http://SEU_IP:9000`)
- [ ] ✅ Testar instalação de uma aplicação
- [ ] ✅ Configurar firewall
- [ ] ✅ Configurar backup automático
- [ ] ✅ Configurar domínio (opcional)
- [ ] ✅ Configurar SSL (automático com Traefik)

---

**🎉 Pronto! Seu AutomaFy Web está instalado e funcionando!**

Para instalar aplicações, acesse `http://SEU_IP:3000` e escolha entre as 50+ opções disponíveis.