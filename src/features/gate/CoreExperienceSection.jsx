import { motion } from 'framer-motion';
import { Card } from '@/design-system/components/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BookOpen, Terminal, Trophy } from 'lucide-react';

export default function CoreExperienceSection() {
  const { reducedMotion } = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold tracking-widest text-accent-cyan uppercase">
            CORE CAPABILITIES
          </span>
          <h2 className="text-xl font-display font-semibold text-text-primary">
            Key Learning Competency Labs
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={cardVariants}>
            <Card className="p-6 h-full flex flex-col gap-4 border border-border-subtle hover:shadow-glow-cyan hover:border-accent-cyan transition-all duration-200">
              <div className="p-3 bg-accent-cyan/10 border border-accent-cyan/20 rounded-btn text-accent-cyan w-fit">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-display font-bold text-text-primary">
                  Interactive Learning
                </h3>
                <p className="text-xs font-ui text-text-secondary leading-relaxed">
                  Engage with structured visual lessons designed for user interaction. Comprehend complex cryptography and security policies through conceptual clarity and testing.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="p-6 h-full flex flex-col gap-4 border border-border-subtle hover:shadow-glow-cyan hover:border-accent-cyan transition-all duration-200">
              <div className="p-3 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning w-fit">
                <Terminal className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-display font-bold text-text-primary">
                  Sandboxed Simulators
                </h3>
                <p className="text-xs font-ui text-text-secondary leading-relaxed">
                  Analyze and mitigate security threat indicators in isolated terminal workspaces. Test your reflexes against phishing payloads and password vulnerabilities without real-world risk.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="p-6 h-full flex flex-col gap-4 border border-border-subtle hover:shadow-glow-cyan hover:border-accent-cyan transition-all duration-200">
              <div className="p-3 bg-accent-violet/10 border border-accent-violet/20 rounded-btn text-accent-violet w-fit">
                <Trophy className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-display font-bold text-text-primary">
                  Gamified CTFs
                </h3>
                <p className="text-xs font-ui text-text-secondary leading-relaxed">
                  Solve capture-the-flag defensive scenarios. Decrypt strings, patch codes, earn credentials, and log achievements as you climb ranks from Recruit to Quantum Warden.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
