import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import { Command } from '@tauri-apps/plugin-shell';
import { resolveResource } from '@tauri-apps/api/path';
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
  const { user } = useAuth();

  const requestAdminPermission = async () => {
    if (hasAdminConsent) return true;

    const confirmElevation = window.confirm(
      'Precisamos de permissão de administrador para aplicar otimizações. Clique em OK e aceite o prompt do Windows.'
    );

    if (!confirmElevation) {
      return false;
    }

    setHasAdminConsent(true);
    return true;
  };

  useEffect(() => {
    void requestAdminPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runBatchCommand = async (
    resourceName: string,
    onSuccess: string,
    onError: string,
    setLoading: (value: boolean) => void
  ) => {
    const hasPermission = await requestAdminPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const batchPath = await resolveResource(resourceName);
      const elevatedArg = `/C "call \\"${batchPath}\\""`;
      const output = await Command.create('powershell-elevated', [
        '-Command',
        'Start-Process',
        'cmd.exe',
        '-Verb',
        'RunAs',
        '-ArgumentList',
        elevatedArg,
      ]).execute();

      if (output.code === 0) {
        alert(onSuccess);
      } else {
        alert(`${onError}: ${output.stderr || 'Código de saída diferente de zero.'}`);
      }
    } catch (error) {
      alert(`${onError}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFPSBoost = async () => {
    const hasPermission = await requestAdminPermission();
    if (!hasPermission) return;

    setIsApplyingFPS(true);
    try {
      const regPath = await resolveResource('fps-boost.reg');
      const elevatedArg = `/s \\"${regPath}\\"`;
      const output = await Command.create('powershell-elevated', [
        '-Command',
        'Start-Process',
        'regedit.exe',
        '-Verb',
        'RunAs',
        '-ArgumentList',
        elevatedArg,
      ]).execute();

      if (output.code === 0) {
        alert('✓ FPS Boost aplicado com sucesso!');
      } else {
        alert(`✗ Erro ao aplicar FPS Boost: ${output.stderr || 'Código de saída diferente de zero.'}`);
      }
    } catch (error) {
      alert(`✗ Erro: ${error}`);
    } finally {
      setIsApplyingFPS(false);
    }
  };

  const handleAutoGPU = async () => {
    await runBatchCommand(
      'auto-gpu-config.bat',
      '✓ GPU configurada com sucesso!',
      '✗ Erro ao configurar GPU',
      setIsExecuting
    );
  };

  const handleMaintenance = async () => {
    await runBatchCommand(
      'maintenance-cleanup.bat',
      '✓ Limpeza concluída com sucesso!',
      '✗ Erro ao executar limpeza',
      setIsRunningMaintenance
    );
  };

  const handleNetworkOptimization = async () => {
    await runBatchCommand(
      'network-optimizer.bat',
      '✓ Otimizações de rede aplicadas!',
      '✗ Erro ao otimizar rede',
      setIsOptimizingNetwork
    );
  };

  const handlePerformanceOptimization = async () => {
    await runBatchCommand(
      'performance-optimizer.bat',
      '✓ Ajustes de desempenho aplicados!',
      '✗ Erro ao aplicar ajustes',
      setIsOptimizingPerformance
    );
  };

  return (
    <div className="flex h-screen bg-gray-600/10 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
       
        <div className=" p-6 lg:p-8 space-y-6 relative z-10 max-w-7xl mx-auto">
          <div className="animate-fade-in-up flex flex-col gap-4">
            <DashboardHeader activeTab={activeTab} user={user} />
             <WarningBanner />
          </div>

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
