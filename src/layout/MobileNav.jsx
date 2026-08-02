import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAuth } from '@/context/AuthContext';
import { navigationItems } from './Navbar';
import { Button } from '@/design-system/components/Button';

export default function MobileNav({ isOpen, onClose }) {
  const location = useLocation();
  const drawerRef = useRef(null);
  const { reducedMotion } = useReducedMotion();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    let focusTimeout;
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      focusTimeout = setTimeout(() => {
        drawerRef.current?.focus();
      }, 50);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (focusTimeout) clearTimeout(focusTimeout);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : undefined}
            onClick={onClose}
            className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            ref={drawerRef}
            tabIndex="-1"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={reducedMotion ? { duration: 0 } : { type: 'tween', ease: 'easeOut', duration: 0.25 }}
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
                className="w-11 h-11 flex items-center justify-center rounded-btn text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-accent-cyan cursor-pointer transition-colors"
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
                    end={item.path === '/'}
                    className={({ isActive }) => 
                      `px-4 py-3.5 rounded-btn transition-all duration-200 border w-full flex items-center ${
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

            <div className="mt-auto pt-4 border-t border-border-subtle flex flex-col gap-3">
              {user ? (
                <div className="flex flex-col gap-2.5 font-mono text-[10px]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center font-bold text-accent-cyan text-xs select-none">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-text-muted text-[8px] uppercase tracking-wider font-bold">SENTINEL</span>
                      <span className="text-text-secondary font-bold truncate text-[10px]" title={user.email}>{user.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full text-[10px] font-bold text-status-critical border-status-critical/30 hover:bg-status-critical/5 py-1.5"
                  >
                    TERMINATE SESSION
                  </Button>
                </div>
              ) : (
                <NavLink
                  to="/"
                  onClick={onClose}
                  className="w-full py-2 text-center text-xs font-mono font-bold tracking-wider text-accent-cyan border border-accent-cyan/20 bg-accent-cyan/5 rounded-btn hover:bg-accent-cyan/15 transition-all flex justify-center items-center h-[44px]"
                >
                  INITIALIZE GATE SIGN IN
                </NavLink>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

