/* tech stack: Docker — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "docker",
  title: "Docker",
  short: "Docker",
  icon: "▣",
  blurb: "With Docker on your resume, expect to write a clean Dockerfile on the spot, explain layers and build caching, CMD vs ENTRYPOINT, volumes and container networking, wire up a multi-service app with Compose, and describe what a container really is (namespaces, cgroups, union filesystem). Strong candidates also talk about image size, secrets, health checks and security.",
  topics: ["Fundamentals", "Images & Dockerfile", "Storage & Networking", "Compose & Operations", "Internals & Security"],
  questions: [

    /* ───────────── Fundamentals ───────────── */
    {
      id: "containers-vs-vms",
      q: "What is the difference between a container and a virtual machine?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "A virtual machine runs a full guest operating system with its own kernel on a hypervisor, so it is heavy (GBs, boots in tens of seconds) but strongly isolated. A container is just an isolated process on the host: it shares the host's Linux kernel and gets its own view of processes, network and filesystem through namespaces, with resource limits from cgroups. Containers are MBs and start in milliseconds, at the cost of weaker isolation and needing a compatible kernel.",
      a: [
        { svg: `<svg viewBox="0 0 640 260" width="640" class="dg">
  <text class="tx tx-b" x="155" y="18" text-anchor="middle">Virtual machines</text>
  <rect class="box-a" x="20" y="30" width="125" height="34" rx="5"/>
  <text class="tx-s" x="82" y="47" text-anchor="middle" dominant-baseline="middle">App A + libs</text>
  <rect class="box-a" x="165" y="30" width="125" height="34" rx="5"/>
  <text class="tx-s" x="227" y="47" text-anchor="middle" dominant-baseline="middle">App B + libs</text>
  <rect class="box-r" x="20" y="70" width="125" height="38" rx="5"/>
  <text class="tx-s" x="82" y="89" text-anchor="middle" dominant-baseline="middle">Guest OS + kernel</text>
  <rect class="box-r" x="165" y="70" width="125" height="38" rx="5"/>
  <text class="tx-s" x="227" y="89" text-anchor="middle" dominant-baseline="middle">Guest OS + kernel</text>
  <rect class="box-p" x="20" y="116" width="270" height="34" rx="5"/>
  <text class="tx" x="155" y="133" text-anchor="middle" dominant-baseline="middle">Hypervisor (KVM, Hyper-V, ESXi)</text>
  <rect class="box" x="20" y="158" width="270" height="34" rx="5"/>
  <text class="tx" x="155" y="175" text-anchor="middle" dominant-baseline="middle">Host OS / kernel</text>
  <rect class="box-w" x="20" y="200" width="270" height="34" rx="5"/>
  <text class="tx" x="155" y="217" text-anchor="middle" dominant-baseline="middle">Hardware</text>
  <line class="ln ln-d" x1="320" y1="20" x2="320" y2="240"/>
  <text class="tx tx-b" x="485" y="18" text-anchor="middle">Containers</text>
  <rect class="box-a" x="350" y="30" width="85" height="34" rx="5"/>
  <text class="tx-s" x="392" y="47" text-anchor="middle" dominant-baseline="middle">App A + libs</text>
  <rect class="box-a" x="443" y="30" width="85" height="34" rx="5"/>
  <text class="tx-s" x="485" y="47" text-anchor="middle" dominant-baseline="middle">App B + libs</text>
  <rect class="box-a" x="536" y="30" width="85" height="34" rx="5"/>
  <text class="tx-s" x="578" y="47" text-anchor="middle" dominant-baseline="middle">App C + libs</text>
  <rect class="box-g" x="350" y="116" width="271" height="34" rx="5"/>
  <text class="tx" x="485" y="133" text-anchor="middle" dominant-baseline="middle">Container runtime (Docker / containerd)</text>
  <rect class="box" x="350" y="158" width="271" height="34" rx="5"/>
  <text class="tx" x="485" y="175" text-anchor="middle" dominant-baseline="middle">Host OS — one shared kernel</text>
  <rect class="box-w" x="350" y="200" width="271" height="34" rx="5"/>
  <text class="tx" x="485" y="217" text-anchor="middle" dominant-baseline="middle">Hardware</text>
  <text class="tx-m" x="485" y="92" text-anchor="middle">no guest OS layer</text>
</svg>`, caption: "VMs virtualise hardware; containers virtualise the operating system" },
        { table: { head: ["Aspect", "Virtual machine", "Container"], rows: [
          ["What is isolated", "Whole machine: virtual CPU, RAM, disk, own kernel", "A process tree: own PID, network, mount, hostname view"],
          ["Kernel", "Each VM has its own", "Shared with the host"],
          ["Size", "GBs (full OS image)", "MBs (app + libraries)"],
          ["Start time", "Tens of seconds (boot an OS)", "Milliseconds to ~1 s (start a process)"],
          ["Density", "Tens per host", "Hundreds per host"],
          ["Isolation", "Strong (hardware-level boundary)", "Weaker — a kernel exploit can escape"],
          ["OS flexibility", "Run Windows on a Linux host", "Linux containers need a Linux kernel"]
        ] } },
        { p: "That is also why <b>Docker Desktop on Windows and macOS runs a small Linux VM</b> (WSL 2 on Windows): Linux containers need a Linux kernel to share. For the OS-level background see <a href=\"#/core/os/virtualization-vs-containers\">virtualization vs containers</a>; the Docker basics are in <a href=\"#/core/se/docker-basics\">Docker basics</a>." },
        { p: "In practice the two are combined: cloud providers give you VMs (EC2, GCE), and you run containers inside them. Sandboxed runtimes such as gVisor and Kata Containers (lightweight VMs per container) sit between the two when you run untrusted code." },
        { tip: "One-liner for interviews: 'A VM virtualises hardware and boots a whole OS; a container is a normal Linux process that the kernel lies to — namespaces give it its own view, cgroups cap its resources.'" }
      ]
    },
    {
      id: "image-vs-container",
      q: "What is the difference between a Docker image and a container, and what is the container lifecycle?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "An image is a read-only, layered template — filesystem plus metadata such as the default command, env vars and exposed ports — identified by a content digest. A container is a running (or stopped) instance of an image: the image layers plus a thin writable layer, its own config and a live process. One image can start many containers. A container moves through created, running, paused, exited and removed; anything written inside it is lost when it is removed unless it is on a volume.",
      a: [
        { p: "Analogy: an <b>image</b> is like a class or an <code>.exe</code> installer; a <b>container</b> is like an object or a running process created from it." },
        { table: { head: ["", "Image", "Container"], rows: [
          ["Nature", "Immutable, read-only layers", "Image layers + one writable layer + a process"],
          ["Created by", "<code>docker build</code> / <code>docker pull</code>", "<code>docker create</code> / <code>docker run</code>"],
          ["Identity", "<code>name:tag</code> and <code>sha256:</code> digest", "Container ID / <code>--name</code>"],
          ["Shared?", "Many containers share the same image layers on disk", "Each has its own writable layer"],
          ["Lives in", "Local image store / registry", "Host, while it exists"]
        ] } },
        { code: `docker pull python:3.12-slim                 # image
docker run -d --name web -p 8000:8000 myapp  # create + start a container from image "myapp"
docker ps                                    # running containers
docker ps -a                                 # include exited ones
docker stop web                              # SIGTERM, then SIGKILL after 10 s (-t to change)
docker start web                             # same container again, same writable layer
docker rm web                                # container (and its writable layer) is gone
docker run --rm -it python:3.12-slim python  # throwaway container, removed on exit
docker images                                # list images
docker rmi myapp                             # remove image (fails while a container uses it)`, lang: "bash" },
        { p: "<b>Lifecycle states</b>: <code>created</code> → <code>running</code> ⇄ <code>paused</code> → <code>exited</code> (stopped; filesystem kept) → removed. A container lives exactly as long as its <b>main process (PID 1)</b>: when that process exits, the container exits." },
        { warn: "'My container exits immediately' — the main process finished. A container that runs <code>service nginx start</code> (which daemonises and returns) or a script that ends will stop at once. The main process must stay in the <b>foreground</b> (<code>nginx -g 'daemon off;'</code>, <code>uvicorn ...</code>)." },
        { tip: "Containers should be <b>disposable</b> (cattle, not pets): never fix a running container by hand or <code>docker commit</code> it. Change the Dockerfile, rebuild, redeploy. State goes in volumes or external services." }
      ]
    },
    {
      id: "registries-and-tagging",
      q: "How do image registries and tags work, and why is using the latest tag a problem?",
      topic: "Fundamentals",
      level: 2,
      top: false,
      short: "An image reference is registry/namespace/repository:tag, for example ghcr.io/adnan/api:1.4.2; without a registry it defaults to Docker Hub, and without a tag to latest. Tags are mutable pointers to a content digest. latest is just the default tag name, not 'the newest' — it can point to anything, and different servers may have pulled different versions, so deployments are not reproducible and rollbacks are guesswork. Tag with immutable versions or git SHAs, and pin by digest for full reproducibility.",
      a: [
        { p: "A <b>registry</b> stores and serves images (Docker Hub, GitHub Container Registry, AWS ECR, Google Artifact Registry, or self-hosted). Images are pushed and pulled layer by layer, and layers already present are skipped." },
        { code: `# reference = [registry/][namespace/]repository[:tag][@digest]
docker build -t ghcr.io/adnan/placement-api:1.4.2 \\
             -t ghcr.io/adnan/placement-api:sha-3f9c2ab .
echo "$GHCR_TOKEN" | docker login ghcr.io -u adnan --password-stdin
docker push ghcr.io/adnan/placement-api:1.4.2
docker push ghcr.io/adnan/placement-api:sha-3f9c2ab

docker pull nginx                     # == docker.io/library/nginx:latest
docker images --digests               # see the immutable sha256 digest
docker pull python:3.12-slim@sha256:<digest>   # pinned: always exactly the same bytes`, lang: "bash" },
        { h: "Why latest bites" },
        { ul: [
          "It is only a <b>default name</b> — if someone pushes <code>1.3.9</code> later with <code>-t latest</code>, latest goes backwards. Nothing auto-updates it.",
          "Hosts cache it: a server that pulled latest last month keeps running that version until it explicitly pulls again, so two replicas can run different code under the same tag.",
          "You cannot tell from <code>docker ps</code> which version is deployed, and 'roll back to the previous latest' is impossible.",
          "<code>FROM python:latest</code> in a Dockerfile means builds silently jump to a new major version."
        ] },
        { table: { head: ["Tagging scheme", "Use"], rows: [
          ["<code>1.4.2</code> (semver)", "Releases; humans can read it"],
          ["<code>sha-3f9c2ab</code> (git SHA)", "Every CI build; traceable to a commit"],
          ["<code>@sha256:…</code> digest", "Fully immutable, for production manifests and base images"],
          ["<code>latest</code>, <code>main</code>", "Convenience for local dev only"]
        ] } },
        { warn: "Building on an Apple Silicon Mac produces an <code>arm64</code> image; running it on an <code>amd64</code> server fails with <code>exec format error</code>. Build multi-arch images with <code>docker buildx build --platform linux/amd64,linux/arm64 --push</code>." },
        { tip: "Mention Docker Hub's pull rate limits for anonymous users — a reason CI pipelines log in or use a pull-through mirror / private registry. Versioning ideas tie to <a href=\"#/core/se/semantic-versioning\">semantic versioning</a>." }
      ]
    },

    /* ───────────── Images & Dockerfile ───────────── */
    {
      id: "layers-and-build-cache",
      q: "How do image layers and the build cache work, and how should you order Dockerfile instructions?",
      topic: "Images & Dockerfile",
      level: 2,
      top: true,
      short: "Each filesystem-changing instruction (RUN, COPY, ADD) creates a read-only layer holding the diff from the previous one; layers are content-addressed and shared between images. When building, Docker reuses a cached layer if the instruction and its inputs are unchanged — for COPY that means the file contents — but once one layer changes, every layer after it is rebuilt. So put rarely changing steps first: base image, system packages, dependency manifest and install, and copy the frequently changing source code last.",
      a: [
        { svg: `<svg viewBox="0 0 600 250" width="600" class="dg">
  <rect class="box-g" x="40" y="10" width="300" height="34" rx="5"/>
  <text class="tx" x="190" y="27" text-anchor="middle" dominant-baseline="middle">Container writable layer (R/W)</text>
  <rect class="box-a" x="40" y="58" width="300" height="32" rx="5"/>
  <text class="tx-s" x="190" y="74" text-anchor="middle" dominant-baseline="middle">COPY . .   (source code — changes often)</text>
  <rect class="box-a" x="40" y="96" width="300" height="32" rx="5"/>
  <text class="tx-s" x="190" y="112" text-anchor="middle" dominant-baseline="middle">RUN pip install -r requirements.txt</text>
  <rect class="box-a" x="40" y="134" width="300" height="32" rx="5"/>
  <text class="tx-s" x="190" y="150" text-anchor="middle" dominant-baseline="middle">COPY requirements.txt .</text>
  <rect class="box" x="40" y="172" width="300" height="32" rx="5"/>
  <text class="tx-s" x="190" y="188" text-anchor="middle" dominant-baseline="middle">FROM python:3.12-slim  (base layers)</text>
  <line class="ln-a" x1="370" y1="190" x2="370" y2="66" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="385" y="130">stable → volatile</text>
  <text class="tx-m" x="385" y="150">a change rebuilds this</text>
  <text class="tx-m" x="385" y="166">layer and all above it</text>
  <text class="tx-m" x="190" y="230" text-anchor="middle">image layers are read-only and shared; each container adds one writable layer</text>
</svg>`, caption: "Image layers stacked under a container's writable layer" },
        { p: "Instructions like <code>ENV</code>, <code>EXPOSE</code>, <code>CMD</code> only change metadata; <code>RUN</code>, <code>COPY</code> and <code>ADD</code> add filesystem layers. A container sees all layers merged into one tree by a union filesystem (overlay2)." },
        { h: "Cache rules" },
        { ul: [
          "<code>FROM</code>: cached if the base image digest is the same.",
          "<code>COPY</code> / <code>ADD</code>: cache key includes a checksum of the copied files — edit one file in the copied set and the layer is rebuilt.",
          "<code>RUN</code>: cache key is the <b>command string</b>, not its result. <code>RUN apt-get update</code> stays cached for months and serves stale package lists.",
          "Once a layer misses the cache, <b>all later layers</b> are rebuilt."
        ] },
        { code: [
          { lang: "dockerfile", src: `FROM python:3.12-slim
WORKDIR /app
# any code change invalidates this layer...
COPY . .
RUN pip install -r requirements.txt   # ...so every build reinstalls all dependencies
CMD ["python", "main.py"]` },
          { lang: "dockerfile", src: `FROM python:3.12-slim
WORKDIR /app
# changes rarely
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt        # cached until requirements change
# code changes only rebuild from here
COPY . .
CMD ["python", "main.py"]` }
        ], title: "Bad order (first tab) vs good order (second tab)" },
        { code: `# syntax=docker/dockerfile:1
FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc \\
    && rm -rf /var/lib/apt/lists/*          # update + install in ONE RUN: never stale
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
COPY . .`, lang: "dockerfile", title: "BuildKit cache mount: even when requirements change, pip reuses downloaded wheels" },
        { warn: "Layers are additive. <code>RUN rm big-file</code> in a later layer hides the file but the earlier layer still ships it — the image does not shrink. Create and delete temporary files in the <b>same</b> <code>RUN</code>, or use a multi-stage build." },
        { tip: "In CI the cache is empty on every fresh runner; use <code>docker buildx build --cache-from type=registry,... --cache-to ...</code> (or the GitHub Actions cache backend <code>type=gha</code>) to reuse layers between builds." }
      ]
    },
    {
      id: "writing-a-good-dockerfile",
      q: "How would you write a production-quality Dockerfile for a Python FastAPI or Node.js service?",
      topic: "Images & Dockerfile",
      level: 2,
      top: true,
      short: "Start from a small, pinned official base such as python:3.12-slim or node:22-alpine, set a WORKDIR, copy only the dependency manifest and install dependencies first for caching, then copy the code. Run as a non-root user, bind the server to 0.0.0.0, use exec-form CMD so signals reach the app, set PYTHONUNBUFFERED or NODE_ENV=production, and add a .dockerignore so .git, node_modules, virtualenvs and .env never enter the build context.",
      a: [
        { code: [
          { lang: "dockerfile", src: `# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PIP_NO_CACHE_DIR=1 \\
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# 1. dependencies first (cached until requirements.txt changes)
COPY requirements.txt .
RUN pip install -r requirements.txt

# 2. application code
COPY . .

# 3. drop root
RUN useradd --create-home --uid 10001 appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]` },
          { lang: "dockerfile", src: `# syntax=docker/dockerfile:1
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# 1. dependencies first; npm ci = exact versions from the lockfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 2. application code, owned by the built-in non-root "node" user
COPY --chown=node:node . .
USER node

EXPOSE 3000
CMD ["node", "server.js"]` }
        ], title: "Dockerfile — FastAPI (tab 1) and Express/Node (tab 2)" },
        { code: `# .dockerignore — keeps the build context small, builds fast and secrets out
.git
.gitignore
.venv/
venv/
__pycache__/
*.pyc
node_modules/
npm-debug.log
.env
.env.*
*.log
coverage/
.pytest_cache/
Dockerfile
docker-compose*.yml`, lang: "text", title: ".dockerignore" },
        { h: "Why each line matters" },
        { table: { head: ["Choice", "Reason"], rows: [
          ["<code>-slim</code> / <code>-alpine</code>, pinned version", "Smaller, fewer CVEs, reproducible; never <code>python:latest</code>"],
          ["Copy manifest, install, then copy code", "Code edits don't reinstall dependencies (layer cache)"],
          ["<code>npm ci</code>, not <code>npm install</code>", "Installs exactly the lockfile; fails if it is out of sync"],
          ["<code>PYTHONUNBUFFERED=1</code>", "Logs show up immediately in <code>docker logs</code> instead of sitting in a buffer"],
          ["Non-root <code>USER</code>", "A compromised app is not root inside the container"],
          ["<code>--host 0.0.0.0</code>", "<code>127.0.0.1</code> inside a container is unreachable from outside it, even with <code>-p</code>"],
          ["Exec-form <code>CMD [...]</code>", "Your app is PID 1 and receives SIGTERM from <code>docker stop</code>"],
          ["<code>.dockerignore</code>", "Without it, <code>COPY . .</code> ships <code>.git</code>, <code>node_modules</code> built for your OS, and your <code>.env</code> secrets"]
        ] } },
        { warn: "Copying your local <code>node_modules</code> into a Linux image breaks native modules (bcrypt, sharp) compiled for Windows/macOS. Always install inside the image and ignore <code>node_modules</code>." },
        { tip: "Python on Alpine: many packages ship <code>manylinux</code> wheels built for glibc, so on musl-based Alpine pip may compile from source (slow builds, needs gcc). <code>-slim</code> (Debian) is usually the better Python base; Alpine is fine for Node and Go." }
      ]
    },
    {
      id: "multi-stage-builds",
      q: "What are multi-stage builds and why would you use them?",
      topic: "Images & Dockerfile",
      level: 2,
      top: true,
      short: "A multi-stage Dockerfile has several FROM stages; early stages contain the heavy build toolchain (JDK and Maven, or Node with dev dependencies) and produce an artifact, and the final stage starts from a small runtime image and copies in only that artifact with COPY --from. The result is a much smaller image with no compilers, source code or build secrets, built from a single Dockerfile, and BuildKit can build independent stages in parallel.",
      a: [
        { p: "Without multi-stage builds you either ship the whole build toolchain (a Java image with Maven and the JDK, ~800 MB+) or maintain separate build scripts. With them, the final image contains only what is needed to <i>run</i>." },
        { code: `# syntax=docker/dockerfile:1
# ---------- stage 1: build ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline        # dependency layer, cached until pom.xml changes
COPY src ./src
RUN mvn -B -q package -DskipTests

# ---------- stage 2: runtime ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /src/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]`, lang: "dockerfile", title: "Spring Boot: JDK + Maven to build, JRE only to run" },
        { code: `# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                                 # includes devDependencies (vite, typescript)
COPY . .
RUN npm run build                          # -> /app/dist (static files)

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# nginx base image already runs: nginx -g "daemon off;"`, lang: "dockerfile", title: "React (Vite) app: Node to build, nginx to serve" },
        { table: { head: ["", "Single stage", "Multi-stage"], rows: [
          ["Final image contains", "Compiler, dev deps, source, caches", "Only runtime + artifact"],
          ["Typical size (Spring Boot)", "~800 MB+ (Maven + JDK)", "~200 MB (JRE alpine + jar)"],
          ["Attack surface", "Large (build tools, shells, package managers)", "Small"],
          ["Secrets used at build", "Can leak into layers", "Stay in the discarded build stage (still use <code>--mount=type=secret</code>)"]
        ] } },
        { p: "Useful extras: <code>docker build --target build</code> stops at a named stage (e.g. to run tests in CI), and stages can copy from any image: <code>COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/</code>." },
        { warn: "<code>-XX:MaxRAMPercentage</code> matters: modern JVMs (10+) respect the container's cgroup memory limit, but default to only 25% of it for the heap. Older JVMs ignored container limits entirely and got OOM-killed." },
        { tip: "For the smallest images, the final stage can be <b>distroless</b> (<code>gcr.io/distroless/java21-debian12</code>) or even <code>scratch</code> for a static Go binary — no shell, no package manager, very few CVEs." }
      ]
    },
    {
      id: "cmd-vs-entrypoint",
      q: "What is the difference between CMD and ENTRYPOINT, and between shell form and exec form?",
      topic: "Images & Dockerfile",
      level: 2,
      top: true,
      short: "ENTRYPOINT defines the executable that always runs; CMD supplies default arguments or a default command that is replaced by whatever you pass after the image name in docker run. Used together in exec form, ENTRYPOINT is the program and CMD its default arguments. Exec form (a JSON array) runs your process directly as PID 1 so it receives SIGTERM; shell form wraps it in /bin/sh -c, so signals may hit the shell instead and docker stop ends in SIGKILL after 10 seconds.",
      a: [
        { table: { head: ["Dockerfile", "<code>docker run img</code>", "<code>docker run img --port 9000</code>"], rows: [
          ["<code>CMD [\"python\", \"app.py\"]</code>", "<code>python app.py</code>", "<code>--port 9000</code> (CMD replaced — fails)"],
          ["<code>ENTRYPOINT [\"python\", \"app.py\"]</code>", "<code>python app.py</code>", "<code>python app.py --port 9000</code>"],
          ["<code>ENTRYPOINT [\"python\", \"app.py\"]</code> + <code>CMD [\"--port\", \"8000\"]</code>", "<code>python app.py --port 8000</code>", "<code>python app.py --port 9000</code>"]
        ] } },
        { p: "<b>Rule of thumb</b>: use <code>CMD</code> for a service image so people can easily run something else (<code>docker run img bash</code>); use <code>ENTRYPOINT</code> when the image <i>is</i> a tool (<code>docker run my-cli --help</code>), with <code>CMD</code> for default flags. Override the entrypoint with <code>docker run --entrypoint sh img</code>." },
        { h: "Exec form vs shell form" },
        { table: { head: ["", "Exec form", "Shell form"], rows: [
          ["Syntax", "<code>CMD [\"node\", \"server.js\"]</code>", "<code>CMD node server.js</code>"],
          ["Actually runs", "<code>node server.js</code> as PID 1", "<code>/bin/sh -c \"node server.js\"</code>"],
          ["Signals (<code>docker stop</code>)", "Delivered to your app", "Delivered to the shell, which may not forward them"],
          ["Env var expansion", "No (<code>$PORT</code> is literal)", "Yes"],
          ["With ENTRYPOINT", "CMD becomes its arguments", "Shell-form ENTRYPOINT ignores CMD and run arguments"]
        ] } },
        { code: `#!/bin/sh
# docker-entrypoint.sh: do setup, then hand PID 1 over to the real process
set -e
python -m app.wait_for_db          # e.g. wait for Postgres, run migrations
exec "$@"                          # replace the shell with CMD -> app becomes PID 1

# Dockerfile:
#   COPY docker-entrypoint.sh /usr/local/bin/
#   ENTRYPOINT ["docker-entrypoint.sh"]
#   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`, lang: "bash", title: "The standard entrypoint-script pattern (used by the official postgres and redis images)" },
        { p: "Your app also has to <b>handle</b> SIGTERM — finish in-flight requests and exit. A Node server as PID 1 has no default SIGTERM handler that stops it, so add one:" },
        { code: `const http = require("http");

const server = http.createServer((req, res) => res.end("ok\\n"));
server.listen(0, "0.0.0.0", async () => {           // 0.0.0.0, not 127.0.0.1, inside a container
  const { port } = server.address();
  const body = await (await fetch(\`http://127.0.0.1:\${port}/\`)).text();
  console.log("served:", body.trim());
  process.emit("SIGTERM");                           // simulate what \`docker stop\` sends to PID 1
});

function shutdown(signal) {
  console.log(\`\${signal} received: closing server, finishing in-flight requests\`);
  server.close(() => {
    console.log("closed cleanly, exit 0");
    process.exit(0);
  });
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
// Output:
// served: ok
// SIGTERM received: closing server, finishing in-flight requests
// closed cleanly, exit 0`, lang: "javascript", title: "Graceful shutdown in Node 22" },
        { warn: "PID 1 is special in Linux: the kernel does not apply default signal actions to it, and it must reap zombie child processes. If your app spawns children and doesn't reap them, run with <code>docker run --init</code> (adds the tiny <code>tini</code> init) or <code>init: true</code> in Compose." },
        { tip: "Exit code 137 after <code>docker stop</code> (128 + 9 = SIGKILL) means your app ignored SIGTERM for the full 10-second grace period. 143 (128 + 15) means it died from SIGTERM without handling it; a clean handler exits 0." }
      ]
    },
    {
      id: "copy-vs-add",
      q: "What is the difference between COPY and ADD in a Dockerfile, and which should you use?",
      topic: "Images & Dockerfile",
      level: 1,
      top: true,
      short: "Both copy files into the image. COPY only copies local files and directories from the build context — predictable and transparent. ADD additionally auto-extracts local tar archives and can fetch remote URLs (and git repositories in newer BuildKit). Use COPY by default; use ADD only when you specifically want local tar extraction, and download remote files with RUN curl plus a checksum check, or ADD --checksum, so the behaviour is explicit.",
      a: [
        { table: { head: ["Feature", "COPY", "ADD"], rows: [
          ["Copy local files/dirs from build context", "Yes", "Yes"],
          ["Auto-extract local <code>.tar</code>, <code>.tar.gz</code>, <code>.tar.xz</code>…", "No", "Yes"],
          ["Download from a URL", "No", "Yes (not extracted; <code>--checksum=sha256:…</code> to verify)"],
          ["Clone a git repo", "No", "Yes (newer Dockerfile syntax)"],
          ["<code>--from=stage</code> (multi-stage)", "Yes", "No"],
          ["<code>--chown</code>, <code>--chmod</code>, <code>--link</code>", "Yes", "Yes"],
          ["Recommendation", "Default choice", "Only for its special features"]
        ] } },
        { code: `# plain copy
COPY requirements.txt .
# copy + ownership
COPY --chown=appuser:appuser src/ ./src/
# from an earlier stage (COPY only)
COPY --from=build /app/dist ./dist
# extracted automatically into /
ADD rootfs.tar.gz /
# downloaded, NOT extracted
ADD --checksum=sha256:<sha256-of-file> https://example.com/tool.tar.gz /tmp/

# Usually clearer for remote files: download, verify, extract, clean up in one layer
RUN curl -fsSL -o /tmp/tool.tgz https://example.com/tool.tgz \\
 && echo "<sha256-of-file>  /tmp/tool.tgz" | sha256sum -c - \\
 && tar -xzf /tmp/tool.tgz -C /usr/local/bin \\
 && rm /tmp/tool.tgz`, lang: "dockerfile" },
        { p: "Why prefer COPY: a reviewer reading <code>ADD app.tar.gz /app</code> can't tell whether it will be extracted or copied as-is without knowing the rules, and an unpinned remote <code>ADD</code> makes builds non-reproducible. COPY does one thing." },
        { warn: "Paths in COPY/ADD are relative to the <b>build context</b> (the <code>.</code> in <code>docker build .</code>), not the Dockerfile. <code>COPY ../shared ./shared</code> fails — the context can't reach outside itself. Move the context up (<code>docker build -f api/Dockerfile .</code>) instead." },
        { tip: "<code>COPY --link</code> (BuildKit) makes a copied layer independent of the layers below it, so changing the base image does not force that layer to be rebuilt." }
      ]
    },
    {
      id: "env-vs-arg",
      q: "What is the difference between ENV and ARG in a Dockerfile?",
      topic: "Images & Dockerfile",
      level: 2,
      top: false,
      short: "ARG is a build-time variable: set with --build-arg, available only to the instructions that follow it during the build, and absent in the running container. ENV sets an environment variable that is baked into the image and visible to RUN steps and to the container at runtime, where it can be overridden with docker run -e. Neither is safe for secrets, because both values can show up in docker history or image metadata; use BuildKit secret mounts for build secrets and runtime secrets for the app.",
      a: [
        { table: { head: ["", "ARG", "ENV"], rows: [
          ["Available during build", "Yes (after its declaration)", "Yes"],
          ["Available in running container", "No", "Yes"],
          ["Set by", "<code>docker build --build-arg K=V</code>", "Dockerfile; override with <code>docker run -e K=V</code> / Compose <code>environment:</code>"],
          ["Default value", "<code>ARG K=default</code>", "<code>ENV K=value</code>"],
          ["Scope", "Ends at the end of the stage; an ARG before <code>FROM</code> is only usable in <code>FROM</code> lines unless redeclared", "Inherited by later stages built <code>FROM</code> this one"],
          ["Typical use", "Base-image version, build flags, app version label", "<code>NODE_ENV</code>, <code>PYTHONUNBUFFERED</code>, <code>PORT</code>"]
        ] } },
        { code: `# an ARG before FROM is only usable in FROM lines
ARG PY_VERSION=3.12
FROM python:\${PY_VERSION}-slim

# build-time input...
ARG APP_VERSION=dev
# ...persisted into the image for the app to read
ENV APP_VERSION=\${APP_VERSION}
ENV PORT=8000
LABEL org.opencontainers.image.version=\${APP_VERSION}

# build:  docker build --build-arg APP_VERSION=1.4.2 --build-arg PY_VERSION=3.13 -t api:1.4.2 .
# run:    docker run -e PORT=9000 api:1.4.2     (ENV overridden at runtime)`, lang: "dockerfile" },
        { h: "Build-time secrets the right way" },
        { code: `# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
# secret is mounted only for this RUN; never written to a layer or to history
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev

# docker build --secret id=npmrc,src=$HOME/.npmrc -t api .`, lang: "dockerfile" },
        { warn: "<code>ARG NPM_TOKEN</code> + <code>RUN echo ... &gt; .npmrc</code> leaks the token: build args are recorded in the image's build history (<code>docker history</code>) and the file may stay in a layer even if a later step deletes it." },
        { tip: "Twelve-factor rule: build the image <b>once</b> and configure it per environment at runtime with ENV values. Don't bake environment-specific URLs or credentials into separate dev/prod images." }
      ]
    },
    {
      id: "image-size-optimisation",
      q: "How do you reduce the size of a Docker image?",
      topic: "Images & Dockerfile",
      level: 2,
      top: true,
      short: "Pick a smaller base (slim, alpine, distroless), use multi-stage builds so compilers and dev dependencies stay out of the final image, install only production dependencies without caches (pip --no-cache-dir, npm ci --omit=dev, apt --no-install-recommends and delete apt lists in the same RUN), use a .dockerignore, and chain commands so temporary files are created and deleted in one layer. Inspect results with docker images, docker history and the dive tool.",
      a: [
        { p: "Smaller images pull and start faster (autoscaling, CI), cost less to store and transfer, and contain fewer packages with CVEs." },
        { table: { head: ["Base image (approx., uncompressed)", "Size", "Notes"], rows: [
          ["<code>python:3.12</code>", "~1 GB", "Full Debian with compilers — convenient, huge"],
          ["<code>python:3.12-slim</code>", "~120–150 MB", "Minimal Debian, glibc — best default for Python"],
          ["<code>python:3.12-alpine</code>", "~50–60 MB", "musl libc: some wheels must compile, subtle differences"],
          ["<code>gcr.io/distroless/python3-debian12</code>", "~50–60 MB", "No shell or package manager; use as final stage"],
          ["<code>scratch</code>", "0 B", "Empty — for static binaries (Go, Rust)"]
        ] } },
        { code: `# BAD: 3 layers; apt cache and build tools stay in the image forever
RUN apt-get update
RUN apt-get install -y build-essential libpq-dev
RUN rm -rf /var/lib/apt/lists/*        # too late, earlier layers still contain them

# GOOD: one layer, no recommends, cleaned in the same RUN
RUN apt-get update \\
 && apt-get install -y --no-install-recommends libpq5 \\
 && rm -rf /var/lib/apt/lists/*`, lang: "dockerfile" },
        { code: `# syntax=docker/dockerfile:1
FROM python:3.12-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev \\
 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt   # compile once here

FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 \\
 && rm -rf /var/lib/apt/lists/*                                      # runtime lib only
COPY --from=build /wheels /wheels
RUN pip install --no-cache-dir /wheels/* && rm -rf /wheels
WORKDIR /app
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`, lang: "dockerfile", title: "Python with compiled deps: gcc only in the build stage" },
        { code: `docker images myapp                  # total size
docker history --no-trunc myapp      # size added by each instruction
dive myapp                           # interactive layer explorer: finds wasted space
docker system df                     # disk used by images, containers, volumes, cache
docker builder prune                 # clear build cache`, lang: "bash", title: "Measuring" },
        { warn: "Smallest is not always best: Alpine's musl can cause slower Python builds, DNS quirks and different behaviour; distroless has no shell, so <code>docker exec ... sh</code> debugging is impossible. Choose consciously and say why." },
        { tip: "Quote numbers from your own project if you can: 'I took our FastAPI image from 1.1 GB to 180 MB by switching to slim, a multi-stage wheel build and a .dockerignore' is a strong resume-backed answer." }
      ]
    },

    /* ───────────── Storage & Networking ───────────── */
    {
      id: "volumes-vs-bind-mounts",
      q: "How do you persist data in Docker — volumes vs bind mounts vs tmpfs?",
      topic: "Storage & Networking",
      level: 1,
      top: true,
      short: "A container's writable layer disappears when the container is removed and is slow for heavy writes, so persistent data goes outside it. Named volumes are storage managed by Docker (under /var/lib/docker/volumes), portable and the right choice for databases. Bind mounts map a specific host path into the container — ideal for live-reloading source code in development, but tied to the host's layout and permissions. tmpfs mounts live in RAM for scratch or sensitive data that must never touch disk.",
      a: [
        { table: { head: ["", "Named volume", "Bind mount", "tmpfs"], rows: [
          ["Where data lives", "Docker-managed dir (<code>/var/lib/docker/volumes/…</code>)", "Any host path you choose", "Host memory"],
          ["Survives container removal", "Yes", "Yes (it's your host dir)", "No"],
          ["Created by", "<code>docker volume create</code> or automatically", "Must exist on host", "At container start"],
          ["Pre-populated from image", "Yes, if the volume is empty", "No — host dir hides image content at that path", "No"],
          ["Best for", "Databases, uploads, production state", "Dev: mount source for hot reload; config files", "Secrets, caches, temp files"],
          ["Portability", "High", "Depends on host paths / OS", "—"]
        ] } },
        { code: `# named volume for Postgres data
docker volume create pgdata
docker run -d --name db -e POSTGRES_PASSWORD=dev \\
  -v pgdata:/var/lib/postgresql/data postgres:16-alpine

# bind mount: live code reload in development (read-only config file too)
docker run -d -p 8000:8000 \\
  -v "$(pwd)/app":/app/app \\
  -v "$(pwd)/config.yaml":/app/config.yaml:ro \\
  myapi uvicorn app.main:app --host 0.0.0.0 --reload

# explicit --mount syntax (clearer, errors if the host path is missing)
docker run --mount type=bind,src="$(pwd)"/app,dst=/app/app myapi
docker run --mount type=tmpfs,dst=/tmp,tmpfs-size=64m myapi

docker volume ls
docker volume inspect pgdata           # Mountpoint on the host
docker run --rm -v pgdata:/data -v "$(pwd)":/backup alpine \\
  tar czf /backup/pgdata.tgz -C /data .  # back up a volume`, lang: "bash" },
        { warn: "<code>docker compose down -v</code> and <code>docker volume prune</code> <b>delete your volumes</b> — i.e. your database. Plain <code>docker compose down</code> keeps them. Also: a bind mount over <code>/app</code> hides everything the image put there, including <code>node_modules</code> installed during the build (fix: an extra anonymous volume <code>-v /app/node_modules</code>)." },
        { p: "<b>Permissions</b>: files in a bind mount keep their host UID/GID. A container running as UID 10001 may be unable to write a directory owned by your host user (UID 1000) — match UIDs or adjust ownership. On Docker Desktop (Mac/Windows) bind mounts cross the VM boundary and can be noticeably slower than volumes." },
        { tip: "Databases in containers are fine for dev and tests. In production, many teams still prefer a managed database (RDS, Cloud SQL) — backups, failover and upgrades are the hard part, not running the process." }
      ]
    },
    {
      id: "docker-networking",
      q: "How does Docker networking work — bridge, host, port mapping and container DNS?",
      topic: "Storage & Networking",
      level: 2,
      top: true,
      short: "By default each container gets its own network namespace attached to a bridge network, with a private IP behind NAT. -p 8080:80 publishes container port 80 on host port 8080; EXPOSE is only documentation. On a user-defined bridge network, which Compose creates automatically, containers resolve each other by name through Docker's embedded DNS, so the API connects to db:5432. host mode shares the host's network stack with no isolation or port mapping; none disables networking.",
      a: [
        { table: { head: ["Driver", "What it does", "Use"], rows: [
          ["<code>bridge</code> (default <code>bridge</code>)", "Private subnet on the <code>docker0</code> bridge, NAT to outside; <b>no name-based DNS</b>", "Legacy single containers"],
          ["user-defined <code>bridge</code>", "Same, plus embedded DNS (127.0.0.11) so containers find each other by name; isolated from other networks", "Default for multi-container apps (Compose)"],
          ["<code>host</code>", "Container uses the host's network stack directly; <code>-p</code> ignored", "Max network performance, Linux only"],
          ["<code>none</code>", "Only loopback", "Batch jobs that must not reach the network"],
          ["<code>overlay</code>", "Spans multiple hosts", "Docker Swarm"],
          ["<code>macvlan</code>", "Container gets its own MAC/IP on the LAN", "Legacy apps that expect to be on the physical network"]
        ] } },
        { code: `docker network create appnet
docker run -d --name db    --network appnet -e POSTGRES_PASSWORD=dev postgres:16-alpine
docker run -d --name cache --network appnet redis:7-alpine
docker run -d --name api   --network appnet -p 8000:8000 \\
  -e DATABASE_URL=postgresql://postgres:dev@db:5432/postgres \\
  -e REDIS_URL=redis://cache:6379/0 myapi       # "db" and "cache" resolve via Docker DNS

docker exec api getent hosts db                 # -> 172.18.0.2  db
docker port api                                 # 8000/tcp -> 0.0.0.0:8000
docker network inspect appnet                   # members and their IPs

# port mapping variants
docker run -p 8080:80 nginx                     # host 8080 -> container 80, all interfaces
docker run -p 127.0.0.1:5432:5432 postgres      # only reachable from this host
docker run -P nginx                             # publish all EXPOSEd ports on random host ports`, lang: "bash" },
        { h: "The traps interviewers love" },
        { ul: [
          "<b><code>localhost</code> inside a container is the container itself.</b> An API container cannot reach Postgres at <code>localhost:5432</code> — use the service name <code>db</code>. To reach a service on the host machine use <code>host.docker.internal</code> (built into Docker Desktop; on Linux add <code>--add-host=host.docker.internal:host-gateway</code>).",
          "<b>App bound to 127.0.0.1</b> inside the container: <code>-p</code> forwards to the container's network interface, so the app must listen on <code>0.0.0.0</code>.",
          "<b><code>EXPOSE</code> publishes nothing</b> — it is metadata; only <code>-p</code>/<code>ports:</code> opens a host port.",
          "Containers on the same network talk on the <b>container</b> port (<code>db:5432</code>), not the published host port."
        ] },
        { warn: "On Linux, Docker writes its own iptables rules, so <code>-p 5432:5432</code> exposes Postgres to the internet <b>even if UFW says the port is closed</b>. Publish internal services on <code>127.0.0.1</code> only, or don't publish them at all — other containers on the network don't need it." },
        { tip: "Link it to theory: each container has its own network namespace and a veth pair plugged into a Linux bridge; port publishing is DNAT. See <a href=\"#/core/cn/nat\">NAT</a> and <a href=\"#/core/cn/dns-resolution\">DNS resolution</a>." }
      ]
    },

    /* ───────────── Compose & Operations ───────────── */
    {
      id: "docker-compose-multi-service",
      q: "How would you use Docker Compose to run an API with PostgreSQL and Redis?",
      topic: "Compose & Operations",
      level: 2,
      top: true,
      short: "Compose describes a multi-container app in one compose.yaml: services, the images or build contexts, ports, environment, volumes and dependencies, all on a shared network where services reach each other by name. For API plus Postgres plus Redis: build the API, use official postgres and redis images with named volumes, add healthchecks (pg_isready, redis-cli ping), and make the API depend_on them with condition: service_healthy. docker compose up -d starts everything; down stops it.",
      a: [
        { code: `# compose.yaml  (Compose v2: the top-level "version:" key is obsolete)
services:
  api:
    build: .                              # uses ./Dockerfile
    image: ghcr.io/adnan/placement-api:dev
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://app:\${POSTGRES_PASSWORD}@db:5432/appdb
      REDIS_URL: redis://cache:6379/0
    depends_on:
      db:
        condition: service_healthy        # wait for healthcheck, not just "started"
      cache:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 10

  cache:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  pgdata:
  redisdata:`, lang: "yaml", title: "compose.yaml" },
        { code: `echo "POSTGRES_PASSWORD=change-me" > .env   # Compose reads .env for \${...} interpolation
docker compose up -d --build                # build api, start all three
docker compose ps                           # status + health
docker compose logs -f api                  # follow one service's logs
docker compose exec db psql -U app appdb    # shell into a service
docker compose run --rm api alembic upgrade head   # one-off task (migrations)
docker compose down                         # stop + remove containers & network (volumes kept)
docker compose down -v                      # ...and delete volumes = wipe the DB`, lang: "bash" },
        { h: "What Compose gives you" },
        { ul: [
          "A default <b>network</b> per project: services reach each other as <code>db</code>, <code>cache</code>, <code>api</code>.",
          "<b>Startup ordering</b> with <code>depends_on</code>; with <code>condition: service_healthy</code> it waits for the healthcheck to pass.",
          "<b>Overrides</b>: <code>compose.override.yaml</code> is merged automatically — put dev-only bind mounts and <code>--reload</code> there; <code>-f compose.prod.yaml</code> for other environments.",
          "<code>docker compose watch</code> (newer Compose) syncs or rebuilds on file changes for a dev loop."
        ] },
        { warn: "Plain <code>depends_on: [db]</code> only waits for the db <i>container to start</i>, not for Postgres to accept connections — the classic 'connection refused on first boot'. Use healthchecks with <code>service_healthy</code>, and still add connection retries in the app, because databases restart in production too." },
        { tip: "Compose is for a single host: local dev, CI integration tests, small deployments. When asked 'would you use Compose in production?', say it works for one VM, but multi-node scaling, self-healing and rolling updates need an orchestrator like Kubernetes or ECS." }
      ]
    },
    {
      id: "environment-and-secrets",
      q: "How do you handle configuration and secrets in Docker containers?",
      topic: "Compose & Operations",
      level: 2,
      top: true,
      short: "Keep the image environment-agnostic and inject configuration at runtime through environment variables (docker run -e, --env-file, Compose environment). Secrets such as database passwords or API keys must never be baked into the image — not with COPY .env, ENV or ARG, since they persist in layers and history. Pass them at runtime, preferably as files mounted from a secret store (Compose or Swarm secrets at /run/secrets, Kubernetes Secrets, or a vault), and have the app read a VAR_FILE path.",
      a: [
        { table: { head: ["Method", "Visible in image?", "Visible via <code>docker inspect</code>?", "Verdict"], rows: [
          ["<code>COPY .env .</code> / <code>ENV API_KEY=…</code>", "Yes — anyone who pulls the image has it", "Yes", "Never"],
          ["<code>ARG</code> + <code>--build-arg</code>", "In build history", "—", "Never for secrets"],
          ["<code>docker run -e</code> / <code>--env-file</code>", "No", "Yes, plus child processes and crash dumps can see it", "OK for non-critical config"],
          ["Mounted secret file (<code>/run/secrets/x</code>)", "No", "No (only the mount)", "Preferred"],
          ["Fetched from a vault at startup (AWS Secrets Manager, Vault)", "No", "No", "Best for production; supports rotation"]
        ] } },
        { code: `services:
  api:
    build: .
    environment:
      DB_HOST: db                              # plain config: env var is fine
      DB_PASSWORD_FILE: /run/secrets/db_password
    secrets: [db_password]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password   # official image supports *_FILE
    secrets: [db_password]

secrets:
  db_password:
    file: ./secrets/db_password.txt            # git-ignored; in Swarm/K8s it comes from the store`, lang: "yaml", title: "Compose secrets" },
        { code: `import os
import tempfile
from pathlib import Path

def read_secret(name: str, default: str | None = None) -> str | None:
    """12-factor config: prefer NAME_FILE (Docker/Compose/K8s secret mount), then NAME env var."""
    file_path = os.environ.get(f"{name}_FILE")
    if file_path:
        return Path(file_path).read_text().strip()
    return os.environ.get(name, default)

# --- demo: simulate what Compose does with \`secrets:\` -> /run/secrets/db_password ---
with tempfile.TemporaryDirectory() as run_secrets:
    secret = Path(run_secrets) / "db_password"
    secret.write_text("s3cr3t-from-file\\n")
    os.environ["DB_PASSWORD_FILE"] = str(secret)
    os.environ["DB_HOST"] = "postgres"            # plain config is fine as an env var
    print("DB_HOST     =", read_secret("DB_HOST"))
    print("DB_PASSWORD =", read_secret("DB_PASSWORD"))
    print("DB_PORT     =", read_secret("DB_PORT", "5432"))`, lang: "python", title: "App side: support the *_FILE convention" },
        { code: `DB_HOST     = postgres
DB_PASSWORD = s3cr3t-from-file
DB_PORT     = 5432`, lang: "text" },
        { warn: "The <code>.env</code> file Compose reads for interpolation is a local convenience — add it to <code>.gitignore</code> <b>and</b> <code>.dockerignore</code>. A pushed image containing <code>.env</code> is a leaked secret; rotate the credential, deleting the tag is not enough." },
        { tip: "For build-time secrets (private npm/pip registry tokens) use <code>RUN --mount=type=secret</code>; for runtime use mounted files or a secret manager. Saying 'build-time vs runtime secrets are different problems' is a strong signal." }
      ]
    },
    {
      id: "debugging-containers",
      q: "A container keeps crashing or misbehaving — how do you debug it?",
      topic: "Compose & Operations",
      level: 2,
      top: true,
      short: "Start with docker ps -a for the status and exit code, then docker logs for the app's stdout and stderr. docker inspect shows the real config — command, env, mounts, network, health and whether it was OOM-killed. docker exec -it gives a shell in a running container; for one that crashes on start, run the image with --entrypoint sh to look around. docker stats shows CPU and memory, and exit codes such as 137 (SIGKILL, often out of memory) or 127 (command not found) point to the cause.",
      a: [
        { code: `docker ps -a                                   # STATUS: Exited (137) 2 minutes ago
docker logs --tail 100 -f api                  # app stdout/stderr (add --since 10m, -t)
docker inspect api                             # full JSON: Config, State, Mounts, NetworkSettings
docker inspect -f '{{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}' api
docker inspect -f '{{json .State.Health}}' api # healthcheck history
docker exec -it api sh                         # shell inside a running container
docker exec api env                            # the env vars it really got
docker run --rm -it --entrypoint sh myapi:1.4.2   # crashes on start? open a shell instead
docker stats                                   # live CPU / memory / net per container
docker top api                                 # processes inside
docker events --since 30m                      # die, oom, restart, health_status events
docker cp api:/app/logs/error.log .            # copy a file out
docker compose logs -f --tail 50               # same for all Compose services`, lang: "bash" },
        { table: { head: ["Exit code", "Meaning", "Typical cause"], rows: [
          ["0", "Main process ended normally", "Process wasn't long-running (script finished, daemonised)"],
          ["1", "Application error", "Read the logs: exception, bad config, missing env var"],
          ["125", "<code>docker run</code> itself failed", "Bad flag, port already in use"],
          ["126", "Command not executable", "Missing <code>chmod +x</code> on entrypoint, wrong line endings"],
          ["127", "Command not found", "Typo in CMD, binary not in the slim image, wrong PATH"],
          ["137", "128 + 9: SIGKILL", "Out of memory (<code>OOMKilled=true</code>), <code>docker kill</code>, or ignored SIGTERM on stop"],
          ["139", "128 + 11: segfault", "Native library mismatch (e.g. musl vs glibc binary)"],
          ["143", "128 + 15: SIGTERM", "Stopped by <code>docker stop</code> / orchestrator"]
        ] } },
        { h: "A systematic order" },
        { ol: [
          "<b>Status &amp; exit code</b> → tells you which category of problem.",
          "<b>Logs</b> → most crashes explain themselves. Empty logs with Python? Missing <code>PYTHONUNBUFFERED=1</code>.",
          "<b>Config</b> (<code>inspect</code>, <code>exec env</code>) → wrong env var, wrong mount, wrong network.",
          "<b>Reproduce interactively</b> (<code>--entrypoint sh</code>) → run the CMD by hand and watch it fail.",
          "<b>Network</b> → from inside: <code>getent hosts db</code>, <code>nc -zv db 5432</code>; remember localhost is the container itself.",
          "<b>Resources</b> → <code>docker stats</code>, memory limits, disk full (<code>docker system df</code>)."
        ] },
        { warn: "Windows line endings: an <code>entrypoint.sh</code> saved with CRLF fails with <code>exec ./entrypoint.sh: no such file or directory</code> even though the file exists — the kernel looks for <code>/bin/sh\\r</code>. Convert to LF (<code>.gitattributes</code>: <code>*.sh text eol=lf</code>)." },
        { tip: "Distroless or scratch images have no shell for <code>exec</code>; attach a debug container sharing its namespaces instead (<code>docker run -it --pid=container:api --network=container:api busybox</code>, or <code>kubectl debug</code> in Kubernetes)." }
      ]
    },
    {
      id: "restart-policies-healthchecks",
      q: "What are Docker restart policies and health checks, and how do they work together?",
      topic: "Compose & Operations",
      level: 2,
      top: false,
      short: "A restart policy tells the Docker daemon what to do when a container's main process exits: no (default), on-failure with an optional retry limit, always, or unless-stopped, with an increasing back-off delay between restarts. A HEALTHCHECK runs a command inside the container periodically and marks it starting, healthy or unhealthy. Compose uses health for depends_on ordering and orchestrators use it to route traffic and replace containers — but plain Docker does not restart a container just because it is unhealthy.",
      a: [
        { table: { head: ["Policy", "Restarts when", "After manual <code>docker stop</code>"], rows: [
          ["<code>no</code> (default)", "Never", "—"],
          ["<code>on-failure[:5]</code>", "Exit code ≠ 0 (max 5 tries if given)", "Stays stopped"],
          ["<code>always</code>", "Any exit", "Stays stopped until the daemon restarts, then starts again"],
          ["<code>unless-stopped</code>", "Any exit", "Stays stopped, even across daemon restarts"]
        ] } },
        { p: "Restart delay starts at 100 ms and doubles each time (capped), resetting once the container runs successfully for a while — so a crash-looping container doesn't hammer the host. The policy only applies after the container has started successfully at least once (stayed up ~10 s)." },
        { code: `HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \\
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/live', timeout=2)" || exit 1
# slim images have no curl: use the language runtime you already ship
# states: starting -> healthy, or unhealthy after 3 consecutive failures`, lang: "dockerfile" },
        { code: `import os
from fastapi import FastAPI, Response
from fastapi.testclient import TestClient

app = FastAPI()
STATE = {"db_ok": True}                    # in real code: try SELECT 1 / redis PING

@app.get("/health/live")                   # liveness: is the process alive and serving?
def live():
    return {"status": "ok"}

@app.get("/health/ready")                  # readiness: can it serve traffic right now?
def ready(response: Response):
    if not STATE["db_ok"]:
        response.status_code = 503
        return {"status": "degraded", "db": "down"}
    return {"status": "ok", "db": "up", "version": os.environ.get("APP_VERSION", "dev")}

client = TestClient(app)
print(client.get("/health/live").json())
print(client.get("/health/ready").status_code, client.get("/health/ready").json())
STATE["db_ok"] = False
r = client.get("/health/ready")
print(r.status_code, r.json())`, lang: "python", title: "FastAPI liveness vs readiness endpoints" },
        { code: `{'status': 'ok'}
200 {'status': 'ok', 'db': 'up', 'version': 'dev'}
503 {'status': 'degraded', 'db': 'down'}`, lang: "text" },
        { warn: "Don't point the Docker HEALTHCHECK (or a Kubernetes liveness probe) at an endpoint that checks the database: when the DB blips, every API container goes unhealthy and gets restarted at once, turning a DB hiccup into a full outage. Liveness checks the process; readiness checks dependencies." },
        { tip: "Who acts on 'unhealthy'? Compose uses it for <code>depends_on: condition: service_healthy</code>; Docker Swarm and Kubernetes (liveness/readiness probes) restart or stop routing to the container; plain <code>docker run</code> only reports it. See <a href=\"#/core/sd/health-checks\">health checks</a>." }
      ]
    },
    {
      id: "docker-vs-kubernetes",
      q: "What is the difference between Docker and Kubernetes, and what does Kubernetes add?",
      topic: "Compose & Operations",
      level: 2,
      top: true,
      short: "Docker builds images and runs containers on one machine. Kubernetes is an orchestrator that runs containers across a cluster of machines: you declare the desired state — this image, 5 replicas, this much CPU and memory — and its controllers keep reality matching it by scheduling pods onto nodes, restarting or replacing failed ones, load-balancing through Services, rolling out updates with rollback, autoscaling, and injecting ConfigMaps and Secrets. They are complementary: build with Docker, run at scale on Kubernetes.",
      a: [
        { table: { head: ["Concern", "Docker / Compose (one host)", "Kubernetes (cluster)"], rows: [
          ["Unit", "Container / Compose service", "Pod (one or more containers sharing network + volumes)"],
          ["Scheduling", "You pick the machine", "Scheduler places pods on nodes by resource requests"],
          ["Self-healing", "Restart policy on the same host", "Replaces failed pods, reschedules if a node dies"],
          ["Scaling", "<code>docker compose up --scale api=3</code>, manual", "<code>replicas: 5</code>; HorizontalPodAutoscaler on CPU/custom metrics"],
          ["Service discovery / LB", "Network DNS by service name", "Service (stable virtual IP + DNS), Ingress / Gateway for HTTP"],
          ["Deploys", "Recreate containers", "Rolling updates, readiness gates, <code>kubectl rollout undo</code>"],
          ["Config & secrets", "env, files, Compose secrets", "ConfigMap, Secret objects"],
          ["Storage", "Volumes on that host", "PersistentVolumes via storage classes (EBS, etc.)"],
          ["Complexity", "Low", "High — usually a managed service (EKS, GKE, AKS)"]
        ] } },
        { code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: placement-api
spec:
  replicas: 3                                  # desired state; controllers enforce it
  selector:
    matchLabels: { app: placement-api }
  template:
    metadata:
      labels: { app: placement-api }
    spec:
      containers:
        - name: api
          image: ghcr.io/adnan/placement-api:1.4.2   # the image you built with Docker
          ports: [{ containerPort: 8000 }]
          resources:
            requests: { cpu: 250m, memory: 256Mi }
            limits: { memory: 512Mi }
          readinessProbe:
            httpGet: { path: /health/ready, port: 8000 }
          livenessProbe:
            httpGet: { path: /health/live, port: 8000 }`, lang: "yaml", title: "The same container as a Kubernetes Deployment" },
        { p: "<b>Runtime detail</b>: Kubernetes removed 'dockershim' in v1.24, so nodes run containers through containerd or CRI-O, not the Docker daemon. Your Docker-built images still work unchanged because they are standard <b>OCI images</b>." },
        { warn: "Don't claim you 'need Kubernetes' for a college project or a single small service — that's a red flag for over-engineering. A VM with Compose, or a managed container service (Cloud Run, ECS, Azure Container Apps), is often the right answer." },
        { tip: "If you haven't used Kubernetes, say so, and show you know the vocabulary: Pod, Deployment, Service, Ingress, ConfigMap/Secret, probes, HPA. Related theory: <a href=\"#/core/sd/microservices-vs-monolith\">microservices vs monolith</a> and <a href=\"#/core/sd/service-discovery\">service discovery</a>." }
      ]
    },
    {
      id: "dockerize-your-project",
      q: "Walk me through how you would dockerize your project and ship it to production?",
      topic: "Compose & Operations",
      level: 2,
      top: true,
      short: "First make the app container-friendly: config from environment variables, bind to 0.0.0.0, log to stdout, health endpoints, graceful SIGTERM handling. Write a Dockerfile with a pinned slim base, dependency layer before code, non-root user and exec-form CMD, plus a .dockerignore. Add a compose.yaml with the database and Redis for local dev and integration tests. Then in CI build, test and scan the image, tag it with the version and git SHA, push it to a registry, and deploy that exact tag, running migrations as a separate step.",
      a: [
        { p: "This is the most common 'Docker is on your resume' question. Structure your answer as steps, and use <b>your real project</b> (e.g. 'my FastAPI + Postgres + Redis placement tracker')." },
        { ol: [
          "<b>Make the app 12-factor friendly</b>: read config from env vars (no hard-coded <code>localhost</code>), listen on <code>0.0.0.0</code>, log to stdout/stderr, add <code>/health/live</code> and <code>/health/ready</code>, handle SIGTERM gracefully, keep no state on local disk.",
          "<b>Dockerfile</b>: pinned <code>python:3.12-slim</code>, copy <code>requirements.txt</code> and install first, then code, non-root user, exec-form <code>CMD</code>; multi-stage if anything is compiled.",
          "<b>.dockerignore</b>: <code>.git</code>, <code>.venv</code>, <code>node_modules</code>, <code>.env</code>, tests and caches.",
          "<b>compose.yaml</b> for dev: api + postgres + redis, named volumes, healthchecks, <code>depends_on: service_healthy</code>, a dev override with a bind mount and <code>--reload</code>.",
          "<b>Migrations</b>: a one-off container (<code>docker compose run --rm api alembic upgrade head</code> or a Kubernetes Job) — not on every replica's startup, where several would race.",
          "<b>CI pipeline</b>: lint + unit tests → build image → run integration tests against Compose services → scan (Trivy / Docker Scout) → tag <code>1.4.2</code> and <code>sha-&lt;commit&gt;</code> → push to the registry.",
          "<b>Deploy</b> the exact immutable tag (VM with Compose, ECS/Cloud Run, or Kubernetes); roll back by redeploying the previous tag."
        ] },
        { code: `# .github/workflows/docker.yml
name: build-and-push
on:
  push:
    branches: [main]
jobs:
  image:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}:sha-\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max`, lang: "yaml", title: "CI: build once, push an immutable tag" },
        { table: { head: ["Interviewer follow-up", "Good answer"], rows: [
          ["How big is the image?", "Number + what you did (slim base, multi-stage, .dockerignore)"],
          ["Where do secrets come from?", "Runtime env / mounted secrets from the platform's secret store, never in the image"],
          ["How do you run migrations?", "Separate one-off job before rolling out the new version, backward-compatible schema changes"],
          ["How does the app find the DB?", "<code>DATABASE_URL</code> env var; service name <code>db</code> on the Compose network"],
          ["What if a container dies?", "Restart policy / orchestrator replaces it; app is stateless, data lives in Postgres and Redis"]
        ] } },
        { warn: "Don't say 'I put everything in one container' (API, Postgres and Redis together under supervisord). One process per container lets you scale, update, restart and monitor each piece independently." },
        { tip: "Ending line that lands well: 'the same image that passed CI runs in staging and production; only environment variables differ' — it shows you understand why Docker exists. See also <a href=\"#/core/se/ci-cd-pipeline\">CI/CD pipelines</a>." }
      ]
    },

    /* ───────────── Internals & Security ───────────── */
    {
      id: "how-containers-work-internally",
      q: "How do containers work under the hood — namespaces, cgroups and the union filesystem?",
      topic: "Internals & Security",
      level: 3,
      top: true,
      short: "A container is an ordinary Linux process started with three kernel features. Namespaces give it an isolated view: its own PID tree, network stack, mounts, hostname, IPC and optionally user IDs. Cgroups limit and account its resources — memory, CPU, PIDs and I/O. A union filesystem such as OverlayFS stacks the read-only image layers with a writable layer and presents them as one root filesystem, copying files up on first write. Docker's stack — dockerd, then containerd, then runc — just sets these up.",
      a: [
        { table: { head: ["Namespace", "Isolates", "Effect inside the container"], rows: [
          ["<code>pid</code>", "Process IDs", "App sees itself as PID 1; can't see host processes"],
          ["<code>net</code>", "Network stack", "Own interfaces, IP, routing table, ports"],
          ["<code>mnt</code>", "Mount points", "Own root filesystem (the image)"],
          ["<code>uts</code>", "Hostname", "Container ID as hostname"],
          ["<code>ipc</code>", "Shared memory, semaphores", "Can't touch host IPC objects"],
          ["<code>user</code>", "UID/GID mapping", "Root inside can map to unprivileged user outside (rootless / userns-remap)"],
          ["<code>cgroup</code>", "cgroup tree view", "Sees only its own cgroup"]
        ] } },
        { code: `# namespaces with no Docker at all (Linux, as root):
sudo unshare --pid --fork --mount-proc --uts --net bash
hostname demo-container && hostname     # demo-container (host's hostname unchanged)
ps aux                                  # only bash and ps: PID 1 is bash
ip link                                 # only a down "lo": empty network namespace

# cgroups via Docker flags (cgroup v2 controllers)
docker run -d --name api --memory 512m --cpus 1.5 --pids-limit 200 myapi
docker stats api                        # MEM USAGE / LIMIT  ... / 512MiB
# exceed 512m -> kernel OOM killer kills the process -> exit code 137, OOMKilled=true

# the overlay filesystem behind a container
docker inspect -f '{{json .GraphDriver.Data}}' api
# {"LowerDir":".../l1:.../l2", "UpperDir":".../diff", "MergedDir":".../merged", "WorkDir":".../work"}`, lang: "bash" },
        { h: "OverlayFS in one paragraph" },
        { p: "<b>LowerDir</b> = the image's read-only layers, <b>UpperDir</b> = the container's writable layer, <b>MergedDir</b> = the unified view mounted as <code>/</code>. Reads fall through to the topmost layer that has the file. The first write to a lower-layer file <b>copies it up</b> into UpperDir (copy-on-write); deleting creates a 'whiteout' marker. That is why 100 containers from one image use almost no extra disk, and why heavy writes belong on volumes, which bypass the overlay." },
        { h: "Who does what when you type docker run" },
        { ol: [
          "<b>docker CLI</b> sends a REST request to <b>dockerd</b> (over <code>/var/run/docker.sock</code>).",
          "dockerd pulls the image if needed, sets up networking and volumes, and asks <b>containerd</b> to run it.",
          "containerd prepares the filesystem snapshot and starts a <b>containerd-shim</b>, which calls <b>runc</b>.",
          "runc (the OCI runtime) creates the namespaces and cgroups, applies seccomp/capabilities, pivots the root to the merged filesystem and <code>exec</code>s your CMD — then exits, leaving the shim as the parent."
        ] },
        { warn: "The kernel is shared: a container can't run a different kernel or kernel modules, kernel-level settings affect everyone, and a kernel vulnerability can allow container escape. That's the isolation gap versus VMs (see <a href=\"#/core/os/system-calls\">system calls</a> and <a href=\"#/core/os/user-vs-kernel-mode\">user vs kernel mode</a>)." },
        { tip: "Follow-up 'what is the OCI?' — the Open Container Initiative standardises the image format and the runtime spec, which is why images built by Docker run on containerd, CRI-O, Podman and Kubernetes." }
      ]
    },
    {
      id: "docker-security-best-practices",
      q: "What are the most important Docker security best practices?",
      topic: "Internals & Security",
      level: 3,
      top: false,
      short: "Run as a non-root user, use minimal, pinned and regularly rebuilt base images, and scan images for CVEs (Docker Scout, Trivy). Keep secrets out of images. Drop Linux capabilities (--cap-drop ALL), set no-new-privileges, use a read-only root filesystem where possible, and set memory, CPU and PID limits. Never run --privileged or mount the Docker socket into a container — both are effectively root on the host — and don't publish internal ports publicly. Consider rootless Docker or user namespaces.",
      a: [
        { table: { head: ["Area", "Practice", "Why"], rows: [
          ["Image", "Minimal base (slim, distroless), pinned version or digest, rebuilt often", "Fewer packages = fewer CVEs; rebuilds pick up patches"],
          ["Image", "Scan in CI: <code>docker scout cves</code>, <code>trivy image</code>", "Catch known vulnerabilities before deploy"],
          ["Image", "No secrets in layers, <code>.dockerignore</code> for <code>.env</code>", "Anyone with the image can read every layer"],
          ["Runtime", "<code>USER</code> non-root (UID ≥ 10000)", "Root in a container is root on the kernel if it escapes"],
          ["Runtime", "<code>--cap-drop ALL</code> (+ add back only what's needed)", "Default root still has ~14 capabilities, like <code>NET_RAW</code>, <code>CHOWN</code>"],
          ["Runtime", "<code>--security-opt no-new-privileges</code>", "Blocks setuid binaries from escalating"],
          ["Runtime", "<code>--read-only</code> + <code>--tmpfs /tmp</code>", "Attacker can't drop tools or modify the app"],
          ["Runtime", "<code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code>", "Stops one container (or a fork bomb) starving the host"],
          ["Host", "No <code>--privileged</code>, no <code>-v /var/run/docker.sock:…</code>", "Both give full control of the host"],
          ["Host", "Rootless mode or <code>userns-remap</code>; keep Docker and kernel patched", "Container root maps to an unprivileged host user"],
          ["Network", "Publish only what's public; bind internal ports to <code>127.0.0.1</code>; separate networks per tier", "Docker's iptables rules bypass host firewalls like UFW"]
        ] } },
        { code: `docker run -d --name api \\
  --user 10001:10001 \\
  --read-only --tmpfs /tmp:rw,size=64m \\
  --cap-drop ALL \\
  --security-opt no-new-privileges:true \\
  --memory 512m --cpus 1 --pids-limit 200 \\
  -p 127.0.0.1:8000:8000 \\
  ghcr.io/adnan/placement-api:1.4.2@sha256:<digest>

trivy image ghcr.io/adnan/placement-api:1.4.2     # CVE scan (fail CI on HIGH/CRITICAL)
docker scout cves ghcr.io/adnan/placement-api:1.4.2`, lang: "bash", title: "A hardened docker run" },
        { p: "Docker also applies defaults that help: a <b>seccomp</b> profile blocking dozens of dangerous syscalls, AppArmor/SELinux profiles, and a reduced capability set. <code>--privileged</code> turns all of these off and gives access to host devices." },
        { warn: "Being in the <code>docker</code> group is equivalent to root: <code>docker run -v /:/host -it alpine chroot /host</code> gives a root shell on the host. Treat Docker API access (and the socket) as root access." },
        { tip: "Supply-chain bonus points: sign images (cosign / Docker Content Trust), generate an SBOM (<code>docker buildx build --sbom=true</code>), and only deploy images from your own registry. Ties to <a href=\"#/core/cn/network-attacks\">network attacks</a> thinking about attack surface." }
      ]
    }
  ]
});
