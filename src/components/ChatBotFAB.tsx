import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { ChatBot } from './ChatBot';
import { useLanguage } from './LanguageContext';

interface ChatBotFABProps {
  currentTab: string;
}

export function ChatBotFAB({ currentTab }: ChatBotFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-24 right-4 z-40"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5 
        }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
            isOpen 
              ? 'bg-red-500 text-white' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: isOpen 
              ? '0 8px 32px rgba(239, 68, 68, 0.3)' 
              : '0 8px 32px rgba(249, 115, 22, 0.3)'
          }}
        >
          {/* Background water ripple effect */}
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          {/* Icon with rotation animation */}
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.div>

          {/* Sparkle effects when not open */}
          <AnimatePresence>
            {!isOpen && (
              <>
                <motion.div
                  className="absolute top-2 right-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 1 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Sparkles size={8} className="text-yellow-300" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  className="absolute bottom-1 left-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <motion.div
                    animate={{
                      rotate: [360, 0],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1
                    }}
                  >
                    <Sparkles size={6} className="text-blue-300" />
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Notification dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </motion.button>

        {/* Tooltip */}
      </motion.div>

      {/* ChatBot Component */}
      <ChatBot 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        currentTab={currentTab}
      />
    </>
  );
}