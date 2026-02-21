import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

const getWeatherIcon = (description, className) => {
    const desc = description.toLowerCase();

    if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain className={className} />;
    if (desc.includes('thunderstorm')) return <CloudLightning className={className} />;
    if (desc.includes('snow')) return <Snowflake className={className} />;
    if (desc.includes('cloud')) return <Cloud className={className} />;
    if (desc.includes('clear')) return <Sun className={className} />;

    return <Cloud className={className} />;
};

const Forecast = () => {
    const { forecast, loading, error } = useWeather();

    if (loading || error || !forecast || !forecast.list || forecast.list.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 text-foreground flex items-center space-x-2">
                <span>5-Day Forecast</span>
                <div className="h-px bg-border flex-1 ml-4 dissolve-edge"></div>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {forecast.list.map((item, index) => {
                    const date = new Date(item.dt * 1000);
                    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
                    const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
                    const temp = Math.round(item.main.temp);
                    const desc = item.weather[0]?.description || '';

                    return (
                        <div
                            key={item.dt}
                            className="flex flex-col items-center p-4 sm:p-6 bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/30 group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <span className="text-sm font-semibold text-foreground/80 mb-1">{dayName}</span>
                            <span className="text-xs text-foreground/50 mb-4">{monthDay}</span>

                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                                {getWeatherIcon(desc, "w-6 h-6")}
                            </div>

                            <div className="text-2xl font-bold text-foreground tabular-nums mb-1">
                                {temp}°
                            </div>
                            <div className="text-xs font-medium text-foreground/60 capitalize truncate w-full text-center">
                                {desc}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
