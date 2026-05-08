'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Language } from '@/types';

type LanguageContextType = {
  languages: Language[];
  refreshLanguages: () => Promise<void>;
};

const defaultLanguages: Language[] = [
  { id: '1', name: 'English', slug: 'english', flag: '🇬🇧', is_active: true, sort_order: 1, created_at: new Date().toISOString() },
  { id: '2', name: 'বাংলা', slug: 'bangla', flag: '🇧🇩', is_active: true, sort_order: 2, created_at: new Date().toISOString() },
  { id: '3', name: 'Hindi', slug: 'hindi', flag: '🇮🇳', is_active: true, sort_order: 3, created_at: new Date().toISOString() },
  { id: '4', name: 'Anime', slug: 'anime', flag: '🎌', is_active: true, sort_order: 4, created_at: new Date().toISOString() },
];

const LanguageContext = createContext<LanguageContextType>({ 
  languages: defaultLanguages,
  refreshLanguages: async () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [languages, setLanguages] = useState<Language[]>([]);

  const fetchLanguages = async (forceRefresh = false) => {
    try {
      const url = forceRefresh ? '/api/languages?t=' + Date.now() : '/api/languages';
      const r = await fetch(url, forceRefresh ? { cache: 'no-store' } : undefined);
      if (r.ok) {
        const data = await r.json();
        setLanguages(data);
      } else {
        setLanguages(defaultLanguages);
      }
    } catch (e) {
      setLanguages(defaultLanguages);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const refreshLanguages = async () => {
    await fetchLanguages(true);
  };

  return (
    <LanguageContext.Provider value={{ languages: languages.length > 0 ? languages : defaultLanguages, refreshLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguages = () => useContext(LanguageContext);
