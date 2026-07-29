import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { RefreshCw, Info, Database } from 'lucide-react';

export default function DnsRoutingConfigWidget({ onComplete }) {
  const [records, setRecords] = useState([
    { id: 1, type: 'A', name: 'fortress.internal', value: '10.0.8.1', correctValue: '10.0.8.1', status: 'secure' },
    { id: 2, type: 'A', name: 'secure-auth.internal', value: '198.51.100.99', correctValue: '10.0.8.2', status: 'hijacked' },
    { id: 3, type: 'CNAME', name: 'api.fortress.internal', value: 'spoofed-api.net', correctValue: ['fortress.internal', '10.0.8.3'], status: 'poisoned' },
    { id: 4, type: 'MX', name: 'mail.fortress.internal', value: 'mail-temp.xyz', correctValue: '10.0.8.5', status: 'poisoned' }
  ]);

  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState(null); // 'success' | 'failure'

  const handleValueChange = (id, newVal) => {
    setRecords(prev => prev.map(rec => rec.id === id ? { ...rec, value: newVal } : rec));
  };

  const verifyDns = () => {
    setTesting(true);
    setLogs([]);
    setTestResult(null);

    const checkLogs = [];
    let errorsCount = 0;

    setTimeout(() => {
      const updatedRecords = records.map(rec => {
        const cleanVal = rec.value.trim().toLowerCase();
        let isCorrect = false;

        if (Array.isArray(rec.correctValue)) {
          isCorrect = rec.correctValue.includes(cleanVal);
        } else {
          isCorrect = cleanVal === rec.correctValue;
        }

        checkLogs.push(`Resolving hostname [${rec.name}]...`);

        if (isCorrect) {
          checkLogs.push(`  ➔ RESOLVED TO: ${rec.value} (SECURE - INTERNAL GATEWAY)`);
          return { ...rec, status: 'secure' };
        } else {
          errorsCount++;
          if (rec.id === 2 && cleanVal === '198.51.100.99') {
            checkLogs.push(`  ➔ ERROR: Resolves to rogue external address 198.51.100.99! phishing threat!`);
          } else if (rec.id === 3 && cleanVal === 'spoofed-api.net') {
            checkLogs.push(`  ➔ ERROR: DNS records redirect api queries to malicious external domain!`);
          } else {
            checkLogs.push(`  ➔ WARNING: Misconfigured target target [${rec.value}]. Expected legitimate fortress node.`);
          }
          return { ...rec, status: rec.id === 2 ? 'hijacked' : 'poisoned' };
        }
      });

      setRecords(updatedRecords);
      setTesting(false);

      if (errorsCount === 0) {
        setTestResult('success');
        setLogs([...checkLogs, `[SUCCESS] DNS Ledger validated. Local router cache synchronized.`]);
        onComplete({ success: true });
      } else {
        setTestResult('failure');
        setLogs([...checkLogs, `[FAILURE] Validation incomplete. ${errorsCount} records failed compliance audits.`]);
        onComplete({ success: false });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-5 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono text-[9px] text-text-muted uppercase">DNS CACHE RECORDS AUDITING PANEL</span>
          <h3 className="text-sm font-display font-semibold text-text-primary mt-1">Nameserver Zone File Editor</h3>
        </div>
        {testResult && (
          <Badge status={testResult === 'success' ? 'success' : 'critical'}>
            {testResult === 'success' ? 'DNS SYNCHRONIZED' : 'POISONED CACHE'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Record Editor Grid */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="border border-border-subtle/50 rounded-btn overflow-hidden bg-bg-primary/20">
            <div className="grid grid-cols-12 p-3 bg-bg-secondary/60 border-b border-border-subtle font-mono text-[10px] text-text-muted font-bold text-center">
              <span className="col-span-2">TYPE</span>
              <span className="col-span-4 text-left">HOSTNAME</span>
              <span className="col-span-4 text-left">TARGET / VALUE</span>
              <span className="col-span-2">STATUS</span>
            </div>

            <div className="flex flex-col font-mono text-xs">
              {records.map((rec) => (
                <div 
                  key={rec.id} 
                  className="grid grid-cols-12 items-center p-3 border-b border-border-subtle/30 bg-bg-primary/10 hover:bg-bg-primary/30"
                >
                  <span className="col-span-2 text-center text-text-primary font-bold">{rec.type}</span>
                  <span className="col-span-4 text-text-secondary truncate">{rec.name}</span>
                  <div className="col-span-4 pr-3">
                    {rec.id === 1 ? (
                      <span className="text-text-muted select-none text-[11px] block py-1.5">{rec.value}</span>
                    ) : (
                      <input
                        type="text"
                        value={rec.value}
                        onChange={(e) => handleValueChange(rec.id, e.target.value)}
                        placeholder="IP or Domain..."
                        className="w-full bg-bg-secondary border border-border-subtle rounded-btn px-2.5 py-1 text-xs focus:outline-none focus:border-accent-cyan text-text-primary font-mono"
                        disabled={testing}
                        aria-label={`Target value for ${rec.name}`}
                      />
                    )}
                  </div>
                  <span className="col-span-2 text-center">
                    <span className={`px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase ${
                      rec.status === 'secure' 
                        ? 'bg-status-success/15 text-status-success border border-status-success/20' 
                        : rec.status === 'hijacked'
                          ? 'bg-status-critical/15 text-status-critical border border-status-critical/20 animate-pulse'
                          : 'bg-status-warning/15 text-status-warning border border-status-warning/20'
                    }`}>
                      {rec.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Lookup Panel */}
          <div className="p-3 bg-bg-primary/30 border border-border-subtle/50 rounded-btn">
            <span className="font-mono text-[9px] text-text-muted uppercase flex items-center gap-1 mb-2">
              <Database className="w-3.5 h-3.5 text-accent-cyan" /> Secure Infrastructure IP Assignments
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[10px]">
              <div className="p-2 bg-bg-secondary/50 rounded-sm border border-border-subtle/30">
                <span className="text-text-muted block">fortress.internal</span>
                <span className="text-text-primary font-bold">10.0.8.1</span>
              </div>
              <div className="p-2 bg-bg-secondary/50 rounded-sm border border-border-subtle/30">
                <span className="text-text-muted block">secure-auth.internal</span>
                <span className="text-text-primary font-bold">10.0.8.2</span>
              </div>
              <div className="p-2 bg-bg-secondary/50 rounded-sm border border-border-subtle/30">
                <span className="text-text-muted block">api.fortress.internal</span>
                <span className="text-text-primary font-bold">10.0.8.3 <span className="text-text-muted text-[8px]">(or CNAME)</span></span>
              </div>
              <div className="p-2 bg-bg-secondary/50 rounded-sm border border-border-subtle/30">
                <span className="text-text-muted block">mail.fortress.internal</span>
                <span className="text-text-primary font-bold">10.0.8.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostics & Verify Console */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="font-mono text-[10px] text-text-muted uppercase">CACHE RESOLUTION DIAGNOSTICS</span>
          
          <div className="flex-1 min-h-[160px] bg-bg-primary border border-border-subtle rounded-btn p-3 font-mono text-[10px] text-accent-cyan flex flex-col gap-1 overflow-y-auto leading-relaxed">
            {testing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-accent-cyan" />
                <span>RESOLVING NAMESERVERS...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-text-muted text-center italic p-4">
                Click &quot;Verify DNS Records&quot; to test resolution routing.
              </div>
            ) : (
              logs.map((log, idx) => {
                let color = 'text-text-secondary';
                if (log.includes('RESOLVED TO:')) color = 'text-status-success font-semibold';
                if (log.includes('ERROR:')) color = 'text-status-critical font-bold';
                if (log.includes('WARNING:')) color = 'text-status-warning font-bold';
                if (log.includes('[SUCCESS]')) color = 'text-status-success font-bold mt-1';
                if (log.includes('[FAILURE]')) color = 'text-status-critical font-bold mt-1';
                return (
                  <div key={idx} className={color}>
                    {log}
                  </div>
                );
              })
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={verifyDns}
            disabled={testing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />}
            className="font-mono text-xs w-full py-2.5"
          >
            VERIFY DNS RECORDS
          </Button>
        </div>
      </div>

      {/* Guide footer */}
      <div className="p-3 bg-bg-tertiary border border-border-subtle rounded-btn flex items-start gap-2.5 font-ui text-[11px] text-text-secondary leading-normal">
        <Info className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">DNS Validation: </strong>
          Use the lookup card below the table to map hijacked domain entries to their correct internal IP addresses. Be careful to match the target addresses exactly to secure the routing network.
        </div>
      </div>
    </div>
  );
}
