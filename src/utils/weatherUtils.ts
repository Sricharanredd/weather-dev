export const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌤️';
};

export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  if (unit === 'F') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC'
  });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getAirQualityLevel = (aqi: number): { level: string; color: string; description: string } => {
  const levels = [
    { level: 'Good', color: 'text-green-500', description: 'Air quality is satisfactory' },
    { level: 'Fair', color: 'text-yellow-500', description: 'Air quality is acceptable' },
    { level: 'Moderate', color: 'text-orange-500', description: 'Air quality is moderate' },
    { level: 'Poor', color: 'text-red-500', description: 'Air quality is poor' },
    { level: 'Very Poor', color: 'text-purple-500', description: 'Air quality is very poor' },
  ];
  
  return levels[Math.min(aqi - 1, 4)] || levels[0];
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const capitalizeWords = (str: string): string => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};