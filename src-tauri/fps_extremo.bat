@echo off
title AUTO GPU CONFIG - AMD / NVIDIA
color 0A

echo =========================================
echo   AUTO CONFIG GPU - FPS / LOW LATENCY
echo =========================================
timeout /t 2 >nul

:: ================================
:: DETECCAO DA GPU
:: ================================
wmic path win32_VideoController get name | findstr /I "NVIDIA" >nul
if %errorlevel%==0 goto NVIDIA

wmic path win32_VideoController get name | findstr /I "AMD Radeon" >nul
if %errorlevel%==0 goto AMD

echo.
echo ❌ GPU nao reconhecida automaticamente
pause
exit

:: ================================
:: CONFIGURACAO NVIDIA
:: ================================
:NVIDIA
echo.
echo 🔵 GPU NVIDIA DETECTADA
echo Aplicando perfil NVIDIA (FPS MAXIMO)...

:: Prioridade Jogos
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Priority" /t REG_DWORD /d 6 /f

:: NVIDIA - Max Performance
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v PowerMizerEnable /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v PowerMizerLevel /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v PowerMizerLevelAC /t REG_DWORD /d 1 /f

:: Low Latency Mode ON
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm\FTS" /v EnableLowLatencyMode /t REG_DWORD /d 1 /f

:: Shader Cache ON
reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak" /v ShaderCache /t REG_DWORD /d 1 /f

:: Threaded Optimization ON
reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak" /v ThreadedOptimization /t REG_DWORD /d 1 /f

goto SYSTEM

:: ================================
:: CONFIGURACAO AMD
:: ================================
:AMD
echo.
echo 🔴 GPU AMD DETECTADA
echo Aplicando perfil AMD Adrenalin (FPS MAXIMO)...

:: Desativa ULPS
reg add "HKLM\SYSTEM\CurrentControlSet\Services\amdkmdag" /v EnableUlps /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\amdkmdag" /v EnableUlps_NA /t REG_DWORD /d 0 /f

:: Radeon Anti-Lag ON
reg add "HKCU\Software\AMD\DVR" /v AntiLagEnabled /t REG_DWORD /d 1 /f

:: Chill OFF
reg add "HKCU\Software\AMD\DVR" /v ChillEnabled /t REG_DWORD /d 0 /f

:: VSync OFF
reg add "HKCU\Software\AMD\DVR" /v VSyncControl /t REG_DWORD /d 0 /f

:: Shader Cache ON
reg add "HKLM\SYSTEM\CurrentControlSet\Services\amdkmdag" /v ShaderCache /t REG_DWORD /d 1 /f

goto SYSTEM

:: ================================
:: CONFIGURACOES GERAIS
:: ================================
:SYSTEM
echo.
echo ⚙️ Aplicando configuracoes globais...

:: Game Mode ON
reg add "HKCU\Software\Microsoft\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f

:: Hardware Accelerated GPU Scheduling
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f

:: Desativa Power Throttling
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f

:: Timer Resolution
bcdedit /set useplatformtick yes >nul

echo.
echo =========================================
echo   ✔ OTIMIZACAO CONCLUIDA COM SUCESSO
echo   ✔ REINICIE O PC
echo =========================================
pause
exit
