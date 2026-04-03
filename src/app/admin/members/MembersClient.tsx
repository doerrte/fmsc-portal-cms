'use client';

import React, { useState } from 'react';
import { addMemberAction, updateMemberAction, deleteMemberAction } from './actions';
import { UserPlus, Shield, User, Trash2, Edit2, Check, X } from 'lucide-react';
import type { MemberItem } from '@/lib/db';

export default function MembersClient({ initialMembers }: { initialMembers: MemberItem[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'member' as 'admin' | 'board' | 'member'
  });

  const [editData, setEditData] = useState({
    role: 'member' as 'admin' | 'board' | 'member',
    phone: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('phone', formData.phone);
    form.append('role', formData.role);

    const res = await addMemberAction(form);
    if (res.success) {
      window.location.reload(); // Refresh to pull server data
    } else {
      setError(res.error || 'Fehler beim Erstellen');
    }
  };

  const handleEditInit = (m: MemberItem) => {
    setEditingId(m.id);
    setEditData({ role: m.role, phone: m.phone || '', password: '' });
  };

  const handleEditSubmit = async (m: MemberItem) => {
    setError('');
    const form = new FormData();
    form.append('id', m.id);
    form.append('role', editData.role);
    if (editData.password) form.append('password', editData.password);

    const res = await updateMemberAction(form);
    if (res.success) {
      window.location.reload();
    } else {
      setError(res.error || 'Fehler beim Update');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Soll der Account von ${name} wirklich gelöscht werden?`)) {
      await deleteMemberAction(id);
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Mitglieder Verwaltung</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Lege neue Accounts an, damit Mitglieder Zugriff auf das Flugbuch erhalten. 
        Admins können zusätzlich dieses Panel betreten.
      </p>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      {/* Adding Box */}
      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="admin-tile-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginBottom: '3rem' }}
        >
          <UserPlus size={20} /> Neues Mitglied anlegen
        </button>
      ) : (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="var(--primary)" /> Neuen Account erstellen
          </h2>
          <form onSubmit={handleAddSubmit} className="admin-list">
            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Vor- und Nachname</label>
                <input 
                  required type="text" placeholder="Max Mustermann"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--foreground)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>E-Mail Adresse (Benutzername)</label>
                <input 
                  required type="email" placeholder="max@beispiel.de"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--foreground)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Initiales Passwort</label>
                <input 
                  required type="text" placeholder="SicheresPasswort123"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--foreground)' }}
                />
                <input 
                  type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Handynummer (optional)"
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--foreground)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Rolle</label>
                <select 
                  value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as 'admin'|'board'|'member'})}
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--foreground)' }}
                >
                  <option value="member" style={{ color: 'black' }}>Standard-Mitglied (Nur Dashboard)</option>
                  <option value="board" style={{ color: 'black' }}>Vorstandsmitglied (Dashboard + Dokumente)</option>
                  <option value="admin" style={{ color: 'black' }}>Administrator (Voller Zugriff)</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{ background: 'var(--primary)', color: 'var(--foreground)', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                Speichern
              </button>
              <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--foreground)', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Member List */}
      <div className="admin-list">
        {members.map(m => (
          <div key={m.id} className="admin-card-item">
            
            {editingId === m.id ? (
              // Edit Mode
              <div className="admin-grid-2" style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Account von</span>
                  <strong>{m.name} ({m.email})</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Neues Passwort</label>
                  <input 
                    type="text" placeholder="Passwort ändern"
                    value={editData.password} onChange={(e) => setEditData({...editData, password: e.target.value})}
                    style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--foreground)', width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Handy</label>
                  <input 
                    type="text" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--foreground)', width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rolle</label>
                  <select 
                    value={editData.role} onChange={(e) => setEditData({...editData, role: e.target.value as 'admin'|'board'|'member'})}
                    style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--foreground)', width: '100%' }}
                  >
                    <option value="member" style={{ color: 'black' }}>Mitglied</option>
                    <option value="board" style={{ color: 'black' }}>Vorstand</option>
                    <option value="admin" style={{ color: 'black' }}>Admin</option>
                  </select>
                </div>

                <div className="admin-card-actions" style={{ gridColumn: '1 / -1' }}>
                  <button onClick={() => handleEditSubmit(m)} style={{ padding: '8px 12px', background: '#22c55e', color: 'var(--foreground)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={16} /> Speichern
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', color: 'var(--foreground)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <X size={16} /> Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: m.role === 'admin' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.role === 'admin' ? '#f97316' : 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                    {m.profileImage ? (
                      <img src={m.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      m.role === 'admin' ? <Shield size={24} /> : <User size={24} />
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{m.name}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{m.email}</span>
                      {m.phone && <span style={{ color: '#567eb6', fontSize: '0.85rem', fontWeight: '600' }}>{m.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="admin-card-actions">
                  <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: m.role === 'admin' ? '#f97316' : (m.role === 'board' ? '#567eb6' : 'rgba(255,255,255,0.1)'), borderRadius: '99px', fontWeight: 'bold' }}>
                    {m.role === 'admin' ? 'Administrator' : (m.role === 'board' ? 'Vorstand' : 'Mitglied')}
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEditInit(m)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', color: 'var(--foreground)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Bearbeiten">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(m.id, m.name)} style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '8px', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Löschen">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Noch keine Mitglieder angelegt.</p>
        )}
      </div>
    </div>
  );
}
