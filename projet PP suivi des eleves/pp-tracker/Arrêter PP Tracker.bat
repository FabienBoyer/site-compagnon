@echo off
title PP Tracker — Arrêt
echo.
echo  Arrêt de PP Tracker...
echo.

:: Ferme les fenêtres backend et frontend par leur titre
taskkill /FI "WINDOWTITLE eq PP Tracker — Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PP Tracker — Frontend*" /F >nul 2>&1

:: Arrête aussi uvicorn et node au cas où
taskkill /IM "python.exe" /F >nul 2>&1
taskkill /IM "node.exe" /F >nul 2>&1

echo  Serveurs arrêtés.
echo.
timeout /t 2 /nobreak >nul
