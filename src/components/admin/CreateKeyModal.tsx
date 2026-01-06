import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function CreateKeyModal({ isOpen, onClose, onSubmit }: CreateKeyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    isValid: true,
    userId: '',
    maxUses: 1,
    expiresAt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data - only send non-empty fields
      const data: any = {
        isValid: formData.isValid,
        maxUses: formData.maxUses,
      };

      if (formData.key.trim()) {
        data.key = formData.key.trim();
      }

      if (formData.userId.trim()) {
        data.userId = formData.userId.trim();
      }

      if (formData.expiresAt) {
        data.expiresAt = new Date(formData.expiresAt).toISOString();
      }

      await onSubmit(data);

      // Reset form
      setFormData({
        key: '',
        isValid: true,
        userId: '',
        maxUses: 1,
        expiresAt: '',
      });
    } catch (error) {
      console.error('Error creating key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
              <Plus className="w-5 h-5 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Nova Chave de Licença</h2>
              <p className="text-sm text-muted-foreground">
                Preencha os dados para criar uma nova chave
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
          {/* Key (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="key" className="text-sm font-medium">
              Chave (Opcional)
            </Label>
            <Input
              id="key"
              type="text"
              placeholder="Deixe vazio para gerar automaticamente"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              className="glass-card"
            />
            <p className="text-xs text-muted-foreground">
              Formato: XXXX-XXXX-XXXX-XXXX. Deixe vazio para gerar automaticamente.
            </p>
          </div>

          {/* User ID (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium">
              User ID (Opcional)
            </Label>
            <Input
              id="userId"
              type="text"
              placeholder="ID do usuário"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="glass-card"
            />
          </div>

          {/* Max Uses */}
          <div className="space-y-2">
            <Label htmlFor="maxUses" className="text-sm font-medium">
              Máximo de Usos
            </Label>
            <Input
              id="maxUses"
              type="number"
              min="1"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 1 })}
              className="glass-card"
              required
            />
          </div>

          {/* Expires At (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="expiresAt" className="text-sm font-medium">
              Data de Expiração (Opcional)
            </Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="glass-card"
            />
          </div>

          {/* Is Valid Switch */}
          <div className="flex items-center justify-between p-3 glass-card rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isValid" className="text-sm font-medium">
                Chave Válida
              </Label>
              <p className="text-xs text-muted-foreground">
                Ativar ou desativar a chave imediatamente
              </p>
            </div>
            <Switch
              id="isValid"
              checked={formData.isValid}
              onCheckedChange={(checked) => setFormData({ ...formData, isValid: checked })}
            />
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
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Criar Chave
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
