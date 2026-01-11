import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import jalTaraangLogo from "../assets/jal-taraang-logo.png";

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
    <div className="relative group mb-6"> {/* Increased margin-bottom for better spacing */}
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
          zIndex: 20,
        }}
      >
        {label}
      </label>
    </div>
  );
};

export function ForgotPasswordPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-orange-50">
      
      {/* --- Background Animations --- */}
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/60 backdrop-blur-xl border border-white/90 shadow-[0_10px_40px_rgba(234,88,12,0.15)] rounded-[30px] overflow-hidden">
          
          {/* Header Section */}
          <div className="pt-12 pb-4 px-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-500/20 border-[4px] border-white overflow-hidden p-3">
              <img src={jalTaraangLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            
            {!isSent && (
              <>
                <h2 className="text-3xl font-bold text-orange-900 mb-3 tracking-tight">Forgot Password?</h2>
                <p className="text-orange-900/60 text-sm px-4 leading-relaxed font-medium">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </>
            )}
          </div>

          {/* Content Section with more bottom padding */}
          <div className="px-8 pb-12 pt-2">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form onSubmit={handleReset} className="mt-4">
                    <FloatingLabelInput
                      id="reset-email"
                      label="Email Address"
                      icon={Mail}
                      type="email"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      required
                    />

                    <Button
                      className="w-full h-12 mt-4 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 rounded-xl"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending Link..." : "Send Reset Link"}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center pt-2"
                >
                  <div className="w-20 h-20 bg-green-100/50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm backdrop-blur-sm">
                    <CheckCircle size={36} />
                  </div>
                  <h2 className="text-2xl font-bold text-orange-900 mb-3">Check your mail</h2>
                  <p className="text-orange-900/60 text-sm mb-8 leading-relaxed px-4">
                    We have sent password recovery instructions to <br/>
                    <span className="font-bold text-orange-800 bg-orange-100/50 px-2 py-1 rounded mt-1 inline-block">{email}</span>
                  </p>
                  
                  <Button
                    onClick={() => setIsSent(false)}
                    variant="outline"
                    className="w-full h-12 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 font-bold rounded-xl"
                  >
                    Try another email
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to Login Button - Added significant top margin (mt-10) and padding (pt-6) */}
            <div className="mt-10 pt-6 border-t border-orange-900/5 text-center">
              <button
                onClick={() => onNavigate("auth")}
                className="text-sm font-semibold text-orange-700 flex items-center justify-center gap-2 hover:text-orange-900 transition-colors group py-2 px-4 rounded-lg hover:bg-orange-50/50 mx-auto"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}