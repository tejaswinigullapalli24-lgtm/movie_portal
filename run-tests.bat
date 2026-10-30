@echo off
title CinePortal Test Verification Suite
set "PATH=C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\jithe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;%PATH%"
cd /d "%~dp0"
node test-suite.mjs
pause
