import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fortressZones } from './data/fortressZones';
import { Shield, BookOpen, Terminal, Swords, LayoutDashboard, Radio, Lock, ArrowUpRight } from 'lucide-react';

const iconMap = {
  Shield,
  BookOpen,
  Terminal,
  Swords,
  LayoutDashboard,
  Radio,
  Lock
};

const zoneBrandMap = {
  'Gate': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  'Academy Chamber': 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
  'Training Yard': 'text-status-warning bg-status-warning/10 border-status-warning/20',
  'Arena': 'text-status-critical bg-status-critical/10 border-status-critical/20',
  'War Room': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  'Watchtower': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  'Vault': 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
};

export default function FortressOverviewSection() {
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
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <section id="sectors" className="py-12 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold tracking-widest text-accent-cyan uppercase">
            FORTRESS SECTORS
          </span>
          <h2 className="text-xl font-display font-semibold text-text-primary">
            Fortress Overview Map
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {fortressZones.map((zone) => {
            const IconComponent = iconMap[zone.icon] || Shield;
            const brandClasses = zoneBrandMap[zone.name] || 'text-text-primary';

            return (
              <motion.div key={zone.route} variants={cardVariants}>
                <Card
                  glowHover={true}
                  className="p-6 h-full flex flex-col justify-between relative group border border-border-subtle"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className={`p-2.5 rounded-btn border ${brandClasses} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <Badge status={zone.status}>
                        {zone.status === 'active' ? 'Active' : 'Coming Soon'}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-base font-display font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                        {zone.name}
                      </h3>
                      <p className="text-xs font-ui text-text-secondary leading-relaxed">
                        {zone.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-subtle/50 flex justify-end">
                    <Link
                      to={zone.route}
                      className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent-cyan hover:text-cyan-300 transition-colors py-1 focus-visible:outline-2 focus-visible:outline-accent-cyan rounded-btn px-2"
                      aria-label={`Enter sector ${zone.name}`}
                    >
                      <span>ENTER SECTOR</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
