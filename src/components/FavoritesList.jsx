import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Star, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FavoritesList = () => {
    const { favorites, setCity, toggleFavorite, currentWeather } = useWeather();

    if (!favorites || favorites.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full relative z-10"
        >
            <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3 pl-2">Saved Locations</h3>
            <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                <AnimatePresence>
                    {favorites.map((fav) => (
                        <motion.div
                            key={fav}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 group"
                        >
                            <button
                                onClick={() => setCity(fav)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-all duration-300 ${fav === currentWeather?.name
                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-500 shadow-lg shadow-blue-500/20'
                                    : 'bg-card/60 backdrop-blur-md border-border/50 text-foreground/70 hover:border-blue-500/30 hover:bg-blue-500/5'
                                    }`}
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-sm font-semibold">{fav}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(fav);
                                    }}
                                    className="ml-1 p-1 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </motion.div>
    );
};

export default FavoritesList;
