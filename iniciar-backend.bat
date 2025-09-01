@echo off
cd /d "%~dp0backend"
echo Iniciando el backend...
call npm install
call npx nodemon server.js
pause
