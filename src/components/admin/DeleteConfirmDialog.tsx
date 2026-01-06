import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  keyId: string | null;
}

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, keyId }: DeleteConfirmDialogProps) {
  if (!isOpen || !keyId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative glass-panel rounded-xl w-full max-w-md p-6 animate-scale-in border border-destructive/30">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Confirmar Exclusão</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tem certeza que deseja excluir esta chave de licença? Esta ação não pode ser desfeita.
          </p>
          <div className="glass-card rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">ID da Chave:</p>
            <code className="text-sm font-mono text-foreground break-all">{keyId}</code>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg glass-card hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
