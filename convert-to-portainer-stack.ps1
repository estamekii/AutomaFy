# AutomaFy - Portainer Stack Converter
# Script para converter stacks externas em stacks editáveis no Portainer

param(
    [string]$StackName = "automafy-stack",
    [string]$OutputFile = "automafy-stack.yml",
    [switch]$StopContainers = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "=== AutomaFy Portainer Stack Converter ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Uso: .\convert-to-portainer-stack.ps1 [opções]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opções:"
    Write-Host "  -StackName <nome>     Nome da stack (padrão: automafy-stack)"
    Write-Host "  -OutputFile <arquivo> Arquivo de saída (padrão: automafy-stack.yml)"
    Write-Host "  -StopContainers       Para containers antes da conversão"
    Write-Host "  -Help                 Mostra esta ajuda"
    Write-Host ""
    Write-Host "Exemplo:"
    Write-Host "  .\convert-to-portainer-stack.ps1 -StackName 'minha-stack' -OutputFile 'minha-stack.yml'"
    exit 0
}

Write-Host "=== AutomaFy Portainer Stack Converter ===" -ForegroundColor Green
Write-Host "Convertendo stacks externas para stacks editáveis no Portainer..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está rodando
try {
    docker version | Out-Null
    Write-Host "✓ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker não está rodando ou não está instalado" -ForegroundColor Red
    Write-Host "Por favor, inicie o Docker e tente novamente."
    exit 1
}

# Verificar se há containers rodando
$runningContainers = docker ps -q
if (-not $runningContainers) {
    Write-Host "⚠ Nenhum container está rodando atualmente" -ForegroundColor Yellow
    Write-Host "Certifique-se de que seus containers estão rodando antes de executar este script."
    exit 1
}

Write-Host "✓ Encontrados $($runningContainers.Count) container(s) rodando" -ForegroundColor Green

# Verificar se docker-autocompose está instalado
try {
    pip show docker-autocompose | Out-Null
    Write-Host "✓ docker-autocompose já está instalado" -ForegroundColor Green
} catch {
    Write-Host "⚠ docker-autocompose não encontrado. Instalando..." -ForegroundColor Yellow
    try {
        pip install docker-autocompose
        Write-Host "✓ docker-autocompose instalado com sucesso" -ForegroundColor Green
    } catch {
        Write-Host "✗ Erro ao instalar docker-autocompose" -ForegroundColor Red
        Write-Host "Por favor, instale manualmente: pip install docker-autocompose"
        exit 1
    }
}

# Parar containers se solicitado
if ($StopContainers) {
    Write-Host "⚠ Parando containers..." -ForegroundColor Yellow
    docker stop $runningContainers
    Write-Host "✓ Containers parados" -ForegroundColor Green
    
    # Aguardar um pouco para garantir que pararam
    Start-Sleep -Seconds 3
    
    # Reiniciar containers para gerar o compose
    Write-Host "↻ Reiniciando containers para gerar compose..." -ForegroundColor Cyan
    docker start $runningContainers
    Start-Sleep -Seconds 5
}

# Gerar arquivo docker-compose
Write-Host "📝 Gerando arquivo docker-compose..." -ForegroundColor Cyan
try {
    docker-autocompose --format=yaml > $OutputFile
    Write-Host "✓ Arquivo gerado: $OutputFile" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao gerar arquivo docker-compose" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo foi criado e tem conteúdo
if (Test-Path $OutputFile) {
    $fileSize = (Get-Item $OutputFile).Length
    if ($fileSize -gt 0) {
        Write-Host "✓ Arquivo criado com sucesso ($fileSize bytes)" -ForegroundColor Green
    } else {
        Write-Host "✗ Arquivo criado mas está vazio" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ Arquivo não foi criado" -ForegroundColor Red
    exit 1
}

# Mostrar prévia do arquivo
Write-Host ""
Write-Host "📋 Prévia do arquivo gerado:" -ForegroundColor Cyan
Write-Host "" + "-" * 50 -ForegroundColor Gray
Get-Content $OutputFile | Select-Object -First 20 | ForEach-Object { Write-Host $_ -ForegroundColor White }
if ((Get-Content $OutputFile).Count -gt 20) {
    Write-Host "... (arquivo truncado, veja $OutputFile para conteúdo completo)" -ForegroundColor Gray
}
Write-Host "" + "-" * 50 -ForegroundColor Gray
Write-Host ""

# Instruções finais
Write-Host "🎉 Conversão concluída com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Acesse seu Portainer (geralmente http://localhost:9000)" -ForegroundColor White
Write-Host "2. Vá em 'Stacks' → 'Add Stack'" -ForegroundColor White
Write-Host "3. Nome da stack: '$StackName'" -ForegroundColor White
Write-Host "4. Escolha 'Upload' e selecione o arquivo: '$OutputFile'" -ForegroundColor White
Write-Host "   OU escolha 'Web Editor' e cole o conteúdo do arquivo" -ForegroundColor White
Write-Host "5. Configure variáveis de ambiente se necessário" -ForegroundColor White
Write-Host "6. Clique em 'Deploy the stack'" -ForegroundColor White
Write-Host ""
Write-Host "⚠ Importante:" -ForegroundColor Yellow
Write-Host "- Pare os containers atuais antes de criar a nova stack no Portainer" -ForegroundColor White
Write-Host "- A nova stack será totalmente editável no Portainer" -ForegroundColor White
Write-Host "- Faça backup dos dados importantes antes de proceder" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Comandos úteis:" -ForegroundColor Cyan
Write-Host "Para parar containers atuais: docker stop `$(docker ps -q)" -ForegroundColor White
Write-Host "Para remover containers: docker rm `$(docker ps -aq)" -ForegroundColor White
Write-Host "Para limpar volumes órfãos: docker volume prune" -ForegroundColor White
Write-Host ""
Write-Host "AutomaFy Web - Solução completa para automação" -ForegroundColor Green