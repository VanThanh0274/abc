@echo off
echo ===================================================================
echo   TIEN TRINH CAI DAT MOI TRUONG VA THU VIEN CHO DU AN KINH MAT
echo ===================================================================
echo.

:: 1. Kiem tra va cai dat Node.js
echo [*] Kiem tra Node.js (Cho Frontend)...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Khong tim thay Node.js. Dang tien hanh tai va cai dat thong qua winget...
    winget install OpenJS.NodeJS -e --silent --accept-package-agreements --accept-source-agreements
    echo [OK] Cai dat Node.js thanh cong. Vui long khoi dong lai may tinh hoac terminal neu lenh npm khong nhan.
) else (
    echo [OK] Node.js da duoc cai dat san.
)
echo.

:: 2. Kiem tra va cai dat .NET 6 SDK
echo [*] Kiem tra .NET SDK (Cho Backend)...
where dotnet >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Khong tim thay .NET SDK. Dang tien hanh tai va cai dat .NET 6 SDK...
    winget install Microsoft.DotNet.SDK.6 -e --silent --accept-package-agreements --accept-source-agreements
    echo [OK] Cai dat .NET SDK thanh cong.
) else (
    echo [OK] .NET SDK da duoc cai dat san.
)
echo.

:: 3. Cai dat thu vien Frontend
echo ===================================================================
echo [*] DANG CAI DAT THU VIEN CHO FRONTEND (Next.js)...
echo ===================================================================
cd Kinhmat
call npm install
cd ..
echo [OK] Hoan tat cai dat thu vien Frontend.
echo.

:: 4. Cai dat thu vien Backend
echo ===================================================================
echo [*] DANG KHOI PHUC THU VIEN CHO BACKEND (.NET 6)...
echo ===================================================================
cd API_CuahangKinhmat
call dotnet restore
call dotnet build
cd ..
echo [OK] Hoan tat khoi phuc thu vien Backend.
echo.

echo ===================================================================
echo   CAI DAT HOAN TAT TREN MAY MOI! 
echo   De chay du an, ban vui long chay file "quick_run.bat"
echo ===================================================================
pause
