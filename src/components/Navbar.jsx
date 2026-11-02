import React from 'react';
import { Sparkles, Bookmark, PlusCircle, User, LogOut } from 'lucide-react';

export const Navbar = ({
  bookmarkCount,
  showBookmarksOnly,
  onToggleBookmarks,
  onOpenSubmitModal,
  onOpenAuthModal,
  currentUser,
  onLogout
}) => {
  return (
    <header className="navbar">
      <div className="nav-content">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => onToggleBookmarks(false)}>
          <div className="logo-icon-wrapper">
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <span className="brand-title">AI Tool Matrix</span>
            <span className="brand-badge">2026 Live Rank</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          {/* Bookmarks Toggle */}
          <button
            className={`nav-btn ${showBookmarksOnly ? 'nav-btn-primary' : ''}`}
            onClick={() => onToggleBookmarks(!showBookmarksOnly)}
            title="View saved bookmarked tools"
          >
            <Bookmark size={17} fill={showBookmarksOnly ? '#fff' : 'none'} />
            <span>Saved Tools</span>
            {bookmarkCount > 0 && (
              <span className="bookmark-count-badge">{bookmarkCount}</span>
            )}
          </button>

          {/* Submit New Tool */}
          <button
            className="nav-btn"
            onClick={onOpenSubmitModal}
            title="Submit a new AI tool to directory"
          >
            <PlusCircle size={17} />
            <span>Submit Tool</span>
          </button>

          {/* User Auth Profile / Login */}
          {currentUser ? (
            <div className="user-menu-btn" title={`Logged in as ${currentUser.name}`}>
              <div className="user-avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="nav-btn nav-btn-primary" onClick={onOpenAuthModal}>
              <User size={17} />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
