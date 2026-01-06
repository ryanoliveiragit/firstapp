import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Key, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Mensagens de análise da IA
const analysisMessages = [
  { text: "Analisando sua chave...", delay: 0 },
  { text: "Verificando acesso...", delay: 800 },
  { text: "Validando credenciais...", delay: 1600 },
  { text: "Criando componentes...", delay: 2400 },
  { text: "Inicializando sistema...", delay: 3200 },
  { text: "Quase pronto...", delay: 4000 },
];

const KeyInput = () => {
  const { login } = useAuth();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(
    analysisMessages[0].text
  );
  const [messageIndex, setMessageIndex] = useState(0);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasValidatedRef = useRef(false);

  // Validação de formato da chave
  const isValidKeyFormat = (key: string): boolean => {
    const cleanKey = key.replace(/-/g, "");
    const keyRegex = /^[A-Z0-9]{12,}$/;
    return keyRegex.test(cleanKey);
  };

  // Efeito para mudar as mensagens durante a validação
  useEffect(() => {
    if (isValidating) {
      setMessageIndex(0);
      setCurrentMessage(analysisMessages[0].text);

      const timeouts: NodeJS.Timeout[] = [];

      analysisMessages.forEach((message, index) => {
        const timeout = setTimeout(() => {
          setCurrentMessage(message.text);
          setMessageIndex(index);
        }, message.delay);
        timeouts.push(timeout);
      });

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    } else {
      setMessageIndex(0);
      setCurrentMessage(analysisMessages[0].text);
    }
  }, [isValidating]);

  const validateKey = async (keyToValidate: string) => {
    const cleanKey = keyToValidate.replace(/-/g, "");

    if (cleanKey.length < 12) {
      return;
    }

    if (!isValidKeyFormat(cleanKey)) {
      setError("Formato de chave inválido");
      toast.error("Formato inválido", {
        description: "A chave deve conter apenas letras maiúsculas e números",
        duration: 4000,
      });
      return;
    }

    if (isValidating || hasValidatedRef.current) {
      return;
    }

    setIsValidating(true);
    hasValidatedRef.current = true;
    setError("");

    try {
      // Simular delay mínimo de 5 segundos para a análise
      const minDelay = 5000;
      const startTime = Date.now();

      const loginPromise = login(cleanKey);
      const delayPromise = new Promise((resolve) =>
        setTimeout(resolve, minDelay)
      );

      await Promise.all([loginPromise, delayPromise]);

      // Garantir que pelo menos 5 segundos passaram
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      // Toast de sucesso
      toast.success("Chave ativada com sucesso!", {
        description: "Bem-vindo ao Synapse",
        duration: 4000,
      });
    } catch (error) {
      setError("Chave de licença inválida");
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
    const pastedText = e.clipboardData.getData("text");
    const cleanKey = pastedText.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    if (cleanKey.length >= 12) {
      // Formatar a chave colada
      const formatted = formatKey(cleanKey);
      setKey(formatted);
      setError("");

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
    const cleanKey = key.replace(/-/g, "");

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
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join("-");
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    const formatted = formatKey(value);
    setKey(formatted);
    setError("");
    hasValidatedRef.current = false;
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Loading Screen */}
      {isValidating && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 max-w-md px-6">
            {/* Animated AI Icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-primary/10 blur-xl animate-pulse" />
            </div>

            {/* Progress Indicator */}
            <div className="w-full max-w-xs space-y-3">
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${
                      ((messageIndex + 1) / analysisMessages.length) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Message with typing effect */}
              <div className="text-center min-h-[24px]">
                <p className="text-base font-medium text-foreground animate-in fade-in duration-300">
                  {currentMessage}
                  <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse" />
                </p>
              </div>
            </div>

            {/* Loading dots */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in-50 duration-700">
          <h1 className="text-3xl font-semibold tracking-tight">Synapse</h1>
          <p className="text-sm text-muted-foreground">
            Sistema de otimização inteligente
          </p>
        </div>

        {/* Card */}
        <Card
          className="border-border/50 animate-in fade-in-50 slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "150ms" }}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-medium">
              Chave de acesso
            </CardTitle>
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
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    disabled={isValidating}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isValidating && (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                    <Button
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
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p
          className="text-center text-xs text-muted-foreground animate-in fade-in duration-700"
          style={{ animationDelay: "300ms" }}
        >
          v1.5.01
        </p>
      </div>
    </div>
  );
};

export default KeyInput;
