import { INITIAL_AI_TOOLS } from '../data/aiToolsData';

const CLICKS_KEY = 'ai_tools_clicks_v1';
const BOOKMARKS_KEY = 'ai_tools_bookmarks_v1';
const USER_KEY = 'ai_tools_user_v1';
const CUSTOM_TOOLS_KEY = 'ai_tools_custom_v1';

// Get merged click count for tools
export const getStoredClicks = () => {
  try {
    const data = localStorage.getItem(CLICKS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse stored clicks', e);
    return {};
  }
};

// Increment click count for a tool ID
export const recordToolClick = (toolId) => {
  try {
    const clicks = getStoredClicks();
    const current = clicks[toolId] || 0;
    clicks[toolId] = current + 1;
    localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
    return clicks[toolId];
  } catch (e) {
    console.error('Failed to record click', e);
    return 1;
  }
};

// Get stored custom user-submitted tools
export const getCustomTools = () => {
  try {
    const data = localStorage.getItem(CUSTOM_TOOLS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get custom tools', e);
    return [];
  }
};

// Save a new user-submitted tool
export const saveCustomTool = (tool) => {
  try {
    const custom = getCustomTools();
    const newTool = {
      ...tool,
      id: `custom_${Date.now()}`,
      clicks: 1,
      rating: 5.0,
      ratingCount: 1,
      verified: false,
      color: '#6366f1',
      bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.05))',
      badges: ['Community Submission', 'New']
    };
    custom.unshift(newTool);
    localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(custom));
    return newTool;
  } catch (e) {
    console.error('Failed to save custom tool', e);
    return null;
  }
};

// Get combined tools with updated clicks
export const getAllTools = () => {
  const storedClicks = getStoredClicks();
  const customTools = getCustomTools();
  const combined = [...INITIAL_AI_TOOLS, ...customTools];

  return combined.map((tool) => {
    const extraClicks = storedClicks[tool.id] || 0;
    return {
      ...tool,
      clicks: tool.clicks + extraClicks
    };
  });
};

// Bookmarks management
export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get bookmarks', e);
    return [];
  }
};

export const toggleBookmarkInStorage = (toolId) => {
  try {
    const bookmarks = getBookmarks();
    let updated;
    if (bookmarks.includes(toolId)) {
      updated = bookmarks.filter((id) => id !== toolId);
    } else {
      updated = [...bookmarks, toolId];
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle bookmark', e);
    return [];
  }
};

// User Auth Management
export const getStoredUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to get stored user', e);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to set stored user', e);
  }
};
