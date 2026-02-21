import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeather } from '../context/WeatherContext';

const HourlyChart = () => {
    const { forecast, unit } = useWeather();

    if (!forecast || !forecast.hourlyList || forecast.hourlyList.length === 0) return null;

    // Prepare data for Recharts
    const data = forecast.hourlyList.map(item => {
        const date = new Date(item.dt * 1000);
        return {
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(item.main.temp),
            description: item.weather[0]?.description
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
                    <p className="font-semibold mb-1 text-foreground">{label}</p>
                    <p className="text-blue-500 font-bold text-lg">
                        {payload[0].value}°{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    <p className="text-sm text-foreground/60 capitalize mt-1">
                        {payload[0].payload.description}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden group">
            <h3 className="text-xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 mb-6">
                24-Hour Forecast
            </h3>

            <div className="h-[250px] w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5 text-foreground" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.2 }} />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HourlyChart;
