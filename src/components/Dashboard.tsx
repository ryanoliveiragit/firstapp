import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import { Command } from '@tauri-apps/plugin-shell';
import { resolveResource } from '@tauri-apps/api/path';
import { toast } from 'sonner';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { WarningBanner } from './dashboard/WarningBanner';
import { FPSBoostCard } from './dashboard/FPSBoostCard';
import { AutoGPUCard } from './dashboard/AutoGPUCard';
import { SettingsPanel } from './dashboard/SettingsPanel';
import { ProfilePanel } from './dashboard/ProfilePanel';
import { StatusPanel } from './dashboard/StatusPanel';
import { MaintenanceCard } from './dashboard/MaintenanceCard';
import { NetworkOptimizerCard } from './dashboard/NetworkOptimizerCard';
import { PerformanceOptimizerCard } from './dashboard/PerformanceOptimizerCard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('regedits');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isApplyingFPS, setIsApplyingFPS] = useState(false);
  const [isRunningMaintenance, setIsRunningMaintenance] = useState(false);
  const [isOptimizingNetwork, setIsOptimizingNetwork] = useState(false);
  const [isOptimizingPerformance, setIsOptimizingPerformance] = useState(false);
  const [hasAdminConsent, setHasAdminConsent] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const adminConsentResolver = useRef<((value: boolean) => void) | null>(null);
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const { user } = useAuth();

  const logCommandResult = (
    label: string,
    output: { code: number | null; stdout?: string; stderr?: string }
  ) => {
    console.info(`[Synapse] ${label} -> exit code: ${output.code ?? 'null'}`);
    if (output.stdout) {
      console.info(`[Synapse] ${label} stdout: ${output.stdout}`);
    }
    if (output.stderr) {
      console.info(`[Synapse] ${label} stderr: ${output.stderr}`);
    }
  };

  const buildStartProcessCommand = (filePath: string, args?: string) => {
    const sanitizedPath = filePath.replace(/'/g, "''");
    const sanitizedArgs = args ? args.replace(/'/g, "''") : undefined;
    return `Start-Process -FilePath '${sanitizedPath}' -Verb RunAs${sanitizedArgs ? ` -ArgumentList '${sanitizedArgs}'` : ''} -WindowStyle Hidden`;
  };

  const requestAdminPermission = async () => {
    if (hasAdminConsent) return true;

    return new Promise<boolean>(resolve => {
      adminConsentResolver.current = resolve;
      setShowAdminModal(true);
    });
  };

  useEffect(() => {
    void requestAdminPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addOutput = (message: string) => {
    setCommandOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearOutput = () => {
    setCommandOutput([]);
  };

  const finalizeConsole = () => {
    setShowConsole(false);
    clearOutput();
  };

  const ensureShellPermissions = async () => true;

  const runBatchCommandWithOutput = async (
    resourceName: string,
    onSuccess: string,
    onError: string,
    setLoading: (value: boolean) => void
  ) => {
    const hasShellPermission = await ensureShellPermissions();
    if (!hasShellPermission) return;

    const hasPermission = await requestAdminPermission();
    if (!hasPermission) return;

    setLoading(true);
    setShowConsole(true);
    clearOutput();
    addOutput(`Iniciando ${resourceName}...`);

    try {
      const batchPath = await resolveResource(resourceName);
      const command = buildStartProcessCommand(batchPath, `/C "call \\"${batchPath}\\""`);
      
      const cmd = Command.create('powershell-elevated', [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        command,
      ]);

      // Escuta stdout em tempo real
      cmd.stdout.on('data', (line: string) => {
        addOutput(`[OUT] ${line}`);
      });

      // Escuta stderr em tempo real
      cmd.stderr.on('data', (line: string) => {
        addOutput(`[ERR] ${line}`);
      });

      // Escuta quando o processo termina
      cmd.on('close', (data: { code: number | null; signal: number | null }) => {
        logCommandResult(resourceName, { code: data.code });
        
        if (data.code === 0) {
          const successMessage = `✓ ${onSuccess}`;
          addOutput(successMessage);
          toast.success(successMessage);
        } else {
          const failMessage = `✗ ${onError} - Código: ${data.code}`;
          addOutput(failMessage);
          toast.error(`${onError}: Código de saída ${data.code}`);
        }
        setLoading(false);
        finalizeConsole();
      });

      // Escuta erros
      cmd.on('error', (error: string) => {
        addOutput(`[ERRO] ${error}`);
        toast.error(`${onError}: ${error}`);
        setLoading(false);
        finalizeConsole();
      });

      await cmd.spawn();
    } catch (error) {
      console.error(`[Synapse] ${resourceName} error:`, error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      addOutput(`[EXCEÇÃO] ${errorMsg}`);
      toast.error(`${onError}: ${errorMsg}`);
      setLoading(false);
      finalizeConsole();
    }
  };

  const handleFPSBoost = async () => {
    const hasShellPermission = await ensureShellPermissions();
    if (!hasShellPermission) return;

    const hasPermission = await requestAdminPermission();
    if (!hasPermission) return;

    setIsApplyingFPS(true);
    setShowConsole(true);
    clearOutput();
    addOutput('Aplicando FPS Boost...');

    try {
      const regPath = await resolveResource('fps-boost.reg');
      const command = buildStartProcessCommand('regedit.exe', `/s \\"${regPath}\\"`);
      
      const cmd = Command.create('powershell-elevated', [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        command,
      ]);

      cmd.stdout.on('data', (line: string) => {
        addOutput(`[OUT] ${line}`);
      });

      cmd.stderr.on('data', (line: string) => {
        addOutput(`[ERR] ${line}`);
      });

      cmd.on('close', (data: { code: number | null; signal: number | null }) => {
        logCommandResult('fps-boost.reg', { code: data.code });

        if (data.code === 0) {
          const successMessage = '✓ FPS Boost aplicado com sucesso!';
          addOutput(successMessage);
          toast.success(successMessage);
        } else {
          const failMessage = `✗ Erro ao aplicar FPS Boost - Código: ${data.code}`;
          addOutput(failMessage);
          toast.error(`✗ Erro ao aplicar FPS Boost: Código ${data.code}`);
        }
        setIsApplyingFPS(false);
        finalizeConsole();
      });

      cmd.on('error', (error: string) => {
        addOutput(`[ERRO] ${error}`);
        toast.error(`✗ Erro: ${error}`);
        setIsApplyingFPS(false);
        finalizeConsole();
      });

      await cmd.spawn();
    } catch (error) {
      console.error('[Synapse] fps-boost.reg error:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      addOutput(`[EXCEÇÃO] ${errorMsg}`);
      toast.error(`✗ Erro: ${errorMsg}`);
      setIsApplyingFPS(false);
      finalizeConsole();
    }
  };

  const handleAutoGPU = async () => {
    await runBatchCommandWithOutput(
      'auto-gpu-config.bat',
      '✓ GPU configurada com sucesso!',
      '✗ Erro ao configurar GPU',
      setIsExecuting
    );
  };

  const handleMaintenance = async () => {
    await runBatchCommandWithOutput(
      'maintenance-cleanup.bat',
      '✓ Limpeza concluída com sucesso!',
      '✗ Erro ao executar limpeza',
      setIsRunningMaintenance
    );
  };

  const handleNetworkOptimization = async () => {
    await runBatchCommandWithOutput(
      'network-optimizer.bat',
      '✓ Otimizações de rede aplicadas!',
      '✗ Erro ao otimizar rede',
      setIsOptimizingNetwork
    );
  };

  const handlePerformanceOptimization = async () => {
    await runBatchCommandWithOutput(
      'performance-optimizer.bat',
      '✓ Ajustes de desempenho aplicados!',
      '✗ Erro ao aplicar ajustes',
      setIsOptimizingPerformance
    );
  };

  return (
    <div className="flex h-screen bg-gray-600/10 overflow-hidden">
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4 text-white">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                <span className="text-xl">!</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Permissão de Administrador</h3>
                <p className="text-sm text-gray-300">
                  Precisamos da sua autorização para executar otimizações com privilégios elevados.
                  Ao continuar, aceite o prompt do Windows que será exibido.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
                onClick={() => {
                  setShowAdminModal(false);
                  adminConsentResolver.current?.(false);
                  adminConsentResolver.current = null;
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
                onClick={() => {
                  setHasAdminConsent(true);
                  setShowAdminModal(false);
                  adminConsentResolver.current?.(true);
                  adminConsentResolver.current = null;
                }}
              >
                Continuar e aceitar
              </button>
            </div>
          </div>
        </div>
      )}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 space-y-6 relative z-10 max-w-7xl mx-auto">
          <div className="animate-fade-in-up flex flex-col gap-4">
            <DashboardHeader activeTab={activeTab} user={user} />
            <WarningBanner />
          </div>

          {showConsole && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur">
              <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-2xl max-w-3xl w-full mx-4 p-4 animate-fade-in-up">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-green-400 font-mono">Console Output</h3>
                  <button
                    onClick={finalizeConsole}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Fechar
                  </button>
                </div>
                <div className="bg-black rounded-md p-3 max-h-72 min-h-[200px] overflow-y-auto font-mono text-xs space-y-1">
                  {commandOutput.length === 0 && (
                    <div className="text-gray-400">Aguardando logs...</div>
                  )}
                  {commandOutput.map((line, idx) => (
                    <div
                      key={idx}
                      className={`${
                        line.includes('[ERR]') || line.includes('[ERRO]')
                          ? 'text-red-400'
                          : line.includes('✓')
                          ? 'text-green-400'
                          : line.includes('✗')
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regedits' && (
            <div className="max-w-lg space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <FPSBoostCard isApplying={isApplyingFPS} onApply={handleFPSBoost} />
            </div>
          )}

          {activeTab === 'exec' && (
            <div
              className="grid gap-4 animate-fade-in-up md:grid-cols-2 xl:grid-cols-2 auto-rows-fr"
              style={{ animationDelay: '100ms' }}
            >
              <AutoGPUCard isExecuting={isExecuting} onExecute={handleAutoGPU} />
              <PerformanceOptimizerCard isExecuting={isOptimizingPerformance} onExecute={handlePerformanceOptimization} />
              <NetworkOptimizerCard isExecuting={isOptimizingNetwork} onExecute={handleNetworkOptimization} />
              <MaintenanceCard isExecuting={isRunningMaintenance} onExecute={handleMaintenance} />
            </div>
          )}

          {activeTab === 'status' && (
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <StatusPanel />
            </div>
          )}

          {activeTab === 'config' && (
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <SettingsPanel />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <ProfilePanel user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
