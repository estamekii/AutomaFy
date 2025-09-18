# Como Criar a Release v1.1.0 no GitHub

## 📋 Situação Atual

A **tag v1.1.0 foi criada e enviada** para o GitHub, mas ainda não foi convertida em uma **Release oficial**.

### 🔍 **Verificação**
- ✅ Tag v1.1.0 existe no repositório
- ✅ Commits foram enviados para o GitHub
- ⏳ Release precisa ser criada manualmente

## 🛠️ **Opções para Criar a Release**

### **Opção 1: Script PowerShell Automatizado**

Use o script `create-release.ps1` que foi criado:

```powershell
# Você precisará de um token do GitHub
# Crie em: https://github.com/settings/tokens
# Permissões necessárias: repo (Full control of private repositories)

.\create-release.ps1 -GitHubToken "seu_token_aqui"
```

### **Opção 2: Interface Web do GitHub (Recomendado)**

1. **Acesse a página de releases:**
   ```
   https://github.com/estamekii/AutomaFy/releases
   ```

2. **Clique em "Create a new release"**

3. **Configure a release:**
   - **Choose a tag:** Selecione `v1.1.0` (já existe)
   - **Release title:** `AutomaFy v1.1.0 - Suporte a Domínios Personalizados`
   - **Describe this release:** Cole o conteúdo do arquivo `RELEASE-NOTES-v1.1.0.md`

4. **Marque como "Set as the latest release"**

5. **Clique em "Publish release"**

### **Opção 3: GitHub CLI (Após Reinicialização)**

Se o GitHub CLI estiver funcionando:
```bash
gh release create v1.1.0 \
  --title "AutomaFy v1.1.0 - Suporte a Domínios Personalizados" \
  --notes-file RELEASE-NOTES-v1.1.0.md \
  --latest
```

## 📝 **Conteúdo para a Descrição da Release**

Use o arquivo `RELEASE-NOTES-v1.1.0.md` ou cole este conteúdo na descrição da release:

```markdown
## 🚀 Suporte a Domínios Personalizados com SSL Automático

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

- `quick-install.sh` - Script principal de instalação
- `Dockerfile` - Container otimizado para AutomaFy Web
- `DOMAIN-SETUP.md` - Documentação completa
- `RELEASE-NOTES-v1.1.0.md` - Release notes detalhadas

### 📋 **Como Usar**

```bash
# Download do script
wget https://raw.githubusercontent.com/estamekii/AutomaFy/main/quick-install.sh
chmod +x quick-install.sh

# Execução
sudo ./quick-install.sh
```

### 🔧 **Requisitos**

- **Sistema:** Ubuntu 20.04+ / Debian 11+
- **Recursos:** 2GB RAM, 20GB disco
- **Rede:** Portas 80/443 abertas
- **DNS:** Domínios apontando para o servidor (opcional)

### 📞 **Suporte**

- **Documentação:** [DOMAIN-SETUP.md](./DOMAIN-SETUP.md)
- **Issues:** [GitHub Issues](https://github.com/estamekii/AutomaFy/issues)

---

**Versão Anterior:** [v1.0.1](https://github.com/estamekii/AutomaFy/releases/tag/v1.0.1)
```

6. Marque como "Latest release"
7. Clique em "Publish release"

## Opção 2: Via GitHub CLI (se instalado)

```bash
gh release create v1.1.0 \
  --title "AutomaFy v1.1.0 - Suporte a Domínios Personalizados" \
  --notes-file RELEASE-NOTES-v1.1.0.md \
  --latest
```

## Verificação

Após criar a release:
1. Acesse https://github.com/estamekii/AutomaFy/releases
2. Verifique se v1.1.0 aparece como "Latest"
3. Confirme se todos os arquivos estão disponíveis para download

## Status Atual

✅ Tag v1.1.0 criada e enviada  
✅ Commits enviados para o GitHub  
✅ Release notes criadas  
⏳ Release precisa ser criada na interface do GitHub  

A tag está disponível em: https://github.com/estamekii/AutomaFy/releases/tag/v1.1.0