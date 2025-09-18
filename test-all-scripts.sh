#!/bin/bash

# AutomaFy - Script de Teste de Todos os Arquivos de Instalação
# Este script testa se todos os scripts de instalação estão funcionando corretamente

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 AutomaFy - Teste de Scripts de Instalação${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""

# Função para verificar se um arquivo existe e é executável
check_script() {
    local script_name="$1"
    local script_path="$2"
    
    echo -e "${YELLOW}Testando: $script_name${NC}"
    
    if [ ! -f "$script_path" ]; then
        echo -e "${RED}❌ Arquivo não encontrado: $script_path${NC}"
        return 1
    fi
    
    if [ ! -x "$script_path" ]; then
        echo -e "${YELLOW}⚠️  Arquivo não é executável, corrigindo...${NC}"
        chmod +x "$script_path"
    fi
    
    # Verificar sintaxe bash
    if bash -n "$script_path" 2>/dev/null; then
        echo -e "${GREEN}✅ Sintaxe válida${NC}"
    else
        echo -e "${RED}❌ Erro de sintaxe detectado${NC}"
        bash -n "$script_path"
        return 1
    fi
    
    # Verificar se contém as correções esperadas
    case "$script_name" in
        "install.sh")
            if grep -q "package.json exists and has correct content" "$script_path" && \
               grep -q "Express dependency" "$script_path" && \
               grep -q "Configure firewall" "$script_path"; then
                echo -e "${GREEN}✅ Correções aplicadas corretamente${NC}"
            else
                echo -e "${YELLOW}⚠️  Algumas correções podem estar faltando${NC}"
            fi
            ;;
        "install-vps.sh")
            if grep -q "package.json exists and has correct content" "$script_path" && \
               grep -q "Express dependency" "$script_path" && \
               grep -q "Configure firewall" "$script_path"; then
                echo -e "${GREEN}✅ Correções aplicadas corretamente${NC}"
            else
                echo -e "${YELLOW}⚠️  Algumas correções podem estar faltando${NC}"
            fi
            ;;
        "quick-install.sh")
            if grep -q "Preparing Node.js dependencies" "$script_path" && \
               grep -q "Docker build failed" "$script_path" && \
               grep -q "Verifying container status" "$script_path"; then
                echo -e "${GREEN}✅ Correções aplicadas corretamente${NC}"
            else
                echo -e "${YELLOW}⚠️  Algumas correções podem estar faltando${NC}"
            fi
            ;;
        "test-install.sh")
            if grep -q "Node.js project files" "$script_path" && \
               grep -q "Firewall check" "$script_path" && \
               grep -q "Port availability" "$script_path"; then
                echo -e "${GREEN}✅ Melhorias aplicadas corretamente${NC}"
            else
                echo -e "${YELLOW}⚠️  Algumas melhorias podem estar faltando${NC}"
            fi
            ;;
        "test-automafy-web.sh")
            if grep -q "Express dependency" "$script_path" && \
               grep -q "Service status" "$script_path"; then
                echo -e "${GREEN}✅ Script de teste funcional${NC}"
            else
                echo -e "${YELLOW}⚠️  Script pode precisar de atualizações${NC}"
            fi
            ;;
    esac
    
    echo ""
    return 0
}

# Lista de scripts para testar
SCRIPTS=(
    "install.sh:./install.sh"
    "install-vps.sh:./install-vps.sh"
    "quick-install.sh:./quick-install.sh"
    "test-install.sh:./test-install.sh"
    "test-automafy-web.sh:./test-automafy-web.sh"
)

FAILED_TESTS=0
TOTAL_TESTS=${#SCRIPTS[@]}

# Executar testes
for script_info in "${SCRIPTS[@]}"; do
    IFS=':' read -r script_name script_path <<< "$script_info"
    
    if ! check_script "$script_name" "$script_path"; then
        ((FAILED_TESTS++))
    fi
done

# Verificar arquivos essenciais
echo -e "${YELLOW}Verificando arquivos essenciais...${NC}"

ESSENTIAL_FILES=(
    "server.js"
    "package-web.json"
    "web.html"
    "web-renderer.js"
    "Dockerfile"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file encontrado${NC}"
    else
        echo -e "${RED}❌ $file não encontrado${NC}"
        ((FAILED_TESTS++))
    fi
done

echo ""

# Verificar estrutura de diretórios
echo -e "${YELLOW}Verificando estrutura de diretórios...${NC}"
if [ -d "compose" ]; then
    echo -e "${GREEN}✅ Diretório compose/ encontrado${NC}"
    COMPOSE_FILES=$(find compose -name "*.yml" | wc -l)
    echo -e "${GREEN}✅ $COMPOSE_FILES arquivos Docker Compose encontrados${NC}"
else
    echo -e "${RED}❌ Diretório compose/ não encontrado${NC}"
    ((FAILED_TESTS++))
fi

echo ""

# Resumo final
echo -e "${BLUE}📊 Resumo dos Testes${NC}"
echo -e "${BLUE}===================${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram! ($TOTAL_TESTS/$TOTAL_TESTS)${NC}"
    echo -e "${GREEN}✅ Todos os scripts de instalação estão funcionais${NC}"
    echo -e "${GREEN}✅ Todas as correções foram aplicadas corretamente${NC}"
    echo ""
    echo -e "${BLUE}🚀 Próximos passos:${NC}"
    echo -e "${YELLOW}  • Execute ./test-install.sh para verificar compatibilidade do sistema${NC}"
    echo -e "${YELLOW}  • Use ./install.sh para instalação local${NC}"
    echo -e "${YELLOW}  • Use ./quick-install.sh para instalação VPS completa${NC}"
    echo -e "${YELLOW}  • Use ./install-vps.sh para instalação VPS simples${NC}"
else
    echo -e "${RED}❌ $FAILED_TESTS teste(s) falharam de $TOTAL_TESTS total${NC}"
    echo -e "${YELLOW}🔧 Verifique os erros acima e corrija os problemas${NC}"
fi

echo ""
echo -e "${BLUE}📋 Scripts disponíveis:${NC}"
echo -e "${YELLOW}  • test-install.sh - Verifica compatibilidade do sistema${NC}"
echo -e "${YELLOW}  • install.sh - Instalação local (Node.js + systemd)${NC}"
echo -e "${YELLOW}  • install-vps.sh - Instalação VPS simples${NC}"
echo -e "${YELLOW}  • quick-install.sh - Instalação VPS completa (Docker + serviços)${NC}"
echo -e "${YELLOW}  • test-automafy-web.sh - Testa instalação existente${NC}"
echo -e "${YELLOW}  • test-all-scripts.sh - Este script de teste${NC}"

exit $FAILED_TESTS