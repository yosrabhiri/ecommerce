# Maison Glow - Project Runner Script
# This script automates the setup and execution of the Laravel backend and React frontend.

function Write-Header($text) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host " $text" -ForegroundColor Cyan -NoNewline
    Write-Host "`n========================================`n" -ForegroundColor Cyan
}

function Check-Command($cmd) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Host "Error: $cmd is not installed or not in PATH." -ForegroundColor Red
        return $false
    }
    return $true
}

# 1. Dependency Check
Write-Header "Checking Dependencies"
if (-not (Check-Command "php")) { exit 1 }
if (-not (Check-Command "composer")) { exit 1 }
if (-not (Check-Command "npm")) { exit 1 }

# 2. Backend Setup
Write-Header "Setting up Backend"
cd backend

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please check your .env file and configure your database credentials." -ForegroundColor Yellow
    # Optionally prompt for DB info here, but let's assume default for now or let user edit it
}



# 3. Frontend Setup
Write-Header "Setting up Frontend"
cd ../frontend



# 4. Start Servers
Write-Header "Starting Servers"
Write-Host "Opening Backend server in a new window (http://127.0.0.1:8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ../backend; php artisan serve"

Write-Host "Starting Frontend dev server..." -ForegroundColor Green
npm run dev

Write-Host "`nProject is running!" -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
