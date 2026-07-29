import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { FileSearch, Info, RefreshCw } from 'lucide-react';

const PACKETS = [
  {
    id: 1,
    time: '0.000000',
    source: '10.0.8.15',
    destination: '10.0.8.1',
    protocol: 'DNS',
    length: 74,
    info: 'Standard query 0x1f4a A secure-auth.internal',
    payload: `Hex View:
0000  00 0c 29 d8 3a 44 00 50  56 c0 00 08 08 00 45 00  ..).:D.PV.....E.
0010  00 3c 1c 46 40 00 40 11  b2 cc 0a 00 08 0f 0a 00  .<.F@.@.........
0020  08 01 c0 53 00 35 00 28  26 c5 1f 4a 01 00 00 01  ...S.5.(&..J....
0030  00 00 00 00 00 00 0b 73  65 63 75 72 65 2d 61 75  .......secure-au
0040  74 68 08 69 6e 74 65 72  6e 61 6c 00 00 01 00 01  th.internal.....

ASCII Dump:
Query: secure-auth.internal
Type: A (IPv4 host address)
Class: IN (Internet)`
  },
  {
    id: 2,
    time: '0.002142',
    source: '10.0.8.15',
    destination: '10.0.8.2',
    protocol: 'TCP',
    length: 66,
    info: '49281 -> 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 WS=256 SACK_PERM=1',
    payload: `Hex View:
0000  00 0c 29 d8 3a 45 00 50  56 c0 00 08 08 00 45 00  ..).:E.PV.....E.
0010  00 30 1c 47 40 00 40 06  b2 d4 0a 00 08 0f 0a 00  .0.G@.@.........
0020  08 02 c0 81 00 50 00 00  00 00 00 00 00 00 a0 02  .....P..........
0030  fa f0 3a f1 00 00 02 04  05 b4 01 03 03 08 01 01  ..:.............

ASCII Dump:
Source Port: 49281
Destination Port: 80 (HTTP)
Sequence Number: 0
Flags: 0x002 (SYN)`
  },
  {
    id: 3,
    time: '0.003551',
    source: '10.0.8.15',
    destination: '10.0.8.2',
    protocol: 'HTTP',
    length: 128,
    info: 'GET /login.html HTTP/1.1',
    payload: `Hex View:
0000  00 0c 29 d8 3a 45 00 50  56 c0 00 08 08 00 45 00  ..).:E.PV.....E.
0010  00 ae 1c 48 40 00 40 06  b2 56 0a 00 08 0f 0a 00  ...H@.@..V......
0020  08 02 c0 81 00 50 00 00  00 01 00 00 00 01 50 18  .....P........P.
0030  fa f0 fa c2 00 00 47 45  54 20 2f 6c 6f 67 69 6e  ......GET /login
0040  2e 68 74 6d 6c 20 48 54  54 50 2f 31 2e 31 0d 0a  .html HTTP/1.1..

ASCII Dump:
GET /login.html HTTP/1.1
Host: secure-auth.internal
User-Agent: Mozilla/5.0 (X11; Linux x86_64)
Accept: text/html,application/xhtml+xml`
  },
  {
    id: 4,
    time: '0.015241',
    source: '10.0.8.15',
    destination: '10.0.8.2',
    protocol: 'HTTP',
    length: 295,
    info: 'POST /api/login HTTP/1.1',
    payload: `Hex View:
0000  00 0c 29 d8 3a 45 00 50  56 c0 00 08 08 00 45 00  ..).:E.PV.....E.
0010  01 55 1c 49 40 00 40 06  b1 ae 0a 00 08 0f 0a 00  .U.I@.@.........
0020  08 02 c0 81 00 50 00 00  00 a8 00 00 00 b4 50 18  .....P........P.
0030  fa f0 f1 c2 00 00 50 4f  53 54 20 2f 61 70 69 2f  ......POST /api/
0040  6c 6f 67 69 6e 20 48 54  54 50 2f 31 2e 31 0d 0a  login HTTP/1.1..
0050  48 6f 73 74 3a 20 73 65  63 75 72 65 2d 61 75 74  Host: secure-aut
0060  68 2e 69 6e 74 65 72 6e  61 6c 0d 0a 43 6f 6e 74  h.internal..Cont
0070  65 6e 74 2d 54 79 70 65  3a 20 61 70 70 6c 69 63  ent-Type: applic
0080  61 74 69 6f 6e 2f 6a 73  6f 6e 0d 0a 0d 0a 7b 22  ation/json....{"
0090  75 73 65 72 6e 61 6d 65  22 3a 22 73 65 6e 74 69  username":"senti
00a0  6e 65 6c 5f 61 64 6d 69  6e 22 2c 22 70 61 73 73  nel_admin","pass
00b0  77 6f 72 64 22 3a 22 43  6c 65 61 72 74 65 78 74  word":"Cleartext
00c0  50 61 73 73 77 6f 72 64  5f 55 6e 73 61 66 65 5f  Password_Unsafe_
00d0  32 30 32 36 22 7d                                 2026"}

ASCII Dump:
POST /api/login HTTP/1.1
Host: secure-auth.internal
Content-Type: application/json
Content-Length: 78

{"username":"sentinel_admin","password":"CleartextPassword_Unsafe_2026"}`
  },
  {
    id: 5,
    time: '0.016335',
    source: '10.0.8.2',
    destination: '10.0.8.15',
    protocol: 'TCP',
    length: 60,
    info: '80 -> 49281 [ACK] Seq=1 Ack=295 Win=63952 Len=0',
    payload: `Hex View:
0000  50 56 c0 00 08 08 00 0c  29 d8 3a 45 08 00 45 00  PV......).:E..E.
0010  00 28 0a c3 40 00 40 06  c4 64 0a 00 08 02 0a 00  .(..@.@..d......
0020  08 0f 00 50 c0 81 00 00  00 b4 00 00 01 cf 50 10  ...P..........P.
0030  fa 00 a2 b4 00 00 00 00  00 00 00 00              ............

ASCII Dump:
Source Port: 80 (HTTP)
Destination Port: 49281
Sequence Number: 1
Acknowledgment Number: 295
Flags: 0x010 (ACK)`
  },
  {
    id: 6,
    time: '0.034125',
    source: '10.0.8.15',
    destination: '10.0.8.3',
    protocol: 'TLSv1.2',
    length: 185,
    info: 'Client Hello',
    payload: `Hex View:
0000  00 0c 29 d8 3a 46 00 50  56 c0 00 08 08 00 45 00  ..).:F.PV.....E.
0010  00 e7 1c 4a 40 00 40 06  b2 1a 0a 00 08 0f 0a 00  ...J@.@.........
0020  08 03 c0 82 01 bb 00 00  00 01 00 00 00 01 50 18  ..............P.
0030  fa f1 db c1 00 00 16 03  01 00 a0 01 00 00 9c 03  ................
0040  03 c0 a8 01 0f 0a 00 08  0f c0 a8 01 0f 0a 00 08  ................

ASCII Dump:
TLS Record Layer: Handshake Protocol: Client Hello
  Version: TLS 1.2 (0x0303)
  Handshake Type: Client Hello (1)
  Cipher Suites (17 suites)`
  }
];

export default function PacketCaptureViewerWidget({ onComplete }) {
  const [selectedId, setSelectedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPacket = PACKETS.find(p => p.id === selectedId);

  const handleSelect = (id) => {
    if (submitted) return;
    setSelectedId(id);
  };

  const handleFlag = () => {
    if (!selectedId) return;
    const success = selectedId === 4;
    setIsSuccess(success);
    setSubmitted(true);
    onComplete({ success });
  };

  const handleReset = () => {
    setSelectedId(null);
    setSubmitted(false);
    setIsSuccess(false);
  };

  return (
    <div className="flex flex-col gap-6 p-5 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono text-[9px] text-text-muted uppercase">ETHERNET PERIMETER CAPTURE WORKSPACE</span>
          <h3 className="text-sm font-display font-semibold text-text-primary mt-1">Live PCAP Analyzer Console</h3>
        </div>
        {submitted && (
          <Badge status={isSuccess ? 'success' : 'critical'}>
            {isSuccess ? 'THREAT CAPTURED' : 'INVALID PACKET TARGET'}
          </Badge>
        )}
      </div>

      {/* Packet Table */}
      <div className="border border-border-subtle/50 rounded-btn overflow-hidden bg-bg-primary/20">
        <div className="grid grid-cols-12 p-2.5 bg-bg-secondary/60 border-b border-border-subtle font-mono text-[9px] text-text-muted font-bold text-center">
          <span className="col-span-1">NO.</span>
          <span className="col-span-2 text-left">TIME</span>
          <span className="col-span-2 text-left">SOURCE</span>
          <span className="col-span-2 text-left">DESTINATION</span>
          <span className="col-span-2">PROTOCOL</span>
          <span className="col-span-1">LENGTH</span>
          <span className="col-span-2 text-left pl-2">INFO</span>
        </div>

        <div className="flex flex-col font-mono text-[10px] max-h-[170px] overflow-y-auto">
          {PACKETS.map((pkt) => {
            const isSelected = selectedId === pkt.id;
            let rowStyle = 'border-b border-border-subtle/20 bg-bg-primary/10 hover:bg-bg-primary/30 cursor-pointer';
            
            if (isSelected) {
              rowStyle = 'border-b border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan cursor-pointer';
            }
            if (submitted) {
              if (pkt.id === 4 && isSelected) {
                rowStyle = 'border-b border-status-success bg-status-success/15 text-status-success cursor-not-allowed';
              } else if (isSelected) {
                rowStyle = 'border-b border-status-critical bg-status-critical/15 text-status-critical cursor-not-allowed';
              }
            }

            return (
              <div 
                key={pkt.id} 
                onClick={() => handleSelect(pkt.id)}
                className={`grid grid-cols-12 items-center p-2 ${rowStyle}`}
              >
                <span className="col-span-1 text-center text-text-muted">{pkt.id}</span>
                <span className="col-span-2 text-left text-text-secondary">{pkt.time}</span>
                <span className="col-span-2 text-left text-text-primary">{pkt.source}</span>
                <span className="col-span-2 text-left text-text-primary">{pkt.destination}</span>
                <span className="col-span-2 text-center text-text-secondary font-bold">{pkt.protocol}</span>
                <span className="col-span-1 text-center text-text-secondary">{pkt.length}</span>
                <span className="col-span-2 text-left text-text-secondary truncate pl-2" title={pkt.info}>{pkt.info}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Packet Hex/ASCII Payload Inspector */}
        <div className="lg:col-span-8 flex flex-col gap-2.5">
          <span className="font-mono text-[10px] text-text-muted uppercase">HEX/ASCII PACKET PAYLOAD DECODER</span>
          <div className="flex-1 bg-bg-primary border border-border-subtle rounded-btn p-3.5 font-mono text-[10px] text-text-secondary overflow-y-auto max-h-[160px] whitespace-pre-wrap leading-normal min-h-[140px]">
            {selectedPacket ? (
              <span className={selectedPacket.id === 4 ? 'text-status-warning' : 'text-text-secondary'}>
                {selectedPacket.payload}
              </span>
            ) : (
              <span className="text-text-muted italic flex items-center justify-center h-full">
                Select a packet from the network ledger above to load its payload bytes.
              </span>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 bg-bg-primary/20 border border-border-subtle/50 rounded-btn">
          <div className="flex flex-col gap-3 font-mono text-xs">
            <span className="text-text-muted uppercase text-[9px]">ANALYSIS ACTIONS</span>
            <div className="flex flex-col gap-1 text-[11px] text-text-secondary">
              <div>Selected Packet: <strong className="text-text-primary">{selectedId ? `#${selectedId}` : 'None'}</strong></div>
              {selectedPacket && (
                <div>Protocol: <strong className="text-accent-cyan font-bold">{selectedPacket.protocol}</strong></div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {submitted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                className="font-mono text-xs w-full"
              >
                RESET SCANNER
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleFlag}
                disabled={!selectedId}
                icon={<FileSearch className="w-3.5 h-3.5" />}
                className="font-mono text-xs w-full"
              >
                FLAG THREAT PACKET
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Guide footer */}
      <div className="p-3 bg-bg-tertiary border border-border-subtle rounded-btn flex items-start gap-2.5 font-ui text-[11px] text-text-secondary leading-normal">
        <Info className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Wireshark Guide: </strong>
          Look for unencrypted streams. Packets running on port 80 (HTTP) do not encrypt payload contents. Find the POST packet, view its ASCII dump, and look for cleartext login credentials to flag the compromised session.
        </div>
      </div>
    </div>
  );
}
