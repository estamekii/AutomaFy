// Web version of renderer - uses fetch API instead of Electron IPC
class WebApp {
    constructor() {
        this.status = '';
        this.init();
    }

    init() {
        this.render();
        this.addButtonHandlers();
    }

    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.style.display = 'block';
            statusElement.className = `status ${type}`;
            statusElement.innerHTML = message;
        }
    }

    render() {
        const root = document.getElementById('root');
        if (!root) return;

        root.innerHTML = `
            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">💬 Atendimento & CRM <span class="app-count">6 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                    <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">💬</span>
                        <div class="app-name">Chatwoot</div>
                        <div class="app-description">Plataforma de atendimento ao cliente</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-chatwoot">Instalar Chatwoot</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🚀</span>
                        <div class="app-name">Evolution API</div>
                        <div class="app-description">API completa para WhatsApp Business</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-evolution-api">Instalar Evolution API</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Woofed CRM</div>
                        <div class="app-description">Sistema de CRM completo</div>
                        <div class="app-port">Porta: 8000</div>
                        <button class="install-btn" id="btn-woofed-crm">Instalar Woofed CRM</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">TwentyCRM</div>
                        <div class="app-description">CRM moderno e open source</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-twentycrm">Instalar TwentyCRM</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Krayin CRM</div>
                        <div class="app-description">CRM Laravel open source</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-krayin-crm">Instalar Krayin CRM</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📧</span>
                        <div class="app-name">Mautic</div>
                        <div class="app-description">Plataforma de marketing automation</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-mautic">Instalar Mautic</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🤖 Automação & IA <span class="app-count">8 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">⚡</span>
                        <div class="app-name">N8N</div>
                        <div class="app-description">Automação de workflows</div>
                        <div class="app-port">Porta: 5678</div>
                        <button class="install-btn" id="btn-n8n">Instalar N8N</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🤖</span>
                        <div class="app-name">Flowise</div>
                        <div class="app-description">Construtor visual de fluxos de IA</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-flowise">Instalar Flowise</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🧠</span>
                        <div class="app-name">Dify AI</div>
                        <div class="app-description">Plataforma de desenvolvimento de IA</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-dify-ai">Instalar Dify AI</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🦙</span>
                        <div class="app-name">Ollama</div>
                        <div class="app-description">Execute modelos de IA localmente</div>
                        <div class="app-port">Porta: 11434</div>
                        <button class="install-btn" id="btn-ollama">Instalar Ollama</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">LangFlow</div>
                        <div class="app-description">Interface visual para LangChain</div>
                        <div class="app-port">Porta: 7860</div>
                        <button class="install-btn" id="btn-langflow">Instalar LangFlow</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Langfuse</div>
                        <div class="app-description">Observabilidade para aplicações LLM</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-langfuse">Instalar Langfuse</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Anything LLM</div>
                        <div class="app-description">Interface para modelos de linguagem</div>
                        <div class="app-port">Porta: 3001</div>
                        <button class="install-btn" id="btn-anything-llm">Instalar Anything LLM</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Evo AI</div>
                        <div class="app-description">Assistente de IA avançado</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-evo-ai">Instalar Evo AI</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">💬 Chatbots & Comunicação <span class="app-count">5 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                 <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">💬</span>
                        <div class="app-name">Typebot</div>
                        <div class="app-description">Criador de chatbots conversacionais</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-typebot">Instalar Typebot</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🤖</span>
                        <div class="app-name">Botpress</div>
                        <div class="app-description">Plataforma avançada para chatbots</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-botpress">Instalar Botpress</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">💬</span>
                        <div class="app-name">Chatwoot Mega</div>
                        <div class="app-description">Versão estendida do Chatwoot</div>
                        <div class="app-port">Porta: 3001</div>
                        <button class="install-btn" id="btn-chatwoot-mega">Instalar Chatwoot Mega</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📱</span>
                        <div class="app-name">Mattermost</div>
                        <div class="app-description">Plataforma de colaboração em equipe</div>
                        <div class="app-port">Porta: 8065</div>
                        <button class="install-btn" id="btn-mattermost">Instalar Mattermost</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">HumHub</div>
                        <div class="app-description">Rede social corporativa</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-humhub">Instalar HumHub</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🗄️ Bancos de Dados & Storage <span class="app-count">7 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                    <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📦</span>
                        <div class="app-name">MinIO</div>
                        <div class="app-description">Object storage compatível com S3</div>
                        <div class="app-port">Porta: 9000</div>
                        <button class="install-btn" id="btn-minio">Instalar MinIO</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🐘</span>
                        <div class="app-name">PgAdmin 4</div>
                        <div class="app-description">Interface web para PostgreSQL</div>
                        <div class="app-port">Porta: 5050</div>
                        <button class="install-btn" id="btn-pgadmin4">Instalar PgAdmin 4</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🍃</span>
                        <div class="app-name">MongoDB</div>
                        <div class="app-description">Banco de dados NoSQL</div>
                        <div class="app-port">Porta: 27017</div>
                        <button class="install-btn" id="btn-mongodb">Instalar MongoDB</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🗄️</span>
                        <div class="app-name">Supabase</div>
                        <div class="app-description">Backend-as-a-Service com PostgreSQL</div>
                        <div class="app-port">Porta: 54321</div>
                        <button class="install-btn" id="btn-supabase">Instalar Supabase</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">ClickHouse</div>
                        <div class="app-description">Banco de dados analítico</div>
                        <div class="app-port">Porta: 8123</div>
                        <button class="install-btn" id="btn-clickhouse">Instalar ClickHouse</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔴</span>
                        <div class="app-name">RedisInsight</div>
                        <div class="app-description">Interface gráfica para Redis</div>
                        <div class="app-port">Porta: 8001</div>
                        <button class="install-btn" id="btn-redisinsight">Instalar RedisInsight</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🐬</span>
                        <div class="app-name">PhpMyAdmin</div>
                        <div class="app-description">Interface web para MySQL</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-phpmyadmin">Instalar PhpMyAdmin</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">📊 No-Code & Low-Code <span class="app-count">6 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📊</span>
                        <div class="app-name">Nocobase</div>
                        <div class="app-description">Plataforma no-code para bancos de dados</div>
                        <div class="app-port">Porta: 13000</div>
                        <button class="install-btn" id="btn-nocobase">Instalar Nocobase</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📋</span>
                        <div class="app-name">Baserow</div>
                        <div class="app-description">Alternativa open source ao Airtable</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-baserow">Instalar Baserow</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔧</span>
                        <div class="app-name">Appsmith</div>
                        <div class="app-description">Plataforma low-code para apps internos</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-appsmith">Instalar Appsmith</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">NocoDB</div>
                        <div class="app-description">Transforme bancos em planilhas inteligentes</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-nocodb">Instalar NocoDB</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">LowCoder</div>
                        <div class="app-description">Plataforma de desenvolvimento low-code</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-lowcoder">Instalar LowCoder</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">ToolJet</div>
                        <div class="app-description">Construtor de aplicações internas</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-tooljet">Instalar ToolJet</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🌐 Desenvolvimento Web & CMS <span class="app-count">4 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📝</span>
                        <div class="app-name">Wordpress</div>
                        <div class="app-description">Sistema de gerenciamento de conteúdo</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-wordpress">Instalar Wordpress</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Directus</div>
                        <div class="app-description">Headless CMS moderno</div>
                        <div class="app-port">Porta: 8055</div>
                        <button class="install-btn" id="btn-directus">Instalar Directus</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Strapi</div>
                        <div class="app-description">Headless CMS flexível</div>
                        <div class="app-port">Porta: 1337</div>
                        <button class="install-btn" id="btn-strapi">Instalar Strapi</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">NextCloud</div>
                        <div class="app-description">Plataforma de colaboração e armazenamento</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-nextcloud">Instalar NextCloud</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">📊 Analytics & Monitoramento <span class="app-count">6 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📊</span>
                        <div class="app-name">Metabase</div>
                        <div class="app-description">Plataforma de business intelligence</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-metabase">Instalar Metabase</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📈</span>
                        <div class="app-name">Uptime Kuma</div>
                        <div class="app-description">Monitor de uptime e status</div>
                        <div class="app-port">Porta: 3001</div>
                        <button class="install-btn" id="btn-uptime-kuma">Instalar Uptime Kuma</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📊</span>
                        <div class="app-name">Grafana</div>
                        <div class="app-description">Plataforma de observabilidade</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-grafana">Instalar Grafana</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📊</span>
                        <div class="app-name">Prometheus</div>
                        <div class="app-description">Sistema de monitoramento</div>
                        <div class="app-port">Porta: 9090</div>
                        <button class="install-btn" id="btn-prometheus">Instalar Prometheus</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📊</span>
                        <div class="app-name">cAdvisor</div>
                        <div class="app-description">Monitor de containers</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-cadvisor">Instalar cAdvisor</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Traccar</div>
                        <div class="app-description">Sistema de rastreamento GPS</div>
                        <div class="app-port">Porta: 8082</div>
                        <button class="install-btn" id="btn-traccar">Instalar Traccar</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🔐 Segurança & Autenticação <span class="app-count">3 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                      <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">🔐</span>
                        <div class="app-name">VaultWarden</div>
                        <div class="app-description">Gerenciador de senhas</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-vaultwarden">Instalar VaultWarden</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Keycloak</div>
                        <div class="app-description">Gerenciamento de identidade</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-keycloak">Instalar Keycloak</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Passbolt</div>
                        <div class="app-description">Gerenciador de senhas colaborativo</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-passbolt">Instalar Passbolt</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">📋 Gestão & Produtividade <span class="app-count">6 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                    <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📅</span>
                        <div class="app-name">Cal.com</div>
                        <div class="app-description">Agendamento de reuniões</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-cal-com">Instalar Cal.com</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📋</span>
                        <div class="app-name">Planka</div>
                        <div class="app-description">Gerenciamento de projetos estilo Trello</div>
                        <div class="app-port">Porta: 1337</div>
                        <button class="install-btn" id="btn-planka">Instalar Planka</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📝</span>
                        <div class="app-name">Outline</div>
                        <div class="app-description">Wiki e base de conhecimento</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-outline">Instalar Outline</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📋</span>
                        <div class="app-name">Focalboard</div>
                        <div class="app-description">Gerenciamento de projetos e tarefas</div>
                        <div class="app-port">Porta: 8000</div>
                        <button class="install-btn" id="btn-focalboard">Instalar Focalboard</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">OpenProject</div>
                        <div class="app-description">Gerenciamento de projetos colaborativo</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-openproject">Instalar OpenProject</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">GLPI</div>
                        <div class="app-description">Sistema de helpdesk e inventário</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-glpi">Instalar GLPI</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🔧 Ferramentas & Utilitários <span class="app-count">6 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📝</span>
                        <div class="app-name">Affine</div>
                        <div class="app-description">Editor de documentos colaborativo</div>
                        <div class="app-port">Porta: 3010</div>
                        <button class="install-btn" id="btn-affine">Instalar Affine</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🎨</span>
                        <div class="app-name">Excalidraw</div>
                        <div class="app-description">Ferramenta de desenho colaborativo</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-excalidraw">Instalar Excalidraw</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📄</span>
                        <div class="app-name">Stirling PDF</div>
                        <div class="app-description">Manipulação de arquivos PDF</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-stirling-pdf">Instalar Stirling PDF</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">WiseMapping</div>
                        <div class="app-description">Criador de mapas mentais</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-wisemapping">Instalar WiseMapping</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Yourls</div>
                        <div class="app-description">Encurtador de URLs</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-yourls">Instalar Yourls</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📧</span>
                        <div class="app-name">Ntfy</div>
                        <div class="app-description">Serviço de notificações push</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-ntfy">Instalar Ntfy</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">📚 Educação & Documentação <span class="app-count">2 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📚</span>
                        <div class="app-name">Moodle</div>
                        <div class="app-description">Plataforma de ensino à distância</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-moodle">Instalar Moodle</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📄</span>
                        <div class="app-name">Documeso</div>
                        <div class="app-description">Sistema de gerenciamento de documentos</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-documeso">Instalar Documeso</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">📋 Formulários & Pesquisas <span class="app-count">3 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">📋</span>
                        <div class="app-name">Formbricks</div>
                        <div class="app-description">Plataforma de pesquisas e feedback</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-formbricks">Instalar Formbricks</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📝</span>
                        <div class="app-name">Docuseal</div>
                        <div class="app-description">Assinatura digital de documentos</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-docuseal">Instalar Docuseal</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📅</span>
                        <div class="app-name">Easy!Appointments</div>
                        <div class="app-description">Sistema de agendamento</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-easy-appointments">Instalar Easy!Appointments</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🔍 Busca & Vetores <span class="app-count">2 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">🔍</span>
                        <div class="app-name">Qdrant</div>
                        <div class="app-description">Banco de dados vetorial</div>
                        <div class="app-port">Porta: 6333</div>
                        <button class="install-btn" id="btn-qdrant">Instalar Qdrant</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">ZEP</div>
                        <div class="app-description">Memória para aplicações de IA</div>
                        <div class="app-port">Porta: 8000</div>
                        <button class="install-btn" id="btn-zep">Instalar ZEP</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🐰 Mensageria & APIs <span class="app-count">6 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">🐰</span>
                        <div class="app-name">RabbitMQ</div>
                        <div class="app-description">Message broker</div>
                        <div class="app-port">Porta: 15672</div>
                        <button class="install-btn" id="btn-rabbitmq">Instalar RabbitMQ</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Uno API</div>
                        <div class="app-description">API unificada para WhatsApp</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-uno-api">Instalar Uno API</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">⚡</span>
                        <div class="app-name">N8N + Nodes Quepasa</div>
                        <div class="app-description">N8N com nodes customizados</div>
                        <div class="app-port">Porta: 5678</div>
                        <button class="install-btn" id="btn-n8n-quepasa">Instalar N8N + Nodes Quepasa</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">📱</span>
                        <div class="app-name">Quepasa API</div>
                        <div class="app-description">API para WhatsApp Multi-Device</div>
                        <div class="app-port">Porta: 31000</div>
                        <button class="install-btn" id="btn-quepasa-api">Instalar Quepasa API</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">WppConnect</div>
                        <div class="app-description">Biblioteca para WhatsApp Web</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-wppconnect">Instalar WppConnect</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Wuzapi</div>
                        <div class="app-description">API para WhatsApp Business</div>
                        <div class="app-port">Porta: 8080</div>
                        <button class="install-btn" id="btn-wuzapi">Instalar Wuzapi</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🏢 ERP & Business <span class="app-count">2 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">🏢</span>
                        <div class="app-name">Odoo</div>
                        <div class="app-description">Suite completa de ERP</div>
                        <div class="app-port">Porta: 8069</div>
                        <button class="install-btn" id="btn-odoo">Instalar Odoo</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🔸</span>
                        <div class="app-name">Frappe</div>
                        <div class="app-description">Framework para aplicações business</div>
                        <div class="app-port">Porta: 8000</div>
                        <button class="install-btn" id="btn-frappe">Instalar Frappe</button>
                    </div>
                    </div>
                </div>
            </div>

            <div class="category-section">
                <div class="category-header">
                     <h3 class="category-title">🌐 Web Scraping & Automação <span class="app-count">3 apps</span></h3>
                     <span class="category-toggle">▶</span>
                 </div>
                <div class="category-content">
                     <div class="app-grid">
                    <div class="app-card">
                        <span class="app-icon">🕷️</span>
                        <div class="app-name">Firecrawl</div>
                        <div class="app-description">Web scraping e crawling</div>
                        <div class="app-port">Porta: 3002</div>
                        <button class="install-btn" id="btn-firecrawl">Instalar Firecrawl</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">🌐</span>
                        <div class="app-name">Browserless</div>
                        <div class="app-description">Automação de navegador headless</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-browserless">Instalar Browserless</button>
                    </div>
                    <div class="app-card">
                        <span class="app-icon">⚡</span>
                        <div class="app-name">Bolt</div>
                        <div class="app-description">Framework de automação</div>
                        <div class="app-port">Porta: 3000</div>
                        <button class="install-btn" id="btn-bolt">Instalar Bolt</button>
                    </div>
                    </div>
                </div>
             </div>
         `;

         // Add click handlers after rendering
        this.addButtonHandlers();
        this.addCategoryToggleHandlers();
        this.addToggleAllHandler();
    }

    addCategoryToggleHandlers() {
        const categoryHeaders = document.querySelectorAll('.category-header');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const categorySection = header.parentElement;
                const categoryContent = categorySection.querySelector('.category-content');
                const categoryToggle = header.querySelector('.category-toggle');
                
                const isActive = categoryContent.classList.contains('active');
                categoryContent.classList.toggle('active');
                categoryToggle.textContent = isActive ? '▶' : '▼';
                categoryToggle.style.transform = isActive ? 'rotate(-90deg)' : 'rotate(0deg)';
            });
        });
    }

    addToggleAllHandler() {
        const toggleAllBtn = document.getElementById('toggle-all');
        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', () => {
                const categoryContents = document.querySelectorAll('.category-content');
                const categoryToggles = document.querySelectorAll('.category-toggle');
                
                // Verificar se todas estão expandidas
                const allExpanded = Array.from(categoryContents).every(content => 
                    content.classList.contains('active')
                );
                
                if (allExpanded) {
                    // Colapsar todas
                    categoryContents.forEach(content => {
                        content.classList.remove('active');
                    });
                    categoryToggles.forEach(toggle => {
                        toggle.textContent = '▶';
                        toggle.style.transform = 'rotate(-90deg)';
                    });
                    toggleAllBtn.textContent = 'Expandir Todas';
                } else {
                    // Expandir todas
                    categoryContents.forEach(content => {
                        content.classList.add('active');
                    });
                    categoryToggles.forEach(toggle => {
                        toggle.textContent = '▼';
                        toggle.style.transform = 'rotate(0deg)';
                    });
                    toggleAllBtn.textContent = 'Colapsar Todas';
                }
            });
        }
    }

    addButtonHandlers() {
        const apps = [
            'chatwoot', 'evolution-api', 'woofed-crm', 'twentycrm', 'krayin-crm', 'mautic',
            'n8n', 'flowise', 'dify-ai', 'ollama', 'langflow', 'langfuse', 'anything-llm', 'evo-ai',
            'typebot', 'botpress', 'chatwoot-mega', 'mattermost', 'humhub',
            'minio', 'pgadmin4', 'mongodb', 'supabase', 'clickhouse', 'redisinsight', 'phpmyadmin',
            'nocobase', 'baserow', 'appsmith', 'nocodb', 'lowcoder', 'tooljet',
            'wordpress', 'directus', 'strapi', 'nextcloud',
            'metabase', 'uptime-kuma', 'grafana', 'prometheus', 'cadvisor', 'traccar',
            'vaultwarden', 'keycloak', 'passbolt',
            'cal-com', 'planka', 'outline', 'focalboard', 'openproject', 'glpi',
            'affine', 'excalidraw', 'stirling-pdf', 'wisemapping', 'yourls', 'ntfy',
            'moodle', 'documeso',
            'formbricks', 'docuseal', 'easy-appointments',
            'qdrant', 'zep',
            'rabbitmq', 'uno-api', 'n8n-quepasa', 'quepasa-api', 'wppconnect', 'wuzapi',
            'odoo', 'frappe',
            'firecrawl', 'browserless', 'bolt'
        ];
        
        apps.forEach(app => {
            const button = document.getElementById(`btn-${app}`);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.installApp(app);
                });
            }
        });
    }

    async installApp(appName) {
        const button = document.getElementById(`btn-${appName}`);
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="loading"></span>Instalando...';
        }

        this.updateStatus(`Iniciando instalação do ${appName}...`, 'info');

        try {
            const response = await fetch(`/api/install/${appName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                this.updateStatus(`✅ ${appName} instalado com sucesso! Verifique se está rodando na porta especificada.`, 'success');
                
                if (button) {
                    button.innerHTML = '✅ Instalado';
                    button.style.background = '#28a745';
                }
                
                // Check status after installation
                setTimeout(() => {
                    this.checkAppStatus(appName);
                }, 3000);
                
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Installation error:', error);
            this.updateStatus(`❌ Erro ao instalar ${appName}: ${error.message}`, 'error');
            
            if (button) {
                button.disabled = false;
                button.innerHTML = `Instalar ${appName}`;
            }
        }
    }

    async checkAppStatus(appName) {
        try {
            const response = await fetch(`/api/status/${appName}`);
            const result = await response.json();
            
            if (result.running) {
                this.updateStatus(`🟢 ${appName} está rodando! Status: ${result.status}`, 'success');
            } else {
                this.updateStatus(`🟡 ${appName} foi instalado mas não está rodando. Status: ${result.status}`, 'info');
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
    }

    // Check all app statuses on load
    async checkAllStatuses() {
        const apps = [
            'chatwoot', 'evolution-api', 'woofed-crm', 'twentycrm', 'krayin-crm', 'mautic',
            'n8n', 'flowise', 'dify-ai', 'ollama', 'langflow', 'langfuse', 'anything-llm', 'evo-ai',
            'typebot', 'botpress', 'chatwoot-mega', 'mattermost', 'humhub',
            'minio', 'pgadmin4', 'mongodb', 'supabase', 'clickhouse', 'redisinsight', 'phpmyadmin',
            'nocobase', 'baserow', 'appsmith', 'nocodb', 'lowcoder', 'tooljet',
            'wordpress', 'directus', 'strapi', 'nextcloud',
            'metabase', 'uptime-kuma', 'grafana', 'prometheus', 'cadvisor', 'traccar',
            'vaultwarden', 'keycloak', 'passbolt',
            'cal-com', 'planka', 'outline', 'focalboard', 'openproject', 'glpi',
            'affine', 'excalidraw', 'stirling-pdf', 'wisemapping', 'yourls', 'ntfy',
            'moodle', 'documeso',
            'formbricks', 'docuseal', 'easy-appointments',
            'qdrant', 'zep',
            'rabbitmq', 'uno-api', 'n8n-quepasa', 'quepasa-api', 'wppconnect', 'wuzapi',
            'odoo', 'frappe',
            'firecrawl', 'browserless', 'bolt'
        ];
        
        for (const app of apps) {
            try {
                const response = await fetch(`/api/status/${app}`);
                const result = await response.json();
                
                if (result.running) {
                    const button = document.getElementById(`btn-${app}`);
                    if (button) {
                        button.innerHTML = '🟢 Rodando';
                        button.style.background = '#28a745';
                        button.disabled = true;
                    }
                }
            } catch (error) {
                // Ignore errors for status checks
            }
        }
    }
}

// Initialize the web app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.webAppInstance = new WebApp();
    
    // Check statuses after a short delay
    setTimeout(() => {
        window.webAppInstance.checkAllStatuses();
    }, 1000);
});

// Global function for onclick handlers (if needed)
function installApp(appName) {
    if (window.webAppInstance) {
        window.webAppInstance.installApp(appName);
    }
}