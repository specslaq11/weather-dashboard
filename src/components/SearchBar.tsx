import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useWeather } from '../context/WeatherContext';
import debounce from 'lodash/debounce';

const API_KEY = '65d5c13764a5ceef12e79d32d96d4bd6';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 0 20px 0;
  box-sizing: border-box;
  align-self: flex-start;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 2px solid rgba(138, 43, 226, 0.2);
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: white;
  
  &:focus {
    border-color: #8a2be2;
    box-shadow: 0 0 15px rgba(138, 43, 226, 0.15);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  max-height: 250px;
  overflow-y: auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 5px 0;
  list-style: none;
  z-index: 1000;
`;

const SuggestionItem = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  color: #4a5568;

  &:hover {
    background-color: rgba(138, 43, 226, 0.1);
    color: #8a2be2;
  }
`;

interface City {
  name: string;
  country: string;
  state?: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { fetchWeather } = useWeather();

  const fetchCitySuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((input: string) => fetchCitySuggestions(input), 300),
    []
  );

  useEffect(() => {
    if (query) {
      debouncedFetchSuggestions(query);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, debouncedFetchSuggestions]);

  const handleSuggestionClick = (city: City) => {
    // Update query and fetch weather
    const cityName = city.state 
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
    
    setQuery(cityName);
    fetchWeather(city.name);

    // Immediately hide suggestions
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchWeather(query);
      setShowSuggestions(false);
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city name..."
          onFocus={() => query && setShowSuggestions(true)}
        />
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((city, index) => (
            <SuggestionItem
              key={`${city.name}-${city.country}-${index}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(city)}
            >
              {city.state 
                ? `${city.name}, ${city.state}, ${city.country}`
                : `${city.name}, ${city.country}`}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </SearchContainer>
  );
};

export default SearchBar; 