'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAdmin } from './AdminContext';
import { Edit3 } from 'lucide-react';

export default function EditButton({ href, label = 'Bearbeiten' }: { href: string; label?: string }) {
  const isAdmin = useAdmin();

  if (!isAdmin) return null;

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginLeft: '16px', verticalAlign: 'middle' }}>
      <motion.div
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        style={{ position: 'relative' }}
      >
        <Link href={href} className="admin-edit-btn">
          <Edit3 size={14} /> {label}
          <motion.div 
            className="btn-shine"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
          />
        </Link>
      </motion.div>

      <style jsx>{`
        .admin-edit-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white !important;
          -webkit-text-fill-color: white !important;
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          letter-spacing: 0.5px;
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-20deg);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
