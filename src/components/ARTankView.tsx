import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// REMOVED invalid import: import tankImage from "figma:asset/..."
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Camera, Maximize2, RotateCcw, Ruler, Info, Droplets, Settings, Gauge, CheckCircle2, ArrowLeft, ArrowRight, Waves, Scan, Hand, Rotate3D } from 'lucide-react';
import { ARRechargeView } from './ARRechargeView';

// ADDED: Missing component definition to prevent crash
const TankVisual = ({ type, isValid }: { type: string, isValid: boolean }) => (
  <div className={`w-32 h-40 rounded-lg border-4 transition-colors duration-300 ${
    isValid ? 'border-green-500' : 'border-red-500'
  } ${
    type === 'rcc' || type === 'ferrocement' ? 'bg-stone-400' : 'bg-blue-500'
  } flex items-center justify-center shadow-xl relative`}>
    <div className="absolute inset-0 bg-white/20 rounded-lg" />
    <div className="absolute top-0 w-full h-4 bg-black/20 rounded-t-lg" />
    <span className="text-white font-bold text-xs relative z-10 uppercase tracking-wider">{type}</span>
  </div>
);

export function ARTankView() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Tank Type, 2: Capacity, 3: AR View
  const [isARActive, setIsARActive] = useState(false);
  const [selectedTankType, setSelectedTankType] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
  const [tankShape, setTankShape] = useState<'circular' | 'rectangular'>('circular');

  // Interaction Cues (Lenskart-style)
  const [showSwipeCue, setShowSwipeCue] = useState(true);
  useEffect(() => {
    // Hide swipe cue after 5 seconds
    const timer = setTimeout(() => setShowSwipeCue(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [waterLevel, setWaterLevel] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  // Use refs to collect raw orientation events and update state at a throttled rate
  const orientationRef = useRef<{ alpha: number | null; beta: number | null; gamma: number | null; dirty: boolean }>({ alpha: null, beta: null, gamma: null, dirty: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isARActive) {
      // Simulate scanning phase
      const scanTimer = setTimeout(() => {
        setIsScanning(false);
      }, 2500);
      return () => clearTimeout(scanTimer);
    }
  }, [isARActive]);

  const tankTypes = [
    { 
      id: 'rcc', 
      name: 'Reinforced Cement Concrete (RCC)', 
      material: 'RCC/Concrete',
      drinkingWater: 'Excellent for drinking water',
      drinkingWaterSafe: true,
      useBestFor: 'Drinking water, long-term storage, underground installation',
      lifespan: '30-50 years',
      costRange: '₹45,000 - ₹1,50,000',
      installation: 'Complex',
      pros: ['Extremely durable', 'Temperature stable', 'No taste/odor', 'Permanent solution'],
      cons: ['High installation cost', 'Requires excavation', 'Professional installation needed'],
      maintenance: 'Low - Annual cleaning only'
    },
    { 
      id: 'plastic', 
      name: 'Plastic (HDPE / PVC Tanks)', 
      material: 'HDPE/PVC',
      drinkingWater: 'Good for drinking water (food-grade plastic)',
      drinkingWaterSafe: true,
      useBestFor: 'Drinking water, household use, easy installation',
      lifespan: '15-25 years',
      costRange: '₹8,000 - ₹50,000',
      installation: 'Easy',
      pros: ['Lightweight', 'UV resistant', 'Multiple sizes', 'Cost effective'],
      cons: ['Temperature sensitive', 'May develop leaks', 'Limited lifespan'],
      maintenance: 'Medium - Regular cleaning required'
    },
    { 
      id: 'ferrocement', 
      name: 'Ferrocement Tanks', 
      material: 'Ferrocement',
      drinkingWater: 'Excellent for drinking water',
      drinkingWaterSafe: true,
      useBestFor: 'Drinking water, custom shapes, medium capacity',
      lifespan: '25-40 years',
      costRange: '₹35,000 - ₹80,000',
      installation: 'Moderate',
      pros: ['Custom shapes possible', 'Good durability', 'No taste/odor', 'Crack resistant'],
      cons: ['Skilled labor needed', 'Initial setup complex', 'Higher maintenance'],
      maintenance: 'Medium - Periodic inspection needed'
    },
    { 
      id: 'metal', 
      name: 'Metal Tanks (GI, Steel)', 
      material: 'Galvanized Iron/Steel',
      drinkingWater: 'Good for drinking water (with proper coating)',
      drinkingWaterSafe: true,
      useBestFor: 'Industrial use, drinking water with treatment, commercial',
      lifespan: '15-30 years',
      costRange: '₹25,000 - ₹1,00,000',
      installation: 'Moderate',
      pros: ['High strength', 'Fire resistant', 'Recyclable', 'Good for large capacity'],
      cons: ['Corrosion risk', 'Heavy', 'May affect water taste', 'Requires coating'],
      maintenance: 'High - Regular coating and rust prevention'
    },
    { 
      id: 'modular', 
      name: 'Modular / Collapsible Tanks', 
      material: 'Textile/Plastic-lined',
      drinkingWater: 'Suitable for drinking water (with proper liner)',
      drinkingWaterSafe: true,
      useBestFor: 'Temporary storage, emergency use, flexible installation',
      lifespan: '5-15 years',
      costRange: '₹12,000 - ₹60,000',
      installation: 'Very Easy',
      pros: ['Portable', 'Quick setup', 'Space efficient when empty', 'Expandable'],
      cons: ['Lower durability', 'Puncture risk', 'Higher per-liter cost'],
      maintenance: 'High - Regular inspection for damages'
    },
    { 
      id: 'earthen', 
      name: 'Earthen / Masonry Tanks', 
      material: 'Clay/Brick/Stone',
      drinkingWater: 'Not recommended for drinking water',
      drinkingWaterSafe: false,
      useBestFor: 'Irrigation, gardening, non-potable uses, traditional systems',
      lifespan: '20-40 years',
      costRange: '₹20,000 - ₹70,000',
      installation: 'Complex',
      pros: ['Natural cooling', 'Eco-friendly', 'Traditional', 'Good for irrigation'],
      cons: ['Not potable water safe', 'Seepage issues', 'Algae growth', 'High maintenance'],
      maintenance: 'High - Regular cleaning and sealing'
    }
  ];

  const capacityOptions = [
    { id: '500', label: '500L - Small Household', dimensions: '1m × 1m × 0.5m', description: 'Good for 1-2 people' },
    { id: '1000', label: '1,000L - Small Family', dimensions: '1.2m × 1.2m × 0.7m', description: 'Good for 2-3 people' },
    { id: '2000', label: '2,000L - Medium Family', dimensions: '1.5m × 1.5m × 0.9m', description: 'Good for 3-4 people' },
    { id: '3000', label: '3,000L - Large Family', dimensions: '1.8m × 1.8m × 0.9m', description: 'Good for 4-5 people' },
    { id: '5000', label: '5,000L - Joint Family', dimensions: '2.2m × 2.2m × 1m', description: 'Good for 6+ people' },
    { id: '10000', label: '10,000L - Community', dimensions: '3m × 3m × 1.1m', description: 'Good for community use' }
  ];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const stepVariants: any = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const stepTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 3) {
        setIsARActive(false);
        stopCamera();
      }
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(null);
    } catch (err: any) {
      console.log("Camera access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError("Camera permission denied.");
      } else {
          setCameraError("Camera not available.");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isARActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isARActive]);

  const [isPlacementValid, setIsPlacementValid] = useState(true);
  const [isPlaced, setIsPlaced] = useState(false);
  const [placementHint, setPlacementHint] = useState('Point the camera at the floor and move slowly');

  // Parallax effect based on device orientation to simulate AR anchoring.
  // On many phones the `deviceorientation` event fires at very high rates; updating React
  // state on every event causes heavy re-renders and visible flicker. We buffer events
  // in a ref and update state via requestAnimationFrame (throttled) to reduce load.
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      // store raw values in ref and mark dirty
      orientationRef.current.alpha = alpha;
      orientationRef.current.beta = beta;
      orientationRef.current.gamma = gamma;
      orientationRef.current.dirty = true;
    };

    const tick = () => {
      if (orientationRef.current.dirty) {
        orientationRef.current.dirty = false;
        const alpha = orientationRef.current.alpha ?? 0;
        const beta = orientationRef.current.beta ?? 0;
        const gamma = orientationRef.current.gamma ?? 0;

        // Update rotation (use a small threshold to avoid micro jitter)
        setRotation(prev => {
          const next = -alpha;
          return Math.abs(next - prev) > 0.25 ? next : prev;
        });

        // Only apply tilt when not placed to keep tank stable after placement
        if (!isPlaced) {
          setTilt(prev => {
            const next = { x: gamma * 0.5, y: (beta - 45) * 0.5 };
            const dx = Math.abs(next.x - prev.x);
            const dy = Math.abs(next.y - prev.y);
            return dx > 0.1 || dy > 0.1 ? next : prev;
          });

          const isValidAngle = beta > 10 && beta < 85;
          setIsPlacementValid(isValidAngle);
        } else {
          // keep it locked when placed
          setTilt({ x: 0, y: 0 });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isARActive) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      // start RAF loop
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isARActive, isPlaced]);

  // IKEA Place style contextual hints
  useEffect(() => {
    if (isScanning) {
      setPlacementHint('Move phone side to side to detect the floor');
      return;
    }
    if (!isPlacementValid) {
      setPlacementHint('Point at a flat, well‑lit surface');
    } else if (!isPlaced) {
      setPlacementHint('Tap to anchor the tank on the detected plane');
    } else {
      setPlacementHint('Walk around to view it in 360°');
    }
  }, [isScanning, isPlacementValid, isPlaced]);

  const handlePlaceTank = () => {
    if (isPlacementValid && !isPlaced) {
        setIsPlaced(true);
        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(200);
        
        // Start water fill animation after a brief delay
        // --- Scale calculation & application ---
        try {
          const cap = getSelectedCapacity();
          const parsed = parseDimensions(cap?.dimensions);
          const desiredWidthMeters = parsed?.width ?? 1.8; // fallback to 1.8m if unknown

          // If a real 3D model is attached to modelRef and contains a bounding-box width in its userData,
          // compute a proper scale and apply it. This works for three.js objects where you compute bbox
          // and store width in `userData.bboxWidth` when loading the model.
          if (modelRef.current && modelRef.current.userData && modelRef.current.userData.bboxWidth) {
            const bboxWidth = modelRef.current.userData.bboxWidth as number;
            const scaleFactor = detectAndComputeScale(bboxWidth, desiredWidthMeters);

            // Apply scale depending on the object API
            if (modelRef.current.scale && typeof modelRef.current.scale.set === 'function') {
              modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
            } else if (modelRef.current.style) {
              // e.g., <model-viewer> or DOM wrapper
              modelRef.current.style.transform = `scale(${scaleFactor})`;
            }
            setScale(scaleFactor);
            console.log('Applied computed model scale:', scaleFactor, 'for desired width', desiredWidthMeters, 'm');
          } else {
            // No bbox available: apply a conservative heuristic: assume model's natural width==1 unit
            // and treat that unit as meters first, if result unrealistic try mm conversion.
            const modelUnitWidth = 1;
            let scaleFactor = detectAndComputeScale(modelUnitWidth, desiredWidthMeters);
            setScale(scaleFactor);
            console.log('No model bbox found—applied heuristic scale:', scaleFactor);
          }
        } catch (e) {
          console.warn('Scale computation failed', e);
        }

        setTimeout(() => {
            setWaterLevel(85); // Fill to 85%
        }, 300);
        // --- end scale application ---
    }
  };

  const handleResetPlacement = () => {
    setIsPlaced(false);
    setWaterLevel(0);
  };


  // Premium Lenskart-style 3D Tank Component with Water Fill & 360 View
  const Tank3DPreview = ({ isPlaced, rotation, type, waterLevel, isScanning }: { isPlaced: boolean, rotation: number, type: string | null, waterLevel: number, isScanning: boolean }) => {
    const isRCC = type === 'rcc' || type === 'ferrocement';
    
    // Dynamic styles based on material
    const materialGradient = isRCC 
        ? 'linear-gradient(90deg, rgba(168,162,158,0.95) 0%, rgba(214,211,209,0.95) 25%, rgba(231,229,228,0.95) 50%, rgba(168,162,158,0.95) 75%, rgba(120,113,108,0.95) 100%)' // Concrete (Semi-opaque)
        : 'linear-gradient(90deg, rgba(2,132,199,0.5) 0%, rgba(56,189,248,0.4) 20%, rgba(14,165,233,0.3) 50%, rgba(2,132,199,0.4) 80%, rgba(3,105,161,0.5) 100%)'; // Plastic Blue (Translucent)
    
    const lidGradient = isRCC
        ? 'radial-gradient(circle at 30% 30%, #e7e5e4, #a8a29e)'
        : 'radial-gradient(circle at 30% 30%, #7dd3fc, #0284c7)';

    // Scanning State Visuals
    if (isScanning) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 pointer-events-none">
                <div className="relative w-48 h-48">
                    <div className="absolute inset-0 border-2 border-white/20 rounded-xl animate-[spin_4s_linear_infinite]" />
                    <div className="absolute inset-4 border-2 border-dashed border-white/40 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                    <Scan className="absolute inset-0 m-auto w-12 h-12 text-white/80 animate-pulse" />
                    
                    {/* Scanning Beam */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1/2 w-full animate-[scan_2s_linear_infinite] opacity-50" 
                         style={{ animation: 'scan 2s linear infinite' }} />
                </div>
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <p className="text-white font-medium text-sm flex items-center gap-2">
                        <Scan className="w-4 h-4" />
                        Scanning for flat surface...
                    </p>
                </div>
                <style>{`
                    @keyframes scan {
                        0% { top: -50%; }
                        100% { top: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    return (
      <div className="relative w-72 h-72 perspective-[1200px] pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 50 }}
          animate={{ 
            scale: 1, 
            opacity: isPlaced ? 1 : 0.7,
            rotateY: rotation,
            y: isPlaced ? 0 : [0, -10, 0], // Gentle hover in ghost mode
          }}
          transition={{ 
            scale: { type: "spring", stiffness: 180, damping: 12 }, // Thud effect on place
            opacity: { duration: 0.3 },
            rotateY: { type: "spring", stiffness: 100, damping: 30 },
            y: { repeat: isPlaced ? 0 : Infinity, duration: 4, ease: "easeInOut" }
          }}
          className="w-full h-full relative preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Orbit Arrows (Only when placed to suggest 360 view) */}
          {isPlaced && (
             <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] pointer-events-none perspective-[1000px] opacity-40">
                <div className="absolute inset-0 border border-dashed border-white/30 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute top-1/2 -right-3 w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white/50 border-b-[6px] border-b-transparent animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '-200px 0' }} />
             </div>
          )}

          {/* Placement Ring / Target (Only in Preview) */}
          {!isPlaced && (
             <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[220px] h-[60px] pointer-events-none">
                 <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-[50%] animate-[spin_10s_linear_infinite]" />
                 <div className="absolute inset-2 border border-white/30 rounded-[50%]" />
                 {/* Center Dot */}
                 <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
             </div>
          )}

          {/* Ground Anchor / Base Ring (Always visible when placed to anchor it) */}
          {isPlaced && (
             <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 w-[240px] h-[70px] pointer-events-none transition-all duration-300">
                 {/* Solid Base Contact */}
                 <div className="absolute inset-0 border border-white/20 rounded-[50%] bg-black/20 backdrop-blur-[2px] shadow-lg" />
                 {/* Ground Connection Dots */}
                 <div className="absolute -inset-1 border border-white/10 rounded-[50%] opacity-40" />
             </div>
          )}

          {/* Tank Body Construction */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-56 rounded-xl shadow-2xl transition-all duration-300 overflow-hidden`}
            style={{
               background: materialGradient,
               boxShadow: isPlaced 
                 ? 'inset 0 0 50px rgba(0,0,0,0.1), 0 30px 60px rgba(0,0,0,0.5)' 
                 : 'inset 0 0 50px rgba(0,0,0,0.05), 0 30px 40px rgba(0,0,0,0.1)',
               opacity: isPlaced ? 1 : 0.6, // More ghost-like when not placed
               backdropFilter: !isRCC ? 'blur(4px)' : 'none',
               filter: !isPlaced ? 'grayscale(0.5) brightness(1.2)' : 'none' // Ghost effect
            }}
          >
              {/* Water Fill Animation */}
              <div className="absolute bottom-0 left-0 right-0 z-0 transition-all duration-[2000ms] ease-out"
                style={{ height: `${waterLevel}%` }}>
                {/* Water Body */}
                <div className="w-full h-full bg-gradient-to-t from-blue-600/90 to-blue-400/70 relative">
                    {/* Water Surface */}
                    <div className="absolute top-0 left-0 w-full h-4 bg-blue-300/60 rounded-[50%] -translate-y-1/2 blur-[1px] animate-[pulse_3s_ease-in-out_infinite]" />
                    {/* Animated subtle wave on water surface */}
                    <svg className="absolute top-0 left-0 w-full h-6 -translate-y-2 z-20 pointer-events-none" viewBox="0 0 120 20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="g1" x1="0%" x2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 10 C 15 6, 30 14, 45 10 C 60 6, 75 14, 90 10 C 105 6, 120 14, 135 10 L 135 20 L 0 20 Z" fill="url(#g1)">
                        <animateTransform attributeName="transform" type="translate" from="0 0" to="-20 0" dur="3s" repeatCount="indefinite" />
                      </path>
                    </svg>
                    {/* Bubbles / Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                </div>
            </div>

            {/* Top Lid */}
            <div className="absolute -top-5 left-0 w-full h-10 rounded-[50%] border-t border-white/40 transition-all duration-500 z-20" 
                 style={{ background: lidGradient }} />

            {/* Subtle specular sheen that follows device tilt for realism */}
            <motion.div
              className="absolute top-0 left-0 w-28 h-full rounded-xl z-30 pointer-events-none opacity-60"
              style={{
                background: 'linear-gradient(120deg, rgba(255,255,255,0.88), rgba(255,255,255,0.06))',
                mixBlendMode: 'overlay',
                filter: 'blur(10px)'
              }}
              animate={{ x: tilt.x * 0.35, y: tilt.y * 0.12, rotate: rotation / 6 }}
              transition={{ type: 'spring', stiffness: 30, damping: 12 }}
            />

            {/* Rim light to give tank a lifted, 3D feel */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -inset-0.5 rounded-xl" style={{ boxShadow: isPlaced ? '0 18px 40px rgba(2,6,23,0.45), inset 0 2px 12px rgba(255,255,255,0.02)' : '0 6px 18px rgba(2,6,23,0.15)' }} />
            </div>
            
            {/* Structural Ribs (for Plastic) or Texture (for RCC) */}
            {!isRCC && [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="absolute w-full h-1 bg-black/5 blur-[0.5px] border-b border-white/20 z-10" style={{ top: `${i * 15}%` }} />
            ))}
            
            {isRCC && (
                <div className="absolute inset-0 opacity-30 bg-repeat bg-[length:100px_100px] z-10 pointer-events-none mix-blend-multiply" 
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                />
            )}

            {/* Premium Floating Label */}
            <motion.div 
                className="absolute -right-16 top-0 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl border border-white/50 flex flex-col items-start z-30"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-1.5 border-b border-black/10 pb-1 mb-1 w-full">
                  <div className={`w-2 h-2 rounded-full ${isRCC ? 'bg-stone-500' : 'bg-blue-500'}`} />
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Capacity</span>
              </div>
              <span className="text-lg font-black text-gray-800 leading-none">5000L</span>
            </motion.div>
            
            {/* High-Gloss Specular Highlight */}
            <div className="absolute top-0 left-6 w-12 h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent blur-md transform -skew-x-12 z-20 pointer-events-none" />
            
            {/* Bottom Curve */}
            <div className="absolute -bottom-4 left-0 w-full h-8 rounded-[50%] -z-10 transition-colors duration-500" 
                 style={{ background: isRCC ? '#78716c' : '#0369a1' }} />
          </div>

          {/* Dynamic Ground Shadow - Ground Locked */}
          <motion.div 
            animate={{ 
                opacity: isPlaced ? 0.8 : 0.2,
                scale: isPlaced ? 1.2 : 0.8,
                rotateX: 75 
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-64 h-24 bg-black blur-2xl rounded-[50%] -z-20 origin-center" 
          />
        </motion.div>
      </div>
    );
  };

  const getSelectedTankType = () => {
    return tankTypes.find(tank => tank.id === selectedTankType);
  };

  const getSelectedCapacity = () => {
    return capacityOptions.find(cap => cap.id === selectedCapacity);
  };

  // ------ AR model sizing helpers ------
  // Parse a dimension string like '1.8m × 1.8m × 0.9m' into meters
  const parseDimensions = (dim?: string) => {
    if (!dim) return undefined;
    try {
      // split by × or x and extract numeric value (assume meters if 'm' present)
      const parts = dim.split(/×|x/).map(p => p.trim());
      const nums = parts.map(p => {
        const m = p.match(/([0-9]*\.?[0-9]+)/);
        if (!m) return NaN;
        return parseFloat(m[1]);
      });
      // return width, depth, height in meters (if only 2 parts assume width x depth)
      return {
        width: nums[0] || NaN,
        depth: nums[1] || NaN,
        height: nums[2] || NaN
      };
    } catch (e) {
      return undefined;
    }
  };

  // Compute scale factor given a model bounding-box width (in model units), desired world width (meters),
  // and the conversion from model units to meters (e.g., 0.001 for mm -> m).
  const computeScaleFromBBox = (modelBBoxWidthUnits: number, desiredWidthMeters: number, modelUnitToMeters = 1) => {
    if (!modelBBoxWidthUnits || modelBBoxWidthUnits === 0) return 1;
    return desiredWidthMeters / (modelBBoxWidthUnits * modelUnitToMeters);
  };

  // Heuristic: try meters then mm if result is unrealistic
  const detectAndComputeScale = (modelBBoxWidthUnits: number, desiredWidthMeters: number) => {
    let scale = computeScaleFromBBox(modelBBoxWidthUnits, desiredWidthMeters, 1);
    if (!isFinite(scale) || scale <= 0.01 || scale > 100) {
      // try mm -> meters conversion
      scale = computeScaleFromBBox(modelBBoxWidthUnits, desiredWidthMeters, 0.001);
    }
    return scale;
  };

  // Placeholder ref that real model loaders can set (e.g., three.js scene or <model-viewer> element)
  const modelRef = useRef<any>(null);
  // -------------------------------------

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div 
              className={`w-8 h-0.5 mx-2 transition-colors ${
                step < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepTitle = () => {
    const titles = {
      1: 'Select Tank Type',
      2: 'Choose Capacity',
      3: 'AR Visualization'
    };
    return (
      <motion.h2 
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-lg font-medium mb-4"
      >
        {titles[currentStep as keyof typeof titles]}
      </motion.h2>
    );
  };

  // Full Screen AR View Logic
  if (isARActive) {
    return (
      <div className="fixed inset-0 z-[100] bg-black font-sans">
        {/* Full Screen Camera Feed */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover -z-10" 
          style={{ willChange: 'transform' }}
        />
        
        <div className="relative w-72 h-72" style={{ perspective: '1200px' }}>
          <motion.div
            style={{ 
              transformStyle: 'preserve-3d',
              rotateY: rotation,
              rotateX: tilt.y, // Add tilt for more realism
            }}
    // ... animation props
          >
            {/* Tank Body */}
          </motion.div>
        </div>
        
        {/* Floor grid & vignette for depth */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 90%)'
          }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-10 opacity-70"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.07) 0px,
                rgba(255,255,255,0.07) 1px,
                transparent 1px,
                transparent 32px
              ),
              repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.07) 0px,
                rgba(255,255,255,0.07) 1px,
                transparent 1px,
                transparent 32px
              )`
          }}
        />

        {/* Top Controls Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-50 pointer-events-none">
             {/* Back Button */}
             <button 
                onClick={handleBack} 
                className="pointer-events-auto bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-black/50 transition-colors"
             >
               <ArrowLeft className="w-5 h-5" /> Back
             </button>
             
             {/* Right Side Info & Controls */}
             <div className="flex flex-col items-end gap-3 pointer-events-auto">
                 {/* Shape Toggle */}
                 <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 backdrop-blur-md">
                     <button 
                        onClick={() => setTankShape('circular')}
                        className={`p-2 rounded-md transition-all ${tankShape === 'circular' ? 'bg-white text-black shadow-sm' : 'text-white hover:bg-white/10'}`}
                     >
                        <div className="w-5 h-5 rounded-full border-2 border-current" />
                     </button>
                     <button 
                        onClick={() => setTankShape('rectangular')}
                        className={`p-2 rounded-md transition-all ${tankShape === 'rectangular' ? 'bg-white text-black shadow-sm' : 'text-white hover:bg-white/10'}`}
                     >
                        <div className="w-5 h-5 border-2 border-current" />
                     </button>
                 </div>

                 {/* Info Badges */}
                 <div className="flex flex-col gap-2 items-end">
                     <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5">
                        <Droplets className="w-3 h-3 text-sky-400" />
                        {tankTypes.find(t => t.id === selectedTankType)?.name || 'Tank'}
                     </div>
                     <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5">
                        <Ruler className="w-3 h-3 text-sky-400" />
                        {capacityOptions.find(c => c.id === selectedCapacity)?.label.split(' - ')[0] || 'Capacity'}
                     </div>
                 </div>
             </div>
        </div>

        {/* Center reticle + hint */}
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div 
              className={`w-32 h-32 rounded-full border-2 ${isPlacementValid ? 'border-green-400/80 shadow-[0_0_40px_rgba(34,197,94,0.45)]' : 'border-amber-300/80 shadow-[0_0_32px_rgba(251,191,36,0.35)]'} animate-pulse backdrop-blur-sm`}
              style={{ boxShadow: isPlaced ? '0 0 50px rgba(16,185,129,0.55)' : undefined }}
            />
            <div className="absolute w-16 h-16 rounded-lg border border-white/30" />
          </div>
        </div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/10 shadow-lg flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${isPlacementValid ? 'bg-green-400' : 'bg-amber-300'} animate-pulse`} />
              {placementHint}
            </div>
        </div>

        {/* AR Scene Container - Fixed to Ground, Rotation via Device Orientation */}
        <motion.div 
            className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer touch-none"
            onClick={!isPlaced ? handlePlaceTank : undefined}
            style={{ touchAction: 'none' }}
        >
           {/* 3D Tank Preview */}
           <Tank3DPreview 
                isPlaced={isPlaced} 
                rotation={rotation} 
                type={selectedTankType}
                waterLevel={waterLevel}
                isScanning={isScanning}
           />
        </motion.div>

        {/* Bottom Instruction/Status Bar */}
        <div className="absolute bottom-8 left-4 right-4 z-50 pointer-events-none flex flex-col items-center">
           <AnimatePresence mode="wait">
             {isPlaced ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full bg-[#00A651] rounded-[14px] p-5 text-center shadow-lg text-white pointer-events-auto"
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-xl font-bold">
                            <RotateCcw className="w-6 h-6 fill-white text-[#00A651]" />
                            Tank Placed!
                        </div>
                        <p className="text-sm font-medium opacity-95 mb-1">
                            {waterLevel > 0 ? "Filling with water..." : "Great spot."}
                        </p>
                        
                        {/* 360 View Indicator */}
                        <div className="flex items-center gap-2 text-xs opacity-80 bg-black/20 px-3 py-1 rounded-full mb-1">
                            <Rotate3D className="w-3 h-3" />
                            <span>Move around tank to view in 360°</span>
                        </div>

                        <div className="flex gap-3 w-full mt-2">
                            <button 
                                className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                                onClick={(e) => { e.stopPropagation(); handleResetPlacement(); }}
                            >
                                <RotateCcw className="w-4 h-4" /> Move
                            </button>
                            <button 
                                className="flex-1 bg-white text-[#00A651] hover:bg-white/90 rounded-lg py-3 text-sm font-bold shadow-sm transition-colors"
                                onClick={(e) => { e.stopPropagation(); setIsARActive(false); }}
                            >
                                Save & Finish
                            </button>
                        </div>
                    </div>
                </motion.div>
             ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full bg-black/40 backdrop-blur-xl rounded-[24px] p-6 text-center shadow-2xl pointer-events-auto border border-white/10 relative overflow-hidden"
                >
                     {/* Glossy overlay for the panel */}
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="flex flex-col items-center gap-4 relative z-10">
                         
                         {isScanning ? (
                            <div className="flex flex-col items-center gap-2">
                                <Scan className="w-8 h-8 text-white/50 animate-pulse" />
                                <p className="text-white text-lg font-bold">Move phone to detect ground</p>
                                <p className="text-white/60 text-xs max-w-[200px]">Slowly move your device left and right to map the area.</p>
                            </div>
                         ) : (
                             <>
                                {/* AR Interaction Cues (Lenskart Style) */}
                                <div className="flex items-center justify-center gap-12 text-white/90 mb-2">
                                    <div className="flex flex-col items-center gap-2 group">
                                        <div className="bg-white/10 p-3 rounded-full border border-white/10 group-hover:bg-white/20 transition-colors relative">
                                            <Hand className="w-5 h-5 text-white" />
                                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                            </span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Tap to Place</span>
                                    </div>
                                </div>
                                
                                <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                <div className="flex flex-col items-center">
                                    <p className="text-white text-lg font-bold flex items-center justify-center gap-2 drop-shadow-sm">
                                        {isPlacementValid ? (
                                            <>
                                                <span className="text-green-400">✓</span> Ready to anchor
                                            </>
                                        ) : (
                                            <span className="text-red-400 text-base">⚠ Find a flat surface</span>
                                        )}
                                    </p>
                                </div>
                             </>
                         )}

                         <div className="mt-2 pt-2 border-t border-white/5 w-full">
                            <p className="text-[10px] text-white/30 font-medium tracking-wide">
                                POWERED BY ARCORE / ARKIT
                            </p>
                         </div>
                    </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    );
  }

  const renderShapeSelection = () => (
      <Card className="mb-4">
          <CardHeader className="pb-3">
              <CardTitle className="text-base">Tank Shape</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 gap-4">
                  <div 
                      onClick={() => setTankShape('circular')}
                      className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 transition-all ${
                          tankShape === 'circular' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                          : 'hover:bg-slate-50'
                      }`}
                  >
                      <div className="w-12 h-12 rounded-full border-2 border-current bg-white shadow-sm" />
                      <span className="text-sm font-medium">Circular</span>
                  </div>
                  <div 
                      onClick={() => setTankShape('rectangular')}
                      className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 transition-all ${
                          tankShape === 'rectangular' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                          : 'hover:bg-slate-50'
                      }`}
                  >
                      <div className="w-12 h-12 border-2 border-current bg-white shadow-sm" />
                      <span className="text-sm font-medium">Rectangular</span>
                  </div>
              </div>
          </CardContent>
      </Card>
  );

  return (
    <motion.div 
      className="p-4 space-y-6 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Tabs defaultValue="tank-ar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tank-ar" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Tank AR
          </TabsTrigger>
          <TabsTrigger value="recharge-ar" className="flex items-center gap-2">
            <Waves className="w-4 h-4" />
            Recharge AR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tank-ar" className="space-y-6 mt-6">
          {renderStepIndicator()}
          {renderStepTitle()}

          {/* Tank Type Selection */}
          {currentStep === 1 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    Types of Tanks
                  </CardTitle>
                  <CardDescription>Compare different tank types for your needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tankTypes.map((tank, index) => (
                    <motion.div 
                      key={tank.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedTankType(tank.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTankType === tank.id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{tank.name}</h4>
                            {selectedTankType === tank.id && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {tank.material}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                tank.installation === 'Easy' ? 'border-green-300 text-green-700' :
                                tank.installation === 'Moderate' ? 'border-yellow-300 text-yellow-700' :
                                'border-red-300 text-red-700'
                              }`}
                            >
                              {tank.installation}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{tank.lifespan}</p>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {selectedTankType === tank.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 border-t space-y-3">
                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Price Range: <span className="font-medium text-green-600">{tank.costRange}</span></span>
                              </div>

                              {/* Best For */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">BEST FOR:</p>
                                <p className="text-sm font-medium text-blue-600">{tank.useBestFor}</p>
                              </div>

                              {/* Pros */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">ADVANTAGES:</p>
                                <div className="space-y-1">
                                  {tank.pros.map((pro, proIndex) => (
                                    <div key={proIndex} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                      <p className="text-xs text-gray-700">{pro}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Cons */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">CONSIDERATIONS:</p>
                                <div className="space-y-1">
                                  {tank.cons.map((con, conIndex) => (
                                    <div key={conIndex} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                      <p className="text-xs text-gray-700">{con}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Drinking Water Safety */}
                              <div className={`p-3 rounded-lg border ${
                                tank.drinkingWaterSafe 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-red-50 border-red-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Droplets className={`w-4 h-4 ${
                                    tank.drinkingWaterSafe ? 'text-green-600' : 'text-red-600'
                                  }`} />
                                  <span className={`text-sm font-medium ${
                                    tank.drinkingWaterSafe ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    Drinking Water Suitability
                                  </span>
                                </div>
                                <p className={`text-xs ${
                                  tank.drinkingWaterSafe ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {tank.drinkingWater}
                                </p>
                              </div>

                              {/* Maintenance */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">MAINTENANCE:</p>
                                <p className="text-sm font-medium text-purple-600">{tank.maintenance}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Capacity Selection */}
          {currentStep === 2 && (
            <motion.div variants={itemVariants}>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-gray-500" />
                    Choose Capacity
                  </CardTitle>
                  <CardDescription>Select the capacity that suits your needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {capacityOptions.map((cap, index) => (
                    <motion.div 
                      key={cap.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedCapacity(cap.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedCapacity === cap.id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{cap.label}</h4>
                            {selectedCapacity === cap.id && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {cap.dimensions}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{cap.description}</p>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {selectedCapacity === cap.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 border-t space-y-3">
                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Price Range: <span className="font-medium text-green-600">{tankTypes.find(t => t.id === selectedTankType)?.costRange}</span></span>
                              </div>

                              {/* Best For */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">BEST FOR:</p>
                                <p className="text-sm font-medium text-blue-600">{tankTypes.find(t => t.id === selectedTankType)?.useBestFor}</p>
                              </div>

                              {/* Pros */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">ADVANTAGES:</p>
                                <div className="space-y-1">
                                  {tankTypes.find(t => t.id === selectedTankType)?.pros.map((pro, proIndex) => (
                                    <div key={proIndex} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                      <p className="text-xs text-gray-700">{pro}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Cons */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">CONSIDERATIONS:</p>
                                <div className="space-y-1">
                                  {tankTypes.find(t => t.id === selectedTankType)?.cons.map((con, conIndex) => (
                                    <div key={conIndex} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                      <p className="text-xs text-gray-700">{con}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Drinking Water Safety */}
                              <div className={`p-3 rounded-lg border ${
                                tankTypes.find(t => t.id === selectedTankType)?.drinkingWaterSafe 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-red-50 border-red-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Droplets className={`w-4 h-4 ${
                                    tankTypes.find(t => t.id === selectedTankType)?.drinkingWaterSafe ? 'text-green-600' : 'text-red-600'
                                  }`} />
                                  <span className={`text-sm font-medium ${
                                    tankTypes.find(t => t.id === selectedTankType)?.drinkingWaterSafe ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    Drinking Water Suitability
                                  </span>
                                </div>
                                <p className={`text-xs ${
                                  tankTypes.find(t => t.id === selectedTankType)?.drinkingWaterSafe ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {tankTypes.find(t => t.id === selectedTankType)?.drinkingWater}
                                </p>
                              </div>

                              {/* Maintenance */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">MAINTENANCE:</p>
                                <p className="text-sm font-medium text-purple-600">{tankTypes.find(t => t.id === selectedTankType)?.maintenance}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AR Camera View */}
          {currentStep === 3 && (
            <Card className="min-h-[400px] bg-gray-100 relative overflow-hidden">
              <CardContent className="p-0 h-full">
                {!isARActive ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 bg-gray-50">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Camera size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Visualize?</h3>
                    <p className="text-center mb-8 max-w-[250px] text-sm">
                      We'll use your camera to place a virtual 3D tank in your space.
                    </p>
                    <Button 
                      onClick={() => setIsARActive(true)}
                      className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white shadow-lg px-8 py-6 rounded-full text-lg"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start AR Camera
                    </Button>
                  </div>
                ) : (
                  <div className="relative h-[400px] bg-black">
                    {/* Camera Feed */}
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Fallback/Error State */}
                    {cameraError && (
                      <div className="absolute top-0 left-0 right-0 z-40 bg-gray-900/80 text-white p-3 text-center backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Info size={16} className="text-yellow-400" />
                          <p className="text-sm font-medium">{cameraError} Using simulation mode.</p>
                        </div>
                      </div>
                    )}

                    {/* Simulated Environment (if camera fails or loading) */}
                    <div className={`absolute inset-0 pointer-events-none ${(!cameraError && videoRef.current?.srcObject) ? 'opacity-0' : 'opacity-100'} bg-gradient-to-b from-blue-100/10 to-green-100/10`} />

                    {/* AR Overlay Content */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      {/* Scanning Line Effect */}
                      <motion.div 
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: "100%", opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.5)] z-0 pointer-events-none"
                      />

                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            x: tilt.x, // Parallax movement
                            y: tilt.y
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        drag
                        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                        onDragEnd={(_: any, info: any) => {
                            // Simple logic: if dragged too far from center, mark as invalid
                            const dist = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
                            if (dist > 150) setIsPlacementValid(false);
                            else setIsPlacementValid(true);
                        }}
                        className="cursor-move z-10"
                      >
                        <div className="relative">
                          {/* Dimensions Label */}
                          <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap z-30">
                            {capacityOptions.find(c => c.id === selectedCapacity)?.dimensions}
                          </div>
                          
                          {/* The Tank Visual */}
                          <TankVisual type={selectedTankType || 'plastic'} isValid={isPlacementValid} />
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* AR Controls UI */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="bg-white/80 hover:bg-white shadow-sm h-10 w-10 rounded-full"
                        onClick={() => setRotation(r => r + 45)}
                      >
                        <RotateCcw size={18} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="bg-white/80 hover:bg-white shadow-sm h-10 w-10 rounded-full"
                        onClick={() => setScale(s => s === 1 ? 1.5 : 1)}
                      >
                        <Maximize2 size={18} />
                      </Button>
                    </div>

                    {/* Bottom Information Panel */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            (selectedTankType === 'plastic' || selectedTankType === 'modular') ? 'bg-blue-100 text-blue-600' : 'bg-stone-100 text-stone-600'
                          }`}>
                            <Droplets size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{tankTypes.find(t => t.id === selectedTankType)?.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{capacityOptions.find(c => c.id === selectedCapacity)?.label}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-[10px] text-gray-500 uppercase">Est. Cost</p>
                            <p className="text-xs font-bold text-green-600">{tankTypes.find(t => t.id === selectedTankType)?.costRange.split('-')[0]}</p>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-[10px] text-gray-500 uppercase">Lifespan</p>
                            <p className="text-xs font-bold text-blue-600">{tankTypes.find(t => t.id === selectedTankType)?.lifespan}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {currentStep > 1 && (
              <Button 
                onClick={handleBack}
                variant="outline" 
                className="flex-1"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            )}
            {currentStep < 3 && (
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedTankType) || 
                  (currentStep === 2 && !selectedCapacity)
                }
                className={`flex-1 ${
                  (currentStep === 1 && !selectedTankType) || 
                  (currentStep === 2 && !selectedCapacity)
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </div>

          {isARActive && (
            <Button 
              onClick={() => setIsARActive(false)}
              variant="outline" 
              className="w-full"
            >
              Exit AR View
            </Button>
          )}
        </TabsContent>

        <TabsContent value="recharge-ar" className="space-y-0 mt-6">
          <ARRechargeView />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}