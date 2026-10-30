@echo off
title CinePortal Frontend (Vite)
set "PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo  Starting CinePortal Frontend on http://localhost:5173
echo ========================================================
node ./node_modules/vite/bin/vite.js
pause
