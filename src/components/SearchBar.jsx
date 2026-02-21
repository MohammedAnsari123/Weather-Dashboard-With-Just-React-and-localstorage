import React, { useState, useRef, useEffect } from 'react';
import { Search, Navigation, Clock, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { setCity, fetchByLocation, searchHistory, clearHistory } = useWeather();
    const dropdownRef = useRef(null);

    // Handle clicking outside to close Dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() !== '') {
            setCity(query.trim());
            setQuery('');
            setIsFocused(false);
        }
    };

    const handleHistoryClick = (historyCity) => {
        setCity(historyCity);
        setQuery('');
        setIsFocused(false);
    };

    return (
        <div className="flex w-full max-w-md space-x-2 relative" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-2 sm:py-3 bg-card border border-border rounded-xl sm:rounded-2xl leading-5 
            text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg relative z-0 text-sm sm:text-base"
                    placeholder="Search for a city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                <button
                    type="submit"
                    className="absolute inset-y-1 right-1 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm z-10"
                >
                    Search
                </button>

                {/* Search History Dropdown */}
                {isFocused && searchHistory.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 py-2 bg-card border border-border rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between px-4 pb-2 mb-2 border-b border-border/50">
                            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Recent Searches
                            </span>
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); clearHistory(); }}
                                className="text-xs text-red-500 hover:text-red-400 transition-colors flex items-center"
                            >
                                <X className="w-3 h-3 mr-1" /> Clear
                            </button>
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                            {searchHistory.map((historyCity) => (
                                <li key={historyCity}>
                                    <button
                                        type="button"
                                        onClick={() => handleHistoryClick(historyCity)}
                                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors flex items-center"
                                    >
                                        <Search className="w-4 h-4 text-foreground/30 mr-3 shrink-0" />
                                        <span className="truncate">{historyCity}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
            <button
                type="button"
                onClick={fetchByLocation}
                title="Use My Location"
                className="p-2 sm:p-3 bg-card border border-border rounded-xl sm:rounded-2xl text-blue-500 hover:bg-blue-500/10 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0 flex items-center justify-center"
            >
                <Navigation className="w-5 h-5" />
            </button>
        </div>
    );
};

export default SearchBar;
