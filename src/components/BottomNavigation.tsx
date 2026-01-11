import { motion } from 'motion/react';
import { Home, Calculator, Lightbulb, Book, IndianRupee } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'assess', icon: Calculator, label: t('assess') },
    { id: 'ar', icon: Lightbulb, label: t('arView') },
    { id: 'knowledge', icon: Book, label: t('learn') },
    { id: 'cost', icon: IndianRupee, label: t('cost') }
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex justify-around py-2 relative">
          {tabs.map(({ id, icon: Icon, label }, index) => (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-all duration-300 relative ${
                activeTab === id 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Top orange indicator line */}
              {activeTab === id && (
                <motion.div
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                  layoutId="activeIndicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                />
              )}
              
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}