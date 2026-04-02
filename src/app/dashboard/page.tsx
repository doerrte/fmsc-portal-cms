'use client';

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, Clock, Plus, History, LogOut, LayoutDashboard, Database, Users, Files, UserCircle, Camera, Download, Trash2, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { logoutAction } from '@/app/login/actions';
import { getSafeMembersAction, getCurrentUserAction, updateProfileAction, getInternalDocsAction, addInternalDocAction, deleteInternalDocAction, uploadAvatarAction } from './actions';

interface MemberData {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
}

interface InternalDoc {
  id: string;
  title: string;
  url: string;
  date: string;
  uploadedBy: string;
}

interface FlightRecord {
  id: string;
  pilot_name: string;
  aircraft_name: string;
  date: string;
  duration: number;
  notes: string;
}

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('flugbuch');
  const [members, setMembers] = useState<MemberData[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [internalDocs, setInternalDocs] = useState<InternalDoc[]>([]);
  const [flights, setFlights] = useState<FlightRecord[]>([
    { id: '1', pilot_name: 'Max Mustermann', aircraft_name: 'Stuka JU-87', date: '2026-03-28', duration: 15, notes: 'Erfolgreicher Erstflug nach Reparatur.' },
    { id: '2', pilot_name: 'Erika Musterfrau', aircraft_name: 'ASW 28 Glider', date: '2026-03-27', duration: 45, notes: 'Gute Thermik am Nachmittag.' },
  ]);

  const [searchTermMembers, setSearchTermMembers] = useState('');
  const [searchTermDocs, setSearchTermDocs] = useState('');

  React.useEffect(() => {
    async function loadMembers() {
      const res = await getSafeMembersAction();
      if (res.success && res.members) setMembers(res.members);
    }
    async function loadUser() {
      const res = await getCurrentUserAction();
      if (res.success) setCurrentUser(res.user);
    }
    async function loadDocs() {
      const res = await getInternalDocsAction();
      if (res.success) setInternalDocs(res.docs);
    }
    loadMembers();
    loadUser();
    loadDocs();
  }, []);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', password: '', oldPassword: '', confirmPassword: '', phone: '' });
  
  useEffect(() => {
    if (currentUser) {
      setProfileData({ ...profileData, name: currentUser.name, email: currentUser.email, phone: currentUser.phone || '' });
    }
  }, [currentUser]);

  const [showDocUpload, setShowDocUpload] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', file: null as File | null });
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      alert('Die neuen Passwörter stimmen nicht überein!');
      setIsUpdatingProfile(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phone', profileData.phone);
    if (profileData.password) {
      formData.append('password', profileData.password);
      formData.append('oldPassword', profileData.oldPassword);
    }
    
    const res = await updateProfileAction(formData);
    if (res.success) {
      const uRes = await getCurrentUserAction();
      if (uRes.success) setCurrentUser(uRes.user);
      setProfileData({ ...profileData, password: '', oldPassword: '', confirmPassword: '' });
      alert('Profil aktualisiert!');
    } else {
      alert(res.error || 'Fehler beim Aktualisieren');
    }
    setIsUpdatingProfile(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUpdatingProfile(true);
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await uploadAvatarAction(formData);
    if (res.success) {
      const uRes = await getCurrentUserAction();
      if (uRes.success) setCurrentUser(uRes.user);
    }
    setIsUpdatingProfile(false);
  };

  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.file || !newDoc.title) return;
    
    setIsUploadingDoc(true);
    const formData = new FormData();
    formData.append('title', newDoc.title);
    formData.append('file', newDoc.file);
    formData.append('uploader', currentUser?.name || 'Unbekannt');
    
    const res = await addInternalDocAction(formData);
    if (res.success) {
      const dRes = await getInternalDocsAction();
      if (dRes.success) setInternalDocs(dRes.docs);
      setShowDocUpload(false);
      setNewDoc({ title: '', file: null });
    }
    setIsUploadingDoc(false);
  };

  const handleDeleteDoc = async (id: string) => {
    if (confirm('Dokument wirklich löschen?')) {
      const res = await deleteInternalDocAction(id);
      if (res.success) {
        const dRes = await getInternalDocsAction();
        if (dRes.success) setInternalDocs(dRes.docs);
      }
    }
  };

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
            <button onClick={() => setActiveTab('flugbuch')} className={`nav-item ${activeTab === 'flugbuch' ? 'active' : ''}`} style={{ border: 'none', background: activeTab === 'flugbuch' ? 'rgba(251, 146, 60, 0.1)' : 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left', color: activeTab === 'flugbuch' ? 'var(--primary)' : 'var(--text-secondary)' }}><Database size={18} /> Flugbuch</button>
            <button onClick={() => setActiveTab('mitglieder')} className={`nav-item ${activeTab === 'mitglieder' ? 'active' : ''}`} style={{ border: 'none', background: activeTab === 'mitglieder' ? 'rgba(251, 146, 60, 0.1)' : 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left', color: activeTab === 'mitglieder' ? 'var(--primary)' : 'var(--text-secondary)' }}><Users size={18} /> Mitglieder</button>
            <button onClick={() => setActiveTab('dokumente')} className={`nav-item ${activeTab === 'dokumente' ? 'active' : ''}`} style={{ border: 'none', background: activeTab === 'dokumente' ? 'rgba(251, 146, 60, 0.1)' : 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left', color: activeTab === 'dokumente' ? 'var(--primary)' : 'var(--text-secondary)' }}><Files size={18} /> Dokumente</button>
            <button onClick={() => setActiveTab('profil')} className={`nav-item ${activeTab === 'profil' ? 'active' : ''}`} style={{ border: 'none', background: activeTab === 'profil' ? 'rgba(251, 146, 60, 0.1)' : 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left', color: activeTab === 'profil' ? 'var(--primary)' : 'var(--text-secondary)' }}><UserCircle size={18} /> Profil</button>
            <form action={logoutAction} style={{ margin: 0, padding: 0 }}>
              <button type="submit" className="nav-item logout" style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LogOut size={18} /> Abmelden
              </button>
            </form>
          </nav>
        </aside>

        <section className="main-content">
          {activeTab === 'flugbuch' && (
            <>
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
            </>
          )}

          {activeTab === 'mitglieder' && (
            <>
              <header className="content-header">
                <div>
                  <h1>Vereinsmitglieder</h1>
                  <p>Eine Liste aller aktiven Pilotinnen und Piloten unseres Vereins.</p>
                </div>
              </header>

              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                <input 
                  type="text" 
                  placeholder="Mitglieder suchen..." 
                  value={searchTermMembers}
                  onChange={(e) => setSearchTermMembers(e.target.value)}
                  style={{ width: '100%', padding: '15px 15px 15px 45px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '15px', color: 'var(--foreground)' }}
                />
              </div>

              <div className="flight-list">
                <div className="list-header glass">
                  <span>Profil</span>
                  <span>Name</span>
                  <span style={{ flex: 2 }}>Kontakt</span>
                </div>
                {members.filter(m => m.name.toLowerCase().includes(searchTermMembers.toLowerCase())).map((m: MemberData) => (
                  <div key={m.id} className="flight-item glass" style={{ gap: '1.5rem' }}>
                    <div className="model-info" style={{ flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {m.profileImage ? <img src={m.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={20} />}
                      </div>
                      <div>
                        <span className="model-name" style={{textTransform: 'capitalize'}}>{m.role === 'admin' ? 'Administrator' : (m.role === 'board' ? 'Vorstand' : 'Mitglied')}</span>
                      </div>
                    </div>
                    <span className="pilot-name" style={{ flex: 1 }}>{m.name}</span>
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{m.email}</span>
                      {m.phone && <span style={{ fontSize: '0.85rem', color: '#567eb6', fontWeight: 'bold' }}>{m.phone}</span>}
                    </div>
                    <span className="duration-pill" style={{background: 'rgba(86,126,182,0.1)', color: '#567eb6'}}>Aktiv</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'dokumente' && (
            <>
              <header className="content-header">
                <div>
                  <h1>Interne Dokumente</h1>
                  <p>Wichtige Unterlagen, Protokolle und Dokumente für Vereinsmitglieder.</p>
                </div>
                {(currentUser?.role === 'admin' || currentUser?.role === 'board') && (
                  <button className="add-btn" onClick={() => setShowDocUpload(true)}>
                    <Plus size={20} /> Hochladen
                  </button>
                )}
              </header>

              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                <input 
                  type="text" 
                  placeholder="Dokumente durchsuchen..." 
                  value={searchTermDocs}
                  onChange={(e) => setSearchTermDocs(e.target.value)}
                  style={{ width: '100%', padding: '15px 15px 15px 45px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '15px', color: 'var(--foreground)' }}
                />
              </div>

              {showDocUpload && (
                <div className="modal-overlay">
                  <div className="add-modal glass">
                    <div className="modal-header">
                      <h2>Dokument hochladen</h2>
                      <button onClick={() => setShowDocUpload(false)}>✕</button>
                    </div>
                    <form onSubmit={handleDocUpload} className="modal-form">
                      <div className="input-group">
                        <label>Titel des Dokuments</label>
                        <input type="text" value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} placeholder="z.B. Protokoll Jahreshauptversammlung" required />
                      </div>
                      <div className="input-group">
                        <label>Datei auswählen</label>
                        <input type="file" onChange={e => setNewDoc({...newDoc, file: e.target.files?.[0] || null})} required />
                      </div>
                      <button type="submit" className="submit-btn" disabled={isUploadingDoc}>
                        {isUploadingDoc ? 'Lädt hoch...' : 'Dokument speichern'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <div className="flight-list">
                <div className="list-header glass">
                  <span>Dokument</span>
                  <span>Hochgeladen von</span>
                  <span>Datum</span>
                  <span>Aktion</span>
                </div>
                {internalDocs.filter(d => d.title.toLowerCase().includes(searchTermDocs.toLowerCase())).map(doc => (
                  <div key={doc.id} className="flight-item glass">
                    <div className="model-info">
                      <Files className="pilot-icon" size={20} />
                      <div>
                        <span className="model-name">{doc.title}</span>
                      </div>
                    </div>
                    <span className="pilot-name">{doc.uploadedBy}</span>
                    <span className="date">{doc.date}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a href={doc.url} target="_blank" className="duration-pill" style={{ background: '#567eb6', color: 'white', textDecoration: 'none' }}>
                        <Download size={14} style={{ marginRight: '4px' }} /> Laden
                      </a>
                      {(currentUser?.role === 'admin' || currentUser?.role === 'board') && (
                        <button onClick={() => handleDeleteDoc(doc.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'profil' && currentUser && (
            <>
              <header className="content-header">
                <div>
                  <h1>Mein Profil</h1>
                  <p>Verwalten Sie Ihre persönlichen Daten und Ihr Profilbild.</p>
                </div>
              </header>

              <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '4px solid var(--primary)' }}>
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <label style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                      <Camera color="white" size={32} />
                      <input type="file" hidden onChange={handleAvatarUpload} accept="image/*" />
                    </label>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Klicke zum Ändern</span>
                </div>

                <form onSubmit={handleProfileUpdate} style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="form-grid">
                     <div className="input-group">
                       <label>Vollständiger Name</label>
                       <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required />
                     </div>
                     <div className="input-group">
                       <label>E-Mail Adresse</label>
                       <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} required />
                     </div>
                     <div className="input-group">
                       <label>Handynummer</label>
                       <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} placeholder="+49 151 ..." />
                     </div>
                  </div>
                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Aktuelles Passwort (erforderlich für Passwortänderung)</label>
                    <input type="password" value={profileData.oldPassword} onChange={e => setProfileData({...profileData, oldPassword: e.target.value})} placeholder="Bestätige dein altes Passwort" />
                  </div>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Neues Passwort</label>
                      <input type="password" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} placeholder="Neues Passwort" />
                    </div>
                    <div className="input-group">
                      <label>Passwort wiederholen</label>
                      <input type="password" value={profileData.confirmPassword} onChange={e => setProfileData({...profileData, confirmPassword: e.target.value})} placeholder="Passwort bestätigen" />
                    </div>
                  </div>
                  <button type="submit" className="submit-btn" disabled={isUpdatingProfile} style={{ width: 'fit-content', padding: '12px 30px' }}>
                    {isUpdatingProfile ? 'Speichert...' : 'Profil aktualisieren'}
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      </div>

      <Footer />

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: var(--background);
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
          color: var(--foreground);
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
          color: var(--text-secondary);
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
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .content-header p {
          color: var(--text-secondary);
        }

        .add-btn {
          background: var(--primary);
          color: var(--foreground);
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
          color: var(--foreground);
          font-size: 1.5rem;
        }

        .modal-header button {
          color: var(--text-secondary);
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
          color: var(--text-secondary);
        }

        input, textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--foreground);
          font-family: inherit;
        }

        textarea { min-height: 100px; resize: none; }

        .submit-btn {
          background: var(--primary);
          color: var(--foreground);
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
          color: var(--foreground);
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
          color: var(--text-secondary);
        }
      `}</style>
    </main>
  );
};

export default DashboardPage;
