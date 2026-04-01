'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cloud, History, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'Wetter', icon: Cloud, href: '/weather' }, // Placeholder for detailed weather or just scroll to section
    { title: 'Log', icon: History, href: '/dashboard' },
    { title: 'Profil', icon: User, href: '/login' },
  ];

  return (
    <nav className="bottom-nav glass mobile-only">
      <div className="nav-items">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.title} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
              <item.icon size={22} />
              <span>{item.title}</span>
              {isActive && (
                <motion.div 
                  layoutId="bubble"
                  className="active-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--bottom-nav-height);
          border-top: 1px solid var(--card-border);
          padding: 0 1rem;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .nav-items {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--foreground);
          opacity: 0.6;
          transition: all 0.3s;
          position: relative;
          width: 20%;
          padding: 8px 0;
        }

        .nav-item.active {
          opacity: 1;
          color: var(--primary);
        }

        .nav-item span {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          top: -10px;
          width: 24px;
          height: 3px;
          background: var(--primary);
          border-radius: 99px;
          box-shadow: 0 0 10px var(--primary);
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
