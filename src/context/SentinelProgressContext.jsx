/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const SentinelProgressContext = createContext(null);

export const useSentinel = () => {
  const context = useContext(SentinelProgressContext);
  if (!context) {
    throw new Error('useSentinel must be used within a SentinelProgressProvider');
  }
  return context;
};

export const SentinelProgressProvider = ({ children }) => {
  const [sentinel, setSentinel] = useState({
    name: 'Sentinel-01',
    rank: 'Novice Recruit',
    level: 1,
    xp: 120,
    nextRankXp: 500,
  });

  const [badges] = useState([
    {
      id: 'first-login',
      name: 'First Defense Gate',
      description: 'Successfully initialized the Quantum Cyber Fortress environment.',
      icon: 'Shield',
      unlockedAt: '2026-07-27',
    },
  ]);

  const [unlockedZones, setUnlockedZones] = useState(['/']);

  const addXp = (amount) => {
    setSentinel((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newRank = prev.rank;

      if (newXp >= prev.nextRankXp) {
        newLevel += 1;
        newRank = newLevel >= 3 ? 'Elite Protector' : 'Guardian';
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        rank: newRank,
      };
    });
  };

  const unlockZone = (route) => {
    if (!unlockedZones.includes(route)) {
      setUnlockedZones((prev) => [...prev, route]);
    }
  };

  return (
    <SentinelProgressContext.Provider value={{ sentinel, badges, unlockedZones, addXp, unlockZone }}>
      {children}
    </SentinelProgressContext.Provider>
  );
};

