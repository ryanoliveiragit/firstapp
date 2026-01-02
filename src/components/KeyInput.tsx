import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const VALID_KEY = '123123123123';

const KeyInput = () => {
  const {  setLicenseKey } = useAuth();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

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
          description: 'Bem-vindo ao Synapse'
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
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-md space-y-6">
              <img 
    src='/gradient-1.png' 
    className='absolute inset-0 blur-sm w-full h-full object-cover -z-10'
  />
        <Card className="border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">Insira sua chave de acesso</CardTitle>
            <p className="text-sm text-muted-foreground">
              Insira sua chave de acesso para continuar
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

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Synapse v1.5.0
        </p>
      </div>
    </div>
  );
};

export default KeyInput;
