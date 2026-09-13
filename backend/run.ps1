Set-Location $PSScriptRoot
if (-not (Test-Path ".venv")) {
    Write-Host "[EcoRoute] Creating virtual environment (.venv)..." -ForegroundColor Cyan
    python -m venv .venv
    & .\.venv\Scripts\pip.exe install -r requirements.txt
}
Write-Host "[EcoRoute] Starting EcoRoute Bharat Backend Server..." -ForegroundColor Green
& .\.venv\Scripts\python.exe main.py
