import { useState } from 'react';
import { labsData } from './labs.data';
import LabsGrid from './LabsGrid';
import { useSentinel } from '@/context/SentinelProgressContext';

export default function LabsCatalog({ isPage = false }) {
  const { completedMissions } = useSentinel();
  // Developer state overrides for QA/Verification
  const [devState, setDevState] = useState('normal'); // 'normal' | 'loading' | 'empty'

  // Easter egg cyclist: clicking the pulsing LED cycles the UI states
  const cycleDevState = () => {
    setDevState((current) => {
      if (current === 'normal') return 'loading';
      if (current === 'loading') return 'empty';
      return 'normal';
    });
  };

  const getActiveLabs = () => {
    if (devState === 'empty') return [];
    
    return labsData.map(lab => {
      if (lab.id === 'log-analysis') {
        const isCompleted = completedMissions.includes('log-analysis');
        const savedScoreData = localStorage.getItem('qcf_lab_score_log-analysis');
        let scoreText = null;
        if (savedScoreData) {
          try {
            const { score, maxScore } = JSON.parse(savedScoreData);
            scoreText = `Best Score: ${score}/${maxScore}`;
          } catch (e) {
            scoreText = 'Completed';
          }
        }
        return {
          ...lab,
          status: isCompleted ? 'completed' : 'available',
          scoreText
        };
      }
      if (lab.id === 'packet-sandbox') {
        const savedScoreData = localStorage.getItem('qcf_lab_score_packet-sandbox');
        const isCompleted = !!savedScoreData;
        let scoreText = null;
        if (savedScoreData) {
          try {
            const { score, maxScore } = JSON.parse(savedScoreData);
            scoreText = `Best Score: ${score}/${maxScore}`;
          } catch (e) {
            scoreText = 'Completed';
          }
        }
        return {
          ...lab,
          status: isCompleted ? 'completed' : 'available',
          scoreText
        };
      }
      return lab;
    });
  };

  const getIsLoading = () => {
    return devState === 'loading';
  };

  return (
    <section 
      id="labs-catalog" 
      className={isPage 
        ? "relative overflow-hidden" 
        : "py-12 px-4 relative overflow-hidden border-t border-border-subtle/30 bg-bg-secondary/5 scroll-mt-20"
      }
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          
          {/* Eyebrow Label with pulsating LED indicator */}
          <span 
            className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan/60 uppercase flex items-center justify-center sm:justify-start gap-2 w-fit cursor-help select-none"
            onClick={cycleDevState}
            title="Dev utility: click to cycle UI states (Active -> Loading -> Empty)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan shadow-[0_0_6px_#22d3ee]"></span>
            </span>
            CLASSIFIED DATABASE
            {devState !== 'normal' && (
              <span className="text-[9px] font-mono text-status-warning ml-1">
                [{devState.toUpperCase()} TEST MODE]
              </span>
            )}
          </span>

          {/* Heading and Subheading Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 justify-center sm:justify-start">
            <h2 className="text-lg font-display font-semibold text-text-primary tracking-wider">
              LABS CATALOG
            </h2>
            <span className="text-xs font-mono text-accent-cyan/70 select-none hidden sm:inline">|</span>
            <span className="text-xs font-display text-text-secondary/90 font-medium">
              Advanced Security Simulation Modules
            </span>
          </div>
          
          {/* Mobile-only subheading block */}
          <span className="text-xs font-display text-text-secondary/90 font-medium sm:hidden block mt-0.5">
            Advanced Security Simulation Modules
          </span>

          {/* Body Copy */}
          <p className="text-xs font-ui text-text-secondary max-w-2xl leading-relaxed mt-1">
            Every Sentinel undergoes practical simulations before deployment into active cyber defense operations. Browse classified laboratories covering digital forensics, packet analysis, Linux operations, incident response, secure infrastructure, and investigative challenges.
          </p>
        </div>

        {/* Labs Grid */}
        <LabsGrid labs={getActiveLabs()} loading={getIsLoading()} />

      </div>
    </section>
  );
}
