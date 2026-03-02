# 🚀 Quick Start Scripts

# Script 1: First-Time Setup (Run Once)
Write-Host "🏥 KMP Pharmacy - First Time Setup" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "1️⃣  Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process mongod -ErrorAction Stop
    Write-Host "   ✅ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  MongoDB not detected" -ForegroundColor Red
    Write-Host "   📝 Please start MongoDB or use MongoDB Atlas" -ForegroundColor Yellow
    Write-Host "   💡 Download: https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
    Write-Host ""
}

# Seed the database
Write-Host ""
Write-Host "2️⃣  Seeding database with Pakistani medicines..." -ForegroundColor Yellow
Set-Location -Path "server"
node seedDatabase.js

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Run: .\run-demo.ps1" -ForegroundColor White
Write-Host "   2. Open browser: http://localhost:5173" -ForegroundColor White
Write-Host "   3. Login with test account (see DEMO_SETUP_GUIDE.md)" -ForegroundColor White
Write-Host ""
