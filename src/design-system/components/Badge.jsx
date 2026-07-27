

export function Badge({
  children,
  variant = 'default',
  status,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-ui uppercase tracking-wider border';

  const statusMap = {
    'active': 'cyan',
    'coming-soon': 'default',
    'locked': 'default',
    'warning': 'warning',
    'critical': 'critical',
    'success': 'success',
  };

  const activeVariant = status ? (statusMap[status] || 'default') : variant;

  const variants = {
    default: 'bg-bg-tertiary text-text-secondary border-border-subtle',
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    violet: 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
    success: 'bg-status-success/10 text-status-success border-status-success/20',
    warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  };

  return (
    <span
      className={`${baseStyles} ${variants[activeVariant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
