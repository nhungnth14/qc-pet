@echo off
REM ============================================================
REM  Mo cong 8081 cho dien thoai truy cap web preview QC Pet.
REM  CHAY 1 LAN: chuot phai file nay > "Run as administrator".
REM ============================================================
netsh advfirewall firewall delete rule name="QC Pet Expo Web 8081" >nul 2>&1
netsh advfirewall firewall add rule name="QC Pet Expo Web 8081" dir=in action=allow protocol=TCP localport=8081
echo.
echo === Da mo cong 8081. Dien thoai cung WiFi gio co the vao duoc. ===
pause
