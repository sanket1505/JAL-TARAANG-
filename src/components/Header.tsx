import { motion } from "motion/react";
import { Bell, User, MapPin } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "./LanguageContext";
import { useLocation } from '../contexts/LocationContext';
import { ImageWithFallback } from "./figma/ImageWithFallback";

import logo from "../assets/jal-taraang-logo.png";

const JALTARAANGLogo: string = logo;

interface HeaderProps {
  onNavigate?: (tab: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { t } = useLanguage();
  const { display, isLoading, error } = useLocation();
  return (
    <motion.header
      className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground p-4 sticky top-0 z-50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      {/* Removed 'pt-12' to eliminate the large upper space */}
      <div className="flex items-center justify-between max-w-md mx-auto">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-16 h-16 bg-white/20 rounded-full p-1.5 flex items-center justify-center backdrop-blur-sm overflow-hidden shadow-lg"
            whileHover={{ rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ImageWithFallback
              src={JALTARAANGLogo}
              alt="JALTARAANG Logo"
              className="w-13 h-13 object-contain bg-white rounded-full"
            />
          </motion.div>
          <div>
            <motion.h1
              className="font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white text-[20px]">JAL </span>
              <span className="text-white text-[20px]">TARAANG</span>
            </motion.h1>
            <motion.div
              className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4 flex items-center justify-center">
                  {/* status indicator */}
                  {isLoading ? (
                    <div className="w-3 h-3 rounded-full bg-white/80 animate-pulse" />
                  ) : error ? (
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-md" />
                  ) : (
                    <MapPin className="w-4 h-4 text-white" />
                  )}
                </div>

                <span className="text-white text-xs font-medium text-[12px] text-center truncate max-w-[150px]">
                  {isLoading ? t('detecting') || 'Detecting...' : (display || t('location'))}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="flex gap-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LanguageSelector />
          <motion.button
            onClick={() => onNavigate?.('notifications')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} />
          </motion.button>
          <motion.button
            onClick={() => onNavigate?.('profile')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={20} />
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
}