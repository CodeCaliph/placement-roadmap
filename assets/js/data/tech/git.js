/* tech stack: Git — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "git",
  title: "Git",
  short: "Git",
  icon: "⎇",
  blurb: "Everyone lists Git; interviewers check whether you actually understand it: the object model behind commits and branches, the index, fetch vs pull, rewriting history safely (interactive rebase, amend, force-with-lease), recovering 'lost' work with reflog, bisect, branching strategies and how you'd undo a bad commit that's already pushed.",
  topics: ["Internals", "Everyday Workflow", "Rewriting History", "Recovery & Debugging", "Collaboration", "Repo Management"],
  questions: [

    /* ───────────── Internals ───────────── */
    {
      id: "git-data-model",
      q: "How does Git store data internally, and what are blobs, trees, commits, refs and HEAD?",
      topic: "Internals",
      level: 2,
      top: true,
      short: "Git is a content-addressed object store. A blob holds a file's contents, a tree holds a directory listing that maps names and modes to blob or tree ids, and a commit points to one root tree plus its parent commits, author, committer and message. Every object is named by the SHA-1 hash of its content, so identical content is stored once and any change gives a new id. Branches and tags are refs, small files containing a commit id. HEAD is a ref to the current branch, or directly to a commit when detached.",
      a: [
        { p: "Git stores <b>snapshots, not diffs</b>. Each commit records the full state of the project as a tree. Unchanged files are shared between commits because they hash to the same blob. (Packfiles delta-compress objects on disk later, but that's a storage optimisation; the model is snapshots.)" },
        { table: { head: ["Object", "Contains", "Named by"], rows: [
          ["<b>blob</b>", "Raw file contents, no filename or permissions", "SHA-1 of <code>\"blob &lt;size&gt;\\0\" + content</code>"],
          ["<b>tree</b>", "Entries: mode, type, id, name (like a directory)", "SHA-1 of its entries"],
          ["<b>commit</b>", "Root tree id, parent id(s), author, committer, timestamps, message", "SHA-1 of all of that, so it depends on the whole history"],
          ["<b>tag</b> (annotated)", "Target object, tagger, message, optional signature", "SHA-1 of that"]
        ] } },
        { svg: `<svg viewBox="0 0 700 300" width="700" class="dg">
  <rect class="box-w" x="20" y="20" width="70" height="30" rx="6"/><text class="tx tx-b" x="55" y="35" text-anchor="middle" dominant-baseline="middle">HEAD</text>
  <rect class="box-g" x="120" y="20" width="90" height="30" rx="6"/><text class="tx tx-b" x="165" y="35" text-anchor="middle" dominant-baseline="middle">main</text>
  <rect class="box-g" x="470" y="20" width="90" height="30" rx="6"/><text class="tx tx-b" x="515" y="35" text-anchor="middle" dominant-baseline="middle">feature</text>
  <line class="ln" x1="90" y1="35" x2="118" y2="35" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="120" y="90" width="90" height="40" rx="6"/><text class="tx tx-b" x="165" y="110" text-anchor="middle" dominant-baseline="middle">commit C3</text>
  <rect class="box-a" x="300" y="90" width="90" height="40" rx="6"/><text class="tx tx-b" x="345" y="110" text-anchor="middle" dominant-baseline="middle">commit C2</text>
  <rect class="box-a" x="470" y="90" width="90" height="40" rx="6"/><text class="tx tx-b" x="515" y="110" text-anchor="middle" dominant-baseline="middle">commit C1</text>
  <line class="ln" x1="165" y1="50" x2="165" y2="88" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="515" y1="50" x2="515" y2="88" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="210" y1="110" x2="298" y2="110" marker-end="url(#dg-arr)"/><text class="tx-s" x="254" y="102" text-anchor="middle">parent</text>
  <line class="ln" x1="390" y1="110" x2="468" y2="110" marker-end="url(#dg-arr)"/><text class="tx-s" x="429" y="102" text-anchor="middle">parent</text>
  <rect class="box-p" x="120" y="170" width="90" height="36" rx="6"/><text class="tx tx-b" x="165" y="188" text-anchor="middle" dominant-baseline="middle">tree /</text>
  <line class="ln" x1="165" y1="130" x2="165" y2="168" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="20" y="240" width="90" height="36" rx="6"/><text class="tx tx-b" x="65" y="258" text-anchor="middle" dominant-baseline="middle">tree src/</text>
  <rect class="box" x="140" y="240" width="110" height="36" rx="6"/><text class="tx tx-b" x="195" y="258" text-anchor="middle" dominant-baseline="middle">blob README</text>
  <rect class="box" x="280" y="240" width="120" height="36" rx="6"/><text class="tx tx-b" x="340" y="258" text-anchor="middle" dominant-baseline="middle">blob app.py</text>
  <line class="ln" x1="145" y1="206" x2="80" y2="238" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="175" y1="206" x2="190" y2="238" marker-end="url(#dg-arr)"/>
  <path class="ln" fill="none" d="M65,276 C65,296 340,296 340,279" marker-end="url(#dg-arr)"/>
  <text class="tx-a" x="420" y="250">blobs are shared by every commit</text>
  <text class="tx-a" x="420" y="268">whose snapshot has the same content</text>
  <text class="tx-s" x="232" y="40">refs = files holding a commit id</text>
</svg>`, caption: "HEAD → branch ref → commit → tree → blobs. Commits point backwards to parents" },
        { code: `import hashlib, os, subprocess, tempfile, zlib

env = {**os.environ, "GIT_AUTHOR_NAME": "Asha", "GIT_AUTHOR_EMAIL": "asha@example.com",
       "GIT_COMMITTER_NAME": "Asha", "GIT_COMMITTER_EMAIL": "asha@example.com",
       "GIT_AUTHOR_DATE": "2026-10-03T10:00:00+05:30", "GIT_COMMITTER_DATE": "2026-10-03T10:00:00+05:30"}

def git(*args):
    return subprocess.run(["git", "-c", "core.autocrlf=false", "-c", "init.defaultBranch=main", *args],
                          cwd=repo, env=env, capture_output=True, text=True, check=True).stdout.strip()

with tempfile.TemporaryDirectory() as repo:
    git("init", "-q")
    with open(os.path.join(repo, "hello.txt"), "wb") as f:
        f.write(b"hello\\n")
    git("add", "hello.txt")
    git("commit", "-q", "-m", "first commit")

    # 1) a blob id is just SHA-1 of "blob <size>\\0<content>": content-addressed
    content = b"hello\\n"
    manual = hashlib.sha1(b"blob " + str(len(content)).encode() + b"\\0" + content).hexdigest()
    print("manual sha1 :", manual)
    print("git blob id :", git("hash-object", "hello.txt"))

    # 2) walk the graph: ref -> commit -> tree -> blob
    print("HEAD file   :", open(os.path.join(repo, ".git", "HEAD")).read().strip())
    commit = git("rev-parse", "HEAD")
    print("commit type :", git("cat-file", "-t", commit))
    print(git("cat-file", "-p", commit))
    tree = git("rev-parse", "HEAD^{tree}")
    print("tree        :", git("cat-file", "-p", tree))

    # 3) objects are zlib-compressed files under .git/objects/ab/cdef...
    path = os.path.join(repo, ".git", "objects", manual[:2], manual[2:])
    print("raw object  :", zlib.decompress(open(path, "rb").read()))

    # 4) a branch is a 41-byte text file holding a commit id
    git("branch", "feature")
    print("feature ref :", open(os.path.join(repo, ".git", "refs", "heads", "feature")).read().strip() == commit)`, lang: "python", title: "Poking at the object store with plumbing commands (runs git in a temp dir)" },
        { code: `manual sha1 : ce013625030ba8dba906f756967f9e9ca394464a
git blob id : ce013625030ba8dba906f756967f9e9ca394464a
HEAD file   : ref: refs/heads/main
commit type : commit
tree aaa96ced2d9a1c8e72c56b253a0e2fe78393feb7
author Asha <asha@example.com> 1791001800 +0530
committer Asha <asha@example.com> 1791001800 +0530

first commit
tree        : 100644 blob ce013625030ba8dba906f756967f9e9ca394464a	hello.txt
raw object  : b'blob 6\\x00hello\\n'
feature ref : True`, lang: "text", title: "Output" },
        { ul: [
          "<b>Why commits are immutable</b>: a commit's id hashes its tree, parents and metadata. Change anything (message, parent via rebase) and you get a <i>new</i> commit. That's why 'rewriting history' really means 'creating new commits and moving refs'.",
          "<b>Why branches are cheap</b>: creating one writes a 41-byte file. Switching rewrites the working tree from a tree object.",
          "<b>Hash</b>: SHA-1 by default (hardened with collision detection since Git 2.13). <code>git init --object-format=sha256</code> exists, and Git 3.0 plans to make SHA-256 the default."
        ] },
        { tip: "Plumbing commands to name-drop: <code>git cat-file -p</code>, <code>git hash-object</code>, <code>git rev-parse</code>, <code>git ls-tree</code>, <code>git show-ref</code>. Basics like commit/branch are covered in <a href=\"#/core/se/git-basics-commit-branch\">SE: commit &amp; branch basics</a>." }
      ]
    },
    {
      id: "working-tree-index-repo",
      q: "What are the working tree, the index (staging area) and the repository, and how do commands move changes between them?",
      topic: "Internals",
      level: 1,
      top: true,
      short: "The working tree is the files you edit on disk. The index or staging area, the .git/index file, is the snapshot you're preparing for the next commit. The repository, the .git directory, holds all committed objects and refs. git add copies changes from the working tree into the index, git commit turns the index into a commit, and git restore, reset and checkout move content back the other way. The staging area lets you commit only part of your changes, even individual hunks with git add -p.",
      a: [
        { svg: `<svg viewBox="0 0 680 215" width="680" class="dg">
  <rect class="box" x="20" y="30" width="170" height="60" rx="8"/><text class="tx tx-b" x="105" y="54" text-anchor="middle">Working tree</text><text class="tx-s" x="105" y="74" text-anchor="middle">files on disk</text>
  <rect class="box-w" x="255" y="30" width="170" height="60" rx="8"/><text class="tx tx-b" x="340" y="54" text-anchor="middle">Index (staging)</text><text class="tx-s" x="340" y="74" text-anchor="middle">.git/index</text>
  <rect class="box-a" x="490" y="30" width="170" height="60" rx="8"/><text class="tx tx-b" x="575" y="54" text-anchor="middle">Repository</text><text class="tx-s" x="575" y="74" text-anchor="middle">.git/objects + refs</text>
  <line class="ln" x1="190" y1="45" x2="253" y2="45" marker-end="url(#dg-arr)"/><text class="tx-s" x="222" y="38" text-anchor="middle">git add</text>
  <line class="ln" x1="425" y1="45" x2="488" y2="45" marker-end="url(#dg-arr)"/><text class="tx-s" x="457" y="38" text-anchor="middle">git commit</text>
  <line class="ln-a" x1="253" y1="78" x2="192" y2="78" marker-end="url(#dg-arr-a)"/><text class="tx-a" x="222" y="105" text-anchor="middle">restore</text>
  <line class="ln-a" x1="488" y1="78" x2="427" y2="78" marker-end="url(#dg-arr-a)"/><text class="tx-a" x="457" y="105" text-anchor="middle">restore --staged</text>
  <path class="ln-a" fill="none" d="M575,90 C575,170 105,170 105,92" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="340" y="184" text-anchor="middle">git restore --source=HEAD --staged --worktree file  /  git reset --hard</text>
  <text class="tx-m" x="340" y="206" text-anchor="middle">git diff = tree vs index · git diff --staged = index vs HEAD · git diff HEAD = tree vs HEAD</text>
</svg>`, caption: "Three areas and the commands that move content between them" },
        { code: `git status -s            # XY codes: X = index vs HEAD, Y = working tree vs index
#  M app.py              -> modified, not staged
# M  db.py               -> staged
# MM api.py              -> staged, then modified again
# ?? notes.txt           -> untracked

git add -p api.py        # stage only some hunks (y/n/s to split)
git diff                 # what's NOT staged yet
git diff --staged        # what WILL be committed
git commit -m "fix: validate email before insert"
git restore --staged db.py   # unstage (keeps your edits)
git restore app.py           # discard working-tree edits (gone for good!)`, lang: "bash", title: "Moving changes around (Git 2.23+ commands)" },
        { table: { head: ["Command", "Working tree", "Index", "HEAD / branch"], rows: [
          ["<code>git add f</code>", "–", "updated from tree", "–"],
          ["<code>git commit</code>", "–", "–", "new commit from index"],
          ["<code>git restore f</code>", "reset to index", "–", "–"],
          ["<code>git restore --staged f</code>", "–", "reset to HEAD", "–"],
          ["<code>git reset --soft X</code>", "–", "–", "moves to X"],
          ["<code>git reset --mixed X</code> (default)", "–", "reset to X", "moves to X"],
          ["<code>git reset --hard X</code>", "reset to X", "reset to X", "moves to X"]
        ] } },
        { p: "Untracked files aren't in the index at all, so <code>git commit -a</code> (stage all <i>tracked</i> modifications) skips them, and <code>git reset --hard</code> doesn't delete them. That's <code>git clean -fd</code> (preview with <code>-n</code>)." },
        { tip: "Why have a staging area at all? It lets you craft focused commits: fix two unrelated bugs, then commit them separately with <code>git add -p</code>. reset vs revert vs restore in depth: <a href=\"#/core/se/reset-revert-restore\">SE: reset, revert, restore</a>." },
        { warn: "<code>git restore file</code>, <code>git checkout -- file</code> and <code>git reset --hard</code> throw away <b>uncommitted</b> work, and reflog can't bring it back because it was never committed. <code>git stash</code> first if unsure." }
      ]
    },
    {
      id: "detached-head",
      q: "What is a detached HEAD, how do you get into it, and how do you keep work done there?",
      topic: "Internals",
      level: 2,
      top: true,
      short: "Normally HEAD points to a branch name, which points to a commit. Detached HEAD means HEAD points straight at a commit, which happens when you check out a commit hash, a tag or a remote-tracking branch, and during a rebase or bisect. You can look around and even commit, but no branch moves forward, so once you switch away those commits become unreachable and are eventually garbage-collected. To keep them, run git switch -c new-branch while still there, or find the commit in git reflog afterwards.",
      a: [
        { code: `$ cat .git/HEAD
ref: refs/heads/main            # attached: HEAD -> main -> commit

$ git checkout v1.4.0           # tag (same for a SHA or origin/main)
Note: switching to 'v1.4.0'.
You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them ...
$ cat .git/HEAD
3f9c2ab7e1d...                  # detached: HEAD -> commit directly`, lang: "text", title: "Attached vs detached" },
        { table: { head: ["How you got there", "Typical reason"], rows: [
          ["<code>git checkout &lt;sha&gt;</code> / <code>git switch --detach &lt;sha&gt;</code>", "Inspect old code, reproduce a bug"],
          ["<code>git checkout v1.4.0</code>", "Build a release from a tag"],
          ["<code>git checkout origin/main</code>", "Remote-tracking branches can't be checked out as branches"],
          ["Rebase stopped on a conflict / <code>edit</code>", "Git replays commits on a detached HEAD, then moves the branch at the end"],
          ["<code>git bisect</code>", "Checks out midpoints"],
          ["CI checkouts, submodules", "They pin exact commits"]
        ] } },
        { code: `# made commits while detached and want to keep them:
git switch -c hotfix-from-tag          # creates a branch right here (old: git checkout -b)

# already switched away? find the commit and branch it
git reflog                             # e.g. "a1b2c3d HEAD@{1}: commit: try faster parser"
git branch rescued-work a1b2c3d

# just wanted to look: go back
git switch -                           # previous branch`, lang: "bash", title: "Saving work from a detached HEAD" },
        { p: "Git warns you when you leave a detached HEAD with commits not on any branch (<i>'Warning: you are leaving 2 commits behind, not connected to any of your branches'</i>), and prints the SHA. Copy it." },
        { tip: "<code>git switch</code> (2.23+) refuses to detach unless you pass <code>--detach</code>. That's one reason to prefer it over the overloaded <code>git checkout</code>." },
        { warn: "Detached HEAD isn't an error or a corrupt state. It's how Git does rebase and bisect. The only risk is forgetting to create a branch for new commits." }
      ]
    },

    /* ───────────── Everyday Workflow ───────────── */
    {
      id: "fetch-vs-pull",
      q: "What is the difference between git fetch and git pull, and when should you use git pull --rebase?",
      topic: "Everyday Workflow",
      level: 1,
      top: true,
      short: "git fetch downloads new commits and updates remote-tracking refs like origin/main without touching your branch or files, so it's always safe. git pull is fetch followed by integrating the upstream into your current branch, either by merge (the classic default, which creates a merge commit when histories diverge) or by rebase. git pull --rebase replays your local unpushed commits on top of the updated upstream, giving linear history without noisy 'Merge branch main of origin' commits. Many teams set pull.rebase=true.",
      a: [
        { table: { head: ["", "git fetch", "git pull (merge)", "git pull --rebase"], rows: [
          ["Downloads objects, updates <code>origin/*</code>", "Yes", "Yes", "Yes"],
          ["Changes your branch / files", "No", "Yes: merge (fast-forward or merge commit)", "Yes: rebases local commits onto upstream"],
          ["History shape", "–", "May add 'Merge branch main of github.com/...'", "Linear"],
          ["Rewrites commits", "No", "No", "Your <i>unpushed</i> local commits get new SHAs"],
          ["Safe anytime", "Yes", "Mostly", "Yes for unpushed work"]
        ] } },
        { code: `git fetch origin                     # see what changed before integrating
git log --oneline main..origin/main  # commits upstream has that you don't
git log --oneline origin/main..main  # your commits not yet pushed
git diff main origin/main            # what pulling would change

git pull --rebase                    # fetch + rebase onto origin/main
git config --global pull.rebase true # make it the default
git config --global rebase.autoStash true   # stash/unstash dirty files around the rebase
git pull --ff-only                   # only fast-forward; fail if diverged (safe for main)
git fetch --prune                    # also delete origin/* refs for branches deleted on the server`, lang: "bash", title: "Fetch first, then decide" },
        { p: "Recent Git versions (2.27+ warn, later versions refuse) won't silently pick a strategy when your branch and upstream have <b>diverged</b>. You'll see <i>'You have divergent branches and need to specify how to reconcile them'</i> until you set <code>pull.rebase</code> or <code>pull.ff</code>." },
        { tip: "A good habit for shared branches: <code>git pull --rebase</code> before pushing your local commits, and <code>--ff-only</code> on <code>main</code> where you never commit directly. Merge vs rebase trade-offs: <a href=\"#/core/se/merge-vs-rebase\">SE: merge vs rebase</a>." },
        { warn: "<code>origin/main</code> is only as fresh as your last fetch. 'I checked origin/main and it's not there' often just means you didn't fetch." }
      ]
    },
    {
      id: "branching-strategies",
      q: "Compare Git Flow, GitHub Flow and trunk-based development. Which would you choose?",
      topic: "Everyday Workflow",
      level: 2,
      top: true,
      short: "Git Flow uses long-lived main and develop branches plus feature, release and hotfix branches. It suits versioned products with scheduled releases but is heavy and merge-prone. GitHub Flow keeps one always-deployable main branch, with short feature branches merged through pull requests after review and CI, then deployed. Trunk-based development has everyone integrate into main at least daily via tiny branches or direct commits, hiding unfinished work behind feature flags. It needs strong CI and is what high-performing CI/CD teams use. For a web app, I'd pick GitHub Flow or trunk-based.",
      a: [
        { svg: `<svg viewBox="0 0 700 230" width="700" class="dg">
  <text class="tx tx-b" x="10" y="20">Git Flow</text>
  <line class="ln" x1="90" y1="40" x2="680" y2="40"/><text class="tx-s" x="20" y="44">main</text>
  <line class="ln-a" x1="90" y1="75" x2="680" y2="75"/><text class="tx-a" x="20" y="79">develop</text>
  <path class="ln ln-d" fill="none" d="M150,75 C170,105 200,105 220,105 L320,105 C340,105 360,90 370,75"/><text class="tx-s" x="225" y="120">feature/x</text>
  <path class="ln ln-d" fill="none" d="M430,75 C440,60 450,58 470,58 L520,58 C540,58 550,48 560,40"/><text class="tx-s" x="468" y="54">release/1.2</text>
  <circle class="box-g" cx="560" cy="40" r="5"/><text class="tx-s" x="568" y="30">v1.2.0</text>
  <text class="tx tx-b" x="10" y="155">GitHub Flow / trunk-based</text>
  <line class="ln" x1="90" y1="185" x2="680" y2="185"/><text class="tx-s" x="20" y="189">main</text>
  <path class="ln ln-d" fill="none" d="M150,185 C165,210 185,210 200,210 L240,210 C255,210 265,195 275,185"/><text class="tx-s" x="190" y="226">PR, hours–2 days</text>
  <path class="ln ln-d" fill="none" d="M330,185 C345,210 365,210 380,210 L400,210 C415,210 425,195 435,185"/>
  <path class="ln ln-d" fill="none" d="M480,185 C495,210 515,210 530,210 L560,210 C575,210 585,195 595,185"/>
  <text class="tx-m" x="480" y="168">every merge → CI → deployable</text>
</svg>`, caption: "Long-lived branches (Git Flow) vs one trunk with short-lived branches" },
        { table: { head: ["", "Git Flow", "GitHub Flow", "Trunk-based"], rows: [
          ["Long-lived branches", "main + develop", "main only", "main (trunk) only"],
          ["Feature branch life", "Days–weeks", "Hours–few days", "&lt; 1 day, or none"],
          ["Releases", "release/* branches, tagged on main", "Deploy main after each merge", "Continuous. Release branches optional (cut, don't merge back)"],
          ["Hotfix", "hotfix/* from main, merged to main + develop", "Normal PR", "Fix on trunk, cherry-pick to release branch if any"],
          ["Unfinished work", "Stays on feature branch", "Stays on branch until ready", "Merged but hidden behind <b>feature flags</b>"],
          ["Best for", "Versioned/installed software, mobile apps with store releases, multiple supported versions", "Web apps, small–medium teams, open source", "Mature CI/CD, large teams (Google, Meta), DORA-style elite performers"],
          ["Pain", "Merge hell, slow integration, complex", "Needs good CI and review discipline", "Needs excellent tests, flags, discipline"]
        ] } },
        { ul: [
          "Git Flow's author (Vincent Driessen, 2010) added a note in 2020 recommending simpler flows like GitHub Flow for continuously delivered web apps.",
          "The shared enemy is <b>long-lived divergence</b>: the longer a branch lives, the bigger and riskier the merge. All modern advice converges on small, frequent integration.",
          "Release branches + cherry-picks are compatible with trunk-based: fix on main first, then <code>git cherry-pick -x</code> onto <code>release/2.3</code>."
        ] },
        { tip: "Answer with a choice and a reason: 'For our college project and most SaaS teams, GitHub Flow: protected main, PRs with CI and one approval, squash-merge, auto-deploy. If we shipped a mobile app with versions in the field, I'd add release branches.' Day-to-day mechanics: <a href=\"#/core/se/feature-branch-workflow\">SE: feature-branch workflow</a>, and CI side: <a href=\"#/core/se/ci-cd-pipeline\">SE: CI/CD</a>." }
      ]
    },
    {
      id: "gitignore-untrack",
      q: "How does .gitignore work, and how do you stop tracking a file that was already committed (like .env)?",
      topic: "Everyday Workflow",
      level: 1,
      top: true,
      short: ".gitignore lists glob patterns for untracked files Git should not show or add, such as node_modules/, .env, __pycache__/ and build output. It has no effect on files that are already tracked. To stop tracking one, run git rm --cached file, which removes it from the index but keeps it on disk, add the pattern to .gitignore and commit. If the file held secrets, that isn't enough: it's still in history, so rotate the secret immediately and, if needed, purge it from history with git filter-repo.",
      a: [
        { code: `# dependencies / build output
node_modules/
dist/
__pycache__/
*.pyc
.venv/

# secrets and local config
.env
.env.*
!.env.example          # ! re-includes: commit a template without real values

# OS / editor noise (better in your global ignore file)
.DS_Store
.idea/

# patterns: "/" at start = relative to this .gitignore; trailing "/" = directories only
/coverage
logs/**/*.log`, lang: "text", title: ".gitignore for a typical Python + Node project" },
        { code: `# .env got committed by mistake
git rm --cached .env              # untrack, keep the file locally
echo ".env" >> .gitignore
git commit -m "chore: stop tracking .env"

git rm -r --cached node_modules   # same for a whole directory
git check-ignore -v config/local.yml   # which rule ignores this file?
git status --ignored              # list ignored files
git config --global core.excludesFile ~/.gitignore_global   # personal ignores (editor, OS)`, lang: "bash", title: "Untracking and debugging ignore rules" },
        { table: { head: ["File", "Scope", "Committed?"], rows: [
          ["<code>.gitignore</code> (any directory)", "Everyone who clones", "Yes"],
          ["<code>.git/info/exclude</code>", "This clone only", "No"],
          ["<code>core.excludesFile</code> (global)", "All your repos", "No"]
        ] } },
        { p: "If a pushed commit contained a secret: <b>1)</b> revoke/rotate the key now (bots scrape GitHub for keys within minutes), <b>2)</b> rewrite history with <code>git filter-repo --path .env --invert-paths</code> or BFG, <b>3)</b> force-push and have collaborators re-clone. Rotation is the part that actually protects you, since forks and caches may already have the old commits." },
        { tip: "Prevention beats cleanup: a pre-commit secret scanner (gitleaks, detect-secrets) and GitHub push protection block the commit before it ever leaves your laptop." },
        { warn: "Adding a file to <code>.gitignore</code> after committing it does nothing. Git keeps tracking it and showing changes until you <code>git rm --cached</code> it." }
      ]
    },
    {
      id: "tags-releases",
      q: "What are Git tags? Lightweight vs annotated tags, and how are they used for releases?",
      topic: "Everyday Workflow",
      level: 1,
      top: false,
      short: "A tag is a named, fixed pointer to a commit, used to mark releases like v1.4.0. Unlike a branch, it doesn't move. A lightweight tag is just a ref. An annotated tag is a full object with tagger, date, message and optional signature, and it's the one to use for releases. Tags aren't pushed by default: use git push origin v1.4.0 or --follow-tags. CI pipelines often trigger on tag pushes to build and publish, and GitHub Releases attach notes and binaries to a tag.",
      a: [
        { code: `git tag v1.4.0-rc1                         # lightweight: just refs/tags/v1.4.0-rc1 -> commit
git tag -a v1.4.0 -m "Release 1.4.0"        # annotated: tag object with tagger + message
git tag -s v1.4.0 -m "Release 1.4.0"        # annotated + signed (GPG/SSH)
git tag -a v1.3.1 9fceb02 -m "hotfix"       # tag an older commit

git tag -l "v1.*"                           # list
git show v1.4.0                             # tag info + the commit
git push origin v1.4.0                      # tags are NOT pushed by git push
git push --follow-tags                      # push commits + annotated tags reachable from them
git describe --tags                         # v1.4.0-3-g1a2b3c4 = 3 commits after v1.4.0
git push origin --delete v1.4.0-rc1         # delete a remote tag`, lang: "bash", title: "Tag commands" },
        { table: { head: ["", "Lightweight", "Annotated"], rows: [
          ["Stored as", "Ref only", "Tag object + ref"],
          ["Tagger, date, message", "No", "Yes"],
          ["Can be signed", "No", "Yes (<code>-s</code>)"],
          ["Used by <code>git describe</code> by default", "No (needs <code>--tags</code>)", "Yes"],
          ["Use for", "Private bookmarks", "Releases"]
        ] } },
        { code: `on:
  push:
    tags: ["v*.*.*"]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t ghcr.io/acme/api:\${{ github.ref_name }} .
      - run: gh release create "\${{ github.ref_name }}" --generate-notes
        env: { GH_TOKEN: "\${{ secrets.GITHUB_TOKEN }}" }`, lang: "yaml", title: "GitHub Actions: build and publish on tag push" },
        { tip: "Use semantic versioning for tag names (<code>vMAJOR.MINOR.PATCH</code>), see <a href=\"#/core/se/semantic-versioning\">SE: semantic versioning</a>. With Conventional Commits, tools like semantic-release or release-please compute the next tag automatically." },
        { warn: "Never move or re-use a published tag (<code>git tag -f v1.4.0</code> + force push). Others have already fetched the old one, and Git won't update existing tags on fetch, so 'v1.4.0' now means different code on different machines. Cut v1.4.1 instead." }
      ]
    },

    /* ───────────── Rewriting History ───────────── */
    {
      id: "interactive-rebase-squash",
      q: "What is interactive rebase? How do you squash, reorder, reword or drop commits before opening a PR?",
      topic: "Rewriting History",
      level: 2,
      top: true,
      short: "git rebase -i base opens a todo list of your commits since base. You edit verbs: pick to keep, reword to change the message, edit to stop and amend, squash to meld into the previous commit and combine messages, fixup to meld and discard the message, drop to delete, or reorder lines. Git then replays the commits as new commits. Use it to turn 'wip, fix typo, fix again' into a few clean logical commits before review. Don't rebase commits others have already based work on.",
      a: [
        { code: `$ git log --oneline main..HEAD
e4d5f6a fix typo
c3b2a1f address review: rename var
9a8b7c6 wip
1f2e3d4 feat: add password reset endpoint

$ git rebase -i main          # or: git rebase -i HEAD~4`, lang: "text", title: "Messy branch before review" },
        { code: `pick   1f2e3d4 feat: add password reset endpoint
fixup  9a8b7c6 wip
fixup  c3b2a1f address review: rename var
fixup  e4d5f6a fix typo

# Commands:
# p, pick   = use commit
# r, reword = use commit, but edit the commit message
# e, edit   = use commit, but stop for amending (split it, add files)
# s, squash = meld into previous commit, combine messages
# f, fixup  = meld into previous commit, discard this message
# d, drop   = remove commit
# x, exec   = run a shell command (e.g. x npm test) after the line above
# Lines can be re-ordered; they run top to bottom.`, lang: "text", title: "The todo list: edit verbs, save, close" },
        { code: `# the autosquash workflow (no manual editing)
git commit --fixup=1f2e3d4            # creates "fixup! feat: add password reset endpoint"
git rebase -i --autosquash main       # fixup commits are moved and marked automatically
git config --global rebase.autoSquash true

# when it stops (conflict or 'edit')
git status                            # see what's going on
git add <files> && git rebase --continue
git rebase --skip                     # drop the current commit
git rebase --abort                    # get back exactly where you started

# squash a whole branch into one commit without rebase -i
git reset --soft main && git commit -m "feat: add password reset endpoint"`, lang: "bash", title: "Useful variants" },
        { p: "After rebasing a branch you've already pushed, the remote has the old commits, so a normal push is rejected. Use <code>git push --force-with-lease</code> (see the next question). Many teams skip manual squashing and use GitHub's <b>Squash and merge</b> button, which produces one commit on main per PR." },
        { tip: "Rebasing re-applies each commit's diff on a new base, so you may resolve the same conflict several times. <code>git config --global rerere.enabled true</code> makes Git remember resolutions. Basic merge vs rebase: <a href=\"#/core/se/merge-vs-rebase\">SE: merge vs rebase</a>." },
        { warn: "The golden rule: don't rebase commits that exist outside your repo and that people may have built on (shared <code>main</code>, <code>develop</code>, a teammate's branch). Rebasing your own feature branch, even after pushing it for review, is normal." }
      ]
    },
    {
      id: "amend-force-with-lease",
      q: "How do you amend a commit, and why use git push --force-with-lease instead of --force?",
      topic: "Rewriting History",
      level: 2,
      top: true,
      short: "git commit --amend replaces the last commit with a new one built from the current index, with an optionally edited message. Use --no-edit to keep the message, or reset the author with --reset-author. Since it creates a new SHA, a branch you already pushed now diverges and needs a force push. --force overwrites the remote branch unconditionally, wiping any commits a teammate pushed meanwhile. --force-with-lease only overwrites if the remote is still at the commit your origin/branch ref last saw, so it fails safely instead of destroying others' work.",
      a: [
        { code: `git commit --amend -m "feat(auth): add password reset endpoint"   # fix the message
git add forgotten_test.py && git commit --amend --no-edit           # add a forgotten file
git commit --amend --reset-author --no-edit                          # wrong email in config

git push --force-with-lease                 # safe force push of the current branch
git push --force-with-lease=feature/reset:3f9c2ab   # stricter: only if remote is exactly 3f9c2ab
git push --force-with-lease --force-if-includes     # Git 2.30+: also guards against a background fetch`, lang: "bash", title: "Amend and push safely" },
        { table: { head: ["", "--force", "--force-with-lease"], rows: [
          ["Overwrites remote branch", "Always", "Only if remote == your <code>origin/&lt;branch&gt;</code> (last fetched)"],
          ["Teammate pushed meanwhile", "Their commits silently lost", "Rejected: 'stale info'"],
          ["Weak spot", "Everything", "A background <code>git fetch</code> (IDE auto-fetch) updates <code>origin/*</code> and makes the lease pass. <code>--force-if-includes</code> closes that"]
        ] } },
        { ol: [
          "You push <code>feature</code> at commit A. A teammate pushes B on top.",
          "You amend locally (A becomes A') without fetching.",
          "<code>--force</code> → remote becomes A'. <b>B is gone</b> from the remote.",
          "<code>--force-with-lease</code> → Git sees the remote is at B, not A (what your <code>origin/feature</code> says), and refuses. You fetch, rebase onto B, push again."
        ] },
        { p: "Safety nets on the server: protect <code>main</code> (no force pushes, required reviews and status checks) in GitHub/GitLab branch protection or rulesets. Force-pushing is then only possible on personal feature branches, where it's normal after a rebase." },
        { tip: "Alias it: <code>git config --global alias.pushf \"push --force-with-lease --force-if-includes\"</code>. Saying you never type bare <code>--force</code> is a good signal in an interview." },
        { warn: "Amending a commit that's already on a shared branch (main) rewrites public history. Everyone who pulled has the old SHA and will get duplicate commits or conflicts. On shared branches, add a new commit or <code>git revert</code> instead." }
      ]
    },
    {
      id: "undo-pushed-commit",
      q: "You pushed a bad commit to main. How do you undo it?",
      topic: "Rewriting History",
      level: 1,
      top: true,
      short: "On a shared branch, don't rewrite history. Use git revert sha, which creates a new commit applying the inverse diff, and push it normally. Everyone's history stays valid and the undo is itself auditable. For a merge commit, use git revert -m 1 merge-sha to keep the mainline side. Only for a private branch, or if the commit leaked a secret, would you git reset to the earlier commit and force-push with lease, after coordinating with the team, and for a leaked secret, rotate it anyway.",
      a: [
        { table: { head: ["Situation", "Do this"], rows: [
          ["Not pushed yet", "<code>git reset --soft HEAD~1</code> (keep changes staged) or <code>--hard</code> (discard)"],
          ["Pushed to <b>shared</b> branch (main)", "<code>git revert &lt;sha&gt;</code> + normal push"],
          ["Pushed bad <b>merge</b> of a PR", "<code>git revert -m 1 &lt;merge-sha&gt;</code>, or GitHub's 'Revert' button on the PR"],
          ["Pushed to <b>your own</b> feature branch", "<code>git reset --hard HEAD~1</code> + <code>git push --force-with-lease</code>"],
          ["Pushed a <b>secret</b>", "Rotate the secret first, then purge history (filter-repo) + force push, coordinated"],
          ["Several bad commits", "<code>git revert --no-commit A^..C</code> then one commit, or revert each"]
        ] } },
        { code: `git log --oneline -5
# 7d1e2f0 (HEAD -> main, origin/main) feat: new pricing rules   <- bad
# 5c4b3a2 fix: currency rounding

git revert 7d1e2f0                     # opens editor: 'Revert "feat: new pricing rules"'
git push                               # no force needed: history only grew

git revert -m 1 a9b8c7d                # undo a merge: keep parent 1 (main), drop the PR side
git revert --no-commit 5c4b3a2..7d1e2f0 && git commit -m "revert: roll back pricing changes"`, lang: "bash", title: "Reverting on a shared branch" },
        { p: "<b>The revert-a-merge trap</b>: after <code>git revert -m 1</code>, Git still considers the PR's commits merged. If you fix the bug on the feature branch and merge it again, only the <i>new</i> commits come in. The original changes stay reverted. You have to <b>revert the revert</b> first (<code>git revert &lt;revert-sha&gt;</code>), then merge the fix." },
        { tip: "Mention speed in production: revert first to restore service (or roll back the deploy / flip the feature flag), investigate after. Command differences: <a href=\"#/core/se/reset-revert-restore\">SE: reset vs revert vs restore</a>." },
        { warn: "<code>git reset --hard HEAD~1 &amp;&amp; git push -f</code> on main breaks every teammate's clone. Their next pull brings back the 'deleted' commit or produces confusing conflicts. Revert is the default answer for anything shared." }
      ]
    },

    /* ───────────── Recovery & Debugging ───────────── */
    {
      id: "reflog-recovery",
      q: "What is git reflog, and how do you recover 'lost' commits after a bad reset, rebase or deleted branch?",
      topic: "Recovery & Debugging",
      level: 2,
      top: true,
      short: "The reflog is a local, per-repository log of every position HEAD and each branch tip has had: commits, resets, rebases, checkouts, amends. Since Git never immediately deletes commits, you can find the SHA from before the mistake in git reflog and restore it with git reset --hard HEAD@{n}, or create a branch from it. Entries are kept for about 90 days, or 30 for unreachable commits, by default. The reflog is not pushed or cloned, and it can't recover changes that were never committed.",
      a: [
        { code: `$ git reset --hard HEAD~3          # oops: three commits "gone"
$ git reflog
4c5d6e7 (HEAD -> feature) HEAD@{0}: reset: moving to HEAD~3
b8a9f0e HEAD@{1}: commit: add rate limiter tests
a7b6c5d HEAD@{2}: commit: add rate limiter middleware
9e8d7c6 HEAD@{3}: commit: add redis client
4c5d6e7 HEAD@{4}: checkout: moving from main to feature

$ git reset --hard HEAD@{1}        # or: git reset --hard b8a9f0e
HEAD is now at b8a9f0e add rate limiter tests`, lang: "text", title: "Undoing a hard reset" },
        { code: `# botched rebase: go back to the branch as it was before
git reflog show feature                # the branch's own reflog
git reset --hard feature@{1}           # or ORIG_HEAD, which rebase/reset/merge set
git reset --hard ORIG_HEAD

# deleted a branch with unmerged work
git branch -D experiment               # prints: Deleted branch experiment (was 1a2b3c4).
git branch experiment 1a2b3c4          # recreate it (or find the SHA in git reflog)

# time-based
git diff main@{yesterday} main
git checkout main@{"2 hours ago"}

# truly dangling commits not in any reflog (e.g. dropped stash)
git fsck --lost-found                  # lists dangling commits/blobs`, lang: "bash", title: "Other recovery recipes" },
        { table: { head: ["Can recover", "Can't recover"], rows: [
          ["Commits lost to reset, rebase, amend, branch -D", "Uncommitted edits discarded with restore / reset --hard / checkout --"],
          ["Previous branch tips, rebase starting point", "Untracked files removed by <code>git clean</code>"],
          ["Dropped stash (via <code>fsck</code>)", "Anything after gc pruned it (default: unreachable objects older than 2 weeks once reflog entries expire)"],
          ["Your own local history", "Another clone's reflog: it's local only"]
        ] } },
        { p: "Why it works: commits are immutable objects. Reset/rebase only move refs. The old commits remain in <code>.git/objects</code>, reachable from the reflog, until reflog entries expire (<code>gc.reflogExpire</code> 90 days, <code>gc.reflogExpireUnreachable</code> 30 days) and <code>git gc</code> prunes them." },
        { tip: "The interview line: 'In Git, committed work is almost impossible to lose. Reflog is the undo history for refs.' It's also why you should commit (even WIP) often: committed work is recoverable, unstaged edits aren't." }
      ]
    },
    {
      id: "git-bisect",
      q: "How does git bisect work, and how would you use it to find the commit that introduced a bug?",
      topic: "Recovery & Debugging",
      level: 2,
      top: true,
      short: "git bisect binary-searches history for the first bad commit. You mark a known-bad commit, usually HEAD, and a known-good one, like last release's tag. Git checks out the midpoint, you test and mark it good or bad, and it halves the range each time, so 1,000 commits take about 10 steps. git bisect run script automates it: exit code 0 means good, 1 to 127 means bad, and 125 means skip. Finish with git bisect reset.",
      a: [
        { code: `git bisect start
git bisect bad                      # current HEAD has the bug
git bisect good v2.3.0              # this release was fine
# Bisecting: 337 revisions left to test after this (roughly 8 steps)
# ... build/test the checked-out commit ...
git bisect good                     # or: git bisect bad / git bisect skip (can't build)
# ... repeat ...
# 4f2a9c1 is the first bad commit
# commit 4f2a9c1  "refactor: switch to Decimal for prices"
git bisect reset                    # back to where you started`, lang: "bash", title: "Manual bisect" },
        { code: `git bisect start HEAD v2.3.0
git bisect run pytest -x -q tests/test_pricing.py::test_gst_rounding
# or any script: exit 0 = good, 1..127 (except 125) = bad, 125 = skip this commit
git bisect run sh -c "npm ci --silent && npm test -- pricing"

git bisect log > bisect.txt         # save / share the session
git bisect replay bisect.txt
git bisect start --first-parent     # Git 2.29+: only follow main's merge commits (find the bad PR)`, lang: "bash", title: "Automated bisect: let a test decide" },
        { p: "<b>Why it's fast</b>: n commits need ⌈log<sub>2</sub>n⌉ tests: 1,000 commits → 10, 100,000 → 17. It works best when every commit builds and passes tests, another argument for small, atomic commits and squash-merged PRs." },
        { ul: [
          "Write a failing test for the bug <i>first</i> (outside the repo or as an untracked file so checkouts don't remove it), then <code>bisect run</code> it.",
          "Terms can be renamed when you're hunting a fix or a perf change, not a bug: <code>git bisect start --term-old=slow --term-new=fast</code>.",
          "Bisect leaves you on a detached HEAD at each step. That's expected."
        ] },
        { tip: "A story beats a definition: 'Our CSV export broke sometime in the last 200 commits. I wrote a 5-line test, ran <code>git bisect run</code>, and in 8 steps it pointed at a dependency bump.' Interviewers remember that." }
      ]
    },
    {
      id: "blame-log-tricks",
      q: "How do you investigate code history with git log and git blame (finding who changed a line, when a function changed, or when a string appeared)?",
      topic: "Recovery & Debugging",
      level: 2,
      top: false,
      short: "git blame file shows the last commit to touch each line. Add -w to ignore whitespace, -C to follow code moved between files, -L to limit to a range, and --ignore-revs-file to skip formatting commits. git log -S 'text' (the pickaxe) finds commits where the count of a string changed, which is when it was added or removed. -G regex matches diff lines, git log -L :func:file traces one function's history, --follow tracks renames, and --oneline --graph --all draws the branch graph. Blame tells you why code exists, not who to blame.",
      a: [
        { code: `git log --oneline --graph --decorate --all      # ASCII branch graph
git log -p -- src/payments/refund.py            # patches touching a file
git log --follow -- src/utils/money.py          # keep history across renames
git log --author="asha" --since="2 weeks ago" --no-merges
git log -S "MAX_RETRIES" --oneline              # pickaxe: when was this constant added/removed?
git log -G "retr(y|ies)\\s*=" --oneline         # regex over added/removed lines
git log -L :calculate_gst:billing.py            # evolution of one function
git log main..feature                           # commits on feature not on main
git shortlog -sn                                # commits per author`, lang: "bash", title: "git log power moves" },
        { code: `git blame -L 40,60 billing.py                    # only lines 40-60
git blame -w -C -C -C billing.py                 # ignore whitespace; detect lines moved/copied from other files
git blame --ignore-revs-file .git-blame-ignore-revs billing.py
git show 3e1f9a2                                 # the commit blame pointed at: message + diff
git log --format="%h %an %ad %s" --date=short -1 3e1f9a2

# .git-blame-ignore-revs: list "big reformat" commits (e.g. black/prettier run) so blame skips them
git config blame.ignoreRevsFile .git-blame-ignore-revs   # GitHub's blame view honours this file too`, lang: "bash", title: "git blame done right" },
        { table: { head: ["Question", "Command"], rows: [
          ["Who last touched this line, and why?", "<code>git blame -L</code> → <code>git show &lt;sha&gt;</code> → linked PR"],
          ["When did this string appear/disappear?", "<code>git log -S \"str\"</code>"],
          ["How did this function evolve?", "<code>git log -L :func:file</code>"],
          ["Which commit introduced the bug?", "<code>git bisect</code>"],
          ["What changed between two releases?", "<code>git log --oneline v1.3.0..v1.4.0</code> / <code>git diff --stat v1.3.0 v1.4.0</code>"]
        ] } },
        { tip: "This is where good commit messages pay off: blame leads to a commit whose message explains <i>why</i>. 'fix stuff' is a dead end. See the Conventional Commits question." },
        { warn: "Blame shows the <i>last</i> person to touch a line, often whoever ran the formatter or renamed a variable, not the author of the logic. Use <code>-w -C</code>, the ignore-revs file, or 'blame prior revision' in the GitHub UI to dig further back." }
      ]
    },
    {
      id: "resolve-merge-conflict-walkthrough",
      q: "Walk me through resolving a merge conflict step by step. What do ours and theirs mean during a merge vs a rebase?",
      topic: "Recovery & Debugging",
      level: 1,
      top: true,
      short: "A conflict happens when both sides changed the same lines, or one side deleted what the other edited. Git stops, marks the files and inserts markers. Run git status to list the conflicted files, then for each one decide the right combined code (not just one side) and delete the markers. Then build and run the tests, git add the files, and git commit for a merge or git rebase --continue for a rebase. You can always back out with --abort. During a merge, ours is your current branch; during a rebase, ours is the branch you're rebasing onto, so the meanings flip.",
      a: [
        { code: `$ git switch feature && git merge main
Auto-merging app/pricing.py
CONFLICT (content): Merge conflict in app/pricing.py
Automatic merge failed; fix conflicts and then commit the result.

$ git status
Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   app/pricing.py`, lang: "text", title: "Step 1: Git stops and tells you where" },
        { code: `def final_price(amount):
<<<<<<< HEAD
    return round(amount * 1.18, 2)          # feature branch: add 18% GST
||||||| 1a2b3c4
    return amount
=======
    return amount - discount_for(amount)    # main: apply discount
>>>>>>> main`, lang: "python", run: false, title: "Step 2: read the markers (zdiff3 style shows the common ancestor too)" },
        { code: `def final_price(amount):
    return round((amount - discount_for(amount)) * 1.18, 2)   # discount, then GST: needs BOTH changes`, lang: "python", run: false, title: "Step 3: write the correct combination, not just one side" },
        { code: `git diff                         # review the resolution
pytest -q                        # step 4: build + test before concluding
git add app/pricing.py           # step 5: mark resolved
git commit                       # merge: concludes with a merge commit
# (rebase: git rebase --continue   | cherry-pick: git cherry-pick --continue)

git merge --abort                # bail out: back to pre-merge state
git checkout --ours  app/pricing.py    # take one side wholesale for a file
git checkout --theirs app/pricing.py
git mergetool                    # VS Code / IntelliJ / meld 3-way UI
git config --global merge.conflictStyle zdiff3   # Git 2.35+: show the base section`, lang: "bash", title: "Steps 4–5 and handy commands" },
        { table: { head: ["", "--ours / HEAD", "--theirs"], rows: [
          ["<code>git merge main</code> (on feature)", "feature (your branch)", "main (being merged in)"],
          ["<code>git rebase main</code> (on feature)", "main (the new base, plus already-replayed commits)", "your feature commit being replayed"],
          ["<code>git cherry-pick X</code>", "your current branch", "commit X"]
        ] } },
        { tip: "Reduce conflicts at the source: small PRs, merging/rebasing main into your branch often, and auto-formatters so whitespace never conflicts. For tricky ones, talk to the other author. Basics: <a href=\"#/core/se/merge-conflicts\">SE: merge conflicts</a>." },
        { warn: "Committing leftover <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> markers or blindly picking '--theirs' to make the conflict go away are the two classic mistakes. A <code>git diff --check</code> or a pre-commit hook catches the markers." }
      ]
    },

    /* ───────────── Collaboration ───────────── */
    {
      id: "conventional-commits",
      q: "What makes a good commit message, and what are Conventional Commits?",
      topic: "Collaboration",
      level: 1,
      top: true,
      short: "A good commit is one logical change, and its message has a short imperative subject of about 50 characters, like 'Fix rounding in GST calculation', a blank line, then a body explaining why and any context, wrapped at about 72. Conventional Commits 1.0.0 standardises the subject as type(scope)!: description, with types like feat, fix, docs, refactor, test, chore, ci, perf and build. A '!' or a BREAKING CHANGE footer marks breaking changes. This lets tools generate changelogs and semantic version bumps: fix is patch, feat is minor, breaking is major.",
      a: [
        { code: `feat(auth): add password reset via email OTP

Users locked out had to contact support. Send a 6-digit OTP that
expires in 10 minutes; rate-limited to 3 requests per hour per email.

Closes #142`, lang: "text", title: "A good commit message" },
        { code: `fix(cart): prevent negative quantity on decrement
feat(api)!: return amounts in paise instead of rupees
docs: document pagination cursor format
refactor(orders): extract tax calculation into service
perf(search): add trigram index for product names
test(payments): cover idempotent retry path
ci: cache pip dependencies in GitHub Actions
chore(deps): bump fastapi to 0.115.6

BREAKING CHANGE: amount fields are now integers in paise.`, lang: "text", title: "Conventional Commits examples" },
        { table: { head: ["Type", "Meaning", "SemVer bump"], rows: [
          ["<code>fix</code>", "Bug fix", "PATCH (1.4.0 → 1.4.1)"],
          ["<code>feat</code>", "New feature", "MINOR (1.4.0 → 1.5.0)"],
          ["<code>!</code> or <code>BREAKING CHANGE:</code> footer", "Incompatible API change", "MAJOR (1.4.0 → 2.0.0)"],
          ["<code>docs, style, refactor, perf, test, build, ci, chore</code>", "Everything else", "None by default"]
        ] } },
        { ul: [
          "<b>Imperative mood</b> ('Add', not 'Added'/'Adds'): it reads as 'If applied, this commit will <i>add …</i>' and matches Git's own messages ('Merge branch…', 'Revert…').",
          "<b>Why, not what</b>: the diff shows what changed. The message must say why, what alternatives were rejected and what's surprising.",
          "<b>Tooling</b>: commitlint (enforce via a commit-msg hook), semantic-release / release-please (auto version + changelog + tag), Commitizen (interactive prompt).",
          "<b>Atomic commits</b>: each commit builds and does one thing, which makes review, revert, cherry-pick and bisect work well."
        ] },
        { tip: "With squash-merging, the <b>PR title</b> becomes the commit on main, so many teams lint PR titles against Conventional Commits rather than every WIP commit. Version numbers: <a href=\"#/core/se/semantic-versioning\">SE: semantic versioning</a>." },
        { warn: "Messages like 'update', 'changes', 'final fix 2' make <code>git log</code>, blame and bisect useless. Interviewers who look at your GitHub will notice." }
      ]
    },
    {
      id: "pr-etiquette-code-review",
      q: "What makes a good pull request, and how do you give and receive code review?",
      topic: "Collaboration",
      level: 1,
      top: true,
      short: "A good PR is small, ideally under about 400 changed lines, and focused on one change. It has a clear title and a description covering what, why and how it was tested, with screenshots for UI and links to the issue. It passes CI and is self-reviewed before requesting review. As a reviewer, check correctness, tests, design, security and readability, comment on the code not the person, label nits as optional and approve once it's good enough. As an author, respond to every comment, push follow-up commits and don't take feedback personally.",
      a: [
        { code: `## What
Add POST /v1/auth/password-reset that emails a 6-digit OTP.

## Why
Locked-out users currently need support tickets (~40/week). Closes #142.

## How
- OTP stored hashed in Redis with 10-min TTL
- Rate limit: 3 requests/hour/email (returns 429 + Retry-After)
- Same 202 response whether or not the email exists (no user enumeration)

## Testing
- Unit tests for OTP generation/expiry; API tests for 202/429/422
- Manually tested against Mailpit locally

## Notes for reviewers
Start with services/otp.py; the router change is mechanical.`, lang: "text", title: "A PR description template" },
        { table: { head: ["Author checklist", "Reviewer checklist"], rows: [
          ["Small, single-purpose (split refactors from features)", "Does it do what the PR says? Edge cases, error paths"],
          ["Self-review the diff first, remove debug prints", "Tests: present, meaningful, would they catch a regression?"],
          ["CI green, branch up to date with main", "Security: input validation, auth checks, secrets, SQL injection"],
          ["Description: what / why / how tested / screenshots", "Design: right layer, naming, duplication, simpler alternative?"],
          ["Draft PR for early feedback on approach", "Performance: N+1 queries, unbounded lists, missing indexes"],
          ["Reply to every comment; resolve or explain", "Prefix optional remarks with <b>nit:</b>; ask questions rather than command"]
        ] } },
        { ul: [
          "<b>Tone</b>: 'What do you think about extracting this into a helper?' beats 'This is wrong.' Praise good things too.",
          "<b>Speed</b>: review within a working day. Slow reviews push people toward giant PRs.",
          "<b>Automate the trivial</b>: formatting, linting, type checks and coverage belong in CI or pre-commit, not human comments.",
          "<b>Merge strategy</b>: squash-merge (one commit per PR, clean main), rebase-merge (keep commits, linear) or merge commit (keep full branch history). Teams pick one and enforce it in repo settings.",
          "<b>Repo settings</b>: branch protection / rulesets with required reviews, required status checks, CODEOWNERS for auto-assigning reviewers."
        ] },
        { tip: "Have a real example ready: 'A reviewer caught that my endpoint didn't check the order belonged to the user (BOLA). Since then I add an authorization test for every new endpoint.' Theory of code review: <a href=\"#/core/se/code-review\">SE: code review</a>." }
      ]
    },
    {
      id: "git-hooks-pre-commit",
      q: "What are Git hooks, and how do you set up pre-commit checks for a team?",
      topic: "Collaboration",
      level: 2,
      top: false,
      short: "Hooks are scripts Git runs at certain points. Client-side hooks include pre-commit before a commit is created, commit-msg to validate the message, and pre-push before pushing; server-side hooks like pre-receive can reject pushes. A non-zero exit aborts the action. Hooks live in .git/hooks, which isn't versioned, so teams share them with a tool: the pre-commit framework with .pre-commit-config.yaml for Python, Husky with lint-staged for JS, or core.hooksPath. Client hooks can be skipped with --no-verify, so CI must run the same checks.",
      a: [
        { table: { head: ["Hook", "When", "Typical use"], rows: [
          ["<code>pre-commit</code>", "Before the commit is created", "Format (black/ruff/prettier), lint, secret scan, block conflict markers / large files"],
          ["<code>prepare-commit-msg</code>", "Before the editor opens", "Prefill ticket id from branch name"],
          ["<code>commit-msg</code>", "After the message is written", "Enforce Conventional Commits (commitlint)"],
          ["<code>pre-push</code>", "Before pushing", "Run fast unit tests"],
          ["<code>post-checkout</code> / <code>post-merge</code>", "After switching / pulling", "Reinstall deps if lockfile changed"],
          ["<code>pre-receive</code> / <code>update</code> (server)", "When the server receives a push", "Reject force pushes, enforce policies (hosted platforms use branch protection instead)"]
        ] } },
        { code: `# .pre-commit-config.yaml  (pip install pre-commit && pre-commit install)
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-merge-conflict
      - id: check-added-large-files
        args: ["--maxkb=1024"]
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.9
    hooks:
      - id: ruff
        args: ["--fix"]
      - id: ruff-format
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks:
      - id: gitleaks`, lang: "yaml", title: "Python team: the pre-commit framework" },
        { code: `#!/bin/sh
# .githooks/pre-commit  (share with: git config core.hooksPath .githooks)
if git diff --cached --name-only | grep -qE '(^|/)\\.env$'; then
  echo "Refusing to commit a .env file" >&2
  exit 1
fi
git diff --cached --check || { echo "Whitespace errors / conflict markers" >&2; exit 1; }`, lang: "bash", title: "A hand-written hook (must be executable: chmod +x)" },
        { p: "For JavaScript projects: <code>npx husky init</code> creates <code>.husky/pre-commit</code>, usually running <code>npx lint-staged</code>, which lints only the staged files so the hook stays fast. Installation hooks into <code>npm install</code> via the <code>prepare</code> script, so everyone gets them automatically." },
        { tip: "Keep hooks fast (a few seconds) and limited to staged files. Slow hooks train people to use <code>--no-verify</code>. Heavy checks (full test suite) belong in CI: <a href=\"#/core/se/ci-cd-pipeline\">SE: CI/CD pipeline</a>." },
        { warn: "Hooks are not security: they run on the developer's machine and <code>git commit --no-verify</code> skips them. Anything that must hold (tests pass, no secrets) has to be enforced again in CI and branch protection." }
      ]
    },

    /* ───────────── Repo Management ───────────── */
    {
      id: "submodules-vs-monorepo",
      q: "What are Git submodules, what problems do they have, and how do they compare with a monorepo?",
      topic: "Repo Management",
      level: 3,
      top: false,
      short: "A submodule embeds another repository at a fixed commit inside yours. The parent stores only a pointer, a gitlink in the tree plus .gitmodules, not the files. It suits vendoring a shared library you also develop separately, but it's error-prone: clones need --recurse-submodules, updates are two-step commits, and it's easy to leave a submodule on a detached HEAD or push the parent before the child. A monorepo keeps all projects in one repo for atomic cross-project changes and one CI, at the cost of scale tooling like sparse checkout and build caching.",
      a: [
        { code: `git submodule add https://github.com/acme/shared-ui.git libs/shared-ui
git commit -m "chore: add shared-ui as submodule"     # commits .gitmodules + gitlink (mode 160000)

git clone --recurse-submodules https://github.com/acme/web.git
git submodule update --init --recursive               # if you forgot the flag

# bump the submodule to a newer commit
cd libs/shared-ui && git fetch && git switch --detach origin/main && cd ../..
git add libs/shared-ui && git commit -m "chore: bump shared-ui"
git submodule update --remote --merge                 # alternative: follow a branch from .gitmodules`, lang: "bash", title: "Submodule lifecycle" },
        { table: { head: ["", "Submodules / polyrepo", "Monorepo"], rows: [
          ["Cross-project change", "PR in each repo + bump pointer", "One atomic commit / PR"],
          ["Versioning", "Each repo versions independently", "Everything at one commit; libs consumed at HEAD"],
          ["Access control", "Per repo", "Coarser (CODEOWNERS helps)"],
          ["CI", "Per repo, simple", "Needs 'affected' builds + caching (Nx, Turborepo, Bazel)"],
          ["Scale issues", "Dependency/version drift", "Clone size, slow status → sparse-checkout, partial clone, Scalar"],
          ["Used by", "Many OSS projects, firmware/vendor code", "Google, Meta, Microsoft (Windows), JS workspaces (pnpm/yarn)"]
        ] } },
        { ul: [
          "<b>Alternatives</b> to submodules: publish the shared code as a package (npm, PyPI, Maven) with versioning; <code>git subtree</code> (copies the code into your history, so no extra clone step); or a monorepo with workspaces.",
          "<b>Monorepo Git features</b>: <code>git sparse-checkout set apps/web libs/ui</code>, <code>git clone --filter=blob:none</code> (partial clone), <code>git maintenance start</code>, and Scalar (bundled with Git since 2.38)."
        ] },
        { tip: "A balanced answer: 'For a small team with a React front end and a FastAPI backend that change together, a monorepo with path-filtered CI is simplest. Submodules only when we must pin a third-party repo we also modify.'" },
        { warn: "A classic submodule bug is pushing the parent repo with a pointer to a submodule commit that exists only on your laptop. Teammates then get 'fatal: remote error: upload-pack: not our ref'. Push the submodule first (<code>git push --recurse-submodules=check</code>)." }
      ]
    },
    {
      id: "git-lfs-large-files",
      q: "Why is committing large binary files a problem in Git, and how do Git LFS and history cleanup help?",
      topic: "Repo Management",
      level: 2,
      top: true,
      short: "Git keeps every version of every file forever and every clone downloads the full history. Binaries such as datasets, model weights, videos and PSDs don't delta-compress well, so each change adds the whole file and the repo bloats permanently, even after you delete the file. GitHub rejects files over 100 MB. Git LFS replaces large files in the repo with tiny pointer files and stores the real content on an LFS server, downloaded only for the commits you check out. A file already committed needs history rewriting with git lfs migrate or git filter-repo.",
      a: [
        { code: `git lfs install                          # once per machine (sets up filters/hooks)
git lfs track "*.pt" "*.onnx" "data/*.parquet"   # writes rules to .gitattributes
git add .gitattributes models/resnet50.pt
git commit -m "chore: track model weights with LFS"
git lfs ls-files                         # which files are in LFS

# what actually gets committed for models/resnet50.pt (a ~130-byte pointer):
#   version https://git-lfs.github.com/spec/v1
#   oid sha256:4d7a2146...e9a1
#   size 102530238`, lang: "bash", title: "Setting up Git LFS" },
        { code: `# find the biggest blobs in history
git rev-list --objects --all | git cat-file --batch-check="%(objecttype) %(objectname) %(objectsize) %(rest)" | sort -k3 -n | tail -5

# already committed? rewrite history (coordinate with the team, then force-push)
git lfs migrate import --include="*.pt" --everything      # move into LFS
git filter-repo --path data/raw_dump.csv --invert-paths   # or remove entirely (pip install git-filter-repo)
git filter-repo --strip-blobs-bigger-than 50M`, lang: "bash", title: "Finding and purging large files" },
        { table: { head: ["Option", "Good for", "Trade-off"], rows: [
          ["Git LFS", "Assets that must version with code: game art, small models, design files", "Needs LFS server and quota (GitHub bills storage/bandwidth); clones need git-lfs installed"],
          ["Don't store in Git (S3/GCS + a manifest)", "Large datasets, training checkpoints", "Versioning is up to you"],
          ["DVC / Hugging Face Hub", "ML data and models", "Extra tool, but built for ML (DVC keeps pointers in Git)"],
          [".gitignore + artifact registry", "Build outputs, Docker images, wheels", "Rebuilt by CI, never committed"]
        ] } },
        { p: "Limits worth knowing on GitHub: warning above 50 MB, hard block at 100 MB per file, and repos are recommended to stay under a few GB. Deleting a big file in a new commit doesn't shrink the repo, because the blob is still in history. Only a rewrite (filter-repo) followed by everyone re-cloning does." },
        { tip: "Relevant for an ML resume: say you keep code in Git, weights on Hugging Face Hub or S3 (or in DVC), and data out of the repo entirely, with a script that downloads the right version. That shows you've hit this problem for real." },
        { warn: "<code>git filter-branch</code> is officially discouraged (slow, footguns). Use <code>git filter-repo</code> or BFG. After any history rewrite, old clones and forks still contain the data, so leaked secrets must be rotated anyway." }
      ]
    },
    {
      id: "signing-commits",
      q: "Why and how do you sign Git commits (GPG vs SSH signing), and what does 'Verified' on GitHub mean?",
      topic: "Repo Management",
      level: 3,
      top: false,
      short: "Git's author name and email are just config values, so anyone can make a commit that claims to be from you. Signing attaches a cryptographic signature, made with a GPG key or, since Git 2.34, an SSH key, so others can verify who actually created it and that it wasn't altered. GitHub shows Verified when the signature matches a key uploaded to the committer's account. Organisations can require signed commits on protected branches, and vigilant mode flags unsigned commits that claim to be yours.",
      a: [
        { code: `# SSH signing (Git 2.34+) — easiest if you already use an SSH key for GitHub
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true          # sign every commit
git config --global tag.gpgsign true             # and annotated tags
# upload the same public key on GitHub as a "Signing key" (Settings -> SSH and GPG keys)

# GPG signing
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long       # copy the key id
git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgsign true

git commit -S -m "feat: signed commit"           # -S signs a single commit explicitly
git log --show-signature -1                      # verify locally
git verify-commit HEAD && git verify-tag v1.4.0`, lang: "bash", title: "Setting up signing" },
        { table: { head: ["", "GPG", "SSH (2.34+)", "Sigstore gitsign"], rows: [
          ["Key", "OpenPGP key pair", "Your existing SSH key", "Short-lived cert via OIDC login (keyless)"],
          ["Setup effort", "Highest (gpg-agent, expiry, subkeys)", "Low", "Medium"],
          ["Local verification", "Keyring / web of trust", "<code>gpg.ssh.allowedSignersFile</code>", "Transparency log (Rekor)"],
          ["GitHub 'Verified'", "Yes", "Yes", "Not shown as Verified on GitHub at present"]
        ] } },
        { ul: [
          "<b>What it protects</b>: impersonation (spoofed <code>user.email</code>) and tampering. It's part of supply-chain security (SLSA, signed tags for releases).",
          "<b>What it doesn't</b>: it proves which key signed, not that the code is good, and it doesn't stop a compromised laptop with an unlocked key.",
          "<b>Rebase/squash on GitHub</b>: commits GitHub creates (squash-merge, web edits) are signed by GitHub's own key and show Verified.",
          "<b>Rewriting history</b> (rebase, amend) creates new commits that need re-signing. With <code>commit.gpgsign=true</code> that's automatic."
        ] },
        { tip: "Show the threat clearly: 'I can run <code>git config user.email torvalds@linux-foundation.org</code> and push, and GitHub will show his avatar. Signing plus required signatures on main is what stops that.'" }
      ]
    }
  ]
});
