
export function Card({
  children,
  className = '',
  glass = true,
  glowHover = false,
  glowActive = false,
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-card transition-all duration-200';
  
  const glassStyles = glass 
    ? 'glassmorphism' 
    : 'bg-bg-secondary border border-border-subtle';

  const hoverStyles = glowHover 
    ? 'hover:shadow-glow-cyan hover:border-accent-cyan' 
    : '';

  const activeStyles = glowActive 
    ? 'shadow-glow-cyan border border-accent-cyan' 
    : '';

  const clickableStyles = onClick 
    ? 'cursor-pointer hover:bg-bg-tertiary/80' 
    : '';

  return (
    <div
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${activeStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

