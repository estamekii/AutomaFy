const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web.html'));
});

// Serve static files (after main route)
app.use(express.static('.'));

// API endpoint to install applications
app.post('/api/install/:appName', async (req, res) => {
    const { appName } = req.params;
    
    try {
        console.log(`Installing ${appName}...`);
        
        // Send immediate response
        res.json({ 
            success: true, 
            message: `Iniciando instalação do ${appName}...`,
            appName 
        });
        
        // Start installation process in background (don't await)
        installApplication(appName).catch(error => {
            console.error(`Error installing ${appName}:`, error);
        });
        
    } catch (error) {
        console.error(`Error installing ${appName}:`, error);
        if (!res.headersSent) {
            res.status(500).json({ 
                success: false, 
                message: `Erro ao instalar ${appName}: ${error.message}`,
                appName 
            });
        }
    }
});

// API endpoint to check installation status
app.get('/api/status/:appName', (req, res) => {
    const { appName } = req.params;
    
    // Check if Docker container is running
    exec(`docker ps --filter "name=${appName}" --format "table {{.Names}}\t{{.Status}}"`, (error, stdout, stderr) => {
        if (error) {
            res.json({ 
                running: false, 
                status: 'Not installed',
                appName 
            });
            return;
        }
        
        const isRunning = stdout.includes(appName);
        res.json({ 
            running: isRunning, 
            status: isRunning ? 'Running' : 'Stopped',
            appName 
        });
    });
});

// Function to install applications using individual Docker Compose files
async function installApplication(appName) {
    return new Promise((resolve, reject) => {
        // Map application names to their compose file paths
        const composeFileMap = {
            // Atendimento & CRM
            'chatwoot': 'compose/atendimento-crm/chatwoot.yml',
            'evolution-api': 'compose/atendimento-crm/evolution-api.yml',
            'woofed-crm': 'compose/atendimento-crm/woofed-crm.yml',
            'twentycrm': 'compose/atendimento-crm/twentycrm.yml',
            'krayin-crm': 'compose/atendimento-crm/krayin-crm.yml',
            'mautic': 'compose/atendimento-crm/mautic.yml',
            
            // Automação & IA
            'n8n': 'compose/automacao-ia/n8n.yml',
            'flowise': 'compose/automacao-ia/flowise.yml',
            'dify-ai': 'compose/automacao-ia/dify-ai.yml',
            'ollama': 'compose/automacao-ia/ollama.yml',
            'langflow': 'compose/automacao-ia/langflow.yml',
            'langfuse': 'compose/automacao-ia/langfuse.yml',
            'anything-llm': 'compose/automacao-ia/anything-llm.yml',
            'evo-ai': 'compose/automacao-ia/evo-ai.yml',
            
            // Chatbots & Comunicação
            'typebot': 'compose/chatbots-comunicacao/typebot.yml',
            'botpress': 'compose/chatbots-comunicacao/botpress.yml',
            'chatwoot-mega': 'compose/chatbots-comunicacao/chatwoot-mega.yml',
            'mattermost': 'compose/chatbots-comunicacao/mattermost.yml',
            'humhub': 'compose/chatbots-comunicacao/humhub.yml',
            
            // Desenvolvimento & CMS
            'directus': 'compose/desenvolvimento-cms/directus.yml',
            
            // Analytics & Monitoramento
            'grafana': 'compose/analytics-monitoramento/grafana.yml',
            'prometheus': 'compose/analytics-monitoramento/prometheus.yml',
            'uptime-kuma': 'compose/analytics-monitoramento/uptime-kuma.yml',
            'plausible': 'compose/analytics-monitoramento/plausible.yml',
            
            // Segurança & Auth
            'vaultwarden': 'compose/seguranca-auth/vaultwarden.yml',
            'keycloak': 'compose/seguranca-auth/keycloak.yml',
            'passbolt': 'compose/seguranca-auth/passbolt.yml',
            
            // Gestão & Produtividade
            'cal-com': 'compose/gestao-produtividade/cal-com.yml',
            'planka': 'compose/gestao-produtividade/planka.yml',
            'outline': 'compose/gestao-produtividade/outline.yml',
            'focalboard': 'compose/gestao-produtividade/focalboard.yml',
            
            // Ferramentas & Utilitários
            'affine': 'compose/ferramentas-utilitarios/affine.yml',
            'excalidraw': 'compose/ferramentas-utilitarios/excalidraw.yml',
            'stirling-pdf': 'compose/ferramentas-utilitarios/stirling-pdf.yml',
            'ntfy': 'compose/ferramentas-utilitarios/ntfy.yml',
            
            // Educação & Documentação
            'moodle': 'compose/educacao-documentacao/moodle.yml',
            
            // Formulários & Pesquisas
            'formbricks': 'compose/formularios-pesquisas/formbricks.yml',
            
            // Mensageria & APIs
            'rabbitmq': 'compose/mensageria-apis/rabbitmq.yml',
            
            // ERP & Business
            'odoo': 'compose/erp-business/odoo.yml',
            
            // WebScraping & Automação
            'firecrawl': 'compose/webscraping-automacao/firecrawl.yml'
        };
        
        const composeFile = composeFileMap[appName];
        
        if (!composeFile) {
            reject(new Error(`Aplicação '${appName}' não encontrada no mapeamento de arquivos compose`));
            return;
        }
        
        // Check if compose file exists
        const composePath = path.join(__dirname, composeFile);
        if (!fs.existsSync(composePath)) {
            reject(new Error(`Arquivo compose não encontrado: ${composePath}`));
            return;
        }
        
        // Use the specific compose file for the application
        const dockerCommand = `docker-compose -f "${composeFile}" up -d`;
        
        console.log(`Executing: ${dockerCommand}`);
        
        exec(dockerCommand, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                reject(error);
                return;
            }
            
            console.log(`${appName} installed successfully using ${composeFile}`);
            console.log(`stdout: ${stdout}`);
            if (stderr) console.log(`stderr: ${stderr}`);
            
            resolve(stdout);
        });
    });
}


// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Lookstall Web Server running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Access from any device on your network`);
    console.log(`🐳 Make sure Docker is installed and running`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Server shutting down gracefully...');
    process.exit(0);
});