@echo off
title CinePortal - Share on Wi-Fi
set "PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;%PATH%"
cd /d "%~dp0"

echo ========================================================
echo  Starting CinePortal with Wi-Fi / Mobile Network access
echo ========================================================

:: Start backend
start "CinePortal Backend" cmd /c "set PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%%PATH%% & cd /d %~dp0 & node server.js"

:: Start frontend with --host
node ./node_modules/vite/bin/vite.js --host
pause
