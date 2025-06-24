import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { AirQuality } from './components/AirQuality';
import { SavedLocations } from './components/SavedLocations';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { weatherApi } from './utils/weatherApi';
import { storageUtils } from './utils/storage';
import { WeatherData, ForecastData, AirQualityData } from './types/weather';

function WeatherApp() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  const checkIfFavorite = (locationName: string) => {
    const savedLocations = storageUtils.getSavedLocations();
    return savedLocations.some(loc => 
      loc.name.toLowerCase() === locationName.toLowerCase()
    );
  };

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(city),
        weatherApi.getForecast(city),
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setCurrentLocation(`${weatherData.name}, ${weatherData.sys.country}`);
      setIsFavorite(checkIfFavorite(weatherData.name));
      
      // Fetch air quality data
      try {
        const airQualityData = await weatherApi.getAirQuality(
          weatherData.coord.lat,
          weatherData.coord.lon
        );
        setAirQuality(airQualityData);
      } catch (aqError) {
        console.warn('Air quality data not available:', aqError);
        setAirQuality(null);
      }
      
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes('404')
          ? 'City not found. Please check the spelling and try again.'
          : 'Failed to fetch weather data. Please try again.'
      );
      setCurrentWeather(null);
      setForecast(null);
      setAirQuality(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (currentWeather) {
      if (isFavorite) {
        const savedLocations = storageUtils.getSavedLocations();
        const location = savedLocations.find(loc => 
          loc.name.toLowerCase() === currentWeather.name.toLowerCase()
        );
        if (location) {
          storageUtils.removeSavedLocation(location.id);
        }
      } else {
        storageUtils.addSavedLocation({
          name: currentWeather.name,
          country: currentWeather.sys.country,
          lat: currentWeather.coord.lat,
          lon: currentWeather.coord.lon,
        });
      }
      setIsFavorite(!isFavorite);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const [weatherData, forecastData] = await Promise.all([
              weatherApi.getCurrentWeatherByCoords(latitude, longitude),
              weatherApi.getForecastByCoords(latitude, longitude),
            ]);
            
            setCurrentWeather(weatherData);
            setForecast(forecastData);
            setCurrentLocation(`${weatherData.name}, ${weatherData.sys.country}`);
            setIsFavorite(checkIfFavorite(weatherData.name));
            
            try {
              const airQualityData = await weatherApi.getAirQuality(latitude, longitude);
              setAirQuality(airQualityData);
            } catch (aqError) {
              console.warn('Air quality data not available:', aqError);
              setAirQuality(null);
            }
            
            setError(null);
          } catch {
            setError('Failed to fetch weather data for your location.');
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError('Unable to access your location. Please search for a city manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    if (!currentWeather) {
      handleSearch('New York');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">
              WeatherFlow
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleGetCurrentLocation}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
              disabled={loading}
            >
              Use My Location
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-white/80 mt-4">Loading weather data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center mb-8">
            <div className="max-w-md w-full">
              <ErrorMessage 
                message={error} 
                onRetry={() => currentLocation && handleSearch(currentLocation)}
              />
            </div>
          </div>
        )}

        {currentWeather && !loading && (
          <div className="space-y-8">
            {/* Current Weather */}
            <CurrentWeather 
              weather={currentWeather} 
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />

            {/* Forecasts */}
            {forecast && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <HourlyForecast forecast={forecast} />
                <DailyForecast forecast={forecast} />
              </div>
            )}

            {/* Air Quality */}
            {airQuality && (
              <AirQuality airQuality={airQuality} />
            )}

            {/* Saved Locations */}
            <SavedLocations 
              onLocationSelect={handleSearch}
              currentLocation={currentLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WeatherApp />
    </ThemeProvider>
  );
}

export default App;