import React, { createContext, useContext, useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { toast } from 'sonner';

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
}

interface AuthContextType {
  user: GitHubUser | null;
  licenseKey: string | null;
  login: () => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [licenseKey, setLicenseKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('github_user');
    const savedKey = localStorage.getItem('license_key');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('github_user');
      }
    }
    if (savedKey) {
      setLicenseKeyState(savedKey);
    }
    setIsLoading(false);

    // Listen for OAuth callback from Tauri
    const setupListener = async () => {
      const unlisten = await listen('oauth-callback', async (event: any) => {
        const { code, error } = event.payload;

        if (error) {
          toast.error('Erro na autenticação', {
            description: `GitHub retornou um erro: ${error}`
          });
          return;
        }

        if (code) {
          try {
            // Exchange code for access token
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
              }),
            });

            const tokenData = await tokenResponse.json();

            if (tokenData.access_token) {
              // Fetch user data from GitHub API
              const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                  Authorization: `Bearer ${tokenData.access_token}`,
                },
              });

              if (userResponse.ok) {
                const userData: GitHubUser = await userResponse.json();
                setUser(userData);
                localStorage.setItem('github_user', JSON.stringify(userData));
                localStorage.setItem('github_token', tokenData.access_token);

                toast.success('Login realizado com sucesso!', {
                  description: `Bem-vindo, ${userData.name || userData.login}!`
                });
              } else {
                toast.error('Erro ao buscar dados do usuário', {
                  description: 'Não foi possível obter suas informações do GitHub'
                });
              }
            } else {
              toast.error('Erro na autenticação', {
                description: tokenData.error_description || 'Não foi possível obter o token de acesso'
              });
            }
          } catch (error) {
            console.error('Error during OAuth flow:', error);
            toast.error('Erro na autenticação', {
              description: 'Ocorreu um erro ao processar o login'
            });
          }
        }
      });

      return unlisten;
    };

    let unlistenPromise = setupListener();

    return () => {
      unlistenPromise.then(unlisten => unlisten());
    };
  }, [GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET]);

  const login = async () => {
    try {
      // Start the OAuth listener
      await invoke('start_oauth_listener');

      // Open GitHub OAuth in browser
      await invoke('open_github_oauth', {
        clientId: GITHUB_CLIENT_ID
      });

      toast.info('Redirecionando para GitHub...', {
        description: 'Complete o login no navegador'
      });
    } catch (error) {
      console.error('Error starting OAuth flow:', error);
      toast.error('Erro ao iniciar login', {
        description: 'Não foi possível iniciar o processo de autenticação'
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setLicenseKeyState(null);
    localStorage.removeItem('github_user');
    localStorage.removeItem('github_token');
    localStorage.removeItem('license_key');

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
