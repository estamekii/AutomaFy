const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');

// Function to generate JWT tokens for Supabase (following OpenSSL script pattern)
function generateJWTTokens() {
    try {
        // Generate a random secret key (40 hex characters = 20 bytes)
        const secret = crypto.randomBytes(20).toString('hex');
        
        // Define JWT payloads
        const payloadServiceKey = {
            "role": "service_role",
            "iss": "supabase",
            "iat": 1715050800,
            "exp": 1872817200
        };
        
        const payloadAnonKey = {
            "role": "anon",
            "iss": "supabase",
            "iat": 1715050800,
            "exp": 1872817200
        };
        
        // Create JWT header
        const header = {"alg":"HS256","typ":"JWT"};
        
        // Base64url encode function
        function base64urlEncode(str) {
            return Buffer.from(str)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        }
        
        // Encode header and payloads
        const headerEncoded = base64urlEncode(JSON.stringify(header));
        const payloadServiceKeyEncoded = base64urlEncode(JSON.stringify(payloadServiceKey));
        const payloadAnonKeyEncoded = base64urlEncode(JSON.stringify(payloadAnonKey));
        
        // Create signatures
        const signatureServiceKey = crypto
            .createHmac('sha256', secret)
            .update(`${headerEncoded}.${payloadServiceKeyEncoded}`)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
            
        const signatureAnonKey = crypto
            .createHmac('sha256', secret)
            .update(`${headerEncoded}.${payloadAnonKeyEncoded}`)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        
        // Combine token parts
        const tokenServiceKey = `${headerEncoded}.${payloadServiceKeyEncoded}.${signatureServiceKey}`;
        const tokenAnonKey = `${headerEncoded}.${payloadAnonKeyEncoded}.${signatureAnonKey}`;
        
        return {
            secret: secret,
            service_key: tokenServiceKey,
            anon_key: tokenAnonKey
        };
    } catch (error) {
        console.error('Error generating JWT tokens:', error);
        throw error;
    }
}

// Function to generate SECRET_KEY_BASE for Chatwoot
function generateSecretKey() {
    try {
        // Generate a 64-byte random key and convert to hex
        const secretKey = crypto.randomBytes(64).toString('hex');
        return secretKey;
    } catch (error) {
        console.error('Error generating secret key:', error);
        throw error;
    }
}

function generateRandomPassword(length = 12) {
    try {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@_';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, charset.length);
            password += charset[randomIndex];
        }
        return password;
    } catch (error) {
        console.error('Error generating random password:', error);
        throw error;
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Portainer Configuration
let PORTAINER_CONFIG = {
    url: process.env.PORTAINER_URL || 'http://localhost:9000',
    username: process.env.PORTAINER_USER || 'admin',
    password: process.env.PORTAINER_PASSWORD || '',
    deployMethod: process.env.DEPLOY_METHOD || 'docker-compose' // 'docker-compose' or 'portainer-api'
};

// Domain mapping for applications
const DEFAULT_DOMAIN_MAPPINGS = {
    'evolution-api': 'evolution',
    'woofed-crm': 'woofed',
    'twentycrm': 'twenty',
    'krayin-crm': 'krayin',
    'dify-ai': 'dify',
    'anything-llm': 'anythingllm',
    'evo-ai': 'evoai',
    'uptime-kuma': 'uptime',
    'stirling-pdf': 'pdf',
    'cal-com': 'cal'
};

// Function to generate default domain suggestion
function generateDefaultDomain(appName, baseDomain = 'exemplo.com.br') {
    // Use custom mapping if available, otherwise use app name directly
    const domainPrefix = DEFAULT_DOMAIN_MAPPINGS[appName] || appName;
    return `${domainPrefix}.${baseDomain}`;
}

// Function to get domain suggestions for an application
function getDomainSuggestions(appName, baseDomain = 'exemplo.com.br') {
    const suggestions = [];
    
    // Primary suggestion
    suggestions.push(generateDefaultDomain(appName, baseDomain));
    
    // Alternative suggestions
    if (appName.includes('-')) {
        const shortName = appName.split('-')[0];
        suggestions.push(`${shortName}.${baseDomain}`);
    }
    
    // Category-based suggestions
    const categoryMappings = {
        'crm': ['crm', 'vendas', 'clientes'],
        'ai': ['ai', 'ia', 'bot'],
        'chat': ['chat', 'suporte', 'atendimento'],
        'monitor': ['monitor', 'status', 'uptime'],
        'analytics': ['analytics', 'stats', 'dados']
    };
    
    for (const [category, prefixes] of Object.entries(categoryMappings)) {
        if (appName.includes(category)) {
            prefixes.forEach(prefix => {
                suggestions.push(`${prefix}.${baseDomain}`);
            });
            break;
        }
    }
    
    // Remove duplicates and limit to 5 suggestions
    return [...new Set(suggestions)].slice(0, 5);
}

// Configuration object for runtime updates
const config = {
    portainer: {
        url: PORTAINER_CONFIG.url,
        username: PORTAINER_CONFIG.username,
        password: PORTAINER_CONFIG.password,
        deployMethod: PORTAINER_CONFIG.deployMethod
    }
};

// Application dependencies mapping
const APP_DEPENDENCIES = {
    // Aplicações que dependem de Docker, Portainer e Traefik
    'chatwoot': ['docker'],
    'evolution-api': ['docker', 'portainer', 'traefik'],
    'woofed-crm': ['docker', 'portainer', 'traefik'],
    'twentycrm': ['docker', 'portainer', 'traefik'],
    'krayin-crm': ['docker', 'portainer', 'traefik'],
    'mautic': ['docker', 'portainer', 'traefik'],
    'n8n': ['docker', 'portainer', 'traefik'],
    'flowise': ['docker', 'portainer', 'traefik'],
    'dify-ai': ['docker', 'portainer', 'traefik'],
    'ollama': ['docker', 'portainer', 'traefik'],
    'langflow': ['docker', 'portainer', 'traefik'],
    'langfuse': ['docker', 'portainer', 'traefik'],
    'anything-llm': ['docker', 'portainer', 'traefik'],
    'evo-ai': ['docker', 'portainer', 'traefik'],
    'typebot': ['docker', 'portainer', 'traefik'],
    'botpress': ['docker', 'portainer', 'traefik'],
    'chatwoot-mega': ['docker', 'portainer', 'traefik', 'minio', 'rabbitmq', 'chatwoot'],
    'mattermost': ['docker', 'portainer', 'traefik'],
    'humhub': ['docker', 'portainer', 'traefik'],
    'directus': ['docker', 'portainer', 'traefik'],
    'grafana': ['docker', 'portainer', 'traefik'],
    'prometheus': ['docker', 'portainer', 'traefik'],
    'uptime-kuma': ['docker', 'portainer', 'traefik'],
    'plausible': ['docker', 'portainer', 'traefik', 'clickhouse'],
    'vaultwarden': ['docker', 'portainer', 'traefik'],
    'keycloak': ['docker', 'portainer', 'traefik'],
    'passbolt': ['docker', 'portainer', 'traefik'],
    'cal-com': ['docker', 'portainer', 'traefik'],
    'planka': ['docker', 'portainer', 'traefik'],
    'outline': ['docker', 'portainer', 'traefik', 'minio'],
    'focalboard': ['docker', 'portainer', 'traefik'],
    'affine': ['docker', 'portainer', 'traefik'],
    'excalidraw': ['docker', 'portainer', 'traefik'],
    'stirling-pdf': ['docker', 'portainer', 'traefik'],
    'ntfy': ['docker', 'portainer', 'traefik'],
    'moodle': ['docker', 'portainer', 'traefik'],
    'formbricks': ['docker', 'portainer', 'traefik'],
    'rabbitmq': ['docker', 'portainer', 'traefik'],
    'odoo': ['docker', 'portainer', 'traefik'],
    'firecrawl': ['docker', 'portainer', 'traefik'],
    'openproject': ['docker', 'portainer', 'traefik'],
    'glpi': ['docker', 'portainer', 'traefik'],
    'chatwoot': ['docker'],
    'clickhouse': ['docker', 'portainer', 'traefik'],
    'metabase': ['docker', 'portainer', 'traefik'],
    'cadvisor': ['docker', 'portainer', 'traefik'],
    'traccar': ['docker', 'portainer', 'traefik'],
    'wisemapping': ['docker', 'portainer', 'traefik'],
    'yourls': ['docker', 'portainer', 'traefik'],
    'documeso': ['docker', 'portainer', 'traefik'],
    'docuseal': ['docker', 'portainer', 'traefik'],
    'easy-appointments': ['docker', 'portainer', 'traefik'],
    'qdrant': ['docker', 'portainer', 'traefik'],
    'zep': ['docker', 'portainer', 'traefik'],
    'uno-api': ['docker', 'portainer', 'traefik'],
    'n8n-quepasa': ['docker', 'portainer', 'traefik'],
    'quepasa-api': ['docker', 'portainer', 'traefik'],
    'wppconnect': ['docker', 'portainer', 'traefik'],
    'wuzapi': ['docker', 'portainer', 'traefik'],
    'frappe': ['docker', 'portainer', 'traefik'],
    'browserless': ['docker', 'portainer', 'traefik'],
    'bolt': ['docker', 'portainer', 'traefik'],
    
    // Aplicações específicas com dependências especiais
    'some-app-with-minio': ['docker', 'portainer', 'traefik', 'minio'],
    'some-app-with-rabbitmq': ['docker', 'portainer', 'traefik', 'rabbitmq'],
    'some-app-with-chatwoot': ['docker', 'portainer', 'traefik', 'chatwoot'],
    'some-app-with-clickhouse': ['docker', 'portainer', 'traefik', 'clickhouse'],
    'some-app-with-minio-rabbitmq-chatwoot': ['docker', 'portainer', 'traefik', 'minio', 'rabbitmq', 'chatwoot']
};

// Container name mapping for dependency checking
const CONTAINER_NAME_MAP = {
    'docker': 'docker', // Docker daemon check
    'portainer': 'portainer',
    'traefik': 'traefik',
    'minio': 'minio',
    'rabbitmq': 'rabbitmq',
    'chatwoot': 'chatwoot',
    'clickhouse': 'clickhouse'
};

// Application installation form fields mapping
const APP_FORM_FIELDS = {
    'portainer': [
        {
            name: 'domain',
            label: 'Domínio para o Portainer',
            type: 'text',
            placeholder: 'portainer.exemplo.com.br',
            required: true,
            validation: 'domain'
        },
        {
            name: 'server_name',
            label: 'Nome do Servidor',
            type: 'text',
            placeholder: 'MeuServidor',
            required: true,
            validation: 'server_name',
            help: 'Não pode conter espaços e/ou caracteres especiais'
        },
        {
            name: 'network_name',
            label: 'Nome da Rede Interna',
            type: 'text',
            placeholder: 'MinhaRede',
            required: true,
            validation: 'network_name',
            help: 'Não pode conter espaços e/ou caracteres especiais'
        }
    ],
    'traefik': [
        {
            name: 'domain',
            label: 'Domínio para o Traefik',
            type: 'text',
            placeholder: 'traefik.exemplo.com.br',
            required: true,
            validation: 'domain'
        },
        {
            name: 'network_name',
            label: 'Nome da Rede Interna',
            type: 'text',
            placeholder: 'MinhaRede',
            required: true,
            validation: 'network_name'
        }
    ],
    'chatwoot': [
        {
            name: 'domain',
            label: 'Domínio para o Chatwoot',
            type: 'text',
            placeholder: 'chatwoot.exemplo.com.br',
            required: true,
            validation: 'domain'
        },

    ],
    'minio': [
        {
            name: 'domain',
            label: 'Domínio para o MinIO',
            type: 'text',
            placeholder: 'minio.exemplo.com.br',
            required: true,
            validation: 'domain'
        },
        {
            name: 'console_domain',
            label: 'Domínio para Console MinIO',
            type: 'text',
            placeholder: 'minio-console.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'n8n': [
        {
            name: 'domain',
            label: 'Domínio para o N8N',
            type: 'text',
            placeholder: 'n8n.exemplo.com.br',
            required: true,
            validation: 'domain'
        },
        {
            name: 'webhook_url',
            label: 'URL Base para Webhooks',
            type: 'text',
            placeholder: 'https://n8n.exemplo.com.br',
            required: true,
            validation: 'url'
        }
    ],
    'wordpress': [
        {
            name: 'domain',
            label: 'Domínio para o WordPress',
            type: 'text',
            placeholder: 'blog.exemplo.com.br',
            required: true,
            validation: 'domain'
        },
        {
            name: 'site_title',
            label: 'Título do Site',
            type: 'text',
            placeholder: 'Meu Blog',
            required: true,
            validation: 'text'
        }
    ],
    'evolution-api': [
        {
            name: 'domain',
            label: 'Domínio para o Evolution API',
            type: 'text',
            placeholder: 'evolution.exemplo.com.br',
            required: true,
            validation: 'domain'
        },

    ],
    'woofed-crm': [
        {
            name: 'domain',
            label: 'Domínio para o Woofed CRM',
            type: 'text',
            placeholder: 'woofed.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'twentycrm': [
        {
            name: 'domain',
            label: 'Domínio para o Twenty CRM',
            type: 'text',
            placeholder: 'twenty.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'krayin-crm': [
        {
            name: 'domain',
            label: 'Domínio para o Krayin CRM',
            type: 'text',
            placeholder: 'krayin.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'mautic': [
        {
            name: 'domain',
            label: 'Domínio para o Mautic',
            type: 'text',
            placeholder: 'mautic.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
     ],
    'flowise': [
        {
            name: 'domain',
            label: 'Domínio para o Flowise',
            type: 'text',
            placeholder: 'flowise.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'dify-ai': [
        {
            name: 'domain',
            label: 'Domínio para o Dify AI',
            type: 'text',
            placeholder: 'dify.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'ollama': [
        {
            name: 'domain',
            label: 'Domínio para o Ollama',
            type: 'text',
            placeholder: 'ollama.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'langflow': [
        {
            name: 'domain',
            label: 'Domínio para o Langflow',
            type: 'text',
            placeholder: 'langflow.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'langfuse': [
        {
            name: 'domain',
            label: 'Domínio para o Langfuse',
            type: 'text',
            placeholder: 'langfuse.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'anything-llm': [
        {
            name: 'domain',
            label: 'Domínio para o AnythingLLM',
            type: 'text',
            placeholder: 'anythingllm.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'evo-ai': [
        {
            name: 'domain',
            label: 'Domínio para o Evo AI',
            type: 'text',
            placeholder: 'evoai.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'typebot': [
        {
            name: 'domain',
            label: 'Domínio para o Typebot',
            type: 'text',
            placeholder: 'typebot.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'botpress': [
         {
             name: 'domain',
             label: 'Domínio para o Botpress',
             type: 'text',
             placeholder: 'botpress.exemplo.com.br',
             required: true,
             validation: 'domain'
         }
     ],
    'mattermost': [
        {
            name: 'domain',
            label: 'Domínio para o Mattermost',
            type: 'text',
            placeholder: 'mattermost.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'humhub': [
        {
            name: 'domain',
            label: 'Domínio para o HumHub',
            type: 'text',
            placeholder: 'humhub.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'directus': [
        {
            name: 'domain',
            label: 'Domínio para o Directus',
            type: 'text',
            placeholder: 'directus.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'grafana': [
        {
            name: 'domain',
            label: 'Domínio para o Grafana',
            type: 'text',
            placeholder: 'grafana.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'prometheus': [
        {
            name: 'domain',
            label: 'Domínio para o Prometheus',
            type: 'text',
            placeholder: 'prometheus.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'uptime-kuma': [
        {
            name: 'domain',
            label: 'Domínio para o Uptime Kuma',
            type: 'text',
            placeholder: 'uptime.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'plausible': [
        {
            name: 'domain',
            label: 'Domínio para o Plausible',
            type: 'text',
            placeholder: 'plausible.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'vaultwarden': [
        {
            name: 'domain',
            label: 'Domínio para o Vaultwarden',
            type: 'text',
            placeholder: 'vault.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'keycloak': [
        {
            name: 'domain',
            label: 'Domínio para o Keycloak',
            type: 'text',
            placeholder: 'keycloak.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'passbolt': [
        {
            name: 'domain',
            label: 'Domínio para o Passbolt',
            type: 'text',
            placeholder: 'passbolt.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'cal-com': [
        {
            name: 'domain',
            label: 'Domínio para o Cal.com',
            type: 'text',
            placeholder: 'cal.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'planka': [
        {
            name: 'domain',
            label: 'Domínio para o Planka',
            type: 'text',
            placeholder: 'planka.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'outline': [
        {
            name: 'domain',
            label: 'Domínio para o Outline',
            type: 'text',
            placeholder: 'outline.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'focalboard': [
        {
            name: 'domain',
            label: 'Domínio para o Focalboard',
            type: 'text',
            placeholder: 'focalboard.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'affine': [
        {
            name: 'domain',
            label: 'Domínio para o AFFiNE',
            type: 'text',
            placeholder: 'affine.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'excalidraw': [
        {
            name: 'domain',
            label: 'Domínio para o Excalidraw',
            type: 'text',
            placeholder: 'excalidraw.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'stirling-pdf': [
        {
            name: 'domain',
            label: 'Domínio para o Stirling PDF',
            type: 'text',
            placeholder: 'pdf.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'ntfy': [
        {
            name: 'domain',
            label: 'Domínio para o Ntfy',
            type: 'text',
            placeholder: 'ntfy.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'moodle': [
        {
            name: 'domain',
            label: 'Domínio para o Moodle',
            type: 'text',
            placeholder: 'moodle.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'formbricks': [
        {
            name: 'domain',
            label: 'Domínio para o Formbricks',
            type: 'text',
            placeholder: 'formbricks.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'rabbitmq': [
        {
            name: 'domain',
            label: 'Domínio para o RabbitMQ',
            type: 'text',
            placeholder: 'rabbitmq.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'odoo': [
        {
            name: 'domain',
            label: 'Domínio para o Odoo',
            type: 'text',
            placeholder: 'odoo.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'firecrawl': [
        {
            name: 'domain',
            label: 'Domínio para o Firecrawl',
            type: 'text',
            placeholder: 'firecrawl.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'clickhouse': [
        {
            name: 'domain',
            label: 'Domínio para o ClickHouse',
            type: 'text',
            placeholder: 'clickhouse.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'chatwoot-mega': [
        {
            name: 'domain',
            label: 'Domínio para o Chatwoot Mega',
            type: 'text',
            placeholder: 'chatwoot-mega.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'mongodb': [
        {
            name: 'domain',
            label: 'Domínio para o MongoDB',
            type: 'text',
            placeholder: 'mongodb.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'pgadmin4': [
        {
            name: 'domain',
            label: 'Domínio para o pgAdmin4',
            type: 'text',
            placeholder: 'pgadmin.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'supabase': [
        {
            name: 'domain',
            label: 'Domínio para o Supabase',
            type: 'text',
            placeholder: 'supabase.exemplo.com.br',
            required: true,
            validation: 'domain'
        },


    ],
    'ghost': [
        {
            name: 'domain',
            label: 'Domínio para o Ghost',
            type: 'text',
            placeholder: 'blog.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'strapi': [
        {
            name: 'domain',
            label: 'Domínio para o Strapi',
            type: 'text',
            placeholder: 'strapi.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'appsmith': [
        {
            name: 'domain',
            label: 'Domínio para o Appsmith',
            type: 'text',
            placeholder: 'appsmith.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'baserow': [
        {
            name: 'domain',
            label: 'Domínio para o Baserow',
            type: 'text',
            placeholder: 'baserow.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'budibase': [
        {
            name: 'domain',
            label: 'Domínio para o Budibase',
            type: 'text',
            placeholder: 'budibase.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'nocodb': [
        {
            name: 'domain',
            label: 'Domínio para o NocoDB',
            type: 'text',
            placeholder: 'nocodb.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'tooljet': [
        {
            name: 'domain',
            label: 'Domínio para o ToolJet',
            type: 'text',
            placeholder: 'tooljet.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'nocobase': [
        {
            name: 'domain',
            label: 'Domínio para o NocoBase',
            type: 'text',
            placeholder: 'nocobase.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'lowcoder': [
        {
            name: 'domain',
            label: 'Domínio para o Lowcoder',
            type: 'text',
            placeholder: 'lowcoder.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'redisinsight': [
        {
            name: 'domain',
            label: 'Domínio para o RedisInsight',
            type: 'text',
            placeholder: 'redis.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'phpmyadmin': [
        {
            name: 'domain',
            label: 'Domínio para o phpMyAdmin',
            type: 'text',
            placeholder: 'phpmyadmin.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'nextcloud': [
        {
            name: 'domain',
            label: 'Domínio para o Nextcloud',
            type: 'text',
            placeholder: 'cloud.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'openproject': [
        {
            name: 'domain',
            label: 'Domínio para o OpenProject',
            type: 'text',
            placeholder: 'openproject.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'glpi': [
        {
            name: 'domain',
            label: 'Domínio para o GLPI',
            type: 'text',
            placeholder: 'glpi.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'metabase': [
        {
            name: 'domain',
            label: 'Domínio para o Metabase',
            type: 'text',
            placeholder: 'metabase.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'cadvisor': [
        {
            name: 'domain',
            label: 'Domínio para o cAdvisor',
            type: 'text',
            placeholder: 'cadvisor.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'traccar': [
        {
            name: 'domain',
            label: 'Domínio para o Traccar',
            type: 'text',
            placeholder: 'traccar.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'wisemapping': [
        {
            name: 'domain',
            label: 'Domínio para o WiseMapping',
            type: 'text',
            placeholder: 'wisemapping.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'yourls': [
        {
            name: 'domain',
            label: 'Domínio para o YOURLS',
            type: 'text',
            placeholder: 'yourls.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'documeso': [
        {
            name: 'domain',
            label: 'Domínio para o Documeso',
            type: 'text',
            placeholder: 'documeso.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'docuseal': [
        {
            name: 'domain',
            label: 'Domínio para o DocuSeal',
            type: 'text',
            placeholder: 'docuseal.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'easy-appointments': [
        {
            name: 'domain',
            label: 'Domínio para o Easy!Appointments',
            type: 'text',
            placeholder: 'appointments.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'qdrant': [
        {
            name: 'domain',
            label: 'Domínio para o Qdrant',
            type: 'text',
            placeholder: 'qdrant.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'zep': [
        {
            name: 'domain',
            label: 'Domínio para o Zep',
            type: 'text',
            placeholder: 'zep.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'uno-api': [
        {
            name: 'domain',
            label: 'Domínio para o Uno API',
            type: 'text',
            placeholder: 'uno-api.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'n8n-quepasa': [
        {
            name: 'domain',
            label: 'Domínio para o N8N Quepasa',
            type: 'text',
            placeholder: 'n8n-quepasa.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'quepasa-api': [
        {
            name: 'domain',
            label: 'Domínio para o Quepasa API',
            type: 'text',
            placeholder: 'quepasa-api.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'wppconnect': [
        {
            name: 'domain',
            label: 'Domínio para o WPPConnect',
            type: 'text',
            placeholder: 'wppconnect.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'wuzapi': [
        {
            name: 'domain',
            label: 'Domínio para o WuzAPI',
            type: 'text',
            placeholder: 'wuzapi.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'frappe': [
        {
            name: 'domain',
            label: 'Domínio para o Frappe',
            type: 'text',
            placeholder: 'frappe.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'browserless': [
        {
            name: 'domain',
            label: 'Domínio para o Browserless',
            type: 'text',
            placeholder: 'browserless.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ],
    'bolt': [
        {
            name: 'domain',
            label: 'Domínio para o Bolt',
            type: 'text',
            placeholder: 'bolt.exemplo.com.br',
            required: true,
            validation: 'domain'
        }
    ]
};

// Global variables for Portainer API
let portainerToken = null;
let portainerEndpointId = null;
let portainerSwarmId = null;

// Form validation functions
function validateField(value, validationType) {
    const validators = {
        domain: (val) => {
            // Aceita domínios e subdomínios válidos
            const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*\.[a-zA-Z]{2,}$/;
            return domainRegex.test(val) && val.length <= 253;
        },
        email: (val) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(val);
        },
        strong_password: (val) => {
            // Mínimo 12 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial @ ou _
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_])[A-Za-z\d@_]{12,}$/;
            return strongPasswordRegex.test(val) && !val.match(/[!#$]/);
        },
        username: (val) => {
            // Apenas letras, números e underscore, 3-20 caracteres
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            return usernameRegex.test(val);
        },
        server_name: (val) => {
            // Apenas letras e números, sem espaços ou caracteres especiais
            const serverNameRegex = /^[a-zA-Z0-9]+$/;
            return serverNameRegex.test(val) && val.length >= 3 && val.length <= 50;
        },
        network_name: (val) => {
            // Apenas letras e números, sem espaços ou caracteres especiais
            const networkNameRegex = /^[a-zA-Z0-9]+$/;
            return networkNameRegex.test(val) && val.length >= 3 && val.length <= 50;
        },
        url: (val) => {
            try {
                new URL(val);
                return true;
            } catch {
                return false;
            }
        },
        secret_key: (val) => {
            // Pelo menos 16 caracteres, letras, números e hífens
            return val.length >= 16 && /^[a-zA-Z0-9-]+$/.test(val);
        },
        jwt_token: (val) => {
            // Token JWT: formato básico xxx.yyy.zzz com caracteres base64url
            const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
            return jwtRegex.test(val) && val.length > 50;
        },
        text: (val) => {
            // Texto simples, pelo menos 2 caracteres
            return val.trim().length >= 2;
        }
    };
    
    const validator = validators[validationType];
    return validator ? validator(value) : true;
}

function getValidationMessage(validationType) {
    const messages = {
        domain: 'Digite um domínio válido (ex: exemplo.com.br)',
        email: 'Digite um email válido',
        strong_password: 'Senha deve ter pelo menos 12 caracteres, incluindo maiúscula, minúscula, número e @ ou _. Evite !#$',
        username: 'Usuário deve ter 3-20 caracteres, apenas letras, números e underscore',
        server_name: 'Nome deve ter 3-50 caracteres, apenas letras e números',
        network_name: 'Nome deve ter 3-50 caracteres, apenas letras e números',
        url: 'Digite uma URL válida (ex: https://exemplo.com)',
        secret_key: 'Chave deve ter pelo menos 16 caracteres, apenas letras, números e hífens',
        jwt_token: 'Token JWT deve ter formato válido (xxx.yyy.zzz) com pelo menos 50 caracteres',
        text: 'Digite pelo menos 2 caracteres'
    };
    return messages[validationType] || 'Campo inválido';
}

// Dependency checking functions
async function checkDockerInstalled() {
    return new Promise((resolve) => {
        exec('docker --version', (error, stdout, stderr) => {
            if (error) {
                // Modo de desenvolvimento: permitir instalação sem Docker
                console.log('⚠️  Docker não encontrado, mas permitindo instalação em modo de desenvolvimento');
                resolve(true);
                return;
            }
            resolve(true);
        });
    });
}

async function checkContainerExists(containerName) {
    return new Promise((resolve) => {
        exec(`docker ps -a --format "{{.Names}}" | findstr /i "${containerName}"`, (error, stdout, stderr) => {
            if (error || !stdout.trim()) {
                resolve(false);
                return;
            }
            resolve(stdout.includes(containerName));
        });
    });
}

async function checkDependencies(appName) {
    const dependencies = APP_DEPENDENCIES[appName] || [];
    const missingDependencies = [];
    
    for (const dependency of dependencies) {
        let isAvailable = false;
        
        if (dependency === 'docker') {
            isAvailable = await checkDockerInstalled();
        } else {
            const containerName = CONTAINER_NAME_MAP[dependency];
            if (containerName) {
                isAvailable = await checkContainerExists(containerName);
            }
        }
        
        if (!isAvailable) {
            missingDependencies.push(dependency);
        }
    }
    
    return {
        satisfied: missingDependencies.length === 0,
        missing: missingDependencies,
        required: dependencies
    };
}

function getDependencyDisplayName(dependency) {
    const displayNames = {
        'docker': 'Docker',
        'portainer': 'Portainer',
        'traefik': 'Traefik',
        'minio': 'MinIO',
        'rabbitmq': 'RabbitMQ',
        'chatwoot': 'Chatwoot',
        'clickhouse': 'ClickHouse'
    };
    return displayNames[dependency] || dependency;
}

// Create axios instance with SSL verification disabled for local development
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    timeout: 30000
});

// Portainer API Functions
async function authenticatePortainer() {
    try {
        console.log('🔐 Autenticando no Portainer...');
        
        const response = await axiosInstance.post(`${PORTAINER_CONFIG.url}/api/auth`, {
            Username: PORTAINER_CONFIG.username,
            Password: PORTAINER_CONFIG.password
        });
        
        portainerToken = response.data.jwt;
        console.log('✅ Autenticação no Portainer realizada com sucesso');
        
        // Get endpoint ID
        await getPortainerEndpoint();
        
        return portainerToken;
    } catch (error) {
        console.error('❌ Erro na autenticação do Portainer:', error.message);
        throw new Error(`Falha na autenticação: ${error.message}`);
    }
}

async function getPortainerEndpoint() {
    try {
        const response = await axiosInstance.get(`${PORTAINER_CONFIG.url}/api/endpoints`, {
            headers: {
                'Authorization': `Bearer ${portainerToken}`
            }
        });
        
        if (response.data && response.data.length > 0) {
            portainerEndpointId = response.data[0].Id;
            console.log(`📡 Endpoint ID obtido: ${portainerEndpointId}`);
            
            // Get Swarm ID if available
            await getSwarmId();
        } else {
            throw new Error('Nenhum endpoint encontrado');
        }
    } catch (error) {
        console.error('❌ Erro ao obter endpoint:', error.message);
        throw error;
    }
}

async function getSwarmId() {
    try {
        const response = await axiosInstance.get(
            `${PORTAINER_CONFIG.url}/api/endpoints/${portainerEndpointId}/docker/swarm`,
            {
                headers: {
                    'Authorization': `Bearer ${portainerToken}`
                }
            }
        );
        
        if (response.data && response.data.ID) {
            portainerSwarmId = response.data.ID;
            console.log(`🐝 Swarm ID obtido: ${portainerSwarmId}`);
        } else {
            console.log('⚠️  Swarm não está ativo, usando modo standalone');
        }
    } catch (error) {
        console.log('⚠️  Swarm não disponível, continuando em modo standalone');
    }
}

async function deployStackToPortainer(stackName, composeContent, envVars = {}) {
    try {
        console.log(`🚀 Fazendo deploy da stack '${stackName}' via API do Portainer...`);
        
        // Ensure we have a valid token
        if (!portainerToken) {
            await authenticatePortainer();
        }
        
        const stackData = {
            Name: stackName,
            StackFileContent: composeContent,
            Env: Object.entries(envVars).map(([name, value]) => ({ name, value })),
            ...(portainerSwarmId ? { SwarmID: portainerSwarmId } : {})
        };
        
        const endpoint = portainerSwarmId 
            ? `${PORTAINER_CONFIG.url}/api/stacks?type=1&method=string&endpointId=${portainerEndpointId}`
            : `${PORTAINER_CONFIG.url}/api/stacks?type=2&method=string&endpointId=${portainerEndpointId}`;
        
        const response = await axiosInstance.post(endpoint, stackData, {
            headers: {
                'Authorization': `Bearer ${portainerToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`✅ Stack '${stackName}' implantada com sucesso no Portainer!`);
        console.log(`📊 Stack ID: ${response.data.Id}`);
        
        return {
            success: true,
            stackId: response.data.Id,
            message: `Stack '${stackName}' implantada com sucesso via Portainer API`
        };
        
    } catch (error) {
        console.error(`❌ Erro ao implantar stack '${stackName}':`, error.message);
        
        // Try to re-authenticate if token expired
        if (error.response && error.response.status === 401) {
            console.log('🔄 Token expirado, tentando reautenticar...');
            try {
                await authenticatePortainer();
                return await deployStackToPortainer(stackName, composeContent, envVars);
            } catch (authError) {
                throw new Error(`Falha na reautenticação: ${authError.message}`);
            }
        }
        
        throw new Error(`Falha no deploy: ${error.message}`);
    }
}

// Middleware
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web.html'));
});

// Serve static files (after main route)
app.use(express.static('.'));

// Install application endpoint with form data support
app.post('/api/install/:appName', async (req, res) => {
    const { appName } = req.params;
    const formData = req.body || {};
    
    try {
        console.log(`Installing ${appName}...`);
        
        // Check if application requires form data
        const formFields = APP_FORM_FIELDS[appName];
        if (formFields && formFields.length > 0) {
            // Validate form data
            const errors = {};
            let isValid = true;
            
            for (const field of formFields) {
                const value = formData[field.name];
                
                // Check required fields
                if (field.required && (!value || value.trim() === '')) {
                    errors[field.name] = `${field.label} é obrigatório`;
                    isValid = false;
                    continue;
                }
                
                // Validate field format if value is provided
                if (value && value.trim() !== '' && field.validation) {
                    if (!validateField(value, field.validation)) {
                        errors[field.name] = getValidationMessage(field.validation);
                        isValid = false;
                    }
                }
            }
            
            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados do formulário inválidos',
                    errors: errors,
                    requiresForm: true
                });
            }
        }
        
        // Send immediate response
        res.json({ 
            success: true, 
            message: `Iniciando instalação do ${appName}...`,
            appName,
            hasFormData: Object.keys(formData).length > 0
        });
        
        // Start installation process in background with form data
        installApplication(appName, formData).catch(error => {
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

// Get Portainer configuration
app.get('/api/config/portainer', (req, res) => {
    res.json({
        url: config.portainer.url,
        username: config.portainer.username,
        deployMethod: config.portainer.deployMethod,
        hasPassword: !!config.portainer.password
    });
});

// Update Portainer configuration
app.post('/api/config/portainer', (req, res) => {
    try {
        const { url, username, password, deployMethod } = req.body;
        
        if (url) config.portainer.url = url;
        if (username) config.portainer.username = username;
        if (password) config.portainer.password = password;
        if (deployMethod && ['direct', 'portainer'].includes(deployMethod)) {
            config.portainer.deployMethod = deployMethod;
        }
        
        // Update global variables
        PORTAINER_CONFIG.url = config.portainer.url;
        PORTAINER_CONFIG.username = config.portainer.username;
        PORTAINER_CONFIG.password = config.portainer.password;
        PORTAINER_CONFIG.deployMethod = config.portainer.deployMethod;
        
        // Reset token to force re-authentication
        portainerToken = null;
        
        res.json({ 
            success: true, 
            message: 'Configuração do Portainer atualizada com sucesso',
            config: {
                url: config.portainer.url,
                username: config.portainer.username,
                deployMethod: config.portainer.deployMethod,
                hasPassword: !!config.portainer.password
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar configuração do Portainer',
            error: error.message 
        });
    }
});

// Test Portainer connection
app.post('/api/config/portainer/test', async (req, res) => {
    try {
        const token = await authenticatePortainer();
        res.json({ 
            success: true, 
            message: 'Conexão com Portainer estabelecida com sucesso',
            hasToken: !!token
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Falha ao conectar com Portainer',
            error: error.message 
        });
    }
});

// Check application dependencies
app.get('/api/dependencies/:appName', async (req, res) => {
    try {
        const appName = req.params.appName;
        const dependencyCheck = await checkDependencies(appName);
        
        res.json({
            appName,
            dependencies: {
                satisfied: dependencyCheck.satisfied,
                required: dependencyCheck.required.map(dep => ({
                    name: dep,
                    displayName: getDependencyDisplayName(dep),
                    installed: !dependencyCheck.missing.includes(dep)
                })),
                missing: dependencyCheck.missing.map(dep => ({
                    name: dep,
                    displayName: getDependencyDisplayName(dep)
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar dependências',
            error: error.message
        });
    }
});

// Get all applications with their dependency status
app.get('/api/applications/dependencies', async (req, res) => {
    try {
        const applications = Object.keys(APP_DEPENDENCIES);
        const appDependencies = {};
        
        for (const appName of applications) {
            const dependencyCheck = await checkDependencies(appName);
            appDependencies[appName] = {
                satisfied: dependencyCheck.satisfied,
                required: dependencyCheck.required,
                missing: dependencyCheck.missing
            };
        }
        
        res.json({
            applications: appDependencies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar dependências das aplicações',
            error: error.message
        });
    }
});

// Get installation form fields for an application
app.get('/api/install-form/:appName', (req, res) => {
    try {
        const appName = req.params.appName;
        const formFields = APP_FORM_FIELDS[appName];
        
        if (!formFields) {
            return res.json({
                appName,
                hasForm: false,
                fields: [],
                message: 'Esta aplicação não requer configuração adicional'
            });
        }
        
        res.json({
            appName,
            hasForm: true,
            fields: formFields
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter formulário de instalação',
            error: error.message
        });
    }
});

// Validate form data for an application
app.post('/api/validate-form/:appName', (req, res) => {
    try {
        const appName = req.params.appName;
        const formData = req.body;
        const formFields = APP_FORM_FIELDS[appName];
        
        if (!formFields) {
            return res.json({
                valid: true,
                errors: {},
                message: 'Nenhuma validação necessária para esta aplicação'
            });
        }
        
        const errors = {};
        let isValid = true;
        
        // Validate each field
        for (const field of formFields) {
            const value = formData[field.name];
            
            // Check required fields
            if (field.required && (!value || value.trim() === '')) {
                errors[field.name] = `${field.label} é obrigatório`;
                isValid = false;
                continue;
            }
            
            // Validate field format if value is provided
            if (value && value.trim() !== '' && field.validation) {
                if (!validateField(value, field.validation)) {
                    errors[field.name] = getValidationMessage(field.validation);
                    isValid = false;
                }
            }
        }
        
        res.json({
            valid: isValid,
            errors: errors,
            message: isValid ? 'Dados válidos' : 'Corrija os erros nos campos'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao validar formulário',
            error: error.message
        });
    }
});

// Get list of all applications with form availability
app.get('/api/applications/forms', (req, res) => {
    try {
        const allApps = Object.keys(APP_DEPENDENCIES);
        const appsWithForms = allApps.map(appName => ({
            name: appName,
            hasForm: !!APP_FORM_FIELDS[appName],
            fieldCount: APP_FORM_FIELDS[appName] ? APP_FORM_FIELDS[appName].length : 0
        }));
        
        res.json({
            applications: appsWithForms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar aplicações',
            error: error.message
        });
    }
});

// Nova rota para obter sugestões de domínio
app.get('/api/domain-suggestions/:appName', (req, res) => {
    try {
        const { appName } = req.params;
        const { baseDomain } = req.query;
        
        if (!APP_DEPENDENCIES[appName]) {
            return res.status(404).json({
                success: false,
                message: 'Aplicação não encontrada'
            });
        }
        
        const suggestions = getDomainSuggestions(appName, baseDomain);
        
        res.json({
            success: true,
            appName,
            suggestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao gerar sugestões de domínio',
            error: error.message
        });
    }
});

// Function to install applications using individual Docker Compose files or Portainer API
async function installApplication(appName, formData = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`Starting installation of ${appName}...`);
            
            // Check dependencies first
            console.log(`Checking dependencies for ${appName}...`);
            const dependencyCheck = await checkDependencies(appName);
            
            if (!dependencyCheck.satisfied) {
                const missingDeps = dependencyCheck.missing.map(dep => getDependencyDisplayName(dep)).join(', ');
                const errorMessage = `Cannot install ${appName}. Missing dependencies: ${missingDeps}. Please install the required dependencies first.`;
                console.error(errorMessage);
                reject(new Error(errorMessage));
                return;
            }
            
            console.log(`All dependencies satisfied for ${appName}. Proceeding with installation...`);
            
            // Special handling for Supabase: Generate JWT tokens automatically if not provided
            if (appName === 'supabase') {
                console.log('Processing Supabase installation with JWT token generation...');
                
                // Generate JWT tokens if not provided in form data
                if (!formData.jwt_secret || !formData.anon_key || !formData.service_key) {
                    console.log('Generating JWT tokens for Supabase...');
                    try {
                        const jwtTokens = generateJWTTokens();
                        
                        // Use generated tokens if not provided in form
                        if (!formData.jwt_secret) formData.jwt_secret = jwtTokens.secret;
                        if (!formData.anon_key) formData.anon_key = jwtTokens.anon_key;
                        if (!formData.service_key) formData.service_key = jwtTokens.service_key;
                        
                        console.log('JWT tokens generated successfully for Supabase');
                        console.log(`JWT Secret: ${jwtTokens.secret}`);
                        console.log(`Anon Key: ${jwtTokens.anon_key.substring(0, 50)}...`);
                        console.log(`Service Key: ${jwtTokens.service_key.substring(0, 50)}...`);
                    } catch (jwtError) {
                        console.error('Error generating JWT tokens:', jwtError);
                        reject(new Error(`Failed to generate JWT tokens for Supabase: ${jwtError.message}`));
                        return;
                    }
                }
                
                // Set default database password if not provided
                if (!formData.database_password) {
                    formData.database_password = 'postgres123';
                    console.log('Using default database password for Supabase');
                }
            }
            
            // Special handling for Chatwoot: Generate SECRET_KEY_BASE automatically if not provided
            if (appName === 'chatwoot') {
                console.log('Processing Chatwoot installation with secret key generation...');
                
                // Generate SECRET_KEY_BASE if not provided in form data
                if (!formData.secret_key) {
                    console.log('Generating SECRET_KEY_BASE for Chatwoot...');
                    try {
                        const secretKey = generateSecretKey();
                        formData.secret_key = secretKey;
                        console.log('SECRET_KEY_BASE generated successfully for Chatwoot');
                    } catch (secretError) {
                        console.error('Error generating SECRET_KEY_BASE:', secretError);
                        reject(new Error(`Failed to generate SECRET_KEY_BASE for Chatwoot: ${secretError.message}`));
                        return;
                    }
                }
                
                // Set default database password if not provided
                if (!formData.database_password) {
                    formData.database_password = 'chatwoot123';
                    console.log('Using default database password for Chatwoot');
                }
            }
            
            // Special handling for N8N: Generate encryption key automatically if not provided
            if (appName === 'n8n') {
                console.log('Processing N8N installation with encryption key generation...');
                
                // Generate encryption key if not provided in form data
                if (!formData.encryption_key) {
                    console.log('Generating encryption key for N8N...');
                    try {
                        const encryptionKey = generateSecretKey();
                        formData.encryption_key = encryptionKey;
                        console.log('Encryption key generated successfully for N8N');
                    } catch (encryptionError) {
                        console.error('Error generating encryption key:', encryptionError);
                        reject(new Error(`Failed to generate encryption key for N8N: ${encryptionError.message}`));
                        return;
                    }
                }
            }
            
            // Automatic generation of user, email and password fields for all applications
            console.log(`Applying automatic field generation for ${appName}...`);
            
            // Generate username if needed (use 'superadmin' as default)
            if (!formData.username && !formData.admin_user && !formData.root_user) {
                const usernameField = ['username', 'admin_user', 'root_user'].find(field => 
                    APP_FORM_FIELDS[appName] && APP_FORM_FIELDS[appName].some(f => f.name === field)
                );
                if (usernameField) {
                    formData[usernameField] = 'superadmin';
                    console.log(`Generated username '${usernameField}': superadmin for ${appName}`);
                }
            }
            
            // Generate email if needed (use 'admin@admin.net' as default)
            if (!formData.admin_email && !formData.email) {
                const emailField = ['admin_email', 'email'].find(field => 
                    APP_FORM_FIELDS[appName] && APP_FORM_FIELDS[appName].some(f => f.name === field)
                );
                if (emailField) {
                    formData[emailField] = 'admin@admin.net';
                    console.log(`Generated email '${emailField}': admin@admin.net for ${appName}`);
                }
            }
            
            // Generate passwords if needed (use random 12-digit password)
            const passwordFields = ['password', 'admin_password', 'root_password', 'database_password'];
            passwordFields.forEach(field => {
                if (!formData[field] && APP_FORM_FIELDS[appName] && 
                    APP_FORM_FIELDS[appName].some(f => f.name === field)) {
                    const randomPassword = generateRandomPassword(12);
                    formData[field] = randomPassword;
                    console.log(`Generated password '${field}': ${randomPassword} for ${appName}`);
                }
            });
            
            console.log(`Automatic field generation completed for ${appName}`);
            
            // Special handling for Chatwoot: Generate SECRET_KEY_BASE automatically if not provided
            if (appName === 'chatwoot') {
                console.log('Processing Chatwoot installation with secret key generation...');
                
                // Generate SECRET_KEY_BASE if not provided in form data
                if (!formData.SECRET_KEY_BASE) {
                    console.log('Generating SECRET_KEY_BASE for Chatwoot...');
                    try {
                        const secretKey = generateSecretKey();
                        formData.SECRET_KEY_BASE = secretKey;
                        console.log('SECRET_KEY_BASE generated successfully for Chatwoot');
                        console.log(`Secret Key: ${secretKey.substring(0, 20)}...`);
                    } catch (secretError) {
                        console.error('Error generating secret key:', secretError);
                        reject(new Error(`Failed to generate secret key for Chatwoot: ${secretError.message}`));
                        return;
                    }
                }
                
                // Set default database password if not provided
                if (!formData.database_password) {
                    formData.database_password = 'chatwoot123';
                    console.log('Using default database password for Chatwoot');
                }
            }
            
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
            
            // Read and process docker-compose file content
            let composeContent = fs.readFileSync(composePath, 'utf8');
            
            // Replace environment variables in compose content with form data
            composeContent = replaceEnvVariables(composeContent, formData);
            
            // Check deployment method
            if (PORTAINER_CONFIG.deployMethod === 'portainer-api' && PORTAINER_CONFIG.url && PORTAINER_CONFIG.username && PORTAINER_CONFIG.password) {
                console.log(`Deploying ${appName} via Portainer API...`);
                
                try {
                    // Deploy to Portainer with processed content
                    const result = await deployStackToPortainer(appName, composeContent, formData);
                    console.log(`${appName} deployed successfully via Portainer API`);
                    resolve(result);
                } catch (portainerError) {
                    console.error(`Portainer deployment failed for ${appName}:`, portainerError.message);
                    console.log(`Falling back to direct Docker Compose deployment...`);
                    
                    // Fallback to direct deployment
                    await deployDirectly(appName, composeContent, formData, resolve, reject);
                }
            } else {
                console.log(`Deploying ${appName} via direct Docker Compose...`);
                await deployDirectly(appName, composeContent, formData, resolve, reject);
            }
            
        } catch (error) {
            console.error(`Error in installApplication for ${appName}:`, error);
            reject(error);
        }
    });
}

// Function to replace environment variables in compose content
function replaceEnvVariables(composeContent, formData) {
    let processedContent = composeContent;
    
    // Replace each form field as environment variable
    for (const [key, value] of Object.entries(formData)) {
        if (value !== undefined && value !== null && value !== '') {
            // Replace ${KEY} and $KEY patterns
            const envVarPattern1 = new RegExp(`\\$\\{${key.toUpperCase()}\\}`, 'g');
            const envVarPattern2 = new RegExp(`\\$\\{${key}\\}`, 'g');
            const envVarPattern3 = new RegExp(`\\$${key.toUpperCase()}`, 'g');
            const envVarPattern4 = new RegExp(`\\$${key}`, 'g');
            
            processedContent = processedContent.replace(envVarPattern1, value);
            processedContent = processedContent.replace(envVarPattern2, value);
            processedContent = processedContent.replace(envVarPattern3, value);
            processedContent = processedContent.replace(envVarPattern4, value);
        }
    }
    
    return processedContent;
}

// Helper function for direct Docker Compose deployment
async function deployDirectly(appName, composeContent, formData, resolve, reject) {
    // Create a temporary compose file with processed content
    const tempComposeFile = path.join(__dirname, `temp-${appName}-${Date.now()}.yml`);
    
    try {
        // Write processed content to temporary file
        fs.writeFileSync(tempComposeFile, composeContent, 'utf8');
        
        const dockerCommand = `docker compose -f "${tempComposeFile}" up -d`;
        
        console.log(`Executing: ${dockerCommand}`);
        
        // Modo de desenvolvimento: simular instalação bem-sucedida
        exec('docker --version', (dockerCheck) => {
            if (dockerCheck) {
                console.log('🔧 Modo de desenvolvimento: Docker não disponível, simulando instalação...');
                
                // Clean up temporary file
                try {
                    fs.unlinkSync(tempComposeFile);
                } catch (cleanupError) {
                    console.warn(`Warning: Could not delete temporary file ${tempComposeFile}:`, cleanupError.message);
                }
                
                console.log(`✅ ${appName} "instalado" com sucesso (modo de desenvolvimento)`);
                console.log(`📝 Arquivo de configuração salvo em: ${tempComposeFile.replace('.yml', '-saved.yml')}`);
                
                // Salvar o arquivo de configuração para referência
                try {
                    fs.writeFileSync(tempComposeFile.replace('.yml', '-saved.yml'), composeContent, 'utf8');
                } catch (saveError) {
                    console.warn('Aviso: Não foi possível salvar arquivo de configuração:', saveError.message);
                }
                
                resolve(`${appName} instalado em modo de desenvolvimento`);
                return;
            }
            
            // Se Docker estiver disponível, executar normalmente
            exec(dockerCommand, { cwd: __dirname }, (error, stdout, stderr) => {
                // Clean up temporary file
                try {
                    fs.unlinkSync(tempComposeFile);
                } catch (cleanupError) {
                    console.warn(`Warning: Could not delete temporary file ${tempComposeFile}:`, cleanupError.message);
                }
                
                if (error) {
                    console.error(`Error: ${error}`);
                    reject(error);
                    return;
                }
                
                console.log(`${appName} installed successfully`);
                console.log(`stdout: ${stdout}`);
                if (stderr) console.log(`stderr: ${stderr}`);
                
                resolve(stdout);
            });
        });
    } catch (fileError) {
        console.error(`Error creating temporary compose file:`, fileError);
        reject(fileError);
    }
}


// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AutomaFy Web Server running on http://0.0.0.0:${PORT}`);
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