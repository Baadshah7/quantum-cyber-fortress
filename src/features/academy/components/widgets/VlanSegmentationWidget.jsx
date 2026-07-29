import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { RefreshCw, Network, Info } from 'lucide-react';

const HOSTS = [
  { id: 'db', name: 'Core Database Server', desc: 'Stores classified ledger database.', defaultVlan: 10, correctVlan: 10 },
  { id: 'web', name: 'Internal Web Server', desc: 'Hosts fortress operational portal.', defaultVlan: 10, correctVlan: 10 },
  { id: 'admin', name: 'Admin Gateway Node', desc: 'Secure shell administrator gateway.', defaultVlan: 10, correctVlan: 20 },
  { id: 'guest', name: 'Guest Wi-Fi Router', desc: 'Public wireless endpoint interface.', defaultVlan: 10, correctVlan: 30 }
];

export default function VlanSegmentationWidget({ onComplete }) {
  const [vlans, setVlans] = useState(() => 
    HOSTS.reduce((acc, h) => ({ ...acc, [h.id]: h.defaultVlan }), {})
  );
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState(null); // 'success' | 'failure'

  const handleVlanChange = (hostId, vlanTag) => {
    setVlans(prev => ({ ...prev, [hostId]: parseInt(vlanTag, 10) }));
  };

  const testSegmentation = () => {
    setTesting(true);
    setLogs([]);
    setTestResult(null);

    const checkLogs = [];
    
    setTimeout(() => {
      checkLogs.push('Initializing Layer 2 VLAN Segmentation Scan...');
      checkLogs.push(`Active Subnets Mapping:`);
      checkLogs.push(`  - VLAN 10 (Production): ${HOSTS.filter(h => vlans[h.id] === 10).map(h => h.name).join(', ') || 'NONE'}`);
      checkLogs.push(`  - VLAN 20 (Management): ${HOSTS.filter(h => vlans[h.id] === 20).map(h => h.name).join(', ') || 'NONE'}`);
      checkLogs.push(`  - VLAN 30 (Guest Sandbox): ${HOSTS.filter(h => vlans[h.id] === 30).map(h => h.name).join(', ') || 'NONE'}`);
      checkLogs.push('\nExecuting Packet Ping Boundary Verification...');

      // Test 1: Guest Wi-Fi -> Core DB (should be blocked)
      const guestVlan = vlans['guest'];
      const dbVlan = vlans['db'];
      const guestToDbBlocked = guestVlan !== dbVlan; // Different VLANs block traffic
      checkLogs.push(`[TEST 1/4] Guest Wi-Fi (VLAN ${guestVlan}) ➔ Core DB (VLAN ${dbVlan})`);
      if (guestToDbBlocked) {
        checkLogs.push(`  ➔ RESULT: BLOCKED (Success - VLAN Isolation Enforced)`);
      } else {
        checkLogs.push(`  ➔ RESULT: ALLOWED (CRITICAL WARNING: Attacker can probe database!)`);
      }

      // Test 2: Web Server -> Core DB (should be allowed)
      const webVlan = vlans['web'];
      const webToDbAllowed = webVlan === dbVlan; // Must be in same VLAN (Production)
      checkLogs.push(`[TEST 2/4] Web Server (VLAN ${webVlan}) ➔ Core DB (VLAN ${dbVlan})`);
      if (webToDbAllowed) {
        checkLogs.push(`  ➔ RESULT: ALLOWED (Success - Production link operational)`);
      } else {
        checkLogs.push(`  ➔ RESULT: BLOCKED (WARNING: Web server disconnected from Database!)`);
      }

      // Test 3: Admin Gateway -> Core DB (should be allowed)
      const adminVlan = vlans['admin'];
      checkLogs.push(`[TEST 3/4] Admin Gateway (VLAN ${adminVlan}) ➔ Core DB (VLAN ${dbVlan})`);
      if (adminVlan === 20 && dbVlan === 10) {
        checkLogs.push(`  ➔ RESULT: ALLOWED (Success - Secure Inter-VLAN Routing authorized)`);
      } else if (adminVlan === dbVlan) {
        checkLogs.push(`  ➔ RESULT: ALLOWED (Risk - Admin workstation combined in standard Production domain)`);
      } else {
        checkLogs.push(`  ➔ RESULT: BLOCKED (ERROR: Administrator cannot reach core servers!)`);
      }

      // Test 4: Guest Wi-Fi -> Public Internet (should be allowed)
      checkLogs.push(`[TEST 4/4] Guest Wi-Fi (VLAN ${guestVlan}) ➔ WAN Gateway (Public Internet)`);
      checkLogs.push(`  ➔ RESULT: ALLOWED (Success - Internet browsing operational)`);

      // Final success validation
      const success = 
        guestVlan === 30 && 
        adminVlan === 20 && 
        dbVlan === 10 && 
        webVlan === 10;

      setTesting(false);

      if (success) {
        setTestResult('success');
        setLogs([...checkLogs, `\n[SUCCESS] Boundary routing parameters satisfied. Fortress segment quarantined.`]);
        onComplete({ success: true });
      } else {
        setTestResult('failure');
        setLogs([...checkLogs, `\n[FAILURE] Network validation failed. Review host isolation mappings.`]);
        onComplete({ success: false });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-5 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono text-[9px] text-text-muted uppercase">SUBNET LOGICAL ISOLATION PANEL</span>
          <h3 className="text-sm font-display font-semibold text-text-primary mt-1">Network Segmentation Mappings</h3>
        </div>
        {testResult && (
          <Badge status={testResult === 'success' ? 'success' : 'critical'}>
            {testResult === 'success' ? 'NETWORKS SEGREGATED' : 'LINK BREACH DETECTED'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* VLAN Switch Mappings */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="border border-border-subtle/50 rounded-btn overflow-hidden bg-bg-primary/20">
            <div className="grid grid-cols-12 p-3 bg-bg-secondary/60 border-b border-border-subtle font-mono text-[10px] text-text-muted font-bold text-center">
              <span className="col-span-6 text-left">INFRASTRUCTURE NODE</span>
              <span className="col-span-6 text-left">VLAN ACCESS ZONE</span>
            </div>

            <div className="flex flex-col font-mono text-xs">
              {HOSTS.map((host) => (
                <div 
                  key={host.id} 
                  className="grid grid-cols-12 items-center p-3 border-b border-border-subtle/30 bg-bg-primary/10 hover:bg-bg-primary/30"
                >
                  <div className="col-span-6 flex flex-col gap-0.5">
                    <span className="text-text-primary font-semibold">{host.name}</span>
                    <span className="text-[9px] text-text-muted font-ui leading-normal">{host.desc}</span>
                  </div>
                  <div className="col-span-6 pl-2">
                    <select
                      value={vlans[host.id]}
                      onChange={(e) => handleVlanChange(host.id, e.target.value)}
                      className="w-full bg-bg-secondary border border-border-subtle rounded-btn px-2.5 py-1.5 text-xs focus:outline-none focus:border-accent-cyan text-text-primary"
                      disabled={testing}
                      aria-label={`VLAN zone for ${host.name}`}
                    >
                      <option value="10">VLAN 10 (Production Zone)</option>
                      <option value="20">VLAN 20 (Management Zone)</option>
                      <option value="30">VLAN 30 (Guest Sandbox Zone)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Console / Diagnostics Output */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="font-mono text-[10px] text-text-muted uppercase">SEGMENTATION BOUNDARY VERIFICATION</span>
          
          <div className="flex-1 min-h-[160px] bg-bg-primary border border-border-subtle rounded-btn p-3.5 font-mono text-[10px] text-accent-cyan flex flex-col gap-1 overflow-y-auto leading-relaxed">
            {testing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-accent-cyan" />
                <span>INTERROGATING SUBNET BRIDGE PATHS...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-text-muted text-center italic p-4">
                Click &quot;Test Segmentation&quot; to verify VLAN routing boundaries.
              </div>
            ) : (
              logs.map((log, idx) => {
                let color = 'text-text-secondary';
                if (log.includes('Success')) color = 'text-status-success';
                if (log.includes('ALLOWED') && log.includes('Success')) color = 'text-status-success font-semibold';
                if (log.includes('BLOCKED') && log.includes('Success')) color = 'text-status-success font-semibold';
                if (log.includes('CRITICAL WARNING')) color = 'text-status-critical font-bold border-l border-status-critical pl-1.5 animate-pulse';
                if (log.includes('WARNING')) color = 'text-status-warning font-semibold';
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
            onClick={testSegmentation}
            disabled={testing}
            icon={<Network className="w-3.5 h-3.5" />}
            className="font-mono text-xs w-full py-2.5"
          >
            TEST SEGMENTATION
          </Button>
        </div>
      </div>

      {/* Guide footer */}
      <div className="p-3 bg-bg-tertiary border border-border-subtle rounded-btn flex items-start gap-2.5 font-ui text-[11px] text-text-secondary leading-normal">
        <Info className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Segmentation Guide: </strong>
          Map the Guest Wi-Fi router to the Guest Sandbox VLAN (VLAN 30) to contain it. Assign the Admin workstation to the Management VLAN (VLAN 20) for security. Ensure servers stay in Production (VLAN 10). Test segmentation to ensure isolation blocks lateral guest paths to database.
        </div>
      </div>
    </div>
  );
}
