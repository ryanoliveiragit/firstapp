import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { LicenseKey } from '@/services/adminService';

interface EditKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: any) => Promise<void>;
  keyData: LicenseKey | null;
}

export default function EditKeyModal({ isOpen, onClose, onSubmit, keyData }: EditKeyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    isValid: true,
    userId: '',
    maxUses: 1,
    usedCount: 0,
    usedBy: '',
    expiresAt: '',
  });

  // Update form when keyData changes
  useEffect(() => {
    if (keyData) {
      setFormData({
        key: keyData.key,
        isValid: keyData.isValid,
        userId: keyData.userId || '',
        maxUses: keyData.maxUses,
        usedCount: keyData.usedCount,
        usedBy: keyData.usedBy || '',
        expiresAt: keyData.expiresAt
          ? new Date(keyData.expiresAt).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [keyData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyData) return;

    setIsLoading(true);

    try {
      // Prepare data - only send fields that can be updated
      const data: any = {
        key: formData.key.trim(),
        isValid: formData.isValid,
        maxUses: formData.maxUses,
        usedCount: formData.usedCount,
      };

      if (formData.userId.trim()) {
        data.userId = formData.userId.trim();
      }

      if (formData.usedBy.trim()) {
        data.usedBy = formData.usedBy.trim();
      }

      if (formData.expiresAt) {
        data.expiresAt = new Date(formData.expiresAt).toISOString();
      }

      await onSubmit(keyData.id, data);
    } catch (error) {
      console.error('Error updating key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !keyData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-panel rounded-xl w-full max-w-lg p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center">
              <Save className="w-5 h-5 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Editar Chave de Licença</h2>
              <p className="text-sm text-muted-foreground">
                Atualize os dados da chave
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Key ID (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              ID da Chave
            </Label>
            <Input
              type="text"
              value={keyData.id}
              disabled
              className="glass-card opacity-60 cursor-not-allowed"
            />
          </div>

          {/* Key */}
          <div className="space-y-2">
            <Label htmlFor="edit-key" className="text-sm font-medium">
              Chave *
            </Label>
            <Input
              id="edit-key"
              type="text"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              className="glass-card font-mono"
              required
            />
          </div>

          {/* User ID */}
          <div className="space-y-2">
            <Label htmlFor="edit-userId" className="text-sm font-medium">
              User ID
            </Label>
            <Input
              id="edit-userId"
              type="text"
              placeholder="ID do usuário"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="glass-card"
            />
          </div>

          {/* Used By */}
          <div className="space-y-2">
            <Label htmlFor="edit-usedBy" className="text-sm font-medium">
              Usado Por
            </Label>
            <Input
              id="edit-usedBy"
              type="text"
              placeholder="ID do usuário que usou a chave"
              value={formData.usedBy}
              onChange={(e) => setFormData({ ...formData, usedBy: e.target.value })}
              className="glass-card"
            />
          </div>

          {/* Max Uses and Used Count */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-maxUses" className="text-sm font-medium">
                Máximo de Usos *
              </Label>
              <Input
                id="edit-maxUses"
                type="number"
                min="1"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 1 })}
                className="glass-card"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-usedCount" className="text-sm font-medium">
                Usos Atuais *
              </Label>
              <Input
                id="edit-usedCount"
                type="number"
                min="0"
                value={formData.usedCount}
                onChange={(e) => setFormData({ ...formData, usedCount: parseInt(e.target.value) || 0 })}
                className="glass-card"
                required
              />
            </div>
          </div>

          {/* Expires At */}
          <div className="space-y-2">
            <Label htmlFor="edit-expiresAt" className="text-sm font-medium">
              Data de Expiração
            </Label>
            <Input
              id="edit-expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="glass-card"
            />
          </div>

          {/* Is Valid Switch */}
          <div className="flex items-center justify-between p-3 glass-card rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="edit-isValid" className="text-sm font-medium">
                Chave Válida
              </Label>
              <p className="text-xs text-muted-foreground">
                Ativar ou desativar a chave
              </p>
            </div>
            <Switch
              id="edit-isValid"
              checked={formData.isValid}
              onCheckedChange={(checked) => setFormData({ ...formData, isValid: checked })}
            />
          </div>

          {/* Metadata (Read-only) */}
          <div className="glass-card rounded-lg p-3 space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Metadados</Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Criada em:</span>
                <p className="font-mono">{new Date(keyData.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Atualizada em:</span>
                <p className="font-mono">{new Date(keyData.updatedAt).toLocaleString('pt-BR')}</p>
              </div>
              {keyData.lastUsedAt && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Último uso:</span>
                  <p className="font-mono">{new Date(keyData.lastUsedAt).toLocaleString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg glass-card hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
