@echo off
title Installing Project Dependencies
set "PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo  Installing Frontend Dependencies with pnpm...
echo ========================================================
pnpm install
echo.
echo ========================================================
echo  Installation completed! You can now run start-frontend.bat
echo ========================================================
pause
