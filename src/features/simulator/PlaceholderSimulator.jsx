import { useState } from 'react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { 
  Terminal, ShieldCheck, Play, Key, Mail, Lock, Info, 
  Check, AlertTriangle, RefreshCw, Eye, Search, Code 
} from 'lucide-react';

// Email Mock Data for Phishing Simulator
const PHISHING_EMAILS = [
  {
    id: 1,
    from: 'support@paypal-security-alert.com',
    to: 'sentinel@fortress.internal',
    subject: 'URGENT: Unauthorized Transaction Detected',
    body: 'Dear PayPal user, we detected an unauthorized transaction of $499.00 USD on your account. To dispute this charge and restore your account permissions, please click the secure link below within 24 hours:\n\n[http://paypal-restore-verify.net/dispute/charge]\n\nFailure to verify will lead to permanent account suspension.',
    isPhishing: true,
    flaggedDetails: 'Spoofed Domain: "paypal-restore-verify.net" instead of "paypal.com". Non-secure HTTP link. Artificial urgency ("within 24 hours"). Generic greeting ("Dear PayPal user").'
  },
  {
    id: 2,
    from: 'security@github.com',
    to: 'sentinel@fortress.internal',
    subject: '[GitHub] Security Alert: New SSH Key Added',
    body: 'A new SSH public key was added to your account. \n\nKey fingerprint: SHA256:d8c11f7c132890db02e1c94b7fcd88e910245a\n\nIf you added this key, no action is needed. If you did not recognize this key, please go to your settings to remove it:\n\nhttps://github.com/settings/keys',
    isPhishing: false,
    flaggedDetails: 'Legitimate Domain: "github.com" with HTTPS. Clear, non-threatening signature. Directing user to the official settings interface without urging credentials via a weird link.'
  },
  {
    id: 3,
    from: 'admin-support@google-login-security.net',
    to: 'sentinel@fortress.internal',
    subject: 'Critical Alert: Someone has your password!',
    body: 'Google Account Security Alert:\n\nSomeone recently tried to log in to your account from Moscow, Russia. We blocked this login attempt, but someone may have access to your password. You must change your password immediately by clicking below:\n\n[http://google-sec-auth.net/password-reset]\n\nSecure your connection now.',
    isPhishing: true,
    flaggedDetails: 'Spoofed Domain: "google-login-security.net" and "google-sec-auth.net" are spoof sites. Links use HTTP instead of Google\'s secure HTTPS. Urgent call to action based on fear.'
  }
];

// Inactive Labs for the Catalog
const LABS_CATALOG = [
  {
    name: 'Log Analysis Lab',
    desc: 'Audit raw server syslog streams, find unauthorized sudo attempts, and track intruder IP addresses.',
    category: 'Analysis'
  },
  {
    name: 'Packet Exercise Sandbox',
    desc: 'Parse PCAP network capture streams to extract transferred files and identify cleartext credentials.',
    category: 'Network'
  },
  {
    name: 'CLI Challenges',
    desc: 'Navigate restricted shells, find hidden files, and exploit file privileges to elevate access levels.',
    category: 'Linux'
  },
  {
    name: 'Security Quizzes',
    desc: 'Test your understanding of security standards, incident lifecycle phases, and cryptographic ciphers.',
    category: 'Theory'
  },
  {
    name: 'Terminal Simulations',
    desc: 'Interact with simulated shells modeling server systems to patch vulnerable software packages.',
    category: 'System'
  }
];

export default function PlaceholderSimulator() {
  const [activeTab, setActiveTab] = useState('password');

  // Password Analyzer State
  const [password, setPassword] = useState('');
  const evaluatePassword = (pwd) => {
    if (!pwd) return { score: 0, feedback: [] };
    const feedback = [];
    let score = 0;
    if (pwd.length >= 8) { score += 1; } else { feedback.push('Must be at least 8 characters long'); }
    if (/[A-Z]/.test(pwd)) { score += 1; } else { feedback.push('Add an uppercase letter'); }
    if (/[a-z]/.test(pwd)) { score += 1; } else { feedback.push('Add a lowercase letter'); }
    if (/[0-9]/.test(pwd)) { score += 1; } else { feedback.push('Add a numeric character'); }
    if (/[^A-Za-z0-9]/.test(pwd)) { score += 1; } else { feedback.push('Add a special character (e.g. @, #, $)'); }
    return { score, feedback };
  };
  const { score: pwdScore, feedback: pwdFeedback } = evaluatePassword(password);
  const getStrengthLabel = (score) => {
    if (score <= 1) return { label: 'CRITICAL / VERY WEAK', color: 'text-status-critical', bar: 'bg-status-critical w-1/5' };
    if (score === 2) return { label: 'WEAK', color: 'text-status-critical', bar: 'bg-status-critical w-2/5' };
    if (score === 3) return { label: 'MODERATE', color: 'text-status-warning', bar: 'bg-status-warning w-3/5' };
    if (score === 4) return { label: 'STRONG', color: 'text-accent-cyan', bar: 'bg-accent-cyan w-4/5' };
    return { label: 'SECURE / VERY STRONG', color: 'text-status-success', bar: 'bg-status-success w-full' };
  };
  const strength = getStrengthLabel(pwdScore);

  // Hash Identifier State
  const [hashInput, setHashInput] = useState('');
  const identifyHash = (h) => {
    const clean = h.trim();
    if (!clean) return 'Enter a hash to analyze.';
    if (/^[a-fA-F0-9]{32}$/.test(clean)) return 'MD5 Hash (128-bit, 32 hex characters). Weak cipher, susceptible to collision attacks.';
    if (/^[a-fA-F0-9]{40}$/.test(clean)) return 'SHA-1 Hash (160-bit, 40 hex characters). Deprecated, vulnerable to collision attacks.';
    if (/^[a-fA-F0-9]{64}$/.test(clean)) return 'SHA-256 Hash (256-bit, 64 hex characters). Secure, widely used for file integrity and SSL certificate signatures.';
    if (/^[a-fA-F0-9]{128}$/.test(clean)) return 'SHA-512 Hash (512-bit, 128 hex characters). High-security hashing standard, extremely secure.';
    return 'Unknown format. Please ensure it is hexadecimal and matches MD5 (32), SHA-1 (40), SHA-256 (64), or SHA-512 (128) length.';
  };
  const hashAnalysis = identifyHash(hashInput);

  // Caesar Cipher State
  const [caesarInput, setCaesarInput] = useState('VHQLWQLHO');
  const [caesarShift, setCaesarShift] = useState(3);
  const [caesarMode, setCaesarMode] = useState('decrypt');
  const processCaesar = (str, sh, mode) => {
    let shiftVal = parseInt(sh, 10);
    if (isNaN(shiftVal)) shiftVal = 0;
    if (mode === 'decrypt') shiftVal = 26 - (shiftVal % 26);
    return str.split('').map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shiftVal) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shiftVal) % 26) + 97);
      }
      return char;
    }).join('');
  };
  const caesarOutput = processCaesar(caesarInput, caesarShift, caesarMode);

  // Base64 State
  const [b64Input, setB64Input] = useState('UXVhbnR1bUN5YmVyRm9ydHJlc3M=');
  const [b64Mode, setB64Mode] = useState('decode');
  const processB64 = (str, mode) => {
    if (!str) return { result: '', err: '' };
    try {
      if (mode === 'decode') {
        return { result: atob(str), err: '' };
      } else {
        return { result: btoa(str), err: '' };
      }
    } catch {
      return { result: '', err: 'Invalid Base64 format or character sequence detected.' };
    }
  };
  const { result: b64Output, err: b64Error } = processB64(b64Input, b64Mode);

  // Phishing Simulator State
  const [emailIndex, setEmailIndex] = useState(0);
  const [emailFeedback, setEmailFeedback] = useState(null); // 'correct' | 'incorrect'
  const activeEmail = PHISHING_EMAILS[emailIndex];
  const handlePhishingDecision = (decision) => {
    const isPhishDecision = decision === 'phishing';
    if (isPhishDecision === activeEmail.isPhishing) {
      setEmailFeedback('correct');
    } else {
      setEmailFeedback('incorrect');
    }
  };
  const handleNextEmail = () => {
    setEmailFeedback(null);
    setEmailIndex((prev) => (prev + 1) % PHISHING_EMAILS.length);
  };

  return (
    <div className="flex-1 flex flex-col gap-8 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glassmorphism rounded-card border border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-status-warning/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-status-warning/15 rounded-btn text-status-warning border border-status-warning/20">
            <Terminal className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Training Yard
            </h1>
            <p className="text-xs font-ui text-text-secondary mt-1">
              Active Defensive Labs // Hands-on Cyber Attack Simulations
            </p>
          </div>
        </div>
        <div className="flex gap-4 font-mono text-[10px]">
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn">
            <span className="text-text-muted">ACTIVE SIMULATORS</span>
            <span className="text-accent-cyan font-bold text-sm mt-0.5">5/5 ONLINE</span>
          </div>
          <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle px-3 py-1.5 rounded-btn">
            <span className="text-text-muted">SIMULATION RANGE</span>
            <span className="text-status-success font-bold text-sm mt-0.5">SECURE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side Tab Navigation */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 font-mono text-xs">
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-3 rounded-btn border text-left shrink-0 transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-bg-tertiary border-status-warning text-status-warning shadow-[0_0_8px_rgba(251,191,36,0.15)] font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
            }`}
          >
            Password Analyzer
          </button>
          <button
            onClick={() => setActiveTab('hash')}
            className={`px-4 py-3 rounded-btn border text-left shrink-0 transition-all cursor-pointer ${
              activeTab === 'hash'
                ? 'bg-bg-tertiary border-status-warning text-status-warning shadow-[0_0_8px_rgba(251,191,36,0.15)] font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
            }`}
          >
            Hash Identifier
          </button>
          <button
            onClick={() => setActiveTab('caesar')}
            className={`px-4 py-3 rounded-btn border text-left shrink-0 transition-all cursor-pointer ${
              activeTab === 'caesar'
                ? 'bg-bg-tertiary border-status-warning text-status-warning shadow-[0_0_8px_rgba(251,191,36,0.15)] font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
            }`}
          >
            Caesar Cipher
          </button>
          <button
            onClick={() => setActiveTab('base64')}
            className={`px-4 py-3 rounded-btn border text-left shrink-0 transition-all cursor-pointer ${
              activeTab === 'base64'
                ? 'bg-bg-tertiary border-status-warning text-status-warning shadow-[0_0_8px_rgba(251,191,36,0.15)] font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
            }`}
          >
            Base64 Transcoder
          </button>
          <button
            onClick={() => setActiveTab('phishing')}
            className={`px-4 py-3 rounded-btn border text-left shrink-0 transition-all cursor-pointer ${
              activeTab === 'phishing'
                ? 'bg-bg-tertiary border-status-warning text-status-warning shadow-[0_0_8px_rgba(251,191,36,0.15)] font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
            }`}
          >
            Phishing Inspector
          </button>
        </div>

        {/* Right Side Interactive Workspaces */}
        <div className="lg:col-span-3">
          <Card className="p-6 border border-border-subtle relative min-h-[400px] flex flex-col justify-between">
            
            {/* Password Analyzer */}
            {activeTab === 'password' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-text-primary">Password Strength Analyzer</h2>
                    <p className="text-[11px] font-ui text-text-secondary">Evaluate key password security criteria dynamically.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-border-subtle w-full" />

                <div className="flex flex-col gap-2.5">
                  <label htmlFor="pwd-input" className="font-mono text-xs text-text-muted">ENTER PASS PHRASE</label>
                  <input
                    id="pwd-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type password to evaluate..."
                    className="w-full bg-bg-primary/50 border border-border-subtle rounded-btn px-4 py-2.5 text-sm focus:outline-none focus:border-accent-cyan font-mono text-text-primary placeholder:text-text-muted"
                  />
                </div>

                {password && (
                  <div className="flex flex-col gap-4 p-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-text-secondary">STRENGTH RATING:</span>
                      <span className={`font-bold ${strength.color}`}>{strength.label}</span>
                    </div>

                    <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.bar}`} />
                    </div>

                    {pwdFeedback.length > 0 ? (
                      <div className="flex flex-col gap-1.5 mt-2">
                        <span className="text-[10px] font-mono text-text-muted">STRENGTH RECOMMENDATIONS:</span>
                        <ul className="flex flex-col gap-1">
                          {pwdFeedback.map((fb, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-text-secondary font-ui">
                              <AlertTriangle className="w-3.5 h-3.5 text-status-critical" />
                              <span>{fb}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-status-success font-ui font-semibold mt-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>This password meets all fortress complexity requirements.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hash Identifier */}
            {activeTab === 'hash' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-text-primary">Hash Type Identifier</h2>
                    <p className="text-[11px] font-ui text-text-secondary">Identify checksum structures for MD5, SHA-1, SHA-256, and SHA-512 hashes.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-border-subtle w-full" />

                <div className="flex flex-col gap-2.5">
                  <label htmlFor="hash-input" className="font-mono text-xs text-text-muted">PASTE CRYPTOGRAPHIC HASH</label>
                  <input
                    id="hash-input"
                    type="text"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
                    className="w-full bg-bg-primary/50 border border-border-subtle rounded-btn px-4 py-2.5 text-sm focus:outline-none focus:border-accent-cyan font-mono text-text-primary placeholder:text-text-muted"
                  />
                </div>

                {hashInput && (
                  <div className="p-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-text-muted">IDENTIFICATION ANALYSIS:</span>
                    <div className="flex gap-2.5 items-start text-xs font-mono text-text-secondary mt-1">
                      <Info className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                      <span>{hashAnalysis}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Caesar Cipher */}
            {activeTab === 'caesar' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-text-primary">Caesar Cipher Decoder</h2>
                    <p className="text-[11px] font-ui text-text-secondary">Decrypt shifts or encrypt text using shift-rotate algorithms.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-border-subtle w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="caesar-text" className="font-mono text-xs text-text-muted font-semibold">INPUT TEXT</label>
                      <input
                        id="caesar-text"
                        type="text"
                        value={caesarInput}
                        onChange={(e) => setCaesarInput(e.target.value)}
                        className="bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan font-mono text-text-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="caesar-shift" className="text-text-muted">SHIFT VALUE</label>
                        <input
                          id="caesar-shift"
                          type="number"
                          min="0"
                          max="25"
                          value={caesarShift}
                          onChange={(e) => setCaesarShift(parseInt(e.target.value, 10) || 0)}
                          className="bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 focus:outline-none focus:border-accent-cyan text-text-primary text-center"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="caesar-mode" className="text-text-muted">MODE</label>
                        <select
                          id="caesar-mode"
                          value={caesarMode}
                          onChange={(e) => setCaesarMode(e.target.value)}
                          className="bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2.5 focus:outline-none focus:border-accent-cyan text-text-primary"
                        >
                          <option value="decrypt">Decrypt</option>
                          <option value="encrypt">Encrypt</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn">
                    <span className="font-mono text-xs text-text-muted">PROCESSED TRANSCRIPTION</span>
                    <div className="flex-1 mt-2 p-3 bg-bg-primary/60 border border-border-subtle/30 rounded-btn font-mono text-sm text-accent-cyan break-all select-all min-h-[80px]">
                      {caesarOutput || 'No output'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Base64 Transcoder */}
            {activeTab === 'base64' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-text-primary">Base64 Transcoder</h2>
                    <p className="text-[11px] font-ui text-text-secondary">Encode and decode plain text or base64-encoded strings instantly.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-border-subtle w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="b64-input" className="font-mono text-xs text-text-muted font-semibold">INPUT STRING</label>
                      <textarea
                        id="b64-input"
                        rows="3"
                        value={b64Input}
                        onChange={(e) => setB64Input(e.target.value)}
                        className="bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan font-mono text-text-primary resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2 font-mono text-xs">
                      <span className="text-text-muted">TRANSCODE MODE</span>
                      <div className="flex gap-2">
                        <Button
                          variant={b64Mode === 'decode' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setB64Mode('decode')}
                          className="flex-1 font-semibold py-1.5"
                        >
                          Decode
                        </Button>
                        <Button
                          variant={b64Mode === 'encode' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setB64Mode('encode')}
                          className="flex-1 font-semibold py-1.5"
                        >
                          Encode
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn justify-between">
                    <span className="font-mono text-xs text-text-muted">TRANSCODED RESULT</span>
                    {b64Error ? (
                      <div className="flex-1 mt-2 p-3 bg-status-critical/5 border border-status-critical/20 rounded-btn font-mono text-xs text-status-critical flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{b64Error}</span>
                      </div>
                    ) : (
                      <div className="flex-1 mt-2 p-3 bg-bg-primary/60 border border-border-subtle/30 rounded-btn font-mono text-sm text-accent-cyan break-all select-all min-h-[80px]">
                        {b64Output || 'No output'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Phishing Inspector */}
            {activeTab === 'phishing' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-display font-bold text-text-primary">Phishing Mail Inspector</h2>
                      <p className="text-[11px] font-ui text-text-secondary">Analyze email headers and contents to classify threats.</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">EMAIL {emailIndex + 1} OF {PHISHING_EMAILS.length}</span>
                </div>

                <div className="h-[1px] bg-border-subtle w-full" />

                {/* Email Viewer */}
                <div className="flex flex-col border border-border-subtle rounded-btn overflow-hidden bg-bg-primary/30">
                  <div className="p-3 bg-bg-secondary/60 border-b border-border-subtle font-mono text-[11px] text-text-secondary flex flex-col gap-1">
                    <div><span className="text-text-muted">FROM:</span> {activeEmail.from}</div>
                    <div><span className="text-text-muted">TO:</span> {activeEmail.to}</div>
                    <div><span className="text-text-muted">SUBJECT:</span> {activeEmail.subject}</div>
                  </div>
                  <div className="p-4 font-ui text-xs text-text-primary leading-relaxed whitespace-pre-line bg-bg-primary/20 min-h-[120px]">
                    {activeEmail.body}
                  </div>
                </div>

                {emailFeedback === null ? (
                  <div className="flex gap-4 font-mono text-xs">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handlePhishingDecision('safe')}
                      className="flex-1 border-status-success/30 hover:bg-status-success/10 hover:border-status-success text-status-success font-semibold"
                    >
                      Safe Email
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handlePhishingDecision('phishing')}
                      className="flex-1 border-status-critical/30 hover:bg-status-critical/10 hover:border-status-critical text-status-critical font-semibold"
                    >
                      Phishing Attempt
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      {emailFeedback === 'correct' ? (
                        <>
                          <Check className="w-5 h-5 text-status-success" />
                          <span className="font-mono text-xs font-bold text-status-success">CORRECT THREAT ESTIMATION</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-status-critical" />
                          <span className="font-mono text-xs font-bold text-status-critical">INCORRECT THREAT ESTIMATION</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary font-ui leading-normal">
                      <strong className="text-text-primary">Analysis details: </strong>
                      {activeEmail.flaggedDetails}
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleNextEmail}
                      className="w-fit font-semibold font-mono text-[10px] mt-2"
                      icon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                      NEXT EMAIL EXERCISE
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-border-subtle/50 text-[10px] font-mono text-text-muted flex justify-between">
              <span>SANDBOX ENVIRONMENT // ZERO RISK</span>
              <span>FORTRESS SECURITY TEAM REGISTERED</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Catalog of other labs */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold tracking-widest text-accent-cyan uppercase">
            LABS CATALOG
          </span>
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Advanced Security Simulation Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LABS_CATALOG.map((lab) => (
            <Card key={lab.name} className="p-5 border border-border-subtle flex flex-col justify-between bg-bg-secondary/30">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Badge variant="default" className="text-[9px] font-mono">{lab.category}</Badge>
                  <Badge status="locked" className="text-[9px]">Simulation Standby</Badge>
                </div>
                <h3 className="text-sm font-display font-bold text-text-primary mt-1">{lab.name}</h3>
                <p className="text-xs font-ui text-text-secondary leading-normal">{lab.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle/20 flex justify-end">
                <span className="text-[9px] font-mono text-text-muted uppercase">Clearance Lvl 2 Required</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
