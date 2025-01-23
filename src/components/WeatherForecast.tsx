import React from 'react';
import styled from 'styled-components';
import { useWeather } from '../context/WeatherContext';

const ForecastContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const TodaysForecast = styled.div`
  flex: 2;
  background: #2b3240;
  border-radius: 15px;
  padding: 20px;
`;

const WeeklyForecast = styled.div`
  flex: 1;
  background: #2b3240;
  border-radius: 15px;
  padding: 20px;
`;

const ForecastTitle = styled.h3`
  color: #8b95a5;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const HourlyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1f25;
  }

  &::-webkit-scrollbar-thumb {
    background: #3a4151;
    border-radius: 4px;
  }
`;

const HourlyCard = styled.div`
  text-align: center;
  padding: 10px;
  min-width: 100px;
  border-right: 1px solid #3a4151;

  &:last-child {
    border-right: none;
  }
`;

const DailyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DailyItem = styled.div`
  display: grid;
  grid-template-columns: 80px 40px 1fr 100px;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #3a4151;

  &:last-child {
    border-bottom: none;
  }
`;

const Time = styled.span`
  color: #8b95a5;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
`;

const Temperature = styled.span`
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  display: block;
  margin-top: 8px;
`;

const WeatherIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const Condition = styled.span`
  color: #8b95a5;
  font-size: 14px;
`;

const HighLow = styled.span`
  color: #ffffff;
  font-size: 14px;
  text-align: right;
  
  .low {
    color: #8b95a5;
    margin-left: 4px;
  }
`;

const WeatherForecast: React.FC = () => {
  const { hourlyForecast, dailyForecast } = useWeather();

  return (
    <ForecastContainer>
      <TodaysForecast>
        <ForecastTitle>TODAY'S FORECAST</ForecastTitle>
        <HourlyGrid>
          {hourlyForecast.slice(0, 6).map((forecast, index) => (
            <HourlyCard key={index}>
              <Time>{forecast.time}</Time>
              <WeatherIcon
                src={`http://openweathermap.org/img/wn/${forecast.icon}.png`}
                alt={forecast.description}
              />
              <Temperature>{forecast.temperature}°</Temperature>
            </HourlyCard>
          ))}
        </HourlyGrid>
      </TodaysForecast>

      <WeeklyForecast>
        <ForecastTitle>7-DAY FORECAST</ForecastTitle>
        <DailyList>
          {dailyForecast.map((forecast, index) => (
            <DailyItem key={index}>
              <Time>{index === 0 ? 'Today' : forecast.time}</Time>
              <WeatherIcon
                src={`http://openweathermap.org/img/wn/${forecast.icon}.png`}
                alt={forecast.description}
              />
              <Condition>{forecast.description}</Condition>
              <HighLow>
                {forecast.tempMax}°<span className="low">/{forecast.tempMin}°</span>
              </HighLow>
            </DailyItem>
          ))}
        </DailyList>
      </WeeklyForecast>
    </ForecastContainer>
  );
};

export default WeatherForecast; 