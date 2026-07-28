import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Define the checks configuration
const CHECK_DEFS = [
  { id: 'secureContext', label: 'Secure Context', weight: 20, warnOnFail: false },
  { id: 'storageIntegrity', label: 'Storage Integrity', weight: 15, warnOnFail: true },
  { id: 'webglSandbox', label: 'WebGL Sandbox', weight: 15, warnOnFail: true },
  { id: 'hardwareTelemetry', label: 'Hardware Telemetry', weight: 15, warnOnFail: true },
  { id: 'networkStatus', label: 'Network Status', weight: 20, warnOnFail: false },
  { id: 'connectionQuality', label: 'Connection Quality', weight: 15, warnOnFail: true },
];

// Helper to run browser checks
const runBrowserChecks = () => {
  // 1. Secure Context
  const isSecure = window.isSecureContext;

  // 2. Storage Integrity (sessionStorage read/write/remove probe)
  let storageOk = false;
  try {
    const probeKey = '__fortress_probe__';
    sessionStorage.setItem(probeKey, 'active');
    const readVal = sessionStorage.getItem(probeKey);
    sessionStorage.removeItem(probeKey);
    storageOk = readVal === 'active';
  } catch (e) {
    storageOk = false;
  }

  // 3. WebGL Available
  let webglOk = false;
  try {
    const canvas = document.createElement('canvas');
    webglOk = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    webglOk = false;
  }

  // 4. Hardware Verified
  const concurrency = navigator.hardwareConcurrency || 0;
  const hardwareOk = typeof concurrency === 'number' && concurrency > 0;

  // 5. Network Active
  const onlineOk = navigator.onLine;

  // 6. Connection Quality
  let connOk = true;
  let effectiveType = 'unknown';
  if (navigator.connection) {
    effectiveType = navigator.connection.effectiveType || 'unknown';
    if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      connOk = false;
    }
  }

  return {
    secureContext: {
      pass: isSecure,
      readout: isSecure ? 'VERIFIED' : 'INSECURE (HTTP)',
    },
    storageIntegrity: {
      pass: storageOk,
      readout: storageOk ? 'OPERATIONAL' : 'BLOCKED',
    },
    webglSandbox: {
      pass: webglOk,
      readout: webglOk ? 'ACTIVE' : 'UNAVAILABLE',
    },
    hardwareTelemetry: {
      pass: hardwareOk,
      readout: hardwareOk ? `${concurrency} CORES` : 'UNVERIFIED',
    },
    networkStatus: {
      pass: onlineOk,
      readout: onlineOk ? 'ONLINE' : 'OFFLINE',
    },
    connectionQuality: {
      pass: connOk,
      readout: navigator.connection
        ? `${effectiveType.toUpperCase()}${connOk ? '' : ' (SLOW)'}`
        : 'LAN/WIFI',
    },
  };
};

// Custom animated counter component that respects prefers-reduced-motion
function AnimatedNumber({ value, duration = 700, reducedMotion }) {
  const [displayVal, setDisplayVal] = useState(value);
  const prevValRef = useRef(value);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayVal(value);
      prevValRef.current = value;
      return;
    }

    const start = prevValRef.current;
    const end = value;
    if (start === end) return;

    const startTime = performance.now();
    let frameId;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing: easeOutQuad
      const easeOutQuad = progress * (2 - progress);
      const current = Math.floor(start + (end - start) * easeOutQuad);
      
      setDisplayVal(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayVal(end);
        prevValRef.current = end;
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration, reducedMotion]);

  return <>{displayVal}</>;
}

export default function BrowserSecurityIndexPanel() {
  const { reducedMotion } = useReducedMotion();
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isRealOffline, setIsRealOffline] = useState(!navigator.onLine);
  
  // Scans state
  const [scanCycle, setScanCycle] = useState(1);
  const [isScanning, setIsScanning] = useState(true);
  const [revealedCount, setRevealedCount] = useState(0);
  const [checkResults, setCheckResults] = useState(() => runBrowserChecks());
  const [lastSync, setLastSync] = useState(() => new Date().toLocaleTimeString());
  
  // Score state
  const [currentScore, setCurrentScore] = useState(0);
  const [hasCriticalFail, setHasCriticalFail] = useState(false);
  
  // Reconnecting transition state
  const [isResyncing, setIsResyncing] = useState(false);

  // Derived offline state
  const isOffline = isRealOffline || isSimulatedOffline;

  // 1. Listen for real online/offline events (with cleanup)
  useEffect(() => {
    const handleOnline = () => {
      setIsRealOffline(false);
    };
    const handleOffline = () => {
      setIsRealOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Perform scan execution
  const performScan = useCallback(() => {
    if (isOffline) return;

    setIsScanning(true);
    setRevealedCount(0);
    
    // Run checks immediately to save values
    const results = runBrowserChecks();
    setCheckResults(results);

    // Calculate actual score from results
    let scoreSum = 0;
    let totalWeight = 0;
    let criticalFail = false;

    CHECK_DEFS.forEach((def) => {
      totalWeight += def.weight;
      const res = results[def.id];
      if (res.pass) {
        scoreSum += def.weight;
      } else {
        if (!def.warnOnFail) {
          criticalFail = true;
        } else {
          scoreSum += def.weight * 0.4; // 40% partial credit
        }
      }
    });

    const finalCalculated = Math.round((scoreSum / totalWeight) * 100);
    // Cap score at 45 if there's any critical failure
    const finalScore = criticalFail ? Math.min(finalCalculated, 45) : finalCalculated;

    // Set score and failures
    setCurrentScore(finalScore);
    setHasCriticalFail(criticalFail);
    setLastSync(new Date().toLocaleTimeString());

    // Trigger staggered reveal interval
    if (reducedMotion) {
      // Instantly reveal all if reduced motion is enabled
      setRevealedCount(CHECK_DEFS.length);
      setIsScanning(false);
    } else {
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep += 1;
        setRevealedCount(currentStep);
        if (currentStep >= CHECK_DEFS.length) {
          clearInterval(interval);
          setIsScanning(false);
        }
      }, 200);

      return interval;
    }
  }, [isOffline, reducedMotion]);

  // 3. Scan cycle loop (runs every 4 seconds)
  useEffect(() => {
    if (isOffline || isResyncing) return;

    // Perform initial scan
    const revealInterval = performScan();

    // Setup 4-second cycle interval
    const cycleInterval = setInterval(() => {
      setScanCycle((prev) => prev + 1);
      performScan();
    }, 4000);

    return () => {
      clearInterval(cycleInterval);
      if (revealInterval) clearInterval(revealInterval);
    };
  }, [isOffline, isResyncing, scanCycle, performScan]);

  // 4. Trigger resync when coming back online
  const prevOfflineRef = useRef(isOffline);
  useEffect(() => {
    if (prevOfflineRef.current && !isOffline) {
      // This means we transitioned from offline to online
      setIsResyncing(true);
      setRevealedCount(0);
      
      const resyncDuration = reducedMotion ? 0 : 1500;
      const timeout = setTimeout(() => {
        setIsResyncing(false);
        setScanCycle((prev) => prev + 1);
      }, resyncDuration);

      return () => clearTimeout(timeout);
    }
    prevOfflineRef.current = isOffline;
  }, [isOffline, reducedMotion]);

  // Calculate live state parameters based on progress and score
  const scoreToUse = isOffline
    ? Math.max(20, currentScore - 35) // offline penalty, floored at 20%
    : currentScore;

  // Determine current tier based on score and critical failures
  let tierLabel = 'TIER I · SECURE';
  let tierColor = 'var(--accent-cyan)';
  let textClass = 'text-accent-cyan';
  let borderClass = 'border-accent-cyan/20';

  if (isOffline || hasCriticalFail || scoreToUse < 50) {
    tierLabel = isOffline ? 'TIER IV · OFFLINE' : 'TIER IV · CRITICAL';
    tierColor = 'var(--status-critical)';
    textClass = 'text-status-critical';
    borderClass = 'border-status-critical/20';
  } else if (scoreToUse < 75) {
    tierLabel = 'TIER III · CAUTION';
    tierColor = 'var(--status-warning)';
    textClass = 'text-status-warning';
    borderClass = 'border-status-warning/20';
  } else if (scoreToUse < 90) {
    tierLabel = 'TIER II · STABLE';
    // Use Cyan as primary theme color for Stable (Tier II) as well
    tierColor = 'var(--accent-cyan)';
    textClass = 'text-accent-cyan';
    borderClass = 'border-accent-cyan/20';
  }

  // Determine status pill text and color
  let statusText = 'PROTECTED';
  let statusBadgeVariant = 'cyan';

  if (isScanning) {
    statusText = 'SCANNING';
    statusBadgeVariant = 'violet';
  } else if (isOffline || hasCriticalFail || scoreToUse < 50) {
    statusText = 'AT RISK';
    statusBadgeVariant = 'critical';
  } else if (scoreToUse < 90) {
    statusText = 'MONITORING';
    statusBadgeVariant = 'warning';
  }

  const badgeColors = {
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    violet: 'bg-accent-violet/10 text-accent-violet border-accent-violet/20 animate-pulse',
    critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
    warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
  };

  const toggleSimulateLinkLoss = () => {
    setIsSimulatedOffline((prev) => !prev);
  };

  return (
    <div
      style={{
        '--panel-accent': tierColor,
        boxShadow: `0 0 0 1px ${tierColor}, 0 0 16px ${tierColor}1a`,
      }}
      className={`relative w-full rounded-card border ${borderClass} bg-bg-secondary/40 backdrop-blur-md p-6 font-ui overflow-hidden flex flex-col gap-5 select-none`}
    >
      {/* Subtle Dynamic Scanlines Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${tierColor} 0px, ${tierColor} 1px, transparent 1px, transparent 4px)`,
        }}
      />

      {/* Cyber Corner Brackets */}
      <div
        className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-500"
        style={{ borderColor: tierColor }}
      />
      <div
        className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-500"
        style={{ borderColor: tierColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-500"
        style={{ borderColor: tierColor }}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-500"
        style={{ borderColor: tierColor }}
      />

      {/* Content wrapper to float above scanlines */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* PANEL HEADER */}
        <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-2">
          <span className="text-xs font-display font-bold tracking-widest text-text-muted">
            BROWSER SECURITY INDEX
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border transition-colors duration-300 ${
              badgeColors[statusBadgeVariant]
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* TELEMETRY DEGRADED / OFFLINE VIEW */}
        {isOffline ? (
          <div className={`flex flex-col gap-4 py-2 ${reducedMotion ? '' : 'animate-fade-in'}`}>
            <div className="flex flex-col items-center justify-center py-4 bg-status-critical/5 border border-status-critical/10 rounded-btn">
              <span className="text-4xl font-mono font-bold tracking-tighter text-status-critical">
                <AnimatedNumber value={scoreToUse} reducedMotion={reducedMotion} />%
              </span>
              <span className="text-[10px] font-mono font-semibold text-status-critical mt-1 tracking-wider">
                FORTRESS INDEX DEGRADED
              </span>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[11px] text-text-secondary">
              <div className="flex justify-between border-b border-border-subtle/50 pb-1.5">
                <span>FORTRESS STATUS:</span>
                <span className="text-status-critical font-bold animate-pulse">DEGRADED</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/50 pb-1.5">
                <span>THREAT LEVEL:</span>
                <span className="text-status-critical font-bold">TIER IV</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/50 pb-1.5">
                <span>LAST SYNC:</span>
                <span className="text-text-primary">{lastSync}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/50 pb-1.5">
                <span>DEGRADE REASON:</span>
                <span className="text-status-critical font-bold">NETWORK LINK LOST</span>
              </div>
            </div>

            {/* Offline Progress Meter */}
            <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden border border-border-subtle mt-1">
              <div
                className="h-full bg-status-critical shadow-[0_0_8px_rgba(248,113,113,0.4)] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${scoreToUse}%` }}
              />
            </div>
          </div>
        ) : (
          /* LIVE VIEW */
          <div className="flex flex-col gap-4 relative">
            
            {/* Resyncing Overlay */}
            {isResyncing && (
              <div 
                className={`absolute inset-0 bg-bg-secondary/90 z-20 flex flex-col items-center justify-center gap-2 border border-border-subtle rounded-btn ${
                  reducedMotion ? '' : 'transition-opacity duration-300'
                }`}
              >
                <div className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-mono tracking-widest text-accent-cyan uppercase animate-pulse">
                  RESYNCING TELEMETRY...
                </span>
              </div>
            )}

            {/* Score & Tier Callout */}
            <div className="flex flex-col items-center py-2">
              <span className={`text-4xl font-mono font-bold tracking-tighter ${textClass} transition-colors duration-500`}>
                <AnimatedNumber value={scoreToUse} reducedMotion={reducedMotion} />
                <span className="text-lg text-text-muted font-normal ml-1">/ 100</span>
              </span>
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase mt-1 ${textClass} transition-colors duration-500`}>
                {tierLabel}
              </span>
            </div>

            {/* Synchronized Progress Meter */}
            <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden border border-border-subtle">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${scoreToUse}%`,
                  backgroundColor: tierColor,
                  boxShadow: `0 0 8px ${tierColor}66`,
                }}
              />
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-1.5 mt-2">
              {CHECK_DEFS.map((def, idx) => {
                const isRevealed = idx < revealedCount;
                const result = checkResults[def.id];
                const hasPassed = result?.pass;
                
                let icon = '⟳';
                let iconColor = 'text-accent-violet animate-spin';
                let readoutText = 'SCANNING...';
                let rowColor = 'text-text-muted';

                if (isRevealed) {
                  if (hasPassed) {
                    icon = '✓';
                    iconColor = 'text-status-success';
                    readoutText = result.readout;
                    rowColor = 'text-text-primary';
                  } else {
                    icon = '⚠';
                    iconColor = def.warnOnFail ? 'text-status-warning' : 'text-status-critical animate-pulse';
                    readoutText = result.readout;
                    rowColor = 'text-text-secondary';
                  }
                }

                return (
                  <div
                    key={def.id}
                    className={`flex items-center justify-between text-xs font-mono py-1 border-b border-border-subtle/20 ${rowColor} transition-colors duration-200`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 font-bold flex justify-center ${iconColor}`}>
                        {icon}
                      </span>
                      <span>{def.label.toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] opacity-80 tracking-wider">
                      [ {readoutText} ]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PANEL FOOTER */}
        <div className="border-t border-border-subtle pt-3 mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
            <span>SCAN CYCLE: {isOffline ? 'HALTED' : scanCycle}</span>
            <span>SYNC: {isOffline ? 'LOST' : lastSync}</span>
          </div>

          {/* SIMULATE LINK LOSS TOGGLE */}
          <button
            onClick={toggleSimulateLinkLoss}
            style={{
              '--focus-color': tierColor,
            }}
            className="w-full py-1.5 px-3 bg-bg-tertiary/60 hover:bg-bg-tertiary border border-border-subtle rounded-btn text-[10px] font-mono font-bold tracking-wider text-text-secondary hover:text-text-primary transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            {isOffline ? 'RESTORE LINK CONNECTION' : 'SIMULATE LINK LOSS'}
          </button>
        </div>
      </div>
    </div>
  );
}
