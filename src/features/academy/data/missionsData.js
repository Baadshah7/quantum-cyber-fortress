// Database config for the 8 Divisions
export const divisionsData = [
  {
    id: 'div01',
    name: 'Network Operations',
    shortName: 'NetOps',
    description: 'Establish perimeter security. Analyze data packet structures, configure firewall rules, and detect active port scans.',
    estimatedHours: '1.2 Hours',
    difficulty: 2 // threat-level dots (1-5)
  },
  {
    id: 'div02',
    name: 'Identity & Access Control',
    shortName: 'IdAM',
    description: 'Govern access privileges. Implement multi-factor validation protocols, audit JWT authorization tokens, and configure headers.',
    estimatedHours: '1.5 Hours',
    difficulty: 3
  },
  {
    id: 'div03',
    name: 'Cryptography',
    shortName: 'Crypto',
    description: 'Secure data transit. Distinguish symmetric key pairs, parse cipher rotations, and verify digital hashes.',
    estimatedHours: '2.0 Hours',
    difficulty: 4
  },
  {
    id: 'div04',
    name: 'Linux Operations',
    shortName: 'LinuxOps',
    description: 'Harden server systems. Audit command configurations, govern user file permissions, and restrict SSH parameters.',
    estimatedHours: '1.8 Hours',
    difficulty: 3
  },
  {
    id: 'div05',
    name: 'Blue Team Operations',
    shortName: 'BlueOps',
    description: 'Mitigate system breaches. Implement the CIA Triad controls, construct disaster backup plans, and contain infection routes.',
    estimatedHours: '1.0 Hours',
    difficulty: 2
  },
  {
    id: 'div06',
    name: 'Threat Intelligence',
    shortName: 'ThreatIntel',
    description: 'Audit adversary movements. Analyze live CVE database advisories, parse raw syslogs, and identify malicious host IPs.',
    estimatedHours: '1.4 Hours',
    difficulty: 4
  },
  {
    id: 'div07',
    name: 'Web Security',
    shortName: 'WebSec',
    description: 'Defend web endpoints. Neutralize SQL Injection queries, patch XSS input nodes, and deploy CORS headers.',
    estimatedHours: '2.2 Hours',
    difficulty: 5
  },
  {
    id: 'div08',
    name: 'Digital Forensics',
    shortName: 'Forensics',
    description: 'Preserve post-breach files. Capture RAM memory dumps, reconstruct log timelines, and verify checksum signatures.',
    estimatedHours: '1.6 Hours',
    difficulty: 4
  }
];

// 40 Missions Database conforming to the Schema Spec
export const missionsData = [
  // ==================== DIVISION 01: NETWORK OPERATIONS ====================
  {
    id: 'm-div01-01',
    divisionId: 'div01',
    order: 1,
    title: 'Port Security Auditing',
    difficulty: 2,
    estimatedMinutes: 15,
    xpReward: 100,
    brief: {
      hook: 'An external port sweep was detected from an unidentified network scanner.',
      context: 'Initialize the radar diagnostics tool and identify open communication ports on local server hosts to shut down unnecessary access paths.'
    },
    objectives: [
      'Locate and sweep network IP addresses for open ports',
      'Identify unencrypted port protocols (e.g. Telnet, HTTP)',
      'Confirm the closing of insecure ports to prevent reconnaissance'
    ],
    conceptBlocks: [
      {
        type: 'iconList',
        title: 'Common Network Port Protocols',
        data: [
          { label: 'Port 22 (SSH)', desc: 'Secure Shell for encrypted remote terminal access.' },
          { label: 'Port 23 (Telnet)', desc: 'Deprecated cleartext remote shell protocol. High security risk.' },
          { label: 'Port 80 (HTTP)', desc: 'Cleartext web communication protocol. Should be redirected to HTTPS.' }
        ]
      }
    ],
    realWorldExample: 'Attackers scan targets using tools like Nmap to find open ports. Leaving Port 23 (Telnet) open allows attackers to sniff administrator credentials in transit and execute commands.',
    widget: {
      type: 'port-sweep',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'Which of the following port configurations represents the highest security risk?',
          options: [
            'Port 22 (SSH) open with key-based authentication',
            'Port 23 (Telnet) open for system administration',
            'Port 443 (HTTPS) open for web traffic'
          ],
          answerIdx: 1,
          explanation: 'Telnet transmits all packets (including usernames and passwords) in cleartext, enabling credential sniffing.'
        },
        {
          q: 'What is the primary purpose of an adversary executing a port sweep?',
          options: [
            'To download large database backups',
            'To discover open entry points and active protocols on the network',
            'To encrypt server files with ransomware'
          ],
          answerIdx: 1,
          explanation: 'Port sweeps map out the host network to identify vulnerable active services.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 01
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div01-0${o}`,
    divisionId: 'div01',
    order: o,
    title: o === 2 ? 'Firewall Rule Configuration' : o === 3 ? 'DNS Poisoning Defense' : o === 4 ? 'Packet Capture Analysis' : 'IDS/IPS Policy Auditing',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional network operational metrics require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Deploy network safeguards', 'Analyze data packet flow'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div01-0${o - 1}`]
  })),

  // ==================== DIVISION 02: IDENTITY & ACCESS CONTROL ====================
  {
    id: 'm-div02-01',
    divisionId: 'div02',
    order: 1,
    title: 'Authentication Protocols',
    difficulty: 3,
    estimatedMinutes: 20,
    xpReward: 150,
    brief: {
      hook: 'An unencrypted token was intercepted in transit during security operations.',
      context: 'Configure the authorization headers payload with the secure bearer token schema to establish credential validation.'
    },
    objectives: [
      'Format authorization HTTP headers correctly',
      'Distinguish between Basic and Bearer auth schemas',
      'Verify JWT signature verification protocols'
    ],
    conceptBlocks: [
      {
        type: 'stepFlow',
        title: 'OAuth2 Token Handshake Sequence',
        data: [
          'Client requests credentials authorization',
          'Auth server issues cryptographic access token',
          'Client sends token in Authorization header payload'
        ]
      }
    ],
    realWorldExample: 'API endpoints rely on the "Authorization: Bearer <token>" header format. Using incorrect syntax or transmitting plain passwords in headers results in failed requests or credential leaks.',
    widget: {
      type: 'auth-headers',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'Which header layout represents the standard for transmitting OAuth2 JWT tokens?',
          options: [
            'Authorization: Basic credentials_base64',
            'Authorization: Bearer jwt_token_string',
            'X-Auth-Token: raw_jwt_string'
          ],
          answerIdx: 1,
          explanation: 'Bearer authentication is the industry standard for transmitting JWT session tokens securely.'
        },
        {
          q: 'Why should Basic authentication be avoided over insecure channels?',
          options: [
            'Basic credentials are encrypted using AES-256 which is slow',
            'Basic credentials are base64-encoded and easily decoded if sniffed',
            'Basic auth headers require database synchronization on every keystroke'
          ],
          answerIdx: 1,
          explanation: 'Base64 is a encoding format, not encryption. Anyone intercepting the header can decode it instantly.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 02
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div02-0${o}`,
    divisionId: 'div02',
    order: o,
    title: o === 2 ? 'Multi-Factor Validation' : o === 3 ? 'Role-Based Access Controls' : o === 4 ? 'JWT Claims Verification' : 'Directory Service Audits',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional identity access controls require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Implement identity parameters', 'Verify token structures'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div02-0${o - 1}`]
  })),

  // ==================== DIVISION 03: CRYPTOGRAPHY ====================
  {
    id: 'm-div03-01',
    divisionId: 'div03',
    order: 1,
    title: 'Caesar Cipher Hardening',
    difficulty: 2,
    estimatedMinutes: 15,
    xpReward: 100,
    brief: {
      hook: 'Secured transmissions have been corrupted by historical ciphertext injection.',
      context: 'Analyze key characters and shift rotations in the Caesar Cipher Decoder to decrypt the message.'
    },
    objectives: [
      'Understand the principles of substitution ciphers',
      'Manually decrypt shift rotation patterns',
      'Evaluate why low-entropy key layouts fail validation checks'
    ],
    conceptBlocks: [
      {
        type: 'diagram',
        title: 'ROT13 Shift Illustration',
        data: 'A ➔ N | B ➔ O | C ➔ P | ... | M ➔ Z'
      }
    ],
    realWorldExample: 'The Caesar Cipher is a classic monoalphabetic substitution cipher. Because it only has 25 possible shifts, it is trivial to break via brute-force or frequency analysis.',
    widget: {
      type: 'caesar-decrypt',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'If the ciphertext is "KHOOR" and the shift is 3 (with decrypt mode), what is the plaintext?',
          options: [
            'HELLO',
            'WORLD',
            'ROBOT'
          ],
          answerIdx: 0,
          explanation: 'Shifting backwards by 3 from K, H, O, O, R gives H, E, L, L, O.'
        },
        {
          q: 'Why are substitution ciphers like the Caesar cipher obsolete in modern security?',
          options: [
            'They require too much computational power to encrypt',
            'They have a tiny key space and are vulnerable to frequency analysis',
            'They cannot be transmitted over fiber optic cables'
          ],
          answerIdx: 1,
          explanation: 'With only 25 valid key shifts, a computer can brute force the message instantly.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 03
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div03-0${o}`,
    divisionId: 'div03',
    order: o,
    title: o === 2 ? 'Symmetric Key Generation' : o === 3 ? 'Asymmetric Handshake' : o === 4 ? 'Hashing Algorithms' : 'Digital Signatures Validation',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional cryptographic parameters require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Deploy encryption schemas', 'Validate key pairs'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div03-0${o - 1}`]
  })),

  // ==================== DIVISION 04: LINUX OPERATIONS ====================
  {
    id: 'm-div04-01',
    divisionId: 'div04',
    order: 1,
    title: 'Linux Permissions Hardening',
    difficulty: 3,
    estimatedMinutes: 20,
    xpReward: 150,
    brief: {
      hook: 'System configuration sheets are exposed to read access by unauthorized users.',
      context: 'Apply file owner restrictions using standard chmod octal mask bits to secure server configurations.'
    },
    objectives: [
      'Identify Read, Write, and Execute permission flags',
      'Compute octal permission representations (e.g. 755, 600, 644)',
      'Establish owner-only read/write privileges on credentials files'
    ],
    conceptBlocks: [
      {
        type: 'iconList',
        title: 'Chmod Permission Bits Mapping',
        data: [
          { label: 'Read (r)', desc: 'Assigned value of 4.' },
          { label: 'Write (w)', desc: 'Assigned value of 2.' },
          { label: 'Execute (x)', desc: 'Assigned value of 1.' }
        ]
      }
    ],
    realWorldExample: 'Sensitive database credentials (like config.json) should be configured as 600 (owner read-write only) so other unprivileged system users cannot read password values.',
    widget: {
      type: 'chmod',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'What does the permission mask "644" signify in a Linux environment?',
          options: [
            'Owner can read/write, Group and Others can only read',
            'Everyone has read/write/execute permissions',
            'Owner has read/write/execute, Group can read, Others have no access'
          ],
          answerIdx: 0,
          explanation: '6 (4+2 = rw) for owner, 4 (read-only) for group, 4 (read-only) for others.'
        },
        {
          q: 'Which chmod command represents the correct owner-only read/write hardening for config files?',
          options: [
            'chmod 777 configuration.conf',
            'chmod 600 configuration.conf',
            'chmod 644 configuration.conf'
          ],
          answerIdx: 1,
          explanation: 'chmod 600 gives read-write permissions to the owner, and zero permissions to group and world.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 04
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div04-0${o}`,
    divisionId: 'div04',
    order: o,
    title: o === 2 ? 'SSH Daemon Security' : o === 3 ? 'Process Log Diagnostics' : o === 4 ? 'User Group Administration' : 'Cron Schedule Auditing',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional system configuration metrics require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Deploy server hardening configs', 'Manage Linux services'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div04-0${o - 1}`]
  })),

  // ==================== DIVISION 05: BLUE TEAM OPERATIONS ====================
  {
    id: 'm-div05-01',
    divisionId: 'div05',
    order: 1,
    title: 'CIA Triad Audit',
    difficulty: 1,
    estimatedMinutes: 10,
    xpReward: 50,
    brief: {
      hook: 'A database outage has caused operational denial of system availability.',
      context: 'Audit the infrastructure vulnerabilities and map defensive actions to Confidentiality, Integrity, and Availability.'
    },
    objectives: [
      'Define Confidentiality, Integrity, and Availability controls',
      'Categorize system security countermeasures',
      'Balance defensive priorities inside a simulated database scope'
    ],
    conceptBlocks: [
      {
        type: 'diagram',
        title: 'The CIA Triad Pillars',
        data: 'Confidentiality (Secrets Protection) | Integrity (Data Accuracy) | Availability (System Access)'
      }
    ],
    realWorldExample: 'SLA agreements require 99.9% availability, which is maintained through database backups and redundant server clusters. Passwords require cryptographic hashing to maintain data integrity.',
    widget: {
      type: 'cia-triad',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'Which of the following actions directly protects the "Integrity" pillar of the triad?',
          options: [
            'Implementing redundant backup databases',
            'Enforcing database records hashing and write-checksums',
            'Encrypting web communication routes using SSL/TLS'
          ],
          answerIdx: 1,
          explanation: 'Hashing ensures data has not been modified or corrupted, directly safeguarding integrity.'
        },
        {
          q: 'A DDoS attack on a web interface represents a breach of which triad pillar?',
          options: [
            'Confidentiality',
            'Integrity',
            'Availability'
          ],
          answerIdx: 2,
          explanation: 'DDoS attacks flood server capacity to block access for legitimate users, compromising Availability.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 05
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div05-0${o}`,
    divisionId: 'div05',
    order: o,
    title: o === 2 ? 'Infection Containment' : o === 3 ? 'Backup Schedule Planning' : o === 4 ? 'Vulnerability Scans' : 'Incident Lifecycle Management',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional incident response controls require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Deploy incident response policies', 'Establish backup frameworks'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div05-0${o - 1}`]
  })),

  // ==================== DIVISION 06: THREAT INTELLIGENCE ====================
  {
    id: 'm-div06-01',
    divisionId: 'div06',
    order: 1,
    title: 'Log Analysis Audit',
    difficulty: 3,
    estimatedMinutes: 20,
    xpReward: 150,
    brief: {
      hook: 'Unauthorized admin actions were logged during off-hours sessions.',
      context: 'Inspect the raw syslogs terminal database and extract the source IP address executing the attack vector.'
    },
    objectives: [
      'Locate login anomalies in raw server syslogs',
      'Identify attack origin IP addresses',
      'Understand how syslog configurations track adversary activities'
    ],
    conceptBlocks: [
      {
        type: 'stepFlow',
        title: 'Forensic Log Analysis Flow',
        data: [
          'Locate auth log entries (`/var/log/auth.log`)',
          'Filter by status flags (Failed, Login, Privilege Elevation)',
          'Extract unique target IPs executing commands'
        ]
      }
    ],
    realWorldExample: 'Defenders parse log streams using SIEM tools. Finding multiple "Failed password for root" lines followed by a successful login identifies a brute force breach.',
    widget: {
      type: 'log-inspector',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'What file path standard typically stores login and authorization logs on a Linux machine?',
          options: [
            '/var/log/auth.log',
            '/etc/ssh/ssh_config',
            '/usr/bin/syslog'
          ],
          answerIdx: 0,
          explanation: '/var/log/auth.log contains authentication logs, including ssh sessions and sudo calls.'
        },
        {
          q: 'Which syslog entry represents the highest threat indicator?',
          options: [
            'session opened for user sentinel',
            'session opened for root by (uid=0)',
            'Failed password for admin from 198.51.100.42 port 49223 ssh2'
          ],
          answerIdx: 2,
          explanation: 'Failed passwords from external IP addresses indicate credential scanning or brute force attacks.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 06
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div06-0${o}`,
    divisionId: 'div06',
    order: o,
    title: o === 2 ? 'CVE Advisory Inspection' : o === 3 ? 'Global Threat Matrix' : o === 4 ? 'Intel Feed Integration' : 'Malware Signature Analysis',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional threat intelligence feeds require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Evaluate external CVE feeds', 'Inspect network logs'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div06-0${o - 1}`]
  })),

  // ==================== DIVISION 07: WEB SECURITY ====================
  {
    id: 'm-div07-01',
    order: 1,
    divisionId: 'div07',
    title: 'SQL Injection Sanitizer',
    difficulty: 4,
    estimatedMinutes: 25,
    xpReward: 200,
    brief: {
      hook: 'Database tables were dumped through vulnerable form entry vectors.',
      context: 'Sanitize all dynamic web form queries to intercept SQL injection payloads before parsing requests.'
    },
    objectives: [
      'Identify SQL injection signature indicators (e.g. OR 1=1)',
      'Apply escape filters to dynamic database queries',
      'Implement parameterized database bindings'
    ],
    conceptBlocks: [
      {
        type: 'diagram',
        title: 'SQL Injection Block Diagram',
        data: 'Input Query: "admin\' OR \'1\'=\'1" ➔ Database query expands ➔ Bypasses Password Check'
      }
    ],
    realWorldExample: 'Input sanitization strips special characters like single quotes, while parameterized queries separate SQL commands from raw user data, rendering code injections harmless.',
    widget: {
      type: 'sqli-sanitize',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'Which string segment represents a classic SQL injection signature used to bypass logins?',
          options: [
            'username=admin&pass=123',
            '\' OR \'1\'=\'1',
            '<script>alert(1)</script>'
          ],
          answerIdx: 1,
          explanation: 'The OR "1"="1" segment creates a boolean condition that is always true, bypassing username/password lookups.'
        },
        {
          q: 'What is the most effective defense against SQL injection attacks?',
          options: [
            'Encrypting database table records',
            'Using parameterized queries / prepared statements',
            'Enforcing strong user account password rules'
          ],
          answerIdx: 1,
          explanation: 'Prepared statements treat user input strictly as data, never executing it as SQL commands.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 07
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div07-0${o}`,
    divisionId: 'div07',
    order: o,
    title: o === 2 ? 'Cross-Site Scripting Guard' : o === 3 ? 'CSRF Token Validation' : o === 4 ? 'CORS Origin Restricting' : 'Secure Cookies Setup',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional web security parameters require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Configure secure web headers', 'Inspect injection points'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div07-0${o - 1}`]
  })),

  // ==================== DIVISION 08: DIGITAL FORENSICS ====================
  {
    id: 'm-div08-01',
    divisionId: 'div08',
    order: 1,
    title: 'File Checksum Verification',
    difficulty: 2,
    estimatedMinutes: 15,
    xpReward: 100,
    brief: {
      hook: 'A compromised binary was distributed disguised as a system update.',
      context: 'Verify the SHA-256 checksums of incoming packages against the known secure master signature.'
    },
    objectives: [
      'Understand how hashing provides file integrity verification',
      'Inspect files for checksum differences',
      'Identify corrupted or modified software updates'
    ],
    conceptBlocks: [
      {
        type: 'iconList',
        title: 'Cryptographic Hashing Properties',
        data: [
          { label: 'Deterministic', desc: 'The same file always produces the exact same hash.' },
          { label: 'One-Way', desc: 'You cannot reconstruct the file contents from the hash value.' },
          { label: 'Collision Resistant', desc: 'No two different files should produce the same hash.' }
        ]
      }
    ],
    realWorldExample: 'Security operators publish SHA-256 hashes of download packages. Users run checksums on their downloaded files; if they match, the file has not been tampered with or modified.',
    widget: {
      type: 'hash-verifier',
      config: {}
    },
    quiz: {
      questions: [
        {
          q: 'If a single byte is changed in a 5GB file, what happens to its SHA-256 checksum?',
          options: [
            'The checksum remains the same, except for one character',
            'The checksum changes completely and unpredictably due to the avalanche effect',
            'The checksum increases in length by exactly 32 bits'
          ],
          answerIdx: 1,
          explanation: 'Cryptographic hash functions exhibit the avalanche effect, where a tiny input change results in a completely different output.'
        },
        {
          q: 'Which property describes a hash function\'s ability to resist generating the same hash value for two different files?',
          options: [
            'One-Way property',
            'Collision Resistance',
            'Determinism'
          ],
          answerIdx: 1,
          explanation: 'Collision resistance ensures it is computationally infeasible to find two distinct inputs that map to the same output hash.'
        }
      ],
      passThreshold: 2
    },
    unlockConditions: []
  },
  // Stubs for Division 08
  ...[2, 3, 4, 5].map(o => ({
    id: `m-div08-0${o}`,
    divisionId: 'div08',
    order: o,
    title: o === 2 ? 'Memory Dump Auditing' : o === 3 ? 'Timeline Reconstruction' : o === 4 ? 'Metadata Recovery' : 'Log Signature Verification',
    difficulty: o + 1 > 5 ? 5 : o + 1,
    estimatedMinutes: 15,
    xpReward: (o + 1 > 5 ? 5 : o + 1) * 50,
    brief: {
      hook: 'Additional forensics indicators require Sentinel validation.',
      context: 'Access to this system simulation channel is queued pending clearance approval.'
    },
    objectives: ['Audit system memory dumps', 'Rebuild attack timelines'],
    conceptBlocks: [],
    realWorldExample: 'Classified infrastructure parameters.',
    widget: { type: 'stub' },
    quiz: { questions: [{ q: 'Placeholder', options: ['A', 'B'], answerIdx: 0, explanation: 'Placeholder' }], passThreshold: 1 },
    unlockConditions: [`m-div08-0${o - 1}`]
  }))
];
