import React from 'react';
import { Search, SlidersHorizontal, X, MessageSquare, Image, Code, Volume2, Video, Briefcase, FileSearch, Grid } from 'lucide-react';
import { CATEGORIES, PRICING_FILTERS, SORT_OPTIONS } from '../data/aiToolsData';

const CATEGORY_ICONS = {
  'All': Grid,
  'Chat & LLMs': MessageSquare,
  'Image & Art': Image,
  'Code & Dev': Code,
  'Audio & Voice': Volume2,
  'Video & 3D': Video,
  'Productivity': Briefcase,
  'Research': FileSearch
};

export const CategoryFilter = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  selectedPricing,
  onPricingSelect,
  sortBy,
  onSortChange,
  showBookmarksOnly,
  onToggleBookmarks
}) => {
  return (
    <section className="filter-section">
      {/* Search & Sort Row */}
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search AI tools by name, features, tags (e.g. 'Claude', 'audio', 'image gen')..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="sort-select-wrapper">
          <SlidersHorizontal size={16} color="var(--text-dim)" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Chips Scrollable */}
      <div className="category-chips-row">
        {CATEGORIES.map((cat) => {
          const IconComp = CATEGORY_ICONS[cat] || Grid;
          const isActive = selectedCategory === cat && !showBookmarksOnly;
          return (
            <button
              key={cat}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => {
                onCategorySelect(cat);
                if (showBookmarksOnly) onToggleBookmarks(false);
              }}
            >
              <IconComp size={15} />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Pricing Filters */}
      <div className="pricing-filter-group">
        <span className="pricing-label">Price Model:</span>
        {PRICING_FILTERS.map((price) => (
          <button
            key={price}
            className={`pricing-pill ${selectedPricing === price ? 'active' : ''}`}
            onClick={() => onPricingSelect(price)}
          >
            {price}
          </button>
        ))}
      </div>
    </section>
  );
};
