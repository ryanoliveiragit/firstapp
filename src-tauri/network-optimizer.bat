@echo off
setlocal

echo [Synapse] Aplicando otimizações de rede...
netsh int tcp set global autotuninglevel=normal >nul
netsh int tcp set global rss=enabled >nul
netsh int tcp set global ecncapability=disabled >nul
netsh int tcp set global timestamps=disabled >nul

ipconfig /flushdns >nul

rem Atualizar cache ARP sem derrubar conexão
arp -d * >nul 2>nul

echo [Synapse] Otimizações de rede finalizadas.
endlocal
exit /b 0
