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
        // Diagnostic Bypass: We try to get the token, but if Google fails (401), we proceed with empty string
        tokenValue = await recaptchaRef.current?.executeAsync() || '';
      } catch (e) {
        console.warn('[DIAGNOSTIC] reCAPTCHA execute failed, proceeding without token...');
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
    <div className="min-h-screen pt-24 pb-12 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Kontaktiere uns
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400"
          >
            Fragen zum Verein, Gastflug-Anfragen oder Interesse an einer Mitgliedschaft? 
            Schreib uns einfach!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-8">Kontakt Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500/10 p-3 rounded-lg mr-4">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Anschrift</h3>
                    <p className="text-slate-400">Flugsportclub Mühlacker e.V.<br />Flugplatz Hangensteiner Hof<br />75417 Mühlacker</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/10 p-3 rounded-lg mr-4">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">E-Mail</h3>
                    <p className="text-slate-400">info@fmc-muehlacker.de</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/10 p-3 rounded-lg mr-4">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Wochenend-Telefon</h3>
                    <p className="text-slate-400">07041 / 44433</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-2xl shadow-lg shadow-blue-500/20">
              <h3 className="text-xl font-bold text-white mb-2">Gastflug-Info</h3>
              <p className="text-blue-100 mb-4 text-sm leading-relaxed">
                Gastflüge sind bei gutem Wetter an Wochenenden und Feiertagen möglich. 
                Bitte kontaktiere uns vorab oder komm einfach am Flugplatz vorbei!
              </p>
              <a href="#form" className="inline-block bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Anfrage senden
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            id="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
              
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Nachricht gesendet!</h2>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Vielen Dank für deine Anfrage. Wir haben sie erhalten und werden uns schnellstmöglich bei dir melden.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Eine weitere Nachricht senden
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Dein Name</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Deine E-Mail</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="max@beispiel.de"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Betreff</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Gastflug-Anfrage">Gastflug-Anfrage</option>
                      <option value="Mitgliedschaft">Interesse an Mitgliedschaft</option>
                      <option value="Modellflug">Modellflug</option>
                      <option value="Segelflug">Segelflug</option>
                      <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Deine Nachricht</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Wie können wir dir helfen?"
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400 gap-3"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{errorMessage}</p>
                    </motion.div>
                  )}

                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey="6LdM_aQsAAAAAHXnDmfCuogxM7y2ukJVC_JwjRqL"
                  />

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transition-colors active:scale-[0.98] ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {status === 'loading' ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Absenden
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-4 px-8">
                    Diese Seite ist durch reCAPTCHA geschützt und es gelten die 
                    <a href="https://policies.google.com/privacy" className="hover:text-blue-400 ml-1">Datenschutzbestimmungen</a> und 
                    <a href="https://policies.google.com/terms" className="hover:text-blue-400 ml-1">Nutzungsbedingungen</a> von Google.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
