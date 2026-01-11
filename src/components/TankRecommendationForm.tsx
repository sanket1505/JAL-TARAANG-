import { useState } from "react";
import { motion } from "motion/react";
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
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { User, Home, Droplets, Wallet, ChevronRight } from "lucide-react";

export interface TankRecommendationFormData {
  fullName: string;
  mobile: string;
  email: string;
  familyMembers: string;
  propertyType: string;
  waterUsage: string[];
  dailyConsumption: string;
  hasExistingTank: string;
  existingTankCapacity: string;
  preferredTankType: string;
  budget: string;
}

interface TankRecommendationFormProps {
  onSubmit: (data: TankRecommendationFormData) => void;
  rwhPotential: number;
}

export function TankRecommendationForm({ onSubmit, rwhPotential }: TankRecommendationFormProps) {
  const [formData, setFormData] = useState<TankRecommendationFormData>({
    fullName: "",
    mobile: "",
    email: "",
    familyMembers: "4",
    propertyType: "individual",
    waterUsage: ["drinking", "bathing"],
    dailyConsumption: "135",
    hasExistingTank: "no",
    existingTankCapacity: "",
    preferredTankType: "unsure",
    budget: "25000-50000",
  });

  const handleUsageChange = (usage: string) => {
    setFormData(prev => {
      const current = prev.waterUsage;
      const updated = current.includes(usage)
        ? current.filter(u => u !== usage)
        : [...current, usage];
      return { ...prev, waterUsage: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Smart Tank Recommendation
          </CardTitle>
          <CardDescription>
            Help us understand your water needs to recommend the most suitable tank for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" /> Personal Details
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    placeholder="e.g. XYZ" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input 
                      id="mobile" 
                      type="tel" 
                      placeholder="Mobile Number" 
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Home className="w-4 h-4 text-muted-foreground" /> Household Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="members">Family Members</Label>
                  <Input 
                    id="members" 
                    type="number" 
                    min="1"
                    value={formData.familyMembers}
                    onChange={(e) => setFormData({...formData, familyMembers: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(val) => setFormData({...formData, propertyType: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="farmhouse">Farmhouse</SelectItem>
                      <SelectItem value="commercial">Commercial Building</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Droplets className="w-4 h-4 text-muted-foreground" /> Water Usage Pattern
              </h3>
              <div className="space-y-3">
                <Label>Primary Water Usage</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "drinking", label: "Drinking & Cooking" },
                    { id: "bathing", label: "Bathing & Washing" },
                    { id: "toilet", label: "Toilet Use" },
                    { id: "gardening", label: "Gardening" },
                    { id: "recharge", label: "Groundwater Recharge" },
                  ].map((usage) => (
                    <div key={usage.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={usage.id} 
                        checked={formData.waterUsage.includes(usage.id)}
                        onCheckedChange={() => handleUsageChange(usage.id)}
                      />
                      <Label htmlFor={usage.id} className="font-normal">{usage.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dailyConsumption">Daily Consumption per Person</Label>
                <Select 
                  value={formData.dailyConsumption} 
                  onValueChange={(val) => setFormData({...formData, dailyConsumption: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select consumption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 L/day (Low)</SelectItem>
                    <SelectItem value="135">135 L/day (Standard)</SelectItem>
                    <SelectItem value="150">150+ L/day (High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Wallet className="w-4 h-4 text-muted-foreground" /> Budget & Infrastructure
              </h3>
              
              <div className="space-y-3">
                <Label>Do you already have a water tank?</Label>
                <RadioGroup 
                  value={formData.hasExistingTank} 
                  onValueChange={(val) => setFormData({...formData, hasExistingTank: val})}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="tank-yes" />
                    <Label htmlFor="tank-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tank-no" />
                    <Label htmlFor="tank-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.hasExistingTank === "yes" && (
                <div className="grid gap-2">
                  <Label htmlFor="existingCapacity">Existing Tank Capacity (Litres)</Label>
                  <Input 
                    id="existingCapacity" 
                    type="number" 
                    placeholder="e.g. 1000"
                    value={formData.existingTankCapacity}
                    onChange={(e) => setFormData({...formData, existingTankCapacity: e.target.value})}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label>Preferred Tank Type</Label>
                <Select 
                  value={formData.preferredTankType} 
                  onValueChange={(val) => setFormData({...formData, preferredTankType: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unsure">Not Sure (AI Suggest)</SelectItem>
                    <SelectItem value="underground">Underground RCC Tank</SelectItem>
                    <SelectItem value="overhead">Plastic Overhead Tank</SelectItem>
                    <SelectItem value="modular">Modular Recharge Pit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Estimated Budget</Label>
                <Select 
                  value={formData.budget} 
                  onValueChange={(val) => setFormData({...formData, budget: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10000-25000">₹10,000 – ₹25,000</SelectItem>
                    <SelectItem value="25000-50000">₹25,000 – ₹50,000</SelectItem>
                    <SelectItem value="50000+">₹50,000+</SelectItem>
                    <SelectItem value="optimized">Need cost-optimized suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" size="lg">
              Get My Best Tank Recommendation
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}