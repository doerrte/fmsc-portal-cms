'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Settings, LogOut, ChevronRight, MessageSquare, 
  Files, Plus, Trash2, Download, Search, LayoutGrid, Calendar, 
  MapPin, Clock, User, Mail, Phone, Shield, Edit, Camera, 
  Activity, Zap, Info, Play, FolderClosed, Bell, CheckCircle, 
  X, AtSign, UserCircle, Send, Globe, AlertTriangle, CloudSun, 
  Wind, Droplets, Thermometer, Map, Menu, UserCheck, ShieldCheck, 
  Smartphone, Database, ArrowLeft, Plane, GripHorizontal, History,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import PushNotificationManager from '@/components/PushNotificationManager';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { logoutAction } from '@/app/login/actions';
import { getSafeMembersAction, getCurrentUserAction, updateProfileAction, getInternalDocsAction, addInternalDocAction, deleteInternalDocAction, uploadAvatarAction, getMessagesAction, deleteMessageAction, updateMessageStatusAction } from './actions';
import { ContactMessage } from '@/lib/db';

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

const DASHBOARD_TILES = [
  { id: 'flugbuch', title: 'Flugbuch', desc: 'Erfasse deine Flugzeiten und sieh dir die Historie an.', icon: <Database size={32} />, color: '#f97316' },
  { id: 'mitglieder', title: 'Mitglieder', desc: 'Kontaktliste aller aktiven Piloten im Verein.', icon: <Users size={32} />, color: '#0ea5e9' },
  { id: 'dokumente', title: 'Dokumente', desc: 'Interne Unterlagen, Satzung und Protokolle.', icon: <Files size={32} />, color: '#8b5cf6' },
  { id: 'nachrichten', title: 'Nachrichten', desc: 'Eingegangene Kontaktanfragen (Vorstand).', icon: <Mail size={32} />, color: '#ef4444', role: ['admin', 'board'] },
  { id: 'profil', title: 'Mein Profil', desc: 'Verwalte deine Daten und dein Passwort.', icon: <UserCircle size={32} />, color: '#22c55e' },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tiles, setTiles] = useState(DASHBOARD_TILES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [internalDocs, setInternalDocs] = useState<InternalDoc[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeletingMsg, setIsDeletingMsg] = useState<string | null>(null);
  const [isMobileMsgOpen, setIsMobileMsgOpen] = useState(false);

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
    async function loadMessages() {
      const res = await getMessagesAction();
      if (res.success && res.messages) setMessages(res.messages);
    }
    loadMembers();
    loadUser();
    loadDocs();
    loadMessages();

    const savedOrder = localStorage.getItem('fmscDashboardTilesOrder');
    if (savedOrder) {
      try {
        const orderIds: string[] = JSON.parse(savedOrder);
        const ordered = orderIds.map(id => DASHBOARD_TILES.find(t => t.id === id)).filter(Boolean) as typeof DASHBOARD_TILES;
        DASHBOARD_TILES.forEach(dT => { if (!ordered.find(o => o.id === dT.id)) ordered.push(dT); });
        setTiles(ordered);
      } catch (e) {
        console.error('Error loading tile order', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleReorder = (newTiles: typeof DASHBOARD_TILES) => {
    setTiles(newTiles);
    localStorage.setItem('fmscDashboardTilesOrder', JSON.stringify(newTiles.map(t => t.id)));
  };

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', password: '', oldPassword: '', confirmPassword: '', phone: '' });
  
  useEffect(() => {
    if (activeTab === 'nachrichten' && 'clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge().catch((err: any) => console.error('Clear badge error:', err));
    }
  }, [activeTab]);

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

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Nachricht wirklich löschen?')) {
      setIsDeletingMsg(id);
      const res = await deleteMessageAction(id);
      if (res.success) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
      setIsDeletingMsg(null);
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    const newStatus = msg.status === 'new' ? 'read' : 'new';
    const res = await updateMessageStatusAction(msg.id, newStatus);
    if (res.success) {
      setMessages(messages.map(m => m.id === msg.id ? { ...m, status: newStatus } : m));
      if (selectedMessage?.id === msg.id) setSelectedMessage({ ...selectedMessage, status: newStatus });
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
        <section className="main-content-full">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overview-grid-container">
              <div className="overview-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Hallo{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}! ✈️</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Willkommen zurück im internen FMSC Mitgliederbereich.</p>
                </div>
              </div>
              <p style={{ color: '#f97316', marginBottom: '3rem', fontSize: '0.9rem', fontWeight: 800 }}>Tipp: Kacheln können per Klick geöffnet oder per Grip-Icon (rechts oben) verschoben werden.</p>

              <Reorder.Group 
                axis="y" 
                values={tiles} 
                onReorder={handleReorder} 
                className="tiles-grid" 
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', listStyle: 'none', padding: 0 }}
              >
                {tiles.filter(t => !t.role || (currentUser && t.role.includes(currentUser.role))).map((tile) => (
                  <DashboardTile key={tile.id} tile={tile} setActiveTab={setActiveTab} messages={messages} />
                ))}
              </Reorder.Group>
            </motion.div>
          )}

          {activeTab !== 'overview' && (
            <div className="tab-header-nav" style={{ marginBottom: '2rem' }}>
              <button 
                onClick={() => setActiveTab('overview')}
                className="back-to-overview-btn"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: 'var(--text-secondary)', 
                  padding: '10px 15px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--card-border)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <ArrowLeft size={18} /> Zurück zur Übersicht
              </button>
            </div>
          )}

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

          {activeTab === 'nachrichten' && (currentUser?.role === 'admin' || currentUser?.role === 'board') && (
            <>
              <header className="content-header">
                <div>
                  <h1>Nachrichten Center</h1>
                  <p>Verwalte eingegangene Kontaktanfragen von der Webseite.</p>
                </div>
                <div>
                  <PushNotificationManager />
                </div>
              </header>

              <div className="messages-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', height: '600px' }}>
                <div className="glass message-list-sidebar" style={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-secondary)' }}>Posteingang ({messages.length})</h3>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {messages.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Keine Nachrichten.</div>
                    ) : (
                      messages.map(msg => (
                        <div 
                          key={msg.id} 
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (window.innerWidth < 1024) {
                              setIsMobileMsgOpen(true);
                            }
                          }}
                          className={`msg-item ${selectedMessage?.id === msg.id ? 'active' : ''} ${msg.status === 'new' ? 'unread' : ''}`}
                          style={{
                            padding: '1.25rem',
                            borderBottom: '1px solid var(--card-border)',
                            cursor: 'pointer',
                            position: 'relative',
                            background: selectedMessage?.id === msg.id ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                            borderLeft: selectedMessage?.id === msg.id ? '4px solid #f97316' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{msg.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(msg.date).toLocaleDateString()}</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#f97316', fontWeight: 600, marginBottom: '4px' }}>{msg.subject}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.message}</div>
                          {msg.status === 'new' && <span style={{ position: 'absolute', top: '1.25rem', right: '1rem', width: '8px', height: '8px', background: '#f97316', borderRadius: '50%' }} />}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="glass message-detail-view" style={{ borderRadius: '20px', padding: '2rem', overflowY: 'auto' }}>
                  <AnimatePresence mode="wait">
                    {selectedMessage ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedMessage.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                               <UserCircle size={16} /> <strong>{selectedMessage.name}</strong>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                               <AtSign size={16} /> <a href={`mailto:${selectedMessage.email}`} style={{ color: '#567eb6' }}>{selectedMessage.email}</a>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                               <Calendar size={16} /> {new Date(selectedMessage.date).toLocaleString()}
                             </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleToggleRead(selectedMessage)} className="action-btn-dash" title={selectedMessage.status === 'new' ? "Als gelesen markieren" : "Als ungelesen markieren"} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: selectedMessage.status === 'new' ? '#22c55e' : 'var(--text-secondary)' }}>
                              {selectedMessage.status === 'new' ? <CheckCircle size={20} /> : <Clock size={20} />}
                            </button>
                            <button onClick={() => handleDeleteMessage(selectedMessage.id)} className="action-btn-dash" disabled={isDeletingMsg === selectedMessage.id} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#ef4444' }}>
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{selectedMessage.subject}</h2>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                          {selectedMessage.message}
                        </div>
                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--card-border)' }}>
                          <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, display: 'inline-block' }}>Antworten</a>
                        </div>
                      </motion.div>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                        <Mail size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>Wähle eine Nachricht aus dem Posteingang, um sie hier anzuzeigen.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile Message Modal */}
              <AnimatePresence>
                {isMobileMsgOpen && selectedMessage && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="modal-overlay"
                    style={{ zIndex: 3000 }}
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="glass add-modal"
                      style={{ padding: '2rem', maxWidth: '90%', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                      <div className="modal-header">
                        <h2 style={{ fontSize: '1.25rem' }}>Nachricht Details</h2>
                        <button onClick={() => setIsMobileMsgOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                            <UserCircle size={18} color="#f97316" /> <strong>{selectedMessage.name}</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                            <AtSign size={18} color="#567eb6" /> <a href={`mailto:${selectedMessage.email}`} style={{ color: '#567eb6' }}>{selectedMessage.email}</a>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                            <Calendar size={18} /> {new Date(selectedMessage.date).toLocaleString()}
                          </div>
                        </div>

                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--foreground)' }}>{selectedMessage.subject}</h3>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                          {selectedMessage.message}
                        </div>
                      </div>

                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <a 
                          href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} 
                          style={{ flex: 1, background: '#f97316', color: 'white', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          Antworten
                        </a>
                        <button 
                          onClick={() => handleToggleRead(selectedMessage)} 
                          style={{ flex: '0 0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '12px', cursor: 'pointer', color: selectedMessage.status === 'new' ? '#22c55e' : 'var(--text-secondary)' }}
                        >
                          {selectedMessage.status === 'new' ? <CheckCircle size={20} /> : <Clock size={20} />}
                        </button>
                        <button 
                          onClick={() => { handleDeleteMessage(selectedMessage.id); setIsMobileMsgOpen(false); }} 
                          disabled={isDeletingMsg === selectedMessage.id}
                          style={{ flex: '0 0 auto', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '12px', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          padding: 160px 20px 60px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        .dashboard-tile:hover .tile-icon {
          transform: scale(1.1);
          transition: transform 0.3s;
        }

        .back-to-overview-btn:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: var(--primary) !important;
          color: var(--primary) !important;
        }

        .tab-header-nav {
          display: flex;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .dashboard-container {
            grid-template-columns: 1fr;
          }
          .sidebar { display: none; }
          .message-detail-view { display: none !important; }
          .messages-container { grid-template-columns: 1fr !important; height: auto !important; }
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
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .content-header {
            flex-direction: column;
            align-items: flex-start;
          }
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

const DashboardTile = ({ tile, setActiveTab, messages }: { tile: any, setActiveTab: any, messages: any }) => {
  const controls = useDragControls();
  const [isHolding, setIsHolding] = useState(false);

  return (
    <Reorder.Item
      value={tile}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.05, zIndex: 10, cursor: 'grabbing', boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.7)' }}
      animate={isHolding ? { scale: 1.05, opacity: 0.9 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      onPointerUp={() => setIsHolding(false)}
      onPointerCancel={() => setIsHolding(false)}
      onClick={() => setActiveTab(tile.id)}
      className="glass dashboard-tile"
      style={{ 
        padding: '2.5rem', 
        borderRadius: '24px', 
        cursor: 'pointer', 
        border: '1px solid var(--card-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        onPointerDown={(e) => { setIsHolding(true); controls.start(e); }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem',
          cursor: 'grab',
          touchAction: 'none',
          color: tile.color,
          background: `${tile.color}10`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}
      >
        <GripHorizontal size={20} />
      </div>

      <div className="tile-icon" style={{ color: tile.color, background: `${tile.color}15`, width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {tile.icon}
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>{tile.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{tile.desc}</p>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: tile.color, fontWeight: 700, fontSize: '0.9rem' }}>
         Öffnen <ChevronRight size={18} />
      </div>
      {tile.id === 'nachrichten' && messages.some((m: any) => m.status === 'new') && (
         <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900 }}>
           {messages.filter((m: any) => m.status === 'new').length} NEU
         </div>
      )}
    </Reorder.Item>
  );
};

export default DashboardPage;
