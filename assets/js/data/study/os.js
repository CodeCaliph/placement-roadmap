/* study: Operating Systems — lessons for the 60-day plan */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ------------------------------------------------------------------ */
  /* D8 — processes, threads, fork()                                     */
  /* ------------------------------------------------------------------ */
  add({
    id: "os-processes",
    subject: "os",
    title: "Processes, threads, PCB, context switch & fork()",
    minutes: 75,
    crux: [
      "A <b>process</b> is a program in execution with its <b>own address space</b> (code, data, heap, stack) and OS resources; a <b>thread</b> is a unit of execution <i>inside</i> a process that shares the code, heap, globals and open files, but has its own <b>stack, registers and program counter</b>.",
      "Five states: <b>New → Ready → Running → (Waiting) → Terminated</b>. Running → Ready on a timer interrupt/preemption; Running → Waiting on I/O; Waiting → Ready when I/O finishes. Waiting never goes straight to Running.",
      "The OS keeps each process in a <b>PCB</b> (PID, state, PC, registers, scheduling info, memory maps, open files). A <b>context switch</b> saves the old PCB and loads the new one — pure overhead, no useful work.",
      "<code>fork()</code> clones the caller: returns <b>0 in the child</b>, the <b>child's PID in the parent</b>, −1 on failure. <code>exec()</code> replaces the process image (never returns on success). <code>wait()</code> blocks the parent until a child exits and reaps it.",
      "<b>n</b> sequential <code>fork()</code> calls → <b>2<sup>n</sup></b> processes, <b>2<sup>n</sup> − 1</b> of them new children.",
      "<b>Zombie</b> = child exited but parent has not called <code>wait()</code> (PCB entry lingers). <b>Orphan</b> = parent died first; the child is adopted by <code>init</code>/<code>systemd</code> (PID 1), which reaps it."
    ],
    sections: [
      {
        h: "Process vs thread",
        blocks: [
          { p: "A <b>program</b> is a passive file on disk. When the OS loads it and starts executing it, it becomes a <b>process</b>: an active entity with a program counter, CPU registers and a private virtual address space laid out as <b>text (code) → data (globals) → heap (grows up) → … → stack (grows down)</b>." },
          { p: "A <b>thread</b> is the smallest unit the CPU scheduler dispatches. A process starts with one thread; it can create more. All threads of a process see the same memory, so they communicate by simply reading/writing shared variables — fast, but it is exactly why they need synchronization (D11)." },
          { table: { head: ["", "Process", "Thread"], rows: [
            ["Address space", "Own, isolated", "Shared with sibling threads"],
            ["Owns", "Code, data, heap, open files, PID", "Only stack, registers, PC, thread-local storage"],
            ["Creation cost", "Heavy (copy page tables, allocate PCB)", "Light (allocate a stack + TCB)"],
            ["Context switch", "Expensive: switch address space, TLB flush/refill", "Cheap: same address space, only registers/stack"],
            ["Communication", "IPC: pipes, sockets, shared memory, message queues", "Shared variables directly"],
            ["Failure isolation", "A crash stays inside that process", "One bad thread can crash the whole process"],
            ["Example", "Each Chrome tab is a separate process", "A Java server handles each request on a pool thread"]
          ] } },
          { tip: "One-line answer that impresses: <i>“A process is the unit of resource ownership; a thread is the unit of scheduling. Threads trade isolation for cheap creation and cheap communication.”</i>" },
          { code: `import java.io.IOException;

public class SpawnDemo {
    public static void main(String[] args) throws IOException, InterruptedException {
        // Java has no fork(). ProcessBuilder = fork() + exec() in one call.
        ProcessBuilder pb = new ProcessBuilder("java", "-version");
        pb.inheritIO();                    // child writes to our console
        Process child = pb.start();        // new OS process, new address space
        int code = child.waitFor();        // like wait(): block until the child exits
        System.out.println("child pid=" + child.pid() + " exit=" + code);

        // Threads share the heap: the new thread's write is visible to main.
        int[] shared = {0};
        Thread t = new Thread(() -> shared[0] = 42);
        t.start();
        t.join();                          // like wait() for a thread
        System.out.println("thread wrote " + shared[0]);
    }
}`, lang: "java", title: "Process vs thread in Java" }
        ]
      },
      {
        h: "Process states, PCB and context switch",
        blocks: [
          { svg: `<svg viewBox="0 0 700 215" width="700" class="dg">
  <rect class="box" x="20" y="40" width="100" height="36" rx="8"/>
  <text class="tx tx-b" x="70" y="58" text-anchor="middle" dominant-baseline="middle">New</text>
  <rect class="box-a" x="190" y="40" width="110" height="36" rx="8"/>
  <text class="tx tx-b" x="245" y="58" text-anchor="middle" dominant-baseline="middle">Ready</text>
  <rect class="box-g" x="390" y="40" width="110" height="36" rx="8"/>
  <text class="tx tx-b" x="445" y="58" text-anchor="middle" dominant-baseline="middle">Running</text>
  <rect class="box-r" x="570" y="40" width="115" height="36" rx="8"/>
  <text class="tx tx-b" x="627" y="58" text-anchor="middle" dominant-baseline="middle">Terminated</text>
  <rect class="box-w" x="290" y="160" width="120" height="36" rx="8"/>
  <text class="tx tx-b" x="350" y="178" text-anchor="middle" dominant-baseline="middle">Waiting</text>
  <line class="ln" x1="120" y1="58" x2="188" y2="58" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="154" y="34" text-anchor="middle">admit</text>
  <line class="ln-a" x1="300" y1="48" x2="388" y2="48" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="345" y="34" text-anchor="middle">dispatch</text>
  <line class="ln" x1="390" y1="68" x2="302" y2="68" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="345" y="90" text-anchor="middle">interrupt / preempt</text>
  <line class="ln" x1="500" y1="58" x2="568" y2="58" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="535" y="34" text-anchor="middle">exit</text>
  <line class="ln" x1="455" y1="76" x2="400" y2="158" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="478" y="128" text-anchor="middle">I/O or event wait</text>
  <line class="ln" x1="300" y1="160" x2="240" y2="78" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="222" y="128" text-anchor="middle">I/O done</text>
</svg>`, caption: "Five-state model. Only the dispatcher moves a process into Running; a finished I/O puts it back in Ready, not Running." },
          { ul: [
            "<b>New</b> — PCB being created, not yet admitted to the ready queue.",
            "<b>Ready</b> — in memory, has everything except the CPU. Sits in the ready queue.",
            "<b>Running</b> — instructions executing. On a single core, exactly one process is here.",
            "<b>Waiting / Blocked</b> — waiting for I/O, a lock, a signal, <code>sleep()</code>.",
            "<b>Terminated</b> — finished; PCB kept until the parent collects the exit status.",
            "Extended model adds <b>Ready-Suspended</b> and <b>Blocked-Suspended</b>: the medium-term scheduler swaps the process out to disk to free RAM."
          ] },
          { h: "PCB (Process Control Block)" },
          { p: "The kernel's record of a process (Linux: <code>struct task_struct</code>). Everything needed to stop a process and later resume it exactly where it was:" },
          { table: { head: ["Field", "Why it is needed"], rows: [
            ["PID, parent PID", "Identity; parent needed for <code>wait()</code> and orphan adoption"],
            ["Process state", "Which queue it belongs in"],
            ["Program counter + CPU registers", "Resume execution at the exact instruction"],
            ["Scheduling info", "Priority, time used, queue pointers"],
            ["Memory-management info", "Page-table base register, limits, segment tables"],
            ["I/O & file info", "Open file descriptors, devices allocated"],
            ["Accounting", "CPU time used, time limits"]
          ] } },
          { h: "Context switch" },
          { ol: [
            "An interrupt (timer, I/O) or system call enters the kernel.",
            "Save the running process's PC, registers and state into <b>its PCB</b>; move it to the ready or waiting queue.",
            "The scheduler picks the next process.",
            "Load that process's PCB: registers, PC, page-table base (address space switch — the TLB is flushed unless it has ASID tags).",
            "Return to user mode; the new process continues."
          ] },
          { p: "Typical cost is a few microseconds, but the hidden cost is <b>cold caches and TLB</b> afterwards. Thread switches within one process skip the address-space change, so they are cheaper." },
          { warn: "Do not confuse <b>context switch</b> with <b>mode switch</b>. A system call switches user → kernel mode <i>within the same process</i>; no other process is scheduled, so it is not a context switch." }
        ]
      },
      {
        h: "fork(), exec(), wait() — the Unix process API",
        blocks: [
          { ul: [
            "<code>pid_t fork(void)</code> — creates a child that is a copy of the parent (same code, a <b>copy</b> of data/heap/stack, same open files, same PC). Both continue from the line after <code>fork()</code>. Return value: <b>0 in child</b>, <b>child PID (&gt;0) in parent</b>, <b>−1</b> if it failed.",
            "Modern kernels use <b>copy-on-write</b>: pages are shared read-only and copied only when one side writes, so fork is cheap even for big processes.",
            "<code>exec*()</code> (<code>execl, execvp, …</code>) — loads a new program into the <i>current</i> process. Same PID, new code/data/stack. Returns only on error.",
            "<code>wait(&amp;status)</code> / <code>waitpid(pid, &amp;status, 0)</code> — parent blocks until a child terminates, collects its exit status, and the kernel frees the child's PCB entry.",
            "<code>exit(n)</code> — terminates, flushes stdio buffers, becomes a zombie until reaped.",
            "A shell runs a command as: <b>fork → child exec(command) → parent wait()</b>."
          ] },
          { code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }

    if (pid == 0) {                          /* child */
        printf("child: my pid=%d parent=%d\\n", getpid(), getppid());
        execlp("ls", "ls", "-l", (char *)NULL); /* replaces the child image */
        perror("exec");                      /* reached only if exec failed */
        exit(1);
    }

    int status;                              /* parent */
    waitpid(pid, &status, 0);                /* block until the child ends, reap it */
    if (WIFEXITED(status))
        printf("parent: child %d exited with %d\\n", pid, WEXITSTATUS(status));
    return 0;
}`, lang: "c", title: "Shell-style fork + exec + wait" },
          { h: "Zombie and orphan" },
          { table: { head: ["", "Zombie (defunct)", "Orphan"], rows: [
            ["What happened", "Child exited; parent is alive but has not called <code>wait()</code>", "Parent exited while the child is still running"],
            ["State", "Terminated, only the PCB/process-table slot remains (<code>Z</code> in <code>ps</code>)", "Running normally"],
            ["Harm", "Leaks PID slots; many zombies can exhaust the PID table", "None — it is adopted"],
            ["Fix", "Parent calls <code>wait()</code>, handles <code>SIGCHLD</code>, or the parent is killed (then init adopts and reaps)", "Re-parented to <code>init</code>/<code>systemd</code> (PID 1) or a subreaper, which calls <code>wait()</code>"]
          ] } },
          { code: `/* zombie: child exits at once, parent sleeps without wait() */
if (fork() == 0) exit(0);
sleep(30);            /* for 30 s, 'ps' shows the child as <defunct> (Z) */

/* orphan: parent exits at once, child keeps running */
if (fork() > 0) exit(0);
sleep(30);            /* getppid() now returns 1 (or a subreaper's PID) */`, lang: "c", title: "Making a zombie and an orphan" },
          { warn: "You cannot <code>kill -9</code> a zombie — it is already dead. You must make its parent reap it (or kill the parent)." }
        ]
      },
      {
        h: "fork() output prediction — 10 solved problems",
        blocks: [
          { p: "<b>Method:</b> draw a process tree. At every <code>fork()</code>, each process that executes it splits in two; the child gets return value 0, the parent a positive PID. Then count how many processes reach each <code>printf</code>. Assume headers are included and calls succeed." },
          { ol: [
            '<code>fork(); fork(); printf("hi\\n");</code><br><b>Answer: 4.</b> 1 → 2 after the first fork → 4 after the second; all 4 print.',
            '<code>fork(); fork(); fork(); printf("hi\\n");</code><br><b>Answer: 8 lines</b>, 8 processes in total, <b>7</b> of them children. General rule: n forks in sequence → 2<sup>n</sup> processes.',
            '<code>for (int i = 0; i &lt; 3; i++) fork(); printf("x\\n");</code><br><b>Answer: 8.</b> A loop of n forks is the same as n sequential forks → 2<sup>3</sup>. (Children created = 7.)',
            '<code>if (fork() == 0) printf("child\\n"); else printf("parent\\n");</code><br><b>Answer:</b> “child” once and “parent” once, in <b>either order</b> — the scheduler decides who runs first. Never assume the parent prints first.',
            '<code>fork() &amp;&amp; fork() || fork(); printf("x\\n");</code><br><b>Answer: 5.</b> Parse as <code>(A &amp;&amp; B) || C</code>. Parent: A&gt;0 so it runs B. Parent of B gets &gt;0 → left side true → C skipped. Child of B gets 0 → left side false → runs C (2 processes). Child of A gets 0 → <code>&amp;&amp;</code> short-circuits → left side false → runs C (2 processes). Total: parent + B-child + its C-child + A-child + its C-child = <b>5</b>.',
            '<code>fork(); fork() &amp;&amp; fork(); printf("x\\n");</code><br><b>Answer: 6.</b> After the first fork there are 2 processes. Each runs <code>fork() &amp;&amp; fork()</code>: the parent side (&gt;0) runs the third fork, the child side (0) short-circuits. So each of the 2 becomes 3 → <b>6</b>.',
            '<code>int x = 10; if (fork() == 0) { x += 5; printf("child %d\\n", x); } else { wait(NULL); x -= 5; printf("parent %d\\n", x); }</code><br><b>Answer:</b> <code>child 15</code> then <code>parent 5</code>. Each process has its <b>own copy</b> of x (copy-on-write), so changes are not shared. <code>wait()</code> forces the child line first.',
            '<code>printf("A"); fork(); printf("B\\n");</code><br><b>Answer:</b> <code>AB</code> printed <b>twice</b>. “A” has no newline, so it is still sitting in the stdio buffer when fork copies the process; both copies flush “A” with their “B\\n”. With <code>printf("A\\n")</code> on a terminal (line-buffered) “A” appears once — but if stdout is redirected to a file (fully buffered) it appears twice again.',
            '<code>for (int i = 0; i &lt; 2; i++) { fork(); printf("-"); }</code><br><b>Answer: 8 dashes.</b> Unbuffered you would expect 2 (iteration 0) + 4 (iteration 1) = 6, but “-” has no newline: the 2 dashes buffered in iteration 0 are copied into the children created in iteration 1. Four processes each flush “--” at exit → 8. With <code>fflush(stdout)</code> after each printf → 6.',
            '<code>for (int i = 0; i &lt; 3; i++) if (fork() == 0) break; printf("x\\n");</code><br><b>Answer: 4.</b> Each child breaks out immediately, so only the original parent keeps looping: it creates 3 children (a “fan”), total 4 processes. Compare: <code>if (fork() != 0) break;</code> makes the <i>parent</i> leave, so each child forks the next → a “chain” of 4 processes, also 4 lines.'
          ] },
          { tip: "In interviews, say the tree out loud: “after fork 1 we have 2 processes, both execute fork 2…”. Mention stdio buffering if the printf has no <code>\\n</code> — it shows you understand that fork copies user-space memory, including the buffer." },
          { warn: "Count the <b>printf executions</b>, not the fork calls. And “how many child processes are created?” is 2<sup>n</sup> − 1, not 2<sup>n</sup>." }
        ]
      }
    ],
    practice: [
      { q: 'How many times is "OS" printed? <code>int main(){ pid_t p = fork(); if (p == 0) { fork(); fork(); printf("OS\\n"); } else printf("P\\n"); }</code>', a: "The parent prints “P” once. The child executes two more forks → 2<sup>2</sup> = 4 processes in the child's subtree, each prints “OS”. Answer: <b>4</b> times “OS”, 1 “P”, 5 processes in total." },
      { q: "A process is in the Waiting state and its disk read completes. Which state does it enter, and why not Running?", a: "It enters <b>Ready</b>. Only the short-term scheduler (dispatcher) can give it the CPU; another process may be running and there may be higher-priority processes in the ready queue." },
      { q: "Why is a thread context switch cheaper than a process context switch?", a: "Threads of one process share the address space, so the switch saves/restores only registers, PC and stack pointer. A process switch must also change the page-table base register, which invalidates (or needs ASID-tagging of) the TLB and leaves caches cold for the new address space." },
      { q: "A server creates a child for every request and never calls wait(). What goes wrong and how do you fix it?", a: "Every finished child becomes a <b>zombie</b>, holding a process-table/PID slot. Eventually <code>fork()</code> fails with EAGAIN. Fix: install a <code>SIGCHLD</code> handler that loops <code>waitpid(-1, &amp;s, WNOHANG)</code>, or set <code>SIGCHLD</code> to <code>SIG_IGN</code> so the kernel auto-reaps." },
      { q: "What does exec() return, and does the PID change after exec?", a: "On success exec <b>never returns</b> — the calling code no longer exists. On failure it returns −1. The <b>PID stays the same</b>; only the program image (code, data, heap, stack) is replaced. Open file descriptors stay open unless marked close-on-exec." },
      { q: "How many processes exist after <code>fork(); fork() || fork(); </code>? ", a: "After the first fork: 2. Each runs <code>fork() || fork()</code>: the parent side gets &gt;0 (true) so <code>||</code> short-circuits; the child side gets 0 (false) so it runs the third fork, making 2. So each of the 2 becomes 3 → <b>6</b> processes." }
    ],
    related: ["os:process-vs-thread", "os:process-states", "os:pcb", "os:context-switch", "os:fork-exec", "os:zombie-orphan", "os:process-memory-layout", "os:user-vs-kernel-threads", "os:multithreading-models", "os:ipc-methods", "os:copy-on-write", "os:system-calls", "os:user-vs-kernel-mode", "os:process-schedulers"]
  });

  /* ------------------------------------------------------------------ */
  /* D9 — CPU scheduling                                                 */
  /* ------------------------------------------------------------------ */
  add({
    id: "os-cpu-scheduling",
    subject: "os",
    title: "CPU scheduling: FCFS, SJF, SRTF, Priority, Round Robin (worked)",
    minutes: 90,
    crux: [
      "<b>TAT = CT − AT</b>, <b>WT = TAT − BT</b>, <b>RT = (first time on CPU) − AT</b>. Averages: divide the column sum by the number of processes.",
      "<b>FCFS</b> — non-preemptive, simple, suffers the <b>convoy effect</b> (short jobs stuck behind a long one).",
      "<b>SJF</b> (non-preemptive) and <b>SRTF</b> (preemptive SJF) give the <b>minimum average waiting time</b>, but need burst-time prediction and can <b>starve</b> long jobs.",
      "<b>Priority</b> scheduling can starve low-priority processes; the cure is <b>aging</b> (raise priority the longer a process waits).",
      "<b>Round Robin</b>: each process gets a time quantum q, then goes to the tail of the ready queue. Best response time; q too large → FCFS, q too small → context-switch overhead.",
      "Convention for RR ties: a process that <b>arrives</b> at time t joins the queue <b>before</b> the process preempted at time t. State the convention you use."
    ],
    sections: [
      {
        h: "Vocabulary and formulas",
        blocks: [
          { table: { head: ["Term", "Meaning"], rows: [
            ["AT — arrival time", "When the process enters the ready queue"],
            ["BT — burst time", "CPU time it needs"],
            ["CT — completion time", "When it finishes (read off the Gantt chart)"],
            ["TAT — turnaround time", "<b>CT − AT</b> (total time in the system)"],
            ["WT — waiting time", "<b>TAT − BT</b> (time spent in the ready queue)"],
            ["RT — response time", "<b>first dispatch − AT</b> (important for interactive systems)"],
            ["Throughput", "Processes completed per unit time"],
            ["CPU utilisation", "Busy time / total time (idle gaps reduce it)"]
          ] } },
          { p: "<b>Preemptive</b> = the OS can take the CPU away from a running process (on arrival of a better process or on quantum expiry). <b>Non-preemptive</b> = once dispatched, a process runs until it finishes or blocks." },
          { table: { head: ["Algorithm", "Preemptive?", "Selection rule", "Problem"], rows: [
            ["FCFS", "No", "Earliest arrival", "Convoy effect, poor AWT"],
            ["SJF", "No", "Smallest BT among arrived", "Starvation of long jobs; BT unknown in practice"],
            ["SRTF", "Yes", "Smallest <i>remaining</i> time; re-check on every arrival", "Starvation; many context switches"],
            ["Priority", "Either", "Highest priority (state whether low number = high)", "Starvation → aging"],
            ["Round Robin", "Yes", "FIFO queue, quantum q", "Higher AWT/ATAT than SJF; overhead if q small"]
          ] } },
          { tip: "Always draw the Gantt chart first, then fill CT from it, then TAT and WT columns. Sanity check: <b>Σ WT = Σ TAT − Σ BT</b>." }
        ]
      },
      {
        h: "Worked table 1 — FCFS (with an idle gap)",
        blocks: [
          { table: { head: ["Process", "AT", "BT"], rows: [["P1", "0", "4"], ["P2", "1", "3"], ["P3", "2", "1"], ["P4", "10", "2"]] } },
          { p: "Serve strictly in arrival order. P1 runs 0–4, P2 4–7, P3 7–8. Nothing is ready from 8 to 10, so the CPU is <b>idle</b>. P4 runs 10–12." },
          { table: { head: ["Gantt", "0–4", "4–7", "7–8", "8–10", "10–12"], rows: [["CPU", "P1", "P2", "P3", "idle", "P4"]] } },
          { table: { head: ["Process", "AT", "BT", "CT", "TAT = CT−AT", "WT = TAT−BT"], rows: [
            ["P1", "0", "4", "4", "4", "0"],
            ["P2", "1", "3", "7", "6", "3"],
            ["P3", "2", "1", "8", "6", "5"],
            ["P4", "10", "2", "12", "2", "0"],
            ["<b>Total</b>", "", "10", "", "<b>18</b>", "<b>8</b>"]
          ] } },
          { p: "<b>ATAT = 18 / 4 = 4.5</b>, <b>AWT = 8 / 4 = 2</b>. Check: ΣTAT − ΣBT = 18 − 10 = 8 ✓. CPU utilisation = 10 busy / 12 = 83.3%." },
          { warn: "When no process has arrived, the CPU is idle — do not start P4 at time 8. Its WT is 0, not 2." }
        ]
      },
      {
        h: "Worked tables 2 & 3 — SJF vs SRTF on the same data",
        blocks: [
          { table: { head: ["Process", "AT", "BT"], rows: [["P1", "0", "7"], ["P2", "2", "4"], ["P3", "4", "1"], ["P4", "5", "4"]] } },
          { h: "SJF (non-preemptive)" },
          { p: "t=0: only P1 → runs to completion 0–7. t=7: P2(4), P3(1), P4(4) waiting → shortest is P3 (7–8). t=8: P2 and P4 both 4 → tie broken by arrival → P2 (8–12), then P4 (12–16)." },
          { table: { head: ["Gantt", "0–7", "7–8", "8–12", "12–16"], rows: [["CPU", "P1", "P3", "P2", "P4"]] } },
          { table: { head: ["Process", "AT", "BT", "CT", "TAT", "WT"], rows: [
            ["P1", "0", "7", "7", "7", "0"],
            ["P2", "2", "4", "12", "10", "6"],
            ["P3", "4", "1", "8", "4", "3"],
            ["P4", "5", "4", "16", "11", "7"],
            ["<b>Total</b>", "", "16", "", "<b>32</b>", "<b>16</b>"]
          ] } },
          { p: "<b>ATAT = 32/4 = 8</b>, <b>AWT = 16/4 = 4</b>. Check 32 − 16 = 16 ✓." },
          { h: "SRTF (preemptive SJF)" },
          { p: "Re-decide at every arrival, using <i>remaining</i> time:" },
          { ul: [
            "t=0: P1 (rem 7) runs.",
            "t=2: P2 arrives (4) &lt; P1 rem 5 → <b>preempt</b>, P2 runs.",
            "t=4: P3 arrives (1) &lt; P2 rem 2 → preempt, P3 runs 4–5 and finishes.",
            "t=5: P4 arrives (4). Remaining: P1 5, P2 2, P4 4 → P2 runs 5–7, finishes.",
            "t=7: P1 5, P4 4 → P4 runs 7–11. Then P1 11–16."
          ] },
          { svg: `<svg viewBox="0 0 700 110" width="700" class="dg">
  <rect class="box-a" x="30" y="25" width="80" height="40"/>
  <text class="tx tx-b" x="70" y="45" text-anchor="middle" dominant-baseline="middle">P1</text>
  <rect class="box-g" x="110" y="25" width="80" height="40"/>
  <text class="tx tx-b" x="150" y="45" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box-w" x="190" y="25" width="40" height="40"/>
  <text class="tx tx-b" x="210" y="45" text-anchor="middle" dominant-baseline="middle">P3</text>
  <rect class="box-g" x="230" y="25" width="80" height="40"/>
  <text class="tx tx-b" x="270" y="45" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box-p" x="310" y="25" width="160" height="40"/>
  <text class="tx tx-b" x="390" y="45" text-anchor="middle" dominant-baseline="middle">P4</text>
  <rect class="box-a" x="470" y="25" width="200" height="40"/>
  <text class="tx tx-b" x="570" y="45" text-anchor="middle" dominant-baseline="middle">P1</text>
  <text class="tx tx-c" x="30" y="84" text-anchor="middle">0</text>
  <text class="tx tx-c" x="110" y="84" text-anchor="middle">2</text>
  <text class="tx tx-c" x="190" y="84" text-anchor="middle">4</text>
  <text class="tx tx-c" x="230" y="84" text-anchor="middle">5</text>
  <text class="tx tx-c" x="310" y="84" text-anchor="middle">7</text>
  <text class="tx tx-c" x="470" y="84" text-anchor="middle">11</text>
  <text class="tx tx-c" x="670" y="84" text-anchor="middle">16</text>
</svg>`, caption: "SRTF Gantt chart (1 time unit = 40 px). P1 is preempted at 2 and resumes only at 11." },
          { table: { head: ["Process", "AT", "BT", "CT", "TAT", "WT", "RT"], rows: [
            ["P1", "0", "7", "16", "16", "9", "0"],
            ["P2", "2", "4", "7", "5", "1", "0"],
            ["P3", "4", "1", "5", "1", "0", "0"],
            ["P4", "5", "4", "11", "6", "2", "2"],
            ["<b>Total</b>", "", "16", "", "<b>28</b>", "<b>12</b>", "2"]
          ] } },
          { p: "<b>ATAT = 28/4 = 7</b>, <b>AWT = 12/4 = 3</b> — better than SJF's 4, because preemption lets short jobs jump ahead. Check 28 − 16 = 12 ✓." },
          { tip: "SJF is provably optimal for average waiting time among non-preemptive algorithms (for a given set that are all present); SRTF is optimal among preemptive ones. Real OSes estimate the next burst with exponential averaging: <code>τ(n+1) = α·t(n) + (1−α)·τ(n)</code>." }
        ]
      },
      {
        h: "Worked table 4 — Priority (non-preemptive and preemptive)",
        blocks: [
          { p: "Lower number = higher priority (always state this; some questions use the opposite)." },
          { table: { head: ["Process", "AT", "BT", "Priority"], rows: [["P1", "0", "10", "3"], ["P2", "1", "1", "1"], ["P3", "2", "2", "4"], ["P4", "3", "1", "5"], ["P5", "4", "5", "2"]] } },
          { h: "4a. Non-preemptive" },
          { p: "P1 is alone at t=0 and runs to completion 0–10. At t=10 all others are waiting: P2(1) → 10–11, P5(2) → 11–16, P3(4) → 16–18, P4(5) → 18–19." },
          { table: { head: ["Gantt", "0–10", "10–11", "11–16", "16–18", "18–19"], rows: [["CPU", "P1", "P2", "P5", "P3", "P4"]] } },
          { table: { head: ["Process", "AT", "BT", "CT", "TAT", "WT"], rows: [
            ["P1", "0", "10", "10", "10", "0"],
            ["P2", "1", "1", "11", "10", "9"],
            ["P3", "2", "2", "18", "16", "14"],
            ["P4", "3", "1", "19", "16", "15"],
            ["P5", "4", "5", "16", "12", "7"],
            ["<b>Total</b>", "", "19", "", "<b>64</b>", "<b>45</b>"]
          ] } },
          { p: "<b>ATAT = 64/5 = 12.8</b>, <b>AWT = 45/5 = 9</b>. Check 64 − 19 = 45 ✓." },
          { h: "4b. Preemptive" },
          { ul: [
            "t=0: P1 runs. t=1: P2 (prio 1) beats P1 (3) → preempt; P2 runs 1–2, done.",
            "t=2: P1 (3) vs P3 (4) → P1 runs. t=3: P4 (5) does not preempt.",
            "t=4: P5 (2) beats P1 → preempt; P5 runs 4–9, done. P1 has 10 − 1 − 2 = 7 left.",
            "t=9: P1 (3) runs 9–16, then P3 16–18, P4 18–19."
          ] },
          { table: { head: ["Gantt", "0–1", "1–2", "2–4", "4–9", "9–16", "16–18", "18–19"], rows: [["CPU", "P1", "P2", "P1", "P5", "P1", "P3", "P4"]] } },
          { table: { head: ["Process", "AT", "BT", "CT", "TAT", "WT"], rows: [
            ["P1", "0", "10", "16", "16", "6"],
            ["P2", "1", "1", "2", "1", "0"],
            ["P3", "2", "2", "18", "16", "14"],
            ["P4", "3", "1", "19", "16", "15"],
            ["P5", "4", "5", "9", "5", "0"],
            ["<b>Total</b>", "", "19", "", "<b>54</b>", "<b>35</b>"]
          ] } },
          { p: "<b>ATAT = 54/5 = 10.8</b>, <b>AWT = 35/5 = 7</b>. Check 54 − 19 = 35 ✓. Notice P3 and P4 wait the longest in both versions: if high-priority work kept arriving they would <b>starve</b>." }
        ]
      },
      {
        h: "Worked table 5 — Round Robin (q = 2)",
        blocks: [
          { table: { head: ["Process", "AT", "BT"], rows: [["P1", "0", "5"], ["P2", "1", "3"], ["P3", "2", "1"], ["P4", "3", "2"], ["P5", "4", "3"]] } },
          { p: "Rule used: when a quantum ends at time t, first add processes that arrived by t, <b>then</b> append the preempted process. Track the queue after every slice:" },
          { table: { head: ["Slice", "Runs", "Remaining after", "Ready queue after the slice"], rows: [
            ["0–2", "P1", "P1: 3", "P2, P3, P1"],
            ["2–4", "P2", "P2: 1", "P3, P1, P4, P5, P2"],
            ["4–5", "P3", "P3: 0 ✔ (CT 5)", "P1, P4, P5, P2"],
            ["5–7", "P1", "P1: 1", "P4, P5, P2, P1"],
            ["7–9", "P4", "P4: 0 ✔ (CT 9)", "P5, P2, P1"],
            ["9–11", "P5", "P5: 1", "P2, P1, P5"],
            ["11–12", "P2", "P2: 0 ✔ (CT 12)", "P1, P5"],
            ["12–13", "P1", "P1: 0 ✔ (CT 13)", "P5"],
            ["13–14", "P5", "P5: 0 ✔ (CT 14)", "—"]
          ] } },
          { table: { head: ["Process", "AT", "BT", "CT", "TAT", "WT", "RT"], rows: [
            ["P1", "0", "5", "13", "13", "8", "0"],
            ["P2", "1", "3", "12", "11", "8", "1"],
            ["P3", "2", "1", "5", "3", "2", "2"],
            ["P4", "3", "2", "9", "6", "4", "4"],
            ["P5", "4", "3", "14", "10", "7", "5"],
            ["<b>Total</b>", "", "14", "", "<b>43</b>", "<b>29</b>", "12"]
          ] } },
          { p: "<b>ATAT = 43/5 = 8.6</b>, <b>AWT = 29/5 = 5.8</b>, average response = 12/5 = 2.4. Check 43 − 14 = 29 ✓." },
          { code: `import java.util.ArrayDeque;
import java.util.Deque;

public class RoundRobin {
    public static void main(String[] args) {
        String[] name = {"P1", "P2", "P3", "P4", "P5"};
        int[] at = {0, 1, 2, 3, 4};          // must be sorted by arrival
        int[] bt = {5, 3, 1, 2, 3};
        int q = 2, n = name.length;
        int[] rem = bt.clone(), ct = new int[n];
        Deque<Integer> ready = new ArrayDeque<>();
        int t = 0, next = 0, done = 0;
        StringBuilder gantt = new StringBuilder();

        while (done < n) {
            while (next < n && at[next] <= t) ready.addLast(next++);
            if (ready.isEmpty()) { t = at[next]; continue; }   // CPU idle
            int i = ready.pollFirst();
            int run = Math.min(q, rem[i]);
            gantt.append(t).append(" ").append(name[i]).append(" ");
            t += run;
            rem[i] -= run;
            while (next < n && at[next] <= t) ready.addLast(next++); // arrivals first
            if (rem[i] > 0) ready.addLast(i);                        // then the preempted one
            else { ct[i] = t; done++; }
        }
        System.out.println("Gantt: " + gantt + t);

        int sumTat = 0, sumWt = 0;
        for (int i = 0; i < n; i++) {
            int tat = ct[i] - at[i], wt = tat - bt[i];
            sumTat += tat; sumWt += wt;
            System.out.printf("%s CT=%d TAT=%d WT=%d%n", name[i], ct[i], tat, wt);
        }
        System.out.printf("ATAT=%.2f AWT=%.2f%n", sumTat / (double) n, sumWt / (double) n);
        // prints ATAT=8.60 AWT=5.80
    }
}`, lang: "java", title: "Round Robin simulator — check your hand computation" },
          { warn: "Two conventions exist for “arrival and preemption at the same instant”. The one above (new arrival first) is the most common in Indian textbooks and GATE. If your answer differs from the key, check this first." }
        ]
      },
      {
        h: "Convoy effect, starvation and aging",
        blocks: [
          { p: "<b>Convoy effect (FCFS):</b> one CPU-bound long job holds the CPU while many short (often I/O-bound) jobs queue behind it; devices sit idle and AWT explodes. Three jobs arrive at t=0 with BT 24, 3, 3:" },
          { table: { head: ["Order", "Waiting times", "AWT", "ATAT"], rows: [
            ["P1(24), P2(3), P3(3) — FCFS", "0, 24, 27", "51/3 = <b>17</b>", "(24+27+30)/3 = 27"],
            ["P2(3), P3(3), P1(24) — FCFS / SJF", "0, 3, 6", "9/3 = <b>3</b>", "(3+6+30)/3 = 13"],
            ["Round Robin q = 4 (P1 first)", "P1 6, P2 4, P3 7", "17/3 ≈ <b>5.67</b>", "(30+7+10)/3 ≈ 15.67"]
          ] } },
          { p: "RR q=4 Gantt: P1 0–4, P2 4–7, P3 7–10, P1 10–30. The short jobs escape the convoy." },
          { p: "<b>Starvation (indefinite blocking):</b> a ready process never gets the CPU because others are always preferred — low-priority jobs under Priority scheduling, long jobs under SJF/SRTF. (FCFS and RR cannot starve anyone.)" },
          { p: "<b>Aging:</b> gradually raise the priority of a process the longer it waits, e.g. improve priority by 1 every 15 minutes of waiting; eventually even the lowest-priority job becomes the highest and runs. Multilevel feedback queues use the same idea by promoting long-waiting processes to higher queues." },
          { h: "Choosing the RR quantum" },
          { ul: [
            "q → ∞: RR degenerates to FCFS.",
            "q very small: most time goes to context switches (processor sharing in theory, overhead in practice).",
            "Rule of thumb: about 80% of CPU bursts should be shorter than q; typical q is 10–100 ms, context switch ≈ microseconds."
          ] },
          { tip: "If asked “which algorithm would you use for an interactive system?” — Round Robin (or MLFQ) for response time. “For batch jobs minimising average waiting?” — SJF/SRTF. Mention Linux uses CFS (fair share by virtual runtime) for bonus points." }
        ]
      }
    ],
    practice: [
      { q: "SRTF: P1 (AT 0, BT 8), P2 (1, 4), P3 (2, 9), P4 (3, 5). Find AWT.", a: "Gantt: P1 0–1 | P2 1–5 | P4 5–10 | P1 10–17 | P3 17–26. (At t=1 P2's 4 &lt; P1's remaining 7; at t=5 remaining are P1 7, P3 9, P4 5 → P4.) CT: P1 17, P2 5, P3 26, P4 10. TAT: 17, 4, 24, 7 = 52. WT: 9, 0, 15, 2 = 26. <b>AWT = 26/4 = 6.5</b>, ATAT = 13." },
      { q: "Round Robin q = 4 on P1 (24), P2 (3), P3 (3), all arriving at 0 in that order. How many context switches (excluding the first dispatch and the final exit)?", a: "Gantt: P1 0–4, P2 4–7, P3 7–10, P1 10–14, 14–18, 18–22, 22–26, 26–30. Switches between different processes happen at t = 4, 7, 10 → <b>3</b>. (If each quantum expiry counts even when P1 is re-dispatched, add the expiries at 14, 18, 22, 26 → 7 quantum interrupts; state your interpretation.) AWT = (6 + 4 + 7)/3 ≈ 5.67." },
      { q: "FCFS: P1 (AT 0, BT 5), P2 (1, 3), P3 (2, 8), P4 (3, 6). Compute ATAT and AWT.", a: "Gantt: P1 0–5, P2 5–8, P3 8–16, P4 16–22. TAT = 5, 7, 14, 19 → 45 → <b>ATAT 11.25</b>. WT = 0, 4, 6, 13 → 23 → <b>AWT 5.75</b>. Check 45 − 22 = 23 ✓." },
      { q: "Why can't SJF be implemented exactly, and what is done instead?", a: "The length of the next CPU burst is not known in advance. OSes predict it by exponential averaging of past bursts: <code>τ<sub>n+1</sub> = α·t<sub>n</sub> + (1−α)·τ<sub>n</sub></code>, 0 ≤ α ≤ 1. E.g. α = 0.5, τ<sub>0</sub> = 10, actual burst 6 → next prediction 8." },
      { q: "Which algorithms can cause starvation, and which can cause the convoy effect?", a: "Starvation: <b>SJF, SRTF, Priority</b> (fix: aging). Convoy effect: <b>FCFS</b> (and any non-preemptive scheme where a long job gets the CPU first). Round Robin has neither." }
    ],
    related: ["os:scheduling-criteria", "os:fcfs-sjf-srtf", "os:round-robin", "os:priority-starvation-aging", "os:mlq-mlfq", "os:linux-cfs", "os:process-schedulers", "os:context-switch", "os:process-states"]
  });

  /* ------------------------------------------------------------------ */
  /* D11 — synchronization                                               */
  /* ------------------------------------------------------------------ */
  add({
    id: "os-synchronization",
    subject: "os",
    title: "Synchronization: race conditions, semaphores, Peterson, monitors",
    minutes: 80,
    crux: [
      "A <b>race condition</b> happens when the result depends on the interleaving of threads that access shared data with at least one write. <code>count++</code> is load–add–store, not atomic.",
      "A correct critical-section solution needs <b>mutual exclusion</b>, <b>progress</b> and <b>bounded waiting</b>.",
      "<b>Mutex</b> = lock with ownership (only the locker unlocks), for mutual exclusion. <b>Semaphore</b> = integer counter with <code>wait/P</code> and <code>signal/V</code>, no ownership, for signalling and counting resources.",
      "<b>Peterson's solution</b> (2 processes): <code>flag[i] = true; turn = j; while (flag[j] &amp;&amp; turn == j);</code> — satisfies all three requirements (on hardware without reordering).",
      "A <b>monitor</b> bundles shared data + procedures + condition variables; only one thread is active inside at a time. Java's <code>synchronized</code> + <code>wait()/notifyAll()</code> is a monitor.",
      "Bounded buffer: <b>empty = N, full = 0, mutex = 1</b>. Producer: <code>wait(empty); wait(mutex); …; signal(mutex); signal(full)</code>. Swapping the two waits can deadlock."
    ],
    sections: [
      {
        h: "Race condition and the critical-section problem",
        blocks: [
          { p: "Two threads each execute <code>count++</code> once with <code>count = 5</code>. At machine level it is three steps. One bad interleaving:" },
          { table: { head: ["Step", "Thread A", "Thread B", "count in memory"], rows: [
            ["1", "reg = count (5)", "", "5"],
            ["2", "", "reg = count (5)", "5"],
            ["3", "reg = reg + 1 (6)", "", "5"],
            ["4", "", "reg = reg + 1 (6)", "5"],
            ["5", "count = reg", "", "6"],
            ["6", "", "count = reg", "<b>6</b> (should be 7)"]
          ] } },
          { p: "One update is lost. The code segment touching shared data is the <b>critical section (CS)</b>. Every process is structured as: <b>entry section → CS → exit section → remainder section</b>." },
          { table: { head: ["Requirement", "Meaning", "Violated by"], rows: [
            ["Mutual exclusion", "At most one process in the CS at a time", "No lock at all"],
            ["Progress", "If the CS is free and some want to enter, only those processes decide who enters, and the decision cannot be postponed forever", "Strict alternation (<code>turn</code> only): P0 cannot re-enter if P1 is not interested"],
            ["Bounded waiting", "After a process requests entry, there is a limit on how many times others can enter before it", "A lock that lets one thread barge in forever"]
          ] } },
          { code: `public class RaceDemo {
    static int unsafeCount = 0;
    static int safeCount = 0;
    static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 100_000; i++) {
                unsafeCount++;                        // read-modify-write, not atomic
                synchronized (lock) { safeCount++; }  // critical section guarded
            }
        };
        Thread a = new Thread(task), b = new Thread(task);
        a.start(); b.start();
        a.join(); b.join();
        System.out.println("unsafe = " + unsafeCount + " (usually less than 200000)");
        System.out.println("safe   = " + safeCount + " (always 200000)");
    }
}`, lang: "java", title: "A real race in Java" }
        ]
      },
      {
        h: "Peterson's solution and hardware support",
        blocks: [
          { code: `// shared between P0 and P1
boolean flag[2] = {false, false};   // flag[i]: Pi wants to enter
int turn;                           // whose turn it is to yield

// code for Pi   (j = 1 - i)
while (true) {
    flag[i] = true;                 // I want in
    turn = j;                       // but you go first if you also want in
    while (flag[j] && turn == j)
        ;                           // busy-wait
    /* critical section */
    flag[i] = false;                // exit section
    /* remainder section */
}`, lang: "text", title: "Peterson's algorithm (pseudocode)" },
          { ul: [
            "<b>Mutual exclusion:</b> if both are in the loop, <code>turn</code> is either 0 or 1 (the last writer loses), so exactly one passes.",
            "<b>Progress:</b> if Pj is not interested, <code>flag[j]</code> is false and Pi enters immediately.",
            "<b>Bounded waiting:</b> when Pj leaves, it sets <code>flag[j] = false</code>; if it comes back it sets <code>turn = i</code>, so Pi waits at most one entry of Pj."
          ] },
          { warn: "Peterson's is a teaching algorithm. Modern CPUs and compilers reorder loads/stores, so it fails unless you add memory barriers (in Java: make <code>flag</code> and <code>turn</code> <code>volatile</code>/atomic). It also <b>busy-waits</b> (spinlock) and handles only 2 processes." },
          { p: "Real systems use atomic hardware instructions: <b>Test-and-Set</b> (atomically read old value and set true) and <b>Compare-and-Swap</b> (set to new only if current == expected). Java's <code>AtomicInteger.incrementAndGet()</code> is a CAS loop." },
          { code: `// spinlock with test-and-set
while (TestAndSet(&lock))   // returns old value, sets lock = true atomically
    ;                       // spin
/* critical section */
lock = false;`, lang: "text", title: "Test-and-set lock" }
        ]
      },
      {
        h: "Mutex vs semaphore",
        blocks: [
          { p: "A <b>semaphore</b> S is an integer accessed only through two atomic operations:" },
          { code: `wait(S)   / P(S) / down / acquire:   S = S - 1;  if (S < 0) block this process on S's queue
signal(S) / V(S) / up   / release:   S = S + 1;  if (S <= 0) wake one process from S's queue
// With this (blocking) definition a negative value -k means k processes are waiting.`, lang: "text", title: "Semaphore operations" },
          { table: { head: ["", "Mutex", "Semaphore"], rows: [
            ["Type", "Lock object (locked/unlocked)", "Integer counter"],
            ["Ownership", "Yes — only the thread that locked may unlock", "No — any thread may signal"],
            ["Values", "0/1", "Binary (0/1) or counting (0..N)"],
            ["Purpose", "Mutual exclusion around a CS", "Counting identical resources; signalling/ordering between threads"],
            ["Java", "<code>ReentrantLock</code>, <code>synchronized</code>", "<code>java.util.concurrent.Semaphore</code>"],
            ["Example", "Guard a shared HashMap", "Pool of 10 DB connections: <code>new Semaphore(10)</code>"]
          ] } },
          { p: "<b>Ordering with a semaphore:</b> to force statement S1 (in P1) before S2 (in P2), use <code>sync = 0</code>; P1: <code>S1; signal(sync);</code> P2: <code>wait(sync); S2;</code>." },
          { tip: "Binary semaphore ≠ mutex: a binary semaphore can be released by a thread that never acquired it, which is what makes it useful for signalling but dangerous as a lock (and it cannot support priority inheritance)." },
          { h: "Monitors" },
          { p: "A <b>monitor</b> is a language construct: shared variables + the procedures that use them + <b>condition variables</b>. The compiler/runtime guarantees only one thread executes inside the monitor at a time. A condition variable <code>c</code> supports <code>c.wait()</code> (release the monitor and sleep) and <code>c.signal()</code> (wake one waiter). Unlike a semaphore, a signal with no waiter is <b>lost</b> — condition variables have no memory." },
          { p: "In Java every object is a monitor: <code>synchronized</code> methods give mutual exclusion, and <code>wait()</code>, <code>notify()</code>, <code>notifyAll()</code> act on the object's single implicit condition variable. <code>ReentrantLock.newCondition()</code> gives multiple named conditions." },
          { warn: "Always call <code>wait()</code> inside a <b>while</b> loop that re-checks the condition, never an <code>if</code>. Another thread may have consumed the item between the notify and your wake-up, and spurious wake-ups are allowed." }
        ]
      },
      {
        h: "Producer–consumer (bounded buffer)",
        blocks: [
          { p: "Buffer of N slots. The producer must block when the buffer is full; the consumer when it is empty; and both must not modify the buffer at the same time. Three semaphores:" },
          { ul: [
            "<code>mutex = 1</code> — mutual exclusion on the buffer.",
            "<code>empty = N</code> — number of free slots.",
            "<code>full = 0</code> — number of filled slots."
          ] },
          { code: `semaphore mutex = 1, empty = N, full = 0;

producer:                          consumer:
while (true) {                     while (true) {
    item = produce();                  wait(full);     // any item?
    wait(empty);    // free slot?      wait(mutex);
    wait(mutex);                       item = buffer[out];
    buffer[in] = item;                 out = (out + 1) % N;
    in = (in + 1) % N;                 signal(mutex);
    signal(mutex);                     signal(empty);  // one more free slot
    signal(full);   // one more item   consume(item);
}                                  }`, lang: "text", title: "Bounded buffer with semaphores" },
          { warn: "If the producer does <code>wait(mutex)</code> <i>before</i> <code>wait(empty)</code> and the buffer is full, it sleeps holding the mutex; the consumer then blocks on <code>wait(mutex)</code> and can never free a slot → <b>deadlock</b>. Always wait on the counting semaphore first. The order of the two <code>signal</code>s does not matter." },
          { code: [
            { lang: "java", src: `import java.util.concurrent.Semaphore;

public class SemaphoreBuffer {
    static final int N = 5;
    static final int[] buffer = new int[N];
    static int in = 0, out = 0;
    static final Semaphore empty = new Semaphore(N);  // free slots
    static final Semaphore full = new Semaphore(0);   // filled slots
    static final Semaphore mutex = new Semaphore(1);  // buffer lock

    static void produce(int item) throws InterruptedException {
        empty.acquire();
        mutex.acquire();
        buffer[in] = item;
        in = (in + 1) % N;
        mutex.release();
        full.release();
    }

    static int consume() throws InterruptedException {
        full.acquire();
        mutex.acquire();
        int item = buffer[out];
        out = (out + 1) % N;
        mutex.release();
        empty.release();
        return item;
    }

    public static void main(String[] args) throws InterruptedException {
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 20; i++) produce(i);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        int[] sum = {0};
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 1; i <= 20; i++) sum[0] += consume();
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        producer.start(); consumer.start();
        producer.join(); consumer.join();
        System.out.println("consumed sum = " + sum[0]);   // 210 = 1 + 2 + ... + 20
    }
}` },
            { lang: "java", src: `import java.util.ArrayDeque;
import java.util.Deque;

class BoundedBuffer {                       // a monitor
    private final Deque<Integer> q = new ArrayDeque<>();
    private final int cap;
    BoundedBuffer(int cap) { this.cap = cap; }

    public synchronized void put(int x) throws InterruptedException {
        while (q.size() == cap) wait();     // buffer full: release lock and sleep
        q.addLast(x);
        notifyAll();                        // wake consumers
    }

    public synchronized int take() throws InterruptedException {
        while (q.isEmpty()) wait();         // buffer empty
        int x = q.removeFirst();
        notifyAll();                        // wake producers
        return x;
    }
}

public class MonitorBuffer {
    public static void main(String[] args) throws InterruptedException {
        BoundedBuffer buf = new BoundedBuffer(5);
        Thread producer = new Thread(() -> {
            try { for (int i = 1; i <= 20; i++) buf.put(i); }
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        int[] sum = {0};
        Thread consumer = new Thread(() -> {
            try { for (int i = 1; i <= 20; i++) sum[0] += buf.take(); }
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        producer.start(); consumer.start();
        producer.join(); consumer.join();
        System.out.println("consumed sum = " + sum[0]);   // 210
    }
}` },
            { lang: "java", src: `import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class QueueBuffer {
    public static void main(String[] args) throws InterruptedException {
        // The production answer: the library already does the locking.
        BlockingQueue<Integer> q = new ArrayBlockingQueue<>(5);
        Thread producer = new Thread(() -> {
            try { for (int i = 1; i <= 20; i++) q.put(i); }      // blocks when full
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        int[] sum = {0};
        Thread consumer = new Thread(() -> {
            try { for (int i = 1; i <= 20; i++) sum[0] += q.take(); } // blocks when empty
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        producer.start(); consumer.start();
        producer.join(); consumer.join();
        System.out.println("consumed sum = " + sum[0]);   // 210
    }
}` }
          ], title: "Producer–consumer in Java: Semaphore / monitor (wait-notify) / BlockingQueue" },
          { tip: "In an interview, write the semaphore version first (it shows you know the theory), then say “in production Java I'd use <code>ArrayBlockingQueue</code>”." },
          { p: "Related classics: <b>Readers–writers</b> (many readers or one writer; the first-readers version can starve writers) and <b>Dining philosophers</b> (five philosophers, five forks; naive solution deadlocks — fix by picking forks in a global order, allowing at most 4 to sit, or picking both forks atomically)." }
        ]
      }
    ],
    practice: [
      { q: "A counting semaphore S is initialised to 10. Then 6 wait (P) and 4 signal (V) operations are performed. Final value?", a: "10 − 6 + 4 = <b>8</b>. (Order does not matter for the final value as long as no process remains blocked; with 10 initial and only 6 P operations, none blocks.)" },
      { q: "Strict alternation: <code>while (turn != i); CS; turn = j;</code>. Which critical-section requirement fails?", a: "<b>Progress.</b> If P0 leaves the CS (turn = 1) and P1 is busy in its remainder section forever, P0 cannot re-enter even though the CS is free. Mutual exclusion holds." },
      { q: "In the bounded-buffer solution the consumer does <code>wait(mutex); wait(full);</code>. What can happen?", a: "When the buffer is empty the consumer holds the mutex and sleeps on <code>full</code>. The producer blocks on <code>wait(mutex)</code> and can never add an item → <b>deadlock</b>." },
      { q: "Mutex or semaphore: (a) a printer pool of 3 printers, (b) protecting a linked list, (c) thread B must start only after thread A finishes initialisation.", a: "(a) <b>Counting semaphore</b> initialised to 3. (b) <b>Mutex</b> (ownership, only the locker unlocks). (c) <b>Semaphore initialised to 0</b> (or a CountDownLatch): A signals after init, B waits." },
      { q: "Why must <code>wait()</code> in a Java monitor be inside a while loop?", a: "Because when the thread wakes up the condition may no longer be true: another thread could have taken the item first (with <code>notifyAll</code> several waiters wake), and the JVM permits spurious wake-ups. The while loop re-checks the condition before proceeding." }
    ],
    related: ["os:race-condition", "os:critical-section", "os:mutex-vs-semaphore", "os:binary-vs-counting-semaphore", "os:producer-consumer", "os:readers-writers", "os:dining-philosophers", "os:petersons-solution", "os:spinlock", "os:monitors", "os:priority-inversion", "os:test-and-set-cas"]
  });

  /* ------------------------------------------------------------------ */
  /* D12 — deadlock                                                      */
  /* ------------------------------------------------------------------ */
  add({
    id: "os-deadlock",
    subject: "os",
    title: "Deadlock: Coffman conditions, RAG and Banker's algorithm (worked twice)",
    minutes: 85,
    crux: [
      "Deadlock needs all four <b>Coffman conditions</b> at once: <b>mutual exclusion, hold and wait, no preemption, circular wait</b>. Break any one and deadlock is impossible.",
      "Strategies: <b>prevention</b> (design so one condition can never hold), <b>avoidance</b> (Banker's: grant only if the state stays safe), <b>detection + recovery</b>, or <b>ignore</b> (ostrich — what Linux/Windows do for apps).",
      "<b>RAG</b>: P → R is a request edge, R → P an assignment edge. With single-instance resources <b>cycle ⇔ deadlock</b>; with multiple instances a cycle is necessary but not sufficient.",
      "Banker's: <b>Need = Max − Allocation</b>. Safety: find a process with Need ≤ Work, pretend it finishes (<b>Work += its Allocation</b>), repeat. All finish → <b>safe</b>.",
      "Request algorithm: Request ≤ Need (else error), Request ≤ Available (else wait), pretend to allocate, run safety — grant only if safe.",
      "Unsafe ≠ deadlocked: unsafe means deadlock is <i>possible</i>. Minimum resources to guarantee no deadlock for n processes each needing k: <b>n(k − 1) + 1</b>."
    ],
    sections: [
      {
        h: "What deadlock is — the four conditions",
        blocks: [
          { p: "A set of processes is deadlocked when each is waiting for an event (usually a resource release) that only another process in the set can cause. Classic: T1 holds lock A and wants B; T2 holds B and wants A." },
          { table: { head: ["Condition", "Meaning", "How prevention breaks it"], rows: [
            ["Mutual exclusion", "A resource can be held by only one process", "Make resources shareable (read-only files, spooling the printer). Often impossible."],
            ["Hold and wait", "A process holds some resources while waiting for others", "Request all resources at once before starting, or release everything before requesting more. Low utilisation, possible starvation."],
            ["No preemption", "A resource is released only voluntarily", "If a request cannot be granted, release (preempt) what you hold and retry. Works for CPU/memory state, not for printers or locks mid-update."],
            ["Circular wait", "P0 waits for P1, P1 for P2, …, Pn for P0", "<b>Impose a global order</b> on resources; always acquire in increasing order. The most practical method."]
          ] } },
          { tip: "In code interviews, the answer to “how do you avoid deadlock with two locks?” is <b>lock ordering</b> (always lock the account with the smaller id first), or <code>tryLock</code> with timeout and back-off." },
          { warn: "Deadlock ≠ starvation. Deadlock: nobody in the cycle can ever proceed. Starvation: a process <i>could</i> proceed but is perpetually passed over. Livelock: processes keep changing state (e.g. both back off and retry in lock-step) but make no progress." }
        ]
      },
      {
        h: "Resource-allocation graph (RAG)",
        blocks: [
          { svg: `<svg viewBox="0 0 540 215" width="540" class="dg">
  <circle class="box-a" cx="120" cy="105" r="28"/>
  <text class="tx tx-b" x="120" y="105" text-anchor="middle" dominant-baseline="middle">P1</text>
  <circle class="box-a" cx="420" cy="105" r="28"/>
  <text class="tx tx-b" x="420" y="105" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box" x="245" y="12" width="50" height="40" rx="3"/>
  <circle class="box-r" cx="270" cy="38" r="4"/>
  <text class="tx tx-b" x="270" y="23" text-anchor="middle" dominant-baseline="middle">R1</text>
  <rect class="box" x="245" y="158" width="50" height="40" rx="3"/>
  <circle class="box-r" cx="270" cy="184" r="4"/>
  <text class="tx tx-b" x="270" y="169" text-anchor="middle" dominant-baseline="middle">R2</text>
  <line class="ln-a" x1="245" y1="36" x2="148" y2="94" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="170" y="52" text-anchor="middle">held by</text>
  <line class="ln ln-d" x1="146" y1="118" x2="243" y2="172" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="170" y="165" text-anchor="middle">requests</text>
  <line class="ln-a" x1="295" y1="174" x2="394" y2="117" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="372" y="165" text-anchor="middle">held by</text>
  <line class="ln ln-d" x1="394" y1="93" x2="297" y2="38" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="372" y="52" text-anchor="middle">requests</text>
</svg>`, caption: "P1 holds R1 and requests R2; P2 holds R2 and requests R1. Each resource has one instance (dot), so the cycle P1 → R2 → P2 → R1 → P1 is a deadlock." },
          { ul: [
            "Circles = processes, rectangles = resource types, dots inside = instances.",
            "<b>Request edge</b> P → R (dashed above): P is waiting for R. <b>Assignment edge</b> R → P: an instance of R is held by P.",
            "No cycle → no deadlock. Cycle + every resource single-instance → deadlock.",
            "Multi-instance counter-example: R1 has 2 instances held by P1 and P3; P2 waits for R1 in a cycle with P1. If P3 (outside the cycle) finishes and releases its instance, P2 gets it and the cycle breaks — so no deadlock despite the cycle.",
            "For single-instance resources, collapse the RAG into a <b>wait-for graph</b> (Pi → Pj if Pi waits for a resource Pj holds); detection = cycle detection (DFS, O(n²))."
          ] }
        ]
      },
      {
        h: "Banker's algorithm — the procedure",
        blocks: [
          { p: "Avoidance: every process declares its <b>Max</b> demand in advance. Before granting a request the OS checks that the system would still be in a <b>safe state</b> — one where there exists an order (safe sequence) in which every process can obtain its remaining need and finish." },
          { table: { head: ["Data structure", "Meaning"], rows: [
            ["Available[m]", "Free instances of each resource type"],
            ["Max[n][m]", "Maximum demand of each process"],
            ["Allocation[n][m]", "Currently held"],
            ["Need[n][m]", "<b>Max − Allocation</b> — what it may still ask for"]
          ] } },
          { ol: [
            "<b>Safety algorithm:</b> Work = Available; Finish[i] = false for all i.",
            "Find an i with Finish[i] = false and <b>Need[i] ≤ Work</b> (component-wise). If none, go to step 4.",
            "Work = Work + Allocation[i]; Finish[i] = true; append Pi to the sequence; go to step 2.",
            "If all Finish[i] are true the state is <b>safe</b>; otherwise <b>unsafe</b>."
          ] },
          { ol: [
            "<b>Resource-request algorithm</b> for Request<sub>i</sub>: if Request<sub>i</sub> &gt; Need[i] → error (exceeded its claim).",
            "If Request<sub>i</sub> &gt; Available → Pi must <b>wait</b>.",
            "Pretend to allocate: Available −= Req; Allocation[i] += Req; Need[i] −= Req.",
            "Run the safety algorithm. Safe → grant. Unsafe → roll back the pretend allocation and make Pi wait."
          ] },
          { tip: "Scan processes in index order and restart the scan after each success (or keep cycling). Different scan orders can give different safe sequences — all are correct; exams usually accept any valid one." }
        ]
      },
      {
        h: "Banker's worked example 1 (3 resource types) + requests",
        blocks: [
          { p: "Resources A, B, C with 10, 5, 7 instances. Available = <b>(3, 3, 2)</b>." },
          { table: { head: ["Process", "Allocation A B C", "Max A B C", "Need = Max − Alloc"], rows: [
            ["P0", "0 1 0", "7 5 3", "7 4 3"],
            ["P1", "2 0 0", "3 2 2", "1 2 2"],
            ["P2", "3 0 2", "9 0 2", "6 0 0"],
            ["P3", "2 1 1", "2 2 2", "0 1 1"],
            ["P4", "0 0 2", "4 3 3", "4 3 1"]
          ] } },
          { p: "Check totals: Allocation sums to (7, 2, 5); plus Available (3, 3, 2) = (10, 5, 7) ✓." },
          { table: { head: ["Step", "Candidate", "Need ≤ Work?", "Work after"], rows: [
            ["1", "P0 (7 4 3)", "vs 3 3 2 → no", "3 3 2"],
            ["2", "P1 (1 2 2)", "vs 3 3 2 → <b>yes</b>", "3 3 2 + 2 0 0 = <b>5 3 2</b>"],
            ["3", "P2 (6 0 0)", "vs 5 3 2 → no", "5 3 2"],
            ["4", "P3 (0 1 1)", "vs 5 3 2 → <b>yes</b>", "5 3 2 + 2 1 1 = <b>7 4 3</b>"],
            ["5", "P4 (4 3 1)", "vs 7 4 3 → <b>yes</b>", "7 4 3 + 0 0 2 = <b>7 4 5</b>"],
            ["6", "P0 (7 4 3)", "vs 7 4 5 → <b>yes</b>", "7 4 5 + 0 1 0 = <b>7 5 5</b>"],
            ["7", "P2 (6 0 0)", "vs 7 5 5 → <b>yes</b>", "7 5 5 + 3 0 2 = <b>10 5 7</b>"]
          ] } },
          { p: "All finish → <b>SAFE</b>, safe sequence <b>&lt;P1, P3, P4, P0, P2&gt;</b>. Final Work equals the total (10, 5, 7) — a good self-check." },
          { h: "Request 1: P1 asks for (1, 0, 2)" },
          { ul: [
            "(1,0,2) ≤ Need[P1] (1,2,2) ✓ and ≤ Available (3,3,2) ✓.",
            "Pretend: Available = (2, 3, 0); Allocation[P1] = (3, 0, 2); Need[P1] = (0, 2, 0).",
            "Safety from Work (2,3,0): P0 no; P1 (0,2,0) yes → (5,3,2); P2 no; P3 (0,1,1) yes → (7,4,3); P4 (4,3,1) yes → (7,4,5); P0 yes → (7,5,5); P2 yes → (10,5,7).",
            "Safe with &lt;P1, P3, P4, P0, P2&gt; → <b>GRANT</b>."
          ] },
          { h: "Request 2 (after granting request 1): P4 asks for (3, 3, 0)" },
          { p: "(3,3,0) ≤ Need[P4] (4,3,1) ✓, but Available is (2,3,0) and 3 &gt; 2 for A → resources not available → <b>P4 waits</b>. (No safety check needed.)" },
          { h: "Request 3 (after granting request 1): P0 asks for (0, 2, 0)" },
          { ul: [
            "(0,2,0) ≤ Need[P0] (7,4,3) ✓ and ≤ Available (2,3,0) ✓.",
            "Pretend: Available = (2, 1, 0); Need[P0] = (7, 2, 3).",
            "Safety from Work (2,1,0): P0 (7,2,3) no; P1 (0,2,0) no (B: 2 &gt; 1); P2 (6,0,0) no; P3 (0,1,1) no (C: 1 &gt; 0); P4 (4,3,1) no.",
            "Nobody can finish → <b>UNSAFE</b> → <b>DENY</b>; roll back, P0 waits — even though the resources are physically available."
          ] }
        ]
      },
      {
        h: "Banker's worked example 2 (4 resource types)",
        blocks: [
          { p: "Resources A, B, C, D. Available = <b>(1, 5, 2, 0)</b>." },
          { table: { head: ["Process", "Allocation A B C D", "Max A B C D", "Need A B C D"], rows: [
            ["P0", "0 0 1 2", "0 0 1 2", "0 0 0 0"],
            ["P1", "1 0 0 0", "1 7 5 0", "0 7 5 0"],
            ["P2", "1 3 5 4", "2 3 5 6", "1 0 0 2"],
            ["P3", "0 6 3 2", "0 6 5 2", "0 0 2 0"],
            ["P4", "0 0 1 4", "0 6 5 6", "0 6 4 2"]
          ] } },
          { p: "Total instances = ΣAllocation (2, 9, 10, 12) + Available (1, 5, 2, 0) = <b>(3, 14, 12, 12)</b>." },
          { table: { head: ["Step", "Candidate", "Need ≤ Work?", "Work after"], rows: [
            ["1", "P0 (0 0 0 0)", "vs 1 5 2 0 → <b>yes</b>", "1 5 3 2"],
            ["2", "P1 (0 7 5 0)", "vs 1 5 3 2 → no (B 7 &gt; 5)", "1 5 3 2"],
            ["3", "P2 (1 0 0 2)", "vs 1 5 3 2 → <b>yes</b>", "2 8 8 6"],
            ["4", "P3 (0 0 2 0)", "vs 2 8 8 6 → <b>yes</b>", "2 14 11 8"],
            ["5", "P4 (0 6 4 2)", "vs 2 14 11 8 → <b>yes</b>", "2 14 12 12"],
            ["6", "P1 (0 7 5 0)", "vs 2 14 12 12 → <b>yes</b>", "3 14 12 12"]
          ] } },
          { p: "<b>SAFE</b>, sequence <b>&lt;P0, P2, P3, P4, P1&gt;</b>; final Work = total (3, 14, 12, 12) ✓." },
          { h: "Can P1's request (0, 4, 2, 0) be granted immediately?" },
          { ul: [
            "(0,4,2,0) ≤ Need[P1] (0,7,5,0) ✓; ≤ Available (1,5,2,0) ✓.",
            "Pretend: Available = (1, 1, 0, 0); Allocation[P1] = (1, 4, 2, 0); Need[P1] = (0, 3, 3, 0).",
            "Safety from (1,1,0,0): P0 (0,0,0,0) yes → (1,1,1,2); P1 (0,3,3,0) no; P2 (1,0,0,2) yes → (2,4,6,6); P3 (0,0,2,0) yes → (2,10,9,8); P4 (0,6,4,2) yes → (2,10,10,12); P1 (0,3,3,0) yes → (3,14,12,12).",
            "Safe, sequence &lt;P0, P2, P3, P4, P1&gt; → <b>GRANT</b>."
          ] },
          { code: `import java.util.ArrayList;
import java.util.List;

public class Bankers {
    static boolean leq(int[] a, int[] b) {
        for (int j = 0; j < a.length; j++) if (a[j] > b[j]) return false;
        return true;
    }

    // returns the safe sequence, or null if the state is unsafe
    static List<Integer> safeSequence(int[][] alloc, int[][] max, int[] avail) {
        int n = alloc.length, m = avail.length;
        int[][] need = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) need[i][j] = max[i][j] - alloc[i][j];
        int[] work = avail.clone();
        boolean[] finish = new boolean[n];
        List<Integer> seq = new ArrayList<>();
        boolean progress = true;
        while (progress) {
            progress = false;
            for (int i = 0; i < n; i++) {
                if (!finish[i] && leq(need[i], work)) {
                    for (int j = 0; j < m; j++) work[j] += alloc[i][j];
                    finish[i] = true;
                    seq.add(i);
                    progress = true;
                }
            }
        }
        return seq.size() == n ? seq : null;
    }

    public static void main(String[] args) {
        int[][] alloc = {{0,1,0},{2,0,0},{3,0,2},{2,1,1},{0,0,2}};
        int[][] max   = {{7,5,3},{3,2,2},{9,0,2},{2,2,2},{4,3,3}};
        int[] avail   = {3,3,2};
        System.out.println("safe sequence: " + safeSequence(alloc, max, avail)); // [1, 3, 4, 0, 2]
    }
}`, lang: "java", title: "Banker's safety algorithm in Java (example 1)" }
        ]
      },
      {
        h: "Detection and recovery",
        blocks: [
          { p: "If the system neither prevents nor avoids deadlock, it can periodically run a <b>detection algorithm</b>. It is the safety algorithm with two changes: use the current <b>Request</b> matrix instead of Need, and initialise Finish[i] = true for processes holding nothing. Processes left with Finish = false are deadlocked." },
          { ul: [
            "<b>Process termination:</b> abort all deadlocked processes (fast, expensive), or abort one at a time and re-run detection (choose the victim by priority, work done, resources held).",
            "<b>Resource preemption:</b> take a resource from a victim, <b>roll back</b> the victim to a safe checkpoint, restart it later. Guard against starvation by counting rollbacks in the victim-selection cost.",
            "Databases do exactly this: detect a cycle in the wait-for graph and abort one transaction."
          ] },
          { table: { head: ["Approach", "When decided", "Cost", "Used in"], rows: [
            ["Prevention", "At design time", "Low utilisation / restrictive", "Lock ordering in application code"],
            ["Avoidance (Banker's)", "At every request", "Needs Max in advance, O(m·n²) per request", "Rare in general OSes; textbook & some embedded systems"],
            ["Detection + recovery", "Periodically / on low CPU use", "Lost work on rollback", "DBMS (InnoDB, PostgreSQL)"],
            ["Ignore (ostrich)", "Never", "Occasional hang, user reboots/kills", "Linux, Windows for user processes"]
          ] } }
        ]
      }
    ],
    practice: [
      { q: "3 processes each need at most 4 instances of resource R. What is the minimum number of instances that guarantees no deadlock?", a: "Worst case: each process holds k − 1 = 3 and waits for one more → 3 × 3 = 9 instances held, nobody can finish. One more instance lets someone finish. Minimum = n(k − 1) + 1 = 3·3 + 1 = <b>10</b>." },
      { q: "Detection: resources A, B. Available = (0, 0). Allocation P0 (1,0), P1 (0,1), P2 (1,1). Request P0 (0,1), P1 (1,0), P2 (0,0). Deadlock? And if P2's request were (1,0)?", a: "Work = (0,0). P2 requests (0,0) → finishes, Work = (1,1). P0 (0,1) ≤ (1,1) → Work (2,1). P1 (1,0) → Work (2,2). <b>No deadlock.</b> If P2 requests (1,0): with Work (0,0) nobody's request fits → <b>P0, P1, P2 deadlocked</b>." },
      { q: "Is every unsafe state a deadlock?", a: "No. Unsafe means the OS cannot <i>guarantee</i> all processes finish if they all claim their maximum. Processes may release resources early or never ask for their full Max, so the system may still avoid deadlock. Safe ⊂ no-deadlock; deadlock ⊂ unsafe." },
      { q: "Example 1 above (original state, Available 3 3 2): can P4's request (3, 3, 0) be granted?", a: "(3,3,0) ≤ Need[P4] (4,3,1) ✓ and ≤ Available (3,3,2) ✓. Pretend: Available (0,0,2), Need[P4] (1,0,1). Safety from (0,0,2): P0 (7,4,3) no; P1 (1,2,2) no; P2 (6,0,0) no; P3 (0,1,1) no (B 1 &gt; 0); P4 (1,0,1) no (A 1 &gt; 0). <b>Unsafe → deny</b>." },
      { q: "Two threads transfer money: <code>transfer(a, b)</code> locks a then b. How can this deadlock and how do you fix it?", a: "T1 runs transfer(X, Y) and locks X; T2 runs transfer(Y, X) and locks Y; each waits for the other's lock — circular wait. Fix: always lock the account with the smaller id first (global order), or use <code>tryLock</code> with timeout and retry." }
    ],
    related: ["os:deadlock-conditions", "os:resource-allocation-graph", "os:deadlock-handling", "os:bankers-algorithm", "os:dining-philosophers", "os:priority-starvation-aging", "dbms:deadlock-dbms"]
  });

  /* ------------------------------------------------------------------ */
  /* D27 — memory management & paging                                    */
  /* ------------------------------------------------------------------ */
  add({
    id: "os-memory-paging",
    subject: "os",
    title: "Memory management, paging, address translation, TLB & EAT",
    minutes: 75,
    crux: [
      "The CPU generates <b>logical</b> addresses; the <b>MMU</b> translates them to <b>physical</b> addresses at run time.",
      "Contiguous allocation (first/best/worst fit) suffers <b>external fragmentation</b>; paging eliminates it but has <b>internal fragmentation</b> (last page, on average half a page).",
      "Paging: logical address = <b>page number p | offset d</b>. With page size 2<sup>d</sup> bytes, <b>d = log₂(page size)</b> bits. Physical address = <b>frame × page size + offset</b>.",
      "Page-table size = <b>number of pages × PTE size</b>. 32-bit, 4 KB pages, 4-byte PTE → 2<sup>20</sup> × 4 B = <b>4 MB</b> per process — hence multi-level page tables.",
      "Without a TLB each access costs 2 memory accesses. <b>EAT = h(t + m) + (1 − h)(t + 2m)</b> for a single-level table (t = TLB time, m = memory time, h = hit ratio).",
      "k-level page table on a TLB miss costs <b>k + 1</b> memory accesses: EAT = h(t + m) + (1 − h)(t + (k+1)m)."
    ],
    sections: [
      {
        h: "Logical vs physical, contiguous allocation and fragmentation",
        blocks: [
          { p: "Each process believes it owns addresses 0…max (logical/virtual addresses). The <b>MMU</b> maps them to real RAM. Simplest scheme: <b>base (relocation) + limit registers</b> — physical = base + logical, trap if logical ≥ limit." },
          { p: "With <b>contiguous allocation</b> each process occupies one block. Choosing a hole for a request:" },
          { table: { head: ["Strategy", "Rule", "Behaviour"], rows: [
            ["First fit", "First hole big enough", "Fast; good in practice"],
            ["Best fit", "Smallest hole big enough", "Leaves tiny useless slivers; must search all"],
            ["Worst fit", "Largest hole", "Leaves big leftovers; usually worst"]
          ] } },
          { p: "<b>Worked example.</b> Holes (in order): 100, 500, 200, 300, 600 KB. Requests: 212, 417, 112, 426 KB." },
          { table: { head: ["Request", "First fit", "Best fit", "Worst fit"], rows: [
            ["212", "500 → leaves 288", "300 → leaves 88", "600 → leaves 388"],
            ["417", "600 → leaves 183", "500 → leaves 83", "500 → leaves 83"],
            ["112", "288 → leaves 176", "200 → leaves 88", "388 → leaves 276"],
            ["426", "<b>must wait</b> (largest hole 300)", "600 → leaves 174", "<b>must wait</b> (largest hole 300)"]
          ] } },
          { table: { head: ["", "Internal fragmentation", "External fragmentation"], rows: [
            ["What", "Wasted space <i>inside</i> an allocated block", "Enough total free memory, but not contiguous"],
            ["Occurs in", "Fixed partitions, paging (last page)", "Variable partitions, segmentation"],
            ["Fix", "Smaller blocks/pages", "Compaction, paging, segmentation with paging"]
          ] } }
        ]
      },
      {
        h: "Paging and address translation",
        blocks: [
          { p: "Split physical memory into fixed-size <b>frames</b> and logical memory into equal-size <b>pages</b> (typically 4 KB). Any page can go in any free frame, so there is no external fragmentation. A per-process <b>page table</b> (base in the PTBR register) maps page → frame." },
          { svg: `<svg viewBox="0 0 700 225" width="700" class="dg">
  <rect class="box" x="10" y="40" width="60" height="40" rx="6"/>
  <text class="tx tx-b" x="40" y="60" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <rect class="box-a" x="100" y="40" width="50" height="40"/>
  <text class="tx tx-b" x="125" y="60" text-anchor="middle" dominant-baseline="middle">p</text>
  <rect class="box" x="150" y="40" width="50" height="40"/>
  <text class="tx tx-b" x="175" y="60" text-anchor="middle" dominant-baseline="middle">d</text>
  <text class="tx-m" x="150" y="28" text-anchor="middle">logical address</text>
  <rect class="box-g" x="270" y="12" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="335" y="34" text-anchor="middle" dominant-baseline="middle">TLB  p → f</text>
  <rect class="box-p" x="270" y="118" width="130" height="50" rx="6"/>
  <text class="tx tx-b" x="335" y="136" text-anchor="middle" dominant-baseline="middle">Page table</text>
  <text class="tx-m" x="335" y="156" text-anchor="middle" dominant-baseline="middle">in RAM (PTBR)</text>
  <rect class="box-a" x="450" y="40" width="50" height="40"/>
  <text class="tx tx-b" x="475" y="60" text-anchor="middle" dominant-baseline="middle">f</text>
  <rect class="box" x="500" y="40" width="50" height="40"/>
  <text class="tx tx-b" x="525" y="60" text-anchor="middle" dominant-baseline="middle">d</text>
  <text class="tx-m" x="500" y="28" text-anchor="middle">physical address</text>
  <rect class="box" x="600" y="20" width="90" height="80" rx="6"/>
  <text class="tx tx-b" x="645" y="60" text-anchor="middle" dominant-baseline="middle">RAM</text>
  <line class="ln" x1="70" y1="60" x2="98" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="125" y1="40" x2="268" y2="32" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="200" y="22" text-anchor="middle">TLB hit</text>
  <line class="ln ln-d" x1="125" y1="80" x2="268" y2="140" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="175" y="125" text-anchor="middle">TLB miss</text>
  <line class="ln-a" x1="400" y1="34" x2="468" y2="40" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="400" y1="140" x2="470" y2="82" marker-end="url(#dg-arr)"/>
  <polyline class="ln" points="175,80 175,205 525,205 525,82" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="350" y="198" text-anchor="middle">offset d copied unchanged</text>
  <line class="ln" x1="550" y1="60" x2="598" y2="60" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Page number p is looked up (TLB first, page table on a miss) to get frame f; the offset d passes through unchanged." },
          { h: "Example A — decimal" },
          { p: "Page size 1 KB = 1024 B. Logical address <b>5000</b>. Page table: page 4 → frame 9." },
          { ul: [
            "p = ⌊5000 / 1024⌋ = <b>4</b> (4 × 1024 = 4096).",
            "d = 5000 − 4096 = <b>904</b>.",
            "Physical = 9 × 1024 + 904 = 9216 + 904 = <b>10120</b>."
          ] },
          { h: "Example B — hex (the fast way)" },
          { p: "Page size 4 KB = 2<sup>12</sup> → the offset is the low <b>12 bits = last 3 hex digits</b>. Logical address <b>0x00003A7C</b>: p = 0x3, d = 0xA7C. If page 3 → frame 7, physical = <b>0x7A7C</b> (just replace the page part with the frame number)." },
          { h: "Example C — sizing the page table" },
          { p: "32-bit logical addresses, 4 KB pages, 1 GB physical memory, 4-byte PTE." },
          { table: { head: ["Quantity", "Computation", "Result"], rows: [
            ["Offset bits", "log₂(4096)", "12"],
            ["Page-number bits", "32 − 12", "20 → 2<sup>20</sup> = 1,048,576 pages"],
            ["Frames", "2<sup>30</sup> / 2<sup>12</sup>", "2<sup>18</sup> frames → 18-bit frame number"],
            ["Physical address bits", "18 + 12", "30"],
            ["Page-table size", "2<sup>20</sup> × 4 B", "<b>4 MB per process</b>"]
          ] } },
          { p: "A 4 MB contiguous table per process is too large, so we page the page table: <b>two-level paging</b> splits the 20 bits into 10 + 10. The outer table has 2<sup>10</sup> entries × 4 B = 4 KB — exactly one page — and inner tables are allocated only for regions actually used. 64-bit systems use 4–5 levels. Alternatives: <b>hashed</b> page tables and <b>inverted</b> page tables (one entry per physical frame, shared by all processes)." },
          { warn: "Internal fragmentation in paging: a 72,766-byte process with 2,048-byte pages needs 36 pages (35 × 2048 = 71,680, remainder 1,086 B), so the last page wastes 2048 − 1086 = <b>962 B</b>." }
        ]
      },
      {
        h: "TLB and Effective Access Time (EAT)",
        blocks: [
          { p: "With the page table in RAM, every load/store needs <b>two</b> memory accesses (one for the PTE, one for the data). The <b>TLB</b> (Translation Look-aside Buffer) is a small, fully-associative hardware cache of recent page → frame mappings (64–1024 entries). Locality gives hit ratios of 98–99%+." },
          { p: "Let t = TLB lookup time, m = memory access time, h = TLB hit ratio (single-level page table):" },
          { code: `EAT = h × (t + m)  +  (1 − h) × (t + m + m)
      hit: TLB + data     miss: TLB + page-table access + data`, lang: "text", title: "EAT with a TLB" },
          { h: "Worked 1" },
          { p: "t = 20 ns, m = 100 ns, h = 80%. Hit = 120 ns, miss = 220 ns. EAT = 0.8 × 120 + 0.2 × 220 = 96 + 44 = <b>140 ns</b> (40% slowdown over 100 ns)." },
          { h: "Worked 2" },
          { p: "Same, h = 98%: EAT = 0.98 × 120 + 0.02 × 220 = 117.6 + 4.4 = <b>122 ns</b> (22% slowdown)." },
          { h: "Worked 3 — find the required hit ratio" },
          { p: "t = 20, m = 100. What h gives EAT = 130 ns? 120h + 220(1 − h) = 130 → 220 − 100h = 130 → <b>h = 0.9</b> (90%)." },
          { h: "Worked 4 — two-level page table" },
          { p: "t = 10 ns, m = 100 ns, h = 90%, 2-level table. Hit = 10 + 100 = 110. Miss = 10 + 2 × 100 (two table levels) + 100 (data) = 310. EAT = 0.9 × 110 + 0.1 × 310 = 99 + 31 = <b>130 ns</b>." },
          { h: "Worked 5 — no TLB" },
          { p: "m = 100 ns, single-level table, no TLB: EAT = 2m = <b>200 ns</b>. A TLB with 98% hits (t = 20) brings it down to 122 ns — the TLB is what makes paging affordable." },
          { warn: "Some textbooks assume the TLB and page table are searched <b>in parallel</b>, so a miss costs m + m (no t). Read the question: if it says “TLB lookup time is negligible” drop t. Otherwise the default is the sequential formula above." },
          { tip: "On a context switch the TLB is flushed (or entries carry an ASID so they can coexist). That is part of why process switches cost more than thread switches." }
        ]
      },
      {
        h: "Paging vs segmentation",
        blocks: [
          { table: { head: ["", "Paging", "Segmentation"], rows: [
            ["Unit", "Fixed-size page", "Variable-size logical unit (code, stack, heap, array)"],
            ["Visible to programmer", "No", "Yes (segment:offset)"],
            ["Fragmentation", "Internal", "External"],
            ["Table", "Page table (page → frame)", "Segment table (base, limit)"],
            ["Protection/sharing", "Per page", "Natural per segment (e.g. read-only code segment)"]
          ] } },
          { p: "x86 historically combined both (segmentation, then paging on the resulting linear address); x86-64 effectively uses flat segments and relies on paging." }
        ]
      }
    ],
    practice: [
      { q: "Logical address space 64 KB (16-bit addresses), page size 512 B. How many bits for page number and offset, and how many PTEs?", a: "Offset = log₂512 = <b>9 bits</b>. Page number = 16 − 9 = <b>7 bits</b> → 2<sup>7</sup> = <b>128 PTEs</b>." },
      { q: "Page size 2 KB. Page table: 0→5, 1→2, 2→8, 3→1. Translate logical address 4500.", a: "p = ⌊4500/2048⌋ = 2 (2 × 2048 = 4096), d = 4500 − 4096 = 404. Page 2 → frame 8. Physical = 8 × 2048 + 404 = 16384 + 404 = <b>16788</b>." },
      { q: "TLB 10 ns, memory 80 ns, hit ratio 95%, single-level paging. EAT?", a: "Hit = 90 ns, miss = 10 + 80 + 80 = 170 ns. EAT = 0.95 × 90 + 0.05 × 170 = 85.5 + 8.5 = <b>94 ns</b>." },
      { q: "48-bit virtual addresses, 4 KB pages, 8-byte PTEs. How big would a single-level page table be? Why is that impossible?", a: "Page-number bits = 48 − 12 = 36 → 2<sup>36</sup> entries × 8 B = 2<sup>39</sup> B = <b>512 GB</b> per process. Hence x86-64 uses 4-level tables (9+9+9+9+12), each table 512 × 8 B = 4 KB, allocated only where needed." },
      { q: "Why does paging have no external fragmentation?", a: "Every frame is the same size as a page and any page can be placed in any free frame, so any free frame is usable; free memory never becomes “too scattered” to use. Only the last page of a process may be partly empty (internal fragmentation)." }
    ],
    related: ["os:paging", "os:tlb", "os:page-table-types", "os:segmentation", "os:fragmentation", "os:memory-allocation-fit", "os:process-memory-layout", "os:cache-locality", "coa:virtual-memory-tlb", "coa:memory-hierarchy"]
  });

  /* ------------------------------------------------------------------ */
  /* D27 — virtual memory, page faults, replacement, thrashing           */
  /* ------------------------------------------------------------------ */
  add({
    id: "os-virtual-memory",
    subject: "os",
    title: "Virtual memory: demand paging, page faults, FIFO/LRU/Optimal, thrashing",
    minutes: 80,
    crux: [
      "<b>Virtual memory</b> lets a process run with only part of it in RAM; the rest lives on disk (swap). <b>Demand paging</b> loads a page only when it is first touched.",
      "Touching a page whose PTE is <b>invalid</b> (not in RAM) raises a <b>page fault</b>: trap → find free frame (or evict) → read page from disk → update page table → restart the instruction.",
      "EAT with faults: <b>EAT = (1 − p) × m + p × (page-fault service time)</b>. With m = 200 ns and 8 ms service, even p = 1/1000 makes memory 40× slower.",
      "Replacement: <b>FIFO</b> (oldest), <b>LRU</b> (least recently used), <b>Optimal</b> (used farthest in future — best possible, not implementable). On 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1 with 3 frames: <b>FIFO 15, LRU 12, OPT 9</b> faults.",
      "<b>Belady's anomaly</b>: with FIFO, more frames can mean more faults (1 2 3 4 1 2 5 1 2 3 4 5: 3 frames → 9, 4 frames → 10). LRU and Optimal are stack algorithms and never show it.",
      "<b>Thrashing</b>: processes spend more time paging than executing because they have fewer frames than their working set. Fix: working-set model / page-fault-frequency control, reduce the degree of multiprogramming."
    ],
    sections: [
      {
        h: "Virtual memory and demand paging",
        blocks: [
          { p: "Programs rarely use all their code and data at once (error handlers, unused features, big arrays). Virtual memory separates the logical address space from physical memory, so a process can be larger than RAM and more processes fit in memory at once (higher degree of multiprogramming)." },
          { ul: [
            "<b>Demand paging</b>: a lazy swapper — pages are brought in only when referenced. <b>Pure</b> demand paging starts a process with zero pages in memory.",
            "Each PTE has a <b>valid–invalid bit</b>: valid = page is in RAM (and legal); invalid = not in RAM or not part of the address space.",
            "Other PTE bits: <b>dirty/modify</b> (page written since load → must be written back on eviction), <b>reference</b> (used recently — for clock/second-chance), protection bits.",
            "<b>Copy-on-write</b> (used by fork) and <b>memory-mapped files</b> are built on the same page-fault machinery."
          ] },
          { h: "Page-fault handling — step by step" },
          { ol: [
            "The CPU references a page; the MMU finds the PTE's valid bit = 0 and <b>traps</b> to the OS (page-fault exception).",
            "The OS checks the address: if it is illegal (outside the process's space or protection violation) → terminate the process (segmentation fault).",
            "Legal but not in memory: find a <b>free frame</b>. If none, run the <b>page-replacement algorithm</b> to choose a victim; if the victim is dirty, write it to disk first.",
            "Schedule a <b>disk read</b> of the needed page into the frame. The faulting process is blocked (Waiting); the CPU runs someone else meanwhile.",
            "When the I/O completes, <b>update the page table</b> (frame number, valid = 1) and internal tables.",
            "Move the process back to Ready. When it runs, the faulting instruction is <b>restarted</b> from the beginning, now finding the page in memory."
          ] },
          { warn: "A page fault is not an error. A <b>segmentation fault</b> is an <i>illegal</i> access; a page fault on a legal address is normal and is serviced transparently. Also: a TLB miss is not a page fault — the page may be in RAM and simply not in the TLB." }
        ]
      },
      {
        h: "EAT with page faults (worked)",
        blocks: [
          { code: `EAT = (1 − p) × m  +  p × S
p = page-fault rate, m = memory access time, S = page-fault service time`, lang: "text", title: "Formula" },
          { h: "Worked 1" },
          { p: "m = 200 ns, S = 8 ms = 8,000,000 ns, p = 1/1000. EAT = 0.999 × 200 + 0.001 × 8,000,000 = 199.8 + 8,000 = <b>8,199.8 ns ≈ 8.2 µs</b> — about <b>41×</b> slower than 200 ns." },
          { h: "Worked 2 — maximum fault rate for &lt;10% slowdown" },
          { p: "We need EAT &lt; 220 ns: 200 + p(8,000,000 − 200) &lt; 220 → 7,999,800 p &lt; 20 → <b>p &lt; 2.5 × 10<sup>−6</sup></b>, i.e. fewer than 1 fault per ~400,000 accesses." },
          { h: "Worked 3 — dirty pages" },
          { p: "m = 100 ns. Servicing a fault takes 8 ms if a free/clean frame is used and 20 ms if the victim is dirty; 70% of the time the victim is dirty. Average S = 0.3 × 8 + 0.7 × 20 = 2.4 + 14 = 16.4 ms. For EAT ≤ 200 ns: 100 + p(16,400,000 − 100) ≤ 200 → p ≤ 100 / 16,399,900 ≈ <b>6.1 × 10<sup>−6</sup></b>." },
          { tip: "When a question mixes TLB and page faults, compute the no-fault access time first (the TLB EAT from the previous lesson), then plug that in as m." }
        ]
      },
      {
        h: "Page replacement: FIFO, LRU, Optimal (one reference string)",
        blocks: [
          { p: "Reference string: <b>7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1</b>, 3 frames, initially empty. Frames are shown slot by slot; <b>bold + F</b> = page fault, ✓ = hit." },
          { ul: [
            "<b>FIFO</b>: evict the page that has been in memory the longest (queue).",
            "<b>LRU</b>: evict the page whose last use is furthest in the past (look backwards).",
            "<b>Optimal (OPT/MIN)</b>: evict the page whose next use is furthest in the future, or never used again (look forwards)."
          ] },
          { table: { head: ["Ref", "FIFO", "LRU", "Optimal"], rows: [
            ["7", "<b>7</b> F", "<b>7</b> F", "<b>7</b> F"],
            ["0", "<b>7 0</b> F", "<b>7 0</b> F", "<b>7 0</b> F"],
            ["1", "<b>7 0 1</b> F", "<b>7 0 1</b> F", "<b>7 0 1</b> F"],
            ["2", "<b>2 0 1</b> F", "<b>2 0 1</b> F", "<b>2 0 1</b> F"],
            ["0", "2 0 1 ✓", "2 0 1 ✓", "2 0 1 ✓"],
            ["3", "<b>2 3 1</b> F", "<b>2 0 3</b> F", "<b>2 0 3</b> F"],
            ["0", "<b>2 3 0</b> F", "2 0 3 ✓", "2 0 3 ✓"],
            ["4", "<b>4 3 0</b> F", "<b>4 0 3</b> F", "<b>2 4 3</b> F"],
            ["2", "<b>4 2 0</b> F", "<b>4 0 2</b> F", "2 4 3 ✓"],
            ["3", "<b>4 2 3</b> F", "<b>4 3 2</b> F", "2 4 3 ✓"],
            ["0", "<b>0 2 3</b> F", "<b>0 3 2</b> F", "<b>2 0 3</b> F"],
            ["3", "0 2 3 ✓", "0 3 2 ✓", "2 0 3 ✓"],
            ["2", "0 2 3 ✓", "0 3 2 ✓", "2 0 3 ✓"],
            ["1", "<b>0 1 3</b> F", "<b>1 3 2</b> F", "<b>2 0 1</b> F"],
            ["2", "<b>0 1 2</b> F", "1 3 2 ✓", "2 0 1 ✓"],
            ["0", "0 1 2 ✓", "<b>1 0 2</b> F", "2 0 1 ✓"],
            ["1", "0 1 2 ✓", "1 0 2 ✓", "2 0 1 ✓"],
            ["7", "<b>7 1 2</b> F", "<b>1 0 7</b> F", "<b>7 0 1</b> F"],
            ["0", "<b>7 0 2</b> F", "1 0 7 ✓", "7 0 1 ✓"],
            ["1", "<b>7 0 1</b> F", "1 0 7 ✓", "7 0 1 ✓"],
            ["<b>Faults</b>", "<b>15</b> (hit ratio 5/20 = 25%)", "<b>12</b> (8 hits, 40%)", "<b>9</b> (11 hits, 55%)"]
          ] } },
          { p: "How the key decisions were made:" },
          { ul: [
            "Ref 3 (6th): LRU looks back — last uses: 2 at position 4, 0 at 5, 1 at 3 → evict <b>1</b>. OPT looks forward — next uses: 0 at 7, 2 at 9, 1 at 14 → evict <b>1</b>. FIFO evicts the oldest loaded, <b>0</b> (7 was already replaced by 2).",
            "Ref 4 (8th): OPT — next uses: 2 at 9, 3 at 10, 0 at 11 → evict <b>0</b>.",
            "Ref 0 (11th): OPT — 4 is never used again → evict <b>4</b>.",
            "Ref 1 (14th): OPT — 3 is never used again → evict <b>3</b>. Ref 7 (18th): 2 never used again → evict <b>2</b>."
          ] },
          { tip: "Always count the first k faults (filling empty frames) — these are <b>compulsory</b> misses and every algorithm has them. Quick check: fault count ≥ number of distinct pages (here 6: 0,1,2,3,4,7)." },
          { p: "<b>Practical approximations of LRU</b>: exact LRU needs a timestamp or stack update on every memory access — too expensive. Real OSes use the hardware <b>reference bit</b>: <b>Second-chance / Clock</b> (FIFO, but a page with ref-bit 1 gets its bit cleared and is skipped once) and the enhanced clock (prefers pages that are not referenced and not dirty). LFU/MFU exist but are rarely used." },
          { code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

public class PageReplacement {
    static int fifo(int[] ref, int frames) {
        Deque<Integer> queue = new ArrayDeque<>();
        Set<Integer> inMemory = new HashSet<>();
        int faults = 0;
        for (int p : ref) {
            if (inMemory.contains(p)) continue;
            faults++;
            if (queue.size() == frames) inMemory.remove(queue.pollFirst());
            queue.addLast(p);
            inMemory.add(p);
        }
        return faults;
    }

    static int lru(int[] ref, int frames) {
        // accessOrder = true: iteration order is least-recently-used first
        LinkedHashMap<Integer, Boolean> mem = new LinkedHashMap<>(16, 0.75f, true);
        int faults = 0;
        for (int p : ref) {
            if (mem.containsKey(p)) { mem.get(p); continue; }   // get() marks as recently used
            faults++;
            if (mem.size() == frames) mem.remove(mem.keySet().iterator().next());
            mem.put(p, true);
        }
        return faults;
    }

    static int optimal(int[] ref, int frames) {
        List<Integer> mem = new ArrayList<>();
        int faults = 0;
        for (int t = 0; t < ref.length; t++) {
            int p = ref[t];
            if (mem.contains(p)) continue;
            faults++;
            if (mem.size() < frames) { mem.add(p); continue; }
            int victim = 0, farthest = -1;
            for (int k = 0; k < mem.size(); k++) {
                int next = Integer.MAX_VALUE;                  // never used again
                for (int u = t + 1; u < ref.length; u++)
                    if (ref[u] == mem.get(k)) { next = u; break; }
                if (next > farthest) { farthest = next; victim = k; }
            }
            mem.set(victim, p);
        }
        return faults;
    }

    public static void main(String[] args) {
        int[] ref = {7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1};
        System.out.println("FIFO=" + fifo(ref, 3) + " LRU=" + lru(ref, 3) + " OPT=" + optimal(ref, 3)); // 15 12 9
        int[] belady = {1,2,3,4,1,2,5,1,2,3,4,5};
        System.out.println("FIFO 3 frames=" + fifo(belady, 3) + ", 4 frames=" + fifo(belady, 4));   // 9, 10
    }
}`, lang: "java", title: "Simulate FIFO / LRU / Optimal" }
        ]
      },
      {
        h: "Belady's anomaly",
        blocks: [
          { p: "Normally more frames → fewer faults. With FIFO that is not guaranteed. Reference string <b>1 2 3 4 1 2 5 1 2 3 4 5</b>:" },
          { table: { head: ["Ref", "FIFO, 3 frames", "FIFO, 4 frames"], rows: [
            ["1", "<b>1</b> F", "<b>1</b> F"],
            ["2", "<b>1 2</b> F", "<b>1 2</b> F"],
            ["3", "<b>1 2 3</b> F", "<b>1 2 3</b> F"],
            ["4", "<b>4 2 3</b> F", "<b>1 2 3 4</b> F"],
            ["1", "<b>4 1 3</b> F", "1 2 3 4 ✓"],
            ["2", "<b>4 1 2</b> F", "1 2 3 4 ✓"],
            ["5", "<b>5 1 2</b> F", "<b>5 2 3 4</b> F"],
            ["1", "5 1 2 ✓", "<b>5 1 3 4</b> F"],
            ["2", "5 1 2 ✓", "<b>5 1 2 4</b> F"],
            ["3", "<b>5 3 2</b> F", "<b>5 1 2 3</b> F"],
            ["4", "<b>5 3 4</b> F", "<b>4 1 2 3</b> F"],
            ["5", "5 3 4 ✓", "<b>4 5 2 3</b> F"],
            ["<b>Faults</b>", "<b>9</b>", "<b>10</b>"]
          ] } },
          { p: "Why: FIFO's set of pages in memory with 3 frames is <b>not</b> always a subset of its set with 4 frames. LRU and Optimal are <b>stack algorithms</b> — the n-frame contents are always a subset of the (n+1)-frame contents — so they can never suffer the anomaly. (On this string LRU gives 10 faults with 3 frames and 8 with 4.)" }
        ]
      },
      {
        h: "Thrashing, working set and frame allocation",
        blocks: [
          { svg: `<svg viewBox="0 0 440 230" width="440" class="dg">
  <line class="ln" x1="50" y1="190" x2="420" y2="190" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="50" y1="190" x2="50" y2="20" marker-end="url(#dg-arr)"/>
  <polyline class="ln-a" points="50,185 90,130 130,90 170,66 210,54 245,52 270,60 295,90 320,140 350,172 400,182"/>
  <line class="ln ln-d" x1="250" y1="52" x2="250" y2="190"/>
  <text class="tx-a" x="210" y="40" text-anchor="middle">peak</text>
  <text class="tx tx-b" x="330" y="112" text-anchor="middle">thrashing</text>
  <text class="tx-m" x="235" y="214" text-anchor="middle">degree of multiprogramming →</text>
  <text class="tx-m" x="18" y="105" text-anchor="middle" transform="rotate(-90 18 105)">CPU utilisation</text>
</svg>`, caption: "Adding processes raises CPU utilisation until their working sets no longer fit; then page faults dominate and utilisation collapses." },
          { p: "<b>The vicious cycle:</b> too many processes → each has too few frames → constant page faults → processes wait on the paging disk → CPU utilisation drops → the long-term scheduler sees an idle CPU and admits <i>more</i> processes → even fewer frames each → worse." },
          { ul: [
            "<b>Locality model:</b> a process moves between localities (sets of pages used together, e.g. a function and its data). If it has frames for its current locality it faults rarely.",
            "<b>Working-set model:</b> WS(Δ) = pages referenced in the last Δ references. Total demand D = Σ WSS<sub>i</sub>. If D &gt; available frames, <b>suspend a process</b> (swap it out) instead of admitting more.",
            "<b>Page-fault frequency (PFF):</b> set upper and lower bounds on a process's fault rate; above the upper bound give it more frames, below the lower bound take frames away; if no free frames, suspend a process.",
            "<b>Local vs global replacement:</b> local replacement (a process evicts only its own pages) stops one thrashing process from stealing others' frames, but does not cure thrashing by itself.",
            "Other fixes: add RAM, reduce the degree of multiprogramming, improve program locality (e.g. traverse 2-D arrays row-wise in row-major languages)."
          ] },
          { p: "<b>Working-set example</b>, Δ = 5, references … 2 6 1 5 7 7 7 7 5 1: at the 5th reference (7) the window is {2, 6, 1, 5, 7} → WSS = 5; at the last reference (1) the window is the last five references 7 7 7 5 1 = {7, 5, 1} → WSS = 3. The working set shrinks as the process settles into a locality." },
          { warn: "Thrashing is <b>not</b> fixed by adding a faster CPU or more processes. The fix is fewer processes (or more memory) so each gets its working set." }
        ]
      }
    ],
    practice: [
      { q: "Reference string 1 2 3 4 2 1 5 6 2 1 2 3 7 6 3 2 1 2 3 6 with 3 frames. Page faults for FIFO, LRU and Optimal?", a: "<b>FIFO 16, LRU 15, Optimal 11.</b> (With 4 frames: FIFO 14, LRU 10, Optimal 8.) Build the frame table exactly as in the lesson and count bold entries; verify with the Java simulator." },
      { q: "m = 100 ns, page-fault service time 10 ms, fault rate p = 0.0001. EAT?", a: "EAT = 0.9999 × 100 + 0.0001 × 10,000,000 = 99.99 + 1,000 = <b>1,099.99 ns ≈ 1.1 µs</b> — 11× slower than RAM." },
      { q: "Which page-replacement algorithms suffer from Belady's anomaly and why?", a: "<b>FIFO</b> (and FIFO-based variants like Second-chance/Clock and random replacement can too). <b>LRU and Optimal cannot</b>: they are stack algorithms, so the set of pages kept with n frames is always a subset of the set kept with n + 1 frames." },
      { q: "List the steps the OS performs on a page fault.", a: "1) Trap to the kernel. 2) Check validity of the reference (illegal → kill). 3) Find a free frame or choose a victim (write back if dirty). 4) Issue disk read; block the process; schedule another. 5) On I/O completion update the page table (valid bit, frame). 6) Put the process in Ready; restart the faulting instruction." },
      { q: "CPU utilisation is 12%, paging disk utilisation is 97%. Should the OS increase the degree of multiprogramming?", a: "<b>No — the system is thrashing.</b> Low CPU with a saturated paging disk means processes are waiting on page faults. The OS should <b>decrease</b> multiprogramming (suspend processes) or add memory." },
      { q: "Why is Optimal replacement not used in real systems, and what is it used for?", a: "It needs to know the <b>future</b> reference string, which the OS does not have. It is used as a <b>benchmark</b>: no algorithm can have fewer faults, so it tells you how close LRU/Clock are to the best possible." }
    ],
    related: ["os:virtual-memory", "os:demand-paging-page-fault", "os:page-replacement", "os:thrashing", "os:copy-on-write", "os:swapping", "os:memory-mapped-files", "os:cache-locality", "os:tlb", "coa:locality-of-reference"]
  });

  map("d8-ev", ["os-processes"]);
  map("d9-ev", ["os-cpu-scheduling"]);
  map("d11-ev", ["os-synchronization"]);
  map("d12-ev", ["os-deadlock"]);
  map("d27-ev", ["os-memory-paging", "os-virtual-memory"]);

  var ALL_OS = ["os-processes", "os-cpu-scheduling", "os-synchronization", "os-deadlock", "os-memory-paging", "os-virtual-memory"];
  map("d28-af", ALL_OS);
  map("d54-mo", ALL_OS);
  map("d53-af", ALL_OS);
})();
