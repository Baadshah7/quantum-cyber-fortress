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

export default function TerminalSimulationsPage() {
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
    task1: 'unsubmitted',
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
    { id: 'nano', label: 'Modify sshd config via text editor: "nano /etc/ssh/sshd_config"', correctOrder: 2 },
    { id: 'apt_list', label: 'Scan package logs for updates: "apt list --upgradable"', correctOrder: 0 },
    { id: 'restart', label: 'Reload the config service: "sudo systemctl restart sshd"', correctOrder: 3 },
    { id: 'apt_upgrade', label: 'Patch outdated dependencies: "sudo apt install --only-upgrade nginx"', correctOrder: 1 }
  ]);

  // Terminal history & current working directory state
  const [cwd, setCwd] = useState('/home/sentinel');
  const [inputValue, setInputValue] = useState('');
  
  // Package manager state
  const [packages, setPackages] = useState({
    nginx: { installed: '1.18.0', upgradable: '1.24.0', status: 'vulnerable' }
  });

  // Filesystem simulation
  const [filesystem, setFilesystem] = useState({
    '/': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root' },
    '/etc': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root' },
    '/etc/ssh': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root' },
    '/etc/ssh/sshd_config': { 
      type: 'file', 
      permissions: '-rw-r--r--', 
      owner: 'root', 
      content: '# SSH Server Configuration\nPort 22\nPermitRootLogin yes\nPasswordAuthentication yes' 
    },
    '/home': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root' },
    '/home/sentinel': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'sentinel' },
    '/home/sentinel/package_list.log': { 
      type: 'file', 
      permissions: '-rw-r--r--', 
      owner: 'sentinel', 
      content: 'Installed packages list:\n- openssh-server (8.2p1)\n- nginx (1.18.0) [VULNERABLE]\n- bash (5.0-6ubuntu1)' 
    }
  });

  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'text', text: 'Virtual SOC Linux Hardening Simulator v1.0.8' },
    { type: 'text', text: 'Secure SSH connection initialized with root privileges via sudo capability.' },
    { type: 'text', text: 'Goal: Detect vulnerable web server, apply patches, harden SSH service, and restart sshd.' },
    { type: 'text', text: 'Type "help" to view simulated controls.' },
    { type: 'text', text: '' }
  ]);

  // nano text editor overlay states
  const [isEditing, setIsEditing] = useState(false);
  const [editingFile, setEditingFile] = useState('');
  const [editorContent, setEditorContent] = useState('');

  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal history to bottom
  useEffect(() => {
    if (!isEditing) {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, isEditing]);

  // Focus input on mounting
  useEffect(() => {
    if (!isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

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

  // Completion triggers saving of best score
  useEffect(() => {
    if (isLabComplete) {
      setTimerActive(false);
      localStorage.setItem('qcf_lab_score_terminal-simulations', JSON.stringify({
        score: 4,
        maxScore: 4,
        completed: true,
        timeTaken: timeElapsed
      }));
    }
  }, [isLabComplete, timeElapsed]);

  // Normalize path helper
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
          { type: 'text', text: 'Virtual SOC hardening tools:' },
          { type: 'text', text: '  ls                List files in directory' },
          { type: 'text', text: '  cd <dir>          Navigate directories' },
          { type: 'text', text: '  pwd               Print current path' },
          { type: 'text', text: '  cat <file>        Read file contents' },
          { type: 'text', text: '  nano <file>       Open command-line text editor' },
          { type: 'text', text: '  apt list --upgradable     Scan package logs for upgrades' },
          { type: 'text', text: '  sudo apt install --only-upgrade <pkg>   Upgrade specific package' },
          { type: 'text', text: '  sudo systemctl restart sshd             Restart SSH configuration daemon' },
          { type: 'text', text: '  help              Show this help menu' },
          { type: 'text', text: '  clear             Clear screen' }
        ];
        break;

      case 'clear':
        setTerminalHistory([]);
        return;

      case 'pwd':
        outputLines = [{ type: 'text', text: cwd }];
        break;

      case 'ls': {
        const items = [];
        const prefix = cwd === '/' ? '/' : cwd + '/';

        for (const key of Object.keys(filesystem)) {
          if (key.startsWith(prefix) && key !== cwd) {
            const subPath = key.substring(prefix.length);
            if (!subPath.includes('/')) {
              const fileData = filesystem[key];
              if (!subPath.startsWith('.')) {
                items.push({
                  name: subPath,
                  isDir: fileData.type === 'dir'
                });
              }
            }
          }
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
          outputLines = fileObj.content.split('\n').map(line => ({ type: 'text', text: line }));
        }
        break;
      }

      case 'apt': {
        const subcmd = args[0];
        const option = args[1];

        if (subcmd === 'list' && option === '--upgradable') {
          outputLines = [
            { type: 'text', text: 'Listing... Done' },
            { type: 'text', text: `nginx/stable ${packages.nginx.installed} amd64 [upgradable to ${packages.nginx.upgradable}]` }
          ];
        } else {
          outputLines = [{ type: 'error', text: `apt: command switch "${subcmd} ${option || ''}" not supported in simulation` }];
        }
        break;
      }

      case 'sudo': {
        const subcmd = args[0];
        const nextArgs = args.slice(1);

        if (subcmd === 'apt' && nextArgs[0] === 'install') {
          const onlyUpgrade = nextArgs[1] === '--only-upgrade';
          const pkg = onlyUpgrade ? nextArgs[2] : nextArgs[1];

          if (pkg === 'nginx') {
            setPackages({
              nginx: { installed: '1.24.0', upgradable: '1.24.0', status: 'patched' }
            });
            outputLines = [
              { type: 'text', text: 'Reading package lists... Done' },
              { type: 'text', text: 'Building dependency tree... Done' },
              { type: 'text', text: 'Reading state information... Done' },
              { type: 'text', text: 'The following packages will be upgraded:' },
              { type: 'text', text: '  nginx' },
              { type: 'text', text: '1 upgraded, 0 newly installed, 0 to remove.' },
              { type: 'text', text: 'Unpacking nginx (1.24.0) over (1.18.0)...' },
              { type: 'text', text: 'Setting up nginx (1.24.0)...' },
              { type: 'text', text: 'Service nginx restarted successfully.' }
            ];
          } else {
            outputLines = [{ type: 'error', text: `sudo apt install: package "${pkg || ''}" not found or already up to date` }];
          }
        } else if (subcmd === 'systemctl' && nextArgs[0] === 'restart' && nextArgs[1] === 'sshd') {
          // Check if nginx has been upgraded first
          const isUpgraded = packages.nginx.installed === '1.24.0';

          if (!isUpgraded) {
            outputLines = [
              { type: 'error', text: 'System error: SSH service dependencies are outdated.' },
              { type: 'error', text: 'Please upgrade vulnerable web server packages first.' }
            ];
          } else {
            // Retrieve sshd config content
            const sshdConfig = filesystem['/etc/ssh/sshd_config']?.content || '';
            const permitsRootNo = /permitrootlogin\s+no/i.test(sshdConfig);

            if (permitsRootNo) {
              outputLines = [
                { type: 'text', text: '[ok] Restarting sshd: openssh-daemon config reloaded.' },
                { type: 'success', text: 'VERIFICATION_TOKEN: SSH_SECURE_77a9' }
              ];
            } else {
              outputLines = [
                { type: 'error', text: 'Job for sshd.service failed because the control process exited with error.' },
                { type: 'error', text: 'sshd[1041]: /etc/ssh/sshd_config: PermitRootLogin must be configured to "no"' },
                { type: 'error', text: 'Failed to restart sshd.service: Unit sshd.service is in error state.' }
              ];
            }
          }
        } else {
          outputLines = [{ type: 'error', text: `sudo: control capability "${subcmd} ${nextArgs.join(' ')}" not supported` }];
        }
        break;
      }

      case 'nano': {
        const targetFile = args[0];
        if (!targetFile) {
          outputLines = [{ type: 'error', text: 'nano: missing filename' }];
          break;
        }

        const normalized = resolveAndNormalizePath(targetFile);
        const fileObj = filesystem[normalized];

        if (!fileObj) {
          outputLines = [{ type: 'error', text: `nano: ${targetFile}: No such file or directory` }];
        } else if (fileObj.type === 'dir') {
          outputLines = [{ type: 'error', text: `nano: ${targetFile}: Is a directory` }];
        } else {
          setEditingFile(normalized);
          setEditorContent(fileObj.content);
          setIsEditing(true);
          return; // Skip history append until we exit editor
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

  // nano text editor handlers
  const handleEditorSave = () => {
    setFilesystem(prev => ({
      ...prev,
      [editingFile]: {
        ...prev[editingFile],
        content: editorContent
      }
    }));
    setIsEditing(false);
    setTerminalHistory(prev => [...prev, { type: 'text', text: `[nano: saved changes to ${editingFile}]` }]);
  };

  const handleEditorExit = () => {
    setIsEditing(false);
    setTerminalHistory(prev => [...prev, { type: 'text', text: '[nano: editor closed without saving]' }]);
  };

  const handleTerminalContainerClick = () => {
    if (!isEditing) {
      inputRef.current?.focus();
    }
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
    const isCorrect = answers.task1.trim().toLowerCase() === 'nginx';
    setTaskStatus(prev => ({ ...prev, task1: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask2 = () => {
    const ans = answers.task2.trim().toLowerCase();
    const isCorrect = ans === '1.24.0' || ans === 'v1.24.0' || ans === '1.24';
    setTaskStatus(prev => ({ ...prev, task2: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask3 = () => {
    const isCorrect = answers.task3.trim() === 'SSH_SECURE_77a9';
    setTaskStatus(prev => ({ ...prev, task3: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask4 = () => {
    const isCorrect = 
      timelineItems[0].id === 'apt_list' &&
      timelineItems[1].id === 'apt_upgrade' &&
      timelineItems[2].id === 'nano' &&
      timelineItems[3].id === 'restart';
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
          <span className="font-mono text-xs text-status-critical font-bold">LEVEL II ADVANCED</span>
        </div>
      </div>

      {/* Lab Header Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 glassmorphism border border-border-subtle rounded-card">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-status-critical bg-status-critical/10 px-2 py-0.5 border border-status-critical/20 rounded-full">
              SYSTEM HARDENING
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              v1.0 · Calibrated
            </span>
          </div>
          <h1 className="text-xl font-display font-bold text-text-primary">
            Terminal Simulations
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl font-ui">
            Interact with simulated Linux servers, identify outdated web server packages, apply security patches, and modify SSH service configurations using command-line file editing.
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
          
          {/* Left Column: Interactive Terminal & Nano Editor */}
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-status-critical" /> HARDENING CONSOLE
              </span>
              <span className="font-mono text-[9px] text-text-muted">
                Server: `fortress-web-node`
              </span>
            </div>

            {/* Terminal Window Container */}
            <div 
              onClick={handleTerminalContainerClick}
              className="flex-1 flex flex-col rounded-card border border-border-subtle bg-[#05070c] overflow-hidden min-h-[480px] max-h-[600px] shadow-[0_0_24px_rgba(5,7,12,0.8)] relative"
            >
              {!isEditing ? (
                /* Shell simulator interface */
                <>
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
                    <Badge variant="critical" className="text-[8px] font-mono tracking-widest px-1.5 py-0.5">
                      ROOT CAPABLE
                    </Badge>
                  </div>

                  {/* Terminal Output Stream */}
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed scrollbar-thin select-text bg-[#030508]/40">
                    <div className="flex flex-col gap-1.5">
                      {terminalHistory.map((line, idx) => {
                        if (line.type === 'input') {
                          return (
                            <div key={idx} className="flex items-start">
                              <span className="text-text-muted select-none mr-1.5">sentinel@fortress-node:</span>
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
                        if (line.type === 'success') {
                          return (
                            <div key={idx} className="text-status-success font-semibold break-all bg-status-success/5 p-1.5 border border-status-success/20 rounded-md my-1">
                              {line.text}
                            </div>
                          );
                        }
                        if (line.type === 'ls') {
                          return (
                            <div key={idx} className="flex flex-wrap gap-x-5 py-0.5">
                              {line.items.map((item, i) => (
                                <span key={i} className={`${item.isDir ? 'text-accent-cyan font-bold' : 'text-text-secondary'} flex items-center`}>
                                  {item.isDir ? <Folder className="w-3.5 h-3.5 inline mr-1 text-accent-cyan/80 shrink-0" /> : <FileText className="w-3.5 h-3.5 inline mr-1 shrink-0" />}
                                  {item.name}
                                </span>
                              ))}
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
                    <span className="text-text-muted select-none mr-1.5">sentinel@fortress-node:</span>
                    <span className="text-accent-violet font-semibold select-none mr-1.5">
                      {cwd === '/home/sentinel' ? '~' : cwd}
                    </span>
                    <span className="text-text-muted select-none mr-1.5">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder='Hardening console... Try "help"'
                      className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted/40 font-mono text-[11px] focus:ring-0 focus:outline-none"
                    />
                  </form>
                </>
              ) : (
                /* Interactive nano Editor Simulator overlay */
                <div className="absolute inset-0 bg-[#050912] flex flex-col font-mono text-xs select-text">
                  
                  {/* nano Header */}
                  <div className="bg-[#1e293b] px-4 py-1.5 border-b border-border-subtle flex justify-between items-center text-text-secondary font-bold">
                    <span>GNU nano 4.8</span>
                    <span>File: {editingFile}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleEditorSave}
                        className="px-2.5 py-0.5 bg-status-success hover:bg-emerald-400 text-bg-primary font-bold rounded-sm cursor-pointer transition-colors text-[10px]"
                      >
                        SAVE & EXIT
                      </button>
                      <button 
                        onClick={handleEditorExit}
                        className="px-2.5 py-0.5 bg-bg-tertiary hover:bg-bg-secondary text-text-primary rounded-sm border border-border-subtle cursor-pointer transition-colors text-[10px]"
                      >
                        DISCARD & EXIT
                      </button>
                    </div>
                  </div>

                  {/* editor content area */}
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="flex-1 w-full bg-[#03060c] text-text-primary p-4 border-none outline-none resize-none font-mono text-xs focus:ring-0"
                    spellCheck="false"
                  />

                  {/* nano Footer Controls info */}
                  <div className="bg-bg-tertiary/70 border-t border-border-subtle p-3 text-[9px] text-text-muted grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-2 gap-y-1">
                    <div><span className="text-text-secondary font-bold">^G</span> Get Help</div>
                    <div><span className="text-text-secondary font-bold">^O</span> WriteOut</div>
                    <div><span className="text-text-secondary font-bold">^R</span> Read File</div>
                    <div><span className="text-text-secondary font-bold">^Y</span> Prev Pg</div>
                    <div><span className="text-text-secondary font-bold">^K</span> Cut Text</div>
                    <div><span className="text-text-secondary font-bold">^C</span> Cur Pos</div>
                    <div><span className="text-text-secondary font-bold">^X</span> Exit</div>
                    <div><span className="text-text-secondary font-bold">^J</span> Justify</div>
                    <div><span className="text-text-secondary font-bold">^W</span> Where Is</div>
                    <div><span className="text-text-secondary font-bold">^V</span> Next Pg</div>
                    <div><span className="text-text-secondary font-bold">^U</span> Uncut Text</div>
                    <div><span className="text-text-secondary font-bold">^T</span> To Spell</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Hardening Tasks */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              HARDENING CHECKLIST
            </span>

            <div className="flex flex-col gap-4">
              
              {/* Task 1: Identify Vulnerable Package */}
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
                      <span className="text-status-critical">01.</span> DETECT VULNERABLE SERVICE
                    </span>
                    <Badge variant={taskStatus.task1 === 'correct' ? 'success' : taskStatus.task1 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task1 === 'correct' ? 'VERIFIED' : taskStatus.task1 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Identify the name of the vulnerable package listed on the system that is currently upgradable.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task1}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task1: e.target.value }))}
                      disabled={taskStatus.task1 === 'correct'}
                      placeholder="e.g. openssl"
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
                        Type `apt list --upgradable` in the console or examine `package_list.log` in `/home/sentinel` to see which service is marked as outdated.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 2: Patch Outdated Package */}
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
                      <span className="text-status-critical">02.</span> APPLY SECURITY PATCH
                    </span>
                    <Badge variant={taskStatus.task2 === 'correct' ? 'success' : taskStatus.task2 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task2 === 'correct' ? 'VERIFIED' : taskStatus.task2 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Install/upgrade the vulnerable package via the package manager and report the newly installed version number.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task2}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task2: e.target.value }))}
                      disabled={taskStatus.task2 === 'correct'}
                      placeholder="e.g. 1.0.0"
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
                        Run `sudo apt install --only-upgrade nginx` to execute the patch upgrade, then inspect the terminal logs for the updated version.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 3: SSH Configuration Hardening */}
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
                      <span className="text-status-critical">03.</span> SECURE SERVICE DAEMON
                    </span>
                    <Badge variant={taskStatus.task3 === 'correct' ? 'success' : taskStatus.task3 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task3 === 'correct' ? 'VERIFIED' : taskStatus.task3 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Disable SSH root logins by editing the sshd configuration file, restart the daemon, and report the secure validation token.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task3}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task3: e.target.value }))}
                      disabled={taskStatus.task3 === 'correct'}
                      placeholder="SSH_SECURE_..."
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
                        Make sure nginx is upgraded first! Open `nano /etc/ssh/sshd_config`, change `PermitRootLogin yes` to `PermitRootLogin no`, click &quot;Save &amp; Exit&quot;, and run `sudo systemctl restart sshd` to receive the token.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 4: Reorder Hardening Timeline */}
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
                      <span className="text-status-critical">04.</span> HARDENING SEQUENCE
                    </span>
                    <Badge variant={taskStatus.task4 === 'correct' ? 'success' : taskStatus.task4 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task4 === 'correct' ? 'VERIFIED' : taskStatus.task4 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Arrange the events chronologically from top (first action) to bottom (last action) using the navigation buttons, then verify the sequence.
                  </p>

                  {/* Timeline Ordering List */}
                  <div className="flex flex-col gap-2 my-1">
                    {timelineItems.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2.5 border border-border-subtle/60 bg-[#05070c]/50 rounded-md gap-3 hover:border-status-critical/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-status-critical bg-status-critical/10 w-5 h-5 rounded-full flex items-center justify-center">
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
                        Logical progression: Scan package list (`apt list`) $\rightarrow$ Apply patch upgrades (`apt install`) $\rightarrow$ Harden daemon configs (`nano`) $\rightarrow$ Reload daemon service (`systemctl restart`).
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
          <Card className="p-6 sm:p-8 border border-status-success/30 bg-status-success/5 flex flex-col items-center text-center gap-6 relative overflow-hidden">
            
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-status-success/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-4 bg-status-success/15 border border-status-success/30 rounded-full text-status-success animate-bounce">
              <Award className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-display font-bold text-text-primary">
                Hardening Verified
              </h2>
              <span className="font-mono text-xs text-status-success tracking-widest font-bold">
                SYSTEM HOST HARDENED
              </span>
            </div>

            <div className="h-[1px] bg-border-subtle w-full my-1" />

            <p className="text-xs font-ui text-text-secondary leading-relaxed max-w-sm">
              Outstanding system administrator capability, Sentinel! You&apos;ve audited the server, patched vulnerable packages, locked down the sshd configuration, and validated secure restart states. The host is fully secured.
            </p>

            <div className="grid grid-cols-3 gap-3.5 w-full font-mono text-xs mt-2">
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">STATUS</span>
                <span className="text-sm font-bold text-status-success mt-1">
                  100% SECURE
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
                  4/4 SECURED
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-status-success/5 border border-status-success/10 rounded-btn flex gap-3 items-center w-full text-left font-ui">
              <Badge variant="violet" className="text-[8px] shrink-0 font-mono">ENCRYPTED</Badge>
              <p className="text-[11px] text-text-secondary leading-normal">
                Hardening session finalized. Environment telemetry successfully synced with Virtual SOC management hubs.
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
