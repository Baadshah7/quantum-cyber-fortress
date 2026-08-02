export const fortressZones = [
  {
    name: 'Gate',
    icon: 'Shield',
    route: '/',
    description: 'The entrance checkpoint. Verify your credentials, establish your Sentinel identity, and sync system logs.',
    objective: 'Establish identity, initialize cryptographic link, and verify terminal credentials.',
    status: 'active'
  },
  {
    name: 'Academy',
    icon: 'BookOpen',
    route: '/academy',
    description: 'Acquire foundational security methodologies. Study defensive protocols, cryptography concepts, OWASP vulnerabilities, and security basics in a structured learning environment.',
    objective: 'Master core security domains: Networking, Cryptography, Linux, OWASP, Auth(N/Z), Malware, Forensics, IR, Policies, and CIA Triad.',
    status: 'active'
  },
  {
    name: 'Training Yard',
    icon: 'Terminal',
    route: '/simulator',
    description: 'Execute live defensive actions in sandboxed environments. Detect phishing payloads, test passwords, verify Caesar ciphers, and solve CLI challenges.',
    objective: 'Neutralize simulated threats via hands-on labs: Phishing, Passwords, Caesar Cipher, Hashing, Log Audits, and CLI.',
    status: 'active'
  },
  {
    name: 'Labs Portal',
    icon: 'FlaskConical',
    route: '/labs',
    description: "Apply everything you've learned inside realistic cybersecurity labs — forensic investigations, terminal challenges, packet analysis exercises, and hands-on security simulations.",
    objective: "Verify defensive security protocols and analyze system logs inside sandbox environments.",
    status: 'active'
  }
];

