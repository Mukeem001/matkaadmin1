@echo off
REM Hostinger Deployment Script for Windows
REM ye script workspace dependencies ko resolve karega aur API server ko deploy karega

setlocal enabledelayedexpansion
set "errors=0"

echo.🚀 Starting Hostinger Deployment...

cd "lib\api-zod"
call npm install
if errorlevel 1 set "errors=1"
call npm run build
if errorlevel 1 set "errors=1"
cd "..\..

cd "lib\db"
call npm install
if errorlevel 1 set "errors=1"
call npm run build
if errorlevel 1 set "errors=1"
cd "..\..

echo.🔨 Building API Server...
cd "artifacts\api-server"
call npm install
if errorlevel 1 set "errors=1"
call npm run build
if errorlevel 1 set "errors=1"
cd "..\..

if %errors% equ 0 (
    echo.✅ Deployment ready! API server is in artifacts/api-server/dist
) else (
    echo.❌ Deployment failed!
    exit /b 1
)
