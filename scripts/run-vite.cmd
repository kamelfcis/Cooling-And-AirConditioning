@echo off
setlocal
cd /d "%~dp0\.."
node "%~dp0run-vite.js" %*

