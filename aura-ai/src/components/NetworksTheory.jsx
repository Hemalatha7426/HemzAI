import { useState } from 'react';
import { ArrowLeft, HelpCircle, Activity, CheckCircle2, XCircle, RotateCw, Trophy, Sparkles } from 'lucide-react';

// Curated 25 note-aligned placement questions compiled directly from the PDF
const PRACTICE_QUESTIONS = [
  // Unit 1
  {
    id: 1,
    unit: "Unit I: Introduction & Physical Layer",
    difficulty: "MEDIUM",
    question: "A computer network consists of 12 active communication nodes. If you design a fully redundant Mesh physical topology to connect these nodes, how many dedicated communication links are required in total?",
    options: ["12 links", "66 links", "132 links", "24 links"],
    answerIndex: 1,
    explanation: "According to page 8 and page 9 of the PDF notes, in a full mesh topology, every computer in the network has a dedicated connection to each of the other computers. The formula for the number of connections is n(n-1)/2, where n is the number of computers. For 12 nodes, links = 12 * 11 / 2 = 66 links."
  },
  {
    id: 2,
    unit: "Unit I: Introduction & Physical Layer",
    difficulty: "EASY",
    question: "Which communication data flow mode allows bidirectional exchange between two devices, but only one device can transmit at a time (e.g. while one station sends, the other must wait and receive)?",
    options: ["Simplex mode", "Half-duplex mode", "Full-duplex mode", "Broadcast mode"],
    answerIndex: 1,
    explanation: "As documented on page 6 of the PDF notes, in half-duplex mode, each station can both transmit and receive, but not at the same time. When one device is sending, the other can only receive. Symmetrical walkie-talkies and citizens band (CB) radios are classic half-duplex examples."
  },
  {
    id: 3,
    unit: "Unit I: Introduction & Physical Layer",
    difficulty: "EASY",
    question: "What physical guided transmission medium utilizes total internal reflection of light waves through highly purified glass or plastic to transmit massive data speeds over long ranges with near-zero noise interference?",
    options: ["Shielded Twisted-Pair (STP)", "Coaxial Cable", "Fiber-Optic Cable", "Unshielded Twisted-Pair (UTP)"],
    answerIndex: 2,
    explanation: "Page 14 of the notes states that a fiber-optic cable is made of glass or plastic and transmits signals in the form of light using reflection. Due to this cladding reflection boundary (page 16), it offers higher bandwidth, immunity to electromagnetic noise, and lower attenuation over extremely long distances."
  },
  {
    id: 4,
    unit: "Unit I: Introduction & Physical Layer",
    difficulty: "MEDIUM",
    question: "A security attack fakes the source IP addresses of a flood of SYN segments, causing a target server to allocate resources and set timers for connection requests that never complete, eventually exhausting server memory. What is this called?",
    options: ["Phishing Attack", "Botnet Attack", "SYN Flooding Attack", "Man-in-the-Middle Attack"],
    answerIndex: 2,
    explanation: "As detailed on page 147 of the PDF notes, the SYN flooding attack belongs to the denial-of-service class. The attacker sends a large volume of SYN segments with faked IP headers. The server allocates system tables and timers expecting a complete active open, eventually running out of resources and crashing."
  },
  {
    id: 5,
    unit: "Unit I: Introduction & Physical Layer",
    difficulty: "HARD",
    question: "Which wireless unguided medium uses highly unidirectional propagation and requires both sending and receiving horn or parabolic dish antennas to be precisely aligned in a direct line-of-sight path?",
    options: ["Radio Waves", "Microwaves", "Infrared Waves", "Omnidirectional frequencies"],
    answerIndex: 1,
    explanation: "Page 18 of the notes details that microwaves operate between 1 and 300 GHz and are highly unidirectional. Because of this unidirectional characteristic, sending and receiving antennas (horn or parabolic dish) need to be aligned and are used for line-of-sight unicast communication."
  },
  // Unit 2
  {
    id: 6,
    unit: "Unit II: Data Link Layer & Protocols",
    difficulty: "MEDIUM",
    question: "When using starting/ending delimiter flags of '01111110' for framing, what action does the sender take if it senses five consecutive '1' bits in the user data stream?",
    options: ["It discards the frame immediately.", "It automatically stuffs a '0' bit.", "It inserts an ESC byte.", "It flips the fifth bit to a '0'."],
    answerIndex: 1,
    explanation: "Page 40 of the PDF notes states that whenever the sender's data link layer encounters five consecutive 1s in the data, it automatically stuffs a '0' bit into the outgoing stream. This bit stuffing prevents accidental starting/ending delimiter flags (01111110) from occurring in the middle of user data. The receiver automatically deletes this '0' bit."
  },
  {
    id: 7,
    unit: "Unit II: Data Link Layer & Protocols",
    difficulty: "MEDIUM",
    question: "Unlike simple checksum schemes that rely on basic binary addition, what mathematical operation is utilized to calculate block validation remainders in Cyclic Redundancy Checks (CRC)?",
    options: ["1's complement arithmetic", "Modulo-2 binary division using XOR", "2's complement subtraction", "Modulo-10 division"],
    answerIndex: 1,
    explanation: "Citing page 69 of the PDF notes, CRC is based on binary division rather than basic addition. A sequence of redundant bits (CRC remainder) is appended to the data unit so that the resulting block is exactly divisible by a predetermined divisor (generator polynomial) using modulo-2 XOR division."
  },
  {
    id: 8,
    unit: "Unit II: Data Link Layer & Protocols",
    difficulty: "HARD",
    question: "Using the Hamming code error correction inequality (2^r >= d + r + 1), what is the minimum number of redundant parity bits (r) required to protect a 4-bit data word (d = 4)?",
    options: ["2 bits", "3 bits", "4 bits", "5 bits"],
    answerIndex: 1,
    explanation: "Page 70 and page 71 of the PDF notes show the calculation. For a data word of size d = 4, the redundant parity bits r must satisfy the formula 2^r >= d + r + 1. Substituting r = 3 yields: 2^3 >= 4 + 3 + 1, or 8 >= 8, which is the smallest value of r that satisfies the inequality."
  },
  {
    id: 9,
    unit: "Unit II: Data Link Layer & Protocols",
    difficulty: "MEDIUM",
    question: "Under the Go-Back-N ARQ sliding window protocol, what is the maximum size of the send window if the sequence numbers are size 'm' bits (modulo 2^m)?",
    options: ["2^m", "2^m - 1", "2^(m-1)", "Unlimited"],
    answerIndex: 1,
    explanation: "As documented on page 45 of the PDF notes, in the Go-Back-N protocol, the sequence numbers are modulo 2^m. The maximum size of the send window is 2^m - 1. Keeping it strictly below 2^m prevents ambiguity between original transmissions and duplicate retransmissions when ACKs are lost."
  },
  {
    id: 10,
    unit: "Unit II: Data Link Layer & Protocols",
    difficulty: "HARD",
    question: "What is the primary difference in receive window sizes and frame handling between Go-Back-N ARQ and Selective Repeat ARQ?",
    options: ["Go-Back-N receiver window is size 1 and discards out-of-order frames; Selective Repeat receiver window is equal to the send window and buffers out-of-order frames", "Go-Back-N buffers out-of-order frames; Selective Repeat discards them", "Go-Back-N has a larger receiver window than Selective Repeat", "Go-Back-N uses NAK frames; Selective Repeat does not"],
    answerIndex: 0,
    explanation: "As described on page 46 and page 49 of the notes, in Go-Back-N, the receive window size is strictly 1, meaning any frame arriving out of order is discarded. In Selective Repeat, the receive window is equal to the send window size (2^(m-1)), allowing it to buffer out-of-order frames and request only the missing ones using NAK."
  },
  // Unit 3
  {
    id: 11,
    unit: "Unit III: Network Layer & Routing",
    difficulty: "MEDIUM",
    question: "In packet-switching networks, what term describes the mechanism where a router holds a packet until it has completely arrived, verifies its checksum, and only then forwards it to the next link?",
    options: ["Cut-through packet switching", "Store-and-forward packet switching", "Circuit setup routing", "Virtual-circuit mapping"],
    answerIndex: 1,
    explanation: "Page 80 of the PDF notes defines store-and-forward packet switching. A host transmits a packet, which is stored at the nearest router until it has fully arrived. The router verifies the packet's integrity (checksum) and only then forwards it along the next link in the path."
  },
  {
    id: 12,
    unit: "Unit III: Network Layer & Routing",
    difficulty: "MEDIUM",
    question: "Which intra-domain dynamic routing protocol is prone to the 'count-to-infinity' loop instability problem upon link or node failures?",
    options: ["Dijkstra's Shortest Path Routing", "Distance Vector Routing", "Link State Routing", "Hierarchical Path Routing"],
    answerIndex: 1,
    explanation: "Page 90 and page 91 of the PDF notes illustrate the 'count-to-infinity' loop instability in Distance Vector routing. Because nodes only have partial neighborhood knowledge, link failures can cause circular updates where nodes advertise stale paths, counting to infinity (defined as 16 in RIP). Solutions include split horizon and poison reverse."
  },
  {
    id: 13,
    unit: "Unit III: Network Layer & Routing",
    difficulty: "HARD",
    question: "What is the standard periodic flooding interval for Link State Packets (LSP) to ensure database synchronization in stable Link State dynamic routing domains?",
    options: ["Every 30 seconds", "Every 60 seconds", "Every 60 minutes or 2 hours", "Only when a state changes"],
    answerIndex: 2,
    explanation: "Page 92 of the notes explains that LSPs are generated either when a topology change occurs or on a periodic basis. To prevent excessive control traffic, the periodic timer is much longer than Distance Vector (which runs every 30s) and is set to every 60 minutes or 2 hours."
  },
  {
    id: 14,
    unit: "Unit III: Network Layer & Routing",
    difficulty: "HARD",
    question: "Which proactive congestion avoidance algorithm monitors average queue length ('avg') and drops random packets *before* the router buffer becomes completely full to signal endpoints to slow down?",
    options: ["Warning Bit tagging", "Choke Packets generation", "Load Shedding", "Random Early Discard (RED)"],
    answerIndex: 3,
    explanation: "Citing page 100 of the PDF notes, Random Early Discard (RED) is a proactive congestion avoidance approach. The router computes average queue length (avg). If avg falls between a lower and an upper threshold, the router drops or marks incoming packets with a calculated probability, preventing queue exhaustion."
  },
  {
    id: 15,
    unit: "Unit III: Network Layer & Routing",
    difficulty: "MEDIUM",
    question: "What is the key difference in traffic characteristics between a Leaky Bucket shaper and a Token Bucket shaper?",
    options: ["Leaky Bucket allows packet saving; Token Bucket does not", "Leaky Bucket enforces a constant, smooth output rate regardless of input burstiness; Token Bucket allows controlled bursts if tokens have accumulated", "Leaky Bucket discards tokens; Token Bucket discards packets", "There is no difference in their output flow rates"],
    answerIndex: 1,
    explanation: "As documented on pages 101 and 102 of the notes, the Leaky Bucket shaper enforces a constant, uniform output rate (smoothing out bursts). In contrast, the Token Bucket allows the output rate to vary depending on the burst size, letting hosts send accumulated bursts immediately if tokens are saved."
  },
  // Unit 4
  {
    id: 16,
    unit: "Unit IV: Transport Layer & TCP/UDP",
    difficulty: "EASY",
    question: "To prevent old, delayed duplicate packets from accidentally establishing a connection, what connection setup protocol is used in TCP?",
    options: ["Symmetric release", "Asymmetric teardown", "Three-way handshake", "Port mapping"],
    answerIndex: 2,
    explanation: "As documented on page 122 of the PDF notes, Tomlinson introduced the three-way handshake to solve the problem of delayed duplicates. The three-step exchange (SYN -> SYN+ACK -> ACK) ensures that both hosts agree on the connection and sequence numbers before data starts flowing."
  },
  {
    id: 17,
    unit: "Unit IV: Transport Layer & TCP/UDP",
    difficulty: "HARD",
    question: "In TCP connection release, what classical coordination problem describes the impossibility of two armies securely agreeing on a simultaneous attack plan over an unreliable channel?",
    options: ["The Byzantine Generals Problem", "The Two-Army Problem", "The Silly Window Syndrome", "The Count-to-Infinity Problem"],
    answerIndex: 1,
    explanation: "Page 127 of the notes cites the Two-Army Problem to describe symmetric connection release. Since the final acknowledgement segment can always be lost, it is theoretically impossible to guarantee that both hosts release the connection at the exact same moment."
  },
  {
    id: 18,
    unit: "Unit IV: Transport Layer & TCP/UDP",
    difficulty: "MEDIUM",
    question: "What is the minimum and maximum possible byte size of a standard TCP segment header?",
    options: ["8 bytes to 20 bytes", "20 bytes to 60 bytes", "64 bytes to 1500 bytes", "40 bytes to 80 bytes"],
    answerIndex: 1,
    explanation: "As documented on page 141 of the PDF notes, a TCP segment consists of a 20- to 60-byte header. The mandatory fields require 20 bytes, and optional fields (such as MSS or timestamps) can occupy up to an additional 40 bytes, represented by the 4-bit Header Length (HLEN) field."
  },
  {
    id: 19,
    unit: "Unit IV: Transport Layer & TCP/UDP",
    difficulty: "MEDIUM",
    question: "If a TCP sender receives three duplicate ACKs (four identical ACKs in total), what mechanism is triggered to retransmit the missing segment without waiting for the RTO timer to expire?",
    options: ["Slow Start", "Silly Window mitigation", "Fast Retransmit", "Nagle's Algorithm"],
    answerIndex: 2,
    explanation: "Page 176 of the notes documents the Fast Retransmit mechanism. When the sender receives three duplicate ACKs, it assumes the indicated segment is lost and immediately retransmits it. This avoids waiting for a costly retransmission timeout."
  },
  {
    id: 20,
    unit: "Unit IV: Transport Layer & TCP/UDP",
    difficulty: "HARD",
    question: "In Remote Procedure Call (RPC), what component is bound to the client application's address space to marshal parameters into messages and hide networking details?",
    options: ["Server stub", "Client stub", "Portmapper service", "Socket interface"],
    answerIndex: 1,
    explanation: "Page 189 and page 190 of the notes explain that the client stub represents the server procedure in the client's address space. It handles marshaling (packing parameters into a network message) and invokes the operating system's transport calls, hiding the network from the client code."
  },
  // Unit 5
  {
    id: 21,
    unit: "Unit V: Application Layer & DNS",
    difficulty: "MEDIUM",
    question: "What are the structural tree height limit and local node label character length constraints inside the hierarchical Domain Name Space (DNS)?",
    options: ["Capped at 128 levels, with 63 characters maximum per label", "Capped at 64 levels, with 32 characters maximum per label", "Capped at 256 levels, with 128 characters maximum per label", "Unlimited tree height with 255 character label limits"],
    answerIndex: 0,
    explanation: "According to pages 289 and 290 of the PDF notes, the DNS tree is structured as an inverted tree with the root at the top. The tree is capped at 128 levels (level 0 to level 127), and each node has a label with a maximum length of 63 characters."
  },
  {
    id: 22,
    unit: "Unit V: Application Layer & DNS",
    difficulty: "MEDIUM",
    question: "Which type of DNS lookup is used to map an active IP address back to its respective domain name, and what special suffix does it query?",
    options: ["Forward lookup, querying .com", "Inverse lookup, querying in-addr.arpa", "Recursive resolution, querying root servers", "Iterative lookup, querying .net"],
    answerIndex: 1,
    explanation: "Page 300 of the PDF notes shows that the inverse domain is used to map an address to a name (reverse DNS lookup). This queries the special domain structure under in-addr.arpa (for example, `121.45.34.132.in-addr.arpa`)."
  },
  {
    id: 23,
    unit: "Unit V: Application Layer & DNS",
    difficulty: "MEDIUM",
    question: "In DNS name resolution, what is the core difference between a Recursive Resolution and an Iterative Resolution?",
    options: ["Recursive returns the final mapping directly; Iterative returns direct referrals to intermediate servers", "Recursive queries primary servers; Iterative queries secondary servers", "Recursive uses TCP; Iterative uses UDP", "Recursive caches lookup hits; Iterative does not"],
    answerIndex: 0,
    explanation: "As described on page 301 and page 303 of the notes, in recursive resolution, the client resolver expects the server to supply the final resolved mapping directly. In iterative resolution, if a server is not authoritative, it returns a referral containing the IP of the next name server in the tree."
  },
  {
    id: 24,
    unit: "Unit V: Application Layer & DNS",
    difficulty: "EASY",
    question: "Under what well-known port does the DNS service operate, and which transport layer protocols does it utilize?",
    options: ["Port 80, using HTTP", "Port 53, using UDP or TCP", "Port 21, using FTP", "Port 25, using SMTP"],
    answerIndex: 1,
    explanation: "Page 308 of the PDF notes explicitly documents that DNS can use either UDP or TCP for transport, and in both cases, the well-known port used by the server is port 53."
  },
  {
    id: 25,
    unit: "Unit V: Application Layer & DNS",
    difficulty: "EASY",
    question: "How are World Wide Web (WWW) documents categorized based on the time at which their contents are determined?",
    options: ["HTML, CSS, and JS documents", "Text, Audio, and Video files", "Static, Dynamic, and Active documents", "Local, Remote, and Distributed files"],
    answerIndex: 2,
    explanation: "According to page 275 of the PDF notes, WWW documents are grouped into three broad categories: Static (fixed content created and stored at the server, page 276), Dynamic (created by a web server script on request, page 279), and Active (programs or scripts executed at the client site, page 283)."
  }
];

export default function NetworksTheory({ onBack }) {
  const [activeTab, setActiveTab] = useState("pdf"); // pdf | hamming | practice
  const [activePracticeUnit, setActivePracticeUnit] = useState("Unit I: Introduction & Physical Layer");
  
  // Practice Chamber State
  const [selectedQuestion, setSelectedQuestion] = useState(PRACTICE_QUESTIONS.find(q => q.unit === "Unit I: Introduction & Physical Layer"));
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [solvedQuestions, setSolvedQuestions] = useState(() => {
    const savedSolved = localStorage.getItem("hemz_networks_solved");
    return savedSolved ? JSON.parse(savedSolved) : {};
  });
  const [scoreboard, setScoreboard] = useState(() => {
    const savedScoreboard = localStorage.getItem("hemz_networks_scoreboard");
    return savedScoreboard ? JSON.parse(savedScoreboard) : { solvedCount: 0, totalAttempts: 0, correctCount: 0, accuracy: 100 };
  });

  // Hamming Code Simulator State (simulation of hashcode)
  const [dataBits, setDataBits] = useState("1010");
  const [hammingOutput, setHammingOutput] = useState("");

  // Sync practice question when unit changes
  const handleSelectPracticeUnit = (unit) => {
    setActivePracticeUnit(unit);
    const firstQ = PRACTICE_QUESTIONS.find(q => q.unit === unit);
    setSelectedQuestion(firstQ);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
  };

  const handleSelectQuestion = (q) => {
    setSelectedQuestion(q);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
  };

  // Submit Answer validation and scoreboard increment
  const handleAnswerSubmit = (optionIdx) => {
    if (isAnswerSubmitted) return;
    
    setSelectedOptionIndex(optionIdx);
    setIsAnswerSubmitted(true);

    const isCorrect = optionIdx === selectedQuestion.answerIndex;
    const isAlreadySolved = solvedQuestions[selectedQuestion.id];

    // Build updated solved lists
    const updatedSolved = { ...solvedQuestions };
    if (isCorrect) {
      updatedSolved[selectedQuestion.id] = true;
      setSolvedQuestions(updatedSolved);
      localStorage.setItem("hemz_networks_solved", JSON.stringify(updatedSolved));
    }

    // Build updated scoreboard
    const newCorrect = isCorrect && !isAlreadySolved ? scoreboard.correctCount + 1 : scoreboard.correctCount;
    const newAttempts = scoreboard.totalAttempts + 1;
    const newSolved = Object.keys(updatedSolved).length;
    const newAccuracy = Math.round((newCorrect / newAttempts) * 100);

    const updatedScoreboard = {
      solvedCount: newSolved,
      totalAttempts: newAttempts,
      correctCount: newCorrect,
      accuracy: newAttempts > 0 ? newAccuracy : 100
    };

    setScoreboard(updatedScoreboard);
    localStorage.setItem("hemz_networks_scoreboard", JSON.stringify(updatedScoreboard));
  };

  // Reset progress confirm
  const handleResetProgress = () => {
    if (!window.confirm("Are you sure you want to permanently clear all networks practice questions progress?")) {
      return;
    }
    localStorage.removeItem("hemz_networks_solved");
    localStorage.removeItem("hemz_networks_scoreboard");
    setSolvedQuestions({});
    setScoreboard({ solvedCount: 0, totalAttempts: 0, correctCount: 0, accuracy: 100 });
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
  };

  // Handle Hamming Code calculations (simulation of hashcode)
  const calculateHamming = (data) => {
    if (!/^[01]{4}$/.test(data)) {
      alert("Please enter a valid 4-bit binary string (only 0s and 1s)!");
      return;
    }
    const d3 = parseInt(data[0]);
    const d5 = parseInt(data[1]);
    const d6 = parseInt(data[2]);
    const d7 = parseInt(data[3]);
    const r1 = d3 ^ d5 ^ d7;
    const r2 = d3 ^ d6 ^ d7;
    const r4 = d5 ^ d6 ^ d7;
    const result = `${d7}${d6}${d5}${r4}${d3}${r2}${r1}`;
    setHammingOutput(result);
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'EASY') return 'var(--emerald-neon)';
    if (diff === 'MEDIUM') return 'var(--cyan-neon)';
    return 'var(--pink-neon)';
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
        marginBottom: '5px'
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
          <h2 className="text-glow-yellow" style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '0.5px'
          }}>
            Computer Networks Prep Workspace
          </h2>
        </div>
        
        {/* Workspace switcher tab selection (ONLY PDF, Hamming simulation, and Q&A practice) */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: 'var(--glass-border)' }}>
          {[
            { id: "pdf", label: "📖 Networks PDF" },
            { id: "hamming", label: "🔢 Simulation of Hashcode" },
            { id: "practice", label: "🎯 Practice Questions" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Sync default question
                if (tab.id === 'practice') {
                  const firstQ = PRACTICE_QUESTIONS.find(q => q.unit === activePracticeUnit);
                  setSelectedQuestion(firstQ);
                }
              }}
              style={{
                background: activeTab === tab.id ? 'var(--yellow-neon)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.74rem',
                fontWeight: '800',
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Renderer */}
      
      {/* Tab A: Embedded Network PDF Viewer */}
      {activeTab === 'pdf' && (
        <div className="glass-panel" style={{
          background: 'var(--panel-bg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
          minHeight: '75vh'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
            <div>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                OFFICIAL STUDY NOTE DECK
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                COMPUTER NETWORKS NOTES.pdf
              </h3>
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
              Interactive PDF Field Enabled
            </div>
          </div>

          {/* Fully Responsive Iframe PDF Reader */}
          <div style={{ flex: 1, width: '100%', minHeight: '68vh', borderRadius: '12px', overflow: 'hidden', border: 'var(--glass-border)', boxShadow: 'var(--panel-shadow)' }}>
            <iframe
              src="/COMPUTER NETWORKS NOTES.pdf"
              width="100%"
              height="100%"
              style={{ border: 'none', minHeight: '68vh' }}
              title="Computer Networks Notes Notes"
            />
          </div>
        </div>
      )}

      {/* Tab B: Interactive Hamming Code Simulator (Simulation of Hashcode) */}
      {activeTab === 'hamming' && (
        <div className="glass-panel" style={{
          background: 'var(--panel-bg)',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          textAlign: 'left',
          minHeight: '60vh'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Hamming Code Error-Correcting (Hashcode) Simulation
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Input a 4-bit data word (like 1010) to dynamically calculate the 3 redundant parity bits (r1, r2, r4) and construct the final 7-bit corrected Hamming Code word.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '15px 0' }}>
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
                padding: '12px 16px',
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                background: 'var(--input-bg)',
                border: 'var(--glass-border)',
                borderRadius: '8px',
                width: '140px',
                textAlign: 'center',
                color: 'var(--text-primary)'
              }}
            />
            <button 
              onClick={() => calculateHamming(dataBits)}
              className="btn-cyber"
              style={{ padding: '12px 24px', fontSize: '0.8rem', background: 'var(--yellow-neon)', color: '#ffffff' }}
            >
              Generate Hamming Code
            </button>
          </div>

          {hammingOutput && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold' }}>GENERATED 7-BIT HAMMING WORD (REVERSED INDEX 7 to 1):</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {hammingOutput.split("").map((bit, idx) => {
                  const pos = 7 - idx;
                  const isRedundant = pos === 1 || pos === 2 || pos === 4;
                  const colorLabel = isRedundant ? 'var(--pink-neon)' : 'var(--cyan-neon)';
                  
                  return (
                    <div key={idx} style={{
                      flex: '1',
                      padding: '12px 4px',
                      background: isRedundant ? 'rgba(236,72,153,0.06)' : 'rgba(6,182,212,0.06)',
                      border: `1.5px solid ${colorLabel}`,
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <h5 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', color: colorLabel }}>{bit}</h5>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{isRedundant ? `Parity r${pos}` : `Data d${pos}`}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--glass-border)', borderRadius: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong>Mathematical Parity Verification (Hashcode):</strong>
                <br />• <strong>r1</strong> covers indices 1, 3, 5, 7. Value: d3 ⊕ d5 ⊕ d7 = <strong>{hammingOutput[4]} ⊕ {hammingOutput[2]} ⊕ {hammingOutput[0]} = {hammingOutput[6]}</strong>.
                <br />• <strong>r2</strong> covers indices 2, 3, 6, 7. Value: d3 ⊕ d6 ⊕ d7 = <strong>{hammingOutput[4]} ⊕ {hammingOutput[1]} ⊕ {hammingOutput[0]} = {hammingOutput[5]}</strong>.
                <br />• <strong>r4</strong> covers indices 4, 5, 6, 7. Value: d5 ⊕ d6 ⊕ d7 = <strong>{hammingOutput[2]} ⊕ {hammingOutput[1]} ⊕ {hammingOutput[0]} = {hammingOutput[3]}</strong>.
                <br />Recalculating the parity checks at the receiver yields a binary value (r4 r2 r1) representing the exact decimal index of the single-bit error (e.g. 000 indicates no error).
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab C: Q&A Practice Playground */}
      {activeTab === 'practice' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '20px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          {/* Side Menu & solved checker sidebar */}
          <div className="glass-panel" style={{
            background: 'var(--panel-bg)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Unit Dropdown Filter selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', paddingLeft: '4px' }}>
                SELECT UNIT SUBJECT
              </span>
              <select
                value={activePracticeUnit}
                onChange={(e) => handleSelectPracticeUnit(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--input-bg)',
                  border: 'var(--glass-border)',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="Unit I: Introduction & Physical Layer">Unit I</option>
                <option value="Unit II: Data Link Layer & Protocols">Unit II</option>
                <option value="Unit III: Network Layer & Routing">Unit III</option>
                <option value="Unit IV: Transport Layer & TCP/UDP">Unit IV</option>
                <option value="Unit V: Application Layer & DNS">Unit V</option>
              </select>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0' }} />

            {/* List of active Unit questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', paddingLeft: '4px' }}>
                PRACTICE QUESTIONS
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '42vh', overflowY: 'auto' }}>
                {PRACTICE_QUESTIONS.filter(q => q.unit === activePracticeUnit).map((q, idx) => {
                  const isSelected = selectedQuestion?.id === q.id;
                  const isSolved = solvedQuestions[q.id];

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuestion(q)}
                      style={{
                        background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255,255,255,0.01)',
                        border: isSelected ? '1px solid var(--yellow-neon)' : '1px solid var(--glass-border)',
                        borderRadius: '10px',
                        color: isSelected ? 'var(--yellow-neon)' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '10px 12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'var(--glass-border)';
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Q{idx + 1}: {q.question}
                      </span>
                      {isSolved && (
                        <CheckCircle2 size={13} style={{ color: 'var(--emerald-neon)', flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: 'auto 0 0 0' }} />

            {/* Solved Progress tracker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(5, 6, 15, 0.4)', padding: '12px', borderRadius: '10px', border: 'var(--glass-border)' }}>
              <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>UNIT PROGRESS</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                <span>Solved:</span>
                <span style={{ color: 'var(--yellow-neon)' }}>
                  {PRACTICE_QUESTIONS.filter(q => q.unit === activePracticeUnit && solvedQuestions[q.id]).length} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Active Question Workspace & Evaluator Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Active Placement Scoreboard Header */}
            <div className="glass-panel" style={{
              background: 'var(--panel-bg)',
              padding: '14px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={16} style={{ color: 'var(--yellow-neon)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.2' }}>
                      {scoreboard.solvedCount} / {PRACTICE_QUESTIONS.length}
                    </div>
                    <div style={{ fontSize: '0.56rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Solved Progress
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} style={{ color: 'var(--cyan-neon)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.2' }}>
                      {scoreboard.accuracy}%
                    </div>
                    <div style={{ fontSize: '0.56rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Practice Accuracy
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetProgress}
                style={{
                  background: 'rgba(236,72,153,0.04)',
                  border: '1px solid rgba(236,72,153,0.25)',
                  color: 'var(--pink-neon)',
                  fontSize: '0.64rem',
                  fontWeight: '800',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--pink-neon)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(236,72,153,0.04)';
                  e.currentTarget.style.color = 'var(--pink-neon)';
                }}
              >
                <RotateCw size={10} /> CLEAR PROGRESS
              </button>
            </div>

            {/* Q&A workspace Card */}
            {selectedQuestion ? (
              <div className="glass-panel" style={{
                background: 'var(--panel-bg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                textAlign: 'left'
              }}>
                {/* badges headers */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    background: 'rgba(245, 158, 11, 0.05)',
                    color: 'var(--yellow-neon)'
                  }}>
                    {selectedQuestion.unit.split(":")[0]}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    border: `1px solid ${getDifficultyColor(selectedQuestion.difficulty)}33`,
                    background: `${getDifficultyColor(selectedQuestion.difficulty)}08`,
                    color: getDifficultyColor(selectedQuestion.difficulty)
                  }}>
                    {selectedQuestion.difficulty}
                  </span>
                </div>

                {/* Question body description */}
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.4' }}>
                  {selectedQuestion.question}
                </div>

                {/* Options choices list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedQuestion.options.map((option, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = idx === selectedQuestion.answerIndex;
                    
                    let bg = 'rgba(255,255,255,0.01)';
                    let border = '1px solid var(--glass-border)';
                    let icon = null;

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        bg = 'rgba(16, 185, 129, 0.06)';
                        border = '1.5px solid var(--emerald-neon)';
                        icon = <CheckCircle2 size={15} style={{ color: 'var(--emerald-neon)' }} />;
                      } else if (isSelected) {
                        bg = 'rgba(236, 72, 153, 0.06)';
                        border = '1.5px solid var(--pink-neon)';
                        icon = <XCircle size={15} style={{ color: 'var(--pink-neon)' }} />;
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSubmit(idx)}
                        disabled={isAnswerSubmitted}
                        style={{
                          background: bg,
                          border: border,
                          padding: '14px 20px',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          color: 'var(--text-secondary)',
                          fontWeight: '600',
                          textAlign: 'left',
                          cursor: isAnswerSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '15px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isAnswerSubmitted) {
                            e.currentTarget.style.borderColor = 'var(--yellow-neon)';
                            e.currentTarget.style.background = 'rgba(245,158,11,0.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isAnswerSubmitted) {
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.background = bg;
                          }
                        }}
                      >
                        <span>{option}</span>
                        {icon}
                      </button>
                    );
                  })}
                </div>

                {/* Detailed revealed explanation panel block */}
                {isAnswerSubmitted && (
                  <div style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--glass-border)',
                    borderLeft: '4px solid var(--yellow-neon)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    animation: 'fadeIn 0.4s ease-out'
                  }}>
                    <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={11} /> THEORETICAL PLACEMENT EXPLANATION
                    </span>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {selectedQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <HelpCircle size={32} style={{ margin: '0 auto 15px auto', color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '0.9rem' }}>Select a question from the practice list to start practicing networking theory.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
