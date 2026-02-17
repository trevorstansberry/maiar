---
description: Save session progress to progress.md. Run at the end of any working session to record what was built, decided, or changed.
---

# /save

Record what happened in this session to `progress.md`. Run this before ending any working session.

## Usage

```
/save
```

No arguments needed. The command reads the current conversation and infers what to record.

## What Happens

1. **Reviews the conversation** — scans what was built, created, modified, or decided this session
2. **Reads `progress.md`** — understands the current state before making changes
3. **Updates the Current State table** — marks newly completed items ✅, adds rows for new work
4. **Appends a session entry** to the `## Session Log` section (creates it if it doesn't exist yet)
5. **Updates Next Steps** — removes completed items, adds any new ones surfaced this session
6. **Confirms** what was saved with a brief summary

## What Gets Captured

- Files created or modified (with their purpose)
- Architectural or design decisions made
- Commands, agents, or skills added or changed
- Status changes on items already in the tracker
- New next steps or blockers identified

## What Does NOT Get Captured

- Marketing content generated (blog posts, emails, social copy) — those belong in `drafts/`
- Exploratory conversation that didn't result in a concrete output
- Speculative plans not yet acted on

## Session Entry Format

Each session appends one entry in this format:

```
### YYYY-MM-DD — [one-line summary of what this session accomplished]

**Done:**
- [item 1]
- [item 2]

**Decisions:**
- [any architectural, design, or process decisions made]

**Next:**
- [immediate next steps — pick up here next session]
```

## Notes

- Always updates `progress.md` in place — never overwrites the whole file, only appends and updates relevant sections
- If nothing meaningful was done this session, say so briefly — a short entry is better than no entry
- Safe to run multiple times in a session — subsequent saves update the same session entry rather than creating duplicates

---

Read the current conversation carefully. Identify everything that was built, created, changed, or decided. Read `progress.md` to understand the current state. Then:

1. Update the Current State table — mark completed items ✅ and add any new rows for work done this session
2. Update Next Steps — remove what's done, add what's new
3. Append a dated session entry under `## Session Log` (create the section if it doesn't exist)
4. Write all changes to `progress.md`
5. Confirm to the user: "Saved. Here's what was recorded:" followed by a brief bulleted list of what was captured
