@echo off
setlocal
cd /d "%~dp0\web"
echo [pokemon_type] local server starting...
npx --yes serve .
endlocal
