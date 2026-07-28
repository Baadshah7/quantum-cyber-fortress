import { useState } from 'react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Modal } from '@/design-system/components/Modal';
import { Button } from '@/design-system/components/Button';
import { 
  BookOpen, Globe, Key, Terminal, AlertTriangle, UserCheck, 
  Bug, Mail, HardDrive, ShieldAlert, FileText, Activity, 
  ArrowRight, CheckCircle2, ChevronRight 
} from 'lucide-react';

const TOPICS = [
  {
    id: 'networking',
    name: 'Networking',
    icon: Globe,
    color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    description: 'IP protocols, TCP/UDP, DNS routing, and firewall basics.',
    summary: 'Networking forms the bedrock of cybersecurity. Defenders must understand how computers establish connections, route data packets, translate domain names, and construct perimeter barriers to filter unauthorized traffic.',
    syllabus: ['Introduction to OSI Model', 'IP Addressing & Subnetting', 'TCP vs UDP Data Streams', 'DNS Resolution Process', 'Configuring Stateful Firewalls'],
    checklist: ['Identify local network interfaces', 'Scan network open ports with nmap', 'Inspect packets using Wireshark filters']
  },
  {
    id: 'cryptography',
    name: 'Cryptography',
    icon: Key,
    color: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
    description: 'Symmetric vs asymmetric keys, hashing algorithms, and SSL/TLS.',
    summary: 'Cryptography provides mathematical confidentiality and integrity. Defenders use ciphers to hide sensitive files, secure communication channels using asymmetric signatures, and prove data integrity using one-way hashing algorithms.',
    syllabus: ['History of Ciphers', 'Symmetric Cryptography (AES, DES)', 'Asymmetric Cryptography (RSA, ECC)', 'Hashing Functions (SHA-256, bcrypt)', 'SSL/TLS Handshake Protocol'],
    checklist: ['Understand key length vs safety', 'Generate local public/private keypairs', 'Verify checksums of downloaded packages']
  },
  {
    id: 'linux',
    name: 'Linux Administration',
    icon: Terminal,
    color: 'text-status-warning bg-status-warning/10 border-status-warning/20',
    description: 'File permissions, CLI navigation, and shell scripting security.',
    summary: 'Linux powers the vast majority of server infrastructure and security tooling. Mastering shell navigation, file ownership structures, process execution, and system service hardening is fundamental to security administration.',
    syllabus: ['Linux File Hierarchy Standard', 'Essential Command Line Shell Tools', 'Managing User Permissions & chmod', 'Bash Shell Scripting & Automation', 'Securing Linux Boot & SSH Configuration'],
    checklist: ['Configure SSH to disable password log-in', 'Inspect active cron tasks for anomalies', 'Configure file access permissions (rwx)']
  },
  {
    id: 'owasp',
    name: 'OWASP Top 10',
    icon: AlertTriangle,
    color: 'text-status-critical bg-status-critical/10 border-status-critical/20',
    description: 'SQL Injection, XSS, CSRF, and broken access control mitigations.',
    summary: 'The Open Web Application Security Project (OWASP) lists the most critical security risks facing web applications. Resolving these risks requires secure coding practices, automated source scanning, and strict input validation.',
    syllabus: ['Broken Access Control Mechanisms', 'Cryptographic Failures & Leaks', 'Injection Vulnerabilities (SQLi, Command)', 'Insecure Web Application Design', 'Security Misconfigurations'],
    checklist: ['Sanitize all system command inputs', 'Implement content security policies (CSP)', 'Use parameterized SQL statements']
  },
  {
    id: 'auth',
    name: 'Authentication & Authorization',
    icon: UserCheck,
    color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    description: 'OAuth2, JWT tokens, MFA, and RBAC vs ABAC models.',
    summary: 'Authentication verifies who you are, while authorization establishes what you can do. Modern secure identity management relies on secure cryptographic tokens, token lifecycle revocation policies, and robust multi-factor verification.',
    syllabus: ['AuthN vs AuthZ Frameworks', 'Multi-Factor Authentication Methods', 'OAuth 2.0 & OpenID Connect Protocols', 'JSON Web Token (JWT) Security', 'Role-Based (RBAC) & Attribute-Based Access Control'],
    checklist: ['Enforce MFA for user logins', 'Validate signatures of JWT tokens', 'Audit user permission groups']
  },
  {
    id: 'malware',
    name: 'Malware Analysis',
    icon: Bug,
    color: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
    description: 'Signature detection, heuristic analysis, and sandbox execution.',
    summary: 'Malware analysis dissects malicious software to understand its behavior, objectives, and signature patterns. Analysts trace network beacons, registry mutations, and process memory overrides to form defensive alerts.',
    syllabus: ['Static vs Dynamic Malware Analysis', 'Reverse Engineering basics (PE/ELF)', 'Analyzing Malware Signatures & Hashes', 'Behavioral Monitoring & Sandbox Environments', 'Trojan, Ransomware, & Rootkit Indicators'],
    checklist: ['Conduct analysis in isolated environments', 'Inspect registry modifications during run', 'Verify files against antivirus feeds (YARA)']
  },
  {
    id: 'phishing',
    name: 'Phishing Countermeasures',
    icon: Mail,
    color: 'text-status-warning bg-status-warning/10 border-status-warning/20',
    description: 'Email header inspection, domain spoofing, and social engineering.',
    summary: 'Phishing remains the primary initial access vector for security breaches. Organizations defend against phishing by implementing email verification protocols (SPF, DKIM, DMARC), analyzing attachments, and training users to identify links.',
    syllabus: ['Social Engineering Psychology', 'Parsing SMTP Email Headers', 'SPF, DKIM, and DMARC Verification', 'Detecting Spoofed Domains & Lookalikes', 'User Awareness Campaigns & Reporting'],
    checklist: ['Inspect raw SMTP headers for sender mismatches', 'Verify DMARC records for external senders', 'Analyze email attachments in virtual sandboxes']
  },
  {
    id: 'forensics',
    name: 'Digital Forensics',
    icon: HardDrive,
    color: 'text-status-critical bg-status-critical/10 border-status-critical/20',
    description: 'Log collection, memory dumps, and disk image analysis.',
    summary: 'Digital Forensics investigates incidents after a breach. Forensic examiners preserve evidence integrity, build attack timelines, and reconstruct system activities by analyzing operating system logs, disk storage, and volatile memory.',
    syllabus: ['Chain of Custody Principles', 'Creating Cryptographically Verified Disk Images', 'RAM Memory Dump Captures', 'Registry & File System Timeline Reconstruction', 'Carving Deleted Files from Metadata'],
    checklist: ['Compute hash of target drive before copy', 'Audit filesystem journals for deleted scripts', 'Capture active memory using dump tools']
  },
  {
    id: 'ir',
    name: 'Incident Response',
    icon: ShieldAlert,
    color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    description: 'Containment strategies, eradication procedures, and root cause analysis.',
    summary: 'Incident Response manages security breaches systematically to limit damage, restore operations quickly, and prevent future recurrences. Rapid detection, host isolation, malware eradication, and system restoration are the core steps.',
    syllabus: ['NIST Incident Response Lifecycle', 'Determining Scope & Severity', 'Containment Strategies (Network Isolation)', 'Threat Eradication & Backup Recovery', 'Post-Incident Reports & Root Cause Analysis'],
    checklist: ['Isolate infected hosts from network', 'Apply patches to vulnerable entry points', 'Draft lessons learned report']
  },
  {
    id: 'policies',
    name: 'Security Policies',
    icon: FileText,
    color: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
    description: 'Data retention, access control, and incident reporting guidelines.',
    summary: 'Security Policies dictate an organizations administrative guidelines. They set the rules for data protection, access hierarchies, and operational standards, ensuring legal compliance and reducing human error risks.',
    syllabus: ['Information Security Program Frameworks', 'Access Control & Password Requirements', 'Data Classification & Retention Policies', 'Incident Notification Timelines', 'Compliance Audits (ISO 27001, SOC 2)'],
    checklist: ['Enforce data shredding schedules', 'Review security clearance access logs', 'Verify compliance audits are up to date']
  },
  {
    id: 'cia',
    name: 'CIA Triad',
    icon: Activity,
    color: 'text-status-warning bg-status-warning/10 border-status-warning/20',
    description: 'Confidentiality, Integrity, and Availability principles.',
    summary: 'The CIA Triad forms the core framework for all security architectures. It balances Confidentiality (protecting secrets), Integrity (preventing unauthorized modifications), and Availability (ensuring systems remain accessible to valid users).',
    syllabus: ['Core Security Goals', 'Confidentiality (Encryption, Access Controls)', 'Integrity (Hashing, Version Control)', 'Availability (Redundancy, Backups, High Availability)', 'Balancing Security with Usability'],
    checklist: ['Implement database backup replication', 'Encrypt database records at rest', 'Establish file checksum protocols']
  }
];

export default function PlaceholderAcademy() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleOpenModal = (topic) => {
    setSelectedTopic(topic);
  };

  const handleCloseModal = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-8 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glassmorphism rounded-card border border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-violet/15 rounded-btn text-accent-violet border border-accent-violet/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Academy Chamber
            </h1>
            <p className="text-xs font-ui text-text-secondary mt-1">
              Primary Learning Hub // Cybersecurity Defenses & Methodologies
            </p>
          </div>
        </div>
        <div className="flex gap-4 font-mono text-[10px]">
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn">
            <span className="text-text-muted">MODULES SYNCED</span>
            <span className="text-accent-cyan font-bold text-sm mt-0.5">11/11</span>
          </div>
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn">
            <span className="text-text-muted">CLEARANCE</span>
            <span className="text-status-success font-bold text-sm mt-0.5">LEVEL 1</span>
          </div>
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => {
          const IconComp = topic.icon;
          return (
            <Card 
              key={topic.id}
              glowHover={true}
              onClick={() => handleOpenModal(topic)}
              className="p-6 flex flex-col justify-between border border-border-subtle group hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-btn border ${topic.color} flex items-center justify-center`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <Badge variant="cyan" className="text-[9px]">Syllabus Available</Badge>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-display font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs font-ui text-text-secondary leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/30 flex justify-between items-center text-xs font-mono">
                <span className="text-text-muted">Syllabus Items: {topic.syllabus.length}</span>
                <span className="inline-flex items-center gap-0.5 text-accent-cyan font-semibold group-hover:underline">
                  INSPECT MODULE <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={selectedTopic !== null}
        onClose={handleCloseModal}
        title={selectedTopic ? `Module: ${selectedTopic.name}` : ''}
        className="max-w-xl"
        footer={
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleCloseModal}
            className="font-mono text-xs"
          >
            DISMISS BRIEFING
          </Button>
        }
      >
        {selectedTopic && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-btn border ${selectedTopic.color} flex items-center justify-center`}>
                {(() => {
                  const ModalIcon = selectedTopic.icon;
                  return <ModalIcon className="w-5 h-5" />;
                })()}
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent-cyan tracking-wider uppercase block">Core Concept Summary</span>
                <p className="text-xs text-text-primary font-medium mt-0.5">Defensive Study Syllabus</p>
              </div>
            </div>

            <div className="h-[1px] bg-border-subtle w-full" />

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">Overview Summary</span>
              <p className="text-xs text-text-secondary leading-relaxed font-ui">
                {selectedTopic.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">Syllabus Topics</span>
                <ul className="flex flex-col gap-1.5 font-ui">
                  {selectedTopic.syllabus.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary leading-tight">
                      <ArrowRight className="w-3 h-3 text-accent-violet shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">Defensive Checklist</span>
                <ul className="flex flex-col gap-1.5 font-ui">
                  {selectedTopic.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-bg-tertiary/40 border border-border-subtle rounded-btn flex items-center justify-between text-[10px] font-mono">
              <span className="text-text-muted">Interactive lessons status:</span>
              <Badge status="locked">Under Development</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
