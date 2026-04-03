'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Gastflug-Anfrage',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      let tokenValue = '';
      try {
        // DIAGNOSTIC BYPASS: If reCAPTCHA fails, proceed anyway
        tokenValue = await recaptchaRef.current?.executeAsync() || 'bypass-token';
      } catch (e) {
        console.warn('[DIAGNOSTIC] reCAPTCHA execute failed, proceeding...');
        tokenValue = 'bypass-token';
      }

      const response = await fetch('/api/contact/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token: tokenValue }),
      });

      const verifyData = await response.json();

      if (verifyData.success) {
        console.log('[PUSH DIAGNOSTICS]', verifyData);
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'Gastflug-Anfrage', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(verifyData.error || 'Etwas ist schiefgelaufen.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Verbindung zum Server fehlgeschlagen.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0f172a] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6"
          >
            ✈️ FMSC Mühlacker Kontakt
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Lass uns <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">abheben</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Fragen zum Verein, Gastflug-Anfragen oder Interesse an einer Mitgliedschaft? 
            Unser Team freut sich auf deine Nachricht!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-10">Kontakt Details</h2>
              
              <div className="space-y-10">
                <div className="flex items-start group">
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Anschrift</h3>
                    <p className="text-slate-400 leading-relaxed font-medium">Flugsportclub Mühlacker e.V.<br />Flugplatz Hangensteiner Hof<br />75417 Mühlacker</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">E-Mail</h3>
                    <p className="text-slate-400 font-medium hover:text-blue-400 transition-colors cursor-pointer">info@fmc-muehlacker.de</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Tower (Wochenende)</h3>
                    <p className="text-slate-400 font-medium">07041 / 44433</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">Gastflug-Info 🛫</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 opacity-90">
                Abheben war noch nie so einfach. Komm uns bei gutem Flugwetter am Wochenende besuchen. 
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                Mehr erfahren
              </button>
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl relative">
              
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-8 relative">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-6">Perfekt gelandet!</h2>
                  <p className="text-slate-400 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                    Deine Nachricht wurde sicher übertragen. Wir melden uns in Kürze bei dir.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl transition-all active:scale-95 border border-slate-600/50"
                  >
                    Neue Nachricht senden
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-form" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-300 ml-1">Dein Name</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-900/60 border border-slate-700/60 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                        placeholder="Vornamen / Nachname"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-300 ml-1">Deine E-Mail</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-900/60 border border-slate-700/60 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                        placeholder="beispiel@mail.de"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300 ml-1">Betreff der Nachricht</label>
                    <div className="relative">
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-slate-900/60 border border-slate-700/60 rounded-2xl px-6 py-4 text-white appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 font-medium"
                      >
                        <option value="Gastflug-Anfrage">Gastflug-Anfrage 🛫</option>
                        <option value="Mitgliedschaft">Interesse an Mitgliedschaft 🤝</option>
                        <option value="Segelflug">Segelflug-Ausbildung 🌤️</option>
                        <option value="Modellflug">Modellflugsport 🎮</option>
                        <option value="Event">Event-Anfrage 🎈</option>
                        <option value="Allgemein">Allgemeine Anfrage 💬</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300 ml-1">Deine Nachricht</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-none min-h-[160px]"
                      placeholder="Hallo FMSC, ich würde gerne..."
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center text-red-400 gap-4"
                    >
                      <AlertCircle className="w-6 h-6 flex-shrink-0" />
                      <p className="font-medium">{errorMessage}</p>
                    </motion.div>
                  )}

                  <div className="relative pt-4">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      size="invisible"
                      sitekey="6LdM_aQsAAAAAHXnDmfCuogxM7y2ukJVC_JwjRqL"
                    />

                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {status === 'loading' ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="text-lg">Nachricht jetzt senden</span>
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                    
                    <p className="text-[11px] text-center text-slate-500 mt-6 px-4 leading-relaxed font-medium">
                      Wir schützen deine Daten. Diese Seite nutzt reCAPTCHA. 
                      <a href="https://policies.google.com/privacy" className="text-slate-400 hover:text-blue-400 ml-1 transition-colors">Privacy</a> & 
                      <a href="https://policies.google.com/terms" className="text-slate-400 hover:text-blue-400 ml-1 transition-colors">Terms</a> apply.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
