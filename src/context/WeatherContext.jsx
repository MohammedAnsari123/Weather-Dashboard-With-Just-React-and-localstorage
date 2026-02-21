import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWeather, fetchForecast } from '../services/weatherApi';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
    const [city, setCity] = useState(localStorage.getItem('lastCity') || 'London');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState(localStorage.getItem('weatherUnit') || 'metric');

    // Advanced features state
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('weatherFavorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('weatherHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const getWeatherData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [weatherData, forecastData] = await Promise.all([
                    fetchWeather(city, null, null, unit),
                    fetchForecast(city, null, null, unit)
                ]);

                // Ensure that mock delay sets this properly
                setCurrentWeather(weatherData);
                setForecast(forecastData);
                localStorage.setItem('lastCity', city);

                // Add to history if unique
                if (city !== 'Your Location') {
                    setSearchHistory(prev => {
                        const newHistory = [city, ...prev.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
                        localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
                        return newHistory;
                    });
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch weather data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        getWeatherData();
    }, [city]);

    const fetchByLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const [weatherData, forecastData] = await Promise.all([
                        fetchWeather(null, latitude, longitude, unit),
                        fetchForecast(null, latitude, longitude, unit)
                    ]);

                    setCurrentWeather(weatherData);
                    setForecast(forecastData);

                    if (weatherData && weatherData.name) {
                        setCity(weatherData.name);
                        localStorage.setItem('lastCity', weatherData.name);
                    }
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to fetch weather for your location. Please try again.');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Unable to retrieve your location. Check permissions.');
                setLoading(false);
            },
            { timeout: 10000 }
        );
    };

    // Advanced features handlers
    const toggleUnit = () => {
        const newUnit = unit === 'metric' ? 'imperial' : 'metric';
        setUnit(newUnit);
        localStorage.setItem('weatherUnit', newUnit);
    };

    const toggleFavorite = (cityName) => {
        setFavorites(prev => {
            const isFav = prev.includes(cityName);
            const newFavs = isFav ? prev.filter(c => c !== cityName) : [...prev, cityName];
            localStorage.setItem('weatherFavorites', JSON.stringify(newFavs));
            return newFavs;
        });
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('weatherHistory');
    }

    // Effect to re-fetch when unit changes
    useEffect(() => {
        if (!loading) {
            // Trigger a re-fetch with new unit by essentially forcing the effect to run
            // We just need to ensure the variables are updated. The city dependency already handles refetch,
            // but for unit toggle we might want to manually fetch if city hasn't changed.
            const refetch = async () => {
                setLoading(true);
                try {
                    let weatherData, forecastData;
                    // If current is coordinates based
                    if (currentWeather && currentWeather.name === "Your Location" && !city) {
                        // For simplicity, just refetch by city name. In a real app we'd store the last used coords.
                        [weatherData, forecastData] = await Promise.all([
                            fetchWeather(city, null, null, unit),
                            fetchForecast(city, null, null, unit)
                        ]);
                    } else {
                        const searchCity = (currentWeather && currentWeather.name) || city;
                        [weatherData, forecastData] = await Promise.all([
                            fetchWeather(searchCity, null, null, unit),
                            fetchForecast(searchCity, null, null, unit)
                        ]);
                    }
                    setCurrentWeather(weatherData);
                    setForecast(forecastData);
                } catch (e) {
                    console.error("Failed to refetch with new units", e);
                } finally {
                    setLoading(false);
                }
            };
            refetch();
        }
    }, [unit]);

    return (
        <WeatherContext.Provider value={{
            city,
            setCity,
            currentWeather,
            forecast,
            loading,
            error,
            unit,
            toggleUnit,
            favorites,
            toggleFavorite,
            searchHistory,
            clearHistory,
            fetchByLocation
        }}>
            {children}
        </WeatherContext.Provider>
    );
};
