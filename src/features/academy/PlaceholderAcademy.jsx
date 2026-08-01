import { useState, useEffect } from 'react';
import { useSentinel } from '@/context/SentinelProgressContext';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { divisionsData, missionsData } from './data/missionsData';
import MissionConsole from './components/MissionConsole';
import { isAudioMuted, setAudioMuted, playTerminalBoot } from './utils/audioSynth';
import { 
  BookOpen, Globe, UserCheck, Key, Terminal, Shield, 
  Radio, ShieldAlert, FileText, Volume2, VolumeX, 
  ChevronRight, ArrowLeft, Lock 
} from 'lucide-react';

const iconMap = {
  div01: Globe,
  div02: UserCheck,
  div03: Key,
  div04: Terminal,
  div05: Shield,
  div06: Radio,
  div07: ShieldAlert,
  div08: FileText
};

export default function PlaceholderAcademy() {
  const { completedMissions, lastSynced, sentinel, resetProgress } = useSentinel();
  const [muted, setMuted] = useState(isAudioMuted());
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [welcomeBanner, setWelcomeBanner] = useState(completedMissions.length > 0);

  // Dynamic Telemetry calculations
  const totalMissions = missionsData.length; // 40
  const completedCount = completedMissions.length;
  const progressPercent = Math.round((completedCount / totalMissions) * 100);
  
  // Total Estimated Learning scope (sum of all 40 missions)
  const totalEstimatedMinutes = missionsData.reduce((acc, m) => acc + m.estimatedMinutes, 0);
  const totalLearningHours = (totalEstimatedMinutes / 60).toFixed(1);

  // Sync audio state
  const handleToggleMute = () => {
    const nextMute = !muted;
    setMuted(nextMute);
    setAudioMuted(nextMute);
    if (!nextMute) {
      playTerminalBoot();
    }
  };

  // Find next incomplete mission in order
  const getContinueMission = () => {
    // Traverse missionsData and return first incomplete
    return missionsData.find(m => !completedMissions.includes(m.id)) || missionsData[0];
  };

  const nextMission = getContinueMission();

  // Division Card Status helper
  const getDivisionStatus = (divId) => {
    const divMissions = missionsData.filter(m => m.divisionId === divId);
    const divCompleted = divMissions.filter(m => completedMissions.includes(m.id)).length;
    if (divCompleted === 5) return { status: 'Complete', led: 'bg-accent-cyan shadow-[0_0_8px_#22d3ee]', label: 'COMPLETE' };
    if (divCompleted > 0) return { status: 'In Progress', led: 'bg-status-warning shadow-[0_0_8px_#fbbf24] animate-pulse', label: 'IN PROGRESS' };
    return { status: 'Operational', led: 'bg-status-success shadow-[0_0_8px_#34d399] animate-pulse', label: 'OPERATIONAL' };
  };

  // Check if a specific mission is unlocked (first mission of division is always unlocked, others require previous order complete)
  const isMissionUnlocked = (m) => {
    if (m.order === 1) return true;
    // Find the previous mission in order
    const prevMission = missionsData.find(prev => prev.divisionId === m.divisionId && prev.order === m.order - 1);
    return prevMission ? completedMissions.includes(prevMission.id) : false;
  };

  // Format timestamp safely
  const formatSyncedTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '--:--:--';
    }
  };

  // Initial welcome sound
  useEffect(() => {
    playTerminalBoot();
  }, []);

  // View toggling routing
  if (activeMission) {
    return (
      <MissionConsole 
        mission={activeMission} 
        onBack={() => {
          setActiveMission(null);
          // Play boot sounds when returning to dashboard
          playTerminalBoot();
        }} 
      />
    );
  }

  if (selectedDiv) {
    const divMissions = missionsData.filter(m => m.divisionId === selectedDiv.id);
    const divCompletedCount = divMissions.filter(m => completedMissions.includes(m.id)).length;

    return (
      <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full pb-12">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <button
            onClick={() => setSelectedDiv(null)}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-text-secondary hover:text-accent-cyan cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> RETRACT ARCHIVE
          </button>
          <span className="font-mono text-[10px] text-text-muted">CHAMBER INDEX // {selectedDiv.shortName}</span>
        </div>

        <div className="p-6 glassmorphism rounded-card border border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-display font-bold text-text-primary">{selectedDiv.name}</h1>
            <p className="text-xs text-text-secondary mt-1 max-w-xl">{selectedDiv.description}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs text-text-muted">Progress:</span>
            <Badge variant="cyan" className="font-mono">{divCompletedCount} / 5 COMPLETE</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">DIVISION MISSIONS SEQUENCE</span>
          
          <div className="flex flex-col gap-3">
            {divMissions.map((m) => {
              const unlocked = isMissionUnlocked(m);
              const completed = completedMissions.includes(m.id);

              return (
                <div 
                  key={m.id}
                  className={`p-5 border rounded-card transition-all duration-200 relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    unlocked
                      ? completed
                        ? 'border-accent-cyan/40 bg-bg-secondary/40 hover:border-accent-cyan/80'
                        : 'border-border-subtle bg-bg-secondary/60 hover:border-accent-cyan hover:scale-[1.01] hover:shadow-glow-cyan'
                      : 'border-border-subtle/30 bg-bg-primary/20 opacity-50 cursor-not-allowed select-none'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      {completed ? (
                        <div className="w-5 h-5 rounded-full bg-accent-cyan/20 border border-accent-cyan text-accent-cyan flex items-center justify-center font-mono text-[9px] font-bold">
                          ✔
                        </div>
                      ) : unlocked ? (
                        <div className="w-5 h-5 rounded-full bg-bg-tertiary border border-border-subtle text-text-secondary flex items-center justify-center font-mono text-[10px] font-bold">
                          0{m.order}
                        </div>
                      ) : (
                        <Lock className="w-5 h-5 text-text-muted shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-display font-semibold text-text-primary">{m.title}</h3>
                        {completed && <Badge variant="cyan" className="text-[8px] py-0">Completed</Badge>}
                      </div>
                      <p className="text-xs font-ui text-text-secondary max-w-lg leading-relaxed">
                        {m.brief.hook}
                      </p>
                      <div className="flex gap-4 font-mono text-[10px] text-text-muted mt-1.5">
                        <span>Duration: {m.estimatedMinutes} Mins</span>
                        <span>Reward: {m.xpReward} XP</span>
                        {/* Threat Dots */}
                        <span className="flex items-center gap-1">
                          Difficulty:
                          <span className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full ${
                                  i < m.difficulty 
                                    ? 'bg-status-critical shadow-[0_0_4px_rgba(248,113,113,0.6)]' 
                                    : 'bg-bg-tertiary'
                                }`} 
                              />
                            ))}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex justify-end">
                    {unlocked ? (
                      <Button
                        variant={completed ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => setActiveMission(m)}
                        className="font-mono text-xs w-full sm:w-auto"
                      >
                        {completed ? 'REPLAY SIMULATOR' : 'LAUNCH SIMULATOR'}
                      </Button>
                    ) : (
                      <span className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 border border-border-subtle/30 px-3 py-1.5 rounded-btn bg-bg-primary/20">
                        <Lock className="w-3.5 h-3.5" />
                        PREREQUISITE REQ
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-6 glassmorphism rounded-card border border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-violet/15 rounded-btn text-accent-violet border border-accent-violet/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Academy Chamber
            </h1>
            <p className="text-xs font-ui text-text-secondary mt-1">
              Sentinel Knowledge Command // Operations Platform v1.0
            </p>
          </div>
        </div>
        
        {/* Mute and Reset buttons */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleMute}
            className="flex items-center gap-1.5 border border-border-subtle text-text-secondary hover:text-accent-cyan hover:border-accent-cyan"
            aria-label={muted ? "Unmute audio" : "Mute audio"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-status-critical" /> : <Volume2 className="w-4 h-4 text-accent-cyan" />}
            <span className="text-[10px]">{muted ? "MUTED" : "AUDIO ON"}</span>
          </Button>

          {completedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetProgress}
              className="border border-border-subtle text-text-secondary hover:text-status-critical hover:border-status-critical text-[10px] py-1.5"
            >
              RESET PROTOCOLS
            </Button>
          )}
        </div>
      </div>

      {/* Returning-User Dashboard Banner */}
      {welcomeBanner && completedCount > 0 && (
        <div className="p-5 glassmorphism rounded-card border border-accent-cyan/30 bg-bg-secondary/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent-cyan/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col gap-1 font-ui z-10">
            <span className="font-mono text-[9px] text-accent-cyan tracking-wider font-bold">SENTINEL LINK ACTIVE</span>
            <h2 className="text-sm font-semibold text-text-primary">Welcome back, Recruit</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] text-text-secondary mt-1">
              <span>SYNC TIME: <strong className="text-text-primary">{formatSyncedTime(lastSynced)}</strong></span>
              <span>XP RECORDED: <strong className="text-accent-cyan">{sentinel.xp} XP</strong></span>
              <span>COMPLETED: <strong className="text-status-success">{completedCount} / 40</strong></span>
            </div>
          </div>

          <div className="flex gap-3 shrink-0 z-10 w-full md:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWelcomeBanner(false)}
              className="text-[10px] font-mono"
            >
              DISMISS
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveMission(nextMission)}
              className="text-[10px] font-mono shadow-glow-cyan"
            >
              CONTINUE MISSION {nextMission.id}
            </Button>
          </div>
        </div>
      )}

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-[10px]">
        
        <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle py-2.5 px-3 rounded-btn relative overflow-hidden justify-between min-h-[68px] h-auto">
          <span className="text-text-muted">KNOWLEDGE DIVISIONS</span>
          <span className="text-lg font-bold text-accent-cyan mt-1">8</span>
        </div>

        <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle py-2.5 px-3 rounded-btn relative overflow-hidden justify-between min-h-[68px] h-auto">
          <span className="text-text-muted">TRAINING MISSIONS</span>
          <span className="text-lg font-bold text-accent-cyan mt-1">{totalMissions}</span>
        </div>

        <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle py-2.5 px-3 rounded-btn relative overflow-hidden justify-between min-h-[68px] h-auto">
          <span className="text-text-muted">ESTIMATED LEARNING</span>
          <span className="text-lg font-bold text-accent-cyan mt-1">{totalLearningHours} Hrs</span>
        </div>

        <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle py-2.5 px-3 rounded-btn relative overflow-hidden justify-between min-h-[68px] h-auto">
          <span className="text-text-muted">CURRENT RANK</span>
          <span className="text-xs font-bold text-accent-violet mt-1 truncate uppercase">{sentinel.rank}</span>
        </div>

        <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle py-2.5 px-3 rounded-btn relative overflow-hidden justify-between min-h-[68px] h-auto">
          <span className="text-text-muted">ACADEMY STATUS</span>
          <span className="text-xs font-bold text-status-success mt-1 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_6px_#34d399]" />
            OPERATIONAL
          </span>
        </div>

        <div className="flex flex-col bg-bg-secondary/40 border border-border-subtle py-2.5 px-3 rounded-btn relative overflow-hidden justify-between min-h-[68px] h-auto">
          <span className="text-text-muted">PROGRESS STATUS</span>
          <span className="text-lg font-bold text-accent-cyan mt-1">{progressPercent}%</span>
        </div>

      </div>

      {/* Grid of Divisions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-accent-cyan uppercase">
            CHAMBER DEPARTMENTS
          </span>
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Security Divisions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {divisionsData.map((div) => {
            const IconComp = iconMap[div.id] || Globe;
            const divMissions = missionsData.filter(m => m.divisionId === div.id);
            const divCompleted = divMissions.filter(m => completedMissions.includes(m.id)).length;
            const statusInfo = getDivisionStatus(div.id);

            // Progress Ring specs
            const radius = 16;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (divCompleted / 5) * circumference;

            return (
              <Card
                key={div.id}
                glowHover={true}
                onClick={() => setSelectedDiv(div)}
                className="p-5 md:p-6 border border-border-subtle group hover:scale-[1.01] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-bg-tertiary border border-border-subtle text-text-secondary rounded-btn flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-text-muted uppercase">DIVISION 0{div.id.slice(-1)}</span>
                        <h3 className="text-base font-display font-bold text-text-primary mt-0.5 group-hover:text-accent-cyan transition-colors">
                          {div.name}
                        </h3>
                      </div>
                    </div>

                    {/* Animated Progress Ring */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle 
                          cx="20" 
                          cy="20" 
                          r={radius} 
                          className="stroke-border-subtle fill-none" 
                          strokeWidth="2.5" 
                        />
                        <circle 
                          cx="20" 
                          cy="20" 
                          r={radius} 
                          className="stroke-accent-cyan fill-none transition-all duration-500" 
                          strokeWidth="2.5" 
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                        />
                      </svg>
                      <span className="absolute font-mono text-[9px] text-accent-cyan font-bold">
                        {divCompleted}/5
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-ui text-text-secondary leading-relaxed">
                    {div.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle/40 flex justify-between items-center font-mono text-[10px]">
                  
                  {/* Status Indicator & Text Label (Accessibility friendly) */}
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.led}`} />
                    <span className="text-text-muted font-bold tracking-wider text-[9px]">{statusInfo.label}</span>
                  </div>

                  <div className="flex items-center gap-3 text-text-muted">
                    <span>{div.estimatedHours}</span>
                    {/* Threat dots */}
                    <span className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`w-1 h-1 rounded-full ${
                            i < div.difficulty 
                              ? 'bg-status-critical shadow-[0_0_3px_#F87171]' 
                              : 'bg-bg-tertiary'
                          }`} 
                        />
                      ))}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-accent-cyan font-bold group-hover:underline pl-1.5">
                      ARCHIVE <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
