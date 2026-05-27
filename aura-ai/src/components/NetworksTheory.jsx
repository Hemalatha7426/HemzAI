import { useState } from 'react';
import { Network, ArrowLeft, BookOpen, Layers, Zap, ShieldAlert, Award, ChevronDown, ChevronRight, HelpCircle, Activity } from 'lucide-react';

const THEORY_CONTENT = {
  "Unit I: Introduction & Physical Layer": {
    intro: "Introduction to Networks, physical structures, topologies (Mesh, Star, Bus, Ring), network categories (LAN, MAN, WAN), and physical guided/unguided transmission media.",
    sections: [
      {
        title: "Network Fundamentals & Uses",
        text: "A network is a collection of autonomous devices (nodes) connected by communication links. Uses include Business Applications (resource sharing, client-server models, VoIP, e-commerce), Home Applications (peer-to-peer sharing, person-to-person video, entertainment), and Mobile Users (NFC, m-commerce, GPS). Key security concerns include Phishing and Botnet DDoS attacks."
      },
      {
        title: "Data Flow Modes",
        text: "Communication between devices operates in three modes: 1. Simplex: Unidirectional (e.g., traditional keyboard and monitor). 2. Half-Duplex: Bidirectional but not simultaneously (e.g., walkie-talkies). 3. Full-Duplex: Simultaneous bidirectional communication (e.g., telephone networks)."
      },
      {
        title: "Physical Topologies",
        text: "1. Mesh: Every node connects to every other node. Full mesh links = n(n-1)/2. Offers maximum redundancy but high cost. 2. Star: Centralized central hub/switch routing. Easy to expand but has a single point of failure. 3. Bus: Single cable backbone with drop lines and terminators. 4. Ring: Circular path where packets hop unidirectionally or bidirectionally."
      },
      {
        title: "Transmission Mediums",
        text: "1. Guided (Wired): Twisted Pair (UTP/STP with RJ45 connectors), Coaxial Cable (copper core with braided shield using BNC connectors), and Fiber-Optic Cable (glass core transmitting light reflections, offering massive bandwidth and immunity to noise). 2. Unguided (Wireless): Radio Waves (omnidirectional,AM/FM), Microwaves (unidirectional, aligned parabolic dishes), and Infrared (line-of-sight short range)."
      }
    ]
  },
  "Unit II: Data Link Layer & Protocols": {
    intro: "Data Link Layer design issues, framing mechanisms, error detection/correction algorithms (Parity, Checksum, CRC, Hamming), sliding window flows, and Ethernet.",
    sections: [
      {
        title: "Data Link Design & Framing",
        text: "Responsible for node-to-node frame delivery. Framing techniques partition raw bitstreams: 1. Character Count (stores size in header; vulnerable to sync slips). 2. Flag Bytes (stuffs Escape ESC bytes before accidental flags). 3. Bit Stuffing (stuffs a '0' after five consecutive '1's in starting delimiter 01111110). 4. Coding Violations (Manchester transition patterns)."
      },
      {
        title: "Error Detection & CRC",
        text: "1. Simple Parity: Appends 1/0 to make count of 1s even or odd. 2. 2D Parity: Calculates block row and column parities. 3. Checksum: Splits data into m-bit segments, sums them using 1's complement, and complements the sum. 4. Cyclic Redundancy Check (CRC): Employs polynomial binary division (XOR) to append redundant check bits to the frame."
      },
      {
        title: "Hamming Code (Error Correction)",
        text: "Hamming Code detects and corrects single-bit errors. For d data bits, we append r redundant parity bits at positions 2^i (1, 2, 4, 8...). Redundant bits must satisfy 2^r >= d + r + 1. Recalculating the parity bits at the receiver yields a binary number showing the exact index of the damaged bit (0 indicates no error)."
      },
      {
        title: "Sliding Window Flow Control",
        text: "Prevents fast senders from overwhelming slow receivers. 1. Stop-and-Wait ARQ: Sends one frame, waits for ACK, resends on timer timeout (Modulo-2). 2. Go-Back-N ARQ: Send window up to 2^m - 1. When a frame fails, sender goes back and retransmits all outstanding frames. 3. Selective Repeat ARQ: Receiver buffers out-of-order frames and requests only damaged frames using NAK."
      }
    ]
  },
  "Unit III: Network Layer & Routing": {
    intro: "Network Layer store-and-forward routing, connectionless datagram vs connection-oriented virtual circuits, Dijkstra routing, DV/Link-state, and Congestion RED/Bucket algorithms.",
    sections: [
      {
        title: "Routing Principles & VC",
        text: "1. Datagram Networks: Connectionless. Packets are routed independently (as datagrams) at the network layer using dynamic routing tables. 2. Virtual-Circuit (VC) Networks: Connection-oriented. Establishes a dedicated path (setup phase, data transfer, teardown phase) where packets carry local Virtual Circuit Identifiers (VCIs)."
      },
      {
        title: "Routing Algorithms",
        text: "1. Shortest Path (Dijkstra's): Builds a tree of sink nodes by greedily selecting neighbor links with the smallest cumulative cost. 2. Distance Vector (DV): Each router periodically shares its entire routing table with direct neighbors (Bellman-Ford). Prone to count-to-infinity loop instability (solved by split horizon and poison reverse). 3. Link State (LSP): Routers flood local link states to all routers, letting everyone construct the identical map."
      },
      {
        title: "Congestion Control",
        text: "Congestion occurs when offered network load exceeds carrying capacity. 1. Warning Bit: Routers set bits in packet headers to request sender speed adjustments. 2. Choke Packets: Explicit control packets sent to throttles. 3. Load Shedding: Discards packages when buffers are full. 4. Random Early Discard (RED): Proactively discards packets before buffer overflow by tracing avg queue thresholds."
      },
      {
        title: "Traffic Shaping",
        text: "Smoothes out bursty traffic before entry. 1. Leaky Bucket: Acts as a constant-service single queue enforcing strict, uniform output speed (discards packets if buffer overflows). 2. Token Bucket: Generates tokens periodically. Hosts must capture and destroy a token to transmit, allowing controlled bursts when tokens are saved."
      }
    ]
  },
  "Unit IV: Transport Layer & TCP/UDP": {
    intro: "Transport Layer process-to-process delivery, 3-way handshake connection, TCP vs UDP features, segment frames, and sliding window window-management.",
    sections: [
      {
        title: "Transport Layer Services",
        text: "Bridges host-to-host network layers to process-to-process applications. Uses TSAPs (Transport Service Access Points, i.e., Ports) and NSAPs (Network Service Access Points, i.e., IP Addresses). Connects processes via Portmappers."
      },
      {
        title: "Connection Management",
        text: "1. Establishment (3-Way Handshake): Client sends SYN, server replies SYN+ACK, client sends ACK. Solves delayed duplicate packets. 2. Release (Symmetric/Asymmetric): Asymmetric release (abrupt, risk of data loss) vs Symmetric release (each direction closes separately, solved by 3-way handshake release; refers to two-army synchronization problem)."
      },
      {
        title: "TCP Segment & Features",
        text: "Transmission Control Protocol is connection-oriented, reliable, and byte-stream oriented. Uses a 20-60 byte header housing Source/Dest Ports, 32-bit Sequence/Ack Numbers, Window Size, Checksum, and flag bits (URG, ACK, PSH, RST, SYN, FIN)."
      },
      {
        title: "TCP Sliding Window & Congestion",
        text: "Sender limits window size to MIN(rwnd, cwnd). Employs AIMD (Additive Increase, Multiplicative Decrease). Retransmission triggers: 1. Retransmission Time Out (RTO). 2. Fast Retransmit: Triggers immediately if 3 duplicate ACKs arrive in a row. Uses Slow Start (cwnd doubles each RTT) and Congestion Avoidance."
      }
    ]
  },
  "Unit V: Application Layer & DNS": {
    intro: "Application Layer services, Domain Name Space (DNS) hierarchical structures, generic/country/inverse domains, zones, and name server resolution.",
    sections: [
      {
        title: "Domain Name Space Architecture",
        text: "DNS maps alphabetic hostnames to numeric IP addresses. Organized as a hierarchical inverted tree structure capped at 128 levels (root at top). Nodes represent domains with local text labels (max 63 characters). Fully Qualified Domain Names (FQDN) represent absolute paths."
      },
      {
        title: "Domain Classifications",
        text: "1. Generic Domains: Registered hosts grouped by behavior (.com commercial, .edu educational, .org nonprofit, etc.). 2. Country Domains: Two-character country codes (.us, .in, .jp) with regional sub-labels. 3. Inverse Domain: Used for reverse IP-to-name lookup (uses in-addr.arpa mapping)."
      },
      {
        title: "Hierarchy of Name Servers",
        text: "Distributes domain mappings across distributed databases: 1. Root Servers: Hold complete tree authorities, delegating lookup paths. 2. Primary Servers: Hold read-write master zone files. 3. Secondary Servers: Read-only mirrors syncing from primary servers."
      },
      {
        title: "DNS Resolution & Caching",
        text: "1. Recursive Resolution: Client requests name, local server queries up the chain recursively returning final answers. 2. Iterative Resolution: Server replies with direct referrals to intermediate servers. 3. Caching: Servers cache past mapping hits to accelerate lookup latencies."
      }
    ]
  }
};

export default function NetworksTheory({ onBack }) {
  const [activeUnit, setActiveUnit] = useState("Unit I: Introduction & Physical Layer");
  const [activeSimulator, setActiveSimulator] = useState("sliding"); // sliding | hamming | leaky

  // Sliding Window Simulator State
  const [sf, setSf] = useState(2); // first outstanding
  const [sn, setSn] = useState(6); // next to send
  const [windowSize, setWindowSize] = useState(4);
  const totalFrames = 12;

  // Hamming Code Simulator State
  const [dataBits, setDataBits] = useState("1010");
  const [hammingOutput, setHammingOutput] = useState("");

  // Leaky Bucket Simulator State
  const [waterLevel, setWaterLevel] = useState(40);
  const [inputRate, setInputRate] = useState(15);
  const [leakRate] = useState(10);
  const [simLogs, setSimLogs] = useState(["Bucket initialized. Leaking constantly at 10 units/tick."]);

  // Handle Hamming Code calculations
  const calculateHamming = (data) => {
    if (!/^[01]{4}$/.test(data)) {
      alert("Please enter a valid 4-bit binary string (only 0s and 1s)!");
      return;
    }
    
    // Convert string to bit array (reversed indices to match 1-based logic)
    const d3 = parseInt(data[0]);
    const d5 = parseInt(data[1]);
    const d6 = parseInt(data[2]);
    const d7 = parseInt(data[3]);
    
    // Parity calculations
    // r1 covers positions 1, 3, 5, 7
    // r2 covers positions 2, 3, 6, 7
    // r4 covers positions 4, 5, 6, 7
    const r1 = d3 ^ d5 ^ d7;
    const r2 = d3 ^ d6 ^ d7;
    const r4 = d5 ^ d6 ^ d7;

    const result = `${d7}${d6}${d5}${r4}${d3}${r2}${r1}`;
    setHammingOutput(result);
  };

  // Simulate Leaky Bucket clock tick
  const handleBucketTick = () => {
    setWaterLevel(prev => {
      let next = prev + inputRate;
      let logs = [...simLogs];
      logs.unshift(`Added ${inputRate} units of data packets.`);
      
      if (next > 100) {
        logs.unshift(`⚠️ BUCKET OVERFLOW! Discarded ${next - 100} units of packets!`);
        next = 100;
      }
      
      next = Math.max(0, next - leakRate);
      logs.unshift(`Leaked ${leakRate} units. Current water level: ${next} units.`);
      setSimLogs(logs.slice(0, 8)); // keep last 8 logs
      
      return next;
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
      
      {/* 1. Sleek Glassmorphic Header */}
      <div className="glass-panel" style={{
        width: '100%',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--glass-border)',
        borderLeft: '4px solid var(--yellow-neon)',
        padding: '12px 30px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--panel-shadow)',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'var(--input-bg)',
              border: 'var(--glass-border)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--yellow-neon)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg-focus)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-glow-pink" style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '0.5px'
          }}>
            Computer Networks Placement Theory Suite
          </h2>
        </div>
        
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.74rem',
          color: 'var(--yellow-neon)',
          fontWeight: '800',
          fontFamily: 'var(--font-mono)'
        }}>
          Syllabus-aligned slide deck
        </div>
      </div>

      {/* Main Grid: Theory Cards + Interactive Simulators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '20px',
        width: '100%',
        alignItems: 'stretch'
      }}>
        
        {/* Left Card: Theory Book */}
        <div className="glass-panel" style={{
          background: 'var(--panel-bg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          textAlign: 'left'
        }}>
          {/* Unit selector tab */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {Object.keys(THEORY_CONTENT).map(unitKey => (
              <button
                key={unitKey}
                onClick={() => setActiveUnit(unitKey)}
                style={{
                  background: activeUnit === unitKey ? 'var(--yellow-neon)' : 'var(--input-bg)',
                  border: 'var(--glass-border)',
                  borderRadius: '8px',
                  color: activeUnit === unitKey ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.64rem',
                  fontWeight: '800',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.25s'
                }}
              >
                {unitKey.split(":")[0]}
              </button>
            ))}
          </div>

          {/* Active Unit Description */}
          <div>
            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={12} /> {activeUnit} OVERVIEW
            </span>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
              {THEORY_CONTENT[activeUnit].intro}
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Section slides accordion style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '55vh', overflowY: 'auto' }}>
            {THEORY_CONTENT[activeUnit].sections.map((sec, idx) => (
              <div key={idx} style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChevronRight size={14} style={{ color: 'var(--yellow-neon)' }} /> {sec.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {sec.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Interactive Simulators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tabs to switch between simulators */}
          <div className="glass-panel" style={{
            background: 'var(--panel-bg)',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--yellow-neon)' }}>
              🎛️ PROTOCOL SIMULATORS:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['sliding', 'hamming', 'leaky'].map(sim => (
                <button
                  key={sim}
                  onClick={() => setActiveSimulator(sim)}
                  style={{
                    background: activeSimulator === sim ? 'var(--yellow-neon)' : 'transparent',
                    border: 'var(--glass-border)',
                    borderRadius: '6px',
                    color: activeSimulator === sim ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.25s'
                  }}
                >
                  {sim === 'sliding' ? 'Sliding Window' : sim === 'hamming' ? 'Hamming Code' : 'Leaky Bucket'}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Content Area */}
          <div className="glass-panel" style={{
            background: 'var(--panel-bg)',
            padding: '24px',
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'left'
          }}>
            
            {/* 1. SLIDING WINDOW SIMULATOR */}
            {activeSimulator === 'sliding' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Go-Back-N / Selective Repeat sliding window
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Simulate how the sender window restricts outstanding packets, utilizing variables Sf (first outstanding frame) and Sn (next frame to send).
                  </p>
                </div>

                {/* Visual Frame Stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '15px 0' }}>
                  {Array.from({ length: totalFrames }).map((_, idx) => {
                    const isAcknowledged = idx < sf;
                    const isOutstanding = idx >= sf && idx < sn;
                    const isInWindow = idx >= sf && idx < sf + windowSize;
                    const canBeSent = isInWindow && idx >= sn;
                    const cannotBeSent = idx >= sf + windowSize;
                    
                    let bg = 'rgba(255,255,255,0.02)';
                    let border = '1px solid rgba(255,255,255,0.08)';
                    let textColor = 'var(--text-muted)';
                    let label = 'Standby';

                    if (isAcknowledged) {
                      bg = 'rgba(16, 185, 129, 0.08)';
                      border = '1px solid var(--emerald-neon)';
                      textColor = 'var(--emerald-neon)';
                      label = 'ACKed';
                    } else if (isOutstanding) {
                      bg = 'rgba(236, 72, 153, 0.08)';
                      border = '1px solid var(--pink-neon)';
                      textColor = 'var(--pink-neon)';
                      label = 'Sent/Pending';
                    } else if (canBeSent) {
                      bg = 'rgba(6, 182, 212, 0.08)';
                      border = '1px solid var(--cyan-neon)';
                      textColor = 'var(--cyan-neon)';
                      label = 'Usable';
                    } else if (cannotBeSent) {
                      bg = 'rgba(255,255,255,0.01)';
                      border = '1px dashed rgba(255,255,255,0.04)';
                      textColor = 'var(--text-muted)';
                      label = 'Locked';
                    }

                    return (
                      <div key={idx} style={{
                        flex: '1',
                        minWidth: '60px',
                        padding: '10px 4px',
                        background: bg,
                        border: border,
                        borderRadius: '8px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: '900', color: textColor }}>{idx}</span>
                        <span style={{ fontSize: '0.54rem', fontFamily: 'var(--font-mono)', opacity: 0.8, color: textColor }}>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Controller variables sliders */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Sf (First Outstanding Frame): {sf}
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max={sn} 
                      value={sf} 
                      onChange={(e) => setSf(parseInt(e.target.value))}
                      style={{ accentColor: 'var(--yellow-neon)', cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Sn (Next to Send): {sn}
                    </label>
                    <input 
                      type="range" 
                      min={sf} 
                      max={Math.min(totalFrames, sf + windowSize)} 
                      value={sn} 
                      onChange={(e) => setSn(parseInt(e.target.value))}
                      style={{ accentColor: 'var(--yellow-neon)', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* Sliding window explanation details */}
                <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--glass-border)', borderRadius: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  <strong>Go-Back-N rule:</strong> The active window size is currently set to <strong>{windowSize}</strong> frames. 
                  Currently, frames <strong>{sf}</strong> to <strong>{sn - 1}</strong> are outstanding in transit. 
                  Frames <strong>{sn}</strong> to <strong>{Math.min(totalFrames - 1, sf + windowSize - 1)}</strong> are unlocked and can be sent immediately.
                </div>
              </div>
            )}

            {/* 2. HAMMING CODE SIMULATOR */}
            {activeSimulator === 'hamming' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Hamming Code 7-Bit Generator
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Input a 4-bit data word (like 1010) to dynamically calculate the 3 redundant parity bits and construct the final 7-bit corrected Hamming Code word.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0' }}>
                  <input 
                    type="text" 
                    maxLength="4"
                    value={dataBits}
                    onChange={(e) => {
                      setDataBits(e.target.value);
                      if (e.target.value.length === 4) calculateHamming(e.target.value);
                    }}
                    placeholder="e.g. 1010"
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--input-bg)',
                      border: 'var(--glass-border)',
                      borderRadius: '8px',
                      width: '120px',
                      textAlign: 'center'
                    }}
                  />
                  <button 
                    onClick={() => calculateHamming(dataBits)}
                    className="btn-cyber"
                    style={{ padding: '8px 16px', fontSize: '0.72rem', background: 'var(--yellow-neon)' }}
                  >
                    Generate Hamming
                  </button>
                </div>

                {hammingOutput && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold' }}>GENERATED 7-BIT HAMMING WORD (REVERSED INDEX 7 to 1):</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {hammingOutput.split("").map((bit, idx) => {
                        const pos = 7 - idx;
                        const isRedundant = pos === 1 || pos === 2 || pos === 4;
                        const colorLabel = isRedundant ? 'var(--pink-neon)' : 'var(--cyan-neon)';
                        
                        return (
                          <div key={idx} style={{
                            flex: '1',
                            padding: '8px',
                            background: isRedundant ? 'rgba(236,72,153,0.06)' : 'rgba(6,182,212,0.06)',
                            border: `1.5px solid ${colorLabel}`,
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}>
                            <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: colorLabel }}>{bit}</h5>
                            <span style={{ fontSize: '0.54rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Pos {pos}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--glass-border)', borderRadius: '10px', fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <strong>Mathematical Verification:</strong> Parity bits <strong>r1, r2, r4</strong> are calculated at indices 1, 2, and 4. 
                      r1 covers indices (1,3,5,7) XOR, r2 covers indices (2,3,6,7) XOR, and r4 covers indices (4,5,6,7) XOR. 
                      If any single bit transitions at the receiver, computing new parities instantly highlights the erroneous position!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. LEAKY BUCKET SIMULATOR */}
            {activeSimulator === 'leaky' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Leaky Bucket Congestion & Flow Shaper
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Inject bursty data packets and verify how the leaky bucket enforces a constant, smooth output leak rate (10 units/tick) to prevent network congestion.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {/* Bucket Visual Display */}
                  <div style={{
                    width: '100px',
                    height: '140px',
                    border: '3px solid var(--glass-border)',
                    borderTop: 'none',
                    borderRadius: '0 0 16px 16px',
                    position: 'relative',
                    background: 'rgba(255,255,255,0.01)',
                    overflow: 'hidden'
                  }}>
                    {/* Water Level */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: `${waterLevel}%`,
                      background: 'linear-gradient(to top, rgba(0, 242, 254, 0.25), rgba(6, 182, 212, 0.45))',
                      transition: 'height 0.3s ease'
                    }} />
                    {/* Centered level indicator */}
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)'
                    }}>{waterLevel}%</span>
                  </div>

                  {/* Simulator Parameters */}
                  <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        Bursty Input Load Rate: {inputRate} units
                      </label>
                      <input 
                        type="range" 
                        min="5" 
                        max="40" 
                        value={inputRate} 
                        onChange={(e) => setInputRate(parseInt(e.target.value))}
                        style={{ accentColor: 'var(--yellow-neon)', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={handleBucketTick}
                        className="btn-cyber"
                        style={{ padding: '8px 16px', fontSize: '0.72rem', background: 'var(--yellow-neon)' }}
                      >
                        Inject Load & Tick Clock
                      </button>
                      <button 
                        onClick={() => {
                          setWaterLevel(0);
                          setSimLogs(["Bucket cleared."]);
                        }}
                        style={{ background: 'transparent', border: 'var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.64rem', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        Reset Bucket
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulation Logs */}
                <div style={{
                  background: '#050814',
                  border: '1.5px solid var(--glass-border)',
                  borderRadius: '10px',
                  padding: '12px',
                  height: '110px',
                  overflowY: 'auto'
                }}>
                  <span style={{ fontSize: '0.54rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={10} /> LIVE TELEMETRY SHAPER LOGS
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#fff', marginTop: '6px' }}>
                    {simLogs.map((log, idx) => (
                      <div key={idx} style={{ color: log.startsWith('⚠️') ? '#ff4d4d' : 'var(--text-secondary)' }}>{log}</div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
