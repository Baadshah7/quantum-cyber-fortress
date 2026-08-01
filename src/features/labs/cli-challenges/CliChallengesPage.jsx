import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { 
  Terminal as TerminalIcon, Clock, Award, CheckCircle2, 
  ArrowLeft, HelpCircle, ChevronUp, ChevronDown, 
  Folder, FileText
} from 'lucide-react';

export default function CliChallengesPage() {
  // Lab timing and state
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

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

  // Reorderable command timeline sequence (Task 4)
  const [timelineItems, setTimelineItems] = useState([
    { id: 'chmod', label: 'Grant read access: "chmod +r restricted.log"', correctOrder: 2 },
    { id: 'ls', label: 'List files including hidden ones: "ls -a"', correctOrder: 0 },
    { id: 'cat', label: 'Print file content to terminal: "cat restricted.log"', correctOrder: 3 },
    { id: 'cd', label: 'Change directory to subdirectory: "cd network"', correctOrder: 1 }
  ]);

  // Terminal history & current working directory state
  const [cwd, setCwd] = useState('/home/sentinel');
  const [inputValue, setInputValue] = useState('');
  
  const [filesystem, setFilesystem] = useState({
    '/': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root' },
    '/home': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root' },
    '/home/sentinel': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'sentinel' },
    '/home/sentinel/.shadow_agent': { type: 'file', permissions: '-rw-r--', owner: 'sentinel', content: 'AGENT_SIGMA_2026' },
    '/home/sentinel/secure_notes.txt': { type: 'file', permissions: '-rw-r--r--', owner: 'sentinel', content: 'Welcome Sentinel. Use "ls -a" to show hidden files. Subdirectories may contain config logs.' },
    '/home/sentinel/network': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'sentinel' },
    '/home/sentinel/network/routing.cfg': { type: 'file', permissions: '-rw-r--r--', owner: 'sentinel', content: 'GATEWAY=10.0.0.1\nIP_ADDR=10.0.0.15\nDNS=8.8.8.8' },
    '/home/sentinel/network/restricted.log': { type: 'file', permissions: '---------', owner: 'root', content: 'FORTRESS{chmod_777_unlocked_99}' }
  });

  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'text', text: 'Quantum Cyber Fortress (TM) Secure CLI Simulator [Version 1.0.4]' },
    { type: 'text', text: '(C) 2026 Baadshah7. All rights reserved.' },
    { type: 'text', text: '' },
    { type: 'text', text: 'Initializing terminal session for user: sentinel' },
    { type: 'text', text: 'Type "help" to view available commands.' },
    { type: 'text', text: '' }
  ]);

  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal history to bottom
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Focus input on mounting
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Running score
  const currentScore = Object.values(taskStatus).filter(status => status === 'correct').length;
  const isLabComplete = currentScore === 4;

  // Running timer
  useEffect(() => {
    let interval = null;
    if (timerActive && !isLabComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isLabComplete]);

  // Completion triggers saving of best score (low-risk localStorage matching Packet Sandbox)
  useEffect(() => {
    if (isLabComplete) {
      setTimerActive(false);
      localStorage.setItem('qcf_lab_score_cli-challenges', JSON.stringify({
        score: 4,
        maxScore: 4,
        completed: true,
        timeTaken: timeElapsed
      }));
    }
  }, [isLabComplete, timeElapsed]);

  // Normalize path resolver
  const resolveAndNormalizePath = (targetPath) => {
    let resolved = '';
    if (targetPath.startsWith('/')) {
      resolved = targetPath;
    } else {
      resolved = cwd === '/' ? '/' + targetPath : cwd + '/' + targetPath;
    }

    const parts = resolved.split('/');
    const stack = [];
    for (const part of parts) {
      if (part === '' || part === '.') continue;
      if (part === '..') {
        stack.pop();
      } else {
        stack.push(part);
      }
    }
    return '/' + stack.join('/');
  };

  // Command Execution Handler
  const executeCommand = (commandLine) => {
    const trimmed = commandLine.trim();
    if (!trimmed) return;

    // Display command input line in history
    const displayCwd = cwd === '/home/sentinel' ? '~' : cwd;
    setTerminalHistory(prev => [...prev, { type: 'input', text: trimmed, dir: displayCwd }]);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputLines = [];

    switch (cmd) {
      case 'help':
        outputLines = [
          { type: 'text', text: 'Quantum Cyber Fortress - Simulated Linux Shell v1.0' },
          { type: 'text', text: 'Available commands:' },
          { type: 'text', text: '  ls [-a]           List directory contents' },
          { type: 'text', text: '  cd <directory>    Change the working directory' },
          { type: 'text', text: '  pwd               Print name of current working directory' },
          { type: 'text', text: '  cat <file>        Concatenate files and print on standard output' },
          { type: 'text', text: '  chmod <mode> <f>  Change file mode bits (e.g. chmod +r filename)' },
          { type: 'text', text: '  help              Display this help menu' },
          { type: 'text', text: '  clear             Clear the terminal screen' }
        ];
        break;

      case 'clear':
        setTerminalHistory([]);
        return;

      case 'pwd':
        outputLines = [{ type: 'text', text: cwd }];
        break;

      case 'ls': {
        const showHidden = args.some(arg => arg.startsWith('-') && arg.includes('a'));
        const items = [];
        const prefix = cwd === '/' ? '/' : cwd + '/';

        for (const key of Object.keys(filesystem)) {
          if (key.startsWith(prefix) && key !== cwd) {
            const subPath = key.substring(prefix.length);
            if (!subPath.includes('/')) {
              const fileData = filesystem[key];
              const isHidden = subPath.startsWith('.');
              if (showHidden || !isHidden) {
                items.push({
                  name: subPath,
                  isDir: fileData.type === 'dir',
                  isHidden: isHidden
                });
              }
            }
          }
        }

        if (showHidden) {
          items.unshift(
            { name: '.', isDir: true, isHidden: true },
            { name: '..', isDir: true, isHidden: true }
          );
        }

        if (items.length > 0) {
          outputLines = [{ type: 'ls', items }];
        } else {
          outputLines = [];
        }
        break;
      }

      case 'cd': {
        const targetDir = args[0];
        if (!targetDir) {
          setCwd('/home/sentinel');
          return;
        }

        const normalized = resolveAndNormalizePath(targetDir);
        const targetObj = filesystem[normalized];
        if (targetObj && targetObj.type === 'dir') {
          setCwd(normalized);
        } else {
          outputLines = [{ type: 'error', text: `bash: cd: ${targetDir}: No such file or directory` }];
        }
        break;
      }

      case 'cat': {
        const targetFile = args[0];
        if (!targetFile) {
          outputLines = [{ type: 'error', text: 'cat: missing operand' }];
          break;
        }

        const normalized = resolveAndNormalizePath(targetFile);
        const fileObj = filesystem[normalized];

        if (!fileObj) {
          outputLines = [{ type: 'error', text: `cat: ${targetFile}: No such file or directory` }];
        } else if (fileObj.type === 'dir') {
          outputLines = [{ type: 'error', text: `cat: ${targetFile}: Is a directory` }];
        } else {
          const isReadable = fileObj.permissions !== '---------';
          if (!isReadable) {
            outputLines = [{ type: 'error', text: `cat: ${targetFile}: Permission denied` }];
          } else {
            outputLines = fileObj.content.split('\n').map(line => ({ type: 'text', text: line }));
          }
        }
        break;
      }

      case 'chmod': {
        const mode = args[0];
        const targetFile = args[1];

        if (!mode || !targetFile) {
          outputLines = [{ type: 'error', text: 'chmod: missing operand' }];
          break;
        }

        const normalized = resolveAndNormalizePath(targetFile);
        const fileObj = filesystem[normalized];

        if (!fileObj) {
          outputLines = [{ type: 'error', text: `chmod: cannot access '${targetFile}': No such file or directory` }];
        } else {
          // Checks if the mode contains '+r', 'u+r', 'a+r', 'r', or starts with digits 6 or 7
          const isReadableMode = 
            /^[67]\d\d$/.test(mode) || 
            mode.includes('+r') || 
            mode.includes('u+r') || 
            mode.includes('a+r') || 
            mode.includes('r');

          const newPermissions = isReadableMode ? '-rw-r--r--' : '---------';

          setFilesystem(prev => ({
            ...prev,
            [normalized]: {
              ...prev[normalized],
              permissions: newPermissions
            }
          }));

          // chmod is silent on success in Linux
          outputLines = [];
        }
        break;
      }

      default:
        outputLines = [{ type: 'error', text: `bash: ${cmd}: command not found` }];
    }

    if (outputLines.length > 0) {
      setTerminalHistory(prev => [...prev, ...outputLines]);
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    executeCommand(inputValue);
    setInputValue('');
  };

  const handleTerminalContainerClick = () => {
    inputRef.current?.focus();
  };

  // Timeline ordering helpers
  const moveItem = (index, direction) => {
    if (taskStatus.task4 === 'correct') return;
    const newItems = [...timelineItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setTimelineItems(newItems);
  };

  // Task Validators
  const verifyTask1 = () => {
    const isCorrect = answers.task1.trim().toLowerCase() === '.shadow_agent' || answers.task1.trim().toLowerCase() === 'shadow_agent';
    setTaskStatus(prev => ({ ...prev, task1: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask2 = () => {
    const isCorrect = answers.task2.trim().toLowerCase() === 'routing.cfg';
    setTaskStatus(prev => ({ ...prev, task2: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask3 = () => {
    const isCorrect = answers.task3.trim() === 'FORTRESS{chmod_777_unlocked_99}';
    setTaskStatus(prev => ({ ...prev, task3: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask4 = () => {
    const isCorrect = 
      timelineItems[0].id === 'ls' &&
      timelineItems[1].id === 'cd' &&
      timelineItems[2].id === 'chmod' &&
      timelineItems[3].id === 'cat';
    setTaskStatus(prev => ({ ...prev, task4: isCorrect ? 'correct' : 'incorrect' }));
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
          <span className="font-mono text-xs text-status-success font-bold">LEVEL II TERMINAL</span>
        </div>
      </div>

      {/* Lab Header Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glassmorphism border border-border-subtle rounded-card">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-status-success bg-status-success/10 px-2 py-0.5 border border-status-success/20 rounded-full">
              LINUX CLI
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              v1.0 · Calibrated
            </span>
          </div>
          <h1 className="text-xl font-display font-bold text-text-primary">
            CLI Challenges
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl font-ui">
            Navigate restricted Linux environments, locate hidden dotfiles, manipulate file permissions, and chain commands to acquire secure assets.
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
          
          {/* Left Column: Interactive Simulator Terminal */}
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-status-success" /> SIMULATED BASH TERMINAL
              </span>
              <span className="font-mono text-[9px] text-text-muted">
                System: `sentinel-fortress`
              </span>
            </div>

            {/* Terminal Window Container */}
            <div 
              onClick={handleTerminalContainerClick}
              className="flex-1 flex flex-col rounded-card border border-border-subtle bg-[#05070c] overflow-hidden min-h-[480px] max-h-[600px] cursor-text shadow-[0_0_24px_rgba(5,7,12,0.8)]"
            >
              
              {/* Header Bar */}
              <div className="bg-bg-tertiary px-4 py-2.5 border-b border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-critical/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-status-warning/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-status-success/80"></span>
                  <span className="text-[10px] font-mono text-text-muted ml-2">
                    bash — {cwd === '/home/sentinel' ? '~' : cwd}
                  </span>
                </div>
                <Badge variant="success" className="text-[8px] font-mono tracking-widest px-1.5 py-0.5">
                  SIMULATOR ONLINE
                </Badge>
              </div>

              {/* Terminal Output Stream */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed scrollbar-thin select-text bg-[#030508]/40">
                <div className="flex flex-col gap-1.5">
                  {terminalHistory.map((line, idx) => {
                    if (line.type === 'input') {
                      return (
                        <div key={idx} className="flex items-start">
                          <span className="text-text-muted select-none mr-1.5">sentinel@cyber-fortress:</span>
                          <span className="text-accent-violet font-semibold select-none mr-1.5">{line.dir}</span>
                          <span className="text-text-muted select-none mr-1.5">$</span>
                          <span className="text-text-primary break-all">{line.text}</span>
                        </div>
                      );
                    }
                    if (line.type === 'error') {
                      return (
                        <div key={idx} className="text-status-critical font-medium break-all">
                          {line.text}
                        </div>
                      );
                    }
                    if (line.type === 'ls') {
                      return (
                        <div key={idx} className="flex flex-wrap gap-x-5 py-0.5">
                          {line.items.map((item, i) => {
                            let colorClass = 'text-text-secondary';
                            let icon = <FileText className="w-3.5 h-3.5 inline mr-1 shrink-0" />;
                            
                            if (item.isDir) {
                              colorClass = 'text-accent-cyan font-bold';
                              icon = <Folder className="w-3.5 h-3.5 inline mr-1 text-accent-cyan/80 shrink-0" />;
                            } else if (item.isHidden) {
                              colorClass = 'text-text-muted font-medium italic';
                            }
                            
                            return (
                              <span key={i} className={`${colorClass} flex items-center`}>
                                {icon}
                                {item.name}
                              </span>
                            );
                          })}
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="text-text-secondary whitespace-pre-wrap break-all">
                        {line.text}
                      </div>
                    );
                  })}
                  <div ref={outputEndRef} />
                </div>
              </div>

              {/* Terminal Bottom Input Prompt */}
              <form 
                onSubmit={handleTerminalSubmit}
                className="bg-bg-primary/90 px-4 py-2 border-t border-border-subtle/50 flex items-center font-mono text-[11px]"
              >
                <span className="text-text-muted select-none mr-1.5">sentinel@cyber-fortress:</span>
                <span className="text-accent-violet font-semibold select-none mr-1.5">
                  {cwd === '/home/sentinel' ? '~' : cwd}
                </span>
                <span className="text-text-muted select-none mr-1.5">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='Try commands: ls, cd, pwd, cat, chmod...'
                  className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted/40 font-mono text-[11px] focus:ring-0 focus:outline-none"
                />
              </form>
            </div>
          </div>

          {/* Right Column: Investigation Tasks */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              CLI INVESTIGATION CHECKLIST
            </span>

            <div className="flex flex-col gap-4">
              
              {/* Task 1: Find Hidden File */}
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
                      <span className="text-status-success">01.</span> HIDDEN ASSET NAME
                    </span>
                    <Badge variant={taskStatus.task1 === 'correct' ? 'success' : taskStatus.task1 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task1 === 'correct' ? 'VERIFIED' : taskStatus.task1 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Find and report the exact file name of the hidden dotfile in the home directory (`/home/sentinel`).
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task1}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task1: e.target.value }))}
                      disabled={taskStatus.task1 === 'correct'}
                      placeholder="e.g. .hidden_file"
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

                  {/* Hint */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task1: !prev.task1 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task1 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task1 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        Standard directory listings (`ls`) hide files starting with `.`. Run `ls` with the `-a` option in the terminal to list all files.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 2: Subdirectory Navigation */}
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
                      <span className="text-status-success">02.</span> NETWORK CONFIG FILE
                    </span>
                    <Badge variant={taskStatus.task2 === 'correct' ? 'success' : taskStatus.task2 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task2 === 'correct' ? 'VERIFIED' : taskStatus.task2 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Navigate into the specific subdirectory and report the name of the configuration file inside it.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task2}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task2: e.target.value }))}
                      disabled={taskStatus.task2 === 'correct'}
                      placeholder="e.g. config.cfg"
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

                  {/* Hint */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task2: !prev.task2 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task2 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task2 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        Type `cd network` to change your shell directory to the subdirectory, then run `ls` to list the files inside it.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 3: Chmod & Read Flag */}
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
                      <span className="text-status-success">03.</span> SECURE DOSSIER TOKEN
                    </span>
                    <Badge variant={taskStatus.task3 === 'correct' ? 'success' : taskStatus.task3 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task3 === 'correct' ? 'VERIFIED' : taskStatus.task3 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Change the permissions of the restricted log file in the network folder to make it readable, then retrieve its contents.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task3}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task3: e.target.value }))}
                      disabled={taskStatus.task3 === 'correct'}
                      placeholder="FORTRESS{...}"
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

                  {/* Hint */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task3: !prev.task3 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task3 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task3 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        First make sure you are in the `/home/sentinel/network` directory. Run `chmod +r restricted.log` or `chmod 644 restricted.log` to make it readable, then run `cat restricted.log` to print the contents.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 4: Command sequence ordering */}
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
                      <span className="text-status-success">04.</span> CHRONOLOGICAL SHELL SEQUENCE
                    </span>
                    <Badge variant={taskStatus.task4 === 'correct' ? 'success' : taskStatus.task4 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task4 === 'correct' ? 'VERIFIED' : taskStatus.task4 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Reorder the sequence of commands needed to discover the environment, enter the correct directory, flip permissions, and extract the flag contents. Order from top (first command) to bottom.
                  </p>

                  {/* Timeline Ordering List */}
                  <div className="flex flex-col gap-2 my-1">
                    {timelineItems.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2.5 border border-border-subtle/60 bg-[#05070c]/50 rounded-md gap-3 hover:border-status-success/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-status-success bg-status-success/10 w-5 h-5 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] text-text-secondary font-ui leading-normal">
                            {item.label}
                          </span>
                        </div>
                        
                        {/* Up/Down buttons */}
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

                  {/* Hint */}
                  <div className="text-[10px] font-ui">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task4: !prev.task4 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task4 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task4 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal">
                        To fetch the restricted file, you must first list directories (`ls -a`), navigate inside the subdirectory (`cd network`), grant permissions (`chmod +r`), and print file content (`cat`).
                      </p>
                    )}
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      ) : (
        /* Completed results panel */
        <div className="max-w-xl mx-auto w-full py-8">
          <Card className="p-8 border border-status-success/30 bg-status-success/5 flex flex-col items-center text-center gap-6 relative overflow-hidden">
            
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-status-success/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-4 bg-status-success/15 border border-status-success/30 rounded-full text-status-success animate-bounce">
              <Award className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-display font-bold text-text-primary">
                CLI Challenges Verified
              </h2>
              <span className="font-mono text-xs text-status-success tracking-widest font-bold">
                SHELL INVESTIGATION SUCCESSFUL
              </span>
            </div>

            <div className="h-[1px] bg-border-subtle w-full my-1" />

            <p className="text-xs font-ui text-text-secondary leading-relaxed max-w-sm">
              Incredible work, Sentinel! You&apos;ve navigated the directories, located the hidden agent dotfile, bypassed system restrictions with permission changes, and reconstructed the timeline. Your commands are successfully cataloged in the archives.
            </p>

            <div className="grid grid-cols-3 gap-3.5 w-full font-mono text-xs mt-2">
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">STATUS</span>
                <span className="text-sm font-bold text-status-success mt-1">
                  100% OK
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">ELAPSED TIME</span>
                <span className="text-sm font-bold text-text-primary mt-1">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">TASKS</span>
                <span className="text-sm font-bold text-accent-cyan mt-1">
                  4/4 SOLVED
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-status-success/5 border border-status-success/10 rounded-btn flex gap-3 items-center w-full text-left font-ui">
              <Badge variant="violet" className="text-[8px] shrink-0 font-mono">ARCHIVED</Badge>
              <p className="text-[11px] text-text-secondary leading-normal">
                Terminal simulator closed. Credentials decrypted and local environment locks reset.
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
