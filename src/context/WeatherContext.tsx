import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';

const API_KEY = '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  tempMin: number;
  tempMax: number;
}

interface ForecastData {
  time: string;
  temperature: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
}

interface WeatherContextType {
  weatherData: WeatherData | null;
  hourlyForecast: ForecastData[];
  dailyForecast: ForecastData[];
  loading: boolean;
  error: string | null;
  fetchWeather: (query: string) => Promise<void>;
  favorites: WeatherData[];
  addToFavorites: (city: WeatherData) => void;
  removeFromFavorites: (cityName: string) => void;
  setAutoLocationEnabled: (enabled: boolean) => void;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<ForecastData[]>([]);
  const [dailyForecast, setDailyForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<WeatherData[]>(() => {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [autoLocationEnabled, setAutoLocationEnabled] = useState(true);
  const isInitialMount = useRef(true);
  const hasLoadedLocation = useRef(false);

  const fetchWeather = useCallback(async (query: string) => {
    setAutoLocationEnabled(false);
    setLoading(true);
    setError(null);
    try {
      // Current weather
      const weatherUrl = `${BASE_URL}/weather?q=${query}&appid=${API_KEY}&units=metric`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherData.message || 'City not found');
      }

      // Fetch forecast data
      const forecastUrl = `${BASE_URL}/forecast?q=${query}&appid=${API_KEY}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      // Process current weather with humidity
      const currentWeather = {
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        location: weatherData.name,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        icon: weatherData.weather[0].icon,
        tempMin: Math.round(weatherData.main.temp_min),
        tempMax: Math.round(weatherData.main.temp_max)
      };

      setWeatherData(currentWeather);

      // Process 3-hour intervals for today
      const hourlyForecasts = forecastData.list
        .slice(0, 8)
        .map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }));

      setHourlyForecast(hourlyForecasts);

      // Process daily forecast with min/max temps
      const dailyMap = forecastData.list.reduce((acc: Map<string, any>, item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString();
        
        if (!acc.has(dayKey)) {
          acc.set(dayKey, {
            dayKey,
            time: date.toLocaleDateString([], { weekday: 'short' }),
            temperature: Math.round(item.main.temp),
            tempMin: Math.round(item.main.temp_min),
            tempMax: Math.round(item.main.temp_max),
            description: item.weather[0].description,
            icon: item.weather[0].icon
          });
        } else {
          const existing = acc.get(dayKey);
          acc.set(dayKey, {
            ...existing,
            tempMin: Math.min(existing.tempMin, Math.round(item.main.temp_min)),
            tempMax: Math.max(existing.tempMax, Math.round(item.main.temp_max))
          });
        }
        return acc;
      }, new Map());

      const dailyData = Array.from(dailyMap.values()) as ForecastData[];
      setDailyForecast(dailyData);

      // Update favorites if this city is favorited
      setFavorites(prev => {
        const updatedFavorites = prev.map(fav => 
          fav.location === currentWeather.location ? currentWeather : fav
        );
        localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
        return updatedFavorites;
      });

    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
      setHourlyForecast([]);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const selectedCity = sessionStorage.getItem('selectedCity');
    
    if (selectedCity) {
      fetchWeather(selectedCity);
      sessionStorage.removeItem('selectedCity');
      hasLoadedLocation.current = true;
    } else if (isInitialMount.current && autoLocationEnabled && !hasLoadedLocation.current) {
      isInitialMount.current = false;
      hasLoadedLocation.current = true;
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
              fetchWeather(data.name);
            }
          } catch (err) {
            console.error('Error fetching location weather:', err);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          fetchWeather('London');
        }
      );
    }
  }, [autoLocationEnabled, fetchWeather]);

  const addToFavorites = (city: WeatherData) => {
    setFavorites(prev => {
      const newFavorites = [...prev, city];
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFromFavorites = (cityName: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(city => city.location !== cityName);
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <WeatherContext.Provider 
      value={{
        weatherData,
        hourlyForecast,
        dailyForecast,
        loading,
        error,
        fetchWeather,
        favorites,
        addToFavorites,
        removeFromFavorites,
        setAutoLocationEnabled
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}; 