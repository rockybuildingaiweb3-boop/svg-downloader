import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, TranslationDictionary } from './types';
import { en } from './en';
import { zhCN } from './zh-CN';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const DICTIONARIES: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  'zh-CN': zhCN,
  fr,
  de,
  ja,
};

const STORAGE_KEY = 'svg_registry_lang';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  format: (template: string, values: Record<string, string | number>) => string;
  availableLanguages: LanguageOption[];
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'zh-CN' || saved === 'fr' || saved === 'de' || saved === 'ja')) {
        return saved as SupportedLanguage;
      }
    } catch {
      // ignore storage errors
    }
    return 'en'; // Strict default: English
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const t = DICTIONARIES[language] || en;

  const format = (template: string, values: Record<string, string | number>): string => {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      return values[key] !== undefined ? String(values[key]) : `{${key}}`;
    });
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        format,
        availableLanguages: AVAILABLE_LANGUAGES,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
