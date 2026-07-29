import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Skeleton } from '@/design-system/components/Skeleton';
import { Card } from '@/design-system/components/Card';
import LabCard from './LabCard';

// Skeleton matching the exact dimensions of LabCard to prevent Layout Shift
function LabCardSkeleton() {
  return (
    <Card className="p-5 h-[240px] flex flex-col justify-between border border-border-subtle bg-bg-secondary/10 relative overflow-hidden">
      <div className="flex flex-col gap-3.5 w-full">
        {/* Header Row Skeleton */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" className="h-8 w-8 rounded-btn" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
          <Skeleton variant="rectangular" className="h-5 w-24 rounded-full" />
        </div>

        {/* Title and Description Skeletons */}
        <div className="flex flex-col gap-1.5 w-full">
          <Skeleton variant="text" className="h-4 w-2/3" />
          <div className="flex flex-col gap-1 mt-1 w-full">
            <Skeleton variant="text" className="h-3 w-full" />
            <Skeleton variant="text" className="h-3 w-5/6" />
            <Skeleton variant="text" className="h-3 w-2/3" />
          </div>
        </div>

        {/* Badges Row Skeleton */}
        <div className="flex justify-between items-center w-full mt-1.5">
          <div className="flex gap-2 items-center">
            <Skeleton variant="rectangular" className="h-5 w-12 rounded-md" />
            <Skeleton variant="rectangular" className="h-5 w-16 rounded-md" />
          </div>
          <Skeleton variant="text" className="h-3 w-10" />
        </div>
      </div>

      {/* Footer Divider + Metadata Rows Skeleton */}
      <div className="mt-5 pt-4 border-t border-border-subtle/50 h-[38px] flex flex-col justify-center gap-1 w-full">
        <div className="flex justify-between w-full">
          <Skeleton variant="text" className="h-2.5 w-1/3" />
          <Skeleton variant="text" className="h-2.5 w-1/4" />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton variant="text" className="h-2.5 w-1/5" />
          <Skeleton variant="text" className="h-2.5 w-1/3" />
        </div>
      </div>
    </Card>
  );
}

export default function LabsGrid({ labs = [], loading = false }) {
  const { reducedMotion } = useReducedMotion();

  // Animation variants configuration
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
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <LabCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (labs.length === 0) {
    return (
      <div className="flex justify-center items-center py-16 px-4 bg-bg-secondary/5 border border-border-subtle/30 rounded-card min-h-[220px]">
        <div className="text-center max-w-md flex flex-col gap-2">
          <span className="text-xs font-mono font-bold tracking-widest text-status-critical uppercase">
            [ ALERT: ZERO RECORD MATCH ]
          </span>
          <h3 className="text-sm font-display font-bold text-text-primary">
            No Active Simulations Detected
          </h3>
          <p className="text-xs font-ui text-text-secondary leading-relaxed">
            The target database index returned empty logs. Verify credentials, check classification rights, or contact Sentinel Command.
          </p>
        </div>
      </div>
    );
  }

  // 3. Grid Renders
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {labs.map((lab) => (
        <motion.div key={lab.id} variants={cardVariants} className="h-full">
          <LabCard lab={lab} />
        </motion.div>
      ))}
    </motion.div>
  );
}
