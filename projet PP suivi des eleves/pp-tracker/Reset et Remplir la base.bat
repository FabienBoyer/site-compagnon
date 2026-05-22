@echo off
chcp 65001 >nul
title PP Tracker - Reset base de donnees
cd /d "%~dp0"

echo.
echo  PP Tracker - Reset et remplissage de la base
echo  ==============================================
echo.

echo  [1/3] Arret des anciens serveurs...
taskkill /FI "WINDOWTITLE eq PP Tracker Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PP Tracker Frontend*" /F >nul 2>&1
timeout /t 2 /nobreak >nul

echo  [2/3] Installation des dependances manquantes...
".venv\Scripts\python.exe" -m pip install python-multipart --quiet

echo  [3/3] Reset de la base...
".venv\Scripts\python.exe" -m backend.reset_db

if %errorlevel% neq 0 (
    echo.
    echo  ERREUR ! Copie le message d'erreur ci-dessus.
    pause
    exit /b 1
)

echo.
echo  Termine ! Lance maintenant "Lancer PP Tracker.bat"
echo.
pause
