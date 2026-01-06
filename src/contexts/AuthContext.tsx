import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  const envBackend = import.meta.env.VITE_BACKEND_URL;
  if (envBackend) {
    return envBackend;
  }
  return 'http://127.0.0.1:3000';
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
      
      // Normalizar a chave: remover hífens, espaços e limitar a 16 caracteres
      let cleanKey = key.trim().replace(/[-\s]/g, '').toUpperCase();
      
      // Garantir que a chave tenha no máximo 16 caracteres (evitar duplicação)
      if (cleanKey.length > 16) {
        cleanKey = cleanKey.substring(0, 16);
      }

      // Usar streaming para receber mensagens progressivas
      return new Promise<void>((resolve, reject) => {
        fetch(`${backendUrl}/api/auth/validate-stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: cleanKey }),
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error('Erro ao conectar ao servidor');
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
            setValidationResult('error');
            setIsLoading(false);
            setIsValidating(false);
            if (error instanceof TypeError && error.message.includes('fetch')) {
              toast.error('Erro de conexão', {
                description: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
                duration: 5000,
              });
            } else {
              toast.error('Erro', {
                description: error.message || 'Erro ao validar chave',
                duration: 5000,
              });
            }
            reject(error);
          });
      });
    } catch (error) {
      setValidationResult('error');
      setIsLoading(false);
      setIsValidating(false);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Erro de conexão', {
          description: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
          duration: 5000,
        });
      }
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
