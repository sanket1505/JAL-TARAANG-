import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, Check } from 'lucide-react';
import { useLanguage, languages, type Language } from './LanguageContext';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage, getCurrentLanguageConfig } = useLanguage();
  const currentConfig = getCurrentLanguageConfig();

  const handleLanguageSelect = (languageCode: Language) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        className="p-2 hover:bg-white/10 rounded-full transition-colors relative flex items-center gap-1"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ 
            rotate: isOpen ? 180 : 0
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          <Languages size={20} />
        </motion.div>
        <motion.span 
          className="text-xs font-medium hidden sm:block"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ delay: 0.2 }}
        >
          {currentConfig.code.toUpperCase()}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-border z-50 min-w-48 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    className={`w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-center justify-between ${
                      currentLanguage === language.code ? 'bg-accent/30' : ''
                    }`}
                    onClick={() => handleLanguageSelect(language.code)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.span 
                        className="text-lg"
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {language.flag}
                      </motion.span>
                      <div>
                        <div className="font-medium text-foreground">
                          {language.nativeName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language.name}
                        </div>
                      </div>
                    </div>
                    
                    {currentLanguage === language.code && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Check size={16} className="text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Language info footer */}
              <motion.div 
                className="px-4 py-2 bg-muted/30 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-muted-foreground text-center">
                  Change language anytime
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}