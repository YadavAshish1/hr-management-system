import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_DURATION = 5000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const toast = useCallback(
    {
      success: (message) => addToast(message, 'success'),
      error: (message) => addToast(message, 'error'),
      info: (message) => addToast(message, 'info'),
    },
    [addToast]
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className="pointer-events-auto animate-toast-in flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg"
          >
            {t.type === 'success' && (
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            )}
            {t.type === 'error' && (
              <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
            )}
            <p className="text-sm text-gray-800 flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
