/* core subject: Operating Systems — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "os",
  title: "Operating Systems",
  short: "OS",
  icon: "⚙",
  blurb: "Interviewers probe processes vs threads, scheduling math, synchronization primitives, deadlocks and the paging / virtual-memory machinery — expect to draw diagrams and work small numeric examples on the spot.",
  topics: ["Basics & Kernel", "Processes & Threads", "CPU Scheduling", "Synchronization", "Deadlocks", "Memory Management", "Virtual Memory", "File Systems & Storage", "I/O & Misc"],
  questions: [

    /* ───────────── Basics & Kernel ───────────── */
    {
      id: "what-is-os",
      q: "What is an operating system and what are its main functions?",
      topic: "Basics & Kernel",
      level: 1,
      top: true,
      short: "An OS is system software that manages hardware resources and provides common services and abstractions (processes, files, memory, devices) to programs, acting as both resource manager and extended machine.",
      a: [
        { p: "An <b>operating system</b> is the layer of software between applications and hardware. It has two roles: a <b>resource manager</b> (allocates CPU, memory, disk and devices fairly and safely among competing programs) and an <b>extended machine</b> (hides ugly hardware details behind clean abstractions such as processes, files and sockets)." },
        { h: "Core functions" },
        { ul: [
          "<b>Process management</b> — creation, scheduling, termination, synchronization and IPC.",
          "<b>Memory management</b> — allocation, protection, paging and virtual memory.",
          "<b>File-system management</b> — files, directories, permissions, on-disk layout.",
          "<b>Device / I/O management</b> — drivers, buffering, interrupts, DMA.",
          "<b>Protection & security</b> — user/kernel mode, access control, isolation between processes.",
          "<b>User interface</b> — shell / GUI and the system-call API for programs."
        ] },
        { p: "Examples: Linux, Windows, macOS, Android (Linux kernel), iOS (XNU), FreeRTOS." },
        { tip: "Say the two-role definition (resource manager + abstraction provider) first — it signals you understand <i>why</i> an OS exists, not just a list of features." },
        { warn: "The OS is not the shell or the GUI. The <b>kernel</b> is the core that runs in privileged mode; shells, window managers and utilities are user-space programs." }
      ]
    },
    {
      id: "multiprogramming-vs-multitasking",
      q: "Differentiate multiprogramming, multitasking, multiprocessing and multithreading.",
      topic: "Basics & Kernel",
      level: 1,
      top: true,
      short: "Multiprogramming keeps several jobs in memory so the CPU is never idle; multitasking time-slices the CPU among them for interactivity; multiprocessing uses multiple CPUs; multithreading runs several threads inside one process.",
      a: [
        { p: "All four increase utilisation or responsiveness, but at different levels:" },
        { table: { head: ["Term", "Idea", "Goal", "Switch trigger"], rows: [
          ["<b>Multiprogramming</b>", "Several programs loaded in memory; when one blocks for I/O, the CPU runs another", "Maximise CPU utilisation", "Only when the running job blocks (non-preemptive)"],
          ["<b>Multitasking</b> (time-sharing)", "Multiprogramming + short time slices so every task appears to run simultaneously", "Low response time / interactivity", "Timer interrupt (preemptive)"],
          ["<b>Multiprocessing</b>", "Two or more CPUs / cores execute truly in parallel (SMP or AMP)", "Throughput, reliability", "Each core has its own scheduler loop"],
          ["<b>Multithreading</b>", "Multiple threads of one process share its address space", "Concurrency within one program", "Thread scheduler"]
        ] } },
        { p: "A modern desktop does all four: many programs in RAM, preemptive time-slicing, multiple cores, and multithreaded apps." },
        { tip: "Key phrase: multiprogramming is about <b>not wasting the CPU</b>; multitasking is about <b>response time</b>. Multiprocessing is <b>parallelism</b> (hardware), the others are <b>concurrency</b>." }
      ]
    },
    {
      id: "user-vs-kernel-mode",
      q: "What is the difference between user mode and kernel mode? Why do we need dual-mode operation?",
      topic: "Basics & Kernel",
      level: 1,
      top: true,
      short: "Kernel mode can execute privileged instructions and access all memory; user mode cannot. A hardware mode bit enforces this so a buggy or malicious program cannot crash the machine or read other processes' memory.",
      a: [
        { p: "The CPU has a <b>mode bit</b> (x86 uses rings 0–3; Linux uses ring 0 for kernel, ring 3 for user). Privileged instructions — I/O port access, changing page tables, disabling interrupts, halting the CPU — trap with a fault if attempted in user mode." },
        { table: { head: ["", "User mode", "Kernel mode"], rows: [
          ["Mode bit (classic)", "1", "0"],
          ["Privileged instructions", "Not allowed (trap)", "Allowed"],
          ["Memory access", "Only its own virtual address space", "All memory, incl. kernel space"],
          ["Crash impact", "Only that process dies", "Whole system (kernel panic / BSOD)"],
          ["Runs", "Applications, libraries, shells", "Kernel, (most) drivers, interrupt handlers"]
        ] } },
        { h: "How the mode switches" },
        { ul: [
          "<b>User → kernel</b>: system call (<code>syscall</code>/<code>int 0x80</code>), hardware interrupt, or exception (page fault, divide by zero).",
          "<b>Kernel → user</b>: return-from-trap instruction (<code>sysret</code>/<code>iret</code>) after the kernel has done its work."
        ] },
        { tip: "Mention that a mode switch is <b>not</b> a context switch: a system call enters the kernel on behalf of the same process; no other process is scheduled unless the call blocks." }
      ]
    },
    {
      id: "kernel-types",
      q: "Explain monolithic, microkernel and hybrid kernels with examples.",
      topic: "Basics & Kernel",
      level: 1,
      top: true,
      short: "A monolithic kernel runs all OS services in kernel space (fast, less isolated — Linux); a microkernel keeps only IPC, scheduling and basic memory management in the kernel and runs the rest as user-space servers (robust, slower — Minix, QNX); a hybrid mixes both (Windows NT, macOS XNU).",
      a: [
        { p: "The question is <b>how much code runs in privileged mode</b>." },
        { svg: `<svg viewBox="0 0 620 215" width="620" class="dg">
  <rect class="box-g" x="20" y="20" width="180" height="36" rx="6"/>
  <text class="tx" x="110" y="38" text-anchor="middle" dominant-baseline="middle">User applications</text>
  <rect class="box-a" x="20" y="84" width="180" height="96" rx="6"/>
  <text class="tx tx-b" x="110" y="108" text-anchor="middle">Monolithic kernel</text>
  <text class="tx-m" x="110" y="130" text-anchor="middle">FS · drivers · network</text>
  <text class="tx-m" x="110" y="148" text-anchor="middle">scheduler · memory mgmt</text>
  <rect class="box-g" x="222" y="20" width="52" height="36" rx="6"/>
  <text class="tx-s" x="248" y="38" text-anchor="middle" dominant-baseline="middle">App</text>
  <rect class="box-p" x="282" y="20" width="52" height="36" rx="6"/>
  <text class="tx-s" x="308" y="38" text-anchor="middle" dominant-baseline="middle">FS srv</text>
  <rect class="box-p" x="342" y="20" width="58" height="36" rx="6"/>
  <text class="tx-s" x="371" y="38" text-anchor="middle" dominant-baseline="middle">Driver srv</text>
  <rect class="box-a" x="222" y="130" width="178" height="50" rx="6"/>
  <text class="tx tx-b" x="311" y="148" text-anchor="middle">Microkernel</text>
  <text class="tx-m" x="311" y="166" text-anchor="middle">IPC · scheduling · basic VM</text>
  <line class="ln-a" x1="308" y1="56" x2="308" y2="128" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="316" y="100">IPC msgs</text>
  <rect class="box-g" x="422" y="20" width="96" height="36" rx="6"/>
  <text class="tx-s" x="470" y="38" text-anchor="middle" dominant-baseline="middle">Apps</text>
  <rect class="box-p" x="524" y="20" width="76" height="36" rx="6"/>
  <text class="tx-s" x="562" y="38" text-anchor="middle" dominant-baseline="middle">some servers</text>
  <rect class="box-a" x="422" y="84" width="178" height="96" rx="6"/>
  <text class="tx tx-b" x="511" y="108" text-anchor="middle">Hybrid kernel</text>
  <text class="tx-m" x="511" y="130" text-anchor="middle">micro-style core +</text>
  <text class="tx-m" x="511" y="148" text-anchor="middle">most services in kernel</text>
  <line class="ln ln-d" x1="10" y1="70" x2="610" y2="70"/>
  <text class="tx-s" x="14" y="66">user space</text>
  <text class="tx-s" x="14" y="80">kernel space</text>
  <text class="tx tx-b" x="110" y="204" text-anchor="middle">Linux, BSD</text>
  <text class="tx tx-b" x="311" y="204" text-anchor="middle">Minix 3, QNX, seL4</text>
  <text class="tx tx-b" x="511" y="204" text-anchor="middle">Windows NT, macOS XNU</text>
</svg>`, caption: "Where OS services live in each kernel design" },
        { table: { head: ["", "Monolithic", "Microkernel", "Hybrid"], rows: [
          ["Services in kernel", "All (FS, drivers, net, sched, VM)", "Minimal: IPC, scheduling, address spaces", "Most, with some user-mode servers"],
          ["Performance", "Fast — plain function calls", "Slower — IPC + extra mode switches", "Close to monolithic"],
          ["Reliability", "A driver bug can crash the kernel", "Crashed server can be restarted", "In between"],
          ["Size / TCB", "Large", "Very small (verifiable, e.g. seL4)", "Large"]
        ] } },
        { p: "Linux is monolithic but <b>modular</b>: loadable kernel modules (<code>insmod</code>, <code>.ko</code>) add drivers at runtime without making it a microkernel — they still run in ring 0." },
        { warn: "Saying Linux is a microkernel because it has modules is a classic mistake. Modules share the kernel's address space and privilege." }
      ]
    },
    {
      id: "system-calls",
      q: "What is a system call? How does it work and what are its types?",
      topic: "Basics & Kernel",
      level: 1,
      top: true,
      short: "A system call is the programmatic interface through which a user process requests a kernel service; the library wrapper places the call number and arguments in registers and executes a trap instruction that switches to kernel mode and dispatches via the system-call table.",
      a: [
        { p: "User programs cannot touch devices or kernel data directly, so they ask the kernel through <b>system calls</b> such as <code>read</code>, <code>write</code>, <code>fork</code>, <code>mmap</code>. Programs usually call a libc wrapper (<code>printf</code> → <code>write</code>) rather than issuing the trap themselves." },
        { svg: `<svg viewBox="0 0 600 175" width="600" class="dg">
  <rect class="box-g" x="20" y="20" width="150" height="40" rx="6"/>
  <text class="tx" x="95" y="40" text-anchor="middle" dominant-baseline="middle">app: write(fd, buf, n)</text>
  <rect class="box" x="220" y="20" width="140" height="40" rx="6"/>
  <text class="tx" x="290" y="40" text-anchor="middle" dominant-baseline="middle">libc wrapper</text>
  <rect class="box-g" x="420" y="20" width="160" height="40" rx="6"/>
  <text class="tx" x="500" y="40" text-anchor="middle" dominant-baseline="middle">app resumes, gets n</text>
  <line class="ln ln-d" x1="10" y1="86" x2="590" y2="86"/>
  <text class="tx-s" x="14" y="80">user mode</text>
  <text class="tx-s" x="14" y="100">kernel mode</text>
  <rect class="box-a" x="220" y="115" width="140" height="40" rx="6"/>
  <text class="tx" x="290" y="135" text-anchor="middle" dominant-baseline="middle">syscall table[1]</text>
  <rect class="box-a" x="420" y="115" width="160" height="40" rx="6"/>
  <text class="tx" x="500" y="135" text-anchor="middle" dominant-baseline="middle">sys_write() handler</text>
  <line class="ln" x1="170" y1="40" x2="218" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="290" y1="60" x2="290" y2="113" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="296" y="96">trap (syscall)</text>
  <line class="ln" x1="360" y1="135" x2="418" y2="135" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="500" y1="115" x2="500" y2="62" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="506" y="96">sysret</text>
</svg>`, caption: "Life of a write() system call on x86-64 Linux" },
        { ol: [
          "Wrapper puts the syscall number in a register (<code>rax</code> = 1 for <code>write</code> on x86-64 Linux) and arguments in <code>rdi, rsi, rdx…</code>.",
          "It executes <code>syscall</code>: CPU switches to kernel mode and jumps to a fixed kernel entry point.",
          "Kernel saves user registers, validates arguments (pointers must be user addresses), indexes the <b>system-call table</b> and runs the handler.",
          "Return value goes in <code>rax</code>; <code>sysret</code> drops back to user mode. On error libc sets <code>errno</code> and returns -1."
        ] },
        { table: { head: ["Category", "Examples (POSIX)"], rows: [
          ["Process control", "<code>fork, exec, exit, wait, kill</code>"],
          ["File management", "<code>open, read, write, close, lseek</code>"],
          ["Device management", "<code>ioctl, read, write</code>"],
          ["Information maintenance", "<code>getpid, time, alarm</code>"],
          ["Communication", "<code>pipe, socket, shmget, mmap</code>"],
          ["Protection", "<code>chmod, chown, umask</code>"]
        ] } },
        { tip: "Follow-up: <i>why are syscalls expensive?</i> Mode switch, register save/restore, cache/TLB pollution and speculative-execution mitigations (KPTI). That is why buffered I/O (<code>fwrite</code>) batches many small writes into one syscall." }
      ]
    },
    {
      id: "32-vs-64-bit",
      q: "What is the difference between a 32-bit and a 64-bit OS?",
      topic: "Basics & Kernel",
      level: 1,
      top: false,
      short: "A 64-bit OS uses 64-bit registers and addresses, so it can address far more than 4 GB of memory per process and system, has more registers and a different ABI; 32-bit is limited to a 4 GB virtual address space.",
      a: [
        { p: "The 'bitness' is the width of the CPU's general registers and virtual addresses the OS is built for." },
        { table: { head: ["", "32-bit", "64-bit (x86-64)"], rows: [
          ["Virtual address space", "2<sup>32</sup> = 4 GB (often 2–3 GB usable per process)", "Architecturally 2<sup>64</sup>; x86-64 uses 48-bit (256 TB) or 57-bit with 5-level paging"],
          ["Physical RAM", "4 GB (64 GB with PAE, but still 4 GB per process)", "Terabytes"],
          ["Registers", "8 GPRs (x86)", "16 GPRs, wider — faster calling convention"],
          ["Pointer / <code>long</code> size", "4 bytes", "8 bytes (LP64 on Linux; <code>long</code> stays 4 on Windows LLP64)"],
          ["Runs other kind", "Cannot run 64-bit apps", "Runs 32-bit apps via compatibility layer (WoW64, multilib)"]
        ] } },
        { p: "Page tables are deeper in 64-bit (4 levels on x86-64) because the address space is huge." },
        { warn: "64-bit does not automatically mean 'twice as fast'. Pointers are bigger, so memory footprint grows; the speedup comes from more registers and the ability to use more RAM." }
      ]
    },
    {
      id: "booting-process",
      q: "Explain the booting process of a computer.",
      topic: "Basics & Kernel",
      level: 2,
      top: true,
      short: "On power-on the CPU runs firmware (BIOS/UEFI) from ROM, which does POST, finds a boot device and loads the bootloader (e.g. GRUB); the bootloader loads the kernel and initramfs into memory, the kernel initialises hardware and memory, mounts root and starts the first user process (init/systemd, PID 1).",
      a: [
        { ol: [
          "<b>Power on / reset</b> — CPU starts executing at a fixed reset vector mapped to firmware ROM/flash.",
          "<b>Firmware (BIOS or UEFI)</b> runs <b>POST</b> (power-on self-test), initialises RAM controller and basic devices.",
          "<b>Find boot device</b> — BIOS reads the 512-byte <b>MBR</b> (sector 0) and jumps to it; UEFI reads the GPT and loads an <code>.efi</code> bootloader from the EFI System Partition.",
          "<b>Bootloader</b> (GRUB, Windows Boot Manager) — lets you pick an OS, loads the kernel image and initramfs into memory, passes command-line parameters.",
          "<b>Kernel init</b> — switches to protected/long mode, sets up page tables, interrupt vectors, scheduler, drivers; mounts the root file system (via initramfs if needed).",
          "<b>First user process</b> — kernel starts <code>/sbin/init</code> (systemd on most distros) as <b>PID 1</b>, which starts services and finally the login prompt / display manager."
        ] },
        { table: { head: ["", "Legacy BIOS", "UEFI"], rows: [
          ["Partition scheme", "MBR (max 2 TB, 4 primary)", "GPT (huge disks, 128 partitions)"],
          ["Boot code", "446 bytes in MBR, chain-loads", "Full executables on ESP (FAT32)"],
          ["Security", "None", "Secure Boot (signed loaders)"]
        ] } },
        { tip: "Interviewers like the term <b>bootstrap program</b>: a tiny program in ROM whose only job is to load a bigger program — hence 'pulling yourself up by your bootstraps'." }
      ]
    },
    {
      id: "virtualization-vs-containers",
      q: "What is virtualization? Compare hypervisors (type 1 vs type 2) and containers.",
      topic: "Basics & Kernel",
      level: 2,
      top: true,
      short: "Virtualization runs multiple isolated guest OSes on one machine via a hypervisor (type 1 on bare metal, type 2 on a host OS); containers instead share the host kernel and isolate processes using namespaces and cgroups, so they are lighter but less isolated.",
      a: [
        { p: "A <b>hypervisor</b> (VMM) creates virtual machines, each with virtual CPUs, memory and devices, and runs a full guest OS kernel inside. A <b>container</b> is just a group of ordinary host processes given a private view of the system." },
        { svg: `<svg viewBox="0 0 600 225" width="600" class="dg">
  <text class="tx tx-b" x="150" y="16" text-anchor="middle">Virtual machines (type 1)</text>
  <text class="tx tx-b" x="450" y="16" text-anchor="middle">Containers</text>
  <rect class="box-p" x="20" y="30" width="125" height="105" rx="6"/>
  <text class="tx tx-b" x="82" y="52" text-anchor="middle">VM 1</text>
  <text class="tx-m" x="82" y="80" text-anchor="middle">App + libs</text>
  <text class="tx-m" x="82" y="110" text-anchor="middle">Guest OS kernel</text>
  <rect class="box-p" x="155" y="30" width="125" height="105" rx="6"/>
  <text class="tx tx-b" x="217" y="52" text-anchor="middle">VM 2</text>
  <text class="tx-m" x="217" y="80" text-anchor="middle">App + libs</text>
  <text class="tx-m" x="217" y="110" text-anchor="middle">Guest OS kernel</text>
  <rect class="box-a" x="20" y="145" width="260" height="30" rx="6"/>
  <text class="tx" x="150" y="160" text-anchor="middle" dominant-baseline="middle">Hypervisor (ESXi, KVM, Hyper-V)</text>
  <rect class="box" x="20" y="185" width="260" height="30" rx="6"/>
  <text class="tx" x="150" y="200" text-anchor="middle" dominant-baseline="middle">Hardware</text>
  <rect class="box-g" x="320" y="30" width="125" height="65" rx="6"/>
  <text class="tx tx-b" x="382" y="52" text-anchor="middle">Container 1</text>
  <text class="tx-m" x="382" y="76" text-anchor="middle">App + libs</text>
  <rect class="box-g" x="455" y="30" width="125" height="65" rx="6"/>
  <text class="tx tx-b" x="517" y="52" text-anchor="middle">Container 2</text>
  <text class="tx-m" x="517" y="76" text-anchor="middle">App + libs</text>
  <rect class="box" x="320" y="105" width="260" height="30" rx="6"/>
  <text class="tx" x="450" y="120" text-anchor="middle" dominant-baseline="middle">Container runtime (containerd)</text>
  <rect class="box-a" x="320" y="145" width="260" height="30" rx="6"/>
  <text class="tx" x="450" y="160" text-anchor="middle" dominant-baseline="middle">Shared host OS kernel</text>
  <rect class="box" x="320" y="185" width="260" height="30" rx="6"/>
  <text class="tx" x="450" y="200" text-anchor="middle" dominant-baseline="middle">Hardware</text>
</svg>`, caption: "Each VM carries its own kernel; containers share one" },
        { table: { head: ["", "Type 1 (bare-metal)", "Type 2 (hosted)", "Containers"], rows: [
          ["Runs on", "Hardware directly", "A host OS", "Host kernel"],
          ["Examples", "VMware ESXi, Xen, Hyper-V, KVM", "VirtualBox, VMware Workstation", "Docker, Podman, LXC"],
          ["Isolation", "Strong (separate kernels)", "Strong", "Weaker (shared kernel; namespaces + cgroups + seccomp)"],
          ["Boot time / size", "Seconds–minutes / GBs", "Same", "Milliseconds / MBs"],
          ["Guest OS", "Any", "Any", "Must match host kernel (Linux on Linux)"]
        ] } },
        { ul: [
          "<b>Namespaces</b> give each container its own PID, network, mount, UTS, IPC and user view.",
          "<b>cgroups</b> limit and account CPU, memory and I/O.",
          "Hardware support: Intel VT-x / AMD-V for CPU, EPT/NPT for nested page tables make VMs near-native speed."
        ] },
        { tip: "One-liner: <i>VMs virtualize the hardware; containers virtualize the operating system.</i>" }
      ]
    },
    {
      id: "real-time-os",
      q: "What is a real-time operating system? Hard vs soft real-time?",
      topic: "Basics & Kernel",
      level: 2,
      top: false,
      short: "An RTOS guarantees that tasks complete within bounded, predictable deadlines; in hard real-time a missed deadline is a system failure (airbag, pacemaker), in soft real-time it only degrades quality (video streaming).",
      a: [
        { p: "Correctness in a real-time system depends on <b>when</b> the result is produced, not just what it is. An RTOS optimises for <b>determinism</b> (bounded worst-case latency), not average throughput." },
        { table: { head: ["", "Hard real-time", "Soft real-time", "Firm"], rows: [
          ["Missed deadline", "Catastrophic failure", "Degraded QoS, still useful", "Result useless but no disaster"],
          ["Examples", "ABS brakes, flight control, pacemaker", "Audio/video playback, online games", "Stock-tick processing, video frames"]
        ] } },
        { ul: [
          "Priority-based <b>preemptive</b> scheduler with fixed priorities; algorithms: <b>Rate Monotonic</b> (shorter period → higher priority) and <b>Earliest Deadline First</b>.",
          "Minimal interrupt latency, no unbounded operations (no paging to disk, avoid dynamic allocation).",
          "Priority-inheritance mutexes to avoid priority inversion.",
          "Examples: FreeRTOS, VxWorks, QNX, Zephyr, RTLinux / PREEMPT_RT."
        ] },
        { warn: "Real-time does not mean 'fast'. A system that always responds in 50 ms is real-time; one that usually takes 1 ms but occasionally 2 s is not." }
      ]
    },

    /* ───────────── Processes & Threads ───────────── */
    {
      id: "process-memory-layout",
      q: "What is a process? Describe the memory layout of a process.",
      topic: "Processes & Threads",
      level: 1,
      top: true,
      short: "A process is a program in execution: code plus its current activity (PC, registers, stack, heap, open files). Its address space is laid out as text, data, BSS, heap growing up, and stack growing down, with the kernel mapped at the top.",
      a: [
        { p: "A <b>program</b> is a passive file on disk; a <b>process</b> is an active entity — one program can have many processes (e.g. several browser tabs or shells)." },
        { svg: `<svg viewBox="0 0 460 300" width="460" class="dg">
  <rect class="box-p" x="130" y="10" width="180" height="30" rx="6"/>
  <text class="tx" x="220" y="25" text-anchor="middle" dominant-baseline="middle">Kernel space</text>
  <rect class="box-a" x="130" y="45" width="180" height="40" rx="6"/>
  <text class="tx tx-b" x="220" y="65" text-anchor="middle" dominant-baseline="middle">Stack</text>
  <rect class="box" x="130" y="90" width="180" height="60" rx="6"/>
  <text class="tx-m" x="220" y="120" text-anchor="middle" dominant-baseline="middle">free / mmap region</text>
  <line class="ln-a" x1="150" y1="94" x2="150" y2="114" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="290" y1="146" x2="290" y2="126" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="130" y="155" width="180" height="40" rx="6"/>
  <text class="tx tx-b" x="220" y="175" text-anchor="middle" dominant-baseline="middle">Heap</text>
  <rect class="box" x="130" y="200" width="180" height="28" rx="6"/>
  <text class="tx" x="220" y="214" text-anchor="middle" dominant-baseline="middle">BSS</text>
  <rect class="box" x="130" y="232" width="180" height="28" rx="6"/>
  <text class="tx" x="220" y="246" text-anchor="middle" dominant-baseline="middle">Data</text>
  <rect class="box-w" x="130" y="264" width="180" height="28" rx="6"/>
  <text class="tx" x="220" y="278" text-anchor="middle" dominant-baseline="middle">Text (code)</text>
  <text class="tx-m" x="10" y="20">high address</text>
  <text class="tx-m" x="10" y="286">low address</text>
  <text class="tx-s" x="318" y="65" dominant-baseline="middle">locals, return addr</text>
  <text class="tx-s" x="318" y="175" dominant-baseline="middle">malloc / new</text>
  <text class="tx-s" x="318" y="214" dominant-baseline="middle">uninit globals (zeroed)</text>
  <text class="tx-s" x="318" y="246" dominant-baseline="middle">initialised globals</text>
  <text class="tx-s" x="318" y="278" dominant-baseline="middle">read-only, shareable</text>
</svg>`, caption: "Virtual address space of a Linux process: stack grows down, heap grows up" },
        { code: `#include <stdio.h>
#include <stdlib.h>

int g_init = 42;      // Data segment
int g_zero;           // BSS segment
const char *msg = "hi"; // pointer in Data, literal in read-only text/rodata

int main(void) {                 // main's code lives in Text
    int local = 7;               // Stack
    int *p = malloc(sizeof(int)); // p on Stack, *p on Heap
    printf("%p %p %p %p\\n", (void*)&g_init, (void*)&g_zero, (void*)&local, (void*)p);
    free(p);
    return 0;
}`, lang: "c", title: "Which segment each variable lives in" },
        { tip: "Stack overflow = stack crosses its limit (deep recursion); heap exhaustion = <code>malloc</code> returns NULL. Mention that each <b>thread</b> gets its own stack but shares text, data and heap." }
      ]
    },
    {
      id: "process-vs-thread",
      q: "What is the difference between a process and a thread?",
      topic: "Processes & Threads",
      level: 1,
      top: true,
      short: "A process is an independent program in execution with its own address space and resources; a thread is a lightweight unit of execution inside a process that shares the process's memory and files but has its own stack, registers and program counter.",
      a: [
        { p: "A process is the unit of <b>resource ownership</b>; a thread is the unit of <b>scheduling / execution</b>. Every process has at least one thread." },
        { table: { head: ["Aspect", "Process", "Thread"], rows: [
          ["Address space", "Own, isolated", "Shared with sibling threads"],
          ["Private state", "Everything", "Stack, registers, PC, thread-local storage"],
          ["Creation cost", "High (<code>fork</code>: copy page tables, PCB)", "Low (<code>pthread_create</code>)"],
          ["Context switch", "Slower — change address space, TLB flush", "Faster within same process"],
          ["Communication", "IPC (pipes, sockets, shared memory)", "Directly via shared variables (needs locks)"],
          ["Fault isolation", "Crash affects only itself", "One thread's crash kills the whole process"]
        ] } },
        { code: `#include <pthread.h>
#include <stdio.h>

int shared = 0;                     // visible to all threads

void *worker(void *arg) {
    int id = *(int *)arg;           // arg and local vars live on this thread's stack
    printf("thread %d sees shared=%d\\n", id, shared);
    return NULL;
}

int main(void) {
    pthread_t t[2];
    int ids[2] = {1, 2};
    shared = 99;
    for (int i = 0; i < 2; i++)
        pthread_create(&t[i], NULL, worker, &ids[i]);
    for (int i = 0; i < 2; i++)
        pthread_join(t[i], NULL);   // wait for both
    return 0;
}
// compile: gcc threads.c -pthread`, lang: "c", title: "Threads share globals (compile with -pthread)" },
        { tip: "Chrome uses a process per tab for isolation (a crashing tab does not kill the browser); a web server uses a thread pool for cheap concurrency. Mentioning such a trade-off impresses." }
      ]
    },
    {
      id: "pcb",
      q: "What is a Process Control Block (PCB)? What does it contain?",
      topic: "Processes & Threads",
      level: 1,
      top: true,
      short: "The PCB is the kernel data structure representing a process; it stores its state, PID, program counter, CPU registers, scheduling info, memory-management info, open files and accounting data, and is what gets saved and restored on a context switch.",
      a: [
        { p: "The OS knows a process only through its <b>PCB</b> (Linux: <code>struct task_struct</code>, Windows: <code>EPROCESS</code>/<code>KTHREAD</code>). PCBs are kept in kernel memory and linked into scheduler queues (ready queue, device wait queues)." },
        { table: { head: ["Field group", "Contents"], rows: [
          ["Identification", "PID, parent PID, user/group IDs"],
          ["Process state", "new, ready, running, waiting, terminated"],
          ["CPU context", "Program counter, stack pointer, general registers, flags"],
          ["Scheduling info", "Priority, nice value, time slice left, queue pointers"],
          ["Memory info", "Page-table base (CR3), segment limits, memory maps"],
          ["I/O & files", "Open file-descriptor table, current directory, signals"],
          ["Accounting", "CPU time used, start time, limits"]
        ] } },
        { tip: "Link it to context switching: the switch is literally 'save CPU context into PCB<sub>old</sub>, load it from PCB<sub>new</sub>'. In Linux, threads also get a <code>task_struct</code>; they just share the <code>mm_struct</code>." }
      ]
    },
    {
      id: "process-states",
      q: "Explain the process state diagram.",
      topic: "Processes & Threads",
      level: 1,
      top: true,
      short: "A process moves New → Ready (admitted) → Running (dispatched); from Running it can go back to Ready (preempted), to Waiting (blocks for I/O/event) or to Terminated (exit); Waiting → Ready when the event completes.",
      a: [
        { svg: `<svg viewBox="0 0 640 225" width="640" class="dg">
  <rect class="box" x="20" y="20" width="100" height="40" rx="6"/>
  <text class="tx tx-b" x="70" y="40" text-anchor="middle" dominant-baseline="middle">New</text>
  <rect class="box-g" x="150" y="100" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="205" y="120" text-anchor="middle" dominant-baseline="middle">Ready</text>
  <rect class="box-a" x="380" y="100" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="435" y="120" text-anchor="middle" dominant-baseline="middle">Running</text>
  <rect class="box-w" x="265" y="175" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="320" y="195" text-anchor="middle" dominant-baseline="middle">Waiting</text>
  <rect class="box-r" x="520" y="20" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="575" y="40" text-anchor="middle" dominant-baseline="middle">Terminated</text>
  <line class="ln" x1="80" y1="60" x2="175" y2="98" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="138" y="70">admitted</text>
  <line class="ln-a" x1="260" y1="112" x2="378" y2="112" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="319" y="105" text-anchor="middle">scheduler dispatch</text>
  <line class="ln" x1="380" y1="130" x2="262" y2="130" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="319" y="146" text-anchor="middle">interrupt / time-out</text>
  <line class="ln" x1="470" y1="100" x2="555" y2="62" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="520" y="92">exit</text>
  <line class="ln" x1="440" y1="140" x2="377" y2="185" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="418" y="178">I/O or event wait</text>
  <line class="ln" x1="265" y1="185" x2="200" y2="142" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="222" y="178" text-anchor="end">I/O done</text>
</svg>`, caption: "Five-state process model" },
        { table: { head: ["State", "Meaning"], rows: [
          ["New", "PCB being created, not yet admitted to the ready queue"],
          ["Ready", "In memory, waiting only for the CPU"],
          ["Running", "Instructions executing on a CPU (at most one process per core)"],
          ["Waiting / Blocked", "Waiting for I/O completion, a lock, a signal or a timer"],
          ["Terminated", "Finished; PCB kept until the parent reads its exit status (zombie)"]
        ] } },
        { p: "Seven-state model adds <b>Suspended Ready</b> and <b>Suspended Blocked</b> — processes swapped out to disk by the medium-term scheduler." },
        { warn: "There is no direct Waiting → Running transition. When I/O completes the process becomes Ready and must be dispatched again." }
      ]
    },
    {
      id: "context-switch",
      q: "What is a context switch? What happens during one and why is it overhead?",
      topic: "Processes & Threads",
      level: 2,
      top: true,
      short: "A context switch is the kernel saving the CPU state of the running process/thread into its PCB and restoring another's so it can run; it is pure overhead because no useful user work happens and caches/TLB are disturbed.",
      a: [
        { p: "Triggered by a timer interrupt (time slice over), a blocking system call, a higher-priority task becoming ready, or <code>yield</code>." },
        { svg: `<svg viewBox="0 0 480 240" width="480" class="dg">
  <text class="tx tx-b" x="80" y="18" text-anchor="middle">Process P0</text>
  <text class="tx tx-b" x="240" y="18" text-anchor="middle">Kernel</text>
  <text class="tx tx-b" x="400" y="18" text-anchor="middle">Process P1</text>
  <line class="ln ln-d" x1="80" y1="28" x2="80" y2="232"/>
  <line class="ln ln-d" x1="240" y1="28" x2="240" y2="232"/>
  <line class="ln ln-d" x1="400" y1="28" x2="400" y2="232"/>
  <rect class="box-g" x="70" y="34" width="20" height="46" rx="6"/>
  <line class="ln-a" x1="90" y1="80" x2="228" y2="80" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="160" y="74" text-anchor="middle">interrupt / syscall</text>
  <rect class="box-w" x="230" y="82" width="20" height="50" rx="6"/>
  <text class="tx-s" x="256" y="98">save state → PCB0</text>
  <text class="tx-s" x="256" y="120">load state ← PCB1</text>
  <line class="ln-a" x1="250" y1="132" x2="388" y2="132" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="390" y="134" width="20" height="46" rx="6"/>
  <text class="tx-m" x="96" y="140">idle (ready)</text>
  <line class="ln" x1="390" y1="180" x2="252" y2="180" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="230" y="182" width="20" height="30" rx="6"/>
  <line class="ln" x1="230" y1="212" x2="92" y2="212" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="160" y="206" text-anchor="middle">resume P0</text>
</svg>`, caption: "Switching the CPU from P0 to P1 and back" },
        { ol: [
          "Interrupt/trap enters kernel mode; hardware pushes minimal state (PC, flags).",
          "Kernel saves remaining registers of P0 into its PCB, marks it Ready or Waiting.",
          "Scheduler picks P1.",
          "If P1 is a different process: load its page-table base (CR3), which may flush the TLB (unless PCIDs/ASIDs are used).",
          "Restore P1's registers and return to user mode at P1's saved PC."
        ] },
        { h: "Why it is costly" },
        { ul: [
          "Direct cost: a few microseconds of kernel code doing no user work.",
          "Indirect cost (usually larger): cold CPU caches, TLB misses, branch-predictor state lost.",
          "Thread switch within the same process is cheaper — no address-space change."
        ] },
        { tip: "Distinguish <b>mode switch</b> (user ↔ kernel, same process) from <b>context switch</b> (process A → process B). Every context switch involves mode switches, but not vice versa." }
      ]
    },
    {
      id: "fork-exec",
      q: "Explain fork(), exec() and wait(). How many times does printf run after n forks?",
      topic: "Processes & Threads",
      level: 2,
      top: true,
      short: "fork() creates a child that is a copy of the parent and returns 0 in the child and the child's PID in the parent; exec() replaces the current process image with a new program; wait() makes the parent block until a child exits and reaps it. n unconditional forks give 2^n processes.",
      a: [
        { ul: [
          "<code>fork()</code> — duplicates the calling process (copy-on-write). Returns <b>0</b> in the child, <b>child PID</b> in the parent, <b>-1</b> on failure.",
          "<code>exec*()</code> — loads a new program into the current process; PID, open fds (unless <code>O_CLOEXEC</code>) are kept; on success it <b>never returns</b>.",
          "<code>wait()/waitpid()</code> — parent blocks until a child terminates, collects its exit status and frees its PCB (prevents zombies)."
        ] },
        { code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) {                 // fork failed
        perror("fork");
        exit(1);
    }
    if (pid == 0) {                // child
        execlp("ls", "ls", "-l", (char *)NULL);
        perror("execlp");          // reached only if exec fails
        _exit(127);
    }
    int status;                    // parent
    waitpid(pid, &status, 0);
    if (WIFEXITED(status))
        printf("child %d exited with %d\\n", pid, WEXITSTATUS(status));
    return 0;
}`, lang: "c", title: "The classic fork + exec + wait pattern (how a shell runs a command)" },
        { h: "Counting puzzle" },
        { code: `int main(void) {
    fork();
    fork();
    fork();
    printf("hello\\n");   // printed 2^3 = 8 times
    return 0;
}`, lang: "c", title: "3 forks → 8 processes" },
        { p: "Each fork doubles the number of processes, so <b>n</b> sequential forks give <b>2<sup>n</sup></b> processes (and 2<sup>n</sup> − 1 children). For <code>fork() &amp;&amp; fork() || fork();</code> short-circuiting matters — trace the tree: the answer is 5 processes." },
        { warn: "Output buffering trap: <code>printf(\"x\"); fork();</code> without a newline can print <b>x</b> twice, because the unflushed stdio buffer is copied into the child." },
        { tip: "Why separate fork and exec? Between them the child can redirect fds (<code>dup2</code>) or change directory — that is exactly how shells implement <code>ls &gt; out.txt</code> and pipes." }
      ]
    },
    {
      id: "zombie-orphan",
      q: "What are zombie and orphan processes?",
      topic: "Processes & Threads",
      level: 2,
      top: true,
      short: "A zombie is a child that has exited but whose parent has not yet called wait(), so its PCB entry and exit status remain in the process table; an orphan is a child whose parent exited first — it is adopted by init/systemd (PID 1), which reaps it.",
      a: [
        { table: { head: ["", "Zombie (defunct)", "Orphan"], rows: [
          ["Who died", "Child", "Parent"],
          ["Still running?", "No — only a process-table entry remains", "Yes, keeps running"],
          ["Resolved by", "Parent calling <code>wait()</code>, or parent dying (then init reaps)", "Re-parented to PID 1 (or a subreaper) which will wait() for it"],
          ["Harm", "Consumes a PID slot; many zombies can exhaust PIDs", "Usually harmless (daemons are intentionally orphaned)"],
          ["<code>ps</code> shows", "State <code>Z</code>, <code>&lt;defunct&gt;</code>", "PPID = 1"]
        ] } },
        { code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        printf("child %d exiting\\n", getpid());
        exit(0);                 // child dies immediately
    }
    // parent never calls wait(): child stays a ZOMBIE for 30 s
    printf("run: ps -o pid,ppid,stat,cmd -p %d\\n", pid);
    sleep(30);
    return 0;                    // parent exits -> init reaps the zombie
}`, lang: "c", title: "Creating a zombie" },
        { p: "Swap the roles (parent exits, child sleeps) and you get an <b>orphan</b>: <code>getppid()</code> in the child changes to 1." },
        { tip: "You cannot <code>kill -9</code> a zombie — it is already dead. Fix the parent (install a <code>SIGCHLD</code> handler that calls <code>waitpid(-1, NULL, WNOHANG)</code> in a loop) or kill the parent." }
      ]
    },
    {
      id: "ipc-methods",
      q: "What is Inter-Process Communication? Explain the different IPC mechanisms.",
      topic: "Processes & Threads",
      level: 2,
      top: true,
      short: "IPC lets isolated processes exchange data and synchronise; the two models are shared memory and message passing, implemented via pipes, named pipes (FIFOs), message queues, shared memory, semaphores, signals and sockets.",
      a: [
        { p: "Processes have separate address spaces, so the kernel must provide a channel. Two fundamental models:" },
        { ul: [
          "<b>Shared memory</b> — kernel maps the same physical pages into both processes; after setup no syscalls are needed, so it is the <b>fastest</b>, but you must synchronise yourself.",
          "<b>Message passing</b> — processes <code>send/receive</code> via the kernel; simpler and works across machines, but every message costs syscalls and copies."
        ] },
        { table: { head: ["Mechanism", "Direction / scope", "Notes"], rows: [
          ["Pipe (<code>pipe()</code>)", "Unidirectional, related processes", "Byte stream; <code>ls | wc</code>"],
          ["Named pipe (FIFO)", "Unidirectional, unrelated processes", "Has a path in the FS (<code>mkfifo</code>)"],
          ["Message queue", "Many-to-many, message boundaries kept", "POSIX <code>mq_open</code>, System V <code>msgget</code>"],
          ["Shared memory", "Any processes that map it", "Fastest; <code>shm_open + mmap</code>"],
          ["Semaphore", "Synchronisation only", "Often paired with shared memory"],
          ["Signal", "Asynchronous notification", "Tiny payload (signal number)"],
          ["Socket", "Bidirectional, same host or network", "Unix-domain sockets for local IPC"]
        ] } },
        { code: `#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fd[2];                     // fd[0] = read end, fd[1] = write end
    pipe(fd);
    if (fork() == 0) {             // child: reader
        close(fd[1]);
        char buf[64];
        ssize_t n = read(fd[0], buf, sizeof buf - 1);
        buf[n] = '\\0';
        printf("child got: %s\\n", buf);
        return 0;
    }
    close(fd[0]);                  // parent: writer
    const char *msg = "hello via pipe";
    write(fd[1], msg, strlen(msg));
    close(fd[1]);
    wait(NULL);
    return 0;
}`, lang: "c", title: "Parent → child through an anonymous pipe" },
        { tip: "If asked 'which is fastest?' — shared memory, because data is not copied through the kernel. Follow with 'but it needs a semaphore or mutex for synchronisation'." }
      ]
    },
    {
      id: "user-vs-kernel-threads",
      q: "What is the difference between user-level threads and kernel-level threads?",
      topic: "Processes & Threads",
      level: 2,
      top: true,
      short: "User-level threads are managed by a runtime library in user space without kernel knowledge (fast to create/switch but one blocking call blocks all, no true parallelism); kernel-level threads are managed and scheduled by the OS (can run in parallel on cores and block independently, but switches cost a syscall).",
      a: [
        { table: { head: ["", "User-level threads", "Kernel-level threads"], rows: [
          ["Managed by", "Thread library in user space", "OS kernel"],
          ["Kernel aware?", "No — sees one process", "Yes — each has a kernel TCB"],
          ["Create / switch cost", "Very cheap (function call)", "Costlier (syscall, kernel scheduling)"],
          ["Blocking syscall", "Blocks the entire process", "Only that thread blocks"],
          ["Multicore parallelism", "No (in pure many-to-one)", "Yes"],
          ["Scheduling policy", "Customisable by app", "Kernel's policy"],
          ["Examples", "Early Java green threads, GNU Pth", "Linux NPTL pthreads, Windows threads"]
        ] } },
        { p: "Modern runtimes combine both: <b>Go goroutines</b>, <b>Java virtual threads</b> (JDK 21) and <b>Erlang processes</b> are user-level tasks multiplexed onto a pool of kernel threads (M:N), and they avoid the blocking problem by using non-blocking I/O under the hood." },
        { tip: "Link to the next question — the mapping between the two is the <b>multithreading model</b> (many-to-one, one-to-one, many-to-many)." }
      ]
    },
    {
      id: "multithreading-models",
      q: "Explain the multithreading models: many-to-one, one-to-one and many-to-many.",
      topic: "Processes & Threads",
      level: 2,
      top: false,
      short: "Many-to-one maps all user threads onto one kernel thread (no parallelism, one block blocks all); one-to-one maps each user thread to its own kernel thread (Linux, Windows); many-to-many multiplexes M user threads onto N kernel threads (Go, Java virtual threads).",
      a: [
        { table: { head: ["Model", "Mapping", "Pros", "Cons", "Used by"], rows: [
          ["Many-to-one", "M user : 1 kernel", "Cheap switches", "No parallelism; one blocking call blocks all", "Green threads, GNU Pth"],
          ["One-to-one", "1 : 1", "True parallelism, independent blocking", "Kernel thread per user thread limits scale", "Linux NPTL, Windows, macOS"],
          ["Many-to-many", "M : N (N ≤ M)", "Scale + parallelism", "Complex runtime scheduler", "Go runtime, Java virtual threads, Erlang BEAM"],
          ["Two-level", "M:N plus some bound 1:1", "Pin critical threads", "Complex", "Old Solaris, IRIX"]
        ] } },
        { p: "Linux has no special 'thread' object: <code>clone()</code> creates a task that shares memory, files and signal handlers with its parent — that is a thread (one-to-one)." },
        { tip: "Good closing line: 'OS vendors moved to one-to-one because cores became plentiful and kernel threads became cheap; language runtimes moved to M:N to support millions of lightweight tasks.'" }
      ]
    },
    {
      id: "process-schedulers",
      q: "What are long-term, short-term and medium-term schedulers?",
      topic: "Processes & Threads",
      level: 2,
      top: false,
      short: "The long-term (job) scheduler admits jobs into memory and controls the degree of multiprogramming; the short-term (CPU) scheduler picks the next ready process to run, very frequently; the medium-term scheduler swaps processes out/in to reduce memory pressure.",
      a: [
        { table: { head: ["", "Long-term (job)", "Short-term (CPU)", "Medium-term (swapper)"], rows: [
          ["Decides", "Which new jobs enter the ready queue", "Which ready process gets the CPU next", "Which processes to suspend/swap out and back in"],
          ["Frequency", "Seconds–minutes", "Every few ms", "In between"],
          ["Controls", "Degree of multiprogramming, I/O- vs CPU-bound mix", "CPU utilisation, response time", "Memory pressure, thrashing"],
          ["Transitions", "New → Ready", "Ready → Running", "Ready/Blocked ↔ Suspended"]
        ] } },
        { p: "The <b>dispatcher</b> is the module that actually hands the CPU to the chosen process: context switch, switch to user mode, jump to PC. <b>Dispatch latency</b> is the time it takes." },
        { p: "Modern time-sharing systems (Linux, Windows) have essentially no long-term scheduler — every program you launch is admitted; memory pressure is handled by paging instead." }
      ]
    },

    /* ───────────── CPU Scheduling ───────────── */
    {
      id: "scheduling-criteria",
      q: "What are the CPU scheduling criteria? What is preemptive vs non-preemptive scheduling?",
      topic: "CPU Scheduling",
      level: 1,
      top: true,
      short: "Schedulers are judged on CPU utilisation, throughput, turnaround time, waiting time and response time; preemptive scheduling can take the CPU away from a running process (timer/higher priority), non-preemptive lets it run until it blocks or finishes.",
      a: [
        { h: "Criteria and formulas" },
        { table: { head: ["Metric", "Definition", "Want"], rows: [
          ["CPU utilisation", "% of time CPU is busy", "Max"],
          ["Throughput", "Processes completed per unit time", "Max"],
          ["Turnaround time (TAT)", "<code>TAT = Completion − Arrival</code>", "Min"],
          ["Waiting time (WT)", "Time spent in ready queue: <code>WT = TAT − Burst</code>", "Min"],
          ["Response time (RT)", "<code>RT = First run − Arrival</code>", "Min (interactive)"]
        ] } },
        { h: "Preemptive vs non-preemptive" },
        { table: { head: ["", "Non-preemptive", "Preemptive"], rows: [
          ["CPU released when", "Process terminates or blocks", "Also on timer interrupt or when a higher-priority process arrives"],
          ["Algorithms", "FCFS, SJF, non-preemptive priority", "SRTF, Round Robin, preemptive priority, MLFQ"],
          ["Response time", "Poor for interactive users", "Good"],
          ["Overhead", "Low (few switches)", "Higher; needs synchronisation of shared kernel data"]
        ] } },
        { tip: "Always write the two formulas first when solving a scheduling numeric: <b>TAT = CT − AT</b>, <b>WT = TAT − BT</b>. Examiners give marks for them." }
      ]
    },
    {
      id: "fcfs-sjf-srtf",
      q: "Explain FCFS, SJF and SRTF scheduling with a worked example and Gantt charts.",
      topic: "CPU Scheduling",
      level: 2,
      top: true,
      short: "FCFS runs processes in arrival order (simple, suffers convoy effect); SJF runs the shortest next burst (optimal average waiting time among non-preemptive); SRTF is preemptive SJF — it switches whenever a new process has a shorter remaining time.",
      a: [
        { p: "Example (times in ms):" },
        { table: { head: ["Process", "Arrival", "Burst"], rows: [["P1", "0", "8"], ["P2", "1", "4"], ["P3", "2", "9"], ["P4", "3", "5"]] } },
        { svg: `<svg viewBox="0 0 620 172" width="620" class="dg">
  <text class="tx tx-b" x="10" y="24" dominant-baseline="middle">FCFS</text>
  <rect class="box-a" x="60" y="10" width="160" height="28" rx="6"/><text class="tx" x="140" y="24" text-anchor="middle" dominant-baseline="middle">P1</text>
  <rect class="box-g" x="220" y="10" width="80" height="28" rx="6"/><text class="tx" x="260" y="24" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box-p" x="300" y="10" width="180" height="28" rx="6"/><text class="tx" x="390" y="24" text-anchor="middle" dominant-baseline="middle">P3</text>
  <rect class="box-w" x="480" y="10" width="100" height="28" rx="6"/><text class="tx" x="530" y="24" text-anchor="middle" dominant-baseline="middle">P4</text>
  <text class="tx-s" x="60" y="50" text-anchor="middle">0</text><text class="tx-s" x="220" y="50" text-anchor="middle">8</text><text class="tx-s" x="300" y="50" text-anchor="middle">12</text><text class="tx-s" x="480" y="50" text-anchor="middle">21</text><text class="tx-s" x="580" y="50" text-anchor="middle">26</text>
  <text class="tx tx-b" x="10" y="78" dominant-baseline="middle">SJF</text>
  <rect class="box-a" x="60" y="64" width="160" height="28" rx="6"/><text class="tx" x="140" y="78" text-anchor="middle" dominant-baseline="middle">P1</text>
  <rect class="box-g" x="220" y="64" width="80" height="28" rx="6"/><text class="tx" x="260" y="78" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box-w" x="300" y="64" width="100" height="28" rx="6"/><text class="tx" x="350" y="78" text-anchor="middle" dominant-baseline="middle">P4</text>
  <rect class="box-p" x="400" y="64" width="180" height="28" rx="6"/><text class="tx" x="490" y="78" text-anchor="middle" dominant-baseline="middle">P3</text>
  <text class="tx-s" x="60" y="104" text-anchor="middle">0</text><text class="tx-s" x="220" y="104" text-anchor="middle">8</text><text class="tx-s" x="300" y="104" text-anchor="middle">12</text><text class="tx-s" x="400" y="104" text-anchor="middle">17</text><text class="tx-s" x="580" y="104" text-anchor="middle">26</text>
  <text class="tx tx-b" x="10" y="132" dominant-baseline="middle">SRTF</text>
  <rect class="box-a" x="60" y="118" width="20" height="28" rx="6"/>
  <rect class="box-g" x="80" y="118" width="80" height="28" rx="6"/><text class="tx" x="120" y="132" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box-w" x="160" y="118" width="100" height="28" rx="6"/><text class="tx" x="210" y="132" text-anchor="middle" dominant-baseline="middle">P4</text>
  <rect class="box-a" x="260" y="118" width="140" height="28" rx="6"/><text class="tx" x="330" y="132" text-anchor="middle" dominant-baseline="middle">P1</text>
  <rect class="box-p" x="400" y="118" width="180" height="28" rx="6"/><text class="tx" x="490" y="132" text-anchor="middle" dominant-baseline="middle">P3</text>
  <text class="tx-s" x="60" y="158" text-anchor="middle">0</text><text class="tx-s" x="80" y="158" text-anchor="middle">1</text><text class="tx-s" x="160" y="158" text-anchor="middle">5</text><text class="tx-s" x="260" y="158" text-anchor="middle">10</text><text class="tx-s" x="400" y="158" text-anchor="middle">17</text><text class="tx-s" x="580" y="158" text-anchor="middle">26</text>
</svg>`, caption: "Gantt charts; in SRTF P1 runs 0–1, is preempted by P2, and resumes at 10" },
        { table: { head: ["Process", "FCFS CT / TAT / WT", "SJF CT / TAT / WT", "SRTF CT / TAT / WT"], rows: [
          ["P1", "8 / 8 / 0", "8 / 8 / 0", "17 / 17 / 9"],
          ["P2", "12 / 11 / 7", "12 / 11 / 7", "5 / 4 / 0"],
          ["P3", "21 / 19 / 10", "26 / 24 / 15", "26 / 24 / 15"],
          ["P4", "26 / 23 / 18", "17 / 14 / 9", "10 / 7 / 2"],
          ["<b>Average</b>", "<b>TAT 15.25, WT 8.75</b>", "<b>TAT 14.25, WT 7.75</b>", "<b>TAT 13, WT 6.5</b>"]
        ] } },
        { ul: [
          "<b>FCFS</b> — simplest (a FIFO queue), non-preemptive. Suffers the <b>convoy effect</b>: one long CPU-bound job makes many short I/O-bound jobs wait behind it, lowering both CPU and device utilisation.",
          "<b>SJF</b> — provably optimal average waiting time for a given set of jobs, but burst lengths are unknown; the OS predicts them with exponential averaging: <code>τ<sub>n+1</sub> = α·t<sub>n</sub> + (1−α)·τ<sub>n</sub></code>.",
          "<b>SRTF</b> — preemptive SJF; best average WT overall, but more context switches and long jobs can <b>starve</b>."
        ] },
        { tip: "In SRTF, re-evaluate at every <b>arrival</b>: at t=1 P2 (4) &lt; P1's remaining (7), so preempt. Say this aloud while drawing — it shows you are not just memorising the answer." }
      ]
    },
    {
      id: "round-robin",
      q: "Explain Round Robin scheduling with an example. How does the time quantum affect it?",
      topic: "CPU Scheduling",
      level: 2,
      top: true,
      short: "Round Robin gives each ready process a fixed time quantum in circular (FIFO) order, preempting it when the quantum expires; a very large quantum degenerates into FCFS, a very small one causes excessive context-switch overhead.",
      a: [
        { p: "Example: all arrive at 0; bursts P1 = 10, P2 = 4, P3 = 7; <b>quantum q = 3</b>." },
        { svg: `<svg viewBox="0 0 600 90" width="600" class="dg">
  <rect class="box-a" x="30" y="20" width="78" height="34" rx="6"/><text class="tx" x="69" y="37" text-anchor="middle" dominant-baseline="middle">P1</text>
  <rect class="box-g" x="108" y="20" width="78" height="34" rx="6"/><text class="tx" x="147" y="37" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box-p" x="186" y="20" width="78" height="34" rx="6"/><text class="tx" x="225" y="37" text-anchor="middle" dominant-baseline="middle">P3</text>
  <rect class="box-a" x="264" y="20" width="78" height="34" rx="6"/><text class="tx" x="303" y="37" text-anchor="middle" dominant-baseline="middle">P1</text>
  <rect class="box-g" x="342" y="20" width="26" height="34" rx="6"/><text class="tx-s" x="355" y="37" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box-p" x="368" y="20" width="78" height="34" rx="6"/><text class="tx" x="407" y="37" text-anchor="middle" dominant-baseline="middle">P3</text>
  <rect class="box-a" x="446" y="20" width="78" height="34" rx="6"/><text class="tx" x="485" y="37" text-anchor="middle" dominant-baseline="middle">P1</text>
  <rect class="box-p" x="524" y="20" width="26" height="34" rx="6"/><text class="tx-s" x="537" y="37" text-anchor="middle" dominant-baseline="middle">P3</text>
  <rect class="box-a" x="550" y="20" width="26" height="34" rx="6"/><text class="tx-s" x="563" y="37" text-anchor="middle" dominant-baseline="middle">P1</text>
  <text class="tx-s" x="30" y="72" text-anchor="middle">0</text><text class="tx-s" x="108" y="72" text-anchor="middle">3</text><text class="tx-s" x="186" y="72" text-anchor="middle">6</text><text class="tx-s" x="264" y="72" text-anchor="middle">9</text><text class="tx-s" x="342" y="72" text-anchor="middle">12</text><text class="tx-s" x="368" y="72" text-anchor="middle">13</text><text class="tx-s" x="446" y="72" text-anchor="middle">16</text><text class="tx-s" x="524" y="72" text-anchor="middle">19</text><text class="tx-s" x="550" y="72" text-anchor="middle">20</text><text class="tx-s" x="576" y="72" text-anchor="middle">21</text>
</svg>`, caption: "Round Robin, q = 3" },
        { table: { head: ["Process", "Burst", "Completion", "TAT = CT − 0", "WT = TAT − BT"], rows: [
          ["P1", "10", "21", "21", "11"],
          ["P2", "4", "13", "13", "9"],
          ["P3", "7", "20", "20", "13"],
          ["<b>Average</b>", "", "", "<b>18</b>", "<b>11</b>"]
        ] } },
        { h: "Choosing the quantum" },
        { ul: [
          "q → ∞: becomes <b>FCFS</b>.",
          "q → very small: nearly perfect sharing but context-switch overhead dominates.",
          "Rule of thumb: ~80% of CPU bursts should finish within one quantum; typical values 10–100 ms, and q should be much larger than the context-switch time."
        ] },
        { p: "RR has worse average turnaround than SJF but much better <b>response time</b>, and no starvation — every process gets the CPU at most (n−1)·q after it becomes ready." },
        { warn: "When a process's quantum expires at the same instant a new process arrives, the convention (Silberschatz) is: the newly arrived process joins the ready queue <b>before</b> the preempted one. State your assumption explicitly." }
      ]
    },
    {
      id: "priority-starvation-aging",
      q: "Explain priority scheduling. What is starvation and how does aging solve it?",
      topic: "CPU Scheduling",
      level: 2,
      top: true,
      short: "Priority scheduling runs the highest-priority ready process (preemptively or not); low-priority processes may wait indefinitely (starvation); aging gradually raises the priority of processes that wait long so they eventually run.",
      a: [
        { p: "Each process has a priority number (here smaller = higher). SJF is a special case where priority = predicted burst." },
        { table: { head: ["Process", "Burst", "Priority"], rows: [["P1", "10", "3"], ["P2", "1", "1"], ["P3", "2", "4"], ["P4", "1", "5"], ["P5", "5", "2"]] } },
        { p: "Non-preemptive, all arrive at 0 → order <b>P2 (0–1), P5 (1–6), P1 (6–16), P3 (16–18), P4 (18–19)</b>. Waiting times 6, 0, 16, 18, 1 → average <b>8.2 ms</b>." },
        { h: "Starvation" },
        { p: "If high-priority processes keep arriving, a low-priority one may <b>never</b> get the CPU (indefinite blocking). Legend says a low-priority job on MIT's IBM 7094 was found still waiting when the machine was shut down in 1973 — submitted in 1967." },
        { h: "Aging" },
        { p: "Increase the priority of a waiting process over time, e.g. raise it by 1 every 15 minutes (or boost in the MLFQ sense). Eventually it becomes the highest priority and runs." },
        { tip: "Distinguish starvation from deadlock: in starvation the system is still making progress (others run), only one process is perpetually overlooked; in deadlock a set of processes are all stuck waiting for each other." }
      ]
    },
    {
      id: "mlq-mlfq",
      q: "What are Multilevel Queue and Multilevel Feedback Queue scheduling?",
      topic: "CPU Scheduling",
      level: 2,
      top: true,
      short: "Multilevel queue permanently partitions processes into separate queues (e.g. system, interactive, batch) each with its own algorithm and fixed priority between queues; MLFQ lets processes move between queues based on behaviour — CPU hogs are demoted, waiting/I-O-bound ones are promoted — approximating SJF without knowing burst times.",
      a: [
        { svg: `<svg viewBox="0 0 580 205" width="580" class="dg">
  <rect class="box-a" x="40" y="20" width="290" height="36" rx="6"/>
  <text class="tx" x="185" y="38" text-anchor="middle" dominant-baseline="middle">Q0 · RR, q = 8 ms (highest priority)</text>
  <rect class="box-w" x="40" y="80" width="290" height="36" rx="6"/>
  <text class="tx" x="185" y="98" text-anchor="middle" dominant-baseline="middle">Q1 · RR, q = 16 ms</text>
  <rect class="box-p" x="40" y="140" width="290" height="36" rx="6"/>
  <text class="tx" x="185" y="158" text-anchor="middle" dominant-baseline="middle">Q2 · FCFS (lowest priority)</text>
  <rect class="box-g" x="450" y="75" width="110" height="50" rx="6"/>
  <text class="tx tx-b" x="505" y="100" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <line class="ln" x1="330" y1="38" x2="448" y2="88" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="98" x2="448" y2="100" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="158" x2="448" y2="112" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="100" y1="56" x2="100" y2="78" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="100" y1="116" x2="100" y2="138" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="108" y="70">used full quantum → demote</text>
  <polyline class="ln-a ln-d" points="40,165 20,165 20,32 38,32" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="10" y="196">aging / periodic boost: move starved jobs back up</text>
</svg>`, caption: "MLFQ: new jobs enter Q0; lower queues run only when higher ones are empty" },
        { table: { head: ["", "Multilevel Queue (MLQ)", "Multilevel Feedback Queue (MLFQ)"], rows: [
          ["Queue membership", "Fixed at admission (by type)", "Dynamic, based on observed CPU usage"],
          ["Starvation", "Possible for lower queues", "Prevented by aging / priority boost"],
          ["Needs burst knowledge?", "No", "No — it learns it"],
          ["Complexity", "Simple", "Most general, most parameters to tune"]
        ] } },
        { h: "MLFQ rules (typical)" },
        { ol: [
          "A new process enters the highest-priority queue.",
          "If it uses up its whole quantum, it is demoted one level (it looks CPU-bound).",
          "If it gives up the CPU before the quantum ends (I/O), it stays at the same level (interactive).",
          "Higher queues strictly preempt lower ones.",
          "Periodically boost everyone to the top (aging) so nobody starves and phase changes are handled."
        ] },
        { p: "MLFQ is defined by: number of queues, algorithm per queue, quantum per queue, and the promote/demote rules. Windows and classic BSD/Solaris schedulers are MLFQ-style." },
        { tip: "Say why it is clever: short interactive jobs finish in the top queue quickly (like SJF), long batch jobs sink and run when the CPU is otherwise idle — no burst prediction required." }
      ]
    },
    {
      id: "linux-cfs",
      q: "How does the Linux Completely Fair Scheduler (CFS) work?",
      topic: "CPU Scheduling",
      level: 3,
      top: false,
      short: "CFS tracks each task's virtual runtime (actual runtime weighted by nice value), keeps runnable tasks in a red-black tree ordered by vruntime and always runs the leftmost (least-served) task; since Linux 6.6 it has been replaced by EEVDF, which adds latency-aware deadlines.",
      a: [
        { p: "CFS (Linux 2.6.23 → 6.5) models an 'ideal, precise multitasking CPU' where each of n tasks gets 1/n of the CPU." },
        { ul: [
          "<b>vruntime</b>: time the task has run, scaled by its weight — nice −20 tasks accumulate vruntime slowly, nice +19 quickly.",
          "Runnable tasks live in a <b>red-black tree</b> keyed by vruntime; the leftmost node (smallest vruntime) is picked in O(1) (cached), insertions are O(log n).",
          "No fixed quantum: the time slice is proportional to weight within a <b>target latency</b> (e.g. 6 ms), bounded by a minimum granularity.",
          "A task that sleeps (I/O-bound) has low vruntime when it wakes, so it runs soon — interactive tasks feel responsive without explicit priority boosting.",
          "Real-time classes (<code>SCHED_FIFO</code>, <code>SCHED_RR</code>, <code>SCHED_DEADLINE</code>) always preempt CFS tasks."
        ] },
        { p: "<b>EEVDF</b> (Earliest Eligible Virtual Deadline First) became the default fair scheduler in Linux 6.6 (2023): each task gets a virtual deadline based on its requested slice, giving latency-sensitive tasks a way to be scheduled sooner without taking more total CPU." },
        { tip: "If asked 'which data structure?' — red-black tree keyed by vruntime. That single detail is what most interviewers are checking." }
      ]
    },

    /* ───────────── Synchronization ───────────── */
    {
      id: "race-condition",
      q: "What is a race condition? Give an example.",
      topic: "Synchronization",
      level: 1,
      top: true,
      short: "A race condition occurs when the result depends on the unpredictable interleaving of threads accessing shared data, at least one of them writing, without synchronisation — e.g. two threads doing counter++ can lose updates.",
      a: [
        { p: "<code>counter++</code> looks atomic but compiles to three steps: <b>load</b> into register, <b>add</b>, <b>store</b>. If two threads interleave between load and store, one increment is lost." },
        { table: { head: ["Time", "Thread A", "Thread B", "counter"], rows: [
          ["t1", "load r = 5", "", "5"],
          ["t2", "", "load r = 5", "5"],
          ["t3", "r = 6, store", "", "6"],
          ["t4", "", "r = 6, store", "<b>6</b> (should be 7)"]
        ] } },
        { code: `#include <pthread.h>
#include <stdio.h>

long counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *inc(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&lock);    // remove lock/unlock to see the race
        counter++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, inc, NULL);
    pthread_create(&b, NULL, inc, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("counter = %ld\\n", counter);  // 2000000 with the mutex, less without
    return 0;
}`, lang: "c", title: "Lost updates without the mutex" },
        { p: "Fixes: mutual exclusion (mutex), atomic operations (<code>atomic_fetch_add</code>, <code>std::atomic&lt;long&gt;</code>), or avoid sharing (thread-local counters combined at the end)." },
        { warn: "<code>volatile</code> does <b>not</b> fix races in C/C++ — it prevents some compiler caching but gives no atomicity or memory-ordering guarantees." }
      ]
    },
    {
      id: "critical-section",
      q: "What is the critical-section problem? What are the three requirements of a solution?",
      topic: "Synchronization",
      level: 1,
      top: true,
      short: "A critical section is code that accesses shared resources and must not be executed by more than one process at a time; a correct solution must satisfy mutual exclusion, progress and bounded waiting.",
      a: [
        { code: `do {
    /* entry section   */   // acquire permission
    /* critical section */  // touch shared data
    /* exit section    */   // release permission
    /* remainder section */
} while (1);`, lang: "text", title: "General structure of a process" },
        { h: "Three requirements" },
        { ol: [
          "<b>Mutual exclusion</b> — at most one process is in its critical section at any time.",
          "<b>Progress</b> — if no one is in the CS and some want to enter, only those processes take part in deciding who goes next, and the decision cannot be postponed indefinitely (no one outside the CS can block entry).",
          "<b>Bounded waiting</b> — there is a limit on how many times others can enter the CS after a process has requested entry and before that request is granted (no starvation)."
        ] },
        { p: "Solutions: software (Peterson's algorithm), hardware (disable interrupts on a uniprocessor, test-and-set, compare-and-swap), and OS/language primitives (mutex, semaphore, monitor)." },
        { tip: "Common follow-up: 'Does strict alternation (turn variable only) work?' — it gives mutual exclusion but <b>violates progress</b>: if P0 is in its remainder section and it is P0's turn, P1 cannot enter even though the CS is free." }
      ]
    },
    {
      id: "mutex-vs-semaphore",
      q: "What is the difference between a mutex and a semaphore?",
      topic: "Synchronization",
      level: 1,
      top: true,
      short: "A mutex is a locking mechanism with ownership — only the thread that locked it may unlock it — used for mutual exclusion; a semaphore is a signalling counter with wait/signal operations that any thread can signal, used to control access to N resources or to order events.",
      a: [
        { table: { head: ["", "Mutex", "Semaphore"], rows: [
          ["Concept", "Lock (mutual exclusion)", "Signalling integer counter"],
          ["Values", "Locked / unlocked", "0 … N (counting) or 0/1 (binary)"],
          ["Ownership", "Yes — owner must unlock", "No — any thread may <code>post</code>"],
          ["Operations", "<code>lock()</code> / <code>unlock()</code>", "<code>wait()</code> (P, down) / <code>signal()</code> (V, up)"],
          ["Typical use", "Protect a critical section", "Limit concurrency to N, producer–consumer, event ordering"],
          ["Priority inheritance", "Possible (owner known)", "Not possible (no owner)"],
          ["Recursive lock", "Recursive mutex variant exists", "N/A"]
        ] } },
        { code: `#include <pthread.h>
#include <semaphore.h>

pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
sem_t slots;                         // counting semaphore

void critical(void) {
    pthread_mutex_lock(&m);          // only ONE thread inside
    /* ... update shared structure ... */
    pthread_mutex_unlock(&m);        // must be the same thread
}

void use_resource(void) {
    sem_wait(&slots);                // up to N threads pass
    /* ... use one of N identical resources ... */
    sem_post(&slots);                // could even be posted by another thread
}

int main(void) {
    sem_init(&slots, 0, 3);          // 0 = shared between threads; initial value N = 3
    critical();
    use_resource();
    sem_destroy(&slots);
    return 0;
}`, lang: "c", title: "POSIX mutex vs counting semaphore" },
        { p: "Semaphore definitions (Dijkstra): <code>wait(S): while (S &lt;= 0) block; S--;</code> and <code>signal(S): S++; wake one waiter;</code> — both executed atomically." },
        { warn: "'A binary semaphore is the same as a mutex' is only half true. They behave alike for locking, but a mutex has <b>ownership</b> (enables error checking, priority inheritance), while a semaphore can be signalled by a different thread — which is exactly what makes it useful for signalling." },
        { tip: "Analogy that interviewers like: a mutex is the <b>key</b> to a single toilet; a semaphore is the <b>number of free keys</b> at a hotel reception." }
      ]
    },
    {
      id: "binary-vs-counting-semaphore",
      q: "What is the difference between a binary and a counting semaphore? Show usage.",
      topic: "Synchronization",
      level: 2,
      top: true,
      short: "A binary semaphore takes only 0 and 1 and is used for mutual exclusion or one-shot signalling; a counting semaphore ranges over 0..N and tracks N identical resources, allowing up to N concurrent holders.",
      a: [
        { table: { head: ["", "Binary semaphore", "Counting semaphore"], rows: [
          ["Range", "0 or 1", "0 … N (unbounded in theory)"],
          ["Initial value", "1 (lock) or 0 (signal)", "Number of available resources"],
          ["Use case", "Mutual exclusion, 'event happened' signal", "Connection/thread pools, bounded buffers, parking lot"]
        ] } },
        { code: `#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <unistd.h>

sem_t pool;                 // counting: 3 DB connections
sem_t ready;                // binary used as a signal, starts at 0

void *client(void *arg) {
    long id = (long)arg;
    sem_wait(&pool);        // at most 3 clients in here at once
    printf("client %ld using a connection\\n", id);
    sleep(1);
    sem_post(&pool);
    return NULL;
}

void *init_thread(void *arg) {
    (void)arg;
    printf("config loaded\\n");
    sem_post(&ready);       // signal: 0 -> 1
    return NULL;
}

int main(void) {
    sem_init(&pool, 0, 3);
    sem_init(&ready, 0, 0);
    pthread_t it, c[6];
    pthread_create(&it, NULL, init_thread, NULL);
    sem_wait(&ready);       // block until init_thread signals
    for (long i = 0; i < 6; i++) pthread_create(&c[i], NULL, client, (void *)i);
    for (int i = 0; i < 6; i++) pthread_join(c[i], NULL);
    pthread_join(it, NULL);
    return 0;
}`, lang: "c", title: "Counting semaphore as a pool, binary semaphore as a signal" },
        { p: "With 6 clients and a pool of 3 the output appears in two waves of three, one second apart." },
        { tip: "A semaphore's value, if negative in the textbook 'blocking' implementation, equals the number of waiting processes — a nice detail to mention." }
      ]
    },
    {
      id: "producer-consumer",
      q: "Explain the producer–consumer (bounded buffer) problem and solve it with semaphores.",
      topic: "Synchronization",
      level: 2,
      top: true,
      short: "Producers put items into a fixed-size buffer and consumers remove them; producers must wait when the buffer is full, consumers when empty, and buffer updates must be mutually exclusive — solved with semaphores empty = N, full = 0 and a mutex.",
      a: [
        { svg: `<svg viewBox="0 0 600 150" width="600" class="dg">
  <text class="tx-m" x="300" y="22" text-anchor="middle">full = 3 (items)   ·   empty = 3 (free slots)   ·   mutex = 1</text>
  <rect class="box-g" x="20" y="50" width="100" height="40" rx="6"/>
  <text class="tx tx-b" x="70" y="70" text-anchor="middle" dominant-baseline="middle">Producer</text>
  <rect class="box" x="160" y="50" width="46" height="40" rx="6"/>
  <rect class="box-a" x="210" y="50" width="46" height="40" rx="6"/>
  <text class="tx-s" x="233" y="70" text-anchor="middle" dominant-baseline="middle">item</text>
  <rect class="box-a" x="260" y="50" width="46" height="40" rx="6"/>
  <text class="tx-s" x="283" y="70" text-anchor="middle" dominant-baseline="middle">item</text>
  <rect class="box-a" x="310" y="50" width="46" height="40" rx="6"/>
  <text class="tx-s" x="333" y="70" text-anchor="middle" dominant-baseline="middle">item</text>
  <rect class="box" x="360" y="50" width="46" height="40" rx="6"/>
  <rect class="box" x="410" y="50" width="46" height="40" rx="6"/>
  <rect class="box-p" x="480" y="50" width="100" height="40" rx="6"/>
  <text class="tx tx-b" x="530" y="70" text-anchor="middle" dominant-baseline="middle">Consumer</text>
  <line class="ln" x1="120" y1="70" x2="158" y2="70" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="456" y1="70" x2="478" y2="70" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="233" y1="125" x2="233" y2="93" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-a" x="233" y="140" text-anchor="middle">out</text>
  <line class="ln-a" x1="383" y1="125" x2="383" y2="93" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-a" x="383" y="140" text-anchor="middle">in</text>
</svg>`, caption: "Circular buffer of 6 slots: producer writes at in, consumer reads at out (both wrap modulo N)" },
        { code: `#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>

#define N 6
int buf[N], in = 0, out = 0;
sem_t empty, full;                 // counting semaphores
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

void *producer(void *arg) {
    for (int item = 1; item <= 20; item++) {
        sem_wait(&empty);          // wait for a free slot
        pthread_mutex_lock(&mutex);
        buf[in] = item; in = (in + 1) % N;
        pthread_mutex_unlock(&mutex);
        sem_post(&full);           // one more item
    }
    return NULL;
}

void *consumer(void *arg) {
    for (int k = 0; k < 20; k++) {
        sem_wait(&full);           // wait for an item
        pthread_mutex_lock(&mutex);
        int item = buf[out]; out = (out + 1) % N;
        pthread_mutex_unlock(&mutex);
        sem_post(&empty);          // one more free slot
        printf("consumed %d\\n", item);
    }
    return NULL;
}

int main(void) {
    sem_init(&empty, 0, N);
    sem_init(&full, 0, 0);
    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL);
    pthread_create(&c, NULL, consumer, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    return 0;
}`, lang: "c", title: "Bounded buffer with two counting semaphores + a mutex" },
        { ul: [
          "<code>empty</code> (init N) counts free slots — blocks producers when the buffer is full.",
          "<code>full</code> (init 0) counts filled slots — blocks consumers when empty.",
          "<code>mutex</code> protects <code>buf</code>, <code>in</code>, <code>out</code>."
        ] },
        { warn: "Order matters: if a producer does <code>lock(mutex)</code> <b>before</b> <code>wait(empty)</code> and the buffer is full, it sleeps holding the mutex; the consumer can never get in to free a slot → <b>deadlock</b>." },
        { tip: "Real-world versions: Unix pipes, Java <code>BlockingQueue</code>, Kafka topics, the OS keyboard buffer. Mentioning one shows you see where the pattern lives." }
      ]
    },
    {
      id: "readers-writers",
      q: "Explain the readers–writers problem and its semaphore solution.",
      topic: "Synchronization",
      level: 2,
      top: true,
      short: "Many readers may read shared data simultaneously, but a writer needs exclusive access; the first-readers solution uses a read_count guarded by a mutex and a rw_mutex taken by the first reader and released by the last, which can starve writers.",
      a: [
        { p: "Constraints: <b>reader + reader</b> allowed together; <b>reader + writer</b> or <b>writer + writer</b> not allowed." },
        { code: `#include <pthread.h>
#include <semaphore.h>

sem_t rw_mutex;          // init 1: exclusive access for writers (and the reader group)
sem_t mutex;             // init 1: protects read_count
int read_count = 0;

void writer(void) {
    sem_wait(&rw_mutex);
    /* ... write shared data ... */
    sem_post(&rw_mutex);
}

void reader(void) {
    sem_wait(&mutex);
    if (++read_count == 1)      // first reader locks out writers
        sem_wait(&rw_mutex);
    sem_post(&mutex);

    /* ... read shared data (concurrently with other readers) ... */

    sem_wait(&mutex);
    if (--read_count == 0)      // last reader lets writers in
        sem_post(&rw_mutex);
    sem_post(&mutex);
}

int main(void) {
    sem_init(&rw_mutex, 0, 1);
    sem_init(&mutex, 0, 1);
    reader();
    writer();
    return 0;
}`, lang: "c", title: "First readers–writers solution (readers preferred)" },
        { table: { head: ["Variant", "Preference", "Who can starve"], rows: [
          ["First readers–writers", "Readers — no reader waits unless a writer is already writing", "Writers"],
          ["Second readers–writers", "Writers — once a writer waits, no new reader may start", "Readers"],
          ["Fair (third)", "FIFO order using an extra 'turnstile' semaphore", "Nobody"]
        ] } },
        { tip: "In practice use <code>pthread_rwlock_t</code>, <code>std::shared_mutex</code> (C++17) or Java <code>ReentrantReadWriteLock</code>. Mention that read–write locks pay off only when reads greatly outnumber writes and critical sections are not tiny." }
      ]
    },
    {
      id: "dining-philosophers",
      q: "Explain the dining philosophers problem. How do you avoid deadlock?",
      topic: "Synchronization",
      level: 2,
      top: true,
      short: "Five philosophers alternate thinking and eating and need both adjacent chopsticks to eat; if all pick up their left chopstick simultaneously, they deadlock. Fixes: acquire chopsticks in a global order, allow at most four to sit, pick up both atomically, or use an asymmetric rule.",
      a: [
        { p: "It models allocating several resources to several processes. The naïve solution — every philosopher does <code>wait(left); wait(right);</code> — satisfies mutual exclusion but can <b>deadlock</b> (circular wait) and <b>starve</b>." },
        { h: "Deadlock-free strategies" },
        { ul: [
          "<b>Resource ordering</b>: always pick up the lower-numbered chopstick first → breaks circular wait (philosopher 4 picks chopstick 0 before 4).",
          "<b>Limit diners</b>: a counting semaphore initialised to 4 lets at most N−1 philosophers try to eat.",
          "<b>Asymmetric</b>: odd philosophers pick left first, even pick right first.",
          "<b>Atomic pick-up</b>: take both chopsticks only if both are free (monitor solution with states THINKING/HUNGRY/EATING).",
          "<b>Arbitrator / waiter</b>, or the Chandy–Misra message-passing solution."
        ] },
        { code: `#include <algorithm>
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

constexpr int N = 5;
std::mutex chopstick[N];

void philosopher(int i) {
    int left = i, right = (i + 1) % N;
    int first = std::min(left, right);     // global order breaks the cycle
    int second = std::max(left, right);
    for (int meal = 0; meal < 3; ++meal) {
        // think ...
        std::lock_guard<std::mutex> a(chopstick[first]);
        std::lock_guard<std::mutex> b(chopstick[second]);
        // eat ...
    }
}

int main() {
    std::vector<std::thread> ph;
    for (int i = 0; i < N; ++i) ph.emplace_back(philosopher, i);
    for (auto &t : ph) t.join();
    std::cout << "everyone ate, no deadlock\\n";
}`, lang: "cpp", title: "Resource-ordering solution (C++17)" },
        { tip: "In modern C++, <code>std::scoped_lock lk(chopstick[left], chopstick[right]);</code> acquires both with a built-in deadlock-avoidance algorithm — a great one-liner to mention after explaining the theory." }
      ]
    },
    {
      id: "petersons-solution",
      q: "Explain Peterson's solution to the critical-section problem.",
      topic: "Synchronization",
      level: 2,
      top: true,
      short: "Peterson's algorithm is a software solution for two processes using flag[2] (intent to enter) and turn (who yields); a process enters only if the other is not interested or it is its turn, satisfying mutual exclusion, progress and bounded waiting.",
      a: [
        { code: `#include <stdbool.h>

bool flag[2] = {false, false};   // flag[i]: process i wants to enter
int turn;                        // whose turn it is to yield

void enter(int i) {
    int j = 1 - i;
    flag[i] = true;              // I am interested
    turn = j;                    // but you go first if you also want to
    while (flag[j] && turn == j)
        ;                        // busy wait
}

void leave(int i) {
    flag[i] = false;
}`, lang: "c", title: "Peterson's algorithm for processes 0 and 1" },
        { h: "Why it is correct" },
        { ul: [
          "<b>Mutual exclusion</b>: if both are inside, both flags are true, so <code>turn</code> must equal both 0 and 1 at once — impossible. Whoever wrote <code>turn</code> last waits.",
          "<b>Progress</b>: if Pj is not interested (<code>flag[j] = false</code>), Pi enters immediately.",
          "<b>Bounded waiting</b>: after Pj leaves and re-requests, it sets <code>turn = i</code>, so Pi enters after at most one entry by Pj."
        ] },
        { warn: "On modern CPUs and optimising compilers Peterson's algorithm <b>as written is broken</b>: the store to <code>flag[i]</code> may be reordered after the load of <code>flag[j]</code> (store-buffer reordering on x86). It needs <code>atomic</code> variables with sequential consistency or explicit memory fences. It is taught for reasoning, not used in production." },
        { tip: "Know its limits: only two processes (generalisation is the filter / bakery algorithm), and it busy-waits." }
      ]
    },
    {
      id: "spinlock",
      q: "What is a spinlock? When would you use it instead of a mutex?",
      topic: "Synchronization",
      level: 2,
      top: false,
      short: "A spinlock is a lock where a waiting thread busy-loops checking an atomic flag instead of sleeping; it is good for very short critical sections on multiprocessors (and in interrupt context) where sleeping and waking would cost more than spinning.",
      a: [
        { code: `#include <stdatomic.h>

typedef struct { atomic_flag held; } my_spinlock;   // init: { ATOMIC_FLAG_INIT }

void spin_lock(my_spinlock *l) {
    while (atomic_flag_test_and_set_explicit(&l->held, memory_order_acquire))
        ;   // spin (real code adds a pause/yield hint here)
}

void spin_unlock(my_spinlock *l) {
    atomic_flag_clear_explicit(&l->held, memory_order_release);
}`, lang: "c", title: "Minimal test-and-set spinlock (C11)" },
        { table: { head: ["", "Spinlock", "Mutex (sleeping lock)"], rows: [
          ["Waiting", "Busy-waits, burns CPU", "Blocks; thread is descheduled"],
          ["Best for", "Critical sections of a few hundred ns, multicore", "Longer or unpredictable sections"],
          ["Context switch", "None", "Two (sleep + wake)"],
          ["On a uniprocessor", "Useless (holder cannot run while you spin) — kernel disables preemption instead", "Fine"],
          ["Interrupt handlers", "Allowed (cannot sleep there)", "Not allowed"]
        ] } },
        { p: "Linux kernel uses spinlocks heavily (with <code>spin_lock_irqsave</code> when data is shared with interrupt handlers). User-space mutexes (futex-based) are hybrids: spin briefly, then sleep in the kernel." },
        { warn: "Never hold a spinlock while doing something that can sleep (I/O, <code>malloc</code> that may page) — other CPUs spin for the whole duration, and in the kernel it can deadlock." }
      ]
    },
    {
      id: "monitors",
      q: "What is a monitor? How do condition variables work?",
      topic: "Synchronization",
      level: 2,
      top: false,
      short: "A monitor is a high-level synchronisation construct that bundles shared data with the procedures that operate on it and guarantees only one thread is active inside at a time; condition variables inside it let threads wait() for a condition and be woken by signal().",
      a: [
        { p: "Semaphores are error-prone (swap a <code>wait</code> and <code>signal</code> and you deadlock). A <b>monitor</b> makes mutual exclusion implicit: the compiler/runtime takes the monitor lock on entry to every procedure. Java's <code>synchronized</code> methods + <code>wait()/notify()</code> and C++ <code>std::mutex</code> + <code>std::condition_variable</code> implement the monitor pattern." },
        { ul: [
          "<code>x.wait()</code> — atomically releases the monitor lock and sleeps on condition x; re-acquires the lock before returning.",
          "<code>x.signal()</code> — wakes one waiter (no effect if none — unlike a semaphore, signals are not remembered).",
          "<b>Hoare</b> semantics: signalled thread runs immediately. <b>Mesa</b> semantics (Java, pthreads, C++): signaller continues, woken thread re-checks the condition later → always wait in a <code>while</code> loop."
        ] },
        { code: `#include <condition_variable>
#include <mutex>
#include <queue>

template <typename T>
class BlockingQueue {                       // a monitor
    std::mutex m;
    std::condition_variable not_empty;
    std::queue<T> q;
public:
    void push(T v) {
        { std::lock_guard<std::mutex> lk(m); q.push(std::move(v)); }
        not_empty.notify_one();
    }
    T pop() {
        std::unique_lock<std::mutex> lk(m);
        not_empty.wait(lk, [this] { return !q.empty(); }); // loops on spurious wake-ups
        T v = std::move(q.front());
        q.pop();
        return v;
    }
};`, lang: "cpp", title: "Monitor-style blocking queue with a condition variable" },
        { warn: "Using <code>if</code> instead of <code>while</code> around <code>wait()</code> is a classic bug: with Mesa semantics and spurious wake-ups the condition may be false again when the thread runs." }
      ]
    },
    {
      id: "priority-inversion",
      q: "What is priority inversion? How is it solved?",
      topic: "Synchronization",
      level: 3,
      top: false,
      short: "Priority inversion happens when a high-priority task waits for a lock held by a low-priority task, which in turn is preempted by medium-priority tasks, so the high-priority task effectively runs at the lowest priority; it is fixed with priority inheritance or priority ceiling protocols.",
      a: [
        { ol: [
          "Low-priority task L acquires mutex M.",
          "High-priority task H becomes ready, preempts L, tries to lock M, blocks.",
          "Medium-priority task M1 (does not need the lock) becomes ready and preempts L.",
          "L cannot run to release M; H waits for M1 — an unbounded time — even though H has the highest priority."
        ] },
        { h: "Solutions" },
        { ul: [
          "<b>Priority inheritance</b>: while L holds a lock that H waits on, L temporarily inherits H's priority, so M1 cannot preempt it. (<code>PTHREAD_PRIO_INHERIT</code>, Linux rt-mutexes.)",
          "<b>Priority ceiling</b>: each lock has a ceiling equal to the highest priority of any task that may take it; a task holding it runs at that ceiling.",
          "Disable preemption during short critical sections (kernel)."
        ] },
        { p: "<b>Famous case:</b> NASA's Mars Pathfinder (1997) kept resetting because a low-priority meteorological task held a VxWorks mutex needed by the high-priority bus-management task. Engineers enabled priority inheritance remotely to fix it." },
        { tip: "This is why a mutex's <b>ownership</b> matters: the OS can only boost the owner if it knows who the owner is — semaphores cannot do priority inheritance." }
      ]
    },
    {
      id: "test-and-set-cas",
      q: "Explain hardware synchronisation instructions: test-and-set and compare-and-swap.",
      topic: "Synchronization",
      level: 3,
      top: false,
      short: "Test-and-set atomically sets a memory word to true and returns its old value; compare-and-swap atomically replaces a value only if it equals an expected value. They are the hardware building blocks for spinlocks, mutexes and lock-free data structures.",
      a: [
        { p: "Disabling interrupts works only on a single CPU, so multiprocessors provide atomic read-modify-write instructions (x86 <code>LOCK XCHG</code>, <code>LOCK CMPXCHG</code>; ARM <code>LDXR/STXR</code> or LSE <code>CAS</code>)." },
        { code: `#include <stdbool.h>

// Semantics (each executes ATOMICALLY in hardware):
bool test_and_set(bool *target) {
    bool old = *target;
    *target = true;
    return old;
}

int compare_and_swap(int *value, int expected, int new_value) {
    int old = *value;
    if (old == expected)
        *value = new_value;
    return old;
}`, lang: "c", title: "Pseudo-definitions" },
        { code: `#include <stdatomic.h>

atomic_long hits = 0;

void lock_free_increment(void) {
    long old = atomic_load(&hits);
    // retry until nobody changed 'hits' between our load and our swap
    while (!atomic_compare_exchange_weak(&hits, &old, old + 1))
        ;   // on failure 'old' is refreshed with the current value
}`, lang: "c", title: "Lock-free increment using CAS (C11)" },
        { ul: [
          "TAS spinlock: <code>while (test_and_set(&amp;lock)) ;</code> … <code>lock = false;</code> — mutual exclusion but <b>not</b> bounded waiting (add a waiting[] array or use a ticket lock).",
          "CAS enables lock-free stacks/queues and <code>std::atomic</code> operations.",
          "<b>ABA problem</b>: value changes A → B → A between read and CAS, so CAS succeeds wrongly; fix with version tags / double-width CAS or hazard pointers."
        ] }
      ]
    },

    /* ───────────── Deadlocks ───────────── */
    {
      id: "deadlock-conditions",
      q: "What is a deadlock? What are the four necessary conditions?",
      topic: "Deadlocks",
      level: 1,
      top: true,
      short: "A deadlock is a state where a set of processes are each waiting for a resource held by another process in the set, so none can proceed; it requires mutual exclusion, hold and wait, no preemption and circular wait to all hold simultaneously (Coffman conditions).",
      a: [
        { p: "Example: T1 locks A then wants B; T2 locks B then wants A. Both wait forever." },
        { table: { head: ["Condition", "Meaning"], rows: [
          ["<b>Mutual exclusion</b>", "At least one resource is non-shareable — only one process can use it at a time"],
          ["<b>Hold and wait</b>", "A process holds at least one resource while waiting for others"],
          ["<b>No preemption</b>", "Resources cannot be forcibly taken away; they are released only voluntarily"],
          ["<b>Circular wait</b>", "A cycle P0 → P1 → … → Pn → P0 where each waits for a resource held by the next"]
        ] } },
        { p: "All four are <b>necessary</b>; together they are sufficient only when each resource has a single instance. Break any one and deadlock is impossible — that is the basis of deadlock prevention." },
        { h: "Deadlock vs starvation vs livelock" },
        { table: { head: ["", "Deadlock", "Starvation", "Livelock"], rows: [
          ["State of processes", "Blocked forever", "One process keeps being overlooked; others progress", "Processes keep changing state (e.g. retrying) but make no progress"],
          ["Cause", "Circular wait on resources", "Unfair scheduling / priorities", "Over-polite conflict resolution (both back off and retry in sync)"],
          ["Fix", "Prevention / avoidance / detection", "Aging, fair queues", "Randomised back-off"]
        ] } },
        { tip: "Write the classic two-mutex code and point at each condition. Interviewers at Amazon/Microsoft often follow with 'How would you fix this in code?' — answer: acquire locks in a <b>global order</b> (breaks circular wait) or use <code>try_lock</code> with back-off (breaks hold-and-wait)." }
      ]
    },
    {
      id: "resource-allocation-graph",
      q: "What is a Resource Allocation Graph? How do you detect deadlock from it?",
      topic: "Deadlocks",
      level: 2,
      top: true,
      short: "A RAG is a directed graph with process nodes and resource nodes; a request edge goes P → R and an assignment edge goes R → P. No cycle means no deadlock; with single-instance resources a cycle means deadlock; with multi-instance resources a cycle means deadlock is only possible.",
      a: [
        { svg: `<svg viewBox="0 0 460 240" width="460" class="dg">
  <rect class="box" x="45" y="90" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="85" y="80" text-anchor="middle">R1</text>
  <circle class="box-a" cx="85" cy="110" r="5"/>
  <rect class="box" x="335" y="90" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="375" y="80" text-anchor="middle">R2</text>
  <circle class="box-a" cx="375" cy="110" r="5"/>
  <circle class="box-r" cx="230" cy="40" r="26"/>
  <text class="tx tx-b" x="230" y="40" text-anchor="middle" dominant-baseline="middle">P1</text>
  <circle class="box-r" cx="230" cy="180" r="26"/>
  <text class="tx tx-b" x="230" y="180" text-anchor="middle" dominant-baseline="middle">P2</text>
  <line class="ln" x1="115" y1="90" x2="204" y2="48" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="150" y="56" text-anchor="middle">holds</text>
  <line class="ln-a" x1="256" y1="48" x2="345" y2="88" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="312" y="56" text-anchor="middle">requests</text>
  <line class="ln" x1="350" y1="130" x2="256" y2="172" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="318" y="170" text-anchor="middle">holds</text>
  <line class="ln-a" x1="204" y1="172" x2="110" y2="132" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="142" y="170" text-anchor="middle">requests</text>
  <text class="tx-s" x="230" y="230" text-anchor="middle">P → R = request edge · R → P = assignment edge · dot = one instance</text>
</svg>`, caption: "Cycle P1 → R2 → P2 → R1 → P1 with single-instance resources: deadlock" },
        { ul: [
          "<b>Process</b> = circle, <b>resource type</b> = rectangle with one dot per instance.",
          "<b>Request edge</b> P<sub>i</sub> → R<sub>j</sub>: process is waiting for the resource.",
          "<b>Assignment edge</b> R<sub>j</sub> → P<sub>i</sub>: an instance is allocated to the process."
        ] },
        { table: { head: ["Graph", "Single instance per resource", "Multiple instances"], rows: [
          ["No cycle", "No deadlock", "No deadlock"],
          ["Cycle", "<b>Deadlock</b> (cycle is necessary and sufficient)", "<b>Maybe</b> — another process outside the cycle may release an instance"]
        ] } },
        { p: "For single-instance resources the OS can collapse the RAG into a <b>wait-for graph</b> (P<sub>i</sub> → P<sub>j</sub> if P<sub>i</sub> waits for a resource held by P<sub>j</sub>) and run cycle detection (DFS, O(V + E))." },
        { tip: "The 'cycle but no deadlock' case is a favourite trick question — draw R with two dots, one held by a process outside the cycle that will finish and release it." }
      ]
    },
    {
      id: "deadlock-handling",
      q: "Compare deadlock prevention, avoidance, detection & recovery, and ignorance.",
      topic: "Deadlocks",
      level: 2,
      top: true,
      short: "Prevention structurally negates one of the four Coffman conditions; avoidance (Banker's algorithm) grants requests only if the system stays in a safe state; detection lets deadlocks happen, finds them periodically and recovers by killing or preempting; the ostrich approach ignores them (used by most general-purpose OSes).",
      a: [
        { table: { head: ["Strategy", "Idea", "Cost / drawback", "Example"], rows: [
          ["<b>Prevention</b>", "Make one necessary condition impossible", "Low utilisation, restrictive", "Lock ordering"],
          ["<b>Avoidance</b>", "Check each request; grant only if resulting state is safe", "Needs max demand in advance; O(m·n²) per request", "Banker's algorithm"],
          ["<b>Detection + recovery</b>", "Allow deadlock, detect cycles, then recover", "Detection overhead + lost work", "Databases (abort a transaction)"],
          ["<b>Ignore (ostrich)</b>", "Assume it is rare; reboot / let user kill", "Occasional hang", "Linux, Windows for user resources"]
        ] } },
        { h: "Prevention — attack one condition" },
        { table: { head: ["Condition", "How to break it", "Problem"], rows: [
          ["Mutual exclusion", "Make resources shareable (read-only files, spooling a printer)", "Many resources inherently exclusive"],
          ["Hold and wait", "Request all resources at once, or release all before requesting more", "Poor utilisation, starvation"],
          ["No preemption", "If a request fails, release what you hold (or preempt from others)", "Only for state that can be saved (CPU, memory)"],
          ["Circular wait", "Impose a total order; request in increasing order", "Most practical — used in real code"]
        ] } },
        { h: "Recovery options" },
        { ul: [
          "<b>Process termination</b>: abort all deadlocked processes, or abort one at a time until the cycle breaks (choose victim by priority, work done, resources held).",
          "<b>Resource preemption</b>: take resources from a victim and roll it back to a safe checkpoint; guard against the same victim starving."
        ] },
        { tip: "Safe-state intuition: 'unsafe' ≠ 'deadlocked'. Unsafe means deadlock <i>may</i> occur if processes request their maximums; avoidance simply refuses to enter unsafe states." }
      ]
    },
    {
      id: "bankers-algorithm",
      q: "Explain the Banker's algorithm with a worked example.",
      topic: "Deadlocks",
      level: 3,
      top: true,
      short: "Banker's algorithm is a deadlock-avoidance algorithm: each process declares its maximum need; the OS computes Need = Max − Allocation and grants a request only if a safety check can still find an order (safe sequence) in which every process can obtain its remaining need and finish.",
      a: [
        { p: "Data structures for n processes and m resource types: <code>Available[m]</code>, <code>Max[n][m]</code>, <code>Allocation[n][m]</code>, <code>Need = Max − Allocation</code>." },
        { h: "Example — 5 processes, resources A = 10, B = 5, C = 7" },
        { table: { head: ["Process", "Allocation (A B C)", "Max (A B C)", "Need (A B C)"], rows: [
          ["P0", "0 1 0", "7 5 3", "7 4 3"],
          ["P1", "2 0 0", "3 2 2", "1 2 2"],
          ["P2", "3 0 2", "9 0 2", "6 0 0"],
          ["P3", "2 1 1", "2 2 2", "0 1 1"],
          ["P4", "0 0 2", "4 3 3", "4 3 1"]
        ] } },
        { p: "Allocated total = 7 2 5, so <b>Available = 10 5 7 − 7 2 5 = 3 3 2</b>." },
        { h: "Safety algorithm trace (Work starts at Available)" },
        { table: { head: ["Step", "Pick (Need ≤ Work)", "Work after it finishes (+Allocation)"], rows: [
          ["1", "P1: 1 2 2 ≤ 3 3 2 ✓", "3 3 2 + 2 0 0 = 5 3 2"],
          ["2", "P3: 0 1 1 ≤ 5 3 2 ✓", "5 3 2 + 2 1 1 = 7 4 3"],
          ["3", "P4: 4 3 1 ≤ 7 4 3 ✓", "7 4 3 + 0 0 2 = 7 4 5"],
          ["4", "P0: 7 4 3 ≤ 7 4 5 ✓", "7 4 5 + 0 1 0 = 7 5 5"],
          ["5", "P2: 6 0 0 ≤ 7 5 5 ✓", "7 5 5 + 3 0 2 = 10 5 7"]
        ] } },
        { p: "All processes can finish → the state is <b>safe</b>, safe sequence <b>&lt;P1, P3, P4, P0, P2&gt;</b> (other safe sequences such as &lt;P1, P3, P4, P2, P0&gt; also exist)." },
        { h: "Resource-request algorithm" },
        { ol: [
          "If <code>Request<sub>i</sub> &gt; Need<sub>i</sub></code> → error (exceeded declared max).",
          "If <code>Request<sub>i</sub> &gt; Available</code> → P<sub>i</sub> must wait.",
          "Pretend to allocate: <code>Available −= Req; Allocation<sub>i</sub> += Req; Need<sub>i</sub> −= Req</code>.",
          "Run the safety algorithm; if safe, grant — otherwise roll back and make P<sub>i</sub> wait."
        ] },
        { p: "E.g. P1 requests (1, 0, 2): ≤ Need (1 2 2) and ≤ Available (3 3 2); new Available = 2 3 0; the sequence &lt;P1, P3, P4, P0, P2&gt; still works → <b>granted</b>." },
        { warn: "Banker's is rarely used in real OSes: it needs maximum demands up front, a fixed number of processes and resources, and runs in O(m·n²) per request." }
      ]
    },

    /* ───────────── Memory Management ───────────── */
    {
      id: "fragmentation",
      q: "What is internal vs external fragmentation? How are they reduced?",
      topic: "Memory Management",
      level: 1,
      top: true,
      short: "Internal fragmentation is wasted space inside an allocated block because the block is larger than requested (fixed partitions, pages); external fragmentation is free memory split into small non-contiguous holes so a large request cannot be satisfied even though total free space is enough (variable partitions, segmentation).",
      a: [
        { table: { head: ["", "Internal", "External"], rows: [
          ["Where the waste is", "Inside allocated blocks", "Between allocated blocks (holes)"],
          ["Caused by", "Fixed-size allocation units (partitions, pages, allocator size classes)", "Variable-size allocation and freeing over time"],
          ["Occurs in", "Paging (last page half-empty), fixed partitioning", "Contiguous / variable partitioning, segmentation, heap allocators"],
          ["Example", "Process needs 18 KB; with 4 KB pages it gets 20 KB → 2 KB wasted", "Holes of 30 KB and 40 KB free, request 60 KB fails"],
          ["Remedy", "Smaller units (trade-off: bigger page tables), slab/size-class allocators", "Compaction, paging, buddy system, best-fit placement"]
        ] } },
        { p: "<b>Compaction</b> shuffles processes to merge holes — possible only with dynamic relocation (base registers / MMU) and expensive. <b>Paging</b> eliminates external fragmentation completely because any free frame can hold any page; the price is at most one page minus one byte of internal fragmentation per process (on average half a page)." },
        { tip: "50-percent rule (Knuth): with first-fit, for N allocated blocks about 0.5N blocks are lost to external fragmentation — one-third of memory may be unusable." }
      ]
    },
    {
      id: "memory-allocation-fit",
      q: "Explain first-fit, best-fit and worst-fit memory allocation with an example.",
      topic: "Memory Management",
      level: 1,
      top: true,
      short: "First-fit takes the first hole big enough (fast); best-fit takes the smallest hole big enough (leaves tiny slivers); worst-fit takes the largest hole (leaves big leftovers). First-fit and best-fit generally beat worst-fit in utilisation, and first-fit is fastest.",
      a: [
        { p: "Free holes (in order): <b>100 KB, 500 KB, 200 KB, 300 KB, 600 KB</b>. Requests in order: <b>212, 417, 112, 426 KB</b>. Leftover of a hole stays available." },
        { table: { head: ["Request", "First-fit", "Best-fit", "Worst-fit"], rows: [
          ["212 KB", "500 → 288 left", "300 → 88 left", "600 → 388 left"],
          ["417 KB", "600 → 183 left", "500 → 83 left", "500 → 83 left"],
          ["112 KB", "288 → 176 left", "200 → 88 left", "388 → 276 left"],
          ["426 KB", "<b>must wait</b> (no hole ≥ 426)", "600 → 174 left", "<b>must wait</b>"]
        ] } },
        { p: "Here best-fit is the only one that places all four processes." },
        { table: { head: ["Strategy", "Search", "Pros", "Cons"], rows: [
          ["First-fit", "Stop at first adequate hole", "Fastest", "Small holes pile up at the start"],
          ["Next-fit", "Resume from last position", "Spreads allocation", "Often slightly worse than first-fit"],
          ["Best-fit", "Whole list (unless sorted)", "Saves big holes", "Creates tiny unusable fragments"],
          ["Worst-fit", "Whole list", "Leftovers remain usable", "Destroys large holes quickly"]
        ] } },
        { tip: "Mention the <b>buddy system</b> (Linux page allocator): memory split in powers of two, freed buddies merge back — fast coalescing at the price of internal fragmentation." }
      ]
    },
    {
      id: "paging",
      q: "What is paging? Explain address translation with a diagram.",
      topic: "Memory Management",
      level: 2,
      top: true,
      short: "Paging divides logical memory into fixed-size pages and physical memory into same-size frames; a per-process page table maps page numbers to frame numbers, and the MMU translates a logical address (page p, offset d) to physical address (frame f, offset d), removing external fragmentation.",
      a: [
        { p: "The CPU generates <b>logical (virtual) addresses</b>; the <b>MMU</b> converts them to <b>physical addresses</b> at run time. With page size 2<sup>n</sup> and a logical address of m bits, the high <b>m − n</b> bits are the page number <b>p</b> and the low <b>n</b> bits the offset <b>d</b>." },
        { svg: `<svg viewBox="0 0 640 200" width="640" class="dg">
  <rect class="box" x="10" y="70" width="60" height="40" rx="6"/>
  <text class="tx tx-b" x="40" y="90" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <text class="tx-m" x="150" y="62" text-anchor="middle">logical address</text>
  <rect class="box-a" x="100" y="70" width="50" height="40" rx="6"/>
  <text class="tx tx-b" x="125" y="90" text-anchor="middle" dominant-baseline="middle">p</text>
  <rect class="box-g" x="150" y="70" width="50" height="40" rx="6"/>
  <text class="tx tx-b" x="175" y="90" text-anchor="middle" dominant-baseline="middle">d</text>
  <text class="tx-m" x="295" y="14" text-anchor="middle">page table</text>
  <rect class="box" x="250" y="20" width="90" height="130" rx="6"/>
  <rect class="box-a" x="250" y="95" width="90" height="26" rx="6"/>
  <text class="tx-c" x="295" y="108" text-anchor="middle" dominant-baseline="middle">PTE[p] = f</text>
  <text class="tx-m" x="450" y="62" text-anchor="middle">physical address</text>
  <rect class="box-a" x="400" y="70" width="50" height="40" rx="6"/>
  <text class="tx tx-b" x="425" y="90" text-anchor="middle" dominant-baseline="middle">f</text>
  <rect class="box-g" x="450" y="70" width="50" height="40" rx="6"/>
  <text class="tx tx-b" x="475" y="90" text-anchor="middle" dominant-baseline="middle">d</text>
  <text class="tx-m" x="595" y="14" text-anchor="middle">physical memory</text>
  <rect class="box" x="560" y="20" width="70" height="150" rx="6"/>
  <rect class="box-a" x="560" y="95" width="70" height="26" rx="6"/>
  <text class="tx-s" x="595" y="108" text-anchor="middle" dominant-baseline="middle">frame f</text>
  <line class="ln" x1="70" y1="90" x2="98" y2="90" marker-end="url(#dg-arr)"/>
  <polyline class="ln-a" points="125,70 125,40 225,40 225,108 248,108" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="340" y1="108" x2="398" y2="94" marker-end="url(#dg-arr-a)"/>
  <polyline class="ln" points="175,110 175,182 475,182 475,112" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="325" y="176" text-anchor="middle">offset copied unchanged</text>
  <line class="ln" x1="500" y1="90" x2="558" y2="106" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Page number indexes the page table; the offset is carried across unchanged" },
        { h: "Worked example" },
        { p: "32-bit logical address, 4 KB pages (2<sup>12</sup>) → 20-bit page number, 12-bit offset. Logical address <code>0x00003A7F</code> → p = <code>0x3</code>, d = <code>0xA7F</code>. If PTE[3] = frame 7, physical address = 7 × 4096 + 0xA7F = <code>0x7A7F</code>." },
        { ul: [
          "Page-table entry bits: frame number, <b>valid/present</b>, read/write/execute protection, <b>dirty</b>, <b>referenced/accessed</b>, user/supervisor.",
          "Page-table base register (CR3 on x86) points to the current process's table; switching processes reloads it.",
          "Each memory access now needs 2 accesses (PTE + data) → solved by the <b>TLB</b>.",
          "Pros: no external fragmentation, easy sharing (map the same frame into two processes), protection per page. Cons: internal fragmentation, page-table memory."
        ] },
        { tip: "Be quick with the arithmetic: number of pages = 2<sup>(logical bits − offset bits)</sup>; page-table size = pages × PTE size (2<sup>20</sup> × 4 B = 4 MB for 32-bit / 4 KB)." }
      ]
    },
    {
      id: "segmentation",
      q: "What is segmentation? How does it differ from paging?",
      topic: "Memory Management",
      level: 2,
      top: true,
      short: "Segmentation divides a program into variable-size logical units (code, data, stack, heap), each described by a base and limit in a segment table; a logical address is (segment, offset). Unlike paging it matches the programmer's view but suffers external fragmentation.",
      a: [
        { p: "Logical address = <b>&lt;segment number s, offset d&gt;</b>. The MMU checks <code>d &lt; limit[s]</code> (else trap: segmentation fault) and computes <code>physical = base[s] + d</code>." },
        { table: { head: ["Segment", "Base", "Limit"], rows: [["0 (code)", "1400", "1000"], ["1 (stack)", "6300", "400"], ["2 (data)", "4300", "400"]] } },
        { p: "(2, 53) → 4300 + 53 = <b>4353</b>. (1, 500) → 500 ≥ 400 → <b>trap</b>." },
        { table: { head: ["", "Paging", "Segmentation"], rows: [
          ["Unit size", "Fixed (pages)", "Variable (segments)"],
          ["View", "Physical / invisible to programmer", "Logical (matches code, stack, heap)"],
          ["Fragmentation", "Internal", "External"],
          ["Address", "Page no. + offset", "Segment no. + offset"],
          ["Table", "Page table (frame no.)", "Segment table (base + limit)"],
          ["Protection / sharing", "Per page", "Per logical unit — natural (share code segment)"]
        ] } },
        { p: "<b>Segmented paging</b> combines both: each segment is itself paged (classic x86 32-bit, Multics). x86-64 has essentially abandoned segmentation (flat model), keeping FS/GS only for thread-local storage." },
        { tip: "A 'segmentation fault' today usually comes from a <b>page</b> protection fault, not a segment limit check — the name is historical." }
      ]
    },
    {
      id: "tlb",
      q: "What is a TLB? How does it speed up paging? Calculate the effective access time.",
      topic: "Memory Management",
      level: 2,
      top: true,
      short: "The Translation Lookaside Buffer is a small, fast, fully-associative hardware cache of recent page → frame translations inside the MMU; on a hit the translation needs no page-table memory access, on a miss the page table is walked and the TLB updated.",
      a: [
        { svg: `<svg viewBox="0 0 620 200" width="620" class="dg">
  <rect class="box" x="10" y="80" width="60" height="40" rx="6"/>
  <text class="tx tx-b" x="40" y="100" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <rect class="box-a" x="110" y="80" width="120" height="40" rx="6"/>
  <text class="tx" x="170" y="100" text-anchor="middle" dominant-baseline="middle">TLB lookup (p)</text>
  <rect class="box-w" x="250" y="150" width="150" height="40" rx="6"/>
  <text class="tx" x="325" y="170" text-anchor="middle" dominant-baseline="middle">page-table walk</text>
  <rect class="box-g" x="470" y="80" width="140" height="40" rx="6"/>
  <text class="tx" x="540" y="100" text-anchor="middle" dominant-baseline="middle">memory[f + d]</text>
  <line class="ln" x1="70" y1="100" x2="108" y2="100" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="230" y1="100" x2="468" y2="100" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="350" y="92" text-anchor="middle">TLB hit → frame f</text>
  <polyline class="ln" points="170,120 170,170 248,170" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="176" y="145">TLB miss</text>
  <polyline class="ln" points="400,170 540,170 540,122" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="470" y="162" text-anchor="middle">f, also load TLB</text>
  <polyline class="ln ln-d" points="325,150 325,130 200,130 200,122" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="262" y="126" text-anchor="middle">refill</text>
</svg>`, caption: "Translation with a TLB" },
        { ul: [
          "Typically 64–1536 entries, split L1 (per-core, instruction/data) and L2 TLB; hit ratios above 99% thanks to locality.",
          "Each entry: page number (tag), frame number, protection bits, and an <b>ASID/PCID</b> so entries of different processes can coexist; otherwise the TLB is flushed on every context switch.",
          "Miss handled by hardware page-table walker (x86, ARM) or by an OS trap (MIPS, old SPARC)."
        ] },
        { h: "Effective Access Time (EAT)" },
        { p: "<code>EAT = h × (t<sub>TLB</sub> + m) + (1 − h) × (t<sub>TLB</sub> + k·m + m)</code>, where m = memory access time and k = number of page-table levels." },
        { p: "Single-level table, m = 100 ns, TLB lookup negligible:" },
        { table: { head: ["Hit ratio h", "EAT", "Slowdown vs no paging"], rows: [
          ["80%", "0.80 × 100 + 0.20 × 200 = <b>120 ns</b>", "20%"],
          ["99%", "0.99 × 100 + 0.01 × 200 = <b>101 ns</b>", "1%"]
        ] } },
        { p: "With a 20 ns TLB and 80% hits: 0.8 × 120 + 0.2 × 220 = <b>140 ns</b>." },
        { tip: "Huge pages (2 MB / 1 GB) increase <b>TLB reach</b> — one entry covers far more memory — which is why databases and JVMs enable them." }
      ]
    },
    {
      id: "page-table-types",
      q: "Explain hierarchical (multilevel), hashed and inverted page tables.",
      topic: "Memory Management",
      level: 3,
      top: true,
      short: "A single flat page table becomes huge for large address spaces; multilevel tables page the page table itself so unused regions need no entries; hashed tables hash the virtual page number into chains (good for sparse 64-bit spaces); an inverted table has one entry per physical frame storing (pid, page), shrinking memory at the cost of slower lookup.",
      a: [
        { p: "Problem: 32-bit address, 4 KB pages, 4-byte PTE → 2<sup>20</sup> entries × 4 B = <b>4 MB per process</b>, mostly for unused addresses. For 48-bit x86-64 a flat table would be 2<sup>36</sup> × 8 B = 512 GB." },
        { h: "Two-level paging (32-bit: 10 | 10 | 12)" },
        { svg: `<svg viewBox="0 0 600 225" width="600" class="dg">
  <rect class="box-a" x="20" y="20" width="80" height="34" rx="6"/>
  <text class="tx" x="60" y="37" text-anchor="middle" dominant-baseline="middle">p1 (10)</text>
  <rect class="box-p" x="100" y="20" width="80" height="34" rx="6"/>
  <text class="tx" x="140" y="37" text-anchor="middle" dominant-baseline="middle">p2 (10)</text>
  <rect class="box-g" x="180" y="20" width="90" height="34" rx="6"/>
  <text class="tx" x="225" y="37" text-anchor="middle" dominant-baseline="middle">d (12)</text>
  <rect class="box" x="20" y="90" width="90" height="110" rx="6"/>
  <rect class="box-a" x="20" y="130" width="90" height="24" rx="6"/>
  <rect class="box" x="240" y="90" width="90" height="110" rx="6"/>
  <rect class="box-p" x="240" y="150" width="90" height="24" rx="6"/>
  <rect class="box" x="460" y="90" width="120" height="110" rx="6"/>
  <rect class="box-g" x="460" y="160" width="120" height="24" rx="6"/>
  <text class="tx-s" x="520" y="172" text-anchor="middle" dominant-baseline="middle">target byte</text>
  <line class="ln-a" x1="60" y1="54" x2="60" y2="128" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="110" y1="142" x2="238" y2="142" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="174" y="136" text-anchor="middle">base of inner</text>
  <polyline class="ln-a" points="140,54 140,78 285,78 285,148" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="330" y1="162" x2="458" y2="162" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="394" y="156" text-anchor="middle">frame f</text>
  <polyline class="ln-a" points="225,54 225,64 540,64 540,158" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="65" y="216" text-anchor="middle">outer page table</text>
  <text class="tx-m" x="285" y="216" text-anchor="middle">inner page table</text>
  <text class="tx-m" x="520" y="216" text-anchor="middle">page frame</text>
</svg>`, caption: "p1 indexes the outer table, p2 the selected inner table, d the frame" },
        { p: "Inner tables exist only for regions actually in use, so a small process needs just the outer table plus a few inner tables (~12 KB instead of 4 MB). x86-64 uses <b>4 levels</b> (9|9|9|9|12) or 5 with LA57. Cost: one memory access per level on a TLB miss." },
        { table: { head: ["Type", "Entries", "Lookup", "Used in"], rows: [
          ["Single-level", "One per virtual page", "1 access", "Tiny address spaces"],
          ["Multilevel (hierarchical)", "Only for used regions", "k accesses on TLB miss", "x86, ARM"],
          ["Hashed", "One per mapped page, chained on hash of VPN", "Hash + chain walk", "Sparse 64-bit spaces; clustered variant"],
          ["Inverted", "<b>One per physical frame</b>: (pid, vpn)", "Search/hash whole table", "IBM PowerPC, UltraSPARC, IA-64"]
        ] } },
        { warn: "Inverted tables make <b>sharing</b> hard (one frame, one owner entry) and require a hash anchor table to avoid a linear search." }
      ]
    },
    {
      id: "swapping",
      q: "What is swapping? How does it differ from paging?",
      topic: "Memory Management",
      level: 1,
      top: false,
      short: "Swapping moves an entire process between main memory and a backing store (swap space) to free memory; paging moves individual pages. Modern systems swap at page granularity, so 'swap space' is really the paging area.",
      a: [
        { table: { head: ["", "Classic swapping", "Paging (page-level swap)"], rows: [
          ["Unit moved", "Whole process image", "Individual pages"],
          ["Transfer cost", "Huge (proportional to process size)", "Small, on demand"],
          ["Decision by", "Medium-term scheduler", "Page-replacement algorithm"],
          ["Used by", "Early Unix, some mobile / embedded systems", "Linux, Windows, macOS"]
        ] } },
        { ul: [
          "Swap-out time ≈ size / disk bandwidth: a 1 GB process at 500 MB/s takes 2 s out and 2 s back.",
          "A process with pending I/O into its buffers cannot be swapped out unless I/O goes through kernel buffers.",
          "Linux: swap partition or swap file; <code>vm.swappiness</code> tunes how eagerly anonymous pages are swapped versus dropping page cache. iPhones traditionally avoid swapping anonymous memory (they compress it and terminate background apps); Android uses zRAM (compressed RAM swap)."
        ] }
      ]
    },

    /* ───────────── Virtual Memory ───────────── */
    {
      id: "virtual-memory",
      q: "What is virtual memory and what are its benefits?",
      topic: "Virtual Memory",
      level: 1,
      top: true,
      short: "Virtual memory separates logical memory from physical memory: each process sees a large, private, contiguous address space, while only the parts in use are in RAM and the rest stays on disk, loaded on demand.",
      a: [
        { p: "Implemented by <b>demand paging</b> (sometimes demand segmentation): the MMU translates every virtual address; pages not in RAM are marked invalid and fetched from disk on a page fault." },
        { h: "Benefits" },
        { ul: [
          "Programs can be <b>larger than physical memory</b>.",
          "More processes fit in memory → higher degree of multiprogramming and CPU utilisation.",
          "<b>Isolation / protection</b>: a process cannot even name another process's memory.",
          "<b>Sharing</b>: shared libraries and shared memory map the same frames into many processes.",
          "Efficient <code>fork()</code> via copy-on-write, memory-mapped files, lazy allocation of heap and stack.",
          "Simpler programming model: contiguous address space regardless of physical layout."
        ] },
        { p: "Cost: page faults are very expensive (disk access ~ms vs ~100 ns for RAM), so performance depends on locality. Effective access time with page-fault rate p: <code>EAT = (1 − p) × 100 ns + p × 8 ms</code>. For a slowdown under 10%, p must be below about 1 in 800,000." },
        { warn: "Virtual memory ≠ swap space. Virtual memory is the address-translation abstraction; swap is just one backing store for pages. A system with no swap still uses virtual memory." }
      ]
    },
    {
      id: "demand-paging-page-fault",
      q: "What is demand paging? Explain the steps in handling a page fault.",
      topic: "Virtual Memory",
      level: 2,
      top: true,
      short: "Demand paging loads a page into memory only when it is first accessed; accessing a page marked invalid causes a page-fault trap, and the OS finds the page on disk, loads it into a free (or freed) frame, updates the page table and restarts the faulting instruction.",
      a: [
        { p: "A lazy swapper — the <b>pager</b> — never brings a page in until it is needed. Each PTE has a <b>valid–invalid bit</b>; invalid means either not in memory or not a legal address." },
        { svg: `<svg viewBox="0 0 640 220" width="640" class="dg">
  <rect class="box" x="20" y="30" width="110" height="40" rx="6"/>
  <text class="tx" x="75" y="50" text-anchor="middle" dominant-baseline="middle">CPU: load M</text>
  <rect class="box-w" x="200" y="30" width="130" height="40" rx="6"/>
  <text class="tx" x="265" y="50" text-anchor="middle" dominant-baseline="middle">page table: M invalid</text>
  <rect class="box-a" x="420" y="30" width="140" height="40" rx="6"/>
  <text class="tx" x="490" y="50" text-anchor="middle" dominant-baseline="middle">OS page-fault handler</text>
  <rect class="box-p" x="460" y="160" width="160" height="40" rx="6"/>
  <text class="tx" x="540" y="180" text-anchor="middle" dominant-baseline="middle">backing store (disk)</text>
  <rect class="box-g" x="200" y="160" width="140" height="40" rx="6"/>
  <text class="tx" x="270" y="180" text-anchor="middle" dominant-baseline="middle">free frame in RAM</text>
  <line class="ln" x1="130" y1="42" x2="198" y2="42" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="164" y="36" text-anchor="middle">1 reference</text>
  <line class="ln-a" x1="330" y1="50" x2="418" y2="50" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="374" y="44" text-anchor="middle">2 trap</text>
  <line class="ln" x1="500" y1="70" x2="530" y2="158" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="522" y="112">3 locate page</text>
  <line class="ln" x1="460" y1="180" x2="342" y2="180" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="400" y="174" text-anchor="middle">4 read into frame</text>
  <line class="ln" x1="265" y1="158" x2="265" y2="72" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="271" y="118">5 set valid, frame no.</text>
  <line class="ln-a" x1="198" y1="62" x2="132" y2="62" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="164" y="80" text-anchor="middle">6 restart</text>
</svg>`, caption: "Servicing a page fault" },
        { ol: [
          "Process references an address; MMU finds the PTE invalid → <b>trap</b> to the kernel.",
          "Kernel checks the address against the process's memory map: illegal → send <code>SIGSEGV</code>; legal but not resident → continue.",
          "Find a free frame; if none, run the <b>page-replacement</b> algorithm and write the victim to disk if it is dirty.",
          "Schedule a disk read of the page into the frame (the process blocks; the CPU runs someone else).",
          "When I/O completes, update the PTE (frame number, valid = 1) and the kernel's tables.",
          "<b>Restart the instruction</b> that caused the fault; the process now sees the page as if it had always been there."
        ] },
        { table: { head: ["Fault type", "Meaning", "Cost"], rows: [
          ["Minor (soft)", "Page is in RAM (page cache, shared lib) but not mapped yet", "Microseconds"],
          ["Major (hard)", "Page must be read from disk", "Milliseconds (SSD ~0.1 ms, HDD ~8 ms)"],
          ["Invalid", "Illegal address or permission violation", "Process gets SIGSEGV"]
        ] } },
        { p: "<b>Pure demand paging</b> starts a process with zero pages resident. <b>Prepaging</b> brings in likely-needed pages up front to reduce the initial burst of faults." }
      ]
    },
    {
      id: "page-replacement",
      q: "Explain FIFO, LRU and Optimal page replacement with an example. What is Belady's anomaly?",
      topic: "Virtual Memory",
      level: 2,
      top: true,
      short: "When no frame is free the OS evicts a victim: FIFO evicts the oldest-loaded page, LRU the least recently used, Optimal the page not needed for the longest time in the future (ideal, not implementable). Belady's anomaly is FIFO producing more page faults when given more frames; stack algorithms like LRU and Optimal never show it.",
      a: [
        { p: "Reference string <b>7 0 1 2 0 3 0 4 2 3 0 3 2</b>, <b>3 frames</b>. Frame contents after each reference; <b>F</b> = page fault." },
        { table: { head: ["Ref", "FIFO", "LRU", "Optimal"], rows: [
          ["7", "7 – – F", "7 – – F", "7 – – F"],
          ["0", "7 0 – F", "7 0 – F", "7 0 – F"],
          ["1", "7 0 1 F", "7 0 1 F", "7 0 1 F"],
          ["2", "2 0 1 F", "2 0 1 F", "2 0 1 F"],
          ["0", "2 0 1", "2 0 1", "2 0 1"],
          ["3", "2 3 1 F", "2 0 3 F", "2 0 3 F"],
          ["0", "2 3 0 F", "2 0 3", "2 0 3"],
          ["4", "4 3 0 F", "4 0 3 F", "2 4 3 F"],
          ["2", "4 2 0 F", "4 0 2 F", "2 4 3"],
          ["3", "4 2 3 F", "4 3 2 F", "2 4 3"],
          ["0", "0 2 3 F", "0 3 2 F", "2 0 3 F"],
          ["3", "0 2 3", "0 3 2", "2 0 3"],
          ["2", "0 2 3", "0 3 2", "2 0 3"],
          ["<b>Faults</b>", "<b>10</b>", "<b>9</b>", "<b>7</b>"]
        ] } },
        { table: { head: ["Algorithm", "Evicts", "Pros", "Cons"], rows: [
          ["FIFO", "Page loaded earliest", "Trivial (queue)", "Evicts hot pages; Belady's anomaly"],
          ["Optimal (OPT/MIN)", "Page used furthest in future", "Lowest possible faults — benchmark", "Needs future knowledge"],
          ["LRU", "Page unused for longest time", "Close to OPT using past as predictor", "Exact LRU needs timestamps or a stack on every access"],
          ["Clock / second-chance", "Circular scan; skip pages with reference bit 1 (and clear it)", "Cheap LRU approximation", "Approximate"],
          ["LFU / MFU", "Least / most frequently used", "—", "Rarely good in practice"]
        ] } },
        { h: "Belady's anomaly" },
        { p: "With FIFO, reference string <b>1 2 3 4 1 2 5 1 2 3 4 5</b> gives <b>9 faults with 3 frames</b> but <b>10 faults with 4 frames</b>. More memory, worse performance." },
        { p: "LRU and Optimal are <b>stack algorithms</b>: the set of pages held with n frames is always a subset of those held with n + 1 frames, so adding frames can never increase faults. FIFO lacks this inclusion property." },
        { tip: "Real kernels implement LRU approximations: Linux uses active/inactive lists (and multi-gen LRU since 6.1), Windows uses working-set trimming with a clock-like aging scheme." }
      ]
    },
    {
      id: "thrashing",
      q: "What is thrashing? How do the working-set model and page-fault frequency prevent it?",
      topic: "Virtual Memory",
      level: 2,
      top: true,
      short: "Thrashing is when processes spend more time paging than executing because they do not have enough frames for their active pages; CPU utilisation collapses. It is prevented by giving each process its working set (or controlling page-fault frequency) and reducing the degree of multiprogramming when total demand exceeds memory.",
      a: [
        { svg: `<svg viewBox="0 0 420 220" width="420" class="dg">
  <line class="ln" x1="50" y1="190" x2="400" y2="190" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="50" y1="190" x2="50" y2="20" marker-end="url(#dg-arr)"/>
  <path class="ln-a" d="M50,185 C110,90 190,45 240,45 C285,45 305,120 350,185"/>
  <line class="ln ln-d" x1="245" y1="45" x2="245" y2="190"/>
  <text class="tx-m" x="225" y="210" text-anchor="middle">degree of multiprogramming →</text>
  <text class="tx-m" x="56" y="16">CPU utilisation</text>
  <text class="tx tx-b" x="330" y="110">thrashing</text>
  <text class="tx-s" x="245" y="36" text-anchor="middle">optimum</text>
</svg>`, caption: "Adding processes helps until frames run short, then utilisation collapses" },
        { h: "The vicious cycle" },
        { ol: [
          "A process lacks frames → faults constantly and waits on disk.",
          "CPU utilisation drops, so the (naïve) long-term scheduler admits more processes.",
          "Each new process steals frames from others → even more faults → utilisation drops further."
        ] },
        { h: "Working-set model" },
        { p: "The <b>working set</b> WS(t, Δ) is the set of pages referenced in the last Δ references (the working-set window). Locality means it changes slowly. If <code>D = Σ WSS<sub>i</sub></code> (total demand) exceeds the number of frames m, the OS <b>suspends</b> a process and gives its frames to others; when D is well below m, it admits more." },
        { h: "Page-fault frequency (PFF)" },
        { p: "Set an upper and lower bound on each process's fault rate. Above the upper bound → give it more frames; below the lower bound → take frames away. If no free frames exist when one needs more, swap a process out." },
        { tip: "Quick fixes to mention: add RAM, reduce multiprogramming, use local (per-process) replacement so one thrashing process cannot steal from all others." }
      ]
    },
    {
      id: "copy-on-write",
      q: "What is copy-on-write and how does it make fork() efficient?",
      topic: "Virtual Memory",
      level: 2,
      top: true,
      short: "With copy-on-write, fork() does not copy the parent's memory; parent and child share the same physical pages marked read-only, and a page is duplicated only when one of them writes to it (triggering a protection fault).",
      a: [
        { ol: [
          "On <code>fork()</code> the kernel copies only the page tables; all writable pages are marked <b>read-only + COW</b> in both processes, and each frame's reference count is incremented.",
          "Reads proceed normally from the shared frames.",
          "A write triggers a <b>protection page fault</b>. The kernel sees the COW flag, allocates a new frame, copies the page, maps it writable into the writer, and decrements the old frame's count.",
          "If the count drops to 1, the remaining owner's page can simply be made writable again — no copy."
        ] },
        { p: "Since most children call <code>exec()</code> immediately, almost no pages are ever copied — fork of a 2 GB process costs only its page tables." },
        { table: { head: ["Call", "Behaviour"], rows: [
          ["<code>fork()</code>", "COW duplicate of address space"],
          ["<code>vfork()</code>", "Child borrows the parent's address space; parent suspended until child execs/exits (dangerous, legacy)"],
          ["<code>posix_spawn()</code> / <code>clone(CLONE_VM)</code>", "Create and exec without duplicating memory"]
        ] } },
        { p: "Other uses: Redis <code>BGSAVE</code> snapshots, Btrfs/ZFS copy-on-write file systems, <code>std::string</code> in old libstdc++, zero-page sharing for freshly <code>malloc</code>ed memory." },
        { warn: "COW can surprise you: a forked child of a process with huge write-heavy memory (e.g. Redis during snapshot) can double memory usage as pages get copied." }
      ]
    },
    {
      id: "memory-mapped-files",
      q: "What are memory-mapped files (mmap)? Pros and cons versus read()/write().",
      topic: "Virtual Memory",
      level: 3,
      top: false,
      short: "mmap maps a file (or anonymous memory) into a process's virtual address space so file contents are accessed like an array; pages are loaded on demand via page faults and written back by the kernel, avoiding explicit read/write copies.",
      a: [
        { code: `#include <fcntl.h>
#include <stdio.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>

int main(int argc, char **argv) {
    if (argc < 2) return 1;
    int fd = open(argv[1], O_RDONLY);
    struct stat st;
    fstat(fd, &st);
    char *data = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
    if (data == MAP_FAILED) { perror("mmap"); return 1; }
    long lines = 0;
    for (off_t i = 0; i < st.st_size; i++)   // pages fault in lazily
        if (data[i] == '\\n') lines++;
    printf("%ld lines\\n", lines);
    munmap(data, st.st_size);
    close(fd);
    return 0;
}`, lang: "c", title: "Count lines of a file via mmap" },
        { table: { head: ["", "mmap", "read()/write()"], rows: [
          ["Copies", "Zero-copy — page cache mapped directly", "Kernel → user buffer copy per call"],
          ["Random access", "Pointer arithmetic", "<code>lseek</code> + syscall each time"],
          ["Sharing", "<code>MAP_SHARED</code> gives shared memory between processes", "Needs separate IPC"],
          ["Error handling", "I/O errors arrive as <code>SIGBUS</code>", "Return codes"],
          ["Small / sequential files", "Setup + page-fault overhead can be slower", "Often faster with read-ahead"]
        ] } },
        { p: "Used by the dynamic loader (shared libraries), databases (LMDB, older MongoDB engine), and <code>MAP_ANONYMOUS</code> is how <code>malloc</code> obtains large blocks." }
      ]
    },

    /* ───────────── File Systems & Storage ───────────── */
    {
      id: "inode",
      q: "What is an inode? What does it store and how does it locate file data?",
      topic: "File Systems & Storage",
      level: 2,
      top: true,
      short: "An inode is the on-disk structure in Unix file systems that holds a file's metadata (type, permissions, owner, size, timestamps, link count) and pointers to its data blocks — direct, single, double and triple indirect — but not the file name, which lives in the directory entry.",
      a: [
        { p: "A <b>directory</b> is just a table of <code>(name → inode number)</code> entries. Opening <code>/home/a.txt</code> walks directories to find the inode number, then reads the inode." },
        { svg: `<svg viewBox="0 0 600 235" width="600" class="dg">
  <rect class="box-a" x="20" y="20" width="160" height="200" rx="6"/>
  <text class="tx tx-b" x="100" y="40" text-anchor="middle">inode 1234</text>
  <text class="tx-s" x="100" y="60" text-anchor="middle">type, mode, uid/gid, size</text>
  <text class="tx-s" x="100" y="76" text-anchor="middle">atime/mtime/ctime, links</text>
  <rect class="box" x="30" y="96" width="140" height="24" rx="6"/>
  <text class="tx-s" x="100" y="108" text-anchor="middle" dominant-baseline="middle">12 direct pointers</text>
  <rect class="box" x="30" y="126" width="140" height="24" rx="6"/>
  <text class="tx-s" x="100" y="138" text-anchor="middle" dominant-baseline="middle">single indirect</text>
  <rect class="box" x="30" y="156" width="140" height="24" rx="6"/>
  <text class="tx-s" x="100" y="168" text-anchor="middle" dominant-baseline="middle">double indirect</text>
  <rect class="box" x="30" y="186" width="140" height="24" rx="6"/>
  <text class="tx-s" x="100" y="198" text-anchor="middle" dominant-baseline="middle">triple indirect</text>
  <rect class="box-g" x="420" y="70" width="150" height="30" rx="6"/>
  <text class="tx-s" x="495" y="85" text-anchor="middle" dominant-baseline="middle">data blocks</text>
  <rect class="box-w" x="250" y="120" width="110" height="30" rx="6"/>
  <text class="tx-s" x="305" y="135" text-anchor="middle" dominant-baseline="middle">block of pointers</text>
  <rect class="box-g" x="420" y="120" width="150" height="30" rx="6"/>
  <text class="tx-s" x="495" y="135" text-anchor="middle" dominant-baseline="middle">1024 data blocks</text>
  <rect class="box-w" x="250" y="165" width="110" height="30" rx="6"/>
  <text class="tx-s" x="305" y="180" text-anchor="middle" dominant-baseline="middle">2 levels of pointers</text>
  <rect class="box-g" x="420" y="165" width="150" height="30" rx="6"/>
  <text class="tx-s" x="495" y="180" text-anchor="middle" dominant-baseline="middle">1024² data blocks</text>
  <line class="ln-a" x1="170" y1="108" x2="418" y2="88" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="170" y1="138" x2="248" y2="135" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="360" y1="135" x2="418" y2="135" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="170" y1="168" x2="248" y2="178" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="360" y1="180" x2="418" y2="180" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="190" y="215">triple → 3 levels → 1024³ blocks</text>
</svg>`, caption: "ext2/ext3-style inode block map" },
        { h: "Maximum file size (4 KB blocks, 4-byte block pointers → 1024 pointers per block)" },
        { table: { head: ["Pointer type", "Blocks addressed", "Data"], rows: [
          ["12 direct", "12", "48 KB"],
          ["Single indirect", "1024", "4 MB"],
          ["Double indirect", "1024²", "4 GB"],
          ["Triple indirect", "1024³", "4 TB"]
        ] } },
        { ul: [
          "Small files need no indirection — fast. Large files pay extra reads (cached in practice).",
          "ext4 replaces block maps with <b>extents</b> (start block + length), far more compact for large contiguous files.",
          "Inodes are created at <code>mkfs</code> time; a disk can run out of inodes (<code>df -i</code>) with free space left — common with millions of tiny files."
        ] },
        { tip: "Great follow-up: <i>why can you delete an open file on Linux and the process keeps reading it?</i> Deleting removes the directory entry (link count → 0), but the inode and blocks are freed only when the last open file descriptor closes." }
      ]
    },
    {
      id: "file-allocation-methods",
      q: "Explain contiguous, linked and indexed file allocation methods.",
      topic: "File Systems & Storage",
      level: 2,
      top: true,
      short: "Contiguous allocation stores a file in consecutive blocks (fast sequential and random access, external fragmentation); linked allocation chains blocks with pointers (no fragmentation, slow random access — FAT is a variant); indexed allocation keeps all block pointers in an index block (fast random access, index overhead — Unix inodes).",
      a: [
        { table: { head: ["", "Contiguous", "Linked", "Indexed"], rows: [
          ["Directory stores", "Start block + length", "First (and last) block", "Pointer to index block"],
          ["Sequential access", "Excellent", "Good", "Good"],
          ["Random access", "O(1): start + i", "O(i): follow i pointers", "O(1) via index (plus indirection for big files)"],
          ["Fragmentation", "External", "None", "None"],
          ["File growth", "Hard — may need to move file", "Easy", "Easy until index is full"],
          ["Overhead", "None", "Pointer in every block; one bad pointer loses the rest", "Index block per file (wasteful for tiny files)"],
          ["Examples", "CD-ROM (ISO 9660), extents", "FAT (table of links kept separately)", "Unix inode, NTFS MFT"]
        ] } },
        { p: "<b>FAT</b> (File Allocation Table) moves the 'next block' pointers of linked allocation into a table at the start of the volume. The table can be cached in RAM, so random access becomes fast pointer-chasing in memory instead of disk reads." },
        { p: "Modern file systems mix approaches: ext4 and NTFS use <b>extents</b> — contiguous runs recorded in an index — combining contiguous speed with indexed flexibility." },
        { h: "Free-space management" },
        { ul: [
          "<b>Bitmap</b> — one bit per block; easy to find contiguous runs (ext4).",
          "<b>Linked free list</b>, <b>grouping</b>, <b>counting</b> (start, length) — alternatives trading space for search time."
        ] }
      ]
    },
    {
      id: "disk-scheduling",
      q: "Explain disk scheduling algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK with an example.",
      topic: "File Systems & Storage",
      level: 2,
      top: true,
      short: "Disk scheduling orders pending I/O requests to minimise head movement (seek time): FCFS serves in arrival order, SSTF picks the nearest cylinder, SCAN sweeps end to end like an elevator, C-SCAN sweeps one way and jumps back, LOOK/C-LOOK are SCAN/C-SCAN that reverse at the last request instead of the disk edge.",
      a: [
        { p: "Queue: <b>98, 183, 37, 122, 14, 124, 65, 67</b>; head at <b>53</b>; cylinders 0–199; for SCAN-family assume the head is moving towards higher cylinders." },
        { svg: `<svg viewBox="0 0 620 225" width="620" class="dg">
  <line class="ln" x1="40" y1="30" x2="597" y2="30"/>
  <text class="tx-s" x="40" y="22" text-anchor="middle">0</text>
  <text class="tx-s" x="79" y="22" text-anchor="middle">14</text>
  <text class="tx-s" x="144" y="22" text-anchor="middle">37</text>
  <text class="tx-s" x="188" y="22" text-anchor="middle">53</text>
  <text class="tx-s" x="225" y="22" text-anchor="middle">65,67</text>
  <text class="tx-s" x="314" y="22" text-anchor="middle">98</text>
  <text class="tx-s" x="385" y="22" text-anchor="middle">122,124</text>
  <text class="tx-s" x="552" y="22" text-anchor="middle">183</text>
  <text class="tx-s" x="597" y="22" text-anchor="middle">199</text>
  <circle class="box-a" cx="188" cy="45" r="5"/>
  <text class="tx-m" x="198" y="48">head starts at 53</text>
  <polyline class="ln-a" points="188,45 222,65 228,85 144,105 79,125 314,145 382,165 387,185 552,205" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="420" y="120">SSTF total = 236 cylinders</text>
</svg>`, caption: "SSTF head path: 53 → 65 → 67 → 37 → 14 → 98 → 122 → 124 → 183" },
        { table: { head: ["Algorithm", "Service order", "Total head movement"], rows: [
          ["FCFS", "98, 183, 37, 122, 14, 124, 65, 67", "640"],
          ["SSTF", "65, 67, 37, 14, 98, 122, 124, 183", "<b>236</b>"],
          ["SCAN (up)", "65, 67, 98, 122, 124, 183, <i>199</i>, 37, 14", "146 + 185 = 331"],
          ["C-SCAN (up)", "65 … 183, <i>199 → 0</i>, 14, 37", "146 + 199 + 37 = 382 (incl. return)"],
          ["LOOK (up)", "65 … 183, then 37, 14", "130 + 169 = 299"],
          ["C-LOOK (up)", "65 … 183, jump to 14, 37", "130 + 169 + 23 = 322 (incl. jump)"]
        ] } },
        { p: "(If SCAN starts moving towards 0 instead: 53 → 37 → 14 → 0 → 65 … 183 = 53 + 183 = <b>236</b>, the textbook figure.)" },
        { table: { head: ["Algorithm", "Pros", "Cons"], rows: [
          ["FCFS", "Fair, simple", "Wild swings, high total seek"],
          ["SSTF", "Low average seek", "Starvation of far requests; not optimal"],
          ["SCAN (elevator)", "No starvation, good under heavy load", "Ends of the disk wait longest"],
          ["C-SCAN", "More uniform wait time", "Wasted return sweep"],
          ["LOOK / C-LOOK", "Avoid travelling to the disk edge", "Slightly more bookkeeping"]
        ] } },
        { warn: "Some textbooks don't count the C-SCAN/C-LOOK return jump as head movement (it is a fast seek with no servicing). State your convention when giving a number." },
        { tip: "On SSDs there is no seek time, so Linux defaults to <code>none</code> or <code>mq-deadline</code>; elevator algorithms matter for HDDs." }
      ]
    },
    {
      id: "hard-vs-soft-link",
      q: "What is the difference between a hard link and a soft (symbolic) link?",
      topic: "File Systems & Storage",
      level: 2,
      top: false,
      short: "A hard link is another directory entry pointing to the same inode (same file, counted in the link count); a symbolic link is a separate small file whose content is a path to the target, so it can cross file systems and point to directories but breaks if the target is removed.",
      a: [
        { table: { head: ["", "Hard link", "Soft / symbolic link"], rows: [
          ["Points to", "The inode directly", "A path name"],
          ["Own inode?", "No — shares target's inode", "Yes"],
          ["Target deleted", "Data survives until link count reaches 0", "Dangling link"],
          ["Across file systems", "No (inode numbers are per-FS)", "Yes"],
          ["To directories", "Not allowed (would create cycles)", "Allowed"],
          ["Command", "<code>ln target name</code>", "<code>ln -s target name</code>"]
        ] } },
        { code: `echo hello > a.txt
ln a.txt hard.txt        # same inode
ln -s a.txt soft.txt     # new inode storing the path "a.txt"
ls -li                   # compare inode numbers and link counts
rm a.txt
cat hard.txt             # hello
cat soft.txt             # No such file or directory (dangling)`, lang: "bash", title: "Try it" }
      ]
    },
    {
      id: "raid-levels",
      q: "Explain RAID levels 0, 1, 5, 6 and 10.",
      topic: "File Systems & Storage",
      level: 2,
      top: false,
      short: "RAID combines disks for performance and/or redundancy: RAID 0 stripes (fast, no redundancy), RAID 1 mirrors, RAID 5 stripes with distributed parity (survives 1 failure), RAID 6 uses double parity (2 failures), RAID 10 stripes across mirrored pairs.",
      a: [
        { table: { head: ["Level", "Technique", "Min disks", "Usable capacity (n disks)", "Tolerates", "Notes"], rows: [
          ["RAID 0", "Striping", "2", "n", "0 failures", "Fastest; any failure loses everything"],
          ["RAID 1", "Mirroring", "2", "n / 2 (one disk for 2)", "n − 1 of a mirror set", "Fast reads, simple rebuild"],
          ["RAID 5", "Striping + distributed parity (XOR)", "3", "n − 1", "1 failure", "Write penalty (read-modify-write); long rebuilds"],
          ["RAID 6", "Striping + dual parity", "4", "n − 2", "2 failures", "Safer for big disks, slower writes"],
          ["RAID 10 (1+0)", "Stripe over mirrored pairs", "4", "n / 2", "1 per mirror pair", "Best write performance + redundancy, costly"]
        ] } },
        { p: "Parity: <code>P = D1 ⊕ D2 ⊕ D3</code>. If D2 is lost, <code>D2 = D1 ⊕ D3 ⊕ P</code>." },
        { warn: "RAID is not a backup. It protects against disk failure, not against deletion, corruption, ransomware or a controller writing garbage to all disks." }
      ]
    },
    {
      id: "journaling-fs",
      q: "What is a journaling file system and why is it needed?",
      topic: "File Systems & Storage",
      level: 3,
      top: false,
      short: "A journaling file system writes intended metadata (and optionally data) changes to a log first, then applies them; after a crash it replays or discards log entries, keeping the file system consistent without a full fsck scan.",
      a: [
        { p: "Creating a file updates several structures (inode bitmap, inode, directory, block bitmap). A crash between these writes leaves the FS inconsistent. Without a journal, <code>fsck</code> must scan the whole disk — hours on large volumes." },
        { ol: [
          "<b>Journal write</b>: write a transaction (TxBegin, changed blocks) to the log.",
          "<b>Commit</b>: write TxEnd once the transaction is durable.",
          "<b>Checkpoint</b>: write the changes to their real locations.",
          "<b>Free</b>: mark the transaction space reusable.",
          "Recovery: replay committed transactions; ignore uncommitted ones."
        ] },
        { table: { head: ["ext4 mode", "Journals", "Trade-off"], rows: [
          ["journal", "Metadata + data", "Safest, data written twice"],
          ["ordered (default)", "Metadata only; data flushed before metadata commit", "Good balance"],
          ["writeback", "Metadata only, no ordering", "Fastest; stale data may appear in files after crash"]
        ] } },
        { p: "Alternatives: <b>copy-on-write</b> file systems (ZFS, Btrfs, APFS) never overwrite live data — they write new blocks and atomically switch the root pointer; log-structured FS (F2FS for flash)." }
      ]
    },

    /* ───────────── I/O & Misc ───────────── */
    {
      id: "interrupts-vs-polling",
      q: "What is an interrupt? Compare interrupt-driven I/O with polling.",
      topic: "I/O & Misc",
      level: 1,
      top: true,
      short: "An interrupt is a hardware signal that makes the CPU suspend its current work and run an interrupt service routine; with polling the CPU repeatedly checks a device status register. Interrupts avoid wasted cycles for slow/infrequent events; polling can be better for very fast devices or high event rates.",
      a: [
        { h: "Interrupt handling" },
        { ol: [
          "Device raises an interrupt line (or sends an MSI message).",
          "CPU finishes the current instruction, saves PC/flags, switches to kernel mode.",
          "Uses the interrupt number to index the <b>interrupt vector table</b> (IDT on x86) and jumps to the ISR.",
          "ISR acknowledges the device, does minimal work (top half), defers the rest (bottom half: softirq, tasklet, workqueue).",
          "Return-from-interrupt restores state; the scheduler may pick a different process."
        ] },
        { table: { head: ["", "Polling (busy-waiting)", "Interrupts"], rows: [
          ["CPU usage while waiting", "Wasted spinning", "Free to run other work"],
          ["Latency", "Very low if polling constantly", "Interrupt entry/exit overhead"],
          ["Best for", "Very fast devices, high event rates (NVMe, 100 GbE, DPDK)", "Slow or sporadic events (keyboard, disk completion)"],
          ["Risk", "Burns CPU", "Interrupt storms / livelock at very high rates"]
        ] } },
        { p: "Linux NAPI uses a <b>hybrid</b>: take one interrupt, then switch to polling while packets keep arriving, then re-enable interrupts." },
        { table: { head: ["Kind", "Source", "Example"], rows: [
          ["Hardware interrupt", "External device", "Timer, NIC, disk"],
          ["Exception / trap (synchronous)", "Current instruction", "Page fault, divide by zero, <code>syscall</code>"],
          ["Software interrupt", "Explicit instruction", "<code>int 0x80</code> (legacy syscall)"]
        ] } },
        { tip: "Also mention <b>maskable vs non-maskable</b> (NMI — used for hardware errors and watchdogs) interrupts." }
      ]
    },
    {
      id: "dma",
      q: "What is DMA (Direct Memory Access) and why is it used?",
      topic: "I/O & Misc",
      level: 2,
      top: true,
      short: "DMA lets a device controller transfer blocks of data directly between the device and main memory without the CPU copying each byte; the CPU only sets up the transfer and receives one interrupt when the whole block is done.",
      a: [
        { p: "Without DMA (programmed I/O), the CPU moves every word between the device register and memory — wasteful for disks and NICs that transfer megabytes." },
        { ol: [
          "Driver allocates a buffer and programs the DMA controller / device: source, destination address, byte count, direction.",
          "Device and DMA controller move data over the bus directly to/from RAM (the CPU keeps running other work).",
          "When the count reaches zero, the device raises <b>one interrupt</b>.",
          "Driver marks the I/O complete and wakes the waiting process."
        ] },
        { table: { head: ["", "Programmed I/O", "Interrupt-driven I/O", "DMA"], rows: [
          ["CPU involvement", "Every word, busy-waits", "Every word/byte, via interrupts", "Only setup + completion"],
          ["Interrupts", "None", "One per word/byte", "One per block"],
          ["Suited for", "Tiny, simple devices", "Keyboard, serial", "Disk, network, GPU"]
        ] } },
        { ul: [
          "<b>Cycle stealing</b>: the DMA controller occasionally takes the memory bus from the CPU, slowing it slightly.",
          "<b>Scatter–gather DMA</b> transfers into multiple non-contiguous buffers in one operation.",
          "<b>IOMMU</b> translates device addresses and blocks malicious devices from accessing arbitrary memory (DMA attacks via Thunderbolt).",
          "Cache coherence: the OS must flush/invalidate CPU caches for DMA buffers on non-coherent architectures."
        ] }
      ]
    },
    {
      id: "spooling-buffering",
      q: "What are spooling, buffering and caching? How do they differ?",
      topic: "I/O & Misc",
      level: 1,
      top: true,
      short: "Buffering temporarily holds data in memory while it is transferred between two parties with different speeds or sizes; caching keeps a copy of frequently used data in faster storage; spooling queues whole jobs on disk for a device that can serve only one job at a time, such as a printer.",
      a: [
        { table: { head: ["", "Buffering", "Caching", "Spooling"], rows: [
          ["Purpose", "Smooth speed / size mismatch between producer and consumer", "Speed up repeated access", "Let many processes share a non-shareable device"],
          ["Holds", "The only copy of data in transit", "A copy of data that also lives elsewhere", "Complete jobs queued on disk"],
          ["Example", "Keyboard buffer, double buffering of disk reads, <code>stdio</code> buffers", "Page cache, CPU L1/L2/L3, browser cache", "Print queue, mail queue"],
          ["Overlap", "One job's I/O with its own computation", "—", "I/O of one job with computation of others"]
        ] } },
        { p: "<b>SPOOL</b> = Simultaneous Peripheral Operations On-Line. Each process 'prints' instantly by writing to a spool directory; a daemon (e.g. CUPS) feeds jobs to the printer one at a time. Spooling also helps break the mutual-exclusion condition for deadlocks on printers." },
        { ul: [
          "<b>Single buffering</b>: device fills buffer while process waits.",
          "<b>Double buffering</b>: device fills one buffer while the process consumes the other (also used in graphics to avoid tearing).",
          "<b>Circular buffering</b>: more than two buffers for bursty streams."
        ] }
      ]
    },
    {
      id: "cache-locality",
      q: "What is locality of reference? How does it make caches and paging work?",
      topic: "I/O & Misc",
      level: 2,
      top: false,
      short: "Programs tend to reuse recently accessed data (temporal locality) and access data near recently accessed addresses (spatial locality); caches, TLBs, prefetching and demand paging all exploit this so a small fast memory can serve most accesses.",
      a: [
        { table: { head: ["Level", "Typical size", "Latency"], rows: [
          ["Registers", "&lt; 1 KB", "~0.3 ns"],
          ["L1 cache", "32–64 KB / core", "~1 ns"],
          ["L2 cache", "0.5–2 MB / core", "~4 ns"],
          ["L3 cache", "8–64 MB shared", "~10–20 ns"],
          ["DRAM", "GBs", "~80–100 ns"],
          ["NVMe SSD", "TBs", "~20–100 µs"],
          ["HDD", "TBs", "~5–10 ms"]
        ] } },
        { ul: [
          "<b>Temporal locality</b>: loop counters, hot functions, recently read variables → keep recently used lines (LRU-like replacement).",
          "<b>Spatial locality</b>: arrays, sequential code → caches fetch whole 64-byte lines; the OS pages in 4 KB pages; disks read ahead.",
          "Performance: <code>AMAT = hit time + miss rate × miss penalty</code>."
        ] },
        { code: `#include <stdio.h>
#define N 4096
static int a[N][N];

int main(void) {
    long sum = 0;
    // Row-major traversal: consecutive addresses -> cache and TLB friendly
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            sum += a[i][j];
    // Column-major traversal a[j][i] touches a new cache line (and often a new page)
    // on every access and is typically several times slower.
    printf("%ld\\n", sum);
    return 0;
}`, lang: "c", title: "Spatial locality in a 2-D array (C is row-major)" },
        { tip: "False sharing is the multicore flip side: two threads writing different variables on the same 64-byte cache line keep invalidating each other's caches — pad or align hot per-thread data to a cache line." }
      ]
    }
  ]
});
