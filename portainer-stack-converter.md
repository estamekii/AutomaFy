# Portainer Stack Converter - AutomaFy

## Problema
Quando você instala stacks no Portainer usando arquivos `.yml` externos ou via linha de comando, o Portainer as marca como "external" (externas) e bloqueia a edição direta da interface.

## Soluções Disponíveis

### 1. Para Stacks do Git Repository
Se sua stack foi criada a partir de um repositório Git, você pode **desvinculá-la** para permitir edição:

1. Acesse **Stacks** no Portainer
2. Selecione a stack que deseja editar
3. Clique em **"Detach from Git"**
4. Confirme a ação

⚠️ **Atenção**: Esta ação é irreversível e você perderá a capacidade de atualizar automaticamente via Git.

### 2. Para Stacks Externas (External)
Para stacks criadas fora do Portainer, você precisa recriá-las:

#### Método 1: Recriar Manualmente
1. **Pare a stack atual** (se estiver rodando)
2. **Exporte a configuração** atual:
   ```bash
   docker-compose -f seu-arquivo.yml config > stack-exportada.yml
   ```
3. **Remova a stack externa**:
   ```bash
   docker-compose -f seu-arquivo.yml down
   ```
4. **Crie nova stack no Portainer**:
   - Vá em **Stacks** → **Add Stack**
   - Escolha **"Web Editor"** ou **"Upload"**
   - Cole/carregue o conteúdo do arquivo `stack-exportada.yml`
   - Configure variáveis de ambiente se necessário
   - Clique em **"Deploy the stack"**

#### Método 2: Usar Docker-Autocompose (Recomendado)
1. **Instale docker-autocompose**:
   ```bash
   pip install docker-autocompose
   ```

2. **Gere compose file dos containers em execução**:
   ```bash
   docker-autocompose > automafy-stack.yml
   ```

3. **Pare e remova containers atuais**:
   ```bash
   docker stop $(docker ps -q)
   docker rm $(docker ps -aq)
   ```

4. **Crie nova stack no Portainer**:
   - Vá em **Stacks** → **Add Stack**
   - Nome: `automafy-stack`
   - Escolha **"Upload"** e selecione `automafy-stack.yml`
   - Ou use **"Web Editor"** e cole o conteúdo
   - Clique em **"Deploy the stack"**

### 3. Script Automatizado para AutomaFy

Crie um script para facilitar o processo:

```bash
#!/bin/bash
# portainer-converter.sh

echo "=== AutomaFy Portainer Stack Converter ==="
echo "Este script converte stacks externas em stacks editáveis"

# Verificar se docker-autocompose está instalado
if ! command -v docker-autocompose &> /dev/null; then
    echo "Instalando docker-autocompose..."
    pip install docker-autocompose
fi

# Gerar compose file dos containers atuais
echo "Gerando arquivo compose dos containers em execução..."
docker-autocompose > automafy-generated.yml

echo "Arquivo gerado: automafy-generated.yml"
echo ""
echo "Próximos passos:"
echo "1. Pare os containers atuais se necessário"
echo "2. Acesse Portainer → Stacks → Add Stack"
echo "3. Use o arquivo 'automafy-generated.yml' para criar a nova stack"
echo "4. A nova stack será totalmente editável no Portainer"
```

## Vantagens de Cada Método

### Web Editor/Upload (Recomendado)
✅ **Totalmente editável** no Portainer  
✅ **Controle completo** sobre compose file  
✅ **Variáveis de ambiente** configuráveis  
✅ **Backup e restore** fáceis  
✅ **Templates** reutilizáveis  

### Git Repository
✅ **Versionamento** automático  
✅ **Atualizações** via Git  
✅ **Colaboração** em equipe  
❌ **Edição limitada** (apenas variáveis)  

### External (Atual)
❌ **Sem edição** no Portainer  
❌ **Controle limitado**  
❌ **Difícil manutenção**  

## Recomendação Final

Para o **AutomaFy**, recomendo usar o **método Web Editor/Upload** pois oferece:
- Máxima flexibilidade para edições
- Interface amigável do Portainer
- Facilidade de backup e restore
- Controle total sobre a configuração

## Comandos Úteis

```bash
# Listar todas as stacks (incluindo externas)
docker stack ls

# Listar containers de uma stack específica
docker stack services nome-da-stack

# Exportar configuração atual
docker-compose config

# Verificar logs de uma stack
docker-compose logs -f

# Parar stack externa
docker-compose down

# Remover volumes órfãos
docker volume prune
```

---

**AutomaFy Web** - Solução completa para automação e gerenciamento de containers.