import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import FavoritesList from './FavoritesList';
import HourlyChart from './HourlyChart';
import WeatherMap from './WeatherMap';
import WeatherBackground from './WeatherBackground';
import { CloudSun, Moon, Sun, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherDashboard = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { loading, error, currentWeather, unit, toggleUnit } = useWeather();

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-start p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
            <WeatherBackground />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-7xl mx-auto space-y-8 relative z-10"
            >

                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/40">
                    <div className="flex items-center space-x-3 group w-full md:w-auto justify-center md:justify-start">
                        <div className="p-2.5 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors duration-300">
                            <CloudSun className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">WeatherDash</h1>
                            <p className="text-sm font-medium text-foreground/50 tracking-wide uppercase">Real-time forecasts</p>
                        </div>
                    </div>

                    <div className="flex items-center w-full md:w-auto space-x-3 md:space-x-4">
                        <div className="flex-1 md:w-80">
                            <SearchBar />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={toggleUnit}
                                className="p-3 bg-card border border-border rounded-xl font-bold text-foreground hover:bg-foreground/5 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0 w-12 flex justify-center items-center"
                                aria-label="Toggle temperature unit"
                                title="Toggle °C / °F"
                            >
                                °{unit === 'metric' ? 'C' : 'F'}
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-foreground/5 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="w-full min-h-[400px] flex flex-col relative">

                    {error && (
                        <div className="w-full p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-3 isolate">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center flex-1 py-20 space-y-4">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                            <p className="text-foreground/60 font-medium animate-pulse">Gathering meteorological data...</p>
                        </div>
                    ) : currentWeather ? (
                        <div className="space-y-8 fade-in animate-in duration-500 flex flex-col w-full">
                            <FavoritesList />

                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
                                {/* Left Column: Current Weather & Map */}
                                <div className="xl:col-span-5 space-y-8 flex flex-col h-full">
                                    <CurrentWeather />
                                    <div className="flex-1 min-h-[300px]">
                                        <WeatherMap />
                                    </div>
                                </div>

                                {/* Right Column: Charts & Forecast */}
                                <div className="xl:col-span-7 space-y-8 flex flex-col h-full">
                                    <HourlyChart />
                                    <div className="flex-1">
                                        <Forecast />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        !error && (
                            <div className="flex flex-col items-center justify-center flex-1 py-20 opacity-50 text-center space-y-4">
                                <CloudSun className="w-24 h-24 text-foreground/20" />
                                <p className="text-xl font-medium text-foreground/60 max-w-sm">Search for a city to see the current weather and forecast.</p>
                            </div>
                        )
                    )}
                </main>
            </motion.div>
        </div>
    );
};

export default WeatherDashboard;
