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
    // 1. Persisted user selection
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'zh-CN' || saved === 'fr' || saved === 'de' || saved === 'ja')) {
        return saved as SupportedLanguage;
      }
    } catch {}

    // 2. Explicit URL locale if supported
    try {
      if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang') || params.get('locale');
        if (urlLang) {
          const clean = urlLang.toLowerCase();
          if (clean === 'en') return 'en';
          if (clean === 'zh' || clean === 'zh-cn' || clean === 'zh_cn') return 'zh-CN';
          if (clean === 'fr') return 'fr';
          if (clean === 'de') return 'de';
          if (clean === 'ja') return 'ja';
        }
      }
    } catch {}

    // 3. Browser language
    try {
      if (typeof navigator !== 'undefined' && navigator.language) {
        const nav = navigator.language.toLowerCase();
        if (nav.startsWith('zh')) return 'zh-CN';
        if (nav.startsWith('fr')) return 'fr';
        if (nav.startsWith('de')) return 'de';
        if (nav.startsWith('ja')) return 'ja';
      }
    } catch {}

    // 4. Default: English
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {}
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
