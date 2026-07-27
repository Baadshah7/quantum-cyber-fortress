import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { buttonHoverVariants } from '@/animations/microInteractions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const { reducedMotion } = useReducedMotion();

  const baseStyles = 'inline-flex items-center justify-center font-ui font-medium rounded-btn transition-colors focus-visible:outline-2 focus-visible:outline-accent-cyan active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-accent-cyan text-bg-primary hover:bg-cyan-400 font-semibold',
    secondary: 'bg-accent-violet text-bg-primary hover:bg-violet-400 font-semibold',
    outline: 'border border-border-subtle text-text-primary hover:bg-bg-tertiary hover:border-text-muted',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
    success: 'bg-status-success text-bg-primary hover:bg-emerald-400 font-semibold',
    warning: 'bg-status-warning text-bg-primary hover:bg-amber-400 font-semibold',
    danger: 'bg-status-critical text-bg-primary hover:bg-red-400 font-semibold',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      variants={buttonHoverVariants}
      whileHover="hover"
      whileTap="tap"
      custom={reducedMotion}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex items-center justify-center flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex items-center justify-center flex-shrink-0">{icon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

