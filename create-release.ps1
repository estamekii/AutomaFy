# Script para criar Release v1.1.0 no GitHub
# Requer token de acesso pessoal do GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken
)

# Configurações
$owner = "estamekii"
$repo = "AutomaFy"
$tag = "v1.1.0"
$name = "AutomaFy v1.1.0 - Suporte a Domínios Personalizados"

# Lê o conteúdo das release notes
$releaseNotesPath = "RELEASE-NOTES-v1.1.0.md"
if (Test-Path $releaseNotesPath) {
    $body = Get-Content $releaseNotesPath -Raw
} else {
    Write-Error "Arquivo RELEASE-NOTES-v1.1.0.md não encontrado!"
    exit 1
}

# Dados da release
$releaseData = @{
    tag_name = $tag
    target_commitish = "main"
    name = $name
    body = $body
    draft = $false
    prerelease = $false
    make_latest = "true"
} | ConvertTo-Json -Depth 10

# Headers para autenticação
$headers = @{
    "Authorization" = "Bearer $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "PowerShell-Script"
}

# URL da API
$url = "https://api.github.com/repos/$owner/$repo/releases"

try {
    Write-Host "🚀 Criando release $tag..." -ForegroundColor Yellow
    
    # Faz a requisição para criar a release
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $releaseData -ContentType "application/json"
    
    Write-Host "✅ Release criada com sucesso!" -ForegroundColor Green
    Write-Host "📋 Nome: $($response.name)" -ForegroundColor Cyan
    Write-Host "🏷️  Tag: $($response.tag_name)" -ForegroundColor Cyan
    Write-Host "🔗 URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host "📅 Criada em: $($response.created_at)" -ForegroundColor Cyan
    
    # Abre a release no navegador
    Start-Process $response.html_url
    
} catch {
    Write-Error "❌ Erro ao criar release: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Detalhes do erro: $errorBody" -ForegroundColor Red
    }
    
    exit 1
}

Write-Host "`n🎉 Release v1.1.0 publicada com sucesso!" -ForegroundColor Green
Write-Host "A página da release foi aberta no seu navegador." -ForegroundColor Yellow