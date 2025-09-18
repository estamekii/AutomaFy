# AutomaFy Web - Instalação Rápida via GitHub

## 🚀 Instalação com Um Único Comando

Execute este comando na sua VPS para instalar automaticamente o AutomaFy Web diretamente do GitHub:

```bash
curl -fsSL https://raw.githubusercontent.com/estamekii/AutomaFy/main/quick-install.sh | sudo bash
```

### ⚡ Instalação Ultra-Rápida (Alternativa)

Se preferir um comando ainda mais curto, você pode usar:

```bash
wget -qO- https://raw.githubusercontent.com/estamekii/AutomaFy/main/quick-install.sh | sudo bash
```

## 📋 O que será instalado automaticamente:

### 🔧 Dependências do Sistema:
- **Docker** - Runtime de containers
- **Node.js 18** - Runtime JavaScript
- **PM2** - Gerenciador de processos
- **Git, Curl, Wget** - Ferramentas essenciais

### 🐳 Containers Docker Essenciais:
- **Redis** - Banco de dados em memória
- **RedisInsight** - Interface gráfica para Redis
- **Traefik** - Proxy reverso e load balancer
- **Portainer** - Interface gráfica para Docker

### 🌐 AutomaFy Web:
- **Interface Web** - Painel de instalação de aplicações
- **50+ Aplicações** - Prontas para instalação com 1 clique
- **Configuração Automática** - Domínios, SSL, redes Docker

## 🔐 Credenciais Geradas Automaticamente

Após a instalação, as credenciais do Portainer serão salvas em:
```
/root/automafy-credentials.txt
```

## 🌐 Acessos após a instalação:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **AutomaFy Web** | `http://SEU_IP:3000` | Painel principal de instalação |
| **Portainer** | `http://SEU_IP:9000` | Gerenciamento Docker |
| **Traefik** | `http://SEU_IP:8080` | Dashboard do proxy |
| **RedisInsight** | `http://SEU_IP:8001` | Interface do Redis |

## 📦 Requisitos do Sistema

### Sistemas Operacionais Suportados:
- ✅ Ubuntu 18.04+
- ✅ Debian 9+
- ✅ CentOS 7+
- ✅ Rocky Linux 8+
- ✅ Red Hat Enterprise Linux 7+

### Recursos Mínimos:
- **RAM**: 2GB (recomendado 4GB+)
- **CPU**: 1 vCore (recomendado 2+ vCores)
- **Disco**: 20GB livres (recomendado 50GB+)
- **Rede**: Conexão com internet

## 🔧 Comandos Úteis Pós-Instalação

### Verificar Status dos Serviços:
```bash
# Status do AutomaFy Web
systemctl status automafy-web

# Logs do AutomaFy Web
journalctl -u automafy-web -f

# Status dos containers Docker
docker ps

# Verificar uso de recursos
docker stats
```

### Gerenciar o AutomaFy Web:
```bash
# Reiniciar serviço
systemctl restart automafy-web

# Parar serviço
systemctl stop automafy-web

# Iniciar serviço
systemctl start automafy-web

# Desabilitar inicialização automática
systemctl disable automafy-web
```

### Backup e Manutenção:
```bash
# Backup dos dados do Portainer
docker run --rm -v portainer_data:/data -v $(pwd):/backup alpine tar czf /backup/portainer-backup.tar.gz -C /data .

# Backup dos dados do Redis
docker exec redis redis-cli BGSAVE

# Limpar containers não utilizados
docker system prune -f

# Atualizar containers
docker-compose pull && docker-compose up -d
```

## 🛠️ Personalização da Instalação

### Antes de executar o script, você pode personalizar:

1. **Editar o script** para alterar portas padrão
2. **Configurar domínio personalizado** para SSL automático
3. **Definir credenciais específicas** para Portainer

### Exemplo com domínio personalizado:
```bash
# Definir variáveis antes da instalação
export DOMAIN="automafy.seudominio.com"
export EMAIL="admin@seudominio.com"

# Executar instalação
curl -fsSL https://raw.githubusercontent.com/estamekii/AutomaFy/main/quick-install.sh | sudo bash
```

## 🔒 Segurança

### Configurações de Segurança Aplicadas:
- ✅ Firewall configurado automaticamente
- ✅ Containers isolados em redes Docker
- ✅ Credenciais geradas aleatoriamente
- ✅ SSL/TLS pronto para configuração
- ✅ Usuário não-root para aplicação

### Recomendações Adicionais:
1. **Altere as credenciais padrão** após a instalação
2. **Configure SSL** para domínios em produção
3. **Mantenha o sistema atualizado** regularmente
4. **Faça backups** dos dados importantes

## 🆘 Solução de Problemas

### Problemas Comuns:

#### 1. Erro de permissão:
```bash
# Certifique-se de executar com sudo
sudo bash quick-install.sh
```

#### 2. Docker não inicia:
```bash
# Verificar status do Docker
systemctl status docker

# Reiniciar Docker
systemctl restart docker
```

#### 3. Porta já em uso:
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000

# Parar processo na porta
sudo fuser -k 3000/tcp
```

#### 4. Problemas de rede:
```bash
# Verificar conectividade
ping google.com

# Verificar DNS
nslookup github.com
```

## 📞 Suporte

Se encontrar problemas durante a instalação:

1. **Verifique os logs** do sistema
2. **Consulte a documentação** completa
3. **Abra uma issue** no GitHub
4. **Verifique os requisitos** do sistema

## 🔄 Atualizações

Para atualizar o AutomaFy Web:

```bash
# Parar serviço
systemctl stop automafy-web

# Navegar para diretório
cd /opt/automafy-web

# Fazer backup
cp -r . ../automafy-web-backup

# Baixar nova versão
wget -O automafy-web.zip "https://github.com/estamekii/AutomaFy/archive/refs/heads/main.zip"
unzip -o automafy-web.zip
mv AutomaFy-main/* .
rm -rf AutomaFy-main automafy-web.zip

# Atualizar dependências
npm install --production

# Reiniciar serviço
systemctl start automafy-web
```

---

## 🎉 Pronto!

Após executar o comando de instalação, você terá um ambiente completo para instalar e gerenciar mais de 50 aplicações diferentes com apenas alguns cliques!

**Acesse:** `http://SEU_IP:3000` e comece a instalar suas aplicações favoritas! 🚀