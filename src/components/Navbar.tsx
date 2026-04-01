'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Plane, User, ChevronDown, LayoutDashboard, Info, Users, MapPin, Calendar, MessageSquare, Newspaper, Image, FileText, Archive, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutSubLinks = [
    { name: 'Verein (Übersicht)', href: '/about', icon: Info },
    { name: 'Unser Vorstand', href: '/vorstand', icon: Users },
    { name: 'Unser Flugplatz', href: '/flugplatz', icon: MapPin },
  ];

  const mediaSubLinks = [
    { name: 'Galerie', href: '/gallery', icon: Image },
    { name: 'Bauberichte', href: '/bauberichte', icon: FileText },
    { name: 'Archiv', href: '/archiv', icon: Archive },
  ];

  const allLinksForMobile = [
    { name: 'Navigation...', href: '' },
    { name: 'Home', href: '/' },
    { name: 'Neuigkeiten', href: '/news' },
    { name: 'Verein (Übersicht)', href: '/about' },
    { name: 'Unser Vorstand', href: '/vorstand' },
    { name: 'Unser Flugplatz', href: '/flugplatz' },
    { name: 'Galerie', href: '/gallery' },
    { name: 'Bauberichte', href: '/bauberichte' },
    { name: 'Archiv', href: '/archiv' },
    { name: 'Termine', href: '/events' },
    { name: 'Infos', href: '/info' },
    { name: 'Kontakt', href: '/contact' },
    { name: 'Mitgliederbereich', href: '/login' },
  ];

  const handleMobileNav = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const href = e.target.value;
    if (href) {
      router.push(href);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <Link href="/" className="logo">
            <div className="logo-text">
              <span className="logo-title">Flugmodellsportclub</span>
              <span className="logo-subtitle">Königshoven 1975 e.V.</span>
            </div>

          </Link>

          {/* Desktop Nav */}
          <div className="desktop-links">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link href="/news" className={`nav-link ${pathname === '/news' ? 'active' : ''}`}>Neuigkeiten</Link>

            {/* Dropdown "Wir über uns" */}
            <div
              className="dropdown-container"
              onMouseEnter={() => setOpenDropdown('about')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`nav-link dropdown-trigger ${(pathname.startsWith('/about') || pathname === '/vorstand' || pathname === '/flugplatz') ? 'active' : ''}`}>
                Verein <ChevronDown size={14} className={`chevron ${openDropdown === 'about' ? 'rotated' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="dropdown-menu glass"
                  >
                    {aboutSubLinks.map((sub) => (
                      <Link key={sub.href} href={sub.href} className={`dropdown-item ${pathname === sub.href ? 'active' : ''}`} onClick={() => setOpenDropdown(null)}>
                        <sub.icon size={16} /> <span>{sub.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown "Medien" */}
            <div
              className="dropdown-container"
              onMouseEnter={() => setOpenDropdown('media')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`nav-link dropdown-trigger ${(pathname === '/gallery' || pathname === '/bauberichte' || pathname === '/archiv') ? 'active' : ''}`}>
                Medien <ChevronDown size={14} className={`chevron ${openDropdown === 'media' ? 'rotated' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'media' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="dropdown-menu glass"
                  >
                    {mediaSubLinks.map((sub) => (
                      <Link key={sub.href} href={sub.href} className={`dropdown-item ${pathname === sub.href ? 'active' : ''}`} onClick={() => setOpenDropdown(null)}>
                        <sub.icon size={16} /> <span>{sub.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/events" className={`nav-link ${pathname === '/events' ? 'active' : ''}`}>Termine</Link>
            <Link href="/info" className={`nav-link ${pathname === '/info' ? 'active' : ''}`}>Infos</Link>
            <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Kontakt</Link>

            <Link href="/login" className="login-btn">
              <LayoutDashboard size={18} />
              <span>Intern</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mobile-nav-wrapper">
        <div className="select-container">
          <select className="mobile-select" onChange={handleMobileNav} value={pathname}>
            {allLinksForMobile.map((link) => (
              <option key={link.name} value={link.href}> {link.name} </option>
            ))}
          </select>
          <ChevronDown className="select-icon" size={20} />
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          height: 80px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          background: transparent;
        }

        .navbar.scrolled {
          height: 70px;
          background: rgba(10, 12, 16, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .nav-content { justify-content: center; }
        }

        .logo {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 10px;
          color: white;
          text-decoration: none;
          white-space: nowrap;
        }

        .logo-icon { color: #567eb6; flex-shrink: 0; }

        .logo-text { 
          display: flex; 
          flex-direction: row; 
          align-items: baseline;
          gap: 10px;
          line-height: 1; 
        }
        .logo-title { 
          font-weight: 900; 
          font-size: 1.1rem; 
          letter-spacing: -0.2px; 
        }
        .logo-subtitle { 
          font-size: 1rem; 
          color: white;
          opacity: 0.7;
          font-weight: 500; 
          letter-spacing: 1.5px; 
        }

        @media (max-width: 1200px) {
          .logo-title { font-size: 0.95rem; }
          .logo-subtitle { font-size: 0.85rem; letter-spacing: 1px; }
          .logo { gap: 8px; }
        }

        @media (max-width: 768px) {
          .logo-title { font-size: 0.85rem; letter-spacing: 0; }
          .logo-subtitle { font-size: 0.75rem; letter-spacing: 0.5px; }
          .logo { gap: 6px; }
          .logo-icon { width: 20px; height: 20px; }
        }

        .desktop-links {
          display: none;
          align-items: center;
          gap: 1.25rem;
        }

        @media (min-width: 1024px) {
          .desktop-links { display: flex; }
        }

        .nav-link {
          color: white;
          opacity: 0.7;
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-link:hover, .nav-link.active {
          opacity: 1;
          color: #567eb6;
        }

        .dropdown-container { position: relative; }
        .dropdown-trigger { background: none; border: none; cursor: pointer; font-family: inherit; }

        .chevron { transition: transform 0.2s ease; }
        .chevron.rotated { transform: rotate(180deg); }

        :global(.dropdown-menu) {
          position: absolute;
          top: calc(100% + 25px);
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          padding: 10px;
          border-radius: 20px;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 20px rgba(86, 126, 182, 0.1);
          display: flex !important;
          flex-direction: column !important;
          gap: 6px;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          background: rgba(10, 12, 16, 0.9) !important;
          backdrop-filter: blur(30px) !important;
          -webkit-backdrop-filter: blur(30px) !important;
          z-index: 10000;
        }

        /* Dropdown Arrow Indicator */
        :global(.dropdown-menu::before) {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid rgba(255, 255, 255, 0.12);
        }

        :global(.dropdown-item) {
          display: flex !important;
          align-items: center !important;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          text-decoration: none !important;
        }

        :global(.dropdown-item:hover), :global(.dropdown-item.active) {
          background: rgba(86, 126, 182, 0.15) !important;
          color: #567eb6 !important;
          opacity: 1 !important;
          border-color: rgba(86, 126, 182, 0.3) !important;
          transform: translateX(6px);
        }

        :global(.dropdown-item svg) {
          transition: transform 0.3s ease;
          color: rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        :global(.dropdown-item:hover svg) {
          transform: scale(1.1) rotate(5deg);
          color: #567eb6;
        }

        .login-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #c00000;
          color: white;
          padding: 8px 18px;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;
        }

        .login-btn:hover { background: #e60000; transform: translateY(-2px); }

        .mobile-nav-wrapper {
          position: fixed;
          bottom: 1.5rem; left: 1.5rem; right: 1.5rem;
          z-index: 2000;
          display: block;
        }

        @media (min-width: 1024px) {
          .mobile-nav-wrapper { display: none; }
        }

        .select-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border-radius: 16px;
        }

        .mobile-select {
          appearance: none;
          background: rgba(20, 25, 35, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 14px 20px;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 700;
          width: 100%;
          cursor: pointer;
          outline: none;
          text-align: center;
        }

        .select-icon {
          position: absolute;
          right: 16px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #567eb6;
        }
      `}</style>
    </>
  );
};

export default Navbar;
