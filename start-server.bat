@echo off
title CinePortal Backend Server (Port 3000)
set "PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo  Starting CinePortal REST API on http://localhost:3000
echo ========================================================
node server.js
pause
