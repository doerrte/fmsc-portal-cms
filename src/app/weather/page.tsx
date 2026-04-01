'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveWeather from '@/components/LiveWeather';
import { Wind, Navigation, CloudRain, Sun, Cloud, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherPage = () => {
  return (
    <main className="weather-page">
      <Navbar />

      <section className="weather-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="title-gradient"
          >
            Flugwetter Detail
          </motion.h1>
          <p className="subtitle">Präzise Wetterdaten für das Königshovener Feld.</p>
        </div>
      </section>

      <div className="container weather-content">
        <LiveWeather />

        <div className="weather-forecast-grid">
          <div className="forecast-card glass">
            <h3>Heute</h3>
            <Sun className="forecast-icon" size={40} />
            <span className="temp">18°C</span>
            <div className="wind-detail">
              <Wind size={16} /> <span>8 kt</span>
            </div>
          </div>
          <div className="forecast-card glass">
            <h3>Morgen</h3>
            <Cloud className="forecast-icon" size={40} />
            <span className="temp">16°C</span>
            <div className="wind-detail">
              <Wind size={16} /> <span>12 kt</span>
            </div>
          </div>
          <div className="forecast-card glass">
            <h3>Übermorgen</h3>
            <CloudRain className="forecast-icon" size={40} />
            <span className="temp">14°C</span>
            <div className="wind-detail">
              <Wind size={16} /> <span>15 kt</span>
            </div>
          </div>
        </div>

        <section className="weather-info glass">
          <header>
            <Navigation size={24} />
            <h2>Sicherheitshinweise</h2>
          </header>
          <div className="info-grid">
            <div className="info-item">
              <h4>Seitenwind</h4>
              <p>Die Startbahn verläuft in Ost-West Richtung. Achten Sie auf Seitenwindkomponenten aus Nord/Süd.</p>
            </div>
            <div className="info-item">
              <h4>Böigkeit</h4>
              <p>Ab 15 kt Böen ist für Anfänger erhöhte Vorsicht geboten. Ab 20 kt wird der Flugbetrieb eingeschränkt.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <style jsx>{`
        .weather-page {
          background: var(--background);
        }

        .weather-hero {
          padding: 160px 0 20px;
          text-align: center;
        }

        .title-gradient {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary) 0%, var(--foreground) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.1rem;
          opacity: 0.6;
          margin-top: 1rem;
        }

        .weather-content {
          padding-bottom: 100px;
        }

        .weather-forecast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 4rem;
        }

        .forecast-card {
          padding: 2rem;
          border-radius: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .forecast-icon {
          color: var(--primary);
        }

        .temp {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .wind-detail {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent);
        }

        .weather-info {
          padding: 3rem;
          border-radius: 32px;
        }

        .weather-info header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--primary);
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .info-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .info-item h4 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .info-item p {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.7;
        }
      `}</style>
    </main>
  );
};

export default WeatherPage;
