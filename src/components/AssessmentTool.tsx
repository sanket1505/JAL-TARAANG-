import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  MapPin,
  Droplets,
  Calculator,
  CheckCircle,
  Satellite,
  Map,
  ArrowRight,
  ArrowLeft,
  CloudRain
} from "lucide-react";
import { Badge } from "./ui/badge";
import { TankRecommendationForm, TankRecommendationFormData } from "./TankRecommendationForm";
import { TankRecommendationResult, TankRecommendationData } from "./TankRecommendationResult";
import { toast } from "sonner";
import * as turf from '@turf/turf';
import { useLanguage } from "./LanguageContext";

interface AssessmentToolProps {
  onNavigate?: (tab: string) => void;
}

export function AssessmentTool({ onNavigate }: AssessmentToolProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"calculator" | "form" | "result">("calculator");
  
  // Calculator Data
  const [calculatorData, setCalculatorData] = useState({
    length: "",
    width: "",
    roofType: "",
    location: "",
    rainfall: "",
  });

  // User Personal/Form Data
  const [userFormData, setUserFormData] = useState<TankRecommendationFormData | null>(null);

  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [gisMode, setGisMode] = useState(false);
  const [imdSynced, setImdSynced] = useState(false);
  const [recommendation, setRecommendation] = useState<TankRecommendationData | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  // --- AUTO-DETECT LOGIC ---
  useEffect(() => {
    if (!calculatorData.location) {
      handleAutoDetect();
    }
  }, []);

  useEffect(() => {
    if (result !== null && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [result]);

  const handleAutoDetect = async () => {
    setLocating(true);
    
    // Fallback if GPS fails
    const fetchIPFallback = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city) {
          const loc = `${data.city}, ${data.region}`;
          fetchRealRainfall(data.latitude, data.longitude, loc, data.region);
        }
      } catch (e) { setLocating(false); }
    };

    if (!navigator.geolocation) { await fetchIPFallback(); return; }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // 1. TRIGGER AUTOMATIC GIS MEASURE
        openGISMapping(latitude, longitude);

        // 2. Fetch Location Name & Rainfall
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            const city = data.address.city || data.address.town || "Unknown";
            const state = data.address.state || "";
            fetchRealRainfall(latitude, longitude, `${city}, ${state}`, state);
          })
          .catch(() => fetchRealRainfall(latitude, longitude, "GPS Detected", ""));
      },
      (error) => { fetchIPFallback(); },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const fetchRealRainfall = async (lat: number, lon: number, locName: string, state: string) => {
    try {
      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=2024-01-01&end_date=2024-12-31&daily=rain_sum&timezone=auto`
      );
      const data = await response.json();
      if (data.daily && data.daily.rain_sum) {
        const totalRainfall = data.daily.rain_sum.reduce((acc: number, curr: number) => acc + (curr || 0), 0);
        const roundedRainfall = Math.round(totalRainfall).toString();
        setCalculatorData(prev => ({ ...prev, location: locName, rainfall: roundedRainfall }));
        setImdSynced(true);
        toast.success(`Synced precise rainfall for ${locName}`);
      } else {
        throw new Error("No rainfall data found");
      }
    } catch (error) {
      let rainfallValue = "850";
      if (state.includes("Maharashtra")) rainfallValue = "1200";
      else if (state.includes("Rajasthan") || state.includes("Gujarat")) rainfallValue = "550";
      else if (state.includes("Kerala") || state.includes("Karnataka")) rainfallValue = "2800";
      setCalculatorData(prev => ({ ...prev, location: locName, rainfall: rainfallValue }));
      setImdSynced(false);
    } finally {
      setLocating(false);
    }
  };

  const calculatePotential = () => {
    setLoading(true);
    setTimeout(() => {
      const lengthFt = parseFloat(calculatorData.length);
      const widthFt = parseFloat(calculatorData.width);
      const lengthM = lengthFt * 0.3048;
      const widthM = widthFt * 0.3048;
      const areaSqm = lengthM * widthM;
      const efficiency = calculatorData.roofType === "concrete" ? 0.9 : calculatorData.roofType === "tile" ? 0.8 : 0.7;
      const rainfall = parseFloat(calculatorData.rainfall) || 850;
      const potential = Math.round(areaSqm * rainfall * efficiency);
      setResult(potential);
      setLoading(false);
    }, 1500);
  };

  const handleFormSubmit = (data: TankRecommendationFormData) => {
    if (result === null) return;
    
    setUserFormData(data);

    const dailyUsage = parseInt(data.familyMembers) * parseInt(data.dailyConsumption);
    const annualDemand = dailyUsage * 365;
    let idealCapacity = dailyUsage * 20; 
    if (data.budget === "10000-25000") idealCapacity = Math.min(idealCapacity, 5000);
    else if (data.budget === "25000-50000") idealCapacity = Math.min(idealCapacity, 10000);
    const standardSizes = [1000, 2000, 3000, 5000, 10000, 15000, 20000];
    const recommendedCapacity = standardSizes.reduce((prev, curr) => Math.abs(curr - idealCapacity) < Math.abs(prev - idealCapacity) ? curr : prev);
    let type = "Plastic Overhead Tank";
    if (data.preferredTankType !== "unsure") {
        type = data.preferredTankType === "underground" ? "Underground RCC Tank" : data.preferredTankType === "overhead" ? "Plastic Overhead Tank" : "Modular Recharge Pit";
    }
    const baseCost = recommendedCapacity * (type.includes("RCC") ? 14 : type.includes("Modular") ? 10 : 6);
    const minCost = Math.round(baseCost * 0.9);
    const maxCost = Math.round(baseCost * 1.1);
    const waterSaved = Math.min(result, annualDemand);
    
    const recData: TankRecommendationData = {
      capacity: recommendedCapacity, 
      type: type, 
      costEstimate: `₹${minCost.toLocaleString()} – ₹${maxCost.toLocaleString()}`,
      paybackPeriod: `${(baseCost / (waterSaved * 0.05)).toFixed(1)} years`, 
      waterSaved, 
      coverageDays: Math.round(recommendedCapacity / dailyUsage),
      utilization: Math.round((waterSaved / result) * 100), 
      dependencyReduction: Math.min(Math.round((waterSaved / annualDemand) * 100), 100)
    };

    setRecommendation(recData);

    if (navigator.onLine) {
      const webhookUrl = 'https://hook.eu1.make.com/v1ikjtjljyhs1hzmxy6hgmgxm3puwdp6';
      const payload = {
        customer: { 
          name: data.fullName, 
          email: data.email, 
          contact: data.mobile.startsWith('91') ? data.mobile : `91${data.mobile}`,
          type: data.propertyType,
          members: data.familyMembers        
      },
        
        site_details: {
          location: calculatorData.location,
          roof_area_sqft: (parseFloat(calculatorData.length) * parseFloat(calculatorData.width)),
          annual_rainfall_mm: parseInt(calculatorData.rainfall),
          rwh_potential_litres: result
        },
        recommendation: {
          tank_size_litres: recommendedCapacity,
          tank_type: type,
          water_autonomy_days: recData.coverageDays,
          water_saved_litres: waterSaved
        },
        financials: {
          est_system_cost_min: minCost,
          est_system_cost_max: maxCost,
          tanker_reduction_percent: recData.dependencyReduction,
          payback_years: parseFloat(recData.paybackPeriod)
        }
      };

      try {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(response => {
          if (response.ok) {
            toast.success("Generating your custom report and sending it to your email!");
          }
        });
      } catch (error) {
        console.error("Automation error:", error);
      }
    } else {
      toast.error("Offline: Local report generated, but email delivery skipped.");
    }

    setStep("result");
  };

  const openGISMapping = async (lat?: number, lon?: number) => {
    setGisMode(true);
    
    try {
      let latitude = lat;
      let longitude = lon;

      if (!latitude || !longitude) {
        const getCoords = () => new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        const pos = await getCoords();
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }

      const query = `
        [out:json];
        (
          way["building"](around:30, ${latitude}, ${longitude});
        );
        out geom;
      `;
      
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error("Overpass API is busy. Please try again.");

      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        const building = data.elements[0];
        const coordinates = building.geometry.map((p: any) => [p.lon, p.lat]);
        if (coordinates[0][0] !== coordinates[coordinates.length - 1][0]) {
          coordinates.push(coordinates[0]);
        }

        const polygon = turf.polygon([coordinates]);
        const areaM2 = turf.area(polygon); 
        const totalAreaFt2 = areaM2 * 10.7639;
        const estimatedWidth = Math.sqrt(totalAreaFt2 / 1.5);
        const estimatedLength = estimatedWidth * 1.5;

        setCalculatorData(prev => ({
          ...prev,
          length: Math.round(estimatedLength).toString(),
          width: Math.round(estimatedWidth).toString(),
          location: prev.location || "Verified Building (GIS)"
        }));

        toast.success("Satellite measurement complete! Roof area detected.");
      } else {
        if (!lat) throw new Error("No building footprint found at your current location.");
        console.log("Auto GIS: No building found nearby.");
      }
    } catch (error: any) {
      console.error("GIS Error:", error);
      if (!lat) toast.error(error.message || "Failed to retrieve building data");
    } finally {
      setGisMode(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } }, exit: { opacity: 0 } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } } };

  return (
    <div className="max-w-md mx-auto relative min-h-[600px] pb-24">
      {step !== "calculator" && (
        <Button variant="ghost" size="sm" onClick={() => setStep(step === "result" ? "form" : "calculator")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('startOver')}
        </Button>
      )}

      <AnimatePresence mode="wait">
        {step === "calculator" && (
          <motion.div key="calculator" className="p-4 space-y-6" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    {t('rwhCalculator')}
                  </CardTitle>
                  <CardDescription>{t('officialData')}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{t('rooftopDims')}</span>
                    <Button onClick={() => openGISMapping()} variant="outline" size="sm" disabled={gisMode} className="border-primary/30 text-primary h-8 text-xs">
                      {gisMode ? <Satellite className="w-3 h-3 animate-spin mr-1" /> : <Map className="w-3 h-3 mr-1" />}
                      {gisMode ? t('scanning') : t('gisMeasure')}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('lengthFt')}</Label>
                      <Input type="number" placeholder="40" value={calculatorData.length} onChange={(e) => setCalculatorData({...calculatorData, length: e.target.value})} disabled={gisMode} className={gisMode?"animate-pulse":""}/>
                    </div>
                    <div>
                      <Label>{t('widthFt')}</Label>
                      <Input type="number" placeholder="30" value={calculatorData.width} onChange={(e) => setCalculatorData({...calculatorData, width: e.target.value})} disabled={gisMode} className={gisMode?"animate-pulse":""}/>
                    </div>
                  </div>
                  <div>
                    <Label>{t('roofType')}</Label>
                    <Select onValueChange={(v)=>setCalculatorData({...calculatorData, roofType: v})}>
                      <SelectTrigger disabled={gisMode}><SelectValue placeholder={t('selectRoof')}/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete">{t('concrete')}</SelectItem>
                        <SelectItem value="tile">{t('tiles')}</SelectItem>
                        <SelectItem value="metal">{t('metal')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{t('locationRainfall')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t('location')}</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder={locating ? t('detecting') : t('autoDetecting')} 
                        value={calculatorData.location} 
                        onChange={(e)=>setCalculatorData({...calculatorData, location: e.target.value})}
                        className={imdSynced ? "text-green-700 font-medium" : ""}
                      />
                      <Button onClick={handleAutoDetect} variant="outline" size="icon" disabled={locating}>
                        {locating ? <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"/> : <MapPin className="w-4 h-4"/>}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>{t('annualRainfall')}</Label>
                      {imdSynced && <Badge variant="outline" className="text-green-600 border-green-200 text-xs gap-1"><CheckCircle className="w-3 h-3"/> {imdSynced ? t('verifiedData') : t('regionalData')}</Badge>}
                    </div>
                    <div className="flex gap-2 relative">
                      <Input type="number" placeholder="0" value={calculatorData.rainfall} onChange={(e)=>{setCalculatorData({...calculatorData, rainfall: e.target.value}); setImdSynced(false);}}/>
                      {imdSynced && <CloudRain className="absolute right-3 top-2.5 w-4 h-4 text-green-500"/>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
              <Button onClick={calculatePotential} disabled={!calculatorData.length || !calculatorData.width || !calculatorData.roofType || loading} className="w-full bg-primary hover:bg-primary/90 transition-all duration-300">
                {loading ? t('calculating') : <><Droplets className="w-4 h-4 mr-2"/> {t('calculate')}</>}
              </Button>
            </motion.div>

            {result !== null && (
              <motion.div 
                initial={{opacity:0, scale:0.8, y:20}} 
                animate={{opacity:1, scale:1, y:0}} 
                transition={{type:"spring"}}
                ref={resultRef}
              >
                <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow duration-300 mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" /> 
                      {t('yourPotential')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-800 mb-2">{result.toLocaleString()}L</div>
                      <p className="text-green-700">{t('annualCollection')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mt-4">
                      <div className="p-3 bg-white/60 rounded-lg border border-green-100">
                        <div className="text-lg font-semibold text-green-800">₹{Math.round(result * 0.05).toLocaleString()}</div>
                        <div className="text-xs text-green-600">{t('annualSavings')}</div>
                      </div>
                      <div className="p-3 bg-white/60 rounded-lg border border-green-100">
                        <div className="text-lg font-semibold text-green-800">{Math.round(result / 20)} {t('waterSupplyDays')}</div>
                        <div className="text-xs text-green-600">{t('waterSupply')}</div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        onClick={()=>setStep("form")} 
                        className="w-full !bg-green-700 hover:!bg-green-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 py-6 text-lg font-semibold rounded-xl transform hover:-translate-y-1 active:scale-95 border border-green-600"
                        variant="default"
                      >
                        <span className="flex items-center justify-center gap-2">
                           {t('getRecommendation')}
                           <ArrowRight className="w-5 h-5 animate-pulse"/>
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </motion.div>
        )}

        {step === "form" && result !== null && (
          <motion.div key="form" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="p-1">
             <TankRecommendationForm rwhPotential={result} onSubmit={handleFormSubmit} />
          </motion.div>
        )}

        {step === "result" && recommendation && userFormData && (
          <motion.div key="result" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="p-1">
            <TankRecommendationResult 
              data={recommendation} 
              userInput={userFormData}
              calculatorInput={calculatorData}
              rwhPotential={result || 0}
              onViewAR={() => {if(onNavigate) onNavigate('ar'); else toast.info("Opening AR View...");}} 
              onDownloadReport={() => toast.success("Quotation PDF Generated")} 
              onRequestCall={() => toast.success("Request submitted to contractors!")}
            />
            <Button variant="outline" className="w-full mt-6" onClick={() => {setStep("calculator"); setResult(null); setRecommendation(null); setCalculatorData(prev => ({...prev, location: "", rainfall: ""})); setImdSynced(false);}}>{t('startOver')}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}