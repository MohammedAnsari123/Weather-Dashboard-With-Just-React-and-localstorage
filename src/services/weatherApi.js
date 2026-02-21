import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const api = axios.create({
    baseURL: BASE_URL,
});

// Mock data generator for fallback if no API key is provided
const generateMockData = (city, lat = 40.7128, lon = -74.0060, units = 'metric') => {
    // Generate values assuming metric, then convert if imperial
    const tempMain = 20 + Math.random() * 10;
    const isImperial = units === 'imperial';

    const convertTemp = (t) => isImperial ? (t * 9 / 5) + 32 : t;
    const convertSpeed = (s) => isImperial ? s * 2.237 : s; // m/s to mph

    return {
        weather: {
            name: city,
            sys: { sunrise: Date.now() / 1000 - 3600 * 12, sunset: Date.now() / 1000 + 3600 * 2 },
            timezone: 0,
            coord: { lat, lon },
            main: {
                temp: convertTemp(tempMain),
                feels_like: convertTemp(tempMain + 2),
                humidity: 60 + Math.floor(Math.random() * 20),
                temp_min: convertTemp(tempMain - 5),
                temp_max: convertTemp(tempMain + 5),
            },
            weather: [
                {
                    main: 'Clear',
                    description: 'clear sky',
                    icon: '01d',
                }
            ],
            wind: {
                speed: convertSpeed(3 + Math.random() * 5),
            },
        },
        forecast: {
            list: Array.from({ length: 40 }).map((_, i) => ({
                dt: Date.now() / 1000 + i * 10800,
                main: {
                    temp: convertTemp(18 + Math.random() * 12),
                    humidity: 50 + Math.random() * 30,
                },
                weather: [
                    {
                        main: i % 3 === 0 ? 'Clouds' : 'Clear',
                        description: i % 3 === 0 ? 'scattered clouds' : 'clear sky',
                        icon: i % 3 === 0 ? '03d' : '01d',
                    }
                ],
                wind: { speed: convertSpeed(2 + Math.random() * 4) }
            }))
        }
    };
};

export const fetchWeather = async (city, lat = null, lon = null, units = 'metric') => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
        // Return mock data after a short simulated delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let mockCity = city;
        let finalLat = lat !== null ? lat : 40.7128; // Default NY
        let finalLon = lon !== null ? lon : -74.0060;

        // Attempt to get a real city name using a free reverse geocoding API for the mock
        if (!city && lat !== null && lon !== null) {
            try {
                // Using nominatim for free reverse geocoding in mock mode
                const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                mockCity = geoResponse.data.address.city || geoResponse.data.address.town || geoResponse.data.address.village || "Your Location";
            } catch (e) {
                mockCity = "Your Location";
            }
        } else if (city && lat === null && lon === null) {
            // Forward geocode to get map coordinates for mock data when searched by city name
            try {
                const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
                if (geoResponse.data && geoResponse.data.length > 0) {
                    finalLat = parseFloat(geoResponse.data[0].lat);
                    finalLon = parseFloat(geoResponse.data[0].lon);
                }
            } catch (e) {
                console.error("Mock geocoding failed", e);
            }
        } else if (!city) {
            mockCity = "Your Location";
        }

        const mock = generateMockData(mockCity, finalLat, finalLon, units);
        return mock.weather;
    }

    const params = {
        appid: API_KEY,
        units: units,
    };

    if (lat !== null && lon !== null) {
        params.lat = lat;
        params.lon = lon;
    } else {
        params.q = city;
    }

    const response = await api.get('/weather', { params });
    return response.data;
};

export const fetchForecast = async (city, lat = null, lon = null, units = 'metric') => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
        await new Promise(resolve => setTimeout(resolve, 800));

        let mockCity = city;
        let finalLat = lat !== null ? lat : 40.7128;
        let finalLon = lon !== null ? lon : -74.0060;

        if (!city && lat !== null && lon !== null) {
            try {
                const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                mockCity = geoResponse.data.address.city || geoResponse.data.address.town || geoResponse.data.address.village || "Your Location";
            } catch (e) {
                mockCity = "Your Location";
            }
        } else if (city && lat === null && lon === null) {
            try {
                const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
                if (geoResponse.data && geoResponse.data.length > 0) {
                    finalLat = parseFloat(geoResponse.data[0].lat);
                    finalLon = parseFloat(geoResponse.data[0].lon);
                }
            } catch (e) {
                console.error("Mock geocoding failed", e);
            }
        } else if (!city) {
            mockCity = "Your Location";
        }

        const mock = generateMockData(mockCity, finalLat, finalLon, units);
        return responseDataToDailyForecast(mock.forecast);
    }

    const params = {
        appid: API_KEY,
        units: units,
    };

    if (lat !== null && lon !== null) {
        params.lat = lat;
        params.lon = lon;
    } else {
        params.q = city;
    }

    const response = await api.get('/forecast', { params });

    return responseDataToDailyForecast(response.data);
};

// OpenWeather free tier returns 5 day / 3 hour forecast (list of 40 items).
// Let's extract exactly one reading per day to simulate a daily forecast,
// and also grab the next 8 3-hourly blocks for our 24h chart.
const responseDataToDailyForecast = (data) => {
    const dailyData = [];
    const hourlyData = [];
    const handledDays = new Set();

    for (const item of data.list) {
        // Collect first 8 items for the 24-hour chart
        if (hourlyData.length < 8) {
            hourlyData.push(item);
        }

        const dateStr = new Date(item.dt * 1000).toDateString();
        if (!handledDays.has(dateStr)) {
            handledDays.add(dateStr);
            dailyData.push(item);
            if (dailyData.length === 5 && hourlyData.length === 8) break;
        }
    }

    return { list: dailyData, hourlyList: hourlyData };
};
