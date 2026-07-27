
export function ProgressBar({
  value = 0,
  variant = 'cyan',
  showValue = false,
  className = '',
  ...props
}) {
  const percent = Math.min(Math.max(value, 0), 100);

  const colors = {
    cyan: 'bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    violet: 'bg-accent-violet shadow-[0_0_8px_rgba(167,139,250,0.4)]',
    success: 'bg-status-success shadow-[0_0_8px_rgba(52,211,153,0.4)]',
    warning: 'bg-status-warning shadow-[0_0_8px_rgba(251,191,36,0.4)]',
    critical: 'bg-status-critical shadow-[0_0_8px_rgba(248,113,113,0.4)]',
  };

  return (
    <div className={`w-full font-ui ${className}`} {...props}>
      {showValue && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="text-text-secondary">Progress</span>
          <span className="text-text-primary font-mono">{percent}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden border border-border-subtle">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colors[variant]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

