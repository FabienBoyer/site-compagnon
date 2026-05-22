@echo off
chcp 65001 >nul
title PP Tracker - Demarrage
cd /d "%~dp0"

echo.
echo  PP Tracker - Demarrage
echo  ========================
echo.

:: Vérifier que le venv existe
if not exist ".venv\Scripts\python.exe" (
    echo  [!] Environnement Python introuvable - creation en cours...
    python -m venv .venv
    echo  [!] Installation des dependances...
    ".venv\Scripts\python.exe" -m pip install -r requirements.txt --quiet
    echo  [OK] Dependances installees.
    echo.
) else (
    :: Venv present - verifier quand meme python-multipart
    ".venv\Scripts\python.exe" -c "import multipart" 2>nul || (
        echo  [!] Installation des dependances manquantes...
        ".venv\Scripts\python.exe" -m pip install -r requirements.txt --quiet
    )
)

:: Lancer le backend
echo  [1/2] Demarrage du backend FastAPI...
start "PP Tracker Backend" cmd /k "cd /d "%~dp0" && ".venv\Scripts\python.exe" -m uvicorn backend.main:app --reload"

timeout /t 4 /nobreak >nul

:: Lancer le frontend
echo  [2/2] Demarrage du frontend React...
start "PP Tracker Frontend" cmd /k "cd /d "%~dp0\frontend" && npm run dev"

:: Attendre et ouvrir le navigateur
echo.
echo  Ouverture du navigateur dans 6 secondes...
timeout /t 6 /nobreak >nul
start http://localhost:5173

echo.
echo  PP Tracker est lance !
echo  Ferme cette fenetre quand tu veux.
echo.
pause
