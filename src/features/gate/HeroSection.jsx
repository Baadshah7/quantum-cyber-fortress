import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/design-system/components/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ChevronRight, Compass } from 'lucide-react';

export default function HeroSection() {
  const { reducedMotion } = useReducedMotion();
  const navigate = useNavigate();

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
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center px-4 relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl flex flex-col items-center gap-6"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <span className="font-mono text-xs text-accent-cyan tracking-widest uppercase bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1 rounded-full">
            PROJECT // QUANTUM CYBER FORTRESS
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-text-primary tracking-tight leading-tight"
        >
          Secure the digital fortress. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-violet">
            Become a Sentinel.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg font-ui text-text-secondary max-w-xl leading-relaxed"
        >
          Step into an immersive, gamified training simulation built to forge elite cyber defenders. Learn defensive protocols, neutralize live simulated threats, and master the art of cryptographic warfare.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto font-semibold"
            icon={<ChevronRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigate('/academy')}
          >
            Initialize Training
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
      </motion.div>
    </section>
  );
}
