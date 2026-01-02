@echo off
setlocal

echo [Synapse] Limpando pastas temporárias...
if exist "%TEMP%" (
  for /d %%x in ("%TEMP%\*") do rd /s /q "%%x"
  del /f /s /q "%TEMP%\*" >nul 2>nul
)

if exist "C:\\Windows\\Temp" (
  for /d %%x in ("C:\\Windows\\Temp\\*") do rd /s /q "%%x"
  del /f /s /q "C:\\Windows\\Temp\\*" >nul 2>nul
)

echo [Synapse] Limpando prefetch e cache DNS...
if exist "C:\\Windows\\Prefetch" del /f /q "C:\\Windows\\Prefetch\\*" >nul 2>nul
ipconfig /flushdns >nul

echo [Synapse] Esvaziando lixeira...
powershell -Command "Clear-RecycleBin -Force" 2>nul

echo [Synapse] Manutenção concluída.
endlocal
exit /b 0
