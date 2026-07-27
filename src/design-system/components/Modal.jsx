import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          ref={modalRef}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-lg glassmorphism rounded-card shadow-2xl overflow-hidden focus:outline-none z-10 flex flex-col max-h-[90vh] ${className}`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-secondary/50">
            <h2 id="modal-title" className="text-lg font-display font-semibold text-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-accent-cyan cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 font-ui text-sm text-text-secondary leading-relaxed">
            {children}
          </div>

          {footer && (
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-bg-secondary/30">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

