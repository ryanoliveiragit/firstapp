import { useState, useEffect } from 'react';
import { X, Save, Loader2, Key, User, Clock, BarChart3, Info, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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

  const usagePercentage = Math.min((formData.usedCount / formData.maxUses) * 100, 100);
  const isExpired = keyData.expiresAt && new Date(keyData.expiresAt) < new Date();
  const isLimitReached = formData.usedCount >= formData.maxUses;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-panel rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center">
                <Save className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Editar Chave de Licença</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  ID: <code className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded">{keyData.id}</code>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              {formData.isValid ? (
                <Badge className="glow-pill bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Ativa
                </Badge>
              ) : (
                <Badge variant="destructive" className="glow-pill">
                  <XCircle className="w-3 h-3 mr-1" />
                  Inválida
                </Badge>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">

            {/* Seção: Informações da Chave */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Key className="w-4 h-4" />
                <span>Informações da Chave</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-key" className="text-sm font-medium flex items-center gap-2">
                  Chave de Licença
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-key"
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="glass-card font-mono text-base"
                  required
                />
              </div>

              {/* Is Valid Switch - Destacado */}
              <div className="glass-card rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {formData.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <div>
                      <Label htmlFor="edit-isValid" className="text-sm font-medium cursor-pointer">
                        Status da Chave
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.isValid ? 'Chave ativa e utilizável' : 'Chave desativada'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="edit-isValid"
                    checked={formData.isValid}
                    onCheckedChange={(checked) => setFormData({ ...formData, isValid: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Seção: Usuários */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <User className="w-4 h-4" />
                <span>Informações de Usuário</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-userId" className="text-sm font-medium">
                    User ID
                  </Label>
                  <Input
                    id="edit-userId"
                    type="text"
                    placeholder="ID do usuário associado"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="glass-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-usedBy" className="text-sm font-medium">
                    Usado Por
                  </Label>
                  <Input
                    id="edit-usedBy"
                    type="text"
                    placeholder="ID de quem usou"
                    value={formData.usedBy}
                    onChange={(e) => setFormData({ ...formData, usedBy: e.target.value })}
                    className="glass-card"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Uso e Limites */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BarChart3 className="w-4 h-4" />
                <span>Controle de Uso</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              {/* Barra de Progresso Visual */}
              <div className="glass-card rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progresso de Uso</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {formData.usedCount} / {formData.maxUses}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      usagePercentage >= 100
                        ? 'bg-destructive'
                        : usagePercentage >= 75
                        ? 'bg-yellow-500'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                {isLimitReached && (
                  <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20">
                    <Info className="w-4 h-4" />
                    <span>Limite de uso atingido</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-maxUses" className="text-sm font-medium flex items-center gap-2">
                    Máximo de Usos
                    <span className="text-destructive">*</span>
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
                  <Label htmlFor="edit-usedCount" className="text-sm font-medium flex items-center gap-2">
                    Usos Atuais
                    <span className="text-destructive">*</span>
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
            </div>

            {/* Seção: Data de Expiração */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Calendar className="w-4 h-4" />
                <span>Validade</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

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
                {isExpired && (
                  <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
                    <Info className="w-4 h-4" />
                    <span>Esta chave está expirada</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seção: Metadados */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Clock className="w-4 h-4" />
                <span>Informações do Sistema</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              <div className="glass-card rounded-lg p-4 border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Criada em</span>
                    <p className="font-mono text-foreground">
                      {new Date(keyData.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Última Atualização</span>
                    <p className="font-mono text-foreground">
                      {new Date(keyData.updatedAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {keyData.lastUsedAt && (
                    <div className="space-y-1 md:col-span-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Último Uso</span>
                      <p className="font-mono text-foreground">
                        {new Date(keyData.lastUsedAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Footer com Actions */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-transparent to-white/5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg glass-card hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
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
        </div>
      </div>
    </div>
  );
}
