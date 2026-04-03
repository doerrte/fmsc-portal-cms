'use client';

import React, { useState } from 'react';
import { ContactMessage } from '@/lib/db';
import { Mail, Trash2, CheckCircle, Clock, ChevronRight, MessageSquare, User, AtSign, Calendar, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteMessage, updateMessageStatus } from './actions';
import Link from 'next/link';
import PushNotificationManager from '@/components/PushNotificationManager';

interface MessagesClientProps {
  initialMessages: ContactMessage[];
}

export default function MessagesClient({ initialMessages }: MessagesClientProps) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Möchtest du diese Nachricht wirklich unwiderruflich löschen?')) {
      setIsDeleting(id);
      await deleteMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      setIsDeleting(null);
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    const newStatus = msg.status === 'new' ? 'read' : 'new';
    await updateMessageStatus(msg.id, newStatus);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="messages-layout">
      <div className="messages-header">
        <Link href="/admin" className="back-btn">
          <ArrowLeft size={20} />
          <span>Dashboard</span>
        </Link>
        <h1 className="title-gradient">Nachrichten Center</h1>
        <p className="subtitle">Verwalte eingegangene Kontaktanfragen von der Webseite.</p>

        <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '16px', border: '1px dashed #f97316' }}>
          <p style={{ color: '#f97316', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>DEBUG: Admin Push-Manager Bereich</p>
          <PushNotificationManager />
        </div>
      </div>

      <div className="messages-grid">
        {/* Sidebar: List of messages */}
        <div className="messages-list glass">
          <div className="list-header">
            <h3>Posteingang ({initialMessages.length})</h3>
          </div>
          <div className="list-content">
            {initialMessages.length === 0 ? (
              <div className="empty-state">
                <Mail size={48} className="text-tertiary" />
                <p>Keine Nachrichten vorhanden.</p>
              </div>
            ) : (
              initialMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`message-item ${selectedMessage?.id === msg.id ? 'active' : ''} ${msg.status === 'new' ? 'unread' : ''}`}
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="message-item-header">
                    <span className="msg-name">{msg.name}</span>
                    <span className="msg-date">{new Date(msg.date).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div className="msg-subject">{msg.subject}</div>
                  {/* Safe substring for message teaser */}
                  <div className="msg-teaser">{msg.message?.substring(0, 60) || ''}...</div>
                  {msg.status === 'new' && <span className="unread-dot" />}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content: Message Details */}
        <div className="message-detail glass">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div 
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="detail-content"
              >
                <div className="detail-header">
                  <div className="detail-meta">
                    <div className="meta-item">
                      <User size={16} />
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="meta-item">
                      <AtSign size={16} />
                      <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{formatDate(selectedMessage.date)}</span>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button 
                      className={`action-btn ${selectedMessage.status === 'new' ? 'btn-mark-read' : 'btn-mark-unread'}`}
                      onClick={() => handleToggleRead(selectedMessage)}
                      title={selectedMessage.status === 'new' ? 'Gelesen markieren' : 'Ungelesen markieren'}
                    >
                      {selectedMessage.status === 'new' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </button>
                    <button 
                      className="action-btn btn-delete" 
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={isDeleting === selectedMessage.id}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="detail-body">
                  <h2 className="detail-subject">{selectedMessage.subject}</h2>
                  <div className="detail-text">
                    {selectedMessage.message.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="detail-footer">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="reply-btn">
                    Direkt Antworten
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="no-selection">
                <MessageSquare size={64} className="text-tertiary" />
                <p>Wähle eine Nachricht aus, um Details anzuzeigen.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .messages-layout {
          max-width: 1200px;
          margin: 0 auto;
          color: var(--foreground);
        }

        .messages-header {
          margin-bottom: 2rem;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          transition: color 0.2s;
        }

        .back-btn:hover { color: #f97316; }

        .title-gradient {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .messages-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          height: 600px;
        }

        @media (max-width: 900px) {
          .messages-grid { grid-template-columns: 1fr; height: auto; }
          .message-detail { display: ${selectedMessage ? 'block' : 'none'}; }
        }

        .messages-list, .message-detail {
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .list-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.02);
        }

        .list-header h3 { font-size: 1rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }

        .list-content {
          flex: 1;
          overflow-y: auto;
        }

        .message-item {
          padding: 1.5rem;
          border-bottom: 1px solid var(--card-border);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
        }

        .message-item:hover { background: rgba(255, 255, 255, 0.03); }
        .message-item.active { background: rgba(249, 115, 22, 0.1); border-left: 4px solid #f97316; }
        .message-item.unread { background: rgba(255, 255, 255, 0.04); }

        .unread-dot {
          position: absolute;
          top: 1.5rem;
          right: 1rem;
          width: 8px;
          height: 8px;
          background: #f97316;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
        }

        .message-item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .msg-name { font-weight: 800; font-size: 0.9rem; }
        .msg-date { font-size: 0.75rem; color: var(--text-tertiary); }
        .msg-subject { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; color: #f97316; }
        .msg-teaser { font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .detail-content {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--card-border);
          margin-bottom: 2rem;
        }

        .detail-meta { display: flex; flex-direction: column; gap: 8px; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-secondary); }
        .meta-item a { color: #567eb6; }
        .meta-item a:hover { text-decoration: underline; }

        .detail-actions { display: flex; gap: 10px; }
        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .action-btn:hover { background: rgba(255, 255, 255, 0.05); color: var(--foreground); transform: translateY(-2px); }
        .btn-delete:hover { border-color: #ef4444; color: #ef4444; }
        .btn-mark-read:hover { border-color: #22c55e; color: #22c55e; }

        .detail-body { flex: 1; overflow-y: auto; }
        .detail-subject { font-size: 1.8rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--foreground); }
        .detail-text { color: var(--text-secondary); line-height: 1.8; font-size: 1.1rem; }
        .detail-text p { margin-bottom: 1rem; }

        .detail-footer { padding-top: 2rem; border-top: 1px solid var(--card-border); margin-top: 2rem; }
        .reply-btn {
          display: inline-block;
          background: #f97316;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 800;
          transition: all 0.2s;
        }
        .reply-btn:hover { background: #ea580c; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3); }

        .no-selection {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          color: var(--text-tertiary);
        }

        .empty-state {
          padding: 3rem;
          text-align: center;
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}
