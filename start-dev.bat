@echo off
echo Starting AdmissionAI Pro...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)

REM Install Python dependencies if requirements.txt exists
if exist requirements.txt (
    echo Installing Python dependencies...
    pip install -r requirements.txt
)

REM Install Node.js dependencies if package.json exists
if exist package.json (
    echo Installing Node.js dependencies...
    npm install
)

REM Start backend server
echo.
echo Starting backend server (Flask)...
start "Backend Server" cmd /c "python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo Starting frontend server (Vite)...
start "Frontend Server" cmd /c "npm run dev"

echo.
echo AdmissionAI Pro is starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop both servers...
pause >nul

REM Kill both servers
taskkill /f /im python.exe /t >nul 2>&1
taskkill /f /im node.exe /t >nul 2>&1

echo Servers stopped.
pause