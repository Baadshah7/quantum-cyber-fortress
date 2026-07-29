import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { iconMap } from './iconMap';
import LabStatusBadge from './LabStatusBadge';
import LabDifficultyBadge from './LabDifficultyBadge';

const hoverGlowClasses = {
  'accent-cyan': 'hover:border-accent-cyan hover:shadow-glow-cyan',
  'accent-violet': 'hover:border-accent-violet hover:shadow-glow-violet',
  'status-success': 'hover:border-status-success hover:shadow-[0_0_0_1px_var(--status-success),0_0_24px_rgba(52,211,153,0.25)]',
  'status-warning': 'hover:border-status-warning hover:shadow-[0_0_0_1px_var(--status-warning),0_0_24px_rgba(251,191,36,0.25)]',
  'status-critical': 'hover:border-status-critical hover:shadow-[0_0_0_1px_var(--status-critical),0_0_24px_rgba(248,113,113,0.25)]',
};

export default function LabCard({ lab }) {
  const CategoryIcon = iconMap[lab.icon] || iconMap.Activity;
  const hoverGlowClass = hoverGlowClasses[lab.accentColor] || hoverGlowClasses['accent-cyan'];

  // Resolve hover action info based on status
  const getActionDetails = (status) => {
    switch (status) {
      case 'locked':
      case 'classified':
        return {
          text: 'ACCESS RESTRICTED',
          iconName: 'Lock',
          colorClass: 'text-status-critical',
        };
      case 'maintenance':
        return {
          text: 'ENVIRONMENT OFFLINE',
          iconName: 'AlertTriangle',
          colorClass: 'text-status-warning',
        };
      case 'coming-online':
        return {
          text: 'INITIALIZING NODE',
          iconName: 'RefreshCw',
          colorClass: 'text-accent-violet',
        };
      case 'available':
      case 'active':
      case 'completed':
        return {
          text: 'ACCESS SIMULATOR',
          iconName: 'ChevronRight',
          colorClass: 'text-accent-cyan',
        };
      case 'standby':
      default:
        return {
          text: 'AWAITING ACTIVATION',
          iconName: 'ChevronRight',
          colorClass: 'text-status-warning',
        };
    }
  };

  const action = getActionDetails(lab.status);
  const ActionIcon = iconMap[action.iconName] || iconMap.ChevronRight;
  const titleId = `lab-title-${lab.id}`;

  return (
    <Card
      role="group"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`relative group flex flex-col justify-between p-5 h-full border border-border-subtle bg-bg-secondary/15 select-none hover:scale-[1.02] transition-all duration-300 overflow-hidden ${hoverGlowClass}`}
    >
      {/* Dynamic Glass Sweep Reflection */}
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out pointer-events-none z-20" 
        aria-hidden="true"
      />

      <div className="flex flex-col gap-3.5">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-btn bg-bg-tertiary border border-border-subtle text-text-muted flex items-center justify-center group-hover:text-text-primary transition-colors">
              <CategoryIcon className="w-4 h-4 group-hover:animate-pulse shrink-0" aria-hidden="true" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase">
              {lab.category}
            </span>
          </div>
          <LabStatusBadge status={lab.status} clearance={lab.clearance} />
        </div>

        {/* Content Row */}
        <div className="flex flex-col gap-1">
          <h3 id={titleId} className="text-sm font-display font-bold text-text-primary">
            {lab.title}
          </h3>
          <p className="text-[11px] font-ui text-text-secondary/70 leading-relaxed min-h-[54px]">
            {lab.description}
          </p>
        </div>

        {/* Badges and Duration Row */}
        <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary mt-1">
          <div className="flex gap-2 items-center">
            <Badge variant="default" className="text-[9px] px-1.5 py-0.5 border border-border-subtle/50 text-text-muted">
              {lab.clearance}
            </Badge>
            <LabDifficultyBadge difficulty={lab.difficulty} />
          </div>
          <span className="text-text-muted text-[10px] font-mono">
            {lab.duration}
          </span>
        </div>
      </div>

      {/* Dynamic Slide Footer (Metadata <-> Action prompt) */}
      <div 
        className="relative mt-5 pt-4 border-t border-border-subtle/50 h-[38px] flex items-center overflow-hidden"
        aria-hidden="true"
      >
        {/* Default State: Thin Metadata Row */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-center gap-0.5 transition-all duration-300 ease-out group-hover:translate-y-full group-hover:opacity-0">
          <div className="flex justify-between text-[9px] font-mono text-text-muted/70 tracking-wide">
            <span>{lab.metadata.classification} · {lab.metadata.version}</span>
            <span>{lab.metadata.environment}</span>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-text-muted/70 tracking-wide">
            <span>CALIBRATED</span>
            <span>{lab.metadata.lastCalibrated || 'N/A'}</span>
          </div>
        </div>

        {/* Hover State: Slide up Action panel */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-between transition-all duration-300 ease-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <span className={`text-[10px] font-mono font-bold tracking-wider ${action.colorClass}`}>
            {action.text}
          </span>
          <ActionIcon className={`w-3.5 h-3.5 shrink-0 ${action.colorClass} group-hover:translate-x-0.5 transition-transform`} />
        </div>
      </div>
    </Card>
  );
}
