import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

const LOG_LINES = [
  { id: 1, text: '[2026-07-28 04:02:11] syslogd: Log synchronizer synced: Gate, Academy, Watchtower', threat: false },
  { id: 2, text: '[2026-07-28 04:05:32] sshd[1245]: Connection established from sentinel node (10.0.8.22)', threat: false },
  { id: 3, text: '[2026-07-28 04:08:55] sshd[1248]: Failed password for root from 198.51.100.42 port 49223 ssh2', threat: true },
  { id: 4, text: '[2026-07-28 04:09:12] sshd[1245]: session opened for user sentinel by (uid=1000)', threat: false },
  { id: 5, text: '[2026-07-28 04:12:44] cron[882]: Job execution complete: backups synchronizer', threat: false }
];

export default function LogInspectorWidget({ onComplete }) {
  const [selectedId, setSelectedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedLine = LOG_LINES.find(l => l.id === selectedId);
  const isSuccess = selectedLine?.threat === true;

  const handleSubmit = () => {
    setSubmitted(true);
    if (isSuccess) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-text-muted">SYSLOG CONSOLE VIEW</span>
        {submitted && (
          <Badge status={isSuccess ? 'success' : 'critical'}>
            {isSuccess ? 'HOST IP ISOLATED' : 'ANOMALY MISSED'}
          </Badge>
        )}
      </div>

      <p className="text-xs text-text-secondary">
        Select the log line that represents a brute force access attempt on server system binaries.
      </p>

      {/* Terminal View */}
      <div className="flex flex-col bg-bg-primary/95 border border-border-subtle rounded-btn p-3 font-mono text-[10.5px] leading-relaxed select-none">
        {LOG_LINES.map((line) => (
          <button
            key={line.id}
            type="button"
            onClick={() => { setSelectedId(line.id); setSubmitted(false); }}
            className={`w-full text-left p-1.5 rounded-sm transition-colors focus:outline-none focus:bg-bg-tertiary cursor-pointer ${
              selectedId === line.id
                ? line.threat
                  ? 'text-status-critical bg-status-critical/10 border border-status-critical/20'
                  : 'text-status-warning bg-status-warning/10 border border-status-warning/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30'
            }`}
          >
            {line.text}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-1 font-mono text-xs">
        {submitted && !isSuccess && (
          <div className="flex items-center gap-1.5 text-status-critical mr-auto">
            <ShieldAlert className="w-4 h-4" />
            <span>Identify failed root log-in parameters.</span>
          </div>
        )}
        {submitted && isSuccess && (
          <div className="flex items-center gap-1.5 text-status-success mr-auto font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Threat IP identified and blocked.</span>
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={selectedId === null}
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
        >
          ISOLATE THREAT
        </Button>
      </div>
    </div>
  );
}
