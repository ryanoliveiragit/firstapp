import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, XCircle, Eye, EyeOff } from "lucide-react";
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
    // Limitar a chave a 16 caracteres (sem hífens) para evitar duplicação
    let cleanKey = keyToValidate.trim().replace(/-/g, '').substring(0, 16);

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

    try {
      await login(cleanKey);

      // Toast de sucesso
      toast.success('Chave ativada com sucesso!', {
        description: 'Bem-vindo de volta ao Synapse',
        duration: 4000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao tentar fazer login';
      setError(errorMessage);
      hasValidatedRef.current = false;

      // Toast de erro já é mostrado pelo AuthContext
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
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    // Limitar a 16 caracteres para evitar duplicação
    let cleanKey = pastedText.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 16);
    
    if (cleanKey.length >= 12) {
      // Formatar a chave colada
      const formatted = cleanKey.match(/.{1,4}/g)?.join('-') || cleanKey;
      setKey(formatted);
      setError('');
      hasValidatedRef.current = false;
      
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

  // Verifica se a chave está completa (mínimo 12 caracteres sem hífens)
  const isKeyComplete = key.replace(/-/g, '').length >= 12;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 relative">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-zinc-700 rounded-full"></div>
              <div className="absolute inset-0 w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-white/60">Verificando sua chave...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-light text-primary tracking-tight">
            Synapse
          </h1>
          <p className="text-base text-white/60 font-light">
            Sistema de otimização inteligente
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={key}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase();
                    // Remover caracteres inválidos
                    value = value.replace(/[^A-Z0-9-]/g, '');
                    // Limitar tamanho máximo (19 caracteres com hífens: XXXX-XXXX-XXXX-XXXX)
                    if (value.replace(/-/g, '').length > 16) {
                      value = value.replace(/-/g, '').substring(0, 16);
                      // Reformatar
                      value = value.match(/.{1,4}/g)?.join('-') || value;
                    }
                    setKey(value);
                    setError('');
                    hasValidatedRef.current = false;
                  }}
                  onPaste={handlePaste}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  maxLength={19}
                  className={`
                    h-12 bg-zinc-900/50 border border-zinc-700/50 text-white 
                    placeholder:text-zinc-500 font-mono text-sm
                    focus:border-zinc-600 focus:ring-0 focus:outline-none
                    transition-colors
                    ${error ? 'border-red-500/50 focus:border-red-500' : ''}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={isLoading}
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {isLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                    disabled={isLoading}
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
                <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isKeyComplete}   
              variant={"outline"}
              className="w-full h-12 bg-white text-black hover:bg-white/90 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verificando...' : 'Continuar'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-white/40 font-light">
            v1.5.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
