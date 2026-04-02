'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Lock, Mail, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loginAction, checkAuthAction } from './actions';
import { useEffect } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const res = await checkAuthAction();
      if (res.success) {
        if (res.role === 'admin') router.push('/admin');
        else router.push('/dashboard');
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    const res = await loginAction(formData);
    if (res.success) {
      if (res.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      setTimeout(() => router.refresh(), 100);
    } else {
      setError(res.error || 'Fehler beim Einloggen');
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', color: 'var(--foreground)' }}>
        Laden...
      </div>
    );
  }

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
          background: var(--background);
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
          color: var(--foreground);
        }

        .login-header p {
          color: var(--text-secondary);
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
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--foreground);
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
          color: var(--foreground);
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
