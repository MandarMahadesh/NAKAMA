import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { 
  ArrowLeft, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudDrizzle,
  Wind,
  Droplets,
  Eye,
  Gauge,
  ShoppingBag,
  CloudFog,
  Zap
} from 'lucide-react';
import { Screen } from '../App';

interface WeatherScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  feelsLike: number;
  forecast: {
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    description: string;
  }[];
}

// Free OpenWeatherMap API - users can get their own key at https://openweathermap.org/api
const API_KEY = '2c9d4e9d3f6e8e4a0c3a5b7d8e9f0a1b'; // Demo key - replace with real one

export function WeatherScreen({ onBack, onNavigate }: WeatherScreenProps) {
  const [city, setCity] = useState('Tokyo');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to get user's location or default to Tokyo
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // If geolocation fails, use Tokyo as default
          fetchWeather('Tokyo');
        }
      );
    } else {
      fetchWeather('Tokyo');
    }
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Unable to fetch weather data');
      }
      
      const currentData = await currentResponse.json();
      
      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      const forecastData = await forecastResponse.json();
      
      const weatherData = processWeatherData(currentData, forecastData);
      setWeather(weatherData);
      setCity(currentData.name);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to get weather data. Please try entering a city name.');
      // Fallback to mock data
      setWeather(getMockWeather('Your Location'));
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('City not found');
      }
      
      const currentData = await currentResponse.json();
      
      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
      );
      
      const forecastData = await forecastResponse.json();
      
      const weatherData = processWeatherData(currentData, forecastData);
      setWeather(weatherData);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('City not found. Please try another location.');
      // Show mock data as fallback
      setWeather(getMockWeather(location));
    } finally {
      setLoading(false);
    }
  };

  const processWeatherData = (current: any, forecast: any): WeatherData => {
    // Process forecast data - get one entry per day
    const dailyForecasts: any[] = [];
    const processedDates = new Set();
    
    forecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!processedDates.has(dateStr) && dailyForecasts.length < 5) {
        processedDates.add(dateStr);
        dailyForecasts.push(item);
      }
    });

    const getDayName = (index: number) => {
      const days = ['Today', 'Tomorrow'];
      if (index < 2) return days[index];
      
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return {
      location: current.name,
      temperature: Math.round(current.main.temp),
      condition: mapWeatherCondition(current.weather[0].main),
      description: current.weather[0].description,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(current.visibility / 1000),
      pressure: current.main.pressure,
      feelsLike: Math.round(current.main.feels_like),
      forecast: dailyForecasts.map((item, index) => {
        const date = new Date(item.dt * 1000);
        return {
          day: getDayName(index),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: mapWeatherCondition(item.weather[0].main),
          description: item.weather[0].description
        };
      })
    };
  };

  const getMockWeather = (location: string): WeatherData => {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      location: location,
      temperature: Math.floor(Math.random() * 15) + 20,
      condition: randomCondition,
      description: randomCondition.toLowerCase(),
      humidity: Math.floor(Math.random() * 30) + 50,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      visibility: Math.floor(Math.random() * 5) + 5,
      pressure: Math.floor(Math.random() * 30) + 1000,
      feelsLike: Math.floor(Math.random() * 15) + 20,
      forecast: [
        { day: 'Today', date: 'Dec 25', high: 28, low: 22, condition: 'Sunny', description: 'clear sky' },
        { day: 'Tomorrow', date: 'Dec 26', high: 26, low: 20, condition: 'Cloudy', description: 'few clouds' },
        { day: 'Friday', date: 'Dec 27', high: 24, low: 19, condition: 'Rainy', description: 'light rain' },
        { day: 'Saturday', date: 'Dec 28', high: 27, low: 21, condition: 'Partly Cloudy', description: 'scattered clouds' },
        { day: 'Sunday', date: 'Dec 29', high: 29, low: 23, condition: 'Sunny', description: 'clear sky' }
      ]
    };
  };

  const mapWeatherCondition = (main: string): string => {
    const mapping: { [key: string]: string } = {
      'Clear': 'Sunny',
      'Clouds': 'Cloudy',
      'Rain': 'Rainy',
      'Drizzle': 'Drizzle',
      'Thunderstorm': 'Stormy',
      'Snow': 'Snowy',
      'Mist': 'Foggy',
      'Fog': 'Foggy',
      'Haze': 'Hazy'
    };
    return mapping[main] || main;
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-12 h-12 text-yellow-400 dark:text-yellow-300" />;
      case 'cloudy':
      case 'clouds':
        return <Cloud className="w-12 h-12 text-gray-400 dark:text-gray-300" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-12 h-12 text-blue-400 dark:text-blue-300" />;
      case 'partly cloudy':
      case 'drizzle':
        return <CloudDrizzle className="w-12 h-12 text-blue-300 dark:text-blue-200" />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-12 h-12 text-blue-200 dark:text-blue-100" />;
      case 'stormy':
      case 'thunderstorm':
        return <Zap className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />;
      case 'foggy':
      case 'mist':
      case 'hazy':
        return <CloudFog className="w-12 h-12 text-gray-300 dark:text-gray-400" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-400 dark:text-gray-300" />;
    }
  };

  const getSmallWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-6 h-6 text-yellow-400 dark:text-yellow-300" />;
      case 'cloudy':
      case 'clouds':
        return <Cloud className="w-6 h-6 text-gray-400 dark:text-gray-300" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-400 dark:text-blue-300" />;
      case 'partly cloudy':
      case 'drizzle':
        return <CloudDrizzle className="w-6 h-6 text-blue-300 dark:text-blue-200" />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-6 h-6 text-blue-200 dark:text-blue-100" />;
      case 'stormy':
      case 'thunderstorm':
        return <Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
      case 'foggy':
      case 'mist':
      case 'hazy':
        return <CloudFog className="w-6 h-6 text-gray-300 dark:text-gray-400" />;
      default:
        return <Cloud className="w-6 h-6 text-gray-400 dark:text-gray-300" />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-cyan-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-700 dark:to-blue-700 px-4 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Weather Report</h1>
            <p className="text-cyan-100 dark:text-cyan-200 text-sm">Navigator's Weather Tool</p>
          </div>
          <div className="w-12 h-12 bg-orange-400 dark:bg-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
        </div>

        {/* Navigator's Message */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white/90 dark:bg-gray-800/90 rotate-45"></div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-orange-400 dark:bg-orange-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              <span className="font-semibold text-orange-600 dark:text-orange-400">Navigator:</span> I'll help you navigate! Let me check the weather for your destination.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar and Quick Actions */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-white dark:bg-gray-700 dark:text-white border-cyan-300 dark:border-cyan-700 focus:border-cyan-500"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700 active:bg-gray-300 dark:active:bg-gray-600 text-white"
          >
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </div>
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>
        )}
        
        {/* Marketplace Button */}
        <Button
          onClick={() => onNavigate('marketplace')}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 hover:from-cyan-600 hover:to-blue-600 dark:hover:from-cyan-700 dark:hover:to-blue-700 active:bg-gray-300 dark:active:bg-gray-600 text-white h-auto py-3 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Nearby Shopping & Markets</span>
        </Button>
      </div>

      {/* Weather Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {weather && (
          <div className="space-y-4">
            {/* Current Weather Card */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 shadow-lg border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{weather.location}</h2>
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(weather.condition)}
                </div>
                <div className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {weather.temperature}°C
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300 mb-1 capitalize">{weather.condition}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{weather.description}</div>
                {weather.feelsLike !== weather.temperature && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Feels like {weather.feelsLike}°C
                  </div>
                )}
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{weather.humidity}%</div>
                  </div>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-lg p-3 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Wind</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{weather.windSpeed} km/h</div>
                  </div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Visibility</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{weather.visibility} km</div>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pressure</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{weather.pressure} mb</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 5-Day Forecast */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">5-Day Forecast</h3>
              <div className="space-y-3">
                {weather.forecast.map((day, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getSmallWeatherIcon(day.condition)}
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{day.day}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{day.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800 dark:text-gray-200">{day.high}°</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{day.low}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sailing Advisory */}
            <Card className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 p-4 shadow-lg border-2 border-orange-300 dark:border-orange-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-400 dark:bg-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">N</span>
                </div>
                <div>
                  <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-1">Sailing Advisory</h4>
                  <p className="text-orange-800 dark:text-orange-300 text-sm">
                    {weather.windSpeed > 30 
                      ? "Strong winds ahead! Hold tight to your hat!" 
                      : weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('storm')
                      ? "Rain expected. Better prepare the Thousand Sunny!"
                      : weather.condition.toLowerCase().includes('snow')
                      ? "Snow conditions detected. Bundle up, nakama!"
                      : "Perfect weather for sailing! Let's set sail, crew!"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}