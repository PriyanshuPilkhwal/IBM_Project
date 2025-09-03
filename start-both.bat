@echo off
echo Starting Flask backend...
start "Flask Backend" cmd /k "cd /d D:\OneDrive\Desktop\projectibm && python app.py"

echo Waiting 3 seconds for Flask to start...
timeout /t 3 /nobreak > nul

echo Testing API...
python test_api.py

echo.
echo Starting React frontend...
start "React Frontend" cmd /k "cd /d D:\OneDrive\Desktop\projectibm && npm run dev"

echo.
echo Both servers are starting...
echo Flask: http://localhost:5000
echo React: http://localhost:3000
echo.
pause
