import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { universalFetch } from '../utils/tauriFetch';

export interface User {
  id: string;
  licenseKey: string;
  isValid: boolean;
}

interface AuthContextType {
  user: User | null;
  licenseKey: string | null;
  login: (key: string) => Promise<void>;
  logout: () => void;
  setLicenseKey: (key: string) => void;
  isLoading: boolean;
  isValidating: boolean;
  validationResult: 'success' | 'error' | null;
  backendMessages: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// URL do backend (pode ser configurada via variável de ambiente)
const getBackendUrl = () => {
  // Em produção, as variáveis VITE_* são substituídas em tempo de build
  // Se não estiver definida, usa o padrão
  const envBackend = import.meta.env.VITE_BACKEND_URL;
  
  // Log para debug - mostrar o que está sendo usado
  console.log('[getBackendUrl] VITE_BACKEND_URL:', envBackend);
  console.log('[getBackendUrl] import.meta.env:', import.meta.env);
  
  if (envBackend) {
    // Remove barra final se houver
    return envBackend.replace(/\/$/, '');
  }
  
  // Fallback para desenvolvimento local
  const fallback = 'http://127.0.0.1:3000';
  console.warn('[getBackendUrl] VITE_BACKEND_URL não definida, usando fallback:', fallback);
  return fallback;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [licenseKey, setLicenseKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);
  const [backendMessages, setBackendMessages] = useState<string[]>([]);

  useEffect(() => {
    // Verifica se há chave salva no sessionStorage (mais seguro)
    const savedKey = sessionStorage.getItem('license_key');
    const savedUser = sessionStorage.getItem('auth_user');

    if (savedKey && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setLicenseKeyState(savedKey);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        sessionStorage.removeItem('license_key');
        sessionStorage.removeItem('auth_user');
      }
    }

    // Carregamento inicial rápido, sem delay
    setIsLoading(false);
  }, []);

  const login = async (key: string) => {
    if (!key || key.trim() === '') {
      toast.error('Chave inválida', {
        description: 'Por favor, insira uma chave de autenticação válida',
        duration: 4000,
      });
      return;
    }

    try {
      setIsValidating(true);
      setIsLoading(true);
      setValidationResult(null);
      setBackendMessages([]);
      const backendUrl = getBackendUrl();
      console.log('[AuthContext] Backend URL:', backendUrl);
      console.log('[AuthContext] VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
      console.log('[AuthContext] Modo:', import.meta.env.MODE);
      console.log('[AuthContext] Dev:', import.meta.env.DEV);
      console.log('[AuthContext] Prod:', import.meta.env.PROD);
      
      // Teste de conectividade antes de fazer a requisição real
      console.log('[AuthContext] Testando conectividade básica...');
      
      // Normalizar a chave: remover hífens, espaços e limitar a 16 caracteres
      let cleanKey = key.trim().replace(/[-\s]/g, '').toUpperCase();
      
      // Garantir que a chave tenha no máximo 16 caracteres (evitar duplicação)
      if (cleanKey.length > 16) {
        cleanKey = cleanKey.substring(0, 16);
      }

      // Detectar se está no Tauri
      // O plugin HTTP do Tauri pode não suportar streaming (SSE) corretamente
      const isTauriEnv = typeof window !== 'undefined' && 
                        ('__TAURI_INTERNALS__' in window || 
                         typeof (window as any).__TAURI_INVOKE__ !== 'undefined' ||
                         navigator.userAgent.toLowerCase().includes('tauri'));
      
      // No Tauri, usar endpoint normal (sem streaming) para garantir compatibilidade
      // Na web, usar streaming para melhor UX
      const useStreaming = !isTauriEnv;
      const apiUrl = useStreaming 
        ? `${backendUrl}/api/auth/validate-stream`
        : `${backendUrl}/api/auth/validate`;
      
      console.log('[AuthContext] Ambiente Tauri:', isTauriEnv);
      console.log('[AuthContext] Usando streaming:', useStreaming);
      console.log('[AuthContext] URL da API:', apiUrl);
      
      // Se não usar streaming (Tauri), fazer requisição simples
      if (!useStreaming) {
        console.log('[AuthContext] Usando endpoint normal (sem streaming)');
        const startTime = Date.now();
        
        try {
          const response = await universalFetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: cleanKey }),
          });
          
          const elapsed = Date.now() - startTime;
          console.log('[AuthContext] Resposta recebida em', elapsed, 'ms');
          console.log('[AuthContext] Status:', response.status, response.statusText);
          
          if (!response.ok) {
            const errorText = await response.text().catch(() => 'Erro desconhecido');
            console.error('[AuthContext] Erro na resposta:', response.status, errorText);
            throw new Error(`Erro ao conectar ao servidor: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          console.log('[AuthContext] Resultado:', result);
          
          if (result.valid) {
            setValidationResult('success');
            const userData: User = {
              id: result.userId || 'unknown',
              licenseKey: key.trim(),
              isValid: true,
            };
            setUser(userData);
            setLicenseKeyState(key.trim());
            sessionStorage.setItem('license_key', key.trim());
            sessionStorage.setItem('auth_user', JSON.stringify(userData));
            toast.success('Autenticação bem-sucedida', {
              description: 'Bem-vindo de volta! Redirecionando...',
              duration: 3000,
            });
            setIsLoading(false);
            setIsValidating(false);
          } else {
            setValidationResult('error');
            toast.error('Falha na autenticação', {
              description: result.message || 'Chave inválida',
              duration: 4000,
            });
            setIsLoading(false);
            setIsValidating(false);
            throw new Error(result.message || 'Chave inválida');
          }
        } catch (error) {
          console.error('[AuthContext] Erro na requisição:', error);
          setValidationResult('error');
          setIsLoading(false);
          setIsValidating(false);
          
          let errorMessage = 'Erro ao validar chave';
          let errorDescription = 'Tente novamente mais tarde.';
          
          if (error instanceof TypeError) {
            if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
              errorMessage = 'Erro de conexão';
              errorDescription = `Não foi possível conectar ao servidor (${backendUrl}). Verifique sua conexão e se o backend está rodando.`;
            }
          } else if (error instanceof Error) {
            errorMessage = 'Erro';
            errorDescription = error.message || 'Erro desconhecido ao validar chave.';
          }
          
          toast.error(errorMessage, {
            description: errorDescription,
            duration: 6000,
          });
          throw error;
        }
      }
      
      // Se usar streaming (web), continuar com a lógica de streaming
      return new Promise<void>((resolve, reject) => {
        console.log('[AuthContext] Iniciando fetch com streaming...');
        const startTime = Date.now();
        
        universalFetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: cleanKey }),
        })
          .then(async (response) => {
            const elapsed = Date.now() - startTime;
            console.log('[AuthContext] Resposta recebida em', elapsed, 'ms');
            console.log('[AuthContext] Status:', response.status, response.statusText);
            console.log('[AuthContext] Headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
              const errorText = await response.text().catch(() => 'Erro desconhecido');
              console.error('[AuthContext] Erro na resposta:', response.status, errorText);
              throw new Error(`Erro ao conectar ao servidor: ${response.status} ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
              throw new Error('Stream não disponível');
            }

            const minDelayBetweenMessages = 800; // Delay mínimo de 800ms entre mensagens
            let messageIndex = 0;

            // Função para processar mensagens com delay
            const processMessageWithDelay = (messageData: { type: string; data: any }, index: number) => {
              const delay = index * minDelayBetweenMessages;
              
              setTimeout(() => {
                if (messageData.type === 'progress') {
                  setBackendMessages((prev) => [...prev, messageData.data.message]);
                } else if (messageData.type === 'success') {
                  // Aguardar um pouco mais antes de finalizar
                  setTimeout(() => {
                    setValidationResult('success');
                    const userData: User = {
                      id: messageData.data.result.userId || 'unknown',
                      licenseKey: key.trim(),
                      isValid: true,
                    };
                    setUser(userData);
                    setLicenseKeyState(key.trim());
                    sessionStorage.setItem('license_key', key.trim());
                    sessionStorage.setItem('auth_user', JSON.stringify(userData));
                    toast.success('Autenticação bem-sucedida', {
                      description: 'Bem-vindo de volta! Redirecionando...',
                      duration: 3000,
                    });
                    setIsLoading(false);
                    setIsValidating(false);
                    resolve();
                  }, 500);
                } else if (messageData.type === 'error') {
                  // Aguardar um pouco mais antes de mostrar erro
                  setTimeout(() => {
                    setValidationResult('error');
                    toast.error('Falha na autenticação', {
                      description: messageData.data.message || 'Chave inválida',
                      duration: 4000,
                    });
                    setIsLoading(false);
                    setIsValidating(false);
                    reject(new Error(messageData.data.message || 'Chave inválida'));
                  }, 500);
                }
              }, delay);
            };

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    
                    // Processar mensagem com delay
                    processMessageWithDelay({ type: data.type, data }, messageIndex);
                    messageIndex++;
                  } catch (e) {
                    // Ignorar erros de parsing
                  }
                }
              }
            }
          })
          .catch((error) => {
            console.error('[AuthContext] Erro na requisição:', error);
            console.error('[AuthContext] Tipo do erro:', error?.constructor?.name);
            console.error('[AuthContext] Mensagem:', error?.message);
            console.error('[AuthContext] Stack:', error?.stack);
            
            setValidationResult('error');
            setIsLoading(false);
            setIsValidating(false);
            
            let errorMessage = 'Erro ao validar chave';
            let errorDescription = 'Tente novamente mais tarde.';
            
            if (error instanceof TypeError) {
              if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
                errorMessage = 'Erro de conexão';
                errorDescription = `Não foi possível conectar ao servidor (${backendUrl}). Verifique sua conexão e se o backend está rodando.`;
              } else if (error.message.includes('NetworkError')) {
                errorMessage = 'Erro de rede';
                errorDescription = 'Erro de rede ao tentar conectar ao servidor. Verifique sua conexão com a internet.';
              }
            } else if (error instanceof Error) {
              errorMessage = 'Erro';
              errorDescription = error.message || 'Erro desconhecido ao validar chave.';
            }
            
            toast.error(errorMessage, {
              description: errorDescription,
              duration: 6000,
            });
            reject(error);
          });
      });
    } catch (error) {
      console.error('[AuthContext] Erro no catch externo:', error);
      setValidationResult('error');
      setIsLoading(false);
      setIsValidating(false);
      
      let errorMessage = 'Erro de conexão';
      let errorDescription = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      
      if (error instanceof TypeError) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorDescription = `Não foi possível conectar ao servidor (${getBackendUrl()}). Verifique sua conexão e se o backend está rodando.`;
        }
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
      });
      throw error;
    }
  };


  const logout = () => {
    setUser(null);
    setLicenseKeyState(null);
    sessionStorage.removeItem('license_key');
    sessionStorage.removeItem('auth_user');

    toast.success('Logout realizado', {
      description: 'Você foi desconectado com sucesso',
      duration: 3000,
    });
  };

  const setLicenseKey = (key: string) => {
    setLicenseKeyState(key);
    sessionStorage.setItem('license_key', key);
  };

  return (
    <AuthContext.Provider value={{ user, licenseKey, login, logout, setLicenseKey, isLoading, isValidating, validationResult, backendMessages }}>
      {children}
    </AuthContext.Provider>
  );
};
