#!/usr/bin/env python3
"""
build_handbook.py — turns the 60-day handbook markdown into structured data
for the interactive web app.

Usage:
    python build_handbook.py

Reads : 60_Day_Campus_Placement_Handbook_Java.md
Writes: assets/js/data/handbook.data.js   (window.HANDBOOK = {...})
        assets/js/data/handbook.json      (same payload, for inspection)

Re-run this whenever you edit the markdown. Nothing in the app is hand-copied,
so the app can never drift from the source handbook.
"""

from __future__ import annotations

import html
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "60_Day_Campus_Placement_Handbook_Java.md"
OUT_DIR = ROOT / "assets" / "js" / "data"


# ---------------------------------------------------------------------------
# inline markdown -> html
# ---------------------------------------------------------------------------

def inline(text: str) -> str:
    """Convert inline markdown to safe HTML."""
    s = html.escape(text, quote=False)
    # code spans first so their contents are not touched by other rules
    holds: list[str] = []

    def hold(m: re.Match) -> str:
        holds.append(m.group(1))
        return f"\x00{len(holds) - 1}\x00"

    s = re.sub(r"`([^`]+)`", hold, s)
    s = re.sub(r"\*\*\*(.+?)\*\*\*", r"<strong><em>\1</em></strong>", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    for i, code in enumerate(holds):
        s = s.replace(f"\x00{i}\x00", f"<code>{code}</code>")
    return s


def plain(text: str) -> str:
    """Strip markdown markers, leaving readable plain text."""
    s = re.sub(r"`([^`]+)`", r"\1", text)
    s = re.sub(r"\*\*\*(.+?)\*\*\*", r"\1", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return s.strip()


def detag(text: str) -> str:
    """Plain text from a cell that was already run through inline().

    Strips tags *and* unescapes entities, so the value is safe to render with
    textContent (otherwise "&amp;" shows up literally in the UI).
    """
    return html.unescape(re.sub(r"<[^>]+>", "", text)).strip()


def slug(text: str) -> str:
    s = plain(text).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:60] or "x"


# ---------------------------------------------------------------------------
# block-level markdown -> render tree
# ---------------------------------------------------------------------------

def is_table_row(line: str) -> bool:
    return line.strip().startswith("|") and line.strip().endswith("|")


def split_row(line: str) -> list[str]:
    cells = line.strip().strip("|").split("|")
    return [c.strip() for c in cells]


def is_divider(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{2,}:?", c.replace(" ", "")) for c in cells)


def parse_blocks(lines: list[str]) -> list[dict]:
    """Turn a run of markdown lines into renderable blocks."""
    blocks: list[dict] = []
    i, n = 0, len(lines)

    while i < n:
        raw = lines[i]
        line = raw.rstrip()
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped in ("---", "***", "___"):
            i += 1
            continue

        # fenced code
        if stripped.startswith("```"):
            lang = stripped[3:].strip()
            i += 1
            buf: list[str] = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(lines[i].rstrip("\n"))
                i += 1
            i += 1
            blocks.append({"type": "code", "lang": lang, "text": "\n".join(buf)})
            continue

        # heading
        m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if m:
            level = len(m.group(1))
            blocks.append(
                {
                    "type": "heading",
                    "level": level,
                    "html": inline(m.group(2)),
                    "text": plain(m.group(2)),
                    "id": slug(m.group(2)),
                }
            )
            i += 1
            continue

        # table
        if is_table_row(line):
            rows = []
            while i < n and is_table_row(lines[i]):
                rows.append(split_row(lines[i]))
                i += 1
            head: list[str] = []
            body = rows
            if len(rows) >= 2 and is_divider(rows[1]):
                head = rows[0]
                body = rows[2:]
            blocks.append(
                {
                    "type": "table",
                    "head": [inline(c) for c in head],
                    "rows": [[inline(c) for c in r] for r in body],
                }
            )
            continue

        # blockquote
        if stripped.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", lines[i].rstrip()))
                i += 1
            inner = parse_blocks(buf)
            blocks.append({"type": "quote", "blocks": inner})
            continue

        # checklist / bullet / ordered list
        if re.match(r"^\s*[-*+]\s+\[[ xX]\]\s+", line):
            items = []
            while i < n and re.match(r"^\s*[-*+]\s+\[[ xX]\]\s+", lines[i]):
                t = re.sub(r"^\s*[-*+]\s+\[[ xX]\]\s+", "", lines[i].rstrip())
                items.append({"html": inline(t), "text": plain(t)})
                i += 1
            blocks.append({"type": "checklist", "items": items})
            continue

        if re.match(r"^\s*[-*+]\s+", line):
            items, cur = [], None
            while i < n:
                cand = lines[i].rstrip()
                if re.match(r"^\s*[-*+]\s+", cand) and not re.match(r"^\s*[-*+]\s+\[[ xX]\]", cand):
                    if cur is not None:
                        items.append(cur)
                    cur = re.sub(r"^\s*[-*+]\s+", "", cand)
                elif cand.strip() and cand.startswith(("  ", "\t")) and cur is not None:
                    cur += " " + cand.strip()
                else:
                    break
                i += 1
            if cur is not None:
                items.append(cur)
            blocks.append(
                {"type": "list", "ordered": False,
                 "items": [{"html": inline(t), "text": plain(t)} for t in items]}
            )
            continue

        if re.match(r"^\s*\d+\.\s+", line):
            items, cur = [], None
            while i < n:
                cand = lines[i].rstrip()
                if re.match(r"^\s*\d+\.\s+", cand):
                    if cur is not None:
                        items.append(cur)
                    cur = re.sub(r"^\s*\d+\.\s+", "", cand)
                elif cand.strip() and cand.startswith(("  ", "\t")) and cur is not None:
                    cur += " " + cand.strip()
                else:
                    break
                i += 1
            if cur is not None:
                items.append(cur)
            blocks.append(
                {"type": "list", "ordered": True,
                 "items": [{"html": inline(t), "text": plain(t)} for t in items]}
            )
            continue

        # paragraph
        buf = []
        while i < n:
            cand = lines[i].rstrip()
            s = cand.strip()
            if (not s or s.startswith(("#", ">", "```", "---"))
                    or is_table_row(cand) or re.match(r"^\s*([-*+]|\d+\.)\s+", cand)):
                break
            buf.append(s)
            i += 1
        text = " ".join(buf)
        if text:
            blocks.append({"type": "para", "html": inline(text), "text": plain(text)})

    return blocks


# ---------------------------------------------------------------------------
# document structure
# ---------------------------------------------------------------------------

def read_source() -> list[str]:
    if not SRC.exists():
        sys.exit(f"! source markdown not found: {SRC}")
    return SRC.read_text(encoding="utf-8").split("\n")


def find_parts(lines: list[str]) -> list[dict]:
    """Split the doc into top-level '# ' chunks, then '## ' sections."""
    marks = [(i, l.strip()) for i, l in enumerate(lines) if re.match(r"^#\s+\S", l)]
    chunks = []
    for idx, (start, title) in enumerate(marks):
        end = marks[idx + 1][0] if idx + 1 < len(marks) else len(lines)
        chunks.append({"title": re.sub(r"^#\s+", "", title), "start": start, "end": end})

    parts = []
    for c in chunks:
        body = lines[c["start"] + 1: c["end"]]
        secs = [(i, l.strip()) for i, l in enumerate(body) if re.match(r"^##\s+\S", l)]
        sections = []
        preamble_end = secs[0][0] if secs else len(body)
        for j, (s, stitle) in enumerate(secs):
            e = secs[j + 1][0] if j + 1 < len(secs) else len(body)
            sections.append(
                {
                    "title": re.sub(r"^##\s+", "", stitle),
                    "lines": body[s + 1: e],
                }
            )
        parts.append(
            {
                "title": c["title"],
                "preamble": body[:preamble_end],
                "sections": sections,
                "lines": body,
            }
        )
    return parts


def part_number(title: str) -> int | None:
    m = re.match(r"^PART\s+(\d+)", plain(title))
    return int(m.group(1)) if m else None


# ---------------------------------------------------------------------------
# Part 3 — the 60-day plan
# ---------------------------------------------------------------------------

SLOT_RE = re.compile(
    r"^\s*[-*]\s*\*\*(Morning|Afternoon|Evening|Night)\s*(?:\(([^)]*)\))?\s*:?\*\*\s*:?\s*(.*)$"
)
DAY_RE = re.compile(r"^###\s+Day\s+(\d+)\s*[—–-]\s*(.*)$")
PHASE_RE = re.compile(r"^##\s+PHASE\s+(\d+)\s*[—–-]\s*(.*)$")

# problem-list extraction inside a day block
SOLVE_RE = re.compile(
    r"(?:Solve|Emphasise|Solve \*\*all\s*\d+\*\*)[^:.]{0,60}?:\s*(.+)", re.IGNORECASE
)
DIFF_TRAIL = re.compile(
    r"\s*\((?:E|M|H|H-ish M|M\s*[—–-][^)]*|H\s*[—–-][^)]*|E\s*[—–-][^)]*|"
    r"redo|redo unaided|unaided redo|difference array|bitmask version|"
    r"implement|H,\s*n[^)]*|[^)]{0,40})\)\s*$",
    re.IGNORECASE,
)
ROMAN_ONLY = re.compile(r"^(?:I{1,3}|IV|V|VI{0,3}|IX|X)$")


def clean_problem(raw: str) -> str:
    s = plain(raw).strip()
    s = s.strip(" .;")
    # drop leading connectors
    s = re.sub(r"^(?:and|plus|then|also)\s+", "", s, flags=re.IGNORECASE)
    # drop a trailing parenthetical annotation
    prev = None
    while prev != s:
        prev = s
        s = DIFF_TRAIL.sub("", s).strip()
    # drop a bare difficulty marker sitting mid-name
    s = re.sub(r"\s*\((?:E|M|H)\)\s*", " ", s)
    # " — do the partition method properly" is an instruction, not part of the title
    s = re.sub(r"\s+[—–]\s+[a-z].*$", "", s)
    return re.sub(r"\s{2,}", " ", s).strip(" .;")


def extract_problems(text: str) -> list[str]:
    """Pull individual problem names out of 'Solve **4M**: A, B, C.' segments."""
    out: list[str] = []
    for m in SOLVE_RE.finditer(text):
        seg = m.group(1)
        # a problem list never contains a sentence break
        cut = re.search(r"\.\s+(?=[A-Z*`])", seg)
        if cut:
            seg = seg[: cut.start()]
        seg = re.sub(r"\*\*Focus.*$", "", seg)
        pieces = [p for p in re.split(r",\s*", seg) if p.strip()]
        base = ""
        for piece in pieces:
            name = clean_problem(piece)
            if not name or len(name) > 90:
                continue
            low = name.lower()
            if low.startswith(("pattern", "focus", "target", "plus redo", "practise",
                               "write ", "then ", "for each", "draw ", "awareness")):
                continue
            # "Stock I, II, III, IV, with Cooldown" -> expand using the base name
            if ROMAN_ONLY.match(name) or low.startswith("with "):
                if base:
                    name = f"{base} {name}"
                else:
                    continue
            else:
                base = re.sub(r"\s+(?:I{1,3}|IV|V)(?:/(?:I{1,3}|IV|V))*$", "", name).strip()
            if name not in out:
                out.append(name)
    return out


def parse_days(part: dict) -> tuple[list[dict], list[dict]]:
    lines = part["lines"]
    phases: list[dict] = []
    days: list[dict] = []

    cur_phase: dict | None = None
    i, n = 0, len(lines)
    intro_blocks: list[dict] = []

    while i < n:
        line = lines[i].rstrip()

        pm = PHASE_RE.match(line)
        if pm:
            title = plain(pm.group(2))
            rng = re.search(r"Days?\s*(\d+)\s*[–—-]\s*(\d+)", title)
            goal = ""
            j = i + 1
            while j < n and not lines[j].strip():
                j += 1
            if j < n and lines[j].strip().startswith("*") and not lines[j].strip().startswith("**"):
                goal = plain(lines[j].strip())
            cur_phase = {
                "num": int(pm.group(1)),
                "id": f"phase-{pm.group(1)}",
                "name": title,
                "goal": goal,
                "from": int(rng.group(1)) if rng else None,
                "to": int(rng.group(2)) if rng else None,
            }
            phases.append(cur_phase)
            i += 1
            continue

        dm = DAY_RE.match(line)
        if dm:
            num = int(dm.group(1))
            head = dm.group(2)
            hours = None
            hm = re.search(r"·\s*([\d.]+)\s*h", head)
            if hm:
                hours = float(hm.group(1))
            title = plain(re.sub(r"·\s*[\d.]+\s*h.*$", "", head)).strip(" ·")
            note = ""
            nm = re.search(r"·\s*[\d.]+\s*h\s*(.*)$", head)
            if nm:
                note = plain(nm.group(1)).strip("() ")
            is_consol = "CONSOLIDATION" in plain(head).upper()

            # collect the day's bullet lines
            i += 1
            body: list[str] = []
            while i < n:
                nxt = lines[i].rstrip()
                if DAY_RE.match(nxt) or PHASE_RE.match(nxt) or re.match(r"^#{1,2}\s+\S", nxt):
                    break
                body.append(nxt)
                i += 1

            blocks: list[dict] = []
            k = 0
            while k < len(body):
                sm = SLOT_RE.match(body[k])
                if not sm:
                    k += 1
                    continue
                slot = sm.group(1)
                dur = sm.group(2) or ""
                text = sm.group(3)
                k += 1
                while k < len(body) and body[k].strip() and not SLOT_RE.match(body[k]):
                    text += " " + body[k].strip()
                    k += 1
                bh = None
                bhm = re.search(r"([\d.]+)\s*h", dur)
                if bhm:
                    bh = float(bhm.group(1))
                txt = text.strip()
                mocks = [
                    {"kind": g[0].upper(), "n": int(g[1])}
                    for g in re.findall(r"Mock\s+(OA|Interview)\s*#(\d+)", plain(txt), re.I)
                ]
                blocks.append(
                    {
                        "id": f"d{num}-{slot[:2].lower()}",
                        "slot": slot,
                        "hours": bh,
                        "html": inline(txt),
                        "text": plain(txt),
                        "problems": extract_problems(txt),
                        "mocks": mocks,
                    }
                )

            week = min(9, math.ceil(num / 7))
            days.append(
                {
                    "day": num,
                    "title": title,
                    "note": note,
                    "hours": hours,
                    "isConsolidation": is_consol,
                    "phase": cur_phase["id"] if cur_phase else None,
                    "phaseName": cur_phase["name"] if cur_phase else "",
                    "week": week,
                    "blocks": blocks,
                }
            )
            continue

        intro_blocks.append(line)
        i += 1

    part["intro"] = parse_blocks(intro_blocks)
    return phases, days


# ---------------------------------------------------------------------------
# Part 6 — question banks
# ---------------------------------------------------------------------------

NUM_SPLIT = re.compile(r"\s+(?=\d{1,3}\.\s)")


def split_numbered_inline(text: str) -> list[str]:
    """'1. Two Sum 2. Best Time...' -> ['Two Sum', 'Best Time...']"""
    t = text.strip()
    if not re.match(r"^\d{1,3}\.\s", t):
        return []
    out = []
    for piece in NUM_SPLIT.split(t):
        item = re.sub(r"^\d{1,3}\.\s*", "", piece).strip(" .")
        if item:
            out.append(plain(item))
    return out


def parse_banks(part: dict) -> list[dict]:
    banks = []
    for sec in part["sections"]:
        title = plain(sec["title"])
        m = re.match(r"^(\d+\.\d+)\s+(.*)$", title)
        code = m.group(1) if m else slug(title)
        name = m.group(2) if m else title
        tiers: list[dict] = []
        cur = {"name": "All", "note": "", "items": []}
        for raw in sec["lines"]:
            line = raw.strip()
            if not line or line in ("---",):
                continue
            tm = re.match(r"^\*\*(Tier\s+[A-C][^*]*)\*\*\s*(.*)$", line)
            if tm:
                if cur["items"]:
                    tiers.append(cur)
                label = plain(tm.group(1))
                cur = {"name": label, "note": plain(tm.group(2)).strip("— "), "items": []}
                continue
            items = split_numbered_inline(line)
            if items:
                cur["items"].extend(items)
            elif line.startswith("*") and not cur["items"] and not cur["note"]:
                cur["note"] = plain(line)
        if cur["items"]:
            tiers.append(cur)
        total = sum(len(t["items"]) for t in tiers)
        if total:
            banks.append(
                {
                    "id": f"bank-{code.replace('.', '-')}",
                    "code": code,
                    "title": name,
                    "tiers": tiers,
                    "count": total,
                }
            )
    return banks


# ---------------------------------------------------------------------------
# Part 7 — mocks, Part 8 — checklist, Part 9 — mistakes
# ---------------------------------------------------------------------------

def parse_mocks(part: dict) -> dict:
    schedule: list[dict] = []
    rubric: list[dict] = []
    for sec in part["sections"]:
        for b in parse_blocks(sec["lines"]):
            if b["type"] != "table":
                continue
            head = [detag(h) for h in b["head"]]
            if head[:2] == ["#", "Day"]:
                for r in b["rows"]:
                    cells = [detag(c) for c in r]
                    if len(cells) >= 5 and cells[0].isdigit():
                        schedule.append(
                            {
                                "n": int(cells[0]),
                                "day": int(re.sub(r"\D", "", cells[1]) or 0),
                                "type": cells[2],
                                "format": cells[3],
                                "focus": cells[4],
                            }
                        )
            elif head and head[0].lower() == "dimension":
                for r in b["rows"]:
                    cells = [detag(c) for c in r]
                    if len(cells) >= 2:
                        rubric.append({"name": cells[0], "five": cells[1]})
    # mock OA days, from the sentence that lists them
    oa_days: list[int] = []
    txt = " ".join(part["lines"])
    om = re.search(r"Plus\s+(\d+)\s+Mock OAs\*{0,2}\s*\(Days?([^)]*)\)", txt)
    if om:
        oa_days = [int(x) for x in re.findall(r"\d+", om.group(2))]
    return {"schedule": schedule, "rubric": rubric, "oaDays": oa_days}


def parse_checklist(part: dict) -> list[dict]:
    groups = []
    for sec in part["sections"]:
        items = []
        for raw in sec["lines"]:
            m = re.match(r"^\s*[-*+]\s+\[[ xX]\]\s+(.*)$", raw.rstrip())
            if m:
                items.append({"html": inline(m.group(1)), "text": plain(m.group(1))})
        if items:
            groups.append(
                {
                    "id": f"chk-{slug(sec['title'])}",
                    "title": plain(sec["title"]),
                    "items": items,
                }
            )
    return groups


def parse_mistakes(part: dict) -> list[dict]:
    out = []
    for sec in part["sections"]:
        group = plain(sec["title"])
        for raw in sec["lines"]:
            line = raw.strip()
            m = re.match(r"^(\d+)\.\s+(.*)$", line)
            if not m:
                continue
            num = int(m.group(1))
            body = m.group(2)
            if "→" in body:
                bad, fix = body.split("→", 1)
            else:
                bad, fix = body, ""
            out.append(
                {
                    "n": num,
                    "group": group,
                    "mistake": inline(bad.strip()),
                    "mistakeText": plain(bad),
                    "fix": inline(fix.strip()),
                    "fixText": plain(fix),
                }
            )
    return sorted(out, key=lambda x: x["n"])


# ---------------------------------------------------------------------------
# Part 1 extras — DSA master table, topic deep dives, curated must-know lists
# ---------------------------------------------------------------------------

def parse_dsa_master(part: dict) -> list[dict]:
    for sec in part["sections"]:
        if not plain(sec["title"]).startswith("1.1 "):
            continue
        for b in parse_blocks(sec["lines"]):
            if b["type"] == "table" and detag(b["head"][0] if b["head"] else "") == "#":
                rows = []
                for r in b["rows"]:
                    c = [detag(x) for x in r]
                    if len(c) < 7 or not c[0].isdigit():
                        continue
                    q = re.sub(r"\D", "", c[5]) or "0"
                    rows.append(
                        {
                            "n": int(c[0]),
                            "topic": c[1],
                            "importance": c[2],
                            "frequency": c[3],
                            "difficulty": c[4],
                            "q": int(q),
                            "tier": c[6],
                        }
                    )
                return rows
    return []


def parse_dsa_topics(part: dict) -> list[dict]:
    topics = []
    for sec in part["sections"]:
        if not plain(sec["title"]).startswith("1.2 "):
            continue
        cur = None
        for raw in sec["lines"]:
            line = raw.rstrip()
            m = re.match(r"^###\s+(\d+)\.\s+(.*)$", line.strip())
            if m:
                if cur:
                    topics.append(cur)
                head = plain(m.group(2))
                bits = [b.strip() for b in head.split("·")]
                lead = bits[0].split("—")
                cur = {
                    "n": int(m.group(1)),
                    "name": lead[0].strip(),
                    "importance": lead[1].strip() if len(lead) > 1 else "",
                    "meta": " · ".join(bits[1:]) if len(bits) > 1 else "",
                    "blocks": [],
                    "raw": [],
                }
                continue
            if cur is not None:
                cur["raw"].append(line)
        if cur:
            topics.append(cur)

    # Each "**Label:** ..." line is its own field; anything else (tables, notes)
    # falls through to the generic block renderer.
    for t in topics:
        raw = t.pop("raw")
        fields: list[dict] = []
        rest: list[str] = []
        for line in raw:
            fm = re.match(r"^\*\*(.{2,40}?):?\*\*\s*(.+)$", line.strip())
            if fm and not line.strip().startswith("|"):
                fields.append(
                    {"label": plain(fm.group(1)), "html": inline(fm.group(2)),
                     "text": plain(fm.group(2))}
                )
                rest.append("")
            else:
                rest.append(line)
        t["fields"] = fields
        t["blocks"] = parse_blocks(rest)
    return topics


def find_section(part: dict, prefix: str) -> dict | None:
    for sec in part["sections"]:
        if plain(sec["title"]).startswith(prefix):
            return sec
    return None


def list_after(lines: list[str], marker: str) -> list[str]:
    """The numbered list that follows a '**...marker...:**' lead-in line.

    The lead-in and the list may share a line or sit on consecutive lines.
    """
    for idx, raw in enumerate(lines):
        if marker not in raw:
            continue
        same = split_numbered_inline(re.sub(r"^.*?:\*\*\s*", "", raw.strip()))
        if same:
            return same
        for nxt in lines[idx + 1: idx + 4]:
            items = split_numbered_inline(nxt.strip())
            if items:
                return items
    return []


def curated_lists(part1: dict) -> list[dict]:
    """Extra checkable banks for the explicitly enumerated must-know lists."""
    out: list[dict] = []

    def add(bid, code, title, items, note=""):
        items = [i for i in items if i]
        if items:
            out.append(
                {
                    "id": bid,
                    "code": code,
                    "title": title,
                    "tiers": [{"name": "All", "note": note, "items": items}],
                    "count": len(items),
                }
            )

    # 12 design patterns (table in 1.7)
    sec = find_section(part1, "1.7 ")
    if sec:
        for b in parse_blocks(sec["lines"]):
            if b["type"] == "table" and b["head"] and detag(b["head"][0]) == "Pattern":
                names = [
                    f"{detag(r[0])} — {detag(r[2])}" if len(r) > 2 else detag(r[0])
                    for r in b["rows"]
                ]
                add("bank-patterns", "LLD", "12 Design Patterns", names,
                    "Name it, explain it, code a minimal example.")
        add("bank-lld", "LLD", "15 LLD Problems",
            list_after(sec["lines"], "LLD problems to prepare"),
            "Design end-to-end, in this order.")

    # 12 HLD problems
    sec = find_section(part1, "1.8 ")
    if sec:
        add("bank-hld", "HLD", "12 HLD Problems",
            list_after(sec["lines"], "HLD problems to prepare"),
            "URL shortener first, and perfectly.")

    # 20 SQL archetypes
    sec = find_section(part1, "1.10 ")
    if sec:
        add("bank-sqlarch", "SQL", "20 SQL Archetypes",
            list_after(sec["lines"], "SQL interview archetypes"),
            "Writable blind.")

    # 12 DP families (table under topic 22 in 1.2)
    sec = find_section(part1, "1.2 ")
    if sec:
        for b in parse_blocks(sec["lines"]):
            if b["type"] == "table" and b["head"] and detag(b["head"][0]) == "Family":
                names = [f"{detag(r[0])} — {detag(r[1])}" for r in b["rows"] if len(r) > 1]
                add("bank-dpfam", "DP", "12 DP Families", names,
                    "Name each + one problem + the recurrence.")

    # 8 STAR stories
    sec = find_section(part1, "1.14 ")
    if sec:
        add("bank-star", "HR", "8 STAR Stories",
            list_after(sec["lines"], "story bank"),
            "Written, rehearsed, 90–120 seconds each.")
    return out


# ---------------------------------------------------------------------------
# Part 10 — readiness scoring
# ---------------------------------------------------------------------------

def parse_readiness(part: dict) -> dict:
    dims: list[dict] = []
    bands: list[dict] = []
    trajectory: list[dict] = []
    hours: list[dict] = []
    for sec in part["sections"]:
        for b in parse_blocks(sec["lines"]):
            if b["type"] != "table":
                continue
            head = [detag(h) for h in b["head"]]
            if head[:2] == ["#", "Dimension"]:
                for r in b["rows"]:
                    c = [detag(x) for x in r]
                    if len(c) >= 3 and c[0].isdigit():
                        dims.append({"n": int(c[0]), "name": c[1], "how": c[2]})
            elif head[:1] == ["Total"]:
                for r in b["rows"]:
                    c = [detag(x) for x in r]
                    if len(c) >= 3:
                        lo, hi = (re.findall(r"\d+", c[0]) + ["0", "100"])[:2]
                        bands.append({"from": int(lo), "to": int(hi), "label": c[1], "action": c[2]})
            elif head and head[0].lower().startswith("end of week"):
                weeks = head[1:]
                vals = [plain(x) for x in b["rows"][0][1:]] if b["rows"] else []
                for w, v in zip(weeks, vals):
                    num = re.sub(r"\D", "", w)
                    trajectory.append(
                        {
                            "label": w,
                            "week": int(num) if num and "Day" not in w else 10,
                            "target": int(re.sub(r"\D", "", v) or 0),
                        }
                    )
            elif head[:1] == ["Block"]:
                for r in b["rows"]:
                    c = [detag(x) for x in r]
                    if len(c) >= 3 and not c[0].startswith("Total"):
                        hours.append(
                            {"block": c[0], "hours": int(re.sub(r"\D", "", c[1]) or 0), "share": c[2]}
                        )
    return {"dimensions": dims, "bands": bands, "trajectory": trajectory, "hoursBudget": hours}


def parse_milestones(part4: dict) -> list[dict]:
    out = []
    for sec in part4["sections"] or []:
        pass
    for b in parse_blocks(part4["lines"]):
        if b["type"] == "table" and b["head"] and plain(b["head"][0]) == "Week":
            for r in b["rows"]:
                c = [plain(x) for x in r]
                if len(c) >= 4 and c[0].isdigit():
                    out.append(
                        {
                            "week": int(c[0]),
                            "days": c[1],
                            "milestone": c[2],
                            "cumulative": c[3],
                        }
                    )
    return out


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main() -> None:
    lines = read_source()
    parts = find_parts(lines)

    doc = parts[0] if parts else {"title": "Handbook", "preamble": [], "sections": [], "lines": []}
    meta = {"title": plain(doc["title"]), "subtitle": "", "facts": []}
    for raw in doc["preamble"][:8]:
        s = raw.strip()
        if s.startswith("### "):
            meta["subtitle"] = plain(s[4:])
        elif s.startswith("**"):
            for chunk in re.split(r"\s+·\s+", s):
                cm = re.match(r"^\*\*(.+?):?\*\*\s*(.*)$", chunk.strip())
                if cm:
                    meta["facts"].append({"label": plain(cm.group(1)), "value": plain(cm.group(2))})

    ground_rules = []
    reference: list[dict] = []
    days: list[dict] = []
    phases: list[dict] = []
    banks: list[dict] = []
    mocks: dict = {"schedule": [], "rubric": [], "oaDays": []}
    checklist: list[dict] = []
    mistakes: list[dict] = []
    readiness: dict = {}
    milestones: list[dict] = []
    dsa_master: list[dict] = []
    dsa_topics: list[dict] = []
    how_to_read = []

    for sec in doc["sections"]:
        t = plain(sec["title"]).upper()
        if t.startswith("GROUND RULES"):
            for b in parse_blocks(sec["lines"]):
                if b["type"] == "list":
                    for i, it in enumerate(b["items"], 1):
                        txt = it["text"]
                        head = txt.split(".")[0] if "." in txt else txt
                        ground_rules.append(
                            {"n": i, "title": plain(head), "html": it["html"], "text": txt}
                        )
    for b in parse_blocks(doc["preamble"]):
        if b["type"] == "quote":
            how_to_read = b["blocks"]

    part1 = None
    for p in parts[1:]:
        num = part_number(p["title"])
        title = plain(p["title"])
        if num == 3:
            phases, days = parse_days(p)
            reference.append(
                {
                    "id": "part-3",
                    "num": 3,
                    "title": title,
                    "kind": "plan",
                    "blocks": p.get("intro", []),
                }
            )
            continue
        if num == 6:
            banks = parse_banks(p)
            reference.append(
                {"id": "part-6", "num": 6, "title": title, "kind": "banks",
                 "blocks": parse_blocks(p["preamble"])}
            )
            continue
        if num == 7:
            mocks = parse_mocks(p)
        if num == 8:
            checklist = parse_checklist(p)
        if num == 9:
            mistakes = parse_mistakes(p)
        if num == 10:
            readiness = parse_readiness(p)
        if num == 4:
            milestones = parse_milestones(p)
        if num == 1:
            part1 = p
            dsa_master = parse_dsa_master(p)
            dsa_topics = parse_dsa_topics(p)

        sections = []
        for sec in p["sections"]:
            stitle = plain(sec["title"])
            if num == 1 and stitle.startswith("1.2 "):
                sections.append(
                    {
                        "id": slug(stitle),
                        "title": stitle,
                        "kind": "dsa-topics",
                        "blocks": parse_blocks(sec["lines"][:4]),
                    }
                )
                continue
            sections.append(
                {
                    "id": slug(stitle),
                    "title": stitle,
                    "kind": "generic",
                    "blocks": parse_blocks(sec["lines"]),
                }
            )
        reference.append(
            {
                "id": f"part-{num}" if num else slug(title),
                "num": num,
                "title": title,
                "kind": "generic",
                "blocks": parse_blocks(p["preamble"]),
                "sections": sections,
            }
        )

    if part1:
        banks = curated_lists(part1) + banks

    payload = {
        "meta": meta,
        "howToRead": how_to_read,
        "groundRules": ground_rules,
        "phases": phases,
        "days": days,
        "weeks": milestones,
        "banks": banks,
        "mocks": mocks,
        "checklist": checklist,
        "mistakes": mistakes,
        "readiness": readiness,
        "dsaMaster": dsa_master,
        "dsaTopics": dsa_topics,
        "reference": reference,
        "source": SRC.name,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    js = "/* generated by build_handbook.py — do not edit by hand */\n"
    js += "window.HANDBOOK = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (OUT_DIR / "handbook.data.js").write_text(js, encoding="utf-8")
    (OUT_DIR / "handbook.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8"
    )

    # ---- report ----
    blocks_total = sum(len(d["blocks"]) for d in days)
    probs = sum(len(b["problems"]) for d in days for b in d["blocks"])
    bank_items = sum(b["count"] for b in banks)
    chk_items = sum(len(g["items"]) for g in checklist)
    print(f"source            : {SRC.name}")
    print(f"days parsed       : {len(days)}  (expect 60)")
    print(f"day blocks        : {blocks_total}")
    print(f"day problem chips : {probs}")
    print(f"phases            : {len(phases)}")
    print(f"question banks    : {len(banks)}  ({bank_items} items)")
    print(f"mock schedule     : {len(mocks['schedule'])}  + OA days {mocks['oaDays']}")
    print(f"rubric dimensions : {len(mocks['rubric'])}")
    print(f"checklist         : {len(checklist)} groups / {chk_items} items")
    print(f"mistakes          : {len(mistakes)}  (expect 100)")
    print(f"readiness dims    : {len(readiness.get('dimensions', []))}")
    print(f"dsa master rows   : {len(dsa_master)}   deep dives: {len(dsa_topics)}")
    print(f"reference parts   : {len(reference)}")
    print(f"weeks/milestones  : {len(milestones)}")
    out = OUT_DIR / "handbook.data.js"
    print(f"written           : {out.relative_to(ROOT)}  ({out.stat().st_size/1024:.0f} KB)")

    missing = [d for d in range(1, 61) if d not in {x['day'] for x in days}]
    if missing:
        print(f"!! missing days: {missing}")
    empty = [d["day"] for d in days if not d["blocks"]]
    if empty:
        print(f"!! days with no blocks: {empty}")


if __name__ == "__main__":
    main()
