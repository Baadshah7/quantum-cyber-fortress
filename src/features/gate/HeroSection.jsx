import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAuth } from '@/context/AuthContext';
import GateAuthPanel from './components/GateAuthPanel';
import { ChevronRight, Compass, ShieldAlert } from 'lucide-react';

export default function HeroSection() {
  const { reducedMotion } = useReducedMotion();
  const navigate = useNavigate();
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const handleExploreClick = () => {
    const sectorsSection = document.getElementById('sectors');
    if (sectorsSection) {
      sectorsSection.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-140px)] text-left px-4 py-8 lg:py-0 max-w-6xl mx-auto gap-8 lg:gap-12 relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-start gap-6 text-left"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <span className="font-mono text-xs text-accent-cyan tracking-widest uppercase bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1 rounded-full">
            PROJECT // QUANTUM CYBER FORTRESS
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary tracking-tight leading-tight"
        >
          Secure the digital fortress. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-violet">
            Become a Sentinel.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base font-ui text-text-secondary max-w-xl leading-relaxed"
        >
          Step into an immersive training experience where you have access to 4 operational sectors. Learn defensive protocols, neutralize live simulated threats, and monitor telemetry across the fortress.
        </motion.p>

        {user ? (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto font-semibold shadow-glow-cyan"
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/labs')}
            >
              Enter Labs Command Center
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-text-secondary hover:text-text-primary"
              icon={<Compass className="w-4 h-4" />}
              iconPosition="left"
              onClick={handleExploreClick}
            >
              Explore Chambers
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants} 
            className="flex items-center gap-2 text-status-warning font-mono text-[10px] bg-status-warning/5 border border-status-warning/10 px-3 py-2 rounded-btn mt-2 max-w-md"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-status-warning" />
            <span>SESSION INACTIVE: INITIALIZE SENTINEL CREDENTIALS TO ENABLE TRAINING CORE.</span>
          </motion.div>
        )}
      </motion.div>

      {/* Right Column: GateAuthPanel when logged out, or dynamic Welcome console when logged in */}
      <motion.div 
        initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full lg:w-[400px] shrink-0"
      >
        {user ? (
          <Card className="p-6 border border-accent-cyan/20 bg-bg-secondary/20 flex flex-col gap-4 relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <span className="text-[10px] font-mono tracking-widest text-text-muted font-bold">ACCESS CONTROL</span>
              <span className="px-2 py-0.5 rounded-full bg-status-success/15 border border-status-success/30 text-[9px] font-mono text-status-success font-bold animate-pulse">
                AUTHORIZED
              </span>
            </div>
            <div className="flex flex-col gap-1 py-1">
              <span className="text-[10px] font-mono text-text-muted">CONNECTED SENTINEL</span>
              <span className="text-xs font-mono font-bold text-accent-cyan truncate">{user.email}</span>
            </div>
            <div className="h-[1px] bg-border-subtle/50 w-full" />
            <div className="flex flex-col gap-2 font-mono text-[10px] text-text-secondary leading-relaxed bg-bg-primary/50 p-3 rounded-btn border border-border-subtle/40">
              <span className="text-accent-violet font-bold">{"// SECURE SESSION STATUS:"}</span>
              <span>• PERSISTENCE: LOCAL STORAGE SYNC</span>
              <span>• JWT TOKEN: EXPIRES IN 1 HOUR</span>
              <span>• PROTOCOLS: FULL READ/WRITE LEVEL II</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/academy')}
              className="w-full text-xs font-mono font-bold tracking-wider hover:border-accent-cyan/40"
            >
              LAUNCH ACADEMY INDEX
            </Button>
          </Card>
        ) : (
          <GateAuthPanel />
        )}
      </motion.div>
    </section>
  );
}
