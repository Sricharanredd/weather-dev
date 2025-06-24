import React from 'react';
import { ForecastData } from '../types/weather';
import { formatTemperature } from '../utils/weatherUtils';

interface HourlyForecastProps {
  forecast: ForecastData;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
  // Take first 24 hours (8 * 3-hour intervals)
  const hourlyData = forecast.list.slice(0, 8);

  return (
    <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30 dark:border-gray-700 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        24-Hour Forecast
      </h2>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4 min-w-max-content">
          {hourlyData.map((hour, index) => {
            const time = new Date(hour.dt * 1000);
            const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
            
            return (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-700/30 rounded-2xl min-w-[120px] hover:bg-white/20 dark:hover:bg-gray-700/40 transition-colors"
              >
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {index === 0 ? 'Now' : time.toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    hour12: true 
                  })}
                </div>
                
                <img
                  src={iconUrl}
                  alt={hour.weather[0].description}
                  className="w-12 h-12 mb-2"
                />
                
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {formatTemperature(hour.main.temp)}
                </div>
                
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {Math.round(hour.pop * 100)}%
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                  {Math.round(hour.wind.speed * 3.6)} km/h
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};