import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: () => void;
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

  const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;

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

    // Handle OAuth callback via Tauri deep link
    const handleAuthToken = async (accessToken: string) => {
      try {
        // Fetch user data from Discord API
        const response = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData: DiscordUser = await response.json();
          setUser(userData);
          localStorage.setItem('discord_user', JSON.stringify(userData));
          localStorage.setItem('discord_token', accessToken);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Listen for deep link events from Tauri
    if (window.__TAURI__) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen<string>('discord-auth', (event) => {
          console.log('Received auth token:', event.payload);
          handleAuthToken(event.payload);
        });
      });
    }
  }, []);

  const login = async () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=identify%20email`;

    // Tenta abrir no navegador externo usando Tauri
    if (window.__TAURI__) {
      try {
        const { open } = await import('@tauri-apps/plugin-shell');
        await open(authUrl);
      } catch (error) {
        console.error('Error opening browser:', error);
        // Fallback para window.open se Tauri falhar
        window.open(authUrl, '_blank');
      }
    } else {
      // Em desenvolvimento, usa window.location
      window.location.href = authUrl;
    }
  };

  const logout = () => {
    setUser(null);
    setLicenseKeyState(null);
    localStorage.removeItem('discord_user');
    localStorage.removeItem('discord_token');
    localStorage.removeItem('license_key');
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
