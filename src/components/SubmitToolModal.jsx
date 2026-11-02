import React, { useState } from 'react';
import { X, PlusCircle, Link, Tag, DollarSign, FileText } from 'lucide-react';
import { CATEGORIES, PRICING_FILTERS } from '../data/aiToolsData';

export const SubmitToolModal = ({ isOpen, onClose, onSubmitTool }) => {
  const [name, setName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [tagline, setTagline] = useState('');
  const [hoverSummary, setHoverSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Chat & LLMs');
  const [pricing, setPricing] = useState('Freemium');
  const [url, setUrl] = useState('');
  const [feature1, setFeature1] = useState('');
  const [feature2, setFeature2] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !url) return;

    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    const newTool = {
      name,
      developer: developer || 'Community Developer',
      tagline: tagline || 'Innovative AI application for modern workflows',
      hoverSummary: hoverSummary || tagline || 'Empowering AI technology for enhanced productivity.',
      description: description || tagline || 'Empowering AI tool submitted by community.',
      category,
      pricing,
      pricingDetails: `${pricing} tier available`,
      url: formattedUrl,
      keyFeatures: [feature1, feature2].filter(Boolean)
    };

    onSubmitTool(newTool);
    onClose();

    // Reset form
    setName('');
    setDeveloper('');
    setTagline('');
    setHoverSummary('');
    setDescription('');
    setUrl('');
    setFeature1('');
    setFeature2('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 className="modal-title" style={{ fontSize: '1.4rem' }}>
            Submit an AI Tool
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Submit an application to be indexed & ranked in the global registry
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tool Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DreamAI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Developer / Org</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Acme AI Labs"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Website URL *</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://example-ai-tool.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tagline (Short Summary)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Autonomous AI coding assistant for fullstack apps"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hover Brief Text (Shown on Card Hover)</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Brief summary shown when user hovers over card..."
              value={hoverSummary}
              onChange={(e) => setHoverSummary(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Pricing Model</label>
              <select
                className="form-input"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
              >
                {PRICING_FILTERS.filter((p) => p !== 'All').map((price) => (
                  <option key={price} value={price}>
                    {price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Key Feature 1</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Multimodal vision input support"
              value={feature1}
              onChange={(e) => setFeature1(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Feature 2</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Instant API integration"
              value={feature2}
              onChange={(e) => setFeature2(e.target.value)}
            />
          </div>

          <button type="submit" className="form-submit-btn">
            Publish AI Tool to Directory
          </button>
        </form>
      </div>
    </div>
  );
};
