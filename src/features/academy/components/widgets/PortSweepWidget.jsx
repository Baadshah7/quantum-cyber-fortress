import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Terminal, ShieldCheck, ShieldAlert, Play, Trash } from 'lucide-react';

export default function PortSweepWidget({ onComplete }) {
  const [status, setStatus] = useState('idle'); // idle | scanning | scanned
  const [ports, setPorts] = useState([
    { number: 22, protocol: 'SSH', status: 'secure' },
    { number: 23, protocol: 'Telnet', status: 'insecure' },
    { number: 80, protocol: 'HTTP', status: 'secure' }
  ]);

  const startSweep = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('scanned');
    }, 2000);
  };

  const shutDownPort = (portNum) => {
    setPorts(prev => 
      prev.map(p => p.number === portNum ? { ...p, status: 'closed' } : p)
    );
    // Task complete when port 23 is closed
    if (portNum === 23) {
      onComplete(true);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-text-muted">DIAGNOSTICS BOARD</span>
        {status === 'scanned' && (
          <Badge status={ports.find(p => p.number === 23).status === 'closed' ? 'success' : 'critical'}>
            {ports.find(p => p.number === 23).status === 'closed' ? 'SYSTEM SECURED' : 'SECURITY WARNING'}
          </Badge>
        )}
      </div>

      {status === 'idle' && (
        <div className="flex flex-col gap-3 items-center py-6 text-center">
          <Terminal className="w-12 h-12 text-accent-cyan opacity-40 animate-pulse" />
          <p className="text-xs text-text-secondary max-w-xs leading-normal">
            Initialize port scan telemetry to identify active connections on local node servers.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={startSweep}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            START SCAN
          </Button>
        </div>
      )}

      {status === 'scanning' && (
        <div className="flex flex-col gap-3 items-center py-8 text-center">
          <RefreshCw className="w-10 h-10 text-accent-cyan animate-spin" />
          <p className="text-xs font-mono text-accent-cyan tracking-wider">
            SCANNING IP RANGE 10.0.8.0/24...
          </p>
          <div className="w-48 h-1 bg-bg-tertiary rounded-full overflow-hidden">
            <div className="h-full bg-accent-cyan animate-[shimmer_1.5s_infinite] w-full" />
          </div>
        </div>
      )}

      {status === 'scanned' && (
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono text-text-muted">SCAN RESULTS:</span>
          <div className="flex flex-col gap-2 font-mono text-xs">
            {ports.map((port) => (
              <div 
                key={port.number} 
                className="p-3 bg-bg-primary/50 border border-border-subtle rounded-btn flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <span className="text-accent-cyan font-bold">PORT {port.number}</span>
                  <span className="text-text-secondary">{port.protocol}</span>
                </div>
                <div>
                  {port.status === 'secure' && (
                    <span className="text-status-success font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> SECURE
                    </span>
                  )}
                  {port.status === 'insecure' && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => shutDownPort(port.number)}
                      className="border-status-critical/30 hover:bg-status-critical/15 text-status-critical font-semibold flex items-center gap-1 py-1"
                      aria-label={`Shut down insecure Telnet on port ${port.number}`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> SHUT DOWN (Telnet)
                    </Button>
                  )}
                  {port.status === 'closed' && (
                    <span className="text-text-muted flex items-center gap-1 font-semibold">
                      <Trash className="w-3.5 h-3.5" /> DECOMMISSIONED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline helper components for widgets
import { Badge } from '@/design-system/components/Badge';
import { RefreshCw } from 'lucide-react';
