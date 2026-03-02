@echo off
cd /d "%~dp0"
git add .
git commit -m "deploy-auto-%date:/=-%-%time:~0,5%"
git push
echo.
echo ✅ Cambios subidos a GitHub correctamente.
pause
