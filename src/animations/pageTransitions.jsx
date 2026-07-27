/* eslint-disable react-refresh/only-export-components */
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
};

export function PageTransition({ children }) {
  const { reducedMotion } = useReducedMotion();

  if (reducedMotion) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
