import React, { useState } from 'react';
import { ExternalLink, Star, MousePointerClick, Bookmark, CheckCircle2, Trophy, Award, ShieldCheck, ChevronRight } from 'lucide-react';

export const ToolCard = ({
  tool,
  rank,
  isBookmarked,
  onToggleBookmark,
  onVisitTool,
  onOpenToolPage
}) => {
  const [isClicking, setIsClicking] = useState(false);

  // Format click numbers (e.g. 184500 -> 184.5k)
  const formatClicks = (clicks) => {
    if (clicks >= 1000000) return (clicks / 1000000).toFixed(1) + 'M';
    if (clicks >= 1000) return (clicks / 1000).toFixed(1) + 'k';
    return clicks.toString();
  };

  // Determine Rank styling
  let rankClass = 'rank-normal';
  let RankIcon = null;
  if (rank === 1) {
    rankClass = 'rank-gold';
    RankIcon = Trophy;
  } else if (rank === 2) {
    rankClass = 'rank-silver';
    RankIcon = Award;
  } else if (rank === 3) {
    rankClass = 'rank-bronze';
    RankIcon = Award;
  }

  // Handle direct visit link click (redirects to the official tool website)
  const handleDirectVisitClick = (e) => {
    e.stopPropagation();
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 800);
    onVisitTool(tool);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  // Handle clicking the card to open its dedicated page
  const handleCardClick = () => {
    if (onOpenToolPage) {
      onOpenToolPage(tool);
    }
  };

  // Pricing class map
  const pricingClass = `pricing-${tool.pricing.toLowerCase()}`;

  return (
    <div
      className="tool-card"
      onClick={handleCardClick}
      title={`Click to open dedicated page for ${tool.name} (/${tool.id})`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
    >
      {/* Rank Badge */}
      <div className={`rank-badge ${rankClass}`}>
        {RankIcon && <RankIcon size={12} />}
        <span>#{rank}</span>
      </div>

      {/* Bookmark Button */}
      <button
        className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark(tool.id);
        }}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this tool'}
        aria-label="Bookmark this tool"
      >
        <Bookmark size={17} fill={isBookmarked ? '#f43f5e' : 'none'} />
      </button>

      {/* Card Body Info */}
      <div>
        <div className="tool-card-header">
          <div
            className="tool-avatar"
            style={{ background: tool.bgGradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {tool.name.charAt(0)}
          </div>
          <div className="tool-meta">
            <div className="tool-name-row">
              <span className="tool-title">{tool.name}</span>
              {tool.verified && <ShieldCheck className="verified-icon" title="Verified AI Tool" />}
            </div>
            <span className="tool-developer">by {tool.developer}</span>
          </div>
        </div>

        <p className="tool-tagline">{tool.tagline}</p>

        {/* Metrics Bar */}
        <div className="tool-metrics-strip">
          <div className="metric-item">
            <MousePointerClick size={14} color="#38bdf8" />
            <span className={`metric-click-count ${isClicking ? 'incrementing' : ''}`}>
              {formatClicks(tool.clicks)} clicks
            </span>
          </div>

          <div className="metric-item">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <span>{tool.rating}</span>
          </div>

          <span className={`pricing-badge ${pricingClass}`}>{tool.pricing}</span>
        </div>
      </div>

      {/* Hover Brief Glass Overlay */}
      <div className="card-hover-overlay">
        <div>
          <div className="hover-overlay-header">
            <span className="hover-overlay-title">{tool.name}</span>
            <span className={`pricing-badge ${pricingClass}`}>{tool.pricing}</span>
          </div>
          <p className="hover-brief-text">{tool.hoverSummary || tool.tagline}</p>
          
          <ul className="hover-features-list">
            {tool.keyFeatures?.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="hover-feature-item">
                <CheckCircle2 className="hover-feature-icon" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-actions-row">
          <button
            className="btn-visit"
            onClick={handleDirectVisitClick}
            title={`Redirect directly to official ${tool.name} website`}
          >
            <span>Open Tool</span>
            <ExternalLink size={15} />
          </button>

          <button
            className="btn-quick-view"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            title="Open Dedicated Tool Page & Parameters"
          >
            <span>Details</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Base Card Action Row for non-hover/touch mobile devices */}
      <div className="card-actions-row" style={{ marginTop: '0.75rem' }}>
        <button
          className="btn-visit"
          onClick={handleDirectVisitClick}
          title={`Redirect directly to official ${tool.name} website`}
        >
          <span>Open Tool</span>
          <ExternalLink size={15} />
        </button>

        <button
          className="btn-quick-view"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          title="Open Dedicated Tool Page & Parameters"
        >
          <span>View Page</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
