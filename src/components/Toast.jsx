import React from 'react';
import { CheckCircle, Info, Bookmark, ExternalLink } from 'lucide-react';

export const ToastContainer = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.type === 'redirect' && <ExternalLink size={18} color="#38bdf8" />}
          {toast.type === 'bookmark' && <Bookmark size={18} color="#f43f5e" fill="#f43f5e" />}
          {toast.type === 'success' && <CheckCircle size={18} color="#10b981" />}
          {toast.type === 'info' && <Info size={18} color="#a5b4fc" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
