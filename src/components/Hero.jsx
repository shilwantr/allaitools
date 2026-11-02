import React from 'react';
import { Flame, MousePointerClick, Cpu, Star, Zap } from 'lucide-react';

export const Hero = ({ totalToolsCount, totalClicksCount }) => {
  const formattedClicks = (totalClicksCount / 1000).toFixed(1) + 'k+';

  return (
    <section className="hero-section">
      <div className="hero-pill">
        <Zap size={14} color="#a5b4fc" />
        <span>Real-Time Community Rank Engine</span>
      </div>

      <h1 className="hero-title">
        Discover, Rank & Experience <br />
        <span className="gradient-text">The World’s Best AI Tools</span>
      </h1>

      <p className="hero-subtitle">
        Curated directory of high-impact AI applications. Hover over any card for a quick brief, 
        click to launch the tool, and automatically boost its live popularity rank!
      </p>

      <div className="hero-stats-row">
        <div className="hero-stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={18} color="#818cf8" />
            <span className="stat-value">{totalToolsCount}</span>
          </div>
          <span className="stat-label">Indexed AI Tools</span>
        </div>

        <div className="hero-stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MousePointerClick size={18} color="#38bdf8" />
            <span className="stat-value">{formattedClicks}</span>
          </div>
          <span className="stat-label">Redirect Clicks</span>
        </div>

        <div className="hero-stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={18} color="#fbbf24" />
            <span className="stat-value">4.8 / 5.0</span>
          </div>
          <span className="stat-label">Verified Ratings</span>
        </div>

        <div className="hero-stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={18} color="#f43f5e" />
            <span className="stat-value">7 Categories</span>
          </div>
          <span className="stat-label">Domains Covered</span>
        </div>
      </div>
    </section>
  );
};
