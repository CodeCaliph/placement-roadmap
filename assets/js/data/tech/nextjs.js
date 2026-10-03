/* tech stack: Next.js — interview Q&A
   App Router first (Next.js 15/16, React 19). Component code is `jsx` (not executed); server files that
   need Next.js are marked run:false. The plain-Node SSR and ISR simulations were executed by the validator. */
(window.TECH = window.TECH || []).push({
  id: "nextjs",
  title: "Next.js",
  short: "Next.js",
  icon: "▲",
  blurb: "With Next.js on your resume, expect questions on rendering strategies (CSR, SSR, SSG, ISR) and how SSR plus hydration actually works, the App Router model of Server vs Client Components, file-based routing, data fetching and caching, Server Actions and route handlers, and production concerns like SEO, images, environment variables, auth and deployment.",
  topics: ["Fundamentals", "Routing", "Server & Client Components", "Data & Caching", "Server Features", "Production"],
  questions: [

    /* ───────────── Fundamentals ───────────── */
    {
      id: "why-nextjs",
      q: "What is Next.js, and why would you use it instead of plain React?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "React is a UI library; Next.js is a full-stack framework built on React. It adds file-based routing, server-side rendering, static generation and incremental regeneration, React Server Components, Server Actions and API route handlers, plus built-in image, font and script optimisation and a zero-config bundler. You choose it when SEO, fast first load or a backend in the same codebase matter; a plain React SPA built with Vite is fine for internal dashboards behind a login.",
      a: [
        { p: "Plain React (e.g. a Vite SPA) ships an almost empty HTML file and a JavaScript bundle; the browser downloads the JS, then fetches data, then renders. Everything else — routing, data loading, SSR, code splitting conventions — you assemble yourself. <b>Next.js</b> makes those decisions for you and runs code on the server as well as the client." },
        { table: { head: ["Need", "Plain React (Vite SPA)", "Next.js"], rows: [
          ["Routing", "Add React Router, configure routes", "File-system routing, nested layouts"],
          ["First paint / SEO", "Blank HTML until JS loads (CSR)", "HTML rendered on server or at build time"],
          ["Data fetching", "Client-side only (useEffect / React Query)", "Async Server Components, direct DB access, caching"],
          ["Backend", "Separate Express/FastAPI service", "Route Handlers and Server Actions in the same repo"],
          ["Images & fonts", "Manual", "<code>next/image</code>, <code>next/font</code>"],
          ["Code splitting", "Manual <code>lazy()</code>", "Automatic per route"],
          ["Deployment", "Any static host", "Node server, Vercel, Docker, or static export"]
        ] } },
        { h: "When plain React is the better choice" },
        { ul: [
          "Internal tools and dashboards behind auth, where SEO doesn't matter and a static bundle on a CDN is simplest.",
          "Apps embedded in another product, browser extensions, or mobile WebViews.",
          "Teams that already have a separate backend and want the smallest mental model."
        ] },
        { h: "Costs of Next.js" },
        { ul: [
          "More concepts: server vs client components, caching layers, runtime boundaries, hydration errors.",
          "Needs a Node server (or a platform like Vercel) for SSR/ISR/Server Actions — not just static hosting.",
          "Fast-moving: caching defaults changed in v15, <code>middleware</code> was renamed <code>proxy</code> and Cache Components arrived in v16."
        ] },
        { tip: "Frame it as \"React is the view layer; Next.js is the framework around it.\" The React docs themselves now recommend starting new apps with a framework such as Next.js or React Router, or a build tool like Vite for SPAs." }
      ]
    },
    {
      id: "rendering-strategies",
      q: "What are CSR, SSR, SSG and ISR, and when would you use each?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "They differ in when and where HTML is produced. CSR renders in the browser after JavaScript loads. SSR renders HTML on the server for every request, so data is always fresh but each request costs server time. SSG renders at build time and serves the same static HTML from a CDN, which is fastest but can go stale. ISR is SSG plus background regeneration after a revalidate interval or on demand, giving static speed with reasonably fresh data. In the App Router you pick per route or even per component.",
      a: [
        { table: { head: ["", "CSR", "SSR", "SSG", "ISR"], rows: [
          ["HTML produced", "In the browser", "On the server, per request", "At build time", "At build, then regenerated in the background"],
          ["Data freshness", "Live (client fetch)", "Always fresh", "As of last build", "Fresh within revalidate window / on demand"],
          ["TTFB", "Fast (static shell)", "Slower (render per request)", "Fastest (CDN)", "Fastest (CDN)"],
          ["SEO", "Weak (empty HTML)", "Good", "Good", "Good"],
          ["Server cost", "None", "Highest", "Build only", "Low"],
          ["Use for", "Dashboards, highly interactive, user-only data", "Personalised pages, search results, auth-dependent pages", "Docs, blogs, marketing pages", "Product catalogues, news, listings"],
          ["App Router", "<code>\"use client\"</code> + client fetching", "Uses <code>cookies()</code>/<code>headers()</code>/<code>searchParams</code> or uncached data", "Default for routes with no dynamic data", "<code>revalidate</code> / <code>revalidateTag</code> / <code>\"use cache\"</code> + <code>cacheLife</code>"],
          ["Pages Router", "Client fetch", "<code>getServerSideProps</code>", "<code>getStaticProps</code>", "<code>getStaticProps</code> + <code>revalidate</code>"]
        ] } },
        { p: "ISR is <b>stale-while-revalidate</b> for pages: after the window expires the next visitor still gets the cached page instantly, and that request triggers a regeneration for the visitors after it. Simulated:" },
        { code: `function createISR(render, revalidateSec) {
  const cache = new Map();
  return async function get(path, now) {
    const hit = cache.get(path);
    if (!hit) {                                         // first request / build
      cache.set(path, { html: await render(now), at: now });
      return cache.get(path).html + "  [MISS -> rendered]";
    }
    if (now - hit.at < revalidateSec) return hit.html + "  [HIT fresh]";
    render(now).then(html => cache.set(path, { html, at: now }));  // background regen
    return hit.html + "  [STALE served, regenerating]";
  };
}

let price = 100;
const get = createISR(async t => "price=" + price + " (built t=" + t + ")", 60);

(async () => {
  console.log("t=0  ", await get("/product/1", 0));
  price = 120;                                          // DB updated by admin
  console.log("t=30 ", await get("/product/1", 30));
  console.log("t=90 ", await get("/product/1", 90));
  await new Promise(r => setTimeout(r, 0));             // let regeneration finish
  console.log("t=91 ", await get("/product/1", 91));
})();
/*
t=0   price=100 (built t=0)  [MISS -> rendered]
t=30  price=100 (built t=0)  [HIT fresh]
t=90  price=100 (built t=0)  [STALE served, regenerating]
t=91  price=120 (built t=90)  [HIT fresh]
*/`, lang: "javascript", title: "ISR = stale-while-revalidate (simulation)" },
        { code: `// app/products/[id]/page.js — static pages for known ids, refreshed at most every 60 s
export const revalidate = 60;

export async function generateStaticParams() {
  const top = await fetch("https://api.example.com/products?top=100").then(r => r.json());
  return top.map(p => ({ id: String(p.id) }));         // prebuilt at build time
}

export default async function ProductPage({ params }) {
  const { id } = await params;                          // params is a Promise in Next 15+
  const product = await fetch("https://api.example.com/products/" + id).then(r => r.json());
  return <h1>{product.name} — ₹{product.price}</h1>;
}`, lang: "jsx", title: "SSG + ISR in the App Router" },
        { tip: "Strong answer: \"It's not one choice per app. A product page can be a static shell (SSG/ISR) with a streamed, per-user 'recommended for you' section (dynamic) and an interactive cart button (client).\" That's exactly what Partial Prerendering / Cache Components in Next 16 formalise." }
      ]
    },
    {
      id: "how-ssr-works",
      q: "Walk me through what happens when a user requests an SSR page in Next.js. How does SSR work?",
      topic: "Fundamentals",
      level: 2,
      top: true,
      short: "The request reaches the Next.js server, which matches the route and runs the layout and page Server Components, awaiting their data. React renders them into an RSC payload and then into HTML, which is streamed to the browser in chunks as Suspense boundaries resolve. The browser paints the HTML immediately, so content is visible but not yet interactive. It then downloads the JavaScript for Client Components and hydrates them, attaching event handlers to the existing DOM. Later navigations fetch only the RSC payload, not full HTML.",
      a: [
        { svg: `<svg viewBox="0 0 700 360" width="700" class="dg">
  <text class="tx tx-b" x="90" y="20" text-anchor="middle">Browser</text>
  <text class="tx tx-b" x="350" y="20" text-anchor="middle">Proxy / CDN</text>
  <text class="tx tx-b" x="590" y="20" text-anchor="middle">Next.js server</text>
  <line class="ln-d" x1="90" y1="30" x2="90" y2="350"/>
  <line class="ln-d" x1="350" y1="30" x2="350" y2="350"/>
  <line class="ln-d" x1="590" y1="30" x2="590" y2="350"/>
  <line class="ln-a" x1="92" y1="50" x2="346" y2="50" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="220" y="44" text-anchor="middle">1. GET /products/42</text>
  <line class="ln-a" x1="352" y1="70" x2="586" y2="70" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="470" y="64" text-anchor="middle">2. cache miss / dynamic → forward</text>
  <rect class="box-p" x="480" y="84" width="215" height="64" rx="6"/>
  <text class="tx tx-b" x="587" y="102" text-anchor="middle" dominant-baseline="middle">3. match route, run layout +</text>
  <text class="tx tx-b" x="587" y="120" text-anchor="middle" dominant-baseline="middle">page Server Components</text>
  <text class="tx-s" x="587" y="138" text-anchor="middle" dominant-baseline="middle">await DB / fetch on the server</text>
  <rect class="box" x="480" y="156" width="215" height="40" rx="6"/>
  <text class="tx" x="587" y="176" text-anchor="middle" dominant-baseline="middle">4. RSC payload → HTML</text>
  <line class="ln-a" x1="586" y1="216" x2="94" y2="216" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="340" y="210" text-anchor="middle">5. stream HTML (shell first, Suspense chunks later) + RSC data</text>
  <rect class="box-w" x="10" y="230" width="200" height="40" rx="6"/>
  <text class="tx" x="110" y="250" text-anchor="middle" dominant-baseline="middle">6. paint: visible, not interactive</text>
  <line class="ln" x1="94" y1="292" x2="346" y2="292" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="220" y="286" text-anchor="middle">7. load client JS chunks (cached on CDN)</text>
  <rect class="box-g" x="10" y="306" width="200" height="40" rx="6"/>
  <text class="tx tx-b" x="110" y="326" text-anchor="middle" dominant-baseline="middle">8. hydrate → interactive</text>
</svg>`, caption: "SSR request flow in the App Router: render on the server, stream HTML, then hydrate Client Components" },
        { ol: [
          "<b>Request</b> hits the CDN/edge; <code>proxy.ts</code> (formerly middleware) may redirect, rewrite or set headers.",
          "If the route is static/cached, the CDN or Next's cache serves stored HTML. Otherwise the server renders.",
          "<b>Server render:</b> Next matches the URL to <code>app/products/[id]/page.js</code> and its parent layouts, then runs these Server Components. They can <code>await</code> database queries directly; secrets never leave the server.",
          "React produces the <b>RSC payload</b> (a compact description of the tree, with placeholders and references for Client Components) and renders it to <b>HTML</b>.",
          "<b>Streaming:</b> the shell (layouts, <code>loading.js</code> fallbacks) is flushed immediately; each <code>&lt;Suspense&gt;</code> boundary's HTML streams in as its data resolves.",
          "The browser paints the HTML (fast <b>FCP/LCP</b>, crawlable for SEO) — but buttons don't work yet.",
          "The browser downloads JS only for <b>Client Components</b> (Server Components ship zero JS).",
          "<b>Hydration:</b> React attaches event listeners and state to the existing DOM instead of recreating it. Selective hydration prioritises parts the user interacts with."
        ] },
        { code: `// Plain-Node model of the same idea: fetch data on the server, render HTML, embed data for hydration
const http = require("http");
const db = { products: [{ id: 1, name: "Keyboard", price: 1499 }, { id: 2, name: "Mouse", price: 599 }] };
const getProducts = async () => db.products;           // server-only data access (secrets stay here)
const ProductList = ({ products }) =>
  "<ul>" + products.map(p => "<li>" + p.name + " - Rs " + p.price + "</li>").join("") + "</ul>";

const server = http.createServer(async (req, res) => {
  const products = await getProducts();                // 1. data on the server
  const html = ProductList({ products });               // 2. render to HTML string
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<!doctype html><body><div id=\\"root\\">" + html + "</div>" +
          "<script>window.__DATA__=" + JSON.stringify({ products }) + "</script>" +
          "<script src=\\"/client.js\\"></script></body>");  // 3. HTML + data + JS to hydrate
});

server.listen(0, async () => {
  const res = await fetch("http://localhost:" + server.address().port + "/products");
  const body = await res.text();
  console.log(res.status, res.headers.get("content-type"));
  console.log(body.match(/<div id="root">.*?<\\/div>/)[0]);
  console.log("hydration data embedded:", body.includes("__DATA__"));
  server.close();
});
/*
200 text/html
<div id="root"><ul><li>Keyboard - Rs 1499</li><li>Mouse - Rs 599</li></ul></div>
hydration data embedded: true
*/`, lang: "javascript", title: "SSR in miniature (runs in plain Node)" },
        { p: "<b>Client-side navigation</b> (clicking a <code>&lt;Link&gt;</code>) does not reload the page: the router fetches only the RSC payload for the new segments (often already prefetched when the link entered the viewport), keeps shared layouts mounted with their state, and swaps in the new page." },
        { warn: "SSR does not make the page interactive faster — it makes it <i>visible</i> faster. Time to Interactive still depends on JS size and hydration, which is why reducing Client Components matters." },
        { tip: "Tie it back to networking if they push: DNS, TCP/TLS, then the request above (<a href=\"#/core/cn/what-happens-google\">see what happens when you type a URL</a>). And name the metrics: TTFB (server render time), FCP/LCP (streamed HTML), INP (hydration and JS cost)." }
      ]
    },
    {
      id: "app-router-vs-pages-router",
      q: "What is the difference between the App Router and the Pages Router?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "The Pages Router is the original model, introduced at launch: files in pages/ become routes, every component is a client component that is also server-rendered, and data comes from getServerSideProps, getStaticProps and getStaticPaths. The App Router, stable since Next.js 13.4, lives in app/ and is built on React Server Components: components are server-only by default, data is fetched with async/await inside components, and it adds nested layouts, streaming with loading.js, error.js boundaries and Server Actions. New projects should use the App Router; both are still supported.",
      a: [
        { table: { head: ["", "Pages Router (<code>pages/</code>)", "App Router (<code>app/</code>)"], rows: [
          ["Route file", "<code>pages/blog/[slug].js</code>", "<code>app/blog/[slug]/page.js</code> (folder = segment)"],
          ["Component model", "All client components (SSR'd, then hydrated)", "Server Components by default; <code>\"use client\"</code> opt-in"],
          ["Data fetching", "<code>getServerSideProps</code>, <code>getStaticProps</code>, <code>getStaticPaths</code>", "<code>async</code> components + <code>fetch</code>/DB, <code>generateStaticParams</code>"],
          ["Layouts", "Single <code>_app.js</code>, <code>_document.js</code>; per-page layout pattern by hand", "Nested <code>layout.js</code> that persist across navigation"],
          ["Loading / errors", "Manual", "<code>loading.js</code> (Suspense), <code>error.js</code>, <code>not-found.js</code>"],
          ["Mutations", "API routes + client fetch", "Server Actions (+ Route Handlers)"],
          ["API endpoints", "<code>pages/api/*.js</code> <code>(req, res)</code>", "<code>app/**/route.js</code> exporting <code>GET</code>/<code>POST</code> with Web Request/Response"],
          ["SEO", "<code>next/head</code>", "Metadata API (<code>metadata</code>, <code>generateMetadata</code>)"],
          ["Streaming", "No", "Yes, per Suspense boundary"],
          ["JS shipped", "Whole page tree", "Only Client Components"]
        ] } },
        { code: [
          { lang: "jsx", src: `// pages/posts/[id].js — Pages Router
export async function getServerSideProps({ params }) {
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) return { notFound: true };
  return { props: { post } };              // serialised to JSON, sent to client
}

export default function PostPage({ post }) {
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}` },
          { lang: "jsx", src: `// app/posts/[id]/page.js — App Router
import { notFound } from "next/navigation";

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });   // runs on server only
  if (!post) notFound();
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}` }
        ], title: "Same page, both routers" },
        { ul: [
          "Both routers can coexist in one project during incremental migration (a route must not exist in both).",
          "In the Pages Router, the whole component and its props are sent to the client; in the App Router, a Server Component's code and data never reach the browser unless you pass them to a Client Component.",
          "Navigation hooks differ: <code>next/router</code> (Pages) vs <code>next/navigation</code> (<code>useRouter</code>, <code>usePathname</code>, <code>useSearchParams</code>) in the App Router."
        ] },
        { tip: "If your resume project uses the Pages Router, say so honestly and show you know the App Router equivalents — interviewers mostly want to see you understand Server Components and the data-fetching shift." }
      ]
    },
    {
      id: "hydration-mismatch",
      q: "What is hydration, and what causes a hydration mismatch error?",
      topic: "Fundamentals",
      level: 2,
      top: true,
      short: "Hydration is React attaching event handlers and state to server-rendered HTML instead of rebuilding it. React expects the first client render to produce exactly the same markup as the server did. A mismatch happens when they differ, typically because of values that change between server and client like Date.now, Math.random or locale formatting, reading window or localStorage during render, invalid HTML nesting such as a div inside a p, or browser extensions editing the DOM. Fix it by making the first render deterministic and moving client-only values into useEffect.",
      a: [
        { p: "During hydration React walks the existing DOM alongside its own render output. If text or attributes differ, React 18/19 logs a hydration error with a diff and, for the affected boundary, throws away the server HTML and re-renders on the client — losing the SSR benefit and possibly flashing content." },
        { table: { head: ["Cause", "Example", "Fix"], rows: [
          ["Time / randomness", "<code>{new Date().toLocaleTimeString()}</code>, <code>Math.random()</code> ids", "Render on client after mount; <code>useId()</code> for ids"],
          ["Browser-only APIs in render", "<code>typeof window !== 'undefined' ? A : B</code>, <code>localStorage.getItem</code>", "Read in <code>useEffect</code> and set state"],
          ["Locale / timezone", "Server in UTC, user in IST formats dates differently", "Format with an explicit timezone, or on the client"],
          ["Invalid HTML nesting", "<code>&lt;p&gt;&lt;div/&gt;&lt;/p&gt;</code>, <code>&lt;a&gt;</code> inside <code>&lt;a&gt;</code>", "Fix markup; the browser's parser rewrites it"],
          ["Browser extensions", "Grammarly/translators inject attributes", "Usually harmless; test in incognito"],
          ["Different data", "Server and client fetch at different times", "Pass server data down as props"]
        ] } },
        { code: `"use client";
import { useEffect, useState } from "react";

// BAD: server renders "10:00:00", client renders "10:00:01" -> mismatch
export function ClockBad() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}

// GOOD: identical first render on both sides, real value after mount
export function Clock() {
  const [time, setTime] = useState(null);
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time ?? "--:--:--"}</span>;
}`, lang: "jsx", title: "Fixing a time-based mismatch" },
        { code: `// Skip SSR entirely for a browser-only widget (must be called from a Client Component)
"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <p>Loading map…</p> });

// For an unavoidable text difference on one element (e.g. a timestamp):
<time dateTime={iso} suppressHydrationWarning>{localTime}</time>   // one level deep only`, lang: "jsx", title: "Escape hatches" },
        { warn: "<code>if (typeof window !== 'undefined')</code> inside render is the most common <i>cause</i>, not a fix — it deliberately makes server and client output differ. Use an effect, or <code>dynamic(..., { ssr: false })</code>." },
        { tip: "Mention why hydration exists at all: it's cheaper than client-rendering from scratch and keeps the SSR'd DOM (no flash). Follow-ups: React 18 selective hydration, and Server Components which need no hydration at all." }
      ]
    },

    /* ───────────── Routing ───────────── */
    {
      id: "file-based-routing",
      q: "How does file-based routing work in the App Router (layouts, nested routes, dynamic segments, route groups)?",
      topic: "Routing",
      level: 1,
      top: true,
      short: "Folders inside app/ define URL segments and a page.js file makes a segment publicly routable. layout.js wraps a segment and all its children, persists across navigations without re-rendering, and layouts nest. Square-bracket folders are dynamic segments, such as [id], catch-all [...slug] or optional catch-all [[...slug]], and their values arrive in the params prop. Folders in parentheses are route groups that organise code or share a layout without affecting the URL, and folders starting with an underscore are private and never routed.",
      a: [
        { code: `app/
├── layout.js                 ← root layout (<html>, <body>) — required
├── page.js                   → /
├── (marketing)/              ← route group: not in URL
│   ├── layout.js             ← layout only for marketing pages
│   ├── about/page.js         → /about
│   └── pricing/page.js       → /pricing
├── (app)/
│   ├── layout.js             ← sidebar + auth check for the app area
│   └── dashboard/
│       ├── page.js           → /dashboard
│       ├── loading.js        ← Suspense fallback for this segment
│       └── settings/page.js  → /dashboard/settings
├── blog/
│   ├── page.js               → /blog
│   └── [slug]/page.js        → /blog/hello-world   params: { slug: "hello-world" }
├── docs/[...slug]/page.js    → /docs/a/b/c         params: { slug: ["a","b","c"] }
├── shop/[[...filters]]/page.js → /shop and /shop/men/shoes
├── api/health/route.js       → GET /api/health (Route Handler)
└── _components/Button.js     ← private folder: never a route`, lang: "text", title: "Folder structure → URLs" },
        { table: { head: ["Special file", "Role"], rows: [
          ["<code>page.js</code>", "UI for the route; makes the segment routable"],
          ["<code>layout.js</code>", "Shared UI wrapping children; keeps state across child navigations"],
          ["<code>template.js</code>", "Like layout but remounts on every navigation (enter animations, per-page effects)"],
          ["<code>loading.js</code>", "Wraps the page in <code>&lt;Suspense&gt;</code> with this fallback"],
          ["<code>error.js</code>", "Error boundary for the segment (must be a Client Component)"],
          ["<code>not-found.js</code>", "UI for <code>notFound()</code> / unmatched URLs"],
          ["<code>route.js</code>", "HTTP endpoint (can't coexist with <code>page.js</code> in the same folder)"],
          ["<code>default.js</code>", "Fallback for parallel route slots (required in Next 16)"]
        ] } },
        { code: `// app/(app)/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="grid">
      <Sidebar />              {/* stays mounted when moving between dashboard pages */}
      <main>{children}</main>
    </div>
  );
}

// app/blog/[slug]/page.js
export default async function BlogPost({ params, searchParams }) {
  const { slug } = await params;               // Next 15+: params is a Promise
  const { ref } = await searchParams;          // ?ref=twitter
  const post = await getPost(slug);
  return <Article post={post} source={ref} />;
}`, lang: "jsx", title: "Layout and dynamic segment" },
        { ul: [
          "Navigation: <code>&lt;Link href=\"/blog/x\"&gt;</code> (prefetches in production), or <code>useRouter().push()</code> from <code>next/navigation</code> in Client Components, or <code>redirect()</code> on the server.",
          "Advanced: <b>parallel routes</b> (<code>@analytics</code> slots rendered side by side in a layout) and <b>intercepting routes</b> (<code>(.)photo/[id]</code>) for modals that have their own URL.",
          "Pages Router equivalent: <code>pages/blog/[slug].js</code>, one global <code>_app.js</code> instead of nested layouts."
        ] },
        { warn: "Layouts don't re-render on navigation between their children, and a layout can't read the current page's <code>searchParams</code>. If something must change per page (active nav item), use <code>usePathname()</code> in a small Client Component inside the layout." },
        { tip: "Explain the <i>why</i>: colocating routes, loading and error UI per segment means each part of the page can load and fail independently — something you had to wire by hand in a React Router SPA." }
      ]
    },
    {
      id: "loading-error-not-found",
      q: "How do loading.js, error.js and not-found.js work in the App Router?",
      topic: "Routing",
      level: 2,
      top: false,
      short: "They are conventions that Next.js wraps around a route segment automatically. loading.js becomes the fallback of a Suspense boundary around the page, so it shows instantly while the page's data streams in. error.js becomes a React error boundary, must be a Client Component, receives the error and a reset function, and isolates failures to that segment. not-found.js renders when you call notFound() or no route matches. global-error.js catches errors in the root layout itself.",
      a: [
        { p: "For each segment Next.js nests the files roughly like this:" },
        { code: `<Layout>
  <ErrorBoundary fallback={<Error />}>        {/* error.js */}
    <Suspense fallback={<Loading />}>         {/* loading.js */}
      <ErrorBoundary fallback={<NotFound />}> {/* not-found.js */}
        <Page />
      </ErrorBoundary>
    </Suspense>
  </ErrorBoundary>
</Layout>`, lang: "jsx", title: "Implicit component hierarchy" },
        { code: [
          { lang: "jsx", src: `// app/dashboard/loading.js — shown instantly, replaced when page.js resolves
export default function Loading() {
  return <div className="skeleton-list" aria-busy="true" />;
}` },
          { lang: "jsx", src: `// app/dashboard/error.js — must be a Client Component
"use client";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => { reportError(error); }, [error]);
  return (
    <div role="alert">
      <h2>Couldn't load your dashboard.</h2>
      <button onClick={() => reset()}>Try again</button>   {/* re-render the segment */}
    </div>
  );
}` },
          { lang: "jsx", src: `// app/posts/[id]/page.js + not-found.js
import { notFound } from "next/navigation";

export default async function Post({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();                 // throws; renders nearest not-found.js with 404 status
  return <h1>{post.title}</h1>;
}

// app/posts/[id]/not-found.js
export default function NotFound() {
  return <p>That post doesn't exist.</p>;
}` }
        ], title: "The three files" },
        { ul: [
          "<code>error.js</code> does <b>not</b> catch errors in the <code>layout.js</code> of the same segment (the boundary sits inside the layout). Errors in a layout bubble to the parent segment's <code>error.js</code>; errors in the root layout need <code>app/global-error.js</code> (which must render its own <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code>).",
          "In production, error messages from Server Components are replaced with a generic message plus a <code>digest</code> to avoid leaking secrets; match the digest in server logs.",
          "For finer-grained loading states, put your own <code>&lt;Suspense&gt;</code> around slow components instead of (or in addition to) <code>loading.js</code>.",
          "<code>redirect()</code> and <code>notFound()</code> work by throwing special errors — don't wrap them in a try/catch that swallows them."
        ] },
        { warn: "Expected errors (validation failures, \"email taken\") should be <b>returned</b> as values from Server Actions and shown in the form, not thrown into <code>error.js</code>. Error boundaries are for unexpected failures." },
        { tip: "Link it to React: <code>loading.js</code> is Suspense and <code>error.js</code> is an error boundary — Next.js just places them for you per route segment." }
      ]
    },

    /* ───────────── Server & Client Components ───────────── */
    {
      id: "server-vs-client-components",
      q: "What are Server Components and Client Components, and when do you use each?",
      topic: "Server & Client Components",
      level: 1,
      top: true,
      short: "In the App Router every component is a React Server Component by default: it runs only on the server, at build or request time, can be async, can read databases and secrets directly, and sends no JavaScript to the browser. A Client Component is marked with the use client directive; it is still pre-rendered to HTML on the server but is then hydrated in the browser, so it can use state, effects, event handlers and browser APIs. Use Server Components for data and static UI, and Client Components only for the interactive leaves.",
      a: [
        { table: { head: ["Capability", "Server Component", "Client Component"], rows: [
          ["Fetch data with <code>async/await</code> in the component", "Yes", "No (use a library, <code>use()</code> or a Server Action)"],
          ["Access DB, file system, secrets, server-only env vars", "Yes", "No"],
          ["<code>useState</code>, <code>useEffect</code>, <code>useReducer</code>, custom hooks with state", "No", "Yes"],
          ["Event handlers (<code>onClick</code>, <code>onChange</code>)", "No", "Yes"],
          ["Browser APIs (<code>window</code>, <code>localStorage</code>, geolocation)", "No", "Yes (in effects/handlers)"],
          ["Context providers / consumers", "No", "Yes"],
          ["Adds to the JS bundle", "No", "Yes"],
          ["Rendered to HTML on the server", "Yes", "Yes (SSR), then hydrated"]
        ] } },
        { code: `// app/products/page.js — Server Component (default): data + static markup, 0 KB JS
import { db } from "@/lib/db";
import AddToCartButton from "./AddToCartButton";

export default async function ProductsPage() {
  const products = await db.product.findMany({ take: 20 });   // direct DB access
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>
          {p.name} — ₹{p.price}
          <AddToCartButton productId={p.id} />   {/* only this ships JS */}
        </li>
      ))}
    </ul>
  );
}

// app/products/AddToCartButton.js — Client Component: interactivity
"use client";
import { useState } from "react";

export default function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => { addToCart(productId); setAdded(true); }}>{added ? "Added" : "Add"}</button>;
}`, lang: "jsx", title: "Server page with a client leaf" },
        { h: "Benefits of Server Components" },
        { ul: [
          "<b>Smaller bundles:</b> heavy libraries used only for rendering (markdown parsers, date libraries, syntax highlighters) stay on the server.",
          "<b>No client–server waterfall:</b> data is fetched next to the database, in the same request as rendering.",
          "<b>Security:</b> tokens and queries never reach the browser.",
          "<b>Streaming:</b> async components plus Suspense stream naturally."
        ] },
        { warn: "\"Client Components render only in the browser\" is wrong. They are also server-rendered to HTML for the first load; \"client\" means their code is <i>also</i> shipped and hydrated. And Server Components are not the same thing as SSR: SSR is about producing HTML, RSC is about which components' code runs only on the server." },
        { tip: "Rule of thumb to state: \"Keep pages and layouts as Server Components; push <code>\"use client\"</code> down to the smallest interactive leaf (button, form, search box).\"" }
      ]
    },
    {
      id: "use-client-boundary",
      q: "What does \"use client\" actually do, and how do you compose Server and Client Components?",
      topic: "Server & Client Components",
      level: 2,
      top: true,
      short: "\"use client\" at the top of a file marks a boundary in the module graph: that module and everything it imports become part of the client bundle. It does not need to be on every client file, only at the entry points. A Server Component can render a Client Component and pass it serialisable props, but a Client Component cannot import a Server Component; it can, however, receive one as children or another JSX prop. Mark server-only modules with the server-only package so they can't leak into the client bundle.",
      a: [
        { p: "Think of the tree as server by default with <b>client islands</b>. The directive goes in the file at the top of each island; anything that file imports is pulled into the client bundle automatically." },
        { h: "Composition rules" },
        { ul: [
          "<b>Server → Client:</b> allowed. Props must be <b>serialisable</b>: strings, numbers, plain objects/arrays, Dates, Maps/Sets, Promises, JSX — <i>not</i> functions or class instances (except Server Actions, which can be passed).",
          "<b>Client imports Server:</b> not allowed — the imported component simply becomes a Client Component (and breaks if it uses server-only code).",
          "<b>Client receives Server as children:</b> allowed — the Server Component is rendered on the server first, and the Client Component just places the result."
        ] },
        { code: `// app/layout.js (Server)
import ThemeProvider from "./ThemeProvider";
import Sidebar from "./Sidebar";             // Server Component: fetches nav from DB

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>                      {/* client */}
          <Sidebar />                         {/* still a Server Component! passed as children */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// app/ThemeProvider.js
"use client";
import { createContext, useState } from "react";
export const ThemeContext = createContext("light");

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}`, lang: "jsx", title: "Context provider without turning the app into client code" },
        { code: `// lib/db.js
import "server-only";            // build error if a Client Component ever imports this
import { Pool } from "pg";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// The mirror package "client-only" protects modules that touch window/document.`, lang: "javascript", run: false, title: "Guarding server code" },
        { table: { head: ["Directive", "Meaning"], rows: [
          ["<code>\"use client\"</code>", "This module is an entry point into client code (hydrated, can use hooks)"],
          ["<code>\"use server\"</code>", "These exported async functions are <b>Server Actions</b>, callable from the client — not \"this is a Server Component\""],
          ["<code>\"use cache\"</code> (Next 16 Cache Components)", "Cache the output of this function/component/page"],
          ["<i>none</i>", "Server Component by default in <code>app/</code> (unless imported from a client module)"]
        ] } },
        { warn: "Putting <code>\"use client\"</code> at the top of a page or layout to silence an error opts the whole subtree out of Server Components — bigger bundles and no direct data access. Extract the interactive part into its own small file instead." },
        { tip: "Many third-party components (carousels, chart libraries) use hooks but lack the directive. Wrap them: a one-line file with <code>\"use client\"; export { default } from \"some-carousel\";</code>." }
      ]
    },

    /* ───────────── Data & Caching ───────────── */
    {
      id: "data-fetching-app-router",
      q: "How do you fetch data in the Next.js App Router?",
      topic: "Data & Caching",
      level: 2,
      top: true,
      short: "In the App Router you fetch in Server Components with async/await, either with fetch or by calling your database or ORM directly, so data arrives with the HTML and secrets stay on the server. Start independent requests in parallel with Promise.all, wrap slow parts in Suspense to stream them, and dedupe repeated calls within a request with React's cache. Client-side fetching with SWR or TanStack Query is still right for user-driven, real-time or frequently refreshing data, and mutations go through Server Actions.",
      a: [
        { code: `// app/users/[id]/page.js
import { Suspense } from "react";
import { getUser, getPosts, getFollowers } from "@/lib/data";

export default async function UserPage({ params }) {
  const { id } = await params;

  // Parallel: start both before awaiting either (avoids a waterfall)
  const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);

  return (
    <>
      <h1>{user.name}</h1>
      <PostList posts={posts} />
      <Suspense fallback={<p>Loading followers…</p>}>
        <Followers userId={id} />          {/* slow: streams in later */}
      </Suspense>
    </>
  );
}

async function Followers({ userId }) {
  const followers = await getFollowers(userId);
  return <p>{followers.length} followers</p>;
}`, lang: "jsx", title: "Parallel fetching + streaming" },
        { code: `// lib/data.js
import "server-only";
import { cache } from "react";
import { db } from "./db";

// cache(): same args within ONE request -> one DB call, even if layout, page and
// generateMetadata all call getUser(id)
export const getUser = cache(async id => {
  return db.user.findUnique({ where: { id } });
});

export async function getPosts(userId) {
  const res = await fetch("https://api.example.com/posts?user=" + userId, {
    next: { revalidate: 300, tags: ["posts"] },   // cache 5 min, invalidate by tag
  });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}`, lang: "javascript", run: false, title: "A data access layer" },
        { table: { head: ["Where", "How", "Use for"], rows: [
          ["Server Component", "<code>await fetch()</code> / ORM / SDK", "Default: page data, SEO content"],
          ["Server Action", "<code>\"use server\"</code> function", "Mutations (create/update/delete) from forms and buttons"],
          ["Route Handler", "<code>app/api/.../route.js</code>", "Public API, webhooks, mobile clients"],
          ["Client Component", "SWR / TanStack Query / <code>use(promise)</code>", "Infinite scroll, polling, live search, per-user widgets after load"]
        ] } },
        { warn: "Don't call your own Route Handler from a Server Component (<code>fetch('http://localhost:3000/api/users')</code>). It adds an HTTP hop and fails at build time when no server is running. Call the data function directly." },
        { warn: "Sequential awaits in a page (<code>const a = await getA(); const b = await getB();</code>) when B doesn't need A is the App Router's most common performance bug — it's a server-side waterfall." },
        { tip: "Pages Router answer for contrast: data was fetched in <code>getServerSideProps</code>/<code>getStaticProps</code> at the page level only and passed down as props; the App Router lets any component fetch what it needs." }
      ]
    },
    {
      id: "caching-revalidation",
      q: "How does caching and revalidation work in the App Router (fetch cache, revalidate, revalidatePath, revalidateTag)?",
      topic: "Data & Caching",
      level: 3,
      top: true,
      short: "Next.js can cache data and rendered output on the server and cache visited routes in the browser. Since Next.js 15, fetch requests are not cached by default; you opt in with cache force-cache or next revalidate, attach tags, or set a segment-level revalidate. You invalidate time-based by revalidate seconds, or on demand after a mutation with revalidatePath for a route or revalidateTag for everything with a tag. Next.js 16 adds opt-in Cache Components with the use cache directive, cacheLife and cacheTag, plus updateTag for read-your-writes inside Server Actions.",
      a: [
        { table: { head: ["Cache", "What", "Where", "Invalidated by"], rows: [
          ["Request memoisation", "Same <code>fetch</code>/<code>cache()</code> call in one render", "Server, per request", "End of request"],
          ["Data cache", "<code>fetch</code> results you opt in to cache, <code>\"use cache\"</code> results", "Server, persistent across requests/deploys", "<code>revalidate</code> time, <code>revalidateTag</code>, <code>revalidatePath</code>, <code>updateTag</code>"],
          ["Full route cache", "Prerendered HTML + RSC payload of static routes", "Server / CDN", "Revalidation or redeploy"],
          ["Router cache", "RSC payloads of visited/prefetched segments", "Browser memory", "<code>router.refresh()</code>, Server Action revalidation, reload"]
        ] } },
        { code: `// Opting in per request (Next 15/16 default is NOT cached)
await fetch(url);                                            // fresh each request
await fetch(url, { cache: "force-cache" });                  // cache indefinitely
await fetch(url, { next: { revalidate: 3600 } });            // ISR-style: at most hourly
await fetch(url, { next: { tags: ["products"] } });          // invalidate on demand

// Segment-level (whole route)
export const revalidate = 60;              // regenerate this route at most every 60 s
export const dynamic = "force-dynamic";    // always render per request`, lang: "javascript", run: false, title: "Time-based caching" },
        { code: `// app/admin/products/actions.js
"use server";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";

export async function updatePrice(id, price) {
  await requireAdmin();
  await db.product.update({ where: { id }, data: { price } });

  revalidatePath("/products/" + id);       // purge one route's cached output
  revalidateTag("products", "max");        // Next 16: mark tag stale, refresh in background (SWR)
  // updateTag("products");                // Next 16, Server Actions only: expire now and
                                           // show fresh data in this same response
}`, lang: "javascript", run: false, title: "On-demand revalidation after a mutation" },
        { code: `// Next 16 Cache Components (next.config.ts: { cacheComponents: true })
import { cacheLife, cacheTag } from "next/cache";

export async function getCategories() {
  "use cache";
  cacheLife("hours");                       // built-in profile: seconds/minutes/hours/days/weeks/max
  cacheTag("categories");
  return db.category.findMany();
}`, lang: "javascript", run: false, title: "\"use cache\" (Next.js 16)" },
        { h: "How defaults changed (a frequent follow-up)" },
        { ul: [
          "<b>Next 13–14:</b> <code>fetch</code> cached by default (<code>force-cache</code>), GET route handlers cached — surprising stale data was a top complaint.",
          "<b>Next 15:</b> <code>fetch</code> and GET route handlers <b>uncached by default</b>; the client router cache no longer reuses page segments by default. A route with no dynamic APIs can still be prerendered at build time.",
          "<b>Next 16:</b> Cache Components make caching explicit and opt-in with <code>\"use cache\"</code>; dynamic parts render at request time inside Suspense (Partial Prerendering). <code>revalidateTag(tag)</code> without a profile is deprecated."
        ] },
        { warn: "Using <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> or <code>connection()</code> makes a route dynamic. Reading cookies inside a cached function is an error — user-specific data must not be cached under a shared key, or one user may see another's data." },
        { tip: "Relate it to classic caching vocabulary: TTL (revalidate), cache tags for targeted invalidation, stale-while-revalidate — <a href=\"#/core/sd/caching-strategies\">see caching strategies</a> and <a href=\"#/core/sd/cache-invalidation-problems\">cache invalidation</a>." }
      ]
    },

    /* ───────────── Server Features ───────────── */
    {
      id: "server-actions",
      q: "What are Server Actions, and how do they compare with API routes?",
      topic: "Server Features",
      level: 2,
      top: true,
      short: "Server Actions are async functions marked with use server that run on the server but can be called from the client, typically as a form's action or from an event handler. Next.js turns each one into a POST endpoint with an encrypted id, so you write a mutation like a normal function without hand-writing an API route or fetch call. Forms work even before JavaScript loads, and actions integrate with revalidatePath, redirect, useActionState and useOptimistic. They are public endpoints, so every action must validate input and check authorisation.",
      a: [
        { code: `// app/todos/actions.js
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const TodoSchema = z.object({ title: z.string().trim().min(1).max(200) });

export async function createTodo(prevState, formData) {
  const session = await auth();                        // 1. authenticate EVERY action
  if (!session) return { error: "Please sign in" };

  const parsed = TodoSchema.safeParse({ title: formData.get("title") });  // 2. validate
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.todo.create({ data: { title: parsed.data.title, userId: session.user.id } });
  revalidatePath("/todos");                            // 3. refresh cached UI
  return { error: null };
}`, lang: "javascript", run: false, title: "A Server Action" },
        { code: `// app/todos/NewTodoForm.js
"use client";
import { useActionState } from "react";
import { createTodo } from "./actions";

export default function NewTodoForm() {
  const [state, formAction, isPending] = useActionState(createTodo, { error: null });
  return (
    <form action={formAction}>
      <input name="title" placeholder="What needs doing?" />
      <button disabled={isPending}>{isPending ? "Adding…" : "Add"}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
// A Server Component could also use <form action={someAction}> directly,
// which works with JavaScript disabled (progressive enhancement).`, lang: "jsx", title: "Calling it from a form" },
        { table: { head: ["", "Server Action", "Route Handler / API route"], rows: [
          ["Defined as", "<code>\"use server\"</code> async function", "<code>export async function POST(req)</code> in <code>route.js</code>"],
          ["Called by", "Your own React components (form action, handler, <code>startTransition</code>)", "Anyone over HTTP: browser, mobile app, webhook, cron"],
          ["HTTP method", "Always POST, URL managed by Next", "Any method, URL you choose"],
          ["Typing / boilerplate", "Function call with typed args; no fetch, no JSON parsing", "Manual request parsing and response building"],
          ["Integrations", "<code>revalidatePath</code>, <code>redirect</code>, progressive forms, optimistic UI", "Caching headers, streaming, CORS"],
          ["Best for", "Mutations from your own UI", "Public APIs, webhooks, third-party consumers, GET endpoints"]
        ] } },
        { warn: "A Server Action is a <b>public HTTP endpoint</b> even if no button calls it. Never trust that the UI hid it: check the session and ownership (<code>todo.userId === session.user.id</code>) inside the action, validate all arguments, and don't return sensitive data. Default request body limit is 1 MB (<code>serverActions.bodySizeLimit</code>)." },
        { ul: [
          "Actions are queued and run one at a time per client; they're for mutations, not for data fetching (use Server Components for reads).",
          "Arguments and return values must be serialisable.",
          "Built-in protections: POST only, origin check against the host header (CSRF mitigation), encrypted unguessable action ids, and unused actions removed from the build."
        ] },
        { tip: "Interviewers like the progressive-enhancement point: a <code>&lt;form action={serverAction}&gt;</code> rendered by a Server Component submits as a normal HTML form before hydration and upgrades to a no-reload submission once JS loads." }
      ]
    },
    {
      id: "route-handlers",
      q: "What are Route Handlers in Next.js, and how do you build an API endpoint?",
      topic: "Server Features",
      level: 1,
      top: true,
      short: "Route Handlers are the App Router's API routes: a route.js file inside app/ that exports functions named after HTTP methods such as GET, POST, PUT, PATCH and DELETE. They use the standard Web Request and Response APIs, with NextRequest and NextResponse helpers, and receive dynamic params as a promise. Use them for public APIs, webhooks, mobile clients, file downloads or streaming responses. In the Pages Router the equivalent is pages/api with a req and res handler.",
      a: [
        { code: `// app/api/products/route.js  ->  /api/products
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const products = await db.product.findMany({ skip: (page - 1) * 20, take: 20 });
  return NextResponse.json({ page, products });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "name and numeric price required" }, { status: 400 });
  }
  const product = await db.product.create({ data: body });
  return NextResponse.json(product, { status: 201 });
}`, lang: "javascript", run: false, title: "Collection endpoint" },
        { code: `// app/api/products/[id]/route.js  ->  /api/products/42
export async function GET(request, { params }) {
  const { id } = await params;                        // Promise in Next 15+
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(product, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.product.delete({ where: { id } });
  return new Response(null, { status: 204 });
}`, lang: "javascript", run: false, title: "Dynamic segment + caching header" },
        { code: `// app/api/webhooks/stripe/route.js — raw body needed for signature verification
export async function POST(request) {
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature");
  const event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET);
  if (event.type === "checkout.session.completed") await markOrderPaid(event.data.object);
  return new Response("ok");
}`, lang: "javascript", run: false, title: "Webhook receiver" },
        { ul: [
          "A folder can have <code>route.js</code> <b>or</b> <code>page.js</code>, not both.",
          "Unsupported methods automatically return <b>405 Method Not Allowed</b>.",
          "Since Next 15, <code>GET</code> handlers are not cached by default; opt in with <code>export const dynamic = \"force-static\"</code>.",
          "Use proper REST semantics — status codes, idempotent PUT/DELETE (<a href=\"#/core/cn/rest-api\">see REST API</a>, <a href=\"#/core/cn/http-status-codes\">status codes</a>)."
        ] },
        { tip: "When asked \"Route Handler or Server Action?\": Server Action for mutations triggered by your own Next.js UI; Route Handler when something other than your React components calls it — a mobile app, a webhook, a cron job, or a GET you want to cache at the CDN." }
      ]
    },
    {
      id: "middleware-proxy",
      q: "What is middleware in Next.js (proxy.ts in Next 16), and what is it used for?",
      topic: "Server Features",
      level: 2,
      top: false,
      short: "Middleware is code that runs before a request is matched to a route or served from cache, so it can redirect, rewrite, set headers or cookies, or return a response early. Typical uses are auth redirects, locale detection, A/B testing, bot filtering and adding security headers. A matcher config limits which paths it runs on. In Next.js 16 the file is renamed from middleware.ts to proxy.ts and runs on the Node.js runtime; middleware.ts still works for the Edge runtime but is deprecated. It should stay fast and should not be your only authorisation check.",
      a: [
        { code: `// proxy.ts (Next 16) — previously middleware.ts with "export function middleware"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  // 1. Optimistic auth redirect (just checks the cookie exists)
  if (pathname.startsWith("/dashboard") && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Rewrite: serve /in/pricing content for Indian visitors without changing the URL
  if (pathname === "/pricing" && request.headers.get("x-country") === "IN") {
    return NextResponse.rewrite(new URL("/in/pricing", request.url));
  }

  // 3. Continue, adding a header
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],  // skip assets
};`, lang: "typescript", title: "proxy.ts: redirect, rewrite, headers" },
        { table: { head: ["Action", "Effect"], rows: [
          ["<code>NextResponse.next()</code>", "Continue to the route (optionally with modified headers/cookies)"],
          ["<code>NextResponse.redirect(url)</code>", "3xx; browser URL changes"],
          ["<code>NextResponse.rewrite(url)</code>", "Serve another path; browser URL stays the same (reverse-proxy style)"],
          ["<code>new Response(...)</code> / <code>NextResponse.json()</code>", "Respond directly (e.g. 401, rate-limit 429)"]
        ] } },
        { ul: [
          "Runs on <b>every matched request</b>, including prefetches — keep it light: no slow DB queries; read a cookie, check a JWT signature, look up a flag.",
          "One file per project (root or <code>src/</code>); branch inside it by path.",
          "Good for: auth redirects, i18n routing, A/B buckets via cookie, geo rewrites, maintenance mode, security headers, simple rate limiting (<a href=\"#/core/sd/rate-limiting-algorithms\">see rate limiting</a>)."
        ] },
        { warn: "Don't rely on middleware alone for authorisation. CVE-2025-29927 (March 2025) let attackers skip middleware entirely on self-hosted Next.js by sending a crafted <code>x-middleware-subrequest</code> header (fixed in 15.2.3 and backports). Re-check the session where data is read or mutated: in Server Components, Server Actions and Route Handlers." },
        { tip: "Conceptually it's a reverse proxy sitting in front of your routes — which is exactly why Next 16 renamed it <code>proxy</code> (<a href=\"#/core/cn/proxy-vs-reverse-proxy\">see proxy vs reverse proxy</a>)." }
      ]
    },
    {
      id: "authentication-patterns",
      q: "How do you implement authentication in a Next.js App Router application?",
      topic: "Server Features",
      level: 2,
      top: true,
      short: "Store the session in an httpOnly, secure, SameSite cookie, either a signed or encrypted JWT for stateless sessions or an opaque id pointing to a database session. Use a library such as Auth.js, Clerk, Better Auth or Supabase Auth rather than rolling your own. Do a cheap optimistic check in proxy or middleware to redirect logged-out users, but enforce authorisation close to the data: in a data access layer used by Server Components, and inside every Server Action and Route Handler. Never keep tokens in localStorage.",
      a: [
        { svg: `<svg viewBox="0 0 680 210" width="680" class="dg">
  <rect class="box-a" x="10" y="80" width="110" height="50" rx="8"/>
  <text class="tx tx-b" x="65" y="98" text-anchor="middle" dominant-baseline="middle">Browser</text>
  <text class="tx-s" x="65" y="116" text-anchor="middle" dominant-baseline="middle">httpOnly cookie</text>
  <rect class="box-w" x="160" y="80" width="130" height="50" rx="8"/>
  <text class="tx tx-b" x="225" y="98" text-anchor="middle" dominant-baseline="middle">proxy.ts</text>
  <text class="tx-s" x="225" y="116" text-anchor="middle" dominant-baseline="middle">optimistic: cookie?</text>
  <rect class="box" x="330" y="20" width="160" height="44" rx="8"/>
  <text class="tx" x="410" y="42" text-anchor="middle" dominant-baseline="middle">Server Component</text>
  <rect class="box" x="330" y="83" width="160" height="44" rx="8"/>
  <text class="tx" x="410" y="105" text-anchor="middle" dominant-baseline="middle">Server Action</text>
  <rect class="box" x="330" y="146" width="160" height="44" rx="8"/>
  <text class="tx" x="410" y="168" text-anchor="middle" dominant-baseline="middle">Route Handler</text>
  <rect class="box-g" x="530" y="70" width="140" height="70" rx="8"/>
  <text class="tx tx-b" x="600" y="92" text-anchor="middle" dominant-baseline="middle">Data Access Layer</text>
  <text class="tx-s" x="600" y="112" text-anchor="middle" dominant-baseline="middle">verifySession()</text>
  <text class="tx-s" x="600" y="128" text-anchor="middle" dominant-baseline="middle">+ ownership checks</text>
  <line class="ln-a" x1="120" y1="105" x2="156" y2="105" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="290" y1="100" x2="326" y2="45" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="290" y1="105" x2="326" y2="105" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="290" y1="110" x2="326" y2="165" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="490" y1="42" x2="526" y2="90" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="490" y1="105" x2="526" y2="105" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="490" y1="168" x2="526" y2="122" marker-end="url(#dg-arr-a)"/>
</svg>`, caption: "Defence in depth: a cheap redirect at the edge, the real check next to the data" },
        { code: `// lib/dal.js — Data Access Layer
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";             // e.g. jose jwtVerify

export const verifySession = cache(async () => {
  const token = (await cookies()).get("session")?.value;
  const session = token ? await decrypt(token) : null;
  if (!session?.userId) redirect("/login");
  return { userId: session.userId, role: session.role };
});

export async function getInvoice(id) {
  const { userId } = await verifySession();
  const invoice = await db.invoice.findUnique({ where: { id } });
  if (invoice?.ownerId !== userId) return null;  // authorisation, not just authentication
  return { id: invoice.id, amount: invoice.amount };   // DTO: return only safe fields
}`, lang: "javascript", run: false, title: "Verify where the data is read" },
        { code: `// Setting the cookie after login (inside a Server Action)
"use server";
import { cookies } from "next/headers";

export async function login(prevState, formData) {
  const user = await checkPassword(formData.get("email"), formData.get("password")); // bcrypt/argon2
  if (!user) return { error: "Invalid email or password" };
  const token = await encrypt({ userId: user.id, role: user.role }, "7d");
  (await cookies()).set("session", token, {
    httpOnly: true,        // JS can't read it -> XSS can't steal it
    secure: true,          // HTTPS only
    sameSite: "lax",       // CSRF mitigation
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/dashboard");
}`, lang: "javascript", run: false, title: "Session cookie" },
        { table: { head: ["Option", "Pros", "Cons"], rows: [
          ["Stateless JWT in cookie", "No DB lookup per request; works at the edge", "Hard to revoke before expiry; keep it short-lived + small"],
          ["Database session (opaque id)", "Instant revocation, \"log out all devices\"", "DB/Redis lookup per request"],
          ["Auth.js (NextAuth v5)", "OAuth providers, adapters, <code>auth()</code> helper everywhere", "Configuration learning curve"],
          ["Hosted (Clerk, Auth0, Supabase)", "Fast setup, MFA, user management UI", "Cost, vendor lock-in"]
        ] } },
        { warn: "Checking auth only in a layout is not enough: layouts don't re-render on client navigation, and Server Actions or Route Handlers bypass layouts entirely. Put the check in the data layer and in every action/handler." },
        { tip: "Know the theory behind it — cookies vs tokens, httpOnly, SameSite, CSRF: <a href=\"#/core/cn/cookies-sessions-tokens\">see cookies, sessions and tokens</a>." }
      ]
    },

    /* ───────────── Production ───────────── */
    {
      id: "image-font-optimisation",
      q: "How does next/image optimise images, and what does next/font do?",
      topic: "Production",
      level: 1,
      top: true,
      short: "next/image resizes and converts images on demand to modern formats like WebP, serves a responsive srcset so each device downloads an appropriately sized file, lazy-loads below-the-fold images, and requires width and height or fill so space is reserved and layout shift is avoided. The hero image should be marked preload, called priority before Next 16, to help LCP. next/font downloads Google or local fonts at build time and self-hosts them with the app, so there is no request to Google at runtime, and it generates a size-adjusted fallback font to prevent layout shift.",
      a: [
        { code: `import Image from "next/image";
import hero from "./hero.jpg";                      // static import: width/height/blur known at build

export default function Home({ product }) {
  return (
    <>
      <Image src={hero} alt="Students preparing for placements" placeholder="blur" preload />

      {/* Remote image: dimensions required, domain must be allowed in next.config */}
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={400}
        sizes="(max-width: 768px) 50vw, 400px"      // helps pick the right srcset entry
      />

      {/* Unknown size: fill the positioned parent */}
      <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
        <Image src={product.banner} alt="" fill style={{ objectFit: "cover" }} sizes="100vw" />
      </div>
    </>
  );
}`, lang: "jsx", title: "next/image patterns" },
        { code: `// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.example.com", pathname: "/products/**" }],
    formats: ["image/avif", "image/webp"],   // default is ["image/webp"]
  },
};
export default nextConfig;`, lang: "typescript", title: "Allow-listing remote images" },
        { table: { head: ["Problem", "What next/image does"], rows: [
          ["Huge originals sent to phones", "Generates multiple widths; browser picks from <code>srcset</code>/<code>sizes</code>"],
          ["Old formats (JPEG/PNG)", "Converts to WebP/AVIF based on the <code>Accept</code> header"],
          ["Layout shift (CLS)", "Requires dimensions or <code>fill</code>; reserves space"],
          ["Offscreen images slow first load", "Native lazy loading by default"],
          ["Slow LCP hero image", "<code>preload</code> (Next 16; <code>priority</code> earlier) adds a preload hint and disables lazy loading"],
          ["Repeated processing", "Optimised images cached on the server (default min TTL 4 hours in Next 16)"]
        ] } },
        { code: `// app/layout.js
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable + " " + mono.variable}>
      <body>{children}</body>
    </html>
  );
}`, lang: "jsx", title: "next/font: self-hosted, no layout shift" },
        { ul: [
          "Fonts are downloaded at <b>build time</b> and served from your own domain: no extra DNS/TLS to Google, better privacy (GDPR), cacheable with your assets.",
          "Automatic <code>size-adjust</code> on a fallback system font makes the swap from fallback to web font nearly invisible (low CLS).",
          "<code>next/script</code> with <code>strategy=\"afterInteractive\" | \"lazyOnload\"</code> handles third-party scripts (analytics, chat widgets) so they don't block rendering."
        ] },
        { warn: "Self-hosting caveat: image optimisation runs on your server and uses CPU and memory (via <code>sharp</code>). On static export (<code>output: \"export\"</code>) the default loader doesn't work — use <code>unoptimized</code> or a custom loader (Cloudinary, imgix)." },
        { tip: "Tie it to Core Web Vitals: <code>next/image</code> improves LCP and CLS; <code>next/font</code> improves CLS; <code>next/script</code> and fewer Client Components improve INP." }
      ]
    },
    {
      id: "seo-metadata-api",
      q: "How do you handle SEO and metadata in Next.js?",
      topic: "Production",
      level: 1,
      top: false,
      short: "Server rendering already gives crawlers real HTML. On top of that the App Router's Metadata API sets head tags: export a static metadata object from a layout or page, or an async generateMetadata function when tags depend on data like a product name. Layout metadata merges with page metadata, and title templates add a site suffix. Special files generate sitemap.xml, robots.txt and Open Graph images. Metadata is only supported in Server Components; the Pages Router uses next/head instead.",
      a: [
        { code: `// app/layout.js — site-wide defaults
export const metadata = {
  metadataBase: new URL("https://prep.example.com"),
  title: { default: "Placement Prep", template: "%s | Placement Prep" },
  description: "DSA, core subjects and tech-stack interview questions.",
  openGraph: { type: "website", siteName: "Placement Prep" },
  robots: { index: true, follow: true },
};

// app/questions/[slug]/page.js — data-driven metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const q = await getQuestion(slug);          // wrap in React cache() — page calls it too
  if (!q) return { title: "Not found" };
  return {
    title: q.title,                           // -> "Two Sum | Placement Prep"
    description: q.summary,
    alternates: { canonical: "/questions/" + slug },
    openGraph: { title: q.title, description: q.summary, images: ["/og/" + slug + ".png"] },
  };
}`, lang: "jsx", title: "Static and dynamic metadata" },
        { code: `// app/sitemap.js -> /sitemap.xml
export default async function sitemap() {
  const questions = await getAllQuestionSlugs();
  return [
    { url: "https://prep.example.com", lastModified: new Date(), priority: 1 },
    ...questions.map(s => ({ url: "https://prep.example.com/questions/" + s, changeFrequency: "monthly" })),
  ];
}

// app/robots.js -> /robots.txt
export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: "/dashboard/" },
           sitemap: "https://prep.example.com/sitemap.xml" };
}`, lang: "javascript", run: false, title: "sitemap.xml and robots.txt as code" },
        { table: { head: ["SEO concern", "Next.js tool"], rows: [
          ["Crawlable content", "SSR / SSG / Server Components (HTML, not an empty div)"],
          ["Title, description, canonical", "<code>metadata</code> / <code>generateMetadata</code>"],
          ["Social previews", "<code>openGraph</code>, <code>twitter</code> fields; <code>opengraph-image.js</code> generates images"],
          ["Sitemap & robots", "<code>sitemap.js</code>, <code>robots.js</code>"],
          ["Structured data", "Render a <code>&lt;script type=\"application/ld+json\"&gt;</code> in the page"],
          ["Speed (ranking signal)", "<code>next/image</code>, <code>next/font</code>, streaming, small bundles"],
          ["404s", "<code>notFound()</code> returns a real 404 status"]
        ] } },
        { warn: "A page that fetches its content client-side in <code>useEffect</code> ships empty HTML; Google can render JS but later and less reliably, and many social-preview bots don't run JS at all. Fetch SEO-relevant content on the server." },
        { tip: "Mention that <code>generateMetadata</code> and the page component can share one fetched result via React <code>cache()</code> (or fetch memoisation), so the data isn't loaded twice." }
      ]
    },
    {
      id: "environment-variables",
      q: "How do environment variables work in Next.js, and what does the NEXT_PUBLIC_ prefix mean?",
      topic: "Production",
      level: 1,
      top: true,
      short: "Next.js loads variables from .env files such as .env, .env.local, .env.development and .env.production into process.env. By default they are available only on the server, in Server Components, Route Handlers, Server Actions and proxy. Variables prefixed with NEXT_PUBLIC_ are inlined into the client JavaScript bundle at build time, so they are visible to anyone and changing them requires a rebuild. Secrets like database URLs and API keys must never have the prefix.",
      a: [
        { code: `# .env              (committed: safe defaults)
NEXT_PUBLIC_APP_NAME=Placement Prep

# .env.local        (git-ignored: secrets for your machine)
DATABASE_URL=postgres://user:pass@localhost:5432/prep
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_API_BASE=http://localhost:3000`, lang: "bash", title: ".env files" },
        { code: `// Server Component / Route Handler / Server Action — any variable works
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// app/Footer.js (separate file) — Client Component: only NEXT_PUBLIC_* is available,
// replaced by a literal string at build time
"use client";
export function Footer() {
  return <p>{process.env.NEXT_PUBLIC_APP_NAME}</p>;   // becomes <p>{"Placement Prep"}</p>
}

// NOT inlined: dynamic lookups are left as-is and are undefined in the browser
const key = "NEXT_PUBLIC_APP_NAME";
process.env[key];                     // undefined on the client
const { NEXT_PUBLIC_APP_NAME } = process.env;   // also not inlined`, lang: "jsx", title: "Server vs client access" },
        { table: { head: ["File", "Loaded when", "Commit?"], rows: [
          ["<code>.env</code>", "Always", "Yes (no secrets)"],
          ["<code>.env.development</code> / <code>.env.production</code>", "<code>next dev</code> / <code>next build</code> + <code>start</code>", "Yes (no secrets)"],
          ["<code>.env.local</code>", "Always except tests; overrides the above", "No"],
          ["<code>.env.production.local</code> etc.", "Matching environment; highest file priority", "No"],
          ["Real environment (<code>process.env</code> set by host)", "Always; wins over all files", "Set in Vercel/Docker/CI"]
        ] } },
        { ul: [
          "Because <code>NEXT_PUBLIC_</code> values are baked in at <b>build time</b>, one Docker image can't be promoted from staging to production with different public values unless you read them at runtime on the server and pass them down as props.",
          "Server-only variables are read at runtime on the server (for dynamic rendering), so they can differ per environment without rebuilding.",
          "Validate env vars at startup (e.g. a Zod schema in <code>env.js</code>) so a missing secret fails the build, not a user request.",
          "Next 16 removed <code>serverRuntimeConfig</code>/<code>publicRuntimeConfig</code>: environment variables are the only mechanism."
        ] },
        { warn: "Prefixing a secret with <code>NEXT_PUBLIC_</code> to \"make it work\" in a Client Component publishes it to every visitor — it's visible in the JS bundle in DevTools. Move the call to a Server Action or Route Handler instead." },
        { tip: "Also mention <code>import \"server-only\"</code> in modules that read secrets, so an accidental client import fails at build time." }
      ]
    },
    {
      id: "deployment-runtimes",
      q: "How do you deploy a Next.js app, and how do Vercel vs self-hosting and the Edge vs Node.js runtimes compare?",
      topic: "Production",
      level: 2,
      top: false,
      short: "Vercel, made by the Next.js team, deploys with zero configuration and maps features like ISR, image optimisation, streaming and edge functions onto its serverless and CDN infrastructure. Self-hosting with next build and next start on a Node server or in Docker with standalone output supports every feature too, but you own scaling, the shared cache across instances and CDN setup. A static export works on any static host but drops server features. The Node.js runtime is the default with full Node APIs; the Edge runtime uses a limited Web-API sandbox for low latency near users.",
      a: [
        { table: { head: ["Option", "How", "Supports", "Trade-offs"], rows: [
          ["Vercel / Netlify etc.", "Git push → build → deploy", "Everything, preview deploys per PR", "Easiest; cost at scale, platform coupling"],
          ["Node server", "<code>next build &amp;&amp; next start</code> behind Nginx", "Everything", "You handle scaling, TLS, CDN, process manager"],
          ["Docker", "<code>output: \"standalone\"</code> → small image with only needed files", "Everything", "Multi-instance needs a shared cache handler (e.g. Redis) for ISR consistency"],
          ["Static export", "<code>output: \"export\"</code> → plain HTML/JS in <code>out/</code>", "SSG + client features only", "No SSR, ISR, Server Actions, Route Handlers with dynamic data, default image optimiser, proxy"]
        ] } },
        { code: `# Dockerfile — multi-stage, standalone output
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build                       # next.config: output: "standalone"

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`, lang: "dockerfile", title: "Self-hosting in Docker" },
        { table: { head: ["", "Node.js runtime (default)", "Edge runtime"], rows: [
          ["APIs", "Full Node: <code>fs</code>, <code>net</code>, native modules, any npm package", "Web standard APIs only (fetch, Request, Response, crypto.subtle, streams)"],
          ["Where it runs", "Your server / serverless region", "Lightweight isolates, often close to the user"],
          ["Cold start", "Slower", "Very fast"],
          ["Limits", "Generous memory/time", "Small code size, no TCP DB drivers (use HTTP-based DB clients)"],
          ["Use for", "Most pages, DB access with ORMs, heavy logic", "Simple, latency-sensitive logic: redirects, geo, A/B, auth token checks"],
          ["Opt in", "Default", "<code>export const runtime = \"edge\"</code> in a route/page"]
        ] } },
        { ul: [
          "Next 16: <code>proxy.ts</code> runs on Node.js; the Edge-runtime <code>middleware.ts</code> is deprecated.",
          "Put static assets (<code>/_next/static</code>, <code>public</code>) behind a CDN with long cache headers — they're content-hashed (<a href=\"#/core/cn/cdn\">see CDN</a>).",
          "CI: lint, type-check, test, <code>next build</code>, then deploy; preview environments per pull request (<a href=\"#/core/se/ci-cd-pipeline\">see CI/CD</a>)."
        ] },
        { warn: "Running several self-hosted instances behind a load balancer without a shared cache means each instance has its own ISR cache and revalidation only hits one of them — users see different versions. Configure a custom <code>cacheHandler</code>." },
        { tip: "Good honest answer: \"For a student project, Vercel's free tier. In a company with existing Kubernetes, standalone Docker image behind a CDN.\" Then mention what you'd need to handle yourself." }
      ]
    },
    {
      id: "streaming-suspense-performance",
      q: "How do streaming and Suspense improve performance in Next.js, and what else do you do to make a Next.js app fast?",
      topic: "Production",
      level: 2,
      top: false,
      short: "Without streaming, a server-rendered page can't send any HTML until its slowest query finishes. With streaming, Next.js sends the layout and fallbacks immediately and streams each Suspense boundary's HTML as its data resolves, so time to first byte and first paint no longer depend on the slowest part. loading.js gives this per route. Beyond streaming: keep most components on the server to cut JavaScript, fetch in parallel, cache data that isn't user-specific, use next/image and next/font, dynamically import heavy client widgets, and measure Core Web Vitals.",
      a: [
        { svg: `<svg viewBox="0 0 680 190" width="680" class="dg">
  <text class="tx tx-b" x="10" y="22">Without streaming</text>
  <rect class="box-r" x="150" y="8" width="380" height="24" rx="4"/>
  <text class="tx-s" x="340" y="20" text-anchor="middle" dominant-baseline="middle">wait for ALL data (user 50 ms, feed 300 ms, recs 1200 ms)</text>
  <rect class="box-g" x="530" y="8" width="140" height="24" rx="4"/>
  <text class="tx-s" x="600" y="20" text-anchor="middle" dominant-baseline="middle">whole page at 1.2 s</text>
  <text class="tx tx-b" x="10" y="78">With streaming</text>
  <rect class="box-g" x="150" y="64" width="60" height="24" rx="4"/>
  <text class="tx-s" x="180" y="76" text-anchor="middle" dominant-baseline="middle">shell</text>
  <rect class="box-g" x="210" y="98" width="100" height="24" rx="4"/>
  <text class="tx-s" x="260" y="110" text-anchor="middle" dominant-baseline="middle">feed chunk</text>
  <rect class="box-g" x="530" y="132" width="140" height="24" rx="4"/>
  <text class="tx-s" x="600" y="144" text-anchor="middle" dominant-baseline="middle">recs chunk</text>
  <rect class="box-w" x="210" y="132" width="320" height="24" rx="4"/>
  <text class="tx-s" x="370" y="144" text-anchor="middle" dominant-baseline="middle">skeleton visible meanwhile</text>
  <line class="ln-d" x1="150" y1="172" x2="670" y2="172"/>
  <text class="tx-s" x="150" y="186">0 ms</text>
  <text class="tx-s" x="640" y="186">1.2 s</text>
</svg>`, caption: "Streaming flushes the shell immediately and each Suspense boundary as soon as its data is ready" },
        { code: `// app/page.js
import { Suspense } from "react";

export default async function Home() {
  const user = await getUser();                     // fast, needed for the shell
  return (
    <>
      <Header user={user} />
      <Suspense fallback={<FeedSkeleton />}>
        <Feed userId={user.id} />                   {/* 300 ms */}
      </Suspense>
      <Suspense fallback={<RecsSkeleton />}>
        <Recommendations userId={user.id} />        {/* 1.2 s ML service — doesn't block the rest */}
      </Suspense>
    </>
  );
}`, lang: "jsx", title: "Independent Suspense boundaries" },
        { p: "Under the hood the response uses chunked transfer encoding: the first chunk contains the shell with fallback placeholders; later chunks contain the resolved HTML plus a tiny inline script that swaps it into place. Hydration can also begin per boundary (selective hydration)." },
        { h: "Performance checklist" },
        { table: { head: ["Area", "Action"], rows: [
          ["JavaScript size", "Server Components by default; <code>\"use client\"</code> only on leaves; <code>next/dynamic</code> for heavy widgets (editors, charts, maps)"],
          ["Data", "Parallel fetching, <code>cache()</code> dedupe, cache non-personal data (<code>revalidate</code> / <code>\"use cache\"</code>)"],
          ["Rendering mode", "Static/ISR where possible; Partial Prerendering (Cache Components) for static shell + dynamic holes"],
          ["Assets", "<code>next/image</code>, <code>next/font</code>, <code>next/script</code> with lazy strategies"],
          ["Navigation", "<code>&lt;Link&gt;</code> prefetching; keep layouts stable so they aren't re-rendered"],
          ["Build", "Turbopack (default in Next 16), React Compiler (<code>reactCompiler: true</code>) for auto-memoisation"],
          ["Measure", "Lighthouse, Vercel Speed Insights / <code>useReportWebVitals</code>, <code>@next/bundle-analyzer</code>"]
        ] } },
        { warn: "Once streaming starts the HTTP status (200) and headers are already sent. That's why <code>notFound()</code>/<code>redirect()</code> inside a streamed boundary can't change the status code — do those checks before the first Suspense boundary, in the page or layout." },
        { tip: "Wrap up with metrics: streaming improves TTFB and FCP, smaller client JS improves INP, images and fonts improve LCP and CLS. Naming the metric you'd move shows you think about performance concretely." }
      ]
    }
  ]
});
