import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { IndianRupee, Phone, MapPin, Award, Calculator, Gift, Users, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';

export function CostGuidance() {
  const [selectedSystem, setSelectedSystem] = useState('basic');
  const [selectedCapacity, setSelectedCapacity] = useState('2000');
  
  // New State: Toggle AR Structure inclusion
  const [includeAR, setIncludeAR] = useState(false);

  // AR Structures state
  const [selectedStructure, setSelectedStructure] = useState('pit');
  const [dimensions, setDimensions] = useState({
    width: [2],
    depth: [2.5],
    length: [2]
  });
  
  // Subsidy selection state
  const [subsidyOptions, setSubsidyOptions] = useState({
    rwh: true,
    ar: true
  });

  const rechargeStructures = {
    pit: {
      name: 'Recharge Pit',
      description: 'Ideal for individual houses and small buildings',
      costPerCubicMeter: 5000,
      includes: ['Excavation', 'Filter material', 'Gravel layers', 'Basic construction'],
      capacityRange: 'Small Scale',
      dimensions: '1-2m × 2-3m deep'
    },
    trench: {
      name: 'Recharge Trench',
      description: 'Perfect for small colonies and roadside collection',
      costPerCubicMeter: 6000,
      includes: ['Excavation', 'Filter layers', 'Stone aggregate', 'Inlet/outlet'],
      capacityRange: 'Medium Scale',
      dimensions: '10-20m × 1-2m × 2-3m'
    },
    shaft: {
      name: 'Recharge Shaft',
      description: 'Reaches deep groundwater levels',
      costPerCubicMeter: 15000,
      includes: ['Deep excavation', 'Casing pipes', 'Filter screen', 'Professional installation'],
      capacityRange: 'High Efficiency',
      dimensions: '1-3m diameter × 10-30m deep'
    },
    tank: {
      name: 'Percolation Tank',
      description: 'Large community and village solutions',
      costPerCubicMeter: 8000,
      includes: ['Large excavation', 'Embankment', 'Outlet structures', 'Spillway'],
      capacityRange: 'Massive Scale',
      dimensions: 'Hectares coverage'
    }
  };

  const systems = {
    basic: {
      name: 'Basic RWH System',
      basePrice: 15000,
      pricePerLiter: 5,
      includes: ['Storage tank', 'First flush diverter', 'Basic filtration', 'Piping']
    },
    advanced: {
      name: 'Advanced RWH System',
      basePrice: 35000,
      pricePerLiter: 8,
      includes: ['Underground tank', 'Multi-stage filtration', 'Pump system', 'UV sterilization', 'Monitoring system']
    },
    premium: {
      name: 'Premium Smart System',
      basePrice: 55000,
      pricePerLiter: 12,
      includes: ['Smart tank system', 'IoT monitoring', 'Automated controls', 'Premium filtration', 'Mobile app']
    }
  };

  const subsidies = [
    {
      scheme: 'BWSSB Residential Subsidy',
      amount: '₹10,000',
      eligibility: 'Residential properties in Bangalore',
      coverage: 'Up to 50% of system cost'
    },
    {
      scheme: 'Karnataka Groundwater Development',
      amount: '₹15,000',
      eligibility: 'Rural and semi-urban areas',
      coverage: 'Up to 60% for community systems'
    },
    {
      scheme: 'Central Ground Water Authority',
      amount: '₹5,000',
      eligibility: 'All residential properties',
      coverage: 'Basic system components'
    }
  ];

  const contractors = [
    {
      name: 'AquaHarvest Solutions',
      rating: 4.8,
      projects: 150,
      certification: 'BWSSB Certified',
      location: 'Kolhapur, Maharashtra',
      phone: '+91-XXXXX XXXXX',
      specialization: 'Residential RWH'
    },
    {
      name: 'RainTech Systems', 
      rating: 4.6,
      projects: 200,
      certification: 'CGWB Approved',
      location: 'Kolhapur, Maharashtra',
      phone: '+91-XXXXX XXXXX',
      specialization: 'Advanced filtration'
    },
    {
      name: 'EcoWater Consultants',
      rating: 4.7,
      projects: 120,
      certification: 'BWSSB Certified',
      location: 'Kolhapur, Maharashtra',
      phone: '+91-XXXXX XXXXX',
      specialization: 'Smart systems'
    }
  ];

  const calculateCost = () => {
    const system = systems[selectedSystem as keyof typeof systems];
    const capacity = parseInt(selectedCapacity);
    return system.basePrice + (capacity * system.pricePerLiter);
  };

  const getSubsidyAmount = () => {
    const totalCost = calculateCost();
    return Math.min(totalCost * 0.5, 10000);
  };

  // AR Structures cost calculation
  const calculateARStructureCost = () => {
    // If AR is not included, return 0 cost
    if (!includeAR) return 0;

    const structure = rechargeStructures[selectedStructure as keyof typeof rechargeStructures];
    let volume = 0;
    
    if (selectedStructure === 'shaft') {
      volume = Math.PI * Math.pow(dimensions.width[0] / 2, 2) * dimensions.depth[0];
    } else {
      volume = dimensions.width[0] * dimensions.depth[0] * (dimensions.length?.[0] || dimensions.width[0]);
    }
    
    return Math.round(volume * structure.costPerCubicMeter);
  };

  const getARStructureSubsidy = () => {
    // If AR is not included, return 0 subsidy
    if (!includeAR) return 0;

    const totalCost = calculateARStructureCost();
    return Math.min(totalCost * 0.4, 15000); 
  };

  const calculateRechargeCapacity = () => {
    const volume = selectedStructure === 'shaft' 
      ? Math.PI * Math.pow(dimensions.width[0] / 2, 2) * dimensions.depth[0]
      : dimensions.width[0] * dimensions.depth[0] * (dimensions.length?.[0] || dimensions.width[0]);
    
    return Math.round(volume * 500); 
  };

  // Helper variables for clean JSX
  const rwhCost = calculateCost();
  const rwhSubsidy = subsidyOptions.rwh ? getSubsidyAmount() : 0;
  const rwhNetCost = rwhCost - rwhSubsidy;

  const arCost = calculateARStructureCost();
  const arSubsidy = subsidyOptions.ar ? getARStructureSubsidy() : 0;
  const arNetCost = arCost - arSubsidy;

  const totalProjectCost = rwhNetCost + arNetCost;
  const totalSubsidies = rwhSubsidy + arSubsidy;

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-2">
            <IndianRupee className="w-5 h-5 text-primary" />
            Cost & Subsidy Guide
          </CardTitle>
          <CardDescription>
            Get cost estimates and find approved contractors
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Cost</TabsTrigger>
          <TabsTrigger value="subsidies">Subsidies</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          
          {/* Subsidy Selection - Only RWH here */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Gift className="w-5 h-5" />
                RWH Subsidy
              </CardTitle>
              <CardDescription>Government support for Rainwater Harvesting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rwh-subsidy" 
                  checked={subsidyOptions.rwh}
                  onCheckedChange={(checked: any) => setSubsidyOptions(prev => ({ ...prev, rwh: !!checked }))}
                />
                <label htmlFor="rwh-subsidy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Apply RWH System Subsidies (up to ₹10,000)
                </label>
              </div>
              <div className="text-xs text-amber-700 bg-amber-100 p-2 rounded">
                💡 Subsidies require pre-approval and certified contractors. Processing time: 2-3 months.
              </div>
            </CardContent>
          </Card>

          {/* RWH System Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-500" />
                RWH System Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">System Type</label>
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(systems).map(([key, system]) => (
                      <SelectItem key={key} value={key}>
                        {system.name} - From ₹{system.basePrice.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tank Capacity (Liters)</label>
                <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1,000L - Small</SelectItem>
                    <SelectItem value="2000">2,000L - Medium</SelectItem>
                    <SelectItem value="3000">3,000L - Large</SelectItem>
                    <SelectItem value="5000">5,000L - Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* RWH Cost Breakdown */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">RWH System Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>System Cost:</span>
                <span className="font-semibold">₹{rwhCost.toLocaleString()}</span>
              </div>
              {subsidyOptions.rwh && (
                <div className="flex justify-between text-green-600">
                  <span>Applied Subsidy:</span>
                  <span className="font-semibold">-₹{rwhSubsidy.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>RWH Net Cost:</span>
                <span className="text-green-800">₹{rwhNetCost.toLocaleString()}</span>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium mb-2">System Includes:</h4>
                <ul className="space-y-1">
                  {systems[selectedSystem as keyof typeof systems].includes.map((item, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Annual Savings</h4>
                <div className="text-lg font-semibold text-blue-800">
                  ₹{Math.round(parseInt(selectedCapacity) * 0.05 * 12).toLocaleString()}
                </div>
                <p className="text-xs text-blue-600">Based on current water rates</p>
              </div>
            </CardContent>
          </Card>

          {/* AR Structure Selection */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  AR Structure Calculator
                </CardTitle>
                
                {/* TOGGLE SWITCH for AR */}
                <div className="flex items-center space-x-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                   <Checkbox 
                    id="include-ar" 
                    checked={includeAR}
                    onCheckedChange={(checked: any) => setIncludeAR(!!checked)}
                  />
                  <label htmlFor="include-ar" className="text-sm font-medium leading-none cursor-pointer">
                    Include AR Structure Estimate (Optional)
                  </label>
                </div>
              </div>
              <CardDescription className="mt-2">Add artificial recharge structures to enhance groundwater replenishment</CardDescription>
            </CardHeader>
            
            {/* Conditional Rendering based on Checkbox */}
            {includeAR && (
              <CardContent className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                
                <div>
                  <label className="block text-sm font-medium mb-2">Structure Type</label>
                  <Select value={selectedStructure} onValueChange={setSelectedStructure}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(rechargeStructures).map(([key, structure]) => (
                        <SelectItem key={key} value={key}>
                          {structure.name} - {structure.capacityRange}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">{rechargeStructures[selectedStructure as keyof typeof rechargeStructures].name}</h4>
                  <p className="text-sm text-blue-700 mb-2">{rechargeStructures[selectedStructure as keyof typeof rechargeStructures].description}</p>
                  <p className="text-xs text-blue-600">Typical: {rechargeStructures[selectedStructure as keyof typeof rechargeStructures].dimensions}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Width: {dimensions.width[0]}m</label>
                  <Slider
                    value={dimensions.width}
                    onValueChange={(value: any) => setDimensions(prev => ({ ...prev, width: value }))}
                    max={selectedStructure === 'tank' ? 50 : selectedStructure === 'trench' ? 5 : 5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Depth: {dimensions.depth[0]}m</label>
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
                    <label className="block text-sm font-medium mb-2">Length: {dimensions.length[0]}m</label>
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
            )}
          </Card>

          {/* NEW AR SUBSIDY CARD (Matching RWH Subsidy Theme) */}
          {includeAR && (
            <Card className="border-amber-200 bg-amber-50 animate-in fade-in zoom-in-95 duration-300">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Gift className="w-5 h-5" />
                    AR Subsidy
                </CardTitle>
                <CardDescription>Government support for Artificial Recharge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox 
                    id="ar-subsidy-card" 
                    checked={subsidyOptions.ar}
                    onCheckedChange={(checked: any) => setSubsidyOptions(prev => ({ ...prev, ar: !!checked }))}
                    />
                    <label htmlFor="ar-subsidy-card" className="text-sm font-medium leading-none cursor-pointer text-amber-900">
                    Apply AR Subsidy (up to ₹15,000)
                    </label>
                </div>
                <div className="text-xs text-amber-700 bg-amber-100 p-2 rounded">
                    💡 Subsidies applicable for certified AR structures and recharge pits.
                </div>
                </CardContent>
            </Card>
          )}

          {/* AR Structure Cost Breakdown - Only show if included */}
          {includeAR && (
            <Card className="border-blue-200 bg-blue-50 animate-in fade-in zoom-in-95 duration-300">
              <CardHeader>
                <CardTitle className="text-blue-800">AR Structure Cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Structure Cost:</span>
                  <span className="font-semibold">₹{arCost.toLocaleString()}</span>
                </div>
                {subsidyOptions.ar && (
                  <div className="flex justify-between text-blue-600">
                    <span>Applied Subsidy:</span>
                    <span className="font-semibold">-₹{arSubsidy.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>AR Net Cost:</span>
                  <span className="text-blue-800">₹{arNetCost.toLocaleString()}</span>
                </div>
                
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <h4 className="font-medium mb-2">Structure Includes:</h4>
                  <ul className="space-y-1">
                    {rechargeStructures[selectedStructure as keyof typeof rechargeStructures].includes.map((item, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Estimated Volume</h4>
                    <div className="text-lg font-semibold text-green-800">
                      {selectedStructure === 'shaft' 
                        ? Math.round(Math.PI * Math.pow(dimensions.width[0]/2, 2) * dimensions.depth[0])
                        : Math.round(dimensions.width[0] * dimensions.depth[0] * (dimensions.length?.[0] || dimensions.width[0]))
                      } m³
                    </div>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Recharge Capacity</h4>
                    <div className="text-lg font-semibold text-cyan-800">
                      {calculateRechargeCapacity().toLocaleString()} L/hr
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Total Combined Cost */}
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Total Project Cost
              </CardTitle>
              <CardDescription>
                {includeAR ? "Combined RWH System + AR Structure costs" : "RWH System cost only"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-medium mb-1 text-green-700">RWH System</h4>
                  <div className="text-lg font-semibold text-green-800">
                    ₹{rwhNetCost.toLocaleString()}
                  </div>
                </div>
                <div className={`p-3 bg-white rounded-lg ${!includeAR ? 'opacity-50 grayscale' : ''}`}>
                  <h4 className="font-medium mb-1 text-blue-700">AR Structure</h4>
                  <div className="text-lg font-semibold text-blue-800">
                    {includeAR ? `₹${arNetCost.toLocaleString()}` : "Not Included"}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total System Cost:</span>
                  <span className="font-semibold text-lg">₹{(rwhCost + arCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-orange-600">Total Subsidies:</span>
                  <span className="font-semibold text-orange-600">-₹{totalSubsidies.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-orange-800 pt-2 border-t">
                  <span>Your Total Cost:</span>
                  <span>₹{totalProjectCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-amber-700">💰 Cost Savings & Benefits</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Annual Water Savings:</span>
                    <span className="font-semibold text-green-600">₹{Math.round(parseInt(selectedCapacity) * 0.05 * 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payback Period:</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(totalProjectCost / (parseInt(selectedCapacity) * 0.05 * 12))} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Environmental Impact:</span>
                    <span className="font-semibold text-green-600">
                       {includeAR 
                         ? `${calculateRechargeCapacity().toLocaleString()} L/hr recharge`
                         : "Select AR Structure for recharge estimate"
                       }
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subsidies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Available Subsidies
              </CardTitle>
              <CardDescription>
                Government schemes to reduce your installation cost
              </CardDescription>
            </CardHeader>
          </Card>

          {subsidies.map((subsidy, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{subsidy.scheme}</h4>
                  <Badge className="bg-green-100 text-green-800">{subsidy.amount}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{subsidy.eligibility}</p>
                <p className="text-sm font-medium text-blue-600">{subsidy.coverage}</p>
                <Button className="w-full mt-3" variant="outline" size="sm">
                  Apply for Subsidy
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">💡 Subsidy Tips</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Apply before installation begins</li>
                <li>• Keep all receipts and certificates</li>
                <li>• Use only certified contractors</li>
                <li>• Allow 2-3 months for processing</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Approved Contractors
              </CardTitle>
              <CardDescription>
                BWSSB and CGWB certified professionals
              </CardDescription>
            </CardHeader>
          </Card>

          {contractors.map((contractor, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{contractor.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-800">{contractor.certification}</Badge>
                      <Badge variant="outline" className="text-xs">
                        ⭐ {contractor.rating} ({contractor.projects} projects)
                      </Badge>
                    </div>
                  </div>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    {contractor.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {contractor.phone}
                  </div>
                  <p className="font-medium text-gray-800">
                    Specialization: {contractor.specialization}
                  </p>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">
                    Get Quote
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-blue-50 border-blue-200 mb-8">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">🔍 Contractor Checklist</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Verify BWSSB/CGWB certification</li>
                <li>• Check references and past work</li>
                <li>• Get detailed written quote</li>
                <li>• Confirm warranty terms</li>
                <li>• Ensure post-installation support</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}