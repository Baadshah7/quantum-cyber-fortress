import { Card } from './Card';

export function StatCounter({
  value,
  label,
  icon: Icon,
  variant = 'cyan',
  className = '',
  ...props
}) {
  const iconColors = {
    cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    violet: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
    success: 'text-status-success bg-status-success/10 border-status-success/20',
    warning: 'text-status-warning bg-status-warning/10 border-status-warning/20',
    critical: 'text-status-critical bg-status-critical/10 border-status-critical/20',
  };

  return (
    <Card className={`p-4 flex items-center justify-between ${className}`} {...props}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-ui font-medium text-text-muted uppercase tracking-wider">{label}</span>
        <span className="text-2xl font-display font-bold text-text-primary">{value}</span>
      </div>
      {Icon && (
        <div className={`p-2.5 rounded-btn border ${iconColors[variant]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      )}
    </Card>
  );
}

