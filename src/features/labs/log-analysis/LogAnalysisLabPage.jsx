import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSentinel } from '@/context/SentinelProgressContext';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { 
  playTerminalBoot, playMissionComplete 
} from '@/features/academy/utils/audioSynth';
import { 
  Terminal, Search, Clock, Award, CheckCircle2, 
  ArrowLeft, HelpCircle, ChevronUp, ChevronDown, 
  ShieldAlert
} from 'lucide-react';

const AUTH_LOG_DATA = [
  { id: 1, text: "Jul 31 09:12:01 secure-host CRON[12450]: pam_unix(cron:session): session opened for user root by (uid=0)", type: "info" },
  { id: 2, text: "Jul 31 09:12:02 secure-host CRON[12450]: pam_unix(cron:session): session closed for user root", type: "info" },
  { id: 3, text: "Jul 31 09:44:15 secure-host sshd[12510]: Invalid user admin from 198.51.100.72 port 43210 ssh2", type: "error" },
  { id: 4, text: "Jul 31 09:44:15 secure-host sshd[12510]: Failed password for invalid user admin from 198.51.100.72 port 43210 ssh2", type: "error" },
  { id: 5, text: "Jul 31 09:44:18 secure-host sshd[12512]: Invalid user test from 198.51.100.72 port 43212 ssh2", type: "error" },
  { id: 6, text: "Jul 31 09:44:18 secure-host sshd[12512]: Failed password for invalid user test from 198.51.100.72 port 43212 ssh2", type: "error" },
  { id: 7, text: "Jul 31 09:44:21 secure-host sshd[12514]: Failed password for root from 198.51.100.72 port 43214 ssh2", type: "error" },
  { id: 8, text: "Jul 31 09:44:25 secure-host sshd[12516]: Failed password for root from 198.51.100.72 port 43216 ssh2", type: "error" },
  { id: 9, text: "Jul 31 09:44:30 secure-host sshd[12518]: Failed password for root from 198.51.100.72 port 43218 ssh2", type: "error" },
  { id: 10, text: "Jul 31 09:45:02 secure-host sshd[12520]: Accepted password for service-portal from 198.51.100.72 port 43220 ssh2", type: "success" },
  { id: 11, text: "Jul 31 09:45:02 secure-host sshd[12520]: pam_unix(sshd:session): session opened for user service-portal by (uid=0)", type: "success" },
  { id: 12, text: "Jul 31 09:45:05 secure-host systemd: pam_unix(systemd-user:session): session opened for user service-portal by (uid=0)", type: "info" },
  { id: 13, text: "Jul 31 09:47:11 secure-host sudo[12560]: service-portal : TTY=pts/0 ; PWD=/home/service-portal ; USER=root ; COMMAND=/bin/bash", type: "command" },
  { id: 14, text: "Jul 31 09:47:11 secure-host pam_unix(sudo:session): session opened for user root by (uid=0)", type: "success" },
  { id: 15, text: "Jul 31 09:48:22 secure-host useradd[12590]: new user: name=backdoor, UID=1001, GID=1001, home=/home/backdoor, shell=/bin/bash", type: "command" },
  { id: 16, text: "Jul 31 09:48:30 secure-host passwd[12592]: pam_unix(passwd:chauthtok): password changed for backdoor", type: "command" },
  { id: 17, text: "Jul 31 09:49:15 secure-host usermod[12601]: add 'backdoor' to group 'sudo'", type: "command" },
  { id: 18, text: "Jul 31 09:50:01 secure-host sudo[12560]: pam_unix(sudo:session): session closed for user root", type: "info" },
  { id: 19, text: "Jul 31 09:50:05 secure-host sshd[12520]: pam_unix(sshd:session): session closed for user service-portal", type: "info" },
  { id: 20, text: "Jul 31 10:00:01 secure-host CRON[12650]: pam_unix(cron:session): session opened for user root by (uid=0)", type: "info" },
  { id: 21, text: "Jul 31 10:00:02 secure-host CRON[12650]: pam_unix(cron:session): session closed for user root", type: "info" }
];

export default function LogAnalysisLabPage() {
  const { completeMission } = useSentinel();

  // Lab tracking states
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Task answers and statuses
  const [answers, setAnswers] = useState({
    task1: '',
    task2: '',
    task3: ''
  });
  
  const [taskStatus, setTaskStatus] = useState({
    task1: 'unsubmitted', // 'unsubmitted' | 'correct' | 'incorrect'
    task2: 'unsubmitted',
    task3: 'unsubmitted',
    task4: 'unsubmitted'
  });

  const [hints, setHints] = useState({
    task1: false,
    task2: false,
    task3: false,
    task4: false
  });

  // Reorderable timeline sequence state (initial shuffled state)
  const [timelineItems, setTimelineItems] = useState([
    { id: 'sudo', label: 'Privilege escalation via sudo spawn of an interactive root shell', correctOrder: 2 },
    { id: 'bruteforce', label: 'SSH password brute-force attack originating from external IP', correctOrder: 0 },
    { id: 'backdoor', label: 'Creation and promotion of a persistence backdoor account', correctOrder: 3 },
    { id: 'login', label: 'Successful authentication into the \'service-portal\' account', correctOrder: 1 }
  ]);

  // Boot sound on mount
  useEffect(() => {
    playTerminalBoot();
  }, []);

  // Running score
  const currentScore = Object.values(taskStatus).filter(status => status === 'correct').length;
  const isLabComplete = currentScore === 4;

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && !isLabComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isLabComplete]);

  // Completion effect: saves results to context and localStorage
  useEffect(() => {
    if (isLabComplete) {
      setTimerActive(false);
      playMissionComplete();
      
      // Save local score details
      localStorage.setItem('qcf_lab_score_log-analysis', JSON.stringify({
        score: 4,
        maxScore: 4,
        completed: true,
        timeTaken: timeElapsed
      }));

      // Log completion in global Sentinel progress (XP + Badge reward)
      completeMission('log-analysis', 1.0, 0.75, 150);
    }
  }, [isLabComplete, timeElapsed, completeMission]);

  // Timeline ordering helpers
  const moveItem = (index, direction) => {
    if (taskStatus.task4 === 'correct') return;
    const newItems = [...timelineItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    
    setTimelineItems(newItems);
  };

  // Validators
  const verifyTask1 = () => {
    const isCorrect = answers.task1.trim() === '198.51.100.72';
    setTaskStatus(prev => ({ ...prev, task1: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask2 = () => {
    const isCorrect = answers.task2.trim().toLowerCase() === 'service-portal';
    setTaskStatus(prev => ({ ...prev, task2: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask3 = () => {
    const isCorrect = answers.task3.trim() === '09:47:11';
    setTaskStatus(prev => ({ ...prev, task3: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask4 = () => {
    // Correct sequence is: bruteforce (0), login (1), sudo (2), backdoor (3)
    const isCorrect = 
      timelineItems[0].id === 'bruteforce' &&
      timelineItems[1].id === 'login' &&
      timelineItems[2].id === 'sudo' &&
      timelineItems[3].id === 'backdoor';
    
    setTaskStatus(prev => ({ ...prev, task4: isCorrect ? 'correct' : 'incorrect' }));
  };

  // Helper to format logs with syntax coloring
  const highlightLine = (text) => {
    if (text.includes('Failed password') || text.includes('Invalid user')) {
      return (
        <span>
          {text.split(/(Failed password|Invalid user)/).map((part, i) => {
            if (part === 'Failed password' || part === 'Invalid user') {
              return <span key={i} className="text-status-critical font-semibold">{part}</span>;
            }
            return part;
          })}
        </span>
      );
    }
    if (text.includes('Accepted password') || text.includes('session opened')) {
      return (
        <span>
          {text.split(/(Accepted password|session opened)/).map((part, i) => {
            if (part === 'Accepted password' || part === 'session opened') {
              return <span key={i} className="text-status-success font-semibold">{part}</span>;
            }
            return part;
          })}
        </span>
      );
    }
    if (text.includes('COMMAND=')) {
      return (
        <span>
          {text.split(/(COMMAND=.*)/).map((part, i) => {
            if (part.startsWith('COMMAND=')) {
              return <span key={i} className="text-accent-cyan font-semibold">{part}</span>;
            }
            return part;
          })}
        </span>
      );
    }
    if (text.includes('new user:')) {
      return (
        <span>
          {text.split(/(new user:.*)/).map((part, i) => {
            if (part.startsWith('new user:')) {
              return <span key={i} className="text-accent-violet font-semibold">{part}</span>;
            }
            return part;
          })}
        </span>
      );
    }
    return text;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredLogs = AUTH_LOG_DATA.filter(log => 
    log.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <span className="font-mono text-xs text-accent-violet font-bold">LEVEL II SANDBOX</span>
        </div>
      </div>

      {/* Lab Header Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glassmorphism border border-border-subtle rounded-card">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-accent-violet bg-accent-violet/10 px-2 py-0.5 border border-accent-violet/20 rounded-full">
              ANALYSIS
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              v1.0 · Calibrated
            </span>
          </div>
          <h1 className="text-xl font-display font-bold text-text-primary">
            Log Analysis Lab
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl font-ui">
            Analyze Linux security logs (`/var/log/auth.log`) to piece together a successful external brute force and subsequent privilege escalation exploit.
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
            <span className="text-[9px] text-text-muted">LAB SCORE</span>
            <span className="text-sm font-bold text-text-primary mt-1">
              {currentScore} / 4 VERIFIED
            </span>
          </div>
        </div>
      </div>

      {!isLabComplete ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Column: Simulated Linux auth.log Terminal */}
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-accent-cyan" /> SIMULATED LOG TELEMETRY
              </span>
              <span className="font-mono text-[9px] text-text-muted">
                File: `/var/log/auth.log`
              </span>
            </div>

            {/* Terminal Container */}
            <div className="flex-1 flex flex-col rounded-card border border-border-subtle bg-bg-secondary/15 overflow-hidden min-h-[460px] max-h-[580px]">
              
              {/* Terminal Window Header Bar */}
              <div className="bg-bg-tertiary px-4 py-2.5 border-b border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-critical/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-status-warning/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-status-success/80"></span>
                  <span className="text-[10px] font-mono text-text-muted ml-2">bash - auth.log investigation</span>
                </div>
                
                {/* Search / Filter input inside terminal */}
                <div className="relative w-44 sm:w-56">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3 w-3 text-text-muted" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="grep filter logs..."
                    className="w-full pl-7 pr-3 py-1 text-[10px] font-mono bg-bg-primary border border-border-subtle rounded-md text-text-primary placeholder-text-muted/60 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-text-primary text-[10px] font-mono cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Log List View */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] leading-relaxed bg-bg-primary/20 scrollbar-thin select-text">
                {filteredLogs.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="flex items-start hover:bg-bg-tertiary/20 py-0.5 px-1 rounded-sm group">
                        <span className="text-text-muted/50 w-6 select-none text-right pr-2 border-r border-border-subtle/30 mr-2">
                          {log.id}
                        </span>
                        <span className="text-text-secondary/95 break-all">
                          {highlightLine(log.text)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center text-xs text-text-muted gap-2">
                    <ShieldAlert className="w-8 h-8 text-status-critical/60" />
                    <span>No record match found for grep filter &ldquo;{searchTerm}&rdquo;</span>
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="text-accent-cyan hover:underline font-mono text-[10px] cursor-pointer mt-1"
                    >
                      [RESET FILTER]
                    </button>
                  </div>
                )}
              </div>
              
              {/* Terminal Footer */}
              <div className="bg-bg-tertiary/50 px-4 py-1.5 border-t border-border-subtle/50 flex justify-between items-center text-[9px] font-mono text-text-muted">
                <span>Showing {filteredLogs.length} of {AUTH_LOG_DATA.length} log lines</span>
                <span>ESC to abort sandbox</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Questions Board */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              INVESTIGATION TASKS
            </span>

            <div className="flex flex-col gap-4">
              
              {/* Task 1: Attacker IP */}
              <Card className={`p-4 border transition-colors ${
                taskStatus.task1 === 'correct' 
                  ? 'border-status-success/30 bg-status-success/5' 
                  : taskStatus.task1 === 'incorrect'
                    ? 'border-status-critical/30 bg-status-critical/5'
                    : 'border-border-subtle bg-bg-secondary/40'
              }`}>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <span className="text-accent-violet">01.</span> ATTACKER SOURCE IP
                    </span>
                    <Badge variant={taskStatus.task1 === 'correct' ? 'success' : taskStatus.task1 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task1 === 'correct' ? 'VERIFIED' : taskStatus.task1 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Identify the external IP address attempting invalid SSH credentials and password brute forcing.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task1}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task1: e.target.value }))}
                      disabled={taskStatus.task1 === 'correct'}
                      placeholder="e.g. 192.168.0.1"
                      className="flex-1 px-3 py-1.5 text-xs font-mono bg-bg-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:border-accent-cyan disabled:opacity-50"
                    />
                    <Button
                      variant={taskStatus.task1 === 'correct' ? 'success' : 'outline'}
                      size="sm"
                      onClick={verifyTask1}
                      disabled={taskStatus.task1 === 'correct' || !answers.task1.trim()}
                    >
                      {taskStatus.task1 === 'correct' ? 'SOLVED' : 'VERIFY'}
                    </Button>
                  </div>

                  {/* Hint Toggle */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task1: !prev.task1 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task1 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task1 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        Look closely at the `sshd` failure lines (line 3 to 9). Identify the consistent external IP address from which these failures originate.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 2: Compromised Account */}
              <Card className={`p-4 border transition-colors ${
                taskStatus.task2 === 'correct' 
                  ? 'border-status-success/30 bg-status-success/5' 
                  : taskStatus.task2 === 'incorrect'
                    ? 'border-status-critical/30 bg-status-critical/5'
                    : 'border-border-subtle bg-bg-secondary/40'
              }`}>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <span className="text-accent-violet">02.</span> COMPROMISED USER
                    </span>
                    <Badge variant={taskStatus.task2 === 'correct' ? 'success' : taskStatus.task2 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task2 === 'correct' ? 'VERIFIED' : taskStatus.task2 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Determine which local account user was successfully hijacked by the attacker.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task2}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task2: e.target.value }))}
                      disabled={taskStatus.task2 === 'correct'}
                      placeholder="e.g. system-user"
                      className="flex-1 px-3 py-1.5 text-xs font-mono bg-bg-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:border-accent-cyan disabled:opacity-50"
                    />
                    <Button
                      variant={taskStatus.task2 === 'correct' ? 'success' : 'outline'}
                      size="sm"
                      onClick={verifyTask2}
                      disabled={taskStatus.task2 === 'correct' || !answers.task2.trim()}
                    >
                      {taskStatus.task2 === 'correct' ? 'SOLVED' : 'VERIFY'}
                    </Button>
                  </div>

                  {/* Hint Toggle */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task2: !prev.task2 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task2 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task2 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        Type `Accepted` in the terminal&apos;s search bar to filter only lines with successful authentication. The user account name follows `Accepted password for ...`
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 3: Sudo Privilege Escalation Timestamp */}
              <Card className={`p-4 border transition-colors ${
                taskStatus.task3 === 'correct' 
                  ? 'border-status-success/30 bg-status-success/5' 
                  : taskStatus.task3 === 'incorrect'
                    ? 'border-status-critical/30 bg-status-critical/5'
                    : 'border-border-subtle bg-bg-secondary/40'
              }`}>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <span className="text-accent-violet">03.</span> PRIVILEGE ESCALATION TIME
                    </span>
                    <Badge variant={taskStatus.task3 === 'correct' ? 'success' : taskStatus.task3 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task3 === 'correct' ? 'VERIFIED' : taskStatus.task3 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Locate the exact timestamp when the attacker executed a sudo-level bash process (Format: `HH:MM:SS`).
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task3}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task3: e.target.value }))}
                      disabled={taskStatus.task3 === 'correct'}
                      placeholder="HH:MM:SS"
                      className="flex-1 px-3 py-1.5 text-xs font-mono bg-bg-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:border-accent-cyan disabled:opacity-50"
                    />
                    <Button
                      variant={taskStatus.task3 === 'correct' ? 'success' : 'outline'}
                      size="sm"
                      onClick={verifyTask3}
                      disabled={taskStatus.task3 === 'correct' || !answers.task3.trim()}
                    >
                      {taskStatus.task3 === 'correct' ? 'SOLVED' : 'VERIFY'}
                    </Button>
                  </div>

                  {/* Hint Toggle */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task3: !prev.task3 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task3 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task3 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        Use search keyword `COMMAND=/bin/bash` or `sudo` to find the logs related to privileged escalation. Look at the timestamp on that specific matching line.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 4: Reorder Intrusion Timeline */}
              <Card className={`p-4 border transition-colors ${
                taskStatus.task4 === 'correct' 
                  ? 'border-status-success/30 bg-status-success/5' 
                  : taskStatus.task4 === 'incorrect'
                    ? 'border-status-critical/30 bg-status-critical/5'
                    : 'border-border-subtle bg-bg-secondary/40'
              }`}>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <span className="text-accent-violet">04.</span> INTRUSION TIMELINE SEQUENCE
                    </span>
                    <Badge variant={taskStatus.task4 === 'correct' ? 'success' : taskStatus.task4 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task4 === 'correct' ? 'VERIFIED' : taskStatus.task4 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Arrange the events chronologically from top (first event) to bottom (last event) using the navigation arrows, then verify the sequence.
                  </p>

                  {/* Timeline Ordering List */}
                  <div className="flex flex-col gap-2 my-1">
                    {timelineItems.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2.5 border border-border-subtle/60 bg-bg-primary/30 rounded-md gap-3 hover:border-accent-cyan/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-accent-cyan bg-accent-cyan/10 w-5 h-5 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] text-text-secondary font-ui leading-normal">
                            {item.label}
                          </span>
                        </div>
                        
                        {/* Control Buttons */}
                        {taskStatus.task4 !== 'correct' && (
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => moveItem(idx, 'up')}
                              disabled={idx === 0}
                              className="p-0.5 text-text-muted hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem(idx, 'down')}
                              disabled={idx === timelineItems.length - 1}
                              className="p-0.5 text-text-muted hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant={taskStatus.task4 === 'correct' ? 'success' : 'outline'}
                      size="sm"
                      onClick={verifyTask4}
                      disabled={taskStatus.task4 === 'correct'}
                    >
                      {taskStatus.task4 === 'correct' ? 'SOLVED' : 'VERIFY SEQUENCE'}
                    </Button>
                  </div>

                  {/* Hint Toggle */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task4: !prev.task4 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task4 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task4 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        Order matches timestamps: Brute force starts first (`09:44:15`), password is accepted (`09:45:02`), privilege escalation sudo bash starts (`09:47:11`), and backdoor is created (`09:48:22`).
                      </p>
                    )}
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto w-full py-8">
          <Card className="p-8 border border-status-success/30 bg-status-success/5 flex flex-col items-center text-center gap-6 relative overflow-hidden">
            
            {/* Background decoration glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-status-success/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-4 bg-status-success/15 border border-status-success/30 rounded-full text-status-success animate-bounce">
              <Award className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-display font-bold text-text-primary">
                Simulation Verified
              </h2>
              <span className="font-mono text-xs text-status-success tracking-widest font-bold">
                LOG INTELLIGENCE ACQUIRED
              </span>
            </div>

            <div className="h-[1px] bg-border-subtle w-full my-1" />

            <p className="text-xs font-ui text-text-secondary leading-relaxed max-w-sm">
              Excellent investigation, Sentinel! You&apos;ve traced the brute force attacker, found the hijacked account, mapped out the timeline, and pinpointed the privilege escalation. The digital forensic timeline is successfully recorded.
            </p>

            <div className="grid grid-cols-3 gap-3.5 w-full font-mono text-xs mt-2">
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">XP AWARDED</span>
                <span className="text-sm font-bold text-accent-cyan mt-1">
                  +150 XP
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">INVESTIGATION TIME</span>
                <span className="text-sm font-bold text-text-primary mt-1">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">ACCURACY</span>
                <span className="text-sm font-bold text-status-success mt-1">
                  100%
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-accent-violet/5 border border-accent-violet/10 rounded-btn flex gap-3 items-center w-full text-left font-ui">
              <Badge variant="violet" className="text-[8px] shrink-0 font-mono">DISTINCTION</Badge>
              <p className="text-[11px] text-text-secondary leading-normal">
                Forensics dossier signed. Credential validation hashes synced with Sentinel command nodes.
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
