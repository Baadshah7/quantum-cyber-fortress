import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { 
  Terminal, Search, Clock, Award, CheckCircle2, 
  ArrowLeft, HelpCircle, ChevronUp, ChevronDown, 
  ShieldAlert, Layers
} from 'lucide-react';

const PACKET_DATA = [
  { no: 1, time: "0.000000", source: "192.168.1.15", destination: "192.168.1.1", protocol: "DNS", length: 78, info: "Standard query 0x12a3 A login.fortress.local", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:3e:5b:10",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.1",
    layer4: "User Datagram Protocol, Src Port: 53512, Dst Port: 53",
    payload: "0000  00 0c 29 3e 5b 10 00 50 56 c0 00 08 08 00 45 00   ..)>[..PV.....E.\n0010  00 40 e6 25 40 00 80 11 00 00 c0 a8 01 0f c0 a8 01 01   .@.%@...........\n0020  d1 08 00 35 00 2c a1 e0 12 a3 01 00 00 01 00 00 00 00   ...5.,..........\n0030  00 00 05 6c 6f 67 69 6e 08 66 6f 72 74 72 65 73 73 05   ...login.fortress.\n0040  6c 6f 63 61 6c 00 00 01 00 01                           local....."
  }},
  { no: 2, time: "0.004122", source: "192.168.1.1", destination: "192.168.1.15", protocol: "DNS", length: 94, info: "Standard query response 0x12a3 A login.fortress.local A 192.168.1.50", details: {
    layer2: "Ethernet II, Src: 00:0c:29:3e:5b:10, Dst: 00:50:56:c0:00:08",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.1, Dst: 192.168.1.15",
    layer4: "User Datagram Protocol, Src Port: 53, Dst Port: 53512",
    payload: "Standard query response 0x12a3 A login.fortress.local\nName: login.fortress.local\nAddress: 192.168.1.50"
  }},
  { no: 3, time: "0.012544", source: "192.168.1.15", destination: "192.168.1.50", protocol: "TCP", length: 66, info: "49201 → 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49201, Dst Port: 80, Seq: 0, Flags: 0x002 (SYN)",
    payload: "[No TCP application payload - Three-way handshake Syn]"
  }},
  { no: 4, time: "0.014210", source: "192.168.1.50", destination: "192.168.1.15", protocol: "TCP", length: 66, info: "80 → 49201 [SYN, ACK] Seq=0 Ack=1 Win=64240 Len=0 MSS=1460", details: {
    layer2: "Ethernet II, Src: 00:0c:29:df:22:a1, Dst: 00:50:56:c0:00:08",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.50, Dst: 192.168.1.15",
    layer4: "Transmission Control Protocol, Src Port: 80, Dst Port: 49201, Seq: 0, Ack: 1, Flags: 0x012 (SYN, ACK)",
    payload: "[No TCP application payload - Three-way handshake Syn-Ack]"
  }},
  { no: 5, time: "0.014522", source: "192.168.1.15", destination: "192.168.1.50", protocol: "TCP", length: 54, info: "49201 → 80 [ACK] Seq=1 Ack=1 Win=64240 Len=0", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49201, Dst Port: 80, Seq: 1, Ack: 1, Flags: 0x010 (ACK)",
    payload: "[No TCP application payload - Three-way handshake Ack]"
  }},
  { no: 6, time: "0.021004", source: "192.168.1.15", destination: "192.168.1.50", protocol: "HTTP", length: 432, info: "GET /index.html HTTP/1.1", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49201, Dst Port: 80, Seq: 1, Ack: 1, Len: 378",
    payload: "GET /index.html HTTP/1.1\r\nHost: login.fortress.local\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\nAccept: text/html,application/xhtml+xml\r\nConnection: keep-alive\r\n\r\n"
  }},
  { no: 7, time: "1.250421", source: "192.168.1.15", destination: "192.168.1.50", protocol: "FTP", length: 72, info: "Request: USER anonymous", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49205, Dst Port: 21, Seq: 1, Ack: 1, Len: 18",
    payload: "USER anonymous\r\n"
  }},
  { no: 8, time: "1.254112", source: "192.168.1.50", destination: "192.168.1.15", protocol: "FTP", length: 85, info: "Response: 331 Please specify the password.", details: {
    layer2: "Ethernet II, Src: 00:0c:29:df:22:a1, Dst: 00:50:56:c0:00:08",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.50, Dst: 192.168.1.15",
    layer4: "Transmission Control Protocol, Src Port: 21, Dst Port: 49205, Seq: 1, Ack: 19, Len: 31",
    payload: "331 Please specify the password.\r\n"
  }},
  { no: 9, time: "1.302144", source: "192.168.1.15", destination: "192.168.1.50", protocol: "FTP", length: 78, info: "Request: PASS guest@fortress.local", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49205, Dst Port: 21, Seq: 19, Ack: 32, Len: 24",
    payload: "PASS guest@fortress.local\r\n"
  }},
  { no: 10, time: "1.321045", source: "192.168.1.50", destination: "192.168.1.15", protocol: "FTP", length: 82, info: "Response: 230 Login successful.", details: {
    layer2: "Ethernet II, Src: 00:0c:29:df:22:a1, Dst: 00:50:56:c0:00:08",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.50, Dst: 192.168.1.15",
    layer4: "Transmission Control Protocol, Src Port: 21, Dst Port: 49205, Seq: 32, Ack: 43, Len: 28",
    payload: "230 Login successful.\r\n"
  }},
  { no: 11, time: "1.450122", source: "192.168.1.15", destination: "192.168.1.50", protocol: "FTP", length: 92, info: "Request: RETR sensitive_firmware.bin", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49205, Dst Port: 21, Seq: 43, Ack: 60, Len: 38",
    payload: "RETR sensitive_firmware.bin\r\n"
  }},
  { no: 12, time: "1.464115", source: "192.168.1.50", destination: "192.168.1.15", protocol: "FTP", length: 112, info: "Response: 150 Opening BINARY mode data connection.", details: {
    layer2: "Ethernet II, Src: 00:0c:29:df:22:a1, Dst: 00:50:56:c0:00:08",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.50, Dst: 192.168.1.15",
    layer4: "Transmission Control Protocol, Src Port: 21, Dst Port: 49205, Seq: 60, Ack: 81, Len: 58",
    payload: "150 Opening BINARY mode data connection for sensitive_firmware.bin (102400 bytes).\r\n"
  }},
  { no: 13, time: "2.100412", source: "192.168.1.15", destination: "192.168.1.50", protocol: "TCP", length: 66, info: "49206 → 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49206, Dst Port: 80, Seq: 0, Flags: 0x002 (SYN)",
    payload: "[No TCP application payload - Three-way handshake Syn]"
  }},
  { no: 14, time: "2.104112", source: "192.168.1.50", destination: "192.168.1.15", protocol: "TCP", length: 66, info: "80 → 49206 [SYN, ACK] Seq=0 Ack=1 Win=64240 Len=0 MSS=1460", details: {
    layer2: "Ethernet II, Src: 00:0c:29:df:22:a1, Dst: 00:50:56:c0:00:08",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.50, Dst: 192.168.1.15",
    layer4: "Transmission Control Protocol, Src Port: 80, Dst Port: 49206, Seq: 0, Ack: 1, Flags: 0x012 (SYN, ACK)",
    payload: "[No TCP application payload - Three-way handshake Syn-Ack]"
  }},
  { no: 15, time: "2.112104", source: "192.168.1.15", destination: "192.168.1.50", protocol: "HTTP", length: 512, info: "POST /api/v1/login HTTP/1.1 (application/x-www-form-urlencoded)", details: {
    layer2: "Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:df:22:a1",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.15, Dst: 192.168.1.50",
    layer4: "Transmission Control Protocol, Src Port: 49206, Dst Port: 80, Seq: 1, Ack: 1, Len: 458",
    payload: "POST /api/v1/login HTTP/1.1\r\nHost: login.fortress.local\r\nContent-Length: 43\r\nContent-Type: application/x-www-form-urlencoded\r\nReferer: http://login.fortress.local/index.html\r\n\r\nuser=operator-alpha&pass=FortressSecure2026"
  }},
  { no: 16, time: "2.145112", source: "192.168.1.50", destination: "192.168.1.15", protocol: "HTTP", length: 180, info: "HTTP/1.1 200 OK (text/json)", details: {
    layer2: "Ethernet II, Src: 00:0c:29:df:22:a1, Dst: 00:50:56:c0:00:08",
    layer3: "Internet Protocol Version 4, Src: 192.168.1.50, Dst: 192.168.1.15",
    layer4: "Transmission Control Protocol, Src Port: 80, Dst Port: 49206, Seq: 1, Ack: 459, Len: 126",
    payload: "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\n  \"status\": \"success\",\n  \"token\": \"session_token_5fb10c4f828a2a89\"\n}"
  }}
];

export default function PacketExerciseSandboxPage() {
  // Local state only - no context integration as requested
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPacket, setSelectedPacket] = useState(PACKET_DATA[0]);

  // Task states
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

  // Reorderable sequence state
  const [timelineItems, setTimelineItems] = useState([
    { id: 'ftp', label: 'Anonymous FTP connection and downloading sensitive_firmware.bin', correctOrder: 1 },
    { id: 'dns', label: 'DNS resolution query for login.fortress.local', correctOrder: 0 },
    { id: 'login', label: 'Cleartext HTTP credential submission via POST', correctOrder: 3 },
    { id: 'handshake', label: 'HTTP connection TCP port 80 handshake initiation', correctOrder: 2 }
  ]);

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

  // Completion triggers saving of best score (low-risk localStorage matching Log Analysis)
  useEffect(() => {
    if (isLabComplete) {
      setTimerActive(false);
      localStorage.setItem('qcf_lab_score_packet-sandbox', JSON.stringify({
        score: 4,
        maxScore: 4,
        completed: true,
        timeTaken: timeElapsed
      }));
    }
  }, [isLabComplete, timeElapsed]);

  // Timeline reorder helpers
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

  // Task verifications
  const verifyTask1 = () => {
    const isCorrect = answers.task1.trim().toLowerCase() === 'ftp';
    setTaskStatus(prev => ({ ...prev, task1: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask2 = () => {
    const isCorrect = answers.task2.trim() === '192.168.1.50';
    setTaskStatus(prev => ({ ...prev, task2: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask3 = () => {
    const isCorrect = answers.task3.trim() === 'operator-alpha';
    setTaskStatus(prev => ({ ...prev, task3: isCorrect ? 'correct' : 'incorrect' }));
  };

  const verifyTask4 = () => {
    // Correct sequence: dns, ftp, handshake, login
    const isCorrect = 
      timelineItems[0].id === 'dns' &&
      timelineItems[1].id === 'ftp' &&
      timelineItems[2].id === 'handshake' &&
      timelineItems[3].id === 'login';

    setTaskStatus(prev => ({ ...prev, task4: isCorrect ? 'correct' : 'incorrect' }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Protocols color mapping matching site styling
  const getProtocolColor = (proto) => {
    switch (proto) {
      case 'DNS':
        return 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20';
      case 'HTTP':
        return 'text-status-success bg-status-success/10 border-status-success/20';
      case 'FTP':
        return 'text-accent-violet bg-accent-violet/10 border-accent-violet/20';
      case 'TCP':
      default:
        return 'text-text-secondary bg-bg-tertiary border-border-subtle/50';
    }
  };

  const filteredPackets = PACKET_DATA.filter(pkt => 
    pkt.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkt.source.includes(searchTerm) ||
    pkt.destination.includes(searchTerm) ||
    pkt.info.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-6xl mx-auto w-full pb-12">
      
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <Link 
          to="/labs"
          className="flex items-center gap-1.5 text-xs font-mono font-semibold text-text-secondary hover:text-accent-cyan cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO LABS
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-muted">CLASSIFIED ACCESS:</span>
          <span className="font-mono text-xs text-accent-cyan font-bold">LEVEL II SANDBOX</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glassmorphism border border-border-subtle rounded-card">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 border border-accent-cyan/20 rounded-full">
              NETWORK
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              v1.0 · Sandbox
            </span>
          </div>
          <h1 className="text-xl font-display font-bold text-text-primary">
            Packet Exercise Sandbox
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl font-ui">
            Analyze the pcap frame sequence to recover binary file downloads and extract authentication parameters transferred in cleartext.
          </p>
        </div>

        {/* Live Status Indicators */}
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
          
          {/* Left Column: Wireshark-Style simulated PCAP view */}
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent-cyan" /> SIMULATED PACKET STREAM
              </span>
              
              {/* Search Bar */}
              <div className="relative w-44 sm:w-56">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Search className="h-3 w-3 text-text-muted" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="filter protocol, ip, info..."
                  className="w-full pl-7 pr-3 py-1 text-[10px] font-mono bg-bg-secondary border border-border-subtle rounded-md text-text-primary placeholder-text-muted/60 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
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

            {/* Table Container */}
            <div className="flex-1 flex flex-col rounded-card border border-border-subtle bg-bg-secondary/10 overflow-hidden min-h-[380px] max-h-[460px]">
              <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                <table className="w-full text-left font-mono text-[10px] border-collapse select-none">
                  <thead className="bg-bg-tertiary text-text-muted border-b border-border-subtle uppercase text-[9px] tracking-wider sticky top-0 z-20">
                    <tr>
                      <th className="px-3 py-2 text-center w-12">No.</th>
                      <th className="px-2 py-2 w-16">Time</th>
                      <th className="px-2 py-2 w-28">Source</th>
                      <th className="px-2 py-2 w-28">Destination</th>
                      <th className="px-2 py-2 w-16 text-center">Protocol</th>
                      <th className="px-2 py-2 w-16 text-right">Length</th>
                      <th className="px-3 py-2">Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/30 bg-bg-primary/10">
                    {filteredPackets.map((pkt) => {
                      const isSelected = selectedPacket?.no === pkt.no;
                      const protoColor = getProtocolColor(pkt.protocol);

                      return (
                        <tr 
                          key={pkt.no}
                          onClick={() => setSelectedPacket(pkt)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-accent-cyan/15 hover:bg-accent-cyan/20 border-l-2 border-accent-cyan' 
                              : 'hover:bg-bg-tertiary/20'
                          }`}
                        >
                          <td className="px-3 py-1.5 text-center text-text-muted">{pkt.no}</td>
                          <td className="px-2 py-1.5 text-text-muted">{pkt.time}</td>
                          <td className="px-2 py-1.5 text-text-secondary">{pkt.source}</td>
                          <td className="px-2 py-1.5 text-text-secondary">{pkt.destination}</td>
                          <td className="px-2 py-1.5 text-center">
                            <span className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-bold ${protoColor}`}>
                              {pkt.protocol}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-right text-text-muted">{pkt.length}</td>
                          <td className="px-3 py-1.5 text-text-primary truncate max-w-xs">{pkt.info}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredPackets.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-xs text-text-muted gap-2">
                  <ShieldAlert className="w-8 h-8 text-status-critical/60" />
                  <span>No packets found matching &ldquo;{searchTerm}&rdquo;</span>
                </div>
              )}
            </div>

            {/* Packet Detail Panel */}
            {selectedPacket && (
              <Card className="p-4 border border-border-subtle bg-bg-secondary/20 flex flex-col gap-2 min-h-[160px]">
                <div className="flex justify-between items-center border-b border-border-subtle pb-1.5">
                  <span className="font-mono text-[9px] text-accent-cyan font-bold flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> FRAME DETAILS (No. {selectedPacket.no} - {selectedPacket.protocol})
                  </span>
                  <span className="font-mono text-[9px] text-text-muted">Length: {selectedPacket.length} bytes</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px] leading-relaxed">
                  <div className="flex flex-col gap-1.5 text-text-secondary">
                    <div>
                      <span className="text-text-muted">[L2]:</span> {selectedPacket.details.layer2}
                    </div>
                    <div>
                      <span className="text-text-muted">[L3]:</span> {selectedPacket.details.layer3}
                    </div>
                    <div>
                      <span className="text-text-muted">[L4]:</span> {selectedPacket.details.layer4}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted">[PAYLOAD DATA DUMP]:</span>
                    <pre className="p-2 bg-bg-primary/60 border border-border-subtle/50 rounded text-text-primary text-[9px] whitespace-pre overflow-x-auto max-h-[80px]">
                      {selectedPacket.details.payload}
                    </pre>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Lab Tasks */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              INVESTIGATION TASKS
            </span>

            <div className="flex flex-col gap-4 font-ui">

              {/* Task 1: Protocol Used */}
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
                      <span className="text-accent-cyan">01.</span> TRANSFER PROTOCOL
                    </span>
                    <Badge variant={taskStatus.task1 === 'correct' ? 'success' : taskStatus.task1 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task1 === 'correct' ? 'VERIFIED' : taskStatus.task1 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    What protocol was used to transfer the binary file (`sensitive_firmware.bin`)?
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task1}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task1: e.target.value }))}
                      disabled={taskStatus.task1 === 'correct'}
                      placeholder="e.g. HTTP, TCP"
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
                  <div className="text-[10px]">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task1: !prev.task1 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task1 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task1 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal font-mono text-[9px]">
                        Look at the Protocol column for the packets downloading the firmware (No. 7 to 12).
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 2: FTP Dest IP */}
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
                      <span className="text-accent-cyan">02.</span> FTP SERVER IP
                    </span>
                    <Badge variant={taskStatus.task2 === 'correct' ? 'success' : taskStatus.task2 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task2 === 'correct' ? 'VERIFIED' : taskStatus.task2 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    What is the destination IP address of the FTP server hosting the file?
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task2}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task2: e.target.value }))}
                      disabled={taskStatus.task2 === 'correct'}
                      placeholder="e.g. 192.168.1.1"
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
                  <div className="text-[10px]">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task2: !prev.task2 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task2 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task2 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal font-mono text-[9px]">
                        Inspect the Destination IP of any outgoing FTP packet (like user anonymous at No. 7).
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 3: HTTP Username */}
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
                      <span className="text-accent-cyan">03.</span> CLEARTEXT CREDENTIAL USERNAME
                    </span>
                    <Badge variant={taskStatus.task3 === 'correct' ? 'success' : taskStatus.task3 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task3 === 'correct' ? 'VERIFIED' : taskStatus.task3 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    What cleartext username was submitted in the HTTP POST login request?
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers.task3}
                      onChange={(e) => setAnswers(prev => ({ ...prev, task3: e.target.value }))}
                      disabled={taskStatus.task3 === 'correct'}
                      placeholder="e.g. admin-user"
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
                  <div className="text-[10px]">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task3: !prev.task3 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task3 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task3 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal font-mono text-[9px]">
                        Find the `POST` HTTP request (No. 15). Select it and scroll down to the bottom Payload Data Dump inside the Frame Details box. The parameters are formatted as user=XYZ&pass=XYZ.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Task 4: Reorder Chronology */}
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
                      <span className="text-accent-cyan">04.</span> INTRUSION TIMELINE SEQUENCE
                    </span>
                    <Badge variant={taskStatus.task4 === 'correct' ? 'success' : taskStatus.task4 === 'incorrect' ? 'critical' : 'warning'}>
                      {taskStatus.task4 === 'correct' ? 'VERIFIED' : taskStatus.task4 === 'incorrect' ? 'FAILED' : 'PENDING'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-normal font-ui">
                    Arrange the events chronologically from top (first event) to bottom (last event) using the navigation controls.
                  </p>

                  {/* Reorder list */}
                  <div className="flex flex-col gap-2 my-1">
                    {timelineItems.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2.5 border border-border-subtle/60 bg-bg-primary/30 rounded-md gap-3 hover:border-accent-cyan/35 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-accent-cyan bg-accent-cyan/10 w-5 h-5 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] text-text-secondary font-ui leading-normal">
                            {item.label}
                          </span>
                        </div>
                        
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
                  <div className="text-[10px]">
                    <button
                      onClick={() => setHints(prev => ({ ...prev, task4: !prev.task4 }))}
                      className="text-text-muted hover:text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> {hints.task4 ? "Hide Hint" : "Need Hint?"}
                    </button>
                    {hints.task4 && (
                      <p className="mt-1.5 p-2 bg-bg-primary/50 border border-border-subtle/50 rounded-md text-text-secondary leading-normal font-mono text-[9px]">
                        Verify order using packet timestamps: DNS lookup happens first (`0.00`), anonymous file download is second (`1.25`), HTTP TCP handshake is third (`2.100`), and cleartext HTTP POST is last (`2.112`).
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
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-status-success/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-4 bg-status-success/15 border border-status-success/30 rounded-full text-status-success">
              <Award className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-display font-bold text-text-primary">
                Analysis Complete
              </h2>
              <span className="font-mono text-xs text-status-success tracking-widest font-bold">
                PACKET INTEL DECRYPTED
              </span>
            </div>

            <div className="h-[1px] bg-border-subtle w-full my-1" />

            <p className="text-xs font-ui text-text-secondary leading-relaxed max-w-sm">
              Great packet forensics, Sentinel! You have recovered the plaintext credentials from the unsecured login form and accurately reconstructed the file acquisition timeline.
            </p>

            <div className="grid grid-cols-2 gap-3.5 w-full font-mono text-xs mt-2 max-w-xs">
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">ANALYSIS TIME</span>
                <span className="text-sm font-bold text-text-primary mt-1">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="p-3 bg-bg-secondary/60 border border-border-subtle rounded-btn flex flex-col items-center">
                <span className="text-[9px] text-text-muted uppercase">SCORE</span>
                <span className="text-sm font-bold text-status-success mt-1">
                  4 / 4 (100%)
                </span>
              </div>
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
