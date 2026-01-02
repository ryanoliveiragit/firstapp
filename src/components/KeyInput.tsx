import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const VALID_KEY = '123123123123';

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
      toast.error('Campo vazio', {
        description: 'Por favor, insira uma chave de licença'
      });
      return;
    }

    const cleanKey = key.replace(/-/g, '');

    if (cleanKey.length < 12) {
      setError('Key muito curta');
      toast.error('Chave inválida', {
        description: 'A chave deve ter pelo menos 12 caracteres'
      });
      return;
    }

    setIsValidating(true);
    toast.loading('Validando chave de licença...', {
      id: 'validating-key'
    });

    setTimeout(() => {
      if (cleanKey === VALID_KEY) {
        setLicenseKey(key);
        toast.success('Licença ativada com sucesso!', {
          id: 'validating-key',
          description: 'Bem-vindo ao Paragon Tweaking Utility'
        });
        setIsValidating(false);
      } else {
        setError('Chave de licença inválida');
        toast.error('Chave inválida', {
          id: 'validating-key',
          description: 'A chave inserida não é válida. Verifique e tente novamente.'
        });
        setIsValidating(false);
      }
    }, 1500);
  };

  const formatKey = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join('-');
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKey(e.target.value);
    setKey(formatted);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2 border-primary/20"
            />
            <div>
              <p className="text-sm font-medium text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Discord</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-md"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <Card className="border-border bg-card/95 backdrop-blur-xl shadow-2xl">
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <CardHeader className="text-center space-y-3 pt-8 pb-6">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center ring-1 ring-primary/20">
                <Key className="w-7 h-7 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-light text-foreground">
              Ativar Licença
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Insira sua chave de acesso
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="license-key"
                  type="text"
                  value={key}
                  onChange={handleKeyChange}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  maxLength={19}
                  className={`h-14 text-center font-mono text-lg tracking-wider bg-secondary border-border ${
                    error ? 'border-destructive' : 'focus:border-primary'
                  }`}
                  disabled={isValidating}
                />

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isValidating || !key}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Validando
                  </>
                ) : (
                  'Ativar'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground pt-2">
                Não tem uma chave?{' '}
                <a href="#" className="text-primary hover:underline font-medium">
                  Adquira aqui
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Paragon Tweaking Utility · v1.4.6
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyInput;
