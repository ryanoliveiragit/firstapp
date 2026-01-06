@echo off
title Otimizacao Synapse Optimizer - AVANÇADA
color 0A

:: ===============================
:: ATIVAR HAGS (GPU Scheduling)
:: ===============================
echo Ajustando a GPU...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 5 /f >nul

:: ==================================================
:: CPU / SCHEDULER / LATÊNCIA DO SISTEMA
:: ==================================================
echo SCHEDULER / LATÊNCIA DO SISTEMA...
bcdedit /set disabledynamictick yes >nul
bcdedit /set useplatformclock no >nul
bcdedit /set tscsyncpolicy Enhanced >nul
bcdedit /set nx AlwaysOff >nul 2>&1

:: ===============================
:: PROCESSOS DO WINDOWS
:: ===============================
echo Ajustando o Processos do windows...
reg add "HKLM\SYSTEM\ControlSet001\Control" /v SvcHostSplitThresholdInKB /t REG_DWORD /d 04000000 /f >nul

:: =====================================================
:: MULTIMIDIA / JOGOS (SCHEDULER)
:: =====================================================
echo Ajustando o Processador...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f >nul

reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Background Only" /t REG_SZ /d "False" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Clock Rate" /t REG_DWORD /d 0x2710 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Priority" /t REG_DWORD /d 6 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "SFIO Priority" /t REG_SZ /d "High" /f

:: ===============================
:: DESATIVAR GAME DVR / GAME BAR
:: ===============================
echo Desativando a GameDVR/GameBAR...
reg add "HKCU\System\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f >nul
reg add "HKCU\System\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f >nul
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f >nul
reg add "HKCU\Software\Microsoft\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 0 /f >nul
reg add "HKCU\Software\Microsoft\GameBar" /v ShowStartupPanel /t REG_DWORD /d 0 /f >nul
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f >nul
reg add "HKLM\SOFTWARE\Microsoft\PolicyManager\default\ApplicationManagement\AllowGameDVR" /v value /t REG_DWORD /d 0 /f >nul
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\DriverSearching" /v SearchOrderConfig /t REG_DWORD /d 0 /f >nul

:: =====================================================
:: MITIGACOES DE KERNEL (⚠️ MAIS FPS / MENOS SEGURANCA)
:: =====================================================
echo KERNEL...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Kernel" /v DisableExceptionChainValidation /t REG_DWORD /d 1 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Kernel" /v KernelSEHOPEnabled /t REG_DWORD /d 0 /f >nul

:: =====================================================
:: REDUCAO DE LATENCIA DO SISTEMA
:: =====================================================
echo REDUCAO LATENCIA SISTEMA...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager" /v HeapDeCommitFreeBlockThreshold /t REG_DWORD /d 0x40000 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager" /v HeapDeCommitTotalFreeThreshold /t REG_DWORD /d 0x100000 /f >nul

:: =====================================================
:: MEMORIA
:: =====================================================
echo Ajustando a Memoria...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v DisablePagingExecutive /t REG_DWORD /d 1 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v LargeSystemCache /t REG_DWORD /d 0 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v ClearPageFileAtShutdown /t REG_DWORD /d 0 /f >nul

:: =====================================================
:: NTFS
:: =====================================================
echo Ajustando o NTFS...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 1 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsMemoryUsage /t REG_DWORD /d 2 /f >nul

:: ===============================
:: PLANO DE ENERGIA
:: ===============================
echo Ativando plano de energia desempenho maximo...
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61
powercfg -change -monitor-timeout-ac 0
powercfg -change -disk-timeout-ac 0
powercfg -change -standby-timeout-ac 0
powercfg -change -hibernate-timeout-ac 0

:: ===============================
:: GPU PRIORIDADE
:: ===============================
echo Ajustando Para PRIORIDADE GPU...
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "C:\Windows\System32\explorer.exe" /t REG_SZ /d "GpuPreference=2;" /f
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "C:\Windows\System32\dwm.exe" /t REG_SZ /d "GpuPreference=2;" /f

:: ===============================
:: USB
:: ===============================
echo Ajustando USB input lag...
reg add "HKLM\SYSTEM\CurrentControlSet\Services\USB" /v DisableSelectiveSuspend /t REG_DWORD /d 1 /f >nul

:: ===============================
:: MOUSE
:: ===============================
echo Ajustando mouse para input puro...
reg add "HKCU\Control Panel\Mouse" /v MouseSpeed /t REG_SZ /d 0 /f >nul
reg add "HKCU\Control Panel\Mouse" /v MouseThreshold1 /t REG_SZ /d 0 /f >nul
reg add "HKCU\Control Panel\Mouse" /v MouseThreshold2 /t REG_SZ /d 0 /f >nul
Reg add "HKU\.DEFAULT\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg add "HKU\.DEFAULT\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg add "HKCU\Control Panel\Mouse" /v "ActiveWindowTracking" /t REG_DWORD /d "0" /f
Reg add "HKCU\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg add "HKCU\Control Panel\Mouse" /v "DoubleClickHeight" /t REG_SZ /d "4" /f
Reg add "HKCU\Control Panel\Mouse" /v "DoubleClickSpeed" /t REG_SZ /d "500" /f
Reg add "HKCU\Control Panel\Mouse" /v "DoubleClickWidth" /t REG_SZ /d "4" /f
Reg add "HKCU\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg add "HKCU\Control Panel\Mouse" /v "MouseHoverHeight" /t REG_SZ /d "4" /f
Reg add "HKCU\Control Panel\Mouse" /v "MouseHoverWidth" /t REG_SZ /d "4" /f
Reg add "HKCU\Control Panel\Mouse" /v "MouseSensitivity" /t REG_SZ /d "10" /f
Reg add "HKCU\Control Panel\Mouse" /v "MouseTrails" /t REG_SZ /d "0" /f
Reg add "HKCU\Control Panel\Mouse" /v "SmoothMouseXCurve" /t REG_BINARY /d "0000000000000000c0cc0c0000000000809919000000000040662600000000000033330000000000" /f
Reg add "HKCU\Control Panel\Mouse" /v "SmoothMouseYCurve" /t REG_BINARY /d "0000000000000000000038000000000000007000000000000000a800000000000000e00000000000" /f
Reg add "HKCU\Control Panel\Mouse" /v "SnapToDefaultButton" /t REG_SZ /d "0" /f
Reg add "HKCU\Control Panel\Mouse" /v "SwapMouseButtons" /t REG_SZ /d "0" /f
Reg add "HKCU\Control Panel\Mouse" /v "MouseHoverTime" /t REG_SZ /d "8" /f

:: ===============================
:: TECLADO
:: ===============================
echo Ajustando teclado...
reg add "HKCU\Control Panel\Keyboard" /v KeyboardDelay /t REG_SZ /d 0 /f >nul
reg add "HKCU\Control Panel\Keyboard" /v KeyboardSpeed /t REG_SZ /d 31 /f >nul
Reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Flags" /t REG_DWORD /d "0" /f 
Reg add "HKCU\Control Panel\Keyboard" /v "InitialKeyboardIndicators" /t REG_SZ /d "0" /f 
Reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "DelayBeforeAcceptance" /t REG_SZ /d "0" /f 
Reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last BounceKey Setting" /t REG_DWORD /d "0" /f 
Reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Delay" /t REG_DWORD /d "0" /f 
Reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Repeat" /t REG_DWORD /d "0" /f 
Reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Wait" /t REG_DWORD /d "0" /f 

:: ===============================
:: Monitor (LATÊNCIA)
:: ===============================
echo Tirando a LATÊNCIA Monitor...
Reg add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorLatencyTolerance" /t REG_DWORD /d "0" /f
Reg add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorRefreshLatencyTolerance" /t REG_DWORD /d "0" /f

:: ===============================
:: VISUAL FX
:: ===============================
echo Ajustando Visual FX de jogos...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f >nul
reg add "HKCU\Control Panel\Desktop\WindowMetrics" /v MinAnimate /t REG_SZ /d 0 /f
reg add "HKCU\Control Panel\Desktop" /v UserPreferencesMask /t REG_BINARY /d 9012038010000000 /f

:: ===============================
:: REDE (PING E INPUT ONLINE)
:: ===============================
echo Otimizando rede para jogos...
netsh int tcp set global autotuninglevel=disabled >nul
netsh int tcp set global ecncapability=disabled >nul
netsh int tcp set global timestamps=disabled >nul
netsh int tcp set global congestionprovider=ctcp >nul

:: ===============================
:: DESLIGAMENTO MAIS RAPIDO
:: ===============================
echo Ajustando tempo de resposta do sistema...
reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v WaitToKillServiceTimeout /t REG_SZ /d 2000 /f >nul
reg add "HKCU\Control Panel\Desktop" /v WaitToKillAppTimeout /t REG_SZ /d 2000 /f >nul
reg add "HKCU\Control Panel\Desktop" /v HungAppTimeout /t REG_SZ /d 1000 /f >nul

:: ===============================
:: WINDOWS - MENOS PESO
:: ===============================
echo Reduzindo carga...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v DisablePreviewDesktop /t REG_DWORD /d 1 /f >nul

reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 0 /f >nul
reg add "HKCU\Control Panel\Desktop" /v AutoEndTasks /t REG_SZ /d 1 /f >nul
reg add "HKCU\Control Panel\Desktop" /v LowLevelHooksTimeout /t REG_SZ /d 1000 /f >nul

:: ==================================
:: DESATIVAR DICAS E SUGESTOES
:: ==================================
echo Desativando dicas e sugestoes...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v SubscribedContent-338388Enabled /t REG_DWORD /d 0 /f >nul
echo OK
echo.

:: =====================================================
:: DESATIVAR FAST STARTUP / HIBERNAÇÃO
:: =====================================================
echo Desativando HIBERNAÇÃO...
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /v "HiberBootEnabled" /t REG_DWORD /d "0" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power" /v "HibernateEnabled" /t REG_DWORD /d "0" /f

:: ===============================
:: DWM (MENOS LATÊNCIA)
:: ===============================
echo Ajustando DWM para jogos...
reg add "HKCU\Software\Microsoft\Windows\DWM" /v OverlayTestMode /t REG_DWORD /d 5 /f >nul
reg add "HKCU\Software\Microsoft\Windows\DWM" /v EnableAeroPeek /t REG_DWORD /d 0 /f >nul
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\DWM" /v EnableUserDWM /t REG_DWORD /d 0 /f

:: =========================================
:: GPEDIT -> Bloquear Apps em Segundo Plano
:: =========================================
echo Bloquear Apps em Segundo Plano...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v LetAppsRunInBackground /t REG_DWORD /d 2 /f >nul

:: =========================================
:: GPEDIT -> Sistema > Gerenciamento de energia
:: Desativar Limitação de Energia = HABILITADO
:: =========================================
echo Gerenciamento de energia...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v EnergyEstimationDisabled /t REG_DWORD /d 1 /f >nul

:: ==================================================
:: GPEDIT -> QoS – LARGURA DE BANDA 0%
:: ==================================================
echo QoS LARGURA DE BANDA...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f >nul

:: ===============================
:: PRIORIDADE DE PROCESSO
:: ===============================
echo Ajustando prioridade de jogos...
wmic process where name="FiveM.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="GTA5.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="cs2.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="VALORANT.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="FortniteClient-Win64-Shipping.exe" CALL setpriority 32768 >nul 2>&1
wmic process where name="cod.exe" CALL setpriority 256 >nul 2>&1
wmic process where name="codlauncher.exe" CALL setpriority 256 >nul 2>&1

wmic process where name="FiveM.exe" CALL setaffinity 555 >nul 2>&1
wmic process where name="GTA5.exe" CALL setaffinity 555 >nul 2>&1
wmic process where name="cs2.exe" CALL setaffinity 555 >nul 2>&1
wmic process where name="VALORANT.exe" CALL setaffinity 555 >nul 2>&1
wmic process where name="FortniteClient-Win64-Shipping.exe" CALL setaffinity 555 >nul 2>&1
wmic process where name="codlauncher.exe" CALL setaffinity 555 >nul 2>&1

:: ===============================
:: FINAL
:: ===============================
echo.
echo =====================================
echo OTIMIZACAO CONCLUIDA COM SUCESSO!
echo REINICIE O PC PARA APLICAR TUDO
echo =====================================
pause
exit