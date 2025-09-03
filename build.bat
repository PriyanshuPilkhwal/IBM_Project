@echo off
echo Building AdmissionAI Pro for production...
echo.

REM Clean previous builds
if exist dist rmdir /s /q dist

REM Build the project
echo Building frontend...
npm run build

if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo Output directory: dist/
echo.
echo To serve the production build:
echo 1. Copy dist/ contents to your web server
echo 2. Or run: npx serve dist
echo.
pause