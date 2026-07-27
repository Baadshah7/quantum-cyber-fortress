
export function GlowPanel({
  children,
  active = false,
  variant = 'cyan',
  className = '',
  ...props
}) {
  const glowStyles = active
    ? variant === 'cyan'
      ? 'shadow-glow-cyan border-accent-cyan'
      : 'shadow-glow-violet border-accent-violet'
    : 'border-border-subtle';

  return (
    <div
      className={`rounded-card border bg-bg-secondary/40 backdrop-blur-md transition-all duration-300 ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

