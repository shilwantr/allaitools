import React, { useState } from 'react';
import { X, UserCheck, Lock, Mail, Sparkles } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: isLoginTab ? (email.split('@')[0] || 'AI Explorer') : (name || 'New Member'),
      email: email || 'user@aimatrix.io',
      role: 'Member'
    };
    onLoginSuccess(user);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: 'Alex Rivers',
      email: 'alex.rivers@ai-research.org',
      role: 'Verified Researcher'
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.8rem'
            }}
          >
            <Sparkles size={24} color="#fff" />
          </div>
          <h2 className="modal-title" style={{ fontSize: '1.4rem' }}>
            {isLoginTab ? 'Welcome Back' : 'Create AI Matrix Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Sign in to sync your saved bookmarks across devices
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(8, 9, 20, 0.6)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.25rem'
          }}
        >
          <button
            onClick={() => setIsLoginTab(true)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: isLoginTab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: isLoginTab ? '#fff' : 'var(--text-dim)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: !isLoginTab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: !isLoginTab ? '#fff' : 'var(--text-dim)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLoginTab && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="form-submit-btn">
            {isLoginTab ? 'Log In to Account' : 'Create Free Account'}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="demo-account-box">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Want to test immediately without signing up?
          </span>
          <br />
          <button className="demo-btn" onClick={handleDemoLogin}>
            <UserCheck size={15} style={{ display: 'inline', marginRight: '5px' }} />
            One-Click Demo Login (Alex Rivers)
          </button>
        </div>
      </div>
    </div>
  );
};
