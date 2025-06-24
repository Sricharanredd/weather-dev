import React from 'react';
import { Leaf, AlertTriangle } from 'lucide-react';
import { AirQualityData } from '../types/weather';
import { getAirQualityLevel } from '../utils/weatherUtils';

interface AirQualityProps {
  airQuality: AirQualityData;
}

export const AirQuality: React.FC<AirQualityProps> = ({ airQuality }) => {
  const currentAQ = airQuality.list[0];
  const aqiLevel = getAirQualityLevel(currentAQ.main.aqi);

  const pollutants = [
    { name: 'PM2.5', value: currentAQ.components.pm2_5.toFixed(1), unit: 'μg/m³', limit: 25 },
    { name: 'PM10', value: currentAQ.components.pm10.toFixed(1), unit: 'μg/m³', limit: 50 },
    { name: 'NO₂', value: currentAQ.components.no2.toFixed(1), unit: 'μg/m³', limit: 200 },
    { name: 'O₃', value: currentAQ.components.o3.toFixed(1), unit: 'μg/m³', limit: 180 },
  ];

  return (
    <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30 dark:border-gray-700 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Air Quality Index
        </h2>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {currentAQ.main.aqi}
            </div>
            <div>
              <div className={`text-lg font-semibold ${aqiLevel.color}`}>
                {aqiLevel.level}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {aqiLevel.description}
              </div>
            </div>
          </div>
        </div>
        
        {currentAQ.main.aqi > 3 && (
          <AlertTriangle className="w-8 h-8 text-orange-500" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {pollutants.map((pollutant) => {
          const percentage = Math.min((parseFloat(pollutant.value) / pollutant.limit) * 100, 100);
          const isHigh = percentage > 80;
          
          return (
            <div key={pollutant.name} className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {pollutant.name}
                </span>
                {isHigh && <AlertTriangle className="w-4 h-4 text-orange-500" />}
              </div>
              
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {pollutant.value} {pollutant.unit}
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    percentage > 80 ? 'bg-red-500' :
                    percentage > 60 ? 'bg-orange-500' :
                    percentage > 40 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};