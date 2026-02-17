# Maiar — Project Progress

## What Is Maiar

An all-in-one marketing workspace for Claude Code. It covers every major marketing discipline through commands, agents, and skills backed by a shared brand/audience context layer. Built for marketing teams to clone from GitHub, pull latest, and work from the same intelligence.

---

## What We Built

### Foundation

| File | Purpose |
|---|---|
| `CLAUDE.md` | Architecture guide and command reference for Claude Code |
| `README.md` | Project overview and command reference for humans |
| `QUICK-START.md` | 3-step setup guide |
| `CONTRIBUTING.md` | Team workflow and contribution guide |
| `.gitignore` | Excludes credentials and optional work-in-progress folders |
| `.env.example` | Credentials template for all publishing integrations |

### Context System — Two-tier architecture

Upgraded from a flat 11-file structure to a two-tier company + product model. Supports single-product and multi-product businesses from one repo.

**Registry:**

| File | Purpose |
|---|---|
| `context/products.md` | Product registry — lists all products, sets the default |

**Company context (`context/company/`) — shared across all products:**

| File | Purpose |
|---|---|
| `brand-voice.md` | Tone, messaging pillars, personality, examples |
| `brand-guidelines.md` | Brand name usage, writing standards, compliance |
| `style-guide.md` | Grammar, formatting, terminology preferences |
| `content-examples.md` | Style reference examples (optional if product-level sufficient) |
| `competitors.md` | Shared competitive set *(optional — only if all products compete with same companies)* |
| `positioning.md` | Company-wide positioning *(optional — only if unified brand positioning applies)* |

**Product context (`context/products/[slug]/`) — one folder per product:**

| File | Purpose |
|---|---|
| `overview.md` | What this product does, pricing, differentiators, proof points |
| `audience-profiles.md` | ICP, buyer personas, segments for this product |
| `goals-kpis.md` | Marketing goals and success metrics for this product |
| `channels.md` | Active channels and social handles for this product |
| `competitors.md` | Competitive set *(optional — only if different from company-wide)* |
| `positioning.md` | Positioning statement and message hierarchy *(optional)* |
| `seo-guidelines.md` | Keyword targets and content standards for this product |
| `internal-links-map.md` | Site architecture for this product |
| `content-examples.md` | Product-specific style examples *(optional — add when audiences differ significantly)* |

**Template:** `context/products/_template/` — copy to add a new product.

### Skills — 52 total in `.claude/skills/`

**Ported from Corey Haines (25 — exact originals):**
ab-test-setup, analytics-tracking, competitor-alternatives, content-strategy, copy-editing, copywriting, email-sequence, form-cro, free-tool-strategy, launch-strategy, marketing-ideas, marketing-psychology, onboarding-cro, page-cro, paid-ads, paywall-upgrade-cro, popup-cro, pricing-strategy, product-marketing-context, programmatic-seo, referral-program, schema-markup, seo-audit, signup-flow-cro, social-content

**Ported from SEOMachine (1):**
growth-lead

**Newly authored — one per marketing discipline (26):**
abm, affiliate-marketing, b2b-marketing, b2c-marketing, brand-marketing, cause-marketing, community-marketing, content-marketing, conversational-marketing, direct-mail, email-marketing, events-experiential, field-marketing, growth-marketing, guerrilla-marketing, inbound-marketing, influencer-marketing, outbound-marketing, partner-channel-marketing, performance-marketing, podcast-marketing, product-marketing, retention-lifecycle, sem-ppc, social-media-marketing, video-marketing

*Note: `referral-word-of-mouth` merged into `referral-program` — WOM psychology and STEPPS framework now live in referral-program skill.*

### Agents — 16 total in `.claude/agents/`

**Ported from SEOMachine (10):**
content-analyzer, seo-optimizer, meta-creator, internal-linker, keyword-mapper, editor, headline-generator, cro-analyst, landing-page-optimizer, performance

**Newly created (8):**

| Agent | Role |
|---|---|
| `brand-researcher` | Researches brand online, populates all context files |
| `campaign-strategist` | Builds complete multi-channel campaign plans |
| `audience-analyst` | Validates audience fit, segment-fit scoring, mismatch patterns |
| `channel-selector` | Recommends best channels for a given goal |
| `output-formatter` | Determines right output type; asks guided questions when ambiguous |
| `publishing-adapter` | Formats and publishes content to connected platforms |
| `brand-strategist` | Synthesizes research into positioning statement + message hierarchy |
| `lifecycle-planner` | Designs multi-stage customer lifecycle sequences (Lincoln Murphy framework) |

*Note: `content-analyzer` fully rewritten — removed broken Python module references, replaced with 6-module framework-only analysis (search intent, keyword coverage, content depth, readability, E-E-A-T, content gap).*

### Commands — 41 total in `.claude/commands/`

**Maiar native commands (21):**

| Command | What It Does |
|---|---|
| `/brand-research [url]` | Research brand online, populate all context files |
| `/write [topic or type]` | Create any marketing content |
| `/campaign [type] [goal]` | Full campaign strategy document |
| `/email [type]` | Email copy or full sequence |
| `/social [platform] [topic]` | Platform-specific social content |
| `/ads [platform] [goal]` | Ad copy and strategy |
| `/audit [channel or url]` | Marketing channel or content audit |
| `/strategy [type]` | Strategy document for any discipline |
| `/analyze [file or url]` | Analyze existing content or campaigns — routes to typed analysis |
| `/optimize [file]` | Optimize for SEO, CRO, or engagement |
| `/publish [file] [platform]` | Publish to a configured platform |
| `/performance-review` | Data-driven content and channel review |
| `/competitor [company]` | Competitive analysis report |
| `/ideas [topic or challenge]` | Marketing ideation with scored impact × effort table |
| `/abm [account or list]` | ABM plan for target accounts |
| `/influencer [topic or campaign]` | Influencer identification and brief |
| `/repurpose [file] [format]` | Repurpose content across channels |
| `/research [topic]` | SEO and market research brief |
| `/lifecycle [stage]` | Design lifecycle sequences — onboarding, win-back, retention, expansion |
| `/brand-positioning` | Generate positioning statement, message hierarchy, brand narrative |
| `/persona [role or segment]` | Research and write a detailed buyer persona card |
| `/save` | Record session progress to `progress.md` — run at end of any session |

**SEOMachine commands preserved as reference (20, prefixed `seomachine-`):**
seomachine-research, seomachine-write, seomachine-rewrite, seomachine-analyze-existing, seomachine-optimize, seomachine-publish-draft, seomachine-research-gaps, seomachine-research-performance, seomachine-research-serp, seomachine-research-topics, seomachine-research-trending, seomachine-performance-review, seomachine-priorities, seomachine-article, seomachine-scrub, seomachine-landing-research, seomachine-landing-write, seomachine-landing-audit, seomachine-landing-competitor, seomachine-landing-publish

### Publishing Integrations — 6 files in `.claude/integrations/`

Scaffolded and ready to activate — add credentials to `.env` to enable each:

| Platform | Status |
|---|---|
| WordPress | Scaffold ready — needs WP credentials in `.env` |
| HubSpot | Scaffold ready — needs HUBSPOT_ACCESS_TOKEN |
| Webflow | Scaffold ready — needs WEBFLOW_API_TOKEN + IDs |
| Ghost | Scaffold ready — needs GHOST_URL + Admin API key |
| Generic Markdown | Always available — no credentials needed |
| `_template.md` | Template for adding any new platform |

---

## Current State

| Area | Status | Notes |
|---|---|---|
| Directory structure | ✅ Complete | All folders created |
| Context files | ✅ Two-tier architecture | Company + product layer; supports multi-product businesses; run `/brand-research` to populate |
| Skills (52) | ✅ Complete + Optimized | All descriptions enriched for keyword activation; Expert Foundations added to 23 thin skills; referral-word-of-mouth merged into referral-program |
| Agents (18) | ✅ Complete + Optimized | content-analyzer fully rewritten; audience-analyst, channel-selector, campaign-strategist expanded; brand-strategist + lifecycle-planner added; keyword-mapper consolidated into seo-optimizer |
| Commands (42) | ✅ Complete + Optimized | 22 Maiar native + 20 SEOMachine reference; /save added for session progress tracking |
| CLAUDE.md | ✅ Updated | Added instruction to read `progress.md` at session start; previously updated for commands, agents, context architecture |
| Integrations | ✅ Scaffolded | Architecture ready; credentials needed to activate |
| Git repo | ✅ Initialized | Committed and pushed to GitHub (https://github.com/trevorstansberry/maiar) |
| `.env` | ✅ Created | ANTHROPIC_API_KEY + SESSION_SECRET + MAIAR_ROOT configured |
| Context populated | ⬜ Empty | Run `/brand-research [url]` to fill |
| Hosted product plan | ✅ Complete | `maiar-product-management.md` — 3-level build plan for web UI + client hosting |
| Level 2A web UI — server | ✅ Running | Verified end-to-end: login, streaming chat, auto-save to drafts |
| Level 2A web UI — frontend | ✅ Running | Vite on :5173, Express on :3000, all routes functional |
| Level 2A — bugs fixed | ✅ Complete | 4 startup bugs + drafts date bug + context tracker (28% stuck) + admin users hidden — all fixed |
| Level 2A — onboarding flow | ✅ Complete | 3-screen wizard (Welcome → URL → Product structure) auto-submits `/brand-research`; tracked per-user in DB |
| Level 2A — canvas split-pane | ✅ Rebuilt | Canvas is now a full split-pane document editor (markdown + live preview) that opens AFTER streaming, loaded from disk |
| Level 2A — admin user management | ✅ Complete | All users visible (admins + clients); role badges; create admin or client; usage tracked for all roles |
| Level 2A — UX redesign | ✅ Complete | Assets → Library; Templates moved to Context page; Library files open in canvas-style slide-in panel |
| Level 2A — multi-message conversations | ✅ Fixed | Chat history now stores brief references for content commands; context window no longer bloats on multi-turn |
| Level 2A — filesystem agnosticism | ✅ Complete | ADMIN_WORKSPACE env var aligns Claude Code + web UI to same directory; Library shows files from either source |
| Level 2A — security hardening | ✅ Complete | helmet, rate limiting, history injection blocked, CSV injection fixed, cross-client isolation, path safety |
| Level 2A — password reset flow | ✅ Complete | Email-based reset (nodemailer + SMTP), change-password endpoint, SHA-256 hashed tokens, 30-min expiry, session invalidation, global error handler |
| Level 2A — SMTP configured | ✅ Complete | Google Workspace App Password in `.env`, SPF/DKIM/DMARC guidance in `.env.example` |
| Level 2A infrastructure | ⬜ Pending | Domain, Cloudflare, Caddy — requires manual setup on Mac Mini (see README) |

---

## Optimization Audit — Completed

All items from the system-wide audit plan are complete. Summary of work done in this session:

**Skills:** All 52 skill `description` fields rewritten for keyword activation. Expert Foundations sections added to 23 thin skills (brand-marketing, inbound, outbound, social-media-marketing, retention-lifecycle, performance-marketing, abm, influencer-marketing, affiliate-marketing, community-marketing, product-marketing, b2c-marketing, video-marketing, podcast-marketing, events-experiential, direct-mail, field-marketing, partner-channel-marketing, conversational-marketing, guerrilla-marketing, cause-marketing, b2b-marketing, sem-ppc). `referral-word-of-mouth` merged into `referral-program`.

**Agents:** `content-analyzer` fully rewritten (removed broken Python modules). `audience-analyst`, `channel-selector`, `campaign-strategist` expanded with scoring rubrics and frameworks. `brand-strategist` and `lifecycle-planner` added as new agents. `keyword-mapper` consolidated into `seo-optimizer`.

**Commands:** `/email`, `/social`, `/ads`, `/research`, `/audit`, `/repurpose` updated with explicit agent routing and context file loading. `/write` updated to 4-agent chain (dropped keyword-mapper). `/influencer` expanded to match `/abm` depth. `/ideas` and `/analyze` sharpened. `/lifecycle`, `/brand-positioning`, `/persona` added as new commands.

**Multi-Product Context Architecture:** Restructured flat `context/` into a two-tier company + product model. Company-level holds shared brand identity (`context/company/`). Product-level holds product-specific context in per-product folders (`context/products/[slug]/`). Three files are flexibly placed at either level depending on the business structure: `competitors.md`, `positioning.md`, and `content-examples.md`. Added `context/products.md` as a product registry. `/brand-research` now runs an adaptive onboarding interview using dropdown selectors to determine product structure before writing any files. All 21 native commands, 8 agents updated with new paths. Product-disambiguation dropdown added: when a command can't infer the product from input and multiple products exist, a native `AskUserQuestion` dropdown appears before any work begins. `/brand-positioning` output now writes back to `context/products/[slug]/positioning.md` or `context/company/positioning.md` (living context file, not a campaign artifact).

---

### Next Steps (Production Use)

**A. Test `/brand-research` end-to-end** — Run `/brand-research https://any-company.com` to validate brand researcher agent works and context files populate.

**B. Create `.env`** from `.env.example` and add credentials for any publishing integrations.

**C. Activate publishing integrations** — Add WordPress, HubSpot, or Webflow credentials and test `/publish` end-to-end.

**D. Add `data_sources/` directory** — Port GA4, Google Search Console, and DataForSEO integrations for analytics-driven performance reviews.

**E. Test all 21 Maiar commands** against a real brand context and refine based on outputs.

### Next Steps (Hosted Product — Level 2A)

Local dev is running. Next:

**1. End-to-end test multi-message** — Send `/write a blog post`, then send a follow-up message in the same conversation — confirm Claude retains context and history stays lean (no full content in history).

**2. End-to-end test canvas redesign** — Run `/write`, confirm streaming shows in chat bubble (not canvas), canvas opens AFTER done event with split editor loaded from disk. Edit in left pane, confirm right preview updates live and "Saved" appears in header.

**3. End-to-end test filesystem agnosticism** — Create a file directly in `Maiar/drafts/` (via Claude Code or by dropping a file), open the web UI Library, confirm it appears without any DB registration.

**4. Test "Open in Canvas" from Library** — Click the columns icon on any Library file, confirm navigation to `/chat` with canvas pre-loaded and editable.

**5. End-to-end test onboarding** — Create a test client user in Admin (now with role selector), log in, walk through the 3-screen wizard, confirm `/brand-research` fires and context populates. Verify wizard does not reappear on next login.

**6. Populate brand context** — Use the Context page in the UI, or run `/brand-research [url]` in Claude Code to fill context. New client users will be guided through this by the onboarding wizard automatically.

**5. Fix remaining Svelte 5 warnings (non-blocking)** — Batch-fix self-closing tag warnings across all `.svelte` files. Also add Inter variable font to `ui/static/fonts/` to clear the 404.

**6. Mac Mini infrastructure:**
- Register domain → point to Cloudflare → `A` record → Mac Mini IP
- `brew install caddy` → copy `Caddyfile.example` to `/etc/caddy/Caddyfile` → `brew services start caddy`
- Copy repo to Mac Mini, create fresh `.env` with Mac Mini paths
- `npm run build` → `npm start` (production mode)

**7. First client:**
- Log in as admin at `/admin` → create client → share credentials → client completes onboarding wizard

**8. Backups:**
- Edit `scripts/backup.sh` BACKUP_DEST → `chmod +x` → add to cron (2am nightly)

---

### 2026-02-16 — Branding update + login fix + email password reset planned

**Done:**
- Rebranded UI aesthetic to match actively.ai: orange accent (`#ff630f`), near-black backgrounds (`#080807`), Syne font for headings (loaded via Google Fonts), `Activity` icon replacing `Layers` — all via CSS custom properties in `app.css`, `tailwind.config.js`, `app.html`, `Sidebar.svelte`, `login/+page.svelte`, `favicon.svg`. All Maiar naming kept as-is (visual style only).
- Fixed auth routes: all three handlers (`/login`, `/logout`, `/session`) now wrapped in `try/catch` with `console.error` + 500 JSON response — previously any async error bubbled as an unhandled rejection
- Diagnosed login failure: Express server on :3000 was not running (only SvelteKit dev on :5173 was up)
- Identified admin password mismatch: `admin@maiar.work` exists in DB but password doesn't match default seed value
- Created `scripts/reset-password.js` — edit `EMAIL` + `NEW_PASSWORD`, run `node scripts/reset-password.js`, then clear the password from the file

**Email-based password reset — implemented** (see session log entry below for details).

---

## How to Use (Today)

```bash
# Open Maiar/ in Claude Code, then run any command:

/brand-research https://your-company.com      # Populate context — do this first
/write blog post about [topic]                # Create content in brand voice
/campaign email launch for [product]          # Build a full campaign plan
/ideas reduce churn                           # Scored ideation session
/competitor [company name]                    # Competitive analysis
/strategy content marketing 2025              # Strategy document
/social linkedin [topic]                      # LinkedIn post
/email welcome sequence for new signups       # Welcome email series
/lifecycle onboarding                         # Design onboarding email sequence
/brand-positioning                            # Positioning statement + message hierarchy
/persona VP of Marketing at B2B SaaS          # Research a buyer persona
/influencer product launch for [product]      # Full influencer campaign plan
/audit our homepage conversion rate           # Routed CRO audit
/analyze [file or url]                        # Typed analysis with agent routing
/research reduce SaaS churn                   # SEO + keyword research brief
/repurpose drafts/blog.md into social posts   # Multi-format repurposing
```

The better the context files, the better every output. Run `/brand-research` first, then refine `context/` files before generating production content.

---

## Session Log

### 2026-02-16 — Session workflow hardened: progress.md auto-read at session start

**Done:**
- Added `progress.md` auto-read instruction to top of `CLAUDE.md` — Claude now reads it at the start of every session without being asked
- Confirmed `/save` command works end-to-end (ran it twice this session, both times accurately captured session state)

**Decisions:**
- CLAUDE.md is the right place for session-start instructions (Option A) — it's in the repo, works for any machine or team member, persists across model updates

**Next:**
- Pick a build level from `maiar-product-management.md` and begin implementation
- Test `/brand-research` end-to-end against a real brand URL
- Create `.env` from `.env.example` and test a publishing integration

---

### 2026-02-16 — Hosted product plan, context management design, and /save command

**Done:**
- Created `maiar-product-management.md` — full 3-level build plan for turning Maiar into a hosted web service (Level 1 local UI → Level 2A Mac Mini multi-client → Level 2B managed service → Level 3 cloud SaaS)
- Added Context Window Management section to `maiar-product-management.md` — covers stateless-by-default (L1), sliding window + auto-summarize + reset button (L2A), named threads + save-and-close workflow (L2B), plus implementation notes and algorithms
- Fixed missing `## Decision Log` header in `maiar-product-management.md` (section title was lost during edit)
- Created `.claude/commands/save.md` — `/save` command that reads the session, updates Current State table, updates Next Steps, and appends a dated entry to Session Log in `progress.md`
- Updated `progress.md` — added Hosted product plan row to Current State table, added Next Steps (Hosted Product) section, updated command count to 42, added `/save` to command table

**Decisions:**
- Hosting model: Git-per-client on Mac Mini for Level 2A; SQLite + Drizzle for DB; Lucia v3 for auth (local, no third-party); Caddy for reverse proxy; Cloudflare for DNS/IP masking
- Context management default: stateless (no history) for Level 1 since Maiar commands are self-contained; sliding window with configurable N for Level 2A; named threads as the primary UX pattern for Level 2B
- Auto-summarize threshold: 80% context capacity triggers a summarization API call that replaces conversation history in SQLite — transparent to the user
- Billing model recommendation: flat retainer with soft usage cap as the simplest starting point; retainer + API passthrough as the scalable option
- `/save` should infer session content from the conversation rather than prompting the user

**Next:**
- Pick a build level from `maiar-product-management.md` and begin implementation
- Test `/brand-research` end-to-end against a real brand URL
- Create `.env` from `.env.example` and test a publishing integration
- Run `/save` at the end of every working session going forward

---

### 2026-02-16 — Level 2A web app fully built: Express server + SvelteKit UI

**Done:**

*Architecture & planning:*
- Decided on Level 2A (Mac Mini hosting, Caddy + Cloudflare, Lucia auth, SQLite) over Level 1
- Created full implementation plan at `.claude/plans/polished-herding-floyd.md` with 6 phases + `/save` checkpoints after each phase

*Server (`maiar-server/`) — 22 files:*
- `server.js` — Express entry, routes, static SPA serving in production
- `lib/config.js` — env config, model ID, content-command set
- `lib/db.js` — Drizzle + better-sqlite3 connection (WAL mode, foreign keys)
- `lib/auth.js` — Lucia v3 setup, `requireAuth` + `requireAdmin` middleware
- `lib/fileSystem.js` — path-traversal-safe read/write/list/move/delete helpers
- `lib/contextLoader.js` — loads client context files, fill-status detection, product registry parsing
- `lib/systemPrompt.js` — builds full Claude system prompt (CLAUDE.md + company + product + commands)
- `lib/claude.js` — Anthropic SDK streaming wrapper with onDelta/onDone callbacks
- `routes/auth.js` — POST /login, POST /logout, GET /session
- `routes/chat.js` — SSE streaming, auto-save content commands to drafts, usage logging, conversation persistence
- `routes/context.js` — CRUD for all context files, product creation from _template
- `routes/assets.js` — CRUD + move for drafts/published/campaigns/research/templates
- `routes/admin.js` — client CRUD, toggle active, usage summary, CSV export with est. API cost
- `db/schema.js` — Drizzle schema: users, sessions, usage_logs, conversations
- `scripts/seed-admin.js` — one-time admin user creation
- `scripts/backup.sh` — nightly rsync to iCloud (or any destination), keeps 30 daily DB snapshots
- `Caddyfile.example`, `.env.example`, `drizzle.config.js`, `.gitignore`, `README.md`, `package.json`

*Frontend (`maiar-server/ui/`) — 36 files:*
- Design system: `app.css` — full CSS custom property system (dark/light), glass effects, keyframe animations, markdown styles
- Anti-flash theme: inline `<script>` in `app.html` reads localStorage before paint
- Stores: `theme.ts` (localStorage-persisted toggle), `auth.ts` (session user), `chat.ts` (messages, streaming, token usage)
- API client: `client.ts` — typed fetch wrappers + SSE async generator for streaming
- Utils: `commandList.ts` — all 21 commands with metadata
- Components: ParticleField (canvas), Toggle (dark/light), Button, Badge, Spinner, AppShell, Sidebar (with particle field + logout), StreamingCursor, MarkdownRenderer (marked + hljs), CommandPalette (/command autocomplete), ContextBar (token usage + product badge), MessageBubble (user gold / assistant glass), ChatInput (auto-resize + palette trigger), ChatView (full chat with conversation sidebar)
- Routes: login, chat, assets/[folder], context, admin

*Design aesthetic implemented:*
- Dark mode default (`#0A0B14` bg, `#6C63FF` accent, `#F5A623` gold)
- Glassmorphism cards (`backdrop-filter: blur(12px)`)
- Animated particle field in sidebar
- CSS-only animations: shimmer, blink cursor, fadeInUp, skeleton sweep, slide-in panel
- Light mode overrides on `[data-theme="light"]`
- Hims/Copilot reference aesthetic

**Decisions:**
- `maiar-server/` lives alongside the main Maiar repo (not inside it) — keeps server concerns separated from the Claude workspace
- `clients/[slug]/` on disk (not a DB) for workspace isolation — consistent with the existing file-based Maiar architecture
- `systemPrompt.js` reads from `maiar-master/` (the existing Maiar repo) so commands/skills always reflect the latest version
- Auto-save: chat route detects content-producing commands (`/write`, `/email`, `/social`, etc.) and saves completed responses to `drafts/` automatically; `done` SSE event includes `savedTo` path for toast notification
- Conversation persistence in SQLite (`conversations` table, messages as JSON) — persists across sessions for clients
- `@sveltejs/adapter-static` + Express static serving for production (single `node server.js` starts everything)
- No onboarding for clients (admin provisions context before sharing credentials); simplified welcome → first command flow instead

**Next:**
- Populate brand context via Context page or `/brand-research`
- Fix Svelte 5 self-closing tag warnings (non-blocking, batch fix)
- Add Inter font to `ui/static/fonts/` (fixes 404)
- Set up Mac Mini infrastructure (domain → Cloudflare → Caddy) per README

---

### 2026-02-16 — Level 2A: onboarding flow, canvas view, drafts date bug fixed

**Done:**

*Bug fix:*
- **Drafts age tracker** — replaced `new Date(file.lastModified)` with `parseISO(file.lastModified)` in `ui/src/routes/assets/[folder]/+page.svelte`; date-fns's own ISO parser is more reliable than the native Date constructor

*Onboarding flow (8 files):*
- `db/schema.js` — added `onboardingComplete` boolean column to users table; `npm run db:push` applied (nullable to avoid SQLite ALTER TABLE truncation)
- `lib/auth.js` — `onboardingComplete` added to `getUserAttributes()` return
- `routes/auth.js` — `onboardingComplete` included in `/login` and `/session` responses
- `routes/onboarding.js` — new file; `POST /api/onboarding/complete` marks onboarding done for authenticated user
- `server.js` — onboarding router imported and mounted at `/api/onboarding`
- `ui/src/lib/stores/auth.ts` — `onboardingComplete: boolean` added to `SessionUser` interface
- `ui/src/lib/api/client.ts` — `onboarding.complete()` API call added
- `ui/src/lib/components/onboarding/OnboardingFlow.svelte` — new 3-screen wizard: Welcome → Brand URL input → Single/Multi-product button choice → auto-submits `/brand-research [url] [structure note]` + marks onboarding complete; includes "Skip for now" escape hatch
- `ui/src/lib/components/chat/ChatView.svelte` — shows `OnboardingFlow` for non-admin users without `onboardingComplete`; admin users always see suggestion buttons

*Canvas split-pane view (4 files):*
- `ui/src/lib/stores/chat.ts` — added `canvasVisible`, `canvasContent`, `canvasSavedTo` to state; added `openCanvas()` / `closeCanvas()` methods; `appendDelta` mirrors text to canvas content when open; `finishStreaming` captures `savedTo` path
- `ui/src/lib/utils/commandList.ts` — added `CANVAS_COMMANDS` Set derived from all `producesContent: true` commands (no duplication)
- `ui/src/lib/components/canvas/CanvasPane.svelte` — new component: live markdown preview header (label + word count + copy button + close ×), streaming body, footer with "✓ Auto-saved to [path]" + "Open in Assets →" link when done
- `ui/src/lib/components/chat/ChatView.svelte` — detects content command on submit via regex match against `CANVAS_COMMANDS`; calls `chat.openCanvas()`; renders 45/55 split with canvas pane sliding in from right; existing single-pane layout preserved for non-content commands

**Decisions:**
- Onboarding column is nullable (not `NOT NULL`) — allows `ALTER TABLE ADD COLUMN` on existing SQLite DB without truncating; frontend treats null as false, admin excluded by role check
- Onboarding marked complete immediately on product structure selection (not after brand-research finishes) — simpler, avoids needing to parse Claude's done event for onboarding state
- `CANVAS_COMMANDS` derived from `commandList.ts`'s `producesContent` flag rather than duplicating a hard-coded Set — single source of truth
- Canvas close button dismisses preview but does NOT delete the draft — auto-save already happened server-side

**Next:**
- End-to-end test onboarding: create test client → walk wizard → confirm `/brand-research` fires → confirm wizard doesn't reappear on re-login
- End-to-end test canvas: run `/write` → confirm pane opens → confirm live streaming → confirm saved path in footer
- Batch-fix Svelte 5 self-closing tag warnings (non-blocking)
- Add Inter font to `ui/static/fonts/` (clears 404)
- Mac Mini infrastructure when ready to go live

---

### 2026-02-16 — Level 2A running end-to-end: login, streaming, auto-save confirmed

**Done:**
- Installed all dependencies (`maiar-server/` and `maiar-server/ui/`)
- Created `.env` with ANTHROPIC_API_KEY, SESSION_SECRET (generated), MAIAR_ROOT
- Ran `npm run db:push` — SQLite database created at `db/maiar.db`
- Seeded admin user `admin@maiar.work` via `scripts/seed-admin.js`; script reverted to placeholders after seeding
- Fixed 4 bugs blocking startup and chat:
  1. **`vite.config.js`** — wrong import (`@sveltejs/vite-plugin-svelte` → `@sveltejs/kit/vite`); SvelteKit wouldn't start
  2. **`db/schema.js`** — `sessions.expiresAt` mode `timestamp` → `number`; Lucia v3 passes Unix timestamp not Date, caused login crash
  3. **`lib/auth.js`** — `getUserAttributes` read `attributes.client_slug` (raw column) instead of `attributes.clientSlug` (Drizzle camelCase); `clientSlug` was `undefined` on all requests, breaking chat and assets
  4. **`MarkdownRenderer.svelte`** — `{@html html}` was in attribute position, not element content; self-closing `<div />` also invalid in Svelte 5
- Generated `.svelte-kit/tsconfig.json` via `npx svelte-kit sync` (was missing, caused Vite warning)
- Created `clients/admin/` directory tree for workspace isolation
- Verified full end-to-end: login ✅ → chat ✅ → `/write` command ✅ → draft auto-saved to `clients/admin/drafts/` ✅

**Decisions:**
- `MAIAR_ROOT` in `.env` is the right knob for Mac Mini migration — just update path on new machine, nothing else changes
- No iCloud account needed for Mac Mini; backup destination can be any local path or external drive
- Svelte 5 self-closing tag warnings are non-blocking; batch-fix separately, don't mix with bug fixes
- Finish local dev testing before moving to Mac Mini — debug locally, deploy once stable

**Next:**
- Populate brand context (Context page in UI or `/brand-research` in Claude Code)
- Batch-fix Svelte 5 self-closing tag warnings across all `.svelte` files
- Add Inter variable font to `ui/static/fonts/` to clear 404
- Set up Mac Mini infrastructure when ready to go live

---

### 2026-02-16 — Bug fixes + UX redesign: context tracker, admin users, canvas persistence, Library

**Done:**

*Bug fixes:*
- **Context tracker (always 28%)** — Two root causes fixed: (1) `conversation_id` event was calling `finishStreaming({ 0, 0 })` before the `done` event, creating a duplicate ghost message and zeroing out tokens; fixed by adding `setConversationId()` store method. (2) Formula double-counted `outputTokens` which are already embedded in the next `inputTokens`; fixed to use `inputTokens` only. Context bar now shows `56.2k / 200k tokens` so growth is visible even when the % barely moves (system prompt always dominates).
- **Admin not in users list** — Frontend filtered `clients.filter(c => c.role === 'client')`, hiding all admins including the logged-in user. Fixed by showing all roles. Added Role badge column, 4th summary card for admin count, and a Client/Admin toggle in the create form. Backend now accepts `role` in `POST /clients` and removed `WHERE role = 'client'` filter from usage query.

*UX redesign — Chats, Canvases, Assets unified:*
- **Canvas persistence** — Past conversations that produced content now reopen their canvas when clicked. `routes/chat.js` stores `savedTo` in the conversation messages JSON. Conversation list endpoint returns `hasSavedContent` + `canvasPath`. `chat.ts` gains `restoreCanvas()` method and `loadConversation()` now returns the last `savedTo` path. `ChatView.svelte` fetches the saved file and restores the canvas pane. Sidebar shows a document icon next to conversations with saved content.
- **Templates → Context** — Templates removed from Library; now live as a tab inside the Context page. The tab uses the existing assets API (`assets.list/get/update/save` for `templates/` folder) with inline create and edit. This reinforces the mental model: templates are reference material that informs work, not output from it.
- **Assets → Library** — Sidebar section renamed from "Assets" to "Library". "Open in Assets" link in CanvasPane updated to "Open in Library".
- **Library canvas-style view** — Replaced the raw HTML preview (no markdown parsing) + separate edit modal with a unified slide-in canvas panel. Panel has a Preview/Edit toggle, word count badge, copy button, close button, and footer with Publish (drafts only) and Delete actions. Preview renders proper markdown via `MarkdownRenderer`. Selected card gets an accent border highlight.

*Files modified (12 total):*
- `ui/src/lib/stores/chat.ts` — `setConversationId()`, `restoreCanvas()`, `loadConversation()` with savedTo detection, `contextUsage` formula fix, `contextTokenLabel` derived store
- `ui/src/lib/components/chat/ContextBar.svelte` — shows token count label
- `ui/src/lib/components/chat/ChatView.svelte` — setConversationId for conversation_id events, canvas restore on loadConversation, document icon in sidebar
- `ui/src/lib/components/canvas/CanvasPane.svelte` — "Open in Library" label
- `routes/admin.js` — accepts role in POST /clients, removed role filter from usage query
- `ui/src/routes/admin/+page.svelte` — all users shown, role badge, 4 summary cards, role selector in create form
- `ui/src/lib/api/client.ts` — added role field to createClient type
- `routes/chat.js` — stores savedTo in conversation JSON, returns hasSavedContent + canvasPath in list endpoint
- `ui/src/lib/components/layout/Sidebar.svelte` — Templates removed, section renamed to Library
- `ui/src/routes/assets/[folder]/+page.svelte` — templates tab removed, canvas-style slide-in panel (replaces preview div + edit modal)
- `ui/src/routes/context/+page.svelte` — Templates tab added alongside Context

**Decisions:**
- Assets = Chats with Canvases: generated content is always tied to the conversation that produced it; the Library is just a browseable view of all canvases across all conversations
- Templates = reference material (like context files); belongs in Context section, not alongside generated output
- Context tracker shows actual token counts rather than a percentage that barely moves — system prompt always accounts for ~55k tokens, making the % near-useless without raw numbers

**Next:**
- End-to-end test canvas persistence: run `/write`, close canvas, switch conversations, switch back — confirm canvas reopens
- End-to-end test admin list: confirm admin user visible with badge, create second admin
- End-to-end test Templates tab in Context: create a template, edit it, verify it persists
- Batch-fix Svelte 5 self-closing tag warnings (non-blocking)
- Add Inter font to `ui/static/fonts/` (clears 404)
- Mac Mini infrastructure when ready to go live

---

### 2026-02-16 — Canvas rebuilt as document editor; multi-message fixed; security hardened; filesystem agnosticism

**Done:**

*Security hardening (all applied, server syntax verified):*
- Installed `helmet` + `express-rate-limit`; both wired into `server.js` and `routes/auth.js`
- Login rate-limited: 5 attempts per 15 minutes → 429
- Chat history role injection blocked: only `user`/`assistant` allowed in `history` payload (`routes/chat.js`)
- `basename()` applied consistently to all PUT file writes in `routes/assets.js`
- `clientSlug` regex hardened to domain-name rules: `/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/` in admin + context routes
- Raw DB errors no longer leaked to clients in `routes/admin.js`
- CSV fields properly escaped to prevent formula injection in admin export
- Cross-client conversation isolation: `clientSlug` verified on GET + DELETE `/conversations/:id`
- Custom `dirname()` removed from `lib/fileSystem.js` — replaced with Node's built-in `path.dirname`
- Context file prompt injection patterns stripped in `lib/systemPrompt.js`

*Filesystem agnosticism:*
- `ADMIN_WORKSPACE` env var added to `lib/config.js` and `lib/fileSystem.js`
- `clientRoot('admin')` now returns `ADMIN_WORKSPACE` path when set, bypassing `clients/admin/`
- `.env` updated: `ADMIN_WORKSPACE=/Users/trevorstansberry/Documents/Maiar`
- `.env.example` updated with documented comment
- Net effect: files created by Claude Code in `Maiar/drafts/` instantly visible in web UI Library, and vice versa

*Multi-message fix:*
- `routes/chat.js`: content-command responses now stored as brief references in conversation messages JSON (`[Draft saved to drafts/... · 847 words]`) — not full text
- `ui/src/lib/stores/chat.ts` `getHistory()`: messages with `savedTo` now substituted with reference text before sending to Claude; also fixed missing `unsub()` call (memory leak)
- Chat history stays lean across multi-turn; full content lives on disk only

*Canvas redesign (full document editor):*
- `ui/src/lib/components/canvas/CanvasPane.svelte` — fully rewritten as split-pane editor: left = editable markdown textarea, right = live `MarkdownRenderer` preview; toolbar (Bold, Italic, H1, H2, Blockquote, Link) inserts at cursor; debounced auto-save (500ms) via `PUT /api/assets/drafts/filename`; "Saving…" → "✓ Saved" status indicator; filename in header
- `ui/src/lib/components/chat/ChatView.svelte` — canvas no longer opens on submit; instead opens on `done` event if `savedTo` present, fetching file content from disk via `/api/assets`; also removed `CANVAS_COMMANDS` import (no longer needed); `getHistory()` now called BEFORE `addUserMessage()` (correct multi-turn history)
- Canvas streaming mirror removed from `appendDelta` in `chat.ts`
- Library (`ui/src/routes/assets/[folder]/+page.svelte`) — "Open in Canvas" button (`Columns2` icon) added to file cards and slide-in panel footer; calls `chat.restoreCanvas()` then navigates to `/chat`

**Decisions:**
- Canvas = document editor loaded from disk after streaming, not a live mirror of the response stream
- Drafts remain pure filesystem (no `drafts` DB table) — `listFiles()` already scans disk, so files from Claude Code or the UI appear automatically without registration
- `ADMIN_WORKSPACE` is the single env var that aligns Claude Code and web UI to the same filesystem paths — no structural changes to either environment
- Chat messages store brief references for content responses; full content on disk is the source of truth

**Next:**
- End-to-end test multi-message chat (brief references in history)
- End-to-end test canvas: stream → done → split editor opens from disk
- End-to-end test filesystem agnosticism: drop a file in `Maiar/drafts/`, confirm it appears in Library
- Test "Open in Canvas" from Library navigates to `/chat` with canvas pre-loaded
- Batch-fix Svelte 5 self-closing tag warnings (non-blocking)
- Add Inter font to `ui/static/fonts/` (clears 404)
- Mac Mini infrastructure when ready to go live

---

### 2026-02-16 — Email-based password reset flow implemented (security-hardened)

**Done:**

*Security review + hardened plan:*
- Audited existing auth system: bcrypt 12 rounds, Lucia sessions, rate-limited login, helmet headers — all solid
- Identified 7 security gaps in the original plan from progress.md and fixed all of them in the implementation
- Created detailed security-hardened plan at `.claude/plans/scalable-giggling-hejlsberg.md`

*Backend (5 files modified/created):*
- `db/schema.js` — added `passwordResetTokens` table with `tokenHash` (SHA-256, not plaintext), `expiresAt`, `usedAt` columns; pushed to SQLite via `drizzle-kit push`
- `lib/config.js` — added `smtp` config block + `appUrl`
- `lib/email.js` — new file: nodemailer transport, `sendPasswordResetEmail()` with HTML template (orange button, Maiar branding), `verifyTransport()` for startup check
- `routes/auth.js` — 3 new endpoints: `POST /forgot-password` (rate-limited 3/hr, timing-safe, token cleanup), `POST /reset-password` (SHA-256 token verification, bcrypt 12, session invalidation), `POST /change-password` (authenticated, verifies current password, re-creates session). Shared `validatePassword()` function (8+ chars, letter + number)
- `server.js` — global error handler + SMTP `verifyTransport()` on startup

*Frontend (4 files modified/created):*
- `ui/src/routes/forgot-password/+page.svelte` — email form → "Check your inbox" (no enumeration)
- `ui/src/routes/reset-password/+page.svelte` — password + confirm with strength indicator (weak/fair/strong)
- `ui/src/routes/login/+page.svelte` — "Forgot password?" link + green success toast on `?reset=true`
- `ui/src/lib/api/client.ts` — `forgotPassword()`, `resetPassword()`, `changePassword()`

*Config + cleanup:*
- `.env.example` — SMTP vars + SPF/DKIM/DMARC deliverability checklist
- `maiar-server/.gitignore` — added `ui/.svelte-kit/` and `ui/dist/`
- `scripts/reset-password.js` — deleted (replaced by email flow)

*Security: SHA-256 hashed tokens, 30-min expiry, single-use, 3/hr rate limit, timing-safe enumeration, server-side password validation, session invalidation on reset, global error handler, inline token cleanup.*

**Decisions:**
- SHA-256(token) in DB, never plaintext — DB dump doesn't expose valid reset links
- 30-minute expiry (reduced from original 1-hour plan)
- Inline token cleanup on each request instead of cron
- Deleted `scripts/reset-password.js` — replaced by self-service email flow

**Next:**
- End-to-end test password reset flow
- Git push (security scan passed — no secrets in staged files)
- Mac Mini infrastructure when ready to go live
