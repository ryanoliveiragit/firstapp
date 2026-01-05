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
      setIsLoading(true);
      const backendUrl = getBackendUrl();
      const apiUrl = `${backendUrl}/api/auth/validate`;
      const cleanKey = key.trim();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: cleanKey }),
      });

      // Tratamento específico de erros HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao validar chave' }));

        // Tratamento de códigos HTTP específicos
        let errorTitle = 'Erro na autenticação';
        let errorDescription = errorData.message || 'Erro ao validar chave';

        switch (response.status) {
          case 401:
            errorTitle = 'Não autorizado';
            errorDescription = 'Chave de autenticação não autorizada. Verifique suas credenciais.';
            break;
          case 403:
            errorTitle = 'Chave inválida';
            errorDescription = 'A chave fornecida é inválida ou expirou. Tente novamente.';
            break;
          case 500:
            errorTitle = 'Erro no servidor';
            errorDescription = 'Erro interno do servidor. Tente novamente mais tarde.';
            break;
          case 503:
            errorTitle = 'Serviço indisponível';
            errorDescription = 'O serviço está temporariamente indisponível. Tente novamente em alguns instantes.';
            break;
        }

        toast.error(errorTitle, {
          description: errorDescription,
          duration: 5000,
        });

        throw new Error(errorDescription);
      }

      const data = await response.json();

      if (data.valid) {
        const userData: User = {
          id: data.userId || 'unknown',
          licenseKey: key.trim(),
          isValid: true,
        };

        setUser(userData);
        setLicenseKeyState(key.trim());

        // Usar sessionStorage para maior segurança (dados apagados ao fechar o navegador)
        // Comentar as linhas abaixo e usar localStorage se preferir persistência
        sessionStorage.setItem('license_key', key.trim());
        sessionStorage.setItem('auth_user', JSON.stringify(userData));

        toast.success('Autenticação bem-sucedida', {
          description: 'Bem-vindo de volta! Redirecionando...',
          duration: 3000,
        });
      } else {
        const errorMessage = data.message || 'Chave de autenticação inválida';
        toast.error('Falha na autenticação', {
          description: errorMessage,
          duration: 4000,
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Erro de rede
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Erro de conexão', {
          description: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
          duration: 5000,
        });
      }

      throw error;
    } finally {
      setIsLoading(false);
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
    <AuthContext.Provider value={{ user, licenseKey, login, logout, setLicenseKey, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
