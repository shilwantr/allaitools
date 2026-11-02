import React from 'react';
import { X, ExternalLink, Star, MousePointerClick, CheckCircle2, ShieldCheck, Tag, Info } from 'lucide-react';

export const ToolModal = ({ tool, rank, onClose, onVisitTool }) => {
  if (!tool) return null;

  const handleLaunch = () => {
    onVisitTool(tool);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div
            className="modal-avatar"
            style={{ background: tool.bgGradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {tool.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="modal-title">{tool.name}</h2>
              {tool.verified && <ShieldCheck className="verified-icon" size={20} />}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Developed by <strong style={{ color: '#fff' }}>{tool.developer}</strong> • Rank #{rank}
            </p>
          </div>
        </div>

        {/* Badges strip */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <span className="category-chip active" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
            <Tag size={12} />
            {tool.category}
          </span>
          {tool.badges?.map((badge, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)'
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="modal-section-title">About {tool.name}</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {tool.description}
          </p>
        </div>

        {/* Key Features Grid */}
        <div>
          <h3 className="modal-section-title">Key Capabilities & Features</h3>
          <div className="modal-features-grid">
            {tool.keyFeatures?.map((feature, idx) => (
              <div key={idx} className="modal-feature-card">
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Clicks Box */}
        <div
          style={{
            background: 'rgba(8, 9, 20, 0.6)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            margin: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>PRICING MODEL</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {tool.pricing} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>({tool.pricingDetails})</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>TOTAL CLICKS</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MousePointerClick size={16} />
                {tool.clicks.toLocaleString()}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>USER RATING</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={16} fill="#fbbf24" />
                {tool.rating} ({tool.ratingCount} reviews)
              </div>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <button className="btn-visit" style={{ width: '100%', padding: '0.9rem' }} onClick={handleLaunch}>
          <span>Launch {tool.name} Official Site</span>
          <ExternalLink size={17} />
        </button>
      </div>
    </div>
  );
};
