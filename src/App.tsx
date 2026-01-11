import { useState } from 'react';
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

export default function App() {
  // Initialize state based on localStorage
  const [activeTab, setActiveTab] = useState(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true' ? 'home' : 'auth';
  });

  // Handler to logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail'); // Clear email on logout
    setActiveTab('auth');
  };

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
        return <motion.div {...componentProps}><ProfilePage onNavigate={(tab) => {
          if (tab === 'auth') handleLogout(); 
          else setActiveTab(tab);
        }} /></motion.div>;
      case 'notifications':
        return <motion.div {...componentProps}><NotificationPage onNavigate={setActiveTab} /></motion.div>;
      case 'home':
        return <motion.div {...componentProps}><HomeScreen onNavigate={setActiveTab} /></motion.div>;
      case 'assess':
        return <motion.div {...componentProps}><AssessmentTool /></motion.div>;
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

  // Determine if we are on an authentication-related page to hide layout elements
  const isAuthPage = activeTab === 'auth' || activeTab === 'forgot-password';

  return (
    <LanguageProvider>
      <LocationProvider>
      <div className="min-h-screen bg-background text-foreground">
        {!isAuthPage && <Header onNavigate={setActiveTab} />}
        
        {/* Mobile-optimized container */}
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