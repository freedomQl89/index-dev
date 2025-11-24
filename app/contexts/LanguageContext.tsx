'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { translations } from '@/app/i18n/translations';

type Language = 'zh-CN' | 'zh-TW' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  // 从 URL 参数获取当前语言
  const language = (params?.lang as Language) || 'zh-CN';

  useEffect(() => {
    document.documentElement.lang = language;

    document.cookie = `NEXT_LOCALE=${language}; path=/; max-age=31536000`;
  }, [language]);

  const setLanguage = (lang: Language) => {
    const currentPath = pathname.replace(/^\/(zh-CN|zh-TW|en)/, '') || '/';

    router.push(`/${lang}${currentPath}`);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh-CN']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

