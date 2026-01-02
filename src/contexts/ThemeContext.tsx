import { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'zinc' | 'blue' | 'purple' | 'green' | 'orange' | 'red';

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
  zinc: {
    light: '0 0% 9%',
    dark: '0 0% 98%'
  },
  blue: {
    light: '221 83% 53%',
    dark: '217 91% 60%'
  },
  purple: {
    light: '262 83% 58%',
    dark: '263 70% 65%'
  },
  green: {
    light: '142 71% 45%',
    dark: '142 76% 36%'
  },
  orange: {
    light: '25 95% 53%',
    dark: '20 91% 60%'
  },
  red: {
    light: '0 72% 51%',
    dark: '0 72% 51%'
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
    return (saved as AccentColor) || 'zinc';
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
