import { useState, useEffect, useRef } from 'react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';

import { motion } from 'framer-motion';
import { 
  Radio, ShieldAlert, Cpu, Terminal as TermIcon, 
  Search, BookOpen 
} from 'lucide-react';

const CVES = [
  {
    id: 'CVE-2026-1044',
    title: 'Decentralized Auth Token RCE',
    severity: 'critical',
    cvss: '9.8',
    desc: 'A remote code execution vulnerability exists in decentralized session token validators. Attacking nodes can pass malformed JSON objects to overflow validation memory.',
    mitigation: 'Update session-security packages to v1.2.4 or filter invalid headers at the Gate.'
  },
  {
    id: 'CVE-2026-1337',
    title: 'Role-Based Authentication Bypass',
    severity: 'critical',
    cvss: '9.3',
    desc: 'An authorization bypass allows user privileges to be elevated to administrative roles due to loose type comparisons in RBAC permissions middleware.',
    mitigation: 'Implement strict triple-equals type validation and audit user group parameters.'
  },
  {
    id: 'CVE-2026-8821',
    title: 'Cryptographic Packet Parser DoS',
    severity: 'warning',
    cvss: '6.5',
    desc: 'A denial of service vulnerability exists in packet assembly libraries. Sending a malformed cipher packet triggers an infinite loop leading to thread starvation.',
    mitigation: 'Implement packet size validation checks and set maximum parse timeouts.'
  },
  {
    id: 'CVE-2026-7719',
    title: 'Token Exchange CSRF Vulnerability',
    severity: 'warning',
    cvss: '7.5',
    desc: 'Cross-Site Request Forgery (CSRF) is possible during user token exchange operations. Session validation lacks secure SameSite cookie structures.',
    mitigation: 'Set cookie attributes to SameSite=Strict and enforce custom authorization headers.'
  }
];

const BLOG_POSTS = [
  {
    title: 'The Rise of Zero-Trust Architectures',
    author: 'Fortress Intel Team',
    date: '2026-07-28',
    category: 'Architecture',
    takeaway: 'Never trust, always verify. Security parameters are no longer local; authenticate and authorize every request at every layer.'
  },
  {
    title: 'Common Traps in Caesar Shift Decryption',
    author: 'Academy Research',
    date: '2026-07-25',
    category: 'Cryptography',
    takeaway: 'Classical ciphers lack key entropy. Always prioritize modern asymmetric cryptographic ciphers (ECC/AES) over historical shifts.'
  },
  {
    title: 'Incident Analysis: Log Spoofing Vectors',
    author: 'Incident Command',
    date: '2026-07-20',
    category: 'Forensics',
    takeaway: 'Ensure system logs are write-only or streamed to an external central monitoring facility in real-time to prevent deletion by intruders.'
  }
];

const MOCK_LOG_TEMPLATES = [
  '[INFO] Connection synced with Sentinel-01 (10.0.8.22)',
  '[WARN] Brute force access attempt blocked on port 22 from 198.51.100.42',
  '[ALERT] Threat payload signature match detected: CVE-2026-1044',
  '[INFO] Intrusion Prevention System: Blocked source IP 198.51.100.42',
  '[WARN] SSL/TLS certificate updates expiring in 48 hours for token services',
  '[INFO] Local ledger health status check: 100% synchronized',
  '[ALERT] High number of malformed DNS requests parsed from external routing',
  '[INFO] Firewall policies integrity checked: no modifications',
  '[WARN] Suspicious HTTP headers detected by Phishing Inspector. Sender quarantined.',
  '[INFO] Watchtower RSS feed synchronizer: Fetched latest CVE advisory entries'
];

export default function PlaceholderWatchtower() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const logsEndRef = useRef(null);

  // Generate logs dynamically
  useEffect(() => {
    // Initial logs
    const initialLogs = [];
    for (let i = 0; i < 6; i++) {
      const time = new Date(Date.now() - (6 - i) * 60000).toLocaleTimeString();
      initialLogs.push(`[${time}] ${MOCK_LOG_TEMPLATES[i % MOCK_LOG_TEMPLATES.length]}`);
    }
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const randomTemplate = MOCK_LOG_TEMPLATES[Math.floor(Math.random() * MOCK_LOG_TEMPLATES.length)];
      setLogs((prev) => {
        const updated = [...prev, `[${time}] ${randomTemplate}`];
        if (updated.length > 20) {
          updated.shift();
        }
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Filter CVEs based on search
  const filteredCves = CVES.filter(
    (cve) => 
      cve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cve.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col gap-8 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glassmorphism rounded-card border border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-cyan/15 rounded-btn text-accent-cyan border border-accent-cyan/20">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Watchtower Sector
            </h1>
            <p className="text-xs font-ui text-text-secondary mt-1">
              Flagship Security Center // Live Threat Intelligence feeds
            </p>
          </div>
        </div>
        <div className="flex gap-4 font-mono text-[10px]">
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn">
            <span className="text-text-muted">INTELLIGENCE SYNC</span>
            <span className="text-accent-cyan font-bold text-sm mt-0.5 animate-pulse">SYNCHRONIZED</span>
          </div>
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn">
            <span className="text-text-muted">GLOBAL ATTACK LEVEL</span>
            <span className="text-status-warning font-bold text-sm mt-0.5">ELEVATED (TIER III)</span>
          </div>
        </div>
      </div>

      {/* Row 1: Radar Sweep & Intrusion Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Global Attack Radar */}
        <Card className="p-6 border border-border-subtle flex flex-col gap-4 bg-bg-secondary/20 relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-accent-cyan" />
              <h2 className="text-sm font-display font-bold text-text-primary">Global Threat Radar</h2>
            </div>
            <Badge status="success" className="text-[9px]">Active Sweep</Badge>
          </div>

          <div className="flex-1 flex justify-center items-center py-6 relative z-10">
            <div className="relative w-56 h-56 rounded-full border border-accent-cyan/20 flex items-center justify-center">
              {/* Concentric Circles */}
              <div className="absolute w-40 h-40 rounded-full border border-accent-cyan/15" />
              <div className="absolute w-24 h-24 rounded-full border border-accent-cyan/10" />
              
              {/* Crosshairs */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-accent-cyan/10 -translate-x-1/2" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-accent-cyan/10 -translate-y-1/2" />

              {/* Sweeping Line */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent to-accent-cyan origin-left -translate-y-1/2"
                style={{ top: 'calc(50% - 1px)' }}
              />

              {/* Threat Dots */}
              <div className="absolute top-8 left-16 w-2 h-2 rounded-full bg-status-critical shadow-[0_0_8px_#F87171] animate-ping" />
              <div className="absolute top-12 left-16 w-2 h-2 rounded-full bg-status-critical" />

              <div className="absolute bottom-16 right-12 w-1.5 h-1.5 rounded-full bg-status-warning shadow-[0_0_8px_#FBBF24] animate-ping" style={{ animationDelay: '1.5s' }} />
              <div className="absolute bottom-20 right-12 w-1.5 h-1.5 rounded-full bg-status-warning" />

              <div className="absolute top-24 right-16 w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_#34D399] animate-ping" style={{ animationDelay: '3.2s' }} />
              <div className="absolute top-28 right-16 w-2 h-2 rounded-full bg-status-success" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mt-2 border-t border-border-subtle/30 pt-3">
            <span>RADAR: 3 ACTIVE SIGNATURES</span>
            <span>POLAR COORDINATES: SYNCED</span>
          </div>
        </Card>

        {/* Live Intrusion logs Terminal */}
        <Card className="p-6 border border-border-subtle flex flex-col gap-4 bg-bg-primary/90 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TermIcon className="w-4.5 h-4.5 text-accent-cyan" />
              <h2 className="text-sm font-display font-bold text-text-primary">System Telemetry Log Feed</h2>
            </div>
            <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse" />
          </div>

          <div className="flex-1 bg-bg-secondary/60 border border-border-subtle rounded-btn p-4 font-mono text-[10.5px] text-accent-cyan leading-relaxed h-[240px] overflow-y-auto flex flex-col gap-1.5">
            {logs.map((log, index) => {
              let color = 'text-text-secondary';
              if (log.includes('[ALERT]')) color = 'text-status-critical';
              if (log.includes('[WARN]')) color = 'text-status-warning';
              if (log.includes('[INFO]')) color = 'text-accent-cyan';
              
              return (
                <div key={index} className={color}>
                  {log}
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>

          <div className="text-[10px] font-mono text-text-muted border-t border-border-subtle/30 pt-3">
            LOG STREAM: ENCRYPTED PORT CHANNEL SSH_22
          </div>
        </Card>

      </div>

      {/* Row 2: CVE Database & Security blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CVE Threat Advisories Database */}
        <Card className="lg:col-span-2 p-6 border border-border-subtle flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-accent-cyan" />
              <h2 className="text-sm font-display font-bold text-text-primary">CVE Threat Intelligence Database</h2>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search CVE..."
                className="w-full bg-bg-primary border border-border-subtle rounded-btn pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-accent-cyan font-mono text-text-primary"
              />
            </div>
          </div>

          <div className="h-[1px] bg-border-subtle w-full" />

          {/* List of CVEs */}
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredCves.map((cve) => (
              <div 
                key={cve.id} 
                className="p-3 bg-bg-secondary/40 border border-border-subtle rounded-btn flex flex-col gap-2 hover:border-accent-cyan/30 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent-cyan">{cve.id}</span>
                    <h3 className="text-xs font-display font-bold text-text-primary">{cve.title}</h3>
                  </div>
                  <Badge 
                    status={cve.severity === 'critical' ? 'critical' : 'warning'} 
                    className="text-[9px] font-mono px-2 py-0.5"
                  >
                    CVSS {cve.cvss}
                  </Badge>
                </div>
                <p className="text-[11px] font-ui text-text-secondary leading-normal">{cve.desc}</p>
                <div className="mt-1 flex items-start gap-1 text-[10px] font-mono text-text-muted">
                  <span className="text-accent-violet">REMEDIATION:</span>
                  <span>{cve.mitigation}</span>
                </div>
              </div>
            ))}
            {filteredCves.length === 0 && (
              <div className="text-center py-6 text-xs font-mono text-text-muted">
                No matching vulnerabilities found.
              </div>
            )}
          </div>
        </Card>

        {/* Security Intel Advisories Blog */}
        <Card className="p-6 border border-border-subtle flex flex-col gap-4 bg-bg-secondary/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-accent-cyan" />
            <h2 className="text-sm font-display font-bold text-text-primary">Educational Advisories</h2>
          </div>

          <div className="h-[1px] bg-border-subtle w-full" />

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            {BLOG_POSTS.map((post, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 group">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-accent-violet font-semibold">{post.category}</span>
                  <span className="text-text-muted">{post.date}</span>
                </div>
                <h3 className="text-xs font-display font-bold text-text-primary group-hover:text-accent-cyan transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-[10.5px] font-ui text-text-secondary leading-normal bg-bg-primary/45 border border-border-subtle/50 p-2.5 rounded-btn italic">
                  &ldquo;{post.takeaway}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
