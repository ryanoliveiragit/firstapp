import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Database } from 'lucide-react';
import { toast } from 'sonner';
import { adminService, type LicenseKey } from '@/services/adminService';
import KeyListTable from './KeyListTable';
import CreateKeyModal from './CreateKeyModal';
import EditKeyModal from './EditKeyModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function AdminPanel() {
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<LicenseKey | null>(null);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  // Load all keys on mount
  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllKeys();
      setKeys(data);
    } catch (error) {
      toast.error('Erro ao carregar chaves');
      console.error('Error loading keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (data: any) => {
    try {
      const newKey = await adminService.createKey(data);
      setKeys([newKey, ...keys]);
      setIsCreateModalOpen(false);
      toast.success('Chave criada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar chave');
      throw error;
    }
  };

  const handleEditKey = async (id: string, data: any) => {
    try {
      const updatedKey = await adminService.updateKey(id, data);
      setKeys(keys.map(k => k.id === id ? updatedKey : k));
      setEditingKey(null);
      toast.success('Chave atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar chave');
      throw error;
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await adminService.deleteKey(id);
      setKeys(keys.filter(k => k.id !== id));
      setDeletingKeyId(null);
      toast.success('Chave excluída com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir chave');
    }
  };

  const handleResetKey = async (id: string) => {
    try {
      const resetKey = await adminService.resetKeyUsage(id);
      setKeys(keys.map(k => k.id === id ? resetKey : k));
      toast.success('Uso da chave resetado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao resetar chave');
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <div className="glass-panel border-b border-white/10 p-6 animate-slide-in-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Gerenciar Chaves</h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Carregando...' : `${keys.length} chave${keys.length !== 1 ? 's' : ''} no sistema`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadKeys}
              disabled={isLoading}
              className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2} />
              Atualizar
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Nova Chave
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="glass-panel rounded-xl p-12 text-center animate-scale-in">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando chaves...</p>
            </div>
          ) : keys.length === 0 ? (
            <div className="glass-panel rounded-xl p-12 text-center animate-scale-in">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma chave encontrada</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Comece criando sua primeira chave de licença
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="glass-card px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 mx-auto"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Criar Primeira Chave
              </button>
            </div>
          ) : (
            <KeyListTable
              keys={keys}
              onEdit={setEditingKey}
              onDelete={setDeletingKeyId}
              onReset={handleResetKey}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateKey}
      />

      <EditKeyModal
        isOpen={!!editingKey}
        onClose={() => setEditingKey(null)}
        onSubmit={handleEditKey}
        keyData={editingKey}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingKeyId}
        onClose={() => setDeletingKeyId(null)}
        onConfirm={() => deletingKeyId && handleDeleteKey(deletingKeyId)}
        keyId={deletingKeyId}
      />
    </div>
  );
}
