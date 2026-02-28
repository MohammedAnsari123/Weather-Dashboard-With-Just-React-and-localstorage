import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain, CloudLightning, Snowflake, Heart, Sunrise, Sunset } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const getWeatherIcon = (description, className) => {
    const desc = description.toLowerCase();

    if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain className={className} />;
    if (desc.includes('thunderstorm')) return <CloudLightning className={className} />;
    if (desc.includes('snow')) return <Snowflake className={className} />;
    if (desc.includes('cloud')) return <Cloud className={className} />;
    if (desc.includes('clear')) return <Sun className={className} />;

    return <Cloud className={className} />;
};

const CurrentWeather = () => {
    const { currentWeather, loading, error, unit, favorites, toggleFavorite } = useWeather();

    if (loading || error || !currentWeather) return null;

    const {
        name,
        sys,
        timezone,
        main: { temp, feels_like, humidity, temp_min, temp_max },
        weather,
        wind: { speed },
    } = currentWeather;

    const primaryWeather = weather?.[0];
    const description = primaryWeather?.description || 'Unknown';

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    const isFavorite = favorites.includes(name);

    // Format sunrise/sunset according to the location's timezone offset
    const formatTime = (unixTime) => {
        if (!unixTime) return '--:--';
        // OpenWeatherMap timezone is shift in seconds from UTC
        // Create a date object manipulating the UTC time by the shift
        const d = new Date((unixTime + timezone) * 1000);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    };

    const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/20 group relative overflow-hidden"
        >

            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 dark:opacity-5 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                {getWeatherIcon(description, "w-64 h-64")}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6 md:gap-8">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 break-words max-w-[200px] sm:max-w-md">
                            {name}
                        </h2>
                        <button
                            onClick={() => toggleFavorite(name)}
                            className="p-2 rounded-full hover:bg-foreground/5 transition-colors focus:outline-none group/btn"
                            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        >
                            <Heart
                                className={cn(
                                    "w-7 h-7 transition-all duration-300",
                                    isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-foreground/40 group-hover/btn:text-red-400 group-hover/btn:scale-110"
                                )}
                            />
                        </button>
                    </div>
                    <p className="text-blue-500/80 dark:text-blue-400 font-medium tracking-wide">
                        {formattedDate}
                    </p>
                    <div className="flex items-center mt-6 space-x-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl shadow-inner">
                            {getWeatherIcon(description, "w-10 h-10")}
                        </div>
                        <p className="text-xl capitalize font-medium text-foreground/80">{description}</p>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-4 md:mt-0">
                    <div className="text-6xl sm:text-7xl font-bold text-foreground tabular-nums tracking-tighter flex items-start">
                        {Math.round(temp)}
                        <span className="text-3xl sm:text-4xl font-semibold opacity-60 mt-2">°</span>
                    </div>
                    <div className="flex space-x-4 mt-2 text-foreground/60 text-sm font-medium">
                        <span className="flex items-center space-x-1">
                            <span className="text-blue-500">H:</span> <span>{Math.round(temp_max)}°</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <span className="text-blue-500">L:</span> <span>{Math.round(temp_min)}°</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4 relative z-10 w-full">
                <WeatherDetailItem
                    icon={<Thermometer className="w-5 h-5 text-red-500" />}
                    label="Feels Like"
                    value={`${Math.round(feels_like)}°`}
                />
                <WeatherDetailItem
                    icon={<Droplets className="w-5 h-5 text-blue-500" />}
                    label="Humidity"
                    value={`${humidity}%`}
                />
                <WeatherDetailItem
                    icon={<Wind className="w-5 h-5 text-teal-500" />}
                    label="Wind"
                    value={`${speed.toFixed(1)} ${speedUnit}`}
                />
                <WeatherDetailItem
                    icon={<Sun className="w-5 h-5 text-yellow-500" />}
                    label="Condition"
                    value={primaryWeather.main}
                />
                <WeatherDetailItem
                    icon={<Sunrise className="w-5 h-5 text-orange-400" />}
                    label="Sunrise"
                    value={formatTime(sys?.sunrise)}
                />
                <WeatherDetailItem
                    icon={<Sunset className="w-5 h-5 text-indigo-400" />}
                    label="Sunset"
                    value={formatTime(sys?.sunset)}
                />
            </div>
        </motion.div>
    );
};

const WeatherDetailItem = ({ icon, label, value }) => (
    <motion.div
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        className="flex items-center p-3 sm:p-4 rounded-2xl bg-foreground/5 space-x-3 sm:space-x-4 hover:bg-foreground/10 transition-colors duration-300 w-full overflow-hidden"
    >
        <div className="p-2 bg-background rounded-xl shadow-sm shrink-0 flex items-center justify-center">
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-foreground/50 uppercase tracking-wider truncate pb-0.5">{label}</p>
            <p className="text-sm sm:text-lg font-semibold text-foreground truncate leading-tight">{value}</p>
        </div>
    </motion.div>
);

export default CurrentWeather;
