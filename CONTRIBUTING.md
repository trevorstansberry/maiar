# Contributing to Maiar

Maiar is a team-shared marketing workspace. This guide explains how to contribute skills, improve context files, and add integrations.

---

## For the Marketing Team

### Keeping Context Up to Date

Context files in `context/` are the most important files in this repo. They ensure every output is brand-accurate.

**Update context when:**
- Brand voice or messaging evolves
- New products or pricing tiers are added
- Competitor landscape shifts
- New channels are activated
- Goals or KPIs change for the quarter

**How to update:**
1. Edit the relevant file in `context/`
2. Commit with a descriptive message: `update brand-voice: added enterprise persona notes`
3. Notify the team to `git pull` before their next session

**Golden rule:** Always `git pull` before starting a session to get the latest context.

---

## Adding a New Skill

Skills live in `.claude/skills/[skill-name]/SKILL.md`. Each skill is a self-contained expertise document.

### Skill Format

```markdown
---
name: your-skill-name
description: When to use this skill (1-2 sentences, 50-200 characters). This is how Claude knows when to activate it.
---

# Skill Title

## Core Philosophy
[The underlying principle that guides this skill]

## [Section 1]
[Content]

## [Section 2]
[Content]

## Related Skills
`skill-one`, `skill-two`, `skill-three`
```

### Skill Guidelines

- Keep under 500 lines
- Be specific and actionable — include frameworks, templates, checklists, and benchmarks
- Avoid generic advice ("write good content") — include the concrete how
- The `description:` frontmatter is critical — it must clearly describe when the skill should activate
- Add "Related Skills" at the bottom to improve skill chaining

### Contributing a Skill

1. Create `.claude/skills/[your-skill-name]/SKILL.md`
2. Follow the format above
3. Test it: open Maiar in Claude Code and ask a question the skill should answer
4. Submit a PR with a brief description of what the skill covers

---

## Adding a New Integration

Integrations live in `.claude/integrations/`. Adding a new one is straightforward.

### Steps

1. Copy `.claude/integrations/_template.md` to `.claude/integrations/[platform-name].md`
2. Fill in the platform-specific API details (auth, endpoints, field mapping)
3. Add the required `.env` keys to `.env.example` with descriptions
4. Test the integration end-to-end before submitting a PR
5. Update the integrations table in `CLAUDE.md`

---

## Adding or Improving Commands

Commands live in `.claude/commands/`. They are the user-facing interface.

### Command Guidelines

- Command files are markdown with YAML frontmatter (`description:`)
- The `description:` field is shown in Claude Code's command picker — make it clear
- Commands should explain what they do, what context they read, and what they output
- End every command file with a brief instruction paragraph (after the `---`) that tells Claude what to actually do when the command is invoked
- Keep commands focused on orchestration — complex logic lives in agents and skills

---

## Git Workflow

### What to Commit

| Path | Commit? | Notes |
|---|---|---|
| `context/` | Yes | Team-shared brand knowledge |
| `.claude/skills/` | Yes | Shared expertise |
| `.claude/agents/` | Yes | Shared agents |
| `.claude/commands/` | Yes | Shared commands |
| `.claude/integrations/` | Yes | Integration scaffolds |
| `drafts/` | Optional | Remove from `.gitignore` to share drafts |
| `published/` | Optional | Remove from `.gitignore` to version published content |
| `.env` | Never | Contains credentials |
| `research/` | Optional | Useful to share research briefs |
| `campaigns/` | Yes | Share campaign plans with the team |

### Commit Message Convention

```
[area]: short description

Examples:
context: update competitor analysis with new HubSpot positioning
skills: add account-based-marketing skill
commands: improve /campaign to include budget allocation section
integrations: add Contentful scaffold
```

---

## Questions or Issues

Open an issue in the GitHub repo or reach out to whoever manages Maiar for your team.
