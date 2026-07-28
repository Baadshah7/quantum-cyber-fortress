import { motion } from 'framer-motion';
import { Card } from '@/design-system/components/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BookOpen, Terminal, Radio } from 'lucide-react';

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
        <div className="flex flex-col gap-1 text-center md:text-left">
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
              <div className="p-3 bg-accent-violet/10 border border-accent-violet/20 rounded-btn text-accent-violet w-fit">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-display font-bold text-text-primary">
                  Interactive Learning Hub
                </h3>
                <p className="text-xs font-ui text-text-secondary leading-relaxed">
                  Engage with structured syllabus summaries in our Academy Chamber. Understand complex topics like Cryptography, Linux admin, OWASP, auth methods, and malware.
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
                  Hands-On Security Labs
                </h3>
                <p className="text-xs font-ui text-text-secondary leading-relaxed">
                  Analyze and solve security threat exercises in isolated terminal workspaces inside the Training Yard. Test passwords, decode Caesar/Base64, and analyze phishing indicators.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="p-6 h-full flex flex-col gap-4 border border-border-subtle hover:shadow-glow-cyan hover:border-accent-cyan transition-all duration-200">
              <div className="p-3 bg-accent-cyan/10 border border-accent-cyan/20 rounded-btn text-accent-cyan w-fit">
                <Radio className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-display font-bold text-text-primary">
                  Threat Intelligence Feed
                </h3>
                <p className="text-xs font-ui text-text-secondary leading-relaxed">
                  Audit live threat databases and real-time CVE advisories in the Watchtower. Monitor global attack radar coordinate sweeps and threat trends to stay secure.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
