import { useState, useEffect, useRef } from 'react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Skeleton } from '@/design-system/components/Skeleton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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
    vendor: 'Decentralized Auth Service',
    desc: 'A remote code execution vulnerability exists in decentralized session token validators. Attacking nodes can pass malformed JSON objects to overflow validation memory.',
    mitigation: 'Update session-security packages to v1.2.4 or filter invalid headers at the Gate.'
  },
  {
    id: 'CVE-2026-1337',
    title: 'Role-Based Authentication Bypass',
    severity: 'critical',
    cvss: '9.3',
    vendor: 'RBAC Privileges Middleware',
    desc: 'An authorization bypass allows user privileges to be elevated to administrative roles due to loose type comparisons in RBAC permissions middleware.',
    mitigation: 'Implement strict triple-equals type validation and audit user group parameters.'
  },
  {
    id: 'CVE-2026-8821',
    title: 'Cryptographic Packet Parser DoS',
    severity: 'warning',
    cvss: '6.5',
    vendor: 'Cryptographic Packet Parser',
    desc: 'A denial of service vulnerability exists in packet assembly libraries. Sending a malformed cipher packet triggers an infinite loop leading to thread starvation.',
    mitigation: 'Implement packet size validation checks and set maximum parse timeouts.'
  },
  {
    id: 'CVE-2026-7719',
    title: 'Token Exchange CSRF Vulnerability',
    severity: 'warning',
    cvss: '7.5',
    vendor: 'Token Exchange Gateway',
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

// Self-contained CVEThreatRadar component
function CVEThreatRadar({ cves, loading }) {
  const [rotation, setRotation] = useState(0);
  const { reducedMotion } = useReducedMotion();

  // Rotate the conic gradient scan sweep overlay
  useEffect(() => {
    if (reducedMotion) {
      setRotation(0);
      return;
    }
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const categoriesConfig = [
    { name: 'Decentralized Auth Service', shortName: 'Decentralized Auth', fallbackId: 'CVE-2026-1044', fallbackScore: 98 },
    { name: 'RBAC Privileges Middleware', shortName: 'RBAC Middleware', fallbackId: 'CVE-2026-1337', fallbackScore: 93 },
    { name: 'Cryptographic Packet Parser', shortName: 'Packet Parser', fallbackId: 'CVE-2026-8821', fallbackScore: 65 },
    { name: 'Token Exchange Gateway', shortName: 'Token Gateway', fallbackId: 'CVE-2026-7719', fallbackScore: 75 }
  ];

  // Resolve CVE details from cves state or fallbacks
  const radarData = categoriesConfig.map((config) => {
    let matched = cves.find(
      (c) =>
        c.vendor?.toLowerCase() === config.name.toLowerCase() ||
        c.title?.toLowerCase().includes(config.name.toLowerCase())
    );
    if (!matched) {
      matched = CVES.find(
        (c) =>
          c.vendor?.toLowerCase() === config.name.toLowerCase() ||
          c.title?.toLowerCase().includes(config.name.toLowerCase())
      );
    }

    const cveId = matched ? matched.id : config.fallbackId;
    let score = config.fallbackScore;
    if (matched && matched.cvss) {
      score = Math.round(parseFloat(matched.cvss) * 10);
    }

    return {
      name: config.name,
      shortName: config.shortName,
      cveId,
      score,
    };
  });

  // Calculate average severity
  const avgSev = Math.round(
    radarData.reduce((acc, curr) => acc + curr.score, 0) / radarData.length
  );

  // Severity color coding helper
  const getSeverityColors = (val) => {
    if (val >= 85) {
      return {
        hex: '#F87171',
        text: 'text-status-critical',
      };
    } else if (val >= 70) {
      return {
        hex: '#FBBF24',
        text: 'text-status-warning',
      };
    } else {
      return {
        hex: '#22D3EE',
        text: 'text-accent-cyan',
      };
    }
  };

  const avgColors = getSeverityColors(avgSev);

  // Custom dot renderer for radar points
  const renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || !payload) return null;

    const { hex } = getSeverityColors(payload.score);

    return (
      <g key={`dot-${payload.name}`}>
        {/* Pulsing outer ring */}
        {!reducedMotion && (
          <circle cx={cx} cy={cy} r={3.5} fill={hex} opacity={0.6}>
            <animate 
              attributeName="r" 
              values="3.5;10;3.5" 
              dur="2s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="opacity" 
              values="0.6;0;0.6" 
              dur="2s" 
              repeatCount="indefinite" 
            />
          </circle>
        )}
        {/* Solid center dot */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill={hex} 
          stroke="#0F1420"
          strokeWidth={1.5}
        />
      </g>
    );
  };

  return (
    <Card className="p-4 sm:p-5 md:p-6 border border-border-subtle flex flex-col gap-4 bg-bg-secondary/20 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Cpu className="w-4.5 h-4.5 text-accent-cyan" />
          <h2 className="text-sm font-display font-bold text-text-primary">CVE Severity Breakdown</h2>
        </div>
        <Badge status="success" className="text-[9px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          Live Intel
        </Badge>
      </div>

      {/* Radar Chart Display */}
      <div className="flex-1 flex flex-col justify-center h-[220px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 h-full">
            <div className="w-24 h-24 rounded-full border border-dashed border-accent-cyan/30 animate-spin" />
            <div className="text-center text-xs font-mono text-text-muted animate-pulse">
              Calibrating threat radar...
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Scan sweep overlay */}
            <div 
              className="absolute rounded-full pointer-events-none border border-accent-cyan/15 z-10"
              style={{
                width: '150px',
                height: '150px',
                left: 'calc(50% - 75px)',
                top: 'calc(50% - 75px)',
                background: 'conic-gradient(from 0deg, rgba(34, 211, 238, 0.25) 0deg, rgba(34, 211, 238, 0.05) 45deg, rgba(34, 211, 238, 0) 180deg)',
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
              }}
            />
            
            {/* Centered AVG SEV readout */}
            <div 
              className="absolute w-14 h-14 rounded-full bg-bg-secondary/95 border border-border-subtle/80 flex flex-col items-center justify-center shadow-lg shadow-black/85 z-20 pointer-events-none"
              style={{
                left: 'calc(50% - 28px)',
                top: 'calc(50% - 28px)',
              }}
            >
              <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider scale-[0.9]">Avg Sev</span>
              <span className={`text-sm font-mono font-bold leading-none mt-0.5 ${avgColors.text}`}>{avgSev}</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={75} data={radarData}>
                <PolarGrid stroke="rgba(34, 211, 238, 0.12)" gridType="circle" />
                <PolarAngleAxis 
                  dataKey="shortName" 
                  tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={false} 
                  axisLine={false} 
                />
                <Radar 
                  name="Severity" 
                  dataKey="score" 
                  stroke="#22d3ee" 
                  fill="#22d3ee" 
                  fillOpacity={0.12} 
                  dot={renderCustomDot} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Legend list (Stable Height placeholders when loading) */}
      {loading ? (
        <div className="flex flex-col gap-1.5 border-t border-border-subtle/30 pt-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-1">
              <div className="flex items-center gap-2 w-2/3">
                <Skeleton className="h-1.5 w-1.5 rounded-full shrink-0 animate-pulse" />
                <Skeleton className="h-3 w-full rounded-sm animate-pulse" />
              </div>
              <Skeleton className="h-3 w-8 rounded-sm animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 border-t border-border-subtle/30 pt-3">
          {radarData.map((item) => {
            const { hex, text } = getSeverityColors(item.score);
            return (
              <div 
                key={item.name} 
                className="flex items-center justify-between text-[11px] font-mono py-1 border-b border-border-subtle/5 last:border-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-1.5 h-1.5 rounded-full inline-block" 
                      style={{ 
                        backgroundColor: hex,
                        boxShadow: `0 0 6px ${hex}`
                      }} 
                    />
                    <span className="text-text-secondary font-medium">{item.name}</span>
                  </div>
                  <span className="text-text-muted text-[10px] sm:ml-0 ml-3">({item.cveId})</span>
                </div>
                <span className={`font-bold ${text}`}>{item.score}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mt-2 border-t border-border-subtle/30 pt-3">
        <span>SOURCE: CISA KEV CATALOG</span>
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-status-warning" />
          TOTAL VECTORS: {radarData.length}
        </span>
      </div>
    </Card>
  );
}

export default function PlaceholderWatchtower() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cves, setCves] = useState(CVES);
  const [loading, setLoading] = useState(true);
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

  // Fetch CISA KEV JSON Feed client-side on mount
  useEffect(() => {
    let active = true;
    const fetchCisaFeed = async () => {
      try {
        const response = await fetch('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.vulnerabilities && active) {
          // Sort by dateAdded descending
          const sorted = data.vulnerabilities.sort(
            (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
          );
          // Take the most recent 8 entries
          const recent = sorted.slice(0, 8);
          // Map to match the existing card layout
          const mapped = recent.map((v) => ({
            id: v.cveID,
            title: v.vulnerabilityName,
            desc: v.shortDescription,
            mitigation: v.requiredAction,
            dateAdded: v.dateAdded, // added for radar distance calculation
            vendor: v.vendorProject, // added for chart grouping
            severity: null, // No severity directly in KEV feed
            cvss: null      // No CVSS directly in KEV feed
          }));
          setCves(mapped);
        }
      } catch (err) {
        console.warn('Failed to fetch CISA threat feed, using local fallback:', err);
        if (active) {
          setCves(CVES);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCisaFeed();
    return () => {
      active = false;
    };
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Filter CVEs based on search
  const filteredCves = cves.filter(
    (cve) => 
      cve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cve.title.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="flex-1 flex flex-col gap-8 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-6 glassmorphism rounded-card border border-border-subtle relative overflow-hidden">
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
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 font-mono text-[10px] w-full sm:w-auto">
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn flex-1 sm:flex-initial">
            <span className="text-text-muted">INTELLIGENCE SYNC</span>
            <span className="text-accent-cyan font-bold text-sm mt-0.5 animate-pulse">SYNCHRONIZED</span>
          </div>
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn flex-1 sm:flex-initial">
            <span className="text-text-muted">GLOBAL ATTACK LEVEL</span>
            <span className="text-status-warning font-bold text-sm mt-0.5">ELEVATED (TIER III)</span>
          </div>
        </div>
      </div>

      {/* Row 1: CVE Severity Breakdown & Intrusion Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CVE Severity Breakdown (Radar Threat Intel) */}
        <CVEThreatRadar cves={cves} loading={loading} />

        {/* Live Intrusion logs Terminal */}
        <Card className="p-4 sm:p-5 md:p-6 border border-border-subtle flex flex-col gap-4 bg-bg-primary/90 relative overflow-hidden">
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
        <Card className="lg:col-span-2 p-4 sm:p-5 md:p-6 border border-border-subtle flex flex-col gap-4">
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

          {/* List of CVEs (Stable Height) */}
          <div className="flex flex-col gap-3 h-[300px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex flex-col gap-3">
                <div className="text-center py-2 text-xs font-mono text-text-muted animate-pulse">
                  Loading Live CISA Threat Intel Feed...
                </div>
                <Skeleton className="h-20 w-full animate-pulse" />
                <Skeleton className="h-20 w-full animate-pulse" />
                <Skeleton className="h-20 w-full animate-pulse" />
              </div>
            ) : (
              <>
                {filteredCves.map((cve) => (
                  <div 
                    key={cve.id} 
                    className="p-3 bg-bg-secondary/40 border border-border-subtle rounded-btn flex flex-col gap-2 hover:border-accent-cyan/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-accent-cyan">{cve.id}</span>
                        <h3 className="text-xs font-display font-bold text-text-primary">{cve.title}</h3>
                      </div>
                      {cve.cvss && (
                        <Badge 
                          status={cve.severity === 'critical' ? 'critical' : 'warning'} 
                          className="text-[9px] font-mono px-2 py-0.5 w-fit"
                        >
                          CVSS {cve.cvss}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] font-ui text-text-secondary leading-normal break-words">{cve.desc}</p>
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
              </>
            )}
          </div>
        </Card>

        {/* Security Intel Advisories Blog */}
        <Card className="p-4 sm:p-5 md:p-6 border border-border-subtle flex flex-col gap-4 bg-bg-secondary/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-accent-cyan" />
            <h2 className="text-sm font-display font-bold text-text-primary">Educational Advisories</h2>
          </div>

          <div className="h-[1px] bg-border-subtle w-full" />

          <div className="flex flex-col gap-4 overflow-y-auto h-[300px] pr-1">
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
