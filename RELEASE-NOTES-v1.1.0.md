# Release Notes - AutomaFy v1.1.0

## 🚀 Suporte a Domínios Personalizados com SSL Automático

**Data de Lançamento:** $(date +"%d/%m/%Y")

### ✨ Principais Funcionalidades

#### 🌐 **Configuração de Domínios Personalizados**
- Configuração interativa durante a instalação
- Suporte para domínios personalizados em todos os serviços:
  - AutomaFy Web
  - Portainer
  - Traefik Dashboard
  - RedisInsight

#### 🔒 **SSL Automático**
- Certificados Let's Encrypt gerados automaticamente
- Renovação automática configurada
- Redirecionamento HTTP → HTTPS
- Configuração de email para certificados SSL

#### 🐳 **Containerização Completa**
- AutomaFy Web agora roda em container Docker
- Dockerfile otimizado com Node.js 18 Alpine
- Health checks configurados
- Usuário não-root para segurança

#### 🔧 **Proxy Reverso Inteligente**
- Traefik configurado automaticamente
- Roteamento baseado em domínios
- Fallback para IP:porta quando domínios não são configurados
- Labels Docker automáticos

#### 🛡️ **Firewall Inteligente**
- Configuração automática do UFW
- Abertura seletiva de portas baseada na configuração
- Portas 80/443 sempre abertas para SSL
- Portas específicas apenas quando necessário

### 📁 **Novos Arquivos**

#### `quick-install.sh`
Script principal de instalação com:
- Configuração interativa de domínios
- Instalação automatizada de todos os serviços
- Configuração de SSL e proxy reverso
- Validação de entrada e feedback visual

#### `Dockerfile`
Container otimizado para AutomaFy Web:
- Imagem base Node.js 18 Alpine
- Usuário não-root (automafy)
- Health check configurado
- Exposição da porta 3000

#### `DOMAIN-SETUP.md`
Documentação completa incluindo:
- Guia de configuração de DNS
- Exemplos de uso
- Troubleshooting
- Comandos úteis

### 🔄 **Melhorias na Experiência do Usuário**

#### **Interface de Instalação**
- Prompts coloridos e informativos
- Validação de entrada em tempo real
- Detecção automática do IP do servidor
- Feedback visual durante o processo

#### **Configuração Flexível**
- Funciona com ou sem domínios
- Configuração opcional de cada serviço
- Fallback automático para IP:porta
- Preservação de configurações existentes

#### **Documentação Aprimorada**
- Guias passo-a-passo
- Exemplos práticos
- Seção de troubleshooting
- Comandos de manutenção

### 🛠️ **Melhorias Técnicas**

#### **Segurança**
- Containers com usuários não-root
- Firewall configurado automaticamente
- Certificados SSL válidos
- Isolamento de serviços

#### **Manutenibilidade**
- Logs centralizados via Docker
- Comandos de gerenciamento simplificados
- Configuração via variáveis de ambiente
- Backup automático de credenciais

#### **Performance**
- Containers otimizados
- Health checks configurados
- Restart automático
- Recursos limitados adequadamente

### 📋 **Como Usar**

1. **Download do script:**
   ```bash
   wget https://raw.githubusercontent.com/estamekii/AutomaFy/main/quick-install.sh
   chmod +x quick-install.sh
   ```

2. **Execução:**
   ```bash
   sudo ./quick-install.sh
   ```

3. **Configuração de domínios:**
   - Siga os prompts interativos
   - Configure DNS antes da instalação
   - Forneça email válido para SSL

### 🔧 **Requisitos**

- **Sistema:** Ubuntu 20.04+ / Debian 11+
- **Recursos:** 2GB RAM, 20GB disco
- **Rede:** Portas 80/443 abertas
- **DNS:** Domínios apontando para o servidor (opcional)

### 🆕 **Migração da v1.0.1**

Para usuários da versão anterior:
1. Faça backup dos dados existentes
2. Execute o novo script de instalação
3. Configure domínios conforme necessário
4. Migre dados se necessário

### 🐛 **Correções**

- Corrigido problema de permissões em instalações anteriores
- Melhorada estabilidade dos containers
- Corrigidos conflitos de porta
- Melhorada detecção de IP do servidor

### 📞 **Suporte**

- **Documentação:** [DOMAIN-SETUP.md](./DOMAIN-SETUP.md)
- **Issues:** [GitHub Issues](https://github.com/estamekii/AutomaFy/issues)
- **Logs:** `docker logs [container_name]`

### 🎯 **Próximas Versões**

- Suporte a múltiplos domínios por serviço
- Interface web para configuração
- Backup automático
- Monitoramento integrado
- Suporte a outros provedores SSL

---

**Versão Anterior:** [v1.0.1](https://github.com/estamekii/AutomaFy/releases/tag/v1.0.1)  
**Código Fonte:** [GitHub](https://github.com/estamekii/AutomaFy)  
**Documentação:** [README.md](./README.md)