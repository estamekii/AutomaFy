# AutomaFy - Guia de Conversão de Stacks do Portainer

## 🎯 Objetivo

Este guia resolve o problema de **stacks bloqueadas para edição** no Portainer. Quando você instala stacks usando arquivos `.yml` externos, o Portainer as marca como "external" e impede a edição direta.

## 🚀 Solução Rápida

### Para Windows (PowerShell)
```powershell
# Executar o script de conversão
.\convert-to-portainer-stack.ps1

# Com opções personalizadas
.\convert-to-portainer-stack.ps1 -StackName "minha-stack" -OutputFile "minha-stack.yml"
```

### Para Linux/Mac (Bash)
```bash
# Instalar docker-autocompose
pip install docker-autocompose

# Gerar compose file
docker-autocompose > automafy-stack.yml
```

## 📋 Processo Completo

### 1. Preparação
- ✅ Docker rodando
- ✅ Containers ativos
- ✅ Portainer acessível
- ✅ Backup dos dados importantes

### 2. Conversão

#### Opção A: Script Automatizado (Recomendado)
```powershell
# Windows
.\convert-to-portainer-stack.ps1 -Help
.\convert-to-portainer-stack.ps1 -StackName "automafy" -OutputFile "automafy.yml"
```

#### Opção B: Manual
```bash
# 1. Instalar ferramenta
pip install docker-autocompose

# 2. Gerar compose
docker-autocompose --format=yaml > automafy-stack.yml

# 3. Verificar arquivo
cat automafy-stack.yml
```

### 3. Implementação no Portainer

1. **Acesse Portainer**: `http://localhost:9000`
2. **Navegue**: `Stacks` → `Add Stack`
3. **Configure**:
   - Nome: `automafy-stack`
   - Método: `Upload` ou `Web Editor`
4. **Upload**: Selecione o arquivo `.yml` gerado
5. **Deploy**: Clique em `Deploy the stack`

### 4. Limpeza (Opcional)
```bash
# Parar containers antigos
docker stop $(docker ps -q)

# Remover containers antigos
docker rm $(docker ps -aq)

# Limpar volumes órfãos
docker volume prune
```

## 🔧 Tipos de Stack e Soluções

| Tipo de Stack | Editável? | Solução |
|---------------|-----------|----------|
| **Web Editor** | ✅ Sim | Nenhuma ação necessária |
| **Upload** | ✅ Sim | Nenhuma ação necessária |
| **Git Repository** | ⚠️ Limitado | `Detach from Git` |
| **External** | ❌ Não | Conversão necessária |

## 📁 Arquivos Incluídos

- `convert-to-portainer-stack.ps1` - Script PowerShell para Windows
- `portainer-stack-converter.md` - Documentação detalhada
- `README-PORTAINER.md` - Este guia rápido

## ⚡ Comandos Úteis

```bash
# Verificar containers rodando
docker ps

# Verificar todas as stacks
docker stack ls

# Logs de uma stack
docker-compose logs -f

# Status dos serviços
docker-compose ps

# Parar stack específica
docker-compose -f arquivo.yml down

# Iniciar stack específica
docker-compose -f arquivo.yml up -d
```

## 🎯 Vantagens da Conversão

### ✅ Antes (Stack Externa)
- ❌ Sem edição no Portainer
- ❌ Controle limitado
- ❌ Difícil manutenção
- ❌ Sem backup integrado

### ✅ Depois (Stack Editável)
- ✅ **Edição completa** no Portainer
- ✅ **Interface gráfica** amigável
- ✅ **Variáveis de ambiente** configuráveis
- ✅ **Backup e restore** fáceis
- ✅ **Templates** reutilizáveis
- ✅ **Logs integrados**
- ✅ **Monitoramento** visual

## 🚨 Troubleshooting

### Problema: "docker-autocompose não encontrado"
```bash
# Solução
pip install docker-autocompose

# Ou com Python específico
python3 -m pip install docker-autocompose
```

### Problema: "Arquivo vazio gerado"
```bash
# Verificar containers rodando
docker ps

# Se não houver containers, inicie-os primeiro
docker-compose up -d

# Aguarde e tente novamente
docker-autocompose > stack.yml
```

### Problema: "Erro de permissão"
```bash
# Linux/Mac
sudo docker-autocompose > stack.yml

# Windows (executar PowerShell como Administrador)
.\convert-to-portainer-stack.ps1
```

### Problema: "Stack já existe no Portainer"
1. Pare a stack atual no Portainer
2. Delete a stack atual
3. Crie nova stack com o arquivo gerado

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs**: `docker-compose logs`
2. **Consulte a documentação**: `portainer-stack-converter.md`
3. **Execute com debug**: `convert-to-portainer-stack.ps1 -Verbose`

## 🎉 Resultado Final

Após a conversão, você terá:

- ✅ Stack totalmente editável no Portainer
- ✅ Interface gráfica para gerenciamento
- ✅ Controle completo sobre configurações
- ✅ Facilidade para backup e restore
- ✅ Monitoramento integrado

---

**AutomaFy Web** - Transformando a gestão de containers em uma experiência simples e poderosa.

*Versão: 1.0 | Última atualização: Janeiro 2025*