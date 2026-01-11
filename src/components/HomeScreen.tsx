import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Droplets, Home, TrendingUp, Users, Calculator, Zap, FileText, IndianRupee, CloudRain, Award, Lightbulb, Waves } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { t } = useLanguage();
  const [waterLevel, setWaterLevel] = useState(0);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWaterLevel(2400), 300);
    const progressTimer = setTimeout(() => setProgressValue(28), 600);
    return () => {
      clearTimeout(timer);
      clearTimeout(progressTimer);
    };
  }, []);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      className="p-4 space-y-4 max-w-md mx-auto pb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Stats */}
      <motion.div className="grid grid-cols-2 gap-3" variants={itemVariants}>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full bg-white rounded-xl">
          <CardContent className="p-4 text-center flex flex-col items-center justify-center min-h-[130px]">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <motion.div className="text-2xl font-bold mb-1" animate={{ color: ["#3b82f6", "#06b6d4", "#3b82f6"] }} transition={{ duration: 3, repeat: Infinity }}>
              {waterLevel.toLocaleString()}L
            </motion.div>
            <div className="text-[11px] text-gray-500 leading-tight">{t('annualPotential')}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full bg-white rounded-xl">
          <CardContent className="p-4 text-center flex flex-col items-center justify-center min-h-[130px]">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">₹15,000</div>
            <div className="text-[11px] text-gray-500 leading-tight">{t('estSavings')}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="flex items-center gap-2 text-[18px]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              {t('quickActions')}
            </CardTitle>
            <CardDescription className="text-[13px] text-gray-500 pt-1">
              {/* Note: You can add 'getStarted' to i18n.ts if you want this translated too */}
              Get started with rainwater harvesting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-5 px-5">
            <Button onClick={() => onNavigate('assess')} className="w-full h-12 bg-gradient-to-r from-[#FF9933] to-orange-500 text-white shadow-sm rounded-lg text-[14px] font-medium">
              <Calculator className="w-4 h-4 mr-2" />
              {t('calculatePotential')}
            </Button>
            <Button onClick={() => onNavigate('ar')} variant="outline" className="w-full h-12 border-gray-200 text-gray-700 rounded-lg text-[14px] font-medium">
              <Lightbulb className="w-4 h-4 mr-2" />
              {t('visualizeTank')}
            </Button>
            <Button onClick={() => onNavigate('cost')} variant="outline" className="w-full h-12 border-gray-200 text-gray-700 rounded-lg text-[14px] font-medium">
              <Users className="w-4 h-4 mr-2" />
              {t('findContractors')}
            </Button>
            <Button onClick={() => onNavigate('artificialRecharge')} variant="outline" className="w-full h-12 border-gray-200 text-gray-700 rounded-lg text-[14px] font-medium">
              <Waves className="w-4 h-4 mr-2" />
              {t('artificialRecharge')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Updates - NOW FULLY TRANSLATED */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t('recentUpdates')}
            </CardTitle>
            <CardDescription>{t('latestNews')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            
            {/* Item 1 */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
              <div className="flex-shrink-0 mt-1"><IndianRupee className="w-5 h-5 text-green-600" /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium leading-tight">{t('subsidyTitle')}</p>
                  <Badge className="bg-green-100 text-green-700 text-xs ml-2">New</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{t('subsidyDesc')}</p>
                <p className="text-xs text-muted-foreground">Dec 15, 2024</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
              <div className="flex-shrink-0 mt-1"><CloudRain className="w-5 h-5 text-blue-600" /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium leading-tight">{t('monsoonTitle')}</p>
                  <Badge className="bg-blue-100 text-blue-700 text-xs ml-2">Weather</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{t('monsoonDesc')}</p>
                <p className="text-xs text-muted-foreground">Dec 10, 2024</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
              <div className="flex-shrink-0 mt-1"><Award className="w-5 h-5 text-amber-600" /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium leading-tight">{t('standardsTitle')}</p>
                  <Badge className="bg-amber-100 text-amber-700 text-xs ml-2">Policy</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{t('standardsDesc')}</p>
                <p className="text-xs text-muted-foreground">Nov 28, 2024</p>
              </div>
            </div>

          </CardContent>
        </Card>
      </motion.div>

      {/* Community Impact - TRANSLATED */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>{t('communityImpact')}</CardTitle>
            <CardDescription>Your neighborhood's water conservation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('activeSystems')}</span>
                <span className="font-semibold">234/850 homes</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('impactMessage')}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}