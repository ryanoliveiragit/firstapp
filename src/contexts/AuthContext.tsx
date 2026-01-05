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
    // Verifica se há chave salva no localStorage
    const savedKey = localStorage.getItem('license_key');
    const savedUser = localStorage.getItem('auth_user');

    if (savedKey && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setLicenseKeyState(savedKey);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        localStorage.removeItem('license_key');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (key: string) => {
    if (!key || key.trim() === '') {
      toast.error('Chave inválida', {
        description: 'Por favor, insira uma chave de autenticação válida'
      });
      return;
    }

    try {
      setIsLoading(true);
      const backendUrl = getBackendUrl();
      const apiUrl = `${backendUrl}/api/auth/validate`;
      const cleanKey = key.trim();
      
      console.log('🔐 Validando chave de autenticação...');
      console.log(`📡 URL: ${apiUrl}`);
      console.log(`🔑 Key length: ${cleanKey.length} caracteres`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: cleanKey }),
      });

      console.log(`📥 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao validar chave' }));
        console.error('❌ Erro na resposta:', errorData);
        
        // Mostrar erro do backend ao usuário
        toast.error('❌ Erro ao validar chave', {
          description: errorData.message || `Erro ${response.status}: ${response.statusText}`,
          duration: 5000,
        });
        
        throw new Error(errorData.message || `Erro ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Resposta recebida:', data);

      // Mostrar resposta do backend ao usuário
      if (data.valid) {
        const userData: User = {
          id: data.userId || 'unknown',
          licenseKey: key.trim(),
          isValid: true,
        };

        setUser(userData);
        setLicenseKeyState(key.trim());
        localStorage.setItem('license_key', key.trim());
        localStorage.setItem('auth_user', JSON.stringify(userData));

        toast.success('✅ Autenticação realizada com sucesso!', {
          description: data.message || 'Bem-vindo de volta!',
          duration: 4000,
        });
      } else {
        const errorMessage = data.message || 'Chave de autenticação inválida';
        toast.error('❌ Falha na autenticação', {
          description: errorMessage,
          duration: 5000,
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      
      // Se já mostrou o toast acima, não mostra novamente
      if (error instanceof Error && error.message.includes('Erro ao validar chave')) {
        throw error;
      }
      
      // Erro de rede ou outro erro não tratado
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível validar a chave de autenticação';
      toast.error('❌ Erro na autenticação', {
        description: errorMessage,
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setLicenseKeyState(null);
    localStorage.removeItem('license_key');
    localStorage.removeItem('auth_user');

    toast.success('Logout realizado', {
      description: 'Você foi desconectado com sucesso'
    });
  };

  const setLicenseKey = (key: string) => {
    setLicenseKeyState(key);
    localStorage.setItem('license_key', key);
  };

  return (
    <AuthContext.Provider value={{ user, licenseKey, login, logout, setLicenseKey, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
