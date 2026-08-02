import { motion } from 'framer-motion';
import { Card } from '@/design-system/components/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { sentinelJourney } from './data/sentinelJourney';

export default function SentinelJourneySection() {
  const { reducedMotion } = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold tracking-widest text-accent-cyan uppercase">
            SENTINEL JOURNEY
          </span>
          <h2 className="text-xl font-display font-semibold text-text-primary">
            The Sentinel Progression Path
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {sentinelJourney.map((step, idx) => (
            <motion.div key={step.name} variants={stepVariants} className="h-full">
              <Card className="p-5 flex flex-col gap-4 h-full border border-border-subtle bg-bg-secondary/40 relative">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-md font-semibold">
                    PHASE {step.phase}
                  </span>
                  <span className="text-2xl font-display font-bold text-text-muted/15 select-none">
                    0{idx + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-display font-bold text-text-primary">
                    {step.name}
                  </h3>
                  <p className="text-[11px] font-ui text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
