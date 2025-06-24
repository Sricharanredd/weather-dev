import React from 'react';
import { 
  Eye, 
  Droplets, 
  Wind, 
  Sunrise, 
  Sunset, 
  Gauge, 
  Thermometer,
  Heart,
  HeartOff
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { formatTemperature, formatTime, getWindDirection, capitalizeWords } from '../utils/weatherUtils';

interface CurrentWeatherProps {
  weather: WeatherData;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  weather, 
  onToggleFavorite,
  isFavorite = false 
}) => {
  const weatherCondition = weather.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weatherCondition.icon}@4x.png`;

  return (
    <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/30 dark:border-gray-700 shadow-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {weather.name}
            </h1>
            <span className="text-lg text-gray-600 dark:text-gray-400">
              {weather.sys.country}
            </span>
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? (
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                ) : (
                  <HeartOff className="w-6 h-6 text-gray-400" />
                )}
              </button>
            )}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 capitalize">
            {capitalizeWords(weatherCondition.description)}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <img
            src={iconUrl}
            alt={weatherCondition.description}
            className="w-20 h-20"
          />
          <div className="text-right">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {formatTemperature(weather.main.temp)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Feels like {formatTemperature(weather.main.feels_like)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">High/Low</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTemperature(weather.main.temp_max)} / {formatTemperature(weather.main.temp_min)}
          </div>
        </div>

        <div className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {weather.main.humidity}%
          </div>
        </div>

        <div className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Wind</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {Math.round(weather.wind.speed * 3.6)} km/h {getWindDirection(weather.wind.deg)}
          </div>
        </div>

        <div className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Pressure</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {weather.main.pressure} hPa
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Visibility</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {(weather.visibility / 1000).toFixed(1)} km
          </div>
        </div>

        <div className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunrise className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Sunrise</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTime(weather.sys.sunrise, weather.timezone)}
          </div>
        </div>

        <div className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunset className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Sunset</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTime(weather.sys.sunset, weather.timezone)}
          </div>
        </div>
      </div>
    </div>
  );
};