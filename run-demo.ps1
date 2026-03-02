# 🚀 Run Demo - KMP Pharmacy System

Write-Host ""
Write-Host "🏥 KMP Pharmacy Management System" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   For Hayatabad Medical Complex, Peshawar" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Get workspace root
$workspaceRoot = $PSScriptRoot

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check MongoDB
Write-Host "1️⃣  Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "   ✅ MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MongoDB not detected" -ForegroundColor Red
        Write-Host "   💡 Make sure MongoDB is running or using Atlas connection" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Could not verify MongoDB status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2️⃣  Starting Backend Server (Port 3000)..." -ForegroundColor Yellow

# Check if port 3000 is already in use
if (Test-Port -Port 3000) {
    Write-Host "   ⚠️  Port 3000 is already in use" -ForegroundColor Yellow
    Write-Host "   💡 Backend might already be running" -ForegroundColor Cyan
} else {
    # Start backend in new terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspaceRoot\server'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; npm run dev"
    Write-Host "   ✅ Backend server starting in new window..." -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "3️⃣  Starting Frontend (Port 5173)..." -ForegroundColor Yellow

# Check if port 5173 is already in use  
if (Test-Port -Port 5173) {
    Write-Host "   ⚠️  Port 5173 is already in use" -ForegroundColor Yellow
    Write-Host "   💡 Frontend might already be running" -ForegroundColor Cyan
} else {
    # Start frontend in new terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspaceRoot\client'; Write-Host '⚛️  Frontend Starting...' -ForegroundColor Cyan; npm run dev"
    Write-Host "   ✅ Frontend starting in new window..." -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ System Starting!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Demo Login Credentials:" -ForegroundColor Cyan
Write-Host "   You'll need to create an account first!" -ForegroundColor Yellow
Write-Host "   Click 'Sign up' on the login page" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   Demo Guide:     DEMO_SETUP_GUIDE.md" -ForegroundColor White
Write-Host "   Barcode Guide:  BARCODE_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   - Wait 5-10 seconds for servers to fully start" -ForegroundColor Gray
Write-Host "   - Check terminal windows for any errors" -ForegroundColor Gray
Write-Host "   - Press Ctrl+C in terminal windows to stop servers" -ForegroundColor Gray
Write-Host ""

# Wait a bit then try to open browser
Start-Sleep -Seconds 5
Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 Ready for demo! Good luck in Hayatabad! 🏥" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
