import { useState } from 'react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { 
  Terminal, ShieldCheck, Key, Mail, Lock, Info, 
  Check, AlertTriangle, RefreshCw, Search
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

  // JWT Decoder State
  const [jwtInput, setJwtInput] = useState('eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNlbnRpbmVsIEFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.');

  const base64UrlDecode = (str) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid Base64URL string');
      }
      base64 += new Array(5 - pad).join('=');
    }
    return atob(base64);
  };

  const decodeTokenPart = (str) => {
    const decoded = base64UrlDecode(str);
    try {
      return decodeURIComponent(
        decoded
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return decoded;
    }
  };

  const parseJwt = (token) => {
    if (!token) return { header: null, payload: null, error: '' };
    const parts = token.split('.');
    if (parts.length < 2 || parts.length > 3) {
      return { header: null, payload: null, error: 'Invalid JWT format. Must contain segments separated by dots (header.payload.signature).' };
    }

    try {
      const decodedHeader = decodeTokenPart(parts[0]);
      const decodedPayload = decodeTokenPart(parts[1]);
      
      const headerObj = JSON.parse(decodedHeader);
      const payloadObj = JSON.parse(decodedPayload);

      return {
        header: headerObj,
        payload: payloadObj,
        error: ''
      };
    } catch (err) {
      return {
        header: null,
        payload: null,
        error: 'Failed to decode token segments. Please ensure it is a valid Base64URL encoded JSON string.'
      };
    }
  };

  const { header: jwtHeader, payload: jwtPayload, error: jwtError } = parseJwt(jwtInput);

  const getSecurityFlags = (header, payload) => {
    if (!header || !payload) return [];
    const flags = [];

    if (header.alg && header.alg.toLowerCase() === 'none') {
      flags.push({
        type: 'critical',
        title: 'Critical Vulnerability: Algorithm "none" Enabled',
        desc: 'The token specifies "none" as its signature algorithm. This allows attackers to forge tokens and bypass authorization checks entirely.'
      });
    }

    if ('exp' in payload) {
      const expTime = payload.exp * 1000;
      if (expTime < Date.now()) {
        flags.push({
          type: 'warning',
          title: 'Expired Token',
          desc: `The token expired on ${new Date(expTime).toLocaleString()}. Requests using this token should be rejected.`
        });
      }
    } else {
      flags.push({
        type: 'warning',
        title: 'Security Smell: No Expiration Claim',
        desc: 'The payload lacks an "exp" (expiration) claim. Without it, the token remains valid indefinitely, increasing the window of opportunity if compromised.'
      });
    }

    return flags;
  };

  const jwtFlags = getSecurityFlags(jwtHeader, jwtPayload);

  // Security Headers Analyzer State
  const [headersInput, setHeadersInput] = useState(
    "HTTP/2 200 OK\n" +
    "date: Sat, 01 Aug 2026 07:15:30 GMT\n" +
    "content-type: text/html; charset=UTF-8\n" +
    "server: nginx/1.18.0\n" +
    "x-powered-by: Express"
  );

  const parseHeaders = (rawText) => {
    const lines = rawText.split('\n');
    const headerMap = {};
    lines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.substring(0, idx).trim().toLowerCase();
        const val = line.substring(idx + 1).trim();
        headerMap[key] = val;
      }
    });
    return headerMap;
  };

  const SECURITY_HEADERS_CHECKLIST = [
    {
      name: 'Strict-Transport-Security',
      desc: 'Enforces secure HTTPS connections, preventing SSL stripping and credential sniffing.',
      required: true
    },
    {
      name: 'Content-Security-Policy',
      desc: 'Mitigates Cross-Site Scripting (XSS) and code injection by controlling approved resource origins.',
      required: true
    },
    {
      name: 'X-Frame-Options',
      desc: 'Defends against Clickjacking attacks by preventing browsers from rendering the page in frames.',
      required: true
    },
    {
      name: 'X-Content-Type-Options',
      desc: 'Prevents MIME-sniffing, forcing browsers to respect the Content-Type header declared by the server.',
      required: true
    },
    {
      name: 'Referrer-Policy',
      desc: 'Protects user privacy by controlling how much information is sent in the HTTP Referer header.',
      required: false
    },
    {
      name: 'Permissions-Policy',
      desc: 'Restricts the APIs and features (like camera, geolocation) that can be accessed in the document.',
      required: false
    }
  ];

  const getHeadersAnalysis = (rawText) => {
    if (!rawText.trim()) return { checklist: [], score: 0, total: 6 };
    const map = parseHeaders(rawText);
    let presentCount = 0;
    
    const checklist = SECURITY_HEADERS_CHECKLIST.map(hdr => {
      const isPresent = hdr.name.toLowerCase() in map;
      if (isPresent) presentCount++;
      return {
        ...hdr,
        present: isPresent,
        value: isPresent ? map[hdr.name.toLowerCase()] : null
      };
    });

    return {
      checklist,
      score: presentCount,
      total: SECURITY_HEADERS_CHECKLIST.length
    };
  };

  const { checklist: headersChecklist, score: headersScore, total: headersTotal } = getHeadersAnalysis(headersInput);

  const getScoreBadge = (score, total) => {
    const ratio = score / total;
    if (ratio === 1) return { label: 'FULLY SECURED', color: 'text-status-success bg-status-success/15 border-status-success/20' };
    if (ratio >= 0.5) return { label: 'PARTIALLY HARDENED', color: 'text-status-warning bg-status-warning/15 border-status-warning/20' };
    return { label: 'CRITICAL / UNPROTECTED', color: 'text-status-critical bg-status-critical/15 border-status-critical/20' };
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-6 glassmorphism rounded-card border border-border-subtle relative overflow-hidden">
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
            onClick={() => setActiveTab('jwt')}
            className={`px-4 py-3 rounded-btn border text-left shrink-0 transition-all cursor-pointer ${
              activeTab === 'jwt'
                ? 'bg-bg-tertiary border-status-warning text-status-warning shadow-[0_0_8px_rgba(251,191,36,0.15)] font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
            }`}
          >
            JWT Decoder
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-3 rounded-btn border text-left shrink-0 transition-all cursor-pointer ${
              activeTab === 'headers'
                ? 'bg-bg-tertiary border-status-warning text-status-warning shadow-[0_0_8px_rgba(251,191,36,0.15)] font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40'
            }`}
          >
            Security Headers Analyzer
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
          <Card className="p-5 md:p-6 border border-border-subtle relative min-h-[400px] flex flex-col justify-between">
            
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

            {/* JWT Decoder */}
            {activeTab === 'jwt' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-text-primary">JWT Decoder</h2>
                    <p className="text-[11px] font-ui text-text-secondary">Decode and inspect JSON Web Tokens for security issues.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-border-subtle w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="jwt-input" className="font-mono text-xs text-text-muted font-semibold">JWT STRING TO DECODE</label>
                      <textarea
                        id="jwt-input"
                        rows="6"
                        value={jwtInput}
                        onChange={(e) => setJwtInput(e.target.value)}
                        placeholder="eyJhbGciOi..."
                        className="bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan font-mono text-text-primary resize-none h-[120px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 p-3 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn">
                      <span className="font-mono text-[10px] text-text-muted">DECODED HEADER</span>
                      {jwtError ? (
                        <div className="p-3 bg-status-critical/5 border border-status-critical/20 rounded-btn font-mono text-xs text-status-critical flex items-center gap-2 mt-1">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{jwtError}</span>
                        </div>
                      ) : (
                        <pre className="mt-1 p-2.5 bg-bg-primary/60 border border-border-subtle/30 rounded-btn font-mono text-[11px] text-accent-cyan overflow-x-auto max-h-[120px]">
                          {jwtHeader ? JSON.stringify(jwtHeader, null, 2) : 'No token header'}
                        </pre>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 p-3 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn">
                      <span className="font-mono text-[10px] text-text-muted">DECODED PAYLOAD</span>
                      {jwtError ? (
                        <div className="p-3 bg-status-critical/5 border border-status-critical/20 rounded-btn font-mono text-xs text-status-critical flex items-center gap-2 mt-1">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{jwtError}</span>
                        </div>
                      ) : (
                        <pre className="mt-1 p-2.5 bg-bg-primary/60 border border-border-subtle/30 rounded-btn font-mono text-[11px] text-accent-cyan overflow-x-auto max-h-[160px]">
                          {jwtPayload ? JSON.stringify(jwtPayload, null, 2) : 'No token payload'}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>

                {!jwtError && jwtHeader && jwtPayload && (
                  <div className="flex flex-col gap-2 mt-2 p-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn">
                    <span className="text-[10px] font-mono text-text-muted">SECURITY FLAGS DETECTED:</span>
                    {jwtFlags.length > 0 ? (
                      <div className="flex flex-col gap-2.5 mt-1.5">
                        {jwtFlags.map((flag, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start text-xs leading-normal">
                            <div className="mt-0.5 shrink-0">
                              {flag.type === 'critical' ? (
                                <Badge status="critical" className="text-[8px] uppercase tracking-wider font-mono">Critical</Badge>
                              ) : (
                                <Badge status="warning" className="text-[8px] uppercase tracking-wider font-mono">Warning</Badge>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-text-primary font-mono text-[11px]">{flag.title}</span>
                              <span className="text-text-secondary mt-0.5 text-[11px]">{flag.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-status-success font-ui font-semibold mt-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>No obvious issues detected in token structure. Note: Cryptographic signature validation requires key access.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Security Headers Analyzer */}
            {activeTab === 'headers' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-status-warning/10 border border-status-warning/20 rounded-btn text-status-warning">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-text-primary">Security Headers Analyzer</h2>
                    <p className="text-[11px] font-ui text-text-secondary">Paste HTTP response headers to check for missing security protections.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-border-subtle w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="headers-input" className="font-mono text-xs text-text-muted font-semibold">PASTE HTTP RESPONSE HEADERS</label>
                      <textarea
                        id="headers-input"
                        rows="10"
                        value={headersInput}
                        onChange={(e) => setHeadersInput(e.target.value)}
                        placeholder="HTTP/2 200 OK&#10;Content-Security-Policy: default-src 'self'..."
                        className="bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan font-mono text-text-primary resize-none h-[220px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                    {!headersInput.trim() ? (
                      <div className="h-full flex flex-col justify-center items-center py-12 text-center text-xs font-mono text-text-muted border border-dashed border-border-subtle/50 rounded-btn">
                        <Info className="w-5 h-5 mb-2 text-text-muted animate-pulse" />
                        <span>Paste raw HTTP headers to begin analysis</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="p-3 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn flex items-center justify-between font-mono text-xs">
                          <span className="text-text-secondary">SECURITY HEADERS PROFILE:</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-btn border text-[10px] font-bold ${getScoreBadge(headersScore, headersTotal).color}`}>
                              {getScoreBadge(headersScore, headersTotal).label}
                            </span>
                            <span className="font-bold text-text-primary">{headersScore} / {headersTotal}</span>
                          </div>
                        </div>

                        {headersChecklist.map((hdr) => (
                          <div 
                            key={hdr.name} 
                            className={`p-3 bg-bg-secondary/20 border rounded-btn flex flex-col gap-1 transition-colors ${
                              hdr.present 
                                ? 'border-status-success/20 hover:border-status-success/40' 
                                : hdr.required 
                                  ? 'border-status-critical/20 hover:border-status-critical/40' 
                                  : 'border-status-warning/20 hover:border-status-warning/40'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-mono text-xs font-bold text-text-primary">{hdr.name}</span>
                                <span className="text-[10px] text-text-muted font-ui leading-tight">{hdr.desc}</span>
                              </div>
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-btn border font-bold shrink-0 ${
                                hdr.present 
                                  ? 'bg-status-success/10 border-status-success/20 text-status-success' 
                                  : hdr.required 
                                    ? 'bg-status-critical/10 border-status-critical/20 text-status-critical' 
                                    : 'bg-status-warning/10 border-status-warning/20 text-status-warning'
                              }`}>
                                {hdr.present ? 'SECURED' : 'MISSING'}
                              </span>
                            </div>
                            {hdr.present && hdr.value && (
                              <div className="mt-1.5 p-1.5 bg-bg-primary/50 border border-border-subtle/20 rounded-btn font-mono text-[9.5px] text-accent-cyan break-all">
                                Value: {hdr.value}
                              </div>
                            )}
                          </div>
                        ))}
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

    </div>
  );
}
