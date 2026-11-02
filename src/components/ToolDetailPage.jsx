import React, { useEffect, useState, useMemo } from 'react';
import {
  ExternalLink,
  Star,
  MousePointerClick,
  Bookmark,
  Share2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Search,
  Sparkles,
  Layers,
  DollarSign,
  Globe,
  Sliders,
  Award,
  Trophy,
  Check
} from 'lucide-react';

export const ToolDetailPage = ({
  tool,
  rank,
  allTools = [],
  isBookmarked,
  onToggleBookmark,
  onVisitTool,
  onNavigate,
  addToast
}) => {
  const [copied, setCopied] = useState(false);
  const [searchParamQuery, setSearchParamQuery] = useState('');
  const [urlParams, setUrlParams] = useState({});

  // Parse any query params from current URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const parsed = {};
      params.forEach((value, key) => {
        parsed[key] = value;
      });
      setUrlParams(parsed);
      if (params.get('q')) {
        setSearchParamQuery(params.get('q'));
      }
    }
  }, []);

  // Update document title and meta description dynamically
  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} — Reviews, Pricing & Direct Access | AI Tool Matrix`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          `${tool.name} by ${tool.developer}: ${tool.hoverSummary || tool.tagline}. Compare pricing, rank #${rank}, features, and launch the official tool.`
        );
      }
    }
    return () => {
      document.title = 'AI Tool Matrix — Discover & Community-Ranked AI Tools Directory';
    };
  }, [tool, rank]);

  // Generate suggested search queries and parameters for this tool
  const searchQueries = useMemo(() => {
    if (!tool) return [];
    const baseQueries = [
      `${tool.name.toLowerCase()} login`,
      `${tool.name.toLowerCase()} pricing`,
      `${tool.name.toLowerCase()} features`,
      `${tool.name.toLowerCase()} official website`,
      `best ${tool.category.toLowerCase()} ai`,
      `${tool.developer.toLowerCase()} ai tools`
    ];

    if (tool.badges && tool.badges.length) {
      tool.badges.forEach((b) => baseQueries.push(b.toLowerCase()));
    }
    if (tool.keyFeatures && tool.keyFeatures.length) {
      tool.keyFeatures.slice(0, 2).forEach((f) => {
        const short = f.split('(')[0].trim().toLowerCase();
        if (short.length < 30) baseQueries.push(short);
      });
    }
    return Array.from(new Set(baseQueries));
  }, [tool]);

  // Related tools from the same category
  const relatedTools = useMemo(() => {
    if (!tool || !allTools.length) return [];
    return allTools
      .filter((t) => t.id !== tool.id && t.category === tool.category)
      .slice(0, 3);
  }, [tool, allTools]);

  if (!tool) {
    return (
      <div className="tool-detail-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Tool Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          The requested AI tool could not be found or has been moved.
        </p>
        <button className="nav-btn nav-btn-primary" onClick={() => onNavigate('/')}>
          <ArrowLeft size={16} />
          <span>Back to All AI Tools</span>
        </button>
      </div>
    );
  }

  // Format click numbers
  const formatClicks = (clicks) => {
    if (clicks >= 1000000) return (clicks / 1000000).toFixed(1) + 'M';
    if (clicks >= 1000) return (clicks / 1000).toFixed(1) + 'k';
    return (clicks || 0).toString();
  };

  // Launch official tool directly in a new tab & boost click rank
  const handleOpenTool = () => {
    onVisitTool(tool);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  // Share URL helper
  const handleShare = () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://www.allaitools.online';
    const currentUrl = `${origin}/${tool.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        if (addToast) addToast(`Copied ${tool.name} link to clipboard!`, 'success');
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      if (addToast) addToast(`Tool URL: ${currentUrl}`, 'info');
    }
  };

  // Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchParamQuery.trim()) {
      onNavigate(`/?q=${encodeURIComponent(searchParamQuery.trim())}`);
    }
  };

  // Pricing styling
  const pricingClass = `pricing-${tool.pricing.toLowerCase()}`;

  // Rank styling
  let RankIcon = Trophy;
  let rankColor = '#fbbf24';
  if (rank === 1) {
    RankIcon = Trophy;
    rankColor = '#fbbf24';
  } else if (rank === 2) {
    RankIcon = Award;
    rankColor = '#94a3b8';
  } else if (rank === 3) {
    RankIcon = Award;
    rankColor = '#d97706';
  }

  return (
    <div className="tool-detail-page">
      {/* Top Breadcrumb & Search Bar */}
      <div className="tool-detail-nav">
        <div className="breadcrumb-row">
          <button className="btn-back" onClick={() => onNavigate('/')}>
            <ArrowLeft size={16} />
            <span>All AI Tools</span>
          </button>
          <span className="breadcrumb-divider">/</span>
          <button
            className="breadcrumb-category"
            onClick={() => onNavigate(`/?category=${encodeURIComponent(tool.category)}`)}
          >
            {tool.category}
          </button>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">{tool.name}</span>
        </div>

        {/* Quick Directory Search Form */}
        <form className="detail-search-bar" onSubmit={handleSearchSubmit}>
          <Search size={15} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search all AI tools & parameters..."
            value={searchParamQuery}
            onChange={(e) => setSearchParamQuery(e.target.value)}
          />
          <button type="submit" className="detail-search-submit">
            Search
          </button>
        </form>
      </div>

      {/* Main Tool Hero Banner */}
      <div
        className="tool-detail-hero"
        style={{
          background: `radial-gradient(ellipse at top left, ${tool.color || '#6366f1'}33 0%, rgba(15, 18, 37, 0.95) 70%)`
        }}
      >
        <div className="tool-hero-content">
          <div className="tool-hero-top">
            {/* Tool Avatar */}
            <div
              className="tool-detail-avatar"
              style={{ background: tool.bgGradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {tool.name.charAt(0)}
            </div>

            {/* Title & Metadata */}
            <div className="tool-detail-headline">
              <div className="headline-badge-row">
                <span className="category-chip active" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                  <Tag size={12} />
                  {tool.category}
                </span>

                <div className="detail-rank-pill">
                  <RankIcon size={14} color={rankColor} />
                  <span>#{rank} Most Popular</span>
                </div>

                {tool.verified && (
                  <span className="verified-pill">
                    <ShieldCheck size={14} color="#10b981" />
                    Verified Official
                  </span>
                )}
              </div>

              <h1 className="tool-detail-title">{tool.name}</h1>
              <p className="tool-detail-developer">
                Created & maintained by <strong>{tool.developer}</strong>
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="tool-detail-tagline">{tool.tagline}</p>

          {/* Primary Action Buttons */}
          <div className="tool-detail-actions">
            <button className="btn-open-tool-primary" onClick={handleOpenTool}>
              <span>Open {tool.name}</span>
              <ExternalLink size={18} />
            </button>

            <button
              className={`btn-detail-action ${isBookmarked ? 'active' : ''}`}
              onClick={() => onToggleBookmark(tool.id)}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Tool'}
            >
              <Bookmark size={18} fill={isBookmarked ? '#f43f5e' : 'none'} color={isBookmarked ? '#f43f5e' : 'currentColor'} />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button className="btn-detail-action" onClick={handleShare} title="Copy shareable link">
              {copied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

          <div className="tool-official-link-note">
            <Globe size={13} color="var(--text-dim)" />
            <span>Official Destination: <code>{tool.url}</code></span>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="detail-stats-grid">
        <div className="detail-stat-card">
          <div className="stat-label">
            <Trophy size={15} color="#fbbf24" />
            <span>Community Rank</span>
          </div>
          <div className="stat-value">#{rank}</div>
          <div className="stat-sub">Across all listed AI tools</div>
        </div>

        <div className="detail-stat-card">
          <div className="stat-label">
            <MousePointerClick size={15} color="#38bdf8" />
            <span>Total Click Visits</span>
          </div>
          <div className="stat-value">{formatClicks(tool.clicks)}</div>
          <div className="stat-sub">+1 boost every time opened</div>
        </div>

        <div className="detail-stat-card">
          <div className="stat-label">
            <Star size={15} color="#fbbf24" />
            <span>User Rating</span>
          </div>
          <div className="stat-value">
            {tool.rating} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
          </div>
          <div className="stat-sub">From {tool.ratingCount?.toLocaleString() || '1,000+'} reviews</div>
        </div>

        <div className="detail-stat-card">
          <div className="stat-label">
            <DollarSign size={15} color="#10b981" />
            <span>Pricing Tier</span>
          </div>
          <div className="stat-value">
            <span className={`pricing-badge ${pricingClass}`}>{tool.pricing}</span>
          </div>
          <div className="stat-sub">{tool.pricingDetails || 'Check official site'}</div>
        </div>
      </div>

      {/* URL Query Parameters Indicator (when query params exist) */}
      {Object.keys(urlParams).length > 0 && (
        <div className="query-params-banner">
          <div className="query-params-title">
            <Sliders size={16} color="var(--accent-cyan)" />
            <span>Active URL Query Parameters</span>
          </div>
          <div className="query-params-list">
            {Object.entries(urlParams).map(([k, v]) => (
              <span key={k} className="query-param-badge">
                <code>{k}</code> = <strong>{v}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Columns */}
      <div className="detail-main-layout">
        {/* Left Column: In-depth Info */}
        <div className="detail-left-col">
          {/* About Section */}
          <div className="detail-section-card">
            <h2 className="section-title">
              <Sparkles size={18} color="var(--accent-indigo)" />
              <span>About {tool.name}</span>
            </h2>
            <p className="detail-description">{tool.description}</p>
            {tool.hoverSummary && (
              <div className="detail-highlight-box">
                <strong>Quick Summary:</strong> {tool.hoverSummary}
              </div>
            )}
          </div>

          {/* Key Features & Capabilities */}
          <div className="detail-section-card">
            <h2 className="section-title">
              <Layers size={18} color="var(--accent-violet)" />
              <span>Key Features & Capabilities</span>
            </h2>
            <div className="detail-features-grid">
              {tool.keyFeatures?.map((feature, idx) => (
                <div key={idx} className="detail-feature-item">
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span className="feature-text">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Search Queries & Parameters */}
          <div className="detail-section-card">
            <h2 className="section-title">
              <Search size={18} color="var(--accent-cyan)" />
              <span>Popular Search Queries & Keywords for {tool.name}</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Explore related search queries and parameters indexed for this tool:
            </p>
            <div className="search-queries-tags">
              {searchQueries.map((query, idx) => (
                <button
                  key={idx}
                  className="search-query-tag"
                  onClick={() => onNavigate(`/?q=${encodeURIComponent(query)}`)}
                  title={`Search directory for "${query}"`}
                >
                  <Search size={12} />
                  <span>{query}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Meta, Badges, Related Tools */}
        <div className="detail-right-col">
          {/* Quick Info & Launch Box */}
          <div className="detail-sidebar-card">
            <h3 className="sidebar-title">Direct Tool Access</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Ready to explore {tool.name}? Click below to open the official web app directly in a new window.
            </p>
            <button className="btn-open-tool-primary" style={{ width: '100%' }} onClick={handleOpenTool}>
              <span>Launch {tool.name}</span>
              <ExternalLink size={16} />
            </button>

            <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Category
              </div>
              <button
                className="category-chip"
                onClick={() => onNavigate(`/?category=${encodeURIComponent(tool.category)}`)}
                style={{ fontSize: '0.85rem' }}
              >
                {tool.category}
              </button>
            </div>

            {/* Badges */}
            {tool.badges && tool.badges.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Highlights & Tags
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {tool.badges.map((b, i) => (
                    <span key={i} className="tool-highlight-badge">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Tools in Category */}
          {relatedTools.length > 0 && (
            <div className="detail-sidebar-card">
              <h3 className="sidebar-title">Related in {tool.category}</h3>
              <div className="related-tools-list">
                {relatedTools.map((rel) => (
                  <div
                    key={rel.id}
                    className="related-tool-item"
                    onClick={() => onNavigate(`/${rel.id}`)}
                  >
                    <div
                      className="related-avatar"
                      style={{ background: rel.bgGradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      {rel.name.charAt(0)}
                    </div>
                    <div className="related-info">
                      <div className="related-name">{rel.name}</div>
                      <div className="related-sub">{rel.pricing} • {formatClicks(rel.clicks)} clicks</div>
                    </div>
                    <button
                      className="btn-related-open"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitTool(rel);
                        window.open(rel.url, '_blank', 'noopener,noreferrer');
                      }}
                      title={`Open ${rel.name} directly`}
                    >
                      <ExternalLink size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Launch Bar */}
      <div className="mobile-sticky-launch-bar">
        <div className="sticky-info">
          <span className="sticky-name">{tool.name}</span>
          <span className="sticky-clicks">{formatClicks(tool.clicks)} clicks</span>
        </div>
        <button className="btn-open-tool-primary sticky-btn" onClick={handleOpenTool}>
          <span>Open Tool</span>
          <ExternalLink size={15} />
        </button>
      </div>
    </div>
  );
};
