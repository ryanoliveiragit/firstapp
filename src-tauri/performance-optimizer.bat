@echo off
setlocal

echo [Synapse] Ajustando plano de energia para alto desempenho...
powercfg -setactive SCHEME_MAX
powercfg /hibernate off
powercfg /change monitor-timeout-ac 0
powercfg /change standby-timeout-ac 0

rem Habilitar recursos de desempenho do Windows
reg add "HKCU\Software\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f >nul
reg add "HKCU\Software\Microsoft\DirectX" /v "UseHardwareGPUScheduling" /t REG_DWORD /d 1 /f >nul

rem Ajustar otimizações gráficas
reg add "HKCU\Software\Microsoft\Avalon.Graphics" /v "DisableHWAcceleration" /t REG_DWORD /d 0 /f >nul

echo [Synapse] Otimização de desempenho aplicada.
endlocal
exit /b 0
