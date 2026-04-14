Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "web")
Write-Host "[pokemon_type] local server starting..." -ForegroundColor Cyan
npx --yes serve .
