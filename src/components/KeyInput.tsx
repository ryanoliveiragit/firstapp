import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Key } from 'lucide-react';
import { toast } from 'sonner';

const KeyInput = () => {
  const { login } = useAuth();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasValidatedRef = useRef(false);

  const validateKey = async (keyToValidate: string) => {
    const cleanKey = keyToValidate.replace(/-/g, '');

    if (cleanKey.length < 12) {
      return;
    }

    if (isValidating || hasValidatedRef.current) {
      return;
    }

    setIsValidating(true);
    hasValidatedRef.current = true;
    setError('');
    
    // Toast de loading
    const loadingToast = toast.loading('Validando chave de licença...', {
      description: 'Aguarde enquanto verificamos sua chave',
      id: 'validating-key',
      duration: Infinity,
    });

    try {
      await login(cleanKey);
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'A chave inserida não é válida. Verifique e tente novamente.';
      setError('Chave de licença inválida');
      hasValidatedRef.current = false; // Permite tentar novamente em caso de erro
      toast.error('Chave inválida', {
        description: errorMessage,
        icon: <AlertCircle className="w-5 h-5" />,
        duration: 5000,
        id: 'validating-key',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim() && !isValidating) {
      await validateKey(key);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const cleanKey = pastedText.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    if (cleanKey.length >= 12) {
      // Formatar a chave colada
      const formatted = formatKey(cleanKey);
      setKey(formatted);
      setError('');
      
      // Validar automaticamente após um pequeno delay
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      validationTimeoutRef.current = setTimeout(() => {
        validateKey(cleanKey);
      }, 300);
    }
  };

  // Validação automática quando a chave completa é digitada
  useEffect(() => {
    const cleanKey = key.replace(/-/g, '');
    
    if (cleanKey.length >= 12 && !isValidating && !hasValidatedRef.current) {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      
      validationTimeoutRef.current = setTimeout(() => {
        validateKey(cleanKey);
      }, 500); // Delay para evitar validação a cada tecla
    }

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isValidating]);

  const formatKey = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join('-');
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKey(e.target.value);
    setKey(formatted);
    setError('');
    hasValidatedRef.current = false; // Reset para permitir nova validação
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
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  {isValidating && (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
                  )}
                  <Input
                    id="license-key"
                    type="text"
                    value={key}
                    onChange={handleKeyChange}
                    onPaste={handlePaste}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    maxLength={19}
                    className={`h-14 pl-12 pr-12 text-center font-mono text-lg tracking-wider bg-secondary border-border transition-all ${
                      error 
                        ? 'border-destructive focus-visible:ring-destructive' 
                        : isValidating
                        ? 'border-primary'
                        : 'focus:border-primary focus-visible:ring-primary'
                    }`}
                    disabled={isValidating}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isValidating || !key}
              >
                {isValidating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Validando...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Key className="w-4 h-4" />
                    <span>Ativar</span>
                  </span>
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
