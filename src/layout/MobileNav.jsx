import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationItems } from './Navbar';

export default function MobileNav({ isOpen, onClose }) {
  const location = useLocation();
  const drawerRef = useRef(null);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        drawerRef.current?.focus();
      }, 50);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            ref={drawerRef}
            tabIndex="-1"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
            className="relative w-72 h-full bg-bg-secondary border-l border-border-subtle p-6 flex flex-col gap-6 shadow-2xl focus:outline-none z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-cyan" />
                <span className="font-display font-bold tracking-wider text-sm text-text-primary">
                  FORTRESS NAV
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-btn text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-accent-cyan cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 font-ui text-sm mt-4">
              {navigationItems.map((item) => {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      `px-4 py-3 rounded-btn transition-all duration-200 border w-full flex ${
                        isActive
                          ? 'bg-bg-tertiary border-accent-cyan text-accent-cyan shadow-glow-cyan font-medium'
                          : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-border-subtle flex items-center gap-2 font-mono text-[10px] text-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_6px_rgba(52,211,153,0.5)] animate-pulse" />
              <span>SENTINEL_OK</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

