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

    // Toast de loading com mensagens contextuais
    const loadingMessages = [
      'Validando sua chave...',
      'Autenticando...',
      'Conectando ao sistema...',
    ];
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    const loadingToast = toast.loading(randomMessage, {
      description: 'Aguarde enquanto verificamos suas credenciais',
      id: 'validating-key',
      duration: Infinity,
    });

    try {
      await login(cleanKey);
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
      setError('Chave de licença inválida');
      hasValidatedRef.current = false;
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background p-4">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Grid background */}
      <div className="ai-grid-bg" />

      {/* Glow orbs */}
      <div className="glow-orb-cyan" style={{ top: '10%', left: '15%' }} />
      <div className="glow-orb-purple" style={{ bottom: '15%', right: '10%' }} />

      {/* Particles */}
      <div className="particle" style={{ top: '20%', left: '25%' }} />
      <div className="particle" style={{ top: '60%', right: '30%' }} />
      <div className="particle" style={{ top: '40%', left: '70%' }} />
      <div className="particle" style={{ bottom: '30%', left: '40%' }} />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <Card className="glass-panel backdrop-blur-xl shadow-2xl cyber-glow transition-all duration-500 border-primary/20">
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
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {isValidating && (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      disabled={isValidating}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <Input
                    id="license-key"
                    type={showPassword ? "text" : "password"}
                    value={key}
                    onChange={handleKeyChange}
                    onPaste={handlePaste}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    maxLength={19}
                    className={`h-14 pl-12 pr-24 text-center font-mono text-lg tracking-wider bg-background/50 transition-all ${
                      error
                        ? 'border-destructive focus-visible:ring-destructive'
                        : isValidating
                        ? 'border-primary shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                        : 'border-primary/30 focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,217,255,0.2)]'
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
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium shadow-lg button-shine button-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,217,255,0.3)]"
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
