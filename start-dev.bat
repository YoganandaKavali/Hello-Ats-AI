@echo off
title AI Resume Analyzer - Dev Launcher
cd /d "%~dp0"

echo Starting HELLO ATS development stack...
echo.

if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Python venv not found. Run: python -m venv venv
    echo Then: pip install -r requirements.txt
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo Opening Django backend in a new window...
start "HELLO ATS - Django Backend" cmd /k "cd /d "%~dp0" && call venv\Scripts\activate.bat && python manage.py runserver"

timeout /t 2 /nobreak >nul

echo Opening React frontend in a new window...
start "HELLO ATS - React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Both servers are starting in separate windows.
pause
