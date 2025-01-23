import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useWeather } from '../context/WeatherContext';
import { useNavigate } from 'react-router-dom';

const CitiesContainer = styled.div`
  background: #222831;
  width: calc(100vw - 250px);
  height: 100vh;
  margin: 0;
  padding: 30px;
  box-sizing: border-box;
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
`;

const CitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const CityCard = styled.div`
  background: #2b3240;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CityName = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 24px;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Temperature = styled.div`
  font-size: 36px;
  color: #ffffff;
`;

const WeatherIcon = styled.img`
  width: 64px;
  height: 64px;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #3a4151;
`;

const DetailItem = styled.div`
  color: #8b95a5;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const NoFavorites = styled.div`
  color: #8b95a5;
  text-align: center;
  padding: 40px;
  font-size: 18px;
`;

const Cities: React.FC = () => {
  const { favorites, setAutoLocationEnabled } = useWeather();
  const navigate = useNavigate();

  useEffect(() => {
    setAutoLocationEnabled(false);
  }, [setAutoLocationEnabled]);

  const handleCityClick = (cityName: string) => {
    sessionStorage.setItem('selectedCity', cityName);
    navigate('/');
  };

  return (
    <CitiesContainer>
      <h1>Favorite Cities</h1>
      {favorites.length === 0 ? (
        <NoFavorites>
          No favorite cities yet. Add some from the home page!
        </NoFavorites>
      ) : (
        <CitiesGrid>
          {favorites.map((city) => (
            <CityCard 
              key={city.location}
              onClick={() => handleCityClick(city.location)}
            >
              <CityName>{city.location}</CityName>
              <WeatherInfo>
                <Temperature>{city.temperature}°</Temperature>
                <WeatherIcon 
                  src={`http://openweathermap.org/img/wn/${city.icon}@2x.png`}
                  alt={city.description}
                />
              </WeatherInfo>
              <WeatherDetails>
                <DetailItem>
                  <i className="fas fa-wind" />
                  {city.windSpeed} km/h
                </DetailItem>
                <DetailItem>
                  <i className="fas fa-tint" />
                  {city.humidity}%
                </DetailItem>
                <DetailItem>
                  <i className="fas fa-thermometer-half" />
                  {city.description}
                </DetailItem>
                <DetailItem>
                  <i className="fas fa-cloud" />
                  {city.temperature}°
                </DetailItem>
              </WeatherDetails>
            </CityCard>
          ))}
        </CitiesGrid>
      )}
    </CitiesContainer>
  );
};

export default Cities; 