import { createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';
import i18nData from '../data/i18n.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  const t = (key) => {
    return i18nData[language]?.[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}