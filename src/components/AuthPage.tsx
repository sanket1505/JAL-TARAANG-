import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import jalTaraangLogo from "../assets/jal-taraang-logo.png";

// --- Firebase Imports ---
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  appleProvider, 
  db 
} from "../firebase";

// =========================================================
// UI COMPONENT: Floating Label Input
// =========================================================
const FloatingLabelInput = ({
  id,
  label,
  icon: Icon,
  type = "text",
  onChange,
  ...props
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative group mb-4">
      <div
        className={`absolute left-3 transition-colors duration-200 ${
          isFocused ? "text-orange-600" : "text-orange-900/40"
        }`}
        style={{ top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 10 }}
      >
        <Icon size={18} />
      </div>

      <input
        id={id}
        type={type}
        className={`w-full pl-10 h-12 bg-white/70 border border-orange-200 rounded-xl focus:bg-white transition-all duration-300 pt-1 pb-1 text-base shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-orange-900 ${props.className}`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          if (onChange) onChange(e);
        }}
        {...props}
      />

      <label
        htmlFor={id}
        className={`pointer-events-none absolute transition-all duration-200 ${
          isFloating
            ? "text-[11px] text-orange-600 font-bold uppercase tracking-wider rounded"
            : "text-base text-orange-900/50"
        }`}
        style={{
          top: isFloating ? "-10px" : "50%",
          left: isFloating ? "12px" : "40px", 
          transform: isFloating ? "none" : "translateY(-50%)",
          backgroundColor: isFloating ? "rgba(255,255,255,0.9)" : "transparent",
          padding: isFloating ? "0 4px" : "0",
          zIndex: 20
        }}
      >
        {label}
      </label>
    </div>
  );
};

// =========================================================
// MAIN PAGE COMPONENT
// =========================================================
export function AuthPage({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Helper: Create User Document in Firestore ---
  const createUserDocument = async (user: any, name: string) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: name || user.displayName || "Water Warrior",
          email: user.email,
          createdAt: new Date().toISOString(),
          waterSaved: "0 L",
          impactScore: "0"
        });
      }
    } catch (e) {
      console.error("Error creating user document:", e);
    }
  };

  // --- Handlers for Social Login ---
  const handleSocialLogin = async (provider: any) => {
    try {
      setIsLoading(true);
      // FIXED: Added space between const and result
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user, user.displayName || "");
      // Note: We don't manually call onNavigate('home') here because
      // App.tsx detects the auth state change automatically.
    } catch (error: any) {
      console.error("Social Login Error:", error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("An account already exists with this email using a different sign-in method.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Ignore this error, user just closed the window
      } else {
        alert(`Login failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          setIsLoading(false);
          return;
        }

        // Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create Firestore Document
        await createUserDocument(userCredential.user, fullName);

      } else {
        // Login Existing User
        await signInWithEmailAndPassword(auth, email, password);
      }
      
    } catch (error: any) {
      console.error("Auth Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-orange-50">
      
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-orange-300/60 rounded-full blur-[60px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-red-300/60 rounded-full blur-[60px]"
        />
        <motion.div
           animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[40%] w-[200px] h-[200px] bg-orange-200/60 rounded-full blur-[60px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/60 backdrop-blur-xl border border-white/90 shadow-[0_10px_40px_rgba(234,88,12,0.15)] rounded-[30px] overflow-hidden">
          
          {/* Header */}
          <div className="pt-12 pb-6 px-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-500/20 border-[4px] border-white overflow-hidden p-3">
               <img src={jalTaraangLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight text-orange-900">JAL TARAANG</h1>
            <p className="text-sm opacity-70 font-medium text-orange-800">Water Conservation Made Smart</p>
          </div>

          {/* Tab Switcher */}
          <div className="mb-6 px-8">
            <div className="relative flex w-full rounded-full bg-white p-1 shadow-inner border border-gray-100">
              <div
                className="absolute rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-md transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                style={{
                    top: '4px', bottom: '4px', width: "calc(50% - 4px)",
                    left: activeTab === "login" ? "4px" : "50%",
                }}
              ></div>
              <button onClick={() => setActiveTab('login')} className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${activeTab === 'login' ? 'text-white' : 'text-gray-500 hover:text-orange-500'}`}>Login</button>
              <button onClick={() => setActiveTab('signup')} className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${activeTab === 'signup' ? 'text-white' : 'text-gray-500 hover:text-orange-500'}`}>Sign Up</button>
            </div>
          </div>

          <div className="px-8 pb-10 min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                >
                  <FloatingLabelInput id="email" label="Email or Phone" icon={Mail} required value={email} onChange={(e:any) => setEmail(e.target.value)} />
                  
                  <div className="relative">
                    <FloatingLabelInput id="password" label="Password" icon={Lock} type={showPassword ? 'text' : 'password'} required value={password} onChange={(e:any) => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-orange-900/40 hover:text-orange-600 transition-colors z-20" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-6 text-xs text-orange-900/60">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-orange-800">
                      <input type="checkbox" className="accent-orange-600 rounded" /> Remember me
                    </label>
                    <button type="button" onClick={() => onNavigate('forgot-password')} className="hover:text-orange-600 transition-colors font-medium">Forgot Password?</button>
                  </div>

                  <Button className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 rounded-xl" type="submit" disabled={isLoading}>
                    {isLoading ? "Signing In..." : 'Sign In'}
                  </Button>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-orange-900/50 mb-4">Or continue with</p>
                    <div className="flex justify-center gap-4">
                      
                      {/* Google Button */}
                      <button type="button" onClick={() => handleSocialLogin(googleProvider)} className="w-14 h-14 rounded-2xl bg-white border border-orange-100 flex items-center justify-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.17c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.47 1.18 4.93l2.85-2.22.81-.56z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </button>

                      {/* Apple Button */}
                      <button type="button" onClick={() => handleSocialLogin(appleProvider)} className="w-14 h-14 rounded-2xl bg-white border border-orange-100 flex items-center justify-center text-black shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.02-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.47-.85.73.07 2.46.3 3.65 2.05-.08.06-2.18 1.28-2.16 3.82.02 3.04 2.68 4.09 2.81 4.14-.02.1-.43 1.5-1.45 2.97l-.4.1zm-4.04-13.6c.55-.65.9-1.55.8-2.45-.82.04-1.83.55-2.42 1.25-.54.61-.99 1.58-.87 2.45.92.08 1.87-.56 2.49-1.25z"/>
                        </svg>
                      </button>

                      {/* Facebook Button */}
                      <button type="button" onClick={() => handleSocialLogin(facebookProvider)} className="w-14 h-14 rounded-2xl bg-white border border-orange-100 flex items-center justify-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                         <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                         </svg>
                      </button>

                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                >
                  <FloatingLabelInput id="name" label="Full Name" icon={User} required value={fullName} onChange={(e:any) => setFullName(e.target.value)} />
                  <FloatingLabelInput id="signup-email" label="Email Address" icon={Mail} type="email" required value={email} onChange={(e:any) => setEmail(e.target.value)} />
                  <FloatingLabelInput id="signup-password" label="Create Password" icon={Lock} type="password" required value={password} onChange={(e:any) => setPassword(e.target.value)} />
                  <FloatingLabelInput id="confirm-password" label="Confirm Password" icon={CheckCircle} type="password" required value={confirmPassword} onChange={(e:any) => setConfirmPassword(e.target.value)} />

                  <div className="mb-6 text-xs text-center text-orange-900/60">
                    By signing up, you agree to our <a href="#" className="font-bold text-orange-700 hover:underline">Terms</a> & <a href="#" className="font-bold text-orange-700 hover:underline">Privacy Policy</a>
                  </div>

                  <Button className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 rounded-xl group" type="submit" disabled={isLoading}>
                     {isLoading ? 'Creating Account...' : (
                       <span className="flex items-center justify-center gap-2">Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></span>
                     )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}