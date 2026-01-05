import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Key, XCircle } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasValidatedRef = useRef(false);

  const validateKey = async (keyToValidate: string) => {
    if (!keyToValidate.trim() || keyToValidate.trim().length < 12) {
      return;
    }

    if (isLoading || hasValidatedRef.current) {
      return;
    }

    setIsLoading(true);
    hasValidatedRef.current = true;
    setError('');
    
    // Toast de loading
    const loadingToast = toast.loading('Validando chave de autenticação...', {
      description: 'Aguarde enquanto verificamos sua chave',
      duration: Infinity,
      id: 'login-loading',
    });

    try {
      await login(keyToValidate.trim());
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao tentar fazer login';
      setError(errorMessage);
      hasValidatedRef.current = false; // Permite tentar novamente em caso de erro
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden ">

   <img
    src='/gradient-1.png'
    className='absolute inset-0 blur-sm w-full h-full object-cover -z-10'
  />


      <div className="relative z-10 w-full max-w-md px-4">
        <div className="space-y-8 animate-fade-in-up">
          <div className="text-center space-y-4 animate-scale-in">

            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent animate-fade-in">
                Synapse
              </h1>
              <p className="text-muted-foreground max-w-sm mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Plataforma inteligente para otimização de performance e tweaking avançado
              </p>
            </div>
          </div>

          <Card className=" backdrop-blur-xl shadow-2xl animate-scale-in hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500" style={{ animationDelay: '200ms' }}>
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
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    {isLoading && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
                    )}
                    <Input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        setKey(e.target.value);
                        setError('');
                        hasValidatedRef.current = false; // Reset para permitir nova validação
                      }}
                      onPaste={handlePaste}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      className={`w-full pl-10 pr-10 h-12 font-mono text-center tracking-wider transition-all ${
                        error 
                          ? 'border-destructive focus-visible:ring-destructive' 
                          : isLoading
                          ? 'border-primary'
                          : ''
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
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg button-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
