/* tech stack: C programming — interview Q&A (pointers, memory, structs, preprocessor, UB) */
(window.TECH = window.TECH || []).push({
  id: "c",
  title: "C programming",
  short: "C",
  icon: "▣",
  blurb: "C on your resume means pointer questions: arithmetic, double pointers, void* and function pointers, arrays vs pointers, and what sizeof really returns. Expect to trace malloc/free bugs, compute struct padding by hand, explain static/extern/const/volatile, spot macro pitfalls and undefined behaviour, and walk through how gcc turns a .c file into an executable.",
  topics: ["Pointers", "Arrays & Strings", "Memory Management", "Structs & Storage", "Preprocessor & Build", "UB & Bit Tricks"],
  questions: [

    /* ───────────── Pointers ───────────── */
    {
      id: "pointer-basics-arithmetic",
      q: "What is a pointer, and how does pointer arithmetic work in C?",
      topic: "Pointers",
      level: 1,
      top: true,
      short: "A pointer is a variable that stores the address of another object; & takes an address and * dereferences it. Pointer arithmetic is scaled by the pointed-to type: p + 1 moves forward sizeof(*p) bytes, so for an int pointer it skips one whole int. You may add or subtract integers, subtract two pointers into the same array to get an element count, and compare them, but not add, multiply or divide pointers.",
      a: [
        { p: "A <b>pointer</b> holds a memory address plus a type that tells the compiler how to interpret the bytes there. <code>&amp;x</code> gives the address of <code>x</code>; <code>*p</code> accesses the object <code>p</code> points to. Array indexing is defined in terms of pointers: <code>a[i]</code> is exactly <code>*(a + i)</code>." },
        { code: `#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;                 /* p holds the address of x */
    *p = 20;                     /* write through the pointer */
    printf("x = %d\\n", x);       /* x = 20 */

    int a[5] = {10, 20, 30, 40, 50};
    int *q = a;                  /* array decays to &a[0] */
    printf("%d %d\\n", *(q + 2), q[2]);       /* 30 30 : q[i] is *(q + i) */
    q++;                                      /* moves sizeof(int) bytes, not 1 */
    printf("%d\\n", *q);                       /* 20 */
    printf("bytes per step: %d\\n", (int)((char *)(q + 1) - (char *)q));   /* 4 */

    int *end = a + 5;                         /* one past the end: may be formed, never dereferenced */
    printf("elements: %d\\n", (int)(end - a)); /* 5 : pointer difference counts elements */

    int b[] = {1, 5};
    int *r = b;
    int v = *r++;                /* *(r++): v = 1, then r points to b[1] */
    (*r)++;                      /* increments the value: b[1] becomes 6 */
    printf("%d %d\\n", v, b[1]);  /* 1 6 */
    return 0;
}`, lang: "c", title: "Address-of, dereference, and scaled arithmetic" },
        { table: { head: ["Expression", "Allowed?", "Meaning"], rows: [
          ["<code>p + n</code>, <code>p - n</code>, <code>p++</code>", "Yes", "Move n elements (n × sizeof(*p) bytes)"],
          ["<code>p2 - p1</code>", "Yes, same array only", "Number of elements between them (type <code>ptrdiff_t</code>)"],
          ["<code>p1 &lt; p2</code>, <code>p == q</code>", "Yes (relational: same array)", "Position comparison; <code>==</code> works for any pointers / NULL"],
          ["<code>p1 + p2</code>, <code>p * 2</code>, <code>p / 2</code>", "No — compile error", "Meaningless for addresses"],
          ["<code>a + 5</code> (one past end)", "Yes to form/compare", "Dereferencing it is undefined behaviour"]
        ] } },
        { warn: "Precedence trap: <code>*p++</code> means <code>*(p++)</code> — it reads the current element and advances the pointer. To increment the pointed-to value write <code>(*p)++</code>. Interviewers love asking for the output of a loop using <code>*p++</code>." },
        { tip: "Mention that the size of a pointer depends on the platform, not on the type it points to: 8 bytes on a 64-bit build, 4 on 32-bit — <code>sizeof(char *) == sizeof(double *)</code> on every mainstream system." }
      ]
    },
    {
      id: "call-by-value-vs-pointer",
      q: "C is call by value — how do you modify a caller's variable, and when do you need a pointer to a pointer?",
      topic: "Pointers",
      level: 1,
      top: true,
      short: "C always passes a copy of each argument, so a function that changes its parameter changes only the copy. To modify the caller's variable you pass its address and write through it — call by pointer, like swap(&x, &y). The same rule applies one level up: to make a function change the caller's pointer itself, for example to allocate memory into it, you pass the pointer's address, an int **.",
      a: [
        { p: "There is no pass-by-reference in C (C++ added <code>&amp;</code> references). 'Call by reference' in C really means <b>passing a pointer by value</b>: the address is copied, but both copies point to the same object. Java works the same way for object references — see <a href=\"#/core/oops/java-pass-by-value\">Java is pass-by-value</a>." },
        { code: `#include <stdio.h>
#include <stdlib.h>

void swap_wrong(int a, int b) { int t = a; a = b; b = t; }        /* swaps the copies */
void swap(int *a, int *b)     { int t = *a; *a = *b; *b = t; }    /* swaps the originals */

void alloc_wrong(int *p) { p = malloc(sizeof *p); free(p); }       /* only the local copy changes */
void alloc(int **pp)     { *pp = malloc(sizeof **pp); }            /* changes the caller's pointer */

int main(void) {
    int x = 1, y = 2;
    swap_wrong(x, y);  printf("%d %d\\n", x, y);    /* 1 2 */
    swap(&x, &y);      printf("%d %d\\n", x, y);    /* 2 1 */

    int *p = NULL;
    alloc_wrong(p);    printf("%s\\n", p ? "allocated" : "still NULL");   /* still NULL */
    alloc(&p);         printf("%s\\n", p ? "allocated" : "still NULL");   /* allocated */
    if (p) { *p = 42; printf("%d\\n", *p); }                                /* 42 */
    free(p);
    return 0;
}`, lang: "c", title: "swap and allocate-into-pointer" },
        { p: "<b>Where double pointers show up:</b> output parameters for pointers (<code>int **out</code>), <code>char **argv</code> (an array of strings), dynamically allocated 2-D arrays (an array of row pointers), and linked-list functions that may change the head (<code>void push(struct Node **head, int v)</code>)." },
        { code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int rows = 2, cols = 3;
    int **m = malloc(rows * sizeof *m);              /* array of row pointers */
    if (!m) return 1;
    for (int i = 0; i < rows; i++) {
        m[i] = malloc(cols * sizeof **m);            /* each row separately */
        if (!m[i]) return 1;
        for (int j = 0; j < cols; j++) m[i][j] = i * cols + j;
    }
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) printf("%d ", m[i][j]);
        printf("\\n");                                /* 0 1 2 / 3 4 5 */
    }
    for (int i = 0; i < rows; i++) free(m[i]);       /* free rows first, then the spine */
    free(m);
    return 0;
}`, lang: "c", title: "int ** as a dynamic 2-D array" },
        { table: { head: ["You want the function to change…", "Pass", "Parameter type"], rows: [
          ["an <code>int</code>", "<code>&amp;x</code>", "<code>int *</code>"],
          ["an <code>int *</code> (e.g. allocate into it)", "<code>&amp;p</code>", "<code>int **</code>"],
          ["the contents of an array", "the array (decays to a pointer)", "<code>int *</code> / <code>int a[]</code>"],
          ["a struct (cheaply)", "<code>&amp;s</code>", "<code>struct S *</code> (or <code>const struct S *</code> to read only)"]
        ] } },
        { tip: "A common follow-up is 'write a linked-list insert at head'. Either return the new head (<code>head = push(head, 5)</code>) or take <code>struct Node **head</code> — explaining why the single-pointer version silently loses the new node is what they're checking." }
      ]
    },
    {
      id: "void-pointer",
      q: "What is a void pointer? Why can't you dereference it, and where is it used?",
      topic: "Pointers",
      level: 2,
      top: false,
      short: "void * is a generic pointer that can hold the address of any object type without a cast in C. Because void has no size, you cannot dereference it or do arithmetic on it in standard C; you first convert it to a concrete pointer type. It powers generic code: malloc returns void *, memcpy and memset take void *, and qsort passes void * elements to your comparator.",
      a: [
        { p: "A <code>void *</code> says 'an address, type unknown'. Any object pointer converts to <code>void *</code> and back implicitly in C (C++ requires a cast back). The compiler doesn't know how many bytes lie behind it, so <code>*vp</code> and <code>vp + 1</code> are errors in standard C (GCC allows <code>vp + 1</code> as an extension, treating the size as 1)." },
        { code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void print_bytes(const void *data, size_t n) {       /* accepts ANY object */
    const unsigned char *b = data;                     /* convert before use */
    for (size_t i = 0; i < n; i++) printf("%02x ", b[i]);
    printf("\\n");
}

int cmp_int(const void *a, const void *b) {          /* qsort comparator */
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);                          /* no overflow, unlike x - y */
}

void swap_any(void *a, void *b, size_t size) {       /* generic swap */
    unsigned char tmp[64];
    if (size > sizeof tmp) return;
    memcpy(tmp, a, size); memcpy(a, b, size); memcpy(b, tmp, size);
}

int main(void) {
    int n = 258;                                       /* 0x00000102 */
    print_bytes(&n, sizeof n);                         /* 02 01 00 00 on little-endian x86/ARM */

    int a[] = {5, 2, 9, 1};
    qsort(a, 4, sizeof a[0], cmp_int);
    for (int i = 0; i < 4; i++) printf("%d ", a[i]);  /* 1 2 5 9 */
    printf("\\n");

    double d1 = 1.5, d2 = 2.5;
    swap_any(&d1, &d2, sizeof d1);
    printf("%.1f %.1f\\n", d1, d2);                    /* 2.5 1.5 */

    int *ip = malloc(sizeof *ip);                      /* void * -> int *: no cast needed in C */
    free(ip);
    return 0;
}`, lang: "c", title: "Byte dump, qsort and a type-generic swap" },
        { table: { head: ["", "void *", "Typed pointer (int *)"], rows: [
          ["Can point to", "Any object", "int objects"],
          ["Dereference", "No — cast first", "Yes"],
          ["Arithmetic", "No (GNU extension only)", "Yes, scaled by sizeof(int)"],
          ["Implicit conversion", "To/from any object pointer in C", "Only to/from void *"],
          ["Typical use", "<code>malloc</code>, <code>memcpy</code>, <code>qsort</code>, callback context arguments", "Normal code"]
        ] } },
        { warn: "Don't confuse <code>void *</code> (generic pointer) with a <b>NULL pointer</b> (a pointer of any type that points nowhere). Also, <code>void *</code> is for <i>object</i> pointers; converting a function pointer to <code>void *</code> is not guaranteed by the C standard (POSIX allows it for <code>dlsym</code>). And casting the result of <code>malloc</code> in C is unnecessary and can hide a missing <code>#include &lt;stdlib.h&gt;</code> in old C89 code." },
        { tip: "Endianness follow-up: the byte dump above is a classic 'how do you check if a machine is little-endian?' answer — see <a href=\"#/core/coa/endianness\">endianness</a>." }
      ]
    },
    {
      id: "function-pointers",
      q: "What are function pointers, and how do you declare one, pass it as a callback and build a dispatch table?",
      topic: "Pointers",
      level: 2,
      top: false,
      short: "A function pointer stores the address of a function so it can be called indirectly. It is declared with parentheses around the name, like int (*fp)(int, int), and a typedef makes it readable. Function pointers implement callbacks such as qsort's comparator, dispatch tables that replace long switch statements, state machines, and hand-written vtables for polymorphism in C.",
      a: [
        { p: "A function's name decays to its address, just as an array's does. <code>int (*fp)(int, int)</code> reads 'fp is a pointer to a function taking two ints and returning int'. Without the parentheses, <code>int *fp(int, int)</code> declares a function returning <code>int *</code>." },
        { code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

typedef int (*binop)(int, int);                   /* readable alias */

int apply(binop f, int x, int y) { return f(x, y); }    /* f is a callback */

int main(void) {
    int (*fp)(int, int) = add;                    /* &add is equivalent */
    printf("%d\\n", fp(2, 3));                     /* 5 */
    printf("%d\\n", (*fp)(2, 3));                  /* 5 - explicit dereference, same call */
    printf("%d\\n", apply(mul, 4, 5));             /* 20 */

    binop table[] = { add, sub, mul };            /* dispatch table instead of a switch */
    const char *ops = "+-*";
    for (int i = 0; i < 3; i++)
        printf("7 %c 3 = %d\\n", ops[i], table[i](7, 3));   /* 10, 4, 21 */
    return 0;
}`, lang: "c", title: "Declare, call, pass, tabulate" },
        { table: { head: ["Declaration", "Meaning"], rows: [
          ["<code>int *f(int)</code>", "function returning <code>int *</code>"],
          ["<code>int (*f)(int)</code>", "pointer to function taking int, returning int"],
          ["<code>int (*f[3])(int)</code>", "array of 3 such function pointers"],
          ["<code>int (*get_op(char c))(int, int)</code>", "function taking char, returning a function pointer (use a typedef!)"],
          ["<code>void (*signal(int, void (*)(int)))(int)</code>", "the real signature of <code>signal()</code>"]
        ] } },
        { p: "<b>Uses:</b> <code>qsort</code>/<code>bsearch</code> comparators, event handlers and signal handlers, plugin interfaces loaded with <code>dlsym</code>, finite-state machines (array indexed by state), and 'objects' in C: a struct of function pointers is exactly how C++ vtables work under the hood (see <a href=\"#/core/oops/vtable-vptr\">vtable and vptr</a>) and how the Linux kernel's <code>struct file_operations</code> is built." },
        { warn: "Calling through a NULL or mismatched function pointer (wrong parameter types) is undefined behaviour. Read complex declarations with the <b>clockwise/spiral rule</b> or simply break them up with typedefs — interviewers value the typedef answer." },
        { tip: "Callbacks usually need context: the C idiom is an extra <code>void *user_data</code> parameter passed through to the callback, since C has no closures." }
      ]
    },
    {
      id: "dangling-wild-null-pointers",
      q: "What are dangling, wild and NULL pointers? How do you avoid the bugs they cause?",
      topic: "Pointers",
      level: 1,
      top: true,
      short: "A NULL pointer deliberately points nowhere and can be checked before use. A wild pointer is an uninitialised pointer holding a garbage address. A dangling pointer once pointed to valid memory that has since been freed or gone out of scope, such as the address of a local returned from a function. Dereferencing a wild or dangling pointer is undefined behaviour; prevent it by initialising pointers, setting them to NULL after free, and never returning addresses of locals.",
      a: [
        { table: { head: ["Kind", "How it happens", "Dereference result", "Prevention"], rows: [
          ["<b>NULL</b>", "<code>int *p = NULL;</code> — intentionally empty", "UB, usually a segfault (address 0 is unmapped)", "Check <code>if (p)</code> before use"],
          ["<b>Wild</b>", "<code>int *p;</code> — never initialised", "UB: writes to a random address", "Always initialise (to NULL or a valid address)"],
          ["<b>Dangling</b>", "Pointer to freed heap memory, or to a local after its function returned", "UB: may 'work', crash, or corrupt other data", "Set to NULL after <code>free</code>; return heap memory or use caller-provided buffers"],
          ["<b>void</b>", "Generic pointer (not a bug)", "Not allowed without a cast", "—"]
        ] } },
        { code: `#include <stdlib.h>

int *bad_return(void) {
    int local = 5;
    return &local;          /* dangling: local dies when the function returns (gcc warns) */
}

void bugs(void) {
    int *wild;              /* wild: holds garbage */
    *wild = 1;              /* UB: write to an unknown address */

    int *d = malloc(sizeof *d);
    free(d);
    *d = 2;                 /* UB: use after free - d is now dangling */

    int *n = NULL;
    *n = 3;                 /* UB: NULL dereference, typically SIGSEGV */
}`, lang: "c", run: false, title: "The three bugs (not executed: undefined behaviour)" },
        { p: "This snippet is deliberately not run: each marked line is <b>undefined behaviour</b>, so it might crash, print garbage, or appear to work today and fail after an unrelated change. A use-after-free often 'works' because the allocator hasn't reused that block yet — which is exactly what makes it dangerous." },
        { code: `#include <stdio.h>
#include <stdlib.h>

int *make_int(int v) {                 /* correct way to return memory: allocate on the heap */
    int *p = malloc(sizeof *p);
    if (p == NULL) return NULL;        /* malloc can fail */
    *p = v;
    return p;                          /* caller now owns it and must free it */
}

int main(void) {
    int *p = NULL;                     /* never leave a pointer wild */
    if (p == NULL) printf("p is NULL, not dereferencing\\n");

    p = make_int(7);
    if (p) printf("%d\\n", *p);         /* 7 */
    free(p);
    p = NULL;                          /* no dangling pointer left behind */
    free(p);                           /* free(NULL) is a guaranteed no-op */
    printf("done\\n");
    return 0;
}`, lang: "c", title: "Safe habits" },
        { warn: "Setting a pointer to NULL after <code>free</code> only protects <i>that</i> variable — other copies of the same address are still dangling. Ownership discipline (one owner frees) matters more than the NULL trick." },
        { tip: "Name the tools: compile with <code>-Wall -Wextra</code> (catches returning a local's address and many uninitialised uses), run with <code>-fsanitize=address</code> (AddressSanitizer reports use-after-free with stack traces) or under Valgrind." }
      ]
    },

    /* ───────────── Arrays & Strings ───────────── */
    {
      id: "arrays-vs-pointers",
      q: "Are arrays and pointers the same in C? What is array decay, and how does sizeof behave?",
      topic: "Arrays & Strings",
      level: 2,
      top: true,
      short: "No. An array is a block of contiguous elements whose size is part of its type; a pointer is a variable holding one address. In most expressions an array name decays to a pointer to its first element, which is why a[i] and *(a + i) are the same and why arrays passed to functions arrive as plain pointers. The exceptions are sizeof, unary &, and string-literal initialisation: sizeof(arr) gives the whole array's bytes, while sizeof of a pointer gives only the pointer size.",
      a: [
        { p: "<b>Decay rule:</b> an expression of type 'array of T' is converted to 'pointer to T' pointing at element 0 — <i>except</i> when it is the operand of <code>sizeof</code>, of unary <code>&amp;</code>, or a string literal initialising a char array. So a function parameter declared <code>int a[]</code> or even <code>int a[10]</code> is really <code>int *a</code>, and the length is lost." },
        { code: `#include <stdio.h>

void f(int a[]) {                       /* really: int *a  (gcc -Wall warns about sizeof here) */
    printf("in f: sizeof(a) == sizeof(int *) ? %d\\n", sizeof(a) == sizeof(int *));   /* 1 */
}

int main(void) {
    int arr[5] = {1, 2, 3, 4, 5};
    int *p = arr;                                            /* decay: &arr[0] */

    printf("%d\\n", (int)sizeof(arr));                        /* 20 : whole array */
    printf("%d\\n", (int)(sizeof arr / sizeof arr[0]));       /* 5  : element count idiom */
    printf("%d\\n", sizeof(p) == sizeof(int *));              /* 1  : just a pointer */

    printf("%d\\n", (int)((char *)(arr + 1) - (char *)arr));  /* 4  : next int */
    printf("%d\\n", (int)((char *)(&arr + 1) - (char *)arr)); /* 20 : &arr is int (*)[5], next ARRAY */
    printf("%d %d\\n", arr[2], 2[arr]);                       /* 3 3 : a[i] == *(a+i) == i[a] */
    f(arr);

    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int (*row)[3] = m;                                       /* pointer to an array of 3 ints */
    printf("%d\\n", row[1][2]);                               /* 6 */
    /* arr = p;   error: an array is not assignable */
    return 0;
}`, lang: "c", title: "Decay and sizeof, measured" },
        { table: { head: ["", "Array <code>int arr[5]</code>", "Pointer <code>int *p</code>"], rows: [
          ["What it is", "5 ints of storage", "One variable holding an address"],
          ["<code>sizeof</code>", "20 (5 × 4)", "4 or 8 (pointer size)"],
          ["<code>&amp;x</code> type", "<code>int (*)[5]</code> — pointer to whole array", "<code>int **</code>"],
          ["Assignable / incrementable", "No (<code>arr++</code> is an error)", "Yes"],
          ["Passed to a function", "Decays — callee gets a pointer, length lost", "Copied (pointer by value)"],
          ["String literal init", "<code>char s[] = \"hi\"</code> copies into the array", "<code>char *s = \"hi\"</code> points at read-only literal"]
        ] } },
        { warn: "The <code>sizeof(arr)/sizeof(arr[0])</code> idiom only works where the real array is in scope. Inside a function that received the array, it silently computes <code>sizeof(int *)/sizeof(int)</code> — always pass the length as a separate <code>size_t n</code> parameter." },
        { tip: "<code>int *a[3]</code> is an array of 3 pointers; <code>int (*a)[3]</code> is one pointer to an array of 3 ints. Being able to say which one a 2-D array decays to (<code>int (*)[3]</code>) is a strong signal." }
      ]
    },
    {
      id: "strings-strlen-vs-sizeof",
      q: "How are strings stored in C? What is the difference between strlen and sizeof, and between char s[] and char *s?",
      topic: "Arrays & Strings",
      level: 1,
      top: true,
      short: "A C string is an array of char terminated by a NUL byte, '\\0'. strlen walks the characters at run time and counts up to, but not including, the NUL; sizeof is a compile-time operator giving the size of the object in bytes — for an array it includes the NUL and any unused space, for a pointer it is just the pointer size. char s[] = \"hi\" creates a modifiable array copy, while char *s = \"hi\" points to a string literal that must not be modified.",
      a: [
        { p: "C has no string type. A <b>string</b> is a convention: a sequence of chars ending in <code>'\\0'</code>. Every <code>&lt;string.h&gt;</code> function relies on that terminator; forget it and functions read past the end of your buffer." },
        { code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s1[] = "hello";          /* array of 6 chars incl. '\\0', a modifiable copy */
    const char *s2 = "hello";     /* pointer to a string literal (read-only storage) */
    char s3[10] = "hi";           /* remaining 7 bytes are zero-filled */

    printf("%d %d\\n", (int)sizeof(s1), (int)strlen(s1));   /* 6 5 */
    printf("%d %d\\n", (int)sizeof(s3), (int)strlen(s3));   /* 10 2 */
    printf("%d\\n", sizeof(s2) == sizeof(char *));          /* 1 : the pointer's size, not the text */

    s1[0] = 'j';                  /* fine: our own array */
    printf("%s\\n", s1);           /* jello */
    /* ((char *)s2)[0] = 'j';   undefined behaviour: modifying a literal, usually a crash */

    char a[] = "abc", b[] = "abc";
    printf("%d %d\\n", a == b, strcmp(a, b) == 0);   /* 0 1 : == compares addresses, not text */

    char no_nul[3] = {'a', 'b', 'c'};               /* NOT a string: no terminator */
    printf("%d\\n", (int)sizeof(no_nul));            /* 3 - strlen(no_nul) would be undefined */
    return 0;
}`, lang: "c", title: "Arrays, literals, strlen and sizeof" },
        { table: { head: ["", "<code>sizeof</code>", "<code>strlen</code>"], rows: [
          ["Kind", "Compile-time operator (except VLAs)", "Library function, runs at run time — O(n)"],
          ["Counts", "Bytes of the object, incl. <code>'\\0'</code> and unused space", "Chars before the first <code>'\\0'</code>"],
          ["On <code>char s[] = \"hello\"</code>", "6", "5"],
          ["On <code>char *p = \"hello\"</code>", "4 or 8 (pointer)", "5"],
          ["Header", "none", "<code>&lt;string.h&gt;</code>"]
        ] } },
        { warn: "<code>char *s = \"hi\"; s[0] = 'H';</code> compiles in C (literals have type <code>char[]</code> for historical reasons) but is undefined behaviour — literals are typically in a read-only segment and the write segfaults. Declare such pointers <code>const char *</code> so the compiler stops you. Also, <code>strlen</code> inside a loop condition (<code>for (i = 0; i &lt; strlen(s); i++)</code>) makes the loop O(n²)." },
        { tip: "Know a few by heart and their pitfalls: <code>strcpy</code>/<code>strcat</code> (no bounds), <code>strncpy</code> (may not terminate), <code>strcmp</code> (returns &lt;0/0/&gt;0, not a bool), <code>snprintf</code> (the safe all-rounder). Writing <code>my_strlen</code> with a pointer loop is a frequent warm-up." }
      ]
    },
    {
      id: "buffer-overflow",
      q: "What is a buffer overflow? Why are gets and strcpy dangerous, and what should you use instead?",
      topic: "Arrays & Strings",
      level: 2,
      top: false,
      short: "A buffer overflow writes past the end of an array, overwriting neighbouring memory. On the stack this can corrupt other variables or the saved return address, which attackers exploit to hijack control flow. gets and strcpy copy until they meet a terminator with no idea how big the destination is; gets was removed in C11. Use bounded functions: fgets for input, snprintf for building strings, and strncpy only with manual termination, plus compiler protections like stack canaries and sanitizers.",
      a: [
        { p: "C does no bounds checking. Writing <code>buf[8]</code> into an 8-byte array is <b>undefined behaviour</b>: in practice it overwrites whatever lies next in memory — another local, saved registers, or the <b>return address</b> of the current stack frame. The 1988 Morris worm and countless CVEs started this way." },
        { code: `#include <stdio.h>
#include <string.h>

void login(const char *input) {
    int authorised = 0;
    char password[8];
    strcpy(password, input);           /* no bounds check: a long input overruns password[] */
    if (strcmp(password, "s3cret") == 0) authorised = 1;
    if (authorised) printf("welcome\\n");  /* may be reached with a WRONG but long password */
}

int main(void) {
    char name[16];
    gets(name);                        /* removed in C11: impossible to use safely */
    login("AAAAAAAAAAAAAAAAAAAAAAAA");  /* 24 bytes into an 8-byte buffer */
    return 0;
}`, lang: "c", run: false, title: "Vulnerable code (not executed: undefined behaviour)" },
        { p: "Not run on purpose: the overflow's effect depends on the compiler, stack layout and protections — it might flip <code>authorised</code>, abort with <i>stack smashing detected</i>, or crash." },
        { code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char dst[8];
    const char *input = "this is far too long";

    snprintf(dst, sizeof dst, "%s", input);    /* truncates, ALWAYS NUL-terminates */
    printf("[%s]\\n", dst);                     /* [this is] */

    strncpy(dst, input, sizeof dst);           /* does NOT terminate when input is too long */
    dst[sizeof dst - 1] = '\\0';                /* so terminate manually */
    printf("[%s]\\n", dst);                     /* [this is] */

    char line[16];
    /* safe input: if (fgets(line, sizeof line, stdin)) { ... } */
    strcpy(line, "abc\\n");                     /* pretend fgets read this */
    line[strcspn(line, "\\n")] = '\\0';          /* strip fgets' trailing newline */
    printf("[%s]\\n", line);                    /* [abc] */
    return 0;
}`, lang: "c", title: "Bounded alternatives" },
        { table: { head: ["Unsafe", "Safer", "Note"], rows: [
          ["<code>gets(buf)</code>", "<code>fgets(buf, sizeof buf, stdin)</code>", "Keeps the newline — strip it"],
          ["<code>strcpy(d, s)</code>", "<code>snprintf(d, sizeof d, \"%s\", s)</code>", "Or check <code>strlen(s) &lt; sizeof d</code> first"],
          ["<code>strcat(d, s)</code>", "<code>snprintf</code> into the remaining space", "<code>strncat</code>'s n is the space <i>left</i>, a common bug"],
          ["<code>sprintf(d, ...)</code>", "<code>snprintf(d, sizeof d, ...)</code>", "Return value tells you if it truncated"],
          ["<code>scanf(\"%s\", buf)</code>", "<code>scanf(\"%15s\", buf)</code>", "Width = size − 1"]
        ] } },
        { warn: "Mitigations exist but don't make overflowing code correct: <b>stack canaries</b> (<code>-fstack-protector-strong</code>), <b>ASLR</b>, <b>non-executable stack (NX/DEP)</b> and <code>-D_FORTIFY_SOURCE=2</code>. During development use <code>-fsanitize=address</code> to catch the overflow at the exact line." },
        { tip: "Off-by-one is the most common real overflow: allocating <code>strlen(s)</code> bytes instead of <code>strlen(s) + 1</code> for a copy — forgetting the room for <code>'\\0'</code>." }
      ]
    },

    /* ───────────── Memory Management ───────────── */
    {
      id: "stack-vs-heap-c",
      q: "What is the difference between stack and heap memory in a C program? Where do globals and static variables live?",
      topic: "Memory Management",
      level: 1,
      top: true,
      short: "Local variables and function call frames live on the stack, which is allocated and freed automatically as functions are entered and return; it is fast but small and fixed in size. The heap holds memory you request at run time with malloc and must release with free; it is larger and flexible but slower and error-prone. Globals and static variables live in the data segment if initialised and in the BSS segment, zero-filled, if not; code lives in the read-only text segment.",
      a: [
        { svg: `<svg viewBox="0 0 520 300" width="520" class="dg">
  <text class="tx tx-s" x="20" y="22">high addresses</text>
  <rect class="box-w" x="140" y="10" width="200" height="30" rx="4"/><text class="tx" x="240" y="25" text-anchor="middle" dominant-baseline="middle">argv, environment</text>
  <rect class="box-a" x="140" y="44" width="200" height="44" rx="4"/><text class="tx tx-b" x="240" y="66" text-anchor="middle" dominant-baseline="middle">Stack (grows down)</text>
  <line class="ln-a" x1="240" y1="90" x2="240" y2="116" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="140" y="120" width="200" height="40" rx="4"/><text class="tx tx-m" x="240" y="140" text-anchor="middle" dominant-baseline="middle">free space / mmap region</text>
  <line class="ln-a" x1="240" y1="190" x2="240" y2="164" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="140" y="192" width="200" height="30" rx="4"/><text class="tx tx-b" x="240" y="207" text-anchor="middle" dominant-baseline="middle">Heap (grows up)</text>
  <rect class="box-p" x="140" y="226" width="200" height="22" rx="4"/><text class="tx" x="240" y="237" text-anchor="middle" dominant-baseline="middle">BSS (uninit globals = 0)</text>
  <rect class="box-p" x="140" y="252" width="200" height="22" rx="4"/><text class="tx" x="240" y="263" text-anchor="middle" dominant-baseline="middle">Data (init globals/statics)</text>
  <rect class="box-r" x="140" y="278" width="200" height="20" rx="4"/><text class="tx" x="240" y="288" text-anchor="middle" dominant-baseline="middle">Text (code, read-only)</text>
  <text class="tx tx-s" x="20" y="292">low addresses</text>
  <text class="tx tx-s" x="352" y="66">locals, return addresses</text>
  <text class="tx tx-s" x="352" y="207">malloc / free</text>
  <text class="tx tx-s" x="352" y="250">static storage duration</text>
</svg>`, caption: "Typical process memory layout (see the OS view in process memory layout)" },
        { code: `#include <stdio.h>
#include <stdlib.h>

int global_init = 1;           /* data segment */
int global_zero;               /* BSS: zero-initialised automatically */

int depth(int n) { return n == 0 ? 0 : 1 + depth(n - 1); }   /* each call = a new stack frame */

int main(void) {
    static int s;              /* BSS too: static storage, NOT the stack */
    int local = 5;             /* stack: gone when main returns */
    int *heap = malloc(1000 * sizeof *heap);   /* heap: lives until free() */
    if (!heap) return 1;

    heap[999] = local;
    printf("%d %d %d %d\\n", global_init, global_zero, s, heap[999]);   /* 1 0 0 5 */
    printf("%d\\n", depth(1000));                                       /* 1000 */
    free(heap);
    return 0;
}`, lang: "c", title: "Where each variable lives" },
        { table: { head: ["", "Stack", "Heap"], rows: [
          ["Allocated by", "Compiler — automatic on function entry", "You — <code>malloc</code>/<code>calloc</code>/<code>realloc</code>"],
          ["Freed by", "Automatically on return", "You — <code>free</code> (or leak)"],
          ["Speed", "Very fast (move the stack pointer)", "Slower (allocator bookkeeping, possible system call)"],
          ["Size", "Small, fixed per thread (often 8 MB on Linux, 1 MB on Windows)", "Large — limited by virtual memory"],
          ["Fragmentation", "None (LIFO)", "Possible"],
          ["Failure mode", "Stack overflow (deep recursion, huge local arrays)", "<code>malloc</code> returns NULL; leaks; use-after-free"],
          ["Lifetime", "Until the function returns", "Until <code>free</code>"]
        ] } },
        { warn: "Large local arrays (<code>int big[10000000];</code>) overflow the stack and crash immediately — allocate them on the heap or make them <code>static</code>. And never return a pointer to a local variable; it's dangling the moment the function returns." },
        { tip: "Link to theory: <a href=\"#/core/os/process-memory-layout\">process memory layout</a> for the OS view and <a href=\"#/core/oops/stack-vs-heap\">stack vs heap in Java</a> for the contrast — in Java the GC frees heap objects, in C you do." }
      ]
    },
    {
      id: "malloc-calloc-realloc-free",
      q: "Explain malloc, calloc, realloc and free. What are the differences and the correct usage patterns?",
      topic: "Memory Management",
      level: 1,
      top: true,
      short: "malloc(n) returns n bytes of uninitialised heap memory; calloc(count, size) returns zeroed memory for an array and checks the multiplication for overflow; realloc(p, n) resizes a block, possibly moving it, and returns NULL on failure while leaving the old block valid; free(p) releases memory obtained from these functions. Always check for NULL, use sizeof *p, assign realloc's result to a temporary, and free each block exactly once.",
      a: [
        { table: { head: ["Function", "Signature", "Initialised?", "Notes"], rows: [
          ["<code>malloc</code>", "<code>void *malloc(size_t size)</code>", "No — garbage", "Fastest; returns NULL on failure"],
          ["<code>calloc</code>", "<code>void *calloc(size_t n, size_t size)</code>", "Yes — all bits zero", "Detects <code>n * size</code> overflow"],
          ["<code>realloc</code>", "<code>void *realloc(void *p, size_t size)</code>", "New part not initialised", "May move the block; <code>realloc(NULL, n)</code> == <code>malloc(n)</code>"],
          ["<code>free</code>", "<code>void free(void *p)</code>", "—", "<code>free(NULL)</code> is a no-op; doesn't change <code>p</code>"]
        ] } },
        { code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 4;
    int *a = malloc(n * sizeof *a);        /* contents are garbage until written */
    int *z = calloc(n, sizeof *z);         /* zero-filled */
    if (!a || !z) { free(a); free(z); return 1; }

    for (int i = 0; i < n; i++) a[i] = i * 10;
    printf("%d %d\\n", z[0], z[3]);         /* 0 0 */

    int *tmp = realloc(a, 2 * n * sizeof *a);   /* grow: may move the block */
    if (tmp == NULL) { free(a); free(z); return 1; }   /* old block still valid on failure */
    a = tmp;                                     /* old contents were copied over */
    for (int i = n; i < 2 * n; i++) a[i] = i * 10;

    for (int i = 0; i < 2 * n; i++) printf("%d ", a[i]);   /* 0 10 20 30 40 50 60 70 */
    printf("\\n");

    free(a);
    free(z);
    return 0;
}`, lang: "c", title: "All four, with the safe realloc pattern" },
        { ul: [
          "<b>Write <code>p = malloc(n * sizeof *p)</code></b> — stays correct if the type of <code>p</code> changes; no cast is needed in C.",
          "<b>Never <code>p = realloc(p, n)</code></b> — if it fails it returns NULL, you overwrite your only pointer and leak the block.",
          "<b>Check every allocation</b> — NULL on failure (rare on Linux due to overcommit, common on embedded systems).",
          "<b>Only free what you allocated</b> — freeing a stack address, the middle of a block, or the same block twice is undefined behaviour."
        ] },
        { p: "Under the hood (glibc), small requests are carved from the heap grown with <code>brk</code>/<code>sbrk</code>, large ones (≥ 128 KB by default) get their own <code>mmap</code> — both are <a href=\"#/core/os/system-calls\">system calls</a>, which is why allocators keep free lists and reuse memory instead of returning it to the OS on every <code>free</code>. Placement strategies relate to <a href=\"#/core/os/memory-allocation-fit\">first/best/worst fit</a>." },
        { warn: "<code>free</code> doesn't know or care about types and doesn't set your pointer to NULL. And <code>realloc(p, 0)</code> is implementation-defined in C99/C11 (and undefined in C23) — don't use it as a substitute for <code>free</code>." },
        { tip: "Classic follow-up: 'How does free know how many bytes to release?' — the allocator stores a small header (block size and flags) just before the address it returned to you." }
      ]
    },
    {
      id: "memory-leak-double-free",
      q: "What are memory leaks, double free and use-after-free? How do you find and prevent them?",
      topic: "Memory Management",
      level: 2,
      top: true,
      short: "A memory leak is heap memory that is never freed, usually because the last pointer to it was overwritten or went out of scope; long-running programs slowly run out of memory. A double free releases the same block twice and a use-after-free touches a block after freeing it; both are undefined behaviour that corrupt the allocator and are exploitable. Prevent them with clear ownership, a single cleanup path, setting pointers to NULL after free, and tools like Valgrind and AddressSanitizer.",
      a: [
        { code: `#include <stdlib.h>
#include <string.h>

void leaks(void) {
    char *p = malloc(100);
    p = malloc(200);            /* LEAK: the first 100 bytes are now unreachable */
    free(p);

    char *q = malloc(10);
    if (strlen("error") > 0)
        return;                 /* LEAK: early return skips free(q) */
    free(q);
}

void double_free(void) {
    int *a = malloc(sizeof *a);
    int *b = a;                 /* two pointers, one block */
    free(a);
    free(b);                    /* DOUBLE FREE: undefined behaviour, heap corruption */
}

void use_after_free(void) {
    int *c = malloc(sizeof *c);
    free(c);
    *c = 42;                    /* USE AFTER FREE: may overwrite another allocation */
}`, lang: "c", run: false, title: "The bugs (not executed: two of them are undefined behaviour)" },
        { p: "Leaks are not undefined behaviour — the program just keeps memory it can't reach. Double free and use-after-free are UB; glibc often aborts with <i>free(): double free detected</i>, but on other allocators they silently corrupt metadata, which attackers use to get arbitrary writes." },
        { code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Single-exit cleanup: every path frees exactly what was allocated */
int process(const char *msg) {
    int rc = -1;
    char *buf = NULL, *copy = NULL;

    buf = malloc(64);
    if (!buf) goto cleanup;
    copy = malloc(strlen(msg) + 1);          /* +1 for the '\\0' */
    if (!copy) goto cleanup;

    strcpy(copy, msg);
    snprintf(buf, 64, "processed: %s", copy);
    puts(buf);
    rc = 0;

cleanup:
    free(copy);                              /* free(NULL) is harmless */
    free(buf);
    return rc;
}

int main(void) {
    int rc = process("order#42");            /* processed: order#42 */
    printf("rc = %d\\n", rc);                 /* rc = 0 */
    return 0;
}`, lang: "c", title: "The goto-cleanup idiom (used throughout the Linux kernel)" },
        { code: `$ gcc -g leak.c -o leak && valgrind --leak-check=full ./leak
==1234== 100 bytes in 1 blocks are definitely lost in loss record 1 of 2
==1234==    at 0x4848899: malloc (vg_replace_malloc.c:381)
==1234==    by 0x109186: leaks (leak.c:5)

$ gcc -g -fsanitize=address uaf.c -o uaf && ./uaf
==5678==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
WRITE of size 4 at 0x602000000010 thread T0`, lang: "text", title: "What the tools report (abridged)" },
        { table: { head: ["Bug", "Typical cause", "Prevention"], rows: [
          ["Leak", "Overwritten pointer, early return, forgetting to free nested allocations (struct with pointer members)", "One owner per allocation; goto-cleanup; free inner pointers before the outer struct"],
          ["Double free", "Two pointers to one block, freeing in both caller and callee", "Document who owns it; set to NULL after free"],
          ["Use-after-free", "Keeping a pointer into a block that was freed or <code>realloc</code>-moved", "Don't cache pointers across <code>realloc</code>; NULL after free"]
        ] } },
        { tip: "Say you run tests under <code>-fsanitize=address,undefined</code> in CI — it catches leaks (LeakSanitizer), overflows, use-after-free and many UB cases with almost no effort. Contrast with Java, where the GC removes double free entirely but <a href=\"#/core/oops/memory-leaks-java\">leaks are still possible</a>." }
      ]
    },

    /* ───────────── Structs & Storage ───────────── */
    {
      id: "struct-padding-alignment",
      q: "What is structure padding? How do you work out the sizeof of a struct by hand, and how can you reduce it?",
      topic: "Structs & Storage",
      level: 2,
      top: true,
      short: "CPUs access data fastest when each object sits at an address that is a multiple of its alignment, so the compiler inserts unused padding bytes between struct members and at the end. Each member goes at the next offset that is a multiple of its own alignment, and the total size is rounded up to a multiple of the largest member's alignment. struct { char a; int b; char c; } is 12 bytes, not 6; reordering members from largest to smallest makes it 8.",
      a: [
        { p: "Typical alignments on x86-64 and ARM64: <code>char</code> 1, <code>short</code> 2, <code>int</code>/<code>float</code> 4, <code>double</code>/<code>long long</code>/pointers 8 (pointers are 4 on 32-bit builds). Two rules give every answer:" },
        { ol: [
          "Each member is placed at the smallest offset ≥ the current offset that is a <b>multiple of its alignment</b>.",
          "The struct's total size is rounded up to a <b>multiple of its largest member alignment</b> — so that every element of an array of these structs is also aligned."
        ] },
        { svg: `<svg viewBox="0 0 600 120" width="600" class="dg">
  <text class="tx tx-b" x="20" y="20">struct Bad { char a; int b; char c; }  -> 12 bytes</text>
  <rect class="box-a" x="20" y="36" width="44" height="34"/><text class="tx" x="42" y="53" text-anchor="middle" dominant-baseline="middle">a</text>
  <rect class="box-w" x="64" y="36" width="44" height="34"/><text class="tx tx-m" x="86" y="53" text-anchor="middle" dominant-baseline="middle">pad</text>
  <rect class="box-w" x="108" y="36" width="44" height="34"/><text class="tx tx-m" x="130" y="53" text-anchor="middle" dominant-baseline="middle">pad</text>
  <rect class="box-w" x="152" y="36" width="44" height="34"/><text class="tx tx-m" x="174" y="53" text-anchor="middle" dominant-baseline="middle">pad</text>
  <rect class="box-g" x="196" y="36" width="176" height="34"/><text class="tx" x="284" y="53" text-anchor="middle" dominant-baseline="middle">b (offset 4)</text>
  <rect class="box-a" x="372" y="36" width="44" height="34"/><text class="tx" x="394" y="53" text-anchor="middle" dominant-baseline="middle">c</text>
  <rect class="box-w" x="416" y="36" width="44" height="34"/><text class="tx tx-m" x="438" y="53" text-anchor="middle" dominant-baseline="middle">pad</text>
  <rect class="box-w" x="460" y="36" width="44" height="34"/><text class="tx tx-m" x="482" y="53" text-anchor="middle" dominant-baseline="middle">pad</text>
  <rect class="box-w" x="504" y="36" width="44" height="34"/><text class="tx tx-m" x="526" y="53" text-anchor="middle" dominant-baseline="middle">pad</text>
  <text class="tx tx-s" x="42" y="90" text-anchor="middle">0</text><text class="tx tx-s" x="196" y="90" text-anchor="middle">4</text><text class="tx tx-s" x="394" y="90" text-anchor="middle">8</text><text class="tx tx-s" x="548" y="90" text-anchor="middle">12</text>
  <text class="tx tx-m" x="20" y="112">6 bytes of data, 6 bytes of padding (tail padding keeps arrays aligned)</text>
</svg>`, caption: "Byte layout of struct Bad" },
        { table: { head: ["Member", "Size / align", "Offset", "Padding before"], rows: [
          ["<code>char a</code>", "1 / 1", "0", "0"],
          ["<code>int b</code>", "4 / 4", "4", "3 (offset 1 → 4)"],
          ["<code>char c</code>", "1 / 1", "8", "0"],
          ["<i>tail</i>", "—", "9 → 12", "3 (round to multiple of 4)"]
        ] } },
        { code: `#include <stdio.h>
#include <stddef.h>

struct Bad  { char a; int b; char c; };           /* 1 + 3 pad + 4 + 1 + 3 pad = 12 */
struct Good { int b; char a; char c; };           /* 4 + 1 + 1 + 2 pad          = 8  */
struct Mix  { char a; short s; char c; int i; };  /* a@0 s@2 c@4 i@8            = 12 */

int main(void) {
    printf("Bad  = %zu\\n", sizeof(struct Bad));    /* 12 */
    printf("Good = %zu\\n", sizeof(struct Good));   /* 8  */
    printf("Mix  = %zu\\n", sizeof(struct Mix));    /* 12 */
    printf("offsets in Bad: a=%zu b=%zu c=%zu\\n",
           offsetof(struct Bad, a), offsetof(struct Bad, b), offsetof(struct Bad, c));  /* 0 4 8 */
    return 0;
}`, lang: "c", title: "Verify with sizeof and offsetof" },
        { warn: "<code>#pragma pack(1)</code> or <code>__attribute__((packed))</code> removes padding (useful for network packets and file formats) but makes member access slower and can fault on CPUs that forbid unaligned loads; taking the address of a packed member is risky. Also: never compare structs with <code>memcmp</code> — padding bytes hold garbage, and C has no <code>==</code> for structs." },
        { tip: "Answer pattern: 'sort members by decreasing alignment to minimise padding'. Mention that <code>double</code> alignment differs between ABIs (4 on 32-bit Linux, 8 on Windows and 64-bit), so always verify with <code>sizeof</code>/<code>offsetof</code> rather than hard-coding sizes." }
      ]
    },
    {
      id: "struct-vs-union",
      q: "What is the difference between a structure and a union? When would you use a union?",
      topic: "Structs & Storage",
      level: 1,
      top: true,
      short: "In a struct every member has its own storage, laid out one after another, so its size is at least the sum of the members plus padding and all members are valid at once. In a union all members share the same storage starting at offset 0, so its size is that of the largest member and only the last written member is meaningful. Unions save memory for variant data, usually as a tagged union with an enum saying which member is active, and are used to inspect raw bytes.",
      a: [
        { table: { head: ["", "struct", "union"], rows: [
          ["Storage", "Separate for each member", "Shared — all members at offset 0"],
          ["<code>sizeof</code>", "≥ sum of members (+ padding)", "Size of the largest member (+ padding to alignment)"],
          ["Valid members", "All at the same time", "Only the one most recently written"],
          ["Writing one member", "Doesn't affect others", "Overwrites the others"],
          ["Typical use", "Records: a student, a point, a packet header", "Variant values, parsers, hardware registers, byte-level views"]
        ] } },
        { code: `#include <stdio.h>

struct S { int i; float f; char c; };   /* side by side */
union  U { int i; float f; char c; };   /* same bytes */

enum Kind { INT, FLOAT };
struct Value {                          /* tagged union: the real-world pattern */
    enum Kind kind;
    union { int i; float f; } as;
};

void print(struct Value v) {
    if (v.kind == INT) printf("int %d\\n", v.as.i);
    else               printf("float %.2f\\n", v.as.f);
}

int main(void) {
    printf("%zu %zu\\n", sizeof(struct S), sizeof(union U));   /* 12 4 */

    union U u;
    u.i = 65;
    printf("%c\\n", u.c);                  /* A : low byte of 65 on little-endian machines */
    u.f = 1.0f;
    printf("0x%08x\\n", (unsigned)u.i);    /* 0x3f800000 : IEEE-754 bits of 1.0f */

    struct Value a = { INT, { .i = 7 } }, b = { FLOAT, { .f = 2.5f } };
    print(a);                              /* int 7 */
    print(b);                              /* float 2.50 */
    return 0;
}`, lang: "c", title: "Sizes, shared bytes and a tagged union" },
        { p: "Reading a different member than the one last written ('type punning') is allowed in C (C99 TC3 / C11) and reinterprets the bytes — the result depends on <a href=\"#/core/coa/endianness\">endianness</a> and representation (the <code>0x3f800000</code> above is the <a href=\"#/core/coa/ieee-754-floating-point\">IEEE-754</a> encoding of 1.0). In C++ it is undefined behaviour, so don't carry the habit over." },
        { warn: "A union doesn't remember which member is active — that's your job, hence the <code>kind</code> tag. Reading the wrong member of a tagged union is a logic bug that the compiler can't catch." },
        { tip: "Good real examples: a JSON/AST node (<code>kind</code> + union of number/string/array), <code>SDL_Event</code> in game libraries, and a register view like <code>union { uint32_t word; uint8_t bytes[4]; }</code> in embedded code." }
      ]
    },
    {
      id: "storage-classes",
      q: "What are the storage classes in C — auto, static, extern and register?",
      topic: "Structs & Storage",
      level: 1,
      top: true,
      short: "Storage classes set a variable's lifetime, scope and linkage. auto is the default for locals: stack storage, lives for the block. static on a local keeps its value between calls and is initialised once; static on a global or function makes it private to the file. extern declares a variable or function defined in another file without allocating storage. register is an obsolete hint to keep a variable in a CPU register, and its address cannot be taken.",
      a: [
        { table: { head: ["Storage class", "Where", "Default value", "Scope", "Lifetime", "Linkage"], rows: [
          ["<code>auto</code> (default for locals)", "Stack", "Garbage (indeterminate)", "Block", "Block", "None"],
          ["<code>register</code>", "Register or stack (hint)", "Garbage", "Block", "Block", "None — and <code>&amp;x</code> is an error"],
          ["<code>static</code> local", "Data / BSS", "0", "Block", "Whole program", "None"],
          ["<code>static</code> global / function", "Data / BSS / text", "0", "File", "Whole program", "<b>Internal</b> (this .c only)"],
          ["global (no keyword)", "Data / BSS", "0", "File (+ others via extern)", "Whole program", "<b>External</b>"],
          ["<code>extern</code>", "— declaration only", "—", "Where declared", "—", "Refers to an external definition"]
        ] } },
        { code: `#include <stdio.h>

int counter = 0;               /* external linkage: other files can use it via extern */
static int file_only = 100;    /* internal linkage: private to this .c file */

static void helper(void) { }   /* static function: also private to this file */

void tick(void) {
    static int calls = 0;      /* initialised ONCE, keeps its value between calls */
    auto int temp = 0;         /* 'auto' is the redundant default for locals */
    register int step = 1;     /* a hint; &step would not compile */
    calls++; temp++; counter += step;
    printf("calls=%d temp=%d\\n", calls, temp);
}

int main(void) {
    extern int counter;        /* a declaration - normally lives in a header */
    tick(); tick(); tick();    /* calls=1 temp=1 / calls=2 temp=1 / calls=3 temp=1 */
    helper();
    printf("counter=%d file_only=%d\\n", counter, file_only);   /* counter=3 file_only=100 */
    return 0;
}`, lang: "c", title: "Lifetime vs scope vs linkage" },
        { p: "Separate three ideas the keywords mix together: <b>scope</b> (where the name is visible), <b>lifetime / storage duration</b> (when the object exists) and <b>linkage</b> (whether the same name in another file refers to the same object). <code>static</code> means 'static lifetime' on a local but 'internal linkage' on a global — two different jobs for one keyword." },
        { warn: "A static local makes a function <b>non-reentrant</b> and not thread-safe (every caller shares one copy) — e.g. <code>strtok</code> and <code>asctime</code>. Also, C23 repurposes <code>auto</code> for type inference (like C++11), so don't write it in new code." },
        { tip: "Practical answer to 'how do I share a global across files?': <i>define</i> it in exactly one .c (<code>int counter = 0;</code>), <i>declare</i> it in a header (<code>extern int counter;</code>), include the header everywhere it's used. Use <code>static</code> for everything that doesn't need to be shared." }
      ]
    },
    {
      id: "const-and-volatile",
      q: "What do const and volatile mean in C? How is const int *p different from int *const p, and when do you need volatile?",
      topic: "Structs & Storage",
      level: 2,
      top: true,
      short: "const marks an object read-only through that name; with pointers, read the declaration right to left: const int *p is a pointer to a const int (the data can't be changed through p, but p can be repointed), int *const p is a const pointer to int (the data can change, p can't). volatile tells the compiler the value may change outside the program's visible flow, so every access must really read or write memory: hardware registers, variables changed by interrupt or signal handlers, and setjmp locals.",
      a: [
        { code: `#include <stdio.h>

int main(void) {
    int x = 1, y = 2;

    const int *p1 = &x;          /* pointer to const int : *p1 = 5 is an error, p1 = &y is fine */
    int *const p2 = &x;          /* const pointer to int : *p2 = 5 is fine, p2 = &y is an error */
    const int *const p3 = &x;    /* neither can change */

    p1 = &y;                     /* repoint: allowed */
    *p2 = 10;                    /* modify data through p2: allowed */
    printf("%d %d %d\\n", *p1, x, *p3);   /* 2 10 10 */

    volatile int flag = 0;       /* every access really touches memory */
    for (int i = 0; i < 3; i++) flag++;
    printf("%d\\n", flag);        /* 3 */
    return 0;
}`, lang: "c", title: "The four const-pointer combinations" },
        { table: { head: ["Declaration", "Read right to left", "Change *p?", "Change p?"], rows: [
          ["<code>int *p</code>", "p is a pointer to int", "Yes", "Yes"],
          ["<code>const int *p</code> ≡ <code>int const *p</code>", "p is a pointer to const int", "No", "Yes"],
          ["<code>int *const p</code>", "p is a const pointer to int", "Yes", "No"],
          ["<code>const int *const p</code>", "p is a const pointer to const int", "No", "No"]
        ] } },
        { p: "<b>volatile</b> stops the optimiser from caching a value in a register, merging or removing reads/writes. Without it, <code>while (!flag) {}</code> waiting for an interrupt handler to set <code>flag</code> can compile into an infinite loop that reads <code>flag</code> once. Use it for: memory-mapped I/O registers (<code>volatile uint32_t *const UART = (uint32_t *)0x40001000;</code>), variables shared with an ISR (see <a href=\"#/core/coa/interrupts\">interrupts</a>), <code>volatile sig_atomic_t</code> flags set in signal handlers, and locals modified between <code>setjmp</code>/<code>longjmp</code>." },
        { warn: "In C, <code>volatile</code> is <b>not</b> a thread-synchronisation tool — it gives neither atomicity nor inter-thread ordering. Use C11 <code>&lt;stdatomic.h&gt;</code> or mutexes. (Java's <code>volatile</code> is different: it does give visibility and ordering between threads.) Also, casting away <code>const</code> and writing to an object that was <i>defined</i> const is undefined behaviour." },
        { tip: "Two crisp follow-ups: <code>const volatile</code> is legal and common — a read-only hardware status register that the hardware changes. And in C (unlike C++), a <code>const int N = 10;</code> is not a constant expression, so it can't size a file-scope array or be a <code>case</code> label — use <code>#define</code> or an <code>enum</code>." }
      ]
    },

    /* ───────────── Preprocessor & Build ───────────── */
    {
      id: "macros-pitfalls",
      q: "What are the common pitfalls of C macros, and when should you use an inline function instead?",
      topic: "Preprocessor & Build",
      level: 2,
      top: true,
      short: "Macros are blind text substitution done before compilation, so they ignore precedence, types and scope. Missing parentheses break expressions like SQUARE(2 + 3), arguments with side effects such as MAX(i++, j) are evaluated twice, multi-statement macros break if/else unless wrapped in do { } while (0), and errors point at expanded code. A static inline function (C99) evaluates arguments once and is type-checked; keep macros for include guards, conditional compilation, stringizing and token pasting.",
      a: [
        { p: "The preprocessor runs before the compiler and knows nothing about C — <code>#define</code> literally replaces tokens. Every pitfall follows from that." },
        { code: `#include <stdio.h>

#define SQUARE_BAD(x) x * x
#define SQUARE(x)     ((x) * (x))
#define MAX(a, b)     ((a) > (b) ? (a) : (b))
#define SWAP(a, b)    do { int t_ = (a); (a) = (b); (b) = t_; } while (0)
#define STR(x)        #x
#define CAT(a, b)     a##b

static inline int square_fn(int x) { return x * x; }   /* evaluates its argument once */

int main(void) {
    printf("%d\\n", SQUARE_BAD(2 + 3));    /* 2 + 3 * 2 + 3 = 11, not 25 */
    printf("%d\\n", SQUARE(2 + 3));        /* 25 */
    printf("%d\\n", 100 / SQUARE(5));      /* 4  (SQUARE_BAD gives 100 / 5 * 5 = 100) */

    int i = 3;
    int m = MAX(i++, 2);                  /* expands to ((i++) > (2) ? (i++) : (2)) */
    printf("m=%d i=%d\\n", m, i);          /* m=4 i=5 : i incremented TWICE */

    int j = 3;
    int s = square_fn(j++);               /* function: j++ evaluated once */
    printf("s=%d j=%d\\n", s, j);          /* s=9 j=4 */

    int a = 1, b = 2;
    if (a < b) SWAP(a, b); else printf("never\\n");   /* legal only thanks to do-while(0) */
    printf("%d %d\\n", a, b);              /* 2 1 */

    printf("%s\\n", STR(hello world));     /* hello world : # turns tokens into a string */
    int CAT(var, 1) = 7;                  /* ## pastes tokens: int var1 = 7; */
    printf("%d\\n", var1);                 /* 7 */
    return 0;
}`, lang: "c", title: "Every classic macro bug in one file" },
        { table: { head: ["", "Macro", "inline function"], rows: [
          ["Processed by", "Preprocessor (text)", "Compiler"],
          ["Type checking", "None", "Full"],
          ["Argument evaluation", "Once per appearance (side effects repeat)", "Exactly once"],
          ["Scope / namespacing", "Global from definition to <code>#undef</code>", "Normal C scope"],
          ["Debugging", "Errors in expanded text, no breakpoints", "Normal"],
          ["Can do", "Generic over types, <code>#</code>/<code>##</code>, <code>__FILE__</code>/<code>__LINE__</code>, conditional code", "Only what a function can"]
        ] } },
        { ul: [
          "Parenthesise <b>every parameter</b> and the <b>whole body</b>.",
          "Wrap multi-statement macros in <code>do { … } while (0)</code> so <code>if (x) M(); else …</code> parses.",
          "Never pass expressions with side effects (<code>i++</code>, function calls) to a macro.",
          "Use UPPER_CASE names so readers know it's a macro."
        ] },
        { warn: "Without <code>do { } while (0)</code>, a braces-only macro <code>{ … }</code> followed by the user's <code>;</code> ends the <code>if</code> early, and the <code>else</code> becomes a syntax error. Also <code>#define PI 3.14;</code> (with a semicolon) silently breaks expressions like <code>PI * r</code>." },
        { tip: "Legit macro uses interviewers accept: include guards, <code>#ifdef DEBUG</code> logging that captures <code>__FILE__</code>/<code>__LINE__</code>, compile-time platform switches (<code>#ifdef _WIN32</code>), and <code>ARRAY_SIZE(a)</code>. For constants prefer <code>enum</code> or <code>static const</code>." }
      ]
    },
    {
      id: "compilation-stages",
      q: "What are the stages of compiling a C program? What happens in preprocessing, compilation, assembly and linking?",
      topic: "Preprocessor & Build",
      level: 1,
      top: true,
      short: "gcc runs four stages. The preprocessor expands #include, #define and conditional directives into one translation unit (.i). The compiler proper turns that C into assembly for the target CPU (.s), doing parsing, type checking and optimisation. The assembler converts assembly into machine code in a relocatable object file (.o) with a symbol table. The linker combines object files and libraries, resolves symbols such as printf, and produces the executable.",
      a: [
        { svg: `<svg viewBox="0 0 700 150" width="700" class="dg">
  <rect class="box-w" x="10" y="50" width="70" height="34" rx="6"/><text class="tx tx-b" x="45" y="67" text-anchor="middle" dominant-baseline="middle">main.c</text>
  <rect class="box-a" x="110" y="50" width="100" height="34" rx="6"/><text class="tx" x="160" y="67" text-anchor="middle" dominant-baseline="middle">Preprocessor</text>
  <rect class="box-a" x="250" y="50" width="90" height="34" rx="6"/><text class="tx" x="295" y="67" text-anchor="middle" dominant-baseline="middle">Compiler</text>
  <rect class="box-a" x="380" y="50" width="90" height="34" rx="6"/><text class="tx" x="425" y="67" text-anchor="middle" dominant-baseline="middle">Assembler</text>
  <rect class="box-a" x="510" y="50" width="80" height="34" rx="6"/><text class="tx" x="550" y="67" text-anchor="middle" dominant-baseline="middle">Linker</text>
  <rect class="box-g" x="620" y="50" width="70" height="34" rx="6"/><text class="tx tx-b" x="655" y="67" text-anchor="middle" dominant-baseline="middle">a.out</text>
  <line class="ln" x1="80" y1="67" x2="108" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="210" y1="67" x2="248" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="340" y1="67" x2="378" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="470" y1="67" x2="508" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="590" y1="67" x2="618" y2="67" marker-end="url(#dg-arr)"/>
  <text class="tx tx-s" x="229" y="44" text-anchor="middle">.i</text>
  <text class="tx tx-s" x="359" y="44" text-anchor="middle">.s</text>
  <text class="tx tx-s" x="489" y="44" text-anchor="middle">.o</text>
  <text class="tx tx-m" x="160" y="104" text-anchor="middle">gcc -E</text>
  <text class="tx tx-m" x="295" y="104" text-anchor="middle">gcc -S</text>
  <text class="tx tx-m" x="425" y="104" text-anchor="middle">gcc -c</text>
  <text class="tx tx-m" x="550" y="104" text-anchor="middle">ld (via gcc)</text>
  <rect class="box-p" x="500" y="112" width="100" height="28" rx="6"/><text class="tx tx-s" x="550" y="126" text-anchor="middle" dominant-baseline="middle">other .o + libc</text>
  <line class="ln-d" x1="550" y1="112" x2="550" y2="86" marker-end="url(#dg-arr)"/>
</svg>`, caption: "From source to executable" },
        { table: { head: ["Stage", "Input → output", "What it does", "Typical errors here"], rows: [
          ["1. Preprocessing (<code>cpp</code>)", ".c → .i", "Pastes <code>#include</code> files, expands macros, evaluates <code>#if/#ifdef</code>, strips comments", "<code>fatal error: foo.h: No such file or directory</code>"],
          ["2. Compilation (<code>cc1</code>)", ".i → .s", "Lexing, parsing, type checking, optimisation, code generation to assembly", "Syntax errors, type errors, implicit declaration warnings"],
          ["3. Assembly (<code>as</code>)", ".s → .o", "Machine code + symbol table + relocation entries; addresses not final yet", "Rare (inline asm mistakes)"],
          ["4. Linking (<code>ld</code>)", ".o + libs → executable", "Resolves symbols across files and libraries, assigns final addresses, adds startup code (<code>_start</code> calls <code>main</code>)", "<code>undefined reference to 'foo'</code>, <code>multiple definition of 'x'</code>"]
        ] } },
        { code: `#include <stdio.h>
#define GREETING "hello, build pipeline"

int main(void) {
    printf("%s\\n", GREETING);    /* after -E this line reads: printf("%s\\n", "hello, build pipeline"); */
    return 0;
}`, lang: "c", title: "main.c" },
        { code: `gcc -E main.c -o main.i      # 1. preprocess only (main.i is ~700 lines: all of stdio.h)
gcc -S main.i -o main.s      # 2. compile to assembly
gcc -c main.s -o main.o      # 3. assemble to an object file
gcc main.o -o main           # 4. link with libc -> executable
./main                       # hello, build pipeline

gcc -save-temps -Wall main.c # keeps .i, .s and .o so you can inspect every stage
nm main.o                    # symbols: 'T main' defined, 'U printf' undefined (linker resolves it)`, lang: "bash", title: "Stopping after each stage" },
        { p: "<b>Static vs dynamic linking:</b> a static link copies library code into the executable (<code>libc.a</code>, bigger, self-contained); dynamic linking records a dependency on a shared library (<code>libc.so</code> / <code>.dll</code>) that the <i>loader</i> maps at run time — smaller binaries, shared memory, updatable libraries." },
        { tip: "Diagnosing by stage is what they're testing: a missing header fails in preprocessing, a typo fails in compilation, and a declared-but-never-defined function (or forgetting <code>-lm</code> for <code>sqrt</code> on older Linux toolchains) fails only at link time." }
      ]
    },
    {
      id: "header-vs-source-files",
      q: "What goes in a header file versus a source file? What are include guards and why do you need them?",
      topic: "Preprocessor & Build",
      level: 2,
      top: false,
      short: "A header (.h) holds declarations that several files need to agree on: function prototypes, type and struct definitions, macros, extern declarations of globals and static inline functions. A source file (.c) holds the definitions: function bodies and global variables with their storage, compiled once each. Include guards (#ifndef X_H / #define X_H / #endif) or #pragma once stop a header from being pasted twice into the same translation unit, which would redefine its types.",
      a: [
        { p: "<b>Declaration</b> = 'this name exists and has this type' (can appear many times). <b>Definition</b> = 'here is the storage or the body' (exactly once in the whole program, the <i>one definition rule</i>). Headers carry declarations to every .c that <code>#include</code>s them; each .c is compiled separately into its own .o, and the linker joins them." },
        { code: [
          { lang: "c", run: false, src: `/* point.h - the interface */
#ifndef POINT_H
#define POINT_H

struct Point { int x, y; };                    /* type definition: OK in a header */

int manhattan(struct Point a, struct Point b); /* prototype (declaration) */
extern int point_count;                        /* declaration of a global, no storage */

#endif /* POINT_H */` },
          { lang: "c", run: false, src: `/* point.c - the implementation */
#include <stdlib.h>
#include "point.h"                 /* lets the compiler check the definitions match */

int point_count = 0;               /* definition: storage lives here, once */

static int absdiff(int a, int b) { return abs(a - b); }   /* private helper */

int manhattan(struct Point a, struct Point b) {
    point_count++;
    return absdiff(a.x, b.x) + absdiff(a.y, b.y);
}` },
          { lang: "c", run: false, src: `/* main.c - a user */
#include <stdio.h>
#include "point.h"

int main(void) {
    struct Point p = {1, 2}, q = {4, 6};
    int d = manhattan(p, q);
    printf("%d %d\\n", d, point_count);   /* 7 1 */
    return 0;
}` },
          { lang: "bash", src: `gcc -std=c99 -Wall -c point.c     # -> point.o
gcc -std=c99 -Wall -c main.c      # -> main.o (only needs point.h, not point.c)
gcc point.o main.o -o app && ./app   # 7 1` }
        ], title: "A three-file module (point.h, point.c, main.c, build)" },
        { code: `#include <stdio.h>
#include <stdlib.h>

/* ---- point.h, included TWICE (e.g. directly and via another header) ---- */
#ifndef POINT_H
#define POINT_H
struct Point { int x, y; };
int manhattan(struct Point a, struct Point b);
extern int point_count;
#endif

#ifndef POINT_H                 /* second inclusion: POINT_H is already defined -> skipped */
#define POINT_H
struct Point { int x, y; };     /* without the guard: "redefinition of 'struct Point'" */
#endif

/* ---- point.c ---- */
int point_count = 0;
int manhattan(struct Point a, struct Point b) {
    point_count++;
    return abs(a.x - b.x) + abs(a.y - b.y);
}

/* ---- main.c ---- */
int main(void) {
    struct Point p = {1, 2}, q = {4, 6};
    int d = manhattan(p, q);
    printf("%d %d\\n", d, point_count);   /* 7 1 */
    return 0;
}`, lang: "c", title: "The same module pasted into one file, showing the guard at work" },
        { table: { head: ["Put in the header", "Keep in the .c file"], rows: [
          ["Function prototypes of the public API", "Function bodies"],
          ["<code>struct</code>/<code>enum</code>/<code>typedef</code> definitions callers need", "Global variable definitions (<code>int count = 0;</code>)"],
          ["<code>extern</code> declarations of shared globals", "<code>static</code> helper functions and file-private data"],
          ["Macros and <code>static inline</code> functions", "Opaque struct definitions you want to hide (<code>struct Impl { … }</code>)"]
        ] } },
        { warn: "Defining a global (<code>int count = 0;</code>) or a non-inline function in a header that two .c files include gives the linker error <i>multiple definition of 'count'</i>. Putting <code>static int x;</code> in a header compiles but silently gives every .c its <b>own separate copy</b>. <code>#pragma once</code> is shorter than guards and supported by GCC, Clang and MSVC, but isn't in the C standard." },
        { tip: "Mention the <b>opaque pointer</b> idiom: the header only says <code>typedef struct Stack Stack;</code> plus functions taking <code>Stack *</code>; the struct's fields stay in the .c — that's encapsulation in C (compare <a href=\"#/core/oops/encapsulation-vs-abstraction\">encapsulation vs abstraction</a>)." }
      ]
    },

    /* ───────────── UB & Bit Tricks ───────────── */
    {
      id: "undefined-behaviour-classics",
      q: "What is undefined behaviour in C? What does i++ + ++i print, and why is signed overflow dangerous?",
      topic: "UB & Bit Tricks",
      level: 2,
      top: true,
      short: "Undefined behaviour is code for which the C standard imposes no requirements, so the compiler may produce any result, crash, or optimise on the assumption it never happens. i++ + ++i modifies i twice without a sequence point between them, so it has no correct answer: GCC happens to print 12, other compilers or flags may differ. Signed integer overflow is also UB, which lets optimisers delete overflow checks like x + 1 < x; unsigned arithmetic, by contrast, wraps around and is well defined.",
      a: [
        { table: { head: ["Category", "Meaning", "Examples"], rows: [
          ["<b>Undefined</b>", "No requirements at all — anything may happen", "Signed overflow, out-of-bounds access, NULL/dangling dereference, modifying a variable twice between sequence points, uninitialised reads"],
          ["<b>Unspecified</b>", "One of several valid outcomes, compiler needn't document which", "Order of evaluating function arguments: <code>f(a(), b())</code>"],
          ["<b>Implementation-defined</b>", "Compiler chooses and documents it", "<code>sizeof(int)</code>, whether <code>char</code> is signed, right-shifting a negative number"]
        ] } },
        { code: `#include <stdio.h>
#include <limits.h>

int will_overflow(int x) {
    return x + 1 < x;           /* gcc -O2 compiles this to 'return 0': overflow "can't happen" */
}

int main(void) {
    int i = 5;
    int x = i++ + ++i;          /* UB: i modified twice without a sequence point */
    printf("%d\\n", x);          /* GCC prints 12 (and warns -Wsequence-point); not guaranteed */

    i = i++;                    /* UB */
    printf("%d %d\\n", i, i++);  /* UB: unsequenced read and write of i */

    int big = INT_MAX;
    big = big + 1;              /* UB: signed overflow */

    int arr[3];
    arr[3] = 0;                 /* UB: out of bounds */

    int u;
    printf("%d\\n", u);          /* reading an uninitialised local: indeterminate value */
    printf("%d\\n", will_overflow(INT_MAX));   /* may print 0 although the maths says 1 */
    return 0;
}`, lang: "c", run: false, title: "Classic UB (deliberately not executed)" },
        { p: "This block is marked <code>run: false</code> on purpose: running it proves nothing, because undefined behaviour can produce a plausible-looking number today and different output with another compiler, flag (<code>-O0</code> vs <code>-O2</code>) or even unrelated code changes. The only right answer to 'what does <code>i++ + ++i</code> print?' is: <b>it's undefined; rewrite it</b>." },
        { code: `#include <stdio.h>
#include <limits.h>

int safe_add(int a, int b, int *out) {                 /* check BEFORE the overflow happens */
    if ((b > 0 && a > INT_MAX - b) || (b < 0 && a < INT_MIN - b)) return 0;
    *out = a + b;
    return 1;
}

int main(void) {
    unsigned int u = UINT_MAX;
    u = u + 1;                                          /* defined: unsigned wraps modulo 2^N */
    printf("%u\\n", u);                                  /* 0 */

    int r = 0;
    int ok = safe_add(INT_MAX, 1, &r);
    printf("%d\\n", ok);                                 /* 0 : refused */
    ok = safe_add(40, 2, &r);
    printf("%d %d\\n", ok, r);                           /* 1 42 */

    int i = 5;
    int a = i++;                                        /* one side effect per statement */
    int b = ++i;
    printf("%d %d %d\\n", a, b, a + b);                  /* 5 7 12 - now well defined */
    return 0;
}`, lang: "c", title: "Well-defined rewrites" },
        { warn: "Compilers exploit UB to optimise: because signed overflow 'cannot happen', <code>for (int i = 0; i &lt;= n; i++)</code> may be assumed to terminate, overflow checks written after the fact get deleted, and a NULL check placed after a dereference can be removed. Sequence-point rules live on as 'sequenced before' in C11 — <code>&amp;&amp;</code>, <code>||</code>, <code>?:</code> and the comma operator do sequence their operands." },
        { tip: "Show you know the tooling: <code>-Wall</code> flags <code>i++ + ++i</code> (<i>operation on 'i' may be undefined</i>), <code>-fsanitize=undefined</code> reports signed overflow at run time, and <code>-fwrapv</code> makes signed overflow wrap if you really need it. Signed representation background: <a href=\"#/core/coa/ones-vs-twos-complement\">one's vs two's complement</a>." }
      ]
    },
    {
      id: "bitwise-tricks",
      q: "Which bitwise tricks should you know in C? How do you set, clear, toggle and test a bit, count set bits, or check for a power of two?",
      topic: "UB & Bit Tricks",
      level: 2,
      top: false,
      short: "Use masks built with 1u << n: x | mask sets a bit, x & ~mask clears it, x ^ mask toggles it, and (x >> n) & 1 tests it. x & (x - 1) clears the lowest set bit, which gives Kernighan's popcount loop and the power-of-two test x && !(x & (x - 1)); x & -x isolates the lowest set bit. Do bit manipulation on unsigned types, because shifting into or by more than the width of a signed type is undefined.",
      a: [
        { table: { head: ["Goal", "Expression", "Example (x = 0010 1100)"], rows: [
          ["Set bit n", "<code>x | (1u &lt;&lt; n)</code>", "n = 0 → 0010 1101"],
          ["Clear bit n", "<code>x &amp; ~(1u &lt;&lt; n)</code>", "n = 2 → 0010 1000"],
          ["Toggle bit n", "<code>x ^ (1u &lt;&lt; n)</code>", "n = 7 → 1010 1100"],
          ["Test bit n", "<code>(x &gt;&gt; n) &amp; 1u</code>", "n = 3 → 1"],
          ["Clear lowest set bit", "<code>x &amp; (x - 1)</code>", "0010 1000"],
          ["Isolate lowest set bit", "<code>x &amp; -x</code>", "0000 0100"],
          ["Power of two?", "<code>x &amp;&amp; !(x &amp; (x - 1))</code>", "64 → true"],
          ["Odd?", "<code>x &amp; 1</code>", "0 → even"],
          ["× / ÷ by 2<sup>k</sup> (unsigned)", "<code>x &lt;&lt; k</code>, <code>x &gt;&gt; k</code>", "1 &lt;&lt; 4 = 16"]
        ] } },
        { code: `#include <stdio.h>

int popcount(unsigned x) {                 /* Kernighan: one iteration per SET bit */
    int c = 0;
    while (x) { x &= x - 1; c++; }
    return c;
}

void print_bin(unsigned x) {               /* low 8 bits */
    for (int i = 7; i >= 0; i--) putchar(((x >> i) & 1u) ? '1' : '0');
    putchar('\\n');
}

int main(void) {
    unsigned x = 0x2C;                     /* 0010 1100 */
    print_bin(x);                          /* 00101100 */
    print_bin(x | (1u << 0));              /* set bit 0     -> 00101101 */
    print_bin(x & ~(1u << 2));             /* clear bit 2   -> 00101000 */
    print_bin(x ^ (1u << 7));              /* toggle bit 7  -> 10101100 */
    printf("%u\\n", (x >> 3) & 1u);         /* test bit 3    -> 1 */
    printf("%d\\n", popcount(x));           /* 3 */
    print_bin(x & -x);                     /* lowest set bit -> 00000100 */

    unsigned n = 64;
    printf("%d\\n", n && !(n & (n - 1)));   /* power of two -> 1 */

    int a = 5, b = 9;
    a ^= b; b ^= a; a ^= b;                /* XOR swap */
    printf("%d %d\\n", a, b);               /* 9 5 */
    printf("%s\\n", (7 & 1) ? "odd" : "even");      /* odd */
    printf("%d %d\\n", 1 << 4, 80 >> 2);            /* 16 20 */
    return 0;
}`, lang: "c", title: "The toolkit, verified" },
        { p: "Real uses: permission flags (<code>READ | WRITE</code>, like <a href=\"#/core/se/file-permissions-chmod\">chmod bits</a>), packing booleans into one byte, hardware registers, bitsets/Bloom filters, and fast hashing (<code>h &amp; (n - 1)</code> when n is a power of two — exactly what Java's HashMap does)." },
        { warn: "Precedence: <code>x &amp; 1 == 0</code> parses as <code>x &amp; (1 == 0)</code> — always parenthesise. Shifting by ≥ the type's width (<code>1 &lt;&lt; 32</code> for 32-bit int) is UB, so is left-shifting a negative value or shifting a 1 into the sign bit of an <code>int</code>; right-shifting a negative number is implementation-defined. XOR swap breaks (zeroes the value) if both names refer to the same object, and is not faster than a temp variable on modern CPUs." },
        { tip: "Know the GCC builtins as the 'production' answer: <code>__builtin_popcount</code>, <code>__builtin_ctz</code> (count trailing zeros) and <code>__builtin_clz</code> — they compile to single instructions like <code>POPCNT</code>." }
      ]
    }
  ]
});
