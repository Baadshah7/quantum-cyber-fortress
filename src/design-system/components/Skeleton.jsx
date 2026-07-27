
export function Skeleton({
  className = '',
  variant = 'rectangular',
  ...props
}) {
  const baseStyles = 'animate-pulse bg-bg-tertiary/70 border border-border-subtle/40';

  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-card',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

