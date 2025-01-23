   // src/components/WeatherDashboard.tsx
   import React from 'react';
   import { useWeather } from '../context/WeatherContext';
   import styled from 'styled-components';
   import WeatherForecast from './WeatherForecast';
   import SearchBar from './SearchBar';

   const DashboardContainer = styled.div`
  background: #222831;
  width: calc(100vw - 250px);
  height: 100vh;
  margin: 0;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: fixed;
  left: 250px;
  top: 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1f25;
  }

  &::-webkit-scrollbar-thumb {
    background: #3a4151;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #4a5161;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const LocationName = styled.h2`
  font-size: 42px;
  color: #ffffff;
  margin: 0;
  font-weight: 600;
`;

const ChanceOfRain = styled.p`
  color: #8b95a5;
  margin: 5px 0 20px 0;
  font-size: 16px;
`;

const CurrentTemp = styled.div`
  font-size: 72px;
  color: #ffffff;
  font-weight: 500;
  margin: 20px 0;
`;


const WeatherConditions = styled.div`
  background: #2b3240;
  border-radius: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const ConditionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8b95a5;
  
  span {
    color: #ffffff;
    font-size: 20px;
    font-weight: 500;
  }
`;


const WeatherIcon = styled.img`
  width: 120px;
  height: 120px;
  margin: 10px 0;
`;

const LoadingMessage = styled.p`
  color: #6a2da3;
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
`;

const ErrorMessage = styled(LoadingMessage)`
  color: #e53e3e;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  color: #8b95a5;
  cursor: pointer;
  font-size: 24px;
  padding: 10px;
  transition: all 0.2s;
  position: absolute;
  right: 30px;
  top: 30px;

  &:hover {
    transform: scale(1.1);
    color: #ffffff;
  }

  &.active {
    color: #ffd700;
  }
`;

const WeatherDashboard: React.FC = () => {
  const { weatherData, loading, error, favorites, addToFavorites, removeFromFavorites } = useWeather();

  const isFavorite = weatherData ? favorites.some(f => f.location === weatherData.location) : false;

  const handleFavoriteClick = () => {
    if (!weatherData) return;
    
    if (isFavorite) {
      removeFromFavorites(weatherData.location);
    } else {
      addToFavorites(weatherData);
    }
  };

  if (loading) return <LoadingMessage>Loading weather data...</LoadingMessage>;
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;
  if (!weatherData) return null;

  return (
    <DashboardContainer>
      <SearchContainer>
        <SearchBar />
      </SearchContainer>
      
      <FavoriteButton 
        onClick={handleFavoriteClick}
        className={isFavorite ? 'active' : ''}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '★' : '☆'}
      </FavoriteButton>

      <div>
        <LocationName>{weatherData.location}</LocationName>
        <ChanceOfRain>Humidity: {weatherData.humidity}%</ChanceOfRain>
        <CurrentTemp>{weatherData.temperature}°</CurrentTemp>
        <WeatherIcon 
          src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
          alt={weatherData.description}
        />
      </div>

      <WeatherConditions>
        <ConditionItem>
          <i className="fas fa-thermometer-half" />
          Real Feel
          <span>{weatherData.temperature}°</span>
        </ConditionItem>
        <ConditionItem>
          <i className="fas fa-wind" />
          Wind
          <span>{weatherData.windSpeed} km/h</span>
        </ConditionItem>
        <ConditionItem>
          <i className="fas fa-tint" />
          Humidity
          <span>{weatherData.humidity}%</span>
        </ConditionItem>
        <ConditionItem>
          <i className="fas fa-sun" />
          UV Index
          <span>3</span>
        </ConditionItem>
      </WeatherConditions>

      <WeatherForecast />
    </DashboardContainer>
  );
};

export default WeatherDashboard;
