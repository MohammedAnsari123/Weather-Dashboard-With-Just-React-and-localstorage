# Weather Dashboard 🌤️
![Weather Dashboard Showcase](https://via.placeholder.com/1200x600/0f172a/3b82f6?text=Weather+Dashboard+Presentation)

A premium, feature-rich Weather Dashboard designed with a focus on high-end UI/UX principles, glassmorphism, and responsive design. This application leverages the power of **React**, **Vite**, and **Tailwind CSS** to deliver real-time meteorological data and mapping through a deeply polished interface.

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Core Features](#-core-features)
3. [Deep Dive: Architecture & State](#-deep-dive-architecture--state)
4. [Deep Dive: Component Structure](#-deep-dive-component-structure)
5. [API Integration & Mocking System](#-api-integration--mocking-system)
6. [Tech Stack](#-tech-stack)
7. [Installation & Setup](#-installation--setup)
8. [Future Enhancements](#-future-enhancements)

---

## 🚀 Project Overview

The Weather Dashboard goes beyond simply displaying temperatures. It is engineered to provide a comprehensive weather overview at a glance, incorporating micro-interactions, seamless theme switching, advanced charting, and interactive mapping. The layout is actively managed by CSS Grid and Flexbox to guarantee a flawless viewing experience across mobile devices, tablets, and massive 4K displays.

---

## ✨ Core Features

*   **Real-Time Current Conditions:** Displays precise current temperature, feels-like temperature, humidity percentage, wind speed (with directional hints visually), and overriding conditions (e.g., Clear Sky, Scattered Clouds).
*   **Intelligent Unit Toggling:** Instantly flip the entire application between Celsius (Metric) and Fahrenheit (Imperial) metrics with zero reloading. State is persisted automatically.
*   **Interactive 24-Hour Forecast:** A dynamic, gradient-filled area chart built utilizing `Recharts` that plots the exact temperature trends for the next 24 hours in 3-hour increments.
*   **5-Day Extended Forecast:** A cleanly carded row displaying the high temperatures and overall conditions for the upcoming working week.
*   **Radar Mapping:** An embedded `React-Leaflet` map that physically updates its center to the tracked coordinate, utilizing premium *Esri World Topo* and *Dark Gray Canvas* base tile layers respectively.
*   **Astronomical Timing:** Calculates and displays precise Sunrise and Sunset times, actively adjusting for the targeted city's longitudinal timezone shifts (not just the user's local browser time).
*   **Global Theme Management:** Full Dark/Light mode switching that influences the entire color palette, map tiles, card opacities, and icon styling—persisted to `localStorage`.
*   **Smart Search & Geolocation:**
    *   Search arbitrarily by city name.
    *   Dropdown history of your 5 most recently searched cities (persisted).
    *   "Use My Location" functionality utilizing the HTML5 Geolocation API, completely combined with Reverse Geocoding to fetch accurate local municipal names.
*   **Favorite Locations:** Bookmark specific cities with a heart icon, placing them cleanly into a horizontal scrollable quick-access list at the top of the dashboard.
*   **Immersive 3D Environments:** A full-screen Three.js background that renders clouds, rain, or snow based on real-time weather, with a starfield in Dark Mode.
*   **Fluid Motion Design:** Staggered entrance animations, smooth layout transitions, and interactive hover effects across all UI components.

---

## 🧠 Deep Dive: Architecture & State

The application completely abstracts its state management away from the UI components. This is achieved via two primary React Contexts located in `.src/context`:

### 1. `WeatherContext.jsx`
The absolute source of truth for all weather-related data.
*   **State:** Holds the `query` results, `currentWeather` (object), `forecast` (array), user's selected `unit` ('metric' | 'imperial'), `favorites` (string array), and `searchHistory` (string array).
*   **Persistence:** The context explicitly watches for changes to `favorites`, `searchHistory`, and `unit`, writing them to browser `localStorage` to ensure the app hydrates exactly as the user left it upon returning.
*   **Methods:** Exposes actions like `fetchByLocation`, `setCity`, `toggleUnit`, and `toggleFavorite` to the entire component tree.

### 2. `ThemeContext.jsx`
*   Determines whether the `dark` class is appended to the root HTML document.
*   Listens natively for `window.matchMedia('(prefers-color-scheme: dark)')` to respect system settings on original load.

---

## 🧩 Deep Dive: Component Structure

The UI is deeply compartmentalized for readability and DRY principles.

*   **`WeatherDashboard.jsx`**: The main orchestration component. Responsible for the overall responsive grid shell (up to `max-w-7xl` on large displays), rendering the Header, `FavoritesList`, and coordinating the left (Current/Map) and right (Chart/Forecast) data columns.
*   **`CurrentWeather.jsx`**: The visually heaviest localized component. It implements glassmorphic cards (`bg-card/60 backdrop-blur-xl`) and uses a customized flexbox layout to prevent content bunching. Features a localized map `getWeatherIcon` that parses OpenWeather strings (e.g. "thunderstorm") into specific `lucide-react` SVG assets.
*   **`SearchBar.jsx`**: Complex interaction handling. It manages its own dropdown focus state (`isFocused`), implements a `useRef` to detect clicks *outside* the dropdown to dismiss it, and fires the context data fetch loops.
*   **`WeatherMap.jsx`**: Embeds the Leaflet container. Features a custom `MapUpdater` sub-component that forcefully triggers a `map.flyTo()` animation when primitive coordinate variables (`lat`, `lon`) strictly alter.
*   **`HourlyChart.jsx`**: Implements the `recharts` `<AreaChart>`. Wraps the graph in a `<ResponsiveContainer>` to guarantee it never breaks out of the dashboard grid constraints on mobile.

---

## 🔌 API Integration & Mocking System

The backend communication is centralized entirely in `src/services/weatherApi.js`.

### Provider: OpenWeatherMap
The application interfaces exclusively with the OpenWeatherMap `data/2.5/` endpoints (`/weather` and `/forecast`).

### The Fallback Mock System
A unique feature of this application is its robust **Mock Data Engine**.
If the `VITE_OPENWEATHER_API_KEY` is completely missing from the `.env` file, the application gracefully degrades into mock mode rather than crashing.

1.  **Delay Simulation**: Artificially waits ~800ms utilizing a JavaScript Promise block to simulate authentic network latency so loading states remain visible.
2.  **Reverse Geocoding Bypass**: If the user clicks "Use My Location", the app pings a free *OpenStreetMap Nominatim* public endpoint purely to translate the LAT/LON into a human-readable city name for the mock UI to use.
3.  **Forward Geocoding Bypass**: If the user types a city, it optionally queries nominatim to retrieve real coordinates so the Leaflet map correctly navigates to the searched location while still simulating the temperature.
4.  **Math Generation**: Dynamically spins up mathematically plausible temperatures, arrays of 40 future timestamps, and timezone offsets, adjusting the math actively based on if the user is in `imperial` or `metric` mode.

---

## 💻 Tech Stack

*   **Core**: React 18, Vite (for wicked fast HMR and compilation)
*   **Styling System**: Tailwind CSS v3
*   **Icons Framework**: Lucide React
*   **HTTP Requests**: Axios
*   **Data Visualization**: Recharts
*   **Geospatial / Maps**: Leaflet, React-Leaflet
*   **3D / Animations**: Three.js, React Three Fiber, Framer Motion
*   **Utility Classes**: `clsx` & `tailwind-merge` (via `cn.js`)

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Weather-Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory. If you want live local data, place your OpenWeatherMap key here.
   *Note: Providing no key is totally fine—the app will utilize its mock engine flawlessly.*
   ```env
   VITE_OPENWEATHER_API_KEY=your_open_weather_map_api_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The application will boot, usually available at `http://localhost:5173`.*

---

## � Future Enhancements
*   [ ] Implement a 7-Day extended layout utilizing a premium API tier.
*   [ ] Add explicit Air Quality Indexes (AQI) alongside humidity and wind.
*   [ ] Establish a Next.js server-side port route architecture to hide the API key from the client bundle completely.
*   [ ] Improve chart tooltips with exact timing markers.
