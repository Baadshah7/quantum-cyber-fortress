import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fortressZones } from './data/fortressZones';
import { Shield, BookOpen, Terminal, Radio, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const iconMap = {
  Shield,
  BookOpen,
  Terminal,
  Radio
};

const zoneBrandMap = {
  'Gate': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  'Academy': 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
  'Training Yard': 'text-status-warning bg-status-warning/10 border-status-warning/20',
  'Watchtower': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
};

// Animated Vector Illustration components for each card
function SectorIllustration({ zoneName }) {
  if (zoneName === 'Gate') {
    return (
      <div className="w-full h-28 bg-bg-primary/60 border border-border-subtle/50 rounded-btn mb-4 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg className="w-16 h-16 text-accent-cyan" viewBox="0 0 64 64" fill="none">
          <rect x="16" y="16" width="32" height="32" rx="4" className="stroke-current" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="32" cy="32" r="8" className="stroke-current" strokeWidth="1.5" />
          <path d="M8 32H56" className="stroke-current opacity-20" strokeWidth="1" />
          <path d="M32 8V56" className="stroke-current opacity-20" strokeWidth="1" />
          <motion.line 
            x1="8" y1="16" x2="56" y2="16" 
            className="stroke-current text-accent-cyan" 
            strokeWidth="2"
            animate={{ y: [0, 32, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
        </svg>
      </div>
    );
  }
  if (zoneName === 'Academy') {
    return (
      <div className="w-full h-28 bg-bg-primary/60 border border-border-subtle/50 rounded-btn mb-4 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(167,139,250,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg className="w-16 h-16 text-accent-violet" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="16" r="4" className="fill-current" />
          <circle cx="16" cy="40" r="4" className="fill-current" />
          <circle cx="48" cy="40" r="4" className="fill-current" />
          <line x1="32" y1="20" x2="16" y2="36" className="stroke-current" strokeWidth="2" />
          <line x1="32" y1="20" x2="48" y2="36" className="stroke-current" strokeWidth="2" />
          <line x1="16" y1="40" x2="48" y2="40" className="stroke-current opacity-20" strokeWidth="1" strokeDasharray="2 2" />
          <motion.circle 
            cx="32" cy="20" r="8" 
            className="stroke-current" 
            strokeWidth="1.5" 
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.7, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </svg>
      </div>
    );
  }
  if (zoneName === 'Training Yard') {
    return (
      <div className="w-full h-28 bg-bg-primary/60 border border-border-subtle/50 rounded-btn mb-4 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg className="w-16 h-16 text-status-warning" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="14" width="48" height="36" rx="4" className="stroke-current" strokeWidth="2" />
          <path d="M14 23L20 27L14 31" className="stroke-current" strokeWidth="2" />
          <motion.line 
            x1="23" y1="31" x2="31" y2="31" 
            className="stroke-current" 
            strokeWidth="2" 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </svg>
      </div>
    );
  }
  if (zoneName === 'Watchtower') {
    return (
      <div className="w-full h-28 bg-bg-primary/60 border border-border-subtle/50 rounded-btn mb-4 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
        <svg className="w-16 h-16 text-accent-cyan" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="22" className="stroke-current opacity-25" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="14" className="stroke-current opacity-25" strokeWidth="1" />
          <circle cx="32" cy="32" r="6" className="stroke-current opacity-25" strokeWidth="1" />
          <circle cx="32" cy="32" r="1.5" className="fill-current" />
          <motion.line 
            x1="32" y1="32" x2="32" y2="10" 
            className="stroke-current origin-bottom" 
            strokeWidth="2" 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          />
        </svg>
      </div>
    );
  }
  return null;
}

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
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1 text-center md:text-left">
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
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {fortressZones.map((zone) => {
            const IconComponent = iconMap[zone.icon] || Shield;
            const brandClasses = zoneBrandMap[zone.name] || 'text-text-primary';

            return (
              <motion.div key={zone.route} variants={cardVariants}>
                <Card
                  glowHover={true}
                  className="p-6 h-full flex flex-col justify-between relative group border border-border-subtle hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className={`p-2.5 rounded-btn border ${brandClasses} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <Badge status={zone.status}>
                        Active
                      </Badge>
                    </div>

                    {/* Sector Visual Header */}
                    <SectorIllustration zoneName={zone.name} />

                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-base font-display font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                        {zone.name}
                      </h3>
                      <p className="text-xs font-ui text-text-secondary leading-relaxed">
                        {zone.description}
                      </p>
                    </div>

                    {/* Dedicated Learning Objective panel */}
                    <div className="mt-2 p-3 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn flex gap-2 items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-text-muted tracking-wider uppercase">Learning Objective</span>
                        <p className="text-[11px] font-ui text-text-secondary leading-normal mt-0.5">
                          {zone.objective}
                        </p>
                      </div>
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
