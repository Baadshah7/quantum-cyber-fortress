import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, RefreshCw, Terminal
} from 'lucide-react';

export default function FirewallRuleBuilderWidget({ config, onComplete }) {
  // Config defaults
  const existingRules = config?.existingRules || [
    { action: 'allow', port: 22, source: '0.0.0.0/0' },
    { action: 'allow', port: 443, source: '0.0.0.0/0' }
  ];
  const attackVector = config?.attackVector || { port: 22, source: '203.0.113.5' };
  const legitimateTraffic = config?.legitimateTraffic || { port: 443, source: '192.168.1.50' };

  const [rules, setRules] = useState(() => 
    existingRules.map((r, idx) => ({ ...r, id: `rule-${idx}-${Date.now()}` }))
  );
  const [newAction, setNewAction] = useState('deny');
  const [newPort, setNewPort] = useState('22');
  const [newSource, setNewSource] = useState('203.0.113.5');
  const [logs, setLogs] = useState([]);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // 'success' | 'failure'

  // Helper to match CIDR or exact IP
  const ipMatches = (pattern, ip) => {
    if (pattern === '0.0.0.0/0' || pattern === 'any' || pattern === '*') return true;
    if (pattern.includes('/')) {
      const [subnetBase, mask] = pattern.split('/');
      if (mask === '24') {
        const baseOctets = subnetBase.split('.').slice(0, 3).join('.');
        const ipOctets = ip.split('.').slice(0, 3).join('.');
        return baseOctets === ipOctets;
      }
    }
    return pattern === ip;
  };

  const addRule = () => {
    if (!newSource.trim()) return;
    const newRule = {
      id: `rule-${Date.now()}`,
      action: newAction,
      port: parseInt(newPort, 10),
      source: newSource.trim()
    };
    setRules(prev => [...prev, newRule]);
    // Reset inputs
    setNewSource('');
  };

  const deleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const moveRule = (index, direction) => {
    const nextIdx = index + direction;
    if (nextIdx < 0 || nextIdx >= rules.length) return;
    setRules(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[nextIdx];
      updated[nextIdx] = temp;
      return updated;
    });
  };

  const testRuleset = () => {
    setTesting(true);
    setLogs([]);
    setTestResult(null);

    const simulationLogs = [];

    const runPacketEvaluation = (packet, packetLabel) => {
      simulationLogs.push(`[${packetLabel}] Evaluating packet: Port ${packet.port} from ${packet.source}...`);
      let matchedRule = null;

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const portMatches = rule.port === packet.port;
        const sourceMatches = ipMatches(rule.source, packet.source);

        if (portMatches && sourceMatches) {
          matchedRule = rule;
          simulationLogs.push(`[${packetLabel}] MATCH: Rule #${i + 1} (${rule.action.toUpperCase()} Port ${rule.port} from ${rule.source})`);
          break;
        }
      }

      if (matchedRule) {
        return matchedRule.action;
      } else {
        simulationLogs.push(`[${packetLabel}] NO MATCH: Reached ruleset boundary. Implicit DEFAULT DENY applied.`);
        return 'deny';
      }
    };

    // Evaluate both packets
    const attackOutcome = runPacketEvaluation(attackVector, 'ATTACK-NET');
    const legitOutcome = runPacketEvaluation(legitimateTraffic, 'LEGIT-NET');

    // Simulate real-time console printouts
    setTimeout(() => {
      setLogs(simulationLogs);
      setTesting(false);

      const attackBlocked = attackOutcome === 'deny';
      const legitAllowed = legitOutcome === 'allow';

      if (attackBlocked && legitAllowed) {
        setTestResult('success');
        onComplete({ success: true });
      } else {
        setTestResult('failure');
        onComplete({ success: false });
        if (!attackBlocked) {
          simulationLogs.push(`[SYSTEM-ALERT] COMPROMISE: Attacker SSH traffic bypassed ruleset and penetrated the console!`);
        }
        if (!legitAllowed) {
          simulationLogs.push(`[SYSTEM-ALERT] OUTAGE: Legitimate web services are currently unreachable for internal hosts!`);
        }
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-5 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      
      {/* Title / Description */}
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono text-[9px] text-text-muted uppercase">FIREWALL CONFIGURATION PANEL // PORT 22 & 443</span>
          <h3 className="text-sm font-display font-semibold text-text-primary mt-1">Rule Management Ledger</h3>
        </div>
        {testResult && (
          <Badge status={testResult === 'success' ? 'success' : 'critical'}>
            {testResult === 'success' ? 'FIREWALL SECURE' : 'RULES COMPROMISED'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Rules Builder Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col border border-border-subtle/50 rounded-btn overflow-hidden bg-bg-primary/20">
            <div className="grid grid-cols-12 p-3 bg-bg-secondary/60 border-b border-border-subtle font-mono text-[10px] text-text-muted font-bold text-center">
              <span className="col-span-1">#</span>
              <span className="col-span-3 text-left">ACTION</span>
              <span className="col-span-2">PORT</span>
              <span className="col-span-4 text-left">SOURCE IP</span>
              <span className="col-span-2">MOVE / DEL</span>
            </div>

            <div className="flex flex-col min-h-[140px] max-h-[220px] overflow-y-auto font-mono text-xs">
              {rules.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-text-muted py-8 italic">
                  No active rules. Implicit default-deny active.
                </div>
              ) : (
                rules.map((rule, idx) => (
                  <div 
                    key={rule.id} 
                    className="grid grid-cols-12 items-center p-2.5 border-b border-border-subtle/30 bg-bg-primary/10 hover:bg-bg-primary/30 text-center"
                  >
                    <span className="col-span-1 text-text-muted">{idx + 1}</span>
                    <span className="col-span-3 text-left pl-2">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase ${
                        rule.action === 'allow' 
                          ? 'bg-status-success/15 text-status-success border border-status-success/20' 
                          : 'bg-status-critical/15 text-status-critical border border-status-critical/20'
                      }`}>
                        {rule.action}
                      </span>
                    </span>
                    <span className="col-span-2 text-text-primary">{rule.port}</span>
                    <span className="col-span-4 text-left text-text-secondary truncate">{rule.source}</span>
                    
                    <div className="col-span-2 flex justify-center gap-1">
                      <button 
                        onClick={() => moveRule(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 hover:text-accent-cyan disabled:text-text-muted/30 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => moveRule(idx, 1)}
                        disabled={idx === rules.length - 1}
                        className="p-1 hover:text-accent-cyan disabled:text-text-muted/30 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteRule(rule.id)}
                        className="p-1 text-text-muted hover:text-status-critical cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form to Add New Rule */}
          <div className="p-3 bg-bg-primary/20 border border-border-subtle/50 rounded-btn flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 flex flex-col gap-1.5 font-mono text-[10px] w-full">
              <label htmlFor="rule-action" className="text-text-muted">ACTION</label>
              <select
                id="rule-action"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                className="w-full bg-bg-secondary border border-border-subtle rounded-btn px-2 py-1.5 text-xs focus:outline-none focus:border-accent-cyan text-text-primary"
              >
                <option value="allow">ALLOW</option>
                <option value="deny">DENY</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 font-mono text-[10px] w-full">
              <label htmlFor="rule-port" className="text-text-muted">PORT</label>
              <select
                id="rule-port"
                value={newPort}
                onChange={(e) => setNewPort(e.target.value)}
                className="w-full bg-bg-secondary border border-border-subtle rounded-btn px-2 py-1.5 text-xs focus:outline-none focus:border-accent-cyan text-text-primary"
              >
                <option value="22">22 (SSH)</option>
                <option value="443">443 (HTTPS)</option>
              </select>
            </div>

            <div className="flex-[2] flex flex-col gap-1.5 font-mono text-[10px] w-full">
              <label htmlFor="rule-source" className="text-text-muted">SOURCE IP / CIDR</label>
              <input
                id="rule-source"
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="e.g. 203.0.113.5"
                className="w-full bg-bg-secondary border border-border-subtle rounded-btn px-3 py-1.5 text-xs focus:outline-none focus:border-accent-cyan text-text-primary font-mono placeholder:text-text-muted"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={addRule}
              icon={<Plus className="w-4 h-4" />}
              className="font-mono text-[10px] py-2 shrink-0 w-full sm:w-auto"
            >
              ADD RULE
            </Button>
          </div>
        </div>

        {/* Console / Diagnostics Output */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="font-mono text-[10px] text-text-muted uppercase">REAL-TIME DIAGNOSTIC TELEMETRY</span>
          
          <div className="flex-1 min-h-[160px] bg-bg-primary border border-border-subtle rounded-btn p-3 font-mono text-[10px] text-accent-cyan flex flex-col gap-1 overflow-y-auto leading-relaxed">
            {testing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-accent-cyan" />
                <span>EVALUATING PACKET RULES...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-text-muted text-center italic p-4">
                Click &quot;Run Test Route&quot; to route simulated traffic through your firewall configuration.
              </div>
            ) : (
              logs.map((log, idx) => {
                let color = 'text-text-secondary';
                if (log.includes('MATCH: Rule') && log.includes('ALLOW')) color = 'text-status-success font-bold';
                if (log.includes('MATCH: Rule') && log.includes('DENY')) color = 'text-status-critical font-bold';
                if (log.includes('COMPROMISE')) color = 'text-status-critical font-bold border-l-2 border-status-critical pl-1.5';
                if (log.includes('OUTAGE')) color = 'text-status-warning font-bold border-l-2 border-status-warning pl-1.5';
                if (log.includes('ATTACK-NET')) color = 'text-accent-cyan';
                if (log.includes('LEGIT-NET')) color = 'text-accent-violet';
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
            onClick={testRuleset}
            disabled={testing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />}
            className="font-mono text-xs w-full py-2.5"
          >
            RUN TEST ROUTE
          </Button>
        </div>
      </div>
      
      {/* Help card */}
      <div className="p-3 bg-bg-tertiary border border-border-subtle rounded-btn flex items-start gap-2.5 font-ui text-[11px] text-text-secondary leading-normal">
        <Terminal className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Firewall Guide: </strong>
          Your rules are tested against a brute force attack (Port 22 from <code className="text-accent-cyan font-mono">203.0.113.5</code>) and legitimate user traffic (Port 443 from <code className="text-accent-cyan font-mono">192.168.1.50</code>). Ensure the SSH attack is blocked (by removing the broad allow rule or inserting a DENY rule above it) while maintaining HTTPS access.
        </div>
      </div>
    </div>
  );
}
