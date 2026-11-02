import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={18} color="var(--accent-indigo)" />
          <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            AI Tool Matrix
          </span>
          <span className="footer-text">© 2026 AI Tool Discovery</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }}
          />
          <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
            Realtime Click Tracker Active
          </span>
        </div>

        <div className="footer-text" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          Crafted with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for AI Creators
        </div>
      </div>
    </footer>
  );
};
