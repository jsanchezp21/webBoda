@echo off
cd /d "%~dp0wedding-frontend"
echo Iniciando el frontend...
call npm install
call ng serve --open
pause
