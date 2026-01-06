import { useState } from 'react';
import { Edit2, Trash2, RotateCcw, Copy, Check, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LicenseKey } from '@/services/adminService';
import { toast } from 'sonner';

interface KeyListTableProps {
  keys: LicenseKey[];
  onEdit: (key: LicenseKey) => void;
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
}

export default function KeyListTable({ keys, onEdit, onDelete, onReset }: KeyListTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopyKey = async (key: string, id: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedId(id);
      toast.success('Chave copiada!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar chave');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (key: LicenseKey) => {
    if (!key.isValid) {
      return <Badge variant="destructive" className="glow-pill">Inválida</Badge>;
    }

    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
      return <Badge variant="destructive" className="glow-pill">Expirada</Badge>;
    }

    if (key.usedCount >= key.maxUses) {
      return <Badge variant="secondary" className="glow-pill">Limite Atingido</Badge>;
    }

    return <Badge className="glow-pill bg-green-500/20 text-green-400 border-green-500/30">Ativa</Badge>;
  };

  const filteredKeys = keys.filter(key =>
    key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.usedBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-xl overflow-hidden animate-scale-in">
      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por chave, userId ou usedBy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Chave
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Uso
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                User ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Criada Em
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Expira Em
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredKeys.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma chave encontrada</p>
                </td>
              </tr>
            ) : (
              filteredKeys.map((key, index) => (
                <tr
                  key={key.id}
                  className="hover:bg-white/5 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                        {key.key}
                      </code>
                      <button
                        onClick={() => handleCopyKey(key.key, key.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Copiar chave"
                      >
                        {copiedId === key.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(key)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {key.usedCount}/{key.maxUses}
                      </span>
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${Math.min((key.usedCount / key.maxUses) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {key.userId || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(key.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(key.expiresAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onReset(key.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Resetar uso"
                      >
                        <RotateCcw className="w-4 h-4 text-primary" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => onEdit(key)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 text-primary" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => onDelete(key.id)}
                        className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/5">
        <p className="text-xs text-muted-foreground">
          Mostrando {filteredKeys.length} de {keys.length} chave{keys.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
