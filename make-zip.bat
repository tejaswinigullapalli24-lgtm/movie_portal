@echo off
title Creating Lightweight Project ZIP
cd /d "%~dp0"
echo ========================================================
echo  Creating CinePortal-Project.zip...
echo ========================================================

powershell -Command "$ProgressPreference = 'SilentlyContinue'; $items = Get-ChildItem -Path . -Exclude 'node_modules', '.git', '*.zip' | Select-Object -ExpandProperty FullName; Compress-Archive -Path $items -DestinationPath '.\CinePortal-Project.zip' -Force"

echo.
echo ========================================================
echo  DONE! CinePortal-Project.zip is ready right here in this folder!
echo ========================================================
pause
