import { motion } from 'framer-motion';
import { Card } from '@/design-system/components/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ShieldCheck } from 'lucide-react';

export default function MissionBriefSection() {
  const { reducedMotion } = useReducedMotion();

  return (
    <section id="briefing" className="py-12 flex justify-center px-4">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl w-full"
      >
        <Card className="p-8 md:p-10 relative overflow-hidden flex flex-col gap-6">
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-accent-cyan/10 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-cyan/15 rounded-btn text-accent-cyan border border-accent-cyan/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xs font-mono font-bold tracking-widest text-text-muted uppercase">
              SECTOR 00 // MISSION BRIEFING
            </h2>
          </div>

          <div className="h-[1px] bg-border-subtle w-full" />

          <p className="text-lg md:text-xl font-display font-medium text-text-primary leading-relaxed">
            Welcome, Sentinel. The Quantum Cyber Fortress stands as the final line of defense against decentralized threats. Your mission is to secure each sector of the fortress by acquiring core security competencies.
          </p>

          <p className="text-sm md:text-base font-ui text-text-secondary leading-relaxed">
            The fortress shields are currently operational, but constant threat alerts require vigilance. You will progress through the 4 active operational sectors—the Gate, Academy, Training Yard, and Watchtower—verifying protocols, mitigating vulnerabilities, and auditing threat logs. Restricted sectors remain inaccessible until future authorization. The systems await your command.
          </p>
        </Card>
      </motion.div>
    </section>
  );
}
