import React, { createContext, useContext, useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-opener';
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
  const REDIRECT_URI = 'synapse://callback';

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

    // Listen for deep link callback from OAuth
    const unlisten = listen<string>('deep-link', async (event) => {
      const url = event.payload;

      // Parse the URL to extract the access token
      // Format: synapse://callback#access_token=xxx&token_type=Bearer&expires_in=604800&scope=identify+email
      try {
        const urlObj = new URL(url);
        const fragment = urlObj.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');

        if (accessToken) {
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
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    });

    // Cleanup listener on unmount
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const login = async () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=identify%20email`;

    // Open the OAuth URL in the default browser
    await open(authUrl);
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
