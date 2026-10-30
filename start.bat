@echo off
title TKD Judge Systems Web
echo ==============================================
echo  Iniciando TKD Judge Systems (tkdjudgesystems.com)...
echo ==============================================
where node >nul 2>nul
if %errorlevel% equ 0 (
  echo Abriendo http://localhost:3000 ...
  start http://localhost:3000
  node scripts/server.js
) else (
  echo Abriendo index.html en su navegador predeterminado...
  start index.html
)
