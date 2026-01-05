import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Key, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasValidatedRef = useRef(false);

  // Validação de formato da chave
  const isValidKeyFormat = (key: string): boolean => {
    const cleanKey = key.replace(/-/g, '');
    // Regex: aceita apenas letras maiúsculas e números, mínimo 12 caracteres
    const keyRegex = /^[A-Z0-9]{12,}$/;
    return keyRegex.test(cleanKey);
  };

  const validateKey = async (keyToValidate: string) => {
    const cleanKey = keyToValidate.trim().replace(/-/g, '');

    if (!cleanKey || cleanKey.length < 12) {
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

    if (isLoading || hasValidatedRef.current) {
      return;
    }

    setIsLoading(true);
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
      duration: Infinity,
      id: 'login-loading',
    });

    try {
      await login(cleanKey);
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao tentar fazer login';
      setError(errorMessage);
      hasValidatedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim() && !isLoading) {
      await validateKey(key.trim());
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const cleanKey = pastedText.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    if (cleanKey.length >= 12) {
      // Formatar a chave colada
      const formatted = cleanKey.match(/.{1,4}/g)?.join('-') || cleanKey;
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
    
    if (cleanKey.length >= 12 && !isLoading && !hasValidatedRef.current) {
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
  }, [key, isLoading]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
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

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="space-y-8 animate-fade-in-up">
          <div className="text-center space-y-4 animate-scale-in">

            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in neon-text">
                Synapse
              </h1>
              <p className="text-muted-foreground max-w-sm mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Plataforma inteligente de otimização com IA
              </p>
            </div>
          </div>

          <Card className="glass-panel backdrop-blur-xl shadow-2xl animate-scale-in cyber-glow transition-all duration-500 border-primary/20" style={{ animationDelay: '200ms' }}>
            <CardHeader className="space-y-1 pb-4 justify-cente text-center">
              <CardTitle className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Insira sua chave de autenticação para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {isLoading && (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={key}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setKey(value);
                        setError('');
                        hasValidatedRef.current = false;
                      }}
                      onPaste={handlePaste}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      className={`w-full pl-10 pr-20 h-12 font-mono text-center tracking-wider transition-all bg-background/50 ${
                        error
                          ? 'border-destructive focus-visible:ring-destructive'
                          : isLoading
                          ? 'border-primary shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                          : 'border-primary/30 focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                      }`}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in slide-in-from-top-1">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !key.trim()}
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg button-shine button-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,217,255,0.3)]"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Validando...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Key className="w-4 h-4" />
                      <span>Entrar</span>
                    </span>
                  )}
                </Button>
              </form>



              <p className="text-xs text-center text-muted-foreground">
                Ao continuar, você concorda com nossos{" "}
                <button className="text-foreground/70 hover:text-foreground underline underline-offset-4 transition-colors">
                  Termos de Serviço
                </button>
                {" "}e{" "}
                <button className="text-foreground/70 hover:text-foreground underline underline-offset-4 transition-colors">
                  Política de Privacidade
                </button>
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Todos os sistemas operacionais</span>
            </div>
            <span>•</span>
            <span>v1.5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
