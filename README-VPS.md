# AutomaFy Web - VPS Version

Versão web do AutomaFy para uso em VPS (Virtual Private Server).

## 📋 Pré-requisitos

- VPS com Ubuntu 18.04+ ou Debian 10+
- Acesso root ou sudo
- Conexão com a internet
- Porta 3000 disponível

## 🚀 Instalação Automática

### Método 1: Script de Instalação (Recomendado)

```bash
# Baixe os arquivos para seu VPS
wget https://github.com/seu-usuario/automafy-web/archive/main.zip
unzip main.zip
cd automafy-web-main

# Execute o script de instalação
sudo chmod +x install-vps.sh
sudo ./install-vps.sh
```

### 🔐 Configuração Durante a Instalação

Durante o processo de instalação, você será solicitado a:

1. **Definir credenciais do Portainer**:
   - Nome de usuário admin (mínimo 3 caracteres)
   - Senha admin (mínimo 8 caracteres)

Essas credenciais serão configuradas automaticamente, permitindo acesso imediato ao Portainer após a instalação.

## 🔧 Instalação Manual

### 1. Instalar Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Configurar Aplicação

```bash
# Criar diretório da aplicação
sudo mkdir -p /opt/automafy-web
cd /opt/automafy-web

# Copiar arquivos
sudo cp /caminho/para/server.js .
sudo cp /caminho/para/web.html .
sudo cp /caminho/para/web-renderer.js .
sudo cp /caminho/para/package-web.json ./package.json

# Instalar dependências
npm install --production
```

### 4. Criar Serviço Systemd

```bash
sudo nano /etc/systemd/system/automafy-web.service
```

Conteúdo do arquivo:

```ini
[Unit]
Description=AutomaFy Web Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/automafy-web
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### 5. Iniciar Serviço

```bash
sudo systemctl daemon-reload
sudo systemctl enable automafy-web
sudo systemctl start automafy-web
```

## 🌐 Acesso

Após a instalação, você terá acesso aos seguintes serviços:

### Aplicações Principais
```
• AutomaFy Web: http://SEU_IP_VPS:3000
• Portainer: http://SEU_IP_VPS:9000
• Traefik Dashboard: http://SEU_IP_VPS:8080
• RedisInsight: http://SEU_IP_VPS:8001
• Redis: SEU_IP_VPS:6379
```

### Serviços Instalados Automaticamente
- **🔧 AutomaFy Web** - Interface principal para instalação de aplicações
- **🐳 Portainer** - Interface gráfica para gerenciar containers Docker (usuário admin configurado automaticamente)
- **🌐 Traefik** - Proxy reverso e load balancer
- **🔴 Redis** - Cache e banco de dados em memória
- **📊 RedisInsight** - Interface gráfica moderna para gerenciar e monitorar Redis

## 📊 Comandos Úteis

### Gerenciamento do Serviço

```bash
# Verificar status
sudo systemctl status automafy-web

# Ver logs
sudo journalctl -u automafy-web -f

# Reiniciar
sudo systemctl restart automafy-web

# Parar
sudo systemctl stop automafy-web

# Iniciar
sudo systemctl start automafy-web
```

### Gerenciamento Docker

```bash
# Listar containers
docker ps -a

# Ver logs de um container
docker logs CONTAINER_NAME

# Parar container
docker stop CONTAINER_NAME

# Remover container
docker rm CONTAINER_NAME

# Verificar status dos serviços essenciais
docker ps --filter "name=redis|redisinsight|portainer|traefik"
```

### Gerenciamento dos Serviços Essenciais

```bash
# Redis
docker logs redis
docker restart redis

# RedisInsight
docker logs redisinsight
docker restart redisinsight

# Portainer
docker logs portainer
docker restart portainer

# Traefik
docker logs traefik
docker restart traefik

# Verificar volumes
docker volume ls
```

## 🔧 Configuração de Firewall

### UFW (Ubuntu)

```bash
sudo ufw allow 3000/tcp
sudo ufw enable
```

### iptables

```bash
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

## 🔒 Segurança

### Configurar Proxy Reverso (Nginx)

```bash
# Instalar Nginx
sudo apt install nginx

# Configurar site
sudo nano /etc/nginx/sites-available/automafy
```

Conteúdo:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/automafy /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 🐛 Solução de Problemas

### Aplicação não inicia

```bash
# Verificar logs
sudo journalctl -u automafy-web -n 50

# Verificar se a porta está em uso
sudo netstat -tlnp | grep :3000

# Verificar permissões
ls -la /opt/automafy-web/
```

### Docker não funciona

```bash
# Verificar se Docker está rodando
sudo systemctl status docker

# Verificar permissões do usuário
sudo usermod -aG docker $USER
# (necessário logout/login)
```

### Porta 3000 bloqueada

```bash
# Verificar firewall
sudo ufw status

# Verificar iptables
sudo iptables -L

# Testar conectividade
telnet SEU_IP 3000
```

## 📝 Logs

- **Aplicação**: `sudo journalctl -u automafy-web -f`
- **Docker**: `docker logs CONTAINER_NAME`
- **Nginx**: `/var/log/nginx/access.log` e `/var/log/nginx/error.log`

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# Parar serviço
sudo systemctl stop automafy-web

# Atualizar arquivos
cd /opt/automafy-web
# Copiar novos arquivos...

# Reinstalar dependências se necessário
npm install --production

# Reiniciar serviço
sudo systemctl start automafy-web
```

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs da aplicação
2. Confirme que Docker está funcionando
3. Verifique configurações de firewall
4. Teste conectividade de rede

---

**AutomaFy Web** - Instalador de aplicações para VPS