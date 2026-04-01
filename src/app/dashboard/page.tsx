'use client';

import React, { useState } from 'react';
import { Plane, Calendar, Clock, Plus, History, LogOut, LayoutDashboard, Database } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FlightRecord {
  id: string;
  pilot_name: string;
  aircraft_name: string;
  date: string;
  duration: number;
  notes: string;
}

const DashboardPage = () => {
  const [flights, setFlights] = useState<FlightRecord[]>([
    { id: '1', pilot_name: 'Max Mustermann', aircraft_name: 'Stuka JU-87', date: '2026-03-28', duration: 15, notes: 'Erfolgreicher Erstflug nach Reparatur.' },
    { id: '2', pilot_name: 'Erika Musterfrau', aircraft_name: 'ASW 28 Glider', date: '2026-03-27', duration: 45, notes: 'Gute Thermik am Nachmittag.' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newFlight, setNewFlight] = useState({
    pilot_name: '',
    aircraft_name: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: ''
  });

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const flight: FlightRecord = {
      id: Math.random().toString(36).substr(2, 9),
      pilot_name: newFlight.pilot_name,
      aircraft_name: newFlight.aircraft_name,
      date: newFlight.date,
      duration: parseInt(newFlight.duration),
      notes: newFlight.notes
    };
    setFlights([flight, ...flights]);
    setShowAddForm(false);
    setNewFlight({ pilot_name: '', aircraft_name: '', date: new Date().toISOString().split('T')[0], duration: '', notes: '' });
  };

  return (
    <main className="dashboard-page">
      <Navbar />
      
      <div className="container dashboard-container">
        <aside className="sidebar glass">
          <div className="sidebar-header">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active"><Database size={18} /> Flugbuch</a>
            <a href="#" className="nav-item"><History size={18} /> Meine Flüge</a>
            <a href="#" className="nav-item logout"><LogOut size={18} /> Abmelden</a>
          </nav>
        </aside>

        <section className="main-content">
          <header className="content-header">
            <div>
              <h1>Digitales Flugbuch</h1>
              <p>Erfassen Sie Ihre heutigen Flugstunden am Königshovener Feld.</p>
            </div>
            <button className="add-btn" onClick={() => setShowAddForm(true)}>
              <Plus size={20} />
              Flug hinzufügen
            </button>
          </header>

          {showAddForm && (
            <div className="modal-overlay">
              <div className="add-modal glass">
                <div className="modal-header">
                  <h2>Neuer Flugbucheintrag</h2>
                  <button onClick={() => setShowAddForm(false)}>✕</button>
                </div>
                <form onSubmit={handleAddFlight} className="modal-form">
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Pilot</label>
                      <input 
                        type="text" 
                        placeholder="Name des Piloten"
                        value={newFlight.pilot_name}
                        onChange={(e) => setNewFlight({ ...newFlight, pilot_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Flugmodell</label>
                      <input 
                        type="text" 
                        placeholder="z.B. Piper Cup"
                        value={newFlight.aircraft_name}
                        onChange={(e) => setNewFlight({ ...newFlight, aircraft_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Datum</label>
                      <input 
                        type="date"
                        value={newFlight.date}
                        onChange={(e) => setNewFlight({ ...newFlight, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Dauer (Minuten)</label>
                      <input 
                        type="number" 
                        placeholder="15"
                        value={newFlight.duration}
                        onChange={(e) => setNewFlight({ ...newFlight, duration: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Notizen / Vorkommnisse</label>
                    <textarea 
                      placeholder="Wie verlief der Flug?"
                      value={newFlight.notes}
                      onChange={(e) => setNewFlight({ ...newFlight, notes: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="submit-btn">Flug speichern</button>
                </form>
              </div>
            </div>
          )}

          <div className="flight-list">
            <div className="list-header glass">
              <span>Modell</span>
              <span>Pilot</span>
              <span>Datum</span>
              <span>Dauer</span>
            </div>
            {flights.map(flight => (
              <div key={flight.id} className="flight-item glass">
                <div className="model-info">
                  <Plane className="pilot-icon" size={20} />
                  <div>
                    <span className="model-name">{flight.aircraft_name}</span>
                    <span className="notes">{flight.notes}</span>
                  </div>
                </div>
                <span className="pilot-name">{flight.pilot_name}</span>
                <span className="date">{flight.date}</span>
                <span className="duration-pill">{flight.duration} min</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: #0a0c10;
        }

        .dashboard-container {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          padding: 120px 20px 60px;
        }

        @media (max-width: 1024px) {
          .dashboard-container {
            grid-template-columns: 1fr;
          }
          .sidebar { display: none; }
        }

        .sidebar {
          height: fit-content;
          border-radius: 20px;
          padding: 1.5rem;
          position: sticky;
          top: 100px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          color: white;
          margin-bottom: 2rem;
          padding: 0 10px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(251, 146, 60, 0.1);
          color: var(--primary);
        }

        .nav-item.logout {
          margin-top: 2rem;
          opacity: 0.6;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }

        .content-header p {
          color: rgba(255, 255, 255, 0.5);
        }

        .add-btn {
          background: var(--primary);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .add-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(251, 146, 60, 0.3);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .add-modal {
          width: 100%;
          max-width: 600px;
          padding: 2.5rem;
          border-radius: 32px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          color: white;
          font-size: 1.5rem;
        }

        .modal-header button {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.5rem;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        input, textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          border-radius: 12px;
          color: white;
          font-family: inherit;
        }

        textarea { min-height: 100px; resize: none; }

        .submit-btn {
          background: var(--primary);
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          margin-top: 1rem;
        }

        .flight-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .list-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 100px;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent);
          opacity: 0.8;
        }

        .flight-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 100px;
          padding: 1.5rem;
          border-radius: 16px;
          align-items: center;
          transition: all 0.2s;
        }

        .flight-item:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(251, 146, 60, 0.3);
        }

        .model-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pilot-icon {
          color: var(--primary);
        }

        .model-name {
          display: block;
          font-weight: 700;
          color: white;
          font-size: 1.1rem;
        }

        .notes {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .duration-pill {
          background: rgba(56, 189, 248, 0.1);
          color: var(--accent);
          padding: 6px 12px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.85rem;
          text-align: center;
        }

        .pilot-name, .date {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </main>
  );
};

export default DashboardPage;
