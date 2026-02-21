import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../context/WeatherContext';
import L from 'leaflet';
import { useTheme } from '../context/ThemeContext';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map centering when coordinates change
const MapUpdater = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        if (lat !== undefined && lon !== undefined) {
            map.flyTo([lat, lon], 10, { duration: 1.5 });
        }
    }, [lat, lon, map]);
    return null;
};

const WeatherMap = () => {
    const { currentWeather } = useWeather();
    const { isDarkMode } = useTheme();
    const [renderMap, setRenderMap] = useState(false);

    // Add a slight delay to rendering map to ensure container dimensions are calculated
    useEffect(() => {
        const timer = setTimeout(() => setRenderMap(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!currentWeather || !currentWeather.coord || !renderMap) return null;

    const { lat, lon } = currentWeather.coord;
    const center = [lat, lon];

    // Standard OpenStreetMap styling
    const mapUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
        <div className="w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-2 shadow-2xl relative overflow-hidden group h-[300px] lg:h-full min-h-[300px]">
            <div className="absolute top-4 left-6 z-[400] bg-card/90 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm pointer-events-none fade-in">
                <span className="text-sm font-semibold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                    Radar Map
                </span>
            </div>

            <div className="w-full h-full rounded-2xl overflow-hidden isolate relative z-0">
                <MapContainer center={center} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution={attribution}
                        url={mapUrl}
                        className="transition-all duration-700"
                    />
                    <Marker position={center}>
                        <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
                            <div className="font-sans font-medium text-foreground p-1 text-center">
                                {currentWeather.name}
                            </div>
                        </Popup>
                    </Marker>
                    <MapUpdater lat={lat} lon={lon} />
                </MapContainer>
            </div>

            {/* Overlay to catch clicks and prevent map stealing scroll directly on mobile unless intentional */}
            <div className="absolute inset-0 z-10 pointer-events-none ring-1 ring-inset ring-border/50 rounded-3xl mix-blend-overlay"></div>

            {/* Custom CSS overrides for Leaflet popups to match our theme */}
            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    background: var(--card-bg, #ffffff);
                    color: var(--foreground, #0f172a);
                    border-radius: 12px;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .leaflet-popup-tip {
                    background: var(--card-bg, #ffffff);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                }
                .dark .leaflet-popup-content-wrapper,
                .dark .leaflet-popup-tip {
                    background: #1e293b;
                    color: #f8fafc;
                    border-color: rgba(148, 163, 184, 0.1);
                }
            `}</style>
        </div>
    );
};

export default WeatherMap;
