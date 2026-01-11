import { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  // We use string type here to allow any key
  t: (key: string) => string;
  getCurrentLanguageConfig: () => LanguageConfig;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Use the standard hook from i18next
  const { t, i18n } = useTranslation();

  const setLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };

  // Extract the current language code safely (e.g., 'en-US' becomes 'en')
  const currentLanguage = (i18n.language?.split('-')[0] as Language) || 'en';

  const getCurrentLanguageConfig = (): LanguageConfig => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t, // This is now the powerful i18next translation function
      getCurrentLanguageConfig
    }}>
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