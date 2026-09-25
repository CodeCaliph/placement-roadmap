/* core subject: Computer Networks — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "cn",
  title: "Computer Networks",
  short: "CN",
  icon: "⌘",
  blurb: "Interviewers probe the OSI/TCP-IP stack, IP addressing and subnetting, TCP internals (handshake, reliability, congestion), DNS/HTTP/TLS, and the classic \"what happens when you type google.com\" walk-through.",
  topics: ["Basics & Models", "Physical & Data Link", "Network Layer & IP", "Routing", "Transport Layer", "Application Layer", "Web & HTTP", "Security", "Misc"],
  questions: [
    /* ===================== Basics & Models ===================== */
    {
      id: "what-is-network",
      q: "What is a computer network? What are its main components?",
      topic: "Basics & Models",
      level: 1,
      top: true,
      short: "A computer network is a set of interconnected devices (nodes) that exchange data over links using agreed rules called protocols, so they can share resources and communicate.",
      a: [
        { p: "A <b>computer network</b> is two or more autonomous devices connected by communication links that exchange data using a common set of <b>protocols</b>. The goal is resource sharing (files, printers, internet access), communication (mail, chat, video) and reliability (redundant paths, replicated data)." },
        { h: "Components" },
        { ul: [
          "<b>Nodes / end systems</b> – hosts that produce or consume data: PCs, phones, servers, IoT devices.",
          "<b>Links / media</b> – wired (twisted pair, coaxial, optical fibre) or wireless (radio, microwave, satellite).",
          "<b>Intermediate devices</b> – switches, routers, access points, firewalls that forward traffic.",
          "<b>Protocols</b> – rules for syntax, semantics and timing of messages (TCP, IP, HTTP, Ethernet).",
          "<b>NIC</b> – network interface card that gives each host a MAC address and physical connectivity."
        ] },
        { h: "Key performance criteria" },
        { ul: [
          "<b>Performance</b> – throughput, delay (latency), jitter.",
          "<b>Reliability</b> – failure frequency, recovery time.",
          "<b>Security</b> – confidentiality, integrity, authentication."
        ] },
        { tip: "Keep the opening definition to one line, then name the three things every network needs: <b>devices, links, protocols</b>. Interviewers often follow up with \"so what is a protocol?\" – answer: an agreed format and set of rules for exchanging messages." }
      ]
    },
    {
      id: "network-types",
      q: "What are the types of networks – PAN, LAN, MAN, WAN?",
      topic: "Basics & Models",
      level: 1,
      top: true,
      short: "Networks are classified by geographic span: PAN (a few metres, e.g. Bluetooth), LAN (a building/campus), MAN (a city) and WAN (countries/continents, e.g. the Internet).",
      a: [
        { p: "Networks are classified mainly by the <b>geographic area</b> they cover, which also drives their ownership, speed and technology." },
        { table: { head: ["Type", "Range", "Typical tech", "Ownership", "Example"], rows: [
          ["<b>PAN</b> – Personal Area Network", "~1–10 m", "Bluetooth, USB, NFC", "Single person", "Phone ↔ earbuds / smartwatch"],
          ["<b>LAN</b> – Local Area Network", "Room to campus (≤ few km)", "Ethernet, Wi-Fi", "Private (one org)", "Office or college lab network"],
          ["<b>MAN</b> – Metropolitan Area Network", "A city (~5–50 km)", "Fibre rings, Metro Ethernet", "ISP / municipality", "City-wide cable TV / ISP backbone"],
          ["<b>WAN</b> – Wide Area Network", "Country / continent", "MPLS, leased lines, satellite, SD-WAN", "Telcos / many orgs", "The Internet, bank branch network"]
        ] } },
        { ul: [
          "As range grows, <b>latency and cost grow</b>, while speed per link and error-free-ness usually drop.",
          "Other terms: <b>WLAN</b> (wireless LAN), <b>CAN</b> (campus area network), <b>SAN</b> (storage area network), <b>VPN</b> (a private network tunnelled over a public one)."
        ] },
        { tip: "Say the Internet is a <b>network of networks</b> – a global WAN interconnecting millions of LANs via ISPs." }
      ]
    },
    {
      id: "network-topologies",
      q: "Explain network topologies – bus, star, ring, mesh, tree, hybrid.",
      topic: "Basics & Models",
      level: 1,
      top: true,
      short: "Topology is the physical or logical layout of nodes and links: bus (one shared cable), star (all to a central switch), ring (closed loop), mesh (many point-to-point links), tree (hierarchy of stars) and hybrid (mix).",
      a: [
        { p: "<b>Topology</b> describes how nodes are arranged and connected. <i>Physical</i> topology is the cabling; <i>logical</i> topology is how data actually flows (e.g. a star-wired hub still behaves like a logical bus)." },
        { svg: `<svg viewBox="0 0 720 175" width="720" class="dg">
  <line class="ln" x1="15" y1="85" x2="165" y2="85"/>
  <line class="ln" x1="40" y1="59" x2="40" y2="85"/>
  <line class="ln" x1="90" y1="59" x2="90" y2="85"/>
  <line class="ln" x1="140" y1="59" x2="140" y2="85"/>
  <circle class="box" cx="40" cy="45" r="14"/>
  <circle class="box" cx="90" cy="45" r="14"/>
  <circle class="box" cx="140" cy="45" r="14"/>
  <text class="tx tx-b" x="90" y="162" text-anchor="middle">Bus</text>
  <line class="ln" x1="270" y1="82" x2="215" y2="40"/>
  <line class="ln" x1="270" y1="82" x2="325" y2="40"/>
  <line class="ln" x1="270" y1="82" x2="215" y2="125"/>
  <line class="ln" x1="270" y1="82" x2="325" y2="125"/>
  <rect class="box-a" x="248" y="68" width="44" height="28" rx="6"/>
  <text class="tx-s" x="270" y="82" text-anchor="middle" dominant-baseline="middle">switch</text>
  <circle class="box" cx="215" cy="40" r="14"/>
  <circle class="box" cx="325" cy="40" r="14"/>
  <circle class="box" cx="215" cy="125" r="14"/>
  <circle class="box" cx="325" cy="125" r="14"/>
  <text class="tx tx-b" x="270" y="162" text-anchor="middle">Star</text>
  <polyline class="ln" points="450,35 505,80 450,125 395,80 450,35"/>
  <circle class="box" cx="450" cy="35" r="14"/>
  <circle class="box" cx="505" cy="80" r="14"/>
  <circle class="box" cx="450" cy="125" r="14"/>
  <circle class="box" cx="395" cy="80" r="14"/>
  <text class="tx tx-b" x="450" y="162" text-anchor="middle">Ring</text>
  <polyline class="ln" points="590,40 680,40 680,125 590,125 590,40 680,125"/>
  <line class="ln" x1="680" y1="40" x2="590" y2="125"/>
  <circle class="box-g" cx="590" cy="40" r="14"/>
  <circle class="box-g" cx="680" cy="40" r="14"/>
  <circle class="box-g" cx="590" cy="125" r="14"/>
  <circle class="box-g" cx="680" cy="125" r="14"/>
  <text class="tx tx-b" x="635" y="162" text-anchor="middle">Full mesh</text>
</svg>`, caption: "Four basic physical topologies" },
        { table: { head: ["Topology", "Advantages", "Disadvantages"], rows: [
          ["<b>Bus</b>", "Cheap, little cabling, easy to add nodes", "Single cable = single point of failure; collisions; hard to troubleshoot"],
          ["<b>Star</b>", "Easy to install/manage; one bad cable affects only one node", "Central switch/hub is a single point of failure"],
          ["<b>Ring</b>", "Orderly access (token passing), no collisions", "One break stops the ring (unless dual ring, e.g. FDDI)"],
          ["<b>Mesh</b>", "Highly reliable and redundant; no traffic contention", "Expensive: full mesh needs <b>n(n−1)/2</b> links and n−1 ports per node"],
          ["<b>Tree</b>", "Hierarchical, scalable (star of stars)", "Failure of the root/backbone splits the network"],
          ["<b>Hybrid</b>", "Combines strengths; how real networks are built", "Complex design and cost"]
        ] } },
        { tip: "Expect the numerical: a full mesh of 10 devices needs 10×9/2 = <b>45</b> links. Modern Ethernet LANs are physically <b>star</b> (or extended star/tree); WAN cores are <b>partial mesh</b>." }
      ]
    },
    {
      id: "osi-model",
      q: "Explain the OSI model – its 7 layers, PDUs, devices and protocols.",
      topic: "Basics & Models",
      level: 1,
      top: true,
      short: "OSI is a 7-layer reference model – Physical, Data Link, Network, Transport, Session, Presentation, Application – where each layer provides services to the one above and adds its own header (PDU: bits, frames, packets, segments, data).",
      a: [
        { p: "The <b>Open Systems Interconnection (OSI)</b> model (ISO, 1984) is a conceptual framework that splits network communication into <b>7 layers</b>. Each layer talks logically to its peer layer on the other host and uses services of the layer below. It is a <i>reference</i> model – the Internet actually runs on TCP/IP – but it is the shared vocabulary (\"that's an L7 load balancer\", \"L2 switch\")." },
        { svg: `<svg viewBox="0 0 600 290" width="600" class="dg">
  <rect class="box-p" x="10" y="10" width="580" height="34" rx="6"/>
  <text class="tx tx-b" x="22" y="27" dominant-baseline="middle">7  Application</text>
  <text class="tx-m" x="300" y="27" text-anchor="middle" dominant-baseline="middle">Data</text>
  <text class="tx-c" x="580" y="27" text-anchor="end" dominant-baseline="middle">HTTP, DNS, SMTP, FTP</text>
  <rect class="box-p" x="10" y="50" width="580" height="34" rx="6"/>
  <text class="tx tx-b" x="22" y="67" dominant-baseline="middle">6  Presentation</text>
  <text class="tx-m" x="300" y="67" text-anchor="middle" dominant-baseline="middle">Data</text>
  <text class="tx-c" x="580" y="67" text-anchor="end" dominant-baseline="middle">TLS, JPEG, ASCII/UTF-8</text>
  <rect class="box-p" x="10" y="90" width="580" height="34" rx="6"/>
  <text class="tx tx-b" x="22" y="107" dominant-baseline="middle">5  Session</text>
  <text class="tx-m" x="300" y="107" text-anchor="middle" dominant-baseline="middle">Data</text>
  <text class="tx-c" x="580" y="107" text-anchor="end" dominant-baseline="middle">RPC, NetBIOS, sockets API</text>
  <rect class="box-a" x="10" y="130" width="580" height="34" rx="6"/>
  <text class="tx tx-b" x="22" y="147" dominant-baseline="middle">4  Transport</text>
  <text class="tx-m" x="300" y="147" text-anchor="middle" dominant-baseline="middle">Segment / Datagram</text>
  <text class="tx-c" x="580" y="147" text-anchor="end" dominant-baseline="middle">TCP, UDP, QUIC</text>
  <rect class="box-g" x="10" y="170" width="580" height="34" rx="6"/>
  <text class="tx tx-b" x="22" y="187" dominant-baseline="middle">3  Network</text>
  <text class="tx-m" x="300" y="187" text-anchor="middle" dominant-baseline="middle">Packet  ·  Router</text>
  <text class="tx-c" x="580" y="187" text-anchor="end" dominant-baseline="middle">IP, ICMP, OSPF, BGP</text>
  <rect class="box-w" x="10" y="210" width="580" height="34" rx="6"/>
  <text class="tx tx-b" x="22" y="227" dominant-baseline="middle">2  Data Link</text>
  <text class="tx-m" x="300" y="227" text-anchor="middle" dominant-baseline="middle">Frame  ·  Switch, Bridge</text>
  <text class="tx-c" x="580" y="227" text-anchor="end" dominant-baseline="middle">Ethernet, Wi-Fi, ARP, PPP</text>
  <rect class="box" x="10" y="250" width="580" height="34" rx="6"/>
  <text class="tx tx-b" x="22" y="267" dominant-baseline="middle">1  Physical</text>
  <text class="tx-m" x="300" y="267" text-anchor="middle" dominant-baseline="middle">Bits  ·  Hub, Repeater</text>
  <text class="tx-c" x="580" y="267" text-anchor="end" dominant-baseline="middle">RJ45, fibre, 802.11 PHY</text>
</svg>`, caption: "OSI stack: layer, PDU (and device), example protocols" },
        { table: { head: ["#", "Layer", "Responsibility", "PDU", "Device", "Protocols"], rows: [
          ["7", "Application", "Network services to user apps", "Data / message", "L7 LB, proxy", "HTTP, DNS, SMTP, FTP, SSH"],
          ["6", "Presentation", "Translation, encryption, compression", "Data", "–", "TLS/SSL, JPEG, MPEG, ASCII"],
          ["5", "Session", "Establish/maintain/terminate sessions, checkpoints", "Data", "–", "RPC, NetBIOS, PPTP"],
          ["4", "Transport", "Process-to-process delivery, ports, reliability, flow & congestion control, segmentation", "Segment (TCP) / Datagram (UDP)", "L4 LB, firewall", "TCP, UDP, SCTP"],
          ["3", "Network", "Logical (IP) addressing, routing, fragmentation", "Packet", "Router, L3 switch", "IPv4, IPv6, ICMP, OSPF, BGP"],
          ["2", "Data Link", "Framing, MAC addressing, error detection, media access", "Frame", "Switch, bridge, NIC", "Ethernet, 802.11, PPP, ARP*"],
          ["1", "Physical", "Bits as signals: voltages, light, radio; bit timing", "Bit", "Hub, repeater, cable, modem", "RS-232, 100BASE-TX, DSL"]
        ] } },
        { tip: "Mnemonic top-down: <b>All People Seem To Need Data Processing</b>; bottom-up: <b>Please Do Not Throw Sausage Pizza Away</b>. Remember PDUs as <b>Data → Segment → Packet → Frame → Bits</b>." },
        { warn: "Layers 5–7 are merged in real stacks – TLS is often called L6 but actually sits between TCP and the application. ARP is debated (L2/L3 \"layer 2.5\"); say it resolves L3 addresses to L2 addresses." }
      ]
    },
    {
      id: "tcp-ip-vs-osi",
      q: "What is the TCP/IP model and how does it compare with OSI?",
      topic: "Basics & Models",
      level: 1,
      top: true,
      short: "TCP/IP is the practical 4-layer (sometimes 5-layer) model the Internet runs on – Link, Internet, Transport, Application; OSI is a 7-layer theoretical reference that splits Application into three and Link into two.",
      a: [
        { p: "The <b>TCP/IP (Internet) model</b> was built from working protocols (ARPANET) and has <b>4 layers</b>: Network Access/Link, Internet, Transport, Application. Textbooks (Kurose, Forouzan) often use a 5-layer hybrid that splits Link into Data Link + Physical." },
        { table: { head: ["OSI (7)", "TCP/IP (4)", "Examples"], rows: [
          ["Application, Presentation, Session", "Application", "HTTP, DNS, TLS, SMTP, SSH"],
          ["Transport", "Transport", "TCP, UDP, QUIC"],
          ["Network", "Internet", "IP, ICMP, IGMP"],
          ["Data Link, Physical", "Network Access (Link)", "Ethernet, Wi-Fi, ARP"]
        ] } },
        { table: { head: ["Aspect", "OSI", "TCP/IP"], rows: [
          ["Nature", "Reference / theoretical model", "Implementation model – the Internet"],
          ["Developed", "Model first, protocols later", "Protocols first, model described after"],
          ["Layers", "7", "4 (or 5)"],
          ["Separation", "Strict: service, interface, protocol distinct", "Looser; layers can be bypassed"],
          ["Transport", "Connection-oriented and connectionless", "TCP (connection-oriented) and UDP (connectionless)"],
          ["Network layer", "Both connection-oriented and connectionless", "Connectionless only (IP, best effort)"]
        ] } },
        { tip: "One-liner: \"OSI is how we <i>talk about</i> networks; TCP/IP is how the Internet <i>actually works</i>.\"" }
      ]
    },
    {
      id: "network-devices",
      q: "Hub vs switch vs bridge vs router vs gateway – what is the difference?",
      topic: "Basics & Models",
      level: 1,
      top: true,
      short: "A hub (L1) repeats bits to every port; a bridge/switch (L2) forwards frames by MAC address; a router (L3) forwards packets between networks by IP address; a gateway translates between different protocols/architectures (can work up to L7).",
      a: [
        { p: "They differ in <b>which layer</b> they operate at and therefore <b>what address</b> they look at to decide where data goes." },
        { table: { head: ["Device", "OSI layer", "Forwards based on", "Collision domains", "Broadcast domains", "Notes"], rows: [
          ["<b>Repeater</b>", "L1", "Nothing – regenerates signal", "1", "1", "Extends cable length"],
          ["<b>Hub</b>", "L1", "Nothing – floods every port", "1 (all ports share)", "1", "Multi-port repeater, half-duplex, obsolete"],
          ["<b>Bridge</b>", "L2", "MAC address (few ports, software)", "1 per port", "1", "Connects two LAN segments; filters"],
          ["<b>Switch</b>", "L2 (L3 switch: L3)", "MAC address table (CAM), hardware ASIC", "1 per port", "1 (per VLAN)", "Full-duplex, learns MACs, supports VLANs"],
          ["<b>Router</b>", "L3", "IP address + routing table (longest prefix match)", "1 per port", "1 per port", "Connects different networks; blocks broadcasts; NAT, ACLs"],
          ["<b>Gateway</b>", "L4–L7 (any)", "Protocol translation", "–", "–", "E.g. email/VoIP gateway, IPv4↔IPv6; \"default gateway\" = router for the LAN"]
        ] } },
        { h: "How a switch learns" },
        { ol: [
          "Frame arrives on port P: record <code>source MAC → P</code> in the MAC table (with an ageing timer).",
          "Look up destination MAC: if known, forward only to that port (<b>filtering</b>); if unknown or broadcast, <b>flood</b> all ports except P."
        ] },
        { tip: "Also mention the <b>modem</b> (modulates digital ↔ analog, L1) and <b>access point</b> (bridges Wi-Fi to wired Ethernet, L2). Home \"routers\" are actually router + switch + AP + DHCP server + NAT + firewall in one box." },
        { warn: "\"Gateway\" is overloaded: in everyday config, <i>default gateway</i> just means the router IP your host sends off-subnet traffic to." }
      ]
    },
    {
      id: "encapsulation",
      q: "What is encapsulation and decapsulation in networking?",
      topic: "Basics & Models",
      level: 2,
      top: false,
      short: "As data moves down the stack each layer wraps the payload from the layer above with its own header (and the link layer a trailer) – encapsulation; the receiver strips them off layer by layer going up – decapsulation.",
      a: [
        { p: "<b>Encapsulation</b> is the process by which each layer treats the whole PDU from the layer above as opaque payload and prepends its own control information. <b>Decapsulation</b> is the reverse at the receiver: each layer reads and removes its header and hands the payload up, using a field in its header to know <i>which</i> upper protocol to hand it to." },
        { ol: [
          "Application produces data, e.g. an HTTP request.",
          "Transport adds a TCP header (src/dst port, seq, ack) → <b>segment</b>.",
          "Network adds an IP header (src/dst IP, TTL, protocol=6) → <b>packet</b>.",
          "Data link adds an Ethernet header (src/dst MAC, EtherType=0x0800) and FCS trailer → <b>frame</b>.",
          "Physical transmits the frame as <b>bits</b> (signals)."
        ] },
        { code: `| Eth hdr 14B | IP hdr 20B | TCP hdr 20B | HTTP data ... | FCS 4B |
                  <----------- IP packet (MTU 1500) ----------->
<------------------------- Ethernet frame ------------------------->`, lang: "text", title: "Typical TCP/IPv4 over Ethernet frame" },
        { ul: [
          "Demultiplexing keys: EtherType (L2 → L3), IP <i>Protocol</i> field (6 = TCP, 17 = UDP, 1 = ICMP), destination port (L4 → process).",
          "Routers decapsulate only up to L3 and re-encapsulate a <i>new</i> L2 frame per hop; the IP packet (except TTL/checksum) is unchanged."
        ] },
        { tip: "Point out that MAC addresses change at every hop while IP addresses stay end-to-end (unless NAT rewrites them)." }
      ]
    },
    {
      id: "collision-vs-broadcast-domain",
      q: "What is a collision domain vs a broadcast domain?",
      topic: "Basics & Models",
      level: 2,
      top: true,
      short: "A collision domain is a segment where simultaneous transmissions collide (every hub port shares one; every switch port is its own); a broadcast domain is the set of hosts that receive a L2 broadcast (switches extend it, routers/VLANs break it).",
      a: [
        { p: "<b>Collision domain</b>: the set of devices whose frames can collide because they share the same half-duplex medium. <b>Broadcast domain</b>: the set of devices that receive a frame sent to <code>FF:FF:FF:FF:FF:FF</code> (e.g. ARP requests, DHCP Discover)." },
        { table: { head: ["Device", "Breaks collision domain?", "Breaks broadcast domain?"], rows: [
          ["Hub / repeater", "No", "No"],
          ["Bridge / switch", "Yes – each port is one", "No (unless VLANs)"],
          ["Router", "Yes", "Yes – each interface is one"]
        ] } },
        { h: "Worked example" },
        { p: "A router has 2 interfaces. Interface 1 → a switch with 5 PCs. Interface 2 → a hub with 4 PCs.<br>Collision domains = 5 (switch ports to PCs) + 1 (switch–router link) + 1 (entire hub side incl. router link) = <b>7</b>.<br>Broadcast domains = one per router interface = <b>2</b>." },
        { tip: "Why it matters: large collision domains kill throughput (CSMA/CD backoff); large broadcast domains waste bandwidth and CPU (ARP storms). Segment with switches for the first and routers/VLANs for the second." },
        { warn: "With modern full-duplex switched Ethernet, collisions essentially no longer occur – the concept matters mostly for hubs and historical Ethernet." }
      ]
    },

    /* ===================== Physical & Data Link ===================== */
    {
      id: "mac-vs-ip",
      q: "What is the difference between a MAC address and an IP address?",
      topic: "Physical & Data Link",
      level: 1,
      top: true,
      short: "A MAC address is a 48-bit hardware address burned into the NIC and used for delivery within one local link (L2); an IP address is a logical 32/128-bit address assigned by the network and used for end-to-end routing across networks (L3).",
      a: [
        { p: "Both identify an interface, but at different layers and scopes: the <b>IP address says <i>where</i></b> a host is in the internetwork; the <b>MAC address says <i>who</i></b> it is on the local wire, i.e. the next hop." },
        { table: { head: ["Aspect", "MAC address", "IP address"], rows: [
          ["Layer", "Data Link (L2)", "Network (L3)"],
          ["Size / format", "48 bits, hex: <code>3C:52:82:1A:9F:04</code>", "IPv4 32 bits <code>192.168.1.10</code>; IPv6 128 bits"],
          ["Assigned by", "Manufacturer (OUI = first 24 bits)", "Admin or DHCP / SLAAC"],
          ["Changes?", "Fixed (can be spoofed / randomised)", "Changes with network"],
          ["Structure", "Flat – no location info", "Hierarchical – network + host part"],
          ["Scope", "Local link only; rewritten every hop", "End-to-end (unless NAT)"],
          ["Used by", "Switches", "Routers"],
          ["Mapping", "IP → MAC via ARP (IPv4) / NDP (IPv6)", ""]
        ] } },
        { tip: "Classic follow-up: \"Why do we need both?\" – MAC addresses are flat, so routers could not aggregate them into routes; IP gives a hierarchical, routable address. Conversely, the physical LAN hardware delivers frames by MAC, so we need ARP to bridge the two." }
      ]
    },
    {
      id: "arp-rarp",
      q: "How does ARP work? What are RARP, gratuitous ARP and proxy ARP?",
      topic: "Physical & Data Link",
      level: 2,
      top: true,
      short: "ARP resolves an IPv4 address to a MAC address on the local network: the host broadcasts \"who has IP X?\" and the owner unicasts back its MAC, which is cached. RARP did the reverse (MAC → IP) and has been replaced by BOOTP/DHCP.",
      a: [
        { p: "<b>ARP (Address Resolution Protocol)</b> maps a known IPv4 address to the unknown MAC address on the same broadcast domain. It is needed because frames are delivered by MAC." },
        { ol: [
          "Host A wants to send to 192.168.1.20 (same subnet) – or, if off-subnet, to its <b>default gateway's</b> IP.",
          "A checks its <b>ARP cache</b>. On a miss it broadcasts an <b>ARP Request</b> (dst MAC <code>FF:FF:FF:FF:FF:FF</code>): \"Who has 192.168.1.20? Tell 192.168.1.10\".",
          "Every host receives it; only the owner replies with a <b>unicast ARP Reply</b> containing its MAC.",
          "A caches the mapping (typically for minutes) and sends the queued frame. B also caches A's mapping from the request."
        ] },
        { code: `$ arp -a
Interface: 192.168.1.10
  Internet Address      Physical Address      Type
  192.168.1.1           a4-2b-b0-11-22-33     dynamic
  192.168.1.255         ff-ff-ff-ff-ff-ff     static`, lang: "bash", title: "Viewing the ARP cache" },
        { table: { head: ["Variant", "What it does"], rows: [
          ["<b>RARP</b>", "Reverse: diskless host knows its MAC, asks a RARP server for its IP. Obsolete → BOOTP → DHCP."],
          ["<b>Gratuitous ARP</b>", "Host announces its own IP→MAC unsolicited; detects IP conflicts and updates caches after failover (VRRP/HSRP)."],
          ["<b>Proxy ARP</b>", "Router answers ARP on behalf of hosts in another network so hosts without a gateway configured can still reach them."],
          ["<b>InARP</b>", "Inverse ARP on Frame Relay: DLCI → IP."],
          ["<b>NDP</b>", "IPv6 replacement for ARP, using ICMPv6 Neighbor Solicitation/Advertisement to multicast addresses."]
        ] } },
        { warn: "ARP has no authentication, so <b>ARP spoofing/poisoning</b> lets an attacker claim the gateway's IP and become a man-in-the-middle. Mitigations: Dynamic ARP Inspection, static entries for critical hosts, encryption (TLS) end to end." }
      ]
    },
    {
      id: "ethernet-csma",
      q: "Explain Ethernet and CSMA/CD. How does CSMA/CA (Wi-Fi) differ?",
      topic: "Physical & Data Link",
      level: 2,
      top: true,
      short: "CSMA/CD (classic Ethernet) senses the medium, transmits, detects collisions while sending, jams and retries after binary exponential backoff; CSMA/CA (Wi-Fi) cannot detect collisions, so it avoids them with random backoff before sending, optional RTS/CTS and link-layer ACKs.",
      a: [
        { p: "<b>Ethernet (IEEE 802.3)</b> is the dominant wired LAN technology. Frame: preamble (7B) + SFD (1B) + dst MAC (6) + src MAC (6) + EtherType/length (2) + payload (46–1500) + FCS/CRC-32 (4). Min frame 64 B, max 1518 B (excluding preamble)." },
        { h: "CSMA/CD – Carrier Sense Multiple Access with Collision Detection" },
        { ol: [
          "<b>Carrier sense</b>: listen; if the medium is busy, wait (1-persistent).",
          "Transmit and keep monitoring the medium.",
          "If a <b>collision</b> is detected, stop and send a 32-bit <b>jam</b> signal so everyone notices.",
          "<b>Binary exponential backoff</b>: after the n-th collision wait K × slot time, K random in [0, 2<sup>min(n,10)</sup> − 1]; give up after 16 attempts."
        ] },
        { p: "For detection to work, a station must still be transmitting when the collision news returns: <b>T<sub>transmit</sub> ≥ 2 × T<sub>prop</sub></b>, i.e. <b>L<sub>min</sub> = 2 × T<sub>prop</sub> × Bandwidth</b>. For 10 Mbps Ethernet this gave the 512-bit (64-byte) minimum frame." },
        { h: "CSMA/CA vs CSMA/CD" },
        { table: { head: ["Aspect", "CSMA/CD", "CSMA/CA"], rows: [
          ["Used in", "Classic half-duplex Ethernet (802.3)", "Wireless LAN (802.11)"],
          ["Idea", "Detect collisions and recover", "Avoid collisions before they happen"],
          ["Why", "Wire lets a sender hear while sending", "Radio can't transmit and listen well at once; hidden-terminal problem"],
          ["Mechanism", "Jam signal + exponential backoff", "DIFS wait + random backoff, optional <b>RTS/CTS</b>, NAV, ACK for every frame"],
          ["Efficiency", "Wasted time only on collisions", "Overhead even without collisions"]
        ] } },
        { tip: "Modern switched Ethernet is full-duplex, one device per port – CSMA/CD is effectively disabled. Mention the <b>hidden terminal</b> problem (A and C both reach AP B but not each other) as the reason for RTS/CTS." }
      ]
    },
    {
      id: "framing",
      q: "What is framing? Explain byte stuffing and bit stuffing.",
      topic: "Physical & Data Link",
      level: 2,
      top: false,
      short: "Framing is how the data link layer marks the start and end of each frame in a bit stream; methods include character count, flag bytes with byte stuffing, flag bits with bit stuffing (HDLC inserts a 0 after five 1s) and physical-layer coding violations.",
      a: [
        { p: "The physical layer delivers a raw bit stream; the data link layer must break it into <b>frames</b> so the receiver knows where each begins and ends (and can apply the checksum per frame)." },
        { table: { head: ["Method", "How", "Issue"], rows: [
          ["Character count", "Header field says frame length", "One corrupted count desynchronises everything"],
          ["Flag bytes + byte stuffing", "Frames start/end with a FLAG byte; any FLAG or ESC in data is prefixed with ESC (PPP uses 0x7E / 0x7D)", "Overhead depends on data; byte-oriented"],
          ["Flag bits + bit stuffing", "Flag = <code>01111110</code>; sender inserts a 0 after every five consecutive 1s in the data; receiver removes it", "Used by HDLC; works at bit granularity"],
          ["Physical-layer coding violations", "Use invalid symbols (e.g. 4B/5B, Manchester) to mark boundaries", "Needs line coding with spare symbols"],
          ["Length + preamble", "Ethernet: preamble/SFD marks start; length/EtherType and inter-frame gap", "–"]
        ] } },
        { code: `Data:           0 1 1 1 1 1 1 1 1 0 1 0
After stuffing: 0 1 1 1 1 1 0 1 1 1 0 1 0
                          ^ stuffed 0 after five 1s
Receiver: sees five 1s followed by 0 -> deletes the 0.
          five 1s followed by 1 then 0 -> flag (01111110).`, lang: "text", title: "Bit stuffing example" },
        { tip: "Why stuffing? So that the flag pattern can <b>never appear inside the payload</b> – this is called <i>data transparency</i>." }
      ]
    },
    {
      id: "error-detection",
      q: "How are errors detected? Explain parity, checksum and CRC.",
      topic: "Physical & Data Link",
      level: 2,
      top: true,
      short: "Senders add redundant bits computed from the data: parity (1 bit, catches odd numbers of flipped bits), checksum (ones'-complement sum of 16-bit words, used by IP/TCP/UDP) and CRC (remainder of polynomial division, catches all burst errors up to its degree; used by Ethernet).",
      a: [
        { p: "Error detection adds <b>redundancy</b>: the sender computes check bits from the data; the receiver recomputes them and discards (or requests retransmission of) the frame if they mismatch. <b>Error correction</b> (Hamming, Reed–Solomon, FEC) adds enough redundancy to fix errors without retransmitting." },
        { table: { head: ["Technique", "How", "Detects", "Used in"], rows: [
          ["<b>Simple parity</b>", "1 bit making the count of 1s even (or odd)", "All single-bit / odd-count errors; misses even-count errors", "Serial links, memory"],
          ["<b>2-D parity</b>", "Parity per row and per column of a block", "All 1-, 2-, 3-bit errors; corrects single-bit", "Old storage/links"],
          ["<b>Checksum</b>", "Add data as 16-bit words in ones'-complement, wrap carries, invert", "Most errors; weak vs reordering of words", "IPv4 header, TCP, UDP"],
          ["<b>CRC</b>", "Append r zeros, divide by generator of degree r (mod-2), send remainder", "All single, double, odd-count errors and all bursts ≤ r bits", "Ethernet (CRC-32), Wi-Fi, HDLC, ZIP"]
        ] } },
        { h: "CRC worked example" },
        { code: `Data  = 100100      Generator G = 1101 (x^3 + x^2 + 1, r = 3)
Append 3 zeros ->   100100000
Mod-2 divide by 1101:
  1001 ^ 1101 = 0100 -> bring down -> 1000
  1000 ^ 1101 = 0101 -> 1010
  1010 ^ 1101 = 0111 -> 1110
  1110 ^ 1101 = 0011 -> 0110
  0110 ^ 0000 = 0110 -> 1100
  1100 ^ 1101 = 0001
Remainder (CRC) = 001
Transmit: 100100 001 -> receiver divides by 1101, remainder 000 => no error`, lang: "text", title: "CRC computation" },
        { code: `def internet_checksum(data: bytes) -> int:
    if len(data) % 2:
        data += b"\\x00"                  # pad to 16-bit words
    s = 0
    for i in range(0, len(data), 2):
        s += (data[i] << 8) | data[i + 1]
        s = (s & 0xFFFF) + (s >> 16)     # wrap carry (ones' complement add)
    return ~s & 0xFFFF

print(hex(internet_checksum(b"\\x45\\x00\\x00\\x1c")))   # 0xbae3`, lang: "python", title: "RFC 1071 Internet checksum" },
        { tip: "Know the division of labour: <b>CRC</b> at the link layer (strong, hardware-friendly), <b>checksum</b> at IP/TCP/UDP (cheap in software, end-to-end). IPv6 dropped the header checksum entirely to speed up routers." }
      ]
    },
    {
      id: "flow-control-arq",
      q: "Explain flow control: Stop-and-Wait, sliding window, Go-Back-N and Selective Repeat.",
      topic: "Physical & Data Link",
      level: 2,
      top: true,
      short: "Flow control stops a fast sender overwhelming a slow receiver. Stop-and-Wait sends one frame and waits for its ACK; sliding-window protocols keep up to N frames in flight – Go-Back-N resends everything from a lost frame on timeout, Selective Repeat resends only the lost frame and buffers out-of-order ones.",
      a: [
        { p: "<b>Flow control</b> regulates the sender's rate to what the <i>receiver</i> can absorb. Combined with retransmission on loss it forms <b>ARQ</b> (Automatic Repeat reQuest) protocols. The same ideas appear at the link layer (HDLC) and transport layer (TCP)." },
        { h: "Stop-and-Wait" },
        { p: "Send one frame, wait for its ACK (retransmit on timeout); 1-bit sequence numbers (0/1) detect duplicates. Simple but wasteful on long/fast links. With a = T<sub>prop</sub> / T<sub>trans</sub>: <b>efficiency η = 1 / (1 + 2a)</b>." },
        { h: "Sliding window" },
        { p: "The sender may have up to <b>W</b> unacknowledged frames in flight; each ACK slides the window forward. If W ≥ 1 + 2a the pipe stays full (η = 1); otherwise η = W / (1 + 2a)." },
        { svg: `<svg viewBox="0 0 600 130" width="600" class="dg">
  <text class="tx-m" x="98" y="26" text-anchor="middle">Sent + ACKed</text>
  <text class="tx-m" x="230" y="26" text-anchor="middle">Sent, not ACKed</text>
  <text class="tx-m" x="342" y="26" text-anchor="middle">Usable</text>
  <text class="tx-m" x="474" y="26" text-anchor="middle">Not yet allowed</text>
  <rect class="box-g" x="36" y="40" width="40" height="36" rx="6"/><text class="tx" x="56" y="58" text-anchor="middle" dominant-baseline="middle">0</text>
  <rect class="box-g" x="80" y="40" width="40" height="36" rx="6"/><text class="tx" x="100" y="58" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box-g" x="124" y="40" width="40" height="36" rx="6"/><text class="tx" x="144" y="58" text-anchor="middle" dominant-baseline="middle">2</text>
  <rect class="box-w" x="168" y="40" width="40" height="36" rx="6"/><text class="tx" x="188" y="58" text-anchor="middle" dominant-baseline="middle">3</text>
  <rect class="box-w" x="212" y="40" width="40" height="36" rx="6"/><text class="tx" x="232" y="58" text-anchor="middle" dominant-baseline="middle">4</text>
  <rect class="box-w" x="256" y="40" width="40" height="36" rx="6"/><text class="tx" x="276" y="58" text-anchor="middle" dominant-baseline="middle">5</text>
  <rect class="box-a" x="300" y="40" width="40" height="36" rx="6"/><text class="tx" x="320" y="58" text-anchor="middle" dominant-baseline="middle">6</text>
  <rect class="box-a" x="344" y="40" width="40" height="36" rx="6"/><text class="tx" x="364" y="58" text-anchor="middle" dominant-baseline="middle">7</text>
  <rect class="box" x="388" y="40" width="40" height="36" rx="6"/><text class="tx" x="408" y="58" text-anchor="middle" dominant-baseline="middle">8</text>
  <rect class="box" x="432" y="40" width="40" height="36" rx="6"/><text class="tx" x="452" y="58" text-anchor="middle" dominant-baseline="middle">9</text>
  <rect class="box" x="476" y="40" width="40" height="36" rx="6"/><text class="tx" x="496" y="58" text-anchor="middle" dominant-baseline="middle">10</text>
  <rect class="box" x="520" y="40" width="40" height="36" rx="6"/><text class="tx" x="540" y="58" text-anchor="middle" dominant-baseline="middle">11</text>
  <polyline class="ln-a" points="168,84 168,94 384,94 384,84"/>
  <text class="tx tx-a" x="276" y="116" text-anchor="middle">Send window W = 5</text>
  <line class="ln-a" x1="400" y1="112" x2="470" y2="112" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="480" y="116">slides on ACK</text>
</svg>`, caption: "Sender's sliding window: ACK for frame 3 slides the window one step right" },
        { table: { head: ["", "Stop-and-Wait", "Go-Back-N", "Selective Repeat"], rows: [
          ["Sender window", "1", "N ≤ 2<sup>m</sup> − 1", "N ≤ 2<sup>m−1</sup>"],
          ["Receiver window", "1", "1 (accepts only in order)", "Same as sender (buffers out-of-order)"],
          ["ACKs", "Per frame", "Cumulative", "Individual (plus NAK)"],
          ["On loss of frame k", "Resend k", "Resend k and <b>all</b> frames after it", "Resend <b>only</b> k"],
          ["Complexity", "Lowest", "Simple receiver", "Receiver buffering + sorting"],
          ["Best when", "Short links", "Low error rate", "High error rate / high BDP"]
        ] } },
        { tip: "Be ready for the window-size limit: with m-bit sequence numbers, GBN allows 2<sup>m</sup> − 1 and SR allows 2<sup>m−1</sup>; larger windows let the receiver confuse a retransmitted old frame with a new one. TCP is a hybrid: cumulative ACKs like GBN plus SACK and receiver buffering like SR." }
      ]
    },
    {
      id: "vlan",
      q: "What is a VLAN and how does 802.1Q tagging work?",
      topic: "Physical & Data Link",
      level: 3,
      top: false,
      short: "A VLAN logically splits one physical switch fabric into multiple isolated broadcast domains; 802.1Q inserts a 4-byte tag with a 12-bit VLAN ID into frames on trunk links so switches know which VLAN each frame belongs to.",
      a: [
        { p: "A <b>Virtual LAN</b> groups switch ports into separate L2 broadcast domains regardless of physical location – e.g. HR, Engineering and Guest Wi-Fi on the same switches but unable to see each other's broadcasts." },
        { ul: [
          "<b>Access port</b>: belongs to one VLAN; frames are untagged towards the host.",
          "<b>Trunk port</b>: carries many VLANs between switches/routers; frames carry an <b>802.1Q tag</b>.",
          "802.1Q tag = 4 bytes after the source MAC: TPID <code>0x8100</code> + 3-bit PCP (priority/QoS) + 1-bit DEI + <b>12-bit VLAN ID</b> (1–4094 usable).",
          "<b>Native VLAN</b>: the one VLAN sent untagged on a trunk (default VLAN 1).",
          "Traffic <b>between</b> VLANs needs a router or L3 switch (\"router-on-a-stick\" or SVIs)."
        ] },
        { table: { head: ["Benefit", "Why"], rows: [
          ["Security", "Isolation between departments/guests at L2"],
          ["Performance", "Smaller broadcast domains"],
          ["Flexibility", "Move users between VLANs by config, not recabling"],
          ["Cost", "One set of switches for many logical networks"]
        ] } },
        { warn: "VLANs are not a full security boundary: misconfigured trunks enable <b>VLAN hopping</b> (switch spoofing, double tagging). Disable DTP and don't use VLAN 1 as the native VLAN." }
      ]
    },

    /* ===================== Network Layer & IP ===================== */
    {
      id: "ipv4-vs-ipv6",
      q: "What are the differences between IPv4 and IPv6?",
      topic: "Network Layer & IP",
      level: 1,
      top: true,
      short: "IPv4 uses 32-bit addresses (~4.3 billion) with a variable header, broadcast and heavy reliance on NAT; IPv6 uses 128-bit addresses with a fixed 40-byte header, no broadcast, no router fragmentation, built-in autoconfiguration (SLAAC) and mandatory-capable IPsec.",
      a: [
        { p: "IPv6 was designed chiefly to solve <b>IPv4 address exhaustion</b> (IANA's free pool ran out in 2011), and it also streamlined the header for faster forwarding." },
        { table: { head: ["Feature", "IPv4", "IPv6"], rows: [
          ["Address size", "32 bits → ~4.3 × 10<sup>9</sup>", "128 bits → ~3.4 × 10<sup>38</sup>"],
          ["Notation", "Dotted decimal <code>192.168.1.1</code>", "Hex groups <code>2001:db8::8a2e:370:7334</code> (<code>::</code> compresses zeros once)"],
          ["Header", "20–60 bytes, 12+ fields, has checksum", "Fixed 40 bytes, 8 fields, <b>no checksum</b>, extension headers"],
          ["Fragmentation", "By sender and routers", "Sender only (Path MTU discovery); min MTU 1280"],
          ["Broadcast", "Yes", "No – multicast and anycast instead"],
          ["Configuration", "Manual or DHCP", "SLAAC (stateless), DHCPv6, manual"],
          ["Address resolution", "ARP", "NDP (ICMPv6)"],
          ["NAT", "Common (address shortage)", "Not needed – end-to-end addressing"],
          ["IPsec", "Optional add-on", "Designed in (support originally mandatory)"],
          ["QoS", "ToS/DSCP", "Traffic Class + <b>Flow Label</b>"],
          ["Loopback", "127.0.0.1", "::1"]
        ] } },
        { p: "Transition mechanisms: <b>dual stack</b> (run both), <b>tunnelling</b> (6in4, 6to4, Teredo), and <b>translation</b> (NAT64/DNS64)." },
        { tip: "Mention that <b>TTL</b> is renamed <b>Hop Limit</b> and <b>Protocol</b> becomes <b>Next Header</b> in IPv6. If asked \"why no checksum?\" – link (CRC) and transport (TCP/UDP checksum) already cover it, and routers save work at every hop." }
      ]
    },
    {
      id: "classful-addressing",
      q: "Explain classful IPv4 addressing (Classes A–E).",
      topic: "Network Layer & IP",
      level: 1,
      top: true,
      short: "Classful addressing split the IPv4 space by the leading bits into Class A (/8, 1–126), B (/16, 128–191), C (/24, 192–223), D (multicast, 224–239) and E (experimental, 240–255); it wasted addresses and was replaced by CIDR in 1993.",
      a: [
        { p: "In the original scheme the <b>first few bits</b> of the address fixed where the network part ends, so no subnet mask needed to be carried." },
        { table: { head: ["Class", "Leading bits", "First octet", "Default mask", "Networks", "Hosts / network", "Use"], rows: [
          ["A", "0", "1 – 126", "255.0.0.0 (/8)", "126", "2<sup>24</sup> − 2 = 16,777,214", "Very large orgs"],
          ["B", "10", "128 – 191", "255.255.0.0 (/16)", "16,384", "2<sup>16</sup> − 2 = 65,534", "Medium/large"],
          ["C", "110", "192 – 223", "255.255.255.0 (/24)", "2,097,152", "2<sup>8</sup> − 2 = 254", "Small"],
          ["D", "1110", "224 – 239", "–", "–", "–", "Multicast"],
          ["E", "1111", "240 – 255", "–", "–", "–", "Experimental / reserved"]
        ] } },
        { ul: [
          "127.x.x.x is reserved for <b>loopback</b>, which is why Class A usable ends at 126.",
          "\"−2\" hosts: the all-zeros host part is the <b>network address</b> and all-ones is the <b>directed broadcast</b>.",
          "Problem: a company needing 300 hosts had to take a Class B (65k addresses) – massive waste, and routing tables exploded. Hence <b>CIDR</b>."
        ] },
        { tip: "Interviewers love \"Which class is 172.20.5.4? What is its default mask?\" – Class B, 255.255.0.0 (and it's also in the private range 172.16.0.0/12)." }
      ]
    },
    {
      id: "private-ip",
      q: "What are private IP addresses and other special/reserved addresses?",
      topic: "Network Layer & IP",
      level: 1,
      top: true,
      short: "Private ranges (RFC 1918) – 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 – are free to use inside any organisation but are not routed on the Internet, so they need NAT to reach it; other reserved blocks include 127.0.0.0/8 loopback and 169.254.0.0/16 link-local.",
      a: [
        { p: "<b>Private addresses</b> can be reused by every organisation because Internet routers drop them. Hosts using them reach the Internet through <b>NAT</b>. Public addresses are globally unique and allocated by IANA → RIRs (e.g. APNIC for India) → ISPs." },
        { table: { head: ["Range", "CIDR", "Size", "Purpose"], rows: [
          ["10.0.0.0 – 10.255.255.255", "10.0.0.0/8", "16.7 M", "Private (class A block) – large enterprises, cloud VPCs"],
          ["172.16.0.0 – 172.31.255.255", "172.16.0.0/12", "1 M", "Private (16 class B blocks) – Docker default bridge 172.17.0.0/16"],
          ["192.168.0.0 – 192.168.255.255", "192.168.0.0/16", "65 K", "Private (256 class C blocks) – home routers"],
          ["127.0.0.0/8", "–", "–", "<b>Loopback</b> (127.0.0.1 = localhost); never leaves the host"],
          ["169.254.0.0/16", "–", "–", "<b>APIPA / link-local</b> – self-assigned when DHCP fails"],
          ["100.64.0.0/10", "–", "–", "Carrier-grade NAT (ISP shared space)"],
          ["0.0.0.0", "–", "–", "\"This host\" / unspecified; in routing = default route 0.0.0.0/0; in bind() = all interfaces"],
          ["255.255.255.255", "–", "–", "Limited broadcast (not forwarded by routers)"],
          ["224.0.0.0/4", "–", "–", "Multicast (old class D)"]
        ] } },
        { tip: "If a PC shows <b>169.254.x.x</b>, the diagnosis is \"it couldn't reach a DHCP server\" – a very common practical follow-up." }
      ]
    },
    {
      id: "dhcp",
      q: "How does DHCP work? Explain the DORA process.",
      topic: "Network Layer & IP",
      level: 1,
      top: true,
      short: "DHCP automatically leases IP configuration to hosts in four steps – Discover (client broadcast), Offer (server proposes an IP), Request (client accepts one offer) and Acknowledge (server confirms the lease) – over UDP ports 67 (server) and 68 (client).",
      a: [
        { p: "<b>Dynamic Host Configuration Protocol</b> gives a host its IP address, subnet mask, default gateway, DNS servers and lease time without manual setup. It is an application-layer protocol over <b>UDP 67/68</b>, successor to BOOTP." },
        { svg: `<svg viewBox="0 0 600 270" width="600" class="dg">
  <rect class="box-a" x="60" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="120" y="27" text-anchor="middle" dominant-baseline="middle">Client (no IP)</text>
  <rect class="box-g" x="420" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="480" y="27" text-anchor="middle" dominant-baseline="middle">DHCP server</text>
  <line class="ln ln-d" x1="120" y1="44" x2="120" y2="262"/>
  <line class="ln ln-d" x1="480" y1="44" x2="480" y2="262"/>
  <line class="ln-a" x1="120" y1="80" x2="476" y2="80" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="300" y="72" text-anchor="middle">1. DHCPDISCOVER (broadcast)</text>
  <text class="tx-m" x="300" y="94" text-anchor="middle">0.0.0.0:68 → 255.255.255.255:67</text>
  <line class="ln" x1="480" y1="130" x2="124" y2="130" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="300" y="122" text-anchor="middle">2. DHCPOFFER</text>
  <text class="tx-m" x="300" y="144" text-anchor="middle">offer 192.168.1.50, mask, gateway, DNS, lease</text>
  <line class="ln-a" x1="120" y1="180" x2="476" y2="180" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="300" y="172" text-anchor="middle">3. DHCPREQUEST (broadcast)</text>
  <text class="tx-m" x="300" y="194" text-anchor="middle">"I take 192.168.1.50 from server S"</text>
  <line class="ln" x1="480" y1="230" x2="124" y2="230" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="300" y="222" text-anchor="middle">4. DHCPACK</text>
  <text class="tx-m" x="300" y="244" text-anchor="middle">lease confirmed – client configures interface</text>
</svg>`, caption: "DHCP DORA exchange" },
        { ul: [
          "<b>Why is Request broadcast?</b> Several servers may have made offers; the broadcast tells the others their offers are declined.",
          "Before using the address the client may send an ARP probe/gratuitous ARP to check for conflicts (else DHCPDECLINE).",
          "<b>Lease renewal</b>: at T1 = 50% of the lease the client unicasts a Request to its server; at T2 = 87.5% it broadcasts to any server.",
          "Other messages: DHCPNAK (refuse), DHCPRELEASE (give back), DHCPINFORM.",
          "<b>DHCP relay agent</b> (<code>ip helper-address</code>) forwards broadcasts across routers so one server can serve many subnets."
        ] },
        { warn: "Rogue DHCP servers can hand out a malicious gateway/DNS (MITM). Switches mitigate with <b>DHCP snooping</b> (only trusted ports may send Offers/ACKs)." }
      ]
    },
    {
      id: "ipv4-header",
      q: "Describe the important fields of the IPv4 header.",
      topic: "Network Layer & IP",
      level: 2,
      top: false,
      short: "The IPv4 header (20–60 bytes) carries version, header length, DSCP/ECN, total length, identification/flags/fragment offset for fragmentation, TTL, protocol (TCP=6, UDP=17, ICMP=1), header checksum, and source and destination addresses.",
      a: [
        { code: ` 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-------+-------+---------------+-------------------------------+
|Version|  IHL  |   DSCP/ECN    |          Total Length         |
+-------+-------+---------------+-----+-------------------------+
|        Identification         |Flags|     Fragment Offset     |
+---------------+---------------+-----+-------------------------+
|      TTL      |   Protocol    |        Header Checksum        |
+---------------+---------------+-------------------------------+
|                       Source IP Address                       |
+---------------------------------------------------------------+
|                    Destination IP Address                     |
+---------------------------------------------------------------+
|                    Options (0-40 bytes)                       |`, lang: "text", title: "IPv4 header (RFC 791)" },
        { table: { head: ["Field", "Bits", "Purpose"], rows: [
          ["Version", "4", "4 for IPv4"],
          ["IHL", "4", "Header length in 32-bit words (5 = 20 bytes, max 15 = 60 bytes)"],
          ["DSCP / ECN", "6 + 2", "QoS class; Explicit Congestion Notification"],
          ["Total Length", "16", "Header + data in bytes (max 65,535)"],
          ["Identification", "16", "Same value on all fragments of one datagram"],
          ["Flags", "3", "Reserved, <b>DF</b> (don't fragment), <b>MF</b> (more fragments)"],
          ["Fragment Offset", "13", "Position of fragment in units of 8 bytes"],
          ["TTL", "8", "Decremented per hop; packet dropped at 0 → ICMP Time Exceeded (prevents loops)"],
          ["Protocol", "8", "Upper-layer protocol: 1 ICMP, 6 TCP, 17 UDP, 89 OSPF"],
          ["Header Checksum", "16", "Covers header only; recomputed at every hop (TTL changes)"],
          ["Source / Destination", "32 + 32", "IPv4 addresses"]
        ] } },
        { tip: "Common quick-fire: \"Which field prevents infinite loops?\" – TTL. \"Why is the checksum recomputed at each router?\" – because TTL changes." }
      ]
    },
    {
      id: "subnetting",
      q: "What is subnetting? Split 192.168.10.0/24 into 4 subnets.",
      topic: "Network Layer & IP",
      level: 2,
      top: true,
      short: "Subnetting borrows host bits to divide one network into smaller networks. Borrowing 2 bits from a /24 gives four /26 subnets of 64 addresses (62 usable hosts) each: .0, .64, .128 and .192.",
      a: [
        { p: "<b>Subnetting</b> divides an IP network into smaller logical networks by extending the mask (borrowing bits from the host part). Benefits: smaller broadcast domains, less address waste, security boundaries, and route organisation." },
        { h: "Formulas" },
        { ul: [
          "Borrow <b>n</b> bits → <b>2<sup>n</sup></b> subnets.",
          "Remaining <b>h</b> host bits → <b>2<sup>h</sup> − 2</b> usable hosts (network + broadcast reserved).",
          "Block size (increment) = 256 − value of the interesting mask octet."
        ] },
        { h: "Worked example: 192.168.10.0/24 → 4 subnets" },
        { ol: [
          "Need 4 subnets → 2<sup>2</sup> = 4 → borrow 2 bits → new prefix <b>/26</b>.",
          "Mask = 11111111.11111111.11111111.<b>11</b>000000 = <b>255.255.255.192</b>.",
          "Block size = 256 − 192 = <b>64</b>; host bits = 6 → 64 − 2 = <b>62 usable hosts</b> per subnet."
        ] },
        { svg: `<svg viewBox="0 0 640 170" width="640" class="dg">
  <rect class="box-a" x="10" y="10" width="620" height="36" rx="6"/>
  <text class="tx tx-b" x="320" y="28" text-anchor="middle" dominant-baseline="middle">192.168.10.0/24  –  256 addresses, mask 255.255.255.0</text>
  <line class="ln" x1="86" y1="46" x2="86" y2="72" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="242" y1="46" x2="242" y2="72" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="398" y1="46" x2="398" y2="72" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="554" y1="46" x2="554" y2="72" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="10" y="76" width="152" height="84" rx="6"/>
  <text class="tx tx-b" x="86" y="94" text-anchor="middle">Subnet 1  /26</text>
  <text class="tx-c" x="86" y="114" text-anchor="middle">net   .0</text>
  <text class="tx-c" x="86" y="130" text-anchor="middle">hosts .1 – .62</text>
  <text class="tx-c" x="86" y="146" text-anchor="middle">bcast .63</text>
  <rect class="box-p" x="166" y="76" width="152" height="84" rx="6"/>
  <text class="tx tx-b" x="242" y="94" text-anchor="middle">Subnet 2  /26</text>
  <text class="tx-c" x="242" y="114" text-anchor="middle">net   .64</text>
  <text class="tx-c" x="242" y="130" text-anchor="middle">hosts .65 – .126</text>
  <text class="tx-c" x="242" y="146" text-anchor="middle">bcast .127</text>
  <rect class="box-w" x="322" y="76" width="152" height="84" rx="6"/>
  <text class="tx tx-b" x="398" y="94" text-anchor="middle">Subnet 3  /26</text>
  <text class="tx-c" x="398" y="114" text-anchor="middle">net   .128</text>
  <text class="tx-c" x="398" y="130" text-anchor="middle">hosts .129 – .190</text>
  <text class="tx-c" x="398" y="146" text-anchor="middle">bcast .191</text>
  <rect class="box" x="478" y="76" width="152" height="84" rx="6"/>
  <text class="tx tx-b" x="554" y="94" text-anchor="middle">Subnet 4  /26</text>
  <text class="tx-c" x="554" y="114" text-anchor="middle">net   .192</text>
  <text class="tx-c" x="554" y="130" text-anchor="middle">hosts .193 – .254</text>
  <text class="tx-c" x="554" y="146" text-anchor="middle">bcast .255</text>
</svg>`, caption: "A /24 split into four /26 subnets (block size 64)" },
        { h: "Reverse question: which subnet is 192.168.10.150/26 in?" },
        { p: "Block size 64 → multiples 0, 64, 128, 192. 150 lies in [128, 191] → network <b>192.168.10.128</b>, broadcast <b>192.168.10.191</b>, usable .129–.190. (Equivalently: 150 AND 192 = 128.)" },
        { tip: "Also practise <b>VLSM</b>: allocate the biggest requirement first, e.g. from a /24 give 100 hosts a /25, 50 hosts a /26, 20 hosts a /27, and point-to-point links a /30 (or /31)." },
        { warn: "Don't forget the −2. A /30 has 4 addresses but only 2 usable hosts – exactly right for a router-to-router link." }
      ]
    },
    {
      id: "cidr",
      q: "What is CIDR and supernetting (route aggregation)?",
      topic: "Network Layer & IP",
      level: 2,
      top: true,
      short: "CIDR (Classless Inter-Domain Routing) drops fixed classes and writes addresses as prefix/length (e.g. 10.1.0.0/20), allowing any-size blocks and aggregating contiguous networks into one route (supernetting) to shrink routing tables.",
      a: [
        { p: "<b>CIDR</b> (RFC 1519, 1993) replaced classful addressing. The network/host boundary can fall on <i>any</i> bit and is written as a <b>prefix length</b>: <code>a.b.c.d/n</code>, where n = number of network bits. It slowed IPv4 exhaustion and enabled <b>route aggregation</b>." },
        { table: { head: ["Prefix", "Mask", "Addresses", "Usable hosts"], rows: [
          ["/8", "255.0.0.0", "16,777,216", "16,777,214"],
          ["/16", "255.255.0.0", "65,536", "65,534"],
          ["/22", "255.255.252.0", "1,024", "1,022"],
          ["/24", "255.255.255.0", "256", "254"],
          ["/26", "255.255.255.192", "64", "62"],
          ["/28", "255.255.255.240", "16", "14"],
          ["/30", "255.255.255.252", "4", "2"],
          ["/32", "255.255.255.255", "1", "single host route"]
        ] } },
        { h: "Supernetting example" },
        { code: `200.1.0.0/24  = 11001000.00000001.000000|00.xxxxxxxx
200.1.1.0/24  = 11001000.00000001.000000|01.xxxxxxxx
200.1.2.0/24  = 11001000.00000001.000000|10.xxxxxxxx
200.1.3.0/24  = 11001000.00000001.000000|11.xxxxxxxx
                 common prefix = 22 bits
=> advertise ONE route: 200.1.0.0/22`, lang: "text", title: "Aggregating four /24s into a /22" },
        { ul: [
          "Rules for aggregation: blocks must be <b>contiguous</b>, a power-of-2 in count, and the first network must be divisible by the block size.",
          "Routers choose among overlapping CIDR routes with <b>longest prefix match</b>."
        ] },
        { tip: "Quick check: number of addresses in a /n = 2<sup>32−n</sup>." }
      ]
    },
    {
      id: "nat",
      q: "What is NAT and how does PAT (NAT overload) work?",
      topic: "Network Layer & IP",
      level: 2,
      top: true,
      short: "NAT rewrites private source IPs to a public IP at the network edge; PAT (port address translation) also rewrites source ports so thousands of internal hosts can share one public IP, tracking each flow in a translation table.",
      a: [
        { p: "<b>Network Address Translation</b> runs on the edge router/firewall. For outbound packets it replaces the private source address (and with PAT, the port) with a public one, records the mapping, and applies the reverse translation to replies." },
        { svg: `<svg viewBox="0 0 680 215" width="680" class="dg">
  <rect class="box" x="10" y="25" width="150" height="44" rx="6"/>
  <text class="tx tx-b" x="85" y="41" text-anchor="middle">PC A</text>
  <text class="tx-c" x="85" y="58" text-anchor="middle">192.168.1.10:5000</text>
  <rect class="box" x="10" y="95" width="150" height="44" rx="6"/>
  <text class="tx tx-b" x="85" y="111" text-anchor="middle">PC B</text>
  <text class="tx-c" x="85" y="128" text-anchor="middle">192.168.1.11:5000</text>
  <line class="ln" x1="160" y1="47" x2="256" y2="72" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="160" y1="117" x2="256" y2="96" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="260" y="52" width="150" height="64" rx="6"/>
  <text class="tx tx-b" x="335" y="70" text-anchor="middle">NAT router</text>
  <text class="tx-c" x="335" y="88" text-anchor="middle">in  192.168.1.1</text>
  <text class="tx-c" x="335" y="104" text-anchor="middle">out 203.0.113.5</text>
  <line class="ln-a" x1="410" y1="84" x2="526" y2="84" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="468" y="74" text-anchor="middle">src rewritten</text>
  <rect class="box-g" x="530" y="52" width="140" height="64" rx="6"/>
  <text class="tx tx-b" x="600" y="76" text-anchor="middle">Web server</text>
  <text class="tx-c" x="600" y="96" text-anchor="middle">93.184.216.34:443</text>
  <text class="tx-m" x="20" y="16">Private LAN</text>
  <text class="tx-m" x="660" y="16" text-anchor="end">Internet</text>
  <rect class="box-w" x="170" y="140" width="340" height="68" rx="6"/>
  <text class="tx tx-b" x="340" y="157" text-anchor="middle">PAT translation table</text>
  <text class="tx-c" x="340" y="178" text-anchor="middle">192.168.1.10:5000 ↔ 203.0.113.5:40001</text>
  <text class="tx-c" x="340" y="197" text-anchor="middle">192.168.1.11:5000 ↔ 203.0.113.5:40002</text>
</svg>`, caption: "PAT: two private hosts share one public IP, distinguished by translated ports" },
        { table: { head: ["Type", "Mapping", "Use"], rows: [
          ["<b>Static NAT</b>", "1 private ↔ 1 public, permanent", "Expose an internal server"],
          ["<b>Dynamic NAT</b>", "Private → any free address from a public pool", "Rare today"],
          ["<b>PAT / NAPT / NAT overload</b>", "Many private → 1 public, distinguished by port", "Every home router, CGNAT at ISPs"],
          ["<b>Port forwarding (DNAT)</b>", "Public IP:port → specific internal host:port", "Hosting a game/web server at home"]
        ] } },
        { ul: [
          "<b>Pros</b>: conserves IPv4 addresses; hides internal topology; acts as an implicit inbound filter.",
          "<b>Cons</b>: breaks end-to-end connectivity (inbound connections, P2P need STUN/TURN/hole punching); breaks protocols carrying IPs in payload (FTP active, SIP) without ALGs; state on the router; complicates logging/attribution."
        ] },
        { warn: "NAT is <b>not</b> a firewall, even though it blocks unsolicited inbound traffic as a side effect. And IPv6 is designed to make NAT unnecessary." }
      ]
    },
    {
      id: "icmp-ping-traceroute",
      q: "What is ICMP? How do ping and traceroute work?",
      topic: "Network Layer & IP",
      level: 2,
      top: true,
      short: "ICMP is IP's companion protocol for error reporting and diagnostics. Ping sends ICMP Echo Requests and times the Echo Replies; traceroute sends probes with TTL = 1, 2, 3 … so each router on the path returns an ICMP Time Exceeded, revealing the hops.",
      a: [
        { p: "<b>ICMP (Internet Control Message Protocol)</b> is carried directly inside IP (protocol number 1) and is used by routers and hosts to report errors and send control/diagnostic messages. It has no ports." },
        { table: { head: ["Type", "Message", "Used by / when"], rows: [
          ["0", "Echo Reply", "Response to ping"],
          ["3", "Destination Unreachable (codes: net, host, <b>port</b>, <b>fragmentation needed + DF set</b>)", "No route, closed UDP port, Path MTU discovery"],
          ["5", "Redirect", "Router tells host of a better first hop"],
          ["8", "Echo Request", "ping"],
          ["11", "Time Exceeded", "TTL reached 0 – traceroute"]
        ] } },
        { h: "ping" },
        { p: "Sends ICMP Echo Request (type 8) and waits for Echo Reply (type 0). Reports <b>reachability, RTT (min/avg/max), packet loss</b> and the TTL of replies (hinting at the remote OS: 64 Linux, 128 Windows)." },
        { h: "traceroute / tracert" },
        { ol: [
          "Send a probe with TTL = 1. The first router decrements it to 0, drops it and returns <b>ICMP Time Exceeded</b> – its source IP is hop 1.",
          "Repeat with TTL = 2, 3, … (usually 3 probes per hop to measure RTT).",
          "Stop when the destination answers: Linux traceroute sends <b>UDP to high ports</b> (33434+) → destination returns <b>Port Unreachable</b>; Windows tracert sends <b>ICMP Echo</b> → Echo Reply."
        ] },
        { code: `$ traceroute google.com
 1  192.168.1.1     1.2 ms   1.0 ms   1.1 ms
 2  10.10.0.1       6.8 ms   7.1 ms   6.9 ms
 3  * * *
 4  142.250.160.1  14.9 ms  15.2 ms  14.7 ms
 5  142.250.193.78 15.0 ms  15.3 ms  15.1 ms`, lang: "bash", title: "\"* * *\" = that hop didn't answer (ICMP filtered), not necessarily a failure" },
        { warn: "A failing ping doesn't prove the host is down – many firewalls/cloud security groups block ICMP. Blocking <i>all</i> ICMP also breaks Path MTU discovery (\"black-hole\" connections)." }
      ]
    },
    {
      id: "mtu-fragmentation",
      q: "What is MTU? How does IP fragmentation work?",
      topic: "Network Layer & IP",
      level: 3,
      top: false,
      short: "MTU is the largest payload a link can carry in one frame (1500 bytes on Ethernet). If an IPv4 packet exceeds the next link's MTU, it is split into fragments sharing the same ID, with offsets in 8-byte units and the MF flag set on all but the last; only the destination reassembles.",
      a: [
        { p: "<b>MTU (Maximum Transmission Unit)</b> is the maximum size of the network-layer packet a link can carry: 1500 B for Ethernet, 9000 B jumbo frames, 1280 B minimum for IPv6. The TCP <b>MSS</b> = MTU − IP header − TCP header = 1500 − 20 − 20 = <b>1460</b> bytes." },
        { h: "Fragmentation example" },
        { p: "A 4000-byte IPv4 datagram (20 header + 3980 data) must cross a link with MTU 1500. Each fragment carries at most 1480 data bytes (a multiple of 8)." },
        { table: { head: ["Fragment", "Data bytes", "Total length", "Offset (÷8)", "MF"], rows: [
          ["1", "1480 (bytes 0–1479)", "1500", "0", "1"],
          ["2", "1480 (bytes 1480–2959)", "1500", "185", "1"],
          ["3", "1020 (bytes 2960–3979)", "1040", "370", "0"]
        ] } },
        { ul: [
          "All fragments carry the same <b>Identification</b>; the destination reassembles using ID + offset + MF.",
          "Losing any one fragment means the whole datagram is lost – fragmentation hurts performance and is used in attacks (teardrop, fragment overlap).",
          "<b>Path MTU Discovery</b>: send with <b>DF = 1</b>; a router that can't forward returns ICMP \"Fragmentation Needed\" with its MTU; the sender lowers its packet size.",
          "<b>IPv6</b>: routers never fragment; only the source may, using a Fragment extension header, after PMTUD."
        ] },
        { tip: "Offsets are in 8-byte units because the offset field is only 13 bits (13 bits × 8 = 65,528 bytes max)." }
      ]
    },

    /* ===================== Routing ===================== */
    {
      id: "static-vs-dynamic-routing",
      q: "What is routing? Compare static and dynamic routing.",
      topic: "Routing",
      level: 1,
      top: true,
      short: "Routing is choosing the path a packet takes to its destination network. Static routes are configured manually – simple and secure but don't adapt; dynamic routing protocols (RIP, OSPF, BGP) let routers exchange information and recompute paths automatically when topology changes.",
      a: [
        { p: "<b>Routing</b> = building the routing table (control plane). <b>Forwarding</b> = looking up each packet's destination in that table and sending it out an interface (data plane). A routing table entry is essentially <code>destination prefix → next hop, interface, metric</code>." },
        { code: `$ ip route
default via 192.168.1.1 dev wlan0 proto dhcp metric 600
10.8.0.0/24 via 10.8.0.1 dev tun0
192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.42`, lang: "bash", title: "A Linux host routing table" },
        { table: { head: ["Aspect", "Static routing", "Dynamic routing"], rows: [
          ["Configuration", "Admin types each route", "Protocol learns routes automatically"],
          ["Adapts to failures", "No (unless floating static backup)", "Yes – reconverges"],
          ["Overhead", "No CPU/bandwidth for updates", "Periodic/triggered updates, CPU for algorithms"],
          ["Security", "Predictable, nothing advertised", "Must authenticate neighbours"],
          ["Scalability", "Poor for large networks", "Good"],
          ["Typical use", "Small networks, stub networks, default route to ISP", "Enterprise (OSPF), ISP/Internet (BGP)"]
        ] } },
        { p: "<b>Default route</b> (0.0.0.0/0) is a special static route: \"anything I don't know, send here\" – every home router points one at the ISP." },
        { tip: "Mention <b>administrative distance</b>: when two sources offer the same prefix, the router prefers the more trusted one (Cisco: connected 0, static 1, eBGP 20, OSPF 110, RIP 120)." }
      ]
    },
    {
      id: "distance-vector-vs-link-state",
      q: "Distance vector vs link state routing – how do they differ?",
      topic: "Routing",
      level: 2,
      top: true,
      short: "Distance-vector routers (RIP) periodically share their whole distance table only with neighbours and use Bellman-Ford – simple but slow to converge and prone to count-to-infinity; link-state routers (OSPF, IS-IS) flood link information to all routers, each builds the full topology map and runs Dijkstra – fast, loop-free convergence at higher CPU/memory cost.",
      a: [
        { p: "Both are families of <b>interior gateway protocols</b>. The difference is <i>what</i> is shared and <i>with whom</i>: \"tell your neighbours about the whole world\" (distance vector) vs \"tell the whole world about your neighbours\" (link state)." },
        { table: { head: ["Aspect", "Distance Vector", "Link State"], rows: [
          ["Knowledge", "Only distances + next hop (\"routing by rumour\")", "Complete topology map (LSDB)"],
          ["Shares", "Entire routing table", "Only its own links (LSAs)"],
          ["With whom", "Directly connected neighbours", "All routers in the area (flooding)"],
          ["When", "Periodically (RIP every 30 s)", "On change (+ periodic refresh 30 min)"],
          ["Algorithm", "Bellman-Ford", "Dijkstra's SPF"],
          ["Convergence", "Slow", "Fast"],
          ["Loops", "Count-to-infinity possible", "Loop-free once converged"],
          ["Resources", "Low CPU/memory", "Higher CPU/memory"],
          ["Metric", "Hop count (RIP, max 15)", "Cost (OSPF: reference BW / link BW)"],
          ["Examples", "RIP v1/v2, IGRP (EIGRP is advanced DV)", "OSPF, IS-IS"]
        ] } },
        { p: "<b>Path vector</b> (BGP) is a third style: like DV it talks to neighbours, but advertises the full AS path, which prevents loops and enables policy-based routing between autonomous systems." },
        { tip: "Link the answer to algorithms: DV = distributed Bellman-Ford, D<sub>x</sub>(y) = min<sub>v</sub>{ c(x,v) + D<sub>v</sub>(y) }; LS = each router runs Dijkstra locally on the flooded graph." }
      ]
    },
    {
      id: "rip-ospf-bgp",
      q: "Compare RIP, OSPF and BGP. What are IGP and EGP?",
      topic: "Routing",
      level: 3,
      top: false,
      short: "IGPs (RIP, OSPF, EIGRP, IS-IS) route inside one autonomous system and optimise a metric; the EGP BGP routes between autonomous systems based on policy. RIP is hop-count distance vector over UDP 520; OSPF is link-state over IP protocol 89 with areas; BGP is path-vector over TCP 179 and runs the Internet.",
      a: [
        { p: "An <b>Autonomous System (AS)</b> is a network under one administrative control with a unique ASN (e.g. an ISP, Google AS15169). <b>IGP</b> = routing within an AS; <b>EGP</b> = routing between ASes." },
        { table: { head: ["", "RIP", "OSPF", "BGP"], rows: [
          ["Class", "IGP, distance vector", "IGP, link state", "EGP, path vector"],
          ["Algorithm", "Bellman-Ford", "Dijkstra SPF", "Best-path selection by attributes"],
          ["Metric", "Hop count (max 15; 16 = unreachable)", "Cost based on bandwidth", "Policy: LOCAL_PREF, AS_PATH length, MED…"],
          ["Transport", "UDP 520", "Directly on IP (protocol 89)", "TCP 179"],
          ["Updates", "Full table every 30 s", "LSAs on change; Hello every 10 s", "Incremental on change; keepalives"],
          ["Scale", "Small networks", "Large enterprises; hierarchical <b>areas</b> with backbone area 0", "Whole Internet (~1M prefixes)"],
          ["Convergence", "Slow", "Fast", "Slow but stable"],
          ["VLSM / CIDR", "RIPv2 yes (v1 classful)", "Yes", "Yes"]
        ] } },
        { ul: [
          "<b>iBGP</b> runs between routers of the same AS, <b>eBGP</b> between different ASes.",
          "BGP is why a misconfiguration at one ISP can take down large parts of the Internet (route leaks, BGP hijacks – e.g. the 2021 Facebook outage withdrew its own routes)."
        ] },
        { tip: "One-liner for BGP: \"OSPF finds the <i>shortest</i> path; BGP finds the path that business <i>policy</i> prefers.\"" }
      ]
    },
    {
      id: "count-to-infinity",
      q: "What is the count-to-infinity problem and how is it solved?",
      topic: "Routing",
      level: 3,
      top: false,
      short: "In distance-vector routing, after a link fails, neighbours keep advertising stale routes to each other and increment the metric slowly towards infinity, causing loops; fixes include a small infinity (RIP: 16), split horizon, poison reverse, triggered updates and hold-down timers.",
      a: [
        { p: "Distance-vector routers only know what neighbours tell them, so <b>bad news travels slowly</b> while good news travels fast." },
        { h: "Example" },
        { p: "Chain A — B — C. B reaches A at cost 1, C reaches A at cost 2 (via B). The A–B link fails. B no longer has a direct path, but C's table says \"A at cost 2\", so B believes A is reachable via C at cost 3. C then updates to 4 via B, B to 5 via C … packets for A bounce between B and C until the metric hits <b>infinity</b>." },
        { table: { head: ["Fix", "How it helps"], rows: [
          ["<b>Define infinity small</b>", "RIP: 16 hops = unreachable, bounding the count"],
          ["<b>Split horizon</b>", "Never advertise a route back out the interface you learned it on"],
          ["<b>Poison reverse</b>", "Advertise it back with metric = infinity (explicit \"don't use me\")"],
          ["<b>Triggered updates</b>", "Send updates immediately on change rather than waiting 30 s"],
          ["<b>Hold-down timers</b>", "Ignore worse-metric updates for a route recently marked down"]
        ] } },
        { warn: "Split horizon / poison reverse fix two-node loops but <b>not</b> loops involving three or more routers – hold-down timers or moving to link-state/EIGRP (DUAL) is needed." }
      ]
    },
    {
      id: "longest-prefix-match",
      q: "How does a router forward a packet? What is longest prefix match?",
      topic: "Routing",
      level: 3,
      top: false,
      short: "For each packet the router finds every routing-table entry whose prefix matches the destination address and picks the most specific one (longest prefix); it then decrements TTL, recomputes the checksum and re-frames the packet for the outgoing interface's next hop.",
      a: [
        { p: "With CIDR, several routes can match the same address. The router must choose the <b>most specific</b> – the entry with the <b>longest prefix length</b>." },
        { code: `Routing table
  0.0.0.0/0        -> ISP     (default)
  10.0.0.0/8       -> R1
  10.1.0.0/16      -> R2
  10.1.2.0/24      -> R3

Destination 10.1.2.7  -> matches /0, /8, /16, /24 -> choose /24 -> R3
Destination 10.1.9.9  -> matches /0, /8, /16      -> R2
Destination 10.200.0.1 -> matches /0, /8          -> R1
Destination 8.8.8.8   -> matches only /0          -> ISP`, lang: "text", title: "Longest prefix match" },
        { ol: [
          "Receive frame, check FCS, strip L2 header.",
          "Validate IP header; decrement <b>TTL</b> (drop + ICMP Time Exceeded if 0); update header checksum.",
          "Longest-prefix-match lookup → next-hop IP and exit interface.",
          "ARP (or cache) for the next hop's MAC; build a new frame; transmit (fragment if needed and allowed)."
        ] },
        { tip: "Real routers do LPM in hardware using <b>TCAM</b> or trie structures (Patricia/binary tries) – a nice link to DSA if the interviewer is a coder." }
      ]
    },

    /* ===================== Transport Layer ===================== */
    {
      id: "tcp-vs-udp",
      q: "What is the difference between TCP and UDP? When would you use each?",
      topic: "Transport Layer",
      level: 1,
      top: true,
      short: "TCP is connection-oriented, reliable, ordered and flow/congestion controlled byte-stream transport (web, email, file transfer); UDP is connectionless, best-effort, message-oriented with an 8-byte header and no guarantees – faster and lighter (DNS, streaming, gaming, VoIP, QUIC).",
      a: [
        { p: "Both provide <b>process-to-process</b> delivery using port numbers on top of IP. TCP adds a lot of machinery to turn IP's unreliable service into a reliable stream; UDP adds almost nothing beyond ports and a checksum." },
        { table: { head: ["Feature", "TCP", "UDP"], rows: [
          ["Connection", "Connection-oriented (3-way handshake)", "Connectionless"],
          ["Reliability", "Guaranteed delivery via ACKs + retransmission", "Best effort – may lose packets"],
          ["Ordering", "In-order delivery (sequence numbers)", "No ordering"],
          ["Data unit", "Byte stream (no message boundaries)", "Datagrams (boundaries preserved)"],
          ["Flow / congestion control", "Yes (rwnd, cwnd)", "No"],
          ["Header", "20–60 bytes", "8 bytes"],
          ["Speed / latency", "Slower (handshake, retransmits, HOL blocking)", "Faster, lower latency"],
          ["Broadcast / multicast", "No (unicast only)", "Yes"],
          ["Use cases", "HTTP/1.1, HTTP/2, SMTP, SSH, FTP, DB connections", "DNS, DHCP, VoIP, video calls, online games, streaming, SNMP, <b>QUIC/HTTP/3</b>"]
        ] } },
        { tip: "Good closing line: \"Use UDP when <b>late data is useless</b> (a video frame or game update that arrives late is worthless) or when the application wants to implement its own reliability – as QUIC does.\"" },
        { warn: "Don't say UDP is \"unreliable so never used for important data\" – DNS is critical and uses UDP; reliability is simply handled by the application (retry on timeout)." }
      ]
    },
    {
      id: "ports-well-known",
      q: "What is a port number? List important well-known ports.",
      topic: "Transport Layer",
      level: 1,
      top: true,
      short: "A port is a 16-bit number (0–65535) that identifies a specific process/service on a host, so the transport layer can deliver data to the right application; well-known ports 0–1023 are reserved for standard services such as HTTP 80, HTTPS 443, SSH 22 and DNS 53.",
      a: [
        { p: "An IP address identifies the <b>host</b>; a <b>port</b> identifies the <b>application</b> on it. Together (IP, port) form a socket address. Port ranges:" },
        { ul: [
          "<b>0–1023</b> well-known (system) ports – need root/admin to bind on Unix.",
          "<b>1024–49151</b> registered ports (e.g. MySQL 3306, PostgreSQL 5432, Redis 6379).",
          "<b>49152–65535</b> dynamic/ephemeral ports – chosen by the OS for the client side of connections."
        ] },
        { table: { head: ["Port", "Protocol", "Transport", "Service"], rows: [
          ["20 / 21", "FTP", "TCP", "File transfer (data / control)"],
          ["22", "SSH / SFTP / SCP", "TCP", "Secure remote shell and file copy"],
          ["23", "Telnet", "TCP", "Unencrypted remote shell"],
          ["25", "SMTP", "TCP", "Mail relay (587 submission, 465 SMTPS)"],
          ["53", "DNS", "UDP + TCP", "Name resolution (TCP for zone transfers / large replies)"],
          ["67 / 68", "DHCP", "UDP", "Server / client"],
          ["80", "HTTP", "TCP", "Web"],
          ["110 / 995", "POP3 / POP3S", "TCP", "Mail retrieval"],
          ["123", "NTP", "UDP", "Time sync"],
          ["143 / 993", "IMAP / IMAPS", "TCP", "Mail access"],
          ["161 / 162", "SNMP", "UDP", "Monitoring / traps"],
          ["443", "HTTPS (and HTTP/3 on UDP)", "TCP / UDP", "Secure web"],
          ["3306 / 5432 / 6379 / 27017", "MySQL / PostgreSQL / Redis / MongoDB", "TCP", "Databases"],
          ["3389", "RDP", "TCP", "Windows remote desktop"]
        ] } },
        { tip: "A TCP connection is uniquely identified by the <b>5-tuple</b> (protocol, src IP, src port, dst IP, dst port) – that's how one server port 443 can serve thousands of clients at once." }
      ]
    },
    {
      id: "tcp-3-way-handshake",
      q: "Explain the TCP 3-way handshake. Why three messages and not two?",
      topic: "Transport Layer",
      level: 1,
      top: true,
      short: "Client sends SYN with its initial sequence number x; server replies SYN-ACK with its own ISN y and ack = x+1; client sends ACK = y+1. Three messages are the minimum for both sides to announce their ISNs and confirm the other side received them, and to reject stale duplicate SYNs.",
      a: [
        { p: "TCP is connection-oriented: before data flows both ends must agree on initial sequence numbers (ISNs), and exchange options like MSS, window scaling, SACK-permitted and timestamps." },
        { svg: `<svg viewBox="0 0 600 250" width="600" class="dg">
  <rect class="box-a" x="60" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="120" y="27" text-anchor="middle" dominant-baseline="middle">Client</text>
  <rect class="box-g" x="420" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="480" y="27" text-anchor="middle" dominant-baseline="middle">Server</text>
  <line class="ln ln-d" x1="120" y1="44" x2="120" y2="240"/>
  <line class="ln ln-d" x1="480" y1="44" x2="480" y2="240"/>
  <line class="ln-a" x1="120" y1="70" x2="476" y2="100" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="300" y="74" text-anchor="middle">SYN, seq = x</text>
  <line class="ln" x1="480" y1="120" x2="124" y2="150" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="300" y="126" text-anchor="middle">SYN + ACK, seq = y, ack = x + 1</text>
  <line class="ln-a" x1="120" y1="170" x2="476" y2="200" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="300" y="176" text-anchor="middle">ACK, seq = x + 1, ack = y + 1</text>
  <text class="tx-c" x="112" y="74" text-anchor="end">SYN_SENT</text>
  <text class="tx-c" x="112" y="174" text-anchor="end">ESTABLISHED</text>
  <text class="tx-c" x="488" y="60">LISTEN</text>
  <text class="tx-c" x="488" y="124">SYN_RCVD</text>
  <text class="tx-c" x="488" y="204">ESTABLISHED</text>
  <text class="tx-m" x="300" y="232" text-anchor="middle">data can now flow both ways (the ACK may already carry data)</text>
</svg>`, caption: "TCP connection establishment with socket states" },
        { ol: [
          "<b>SYN</b>: client picks a random ISN x, sends SYN (consumes one sequence number). State SYN_SENT.",
          "<b>SYN-ACK</b>: server allocates state, picks ISN y, acknowledges x + 1. State SYN_RCVD.",
          "<b>ACK</b>: client acknowledges y + 1. Both sides ESTABLISHED; <code>accept()</code> returns on the server."
        ] },
        { h: "Why not two?" },
        { ul: [
          "Each side must send its own ISN <b>and</b> learn that the other received it – that's two SYNs and two ACKs; the middle SYN and ACK are piggybacked, giving 3.",
          "With 2 messages, a delayed <b>stale SYN</b> from an old connection would make the server open a half-dead connection and waste resources; the third message lets the client reject it (with RST)."
        ] },
        { tip: "Why random ISNs? To avoid confusion with segments from previous incarnations of the same 5-tuple and to prevent <b>sequence-number prediction / hijacking</b> attacks. Mention the handshake costs <b>1 RTT</b> before data – which is why TLS 1.3 (1-RTT) and QUIC (0/1-RTT) matter." },
        { warn: "Attackers abuse step 2 with a <b>SYN flood</b>: many SYNs from spoofed IPs fill the server's half-open (SYN backlog) queue. Defence: SYN cookies." }
      ]
    },
    {
      id: "tcp-connection-termination",
      q: "How is a TCP connection terminated? What is TIME_WAIT?",
      topic: "Transport Layer",
      level: 2,
      top: true,
      short: "Termination uses a 4-way handshake because each direction closes independently: FIN → ACK from one side, later FIN → ACK from the other. The side that closes first waits in TIME_WAIT for 2×MSL so its final ACK can be retransmitted and old delayed segments die out.",
      a: [
        { p: "TCP is full-duplex, so each direction is shut down separately (<b>half-close</b>). The side that calls <code>close()</code> first is the <i>active closer</i>." },
        { svg: `<svg viewBox="0 0 600 330" width="600" class="dg">
  <rect class="box-a" x="60" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="120" y="27" text-anchor="middle" dominant-baseline="middle">Client (active)</text>
  <rect class="box-g" x="420" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="480" y="27" text-anchor="middle" dominant-baseline="middle">Server (passive)</text>
  <line class="ln ln-d" x1="120" y1="44" x2="120" y2="318"/>
  <line class="ln ln-d" x1="480" y1="44" x2="480" y2="318"/>
  <line class="ln-a" x1="120" y1="70" x2="476" y2="95" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="300" y="74" text-anchor="middle">FIN, seq = u</text>
  <line class="ln" x1="480" y1="110" x2="124" y2="135" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="300" y="114" text-anchor="middle">ACK, ack = u + 1</text>
  <text class="tx-m" x="300" y="163" text-anchor="middle">server may still send data (half-close)</text>
  <line class="ln" x1="480" y1="185" x2="124" y2="210" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="300" y="189" text-anchor="middle">FIN, seq = w</text>
  <line class="ln-a" x1="120" y1="230" x2="476" y2="255" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="300" y="234" text-anchor="middle">ACK, ack = w + 1</text>
  <rect class="box-w" x="114" y="214" width="12" height="80" rx="6"/>
  <text class="tx-c" x="108" y="74" text-anchor="end">FIN_WAIT_1</text>
  <text class="tx-c" x="108" y="139" text-anchor="end">FIN_WAIT_2</text>
  <text class="tx-c" x="108" y="244" text-anchor="end">TIME_WAIT</text>
  <text class="tx-m" x="108" y="262" text-anchor="end">2 × MSL</text>
  <text class="tx-c" x="108" y="308" text-anchor="end">CLOSED</text>
  <text class="tx-c" x="488" y="99">CLOSE_WAIT</text>
  <text class="tx-c" x="488" y="189">LAST_ACK</text>
  <text class="tx-c" x="488" y="259">CLOSED</text>
</svg>`, caption: "TCP 4-way termination with states" },
        { h: "Why TIME_WAIT (2 × MSL, typically 60 s on Linux)?" },
        { ol: [
          "<b>Reliable close</b>: if the final ACK is lost, the server retransmits its FIN; the client must still be around to re-ACK instead of answering with RST.",
          "<b>Let old duplicates expire</b>: delayed segments from this connection must die before the same 5-tuple is reused, so they can't corrupt a new connection."
        ] },
        { ul: [
          "Steps 2 and 3 can be combined (FIN+ACK) when the passive side has nothing more to send → a 3-segment close.",
          "An <b>RST</b> aborts a connection immediately without the handshake (e.g. connecting to a closed port)."
        ] },
        { tip: "Production follow-ups: many sockets stuck in <b>CLOSE_WAIT</b> = your application forgot to call <code>close()</code>; many in <b>TIME_WAIT</b> on a busy client/proxy = short-lived connections – fix with keep-alive / connection pooling, or <code>SO_REUSEADDR</code> for restarting servers." }
      ]
    },
    {
      id: "tcp-reliability",
      q: "How does TCP guarantee reliable, in-order delivery?",
      topic: "Transport Layer",
      level: 2,
      top: true,
      short: "TCP numbers every byte, has the receiver send cumulative ACKs for the next expected byte, retransmits on timeout (adaptive RTO) or on three duplicate ACKs (fast retransmit), uses a checksum to detect corruption, and buffers out-of-order segments to reassemble the stream in order.",
      a: [
        { p: "IP may drop, duplicate, corrupt or reorder packets. TCP builds a reliable byte stream on top using these mechanisms:" },
        { table: { head: ["Mechanism", "Solves"], rows: [
          ["<b>Sequence numbers</b> (per byte, 32-bit)", "Ordering, duplicate detection, reassembly"],
          ["<b>Cumulative ACKs</b> (ack = next byte expected)", "Confirms receipt; lost ACKs are covered by later ones"],
          ["<b>Checksum</b> (header + data + pseudo-header)", "Corruption → segment silently discarded"],
          ["<b>Retransmission timer (RTO)</b>", "Loss: resend if not ACKed in time"],
          ["<b>Fast retransmit</b> (3 duplicate ACKs)", "Loss detected in ~1 RTT without waiting for timeout"],
          ["<b>SACK</b> option", "Tells sender exactly which blocks arrived, avoiding needless resends"],
          ["<b>Receiver buffer</b>", "Holds out-of-order segments until gaps fill"],
          ["<b>Flow control (rwnd)</b>", "Receiver never overrun"]
        ] } },
        { h: "RTO calculation (Jacobson/Karels)" },
        { code: `SRTT   = (1 - 1/8) * SRTT   + 1/8 * SampleRTT
RTTVAR = (1 - 1/4) * RTTVAR + 1/4 * |SampleRTT - SRTT|
RTO    = SRTT + 4 * RTTVAR          (min 1 s per RFC 6298; Linux uses 200 ms)
On timeout: RTO = 2 * RTO           (exponential backoff)
Karn's rule: don't take RTT samples from retransmitted segments`, lang: "text", title: "Adaptive retransmission timeout" },
        { p: "Example: sender transmits bytes 1000–1999, 2000–2999, 3000–3999. The second segment is lost. The receiver ACKs 2000, then on receiving the third segment ACKs 2000 again (duplicate). After three duplicates the sender resends 2000–2999; the receiver now ACKs 4000 (cumulative)." },
        { tip: "TCP is a hybrid of Go-Back-N (cumulative ACKs, one timer) and Selective Repeat (receiver buffering + SACK)." }
      ]
    },
    {
      id: "sockets",
      q: "What is a socket? Describe the sequence of socket API calls for a TCP client and server.",
      topic: "Transport Layer",
      level: 2,
      top: true,
      short: "A socket is an OS endpoint for network communication identified by (IP, port, protocol); a TCP server calls socket → bind → listen → accept → recv/send → close, while a client calls socket → connect → send/recv → close.",
      a: [
        { p: "A <b>socket</b> is the programming interface (file-descriptor-like handle) between an application and the transport layer. A socket <i>address</i> = IP + port; a TCP <i>connection</i> is identified by the pair of socket addresses (the 5-tuple)." },
        { table: { head: ["Step", "TCP server", "TCP client"], rows: [
          ["1", "<code>socket()</code> – create endpoint", "<code>socket()</code>"],
          ["2", "<code>bind()</code> – attach to IP:port (e.g. 0.0.0.0:8080)", "(optional; OS picks ephemeral port)"],
          ["3", "<code>listen(backlog)</code> – mark passive, create accept queue", "<code>connect()</code> – performs 3-way handshake"],
          ["4", "<code>accept()</code> – blocks, returns a <b>new</b> connected socket per client", "–"],
          ["5", "<code>recv()/send()</code>", "<code>send()/recv()</code>"],
          ["6", "<code>close()</code>", "<code>close()</code> – starts FIN handshake"]
        ] } },
        { ul: [
          "<b>Stream sockets</b> (SOCK_STREAM) → TCP; <b>datagram sockets</b> (SOCK_DGRAM) → UDP (no listen/accept; use <code>sendto/recvfrom</code>); <b>raw sockets</b> → direct IP access (ping).",
          "The listening socket only accepts; each <code>accept()</code> returns a separate socket, which is why a server can talk to many clients on one port.",
          "Concurrency models: thread/process per connection, or non-blocking I/O with <code>select/poll/epoll</code> (event loop – Nginx, Node.js)."
        ] },
        { tip: "If asked about <b>backlog</b>: Linux keeps a SYN queue (half-open) and an accept queue (completed handshakes waiting for <code>accept()</code>); <code>listen(n)</code> caps the accept queue." }
      ]
    },
    {
      id: "socket-programming",
      q: "Write a simple TCP echo server and client.",
      topic: "Transport Layer",
      level: 2,
      top: true,
      short: "The server creates a socket, binds to a port, listens, accepts a connection and loops recv → send until the client closes; the client connects, sends a message and prints the echoed reply.",
      a: [
        { p: "A minimal iterative (one client at a time) echo server, first in C (POSIX sockets) and in Python:" },
        { code: [
          { lang: "c", src: `#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

int main(void) {
    int srv = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof opt);

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);   /* 0.0.0.0 */
    addr.sin_port = htons(9000);                 /* host -> network byte order */

    if (bind(srv, (struct sockaddr *)&addr, sizeof addr) < 0) { perror("bind"); return 1; }
    listen(srv, 16);
    printf("listening on 9000\\n");

    for (;;) {
        int cli = accept(srv, NULL, NULL);       /* new socket per client */
        char buf[1024];
        ssize_t n;
        while ((n = recv(cli, buf, sizeof buf, 0)) > 0)
            send(cli, buf, n, 0);                /* echo back */
        close(cli);                              /* n == 0: client closed */
    }
}` },
          { lang: "python", src: `import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("0.0.0.0", 9000))
    srv.listen(16)
    print("listening on 9000")
    while True:
        conn, addr = srv.accept()          # blocks until a client connects
        with conn:
            print("connected by", addr)
            while data := conn.recv(1024): # b"" means the client closed
                conn.sendall(data)         # echo back` }
        ], title: "TCP echo server" },
        { code: `import socket

with socket.create_connection(("127.0.0.1", 9000)) as s:   # socket() + connect()
    s.sendall(b"hello, network")
    print(s.recv(1024).decode())                            # -> hello, network`, lang: "python", title: "TCP echo client" },
        { ul: [
          "<code>htons/htonl</code> convert to <b>network byte order</b> (big-endian).",
          "<code>SO_REUSEADDR</code> lets the server restart while old connections sit in TIME_WAIT.",
          "TCP is a <b>byte stream</b>: one <code>send</code> may arrive as several <code>recv</code>s (or be merged) – real protocols need framing (length prefix or delimiter).",
          "To serve many clients concurrently: a thread per connection, <code>selectors</code>/<code>epoll</code>, or <code>asyncio</code>."
        ] },
        { warn: "Using <code>send</code> instead of <code>sendall</code> in Python (or ignoring the return value in C) can silently send only part of the buffer." }
      ]
    },
    {
      id: "tcp-flow-vs-congestion-control",
      q: "TCP flow control vs congestion control – explain slow start, AIMD and fast recovery.",
      topic: "Transport Layer",
      level: 3,
      top: true,
      short: "Flow control protects the receiver using the advertised receive window (rwnd); congestion control protects the network using the sender-side congestion window (cwnd). The sender may have min(rwnd, cwnd) bytes in flight; cwnd grows exponentially in slow start, then linearly (additive increase), and is cut on loss (multiplicative decrease).",
      a: [
        { table: { head: ["", "Flow control", "Congestion control"], rows: [
          ["Protects", "The <b>receiver</b>'s buffer", "The <b>network</b> (routers' queues)"],
          ["Signal", "Receiver advertises <b>rwnd</b> in every ACK", "Sender infers congestion from loss / delay / ECN"],
          ["Window", "rwnd (up to 1 GB with window scaling)", "cwnd (sender's private estimate)"],
          ["Zero case", "rwnd = 0 → sender stops, sends window probes", "Timeout → cwnd reset to 1 MSS"]
        ] } },
        { p: "Effective window = <b>min(rwnd, cwnd)</b>; throughput ≈ window / RTT." },
        { h: "Congestion control phases (TCP Reno)" },
        { ol: [
          "<b>Slow start</b>: cwnd starts at 1 MSS (modern: 10 MSS) and increases by 1 MSS per ACK → <b>doubles every RTT</b> until it reaches <b>ssthresh</b>.",
          "<b>Congestion avoidance</b> (additive increase): +1 MSS per RTT – linear probing for bandwidth.",
          "<b>3 duplicate ACKs</b> (mild congestion): ssthresh = cwnd/2, cwnd = ssthresh (+3), <b>fast retransmit</b> the lost segment, <b>fast recovery</b> continues in congestion avoidance (multiplicative decrease).",
          "<b>Timeout</b> (severe congestion): ssthresh = cwnd/2, cwnd = 1 MSS, back to slow start."
        ] },
        { svg: `<svg viewBox="0 0 600 250" width="600" class="dg">
  <line class="ln" x1="50" y1="220" x2="585" y2="220" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="50" y1="220" x2="50" y2="18" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="58" y="18">cwnd (MSS)</text>
  <text class="tx-m" x="585" y="240" text-anchor="end">transmission rounds (RTT)</text>
  <line class="ln ln-d" x1="50" y1="92" x2="350" y2="92"/>
  <text class="tx-m" x="56" y="86">ssthresh = 16</text>
  <polyline class="ln-a" points="50,212 80,204 110,188 140,156 170,92 200,84 230,76 260,68 290,60 320,52 350,44 380,132 410,124 440,116 470,108 500,100 530,92"/>
  <polyline class="ln ln-d" points="350,44 380,212 410,204 440,188 470,156 500,132 530,124"/>
  <circle class="box-r" cx="350" cy="44" r="5"/>
  <text class="tx-m" x="360" y="40">loss (3 dup ACKs / timeout)</text>
  <text class="tx tx-a" x="150" y="196">slow start</text>
  <text class="tx tx-a" x="250" y="42" text-anchor="middle">congestion avoidance (+1/RTT)</text>
  <text class="tx-m" x="470" y="70">solid: Reno, cwnd → 11</text>
  <text class="tx-m" x="470" y="84">dashed: Tahoe, cwnd → 1</text>
</svg>`, caption: "cwnd over time: exponential slow start, linear AIMD, then halving (Reno) or reset (Tahoe) after loss" },
        { ul: [
          "<b>AIMD</b> (additive-increase / multiplicative-decrease) gives the saw-tooth pattern and converges to a fair share between flows.",
          "Modern variants: <b>CUBIC</b> (Linux default – cubic growth, better for high bandwidth-delay paths) and <b>BBR</b> (Google – models bottleneck bandwidth and RTT rather than reacting to loss)."
        ] },
        { tip: "Crisp distinction: \"Flow control: <i>don't overwhelm the receiver</i>. Congestion control: <i>don't overwhelm the network</i>.\" Then draw the saw-tooth." },
        { warn: "\"Slow start\" is not slow – growth is exponential. It is named so because it starts from a small window instead of blasting the full receiver window at once." }
      ]
    },

    /* ===================== Application Layer ===================== */
    {
      id: "dns-records",
      q: "What are the common DNS record types?",
      topic: "Application Layer",
      level: 1,
      top: true,
      short: "A maps a name to an IPv4 address, AAAA to IPv6, CNAME aliases one name to another, MX names mail servers, NS delegates a zone to name servers, TXT holds text (SPF/DKIM/verification), PTR does reverse lookups and SOA holds zone metadata.",
      a: [
        { table: { head: ["Record", "Maps", "Example"], rows: [
          ["<b>A</b>", "Name → IPv4", "<code>example.com. 300 IN A 93.184.216.34</code>"],
          ["<b>AAAA</b>", "Name → IPv6", "<code>example.com. AAAA 2606:2800:220:1::248</code>"],
          ["<b>CNAME</b>", "Alias → canonical name", "<code>www.example.com. CNAME example.com.</code>"],
          ["<b>MX</b>", "Domain → mail server (with priority; lower wins)", "<code>example.com. MX 10 mail.example.com.</code>"],
          ["<b>NS</b>", "Zone → authoritative name servers", "<code>example.com. NS ns1.provider.net.</code>"],
          ["<b>TXT</b>", "Free text: SPF, DKIM, DMARC, domain verification", "<code>\"v=spf1 include:_spf.google.com ~all\"</code>"],
          ["<b>PTR</b>", "IP → name (reverse DNS, <code>in-addr.arpa</code>)", "<code>34.216.184.93.in-addr.arpa. PTR example.com.</code>"],
          ["<b>SOA</b>", "Zone metadata: primary NS, admin, serial, refresh timers", "One per zone"],
          ["<b>SRV</b>", "Service → host:port (with priority/weight)", "<code>_sip._tcp.example.com. SRV 10 5 5060 sip.example.com.</code>"],
          ["<b>CAA</b>", "Which CAs may issue certificates", "<code>0 issue \"letsencrypt.org\"</code>"]
        ] } },
        { code: `$ dig +short example.com A
93.184.216.34
$ dig example.com MX +short
10 mail.example.com.
$ nslookup -type=NS example.com`, lang: "bash", title: "Querying records" },
        { ul: [
          "<b>TTL</b> on each record controls how long resolvers cache it – lower it before a migration.",
          "A CNAME cannot coexist with other records at the same name, so the zone apex (<code>example.com</code>) can't be a CNAME – providers offer ALIAS/ANAME/CNAME-flattening."
        ] },
        { tip: "Common scenario: \"You moved your site to a new server but some users still hit the old one\" → DNS caching/TTL." }
      ]
    },
    {
      id: "email-protocols",
      q: "Explain SMTP, POP3 and IMAP. How is an email delivered?",
      topic: "Application Layer",
      level: 1,
      top: true,
      short: "SMTP is the push protocol used to send mail from client to server and between mail servers; POP3 and IMAP are pull protocols for reading mail – POP3 downloads (and usually deletes) messages to one device, IMAP keeps them on the server and syncs folders across devices.",
      a: [
        { ol: [
          "Alice's mail client (MUA) submits the message to her provider's SMTP server over <b>SMTP port 587 (STARTTLS)</b>.",
          "Her server looks up the <b>MX record</b> of bob's domain via DNS.",
          "It relays the message to Bob's mail server via <b>SMTP port 25</b> (server-to-server).",
          "Bob's server stores it in his mailbox.",
          "Bob's client retrieves it with <b>IMAP</b> (993) or <b>POP3</b> (995)."
        ] },
        { table: { head: ["", "SMTP", "POP3", "IMAP"], rows: [
          ["Purpose", "Send / relay (push)", "Retrieve (pull)", "Access / sync (pull)"],
          ["Ports", "25 relay, 587 submission, 465 SMTPS", "110, 995 (TLS)", "143, 993 (TLS)"],
          ["Mail storage", "–", "Downloaded to client, usually deleted from server", "Stays on server"],
          ["Multiple devices", "–", "Poor", "Excellent – read/flag state and folders synced"],
          ["Offline use", "–", "Good", "Needs caching"],
          ["Server storage", "–", "Low", "High"]
        ] } },
        { ul: [
          "SMTP is text-based: <code>HELO/EHLO, MAIL FROM, RCPT TO, DATA, QUIT</code>; attachments via <b>MIME</b> encoding (base64).",
          "Anti-spoofing: <b>SPF</b> (allowed sending IPs), <b>DKIM</b> (signature), <b>DMARC</b> (policy) – all published as TXT records."
        ] },
        { tip: "Webmail (Gmail in a browser) uses <b>HTTPS</b> between you and Google; SMTP is still used between mail servers." }
      ]
    },
    {
      id: "dns-resolution",
      q: "How does DNS work? Explain recursive vs iterative resolution.",
      topic: "Application Layer",
      level: 2,
      top: true,
      short: "DNS translates domain names to IP addresses through a distributed hierarchy. The client asks a recursive resolver, which (on a cache miss) iteratively queries a root server, then the TLD server, then the domain's authoritative server, caches the answer for its TTL and returns it.",
      a: [
        { p: "The <b>Domain Name System</b> is a hierarchical, distributed database (root → TLD → second-level domains) mostly over <b>UDP port 53</b> (TCP 53 for responses > 512 B without EDNS, and zone transfers). Caching at every level keeps it fast." },
        { svg: `<svg viewBox="0 0 680 262" width="680" class="dg">
  <rect class="box" x="10" y="100" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="70" y="116" text-anchor="middle">Browser / OS</text>
  <text class="tx-m" x="70" y="133" text-anchor="middle">stub resolver</text>
  <rect class="box-a" x="250" y="100" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="320" y="116" text-anchor="middle">Recursive resolver</text>
  <text class="tx-m" x="320" y="133" text-anchor="middle">ISP / 8.8.8.8 / 1.1.1.1</text>
  <rect class="box-p" x="520" y="14" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="595" y="34" text-anchor="middle" dominant-baseline="middle">Root server ( . )</text>
  <rect class="box-p" x="520" y="100" width="150" height="44" rx="6"/>
  <text class="tx tx-b" x="595" y="122" text-anchor="middle" dominant-baseline="middle">.com TLD server</text>
  <rect class="box-g" x="520" y="186" width="150" height="44" rx="6"/>
  <text class="tx tx-b" x="595" y="202" text-anchor="middle">Authoritative NS</text>
  <text class="tx-m" x="595" y="219" text-anchor="middle">example.com</text>
  <line class="ln-a" x1="130" y1="116" x2="246" y2="116" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-d" x1="250" y1="130" x2="134" y2="130" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="189" y="110" text-anchor="middle">1</text>
  <text class="tx tx-b" x="189" y="148" text-anchor="middle">8</text>
  <line class="ln-a" x1="390" y1="110" x2="516" y2="40" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-d" x1="520" y1="50" x2="394" y2="120" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="446" y="66" text-anchor="middle">2</text>
  <text class="tx tx-b" x="470" y="100" text-anchor="middle">3</text>
  <line class="ln-a" x1="390" y1="116" x2="516" y2="116" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-d" x1="520" y1="128" x2="394" y2="128" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="454" y="110" text-anchor="middle">4</text>
  <text class="tx tx-b" x="454" y="144" text-anchor="middle">5</text>
  <line class="ln-a" x1="390" y1="134" x2="516" y2="198" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-d" x1="520" y1="212" x2="394" y2="142" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="470" y="156" text-anchor="middle">6</text>
  <text class="tx tx-b" x="440" y="190" text-anchor="middle">7</text>
  <text class="tx-a" x="189" y="170" text-anchor="middle">recursive</text>
  <text class="tx-a" x="455" y="252" text-anchor="middle">iterative (referrals)</text>
</svg>`, caption: "Resolving www.example.com on a cold cache" },
        { ol: [
          "Browser/OS cache and hosts file are checked; on miss, the stub sends a <b>recursive</b> query to the configured resolver (\"give me the final answer\").",
          "Resolver (cache miss) asks a <b>root server</b> (13 named root servers, hundreds of anycast instances).",
          "Root replies with a <b>referral</b>: NS records for <code>.com</code>.",
          "Resolver asks the <b>.com TLD</b> server.",
          "TLD refers it to <code>example.com</code>'s authoritative name servers.",
          "Resolver asks the <b>authoritative</b> server.",
          "Authoritative server returns the A/AAAA record (with TTL).",
          "Resolver caches it and returns the answer to the client."
        ] },
        { table: { head: ["", "Recursive query", "Iterative query"], rows: [
          ["Who does the work", "The server queried must return the final answer (or error)", "The server returns the best it knows – often a referral – and the asker continues"],
          ["Typical between", "Client → recursive resolver", "Resolver → root / TLD / authoritative"],
          ["Load", "On the resolver", "Spread; servers stay stateless"]
        ] } },
        { tip: "Mention caching layers (browser, OS, router, resolver) and <b>TTL</b>; modern privacy: <b>DoH/DoT</b> (DNS over HTTPS/TLS); security: <b>DNSSEC</b> signs records to stop spoofing." }
      ]
    },
    {
      id: "ftp",
      q: "How does FTP work? What are active and passive modes?",
      topic: "Application Layer",
      level: 2,
      top: false,
      short: "FTP uses two TCP connections – a persistent control connection on port 21 for commands and a separate data connection per transfer. In active mode the server connects back to the client (from port 20); in passive mode the client opens the data connection to a port the server announces, which works through NAT/firewalls.",
      a: [
        { p: "<b>File Transfer Protocol</b> is stateful and sends commands <b>out-of-band</b>: the control channel (<code>USER, PASS, LIST, RETR, STOR, PASV</code>) stays open for the session, while each file or listing uses a fresh data connection." },
        { table: { head: ["", "Active mode", "Passive mode (PASV)"], rows: [
          ["Control", "Client ephemeral → server 21", "Client ephemeral → server 21"],
          ["Data connection opened by", "<b>Server</b> (port 20) → client port given in PORT", "<b>Client</b> → server port given in PASV reply"],
          ["Firewall/NAT friendliness", "Poor – inbound connection to client is blocked", "Good – all connections outbound from client"],
          ["Server firewall", "Simple", "Must open a passive port range"]
        ] } },
        { table: { head: ["Protocol", "Security", "Notes"], rows: [
          ["FTP", "Plaintext (credentials visible)", "Legacy"],
          ["FTPS", "FTP + TLS", "Same two-channel model"],
          ["SFTP", "Runs over SSH (port 22)", "Different protocol; single connection"],
          ["TFTP", "None, UDP 69", "Trivial – network boot, device firmware"]
        ] } },
        { warn: "SFTP is <b>not</b> \"FTP over SSL\" – that's FTPS. SFTP is an SSH subsystem." }
      ]
    },

    /* ===================== Web & HTTP ===================== */
    {
      id: "http-methods",
      q: "What are the HTTP methods? What is the difference between GET and POST, PUT and PATCH?",
      topic: "Web & HTTP",
      level: 1,
      top: true,
      short: "GET reads, POST creates/processes, PUT replaces, PATCH partially updates, DELETE removes, HEAD fetches headers only, OPTIONS asks capabilities (CORS preflight). GET is safe and idempotent with parameters in the URL; POST is neither and carries data in the body.",
      a: [
        { table: { head: ["Method", "Meaning", "Safe", "Idempotent", "Body", "Cacheable"], rows: [
          ["<b>GET</b>", "Retrieve a resource", "Yes", "Yes", "No (ignored)", "Yes"],
          ["<b>HEAD</b>", "GET without the body (check size, existence)", "Yes", "Yes", "No", "Yes"],
          ["<b>POST</b>", "Create a sub-resource / submit data / trigger processing", "No", "<b>No</b>", "Yes", "Rarely"],
          ["<b>PUT</b>", "Create or <b>replace</b> the resource at this URI", "No", "Yes", "Yes", "No"],
          ["<b>PATCH</b>", "<b>Partially</b> modify a resource", "No", "Not necessarily", "Yes", "No"],
          ["<b>DELETE</b>", "Remove a resource", "No", "Yes", "Optional", "No"],
          ["<b>OPTIONS</b>", "Which methods/headers are allowed (CORS preflight)", "Yes", "Yes", "No", "No"]
        ] } },
        { ul: [
          "<b>Safe</b> = doesn't change server state. <b>Idempotent</b> = doing it N times has the same effect as once (clients/proxies can retry safely).",
          "<b>GET vs POST</b>: GET puts parameters in the URL (visible in logs/history, length-limited, bookmarkable, cacheable); POST puts them in the body. Neither is encrypted without HTTPS.",
          "<b>PUT vs PATCH</b>: PUT sends the full new representation (missing fields are reset); PATCH sends only changes."
        ] },
        { warn: "\"POST is secure, GET is not\" is wrong – both are plaintext over HTTP; POST merely keeps data out of URLs and logs. Also, DELETE being idempotent doesn't mean the status code is the same (200 then 404)." },
        { tip: "Make POST retries safe with an <b>idempotency key</b> header – payment APIs (Stripe, Razorpay) do exactly this." }
      ]
    },
    {
      id: "http-status-codes",
      q: "What are HTTP status codes? Explain the important ones.",
      topic: "Web & HTTP",
      level: 1,
      top: true,
      short: "Three-digit codes in the response: 1xx informational, 2xx success (200 OK, 201 Created, 204 No Content), 3xx redirection (301, 302, 304 Not Modified), 4xx client errors (400, 401, 403, 404, 429) and 5xx server errors (500, 502, 503, 504).",
      a: [
        { table: { head: ["Code", "Name", "When"], rows: [
          ["100 / 101", "Continue / Switching Protocols", "101 used for WebSocket upgrade"],
          ["<b>200</b>", "OK", "Success with body"],
          ["<b>201</b>", "Created", "POST/PUT created a resource (Location header)"],
          ["<b>204</b>", "No Content", "Success, no body (e.g. DELETE)"],
          ["<b>301</b>", "Moved Permanently", "SEO-friendly permanent redirect (cached)"],
          ["<b>302</b> / 307", "Found / Temporary Redirect", "Temporary; 307 preserves method and body"],
          ["<b>304</b>", "Not Modified", "Conditional GET – use cached copy (ETag / If-None-Match)"],
          ["<b>400</b>", "Bad Request", "Malformed syntax / validation failure"],
          ["<b>401</b>", "Unauthorized", "Not <b>authenticated</b> – missing/invalid credentials"],
          ["<b>403</b>", "Forbidden", "Authenticated but not <b>authorised</b>"],
          ["<b>404</b>", "Not Found", "Resource doesn't exist"],
          ["405 / 409", "Method Not Allowed / Conflict", "Wrong verb / version or state conflict"],
          ["<b>429</b>", "Too Many Requests", "Rate limited (Retry-After)"],
          ["<b>500</b>", "Internal Server Error", "Unhandled exception on server"],
          ["<b>502</b>", "Bad Gateway", "Proxy/LB got an invalid response from upstream"],
          ["<b>503</b>", "Service Unavailable", "Overloaded / maintenance"],
          ["<b>504</b>", "Gateway Timeout", "Upstream didn't respond in time"]
        ] } },
        { tip: "The favourite trick question is <b>401 vs 403</b>: 401 = \"who are you?\", 403 = \"I know who you are, and you're not allowed\". Another: 502 vs 504 – bad response vs no response from the upstream." }
      ]
    },
    {
      id: "http-vs-https",
      q: "What is the difference between HTTP and HTTPS?",
      topic: "Web & HTTP",
      level: 1,
      top: true,
      short: "HTTPS is HTTP carried inside a TLS-encrypted connection (default port 443 vs 80). TLS adds confidentiality (encryption), integrity (tamper detection) and server authentication via certificates, protecting against eavesdropping and man-in-the-middle attacks.",
      a: [
        { table: { head: ["", "HTTP", "HTTPS"], rows: [
          ["Default port", "80", "443"],
          ["Security", "Plaintext – anyone on path can read/modify", "Encrypted and integrity-protected by TLS"],
          ["Authentication", "None", "Server proves identity with a CA-signed certificate"],
          ["Layering", "HTTP → TCP", "HTTP → TLS → TCP (or QUIC for HTTP/3)"],
          ["Performance", "No handshake overhead", "Extra TLS handshake (1 RTT with TLS 1.3); negligible CPU with AES-NI"],
          ["SEO / browser", "\"Not secure\" warning", "Required for HTTP/2, service workers, geolocation, etc."]
        ] } },
        { h: "What HTTPS does and doesn't hide" },
        { ul: [
          "<b>Encrypted</b>: URL path and query, headers, cookies, body.",
          "<b>Visible</b> to the network: client and server IPs, ports, the domain name (via DNS and TLS SNI unless ECH is used), timing and sizes."
        ] },
        { tip: "Mention <b>HSTS</b> (Strict-Transport-Security header) – forces browsers to use HTTPS and defeats SSL-stripping attacks." }
      ]
    },
    {
      id: "rest-api",
      q: "What is REST? What makes an API RESTful?",
      topic: "Web & HTTP",
      level: 1,
      top: true,
      short: "REST is an architectural style for web APIs where resources are identified by URIs and manipulated through a uniform interface (standard HTTP methods and status codes), with stateless requests, cacheable responses and a client–server, layered design.",
      a: [
        { p: "<b>REST (Representational State Transfer)</b>, defined by Roy Fielding (2000), models the API as a set of <b>resources</b> (nouns) whose <b>representations</b> (usually JSON) are transferred with HTTP verbs." },
        { h: "Constraints" },
        { ul: [
          "<b>Client–server</b> separation.",
          "<b>Stateless</b>: each request carries everything needed (auth token etc.); no server-side conversation state.",
          "<b>Cacheable</b>: responses declare cacheability.",
          "<b>Uniform interface</b>: resource URIs, standard methods, self-descriptive messages, (HATEOAS – links to related actions).",
          "<b>Layered system</b>: proxies, gateways, CDNs can sit in between transparently.",
          "<i>Code on demand</i> (optional)."
        ] },
        { code: `GET    /api/users            -> 200 list users
GET    /api/users/42         -> 200 one user  | 404
POST   /api/users            -> 201 Created, Location: /api/users/43
PUT    /api/users/42         -> 200 replaced
PATCH  /api/users/42         -> 200 partially updated
DELETE /api/users/42         -> 204 No Content
GET    /api/users/42/orders?status=paid&page=2   (sub-resource + filtering)`, lang: "text", title: "Resource-oriented endpoints" },
        { table: { head: ["", "REST", "GraphQL", "gRPC"], rows: [
          ["Transport", "HTTP/1.1+, JSON", "Usually HTTP POST, JSON", "HTTP/2, Protobuf (binary)"],
          ["Shape", "Many endpoints, fixed responses", "One endpoint, client picks fields", "RPC methods from .proto contracts"],
          ["Strength", "Simple, cacheable, universal", "No over/under-fetching", "Fast, typed, streaming – service-to-service"]
        ] } },
        { warn: "Verbs in URLs (<code>/getUser</code>, <code>/deleteUser?id=1</code>) and returning 200 with an error body are classic non-RESTful smells." }
      ]
    },
    {
      id: "http-versions",
      q: "Compare HTTP/1.1, HTTP/2 and HTTP/3 (QUIC).",
      topic: "Web & HTTP",
      level: 2,
      top: true,
      short: "HTTP/1.1 is text-based with persistent connections but one outstanding request per connection (head-of-line blocking); HTTP/2 is binary and multiplexes many streams over one TCP connection with header compression; HTTP/3 runs over QUIC (UDP) to remove TCP-level head-of-line blocking and combine the transport and TLS 1.3 handshakes.",
      a: [
        { table: { head: ["Feature", "HTTP/1.1 (1997)", "HTTP/2 (2015)", "HTTP/3 (2022)"], rows: [
          ["Transport", "TCP", "TCP", "<b>QUIC over UDP</b>"],
          ["Format", "Text", "Binary frames", "Binary frames"],
          ["Connections", "Persistent (keep-alive); browsers open ~6 per host", "One connection, many <b>multiplexed streams</b>", "One QUIC connection, independent streams"],
          ["Head-of-line blocking", "At HTTP level (requests queue)", "Fixed at HTTP level, but a lost TCP packet stalls <b>all</b> streams", "<b>Eliminated</b> – loss affects only its stream"],
          ["Header compression", "None", "HPACK", "QPACK"],
          ["Server push", "No", "Yes (now deprecated in browsers)", "Specified, rarely used"],
          ["Encryption", "Optional", "Effectively required (browsers only do h2 over TLS)", "Always TLS 1.3 (built into QUIC)"],
          ["Handshake to first byte", "TCP 1 RTT + TLS 1–2 RTT", "Same as 1.1", "1 RTT, or <b>0-RTT</b> on resumption"],
          ["Connection migration", "No", "No", "Yes – connection ID survives Wi-Fi ↔ 4G switch"]
        ] } },
        { ul: [
          "HTTP/1.1 workarounds that HTTP/2 made unnecessary: domain sharding, sprite sheets, concatenated bundles.",
          "HTTP/1.1 pipelining existed but was broken in practice (responses must be in order) and disabled in browsers.",
          "Version negotiation: HTTP/2 via TLS <b>ALPN</b>; HTTP/3 advertised via the <code>Alt-Svc</code> header or DNS HTTPS record."
        ] },
        { tip: "The key insight to state: HTTP/2 solved HOL blocking at the application layer but moved it to TCP; QUIC fixes it by doing reliability per stream in user space over UDP." }
      ]
    },
    {
      id: "what-happens-google",
      q: "What happens when you type google.com in the browser and press Enter?",
      topic: "Web & HTTP",
      level: 2,
      top: true,
      short: "The browser parses the URL (upgrading to HTTPS via HSTS), resolves google.com to an IP via caches and DNS, opens a TCP connection (3-way handshake) or QUIC, performs a TLS handshake and verifies the certificate, sends an HTTP GET, the request reaches Google's edge/load balancer and servers, a response comes back, and the browser parses HTML, fetches sub-resources and renders the page.",
      a: [
        { svg: `<svg viewBox="0 0 700 72" width="700" class="dg">
  <rect class="box" x="10" y="10" width="104" height="52" rx="6"/>
  <text class="tx tx-b" x="62" y="30" text-anchor="middle">1 URL</text>
  <text class="tx-m" x="62" y="48" text-anchor="middle">parse, HSTS</text>
  <rect class="box-p" x="126" y="10" width="104" height="52" rx="6"/>
  <text class="tx tx-b" x="178" y="30" text-anchor="middle">2 DNS</text>
  <text class="tx-m" x="178" y="48" text-anchor="middle">name → IP</text>
  <rect class="box-a" x="242" y="10" width="104" height="52" rx="6"/>
  <text class="tx tx-b" x="294" y="30" text-anchor="middle">3 TCP</text>
  <text class="tx-m" x="294" y="48" text-anchor="middle">3-way handshake</text>
  <rect class="box-g" x="358" y="10" width="104" height="52" rx="6"/>
  <text class="tx tx-b" x="410" y="30" text-anchor="middle">4 TLS</text>
  <text class="tx-m" x="410" y="48" text-anchor="middle">keys + cert</text>
  <rect class="box-w" x="474" y="10" width="104" height="52" rx="6"/>
  <text class="tx tx-b" x="526" y="30" text-anchor="middle">5 HTTP</text>
  <text class="tx-m" x="526" y="48" text-anchor="middle">GET / → 200</text>
  <rect class="box" x="590" y="10" width="104" height="52" rx="6"/>
  <text class="tx tx-b" x="642" y="30" text-anchor="middle">6 Render</text>
  <text class="tx-m" x="642" y="48" text-anchor="middle">DOM, CSSOM, paint</text>
  <line class="ln" x1="114" y1="36" x2="124" y2="36" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="230" y1="36" x2="240" y2="36" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="346" y1="36" x2="356" y2="36" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="462" y1="36" x2="472" y2="36" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="578" y1="36" x2="588" y2="36" marker-end="url(#dg-arr)"/>
</svg>`, caption: "The big picture – walk the interviewer through each box" },
        { h: "1. Input handling and URL parsing" },
        { ul: [
          "Browser decides whether the text is a URL or a search term; <code>google.com</code> becomes <code>https://google.com/</code>.",
          "Google is on the <b>HSTS preload list</b>, so the browser goes straight to HTTPS (no insecure port-80 request).",
          "Checks the HTTP cache / service worker – maybe the page (or a redirect) is cached."
        ] },
        { h: "2. DNS resolution" },
        { ul: [
          "Browser DNS cache → OS cache (and <code>hosts</code> file) → router → configured <b>recursive resolver</b> (ISP / 8.8.8.8).",
          "On a miss the resolver walks root → <code>.com</code> TLD → Google's authoritative servers and returns A/AAAA records (and an HTTPS record may advertise HTTP/3).",
          "Google answers with the IP of a nearby edge (geo-DNS + <b>anycast</b>)."
        ] },
        { h: "3. Reaching the server: ARP, routing, TCP" },
        { ul: [
          "The IP is off-subnet, so the OS sends to the <b>default gateway</b>; ARP resolves the gateway's MAC.",
          "Packet leaves via NAT at the home router, travels through the ISP and across ASes (BGP) to Google's edge; each router does longest-prefix match and decrements TTL.",
          "OS opens a <b>TCP connection</b> to port 443: SYN → SYN-ACK → ACK (1 RTT). Chrome may instead use <b>QUIC (HTTP/3) over UDP 443</b>."
        ] },
        { h: "4. TLS handshake" },
        { ul: [
          "ClientHello (SNI = google.com, ALPN h2/http/1.1, key share) → ServerHello + certificate + Finished (TLS 1.3, 1 RTT).",
          "Browser verifies the <b>certificate chain</b> up to a trusted root CA, hostname match, validity dates and revocation/CT.",
          "Both sides derive symmetric session keys via <b>ECDHE</b>; everything after is encrypted."
        ] },
        { h: "5. HTTP request and server side" },
        { code: `GET / HTTP/2
:authority: google.com
user-agent: Mozilla/5.0 ...
accept: text/html
accept-encoding: gzip, br
cookie: NID=...`, lang: "text", title: "Request (conceptually)" },
        { ul: [
          "Request hits Google's edge: <b>L4/L7 load balancers</b>, reverse proxies (TLS termination), then application servers, which may call caches and databases.",
          "<code>google.com</code> responds <b>301 → https://www.google.com/</b>; the browser repeats the request (reusing or opening a connection).",
          "Response: <b>200 OK</b>, headers (<code>content-type</code>, <code>cache-control</code>, <code>set-cookie</code>), compressed HTML body."
        ] },
        { h: "6. Rendering" },
        { ol: [
          "Parse HTML → <b>DOM</b>; parse CSS → <b>CSSOM</b>; discovered sub-resources (CSS, JS, images, fonts) are fetched in parallel over the same HTTP/2 connection (often from a CDN).",
          "JavaScript is downloaded and executed (may block parsing unless <code>async/defer</code>).",
          "DOM + CSSOM → <b>render tree</b> → <b>layout</b> (geometry) → <b>paint</b> → <b>composite</b> layers on the GPU.",
          "Connection is kept alive for further requests; eventually closed (FIN) or reused."
        ] },
        { tip: "Structure your answer by layers and keep going until the interviewer stops you. Drop names at each step: HSTS, recursive/iterative DNS, ARP to default gateway, NAT, 3-way handshake, TLS 1.3 + certificate chain, load balancer/CDN, 301 to www, HTTP/2 multiplexing, DOM/CSSOM/render tree." },
        { warn: "Common omissions that cost marks: skipping DNS caching layers, forgetting TLS/certificate validation, and forgetting that the browser must still <b>render</b> – the question isn't over when the HTML arrives." }
      ]
    },
    {
      id: "cookies-sessions-tokens",
      q: "Cookies vs sessions vs JWT/tokens – how do they differ?",
      topic: "Web & HTTP",
      level: 2,
      top: true,
      short: "HTTP is stateless, so state is added on top: a cookie is a small key-value stored by the browser and sent automatically; a session stores user state on the server and gives the browser only a session ID (usually in a cookie); a JWT is a signed, self-contained token carrying the claims, so the server can verify it without a lookup.",
      a: [
        { table: { head: ["", "Cookie", "Server session", "JWT / bearer token"], rows: [
          ["What", "Browser storage mechanism (≈4 KB per cookie)", "State stored server-side, keyed by a random session ID", "Signed token (header.payload.signature) holding user claims"],
          ["Where state lives", "Client", "Server (memory, Redis, DB)", "Client (inside the token)"],
          ["Sent how", "Automatically by browser in <code>Cookie</code> header", "Session ID usually in a cookie", "<code>Authorization: Bearer &lt;token&gt;</code> (or a cookie)"],
          ["Scalability", "–", "Needs shared session store across servers / sticky sessions", "Stateless – any server can verify the signature"],
          ["Revocation", "Delete / expire", "Easy – delete server record", "Hard – valid until <code>exp</code>; needs short TTL + refresh tokens or a denylist"],
          ["Typical use", "Preferences, carrying session IDs", "Classic web apps", "APIs, mobile apps, microservices, SSO (OIDC)"]
        ] } },
        { h: "Cookie security attributes" },
        { ul: [
          "<code>HttpOnly</code> – not readable from JavaScript (mitigates XSS token theft).",
          "<code>Secure</code> – only sent over HTTPS.",
          "<code>SameSite=Lax/Strict</code> – not sent on cross-site requests (mitigates CSRF).",
          "<code>Domain</code>, <code>Path</code>, <code>Expires/Max-Age</code> – scope and lifetime (no expiry = session cookie)."
        ] },
        { warn: "A JWT is <b>signed, not encrypted</b> – its payload is just base64url and readable by anyone. Never put secrets in it, and always verify the signature and algorithm server-side." },
        { tip: "Storing JWTs in localStorage exposes them to XSS; an HttpOnly Secure SameSite cookie is generally safer." }
      ]
    },
    {
      id: "websocket-vs-polling",
      q: "WebSocket vs HTTP polling, long polling and Server-Sent Events.",
      topic: "Web & HTTP",
      level: 2,
      top: false,
      short: "Short polling repeatedly asks the server for updates; long polling holds each request open until data arrives; SSE keeps one HTTP response open for server-to-client streaming; WebSocket upgrades an HTTP connection into a persistent full-duplex channel for low-latency two-way messaging.",
      a: [
        { table: { head: ["Technique", "Direction", "How", "Pros / cons", "Use"], rows: [
          ["<b>Short polling</b>", "Client pulls", "Request every N seconds", "Simple; wasteful, latency up to N s", "Dashboards with slow updates"],
          ["<b>Long polling</b>", "Client pulls", "Server holds request until an event or timeout, client re-requests immediately", "Near real-time; connection churn, overhead per message", "Fallback for old infra"],
          ["<b>SSE</b>", "Server → client", "<code>text/event-stream</code> response kept open; auto-reconnect", "Simple, HTTP-friendly; one-way, text only", "Feeds, notifications, LLM token streaming"],
          ["<b>WebSocket</b>", "Full duplex", "HTTP Upgrade → framed TCP channel (<code>ws://</code>, <code>wss://</code>)", "Lowest latency and overhead; stateful, harder to scale/load-balance", "Chat, multiplayer games, trading, collaboration"]
        ] } },
        { code: `GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`, lang: "text", title: "WebSocket opening handshake" },
        { tip: "Scaling WebSockets: connections are long-lived and stateful, so you need L4/L7 LBs that support upgrades, sticky routing or a pub/sub backbone (Redis, Kafka) to fan messages out across servers, plus heartbeats (ping/pong)." }
      ]
    },
    {
      id: "cdn",
      q: "What is a CDN and how does it work?",
      topic: "Web & HTTP",
      level: 2,
      top: true,
      short: "A Content Delivery Network is a geographically distributed set of edge servers that cache content close to users; DNS or anycast routes each user to a nearby edge, which serves cached copies or fetches from the origin on a miss – cutting latency, origin load and absorbing DDoS traffic.",
      a: [
        { ol: [
          "User requests <code>static.example.com/logo.png</code>; the domain is a CNAME to the CDN (e.g. Cloudflare, Akamai, CloudFront).",
          "CDN DNS (geo/latency-based) or <b>anycast</b> routing sends the user to the nearest <b>PoP / edge server</b>.",
          "<b>Cache hit</b> → served immediately from the edge. <b>Cache miss</b> → edge fetches from the <b>origin</b> (possibly via a mid-tier shield cache), stores it per <code>Cache-Control</code>/TTL, then serves it."
        ] },
        { ul: [
          "<b>Benefits</b>: lower latency (shorter RTT), less origin bandwidth and load, higher availability, DDoS absorption, TLS termination at edge, image optimisation, HTTP/3 at the edge.",
          "<b>Cache control</b>: <code>Cache-Control: public, max-age=31536000, immutable</code> for fingerprinted assets (<code>app.3f9a.js</code>); purge/invalidate APIs for urgent changes.",
          "<b>Push vs pull CDN</b>: pull fetches lazily on first miss (common); push uploads content to the CDN ahead of time (large files)."
        ] },
        { warn: "Personalised or authenticated responses must not be cached publicly – use <code>Cache-Control: private</code> / <code>no-store</code>, or vary the cache key correctly." },
        { tip: "Connect it to the latency discussion: a CDN mainly cuts <b>propagation delay</b> (distance), which no amount of bandwidth can fix." }
      ]
    },
    {
      id: "proxy-vs-reverse-proxy",
      q: "What is the difference between a forward proxy and a reverse proxy?",
      topic: "Web & HTTP",
      level: 2,
      top: true,
      short: "A forward proxy sits in front of clients and makes requests to the Internet on their behalf (hiding/controlling clients); a reverse proxy sits in front of servers and receives requests on their behalf (hiding servers and providing load balancing, TLS termination, caching and security).",
      a: [
        { svg: `<svg viewBox="0 0 680 150" width="680" class="dg">
  <text class="tx-m" x="10" y="16">Forward proxy – acts for the clients</text>
  <rect class="box" x="10" y="24" width="160" height="40" rx="6"/>
  <text class="tx tx-b" x="90" y="44" text-anchor="middle" dominant-baseline="middle">Clients (office LAN)</text>
  <rect class="box-a" x="260" y="24" width="160" height="40" rx="6"/>
  <text class="tx tx-b" x="340" y="44" text-anchor="middle" dominant-baseline="middle">Forward proxy</text>
  <rect class="box" x="510" y="24" width="160" height="40" rx="6"/>
  <text class="tx tx-b" x="590" y="44" text-anchor="middle" dominant-baseline="middle">Any website</text>
  <line class="ln" x1="170" y1="44" x2="256" y2="44" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="420" y1="44" x2="506" y2="44" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="10" y="92">Reverse proxy – acts for the servers</text>
  <rect class="box" x="10" y="100" width="160" height="40" rx="6"/>
  <text class="tx tx-b" x="90" y="120" text-anchor="middle" dominant-baseline="middle">Any client</text>
  <rect class="box-g" x="260" y="100" width="160" height="40" rx="6"/>
  <text class="tx tx-b" x="340" y="120" text-anchor="middle" dominant-baseline="middle">Reverse proxy (Nginx)</text>
  <rect class="box" x="510" y="100" width="160" height="40" rx="6"/>
  <text class="tx tx-b" x="590" y="120" text-anchor="middle" dominant-baseline="middle">App server pool</text>
  <line class="ln" x1="170" y1="120" x2="256" y2="120" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="420" y1="120" x2="506" y2="120" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Same box, opposite side of the connection" },
        { table: { head: ["", "Forward proxy", "Reverse proxy"], rows: [
          ["Sits near", "Clients", "Servers"],
          ["Configured by", "Client / network admin (browser proxy settings, PAC)", "Server owner; clients don't know it exists"],
          ["Hides", "Client identity from servers", "Server topology from clients"],
          ["Uses", "Content filtering, access control, caching, anonymity, bypassing geo-blocks", "Load balancing, TLS termination, caching, compression, WAF, rate limiting, routing to microservices"],
          ["Examples", "Squid, corporate proxies, Tor-style anonymisers", "Nginx, HAProxy, Envoy, Cloudflare, AWS ALB, API gateways"]
        ] } },
        { tip: "A load balancer, API gateway and CDN edge are all specialised <b>reverse proxies</b>. A VPN is not a proxy – it tunnels all IP traffic at the network layer rather than individual application requests." }
      ]
    },
    {
      id: "load-balancer",
      q: "What is a load balancer? Compare L4 and L7 load balancing and common algorithms.",
      topic: "Web & HTTP",
      level: 2,
      top: true,
      short: "A load balancer distributes incoming traffic across a pool of healthy servers for scalability and availability. L4 balancers route by IP/port on TCP/UDP connections without reading content (fast); L7 balancers terminate HTTP and route by URL, headers or cookies (smarter, more CPU).",
      a: [
        { table: { head: ["", "L4 (transport)", "L7 (application)"], rows: [
          ["Decides on", "Src/dst IP, port, protocol (5-tuple)", "HTTP method, path, host, headers, cookies"],
          ["Sees payload?", "No – forwards packets/connections", "Yes – terminates TLS and parses HTTP"],
          ["Performance", "Very high, low latency", "Lower (per-request work)"],
          ["Features", "Simple balancing, NAT/DSR", "Path-based routing (<code>/api</code> vs <code>/static</code>), header rewrite, caching, WAF, auth, retries, canaries"],
          ["Stickiness", "By source IP hash", "By cookie"],
          ["Examples", "AWS NLB, LVS, HAProxy (TCP mode)", "AWS ALB, Nginx, Envoy, HAProxy (HTTP mode)"]
        ] } },
        { h: "Algorithms" },
        { ul: [
          "<b>Round robin</b> / <b>weighted round robin</b> – rotate through servers (weights for bigger machines).",
          "<b>Least connections</b> / least response time – good for uneven request cost.",
          "<b>IP hash / consistent hashing</b> – same client → same server (cache affinity), minimal reshuffling when servers change.",
          "<b>Random / power of two choices</b> – pick two at random, send to the less loaded."
        ] },
        { ul: [
          "<b>Health checks</b> (TCP connect or HTTP <code>/health</code>) remove failed servers.",
          "Avoid a single point of failure with LB pairs (VRRP/keepalived floating IP), DNS load balancing or anycast.",
          "Prefer stateless app servers with shared session storage over sticky sessions."
        ] },
        { tip: "Real stacks combine them: DNS/anycast → L4 LB → L7 LB/reverse proxy → services." }
      ]
    },

    /* ===================== Security ===================== */
    {
      id: "symmetric-vs-asymmetric",
      q: "What is the difference between symmetric and asymmetric encryption?",
      topic: "Security",
      level: 1,
      top: true,
      short: "Symmetric encryption uses one shared secret key for both encryption and decryption (AES, ChaCha20) – fast but the key must be distributed securely; asymmetric encryption uses a public/private key pair (RSA, ECC) – solves key distribution and enables signatures but is much slower. Real protocols like TLS use asymmetric crypto to agree on a symmetric key.",
      a: [
        { table: { head: ["", "Symmetric", "Asymmetric (public-key)"], rows: [
          ["Keys", "One shared secret key", "Public key (shareable) + private key (secret)"],
          ["Speed", "Very fast (hardware AES-NI)", "100–1000× slower"],
          ["Key distribution", "Hard – needs a secure channel; n users need n(n−1)/2 keys", "Easy – publish the public key; 2n keys"],
          ["Provides", "Confidentiality (with AEAD also integrity)", "Key exchange, digital signatures, encryption of small data"],
          ["Algorithms", "AES-GCM, ChaCha20-Poly1305, (old: DES, 3DES, RC4)", "RSA, ECDSA, Ed25519, (EC)DH key exchange"],
          ["Key size (≈128-bit security)", "128-bit AES", "3072-bit RSA or 256-bit ECC"]
        ] } },
        { ul: [
          "Encrypt with the receiver's <b>public</b> key → only their <b>private</b> key decrypts (confidentiality).",
          "Sign with your <b>private</b> key → anyone verifies with your <b>public</b> key (authenticity, non-repudiation).",
          "<b>Hybrid encryption</b>: TLS uses ECDHE (asymmetric) to derive a shared secret, then AES-GCM (symmetric) for bulk data."
        ] },
        { tip: "The key-count numerical is common: 100 users need 100×99/2 = 4,950 symmetric keys, but only 200 keys (100 pairs) with public-key crypto." }
      ]
    },
    {
      id: "hashing",
      q: "What is hashing? How is it different from encryption and encoding?",
      topic: "Security",
      level: 1,
      top: true,
      short: "Hashing maps any input to a fixed-size digest with a one-way function (SHA-256) – it cannot be reversed and is used for integrity checks and password storage; encryption is reversible with a key and provides confidentiality; encoding (Base64) is a reversible format change with no security at all.",
      a: [
        { table: { head: ["", "Hashing", "Encryption", "Encoding"], rows: [
          ["Reversible?", "No (one-way)", "Yes, with the key", "Yes, by anyone"],
          ["Key?", "No (HMAC uses one)", "Yes", "No"],
          ["Goal", "Integrity, fingerprinting, password verification", "Confidentiality", "Data representation / transport"],
          ["Output size", "Fixed (SHA-256 → 256 bits)", "≈ input size", "Larger (Base64 ≈ +33%)"],
          ["Examples", "SHA-256, SHA-3, BLAKE2; bcrypt/Argon2 for passwords", "AES, RSA, ChaCha20", "Base64, URL encoding, UTF-8"]
        ] } },
        { h: "Properties of a cryptographic hash" },
        { ul: [
          "<b>Deterministic</b> and fast to compute.",
          "<b>Pre-image resistant</b>: can't find input from hash.",
          "<b>Collision resistant</b>: infeasible to find two inputs with the same hash (MD5 and SHA-1 are broken here).",
          "<b>Avalanche effect</b>: one-bit change flips ~half the output bits."
        ] },
        { h: "Password storage" },
        { p: "Never store plaintext or plain SHA-256. Use a slow, <b>salted</b> password hash – <b>bcrypt, scrypt or Argon2</b>. The unique random salt defeats rainbow tables; the work factor slows brute force. <b>HMAC</b> (hash + secret key) authenticates messages, e.g. webhook signatures and JWT HS256." },
        { warn: "\"Base64 encrypted\" is a red flag in an interview – Base64 is encoding, not encryption." }
      ]
    },
    {
      id: "firewall",
      q: "What is a firewall? What are its types?",
      topic: "Security",
      level: 1,
      top: true,
      short: "A firewall monitors and filters network traffic according to security rules, sitting between trusted and untrusted networks. Types: stateless packet filters (by IP/port/protocol), stateful firewalls (track connections), application/proxy firewalls and WAFs (inspect L7 content), and next-generation firewalls (add IPS, app awareness, TLS inspection).",
      a: [
        { table: { head: ["Type", "Layer", "Decides using", "Notes"], rows: [
          ["<b>Packet filter (stateless)</b>", "L3/L4", "Each packet's IPs, ports, protocol, flags vs ACL", "Fast; can't tell if a packet belongs to a valid connection"],
          ["<b>Stateful inspection</b>", "L3/L4", "Connection table (5-tuple + TCP state)", "Automatically allows return traffic; standard today"],
          ["<b>Application / proxy firewall</b>", "L7", "Protocol content (HTTP, FTP commands)", "Deep inspection; slower"],
          ["<b>WAF</b>", "L7 (HTTP)", "Request patterns: SQLi, XSS, bots", "Protects web apps (Cloudflare, AWS WAF, ModSecurity)"],
          ["<b>NGFW</b>", "L3–L7", "App identification, user identity, IPS signatures, TLS inspection", "Palo Alto, Fortinet"],
          ["<b>Host-based</b>", "Host", "Per-machine rules", "iptables/nftables, Windows Firewall, cloud security groups"]
        ] } },
        { code: `# default deny inbound, allow established replies, SSH and HTTPS
iptables -P INPUT DROP
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22  -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT`, lang: "bash", title: "Stateful host firewall rules" },
        { ul: [
          "Rules are evaluated <b>top-down, first match wins</b>, ending in an implicit/explicit deny.",
          "<b>DMZ</b>: a perimeter subnet for public-facing servers, separated from the internal network by firewalls."
        ] },
        { tip: "Principle to state: <b>default deny, least privilege</b>." }
      ]
    },
    {
      id: "digital-signatures-certificates",
      q: "How do digital signatures and SSL/TLS certificates work? What is a CA?",
      topic: "Security",
      level: 2,
      top: true,
      short: "A digital signature is a hash of the data encrypted/signed with the sender's private key; anyone verifies it with the public key, proving authenticity and integrity. A certificate is a CA-signed document binding a public key to an identity (domain); browsers trust it by validating the chain up to a pre-installed root CA.",
      a: [
        { h: "Digital signature" },
        { ol: [
          "Sender computes <code>h = SHA-256(message)</code>.",
          "Signs: <code>sig = Sign(private_key, h)</code> (RSA-PSS, ECDSA, Ed25519).",
          "Receiver recomputes the hash and runs <code>Verify(public_key, h, sig)</code>. Success ⇒ message unchanged (<b>integrity</b>), made by the private-key holder (<b>authenticity</b>) who cannot deny it (<b>non-repudiation</b>)."
        ] },
        { h: "Certificates (X.509)" },
        { p: "A signature only helps if you trust the public key belongs to the right party. A <b>certificate</b> contains the subject (domain, SANs), the subject's <b>public key</b>, issuer, validity period, serial number, extensions – all <b>signed by a Certificate Authority</b>." },
        { code: `Root CA  (self-signed, pre-installed in OS/browser trust store)
  └── signs → Intermediate CA  (root key kept offline)
        └── signs → Leaf certificate: CN/SAN = www.google.com, public key K`, lang: "text", title: "Chain of trust" },
        { ul: [
          "Browser validation: each signature verifies up to a trusted root; <b>hostname matches SAN</b>; within validity dates; not revoked (<b>OCSP</b>/CRL, OCSP stapling); logged in <b>Certificate Transparency</b>.",
          "Validation levels: DV (domain control, e.g. Let's Encrypt via ACME), OV, EV.",
          "Self-signed certificates give encryption but no third-party authentication – browsers warn."
        ] },
        { tip: "Tie it to MITM: an attacker can present their own public key, but can't get a trusted CA to sign a certificate for google.com, so the browser rejects it." }
      ]
    },
    {
      id: "vpn",
      q: "What is a VPN and how does it work?",
      topic: "Security",
      level: 2,
      top: false,
      short: "A VPN creates an encrypted tunnel over a public network: packets are encapsulated and encrypted by a VPN client/gateway and decapsulated at the other end, making remote devices or sites appear to be on the private network. Common protocols: IPsec, WireGuard, OpenVPN/TLS VPNs.",
      a: [
        { p: "A <b>Virtual Private Network</b> uses <b>tunnelling</b> (encapsulating the original IP packet inside another packet) plus <b>encryption and authentication</b>, so traffic crossing the Internet is private and the endpoints behave as if directly connected." },
        { table: { head: ["Type", "Connects", "Example"], rows: [
          ["<b>Remote access</b>", "A single user device → corporate network", "Employee laptop with a VPN client"],
          ["<b>Site-to-site</b>", "Two networks via gateways", "Branch office ↔ HQ, on-prem ↔ cloud VPC"],
          ["<b>Consumer / privacy VPN</b>", "Device → provider's exit server", "Hiding traffic from local Wi-Fi/ISP, changing apparent location"]
        ] } },
        { table: { head: ["Protocol", "Layer / transport", "Notes"], rows: [
          ["IPsec (IKEv2)", "L3; ESP (IP proto 50), UDP 500/4500", "Standard for site-to-site; tunnel vs transport mode"],
          ["WireGuard", "L3 over UDP", "Tiny codebase, modern crypto (Curve25519, ChaCha20), fast"],
          ["OpenVPN / SSL VPN", "TLS over UDP/TCP", "Traverses firewalls easily (can use TCP 443)"],
          ["PPTP", "Obsolete", "Broken crypto – don't use"]
        ] } },
        { warn: "A VPN moves trust from your ISP to the VPN provider; it doesn't make you anonymous or protect against malware/phishing. Modern enterprises increasingly replace flat VPN access with <b>Zero Trust</b> (per-app, identity-based access)." }
      ]
    },
    {
      id: "network-attacks",
      q: "Explain common network attacks: DoS/DDoS, MITM, SYN flood, DNS spoofing, ARP spoofing.",
      topic: "Security",
      level: 2,
      top: true,
      short: "DoS/DDoS exhaust a target's bandwidth or resources (DDoS from many sources, e.g. botnets); MITM secretly intercepts or alters communication; SYN flood fills a server's half-open connection queue; DNS spoofing/cache poisoning returns forged DNS answers; ARP spoofing poisons LAN caches to redirect traffic.",
      a: [
        { table: { head: ["Attack", "How it works", "Mitigation"], rows: [
          ["<b>DoS</b>", "One source overwhelms a service (bandwidth, CPU, connections) or crashes it", "Rate limiting, patching, resource limits"],
          ["<b>DDoS</b>", "Many sources (botnet) – volumetric (UDP/DNS/NTP amplification), protocol (SYN flood), application (HTTP flood)", "Scrubbing/CDN (Cloudflare, AWS Shield), anycast, rate limiting, autoscaling, WAF"],
          ["<b>SYN flood</b>", "Spoofed SYNs, never ACKed → SYN backlog full → legitimate clients refused", "SYN cookies, larger backlog, shorter SYN-RCVD timeout, upstream filtering"],
          ["<b>MITM</b>", "Attacker relays/alters traffic between two parties (rogue Wi-Fi, ARP/DNS spoofing, SSL stripping)", "TLS with certificate validation, HSTS, certificate pinning, VPN on untrusted networks"],
          ["<b>DNS spoofing / cache poisoning</b>", "Forged responses inserted into resolver cache → users sent to attacker's IP", "DNSSEC, random source ports + TXIDs, DoH/DoT, TLS catches wrong server"],
          ["<b>ARP spoofing</b>", "Fake ARP replies map gateway IP → attacker MAC on the LAN", "Dynamic ARP Inspection, static ARP, port security, end-to-end encryption"],
          ["<b>IP spoofing</b>", "Forged source address (used in floods and amplification)", "Ingress/egress filtering (BCP 38)"],
          ["<b>Replay attack</b>", "Captured valid message resent later", "Nonces, timestamps, sequence numbers"],
          ["<b>Session hijacking</b>", "Stealing a session cookie/token", "HTTPS, HttpOnly/Secure cookies, short sessions, token rotation"]
        ] } },
        { p: "<b>Amplification</b> is key to modern DDoS: a small spoofed request to an open DNS/NTP/memcached server yields a response many times larger, sent to the victim." },
        { tip: "Frame answers with the <b>CIA triad</b>: DoS attacks <b>availability</b>, MITM/sniffing attack <b>confidentiality</b> and <b>integrity</b>." }
      ]
    },
    {
      id: "tls-handshake",
      q: "Explain the TLS 1.3 handshake.",
      topic: "Security",
      level: 3,
      top: true,
      short: "In TLS 1.3 the client sends ClientHello with supported cipher suites and an ephemeral (EC)DHE key share; the server replies with ServerHello and its key share, after which both derive handshake keys, and the server sends its encrypted certificate, CertificateVerify signature and Finished. The client verifies and sends Finished – one round trip before application data (0-RTT on resumption).",
      a: [
        { p: "<b>TLS</b> (successor of SSL) provides confidentiality, integrity and authentication on top of TCP. TLS 1.3 (RFC 8446, 2018) cut the handshake from 2 RTT to <b>1 RTT</b>, removed insecure options (RSA key exchange, CBC, RC4, SHA-1, renegotiation) and mandates <b>forward secrecy</b>." },
        { svg: `<svg viewBox="0 0 620 300" width="620" class="dg">
  <rect class="box-a" x="60" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="120" y="27" text-anchor="middle" dominant-baseline="middle">Client</text>
  <rect class="box-g" x="440" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="500" y="27" text-anchor="middle" dominant-baseline="middle">Server</text>
  <line class="ln ln-d" x1="120" y1="44" x2="120" y2="272"/>
  <line class="ln ln-d" x1="500" y1="44" x2="500" y2="272"/>
  <line class="ln-a" x1="120" y1="70" x2="496" y2="90" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="310" y="68" text-anchor="middle">ClientHello + key_share</text>
  <text class="tx-m" x="310" y="102" text-anchor="middle">versions, cipher suites, SNI, ALPN, client random</text>
  <line class="ln" x1="500" y1="122" x2="124" y2="146" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="310" y="124" text-anchor="middle">ServerHello + key_share</text>
  <text class="tx-m" x="310" y="162" text-anchor="middle">{EncryptedExtensions, Certificate,</text>
  <text class="tx-m" x="310" y="176" text-anchor="middle">CertificateVerify, Finished}</text>
  <text class="tx-m" x="508" y="140">derive keys</text>
  <text class="tx-m" x="112" y="160" text-anchor="end">verify cert,</text>
  <text class="tx-m" x="112" y="174" text-anchor="end">derive keys</text>
  <line class="ln-a" x1="120" y1="200" x2="496" y2="218" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="310" y="200" text-anchor="middle">{Finished}</text>
  <line class="ln-a" x1="120" y1="246" x2="496" y2="246" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="500" y1="258" x2="124" y2="258" marker-end="url(#dg-arr)"/>
  <text class="tx tx-a" x="310" y="240" text-anchor="middle">[Application data] – after 1 RTT</text>
  <text class="tx-m" x="310" y="290" text-anchor="middle">{ } = encrypted with handshake keys, [ ] = encrypted with application keys</text>
</svg>`, caption: "TLS 1.3 full handshake (1-RTT)" },
        { ol: [
          "<b>ClientHello</b>: supported versions, cipher suites (e.g. <code>TLS_AES_128_GCM_SHA256</code>), <b>key_share</b> (client's ephemeral ECDHE public key, e.g. X25519), SNI (hostname), ALPN (h2/http1.1), random nonce.",
          "<b>ServerHello</b>: chosen suite and server's key_share. Both sides now compute the shared (EC)DHE secret → <b>handshake keys</b> (HKDF).",
          "Server sends, encrypted: <b>EncryptedExtensions</b>, <b>Certificate</b> (chain), <b>CertificateVerify</b> (signature over the transcript with its private key – proves it owns the certificate) and <b>Finished</b> (MAC over the transcript).",
          "Client validates the chain to a trusted root, hostname, expiry; checks CertificateVerify and Finished; sends its own <b>Finished</b>.",
          "Both switch to <b>application traffic keys</b>; HTTP data flows with AES-GCM / ChaCha20-Poly1305."
        ] },
        { table: { head: ["", "TLS 1.2", "TLS 1.3"], rows: [
          ["Round trips", "2 RTT", "1 RTT (0-RTT resumption with PSK)"],
          ["Key exchange", "RSA or (EC)DHE", "(EC)DHE only → forward secrecy always"],
          ["Certificate", "Sent in clear", "Encrypted"],
          ["Ciphers", "Many, incl. weak (CBC, RC4)", "5 AEAD suites only"]
        ] } },
        { tip: "<b>Forward secrecy</b>: because keys come from ephemeral DH values that are discarded, stealing the server's private key later cannot decrypt recorded past traffic. The certificate key is used only to <i>sign</i>, not to encrypt the session key." },
        { warn: "0-RTT early data is <b>replayable</b> – servers should only accept idempotent requests (like GET) in 0-RTT." }
      ]
    },
    {
      id: "syn-cookies",
      q: "How do SYN cookies defend against SYN floods?",
      topic: "Security",
      level: 3,
      top: false,
      short: "Instead of storing state for each half-open connection, the server encodes the connection details (timestamp, MSS, and a keyed hash of the 4-tuple) into its initial sequence number; only when the client's final ACK returns (ack = cookie + 1) does the server validate it and create the connection.",
      a: [
        { p: "A SYN flood works because the server <b>allocates memory</b> (a SYN-queue entry) on every SYN and holds it while waiting for an ACK that never comes. <b>SYN cookies</b> make the server <b>stateless</b> until the handshake completes." },
        { ol: [
          "SYN arrives while the SYN queue is under pressure.",
          "Server picks its ISN = cookie: <code>t</code> (slowly incrementing time counter, 5 bits) + encoded <b>MSS</b> (3 bits) + <code>hash(secret, src IP, src port, dst IP, dst port, t)</code> (24 bits).",
          "Server sends SYN-ACK and <b>forgets</b> the connection.",
          "A legitimate client replies ACK with <code>ack = ISN + 1</code>. The server recomputes the hash for the 4-tuple and recent <code>t</code> values; if it matches, it rebuilds the connection state and moves it straight to ESTABLISHED.",
          "Spoofed sources never send the ACK, so they cost nothing but the SYN-ACK."
        ] },
        { ul: [
          "<b>Trade-offs</b>: only 8 MSS values can be encoded; classic cookies lost TCP options such as window scaling and SACK (Linux now stores them in TCP timestamps); slightly more CPU for hashing.",
          "Enabled on Linux with <code>net.ipv4.tcp_syncookies = 1</code> (default: activate only when the queue overflows)."
        ] },
        { tip: "SYN cookies stop state exhaustion, but not a volumetric flood that saturates the link – that needs upstream scrubbing/CDN." }
      ]
    },

    /* ===================== Misc ===================== */
    {
      id: "bandwidth-latency-throughput",
      q: "Explain bandwidth, latency, throughput, jitter and the components of delay.",
      topic: "Misc",
      level: 1,
      top: true,
      short: "Bandwidth is the maximum data rate a link can carry; throughput is the rate actually achieved; latency is the time for data to travel from source to destination (propagation + transmission + queuing + processing delay); jitter is the variation in latency.",
      a: [
        { table: { head: ["Term", "Meaning", "Unit", "Analogy"], rows: [
          ["<b>Bandwidth</b>", "Maximum capacity of the link", "bits/s (Mbps, Gbps)", "Number of lanes on a highway"],
          ["<b>Throughput</b>", "Actual achieved data rate (≤ bandwidth)", "bits/s", "Cars actually passing per hour"],
          ["<b>Latency</b>", "One-way delay (RTT = round trip)", "ms", "Time for one car to make the trip"],
          ["<b>Jitter</b>", "Variation in latency between packets", "ms", "Some cars take much longer than others"],
          ["<b>Packet loss</b>", "Fraction of packets dropped", "%", "Cars that never arrive"]
        ] } },
        { h: "Components of delay" },
        { ul: [
          "<b>Transmission delay</b> = L / R (packet size / link bandwidth) – time to push bits onto the wire.",
          "<b>Propagation delay</b> = d / s (distance / signal speed ≈ 2×10<sup>8</sup> m/s in fibre) – time for a bit to travel.",
          "<b>Queuing delay</b> – waiting in router buffers; varies with load (source of jitter, bufferbloat).",
          "<b>Processing delay</b> – header checks, lookups (microseconds)."
        ] },
        { p: "<b>Example</b>: 1500-byte packet on a 10 Mbps link over 2000 km: T<sub>trans</sub> = 12000 / 10<sup>7</sup> = 1.2 ms; T<sub>prop</sub> = 2×10<sup>6</sup> / 2×10<sup>8</sup> = 10 ms." },
        { p: "<b>Bandwidth-delay product</b> (BDP) = bandwidth × RTT = bits \"in flight\" needed to fill the pipe; TCP's window must be at least the BDP to use the full link. 100 Mbps × 100 ms = 10 Mb ≈ 1.25 MB." },
        { tip: "Why more bandwidth doesn't make web pages proportionally faster: page loads are dominated by many round trips, i.e. <b>latency</b>. That's why CDNs, connection reuse, TLS 1.3 and QUIC matter." }
      ]
    },
    {
      id: "cast-types",
      q: "What are unicast, broadcast, multicast and anycast?",
      topic: "Misc",
      level: 1,
      top: false,
      short: "Unicast is one-to-one; broadcast is one-to-all hosts on the local network; multicast is one-to-many hosts that joined a group; anycast is one-to-nearest – the same address is announced from many locations and routing delivers to the closest one.",
      a: [
        { table: { head: ["Type", "Delivery", "Addresses", "Examples"], rows: [
          ["<b>Unicast</b>", "One sender → one receiver", "Normal host address", "Web browsing, SSH"],
          ["<b>Broadcast</b>", "One → all hosts in the broadcast domain", "255.255.255.255, subnet directed broadcast, MAC FF:FF:FF:FF:FF:FF", "ARP request, DHCP Discover"],
          ["<b>Multicast</b>", "One → subscribed group", "224.0.0.0/4, IPv6 ff00::/8; groups joined via IGMP / MLD", "IPTV, stock tickers, OSPF (224.0.0.5), mDNS"],
          ["<b>Anycast</b>", "One → nearest member of a group sharing one address", "Same unicast prefix announced via BGP from many sites", "DNS root servers, 8.8.8.8 / 1.1.1.1, CDNs, DDoS absorption"]
        ] } },
        { ul: [
          "Routers don't forward broadcasts, which bounds broadcast storms to one LAN/VLAN.",
          "IPv6 has <b>no broadcast</b>; it uses multicast (e.g. all-nodes ff02::1, solicited-node for NDP).",
          "Anycast works best for short, stateless exchanges (DNS over UDP); for TCP a route change mid-connection could hit a different server."
        ] },
        { tip: "Anycast is the answer to \"how can 8.8.8.8 be fast everywhere in the world?\"" }
      ]
    },
    {
      id: "transmission-modes",
      q: "What are simplex, half-duplex and full-duplex transmission modes?",
      topic: "Misc",
      level: 1,
      top: false,
      short: "Simplex allows data in one direction only (keyboard to computer, TV broadcast); half-duplex allows both directions but one at a time (walkie-talkie, hub-based Ethernet, Wi-Fi); full-duplex allows both directions simultaneously (telephone, switched Ethernet).",
      a: [
        { table: { head: ["Mode", "Direction", "Capacity use", "Examples"], rows: [
          ["<b>Simplex</b>", "One way only", "Full bandwidth in one direction", "Keyboard → PC, radio/TV broadcast, sensor → display"],
          ["<b>Half-duplex</b>", "Both ways, alternately", "Whole channel per direction, but turn-taking; collisions possible", "Walkie-talkie, hubs (CSMA/CD), Wi-Fi radio"],
          ["<b>Full-duplex</b>", "Both ways simultaneously", "Separate paths/pairs or frequencies per direction", "Phone call, switched Ethernet, fibre links"]
        ] } },
        { warn: "A <b>duplex mismatch</b> (one side full, the other half) on an Ethernet link causes late collisions and terrible throughput while pings still work – a classic troubleshooting case." }
      ]
    },
    {
      id: "circuit-vs-packet-switching",
      q: "Circuit switching vs packet switching – what's the difference?",
      topic: "Misc",
      level: 2,
      top: false,
      short: "Circuit switching reserves a dedicated end-to-end path and fixed bandwidth for the whole session (classic telephone network) – predictable but wasteful when idle; packet switching splits data into packets routed independently over shared links (the Internet) – efficient and resilient but with variable delay and possible loss.",
      a: [
        { table: { head: ["", "Circuit switching", "Packet switching"], rows: [
          ["Setup", "Connection established before data (call setup)", "No setup (datagram) – each packet carries the destination"],
          ["Resources", "Reserved for the whole session (FDM/TDM slot)", "Shared on demand (statistical multiplexing)"],
          ["Path", "Fixed", "Each packet may take a different route"],
          ["Delay", "Constant after setup, no queuing", "Variable (queuing), jitter"],
          ["Efficiency", "Wasted when idle", "High for bursty traffic"],
          ["Failure", "Link failure drops the call", "Reroutes around failures"],
          ["Examples", "PSTN telephone, old GSM voice", "Internet (IP), Ethernet"]
        ] } },
        { p: "<b>Virtual circuits</b> (ATM, Frame Relay, MPLS) are a hybrid: a path is set up in advance and packets carry a short label instead of full addresses, but links are still shared." },
        { p: "<b>Message switching</b> (store-and-forward of whole messages, e.g. telegraph) is the historical third variant." },
        { tip: "The Internet chose packet switching because data traffic is <b>bursty</b>: with statistical multiplexing many more users can share a link than if each reserved peak bandwidth." }
      ]
    }
  ]
});
