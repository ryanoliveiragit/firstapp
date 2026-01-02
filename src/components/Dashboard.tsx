import { useState } from 'react';
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('regedits');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isApplyingFPS, setIsApplyingFPS] = useState(false);
  const { user } = useAuth();

  const handleFPSBoost = async () => {
    setIsApplyingFPS(true);
    try {
      const regPath = await resolveResource('fps-boost.reg');
      const output = await Command.create('regedit-start', [
        '/C',
        'start',
        '',
        'regedit.exe',
        '/s',
        regPath,
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
    setIsExecuting(true);
    try {
      const batchPath = await resolveResource('auto-gpu-config.bat');
      const output = await Command.create('cmd', [
        '/C',
        'start',
        '',
        'cmd.exe',
        '/C',
        'call',
        batchPath,
      ]).execute();

      if (output.code === 0) {
        alert('✓ GPU configurada com sucesso!');
      } else {
        alert(`✗ Erro ao configurar GPU: ${output.stderr || 'Código de saída diferente de zero.'}`);
      }
    } catch (error) {
      alert(`✗ Erro: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 space-y-6 relative z-10 max-w-7xl mx-auto">
          <DashboardHeader activeTab={activeTab} user={user} />

          {activeTab === 'regedits' && (
            <div className="space-y-4">
              <WarningBanner />
              <FPSBoostCard isApplying={isApplyingFPS} onApply={handleFPSBoost} />
            </div>
          )}

          {activeTab === 'exec' && (
            <div className="max-w-2xl">
              <AutoGPUCard isExecuting={isExecuting} onExecute={handleAutoGPU} />
            </div>
          )}

          {activeTab === 'config' && (
            <SettingsPanel />
          )}

          {activeTab === 'profile' && (
            <ProfilePanel user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
