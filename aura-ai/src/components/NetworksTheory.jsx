import { useState } from 'react';
import { ArrowLeft, HelpCircle, Activity, CheckCircle2, XCircle, RotateCw, Trophy, Sparkles } from 'lucide-react';

const THEORY_CONTENT = {
  "Unit I: Introduction & Physical Layer": {
    intro: "Comprehensive study of network basics, topologies, guided/unguided media, switching models, and layered reference models.",
    subtopics: [
      {
        title: "Network Fundamentals & Uses",
        slides: [
          {
            title: "What is a Computer Network?",
            content: "A network is a set of autonomous devices (nodes) connected by communication links. A node can be a computer, printer, or any other device capable of sending and/or receiving data. The connection need not be via copper wire; fiber optics, microwaves, infrared, and communication satellites are widely used (Citing PDF Page 3).",
            details: "Difference from Distributed Systems:\nIn a distributed system, a collection of independent computers appears to its users as a single coherent system (e.g., the World Wide Web). Often, a middleware software layer on top of the OS implements this coherent single-system model."
          },
          {
            title: "Network Business & Home Applications",
            content: "1. Business Applications: Resource sharing (sharing physical printers, tape backups), Client-Server model, electronic mail (email), Voice over IP (VoIP) telephony, desktop sharing, and e-commerce.\n2. Home Applications: Peer-to-peer (P2P) file sharing, person-to-person communication (video calls, messages), and entertainment/gaming (Citing PDF Pages 3-4).",
            details: "Mobile Users & Social Issues:\n• Mobile Users: Smart phones, text messaging, GPS, m-commerce (mobile commerce), and Near Field Communication (NFC).\n• Social Issues: Privacy disputes (employee vs employer rights), government vs citizen rights, location tracking, and ethical bounds."
          },
          {
            title: "Security Threats: Phishing & Botnets",
            content: "• Phishing Attack: A type of social engineering attack used to steal user credentials, credit card numbers, and private data. Occurs when an attacker masquerading as a trusted entity dupes a victim into clicking links or opening messages.\n• Botnet Attack: Botnets are networks of hijacked devices used to perform massive Distributed Denial of Service (DDoS) attacks, steal private databases, and send spam (Citing PDF Pages 4-5).",
            details: "Data Communication Effectiveness:\nDepends on four fundamental characteristics:\n1. Delivery: Delivers data strictly to the correct destination.\n2. Accuracy: Delivers data accurately without silent alteration.\n3. Timeliness: Delivers data in a real-time, synchronous manner.\n4. Jitter: Minimizes variation in packet arrival times (uneven audio/video quality)."
          }
        ]
      },
      {
        title: "Types of Networks based on Size",
        slides: [
          {
            title: "LAN, MAN, and WAN",
            content: "Networks are classified based on their geographical dimensions, physical architecture, and speeds (Citing PDF Page 12):\n1. LAN (Local Area Network): Interconnects computers within a small area (room, campus). Uses coaxial or CAT5 cables. Speed: 10 to 100 Mbps. High speed, minimal noise/error rates.\n2. MAN (Metropolitan Area Network): Extends over a city (5 to 50 km). Owned by organizations or city systems. Speed is lower than LAN.\n3. WAN (Wide Area Network): Extends over countries or worldwide. Uses satellites, microwave relays, and public lines. The Internet is the prime example.",
            details: "Other Types of Networks:\n• WLAN (Wireless LAN): Uses high frequency radio waves for local wireless communication.\n• PAN (Personal Area Network): Organized around an individual user for personal device coordination.\n• SAN (Storage Area Network): High-speed network connecting servers to storage devices via fiber-optic lines."
          }
        ]
      },
      {
        title: "Physical Topologies & Data Flows",
        slides: [
          {
            title: "Data Flow Modes",
            content: "Communication between two devices can operate in three distinct directional modes (Citing PDF Page 6):\n1. Simplex: Strictly unidirectional (one-way street). Only one device transmits, the other only receives (e.g., traditional keyboard and monitors).\n2. Half-Duplex: Bidirectional, but not simultaneously. Both devices can send and receive, but only one at a time (e.g., walkie-talkies).\n3. Full-Duplex: Simultaneous bidirectional communication. Both can talk and listen at the same time (e.g., telephone networks).",
            details: "Physical Connections:\n• Point-to-Point: Dedicated link between two devices. Entire channel capacity is reserved (e.g. TV remote infrared links).\n• Multipoint (Multi-drop): More than two specific devices share a single link. Capacity is shared spatially or temporally (timeshared)."
          },
          {
            title: "Physical Topologies Comparison",
            content: "Physical topology refers to the way in which a network is laid out physically (Citing PDF Pages 8-11):\n1. Mesh: Every node has a dedicated link to every other node. Dedicated links required = n(n-1)/2. Highly redundant, easy fault isolation, but massive cabling cost.\n2. Star: Every node connects to a central controller (hub or switch). Centralized management, easy expansion, but central hub failure downs the network.\n3. Bus: Multi-point line connecting devices to a single backbone cable with taps and terminators. Cheap and easy for small scales.\n4. Ring: Each device connects to two neighbors, forming a circle. Packets circulate using repeaters until destination.",
            details: "Hybrid Topologies:\nNetworks can be a combination of topologies. A common setup is a star-backbone topology where a central hub connects multiple branch subnetworks configured in a bus topology."
          }
        ]
      },
      {
        title: "Guided & Unguided Media",
        slides: [
          {
            title: "Guided (Wired) Media",
            content: "Guided media provides a physical conduit path from one device to another (Citing PDF Pages 13-16):\n1. Twisted-Pair: Two insulated copper conductors twisted together. UTP (Unshielded) uses RJ45 connectors (common in LANs). STP (Shielded) adds protective foil casing to prevent noise/crosstalk, but is bulkier/expensive.\n2. Coaxial Cable: Central core copper conductor enclosed in insulation, surrounded by a braided shield and plastic jacket. Uses BNC connectors (TV networks/Ethernet).\n3. Fiber-Optic Cable: Glass or plastic core transmitting signals as light using total internal reflection. Features massive bandwidth and complete immunity to electromagnetic interference.",
            details: "Fiber Propagation Modes:\n• Multimode Step-Index: Light beams bounce at different angles in constant core density.\n• Multimode Graded-Index: Varied core density curves light, reducing signal distortion.\n• Single-Mode: Highly focused light source limits beams to horizontal rays in extremely thin core."
          },
          {
            title: "Unguided (Wireless) Media",
            content: "Wireless media transports electromagnetic waves without a physical conductor (Citing PDF Pages 16-19):\n1. Radio Waves: Frequencies between 3 kHz and 1 GHz. Omnidirectional (propagate in all directions). Susceptible to interference. Used for AM/FM radio, cordless phones.\n2. Microwaves: Frequencies between 1 and 300 GHz. Highly unidirectional. Sending/receiving antennas must be precisely aligned. Used for cellular phones, satellites, and WLANs.\n3. Infrared: Frequencies from 300 GHz to 400 THz. Short range, line-of-sight only. Cannot penetrate walls. Used for TV remote controls.",
            details: "Wireless Propagation Ways:\n• Ground Propagation (below 2 MHz): Waves follow the curvature of the earth.\n• Sky Propagation (2-30 MHz): Waves bounce off the ionosphere.\n• Line-of-Sight Propagation (above 30 MHz): Waves travel in straight lines between aligned towers."
          }
        ]
      },
      {
        title: "Switching Architectures",
        slides: [
          {
            title: "Switched Networks: Circuit-Switching",
            content: "Switching creates temporary connections between multiple interlinked nodes (Citing PDF Pages 19-21):\nCircuit-Switched Networks: Consists of switches forming dedicated physical paths. Requires three distinct phases:\n1. Connection Setup: Reserves dedicated channels on each link (using FDM/TDM).\n2. Data Transfer: Continuous data stream flowing with minimal delay.\n3. Connection Teardown: Releases reserved resources for other connections.",
            details: "Circuit-Switching Performance:\n• Efficiency: Extremely low because resources remain dedicated for the entire duration, even when idle.\n• Delay: Minimal once connection is established (no packet buffering or routing delay at intermediate switches)."
          },
          {
            title: "Packet Switching: Datagram vs VC",
            content: "1. Datagram Networks: Connectionless. Resources are allocated on demand (first-come, first-served). Each packet is treated independently (as a datagram) and can follow different routing paths. 중간 노드(라우터)는 라우팅 테이블에 따라 다음 홉을 결정한다 (Citing PDF Page 21).\n2. Virtual-Circuit (VC) Networks: Connection-oriented hybrid. Has setup, data transfer, and teardown phases. All packets follow the identical established path, carrying a local Virtual Circuit Identifier (VCI) that changes at each switch (Citing PDF Pages 22-26).",
            details: "Detailed Comparison Table (PDF Page 27):\n• Circuit Setup: Datagram (Not needed) | VC (Required).\n• Addressing: Datagram (Full source/dest address in each packet) | VC (Short VC number).\n• State Info: Datagram (Routers hold no state info) | VC (Each VC requires switch table entry).\n• Route Failure: Datagram (None, except lost packets) | VC (All VCs through failed switch die)."
          }
        ]
      },
      {
        title: "Layered Reference Models",
        slides: [
          {
            title: "The 7-Layer OSI Model",
            content: "Open Systems Interconnection (OSI) is a 7-layer framework developed by ISO to standardize network communications (Citing PDF Pages 28-30):\n1. Physical: Bit-level transmission over physical media.\n2. Data Link: Node-to-node frame delivery and error/flow control.\n3. Network: Source-to-destination packet delivery (Routing & logical IPs).\n4. Transport: End-to-end reliable process-to-process message transfer (TCP/UDP).\n5. Session: Establishes, manages, and terminates process dialogs.\n6. Presentation: Translation, compression, and encryption of data.\n7. Application: User interface services (HTTP, SMTP, FTP).",
            details: "Layer Data Terminology (PDF Page 29):\n• Application/Presentation/Session: Data\n• Transport Layer: Segment\n• Network Layer: Packet\n• Data Link Layer: Frame\n• Physical Layer: Bits"
          },
          {
            title: "TCP/IP vs OSI Reference Models",
            content: "The TCP/IP model consists of 4 standard layers that form the basis of the modern internet (Citing PDF Pages 32-34):\n1. Application: Combines Application, Presentation, and Session layers of OSI.\n2. Transport: Handles end-to-end reliability (TCP) or simple datagrams (UDP).\n3. Internet: Equivalent to the Network layer, routing packets (IP, ICMP).\n4. Host-to-Network: Combines the Physical and Data Link layers.",
            details: "Key Structural Differences (PDF Page 34):\n• OSI has 7 layers, TCP/IP has 4 layers.\n• OSI strictly distinguishes service, interface, and protocol; TCP/IP does not.\n• OSI reference model was devised BEFORE protocols were designed; TCP/IP protocols came first and the model was just a description of them."
          }
        ]
      }
    ]
  },
  "Unit II: Data Link Layer & Protocols": {
    intro: "Detailed study of framing, error detection/correction math, sliding windows, medium access controls, and Standard Ethernet specifications.",
    subtopics: [
      {
        title: "Framing & Data Link Services",
        slides: [
          {
            title: "Data Link Layer Services",
            content: "The Data Link layer is responsible for node-to-node delivery of data blocks (frames) (Citing PDF Page 37):\n1. Services to Network Layer: Unacknowledged connectionless (Ethernet), Acknowledged connectionless (WiFi), and Acknowledged connection-oriented.\n2. Framing: Grouping raw bits into manageable data frames.\n3. Flow Control: Restricting sender rate to prevent receiver buffer overflow.\n4. Error Control: Adding trailers (checksums) to detect and correct transmission corruptions.",
            details: "Data Link Sublayers:\n• LLC (Logical Link Control): Handles framing, flow control, and error control.\n• MAC (Media Access Control): Resolves access conflicts on shared broadcast links."
          },
          {
            title: "Framing Methods: Byte & Bit Stuffing",
            content: "Framing partitions raw bitstreams into discrete boundaries (Citing PDF Pages 38-41):\n1. Character Count: Specifies size in header. Vulnerable to sync slips if count gets corrupted.\n2. Byte Stuffing: Delimits frames with FLAG bytes. If FLAG occurs in data, sender inserts an ESC (Escape) byte before it. ESC in data is also stuffed with an ESC (Citing PDF Page 39).\n3. Bit Stuffing: Frame begins/ends with flag 01111110. Sender inserts a '0' bit immediately after sensing five consecutive '1's in data. Receiver automatically strips this stuffed '0' (Citing PDF Page 40).\n4. Physical Coding Violations: Uses invalid line encoding states (e.g. Manchester lack of transitions) to signal boundaries.",
            details: "Bit Stuffing Example:\n• Input data: 011011111111111111110010\n• Transmitted: 011011111011111011111010010 ( stuffed 0s added after five 1s )"
          }
        ]
      },
      {
        title: "Error Detection Math & CRC",
        slides: [
          {
            title: "Parity Check & Checksum",
            content: "Error detection appends redundant bits to detect frame corruption (Citing PDF Pages 66-68):\n1. Simple Parity: Appends a 1 or 0 to make the total count of 1s even (or odd). Detects single-bit errors, but fails on even-numbered double-bit errors.\n2. 2D Parity Check: Organizes data into blocks of rows and columns. Parity bits are calculated for each row and column, creating a validation grid capable of detecting burst errors.\n3. Checksum: Data is split into k segments of m bits. The segments are added using 1's complement arithmetic. The sum is complemented to form the checksum, sent with data. Receiver sums all fields; a correct block yields all 1s (complemented to 0).",
            details: "Error Detection Location:\nError-detecting codes are implemented at either the Data Link layer or the Transport layer of the OSI model, securing node-to-node or end-to-end data integrity."
          },
          {
            title: "Cyclic Redundancy Check (CRC)",
            content: "CRC uses modulo-2 binary division to append redundant check bits (Citing PDF Pages 68-69):\n• Given a data word of size d, we append n-1 zeros to it.\n• We perform modulo-2 binary division (using XOR subtraction) of the padded word by an n-bit generator polynomial (divisor).\n• The resulting remainder of size n-1 is appended to the data word as CRC check bits.\n• Receiver divides the received frame by the same generator. A zero remainder indicates no error; non-zero indicates corruption.",
            details: "Generator Polynomial Example:\nPolynomial X^3 + 1 corresponds to binary divisor 1001. If generator has n bits, the appended CRC check sequence will always be n-1 bits long."
          }
        ]
      },
      {
        title: "Error Correction: Hamming Code",
        slides: [
          {
            title: "Hamming Code Math",
            content: "Developed by R.W. Hamming, this code detects and corrects single-bit errors by adding redundant check bits at strategic positions (Citing PDF Pages 70-73):\n• Redundant parity bits (r) are placed strictly at power-of-2 positions: 1, 2, 4, 8... 2^(k-1).\n• The number of redundant bits r required for d data bits must satisfy the inequality: 2^r >= d + r + 1.\n• For d = 4, the minimum r is 3 (total bits = 7).\n• Bit positions (1 to 7) are checked: r1 covers positions (1,3,5,7); r2 covers (2,3,6,7); r4 covers (4,5,6,7) using even parity.",
            details: "Error Correction Search:\nAt the receiver, parities r1, r2, r4 are recalculated. The binary value of recalculated parity checks (r4 r2 r1) represents the exact decimal position of the error! (e.g. 100 indicates bit 4 is corrupted, corrected by flipping it)."
          }
        ]
      },
      {
        title: "Sliding Window Protocols",
        slides: [
          {
            title: "Stop-and-Wait & Go-Back-N ARQ",
            content: "Sliding window protocols enforce flow and error control on noisy channels (Citing PDF Pages 41-48):\n1. Stop-and-Wait ARQ: Sender transmits one frame and blocks until an ACK arrives. Uses timers; if timer expires before ACK, it retransmits the buffered copy. Sequence numbers are modulo-2 (0 or 1).\n2. Go-Back-N (GBN) ARQ: Allows sender to transmit multiple outstanding frames before blocking. Sender window is size 2^m - 1. Receiver window is size 1. If an outstanding frame fails or timer expires, sender 'goes back' and retransmits all outstanding frames starting from the failed index.",
            details: "GBN Window Management:\n• Sf: Sequence number of the first outstanding frame.\n• Sn: Sequence number of the next frame to send.\n• Window Size: Capped at 2^m - 1. Acknowledgment is cumulative, meaning ACK n acknowledges all frames up to n-1."
          },
          {
            title: "Selective Repeat ARQ",
            content: "Selective Repeat ARQ improves GBN efficiency over noisy links by only retransmitting the exact damaged frame (Citing PDF Pages 48-50):\n• Send window and Receive window sizes are equal and capped at 2^(m-1) (exactly half of 2^m).\n• The receiver buffers out-of-order frames in its window.\n• If a frame is lost or corrupted, the receiver sends a NAK (Negative Acknowledgment) for that specific frame.\n• The sender retransmits ONLY the NAK'd frame, avoiding the GBN retransmission penalty.",
            details: "Symmetric Piggybacking:\nTo improve bidirectional protocol efficiency, control information (ACKs/NAKs) is piggybacked directly inside data frames flowing in the reverse direction, rather than sending dedicated control frames."
          }
        ]
      },
      {
        title: "Medium Access Control (MAC)",
        slides: [
          {
            title: "ALOHA Protocols",
            content: "MAC protocols coordinate channel access on shared broadcast links (Citing PDF Pages 51-55):\n1. Pure ALOHA: Nodes transmit frames immediately whenever they have data to send. If a collision occurs, they wait a random back-off time (TB) and retry. Vulnerable time is 2 * Tfr. Maximum throughput is 18.4% (at load G = 1/2).\n2. Slotted ALOHA: Time is divided into slots equal to Tfr. Nodes are forced to transmit strictly at the beginning of a slot. Vulnerable time is halved to Tfr. Maximum throughput doubles to 36.8% (at load G = 1).",
            details: "ALOHA Throughput Formulas:\n• Pure ALOHA: S = G * e^(-2G). Max S_max = 0.184\n• Slotted ALOHA: S = G * e^(-G). Max S_max = 0.368"
          },
          {
            title: "CSMA Protocols",
            content: "Carrier Sense Multiple Access (CSMA) requires nodes to sense the channel ('listen') before transmitting (Citing PDF Pages 56-59):\n1. 1-Persistent: Node senses the line. If idle, transmits immediately. If busy, continuously listens until idle, then transmits with probability 1. High collision risk.\n2. Non-Persistent: Node senses the line. If idle, transmits. If busy, waits a random back-off time and checks again. Reduces collisions but increases idle delays.\n3. p-Persistent: Used in slotted channels. Senses line. If idle, transmits with probability p. With probability q=1-p, delays to next slot.",
            details: "CSMA/CD (Collision Detection):\nUsed in wired Ethernet. Nodes listen during transmission. If a collision is detected, they immediately abort transmission, emit a jamming signal, and execute binary exponential back-off (Citing PDF Pages 59-61)."
          },
          {
            title: "CSMA/CD & CSMA/CA",
            content: "Collision mechanisms differ between wired and wireless networks (Citing PDF Pages 60-63):\n• CSMA/CD Minimum Frame Size: To ensure collision detection before the sender finishes transmitting, the frame transmission time Tfr must satisfy Tfr >= 2 * Tp (where Tp is maximum propagation delay). Minimum frame size = 2 * Tp * Bandwidth (Standard Ethernet = 64 bytes).\n• CSMA/CA (Collision Avoidance): Used in wireless networks where collision detection is impossible. Avoids collisions using: 1. IFS (Interframe Space) deferral delay. 2. Contention Window exponential slots back-off. 3. Explicit ACKs.",
            details: "Controlled Access Protocols (PDF Page 64):\n• Reservation: Nodes reserve slots before transmission.\n• Polling: Primary station polls secondary nodes in turn.\n• Token Passing: A special token frame circulates in a ring; only the holder can transmit."
          }
        ]
      },
      {
        title: "IEEE 802.3 Standard (Ethernet)",
        slides: [
          {
            title: "Standard Ethernet Specifications",
            content: "IEEE 802.3 standardizes wired LAN Ethernet specifications (Citing PDF Pages 74-79):\n• MAC Frame Format: Preamble (7 bytes), SFD (1 byte: 10101011), Destination Address (6 bytes), Source Address (6 bytes), Length/Type (2 bytes), Data & Padding (46 to 1500 bytes), and CRC-32 (4 bytes).\n• Length Constraints: Minimum frame size is 64 bytes (512 bits) to guarantee collision detection under CSMA/CD. Maximum frame size is 1518 bytes (to prevent buffer monopolization).",
            details: "Ethernet Physical Implementations (PDF Page 77):\n• 10Base5 (Thicknet): Bus topology, thick coaxial, max segment 500m.\n• 10Base2 (Thinnet): Bus topology, thin coaxial, max segment 185m.\n• 10Base-T: Star topology, UTP wiring connected to a central hub, max 100m.\n• 10Base-F: Star topology, fiber-optic cabling, max 2000m."
          }
        ]
      }
    ]
  },
  "Unit III: Network Layer & Routing": {
    intro: "Network Layer design issues, store-and-forward routing, Dijkstra shortest path, Distance Vector and Link State protocols, RED congestion, and traffic shaper buckets.",
    subtopics: [
      {
        title: "Network Design & Packet Switching",
        slides: [
          {
            title: "Store-and-Forward & Services",
            content: "The Network layer handles routing and end-to-end packet delivery across intermediate hops (Citing PDF Pages 80-83):\n1. Store-and-Forward: Intermediate routers store incoming packets completely, verify checksums, and forward them along the path.\n2. Services to Transport Layer: Should be independent of router technologies, shield transport from router topologies, and provide a uniform global numbering plan.",
            details: "Datagram vs Virtual Circuit (PDF Page 83):\n• Datagram: Connectionless, packets are routed independently, no setup phase, table lookup is based on destination IP.\n• Virtual Circuit: Connection-oriented, requires circuit setup, all packets follow the identical path, table lookup is based on local VCIs."
          }
        ]
      },
      {
        title: "Routing Algorithms & DV Loops",
        slides: [
          {
            title: "Dijkstra Shortest Path & Flooding",
            content: "Routing algorithms determine the optimal path for packets (Citing PDF Pages 84-86):\n1. Shortest Path (Dijkstra's): Finds the shortest path tree from source to all destinations. It greedily selects intermediate nodes with the lowest cumulative weight cost, making them permanent.\n2. Flooding: Static routing where every incoming packet is sent out on all outgoing links except the one it arrived on. Employs a Hop Counter to discard packets when it reaches zero, preventing infinite looping.",
            details: "Sink Tree Optimality:\nAs a consequence of the optimality principle (PDF Page 84), the set of optimal routes from all sources to a given destination forms a tree rooted at the destination, called a sink tree."
          },
          {
            title: "Distance Vector Routing & Loops",
            content: "Distance Vector (DV) routing is a dynamic protocol where each node periodically shares its complete routing table with direct neighbors (Citing PDF Pages 87-91):\n• Based on Bellman-Ford equation: D_x(y) = min_v { c(x,v) + D_v(y) }.\n• Instability (Count-to-Infinity): Link failures can cause circular updates where nodes advertise stale paths, counting to infinity (defined as 16 in RIP).\n• Solutions: 1. Split Horizon: Do not advertise a route back to the neighbor from which it was learned. 2. Poison Reverse: Advertise that route back with infinite cost.",
            details: "DV Tables Sharing & Triggered Updates:\nTables are shared periodically (every 30 seconds) or immediately upon a link failure or cost change (triggered updates) to accelerate convergence."
          },
          {
            title: "Link State & Hierarchical Routing",
            content: "Modern networks utilize Link State routing or hierarchical topologies to scale (Citing PDF Pages 92-97):\n1. Link State Routing: Each node floods only its local link states to ALL routers in the domain using LSPs (Link State Packets). All routers construct the identical topology map and compute paths independently using Dijkstra's algorithm. Sync LSPs are flooded every 60-120 mins.\n2. Path Vector Routing: Used in inter-domain BGP routing. Speaker nodes advertise path routes (AS paths) rather than distance metrics, preventing loops.\n3. Hierarchical Routing: Divides routers into regions. Routers only store local region paths and one gateway link for external regions. Capped at ln(N) levels.",
            details: "Link State Packet (LSP) Fields:\nContains sender identity, sequence number, age, and a list of directly connected neighbor metrics. Sequence numbers ensure nodes only accept newer LSPs."
          }
        ]
      },
      {
        title: "Congestion Control & Traffic Shaping",
        slides: [
          {
            title: "RED & Congestion Avoidance",
            content: "Congestion occurs when the number of packets sent exceeds intermediate buffer capacities (Citing PDF Pages 98-100):\n1. Warning Bit: Switch sets warning bits in packet headers when queue thresholds are breached, requesting endpoints to slow down.\n2. Choke Packets: Switches send ICMP Source Quench control packets directly back to the sender.\n3. Load Shedding: Routers discard packets when buffers fill up (marks packets with drop priority).\n4. Random Early Discard (RED): Proactive discard. Computes average queue length (avg). If avg > lower threshold, drops random incoming packets with a probability p, preventing complete buffer exhaustion.",
            details: "Congestion vs Flow Control:\n• Congestion Control: Global issue, ensures the network as a whole can carry the traffic.\n• Flow Control: Point-to-point, ensures a fast sender doesn't overwhelm a slow receiver."
          },
          {
            title: "Traffic Shapers: Leaky vs Token Bucket",
            content: "Traffic shaping controls the rate and burstiness of packet transmissions before entry into the network (Citing PDF Pages 101-102):\n1. Leaky Bucket: Enforces a strict, constant output rate (average rate) regardless of how bursty the input load. Input bursts accumulate in the bucket; if the bucket overflows, excess packets are discarded.\n2. Token Bucket: Generates tokens at a constant rate. Packets can only be sent if there are enough tokens to cover their length. Accumulates tokens during idle periods, allowing controlled bursts to be sent immediately.",
            details: "Shaper Comparisons:\n• Leaky Bucket discards packets on overflow; Token Bucket discards tokens.\n• Token Bucket allows saving up permissions to send large bursts faster; Leaky Bucket does not allow saving."
          }
        ]
      }
    ]
  },
  "Unit IV: Transport Layer & TCP/UDP": {
    intro: "End-to-end transport layer primitives, three-way handshakes, symmetric release, TCP segment headers, fast retransmits, and RPC stubs.",
    subtopics: [
      {
        title: "Transport Layer Services",
        slides: [
          {
            title: "Process-to-Process Delivery & Primitives",
            content: "The Transport Layer provides logical end-to-end communication between application processes (Citing PDF Pages 103-106):\n• Terminology: Uses TSAPs (Transport Service Access Points, i.e., Ports) to identify processes, and NSAPs (Network Service Access Points, i.e., IP Addresses) to identify hosts.\n• Primitives (PDF Page 112): 1. LISTEN: Blocks until a connection is requested. 2. CONNECT: Sends a connection request. 3. SEND: Transmits data. 4. RECEIVE: Blocks until a data packet arrives. 5. DISCONNECT: Terminations.",
            details: "Portmapper Service (PDF Page 121):\nProcesses register their dynamic port numbers with a central Portmapper service, letting clients query ports before sending connect primitives."
          }
        ]
      },
      {
        title: "Connection Management",
        slides: [
          {
            title: "The Three-Way Handshake Connection",
            content: "To resolve delayed duplicate packets, TCP establishes connections using a three-way handshake (Citing PDF Pages 122-124):\n1. Client sends a SYN segment with an initial sequence number x (SYN flag set).\n2. Server receives the SYN, allocates connection tables, and replies with a SYN+ACK segment containing initial sequence number y and acknowledging x (ack = x + 1).\n3. Client receives the SYN+ACK, and sends an ACK segment acknowledging y (ack = y + 1), completing setup.",
            details: "Delayed Duplicate Mitigation:\nIf an old SYN packet floats out of the network after a connection died, the server replies SYN+ACK. The client, sensing a mismatch, rejects it immediately (reject = y), preventing accidental setups."
          },
          {
            title: "Connection Teardown & Two-Army Problem",
            content: "Disconnecting can operate in two distinct modes (Citing PDF Pages 125-130):\n1. Asymmetric Release: One host issues a DISCONNECT, immediately breaking the link. Prone to data loss if the other host was still transmitting.\n2. Symmetric Release: Treats the connection as two separate unidirectional links. Each direction must be closed separately. Host 1 sends a DR (Disconnection Request), stops sending but can still receive, and waits for a DR + ACK from Host 2.",
            details: "The Two-Army Problem:\nIllustrates the impossibility of perfect simultaneous agreement over an unreliable channel. Because the last ACK segment can always be lost, perfect termination synchronization cannot be guaranteed."
          }
        ]
      },
      {
        title: "The TCP Protocol Suite",
        slides: [
          {
            title: "TCP Segment Header Fields",
            content: "TCP is connection-oriented, reliable, and byte-stream oriented (Citing PDF Pages 131-143):\n• Header Size: Ranges from 20 to 60 bytes (base header is 20 bytes; options add up to 40 bytes).\n• Core Fields: Source Port (16 bits), Destination Port (16 bits), Sequence Number (32 bits), Acknowledgment Number (32 bits), Header Length (HLEN, 4 bits), Window Size (16 bits), Checksum (16 bits), and Urgent Pointer.\n• Flags: URG (urgent pointer valid), ACK (acknowledgment valid), PSH (push data immediately), RST (reset connection), SYN (synchronize sequences), FIN (terminate connection).",
            details: "Byte-Oriented Numbering:\nTCP numbers every byte in the data stream rather than numbering segment packets. The sequence number represents the byte index of the first data byte in that segment."
          },
          {
            title: "Flow Control & Clark's Silly Window",
            content: "TCP sender limits window size to MIN(rwnd, cwnd), where rwnd is the receiver's advertised buffer window and cwnd is the congestion window (Citing PDF Pages 155-159):\n• Silly Window Syndrome: Occurs when the receiver's buffer fills up and it advertises a tiny window (e.g. 1 byte). The sender transmits a tiny 1-byte segment, consuming massive header overhead.\n• Clark's Solution: Forces the receiver to not advertise small window updates. It must wait until it has decent space (maximum segment size MSS or half-empty buffer, whichever is smaller) before advertising updates (Citing PDF Page 164).",
            details: "Nagle's Algorithm:\nSender buffers all data bytes until outstanding acknowledgments arrive, or a full MSS segment can be formed. Highly effective for interactive terminal keystroke traffic."
          },
          {
            title: "TCP Congestion Control Tahoe & Reno",
            content: "TCP manages network congestion dynamically (Citing PDF Pages 168-178):\n1. Tahoe Tahoe: Uses Slow Start (cwnd starts at 1, doubles every RTT) and Congestion Avoidance (grows linearly once ssthresh is reached). Upon packet loss (timeout), ssthresh is set to cwnd/2, and cwnd is reset to 1.\n2. TCP Reno: Introduces Fast Recovery and Fast Retransmit. If 3 duplicate ACKs arrive, the sender immediately retransmits the missing segment (Fast Retransmit), sets ssthresh to cwnd/2, and enters Fast Recovery (sets cwnd to ssthresh + 3, skipping the slow-start reset).",
            details: "AIMD Congestion Rule:\nAdditive Increase, Multiplicative Decrease. TCP increases its window size linearly during congestion avoidance, and cuts it in half immediately upon sensing a packet loss."
          }
        ]
      },
      {
        title: "The UDP Protocol Suite",
        slides: [
          {
            title: "UDP segment & Checksum Math",
            content: "User Datagram Protocol (UDP) is a connectionless, unreliable, lightweight transport protocol (Citing PDF Pages 180-186):\n• Header Size: Strictly 8 bytes.\n• Fields: Source Port (16 bits), Destination Port (16 bits), Total Length (16 bits), and Checksum (16 bits).\n• Checksum: Mandatory in TCP but optional in UDP. Calculated using a Pseudo-Header containing Source/Dest IP addresses, protocol field (17), and UDP length, ensuring protection against routing delivery errors.",
            details: "UDP Queues:\nUDP maintains separate incoming and outgoing queues for each socket. If the application doesn't read the queue fast enough, the incoming buffer overflows and packets are discarded."
          }
        ]
      },
      {
        title: "Remote Procedure Call (RPC)",
        slides: [
          {
            title: "RPC Architecture & Parameter Marshaling",
            content: "RPC allows programs to call procedures located on remote hosts transparently (Citing PDF Pages 189-192):\n1. Client application calls client stub (local procedure call).\n2. Client stub packs parameters into a network message (marshaling) and invokes system calls.\n3. Operating system transmits the message to the remote host.\n4. Remote OS delivers the packet to the server stub.\n5. Server stub unpacks parameters (unmarshaling) and calls the local server procedure.",
            details: "Core Limitations:\n• Pointer Passing: Pointers are impossible because client and server have separate address spaces.\n• Parameter Type Checking: Stubs cannot easily marshal variable-length parameters or global variables."
          }
        ]
      }
    ]
  },
  "Unit V: Application Layer & DNS": {
    intro: "Application Layer standard DNS namespaces, FQDN reverse lookups, recursive name servers, caching, browser frameworks, and persistent HTTP connections.",
    subtopics: [
      {
        title: "Domain Name Space Architecture",
        slides: [
          {
            title: "The Hierarchical Name Space",
            content: "DNS maps alphabetic hostnames to numeric IP addresses (Citing PDF Pages 287-288):\n• Organized as a hierarchical inverted tree structure capped at 128 levels (root at level 0).\n• Nodes represent domains with local labels of maximum 63 characters.\n• FQDN (Fully Qualified Domain Name): Absolute path ending in a dot (e.g. `challenger.atc.fhda.edu.`).\n• PQDN (Partially Qualified Domain Name): Relative path without the ending dot.",
            details: "Domain Classifications (PDF Page 296-299):\n• Generic Domains: .com (commercial), .edu (educational), .gov (government), .org (nonprofit).\n• Country Domains: Two-character country codes (.us, .in, .jp, .uk).\n• Inverse Domain: Used for reverse IP-to-name lookup (uses the in-addr.arpa domain tree)."
          },
          {
            title: "Hierarchy of Name Servers",
            content: "Since the complete DNS hierarchy cannot be stored on a single server, it is distributed across zones (Citing PDF Pages 293-295):\n1. Zone: A contiguous part of the tree that a name server is responsible for.\n2. Primary Server: Stores the master read-write zone file on its local disk.\n3. Secondary Server: Read-only mirror that synchronizes from the primary server (zone transfer).\n4. Root Server: Holds authority over the entire tree root, delegating query paths to TLD (Top Level Domain) servers.",
            details: "DNS Server Types:\nEvery zone must have at least one primary server and one secondary server to ensure system redundancy and high lookup availability."
          }
        ]
      },
      {
        title: "DNS Name Resolution",
        slides: [
          {
            title: "Recursive vs Iterative Lookups",
            content: "Resolving a hostname to an IP address uses two main methods (Citing PDF Pages 301-303):\n1. Recursive Resolution: The client resolver queries a local server. The local server queries up the tree recursively, acting as a client itself until it returns the final resolved mapping.\n2. Iterative Resolution: The server checks its zone tables. If not authoritative, it immediately returns a referral containing the IP address of an intermediate name server that can help, letting the client resolver query it directly.",
            details: "DNS Caching & Messages (PDF Page 304-306):\n• Caching: Servers cache past mapping hits to accelerate lookup speeds.\n• Message Format: Query and Response share the identical format consisting of header, question records, answer records, authoritative, and additional records. Operates on port 53 (UDP/TCP)."
          }
        ]
      },
      {
        title: "World Wide Web & HTTP",
        slides: [
          {
            title: "Browser & Web Architectures",
            content: "The WWW is a distributed client/server architecture (Citing PDF Pages 268-272):\n• Browser Architecture: Consists of a controller (receives keyboard/mouse inputs), client protocols (HTTP, FTP, SMTP), and interpreters (HTML, CSS, JS, Java Applets).\n• Server Architecture: Web pages are stored at the server. Web servers process client requests, using multithreading or multiprocessing, caching pages in memory to accelerate response speeds.",
            details: "URL & HTTP Cookies (PDF Page 273-274):\n• URL Format: Protocol://Host:Port/Path\n• HTTP Cookies: Small piece of state data sent by the server and stored in the client browser, used to maintain session states."
          },
          {
            title: "Web Documents: Static, Dynamic & Active",
            content: "WWW documents are grouped based on the time their contents are determined (Citing PDF Pages 275-285):\n1. Static Documents: Fixed-content files created and stored at the server. Copy is sent to the client (Citing PDF Page 276).\n2. Dynamic Documents: Created by a web server script (CGI, PHP, JSP, ASP) on-the-fly when a request arrives, returning the computed HTML block as a response (Citing PDF Page 279).\n3. Active Documents: Programs or scripts (JavaScript, Java Applets) sent to the client browser and executed at the client site (Citing PDF Page 283).",
            details: "Persistent Connections:\nHTTP/1.1 specifies persistent connections by default, allowing multiple document requests and responses to flow over a single TCP connection, reducing setup overhead."
          }
        ]
      }
    ]
  }
};

// Curated 25 note-aligned placement questions
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
  const [activeTab, setActiveTab] = useState("slides"); // slides | simulators | practice
  const [activeUnit, setActiveUnit] = useState("Unit I: Introduction & Physical Layer");
  const [activeSimulator, setActiveSimulator] = useState("sliding"); // sliding | hamming | leaky

  // Slide deck specific subtopic and slide indices
  const [activeSubtopicIdx, setActiveSubtopicIdx] = useState(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  // Practice Chamber State
  const [activePracticeUnit, setActivePracticeUnit] = useState("Unit I: Introduction & Physical Layer");
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

  // Sliding Window Simulator State
  const [sf, setSf] = useState(2); // first outstanding
  const [sn, setSn] = useState(6); // next to send
  const [windowSize] = useState(4);
  const totalFrames = 12;

  // Hamming Code Simulator State
  const [dataBits, setDataBits] = useState("1010");
  const [hammingOutput, setHammingOutput] = useState("");

  // Leaky Bucket Simulator State
  const [waterLevel, setWaterLevel] = useState(40);
  const [inputRate, setInputRate] = useState(15);
  const leakRate = 10;
  const [simLogs, setSimLogs] = useState(["Bucket initialized. Leaking constantly at 10 units/tick."]);

  // Reset slide selections when active unit changes
  const handleSelectUnit = (unit) => {
    setActiveUnit(unit);
    setActiveSubtopicIdx(0);
    setActiveSlideIdx(0);
  };

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

  // Handle Hamming Code calculations
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
      setSimLogs(logs.slice(0, 8));
      return next;
    });
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'EASY') return 'var(--emerald-neon)';
    if (diff === 'MEDIUM') return 'var(--cyan-neon)';
    return 'var(--pink-neon)';
  };

  // Slide Deck helpers
  const subtopics = THEORY_CONTENT[activeUnit].subtopics || [];
  const currentSubtopic = subtopics[activeSubtopicIdx] || { title: "", slides: [] };
  const currentSlides = currentSubtopic.slides || [];
  const activeSlide = currentSlides[activeSlideIdx] || { title: "", content: "", details: "" };

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
            Computer Networks Placement Prep Suite
          </h2>
        </div>
        
        {/* Workspace switcher tab selection */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: 'var(--glass-border)' }}>
          {[
            { id: "slides", label: "📖 Study Deck" },
            { id: "simulators", label: "⚙️ Simulators" },
            { id: "practice", label: "🎯 Practice Chamber" }
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
      
      {/* Tab A: Study slides deck */}
      {activeTab === 'slides' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '20px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          {/* Side Menu Drawer */}
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
                SELECT UNIT
              </span>
              <select
                value={activeUnit}
                onChange={(e) => handleSelectUnit(e.target.value)}
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
                {Object.keys(THEORY_CONTENT).map(unitKey => (
                  <option key={unitKey} value={unitKey}>{unitKey.split(":")[0]}</option>
                ))}
              </select>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0' }} />

            {/* Subtopics List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', paddingLeft: '4px' }}>
                SYLLABUS TOPICS
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {subtopics.map((sub, sIdx) => {
                  const isSelected = activeSubtopicIdx === sIdx;
                  return (
                    <button
                      key={sIdx}
                      onClick={() => {
                        setActiveSubtopicIdx(sIdx);
                        setActiveSlideIdx(0);
                      }}
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
                        transition: 'all 0.2s',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {sub.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: 'auto 0 0 0' }} />

            {/* Navigation stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(5, 6, 15, 0.4)', padding: '12px', borderRadius: '10px', border: 'var(--glass-border)', textAlign: 'left' }}>
              <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>UNIT INFO</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', lineHeight: '1.4' }}>
                {THEORY_CONTENT[activeUnit].intro.split(",").slice(0, 2).join(",")}...
              </div>
            </div>
          </div>

          {/* Active Study Slides Workspace Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Slide Navigation HUD bar */}
            <div className="glass-panel" style={{
              background: 'var(--panel-bg)',
              padding: '14px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                Syllabus Deck: <strong style={{ color: 'var(--yellow-neon)' }}>{currentSubtopic.title}</strong>
              </span>

              {/* Slide Counter selectors */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  disabled={activeSlideIdx === 0}
                  onClick={() => setActiveSlideIdx(prev => prev - 1)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    color: activeSlideIdx === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    cursor: activeSlideIdx === 0 ? 'default' : 'pointer',
                    transition: 'all 0.25s'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSlideIdx > 0) e.currentTarget.style.borderColor = 'var(--yellow-neon)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                  }}
                >
                  PREVIOUS SLIDE
                </button>

                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                  {activeSlideIdx + 1} / {currentSlides.length}
                </span>

                <button
                  disabled={activeSlideIdx === currentSlides.length - 1}
                  onClick={() => setActiveSlideIdx(prev => prev + 1)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    color: activeSlideIdx === currentSlides.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    cursor: activeSlideIdx === currentSlides.length - 1 ? 'default' : 'pointer',
                    transition: 'all 0.25s'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSlideIdx < currentSlides.length - 1) e.currentTarget.style.borderColor = 'var(--yellow-neon)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                  }}
                >
                  NEXT SLIDE
                </button>
              </div>
            </div>

            {/* Main Interactive Slide Content card */}
            <div className="glass-panel" style={{
              background: 'var(--panel-bg)',
              padding: '30px',
              display: 'flex',
              flex: '1',
              flexDirection: 'column',
              gap: '20px',
              textAlign: 'left',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              {/* Header Title badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={11} /> NOTE-ALIGNED SYLLABUS SLIDE
                </span>
                <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Unit {activeUnit.split(":")[0].split(" ")[1]} • Slide {activeSlideIdx + 1}
                </span>
              </div>

              {/* Slide Title */}
              <h3 className="text-glow-yellow" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#ffffff' }}>
                {activeSlide.title}
              </h3>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: 0 }} />

              {/* Core Content area */}
              <p style={{
                margin: 0,
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                whiteSpace: 'pre-line'
              }}>
                {activeSlide.content}
              </p>

              {/* Deep coaching block details */}
              {activeSlide.details && (
                <div style={{
                  marginTop: '10px',
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--glass-border)',
                  borderLeft: '4px solid var(--yellow-neon)',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    📖 DETAILED PLACEMENT UNDERSTANDING & MATH
                  </span>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {activeSlide.details}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Tab B: Interactive simulators */}
      {activeTab === 'simulators' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '20px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          {/* Side Menu */}
          <div className="glass-panel" style={{
            background: 'var(--panel-bg)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', paddingLeft: '8px' }}>
              CHOOSE SIMULATOR
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: "sliding", label: "🔀 Sliding Window (GBN)" },
                { id: "hamming", label: "🔢 Hamming Parity Math" },
                { id: "leaky", label: "⏳ Leaky Bucket Shaper" }
              ].map(sim => (
                <button
                  key={sim.id}
                  onClick={() => setActiveSimulator(sim.id)}
                  style={{
                    background: activeSimulator === sim.id ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                    border: activeSimulator === sim.id ? '1px solid var(--yellow-neon)' : '1px solid transparent',
                    borderRadius: '8px',
                    color: activeSimulator === sim.id ? 'var(--yellow-neon)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.25s'
                  }}
                >
                  {sim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Content Window */}
          <div className="glass-panel" style={{
            background: 'var(--panel-bg)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'left'
          }}>
            
            {/* Sliding Window Simulator */}
            {activeSimulator === 'sliding' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Go-Back-N (GBN) Sliding Window Flow
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Simulate how the sender window restricts outstanding packets, utilizing variables Sf (first outstanding frame) and Sn (next frame to send).
                  </p>
                </div>

                {/* Visual Frame Stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0' }}>
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
                      label = 'Outstanding';
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
                        minWidth: '70px',
                        padding: '12px 6px',
                        background: bg,
                        border: border,
                        borderRadius: '8px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '1rem', fontWeight: '900', color: textColor }}>{idx}</span>
                        <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', opacity: 0.8, color: textColor }}>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Controller variables sliders */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: 'var(--glass-border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Sf (First Outstanding Frame): <span style={{ color: 'var(--yellow-neon)', fontWeight: 'bold' }}>{sf}</span>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      Sn (Next to Send): <span style={{ color: 'var(--yellow-neon)', fontWeight: 'bold' }}>{sn}</span>
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
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--glass-border)', borderRadius: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <strong>Go-Back-N Telemetry:</strong> GBN utilizes a send window of size <strong>{windowSize}</strong>.
                  Currently, frames <strong>{sf}</strong> to <strong>{sn - 1}</strong> are outstanding in transit. 
                  Frames <strong>{sn}</strong> to <strong>{Math.min(totalFrames - 1, sf + windowSize - 1)}</strong> are unlocked and can be sent immediately.
                  If a transmission timeout occurs on the outstanding frame <strong>{sf}</strong>, the sender will go back and retransmit all frames starting from <strong>{sf}</strong> (GBN penalty).
                </div>
              </div>
            )}

            {/* Hamming Code Parity Math */}
            {activeSimulator === 'hamming' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Hamming Code (7, 4) Error Correction
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Enter a 4-bit data word (like 1010) to dynamically calculate the 3 redundant parity bits (r1, r2, r4) and construct the final 7-bit corrected Hamming Code word.
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
                      padding: '10px 14px',
                      fontSize: '0.94rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--input-bg)',
                      border: 'var(--glass-border)',
                      borderRadius: '8px',
                      width: '130px',
                      textAlign: 'center',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button 
                    onClick={() => calculateHamming(dataBits)}
                    className="btn-cyber"
                    style={{ padding: '10px 20px', fontSize: '0.78rem', background: 'var(--yellow-neon)', color: '#ffffff' }}
                  >
                    Generate Hamming (7, 4)
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
                            padding: '10px 4px',
                            background: isRedundant ? 'rgba(236,72,153,0.06)' : 'rgba(6,182,212,0.06)',
                            border: `1.5px solid ${colorLabel}`,
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}>
                            <h5 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: colorLabel }}>{bit}</h5>
                            <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{isRedundant ? `Parity r${pos}` : `Data d${pos}`}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--glass-border)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      <strong>Parity Calculations Math:</strong>
                      <br />• <strong>r1</strong> covers indices 1, 3, 5, 7. Value: d3 ⊕ d5 ⊕ d7 = <strong>{hammingOutput[4]} ⊕ {hammingOutput[2]} ⊕ {hammingOutput[0]} = {hammingOutput[6]}</strong>.
                      <br />• <strong>r2</strong> covers indices 2, 3, 6, 7. Value: d3 ⊕ d6 ⊕ d7 = <strong>{hammingOutput[4]} ⊕ {hammingOutput[1]} ⊕ {hammingOutput[0]} = {hammingOutput[5]}</strong>.
                      <br />• <strong>r4</strong> covers indices 4, 5, 6, 7. Value: d5 ⊕ d6 ⊕ d7 = <strong>{hammingOutput[2]} ⊕ {hammingOutput[1]} ⊕ {hammingOutput[0]} = {hammingOutput[3]}</strong>.
                      <br />Receiver recalculates parity check values. If an error is introduced, the decimal value of recalculated bits instantly indicates the failed bit index!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Leaky Bucket Flow Shaper */}
            {activeSimulator === 'leaky' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Leaky Bucket Flow & Congestion Shaper
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Inject bursty data packets and verify how the leaky bucket shaper enforces a constant output leak rate (10 units/tick) to prevent network congestion.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', margin: '15px 0' }}>
                  {/* Bucket Visual Display */}
                  <div style={{
                    width: '110px',
                    height: '150px',
                    border: '3px solid var(--glass-border)',
                    borderTop: 'none',
                    borderRadius: '0 0 20px 20px',
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
                      background: 'linear-gradient(to top, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.5))',
                      transition: 'height 0.3s ease'
                    }} />
                    {/* Centered level indicator */}
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)'
                    }}>{waterLevel}%</span>
                  </div>

                  {/* Simulator Parameters */}
                  <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.74rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        Bursty Input Load Rate: <span style={{ color: 'var(--yellow-neon)', fontWeight: 'bold' }}>{inputRate}</span> units
                      </label>
                      <input 
                        type="range" 
                        min="5" 
                        max="45" 
                        value={inputRate} 
                        onChange={(e) => setInputRate(parseInt(e.target.value))}
                        style={{ accentColor: 'var(--yellow-neon)', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={handleBucketTick}
                        className="btn-cyber"
                        style={{ padding: '10px 20px', fontSize: '0.78rem', background: 'var(--yellow-neon)', color: '#ffffff' }}
                      >
                        Inject Load & Tick
                      </button>
                      <button 
                        onClick={() => {
                          setWaterLevel(0);
                          setSimLogs(["Bucket cleared."]);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'var(--glass-border)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.72rem',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--yellow-neon)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
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
                  height: '120px',
                  overflowY: 'auto'
                }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={12} /> LIVE TELEMETRY SHAPER LOGS
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#fff', marginTop: '8px' }}>
                    {simLogs.map((log, idx) => (
                      <div key={idx} style={{ color: log.startsWith('⚠️') ? '#ff4d4d' : 'var(--text-secondary)' }}>{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
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
                {Object.keys(THEORY_CONTENT).map(unitKey => (
                  <option key={unitKey} value={unitKey}>{unitKey.split(":")[0]}</option>
                ))}
              </select>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0' }} />

            {/* List of active Unit questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', paddingLeft: '4px' }}>
                PRACTICE REGISTRY
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
              <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>UNIT PRACTICE STATS</span>
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
            
            {/* Active Placement Readiness Scoreboard Header */}
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
