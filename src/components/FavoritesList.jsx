import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { MapPin } from 'lucide-react';

const FavoritesList = () => {
    const { favorites, setCity } = useWeather();

    if (!favorites || favorites.length === 0) return null;

    return (
        <div className="w-full relative z-10 animate-in fade-in duration-500">
            <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3 pl-2">Saved Locations</h3>
            <div className="flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
                {favorites.map((favCity) => (
                    <button
                        key={favCity}
                        onClick={() => setCity(favCity)}
                        className="snap-start shrink-0 flex items-center space-x-2 px-5 py-3 bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl shadow-sm hover:shadow-md hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300 group"
                    >
                        <MapPin className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors" />
                        <span className="font-medium text-foreground tracking-wide">{favCity}</span>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default FavoritesList;
