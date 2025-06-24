import axios from 'axios';
import { WeatherData, ForecastData, AirQualityData } from '../types/weather';

const API_KEY = '71a64e9759d187a497bed956f774b893';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const weatherApi = {
  getCurrentWeather: async (city: string): Promise<WeatherData> => {
    const response = await api.get('/weather', {
      params: { q: city },
    });
    return response.data;
  },

  getCurrentWeatherByCoords: async (lat: number, lon: number): Promise<WeatherData> => {
    const response = await api.get('/weather', {
      params: { lat, lon },
    });
    return response.data;
  },

  getForecast: async (city: string): Promise<ForecastData> => {
    const response = await api.get('/forecast', {
      params: { q: city },
    });
    return response.data;
  },

  getForecastByCoords: async (lat: number, lon: number): Promise<ForecastData> => {
    const response = await api.get('/forecast', {
      params: { lat, lon },
    });
    return response.data;
  },

  getAirQuality: async (lat: number, lon: number): Promise<AirQualityData> => {
    const response = await api.get('/air_pollution', {
      params: { lat, lon },
    });
    return response.data;
  },

  searchCities: async (query: string): Promise<Array<{ name: string; country: string; lat: number; lon: number }>> => {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: { 
        q: query, 
        limit: 5,
        appid: API_KEY
      },
    });
    return response.data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  },
};