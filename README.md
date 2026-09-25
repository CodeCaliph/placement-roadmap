# 60-Day Placement Handbook — Interactive Tracker

An offline, single-folder web app built directly from
`60_Day_Campus_Placement_Handbook_Java.md`. Nothing is summarised or
re-typed: a Python parser reads the markdown and generates the app's data, so
the app can never drift from your handbook.

## Run it

Double-click **`index.html`**. That's it — no server, no install, no internet.

Progress is saved in your browser's local storage. **Export a backup from
Settings now and then** (clearing site data or switching browser loses it
otherwise).

## What is tickable

**1,692 individually trackable items**, every one of them lifted from the
handbook:

| Item | Count | Where |
|---|---|---|
| Daily work blocks (Morning / Afternoon / Evening / Night) | 240 | 60-Day Plan |
| Named problems inside those blocks | 353 | 60-Day Plan (chips) |
| Question-bank items (Part 6 + curated must-know sets) | 929 | Problem Sets |
| Final placement checklist boxes (Part 8) | 49 | Final Checklist |
| The 100 mistakes (Part 9) | 100 | 100 Mistakes |
| Mock interviews (Part 7) | 13 | Mocks |
| Mock OAs | 8 | Mocks |

Plus: per-topic problem quotas for all 35 DSA topics (~772 problems), 9 weekly
readiness scores across 10 dimensions, 8-dimension rubric scores per mock,
per-day and per-topic notes, a focus timer that logs hours, and the three
companion sheets the handbook demands (Redo List with +3/+10/+30 spaced
repetition, Weakness sheet, categorised Mistake log).

## The tabs

- **Dashboard** — today's four blocks, headline progress, streak, slippage
  warning, next mock, the 60-day grid, readiness trajectory.
- **60-Day Plan** — phases → weeks → days → blocks. Search across all 60 days.
- **To-Do Planner** — tasks on five horizons (Day, Week, Month, Year, Someday).
  Unfinished tasks carry forward, and each task can have a priority, tag, notes
  and subtasks. Routines repeat on the weekdays you choose and keep a streak. The
  week view is a 7-day board where you can drag tasks between days. The month
  view is a calendar, and the year view breaks each month into goals. Type
  `#dsa` / `!high` while adding to tag and prioritise.
- **Trackers** — Redo List, Weakness sheet, Mistake log.
- **Problem Sets** — the 10 Part-6 banks plus 12 design patterns, 15 LLD,
  12 HLD, 20 SQL archetypes, 12 DP families, 8 STAR stories.
- **DSA Topics** — the 35-topic master table with quotas, and all 31 deep dives
  (patterns · signature problems · mistakes).
- **Core Subjects** — the theory rounds. The 50 most-asked interview questions
  for each of OS, OOPS, CN and DBMS, plus extra questions, SQL query drills,
  System Design basics, Computer Architecture and Software Engineering. Every
  answer has a 30-second version, then the full answer with C++/Java code, SQL
  and theme-aware diagrams. Tick questions as mastered, star them for revision,
  or drill any filtered set as flashcards (`Space` reveal, `K` knew it,
  `R` review again). Every question is searchable from `Ctrl`+`K`.
- **Mocks** — schedule, plus the 8-dimension rubric for scoring each one.
- **Readiness** — the weekly 0–100 score, charted against the plan's target
  trajectory. Hints are pre-computed from your own ticked progress.
- **Final Checklist** — Part 8, grouped, with per-group meters.
- **100 Mistakes** — Part 9, searchable, each with its fix.
- **Handbook** — Parts 1, 2, 4, 5 in full, searchable. Your source text.
- **Settings** — start date, restart & reschedule, theme, JSON backup/restore,
  CSV export, reset.

## When you break consistency

Missing days is expected over 60 days, so nothing about it is unrecoverable.
Three separate tools, in increasing order of severity:

**1. Re-anchor the calendar** (Settings, or the *Catch up* button on the
dashboard's behind-schedule banner). Slides the whole schedule so the day you're
genuinely on becomes today. **No ticks are cleared** — this only moves dates, so
you stop being told you're 34 days behind for work you never skipped. This is
usually the right answer. There's also *Shift everything +7 days*.

**2. Restart a stretch** (Settings). Pick a scope — one week, one phase, a single
day, everything from day N onward, or all 60 days — and clear just that range's
blocks and problems. A preview tells you exactly how many ticks will go before
you confirm. Your Redo List, Weakness sheet, mistake log, readiness scores, mock
scores, question-bank ticks and final checklist are all kept. Notes and logged
timer hours are kept unless you opt in to clearing them. There's also a
**↺ redo week** button on each week strip in the 60-Day Plan.

**3. Start the whole 60 days over** (Settings). All 240 blocks cleared and Day 1
becomes today — but you choose what carries forward. Your Redo List, your notes
and the mistakes you've already internalised are kept by default, because none
of that stops being true just because the calendar restarted.

## Practice links

Every problem carries **LC** and **GfG** pills — on the chips inside each day, and
on every row of the question banks. 1,282 linked items.

| | |
|---|---|
| **504** | direct LeetCode problem links |
| **193** | LeetCode search links |
| **1,224** | GeeksforGeeks links |

Why the split: ~900 slugs cannot be verified offline, and **a wrong deep link is
worse than no link**. So titles that are exactly LeetCode's own become direct
links; everything else becomes a site-search link, which always lands on the
right problem in one click and can never 404. Annotations are stripped from the
query, so *"Maximum Subarray (Kadane)"* still resolves to `maximum-subarray`.

- GFG-only classics (Aggressive Cows, 0/1 Knapsack, Minimum Platforms, Rat in a
  Maze, …) get **no** LeetCode link, because they aren't there.
- Theory banks (OS, DBMS, CN, OOP & Java) get **GfG only** — they're not coding
  problems.
- The HR bank gets no links.

**To upgrade a search link to a direct one:** add the exact LeetCode title to
`LC_VERIFIED` in `build_handbook.py` and re-run the build. That's the single place
link behaviour is decided.

## Momentum panel

The **✦** button at the bottom-left of the sidebar. It leads with a fact computed
from your own ticks — *"96 of 240 blocks. 40% of the programme is behind you"*,
*"5-day streak, your best is 7"*, *"3 problems from closing out Tier A"* — then a
seven-day activity strip, then a line from the handbook itself (a ground rule, the
closing three questions, or one of the mindset fixes from Part 9). Press `M`, or
hit **↻ Next** for another.

It also nudges once a day, at most: a small green dot on the button, and one
toast. Never more than that.

## Themes & readability

Ten themes (`T`, or Settings → Preferences) — five light, four dark:

| Light | | Dark | |
|---|---|---|---|
| **Light** | clean and bright | **Dark** | neutral near-black |
| **Paper** | warm cream, best for long reading | **Midnight** | deep navy |
| **Mist** | cool grey-blue, crisp | **Forest** | muted green |
| **Sage** | soft green, low glare | **Contrast** | maximum legibility |
| **Blush** | warm light, plum accent | | |

Plus **System**, which follows your OS.

Every theme is checked, not eyeballed. Each one defines the full 41-token set and
is held to: body ink ≥ 7:1 against its surface, muted ink ≥ 3:1, accent ≥ 3:1, and
the first step of the 60-day grid's ordinal ramp ≥ 2:1. Chart series colours stay
the validated colour-vision-safe set in every theme — the accent changes, the data
colours don't.

Text size has three settings, and body copy is capped to a comfortable line length
so a wide monitor doesn't hand you 200-character lines.

## Keyboard

| Key | Action |
|---|---|
| `Ctrl`/`Cmd` + `K` or `/` | Search everything (days, topics, sets, mistakes) |
| `1`–`9` | Jump to the nth sidebar tab |
| `G` | Go to today in the plan |
| `M` | Momentum panel |
| `T` | Theme picker |
| `Esc` | Close any panel |

## Seeing an old version after an update?

That's the browser cache, never your data. Fix it with a **hard reload:
`Ctrl`+`Shift`+`R`** (Mac: `Cmd`+`Shift`+`R`). A hard reload does not touch
localStorage.

Two things now prevent it:

- **Automatic cache busting.** `build_handbook.py` hashes the markdown plus every
  CSS/JS file and stamps `?v=<build-id>` onto all asset URLs in `index.html`. Any
  change produces a new URL, so browsers cannot serve stale code. Just re-run the
  build before you deploy. The current build id is shown in Settings → What's stored.
- **A rescue watchdog.** If the app hasn't mounted after 3.5 seconds, a
  dependency-free recovery screen appears with a **⭳ Download my progress** button
  that reads localStorage directly. Your data can never be trapped behind a blank
  page, no matter how badly a build breaks.

If you ever do need to clear site data: export first (Settings → Export backup, the
sidebar **⭳**, or the rescue screen), then restore with Settings → Import backup.
In a pinch, this console one-liner works on a completely broken page:

```js
(function(){var d=localStorage.getItem('handbook60.v1');
var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([d],{type:'application/json'}));
a.download='handbook60-rescue.json';a.click();})()
```

## Editing the handbook

The markdown is the single source of truth.

```
# edit 60_Day_Campus_Placement_Handbook_Java.md, then:
python build_handbook.py
```

The build prints a report and fails loudly if anything is missing:

```
days parsed       : 60  (expect 60)
day blocks        : 240
question banks    : 16  (929 items)
mistakes          : 100  (expect 100)
...
```

Progress is keyed by day number and item index, so it survives edits that
don't reorder or delete items. Reordering a list will shift the ticks in it.

## Files

```
60_Day_Campus_Placement_Handbook_Java.md   your handbook — the source of truth
build_handbook.py                          markdown → structured data
index.html                                 open this
assets/css/theme.css                       design tokens (light + dark)
assets/css/app.css                         layout & components
assets/js/data/handbook.data.js            GENERATED — do not edit by hand
assets/js/data/handbook.json               same payload, for inspection
assets/js/data/core/*.js                   core-subject Q&A, one hand-written file per subject
assets/js/core/util.js                     DOM & formatting helpers
assets/js/core/store.js                    persistence + all derived progress
assets/js/ui/render.js                     shared components (meters, rows, chips)
assets/js/ui/charts.js                     inline-SVG line chart + 60-day grid
assets/js/ui/momentum.js                   the motivation panel
assets/js/views/*.js                       one file per tab
assets/js/app.js                           shell, router, command palette
```

## Notes on the design

Colours come from a validated palette: the two-series chart passes
colour-vision-deficiency separation, the normal-vision floor and 3:1 contrast
in **both** light and dark modes. Progress is shown as meters and a hero
figure rather than donut rings, and the 60-day grid is a single-hue ordinal
ramp — so nothing depends on colour alone. Dark mode is a selected set of
steps, not an inverted flip.
