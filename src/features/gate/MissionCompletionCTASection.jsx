import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/design-system/components/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ChevronRight } from 'lucide-react';

export default function MissionCompletionCTASection() {
  const { reducedMotion } = useReducedMotion();
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 text-center relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] rounded-full bg-accent-cyan/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-2xl mx-auto flex flex-col items-center gap-6"
      >
        <span className="text-xs font-mono font-bold tracking-widest text-accent-cyan uppercase">
          INITIATE CONNECTION
        </span>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary leading-tight">
          The fortress shields are ready. Initialize your Sentinel link now.
        </h2>

        <div className="mt-4 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto font-semibold shadow-glow-cyan"
            icon={<ChevronRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigate('/academy')}
          >
            Initialize Training
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
