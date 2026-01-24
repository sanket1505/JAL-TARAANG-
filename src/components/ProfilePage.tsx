// src/components/ProfilePage.tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Settings, Shield, HelpCircle, LogOut, Award, Droplets, LayoutDashboard, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useLocation } from "../contexts/LocationContext";
import { useLanguage } from "./LanguageContext";

// Firebase
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function ProfilePage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { t } = useLanguage();
  const { display: liveLocation, isLoading: isLocationLoading } = useLocation();
  const [userInfo, setUserInfo] = useState({ 
    name: "Loading...", 
    email: "...", 
    initials: "..", 
    location: "Detecting..." 
  });
  const [stats, setStats] = useState([
    { label: t('waterSaved'), value: "...", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t('impactScore'), value: "...", icon: Award, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: t('installations'), value: "0", icon: LayoutDashboard, color: "text-green-500", bg: "bg-green-500/10" },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo({
            name: data.name || "User",
            email: data.email || auth.currentUser.email || "",
            initials: (data.name || "U").charAt(0).toUpperCase(),
            location: liveLocation || "India"
          });
          
          setStats([
            { label: t('waterSaved'), value: data.waterSaved || "0 L", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: t('impactScore'), value: data.impactScore || "0", icon: Award, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: t('installations'), value: "0", icon: LayoutDashboard, color: "text-green-500", bg: "bg-green-500/10" },
          ]);
        }
      }
    };
    fetchUserData();
  }, [liveLocation, t]);

  const handleLogout = async () => {
    await signOut(auth);
    onNavigate('auth');
  };

  const menuItems = [
    { label: t('accountSettings'), icon: Settings, desc: "Manage your account details" },
    { label: t('privacySecurity'), icon: Shield, desc: "Control your data & permissions" },
    { label: t('helpSupport'), icon: HelpCircle, desc: "FAQs and customer support" },
  ];

  // ... (JSX similar to previous, using updated userInfo and handleLogout) ...
  return (
    <div className="min-h-[90vh] pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 to-orange-50/50">
      <div className="max-w-md mx-auto p-4 relative z-10 space-y-6">
        <motion.div className="text-center space-y-4 pt-4">
          <div className="relative inline-block">
             <Avatar className="w-28 h-28 border-4 border-white shadow-inner">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-3xl">{userInfo.initials}</AvatarFallback>
             </Avatar>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{userInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{userInfo.email}</p>
            <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm mt-1">
              <MapPin size={14} className={isLocationLoading ? "animate-pulse" : ""} /> 
              {isLocationLoading ? t('detecting') : (liveLocation || userInfo.location)}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
             <motion.div key={i}>
              <Card className="border-white/40 bg-white/60 backdrop-blur-md shadow-sm p-3 h-full flex flex-col items-center justify-center gap-2">
                <div className={`p-2 rounded-full ${stat.bg} ${stat.color}`}><stat.icon size={20} /></div>
                <div>
                  <div className="font-bold text-lg leading-none">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">{stat.label}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div className="space-y-3">
          <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y divide-black/5">
              {menuItems.map((item, i) => (
                <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-white/50 transition-colors text-left group">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><item.icon size={20} /></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <Button variant="ghost" className="w-full text-red-500 gap-2 h-12" onClick={handleLogout}>
            <LogOut size={18} /> {t('signOut')}
        </Button>
      </div>
    </div>
  );
}