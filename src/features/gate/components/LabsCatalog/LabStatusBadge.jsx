import { Badge } from '@/design-system/components/Badge';
import { iconMap } from './iconMap';

export default function LabStatusBadge({ status, clearance = 'Level II', scoreText }) {
  // Define status details mapping
  const statusDetails = {
    'standby': {
      label: 'Simulation Standby',
      iconName: 'Activity',
      variant: 'warning',
      ledClass: 'bg-status-warning shadow-[0_0_6px_#fbbf24] animate-pulse',
      tooltip: 'Offline configuration ready to be scheduled.'
    },
    'available': {
      label: 'Available',
      iconName: 'Play',
      variant: 'success',
      ledClass: 'bg-status-success shadow-[0_0_6px_#34d399]',
      tooltip: 'Ready for immediate simulation run.'
    },
    'locked': {
      label: 'Locked',
      iconName: 'Lock',
      variant: 'default',
      ledClass: 'bg-text-muted/60',
      tooltip: `Access Restricted: clearance ${clearance} required.`
    },
    'active': {
      label: 'Active Simulation',
      iconName: 'Activity',
      variant: 'cyan',
      ledClass: 'bg-accent-cyan shadow-[0_0_6px_#22d3ee] animate-pulse',
      tooltip: 'Operational instance currently running.'
    },
    'maintenance': {
      label: 'Maintenance',
      iconName: 'AlertTriangle',
      variant: 'warning',
      ledClass: 'bg-status-warning shadow-[0_0_6px_#fbbf24] animate-pulse',
      tooltip: 'Calibration in progress. Temporarily offline.'
    },
    'classified': {
      label: 'Classified',
      iconName: 'EyeOff',
      variant: 'critical',
      ledClass: 'bg-status-critical shadow-[0_0_6px_#f87171]',
      tooltip: 'Access Restricted: requires authorization.'
    },
    'completed': {
      label: 'Completed',
      iconName: 'CheckCircle2',
      variant: 'success',
      ledClass: 'bg-status-success shadow-[0_0_6px_#34d399]',
      tooltip: 'Validation logs archived.'
    },
    'coming-online': {
      label: 'Coming Online',
      iconName: 'RefreshCw',
      variant: 'violet',
      ledClass: 'bg-accent-violet shadow-[0_0_6px_#a78bfa] animate-pulse',
      tooltip: 'Initialization routine executing.'
    }
  };

  const details = statusDetails[status] || statusDetails['standby'];
  const IconComponent = iconMap[details.iconName] || iconMap.Activity;

  return (
    <Badge 
      variant={details.variant} 
      className="flex items-center gap-1.5 font-mono text-[9px] font-bold px-2 py-0.5 tracking-normal normal-case select-none"
    >
      <IconComponent className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${details.ledClass}`} aria-hidden="true" />
      <span>{scoreText || details.label}</span>
      
      {/* Screen reader fallback for accessible descriptions */}
      <span className="sr-only">
        Status is {details.label}. Info: {details.tooltip}
      </span>
    </Badge>
  );
}
