@echo off
setlocal
title Eyewear Store Management System - Quick Run

:MENU
cls
echo ======================================================
echo    EYEWEAR STORE MANAGEMENT SYSTEM - QUICK RUN
echo ======================================================
echo.
echo  [1] Run EVERYTHING (Backend API + Frontend App)
echo  [2] Run Backend API only
echo  [3] Run Frontend App only
echo  [4] Exit
echo.
echo ======================================================
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto RUN_ALL
if "%choice%"=="2" goto RUN_API
if "%choice%"=="3" goto RUN_FRONTEND
if "%choice%"=="4" goto EXIT
goto MENU

:RUN_ALL
echo.
echo Starting all applications in separate windows...

:: Backend API
start "Backend API (.NET) - Port 5273" cmd /c "cd API_CuahangKinhmat\API_Kinhmat && dotnet run"

:: Frontend WebApp
start "Frontend WebApp (Next.js) - Port 5274" cmd /c "cd Kinhmat && npm run dev"

echo.
echo Both projects are starting! Please check the new windows for logs.
timeout /t 5
goto EXIT

:RUN_API
echo.
echo Starting Backend API...
start "Backend API (.NET) - Port 5273" cmd /c "cd API_CuahangKinhmat\API_Kinhmat && dotnet run"
timeout /t 3
goto MENU

:RUN_FRONTEND
echo.
echo Starting Frontend WebApp...
start "Frontend WebApp (Next.js) - Port 5274" cmd /c "cd Kinhmat && npm run dev"
timeout /t 3
goto MENU

:EXIT
echo Goodbye!
exit
