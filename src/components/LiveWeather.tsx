'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wind, Thermometer, Navigation, Gauge, Activity, Radio, Droplets } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  precipitationProbability: number;
  condition: string;
}

const LiveWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 3D Tilt Effect Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 51.021827;
        const lon = 6.554718;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,relative_humidity_2m&hourly=precipitation_probability&wind_speed_unit=kmh&timezone=Europe%2FBerlin&forecast_days=1`
        );
        const data = await res.json();

        // Get precipitation probability for current hour
        const currentHour = new Date().getHours();
        const rainProb = data.hourly?.precipitation_probability?.[currentHour] || 0;

        setWeather({
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          windGusts: data.current.wind_gusts_10m,
          windDirection: data.current.wind_direction_10m,
          precipitationProbability: rainProb,
          condition: "Optimal",
        });
        setLoading(false);
      } catch (error) {
        console.error("Weather fetch failed", error);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="weather-skeleton glass" />;

  return (
    <section className="weather-section">
      <div className="container">
        <motion.div 
          className="dashboard-wrapper"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, perspective: 1000 }}
        >
          <div className="weather-dashboard glass">
            {/* Background Tech Effects */}
            <div className="tech-overlay">
              <div className="scanning-line" />
              <div className="grid-background" />
            </div>

            <div className="dashboard-content">
              {/* Left Side: Main Wind Compass */}
              <div className="main-display">
                <div className="instrument-header">
                  <div className="live-indicator">
                    <span className="dot" />
                    LIVE DATEN
                  </div>
                  <h2 className="instrument-title uppercase">Flugsysteme</h2>
                </div>

                <div className="compass-container">
                  {/* Outer ring and Ticks */}
                  <div className="compass-outer">
                    {[...Array(36)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`tick ${i % 9 === 0 ? 'major' : ''}`} 
                        style={{ transform: `rotate(${i * 10}deg)` }} 
                      />
                    ))}
                    
                    {/* Himmelsrichtungen - Fixiert */}
                    <span className="label n">N</span>
                    <span className="label o">O</span>
                    <span className="label s">S</span>
                    <span className="label w">W</span>
                  </div>
                  
                  {/* Precision Needle Center aligned */}
                  <div className="needle-hub">
                    <motion.div 
                      className="precision-needle"
                      animate={{ rotate: weather?.windDirection || 0 }}
                      transition={{ type: "spring", stiffness: 45, damping: 12 }}
                    >
                      <div className="needle-top" />
                      <div className="needle-bottom" />
                      <div className="needle-center-pin" />
                    </motion.div>
                  </div>
                </div>

                <div className="instrument-footer desktop-only">
                  <div className="coordinate-badge">LAT-51.02 | LON-6.55</div>
                </div>
              </div>

              {/* Right Side: Modular Metrics */}
              <div className="metrics-aside">
                <div className="metrics-grid">
                  <div className="metric-glass">
                    <div className="metric-header">
                      <Thermometer size={16} className="text-blue-400" />
                      <span>TEMPERATUR</span>
                    </div>
                    <div className="metric-body">
                      <span className="digital-value">{weather?.temperature}</span>
                      <span className="digital-unit">°C</span>
                    </div>
                  </div>

                  <div className="metric-glass">
                    <div className="metric-header">
                      <Wind size={16} className="text-emerald-400" />
                      <span>VORH. WIND</span>
                    </div>
                    <div className="metric-body">
                      <span className="digital-value">{Math.round(weather?.windSpeed || 0)}</span>
                      <span className="digital-unit">KM/H</span>
                    </div>
                  </div>

                  <div className="metric-glass">
                    <div className="metric-header">
                      <Droplets size={16} className="text-cyan-400" />
                      <span>REGENWAHRSCH.</span>
                    </div>
                    <div className="metric-body">
                      <span className="digital-value">{weather?.precipitationProbability}</span>
                      <span className="digital-unit">%</span>
                    </div>
                  </div>

                  <div className="metric-glass highlight">
                    <div className="metric-header">
                      <Gauge size={16} className="text-red-500" />
                      <span>BÖEN (MAX)</span>
                    </div>
                    <div className="metric-body">
                      <span className="digital-value text-red-500">{Math.round(weather?.windGusts || 0)}</span>
                      <span className="digital-unit">KM/H</span>
                    </div>
                  </div>
                </div>

                <div className="status-module">
                  <div className="status-header">
                    <Radio size={16} className="animate-pulse" />
                    SYSTEMSTATUS
                  </div>
                  <div className={`status-banner ${weather && weather.windGusts > 35 ? 'caution' : 'clear'}`}>
                    {weather && weather.windGusts > 35 ? 'ACHTUNG: BÖIG' : 'SICHERER FLUGBETRIEB'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .weather-section {
          padding: 6rem 0;
          margin-top: -8rem;
          position: relative;
          z-index: 20;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .weather-section { padding: 3rem 0; margin-top: -4rem; }
        }

        .dashboard-wrapper {
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
        }

        .weather-dashboard {
          position: relative;
          border-radius: 40px;
          padding: 4rem;
          overflow: hidden;
          background: rgba(10, 15, 25, 0.4);
          border: 1px solid var(--card-border);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 1024px) {
          .weather-dashboard { border-radius: 100px; }
        }

        @media (max-width: 768px) {
          .weather-dashboard { padding: 1rem; border-radius: 24px; }
        }

        /* Tech Background Overlay */
        .tech-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .grid-background {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.5;
        }

        .scanning-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(86, 126, 182, 0.4), transparent);
          animation: scan 10s linear infinite;
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .dashboard-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 4rem;
        }

        @media (max-width: 1024px) {
          .dashboard-content { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
        }

        .main-display {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          align-items: center;
        }

        .instrument-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #567eb6;
          letter-spacing: 2px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #567eb6;
          border-radius: 50%;
          box-shadow: 0 0 10px #567eb6;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .instrument-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--foreground);
          letter-spacing: -1px;
        }

        @media (max-width: 480px) {
          .instrument-title { font-size: 1.5rem; }
        }

        /* Compass Styles */
        .compass-container {
          position: relative;
          width: 280px;
          height: 280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .compass-container { width: 220px; height: 220px; }
        }

        .compass-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.04);
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.2);
        }

        .tick {
          position: absolute;
          top: 0;
          left: 50%;
          width: 1.5px;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          transform-origin: 0 140px;
        }

        @media (max-width: 480px) {
          .tick { transform-origin: 0 110px; }
        }

        .tick.major {
          height: 15px;
          width: 2px;
          background: rgba(255, 255, 255, 0.4);
        }

        .label {
          position: absolute;
          font-weight: 900;
          font-size: 1.1rem;
          color: var(--foreground);
          opacity: 0.6;
        }

        .label.n { top: 20px; left: 50%; transform: translateX(-50%); }
        .label.o { right: 20px; top: 50%; transform: translateY(-50%); }
        .label.s { bottom: 20px; left: 50%; transform: translateX(-50%); }
        .label.w { left: 20px; top: 50%; transform: translateY(-50%); }

        /* Precision Needle */
        .needle-hub {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .precision-needle {
          position: relative;
          width: 2px;
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .precision-needle { height: 160px; }
        }

        .needle-top {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 90px solid #c00000;
          filter: drop-shadow(0 0 10px #c00000);
          margin-bottom: 1px;
        }

        @media (max-width: 480px) { .needle-top { border-bottom-width: 70px; } }

        .needle-bottom {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 90px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 480px) { .needle-bottom { border-top-width: 70px; } }

        .needle-center-pin {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #111;
          border: 2px solid #567eb6;
          border-radius: 50%;
          box-shadow: 0 0 10px #567eb6;
          z-index: 20;
        }

        /* Metrics Aside */
        .metrics-aside {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (max-width: 1024px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .metrics-grid { grid-template-columns: 1fr; }
        }

        .metric-glass {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          padding: 1.2rem;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.7rem;
          font-weight: 800;
          opacity: 0.5;
          letter-spacing: 2px;
        }

        .digital-value {
          font-family: monospace;
          font-size: 2rem;
          font-weight: 900;
          line-height: 1;
          color: var(--foreground);
        }

        .digital-unit {
          font-size: 0.9rem;
          font-weight: 700;
          opacity: 0.5;
          margin-left: 5px;
          color: var(--foreground);
        }

        .status-module {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-banner {
          padding: 14px;
          border-radius: 99px;
          font-weight: 900;
          font-size: 0.9rem;
          text-align: center;
        }

        .status-banner.clear { background: rgba(34, 197, 94, 0.1); color: var(--status-clear); border: 1px solid rgba(34, 197, 94, 0.2); }
        .status-banner.caution { background: rgba(220, 38, 38, 0.1); color: var(--status-caution); border: 1px solid rgba(220, 38, 38, 0.2); }

        .weather-skeleton {
          height: 480px;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.05);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }

        .desktop-only { display: block; }
        @media (max-width: 768px) { .desktop-only { display: none; } }
      `}</style>
    </section>
  );
};

export default LiveWeather;
