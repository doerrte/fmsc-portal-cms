'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Lock, Mail, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loginAction } from './actions';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('password', password);
    const res = await loginAction(formData);
    if (res.success) {
      router.push('/admin'); // Springe direkt ins Admin-Dashboard!
      router.refresh();
    } else {
      setError(res.error || 'Fehler beim Einloggen');
    }
  };

  return (
    <main className="login-page">
      <Navbar />

      <div className="login-container">
        <div className="login-card glass animate-fade-in">
          <div className="login-header">
            <Plane size={48} className="icon-orange" />
            <h1>Mitgliederbereich</h1>
            <p>Bitte loggen Sie sich ein, um auf das Flugbuch und interne Infos zuzugreifen.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label><Mail size={16} /> Email</label>
              <input
                type="email"
                placeholder="pilot@fmsc.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label><Lock size={16} /> Passwort</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-submit">
              Anmelden
              <ArrowRight size={20} />
            </button>
            {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 'bold' }}>{error}</p>}
          </form>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #0a0c10;
          display: flex;
          flex-direction: column;
        }

        .login-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 60px;
          background: radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 60%);
        }

        .login-card {
          width: 100%;
          max-width: 450px;
          padding: 3rem;
          border-radius: 32px;
          text-align: center;
        }

        .login-header {
          margin-bottom: 2.5rem;
        }

        .icon-orange {
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: white;
        }

        .login-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
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
          display: flex;
          align-items: center;
          gap: 8px;
        }

        input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          border-radius: 12px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.2s;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.1);
        }

        .login-submit {
          background: var(--primary);
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1rem;
          transition: all 0.2s;
          margin-top: 1rem;
        }

        .login-submit:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(251, 146, 60, 0.3);
        }
      `}</style>
    </main>
  );
};

export default LoginPage;
