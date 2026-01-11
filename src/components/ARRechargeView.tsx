import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { 
  Camera, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Move3D, 
  Layers,
  Ruler,
  Info,
  Eye,
  Home,
  Building,
  ArrowDown,
  Waves,
  Play,
  Pause,
  RotateCw
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface RechargeStructure {
  id: string;
  name: string;
  dimensions: string;
  capacity: string;
  depth: string;
  width: string;
  icon: any;
  color: string;
  description: string;
}

export function ARRechargeView() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedStructure, setSelectedStructure] = useState<string>('pit');
  const [isPlaying, setIsPlaying] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: [2],
    depth: [2.5],
    length: [2]
  });
  const [viewMode, setViewMode] = useState<'3d' | 'cross-section' | 'top'>('3d');
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [sensorRotation, setSensorRotation] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [siteFitMode, setSiteFitMode] = useState(false);
  const [siteStatus, setSiteStatus] = useState<'fit' | 'tight' | 'no-fit'>('fit');

  // Refs for smooth orientation handling (prevents flicker)
  const orientationRef = useRef({ beta: 0, gamma: 0, dirty: false });
  const rafRef = useRef<number | null>(null);

  // Device orientation with Tick Loop for performance
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta !== null && gamma !== null) {
        // Store raw data without triggering re-renders
        orientationRef.current.beta = beta;
        orientationRef.current.gamma = gamma;
        orientationRef.current.dirty = true;
      }
    };

    const tick = () => {
      // Only update state if data changed, synced to frame rate
      if (orientationRef.current.dirty) {
        const { beta, gamma } = orientationRef.current;
        
        // Update Sensor Rotation (Gamma)
        // Threshold check (0.5) prevents micro-jitter when phone is still
        setSensorRotation(prev => {
          const next = gamma * 0.8;
          return Math.abs(next - prev) > 0.5 ? next : prev;
        });
        
        // Update Pitch (Beta)
        setPitch(prev => {
          const next = (beta - 45) * 0.5;
          return Math.abs(next - prev) > 0.5 ? next : prev;
        });
        
        orientationRef.current.dirty = false;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Update site status based on dimensions
  useEffect(() => {
    if (siteFitMode) {
        const volume = dimensions.width[0] * dimensions.depth[0] * (dimensions.length?.[0] || 1);
        // Arbitrary logic: if volume > 20m3, it's tight. > 50m3, no fit.
        if (volume > 50) setSiteStatus('no-fit');
        else if (volume > 20) setSiteStatus('tight');
        else setSiteStatus('fit');
    }
  }, [dimensions, siteFitMode]);


  const rechargeStructures: RechargeStructure[] = [
    {
      id: 'pit',
      name: 'Recharge Pit',
      dimensions: '1-2m × 2-3m deep',
      capacity: 'Small Scale',
      depth: '2-3m',
      width: '1-2m',
      icon: Home,
      color: '#3b82f6',
      description: 'Ideal for individual houses and small buildings'
    },
    {
      id: 'trench',
      name: 'Recharge Trench',
      dimensions: '10-20m × 1-2m × 2-3m',
      capacity: 'Medium Scale',
      depth: '2-3m',
      width: '1-2m',
      icon: Building,
      color: '#10b981',
      description: 'Perfect for small colonies and roadside collection'
    },
    {
      id: 'shaft',
      name: 'Recharge Shaft',
      dimensions: '1-3m diameter × 10-30m deep',
      capacity: 'High Efficiency',
      depth: '10-30m',
      width: '1-3m diameter',
      icon: ArrowDown,
      color: '#8b5cf6',
      description: 'Reaches deep groundwater levels'
    },
    {
      id: 'tank',
      name: 'Percolation Tank',
      dimensions: 'Hectares coverage',
      capacity: 'Massive Scale',
      depth: '3-5m',
      width: 'Variable',
      icon: Waves,
      color: '#f97316',
      description: 'Large community and village solutions'
    }
  ];

  const currentStructure = rechargeStructures.find(s => s.id === selectedStructure) || rechargeStructures[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawStructure = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set canvas size
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;

      // Draw ground level
      ctx.fillStyle = '#8b7355';
      ctx.fillRect(0, centerY, canvas.offsetWidth, canvas.offsetHeight - centerY);

      // Draw sky/surface
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, canvas.offsetWidth, centerY);

      // Draw structure based on type and view mode
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Combine manual rotation with device tilt
      const totalRotation = rotationAngle + sensorRotation + (pitch * 0.5); 
      ctx.rotate((totalRotation * Math.PI) / 180);

      // Site Fit Visualization (Text Indicator instead of Aura)
      if (siteFitMode) {
        ctx.fillStyle = siteStatus === 'fit' ? '#22c55e' : siteStatus === 'tight' ? '#eab308' : '#ef4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            siteStatus === 'fit' ? "✓ Perfect Fit" : siteStatus === 'tight' ? "⚠ Tight Fit" : "✕ Too Large",
            0, -80
        );
      }

      switch (selectedStructure) {
        case 'pit':
          drawPit(ctx, dimensions.width[0] * 20, dimensions.depth[0] * 15);
          break;
        case 'trench':
          drawTrench(ctx, dimensions.length[0] * 10, dimensions.width[0] * 20, dimensions.depth[0] * 15);
          break;
        case 'shaft':
          drawShaft(ctx, dimensions.width[0] * 15, dimensions.depth[0] * 5);
          break;
        case 'tank':
          drawTank(ctx, dimensions.width[0] * 30, dimensions.depth[0] * 10);
          break;
      }

      ctx.restore();

      // Draw measurements if enabled
      if (showMeasurements) {
        drawMeasurements(ctx, centerX, centerY);
      }

      // Draw water flow animation
      if (isPlaying) {
        drawWaterFlow(ctx, centerX, centerY);
      }
    };

    const getStructureColor = (baseColor: string) => {
        if (!siteFitMode) return baseColor;
        if (siteStatus === 'fit') return '#22c55e'; // Green
        if (siteStatus === 'tight') return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const drawPit = (ctx: CanvasRenderingContext2D, width: number, depth: number) => {
      const color = getStructureColor(currentStructure.color);
      
      // Gradient for 3D effect
      const gradient = ctx.createLinearGradient(-width/2, 0, width/2, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, adjustColorBrightness(color, 20)); // Highlight center
      gradient.addColorStop(1, color);

      // Pit structure
      ctx.fillStyle = gradient;
      ctx.fillRect(-width/2, -10, width, depth);
      
      // Top lip (3D depth)
      ctx.fillStyle = adjustColorBrightness(color, -20);
      ctx.fillRect(-width/2, -15, width, 5);
      
      // Pit walls
      ctx.strokeStyle = '#3f2e18';
      ctx.lineWidth = 2;
      ctx.strokeRect(-width/2, -10, width, depth);
      
      // Realistic Gravel layer
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(-width/2 + 5, depth - 20, width - 10, 15);
      // Gravel texture dots
      for(let i=0; i<20; i++) {
         const rx = (-width/2 + 5) + Math.random() * (width-10);
         const ry = (depth - 20) + Math.random() * 15;
         ctx.fillStyle = '#4b5563';
         ctx.fillRect(rx, ry, 2, 2);
      }
    };

    const drawTrench = (ctx: CanvasRenderingContext2D, length: number, width: number, depth: number) => {
      const color = getStructureColor(currentStructure.color);
      
      // 3D Isometric-ish Top
      ctx.beginPath();
      ctx.moveTo(-length/2, -10);
      ctx.lineTo(-length/2 + 10, -20);
      ctx.lineTo(length/2 + 10, -20);
      ctx.lineTo(length/2, -10);
      ctx.closePath();
      ctx.fillStyle = adjustColorBrightness(color, -10);
      ctx.fill();
      ctx.stroke();

      // Front Face
      const gradient = ctx.createLinearGradient(0, -10, 0, width);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, adjustColorBrightness(color, -30)); // Darker at bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(-length/2, -10, length, width);
      ctx.strokeRect(-length/2, -10, length, width);
    };

    const drawShaft = (ctx: CanvasRenderingContext2D, diameter: number, depth: number) => {
      const color = getStructureColor(currentStructure.color);

      // Cylinder Shaft
      const gradient = ctx.createLinearGradient(-diameter/2, 0, diameter/2, 0);
      gradient.addColorStop(0, adjustColorBrightness(color, -20));
      gradient.addColorStop(0.2, color);
      gradient.addColorStop(0.5, adjustColorBrightness(color, 30)); // Highlight
      gradient.addColorStop(0.8, color);
      gradient.addColorStop(1, adjustColorBrightness(color, -20));

      // Draw Tube
      ctx.fillStyle = gradient;
      ctx.fillRect(-diameter/2, 0, diameter, depth);
      ctx.strokeRect(-diameter/2, 0, diameter, depth);

      // Top Ring (Perspective)
      ctx.beginPath();
      ctx.ellipse(0, 0, diameter/2, diameter/6, 0, 0, 2 * Math.PI);
      ctx.fillStyle = adjustColorBrightness(color, -40); // Dark interior
      ctx.fill();
      ctx.stroke();
    };

    const drawTank = (ctx: CanvasRenderingContext2D, width: number, depth: number) => {
      const color = getStructureColor(currentStructure.color);
      
      // Main body
      const gradient = ctx.createLinearGradient(-width/2, 0, width/2, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, adjustColorBrightness(color, 20));
      gradient.addColorStop(1, color);

      ctx.fillStyle = gradient;
      ctx.fillRect(-width/2, -20, width, depth);
      
      // Ribs for realism
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(-width/2, -10, width, 2);
      ctx.fillRect(-width/2, 0, width, 2);
      ctx.fillRect(-width/2, 10, width, 2);

      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(-width/2, -20, width, depth);
    };

    // Helper to lighten/darken hex color
    const adjustColorBrightness = (hex: string, percent: number) => {
        const num = parseInt(hex.replace('#',''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    };

    const drawMeasurements = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.font = '12px sans-serif';
      
      // Width measurement
      ctx.fillText(`W: ${dimensions.width[0]}m`, 10, 30);
      ctx.fillText(`D: ${dimensions.depth[0]}m`, 10, 50);
      if (selectedStructure === 'trench') {
        ctx.fillText(`L: ${dimensions.length[0]}m`, 10, 70);
      }
    };

    const drawWaterFlow = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
      const time = Date.now() * 0.001;
      
      // Animated water drops
      for (let i = 0; i < 5; i++) {
        const x = centerX + Math.sin(time + i) * 50;
        const y = (time * 50 + i * 20) % (centerY + 100);
        
        if (y < centerY - 20) {
          ctx.fillStyle = 'rgba(64, 164, 223, 0.7)';
          ctx.beginPath();
          ctx.arc(x - centerX, y - centerY - 100, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    };

    let animationFrame: number;
    const animate = () => {
      drawStructure();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [selectedStructure, dimensions, viewMode, showMeasurements, rotationAngle, sensorRotation, isPlaying, pitch, siteFitMode, siteStatus]);

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

  return (
    <motion.div 
      className="p-4 space-y-6 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary/10 to-blue-500/20 border-primary/20">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center mb-4"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Layers className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-xl">AR Recharge Structures</CardTitle>
            <CardDescription className="text-center">
              Interactive 3D visualization of artificial recharge structures
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Structure Selection */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Select Structure Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedStructure} onValueChange={setSelectedStructure}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pit">Pit</TabsTrigger>
                <TabsTrigger value="trench">Trench</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 mt-2">
                <TabsTrigger value="shaft">Shaft</TabsTrigger>
                <TabsTrigger value="tank">Tank</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-4 p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {currentStructure.icon && <currentStructure.icon className="w-4 h-4" style={{ color: currentStructure.color }} />}
                <span className="font-semibold">{currentStructure.name}</span>
                <Badge style={{ backgroundColor: `${currentStructure.color}20`, color: currentStructure.color }}>
                  {currentStructure.capacity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{currentStructure.description}</p>
              <p className="text-xs mt-1"><strong>Dimensions:</strong> {currentStructure.dimensions}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AR Viewer */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              3D Structure View
            </CardTitle>
            <CardDescription>Interactive visualization with real-time adjustments</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Site Fit Toggle */}
            <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-medium text-gray-600">Site Constraint Check</span>
                <Button 
                    variant={siteFitMode ? "default" : "outline"} 
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSiteFitMode(!siteFitMode)}
                >
                    {siteFitMode ? (siteStatus === 'fit' ? 'Fits Well' : siteStatus === 'tight' ? 'Tight Fit' : 'Too Large') : 'Check Fit'}
                </Button>
            </div>

            <div className={`relative bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden border-4 transition-colors duration-300 ${
                siteFitMode ? (siteStatus === 'fit' ? 'border-green-500' : siteStatus === 'tight' ? 'border-yellow-500' : 'border-red-500') : 'border-primary/20'
            }`}>
              <canvas
                ref={canvasRef}
                className="w-full h-64 block"
                style={{ imageRendering: 'crisp-edges' }}
              />
              
              {/* AR Controls Overlay */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90"
                  onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90"
                  onClick={() => setShowMeasurements(!showMeasurements)}
                >
                  <Ruler className="w-4 h-4" />
                </Button>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-2 left-2 bg-white/90 rounded px-2 py-1 text-xs">
                <div className="flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Depth: {currentStructure.depth} | Width: {currentStructure.width}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dimension Controls */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Move3D className="w-5 h-5" />
              Adjust Dimensions
            </CardTitle>
            <CardDescription>Customize structure size for your site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Width: {dimensions.width[0]}m</label>
              <Slider
                value={dimensions.width}
                onValueChange={(value: any) => setDimensions(prev => ({ ...prev, width: value }))}
                max={selectedStructure === 'tank' ? 50 : 5}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Depth: {dimensions.depth[0]}m</label>
              <Slider
                value={dimensions.depth}
                onValueChange={(value: any) => setDimensions(prev => ({ ...prev, depth: value }))}
                max={selectedStructure === 'shaft' ? 30 : 10}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>

            {selectedStructure === 'trench' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Length: {dimensions.length[0]}m</label>
                <Slider
                  value={dimensions.length}
                  onValueChange={(value: any) => setDimensions(prev => ({ ...prev, length: value }))}
                  max={25}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Specifications */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Structure Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm"><strong>Estimated Volume:</strong></p>
                <p className="text-lg font-semibold text-primary">
                  {selectedStructure === 'shaft' 
                    ? Math.round(Math.PI * Math.pow(dimensions.width[0]/2, 2) * dimensions.depth[0])
                    : Math.round(dimensions.width[0] * dimensions.depth[0] * (dimensions.length?.[0] || dimensions.width[0]))
                  } m³
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm"><strong>Recharge Capacity:</strong></p>
                <p className="text-lg font-semibold text-blue-600">
                  {Math.round(dimensions.width[0] * dimensions.depth[0] * 500)} L/hr
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Estimated Cost:</strong> ₹{(
                  Math.round(dimensions.width[0] * dimensions.depth[0] * (selectedStructure === 'shaft' ? 15000 : 
                   selectedStructure === 'tank' ? 8000 : 5000))
                ).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Including excavation, materials, and basic installation
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Implementation Guide */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg">Implementation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Site Selection:</strong> Choose areas with good soil permeability and adequate catchment.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Professional Help:</strong> Consult experts for {selectedStructure === 'shaft' ? 'deep shaft construction' : 'proper design and installation'}.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Maintenance:</strong> Regular cleaning and inspection ensure optimal performance.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}