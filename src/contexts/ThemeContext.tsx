import { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'dark' | 'light';

interface ThemeContextType {
  theme: 'dark' | 'light';
  accentColor: AccentColor;
  animations: boolean;
  notifications: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
  setAnimations: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
}

const accentColors: Record<AccentColor, { light: string; dark: string }> = {
  dark: {
    light: '0 0% 4%',      // Preto profundo para modo claro
    dark: '0 0% 98%'       // Branco para modo escuro
  },
  light: {
    light: '0 0% 98%',     // Branco para modo claro
    dark: '0 0% 4%'        // Preto profundo para modo escuro
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accentColor');
    // Validar se o valor salvo é válido, caso contrário usar 'dark' como padrão
    if (saved === 'dark' || saved === 'light') {
      return saved as AccentColor;
    }
    return 'dark';
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
    const root = window.document.documentElement;
    
    // Validar accentColor antes de usar
    if (accentColor !== 'dark' && accentColor !== 'light') {
      // Se inválido, corrigir e retornar (evita loop)
      setAccentColorState('dark');
      localStorage.setItem('accentColor', 'dark');
      return;
    }
    
    const colors = accentColors[accentColor];

    if (theme === 'dark') {
      root.style.setProperty('--primary', colors.dark);
    } else {
      root.style.setProperty('--primary', colors.light);
    }

    localStorage.setItem('accentColor', accentColor);
  }, [accentColor, theme]);

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

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
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
      accentColor,
      animations,
      notifications,
      setTheme,
      toggleTheme,
      setAccentColor,
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
