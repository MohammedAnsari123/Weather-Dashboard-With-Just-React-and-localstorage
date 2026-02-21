import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import WeatherDashboard from './components/WeatherDashboard';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        {/* Background gradients for premium feel */}
        <div className="fixed inset-0 z-[-1] bg-[var(--background)] transition-colors duration-500 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        </div>

        <WeatherDashboard />
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
