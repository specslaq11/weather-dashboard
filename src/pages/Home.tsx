import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeather } from '../context/WeatherContext';
import WeatherDashboard from '../components/WeatherDashboard';

const API_KEY = '65d5c13764a5ceef12e79d32d96d4bd6';

const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;


const Home: React.FC = () => {
  const { fetchWeather, loading, error, weatherData } = useWeather();
  const [hasFetchedWeather, setHasFetchedWeather] = useState(false);

  useEffect(() => {
    if (hasFetchedWeather) return; // Prevent further fetching if already done

    const selectedCity = sessionStorage.getItem('selectedCity');
    
    if (selectedCity) {
      fetchWeather(selectedCity);
      sessionStorage.removeItem('selectedCity');
      setHasFetchedWeather(true);
    } else if (!hasFetchedWeather && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geoResponse = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            );
            const geoData = await geoResponse.json();
            
            if (geoData && geoData.length > 0) {
              const cityName = geoData[0].name;
              fetchWeather(cityName);
              setHasFetchedWeather(true);
            }
          } catch (err) {
            console.error('Error getting location:', err);
          }
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    }
  }, [fetchWeather, hasFetchedWeather]);



  return (
    <HomeContainer>
      <h1>Current Location Weather</h1>
      {loading && <p>Loading weather data...</p>}
      {error && <p>Error: {error}</p>}
      {weatherData && <WeatherDashboard />}
    </HomeContainer>
  );
};

export default Home;