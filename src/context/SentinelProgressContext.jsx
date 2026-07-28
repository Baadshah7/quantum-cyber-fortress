/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const SentinelProgressContext = createContext(null);

export const useSentinel = () => {
  const context = useContext(SentinelProgressContext);
  if (!context) {
    throw new Error('useSentinel must be used within a SentinelProgressProvider');
  }
  return context;
};

// Helper to determine rank based on completed mission count (denominator = 40)
export const getRankByCompletedCount = (count) => {
  if (count >= 40) return 'Quantum Warden';
  if (count >= 35) return 'Elite Sentinel';
  if (count >= 29) return 'Sentinel';
  if (count >= 22) return 'Guardian';
  if (count >= 15) return 'Analyst';
  if (count >= 9) return 'Operator';
  if (count >= 4) return 'Cadet';
  return 'Recruit';
};

export const SentinelProgressProvider = ({ children }) => {
  const [completedMissions, setCompletedMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('qcf_completed_missions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('qcf_sentinel_xp');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lastSynced, setLastSynced] = useState(() => {
    return localStorage.getItem('qcf_last_synced') || new Date().toISOString();
  });

  const [badges, setBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('qcf_badges');
      return saved ? JSON.parse(saved) : [
        {
          id: 'first-login',
          name: 'First Defense Gate',
          description: 'Successfully initialized the Quantum Cyber Fortress environment.',
          icon: 'Shield',
          unlockedAt: new Date().toLocaleDateString(),
        }
      ];
    } catch {
      return [];
    }
  });

  const [unlockedZones, setUnlockedZones] = useState(['/']);

  // Sync to local storage on change
  useEffect(() => {
    localStorage.setItem('qcf_completed_missions', JSON.stringify(completedMissions));
    localStorage.setItem('qcf_sentinel_xp', xp.toString());
    localStorage.setItem('qcf_badges', JSON.stringify(badges));
    localStorage.setItem('qcf_last_synced', lastSynced);
  }, [completedMissions, xp, badges, lastSynced]);

  const completeMission = (missionId, scorePercentage, passThresholdRatio, xpReward) => {
    if (completedMissions.includes(missionId)) {
      // Mission already completed previously; do not award extra XP
      return { alreadyCompleted: true, xpEarned: 0, mastery: scorePercentage >= passThresholdRatio };
    }

    // Determine aligned multiplier
    let multiplier = 0.7;
    const passed = scorePercentage >= passThresholdRatio;
    
    if (passed) {
      if (scorePercentage === 1.0) {
        multiplier = 1.0; // Perfect Mastery
      } else {
        multiplier = 0.9; // Passed Mastery
      }
    }

    const earned = Math.round(xpReward * multiplier);
    
    setCompletedMissions((prev) => [...prev, missionId]);
    setXp((prev) => prev + earned);
    
    const now = new Date();
    setLastSynced(now.toISOString());

    // Award badge if mastered
    let masteryAwarded = false;
    if (passed) {
      masteryAwarded = true;
      setBadges((prev) => {
        // Prevent duplicate badge ids
        if (prev.some(b => b.id === `mastery-${missionId}`)) return prev;
        return [
          ...prev,
          {
            id: `mastery-${missionId}`,
            name: 'Mastery Distinction',
            description: `Completed simulation link ${missionId} above threshold.`,
            icon: 'Award',
            unlockedAt: now.toLocaleDateString(),
          }
        ];
      });
    }

    return { alreadyCompleted: false, xpEarned: earned, mastery: masteryAwarded };
  };

  const resetProgress = () => {
    setCompletedMissions([]);
    setXp(0);
    setLastSynced(new Date().toISOString());
    setBadges([
      {
        id: 'first-login',
        name: 'First Defense Gate',
        description: 'Successfully initialized the Quantum Cyber Fortress environment.',
        icon: 'Shield',
        unlockedAt: new Date().toLocaleDateString(),
      }
    ]);
    localStorage.removeItem('qcf_completed_missions');
    localStorage.removeItem('qcf_sentinel_xp');
    localStorage.removeItem('qcf_badges');
    localStorage.removeItem('qcf_last_synced');
  };

  const unlockZone = (route) => {
    if (!unlockedZones.includes(route)) {
      setUnlockedZones((prev) => [...prev, route]);
    }
  };

  const currentRank = getRankByCompletedCount(completedMissions.length);

  return (
    <SentinelProgressContext.Provider value={{ 
      completedMissions, 
      xp, 
      lastSynced, 
      badges, 
      unlockedZones, 
      completeMission, 
      resetProgress, 
      unlockZone,
      sentinel: {
        name: 'Sentinel-01',
        rank: currentRank,
        xp: xp
      }
    }}>
      {children}
    </SentinelProgressContext.Provider>
  );
};
