import { motion } from 'framer-motion';
import { Card } from '@/design-system/components/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Swords, Lock, LayoutDashboard, GitFork } from 'lucide-react';

const EXPANSIONS = [
  {
    name: 'Arena',
    subtitle: 'Competitive CTF Engine',
    icon: Swords,
    desc: 'Interactive Capture-The-Flag defensive challenges, real-time code patching, and cryptography puzzle races.'
  },
  {
    name: 'Vault',
    subtitle: 'Achievements & Credentials',
    icon: Lock,
    desc: 'Secure locker for cryptographically signed badges, certificate logs, and customizable Sentinel resume sheets.'
  },
  {
    name: 'War Room',
    subtitle: 'Advanced Sentinel Analytics',
    icon: LayoutDashboard,
    desc: 'Visual telemetry panels mapping historical security performance metrics, global defense stats, and system progress.'
  }
];

export default function FutureRoadmapSection() {
  const { reducedMotion } = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="roadmap" className="py-12 px-4 relative overflow-hidden border-t border-border-subtle/30 bg-bg-secondary/10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 relative z-10">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-accent-cyan/60 uppercase flex items-center justify-center sm:justify-start gap-1.5">
            <GitFork className="w-3.5 h-3.5" />
            PROJECT DEPLOYMENT ROADMAP
          </span>
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Future Fortress Expansions
          </h2>
          <p className="text-xs font-ui text-text-secondary max-w-xl">
            Additional classified sectors remain under development. Future integrations will expand the Sentinel training network capability.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2"
        >
          {EXPANSIONS.map((exp) => {
            const IconComp = exp.icon;
            return (
              <motion.div key={exp.name} variants={cardVariants}>
                <Card className="p-5 border border-border-subtle bg-bg-secondary/15 flex flex-col gap-3 relative group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-btn bg-bg-tertiary border border-border-subtle text-text-muted flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-text-secondary">
                        {exp.name}
                      </h3>
                      <p className="text-[10px] font-display text-text-muted mt-0.5">
                        {exp.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] font-ui text-text-secondary/70 leading-relaxed">
                    {exp.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
