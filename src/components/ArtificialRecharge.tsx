import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Droplets, Home, Building, TreePine, Waves, Ruler, ArrowDown, Info } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function ArtificialRecharge() {
  const { t } = useLanguage();

  const rechargeTypes = [
    {
      id: 'pit',
      title: 'Recharge Pit',
      description: 'Small pits for houses and individual buildings',
      dimensions: '1–2 m wide × 2–3 m deep',
      suitableFor: 'Houses, Individual Buildings',
      capacity: 'Small Scale',
      icon: Home,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      details: [
        'Easy to construct and maintain',
        'Cost-effective for residential use',
        'Minimal space requirement',
        'Suitable for urban areas'
      ]
    },
    {
      id: 'trench',
      title: 'Recharge Trench',
      description: 'Long and narrow structures for small colonies',
      dimensions: '10–20 m long × 1–2 m wide × 2–3 m deep',
      suitableFor: 'Small Colonies, Roadside Collection',
      capacity: 'Medium Scale',
      icon: Building,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      details: [
        'Efficient for linear water collection',
        'Ideal for roadside runoff management',
        'Moderate construction complexity',
        'Good for community-level solutions'
      ]
    },
    {
      id: 'shaft',
      title: 'Recharge Shaft/Well',
      description: 'Deep vertical shafts for deeper groundwater levels',
      dimensions: '10–30 m deep × 1–3 m diameter',
      suitableFor: 'Areas with Deep Groundwater',
      capacity: 'High Efficiency',
      icon: ArrowDown,
      gradient: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      details: [
        'Reaches deeper aquifer layers',
        'High recharge efficiency',
        'Suitable for arid regions',
        'Requires professional installation'
      ]
    },
    {
      id: 'tank',
      title: 'Percolation Tank',
      description: 'Large tanks for villages and communities',
      dimensions: 'Spread over hectares',
      suitableFor: 'Villages, Large Communities',
      capacity: 'Massive Scale',
      icon: Waves,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      details: [
        'Stores huge volumes of water',
        'Recharges large aquifer areas',
        'Requires significant land area',
        'Government/community projects'
      ]
    }
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

  return (
    <motion.div 
      className="p-4 space-y-6 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/20 border-primary/20">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mb-4"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Droplets className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-xl">Artificial Recharge</CardTitle>
            <CardDescription className="text-center">
              Recharging underground water by allowing rainwater to soak into the soil through specially made structures
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Recharge Types */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <h2 className="text-lg font-semibold text-center">Types of Recharge Structures</h2>
        
        {rechargeTypes.map((type, index) => {
          const IconComponent = type.icon;
          return (
            <motion.div
              key={type.id}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className={`${type.bgColor} ${type.borderColor} border-2 hover:shadow-lg transition-shadow duration-300`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${type.gradient} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Specifications */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Size:</strong> {type.dimensions}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Suitable for:</strong> {type.suitableFor}
                      </span>
                    </div>
                  </div>

                  {/* Capacity Badge */}
                  <div className="flex justify-between items-center">
                    <Badge className={`${type.textColor} bg-white/70`}>
                      {type.capacity}
                    </Badge>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {type.details.map((detail, idx) => (
                        <li key={idx} className="text-xs flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Benefits Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-center">Benefits of Artificial Recharge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {[
                'Increases groundwater levels',
                'Improves water table sustainability',
                'Reduces surface water flooding',
                'Enhances soil moisture content',
                'Supports long-term water security'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Implementation Tips */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg text-center">Implementation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Site Selection:</strong> Choose locations with good soil permeability and adequate catchment area.
              </p>
              <p>
                <strong>Design Considerations:</strong> Size structures based on rainfall patterns and available space.
              </p>
              <p>
                <strong>Maintenance:</strong> Regular cleaning and inspection ensure optimal performance.
              </p>
              <p>
                <strong>Professional Help:</strong> Consult experts for deeper structures and community-scale projects.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}