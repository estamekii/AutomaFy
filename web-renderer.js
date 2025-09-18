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
                    this.showInstallForm(app);
                });
            }
        });
        
        // Modal event listeners agora são adicionados diretamente em showInstallForm()
    }

    async showInstallForm(appName) {
         try {
             // Fetch form fields for this app
             const response = await fetch(`/api/install-form/${appName}`);
             if (!response.ok) {
                 // If no form is needed, install directly
                 this.installApp(appName);
                 return;
             }
             
             const formData = await response.json();
             
             // Create form fields HTML with domain suggestions
             let fieldsHTML = '';
             
             // First, get domain suggestions if needed
             let domainSuggestions = null;
             const hasDomainField = formData.fields.some(field => field.name === 'domain' || field.name.includes('domain'));
             
             if (hasDomainField) {
                 try {
                     const suggestionsResponse = await fetch(`/api/domain-suggestions/${appName}`);
                     if (suggestionsResponse.ok) {
                         const suggestionsData = await suggestionsResponse.json();
                         if (suggestionsData.success) {
                             domainSuggestions = suggestionsData.suggestions;
                         }
                     }
                 } catch (error) {
                     console.log('Erro ao buscar sugestões de domínio:', error);
                 }
             }
             
             formData.fields.forEach(field => {
                 const inputType = field.type === 'strong_password' ? 'password' : 
                                  field.type === 'email' ? 'email' : 'text';
                 
                 // Check if this is a domain field and add suggestions
                 let domainSuggestionsHTML = '';
                 if ((field.name === 'domain' || field.name.includes('domain')) && domainSuggestions) {
                     // Handle both array format and object format
                     let suggestions = [];
                     if (Array.isArray(domainSuggestions)) {
                         suggestions = domainSuggestions.slice(0, 3);
                     } else {
                         const primary = domainSuggestions.primary || [];
                         const alternatives = domainSuggestions.alternatives || [];
                         suggestions = primary.concat(alternatives).slice(0, 3);
                     }
                     domainSuggestionsHTML = `
                         <div class="domain-suggestions" style="margin-top: 8px !important;">
                             <div style="font-size: 12px !important; color: #666 !important; margin-bottom: 5px !important;">Sugestões:</div>
                             <div style="display: flex !important; gap: 5px !important; flex-wrap: wrap !important;">
                                 ${suggestions.map(suggestion => `
                                     <button type="button" 
                                         onclick="document.getElementById('${field.name}').value='${suggestion}'; document.getElementById('${field.name}').focus();"
                                         style="
                                             background: #f3f4f6 !important;
                                             border: 1px solid #d1d5db !important;
                                             border-radius: 4px !important;
                                             padding: 4px 8px !important;
                                             font-size: 11px !important;
                                             color: #374151 !important;
                                             cursor: pointer !important;
                                             transition: all 0.2s ease !important;
                                         "
                                         onmouseover="this.style.background='#e5e7eb'; this.style.borderColor='#9ca3af';"
                                         onmouseout="this.style.background='#f3f4f6'; this.style.borderColor='#d1d5db';"
                                     >${suggestion}</button>
                                 `).join('')}
                             </div>
                         </div>
                     `;
                 }
                 
                 fieldsHTML += `
                     <div class="form-group" style="
                         margin-bottom: 20px !important;
                     ">
                         <label class="form-label" for="${field.name}" style="
                             display: block !important;
                             margin-bottom: 8px !important;
                             font-weight: 500 !important;
                             color: #333 !important;
                         ">
                             ${field.label}${field.required ? ' *' : ''}
                         </label>
                         <input 
                             type="${inputType}" 
                             id="${field.name}" 
                             name="${field.name}" 
                             placeholder="${field.placeholder || ''}" 
                             class="form-input"
                             style="
                                 width: 100% !important;
                                 padding: 12px !important;
                                 border: 2px solid #e1e5e9 !important;
                                 border-radius: 8px !important;
                                 font-size: 14px !important;
                                 transition: border-color 0.3s ease !important;
                                 box-sizing: border-box !important;
                             "
                             onfocus="this.style.borderColor='#667eea'; this.style.outline='none';"
                             onblur="this.style.borderColor='#e1e5e9'; this.validateField && this.validateField();"
                             oninput="this.validateField && this.validateField();"
                             data-validation="${field.validation || ''}"
                         >
                         ${domainSuggestionsHTML}
                         <div id="${field.name}-validation" class="validation-message" style="
                             font-size: 12px !important;
                             margin-top: 5px !important;
                             display: none !important;
                         "></div>
                         ${field.help ? `<div class="form-help" style="
                             font-size: 12px !important;
                             color: #666 !important;
                             margin-top: 5px !important;
                         ">${field.help}</div>` : ''}
                     </div>
                 `;
                 
                 // Add validation function to the input after it's created
                 setTimeout(() => {
                     const input = document.getElementById(field.name);
                     if (input && field.validation) {
                         input.validateField = function() {
                             const value = this.value.trim();
                             const validationMsg = document.getElementById(field.name + '-validation');
                             
                             if (!value && field.required) {
                                 this.style.borderColor = '#ef4444';
                                 validationMsg.style.color = '#ef4444';
                                 validationMsg.style.display = 'block';
                                 validationMsg.textContent = 'Este campo é obrigatório';
                                 return false;
                             }
                             
                             if (value && field.validation === 'domain') {
                                  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/;
                                  if (!domainRegex.test(value) || value.length > 253) {
                                     this.style.borderColor = '#ef4444';
                                     validationMsg.style.color = '#ef4444';
                                     validationMsg.style.display = 'block';
                                     validationMsg.textContent = 'Formato de domínio inválido';
                                     return false;
                                 }
                             }
                             
                             // Valid input
                             this.style.borderColor = '#10b981';
                             validationMsg.style.display = 'none';
                             return true;
                         };
                     }
                 }, 100);
             });
             
             // Create modal HTML with consistent styling
             const modalHTML = `
                 <div id="installModal" class="modal" style="
                     display: flex !important;
                     position: fixed !important;
                     top: 0 !important;
                     left: 0 !important;
                     width: 100vw !important;
                     height: 100vh !important;
                     z-index: 99999 !important;
                     background: rgba(0,0,0,0.8) !important;
                     justify-content: center !important;
                     align-items: center !important;
                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                 ">
                     <div class="modal-content" style="
                         background: white !important;
                         border-radius: 12px !important;
                         box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
                         padding: 40px !important;
                         max-width: 600px !important;
                         width: 90% !important;
                         max-height: 80vh !important;
                         overflow-y: auto !important;
                         position: relative !important;
                     ">
                         <div class="modal-header" style="
                             display: flex !important;
                             justify-content: space-between !important;
                             align-items: center !important;
                             margin-bottom: 20px !important;
                             padding-bottom: 15px !important;
                             border-bottom: 1px solid #eee !important;
                         ">
                             <h2 class="modal-title" style="
                                 font-size: 1.5em !important;
                                 font-weight: 600 !important;
                                 color: #333 !important;
                                 margin: 0 !important;
                             ">Configurar Instalação - ${appName}</h2>
                             <span class="close" id="closeModal" style="
                                 color: #aaa !important;
                                 font-size: 28px !important;
                                 font-weight: bold !important;
                                 cursor: pointer !important;
                                 line-height: 1 !important;
                             ">&times;</span>
                         </div>
                         <form id="installForm">
                             <div id="formFields">
                                 ${fieldsHTML}
                             </div>
                             <div class="modal-actions" style="
                                 display: flex !important;
                                 gap: 10px !important;
                                 justify-content: flex-end !important;
                                 margin-top: 30px !important;
                                 padding-top: 20px !important;
                                 border-top: 1px solid #eee !important;
                             ">
                                 <button type="button" class="btn-secondary" id="cancelButton" onclick="window.closeInstallModal && window.closeInstallModal()" style="
                                     background: #6c757d !important;
                                     color: white !important;
                                     border: none !important;
                                     padding: 12px 24px !important;
                                     border-radius: 8px !important;
                                     cursor: pointer !important;
                                     font-size: 14px !important;
                                     transition: background 0.3s ease !important;
                                 ">Cancelar</button>
                                 <button type="submit" class="btn-primary" id="confirmInstall" style="
                                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                                     color: white !important;
                                     border: none !important;
                                     padding: 12px 24px !important;
                                     border-radius: 8px !important;
                                     cursor: pointer !important;
                                     font-size: 14px !important;
                                     transition: transform 0.2s ease !important;
                                 ">Instalar ${appName}</button>
                             </div>
                         </form>
                     </div>
                 </div>
             `;
             
             // Add modal to body
             document.body.insertAdjacentHTML('beforeend', modalHTML);
             
             // Get modal reference for event handling
             const modal = document.getElementById('installModal');
             
             // Create global function for onclick fallback
             window.closeInstallModal = () => {
                 this.closeModal();
             };
             
             // Add hover effects and click event to cancel button
             const cancelButton = modal.querySelector('#cancelButton');
             if (cancelButton) {
                 cancelButton.addEventListener('mouseenter', () => {
                     cancelButton.style.background = '#5a6268 !important';
                 });
                 cancelButton.addEventListener('mouseleave', () => {
                     cancelButton.style.background = '#6c757d !important';
                 });
                 
                 // Add click event to cancel button with multiple fallbacks
                 const handleCancel = (e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     this.closeModal();
                 };
                 
                 cancelButton.addEventListener('click', handleCancel);
                 cancelButton.addEventListener('touchstart', handleCancel); // Mobile support
             }
             
             // Additional fallback: find any button with "Cancelar" text
             const allButtons = modal.querySelectorAll('button');
             allButtons.forEach(btn => {
                 if (btn.textContent.trim() === 'Cancelar' && !btn.hasAttribute('data-cancel-handler')) {
                     btn.setAttribute('data-cancel-handler', 'true');
                     btn.addEventListener('click', (e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         this.closeModal();
                     });
                 }
             });
             
             const btnPrimary = modal.querySelector('.btn-primary');
             if (btnPrimary) {
                 btnPrimary.addEventListener('mouseenter', () => {
                     btnPrimary.style.transform = 'translateY(-2px)';
                 });
                 btnPrimary.addEventListener('mouseleave', () => {
                     btnPrimary.style.transform = 'translateY(0)';
                 });
             }
             
             // Add hover effect to close button
             const closeBtn = modal.querySelector('.close');
             if (closeBtn) {
                 closeBtn.addEventListener('mouseenter', () => {
                     closeBtn.style.color = '#333 !important';
                 });
                 closeBtn.addEventListener('mouseleave', () => {
                     closeBtn.style.color = '#aaa !important';
                 });
                 
                 // Add direct click event to close button
                 closeBtn.addEventListener('click', (e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     this.closeModal();
                 });
             }
             
             // Add click event to modal background (outside content)
             modal.addEventListener('click', (e) => {
                 if (e.target === modal) {
                     this.closeModal();
                 }
             });
             
             // Add ESC key event specifically for this modal
             const escHandler = (e) => {
                 if (e.key === 'Escape') {
                     this.closeModal();
                     document.removeEventListener('keydown', escHandler);
                 }
             };
             document.addEventListener('keydown', escHandler);
             
             // Add form submission handler directly to the form
             const form = modal.querySelector('#installForm');
             if (form) {
                 form.addEventListener('submit', (e) => {
                     e.preventDefault();
                     this.handleInstallForm(form);
                 });
             }
             
             // Focus on first input
             const firstInput = modal.querySelector('.form-input');
             if (firstInput) firstInput.focus();
             
         } catch (error) {
             console.error('Error loading form:', error);
             // If form loading fails, try direct installation
             this.installApp(appName);
         }
     }
    
    // addModalHandlers() - REMOVIDO: Eventos agora são adicionados diretamente aos elementos do modal
    // para evitar conflitos de foco e duplo clique
    // Os eventos estão sendo tratados diretamente na função showInstallForm()
    
    closeModal() {
        const modal = document.getElementById('installModal');
        if (modal && modal.parentNode) {
            // Prevent multiple calls
            if (modal.classList.contains('closing')) {
                return;
            }
            
            modal.classList.add('closing');
            
            // Clean up global function
            if (window.closeInstallModal) {
                delete window.closeInstallModal;
            }
            
            // Remove modal after animation with fallback
            const removeModal = () => {
                if (modal && modal.parentNode) {
                    modal.remove();
                }
            };
            
            setTimeout(removeModal, 300);
            
            // Fallback: force remove after 1 second if still exists
            setTimeout(() => {
                const stillExists = document.getElementById('installModal');
                if (stillExists) {
                    stillExists.remove();
                }
            }, 1000);
        }
    }
     
     async handleInstallForm(form) {
         const formData = new FormData(form);
         const config = {};
         
         // Collect all form data dynamically
         for (let [key, value] of formData.entries()) {
             config[key] = value;
         }
         
         // Get app name from the form button text
         const submitBtn = form.querySelector('#confirmInstall');
         const appName = submitBtn.textContent.replace('Instalar ', '').toLowerCase();
         
         // Validate form before submission
         try {
             const response = await fetch(`/api/validate-form/${appName}`, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(config)
             });
             
             const validation = await response.json();
             
             if (!validation.valid) {
                 // Show validation errors
                 this.showFormErrors(validation.errors);
                 return;
             }
             
             // Close modal and start installation
             this.closeModal();
             this.installApp(appName, config);
             
         } catch (error) {
              console.error('Validation error:', error);
              this.updateStatus('❌ Erro na validação do formulário', 'error');
          }
      }
      
      showFormErrors(errors) {
          // Clear previous errors
          const existingErrors = document.querySelectorAll('.form-error');
          existingErrors.forEach(error => error.remove());
          
          // Show new errors
          Object.keys(errors).forEach(fieldName => {
              const field = document.getElementById(fieldName);
              if (field) {
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'form-error';
                  errorDiv.textContent = errors[fieldName];
                  field.parentNode.appendChild(errorDiv);
                  
                  // Add error styling to input
                  field.style.borderColor = '#e74c3c';
                  
                  // Remove error styling on input
                  field.addEventListener('input', function() {
                      this.style.borderColor = '#e1e5e9';
                      const errorDiv = this.parentNode.querySelector('.form-error');
                      if (errorDiv) errorDiv.remove();
                  }, { once: true });
              }
          });
      }

    async installApp(appName, config = null) {
        const button = document.getElementById(`btn-${appName}`);
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="loading"></span>Instalando...';
        }

        this.updateStatus(`Iniciando instalação do ${appName}...`, 'info');

        try {
            const requestBody = config ? JSON.stringify(config) : '{}';
            
            const response = await fetch(`/api/install/${appName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody
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