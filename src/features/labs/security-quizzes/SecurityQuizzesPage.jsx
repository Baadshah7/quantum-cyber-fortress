import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { 
  Clock, Award, CheckCircle2, ArrowLeft, HelpCircle, 
  Check, X, BookOpen, Shield
} from 'lucide-react';

const QUESTIONS_DATA = [
  {
    id: 1,
    topic: 'Cryptography',
    text: 'What type of encryption uses the same single key for both encrypting and decrypting data?',
    options: [
      'Asymmetric encryption',
      'Symmetric encryption',
      'Hash-based signing',
      'Public-key encryption'
    ],
    correctAnswerIdx: 1, // Symmetric encryption
    hint: 'Think of a traditional lockbox where the exact same key locks and unlocks the box.'
  },
  {
    id: 2,
    topic: 'Cryptography',
    text: 'What is the primary purpose of a cryptographic hash function like SHA-256?',
    options: [
      'To encrypt files so they can be decrypted with a passcode later',
      'To verify data integrity by generating a unique fixed-length fingerprint',
      'To establish tunnel connections inside Virtual Private Networks (VPNs)',
      'To generate matching public-private key pairs for authentication'
    ],
    correctAnswerIdx: 1, // To verify data integrity...
    hint: 'Hashing is one-way. If the input changes by even a single bit, the output fingerprint changes completely.'
  },
  {
    id: 3,
    topic: 'Networking Fundamentals',
    text: 'What does the "S" in the HTTPS protocol stand for?',
    options: [
      'Socket',
      'System',
      'Standard',
      'Secure'
    ],
    correctAnswerIdx: 3, // Secure
    hint: 'HTTPS is HTTP layered over TLS/SSL, providing an encrypted connection.'
  },
  {
    id: 4,
    topic: 'Networking Fundamentals',
    text: 'Which network port is standard for secure remote shell (SSH) logins?',
    options: [
      'Port 80',
      'Port 21',
      'Port 443',
      'Port 22'
    ],
    correctAnswerIdx: 3, // Port 22
    hint: 'Port 80 is HTTP, 443 is HTTPS, 21 is FTP, and this port is commonly used for secure terminal access.'
  },
  {
    id: 5,
    topic: 'Authentication',
    text: 'Which of the following represents a valid multi-factor authentication (MFA) combination?',
    options: [
      'A master password and a security PIN',
      'A password and a physical hardware token',
      'Two different passwords stored in a password manager',
      'Your username and a master password'
    ],
    correctAnswerIdx: 1, // A password and a physical hardware token
    hint: 'MFA requires choosing credentials from different categories: something you know, something you have, or something you are.'
  },
  {
    id: 6,
    topic: 'Authentication',
    text: 'What is the primary vulnerability associated with using weak or duplicate passwords across multiple services?',
    options: [
      'SQL Injection attacks',
      'Cross-Site Scripting (XSS)',
      'Credential Stuffing',
      'Buffer Overflow exploits'
    ],
    correctAnswerIdx: 2, // Credential Stuffing
    hint: 'If attackers breach one database, they will try those same credential combinations automatically on dozens of other portals.'
  },
  {
    id: 7,
    topic: 'Incident Response',
    text: 'Which phase of the incident response lifecycle focuses on stopping an active threat from spreading further through the network?',
    options: [
      'Eradication',
      'Containment',
      'Lessons Learned',
      'Preparation'
    ],
    correctAnswerIdx: 1, // Containment
    hint: 'Think of isolating a fire to a single room so it does not burn down the rest of the facility.'
  },
  {
    id: 8,
    topic: 'Incident Response',
    text: 'Why is it critical to isolate a compromised workstation from the local network during a malware incident?',
    options: [
      'To speed up the download of operating system recovery patches',
      'To prevent the malware from moving laterally and spreading to other systems',
      'To initiate automatic cloud backups of the user local directory',
      'To automatically decrypt all compromised folders on the hard drive'
    ],
    correctAnswerIdx: 1, // To prevent the malware from moving laterally...
    hint: 'Worms and ransomware attempt to scan and attack neighboring IP addresses immediately upon infection.'
  }
];

export default function SecurityQuizzesPage() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Tracks answer indexes selected per question (-1 or null for unanswered)
  const [selections, setSelections] = useState(Array(8).fill(null));
  const [taskStatus, setTaskStatus] = useState(Array(8).fill('unsubmitted')); // 'unsubmitted' | 'correct' | 'incorrect'
  const [hintsExpanded, setHintsExpanded] = useState(Array(8).fill(false));

  // Running Score Tracker
  const answeredCount = selections.filter(sel => sel !== null).length;
  const correctCount = taskStatus.filter(status => status === 'correct').length;
  const isLabComplete = answeredCount === 8;

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerActive && !isLabComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isLabComplete]);

  // Save to local storage on completion
  useEffect(() => {
    if (isLabComplete) {
      setTimerActive(false);
      localStorage.setItem('qcf_lab_score_security-quizzes', JSON.stringify({
        score: correctCount,
        maxScore: 8,
        completed: true,
        timeTaken: timeElapsed
      }));
    }
  }, [isLabComplete, correctCount, timeElapsed]);

  const handleOptionSelect = (qIdx, optIdx) => {
    // If already answered, ignore further clicks
    if (selections[qIdx] !== null) return;

    const newSelections = [...selections];
    newSelections[qIdx] = optIdx;
    setSelections(newSelections);

    const isCorrect = optIdx === QUESTIONS_DATA[qIdx].correctAnswerIdx;
    const newStatuses = [...taskStatus];
    newStatuses[qIdx] = isCorrect ? 'correct' : 'incorrect';
    setTaskStatus(newStatuses);
  };

  const toggleHint = (idx) => {
    const newHints = [...hintsExpanded];
    newHints[idx] = !newHints[idx];
    setHintsExpanded(newHints);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-6xl mx-auto w-full pb-12">
      
      {/* Top Breadcrumb Header */}
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <Link 
          to="/labs"
          className="flex items-center gap-1.5 text-xs font-mono font-semibold text-text-secondary hover:text-accent-cyan cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO LABS
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-muted">CLASSIFIED ACCESS:</span>
          <span className="font-mono text-xs text-accent-violet font-bold">LEVEL II THEORY</span>
        </div>
      </div>

      {/* Lab Header Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glassmorphism border border-border-subtle rounded-card">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-accent-violet bg-accent-violet/10 px-2 py-0.5 border border-accent-violet/20 rounded-full">
              THEORY
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              v1.0 · Calibrated
            </span>
          </div>
          <h1 className="text-xl font-display font-bold text-text-primary">
            Security Quizzes
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl font-ui">
            Validate your understanding of cryptography, networking fundamentals, authentication systems, and incident response methodology.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex gap-4 shrink-0 font-mono">
          <div className="p-3 bg-bg-secondary/45 border border-border-subtle rounded-btn flex flex-col items-center min-w-[90px]">
            <span className="text-[9px] text-text-muted">ELAPSED TIME</span>
            <span className="text-sm font-bold text-text-primary mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent-cyan" />
              {formatTime(timeElapsed)}
            </span>
          </div>
          <div className="p-3 bg-bg-secondary/45 border border-border-subtle rounded-btn flex flex-col items-center min-w-[90px]">
            <span className="text-[9px] text-text-muted">ANSWERS</span>
            <span className="text-sm font-bold text-text-primary mt-1">
              {answeredCount} / 8 COMPLETE
            </span>
          </div>
        </div>
      </div>

      {!isLabComplete ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Left Column: Progress Dashboard Card */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              QUIZ OVERVIEW
            </span>

            <Card className="p-5 border border-border-subtle bg-bg-secondary/40 flex flex-col gap-5 sticky top-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border-subtle/50">
                <BookOpen className="w-5 h-5 text-accent-violet" />
                <h3 className="text-sm font-display font-bold text-text-primary uppercase tracking-wide">
                  Theory Evaluation
                </h3>
              </div>

              {/* Progress Summary bar */}
              <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                <div className="flex justify-between text-text-secondary font-bold">
                  <span>OVERALL COMPLETION</span>
                  <span>{Math.round((answeredCount / 8) * 100)}%</span>
                </div>
                <div className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden border border-border-subtle/30">
                  <div 
                    className="bg-accent-violet h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(answeredCount / 8) * 100}%` }}
                  />
                </div>
              </div>

              {/* Individual Question Status Board */}
              <div className="flex flex-col gap-2.5 font-mono text-[11px] pt-1">
                <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">
                  EVALUATION MATRIX
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {QUESTIONS_DATA.map((q, idx) => {
                    let bg = 'bg-bg-tertiary border-border-subtle text-text-muted';
                    let label = idx + 1;

                    if (taskStatus[idx] === 'correct') {
                      bg = 'bg-status-success/15 border-status-success/40 text-status-success';
                    } else if (taskStatus[idx] === 'incorrect') {
                      bg = 'bg-status-critical/15 border-status-critical/40 text-status-critical';
                    } else if (selections[idx] !== null) {
                      bg = 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan';
                    }

                    return (
                      <a 
                        key={q.id}
                        href={`#quiz-question-${q.id}`}
                        className={`p-2 border rounded-md text-center font-bold transition-all duration-200 hover:scale-[1.05] ${bg}`}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Information disclaimer */}
              <div className="p-3 bg-bg-primary/45 border border-border-subtle/50 rounded-md flex gap-2.5 items-start">
                <Shield className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-text-secondary">
                  Foundational questions covering cryptography, networks, secure access, and triage protocols. Click any matrix block to jump to that question card.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Multiple Choice Cards (Scrollable List) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              EVALUATION SHEETS
            </span>

            <div className="flex flex-col gap-5">
              {QUESTIONS_DATA.map((q, qIdx) => {
                const isAnswered = selections[qIdx] !== null;
                const status = taskStatus[qIdx];
                
                let cardBorderClass = 'border-border-subtle bg-bg-secondary/40';
                if (status === 'correct') {
                  cardBorderClass = 'border-status-success/30 bg-status-success/5';
                } else if (status === 'incorrect') {
                  cardBorderClass = 'border-status-critical/30 bg-status-critical/5';
                }

                return (
                  <Card 
                    key={q.id} 
                    id={`quiz-question-${q.id}`}
                    className={`p-5 border transition-all duration-300 flex flex-col gap-3.5 scroll-mt-6 ${cardBorderClass}`}
                  >
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold text-accent-violet flex items-center gap-1.5">
                        <span className="text-text-muted">{q.id.toString().padStart(2, '0')}.</span>
                        {q.topic.toUpperCase()}
                      </span>
                      <Badge variant={status === 'correct' ? 'success' : status === 'incorrect' ? 'critical' : 'default'}>
                        {status === 'correct' ? 'VERIFIED' : status === 'incorrect' ? 'FAILED' : 'PENDING'}
                      </Badge>
                    </div>

                    {/* Question prompt */}
                    <h3 className="text-sm font-display font-medium text-text-primary leading-snug">
                      {q.text}
                    </h3>

                    {/* Options list */}
                    <div className="flex flex-col gap-2 pt-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selections[qIdx] === optIdx;
                        const isCorrectAnswer = optIdx === q.correctAnswerIdx;
                        
                        let btnStyle = 'border-border-subtle bg-bg-primary/30 text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary';
                        let checkIcon = null;

                        if (isAnswered) {
                          if (isCorrectAnswer) {
                            btnStyle = 'border-status-success bg-status-success/10 text-status-success';
                            checkIcon = <Check className="w-3.5 h-3.5 text-status-success shrink-0" />;
                          } else if (isSelected) {
                            btnStyle = 'border-status-critical bg-status-critical/10 text-status-critical';
                            checkIcon = <X className="w-3.5 h-3.5 text-status-critical shrink-0" />;
                          } else {
                            btnStyle = 'border-border-subtle/30 bg-bg-primary/10 text-text-muted opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleOptionSelect(qIdx, optIdx)}
                            disabled={isAnswered}
                            className={`w-full p-3 text-left text-xs font-ui rounded-btn border transition-all duration-200 flex items-center justify-between gap-3 ${btnStyle} ${!isAnswered ? 'cursor-pointer hover:scale-[1.005]' : 'cursor-default'}`}
                          >
                            <span>{opt}</span>
                            {checkIcon}
                          </button>
                        );
                      })}
                    </div>

                    {/* Hint section */}
                    <div className="text-[10px] font-ui border-t border-border-subtle/30 pt-3 mt-1.5">
                      <button
                        onClick={() => toggleHint(qIdx)}
                        className="text-text-muted hover:text-text-secondary flex items-center gap-1.5 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-text-muted" />
                        {hintsExpanded[qIdx] ? 'Hide Hint' : 'Need Hint?'}
                      </button>
                      {hintsExpanded[qIdx] && (
                        <p className="mt-2 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                          {q.hint}
                        </p>
                      )}
                    </div>

                  </Card>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Results screen panel */
        <div className="max-w-xl mx-auto w-full py-8">
          <Card className="p-8 border border-status-success/30 bg-status-success/5 flex flex-col items-center text-center gap-6 relative overflow-hidden">
            
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-status-success/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-4 bg-status-success/15 border border-status-success/30 rounded-full text-status-success animate-bounce">
              <Award className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-display font-bold text-text-primary">
                Evaluation Synced
              </h2>
              <span className="font-mono text-xs text-status-success tracking-widest font-bold">
                SECURITY DOSSIER ARCHIVED
              </span>
            </div>

            <div className="h-[1px] bg-border-subtle w-full my-1" />

            <p className="text-xs font-ui text-text-secondary leading-relaxed max-w-sm">
              Excellent job, Sentinel! You&apos;ve verified your foundational security knowledge. Cryptographic functions, HTTP headers, authentication workflows, and incident isolation protocols have been cataloged in your progress matrix.
            </p>

            <div className="grid grid-cols-3 gap-3.5 w-full font-mono text-xs mt-2">
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">SCORE</span>
                <span className="text-sm font-bold text-accent-cyan mt-1">
                  {correctCount} / 8
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">ELAPSED TIME</span>
                <span className="text-sm font-bold text-text-primary mt-1">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">ACCURACY</span>
                <span className="text-sm font-bold text-status-success mt-1">
                  {Math.round((correctCount / 8) * 100)}%
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-status-success/5 border border-status-success/10 rounded-btn flex gap-3 items-center w-full text-left font-ui">
              <Badge variant="violet" className="text-[8px] shrink-0 font-mono">VERIFIED</Badge>
              <p className="text-[11px] text-text-secondary leading-normal">
                Evaluation signature validated. Theoretical security competence level meets security protocols.
              </p>
            </div>

            <Link to="/labs" className="w-full mt-4">
              <Button
                variant="primary"
                size="md"
                className="w-full font-mono font-semibold"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                RETURN TO LABS CATALOG
              </Button>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
