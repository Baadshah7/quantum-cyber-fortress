/**
 * @typedef {'standby' | 'available' | 'locked' | 'active' | 'maintenance' | 'classified' | 'completed' | 'coming-online'} LabStatus
 */

/**
 * @typedef {Object} Lab
 * @property {string} id - Unique identifier for the lab
 * @property {string} category - Lab category (e.g. Analysis, Network, Linux)
 * @property {string} icon - Lucide icon name string matching iconMap keys
 * @property {string} title - Main title of the lab
 * @property {string} description - Summary of what the lab covers
 * @property {LabStatus} status - Operational status of the simulator
 * @property {string} clearance - Required clearance level
 * @property {string} difficulty - Difficulty label (supports range like "Easy → Medium")
 * @property {string} duration - Estimated time required
 * @property {string} [futureRoute] - Route mapping for future interactive states
 * @property {boolean} [locked] - Explicit lock state override
 * @property {number} [progress] - Progress percent indicator (0-100)
 * @property {number} [estimatedModules] - Number of modules for future expansions
 * @property {string} accentColor - Tailwind color token class/key (e.g., 'accent-violet', 'accent-cyan')
 * @property {Object} metadata - Embedded audit details
 * @property {string} metadata.classification - Security classification (e.g. 'Internal')
 * @property {string} metadata.version - Calibration version
 * @property {string} metadata.environment - Hosting environment
 * @property {string} [metadata.lastCalibrated] - Timestamp of last calibration check
 */
export {};
