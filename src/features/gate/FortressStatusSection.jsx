import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { StatCounter } from '@/design-system/components/StatCounter';
import { Badge } from '@/design-system/components/Badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Shield, ShieldAlert, Activity, Award, Target } from 'lucide-react';
import BrowserSecurityIndexPanel from './BrowserSecurityIndexPanel';

function AnimatedNumber({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const { reducedMotion } = useReducedMotion();
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const end = parseInt(value, 10);
          if (isNaN(end)) {
            setCount(value);
            return;
          }
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            // easeOutQuad easing
            const easeOutQuad = progress * (2 - progress);
            const currentCount = Math.floor(easeOutQuad * end);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration, reducedMotion]);

  return <span ref={elementRef}>{count}</span>;
}

export default function FortressStatusSection() {
  const { reducedMotion } = useReducedMotion();

  return (
    <section className="py-12 px-4">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl mx-auto flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-mono font-bold tracking-widest text-accent-cyan uppercase">
            SYSTEM TELEMETRY
          </h2>
          <p className="text-xl font-display font-semibold text-text-primary">
            Active Fortress Metrics
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Browser Security Index - Top hierarchy on Mobile/Tablet, Right Column on Desktop */}
          <div className="w-full lg:w-1/3 lg:order-2">
            <BrowserSecurityIndexPanel />
          </div>

          {/* Grid of the 5 other telemetry cards - Bottom hierarchy on Mobile/Tablet, Left Column on Desktop */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:order-1">
            <div className="relative">
              <StatCounter
                label="Fortress Status"
                value="Operational"
                icon={Shield}
                variant="cyan"
              />
              <div className="absolute top-4 right-16">
                <Badge status="active">Active</Badge>
              </div>
            </div>

            <div className="relative">
              <StatCounter
                label="Threat Level"
                value="Tier III"
                icon={ShieldAlert}
                variant="warning"
              />
              <div className="absolute top-4 right-16">
                <Badge status="warning">Elevated</Badge>
              </div>
            </div>

            <div className="relative">
              <StatCounter
                label="System Health"
                value={<><AnimatedNumber value={99} />%</>}
                icon={Activity}
                variant="success"
              />
              <div className="absolute top-4 right-16">
                <Badge status="success">Optimal</Badge>
              </div>
            </div>

            <div className="relative">
              <StatCounter
                label="Sentinel Rank"
                value="Level 1"
                icon={Award}
                variant="cyan"
              />
              <div className="absolute top-4 right-16">
                <Badge status="coming-soon">Recruit</Badge>
              </div>
            </div>

            <div className="relative sm:col-span-2">
              <StatCounter
                label="Active Mission"
                value="Sector 00"
                icon={Target}
                variant="cyan"
              />
              <div className="absolute top-4 right-16">
                <Badge status="coming-soon">Init</Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

