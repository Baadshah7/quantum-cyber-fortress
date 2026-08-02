/* eslint-disable react-refresh/only-export-components */
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Shield, Zap, ZapOff } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { useAuth } from '@/context/AuthContext';

export const navigationItems = [
  { name: 'Gate', path: '/' },
  { name: 'Academy', path: '/academy' },
  { name: 'Training Yard', path: '/simulator' },
  { name: 'Labs', path: '/labs' },
];

export default function Navbar({ reducedMotion, toggleReducedMotion, onOpenMobileMenu }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <nav className="w-full border-b border-border-subtle bg-bg-secondary/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <NavLink 
          to="/" 
          className="flex items-center gap-2 text-text-primary hover:text-accent-cyan transition-colors focus-visible:outline-2 focus-visible:outline-accent-cyan rounded-btn py-1 px-2"
          aria-label="Quantum Cyber Fortress Home"
        >
          <Shield className="w-6 h-6 text-accent-cyan" />
          <span className="font-display font-bold tracking-wider text-sm md:text-base">
            QUANTUM FORTRESS
          </span>
        </NavLink>

        <div className="hidden lg:flex items-center gap-2 font-ui text-sm">
          {navigationItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => 
                  `px-3 py-1.5 rounded-btn transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? 'bg-bg-tertiary border-accent-cyan text-accent-cyan shadow-glow-cyan font-medium'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
                  }`
                }
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleReducedMotion}
            className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cyan border border-transparent hover:border-border-subtle"
            aria-label={reducedMotion ? "Enable animations" : "Disable animations"}
            title={reducedMotion ? "Enable animations" : "Disable animations"}
          >
            {reducedMotion ? (
              <>
                <ZapOff className="w-4 h-4 text-status-critical" />
                <span className="hidden lg:inline text-xs font-mono">Sensors: MIN</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-accent-cyan" />
                <span className="hidden lg:inline text-xs font-mono">Sensors: MAX</span>
              </>
            )}
          </Button>

          {user ? (
            <div className="flex items-center gap-2 border-l border-border-subtle pl-2">
              <span 
                className="hidden md:inline font-mono text-[10px] text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-full truncate max-w-[120px]" 
                title={user.email}
              >
                {user.email.split('@')[0]}
              </span>
              <span 
                className="md:hidden font-mono text-[9px] text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 w-5 h-5 flex items-center justify-center rounded-full uppercase font-bold"
                title={user.email}
              >
                {user.email[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-[10px] font-mono px-2 py-1 text-status-critical hover:text-red-400 hover:bg-status-critical/5 rounded"
              >
                SIGN OUT
              </Button>
            </div>
          ) : (
            <NavLink
              to="/"
              className="text-[10px] font-mono font-bold tracking-wider text-accent-cyan hover:text-cyan-400 border border-accent-cyan/20 bg-accent-cyan/5 px-2.5 py-1 rounded"
            >
              SIGN IN
            </NavLink>
          )}

          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-btn text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-accent-cyan cursor-pointer transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

