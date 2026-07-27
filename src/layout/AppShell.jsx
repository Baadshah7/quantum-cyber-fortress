import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import { ParticleBackground } from '@/animations/particleBackground';
import { PageTransition } from '@/animations/pageTransitions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();
  const location = useLocation();

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
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}

