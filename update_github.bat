@echo off
echo ===================================================================
echo   TU DONG CAP NHAT DU AN LEN GITHUB
echo ===================================================================
echo.

set /p commit_msg="Nhap loi nhan (commit message) [Nhan Enter de dung mac dinh]: "
if "%commit_msg%"=="" set commit_msg=Update du an

echo.
echo [*] Dang them tat ca file vao Git (git add .)...
git add .

echo [*] Dang luu cac thay doi (git commit)...
git commit -m "%commit_msg%"

echo [*] Dang day code len GitHub (git push)...
git push origin main

echo.
echo ===================================================================
echo   HOAN TAT QUA TRINH DAY CODE LEN GITHUB!
echo ===================================================================
pause
