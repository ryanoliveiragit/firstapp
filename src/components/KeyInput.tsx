import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const KeyInput = () => {
  const { login } = useAuth();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasValidatedRef = useRef(false);

  // Validação de formato da chave
  const isValidKeyFormat = (key: string): boolean => {
    const cleanKey = key.replace(/-/g, '');
    const keyRegex = /^[A-Z0-9]{12,}$/;
    return keyRegex.test(cleanKey);
  };

  const validateKey = async (keyToValidate: string) => {
    const cleanKey = keyToValidate.replace(/-/g, '');

    if (cleanKey.length < 12) {
      return;
    }

    if (!isValidKeyFormat(cleanKey)) {
      setError('Formato de chave inválido');
      toast.error('Formato inválido', {
        description: 'A chave deve conter apenas letras maiúsculas e números',
        duration: 4000,
      });
      return;
    }

    if (isValidating || hasValidatedRef.current) {
      return;
    }

    setIsValidating(true);
    hasValidatedRef.current = true;
    setError('');

    try {
      await login(cleanKey);

      // Toast de sucesso
      toast.success('Chave ativada com sucesso!', {
        description: 'Bem-vindo ao Synapse',
        duration: 4000,
      });
    } catch (error) {
      setError('Chave de licença inválida');
      hasValidatedRef.current = false;

      // Toast de erro já é mostrado pelo AuthContext
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
    const value = e.target.value.toUpperCase();
    const formatted = formatKey(value);
    setKey(formatted);
    setError('');
    hasValidatedRef.current = false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Loading Full Screen Overlay */}
      {isValidating && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground animate-pulse">
                Verificando sua chave
              </p>
              <p className="text-sm text-muted-foreground">
                Aguarde enquanto validamos suas credenciais
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in-50 duration-700">
          <h1 className="text-3xl font-semibold tracking-tight">
            Synapse
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de otimização inteligente
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/50 animate-in fade-in-50 slide-in-from-bottom-4 duration-700" style={{ animationDelay: '150ms' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-medium">Chave de acesso</CardTitle>
            <p className="text-sm text-muted-foreground">
              Insira sua chave para continuar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="license-key"
                    type={showPassword ? "text" : "password"}
                    value={key}
                    onChange={handleKeyChange}
                    onPaste={handlePaste}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    maxLength={19}
                    className={`pl-9 pr-16 h-11 font-mono text-sm ${
                      error
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }`}
                    disabled={isValidating}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isValidating && (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isValidating}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10"
                disabled={isValidating || !key}
                size="default"
              >
                {isValidating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validando...</span>
                  </span>
                ) : (
                  'Continuar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground animate-in fade-in duration-700" style={{ animationDelay: '300ms' }}>
          v1.5.0
        </p>
      </div>
    </div>
  );
};

export default KeyInput;
