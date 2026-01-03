import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { start as startOAuthServer, cancel as cancelOAuthServer, onUrl, onInvalidUrl } from '@fabianlars/tauri-plugin-oauth';
import { openUrl } from '@tauri-apps/plugin-opener';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

interface AuthContextType {
  user: DiscordUser | null;
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
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [licenseKey, setLicenseKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const oauthPortRef = useRef<number | null>(null);
  const oauthUnlistenRef = useRef<Array<() => void>>([]);

  const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const DISCORD_REDIRECT_PORT =
    Number(import.meta.env.VITE_DISCORD_REDIRECT_PORT) || 1420;
  const DISCORD_REDIRECT_PATH = '/callback';

  const cleanupOAuth = async () => {
    oauthUnlistenRef.current.forEach((unlisten) => {
      try {
        unlisten();
      } catch (error) {
        console.error('Erro ao remover listener OAuth:', error);
      }
    });
    oauthUnlistenRef.current = [];

    if (oauthPortRef.current !== null) {
      try {
        await cancelOAuthServer(oauthPortRef.current);
      } catch (error) {
        console.error('Erro ao encerrar servidor OAuth:', error);
      } finally {
        oauthPortRef.current = null;
      }
    }
  };

  const handleOAuthRedirect = async (redirectUrl: string) => {
    const [, fragment] = redirectUrl.split('#');
    if (!fragment) {
      throw new Error('Resposta do OAuth não contém fragmento com token.');
    }

    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');

    if (!accessToken) {
      throw new Error('Token de acesso não encontrado na resposta do OAuth.');
    }

    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível obter os dados do usuário Discord.');
      }

      const userData: DiscordUser = await response.json();
      setUser(userData);
      localStorage.setItem('discord_user', JSON.stringify(userData));
      localStorage.setItem('discord_token', accessToken);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erro desconhecido ao processar login.'
      );
    }
  };

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('discord_user');
    const savedKey = localStorage.getItem('license_key');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedKey) {
      setLicenseKeyState(savedKey);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanupOAuth();
    };
  }, []);

  const login = async () => {
    if (!DISCORD_CLIENT_ID) {
      throw new Error(
        'Discord Client ID não configurado. Verifique a variável VITE_DISCORD_CLIENT_ID no arquivo .env.'
      );
    }

    await cleanupOAuth();

    return new Promise<void>(async (resolve, reject) => {
      let finished = false;

      const finalize = async (error?: unknown) => {
        if (finished) return;
        finished = true;
        await cleanupOAuth();
        if (error) {
          reject(error instanceof Error ? error : new Error('Erro desconhecido ao fazer login.'));
        } else {
          resolve();
        }
      };

      try {
        const port = await startOAuthServer({
          ports: [DISCORD_REDIRECT_PORT],
          response:
            '<html><body style="font-family: sans-serif; text-align: center; padding: 2rem;">Login concluído. Você pode fechar esta janela.</body></html>',
        });
        oauthPortRef.current = port;

        const urlUnlisten = await onUrl((redirectUrl) => {
          handleOAuthRedirect(redirectUrl)
            .then(() => finalize())
            .catch((error) => {
              console.error('Erro ao processar callback do Discord:', error);
              finalize(error);
            });
        });
        oauthUnlistenRef.current.push(urlUnlisten);

        const invalidUrlUnlisten = await onInvalidUrl((error) => {
          finalize(new Error(`URL de redirecionamento inválida: ${error}`));
        });
        oauthUnlistenRef.current.push(invalidUrlUnlisten);

        const redirectUri = `http://localhost:${port}${DISCORD_REDIRECT_PATH}`;
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=token&scope=identify%20email`;

        await openUrl(authUrl);
      } catch (error) {
        console.error('Erro ao iniciar fluxo de OAuth do Discord:', error);
        finalize(error);
      }
    });
  };

  const logout = () => {
    setUser(null);
    setLicenseKeyState(null);
    localStorage.removeItem('discord_user');
    localStorage.removeItem('discord_token');
    localStorage.removeItem('license_key');
    cleanupOAuth();
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
