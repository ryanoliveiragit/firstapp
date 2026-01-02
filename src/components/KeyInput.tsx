import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const KeyInput = () => {
  const { user, setLicenseKey, logout } = useAuth();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator ? parseInt(user.discriminator) % 5 : 0}.png`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!key.trim()) {
      setError('Por favor, insira uma key válida');
      return;
    }

    // Validação básica de formato (pode ser customizada)
    if (key.length < 16) {
      setError('Key inválida. A key deve ter pelo menos 16 caracteres');
      return;
    }

    setIsValidating(true);

    // Simular validação (aqui você pode fazer uma chamada API)
    setTimeout(() => {
      // Por enquanto, aceita qualquer key com mais de 16 caracteres
      // Você pode adicionar validação real aqui
      setLicenseKey(key);
      setIsValidating(false);
    }, 1500);
  };

  const formatKey = (value: string) => {
    // Remove caracteres não alfanuméricos e converte para maiúsculas
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Formata em blocos de 4 caracteres (XXXX-XXXX-XXXX-XXXX)
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join('-');
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKey(e.target.value);
    setKey(formatted);
    setError('');
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-black">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Background with red gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-black" />

      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 w-full flex flex-col items-center justify-center p-8">
        {/* User Info Badge */}
        <div className="mb-8 flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800/50 rounded-full">
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-10 h-10 rounded-full border-2 border-primary glow-red"
          />
          <div>
            <p className="text-sm font-semibold text-white">{user?.username}</p>
            <p className="text-xs text-gray-400">Conectado via Discord</p>
          </div>
          <button
            onClick={logout}
            className="ml-4 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            Sair
          </button>
        </div>

        <div className="w-full max-w-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center glow-red-strong animate-pulse-glow">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 text-glow">
              Ativação Necessária
            </h1>
            <p className="text-gray-400">
              Insira sua chave de licença para continuar
            </p>
          </div>

          {/* Key Input Card */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border-gray-800/50 shadow-2xl overflow-hidden">
            <CardHeader className="space-y-1 pb-4 border-b border-gray-800/50">
              <CardTitle className="text-center flex items-center justify-center gap-2 text-gray-200">
                <Key className="w-5 h-5 text-primary" />
                Chave de Licença
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Key Input */}
                <div className="space-y-2">
                  <label htmlFor="license-key" className="text-sm font-medium text-gray-300">
                    License Key
                  </label>
                  <input
                    id="license-key"
                    type="text"
                    value={key}
                    onChange={handleKeyChange}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    maxLength={19} // 16 chars + 3 hyphens
                    className="w-full h-14 px-4 bg-black/50 border border-gray-700 rounded-lg text-white font-mono text-center text-lg tracking-wider focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    disabled={isValidating}
                  />

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-400">
                      <p className="mb-1">Sua chave de licença garante acesso completo ao Paragon Tweaking Utility.</p>
                      <p className="text-xs text-gray-500">Não compartilhe sua key com terceiros.</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold"
                  disabled={isValidating || !key}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Ativar Licença
                    </>
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t border-gray-800/50">
                <p className="text-xs text-center text-gray-500">
                  Não tem uma key?{' '}
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                    Adquira aqui
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Version Footer */}
          <p className="text-center text-xs text-gray-600 mt-6">
            v1.4.6 • Paragon Tweaking Utility
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyInput;
