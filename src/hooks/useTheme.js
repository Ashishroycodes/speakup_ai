import { useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'speakup_theme_mode_v1';

export const THEMES = [
  {
    id: 'dark',
    name: 'Midnight Dark',
    icon: 'Moon',
    description: 'Deep obsidian & neon glow. Perfect for late-night practice.',
    previewColor: '#0B0F19',
    accentColor: '#6366F1'
  },
  {
    id: 'light',
    name: 'Daylight Clean',
    icon: 'Sun',
    description: 'Bright, crisp, and high-contrast for daytime focus.',
    previewColor: '#F8FAFC',
    accentColor: '#4F46E5'
  },
  {
    id: 'sepia',
    name: 'Warm Focus',
    icon: 'Coffee',
    description: 'Comfortable amber & warm paper tone to reduce eye strain.',
    previewColor: '#1C1917',
    accentColor: '#D97706'
  },
  {
    id: 'ocean',
    name: 'Ocean Marine',
    icon: 'Compass',
    description: 'Deep sea navy & vibrant cyan accents.',
    previewColor: '#04131F',
    accentColor: '#06B6D4'
  }
];

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
    }
    return 'dark'; // modern dark theme as default
  });

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (e) {
      console.warn('Could not write theme to localStorage', e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Signature AI voice for current theme:
  // dark -> 'onyx', light -> 'alloy', sepia -> 'echo', ocean -> 'shimmer'
  const themeVoiceMap = {
    dark: 'onyx',
    light: 'alloy',
    sepia: 'echo',
    ocean: 'shimmer'
  };

  const currentThemeVoice = themeVoiceMap[theme] || 'onyx';

  return {
    theme,
    setTheme,
    toggleTheme,
    themes: THEMES,
    themeVoice: currentThemeVoice,
    isDark: theme === 'dark' || theme === 'sepia' || theme === 'ocean'
  };
}
