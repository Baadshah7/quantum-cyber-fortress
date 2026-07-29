/** @type {import('./types').Lab[]} */
export const labsData = [
  {
    id: 'log-analysis',
    category: 'Analysis',
    icon: 'Activity',
    title: 'Log Analysis Lab',
    description: 'Inspect Linux auth logs, investigate unauthorized sudo attempts, reconstruct attacker timelines, correlate suspicious login activity.',
    status: 'standby',
    clearance: 'Level II',
    difficulty: 'Intermediate',
    duration: '20 min',
    accentColor: 'accent-violet',
    metadata: {
      classification: 'Internal',
      version: 'v1.0',
      environment: 'Sandbox',
      lastCalibrated: '2026.07.29'
    }
  },
  {
    id: 'packet-sandbox',
    category: 'Network',
    icon: 'Network',
    title: 'Packet Exercise Sandbox',
    description: 'Analyze PCAP captures, inspect protocol conversations, recover transferred files, detect cleartext credentials.',
    status: 'standby',
    clearance: 'Level II',
    difficulty: 'Intermediate',
    duration: '30 min',
    accentColor: 'accent-cyan',
    metadata: {
      classification: 'Internal',
      version: 'v1.0',
      environment: 'Sandbox',
      lastCalibrated: '2026.07.29'
    }
  },
  {
    id: 'cli-challenges',
    category: 'Linux',
    icon: 'Terminal',
    title: 'CLI Challenges',
    description: 'Navigate restricted Linux environments, locate hidden files, manipulate permissions, complete command-line investigations.',
    status: 'standby',
    clearance: 'Level II',
    difficulty: 'Easy → Medium',
    duration: '25 min',
    accentColor: 'status-success',
    metadata: {
      classification: 'Internal',
      version: 'v1.0',
      environment: 'Virtual SOC',
      lastCalibrated: '2026.07.29'
    }
  },
  {
    id: 'security-quizzes',
    category: 'Theory',
    icon: 'BookOpen',
    title: 'Security Quizzes',
    description: 'Validate understanding of cryptography, networking fundamentals, authentication, and incident response methodology.',
    status: 'standby',
    clearance: 'Level II',
    difficulty: 'Easy',
    duration: '15 min',
    accentColor: 'accent-violet',
    metadata: {
      classification: 'Internal',
      version: 'v1.0',
      environment: 'Sandbox',
      lastCalibrated: '2026.07.29'
    }
  },
  {
    id: 'terminal-simulations',
    category: 'System',
    icon: 'Server',
    title: 'Terminal Simulations',
    description: 'Interact with simulated Linux servers, identify outdated packages, patch vulnerabilities, validate secure configurations.',
    status: 'standby',
    clearance: 'Level II',
    difficulty: 'Advanced',
    duration: '35 min',
    accentColor: 'status-critical',
    metadata: {
      classification: 'Internal',
      version: 'v1.0',
      environment: 'Virtual SOC',
      lastCalibrated: '2026.07.29'
    }
  }
];
