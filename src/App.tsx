import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeScreen } from './components/HomeScreen';
import { AssessmentTool } from './components/AssessmentTool';
import { ARTankView } from './components/ARTankView';
import { ARRechargeView } from './components/ARRechargeView';
import { KnowledgeHub } from './components/KnowledgeHub';
import { CostGuidance } from './components/CostGuidance';
import { ArtificialRecharge } from './components/ArtificialRecharge';
import { LanguageProvider } from './components/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import { ChatBotFAB } from './components/ChatBotFAB';
import { AuthPage } from './components/AuthPage';
import { ProfilePage } from './components/ProfilePage';
import { NotificationPage } from './components/NotificationPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';

// --- Firebase Imports ---
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; 

export default function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const [isInitializing, setIsInitializing] = useState(true);

  // --- Auth Listener ---
  useEffect(() => {
    // This listener automatically fires when Firebase login succeeds or fails
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        // If they are on a login-related page, send them to Home.
        if (activeTab === 'auth' || activeTab === 'forgot-password') {
           setActiveTab('home');
        }
      } else {
        // User is signed out.
        // Force them back to the Auth page.
        setActiveTab('auth');
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const renderActiveComponent = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
    };

    const pageTransition = {
      type: "tween",
      ease: "anticipate",
      duration: 0.4
    };

    const componentProps = {
      initial: "initial",
      animate: "in", 
      exit: "out",
      variants: pageVariants,
      transition: pageTransition,
      className: "w-full"
    };

    switch (activeTab) {
      case 'auth':
        return <motion.div {...componentProps}><AuthPage onNavigate={setActiveTab} /></motion.div>;
      
      case 'forgot-password':
        return <motion.div {...componentProps}><ForgotPasswordPage onNavigate={setActiveTab} /></motion.div>;

      case 'profile':
        return <motion.div {...componentProps}><ProfilePage onNavigate={setActiveTab} /></motion.div>;
        
      case 'notifications':
        return <motion.div {...componentProps}><NotificationPage onNavigate={setActiveTab} /></motion.div>;
      
      case 'home':
        return <motion.div {...componentProps}><HomeScreen onNavigate={setActiveTab} /></motion.div>;
      
      case 'assess':
        // FIX: Passed onNavigate={setActiveTab} so the AR button works
        return <motion.div {...componentProps}><AssessmentTool onNavigate={setActiveTab} /></motion.div>;
      
      case 'ar':
        return <motion.div {...componentProps}><ARTankView /></motion.div>;
      
      case 'knowledge':
        return <motion.div {...componentProps}><KnowledgeHub /></motion.div>;
      
      case 'cost':
        return <motion.div {...componentProps}><CostGuidance /></motion.div>;
      
      case 'artificialRecharge':
        return <motion.div {...componentProps}><ArtificialRecharge /></motion.div>;
      
      case 'arRecharge':
        return <motion.div {...componentProps}><ARRechargeView /></motion.div>;
      
      default:
        return <motion.div {...componentProps}><HomeScreen onNavigate={setActiveTab} /></motion.div>;
    }
  };

  const isAuthPage = activeTab === 'auth' || activeTab === 'forgot-password';

  // --- Loading Screen ---
  if (isInitializing) {
     return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center flex-col gap-4">
           <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
           <p className="text-orange-800 font-medium animate-pulse">Loading Jal Taraang...</p>
        </div>
     );
  }

  return (
    <LanguageProvider>
      <LocationProvider>
      <div className="min-h-screen bg-background text-foreground">
        {!isAuthPage && <Header onNavigate={setActiveTab} />}
        
        <main className={!isAuthPage ? "pb-20" : ""}>
          <AnimatePresence mode="wait">
            {renderActiveComponent()}
          </AnimatePresence>
        </main>

        {!isAuthPage && <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />}
        {!isAuthPage && <ChatBotFAB currentTab={activeTab} />}
      </div>
      </LocationProvider>
    </LanguageProvider>
  );
}