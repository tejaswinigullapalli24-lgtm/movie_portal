@echo off
title CinePortal Launcher
set "PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;%PATH%"
cd /d "%~dp0"

echo ========================================================
echo  Starting CinePortal (Backend + Frontend)
echo ========================================================

:: 1. Start Backend Server (Port 3000) in its own window
start "CinePortal Backend Server (Port 3000)" cmd /c "set PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%%PATH%% & cd /d %~dp0 & node server.js"

:: 2. Wait 2 seconds for backend to boot
timeout /t 2 /nobreak >nul

:: 3. Start Frontend (Vite) in its own window
start "CinePortal Frontend (Port 5173)" cmd /c "set PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%%PATH%% & cd /d %~dp0 & node ./node_modules/vite/bin/vite.js"

:: 4. Automatically open browser
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo Done! The app is opening in your browser.
