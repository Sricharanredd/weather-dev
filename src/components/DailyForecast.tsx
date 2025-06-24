import React from 'react';
import { ForecastData } from '../types/weather';
import { formatTemperature, formatDate } from '../utils/weatherUtils';

interface DailyForecastProps {
  forecast: ForecastData;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ forecast }) => {
  // Group forecast by day and get daily min/max temperatures
  const dailyData = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!acc[date]) {
      acc[date] = {
        date: item.dt,
        temps: [item.main.temp],
        weather: item.weather[0],
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        pop: item.pop,
      };
    } else {
      acc[date].temps.push(item.main.temp);
      // Use weather from midday (closest to 12:00)
      const currentHour = new Date(item.dt * 1000).getHours();
      const existingHour = new Date(acc[date].date * 1000).getHours();
      if (Math.abs(currentHour - 12) < Math.abs(existingHour - 12)) {
        acc[date].weather = item.weather[0];
        acc[date].date = item.dt;
      }
    }
    
    return acc;
  }, {} as any);

  const dailyForecast = Object.values(dailyData).slice(0, 7).map((day: any) => ({
    ...day,
    minTemp: Math.min(...day.temps),
    maxTemp: Math.max(...day.temps),
  }));

  return (
    <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30 dark:border-gray-700 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        7-Day Forecast
      </h2>
      
      <div className="space-y-4">
        {dailyForecast.map((day, index) => {
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`;
          
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/10 dark:bg-gray-700/30 rounded-2xl hover:bg-white/20 dark:hover:bg-gray-700/40 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-20 text-gray-900 dark:text-white font-medium">
                  {index === 0 ? 'Today' : formatDate(day.date)}
                </div>
                
                <img
                  src={iconUrl}
                  alt={day.weather.description}
                  className="w-10 h-10"
                />
                
                <div className="flex-1">
                  <div className="text-gray-900 dark:text-white font-medium capitalize">
                    {day.weather.description}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(day.pop * 100)}% chance of rain
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {day.humidity}% humidity
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(day.windSpeed * 3.6)} km/h
                </div>
                
                <div className="flex items-center gap-2 min-w-[100px] justify-end">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTemperature(day.minTemp)}
                  </span>
                  <div className="w-16 h-2 bg-gradient-to-r from-blue-300 to-red-300 rounded-full mx-2"></div>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatTemperature(day.maxTemp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};