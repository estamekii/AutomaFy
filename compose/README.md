# Docker Compose Templates - AutomaFy

Este diretório contém arquivos Docker Compose individuais para cada aplicação do AutomaFy, organizados por categoria.

## Estrutura de Pastas

```
compose/
├── atendimento-crm/          # Aplicações de Atendimento & CRM
├── automacao-ia/             # Aplicações de Automação & IA
├── chatbots-comunicacao/     # Aplicações de Chatbots & Comunicação
├── bancos-storage/           # Bancos de Dados & Storage
├── nocode-lowcode/           # Aplicações No-Code & Low-Code
├── desenvolvimento-cms/      # Desenvolvimento Web & CMS
├── analytics-monitoramento/  # Analytics & Monitoramento
├── seguranca-auth/          # Segurança & Autenticação
├── gestao-produtividade/    # Gestão & Produtividade
├── ferramentas-utilitarios/ # Ferramentas & Utilitários
├── educacao-documentacao/   # Educação & Documentação
├── formularios-pesquisas/   # Formulários & Pesquisas
├── busca-vetores/           # Busca & Vetores
├── mensageria-apis/         # Mensageria & APIs
├── erp-business/            # ERP & Business
└── webscraping-automacao/   # Web Scraping & Automação
```

## Como Usar

### Instalação Individual

Para instalar uma aplicação específica, navegue até o diretório da categoria e execute:

```bash
# Exemplo: Instalar Chatwoot
cd compose/atendimento-crm/
docker-compose -f chatwoot.yml up -d
```

### Verificar Status

```bash
# Ver containers em execução
docker-compose -f chatwoot.yml ps

# Ver logs
docker-compose -f chatwoot.yml logs -f
```

### Parar Aplicação

```bash
# Parar containers
docker-compose -f chatwoot.yml down

# Parar e remover volumes (CUIDADO: remove dados)
docker-compose -f chatwoot.yml down -v
```

## Aplicações Disponíveis

### Atendimento & CRM
- **chatwoot.yml** - Plataforma de atendimento ao cliente (Porta: 3000)
- **evolution-api.yml** - API para WhatsApp (Porta: 8080)
- **woofed-crm.yml** - Sistema CRM (Porta: 8000)
- **twentycrm.yml** - CRM moderno (Porta: 3001)
- **krayin-crm.yml** - CRM Laravel (Porta: 8081)
- **mautic.yml** - Automação de marketing (Porta: 8082)

### Automação & IA
- **n8n.yml** - Automação de workflows (Porta: 5678)
- **flowise.yml** - Construtor de fluxos AI (Porta: 3002)
- **dify-ai.yml** - Plataforma AI (API: 5001, Web: 3003)
- **ollama.yml** - Modelos LLM locais (Porta: 11434)
- **langflow.yml** - Construtor visual de LLM (Porta: 7860)
- **langfuse.yml** - Observabilidade LLM (Porta: 3004)
- **anything-llm.yml** - Interface LLM universal (Porta: 3005)
- **evo-ai.yml** - Plataforma AI evolutiva (Porta: 3006)

### Chatbots & Comunicação
- **typebot.yml** - Construtor de chatbots (Builder: 3007, Viewer: 3008)
- **botpress.yml** - Plataforma de chatbots (Porta: 3009)
- **chatwoot-mega.yml** - Chatwoot versão expandida (Porta: 3010)
- **mattermost.yml** - Plataforma de comunicação (Porta: 8065)
- **humhub.yml** - Rede social empresarial (Porta: 8083)

### Bancos de Dados & Storage
- **minio.yml** - Object storage (API: 9000, Console: 9001)
- **pgadmin4.yml** - Interface PostgreSQL (Porta: 5050)
- **mongodb.yml** - MongoDB + Mongo Express (DB: 27017, Web: 8084)
- **supabase.yml** - Backend-as-a-Service (Studio: 54321, API: 8000)

## Configurações Importantes

### Portas
Cada aplicação usa portas únicas para evitar conflitos. Consulte a lista acima para as portas específicas.

### Volumes
Todos os dados são persistidos em volumes Docker nomeados. Os volumes seguem o padrão `{aplicacao}_data`.

### Redes
Cada aplicação tem sua própria rede isolada para segurança.

### Variáveis de Ambiente
As configurações padrão estão definidas nos arquivos. Para produção, altere:
- Senhas padrão
- Chaves secretas
- URLs de callback

## Troubleshooting

### Conflitos de Porta
Se uma porta estiver em uso, edite o arquivo YAML e altere a porta externa:
```yaml
ports:
  - "NOVA_PORTA:PORTA_INTERNA"
```

### Problemas de Permissão
```bash
# Verificar logs para erros de permissão
docker-compose -f app.yml logs

# Ajustar permissões do volume se necessário
docker-compose -f app.yml exec service_name chown -R user:group /path
```

### Limpeza Completa
```bash
# Remover tudo (containers, volumes, redes)
docker-compose -f app.yml down -v --remove-orphans
docker system prune -a
```

## Suporte

Para problemas específicos de uma aplicação, consulte a documentação oficial da respectiva ferramenta.