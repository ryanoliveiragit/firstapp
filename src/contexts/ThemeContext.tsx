import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light';
  animations: boolean;
  notifications: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setAnimations: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [animations, setAnimationsState] = useState(() => {
    const saved = localStorage.getItem('animations');
    return saved !== null ? saved === 'true' : true;
  });

  const [notifications, setNotificationsState] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('animations', String(animations));
    const root = window.document.documentElement;
    if (animations) {
      root.classList.remove('no-animations');
    } else {
      root.classList.add('no-animations');
    }
  }, [animations]);

  useEffect(() => {
    localStorage.setItem('notifications', String(notifications));
  }, [notifications]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setAnimations = (enabled: boolean) => {
    setAnimationsState(enabled);
  };

  const setNotifications = (enabled: boolean) => {
    setNotificationsState(enabled);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      animations,
      notifications,
      setTheme,
      toggleTheme,
      setAnimations,
      setNotifications
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
