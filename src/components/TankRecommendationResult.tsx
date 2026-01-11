import { motion } from "motion/react";
import { jsPDF } from "jspdf";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Download, 
  Phone, 
  Cuboid, 
  Leaf, 
  IndianRupee, 
  Droplets,
  Check
} from "lucide-react";
import { TankRecommendationFormData } from "./TankRecommendationForm";
import appLogo from "../assets/jal-taraang-logo.png"; 

// --- Types ---
export interface TankRecommendationData {
  capacity: number;
  type: string;
  costEstimate: string;
  paybackPeriod: string;
  waterSaved: number;
  coverageDays: number;
  utilization: number;
  dependencyReduction: number;
}

interface TankRecommendationResultProps {
  data: TankRecommendationData;
  userInput: TankRecommendationFormData;
  calculatorInput: { location: string; rainfall: string; length: string; width: string; roofType: string };
  rwhPotential: number;
  onViewAR: () => void;
  onDownloadReport: () => void;
  onRequestCall: () => void;
}

// --- Static Data for PDF (Note: Hardcoded '₹' will be fixed by safeText) ---
const SUBSIDIES = [
  { scheme: 'BWSSB Residential Subsidy', amount: '₹10,000', eligibility: 'Residential in Bangalore' },
  { scheme: 'Karnataka Groundwater Dev', amount: '₹15,000', eligibility: 'Rural/Semi-urban areas' },
  { scheme: 'Central Ground Water Authority', amount: '₹5,000', eligibility: 'All residential properties' }
];

const CONTRACTORS = [
  { name: 'AquaHarvest Solutions', loc: 'Kolhapur, MH', phone: '+91-98765 43210' },
  { name: 'RainTech Systems', loc: 'Pune, MH', phone: '+91-98765 43211' },
  { name: 'EcoWater Consultants', loc: 'Mumbai, MH', phone: '+91-98765 43212' }
];

export function TankRecommendationResult({ 
  data, 
  userInput,
  calculatorInput,
  rwhPotential,
  onViewAR, 
  onDownloadReport, 
  onRequestCall 
}: TankRecommendationResultProps) {
  
  // --- PDF GENERATION LOGIC ---
  const handleGeneratePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    // Brand Colors
    const colorPrimary = [37, 99, 235];    // Blue-600
    const colorSecondary = [22, 163, 74];  // Green-600
    const colorBgLight = [241, 245, 249];  // Slate-100
    const colorTextMain = [15, 23, 42];    // Slate-900
    const colorTextLight = [100, 116, 139];// Slate-500

    // --- HELPER: FIX RUPEE SYMBOL ISSUE ---
    // This function replaces '₹' with 'Rs.' to prevent the "1" glitch
    const safeText = (text: string | number | undefined) => {
      if (text === null || text === undefined) return "";
      const str = text.toString();
      // Replace Unicode Rupee symbol and string version
      return str.replace(/\u20B9/g, "Rs. ").replace(/₹/g, "Rs. ");
    };

    // Helper: Load Image to Base64
    const loadImage = (url: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } else {
            resolve("");
          }
        };
        img.onerror = () => resolve("");
      });
    };

    // Helper: Draw Section Title
    const drawSectionTitle = (text: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.text(text.toUpperCase(), margin, y);
      doc.setDrawColor(226, 232, 240); // light gray line
      doc.setLineWidth(0.5);
      doc.line(margin, y + 3, pageWidth - margin, y + 3);
    };

    // --- 1. HEADER with LOGO ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    const logoBase64 = await loadImage(appLogo);
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, 10, 12, 12); 
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.text("Jal-Taraang", margin + 16, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(colorTextLight[0], colorTextLight[1], colorTextLight[2]);
    doc.text("Smart Water Storage Recommendation", margin + 16, 24);

    doc.setFontSize(9);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, 18, { align: 'right' });
    doc.text(`Ref: #JT-${Math.floor(1000 + Math.random() * 9000)}`, pageWidth - margin, 24, { align: 'right' });

    let yPos = 45;

    // --- 2. CLIENT & SITE DETAILS ---
    doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(colorTextMain[0], colorTextMain[1], colorTextMain[2]);
    
    // Client
    doc.setFont("helvetica", "bold");
    doc.text("Client Details:", margin + 5, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.text(safeText(userInput.fullName), margin + 5, yPos + 18);
    doc.text(`${safeText(userInput.mobile)} | ${safeText(userInput.email)}`, margin + 5, yPos + 24);

    // Site
    const col2X = margin + 70;
    doc.setFont("helvetica", "bold");
    doc.text("Site Location:", col2X, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.text(safeText(calculatorInput.location), col2X, yPos + 18);
    doc.text(`${userInput.propertyType} | ${userInput.familyMembers} Members`, col2X, yPos + 24);

    // Specs
    const col3X = margin + 130;
    doc.setFont("helvetica", "bold");
    doc.text("Technical Specs:", col3X, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Roof: ${calculatorInput.length}' x ${calculatorInput.width}'`, col3X, yPos + 18);
    doc.text(`Rainfall: ${calculatorInput.rainfall} mm/yr`, col3X, yPos + 24);

    yPos += 45;

    // --- 3. RECOMMENDATION ---
    drawSectionTitle("1. Recommended Solution", yPos);
    yPos += 10;

    // Hero Card
    doc.setFillColor(240, 253, 244); // Green-50
    doc.setDrawColor(22, 163, 74);   // Green-600 Border
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'FD');

    // Capacity
    doc.setFontSize(24);
    doc.setTextColor(colorSecondary[0], colorSecondary[1], colorSecondary[2]); 
    doc.setFont("helvetica", "bold");
    doc.text(`${data.capacity.toLocaleString()} Litres`, margin + 10, yPos + 18);

    // Type
    doc.setFontSize(12);
    doc.setTextColor(colorTextMain[0], colorTextMain[1], colorTextMain[2]);
    doc.text(safeText(data.type), margin + 10, yPos + 28);

    // Metrics
    const metricsX = margin + 90;
    doc.setFontSize(9);
    doc.setTextColor(colorTextLight[0], colorTextLight[1], colorTextLight[2]);
    
    doc.text("Annual Water Savings:", metricsX, yPos + 12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colorTextMain[0], colorTextMain[1], colorTextMain[2]);
    doc.text(`${data.waterSaved.toLocaleString()} Litres`, metricsX + 45, yPos + 12);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colorTextLight[0], colorTextLight[1], colorTextLight[2]);
    doc.text("Water Autonomy:", metricsX, yPos + 20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colorTextMain[0], colorTextMain[1], colorTextMain[2]);
    doc.text(`${data.coverageDays} Days / Year`, metricsX + 45, yPos + 20);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colorTextLight[0], colorTextLight[1], colorTextLight[2]);
    doc.text("Tanker Reduction:", metricsX, yPos + 28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colorSecondary[0], colorSecondary[1], colorSecondary[2]);
    doc.text(`${data.dependencyReduction}%`, metricsX + 45, yPos + 28);

    yPos += 50;

    // --- 4. FINANCIAL ESTIMATE (This is where the "1" appeared) ---
    drawSectionTitle("2. Financial Estimate", yPos);
    yPos += 10;

    const rowH = 12;
    // Row 1: Cost
    doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
    doc.rect(margin, yPos, pageWidth - (margin * 2), rowH, 'F');
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colorTextMain[0], colorTextMain[1], colorTextMain[2]);
    doc.text("Estimated System Setup Cost", margin + 5, yPos + 8);
    
    doc.setFont("helvetica", "bold");
    // [FIX APPLIED HERE] safeText replaces '₹' with 'Rs.'
    doc.text(safeText(data.costEstimate), pageWidth - margin - 5, yPos + 8, { align: 'right' });
    
    yPos += rowH + 2;

    // Row 2: Payback
    doc.setFillColor(255, 255, 255); 
    doc.rect(margin, yPos, pageWidth - (margin * 2), rowH, 'F');
    doc.setFont("helvetica", "normal");
    doc.text("Estimated Payback Period", margin + 5, yPos + 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colorSecondary[0], colorSecondary[1], colorSecondary[2]);
    doc.text(safeText(data.paybackPeriod), pageWidth - margin - 5, yPos + 8, { align: 'right' });
    yPos += rowH + 10;

    // --- 5. SUBSIDIES ---
    drawSectionTitle("3. Available Subsidies", yPos);
    yPos += 8;
    
    doc.setFontSize(8);
    doc.setTextColor(colorTextMain[0], colorTextMain[1], colorTextMain[2]);
    doc.setFont("helvetica", "bold");
    doc.text("SCHEME NAME", margin, yPos + 5);
    doc.text("AMOUNT", margin + 90, yPos + 5);
    doc.text("ELIGIBILITY", margin + 120, yPos + 5);
    yPos += 8;

    SUBSIDIES.forEach((sub) => {
      doc.setFont("helvetica", "normal");
      doc.text(safeText(sub.scheme), margin, yPos);
      doc.setFont("helvetica", "bold");
      doc.text(safeText(sub.amount), margin + 90, yPos); // [FIX APPLIED HERE]
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colorTextLight[0], colorTextLight[1], colorTextLight[2]);
      doc.text(safeText(sub.eligibility), margin + 120, yPos);
      yPos += 6;
    });

    yPos += 10;

    // --- 6. CONTRACTORS ---
    drawSectionTitle("4. Approved Contractors", yPos);
    yPos += 8;

    CONTRACTORS.forEach((con, i) => {
      const boxW = (pageWidth - (margin * 4)) / 3;
      const boxX = margin + (i * (boxW + margin));
      
      doc.setDrawColor(226, 232, 240);
      doc.rect(boxX, yPos, boxW, 25);
      
      doc.setFontSize(8);
      doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setFont("helvetica", "bold");
      doc.text(safeText(con.name), boxX + 2, yPos + 6);
      
      doc.setTextColor(colorTextLight[0], colorTextLight[1], colorTextLight[2]);
      doc.setFont("helvetica", "normal");
      doc.text(safeText(con.loc), boxX + 2, yPos + 12);
      doc.text(safeText(con.phone), boxX + 2, yPos + 18);
    });

    // Footer
    doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Disclaimer: Costs are estimates only. Please consult a verified contractor for final quotes.", margin, pageHeight - 8);
    doc.text("www.jal-taraang.in", pageWidth - margin, pageHeight - 8, { align: 'right' });

    doc.save(`Jal-Taraang_Quote_${userInput.fullName.replace(/\s+/g, '_')}.pdf`);
    if (onDownloadReport) onDownloadReport();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      className="space-y-6 max-w-xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-primary">
              Recommended Water Storage Solution
            </CardTitle>
            <CardDescription>
              Based on your rooftop potential and household needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            
            {/* Main Recommendation */}
            <div className="text-center space-y-2">
              <div className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                Recommended Tank Size
              </div>
              <div className="text-4xl font-bold text-foreground">
                {data.capacity.toLocaleString()} Litres
              </div>
              <Badge className="text-lg py-1 px-4 mt-2 bg-primary hover:bg-primary/90">
                {data.type}
              </Badge>
            </div>

            <Separator />

            {/* Why This Tank */}
            <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-sm font-medium">
                   <Droplets className="w-4 h-4 text-blue-500" /> Coverage
                 </div>
                 <p className="text-sm text-muted-foreground">
                   Covers <span className="font-bold text-foreground">{data.coverageDays} days</span> of household water demand
                 </p>
               </div>
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-sm font-medium">
                   <Check className="w-4 h-4 text-green-500" /> Efficiency
                 </div>
                 <p className="text-sm text-muted-foreground">
                   Utilizes <span className="font-bold text-foreground">{data.utilization}%</span> of your annual harvested rainwater
                 </p>
               </div>
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-sm font-medium">
                   <IndianRupee className="w-4 h-4 text-yellow-600" /> Savings
                 </div>
                 <p className="text-sm text-muted-foreground">
                   Reduces tanker dependency by <span className="font-bold text-foreground">{data.dependencyReduction}%</span>
                 </p>
               </div>
            </div>

            {/* Cost & Payback */}
            <div className="bg-white/50 p-4 rounded-lg border border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estimated Setup Cost</span>
                <span className="font-bold text-lg">{data.costEstimate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payback Period</span>
                <span className="text-sm text-muted-foreground">{data.paybackPeriod} (via water savings)</span>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg text-green-800">
              <Leaf className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold block mb-1">Environmental Impact</span>
                Saves approx. {data.waterSaved.toLocaleString()} litres/year, helps recharge groundwater, and reduces water scarcity risks.
              </div>
            </div>

          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        <Button 
          onClick={onViewAR} 
          className="w-full text-lg h-12" 
          size="lg"
        >
          <Cuboid className="w-5 h-5 mr-2" />
          View Tank in AR
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleGeneratePDF}>
            <Download className="w-4 h-4 mr-2" />
            Download Quotation
          </Button>
          <Button variant="outline" onClick={onRequestCall}>
            <Phone className="w-4 h-4 mr-2" />
            Request Expert Call
          </Button>
        </div>
      </motion.div>

    </motion.div>
  );
}