import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ToolCard } from './components/ToolCard';
import { ToolModal } from './components/ToolModal';
import { ToolDetailPage } from './components/ToolDetailPage';
import { AuthModal } from './components/AuthModal';
import { SubmitToolModal } from './components/SubmitToolModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

import {
  getAllTools,
  recordToolClick,
  getBookmarks,
  toggleBookmarkInStorage,
  getStoredUser,
  setStoredUser,
  saveCustomTool
} from './utils/storage';
import { Frown, ArrowLeft } from 'lucide-react';

export function App() {
  const [tools, setTools] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Router path state (e.g. '/' or '/chatgpt')
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [sortBy, setSortBy] = useState('clicks');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [quickViewTool, setQuickViewTool] = useState(null);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Load initial data
  useEffect(() => {
    setTools(getAllTools());
    setBookmarks(getBookmarks());
    setCurrentUser(getStoredUser());
  }, []);

  // Listen for browser forward/back button navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync URL search params to filter state when returning to home ('/')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (pathname === '' || pathname === 'index.html') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('q')) {
          setSearchQuery(params.get('q'));
        }
        if (params.has('category')) {
          setSelectedCategory(params.get('category'));
        }
        if (params.has('pricing')) {
          setSelectedPricing(params.get('pricing'));
        }
      }
    }
  }, [currentPath]);

  // Navigate helper (updates history and local state)
  const navigateTo = useCallback((path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Helper to trigger floating toast
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Handle visit tool redirect and live click tracking
  const handleVisitTool = (tool) => {
    recordToolClick(tool.id);

    // Increment click count in local React state & trigger dynamic re-rank
    setTools((prevTools) =>
      prevTools.map((t) => (t.id === tool.id ? { ...t, clicks: t.clicks + 1 } : t))
    );

    addToast(`Redirecting to ${tool.name}... (+1 Rank Boost Recorded)`, 'redirect');
  };

  // Handle Bookmarks
  const handleToggleBookmark = (toolId) => {
    const updated = toggleBookmarkInStorage(toolId);
    setBookmarks(updated);
    const targetTool = tools.find((t) => t.id === toolId);
    const name = targetTool ? targetTool.name : 'Tool';

    if (updated.includes(toolId)) {
      addToast(`Saved ${name} to your bookmarks!`, 'bookmark');
    } else {
      addToast(`Removed ${name} from bookmarks.`, 'info');
    }
  };

  // Handle User Auth Login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setStoredUser(user);
    addToast(`Logged in as ${user.name}`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredUser(null);
    addToast('Logged out successfully', 'info');
  };

  // Handle Custom Tool Submission
  const handlePublishTool = (newToolData) => {
    const created = saveCustomTool(newToolData);
    if (created) {
      setTools(getAllTools());
      addToast(`"${created.name}" published to directory!`, 'success');
    }
  };

  // Overall statistics for Hero
  const totalToolsCount = tools.length;
  const totalClicksCount = useMemo(() => {
    return tools.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  }, [tools]);

  // Compute overall global ranking map (sorted by clicks descending)
  const globalRankMap = useMemo(() => {
    const sortedGlobal = [...tools].sort((a, b) => b.clicks - a.clicks);
    const rankMap = {};
    sortedGlobal.forEach((tool, index) => {
      rankMap[tool.id] = index + 1;
    });
    return rankMap;
  }, [tools]);

  // Parse path to see if viewing a specific tool (e.g. /chatgpt)
  const currentRoute = useMemo(() => {
    const pathOnly = (currentPath || '/').split('?')[0];
    const cleaned = pathOnly.replace(/^\/+|\/+$/g, '');

    if (!cleaned || cleaned === 'index.html') {
      return { type: 'home' };
    }

    // Check if cleaned matches a tool ID
    const foundTool = tools.find(
      (t) => t.id.toLowerCase() === cleaned.toLowerCase()
    );

    if (foundTool) {
      return { type: 'tool', tool: foundTool };
    }

    return { type: 'not-found', requestedPath: cleaned };
  }, [currentPath, tools]);

  // Filtered & Sorted Tools List for Home Directory
  const displayedTools = useMemo(() => {
    let result = [...tools];

    // 1. Bookmarks view filter
    if (showBookmarksOnly) {
      result = result.filter((t) => bookmarks.includes(t.id));
    }

    // 2. Category filter
    if (selectedCategory !== 'All' && !showBookmarksOnly) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // 3. Pricing model filter
    if (selectedPricing !== 'All') {
      result = result.filter((t) => t.pricing === selectedPricing);
    }

    // 4. Search Query filter (matches name, developer, tagline, description, features, category)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => {
        const inName = t.name.toLowerCase().includes(q);
        const inDev = t.developer?.toLowerCase().includes(q);
        const inTag = t.tagline?.toLowerCase().includes(q);
        const inHover = t.hoverSummary?.toLowerCase().includes(q);
        const inDesc = t.description?.toLowerCase().includes(q);
        const inCat = t.category?.toLowerCase().includes(q);
        const inFeat = t.keyFeatures?.some((f) => f.toLowerCase().includes(q));

        return inName || inDev || inTag || inHover || inDesc || inCat || inFeat;
      });
    }

    // 5. Sort Ordering
    result.sort((a, b) => {
      if (sortBy === 'clicks') {
        return b.clicks - a.clicks; // Popularity rank
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [tools, bookmarks, selectedCategory, selectedPricing, searchQuery, sortBy, showBookmarksOnly]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar Navigation */}
      <Navbar
        bookmarkCount={bookmarks.length}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarks={(val) => {
          setShowBookmarksOnly(val);
          if (currentRoute.type !== 'home') {
            navigateTo('/');
          }
        }}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <div style={{ flex: 1 }}>
        {currentRoute.type === 'tool' ? (
          /* Dedicated Tool Page (/:toolId) */
          <ToolDetailPage
            tool={currentRoute.tool}
            rank={globalRankMap[currentRoute.tool.id] || 1}
            allTools={tools}
            isBookmarked={bookmarks.includes(currentRoute.tool.id)}
            onToggleBookmark={handleToggleBookmark}
            onVisitTool={handleVisitTool}
            onNavigate={navigateTo}
            addToast={addToast}
          />
        ) : currentRoute.type === 'not-found' ? (
          /* 404 / Tool Not Found */
          <div className="tool-detail-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <Frown size={48} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Tool Page Not Found
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              No AI tool matching <code>/{currentRoute.requestedPath}</code> was found in our directory.
            </p>
            <button className="btn-open-tool-primary" onClick={() => navigateTo('/')}>
              <ArrowLeft size={16} />
              <span>Return to All AI Tools</span>
            </button>
          </div>
        ) : (
          /* Home Directory View */
          <main className="app-container">
            {/* Hero Section */}
            <Hero
              totalToolsCount={totalToolsCount}
              totalClicksCount={totalClicksCount}
            />

            {/* Filter & Search Bar */}
            <CategoryFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              selectedPricing={selectedPricing}
              onPricingSelect={setSelectedPricing}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showBookmarksOnly={showBookmarksOnly}
              onToggleBookmarks={setShowBookmarksOnly}
            />

            {/* Section Heading Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
                  {showBookmarksOnly
                    ? 'Saved Bookmarks'
                    : selectedCategory === 'All'
                    ? 'All AI Tools (Ranked by Popularity)'
                    : `${selectedCategory} AI Tools`}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing {displayedTools.length} of {totalToolsCount} AI tools
                  {sortBy === 'clicks' && ' • Ranked by redirect click count'}
                </p>
              </div>

              {showBookmarksOnly && (
                <button
                  className="category-chip active"
                  onClick={() => setShowBookmarksOnly(false)}
                >
                  Show All Tools
                </button>
              )}
            </div>

            {/* Tools Cards Responsive Grid */}
            {displayedTools.length > 0 ? (
              <div className="tools-grid">
                {displayedTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    rank={globalRankMap[tool.id] || 99}
                    isBookmarked={bookmarks.includes(tool.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onVisitTool={handleVisitTool}
                    onOpenToolPage={(t) => navigateTo('/' + t.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Frown className="empty-icon" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  No AI Tools Found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                  {showBookmarksOnly
                    ? "You haven't bookmarked any tools yet. Click the star icon on any card to save your favorite AI apps!"
                    : `No AI tools match "${searchQuery}" under the selected filters.`}
                </p>
                <button
                  className="nav-btn nav-btn-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedPricing('All');
                    setShowBookmarksOnly(false);
                    navigateTo('/');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Modals */}
      <ToolModal
        tool={quickViewTool}
        rank={quickViewTool ? globalRankMap[quickViewTool.id] : 0}
        onClose={() => setQuickViewTool(null)}
        onVisitTool={handleVisitTool}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitTool={handlePublishTool}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
