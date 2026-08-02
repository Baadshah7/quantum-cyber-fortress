import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import { ParticleBackground } from '@/animations/particleBackground';
import { PageTransition } from '@/animations/pageTransitions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();
  const location = useLocation();
  
  const { user, sendVerificationEmail } = useAuth();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null); // { text: string, isError: boolean }

  const handleResend = async () => {
    setResending(true);
    setResendStatus(null);
    try {
      await sendVerificationEmail();
      setResendStatus({ text: 'TRANSMITTED', isError: false });
    } catch (err) {
      setResendStatus({ text: err.message || 'FAILED', isError: true });
    } finally {
      setResending(false);
    }
  };

  const showVerificationBanner = user && !user.emailVerified && !bannerDismissed && location.pathname !== '/';

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col relative overflow-hidden font-ui">
      <ParticleBackground reducedMotion={reducedMotion} />

      <Navbar 
        reducedMotion={reducedMotion} 
        toggleReducedMotion={toggleReducedMotion} 
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-4 py-8 z-10 relative">
        {showVerificationBanner && (
          <div className="flex items-center justify-between gap-3 text-status-warning font-mono text-[10px] bg-status-warning/5 border border-status-warning/10 px-4 py-2.5 rounded-btn mb-6 w-full animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-status-warning" />
              <span>Verify your email to unlock full Sentinel privileges.</span>
              <button 
                onClick={handleResend}
                disabled={resending}
                className="underline hover:text-amber-400 font-bold focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {resending ? 'RESENDING LINK...' : 'Resend verification email'}
              </button>
              {resendStatus && (
                <span className={`font-bold ${resendStatus.isError ? 'text-status-critical' : 'text-status-success'}`}>
                  [{resendStatus.text}]
                </span>
              )}
            </div>
            <button 
              onClick={() => setBannerDismissed(true)}
              className="text-text-muted hover:text-text-primary focus:outline-none cursor-pointer font-bold text-xs px-1"
              title="Dismiss Alert"
            >
              ✕
            </button>
          </div>
        )}

        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
