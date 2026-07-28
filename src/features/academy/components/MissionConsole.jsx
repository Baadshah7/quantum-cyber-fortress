import { useState, useEffect } from 'react';
import { useSentinel } from '@/context/SentinelProgressContext';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { 
  playTerminalBoot, playMissionComplete, playRankUp 
} from '../utils/audioSynth';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert, 
  HelpCircle, Award, Volume2, Cpu, Info, Check, RefreshCw 
} from 'lucide-react';

// Import interactive widgets
import PortSweepWidget from './widgets/PortSweepWidget';
import AuthHeadersWidget from './widgets/AuthHeadersWidget';
import CaesarDecryptWidget from './widgets/CaesarDecryptWidget';
import ChmodWidget from './widgets/ChmodWidget';
import CiaTriadWidget from './widgets/CiaTriadWidget';
import LogInspectorWidget from './widgets/LogInspectorWidget';
import SqliSanitizeWidget from './widgets/SqliSanitizeWidget';
import HashVerifierWidget from './widgets/HashVerifierWidget';

const STAGES = [
  { id: 'briefing', label: 'Briefing' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'concept', label: 'Concept' },
  { id: 'realWorld', label: 'Real World' },
  { id: 'lab', label: 'Interactive Lab' },
  { id: 'quiz', label: 'Knowledge Check' },
  { id: 'debrief', label: 'Debrief' }
];

export default function MissionConsole({ mission, onBack }) {
  const { completeMission, sentinel } = useSentinel();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [labCompleted, setLabCompleted] = useState(false);
  const [widgetError, setWidgetError] = useState(false);
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [debriefDone, setDebriefDone] = useState(false);
  const [debriefResult, setDebriefResult] = useState(null);

  const activeStage = STAGES[currentStageIdx];

  // Boot audio on mount
  useEffect(() => {
    playTerminalBoot();
  }, [mission.id]);

  const handleLabCompletion = (success) => {
    if (success) {
      setLabCompleted(true);
    }
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const checkQuizAnswers = () => {
    let correct = 0;
    mission.quiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answerIdx) {
        correct += 1;
      }
    });

    setCorrectCount(correct);
    const passed = correct >= mission.quiz.passThreshold;
    setQuizPassed(passed);
    setQuizSubmitted(true);

    const announcement = `Quiz checked. You got ${correct} of ${mission.quiz.questions.length} questions correct. ${passed ? 'Authorization parameters verified.' : 'Verification failed.'}`;
    setAriaAnnouncement(announcement);
  };

  // Perform final state update and XP awarding in Debrief transition
  const triggerDebriefComplete = () => {
    if (debriefDone) return;
    setDebriefDone(true);
    
    const prevRank = sentinel.rank;
    const scorePercentage = correctCount / mission.quiz.questions.length;
    const passRatio = mission.quiz.passThreshold / mission.quiz.questions.length;

    // Complete the mission in context (saves to local storage, awards XP)
    const result = completeMission(
      mission.id, 
      scorePercentage, 
      passRatio, 
      mission.xpReward
    );

    setDebriefResult(result);
    playMissionComplete();

    // Check if rank changed (rank-up trigger)
    setTimeout(() => {
      // Re-fetching rank after delay to check update
      const savedMissions = JSON.parse(localStorage.getItem('qcf_completed_missions') || '[]');
      const newRank = getRankByCompletedCount(savedMissions.length);
      if (newRank !== prevRank) {
        playRankUp();
      }
    }, 100);
  };

  const getRankByCompletedCount = (count) => {
    if (count >= 40) return 'Quantum Warden';
    if (count >= 35) return 'Elite Sentinel';
    if (count >= 29) return 'Sentinel';
    if (count >= 22) return 'Guardian';
    if (count >= 15) return 'Analyst';
    if (count >= 9) return 'Operator';
    if (count >= 4) return 'Cadet';
    return 'Recruit';
  };

  // Navigation handlers
  const goNext = () => {
    if (activeStage.id === 'lab' && !labCompleted && mission.widget.type !== 'stub' && !widgetError) {
      // Gated by lab completion unless it is a stub or has a runtime error
      return;
    }
    if (activeStage.id === 'quiz' && !quizSubmitted) {
      // Must submit quiz before advancing
      return;
    }

    if (currentStageIdx < STAGES.length - 1) {
      const nextIdx = currentStageIdx + 1;
      setCurrentStageIdx(nextIdx);
      if (STAGES[nextIdx].id === 'debrief') {
        triggerDebriefComplete();
      }
    }
  };

  const goBack = () => {
    if (currentStageIdx > 0 && activeStage.id !== 'debrief') {
      setCurrentStageIdx(prev => prev - 1);
    }
  };

  // Render Widget based on type
  const renderWidget = () => {
    if (widgetError) {
      return (
        <div className="p-6 bg-status-critical/5 border border-status-critical/20 rounded-btn text-status-critical flex items-start gap-3 font-mono text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">SYSTEM ERROR</span>
            <p className="text-text-secondary leading-normal">
              System Error: The interactive simulation console failed to initialize. Review raw telemetry logs.
            </p>
          </div>
        </div>
      );
    }

    const wType = mission.widget.type;

    if (wType === 'stub') {
      return (
        <div className="p-6 bg-bg-secondary/40 border border-border-subtle rounded-btn text-text-secondary flex items-start gap-3 font-ui text-xs">
          <Info className="w-5 h-5 text-accent-violet shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-bold font-mono text-accent-violet">SIMULATION STANDBY</span>
            <p className="leading-normal">
              Simulation Standby: Advanced training modules are queued for the next defense clearance upgrade.
            </p>
          </div>
        </div>
      );
    }

    try {
      switch (wType) {
        case 'port-sweep':
          return <PortSweepWidget onComplete={handleLabCompletion} />;
        case 'auth-headers':
          return <AuthHeadersWidget onComplete={handleLabCompletion} />;
        case 'caesar-decrypt':
          return <CaesarDecryptWidget onComplete={handleLabCompletion} />;
        case 'chmod':
          return <ChmodWidget onComplete={handleLabCompletion} />;
        case 'cia-triad':
          return <CiaTriadWidget onComplete={handleLabCompletion} />;
        case 'log-inspector':
          return <LogInspectorWidget onComplete={handleLabCompletion} />;
        case 'sqli-sanitize':
          return <SqliSanitizeWidget onComplete={handleLabCompletion} />;
        case 'hash-verifier':
          return <HashVerifierWidget onComplete={handleLabCompletion} />;
        default:
          throw new Error('Unknown widget type');
      }
    } catch (e) {
      console.error(e);
      setWidgetError(true);
      return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-3xl mx-auto w-full pb-12">
      {/* Screen Reader Live Announcements */}
      <div aria-live="polite" className="sr-only">
        {ariaAnnouncement}
      </div>

      {/* Navigation Top Bar */}
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono font-semibold text-text-secondary hover:text-accent-cyan cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> ABORT MISSION
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-muted">ACTIVE TRANSMISSION:</span>
          <span className="font-mono text-xs text-accent-cyan font-bold">{mission.id}</span>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="grid grid-cols-7 gap-1 font-mono text-[9px] text-center border border-border-subtle/50 rounded-md p-1 bg-bg-secondary/20">
        {STAGES.map((s, idx) => {
          let stepColor = 'text-text-muted';
          if (idx === currentStageIdx) stepColor = 'text-accent-cyan font-bold bg-bg-tertiary rounded-sm border border-border-subtle';
          else if (idx < currentStageIdx) stepColor = 'text-status-success font-semibold';
          return (
            <div key={s.id} className={`py-1 ${stepColor}`}>
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Main Mission Screen */}
      <Card className="p-6 md:p-8 border border-border-subtle relative min-h-[380px] flex flex-col justify-between">
        
        {/* Stage 1: Briefing */}
        {activeStage.id === 'briefing' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-btn text-accent-cyan">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-accent-cyan tracking-wider uppercase">SECTOR COMMAND BRIEFING</span>
                <h2 className="text-lg font-display font-semibold text-text-primary mt-0.5">{mission.title}</h2>
              </div>
            </div>
            <div className="h-[1px] bg-border-subtle w-full" />
            <div className="flex flex-col gap-4 font-ui">
              <p className="text-sm font-semibold text-text-primary leading-relaxed border-l-2 border-accent-cyan pl-4 italic">
                &ldquo;{mission.brief.hook}&rdquo;
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {mission.brief.context}
              </p>
            </div>
          </div>
        )}

        {/* Stage 2: Objectives */}
        {activeStage.id === 'objectives' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-mono font-bold text-text-muted uppercase tracking-wider">Operational Objectives</h2>
            <div className="h-[1px] bg-border-subtle w-full" />
            <ul className="flex flex-col gap-3 font-ui text-xs text-text-secondary">
              {mission.objectives.map((obj, idx) => (
                <li key={idx} className="flex gap-3 items-start p-3 bg-bg-primary/30 border border-border-subtle/50 rounded-btn">
                  <div className="w-4 h-4 rounded-full bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stage 3: Concept */}
        {activeStage.id === 'concept' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-mono font-bold text-text-muted uppercase tracking-wider">Theoretical Architecture</h2>
            <div className="h-[1px] bg-border-subtle w-full" />
            
            {mission.conceptBlocks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {mission.conceptBlocks.map((block, bIdx) => (
                  <div key={bIdx} className="flex flex-col gap-3">
                    <h3 className="text-xs font-mono font-bold text-accent-cyan uppercase">{block.title}</h3>
                    
                    {block.type === 'diagram' && (
                      <div className="p-4 bg-bg-primary border border-border-subtle/60 rounded-btn font-mono text-xs text-text-secondary leading-relaxed text-center break-words">
                        {block.data}
                      </div>
                    )}

                    {block.type === 'stepFlow' && (
                      <ol className="flex flex-col gap-2 font-ui text-xs text-text-secondary">
                        {block.data.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5">
                            <span className="font-mono text-accent-violet font-bold">{sIdx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {block.type === 'iconList' && (
                      <div className="grid grid-cols-1 gap-2.5 font-ui text-xs text-text-secondary">
                        {block.data.map((item, iIdx) => (
                          <div key={iIdx} className="p-3 bg-bg-primary/40 border border-border-subtle rounded-btn flex flex-col gap-1">
                            <strong className="text-text-primary font-mono text-[11px]">{item.label}</strong>
                            <span className="leading-normal">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs font-mono text-text-muted">
                System telemetry data unavailable. Focus on interactive instructions.
              </div>
            )}
          </div>
        )}

        {/* Stage 4: Real World */}
        {activeStage.id === 'realWorld' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-mono font-bold text-text-muted uppercase tracking-wider">Tactical Implications</h2>
            <div className="h-[1px] bg-border-subtle w-full" />
            <div className="flex flex-col gap-3 font-ui text-xs text-text-secondary leading-relaxed p-4 bg-bg-secondary/40 border border-border-subtle/50 rounded-btn">
              <div className="flex items-center gap-2 text-accent-cyan mb-1">
                <Info className="w-4 h-4" />
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase">Case Study</span>
              </div>
              <p>{mission.realWorldExample}</p>
            </div>
          </div>
        )}

        {/* Stage 5: Lab */}
        {activeStage.id === 'lab' && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono font-bold text-text-muted uppercase tracking-wider">Defensive Execution Sandbox</h2>
              {mission.widget.type !== 'stub' && (
                <Badge status={labCompleted ? 'success' : 'warning'}>
                  {labCompleted ? 'READY' : 'GATED'}
                </Badge>
              )}
            </div>
            <div className="h-[1px] bg-border-subtle w-full" />
            
            {/* Widget Loader */}
            <div className="flex-1">
              {renderWidget()}
            </div>
          </div>
        )}

        {/* Stage 6: Quiz */}
        {activeStage.id === 'quiz' && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono font-bold text-text-muted uppercase tracking-wider">Telemetry Verification Check</h2>
              {quizSubmitted && (
                <Badge status={quizPassed ? 'success' : 'critical'}>
                  {quizPassed ? 'VERIFICATION PASSED' : 'VERIFICATION FAILED'}
                </Badge>
              )}
            </div>
            <div className="h-[1px] bg-border-subtle w-full" />

            <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto pr-1">
              {mission.quiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="flex flex-col gap-3 text-xs">
                  <span className="font-bold text-text-primary flex gap-2">
                    <span className="font-mono text-accent-cyan">Q{qIdx + 1}.</span>
                    <span>{q.q}</span>
                  </span>
                  
                  <div className="flex flex-col gap-2 pl-4">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[qIdx] === oIdx;
                      const isCorrect = q.answerIdx === oIdx;
                      
                      let optionStyle = 'border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-primary/20';
                      if (isSelected) optionStyle = 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan font-semibold';
                      
                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionStyle = 'border-status-success bg-status-success/10 text-status-success font-semibold';
                        } else if (isSelected) {
                          optionStyle = 'border-status-critical bg-status-critical/10 text-status-critical font-semibold';
                        } else {
                          optionStyle = 'border-border-subtle/30 text-text-muted/65 cursor-not-allowed';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(qIdx, oIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-2.5 border rounded-btn transition-colors flex items-center justify-between font-ui cursor-pointer ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-status-success shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-bg-secondary/50 border border-border-subtle/50 rounded-btn text-[11px] font-ui text-text-secondary pl-4 leading-normal">
                      <strong className="text-text-primary font-mono text-[10px] block mb-0.5">EXAMINATION DETAILS:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!quizSubmitted && (
              <div className="flex justify-end mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={checkQuizAnswers}
                  disabled={Object.keys(quizAnswers).length < mission.quiz.questions.length}
                  icon={<HelpCircle className="w-3.5 h-3.5" />}
                >
                  RUN VERIFICATION
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Stage 7: Debrief */}
        {activeStage.id === 'debrief' && (
          <div className="flex flex-col gap-6 items-center text-center py-6">
            <div className="p-4 bg-status-success/10 border border-status-success/20 rounded-full text-status-success animate-bounce">
              <Award className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-display font-bold text-text-primary">Mission Complete</h2>
              <span className="font-mono text-xs text-text-muted">SYSTEM LOG SYNCHRONIZED</span>
            </div>

            <div className="h-[1px] bg-border-subtle w-full my-1" />

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm font-mono text-xs">
              <div className="p-3 bg-bg-secondary/45 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-text-muted">XP AWARDED</span>
                <span className="text-xl font-bold text-accent-cyan mt-1">
                  +{debriefResult ? debriefResult.xpEarned : 0} XP
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/45 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-text-muted">VERIFICATION STATUS</span>
                <span className="mt-2.5">
                  {quizPassed ? (
                    <Badge status="success" className="text-[10px]">MASTERY</Badge>
                  ) : (
                    <Badge status="warning" className="text-[10px]">COMPLETE</Badge>
                  )}
                </span>
              </div>
            </div>

            {debriefResult && debriefResult.mastery && (
              <div className="p-3.5 bg-accent-violet/5 border border-accent-violet/20 rounded-btn flex gap-3 items-center max-w-sm text-left font-ui">
                <Badge variant="violet" className="text-[9px] shrink-0 font-mono">DISTINCTION</Badge>
                <p className="text-[11px] text-text-secondary leading-normal">
                  Mastery criteria satisfied. Credential records updated inside regional sentinel databases.
                </p>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={onBack}
              className="mt-4 font-mono font-semibold"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              RETURN TO ACADEMY
            </Button>
          </div>
        )}

        {/* Stepper Stepping Buttons Footer */}
        {activeStage.id !== 'debrief' && (
          <div className="mt-8 pt-4 border-t border-border-subtle flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={currentStageIdx === 0}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
              iconPosition="left"
              className="font-mono text-xs font-semibold cursor-pointer"
            >
              PREVIOUS
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={goNext}
              disabled={
                (activeStage.id === 'lab' && !labCompleted && mission.widget.type !== 'stub' && !widgetError) ||
                (activeStage.id === 'quiz' && !quizSubmitted)
              }
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              className="font-mono text-xs font-semibold cursor-pointer"
            >
              {activeStage.id === 'quiz' && !quizSubmitted ? 'VERIFY FIRST' : 'NEXT PROTOCOL'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
