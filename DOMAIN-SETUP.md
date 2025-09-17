# Configuração de Domínios Personalizados - AutomaFy Web

Este guia explica como configurar domínios personalizados durante a instalação do AutomaFy Web.

## 🌐 Domínios Suportados

Durante a instalação, você pode configurar domínios personalizados para:

- **AutomaFy Web** - Interface principal da aplicação
- **Portainer** - Gerenciamento de containers Docker
- **Traefik Dashboard** - Painel do proxy reverso
- **RedisInsight** - Interface de gerenciamento do Redis

## 📋 Pré-requisitos

1. **Domínios configurados**: Certifique-se de que os domínios apontam para o IP do seu servidor
2. **Portas abertas**: As portas 80 (HTTP) e 443 (HTTPS) devem estar acessíveis
3. **Email válido**: Necessário para geração de certificados SSL Let's Encrypt

## 🚀 Como Usar

### Durante a Instalação

Quando executar o script `quick-install.sh`, você será questionado sobre:

```bash
# Exemplo de configuração
AutomaFy Web Domain: app.meudominio.com
Portainer Domain: portainer.meudominio.com  
Traefik Dashboard Domain: traefik.meudominio.com
RedisInsight Domain: redis.meudominio.com
SSL Email: admin@meudominio.com
```

### Configuração de DNS

Antes da instalação, configure os registros DNS:

```
A    app.meudominio.com        → IP_DO_SERVIDOR
A    portainer.meudominio.com  → IP_DO_SERVIDOR
A    traefik.meudominio.com    → IP_DO_SERVIDOR
A    redis.meudominio.com      → IP_DO_SERVIDOR
```

## 🔒 Certificados SSL

- **Automático**: Certificados Let's Encrypt são gerados automaticamente
- **Renovação**: Renovação automática configurada
- **Redirecionamento**: HTTP é automaticamente redirecionado para HTTPS

## 📱 Acesso às Aplicações

### Com Domínios Configurados:
- AutomaFy Web: `https://app.meudominio.com`
- Portainer: `https://portainer.meudominio.com`
- Traefik: `https://traefik.meudominio.com`
- RedisInsight: `https://redis.meudominio.com`

### Sem Domínios (Padrão):
- AutomaFy Web: `http://IP_SERVIDOR:3000`
- Portainer: `http://IP_SERVIDOR:9000`
- Traefik: `http://IP_SERVIDOR:8080`
- RedisInsight: `http://IP_SERVIDOR:8001`

## 🛠️ Configuração Manual

Se precisar alterar os domínios após a instalação:

1. **Parar containers**:
```bash
docker stop automafy-web portainer traefik redisinsight
```

2. **Editar configuração do Traefik**:
```bash
nano /opt/automafy/traefik.yml
```

3. **Recriar containers** com novos labels de domínio

## 🔧 Troubleshooting

### Certificado SSL não gerado:
- Verifique se o domínio aponta para o servidor
- Confirme que as portas 80/443 estão abertas
- Verifique logs: `docker logs traefik`

### Domínio não acessível:
- Confirme configuração DNS
- Verifique firewall do servidor
- Teste conectividade: `curl -I http://seudominio.com`

### Erro de proxy:
- Verifique se containers estão rodando: `docker ps`
- Consulte logs do Traefik: `docker logs traefik`

## 📞 Suporte

Para suporte adicional:
- Verifique logs dos containers: `docker logs [container_name]`
- Consulte documentação do Traefik: https://doc.traefik.io/traefik/
- Documentação Let's Encrypt: https://letsencrypt.org/docs/