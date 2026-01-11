import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, TrendingDown, TrendingUp, Users, Droplets, Target } from 'lucide-react';
import { Progress } from './ui/progress';

export function ImpactMap() {
  const [selectedArea, setSelectedArea] = useState('koramangala');

  const neighborhoods = [
    {
      id: 'koramangala',
      name: 'Koramangala',
      adoption: 28,
      totalHomes: 850,
      activeRWH: 234,
      waterLevel: 'Declining',
      trend: 'down',
      potential: 15
    },
    {
      id: 'whitefield', 
      name: 'Whitefield',
      adoption: 42,
      totalHomes: 1200,
      activeRWH: 504,
      waterLevel: 'Stable',
      trend: 'stable',
      potential: 25
    },
    {
      id: 'jayanagar',
      name: 'Jayanagar',
      adoption: 35,
      totalHomes: 950,
      activeRWH: 332,
      waterLevel: 'Improving', 
      trend: 'up',
      potential: 20
    }
  ];

  const currentArea = neighborhoods.find(n => n.id === selectedArea);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Community Impact Map
          </CardTitle>
          <CardDescription>
            Track groundwater and RWH adoption in your area
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Interactive Map Area */}
      <Card>
        <CardContent className="p-0">
          <div className="h-48 bg-gradient-to-br from-green-100 via-blue-50 to-orange-50 relative overflow-hidden rounded-t-lg">
            {/* Simulated Map */}
            <div className="absolute inset-0">
              {/* Map pins for different neighborhoods */}
              {neighborhoods.map((area, index) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all ${
                    selectedArea === area.id ? 'bg-primary scale-125' : 
                    area.trend === 'up' ? 'bg-green-500' :
                    area.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{
                    left: `${20 + index * 30}%`,
                    top: `${30 + index * 20}%`
                  }}
                >
                  <span className="sr-only">{area.name}</span>
                </button>
              ))}
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-2 text-xs">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Improving</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Stable</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Declining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Area Details */}
      {currentArea && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {currentArea.name}
              <Badge 
                className={
                  currentArea.trend === 'up' ? 'bg-green-100 text-green-800' :
                  currentArea.trend === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }
              >
                {currentArea.waterLevel}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* RWH Adoption Stats */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>RWH Adoption</span>
                <span>{currentArea.adoption}% ({currentArea.activeRWH}/{currentArea.totalHomes})</span>
              </div>
              <Progress value={currentArea.adoption} className="h-2" />
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-semibold">{currentArea.activeRWH}</div>
                <div className="text-sm text-gray-600">Active Systems</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Droplets className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-semibold">{currentArea.potential}%</div>
                <div className="text-sm text-gray-600">Potential Improvement</div>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
              {currentArea.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : currentArea.trend === 'down' ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              )}
              <span className="text-sm">
                Groundwater level is {currentArea.waterLevel.toLowerCase()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collective Impact Potential */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Collective Impact Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Reach 50% Adoption</span>
                <span>+{Math.round((currentArea?.totalHomes || 0) * 0.5 - (currentArea?.activeRWH || 0))} homes needed</span>
              </div>
              <Progress value={currentArea?.adoption || 0} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">
                Could improve groundwater by {currentArea?.potential}%
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-primary/5 to-green-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">If your neighbors join:</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <div>• Groundwater recharge: +25,000L daily</div>
                <div>• Community savings: ₹50,000/month</div>
                <div>• Reduced flooding risk during monsoon</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Neighborhood Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Other Areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {neighborhoods.filter(n => n.id !== selectedArea).map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{area.name}</div>
                  <div className="text-sm text-gray-600">{area.adoption}% adoption</div>
                </div>
                <Badge 
                  className={
                    area.trend === 'up' ? 'bg-green-100 text-green-800' :
                    area.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {area.waterLevel}
                </Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}