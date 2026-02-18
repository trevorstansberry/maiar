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

### Agents — 11 total in `.claude/agents/`

*(Consolidated from 18 → 11. See "2026-02-18 — Agent & Command Consolidation" session log for details.)*

| Agent | Role |
|---|---|
| `editor` | Rewrites content for human voice, engagement, headline quality. Returns improved draft + change summary |
| `seo-optimizer` | On-page SEO: keywords, structure, meta titles/descriptions, internal linking |
| `conversion-optimizer` | CRO: psychology (Cialdini, cognitive load, trust) + structural (above-fold, CTAs, friction) |
| `content-analyzer` | 6-module content analysis (search intent, keywords, depth, readability, E-E-A-T, gaps) |
| `performance` | Data-driven prioritization from GA4, GSC, DataForSEO — opportunity scoring, priority queue |
| `campaign-strategist` | Multi-channel campaign plans with channel scoring rubric (audience/intent/economics/readiness) |
| `audience-analyst` | Persona validation, audience fit scoring, segment-fit mismatch patterns |
| `lifecycle-planner` | Customer lifecycle sequences — onboarding, retention, win-back, advocacy (Lincoln Murphy) |
| `brand-strategist` | Positioning statement, message hierarchy, brand narrative (April Dunford framework) |
| `brand-researcher` | Web research → auto-populate all context files |
| `publishing-adapter` | Format and publish content to connected platforms |

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
| Agents (18→11) | 🔄 Consolidating | Reducing from 18 to 11: editor rewrite (content not reports), cro-optimizer merger, brand ref cleanup, narrow agents absorbed. See 2026-02-18 session log. |
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
| Level 2A — password reset flow | ✅ Complete | Email-based reset (Resend API), change-password endpoint, SHA-256 hashed tokens, 30-min expiry, session invalidation, global error handler |
| Level 2A — email provider | ✅ Switched to Resend | Replaced nodemailer/SMTP with Resend SDK; `.env` uses `RESEND_API_KEY` + `EMAIL_FROM` |
| Level 2A infrastructure | ⬜ Pending | Domain, Cloudflare, Caddy — requires manual setup on Mac Mini (see README) |
| Level 2B — chat reliability | ✅ Complete | try/finally onDone, safety finishStreaming, SSE buffer flush, `[chat]` logging; tested end-to-end |
| Level 2B — agent orchestration | ✅ Complete | `commandRegistry.js` maps 21 commands → agent chains + skills; `agentRunner.js` runs multi-step chains with `agent_step` SSE events |
| Level 2B — skills loading | ✅ Complete | `loadSkills()` loads relevant SKILL.md files per command; `buildAgentPrompt()` for agent steps; `buildCommandPrompt()` for skills-only commands |
| Level 2B — canvas-first content | ✅ Complete | Content commands stream to canvas (not chat bubble); `content_start` SSE event; compact "Draft saved" card in chat; 85% token reduction (56k → 8.5k) |
| Level 2B — agent step tags | ✅ Complete | Real-time agent badges during streaming; persistent tags on completed messages; stored in conversation JSON |
| UI refresh — muted burnt orange | ✅ Complete | `#ff630f` → `#c2652a` across all CSS variables + Tailwind config |
| UI refresh — wizard icon + favicon | ✅ Complete | Custom WizardIcon.svelte replacing Activity icon in Sidebar, login, forgot/reset-password; matching favicon |
| UI refresh — EB Garamond fonts | ✅ Complete | Syne → EB Garamond for headings; `.font-decorative` for italic serif flair |
| UI refresh — fantasy flair | ✅ Complete | Warm amber particles with sparkle, updated gradients, decorative text |
| UI refresh — agent badges | ✅ Complete | "Powered by" footer strip on assistant messages; "routed to" badges on user command messages |
| UI refresh — Library rename | ✅ Complete | Backend rename endpoint + inline rename UI on file cards and panel header |
| UI refresh — template rename | ✅ Complete | Pencil icon + inline rename + delete button in Context template editor |
| UI refresh — wizard icon (FA7) | ✅ Complete | Replaced custom SVG with Font Awesome 7 `hat-wizard` solid icon + matching favicon |
| UI refresh — context-aware onboarding | ✅ Complete | `GET /context/status` endpoint; ChatView checks context fill on mount; shows OnboardingFlow if empty (all users) |
| UI refresh — chat input redesign | ✅ Complete | Removed square border/shadow; soft bottom border with focus glow; wizard icon flair when empty |
| UI refresh — rotating suggestions | ✅ Complete | 12-item pool, 4 visible in 2×2 grid, rotate every 8s, agent badges on each card |
| Level 2B — templates to navbar | ✅ Complete | Templates moved from Context tab to sidebar Library section |
| Level 2B — smart chat naming | ✅ Complete | `generateTitle()` parses commands into "Topic — Asset Type"; PATCH rename endpoint; inline rename UI |
| Level 2B — campaign system | ✅ Complete | `campaigns` table, full CRUD routes, detail page with asset checklist, conversation linking, chat integration with `campaignId` |
| Level 2B — thinking indicator | ✅ Complete | `ThinkingIndicator.svelte` with dynamic verbs per agent, pulsing dot, step counter |
| Level 2B — client management | ✅ Complete | `clients` table, workspace CRUD endpoints, migration script, admin page restructured with Workspaces/Users/Usage tabs |
| Level 2B — beta tag | ✅ Complete | Beta badge next to Maiar logo in sidebar |
| Login bug fixes | ✅ Complete | publicRoutes guard fixed (forgot/reset-password now accessible); requireAuth try/catch added (Express 4 async safety) |
| Three-tier role system | ✅ Complete | `super_admin` / `client_admin` / `client`; migration script ran; scoped admin routes; role-based dashboard views |
| User profile + settings | ✅ Complete | `/settings` page with Personal (name, avatar, change password) + Company (name, logo, website); `/api/profile` CRUD + multer uploads |
| Chat input — wand icon | ✅ Complete | MDI auto-fix wand SVG replaces WizardIcon in chat input; wizard hat stays as logo |
| Chat input — command palette | ✅ Replaced | Replaced by visual ActionMenu; keyboard nav preserved |
| Chat input — keyword highlighting | ✅ Complete | Transparent overlay highlights recognized keywords (commands, agents, categories) with accent underline |
| Sidebar — settings + initials | ✅ Complete | Settings nav in new Account section; user initials circle + name in bottom bar |
| Admin — name column + displayName fix | ✅ Complete | `name` column persisted on user create; shown in admin table with initials avatar |
| UI — sidebar "My Business" section | ✅ Complete | Templates moved under "My Business" (renamed from Context); Context + Templates grouped together |
| UI — 404 error page | ✅ Complete | `+error.svelte` with styled branding, status code, "Back to Chat" link |
| UI — mobile hamburger menu | ✅ Complete | Sidebar opens as overlay on mobile; hamburger in top bar; backdrop click to close |
| UI — admin route guard | ✅ Complete | Reactive `$:` guard redirects non-admin users; prevents content flash |
| UI — forgot password in settings | ✅ Complete | "Forgot password?" link in Change Password section |
| Canvas fix — producesContent sync | ✅ Complete | `/competitor` server→true, `/brand-research` client→true; canvas closes on stream errors |
| Chat input — command chip badges | ✅ Complete | Command selection renders styled badge chip with agent pills; Backspace/Escape to clear |
| Chat input — skills field | ✅ Complete | `skills: string[]` added to all 21 commands in `commandList.ts`; `getCommandSkills()` helper |
| Chat — conversation tools strip | ✅ Updated | Moved below input; agents + skills accumulate beneath command line |
| Chat input — free-form commands | ✅ Complete | Command chips allow any text (or none); generic placeholder instead of args-specific |
| Per-client isolation fixes | ✅ Complete | `contextLoader.js` fixed to use `clientRoot()`; `conversations.clientSlug` added + backfilled; conversation routes filter by clientSlug directly |
| Assets DB architecture | ✅ Complete | `assets` table (id, clientSlug, conversationId FK, campaignId FK, title, filePath, folder, status); `routes/assets-db.js` CRUD at `/api/asset-records`; chat auto-registers assets after draft save |
| File-DB sync | ✅ Complete | Rename/move/delete in `routes/assets.js` now sync to `assets` table; admin workspaces show `assetCount` |
| Sidebar — Work + Creations | ✅ Complete | Library renamed; nav restructured: Chat → Work (Drafts, Published) → Creations (Assets, Campaigns, Research) → My Business → Account |
| Creations page | ✅ Complete | `/creations` page: card grid of all assets, status badges, linked chat/campaign chips, slide-in detail panel, "Link to Campaign" and "Open in Canvas" actions |
| Cross-linking UI | ✅ Complete | ChatView shows linked asset chips below input; campaign detail shows "Linked Assets" section; asset cards show linked conversation + campaign |
| Per-client bot persona | ✅ Complete | Schema + auth session + system prompt injection + settings UI + API |
| Action menu | ✅ Complete | Visual grid menu replacing CommandPalette; Wand2 trigger; icon + category per command |
| Rich asset cards | ✅ Complete | Asset title, campaign chip, Open in Canvas + View in Creations in message bubble |
| Persona-driven welcome | ✅ Complete | "Hi, I'm {botName}" + personality subtitle + natural language suggestions + bot-voiced thinking |
| Priority skills per client | ✅ Complete | `prioritySkills` JSON column on `clients` table; merged into all 3 prompt builders; Settings page skill picker; admin workspace endpoint |
| Chat QOL — copy on hover | ✅ Complete | Copy/Check icons on assistant message hover |
| Chat QOL — code block copy | ✅ Complete | Copy button injected into `<pre>` blocks via afterUpdate DOM manipulation |
| Chat QOL — stop generation | ✅ Complete | AbortController in chat store; Square button in ChatInput; signal passed through fetch |
| Chat QOL — scroll-to-bottom | ✅ Complete | Floating ChevronDown button when >200px from bottom; auto-scroll only near bottom during streaming |
| Chat QOL — message regeneration | ✅ Complete | RefreshCw button on last assistant message; removes response and re-sends user message |
| Chat QOL — image upload | ✅ Complete | Paperclip button + paste + drag-drop; multer upload endpoint; Anthropic vision content blocks |
| Admin — user edit/reset/delete | ✅ Complete | Edit modal (name/email/role), send reset link, set temp password, delete with confirm; client admin scoped |
| Admin — mustChangePassword | ✅ Complete | Warning banner in AppShell; clears on password change in Settings; set by admin set-password endpoint |
| Login fix — Secure cookie | ✅ Fixed | `Secure` flag on session cookie blocked login over HTTP; use `npm run dev` for local dev |
| Login fix — seed script | ✅ Fixed | `seed-admin.js` role `'admin'` → `'super_admin'` to match three-tier enum |
| Login fix — password reset | ✅ Done | Admin + wizard passwords reset via bcrypt; stale sessions cleared |
| Org audit — cleanup | ✅ Complete | Removed orphan `acme-corp` test client + user (0 conversations, 0 assets); 2 clean workspaces remain |
| Arcane Academy — bot persona | ✅ Complete | "Archimedes" — wise arcane librarian with scholarly warmth and dry humor |
| Arcane Academy — priority skills | ✅ Complete | 8 skills: content-marketing, email-sequence, social-content, copywriting, launch-strategy, retention-lifecycle, referral-program, content-strategy |
| Arcane Academy — draft content | ✅ Complete | 4 drafts: LinkedIn wand post, blog (Apprentice→Journeyman), welcome email sequence (4 emails), Twitter potion kit thread |
| Arcane Academy — published content | ✅ Complete | Spellcasting Safety Guide (evergreen, cross-sells Enchanted Artifacts) |
| Arcane Academy — context enrichment | ✅ Complete | channels.md for both products + company style-guide.md |
| Agent system — Phase 1 (Choice Events) | ✅ Complete | `ChoiceCards.svelte` + chat store `pendingChoices` + SSE `choices` event wiring |
| Agent system — Phase 2 (Intent Classification) | ✅ Complete | `intentClassifier.js` + `guidedFlows.js` + routing in `chat.js`; natural language routes to agent chains without slash commands |
| Agent system — Phase 3 (Agent Activity) | ✅ Complete | `AgentActivityPanel.svelte` replaces ConversationToolsStrip with full chain timeline |
| Agent system — Phase 4 (Simplified UX) | ✅ Complete | Static ActionCards replace rotating suggestions; ChatInput simplified (removed keyword highlighting, command chip; wand moved secondary); canvas auto-detection heuristic (400+ words or 200+ with headings) |
| Agent system — Phase 5 (Org/Sharing) | ⏸ Deferred | Schema ready (`userId` + `visibility` on assets); runtime filtering + Library toggle deferred until multi-user sharing needed |
| Chat/Canvas separation — Round 1 | ✅ Complete | Delta target routing, content tag parser, intent classifier fence fix, system prompt instructions |
| Chat/Canvas separation — Round 2 | ✅ | Stream all agents to canvas, smarter intent classification, primary Maiar agent identity |
| Chat/Canvas separation — Round 3 | ✅ | Content tag routing in agent chains, conversation state isolation, canvas perf fixes |
| Domain (maiar.work) | ⬜ Planned | Purchased on GoDaddy; DNS → Cloudflare → Mac Mini pending |

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

### Next Steps (Hosted Product — Post Agent System)

All Level 2B phases + agent system Phases 1–4 complete. Remaining: Phase 5 (Organization/Sharing), testing, infrastructure, go-live.

**0. Agent system Phase 5 (Organization/Sharing) — Deferred**
Schema groundwork done (`userId` + `visibility` columns on `assets` table). Runtime not built: no query-time visibility filtering on asset list (currently filesystem-based), no "My Drafts / All Published" Library toggle. Defer until multi-user workspace sharing is needed — current single-workspace-per-client architecture makes this a no-op. When ready to build:
- `routes/assets.js` GET `/:folder` — query DB with `WHERE visibility = 'org' OR userId = ?` instead of raw `listFiles()`
- `ui/src/routes/assets/[folder]/+page.svelte` — add tab/toggle for "My Drafts" vs "Published (Team)"
- ~~Delete dead file: `ui/src/lib/components/chat/ConversationToolsStrip.svelte`~~ ✅ Done

**1. End-to-end test session** — Start server with `npm run dev`, verify: `/creations` page loads, assets register on `/write`, linked chat/campaign chips appear, sidebar Work/Creations sections render, canvas opens from asset detail panel, Arcane Academy drafts/published appear in Library.

**2. Test Arcane Academy workspace** — Log in as `wizard@maiar.work`, verify: Archimedes welcome screen, 4 drafts + 1 published in Library, priority skills in Settings, context files load in chat.

**3. Fix remaining Svelte 5 warnings (non-blocking)** — Batch-fix self-closing tag warnings across all `.svelte` files. Also add Inter variable font to `ui/static/fonts/` to clear the 404.

**4. Configure Resend** — Add `RESEND_API_KEY` and `EMAIL_FROM` to `.env`; verify domain in Resend dashboard for production sends.

**5. Mac Mini infrastructure + maiar.work domain:**
- Point GoDaddy nameservers to Cloudflare → `A` record → Mac Mini IP
- `brew install caddy` → copy `Caddyfile.example` to `/etc/caddy/Caddyfile` → `brew services start caddy`
- Copy repo to Mac Mini, create fresh `.env` with Mac Mini paths
- `npm run build` → `npm start` (production mode)

**6. First client:**
- Log in as super admin at `/admin` → create workspace → create client_admin user → share credentials → client completes onboarding wizard

**7. Backups:**
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

### 2026-02-17 — Chat/Canvas separation + Agent UI fix

**Problem:** Intent classifier JSON parse fails (Claude wraps in markdown fences) → falls back to general → no agents activate → no AgentActivityPanel. All Claude output (thinking + content) streams into both chat bubble AND canvas. Saved files include preamble.

**Plan (6 files):**

1. `lib/intentClassifier.js` — Strip markdown fences before JSON.parse (the #1 blocker)
2. `routes/chat.js` — Add `target` field to delta events (`chat` vs `canvas`), add `canvasContent` accumulator, route agent chain output to canvas only, send brief chat messages before/after, save only canvas content to disk, add `<content>` tag parser for non-agent paths
3. `lib/systemPrompt.js` — Add `<content>` tag instructions to `buildSystemPrompt()` and `buildCommandPrompt()` so Claude wraps deliverables in tags (not needed for `buildAgentPrompt()` since agent chains route directly)
4. `ui/src/lib/stores/chat.ts` — Modify `appendDelta(text, target)` to route chat-targeted text to `streamingText` and canvas-targeted text to `canvasContent` (no more mirroring)
5. `ui/src/lib/components/chat/ChatView.svelte` — Pass `event.target` to `appendDelta`, auto-open canvas on first canvas delta
6. Verify with `vite build`

**Round 1 implemented (6 files changed):** ✅
- `intentClassifier.js` — fence stripping
- `routes/chat.js` — delta target routing, content router, canvasContent accumulator
- `systemPrompt.js` — `<content>` tag instructions
- `stores/chat.ts` — appendDelta with target param
- `ChatView.svelte` — pass event.target, auto-open canvas
- Build verified clean

**Round 1 test results (screenshots in `screenshots/`):**
- Screenshot 1: "Write a blog post about reducing churn" — intent classified correctly, agents ran (editor → seo-optimizer → meta-creator → internal-linker), AgentActivityPanel visible. BUT canvas only showed last agent's (internal-linker) output — not the evolving blog post.
- Screenshot 2: "What's the best time to post on LinkedIn?" — Misclassified as SEO intent, routed to seo-optimizer agent which responded confused. Canvas opened unnecessarily.

**Round 2 plan (3 fixes, 6 files):**

**Fix 1 — Stream ALL agents to canvas, not just last**
- `lib/agentRunner.js` — Remove `isLastAgent` branching. Stream every agent. Send `canvas_clear` event between agents so canvas shows each agent's refined version of the document.
- `routes/chat.js` — Wrap `sendEvent` in agent chain to reset `canvasContent` on `canvas_clear` (disk save captures final agent only)
- `ui/stores/chat.ts` — Add `clearCanvas()` method
- `ui/ChatView.svelte` — Handle `canvas_clear` event

**Fix 2 — Smarter intent classification**
- `lib/intentClassifier.js` — Update prompt: questions/advice → general, action requests → specific intents. Add examples.
- `routes/chat.js` — Add confidence threshold (>= 0.7). Low confidence falls to general chat.

**Fix 3 — Primary Maiar agent identity**
- `lib/systemPrompt.js` — Add marketing guru identity to `buildSystemPrompt()`. Answer questions conversationally, propose actions when appropriate ("Want me to write a blog post about that?"), don't produce content unprompted, don't identify as a sub-agent.

**Full plan:** `.claude/plans/joyful-squishing-mango.md`

**Round 2 implemented (6 files changed):** ✅
- `lib/agentRunner.js` — Removed `isLastAgent` branching; all agents stream to canvas with `canvas_clear` between them
- `lib/intentClassifier.js` — Updated prompt with question vs action classification rules
- `lib/systemPrompt.js` — Added `MAIAR_AGENT_IDENTITY` to `buildSystemPrompt()` (marketing guru persona, conversational for questions, proposes actions)
- `routes/chat.js` — Added confidence threshold >= 0.7, wrapped `sendEvent` to reset `canvasContent` on `canvas_clear`
- `ui/stores/chat.ts` — Added `clearCanvas()` method
- `ui/ChatView.svelte` — Added `canvas_clear` event handler
- Build verified clean

---

### 2026-02-18 — Round 3: Canvas preamble fix, state isolation, performance

**Problem:** Round 2 testing revealed: (1) Canvas still shows agent preamble/thinking ("I need to gather context...") because agent chains bypass the `<content>` tag router — all agent output goes directly to canvas. (2) Clicking between conversations carries over streaming state (agent panel, badges) because `loadConversation()` only resets messages, not transient UI state. (3) UI freezes during long streaming because `MarkdownRenderer` re-parses with `marked()` + `highlight.js` on every delta, and `AgentActivityPanel` iterates all messages on every store update.

**Done (8 files, 4 fixes):**

**Fix 1 — Content tag routing in agent chains**
- Created `lib/contentRouter.js` — extracted `createContentRouter()` from `routes/chat.js` into shared module
- Updated `lib/agentRunner.js` — each agent's output now routes through content router: preamble (outside `<content>` tags) → chat, deliverable (inside tags) → canvas
- Updated `lib/systemPrompt.js` — added `CONTENT_TAG_INSTRUCTIONS` to `buildAgentPrompt()` so agents know to wrap deliverables in `<content>` tags
- Updated `routes/chat.js` — imports content router from shared module instead of defining inline

**Fix 2 — Conversation state isolation**
- Updated `ui/stores/chat.ts` `loadConversation()` — now resets ALL transient state (`...initial` spread), aborts any in-flight streaming via `abortController.abort()` before switching

**Fix 3 — Canvas streaming performance**
- Updated `ui/CanvasPane.svelte` — replaced `<MarkdownRenderer>` with raw `<pre>` during streaming. Markdown parsing only happens after streaming completes. Eliminates thousands of `marked()` + `highlight.js` calls per generation.

**Fix 4 — Reactive computation optimization**
- Updated `ui/AgentActivityPanel.svelte` — `sessionAgents`/`sessionSkills` only recompute when `!isStreaming && messages.length changes`, not on every delta
- Updated `ui/ChatView.svelte` — auto-scroll uses `requestAnimationFrame` instead of direct `scrollTo` on every delta

**Build:** `vite build` passes clean.

**Decisions:**
- `MAIAR_AGENT_IDENTITY` stays in `buildSystemPrompt()` only (general chat), NOT in `buildAgentPrompt()` — agents are specialists, the Maiar personality shows through the brief chat messages before/after agent chains
- Content router is shared module (`lib/contentRouter.js`) used by both `chat.js` and `agentRunner.js`

**Next:**
- End-to-end test all three scenarios: write command (canvas shows only content), conversational question (stays in chat), conversation switching (no stale state)
- Verify no freezing during long content generation

---

### 2026-02-17 — Cleanup + server restart + first live test

**Done:**
- Deleted dead file `ui/src/lib/components/chat/ConversationToolsStrip.svelte` (last remaining cleanup from Agent-First UX Rethink)
- Killed stale processes on ports 3000/5173/5174 and restarted dev server successfully
- First live test: server started, user logged in, sent a message — intent classifier ran, content auto-detected (2116 words), auto-saved to `drafts/`, asset registered, conversation created

**Observed issues:**
- Intent classifier JSON parse failed on first message (backtick-wrapped JSON from Claude) — fell back to `general` intent. Non-blocking but should be fixed (strip markdown fences from classifier response before parsing)
- Inter font 404 (`/fonts/inter-var.woff2`) — font file not in `ui/static/fonts/`
- Svelte 5 self-closing tag warnings still present (non-blocking)

**Next:**
- Fix intent classifier JSON parsing (strip ```json fences)
- Add Inter variable font to `ui/static/fonts/`
- Continue end-to-end testing (items 1–2 in Next Steps)

---

### 2026-02-17 — Agent-First UX plan review

**Done:**
- Reviewed all 5 phases of the Agent-First UX Rethink plan against the codebase
- Phases 1 (Choice Events), 2 (Intent Classification), 3 (Agent Visibility) — fully complete, all artifacts exist and wired
- Phase 4 (Greeting + Canvas) — complete per progress.md; built as flat 6-card grid (plan specified tiered layout with secondary row)
- Phase 5 (Org/Sharing) — schema done (`userId` + `visibility` columns on `assets` table), runtime not built (no query-time filtering, no Library toggle)
- Identified dead file: `ConversationToolsStrip.svelte` (replaced by `AgentActivityPanel`, not imported anywhere)

**Decisions:**
- Phase 5 runtime deferred — single-workspace-per-client makes sharing features a no-op until multi-user workspaces are active
- Phase 4 greeting deviation accepted — flat 6-card grid works; tiered layout is a polish item, not a blocker

**Remaining cleanup:**
- Delete `ui/src/lib/components/chat/ConversationToolsStrip.svelte` (dead file)

**Next:**
- Continue with "Next Steps (Hosted Product)" items 1–7 (testing, infrastructure, go-live)

---

### 2026-02-17 — Agent system Phase 4 complete (Simplified UX)

**Done:**
- Replaced rotating suggestion grid (12 items, 4 visible, 8s rotation) with 6 static ActionCards in a 2×3 grid — each has an icon, label, description, and sends natural language (routed by intent classification)
- Simplified ChatInput: removed keyword highlighting overlay (`highlightKeywords`, `buildHighlightHtml`, `escapeHtml`), removed command chip badge system (`selectedCommand`, agent pills), moved wand/ActionMenu trigger to secondary position (right side, after image upload). Command selection now inserts text into input instead of creating a chip.
- Added canvas auto-detection heuristic in `routes/chat.js`: responses with 400+ words, or 200+ words with markdown headings, auto-save to drafts and send `content_detected` SSE event to open canvas — no explicit `producesContent` flag needed for general chat
- Build verified clean (`vite build` succeeds)

**Files changed:**
- `ui/src/lib/components/chat/ChatView.svelte` — ActionCard grid, removed rotation logic + Bot import + onDestroy
- `ui/src/lib/components/chat/ChatInput.svelte` — simplified (removed ~80 lines of keyword/chip code)
- `ui/src/lib/components/chat/ActionCard.svelte` — added Mail + Share2 icons
- `maiar-server/routes/chat.js` — canvas auto-detection heuristic in handleCompletion

---

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
- End-to-end test password reset flow (start server, walk through forgot → email → reset → login)
- Mac Mini infrastructure when ready to go live

*Git pushed: `064c259` — 167 files, security scan clean, no secrets in commit.*

---

### 2026-02-16 — Level 2B planning + Phase 1 chat reliability fixes started

**Done:**

*Architecture planning (8-phase plan):*
- Explored entire codebase: chat flow (routes/chat.js → lib/claude.js → chat.ts → ChatView.svelte), system prompt construction, skill/agent loading, sidebar navigation, database schema, admin routes
- Identified root cause of second-message failure: `done` event not guaranteed to fire if conversation persistence throws; no safety net after SSE stream closes
- Identified canvas not opening: auto-save may fail silently, leaving `savedTo` null
- Confirmed web chat uses Anthropic API directly (NOT Claude Code) — skills and agents are NOT loaded into system prompt
- Created comprehensive 8-phase implementation plan at `.claude/plans/validated-jingling-lamport.md`

*Phase 1 fixes applied (3 files modified):*
- `routes/chat.js` — Restructured `onDone` callback with `try/finally` to guarantee `done` event always fires. Moved `conversation_id` event send before `done`. Added `[chat]` logging throughout (stream start, onDone, auto-save, conversation persist, done event).
- `ui/src/lib/components/chat/ChatView.svelte` — Added safety net: if `$chat.streaming` is still true after SSE loop exits, force `finishStreaming()` with console.warn. Added logging for canvas restore.
- `ui/src/lib/api/client.ts` — Added SSE buffer flush after reader exits: parses any remaining `data:` line that didn't end with `\n`.

**Decisions:**
- Agent orchestration: multi-step API calls (separate call per agent in chain), not single-call. Each agent gets its own system prompt. Higher cost but matches Claude Code quality.
- Skills loading: load relevant skills per command (not all 52 always)
- Chat naming: programmatic parsing (no LLM call) — "/write blog post about churn" → "Reducing Churn — Blog Post"
- Campaign system: full implementation with DB tables, detail page, asset checklist, chat/template linking
- Client management: formal `clients` table, multiple users per workspace, aggregate usage in admin
- Thinking indicator: Claude Code-style dynamic verbs during streaming

**Next:**
- Start server, test Phase 1 fixes (second message + canvas opening)
- Continue through Phase 2 (agent orchestration) → Phase 8 (beta tag) per plan

---

### 2026-02-17 — Phase 1 tested + Phase 2 built: agent orchestration, canvas-first content, 85% token reduction

**Done:**

*Phase 1 — chat reliability (tested and verified):*
- Started server, tested multi-message conversations via curl
- First message streams correctly, `[chat]` logging confirms event ordering
- Second message works with existing `conversationId`
- Rate limit errors properly caught as SSE error events (not 500s)
- Earlier 500 error was a stale session cookie, not a code bug

*Phase 2a — agent orchestration (5 files):*
- **`lib/commandRegistry.js`** — new file; maps all 21 Maiar commands to agent chains, skill slugs, and `producesContent` flag
- **`lib/agentRunner.js`** — new file; executes multi-step agent chains (one API call per agent); emits `agent_step` SSE events before each agent starts; intermediate agents run non-streaming, final agent streams
- **`lib/systemPrompt.js`** — added `buildAgentPrompt()` (agent prompt + skills + context), `loadSkills()` (loads SKILL.md by slug), `buildCommandPrompt()` (single command .md + skills + context), `sanitizeContext()` extracted as reusable function
- **`routes/chat.js`** — three-way routing: (1) agent-orchestrated commands → `runAgentChain()`, (2) skills-only commands → `buildCommandPrompt()`, (3) general chat → `buildSystemPrompt()`; imports `resolveCommand` and `runAgentChain`

*Phase 2b — canvas-first content display (5 files):*
- **`routes/chat.js`** — emits `content_start` SSE event before streaming for commands with `producesContent: true`
- **`ui/src/lib/stores/chat.ts`** — added `AgentStep` interface, `activeAgent`/`agentSteps` state, `setActiveAgent()` method; `appendDelta()` now mirrors text to `canvasContent` when canvas is open; `finishStreaming()` stores agent steps on messages
- **`ui/src/lib/components/chat/ChatView.svelte`** — handles `content_start` (opens canvas immediately), `agent_step` events; content commands show compact "Writing to canvas..." indicator instead of streaming markdown; non-command messages still render markdown in bubble
- **`ui/src/lib/components/chat/MessageBubble.svelte`** — when `savedTo` exists, renders compact "Draft saved" card with FileText icon instead of full markdown; agent step badges render above the card; removed Badge import, added FileText from lucide-svelte
- **`ui/src/lib/components/canvas/CanvasPane.svelte`** — new streaming mode: when `$chat.streaming && editContent`, shows read-only preview with "Generating..." spinner (no editor textarea); switches to split editor/preview after streaming finishes

*Token reduction — 85% savings:*
- Before: ~56k input tokens per call (CLAUDE.md + all 40+ command .md files + context)
- After: ~8.5k tokens for agent calls (agent prompt + relevant skills + context only)
- Dropped full command catalog from system prompt entirely — commands are now handled by the orchestration layer
- `buildSystemPrompt()` no longer loads command definitions
- Multi-turn conversations now viable within API rate limits

**Decisions:**
- Three prompt tiers: `buildAgentPrompt` (agent + skills + context) for orchestrated commands, `buildCommandPrompt` (single command + skills + context) for skills-only commands, `buildSystemPrompt` (CLAUDE.md + context) for general chat
- Canvas opens on `content_start` event (before deltas arrive), not after `done`
- Streaming text mirrors to `canvasContent` via `appendDelta()` for live preview in canvas
- `MessageBubble` compact card replaces full markdown render when `savedTo` is set — content lives in canvas only
- Agent step tags persist in conversation JSON (no schema change) and show on restored conversations

**Next:**
- Test in browser: verify canvas opens and streams content, chat shows compact cards, agent tags appear
- Phase 3 (Templates to navbar)
- Phase 4 (Smart chat naming)
- Phase 5 (Campaign system)
- Phase 6–8 (Thinking indicator, Client management, Beta tag)

---

### 2026-02-16 — UI refresh: muted burnt orange, wizard icon, EB Garamond, agent badges, rename

**Done:**

*Palette + fonts (4 files):*
- `ui/src/app.css` — All accent colors shifted to muted burnt orange (`--accent: #c2652a`, `--accent-dark: #a34f1e`, `--accent-light: #d4845a`); border/glow rgba updated; heading font `Syne` → `EB Garamond`; added `.font-decorative` utility class (italic serif)
- `ui/src/app.html` — Google Fonts link: Syne → EB Garamond
- `ui/tailwind.config.js` — heading font family + accent hex values updated

*Wizard icon + favicon (6 files):*
- **New:** `ui/src/lib/components/ui/WizardIcon.svelte` — custom SVG wizard hat with star at tip
- `ui/static/favicon.svg` — wizard hat on `#c2652a` rounded rect
- `ui/src/lib/components/layout/Sidebar.svelte` — Activity → WizardIcon; brand name uses `.font-decorative`
- `ui/src/routes/login/+page.svelte` — Activity → WizardIcon; subtitle decorative; gradient updated
- `ui/src/routes/forgot-password/+page.svelte` — Activity → WizardIcon; gradient updated
- `ui/src/routes/reset-password/+page.svelte` — Activity → WizardIcon; gradient updated

*Fantasy flair (3 files):*
- `ui/src/lib/components/ui/ParticleField.svelte` — purple → warm amber (`194, 130, 60`); 1-in-6 sparkle particles with pulsing alpha
- `ui/src/lib/components/chat/ChatView.svelte` — welcome area uses WizardIcon + "What shall we craft?" decorative text
- `ui/src/routes/assets/[folder]/+page.svelte` — empty state text uses `.font-decorative`

*Agent badges (2 files):*
- `ui/src/lib/utils/commandList.ts` — added `agents: string[]` to all 21 commands + `getCommandAgents()` helper
- `ui/src/lib/components/chat/MessageBubble.svelte` — rewritten: assistant messages get "Powered by" footer strip with Bot icon + left accent bar; user command messages get "routed to" badges below gold bubble

*Rename for Library files (3 files):*
- `routes/assets.js` — new `POST /:folder/:filename/rename` endpoint using `moveFile()`
- `ui/src/lib/api/client.ts` — added `assets.rename()` method
- `ui/src/routes/assets/[folder]/+page.svelte` — inline rename on file cards (Pencil icon) + rename in panel header

*Rename for Context templates (1 file):*
- `ui/src/routes/context/+page.svelte` — Pencil icon + inline rename in template editor header; delete button added

**Decisions:**
- Muted burnt orange (`#c2652a`) over vivid orange (`#ff630f`) — warmer, less aggressive
- EB Garamond for headings only; Inter remains body font; `.font-decorative` for sparing italic serif usage
- Agent badges below content (not above) — footer strip pattern with "Powered by" / "routed to" labels
- User command badges map specific agents per command (not just command name) — shows the full chain
- Rename uses existing `moveFile()` (same folder, new name) — no new filesystem helpers needed

**Next:**
- Test in browser: verify new colors, fonts, wizard icon, agent badges, rename functionality
- Phase 3 (Templates to navbar)
- Phase 4 (Smart chat naming)
- Phase 5–8 remaining

---

### 2026-02-16 — FA7 wizard icon, context-aware onboarding gate, chat input redesign, rotating suggestions

**Done:**

*Wizard icon swap (2 files):*
- `ui/src/lib/components/ui/WizardIcon.svelte` — replaced custom hand-drawn SVG with Font Awesome 7 `hat-wizard` solid icon (`viewBox="0 0 640 640"`, filled path)
- `ui/static/favicon.svg` — updated favicon to use same FA7 hat-wizard icon scaled into 32×32 rounded rect

*Context-aware onboarding gate (3 files):*
- `routes/context.js` — new `GET /context/status` endpoint; checks if `brand-voice.md` or any product `overview.md` is filled (200+ bytes); returns `{ ready: boolean }`
- `ui/src/lib/api/client.ts` — added `context.status()` method
- `ui/src/lib/components/chat/ChatView.svelte` — replaced old `onboardingComplete` DB flag check with live context status check on mount; applies to ALL users (admins included); fails open on API error; shows OnboardingFlow when context is empty, welcome+suggestions when ready

*Chat input redesign (1 file):*
- `ui/src/lib/components/chat/ChatInput.svelte` — removed `border: 1px solid var(--border)` and `box-shadow`; replaced with soft `border-bottom: 2px solid` that glows accent on focus; added faded WizardIcon (14px, 30% opacity) that appears when input is empty and disappears on typing; removed "Enter to send" helper text

*Rotating suggestions with agent badges (in ChatView.svelte):*
- Pool of 12 diverse suggestions covering `/write`, `/ideas`, `/social`, `/email`, `/campaign`, `/research`, `/ads`, `/strategy`, `/audit`, `/lifecycle`, `/competitor`, `/brand-positioning`
- Shuffled on mount, 4 visible in 2×2 grid
- Every 8 seconds, one card swaps to a new suggestion from the pool
- Each card shows command in accent, description in muted, plus agent badge pills (Bot icon + agent name) pulled via `getCommandAgents()`

**Decisions:**
- Context check replaces `onboardingComplete` DB flag — purely file-based, no stale state
- Check runs on mount only (empty chat state) — never interrupts active conversations
- Fails open on API error — chat always accessible
- Admins see onboarding too if context is empty — context readiness matters for all roles
- FA7 `hat-wizard` solid icon chosen over custom SVG for consistency and recognizability

**Next:**
- Test in browser: full end-to-end (context check → onboarding → suggestions → chat)
- Phase 3 (Templates to navbar)
- Phase 4 (Smart chat naming)
- Phase 5–8 remaining

---

### 2026-02-16 — Level 2B complete: campaigns, workspace management, thinking indicator, smart naming, templates, beta tag

**Done:**

*Phase 5 — Campaign system (completed):*
- `db/schema.js` — added `campaigns` table (id, userId, clientSlug, title, status, planPath, assetPlan JSON, timestamps) + `campaignId` FK on `conversations`
- `routes/campaigns.js` — new file: full CRUD (list/get/create/update/delete) + conversation linking/unlinking, scoped by clientSlug
- `ui/src/routes/campaigns/+page.svelte` — campaign list with status badges, grid cards, "New Campaign" button
- `ui/src/routes/campaigns/[id]/+page.svelte` — detail page: editable title, status dropdown, plan viewer, asset checklist, linked conversations
- `routes/chat.js` — accepts `campaignId` in POST body, stores on conversation record
- `ui/src/lib/api/client.ts` — `streamChat` now passes `campaignId`; full `campaigns` API object added
- `ui/src/lib/components/chat/ChatView.svelte` — reads `campaignId` + `prefill` from URL query params; clears campaignId after conversation created
- `ui/src/lib/components/chat/ChatInput.svelte` — added `initialValue` prop for campaign prefill
- `ui/src/lib/components/ui/Badge.svelte` — added `info` variant
- `server.js` — mounted campaignRouter at `/api/campaigns`
- `ui/src/lib/components/layout/Sidebar.svelte` — Campaigns href changed to `/campaigns`

*Phase 7 — Client workspace management (completed):*
- `db/schema.js` — added `clients` table (id, slug unique, displayName, active, createdAt)
- `scripts/migrate-clients.js` — new migration script: backfills clients from distinct clientSlug values; ran successfully (3 clients: admin, acme-corp, arcane-academy)
- `routes/admin.js` — 4 new workspace endpoints: `GET /workspaces` (list with user counts + aggregate usage), `POST /workspaces` (create + dirs + master context copy), `PATCH /workspaces/:id` (update), `GET /workspaces/:id/users`
- `ui/src/lib/api/client.ts` — workspace API methods (list, create, update, getUsers)
- `ui/src/routes/admin/+page.svelte` — full rewrite with 3 tabs: Workspaces (expandable cards with user/usage counts), Users (full table with workspace + role badges), Usage (token counts + est cost)

*Previously completed in this session (Phases 3, 4, 6, 8):*
- Phase 3: Templates moved from Context tab to sidebar Library section
- Phase 4: `generateTitle()` in chat.js + PATCH rename endpoint + inline rename UI
- Phase 6: `ThinkingIndicator.svelte` with dynamic verbs per agent, pulsing dot, step counter
- Phase 8: Beta badge in sidebar next to Maiar logo

*Builds verified passing (exit code 0).*

**Decisions:**
- Campaign detail page links to chat with `?prefill=/command&campaignId=X` query params — no special routing needed
- `clients` table is separate from `users` (workspace entity vs user entity) — users reference client via `clientSlug`
- Admin page restructured around workspaces as the primary entity, with users and usage as secondary views

**Next:**
- End-to-end test all Level 2B features in browser
- Mac Mini infrastructure + maiar.work domain setup
- First client onboarding via workspace management

---

### 2026-02-16 — Standard app functionality: roles, profile/settings, login fixes, chat input polish

**Done:**

*Critical bug fixes (2 files):*
- `ui/src/routes/+layout.svelte` — `publicRoutes` hoisted to module scope, now includes `/forgot-password` and `/reset-password`; slot rendering condition updated to cover all public routes (was hardcoded to `/login` only)
- `lib/auth.js` — `requireAuth` middleware wrapped in try/catch; Express 4 async middleware errors now return 500 instead of becoming unhandled rejections

*Chat input polish (3 files):*
- `ui/src/lib/components/chat/ChatInput.svelte` — WizardIcon replaced with inline MDI `auto-fix` wand SVG (wizard hat stays as logo elsewhere); keyword highlighting overlay added (recognized commands, agents, categories get accent underline); keyboard navigation for command palette (ArrowUp/Down, Enter to select, Tab to autocomplete, Escape to close)
- `ui/src/lib/components/chat/CommandPalette.svelte` — rewritten: commands grouped by category with colored section headers; agent badge pills (Bot icon + name) on each command; highlight index tracks keyboard selection; exported `moveUp()`/`moveDown()`/`selectCurrent()` methods for parent keyboard control
- `ui/src/lib/utils/commandList.ts` — unchanged (already had all data needed)

*Three-tier role system (8 files + migration script):*
- `scripts/migrate-roles.js` — one-time script: `UPDATE users SET role = 'super_admin' WHERE role = 'admin'`; migrated 1 user
- `db/schema.js` — role enum changed from `['client', 'admin']` to `['client', 'client_admin', 'super_admin']`; added 5 nullable profile columns: `name`, `avatarUrl`, `companyName`, `companyLogo`, `companyWebsite`
- `lib/auth.js` — `requireAdmin` now checks `super_admin`; new `requireClientAdmin` middleware (client_admin OR super_admin); `getUserAttributes` returns `name`; `requireAuth` has try/catch
- `routes/admin.js` — removed router-level middleware; all super admin routes get per-route `requireAuth, requireAdmin`; added 3 client admin scoped routes: `GET /my/users`, `POST /my/users` (role forced to client), `GET /my/usage`; `POST /clients` now validates 3 roles and persists `displayName` as `name`; `GET /clients` returns `name` column
- `routes/auth.js` — login and session responses now include `name`
- `ui/src/lib/stores/auth.ts` — `SessionUser.role` type updated; `isAdmin` checks `super_admin`; added `isClientAdmin` derived store
- `ui/src/lib/api/client.ts` — added `admin.listMyUsers()`, `admin.createMyUser()`, `admin.getMyUsage()`; added full `profile` export (get, update, uploadAvatar, uploadCompanyLogo)
- `ui/src/routes/admin/+page.svelte` — guard uses `isClientAdmin`; conditional data loading (super admin sees all, client admin sees own workspace); role selector shows 3 roles for super admin, hidden for client admin; role badges with 3 variants; Name column with initials avatar in user table

*User profile and settings (4 files):*
- `routes/profile.js` — new file: `GET /api/profile`, `PATCH /api/profile` (name, companyName, companyWebsite), `POST /api/profile/avatar` (multer, 2MB limit, JPEG/PNG/WebP), `POST /api/profile/company-logo`
- `server.js` — mounted profileRouter at `/api/profile`; added `express.static` for `/avatars` directory
- `ui/src/routes/settings/+page.svelte` — new page with 3 sections: Personal (avatar upload + preview, name, email read-only), Change Password (current + new + confirm, strength indicator), Company (logo upload, company name, website)
- `ui/src/lib/components/layout/Sidebar.svelte` — Settings nav item in new "Account" section; Admin section now visible to `isClientAdmin`; bottom bar shows user initials circle + name (or email fallback)

**Decisions:**
- Three-tier roles: `super_admin` (Trevor, full platform), `client_admin` (manage own workspace team + usage), `client` (regular user)
- Client admins can only create `client` role users in their own workspace — no slug field, no role selector
- `name` included in session response (lightweight). `avatarUrl`, company fields fetched on demand via `/api/profile` (not in every session validation)
- Avatars stored in `ui/static/avatars/[userId].ext` — served via Express static in both dev and production
- Keyword highlighting uses a transparent overlay div with `pointer-events: none` over the textarea — no third-party dependency
- Domain `maiar.work` purchased on GoDaddy — hosting setup deferred to next session

**Next:**
- Start server, end-to-end test: login → settings → profile save → admin dashboard → role-based views
- Fix SMTP credentials (Google App Password rejected)
- Set up maiar.work domain (GoDaddy → Cloudflare → Mac Mini)
- Continue Level 2B phases: templates to navbar, smart naming, campaigns, thinking indicator

---

### 2026-02-17 — UI polish: sidebar restructure, 404 page, mobile menu, canvas fix, command badges, tools strip

**Done:**

*Sidebar restructure (1 file):*
- `ui/src/lib/components/layout/Sidebar.svelte` — Templates moved from `library` to `context` section; section renamed from "Context" to "My Business"; added `onClose` prop for mobile overlay; nav links and logout call `onClose`

*Standard web app functionality (4 files):*
- `ui/src/routes/+error.svelte` — **new file**: styled 404/error page with status code, message, and "Back to Chat" link; self-contained (no AppShell dependency)
- `ui/src/lib/components/layout/AppShell.svelte` — rewritten: mobile hamburger menu (`lg:hidden`) with sidebar overlay + backdrop; replaces `display: none` media query
- `ui/src/routes/admin/+page.svelte` — reactive `$:` role guard prevents non-admin content flash (supplements existing `onMount` guard)
- `ui/src/routes/settings/+page.svelte` — "Forgot password?" link added to Change Password section

*Canvas & asset fix (3 files):*
- `lib/commandRegistry.js` — `/competitor` `producesContent: false` → `true` (was mismatched with client)
- `ui/src/lib/utils/commandList.ts` — `/brand-research` `producesContent: false` → `true` (was mismatched with server)
- `ui/src/lib/components/chat/ChatView.svelte` — canvas closes on stream error and safety-net (prevents blank canvas stuck open)

*Command bar badges + tools strip (3 files):*
- `ui/src/lib/components/chat/ChatInput.svelte` — rewritten: selecting a command from palette renders it as a styled badge chip (accent border, dot indicator, agent pills, ✕ to clear); Backspace on empty input clears chip; textarea holds only arguments; placeholder shows expected args; submit reconstructs full message
- `ui/src/lib/utils/commandList.ts` — `skills: string[]` added to `Command` interface and all 21 commands (copied from `commandRegistry.js`); `getCommandSkills()` helper added
- `ui/src/lib/components/chat/ConversationToolsStrip.svelte` — **new file**: derives unique agents from `$chat.messages[].agentSteps` and skills from user command messages; renders as horizontal badge strip (agents in accent, skills in blue); "Session tools" label; only visible when tools have been used

*Wiring:*
- `ui/src/lib/components/chat/ChatView.svelte` — imports and renders `ConversationToolsStrip` between messages and `ChatInput`

*Build verified passing (exit code 0).*

**Decisions:**
- Sidebar section renamed to "My Business" (user preference) — Templates + Context grouped as business configuration
- Command chip replaces raw text insertion on palette select — keeps textarea for arguments only, reconstructs full command on submit
- Skills derived client-side from `COMMANDS[].skills` matching user message commands — no server round-trip needed
- Canvas closes on error instead of staying blank — better UX for failed content commands
- `producesContent` is the single source of truth for canvas behavior — must match between `commandRegistry.js` (server) and `commandList.ts` (client)

**Next:**
- Start server, end-to-end test all changes in browser
- Mac Mini infrastructure + maiar.work domain setup
- Populate brand context via `/brand-research`

---

### 2026-02-17 — Command bar UX: tools strip repositioned, free-form command input

**Done:**

*Tools strip repositioned (2 files):*
- `ui/src/lib/components/chat/ChatView.svelte` — Swapped render order: `ChatInput` now renders before `ConversationToolsStrip`; agents and skills accumulate beneath the input where users type
- `ui/src/lib/components/chat/ConversationToolsStrip.svelte` — Removed `border-top` separator; adjusted padding (`pb-3 pt-1`) to connect naturally below the input area

*Free-form command input (1 file):*
- `ui/src/lib/components/chat/ChatInput.svelte` — Placeholder when command chip is selected changed from args-specific text (e.g., "topic or type") to generic "Add context or press Enter to run..."; users can type anything or send immediately with no args

**Decisions:**
- Tools strip belongs below the input (not between messages and input) — users see accumulated agents/skills in their peripheral vision while typing
- Command chips should not prescribe what to type — generic placeholder signals that any context (or none) is valid
- Submit already handled empty args (`selectedCommand.name` sent alone) — no backend changes needed

**Next:**
- Start server, end-to-end test tools strip position + free-form commands
- Mac Mini infrastructure + maiar.work domain setup
- Populate brand context via `/brand-research`

---

### 2026-02-17 — Assets architecture, cross-linking, per-client isolation, sidebar restructure

**Done:**

*Per-client isolation fixes (3 files):*
- `lib/fileSystem.js` — exported `clientRoot()` so other modules can import it
- `lib/contextLoader.js` — replaced 4 hardcoded `join(config.maiarRoot, 'clients', clientSlug, ...)` with `join(clientRoot(clientSlug), ...)` — fixes ADMIN_WORKSPACE bypass bug where admin context was loaded from wrong path
- `db/schema.js` — added nullable `clientSlug` column to `conversations` table
- `routes/chat.js` — writes `clientSlug` on conversation insert; filters by `clientSlug` on list/get/delete (removed secondary users join for isolation checks)
- `scripts/migrate-conversation-client-slug.js` — backfilled 21 existing conversations

*Assets DB architecture (4 files):*
- `db/schema.js` — new `assets` table: id, clientSlug, conversationId (FK, onDelete: set null), campaignId (FK, onDelete: set null), title, filePath, folder, status, timestamps
- `routes/assets-db.js` — new file: full CRUD at `/api/asset-records` with query filters (?conversationId, ?campaignId, ?folder); enriches list with conversation/campaign titles
- `routes/chat.js` — after auto-saving a draft, inserts asset record linked to conversation; links asset to newly created conversation when conversationId wasn't known at save time
- `routes/assets.js` — rename/move/delete now sync to `assets` table (update filePath/folder/status or delete record)
- `routes/admin.js` — `GET /workspaces` now includes `assetCount` per workspace
- `server.js` — mounted `assetsDbRouter` at `/api/asset-records`
- `scripts/migrate-assets.js` — backfill script (0 legacy files found — new assets auto-register going forward)

*Sidebar + Creations page (3 files):*
- `ui/src/lib/components/layout/Sidebar.svelte` — nav restructured: Chat → **Work** (Drafts, Published) → **Creations** (Assets, Campaigns, Research) → My Business (Templates, Context) → Account
- `ui/src/routes/creations/+page.svelte` — new page: card grid of all assets with status badges, linked chat chips (→ `/chat?convId=X`), linked campaign chips (→ `/campaigns/Y`); slide-in detail panel with "Open in Canvas", "Link to Campaign" dropdown, and campaign unlinking
- `ui/src/lib/api/client.ts` — added `assetRecords` API object (list, get, update, delete)

*Cross-linking UI (2 files):*
- `ui/src/lib/components/chat/ChatView.svelte` — loads linked assets when conversation opens; shows asset chips below input with "Open in Canvas" click
- `ui/src/routes/campaigns/[id]/+page.svelte` — new "Linked Assets" section in right sidebar showing all assets linked to this campaign with status badges

*Schema pushed + migrations run. Build verified passing (exit 0).*

**Decisions:**
- `assets` table is the relational layer on top of the existing filesystem — file is source of truth for content, DB is source of truth for relationships
- Separate `routes/assets-db.js` from `routes/assets.js` to avoid disrupting existing file CRUD that CanvasPane and Library depend on
- `conversations.clientSlug` is nullable for SQLite ALTER TABLE compatibility (same pattern as `onboardingComplete`)
- Asset registration happens inside the auto-save try block in chat.js; failure is logged but doesn't break the chat flow
- Sidebar section names: "Work" for active drafts/published, "Creations" for the entity-level views (assets, campaigns, research)
- Arcane-academy content confirmed properly isolated in `clients/arcane-academy/` — no action needed

**Next:**
- Start server, end-to-end test: `/creations` page loads, assets register on `/write`, linked chips appear, sidebar sections render correctly
- Mac Mini infrastructure + maiar.work domain setup
- Populate brand context via `/brand-research`

---

### 2026-02-17 — Standalone app transformation: bot persona, action menu, asset cards, persona-driven welcome

**Done:**

*Phase 1 — Per-client bot persona (8 files):*
- `db/schema.js` — added `botName`, `botPersonality`, `botAvatarUrl` nullable columns to `clients` table
- `routes/auth.js` — login + session endpoints join `clients` table to include persona fields in response
- `ui/src/lib/stores/auth.ts` — extended `SessionUser`; added `botDisplayName` and `botPersonalityText` derived stores
- `lib/systemPrompt.js` — added `buildPersonaSection()` helper; all 3 prompt builders accept `persona` param; prepends "You are {botName}..." identity block
- `lib/agentRunner.js` — accepts and passes `persona` through to `buildAgentPrompt`
- `routes/chat.js` — looks up persona from `clients` table per request; passes to all prompt builders
- `routes/admin.js` — added `GET /my/workspace` (any auth user) and `PATCH /workspaces/:id/persona` (client_admin+)
- `ui/src/lib/api/client.ts` — added `persona.getMyWorkspace()` and `persona.update()` methods
- `ui/src/routes/settings/+page.svelte` — "Assistant Persona" section for client_admin/super_admin: bot name input, personality textarea, save

*Phase 2 — Action menu replacing command palette (3 files):*
- `ui/src/lib/utils/commandList.ts` — added `displayName` and `icon` fields to `Command` interface and all 21 entries; added `CATEGORY_ICONS` map; `filterCommands` searches displayName
- `ui/src/lib/components/chat/ActionMenu.svelte` — **new file**: visual grid menu with search, category grouping, icons, agent badges, keyboard navigation
- `ui/src/lib/components/chat/ChatInput.svelte` — rewritten: imports ActionMenu (replaces CommandPalette); persistent Wand2 button; placeholder uses `$botDisplayName`; keyword highlighting overlay; command chip shows displayName

*Phase 3 — Rich asset cards in chat (4 files):*
- `routes/chat.js` — includes `assetTitle` and `campaignTitle` in `done` SSE event
- `ui/src/lib/stores/chat.ts` — added `assetTitle`, `campaignTitle` to `Message` interface and `finishStreaming`
- `ui/src/lib/components/chat/ChatView.svelte` — passes assetTitle/campaignTitle in finishStreaming call
- `ui/src/lib/components/chat/MessageBubble.svelte` — rich asset card: title with icon, Draft/Published badge, campaign chip, "Open in Canvas" + "View in Creations" buttons

*Phase 4 — Persona-driven welcome & suggestions (2 files):*
- `ui/src/lib/components/chat/ChatView.svelte` — welcome screen: "Hi, I'm {botDisplayName}" with personality subtitle; suggestion cards use natural language display with category labels (internally map to slash commands)
- `ui/src/lib/components/chat/ThinkingIndicator.svelte` — default verbs use bot persona name ("Luna is thinking..." instead of "Thinking...")

*All phases verified with passing builds.*

**Decisions:**
- Persona lives on `clients` table (per-workspace, not per-user) — all users in a workspace see the same bot identity
- ActionMenu replaces CommandPalette entirely — old component still exists on disk but is no longer imported
- Suggestions display natural language ("Write a blog post about reducing churn") but send slash commands internally — backend routing unchanged
- Bot persona injected as identity block at top of system prompt — every response uses the personality

**Next:**
- Start server, end-to-end test: set persona in Settings → verify welcome screen + thinking indicator + system prompt
- Test action menu: wand button → visual grid → select command → chip + submit
- Test asset cards: run `/write` → verify rich card with title, campaign chip, Open in Canvas
- Mac Mini infrastructure + maiar.work domain setup

---

### 2026-02-17 — Four-feature build: Resend email, priority skills, chat QOL, admin management

**Done:**

*Phase 1 — Resend email (4 files):*
- `lib/config.js` — replaced `smtp` config block with `resendApiKey` + `emailFrom`
- `lib/email.js` — rewrote from nodemailer to Resend SDK; same exported interface
- `.env.example` — replaced SMTP vars with `RESEND_API_KEY` + `EMAIL_FROM`
- `package.json` — swapped `nodemailer` for `resend` (v4.8.0 installed)

*Phase 2 — Priority skills per client (6 files):*
- `db/schema.js` — added `prioritySkills` (JSON text) to `clients` table; `mustChangePassword` to `users` table; schema pushed
- `lib/systemPrompt.js` — added `mergeSkills()` dedup helper; all 3 prompt builders accept `prioritySkills` param
- `lib/agentRunner.js` — accepts and passes `prioritySkills` to `buildAgentPrompt`
- `routes/chat.js` — fetches `prioritySkills` from clients table, passes to all prompt paths
- `routes/admin.js` — extended `PATCH /workspaces/:id` for prioritySkills; added `PATCH /my/workspace/skills` for client admin
- `ui/src/routes/settings/+page.svelte` — searchable skill picker grouped by 11 categories; toggle pills; save to backend

*Phase 3 — Chat QOL (8 files):*
- `MessageBubble.svelte` — copy-on-hover (Copy/Check icons, group-hover); regenerate button (isLast prop, RefreshCw)
- `MarkdownRenderer.svelte` — afterUpdate injects copy buttons into `<pre>` blocks with hover reveal
- `ChatInput.svelte` — image upload (Paperclip, paste, drag-drop, previews); stop generation (Square button)
- `chat.ts` — AbortController in state; `startStreaming()` returns controller; `stopStreaming()` + `removeLastMessage()`
- `ChatView.svelte` — scroll-to-bottom button (ChevronDown); abort signal to streamChat; AbortError handling; isLast/regenerate; `{message, images}` dispatch format
- `client.ts` — `streamChat` accepts `signal` + `images`; passes to fetch
- `routes/chat.js` — `POST /upload-image` (multer, 5MB, jpeg/png/gif/webp); main POST accepts `images` array; builds Anthropic content blocks
- `lib/claude.js` — accepts content arrays (image blocks) as `userContent`
- `lib/agentRunner.js` — passes images as content blocks in first agent step
- `server.js` — `express.json({ limit: '20mb' })` for base64 payloads

*Phase 4 — Admin account management (4 files):*
- `routes/admin.js` — 7 new endpoints: edit user, send reset link, set temp password, delete user, client admin toggle, client admin scoped reset link, priority skills self-service
- `lib/auth.js` — returns `mustChangePassword` in session attributes
- `routes/auth.js` — includes `mustChangePassword` in login/session; clears on change-password
- `ui/src/routes/admin/+page.svelte` — full Actions column: edit modal, send reset link, set password modal, delete confirmation; client admin scoped toggle + reset; toast notifications
- `ui/src/lib/components/layout/AppShell.svelte` — mustChangePassword warning banner with link to Settings
- `ui/src/lib/stores/auth.ts` — `mustChangePassword` in SessionUser
- `ui/src/lib/api/client.ts` — admin.editUser, sendResetLink, setPassword, deleteUser, toggleMyUser, sendMyUserResetLink

*Build verified passing (exit 0).*

**Decisions:**
- Resend over nodemailer — API-based, no SMTP credentials to manage, verified domain sending
- Priority skills merge with command-specific skills via `mergeSkills()` dedup — priority skills append, never override
- Image upload uses multer memory storage + base64 encoding for Anthropic API content blocks
- Stop generation uses AbortController signal passed through fetch to SSE reader
- `mustChangePassword` flag auto-set when admin uses set-password; clears on next password change
- Scroll-to-bottom only auto-scrolls during streaming when user is near bottom (>200px threshold shows button)

**Next:**
- Start server, end-to-end test all 4 features
- Configure Resend API key and verify domain for production email
- Mac Mini infrastructure + maiar.work domain setup

---

### 2026-02-17 — Login fix, org audit, Arcane Academy populated with example content

**Done:**

*Login diagnosis + fix (3 issues found):*
- **Secure cookie flag** — root cause of browser login failures. Lucia sets `Secure` on session cookie when `NODE_ENV=production`, which browsers silently reject over HTTP on localhost. Fix: use `npm run dev` for local development (no `Secure` flag).
- **seed-admin.js** — `role: 'admin'` on line 43 changed to `role: 'super_admin'` to match the three-tier enum `['client', 'client_admin', 'super_admin']`. Old value would fail on any new admin user creation.
- **Password reset** — Reset passwords for `admin@maiar.work` and `wizard@maiar.work` to `maiar-admin-2026` via inline bcrypt script. Cleared 10 stale sessions to force fresh session creation.

*Organization audit + cleanup:*
- Queried all DB tables: `users`, `clients`, `sessions`
- Found 3 users, 3 clients. Role migration had already run correctly (`super_admin` in DB).
- Removed orphan `acme-corp` test client + user (`admin+test@maiar.work`): 0 conversations, 0 assets, no directory on disk. Clean removal.
- Final state: 2 workspaces (Admin, Arcane Academy), 2 users, all roles and slugs correctly mapped.

*Arcane Academy workspace population:*
- **Bot persona** set in DB: "Archimedes" — a wise, witty arcane librarian with scholarly warmth and dry humor about modern shortcuts to ancient problems.
- **Priority skills** set: content-marketing, email-sequence, social-content, copywriting, launch-strategy, retention-lifecycle, referral-program, content-strategy (8 skills).
- **4 draft files** created in `maiar-server/clients/arcane-academy/drafts/`:
  1. `2026-02-17-social-a1b2c3d4.md` — LinkedIn post: "The Right Wand Changes Everything" (Enchanted Artifacts product marketing)
  2. `2026-02-17-write-e5f6g7h8.md` — Blog: "5 Signs You're Ready to Level Up from Apprentice to Journeyman" (Spellcasting Mastery course marketing)
  3. `2026-02-17-email-i9j0k1l2.md` — Welcome email sequence (4 emails: welcome, assessment reminder, workshop invite, 2-week check-in)
  4. `2026-02-17-social-m3n4o5p6.md` — Twitter/X thread: "Why Our Potion Kits Outsell Everything" (subscription box marketing)
- **1 published file**: `spellcasting-safety-guide.md` — evergreen reference with Three Laws, safety equipment table, Headmaster quote
- **3 context files** added:
  - `context/products/spellcasting-mastery/channels.md` — website, email, LinkedIn, YouTube, forum, paid channels
  - `context/products/enchanted-artifacts/channels.md` — e-commerce, email, Instagram, TikTok, Pinterest, paid channels
  - `context/company/style-guide.md` — capitalization, numbers, terminology, formatting standards by channel

*Important discovery: dual `clients/` directories.*
- Content originally written to `Maiar/clients/arcane-academy/` (project root)
- Server uses `Maiar/maiar-server/clients/arcane-academy/` (per `MAIAR_ROOT` in `.env`)
- All files copied to correct server-side location. Both directories now contain the files.

*Verified end-to-end:*
- Admin login returns 200 with `role: super_admin` ✅
- Wizard login returns 200 with `role: client_admin`, Archimedes persona ✅
- Assets API returns 4 drafts + 1 published for arcane-academy ✅
- Admin workspaces API shows both workspaces with correct metadata ✅

**Decisions:**
- `npm run dev` for local development (not `npm start`) — avoids Secure cookie issue on HTTP
- "Archimedes" chosen as bot name — owl-librarian archetype fits the scholarly wizard academy brand voice
- 8 priority skills selected to cover arcane-academy's core needs: content for courses, email for enrollment, social for brand, copywriting for product pages, launch for new courses, retention for subscriptions
- Orphan test data (acme-corp) deleted rather than kept — no conversations, no assets, no disk presence

**Next:**
- End-to-end browser test: log in as wizard, verify Archimedes welcome, check Library for all content, open files in canvas
- Configure Resend API key for production email
- Mac Mini infrastructure + maiar.work domain setup
- Note: when deploying to production (behind HTTPS/Caddy), `npm start` will work correctly since `Secure` cookie is appropriate over HTTPS

---

### 2026-02-17 — Login fix (password reset) + password visibility toggle

**Done:**
- **Password reset** — Cleared 9 stale sessions and reset passwords for both `admin@maiar.work` and `admin+wizard@maiar.work` to `Admin1234!` via inline bcrypt script. Root cause: stale/forgotten password (same recurring issue as previous sessions).
- **Password visibility toggle** — Added show/hide eye button to login page password field (`ui/src/routes/login/+page.svelte`). Uses inline SVGs (eye / eye-off), positioned inside input with opacity hover effect. `tabindex="-1"` so it doesn't interrupt form tab flow.
- **Port conflict diagnosis** — Server failed to start with `EADDRINUSE` on :3000 due to orphan background processes from diagnostic curl tests. Killed stale processes on :3000, :5173, :5174 to restore clean state.

**Decisions:**
- Used inline SVGs for eye icons instead of lucide-svelte to avoid icon library version issues
- Both user passwords reset to same value (`Admin1234!`) for simplicity during dev

**Next:**
- End-to-end browser test: log in as wizard, verify Archimedes welcome, check Library for all content, open files in canvas
- Configure Resend API key for production email
- Mac Mini infrastructure + maiar.work domain setup

---

### 2026-02-17 — Agent-first UX rethink: Phases 1–3 complete, Phase 4 started

**Done:**

*Planning:*
- Full 5-phase plan at `.claude/plans/steady-jumping-orbit.md` covering: structured choice events, intent classification, agent activity panel, agent-first greeting + canvas heuristic, organization/sharing model
- User chose: always-LLM classify, click → add context → send, keep slash commands as secondary, full chain timeline

*Phase 1 — Structured Choice Events (4 files):*
- `ui/src/lib/stores/chat.ts` — added `Choice`, `ChoiceSet`, `AgentChainEntry` interfaces; `pendingChoices`, `agentChain`, `activeSkills` state; `setAgentChain()`, `setChoices()`, `clearChoices()` methods; updated `setActiveAgent()` to transition chain timeline; updated `finishStreaming()` to clear new state
- `ui/src/lib/components/chat/ChoiceCards.svelte` — **new file**: renders server-sent choices as cards/buttons/list; icon mapping; dispatches `select` event
- `ui/src/lib/components/chat/ChatView.svelte` — handles `choices`, `agent_chain`, `content_detected` SSE events; renders `ChoiceCards` when `$chat.pendingChoices` non-null; `handleChoiceSelect()` populates input via `prefillValue`
- `ui/src/lib/components/chat/ChatInput.svelte` — reactive statement for external `initialValue` changes (choice selection → populate input)

*Phase 3 — Agent Activity Panel (2 files):*
- `ui/src/lib/components/chat/AgentActivityPanel.svelte` — **new file**: replaces `ConversationToolsStrip`; during streaming shows full agent chain timeline (pending/active/complete states with pulsing animation); after completion shows compact chip strip; integrates ThinkingIndicator
- `lib/agentRunner.js` — emits `agent_chain` SSE event before chain loop with full agent list + skills

*Phase 2 — Intent Classification + Agent-First Routing (5 files):*
- `lib/intentClassifier.js` — **new file**: LLM-based classification via `claude-haiku-4-5-20251001`; compact prompt listing all 21 intents + high-level categories; returns `{ intent, topic, confidence }`
- `lib/guidedFlows.js` — **new file**: `GUIDED_FLOWS` for `create` (6 choices) and `plan` (4 choices); `INTENT_TO_COMMAND` mapping 21 intents to slash commands
- `lib/commandRegistry.js` — added `resolveIntent(commandSlash, topic)` function
- `routes/chat.js` — new routing: slash command → intent classification → guided flows for categories → specific intent → general chat fallback; `sendChoices()` helper
- `lib/systemPrompt.js` — updated persona section: "Guide users naturally. Never mention slash commands."

*Phase 4 — Agent-First Greeting + Canvas (started):*
- `ui/src/lib/components/chat/ActionCard.svelte` — **new file**: reusable glass card with icon, label, description; normal + small sizes; lucide icon mapping

*All builds verified passing after each phase.*

**Decisions:**
- Every non-slash message gets a fast Haiku classification call (~0.5s) — best accuracy for intent routing
- Choice cards populate input (not auto-execute) — user adds context before sending
- Slash commands preserved as secondary via wand/ActionMenu button
- Agent chain timeline replaces ConversationToolsStrip — shows pending/active/complete during streaming
- Intent classifier is server-side — frontend sends natural language, server decides routing
- Canvas heuristic planned: 400+ words OR 200+ words with markdown headings → auto-save + content_detected event

**Next (Phase 4 remaining):**
- Update `ChatView.svelte` — replace rotating suggestion grid with static action cards (Create Content / Plan a Campaign / Research + secondary row: Audit, Optimize, Ideas, Strategy)
- Simplify `ChatInput.svelte` — move wand to secondary position, remove command chip + agent sub-chips + keyword highlighting overlay
- Add canvas auto-detection heuristic in `routes/chat.js` handleCompletion (word count > 400 or structured > 200)
- Handle `content_detected` event in ChatView (already wired in Phase 1)

**Phase 5 (pending):**
- Organization/sharing model: userId + visibility columns on assets table, migration, access filtering, frontend "My Drafts" / "All Published (Team)" tabs

---

### 2026-02-18 — Agent & Command Consolidation

**Problem:** Agent roster grew to 18 organically (10 SEOMachine ports + 8 new). Several issues:
- Editor agent produces analytical reports instead of editing content — misaligned with `/write` flow
- `/write` runs 4 sequential agents (editor → seo-optimizer → meta-creator → internal-linker) — slow
- Hardcoded "Castos" / "podcast creators" brand refs in 4+ SEOMachine-ported agents
- Narrow single-function agents (headline-generator, meta-creator, internal-linker) don't justify separate sub-processes
- cro-analyst + landing-page-optimizer always invoked together — redundant split

**Consolidation: 18 → 11 agents**

| Action | Agent | Detail |
|---|---|---|
| REWRITE | `editor` | Mission: produce rewritten content (not reports). Absorbs headline-generator formulas. Output = improved draft + brief change summary |
| REWRITE | `seo-optimizer` | Remove brand refs → read from context. Absorbs internal-linker methodology |
| NEW (merger) | `cro-optimizer` | Merges cro-analyst (psychology) + landing-page-optimizer (structural CRO) into single agent |
| REWRITE | `performance` | Remove "Castos" brand refs → read from context |
| KEEP | `content-analyzer` | 6-module content analysis — already well-scoped |
| KEEP | `brand-researcher` | Web research → populate context files |
| KEEP | `brand-strategist` | Positioning, message hierarchy, brand narrative |
| KEEP + EXPAND | `campaign-strategist` | Absorbs channel-selector scoring rubric into Channel Plan section |
| KEEP | `lifecycle-planner` | Customer lifecycle sequences |
| KEEP | `audience-analyst` | Persona validation, audience fit scoring |
| KEEP | `publishing-adapter` | Format & publish to external platforms |

**Agents removed:**

| Agent | Disposition |
|---|---|
| `keyword-mapper` | DELETE — already deprecated |
| `headline-generator` | MERGE into editor |
| `meta-creator` | DELETE — not needed in write pipeline |
| `internal-linker` | MERGE into seo-optimizer |
| `output-formatter` | DELETE — routing logic belongs in commands |
| `channel-selector` | MERGE rubric into campaign-strategist |
| `landing-page-optimizer` | MERGE into cro-optimizer |

**`/write` pipeline change:** 4-agent chain → 2-agent pipeline (editor → seo-optimizer). Short-form: editor only.

**`/audit` CRO routing:** 2 agents (cro-analyst + landing-page-optimizer) → 1 agent (cro-optimizer).

**Context loading standardization:** Every content-facing agent gets explicit "Context Loading" section at top — agents run as Task sub-processes and can't see what the main Claude context loaded.

**Design decisions:**
- No "writer" agent needed — main Claude context IS the writer (has conversation history, can iterate, skills provide expertise)
- Editor returns rewritten content directly, not scored reports
- Meta-creator removed from `/write` — not needed unless crafting meta ads
- Channel scoring absorbed into campaign-strategist rather than kept as separate agent

**Implementation phases:**
1. Delete deprecated agents (keyword-mapper, output-formatter, channel-selector)
2. Genericize brand references (seo-optimizer, performance)
3. Agent mergers (cro-optimizer, seo-optimizer+internal-linker, campaign-strategist+channel-selector)
4. Editor rewrite (core mission change)
5. Command routing updates (write.md, audit.md, optimize.md)
6. Standardize context loading across all content-facing agents
7. Cleanup (delete merged files, update CLAUDE.md, progress.md)

**Status:** ✅ All phases complete. 11 agents remain (18 → 11).

**Phase 1 completed:**
- ✅ Deleted `keyword-mapper.md`, `output-formatter.md`, `channel-selector.md`

**Phase 2 completed:**
- ✅ Genericized brand refs in `seo-optimizer.md` — replaced "Castos" and "podcast creators" with dynamic context references
- ✅ Genericized brand refs in `performance.md` — replaced all "Castos" with generic references

**Phase 3 completed:**
- ✅ Created `conversion-optimizer.md` — merged cro-analyst psychology + landing-page-optimizer structural CRO (renamed from `cro-optimizer` to `conversion-optimizer` per user request)
- ✅ Expanded `seo-optimizer.md` — absorbed internal-linker methodology (link placement strategy, anchor text best practices, topic cluster awareness)
- ✅ Expanded `campaign-strategist.md` — absorbed channel-selector scoring rubric (audience presence, intent match, economics, readiness — 0-10 each, total /40)

**Phase 4 completed:**
- ✅ Rewrote `editor.md` — new mission: return rewritten content + brief change summary (not scored reports). Absorbed headline-generator formulas (10 headline patterns with scoring criteria)
- ✅ Enhanced `seo-optimizer.md` meta section — absorbed meta-creator title/description formulas
- ✅ Deleted `headline-generator.md` and `meta-creator.md`

**Phase 5 completed:**
- ✅ Updated `write.md` — 4-agent chain → 2-agent pipeline (editor → seo-optimizer)
- ✅ Updated `audit.md` — CRO routing: `cro-analyst + landing-page-optimizer` → `conversion-optimizer`
- ✅ Updated `optimize.md` — engagement: `editor + headline-generator` → `editor`; CRO: `cro-analyst` → `conversion-optimizer`
- ✅ Updated `strategy.md` — `channel-selector` → `campaign-strategist` (channel scoring built in)

**Phase 6 completed:**
- ✅ Standardized "## Context Loading" section in all 9 content-facing agents: editor, seo-optimizer, conversion-optimizer, content-analyzer, performance, campaign-strategist, audience-analyst, lifecycle-planner, brand-strategist

**Phase 7 completed:**
- ✅ Deleted merged files: `cro-analyst.md`, `landing-page-optimizer.md`, `internal-linker.md`
- ✅ Final agent roster (11): editor, seo-optimizer, conversion-optimizer, content-analyzer, performance, campaign-strategist, audience-analyst, lifecycle-planner, brand-strategist, brand-researcher, publishing-adapter
- ✅ Stale reference sweep: updated 7 additional commands (ads.md, publish.md, 5 seomachine commands) + 1 skill (sem-ppc/SKILL.md)
- ✅ Updated agent roster table in progress.md (18 → 11)

---

### 2026-02-18 — Agent & Command Consolidation: Phases 2–7 complete (session 2)

**Done:**
- Phase 2: Genericized brand refs in `seo-optimizer.md` (replaced "podcast creators", "Castos") and `performance.md` (replaced all "Castos" with context-driven references)
- Phase 3: Created `conversion-optimizer.md` (merged cro-analyst + landing-page-optimizer); expanded `seo-optimizer.md` with internal-linker methodology; expanded `campaign-strategist.md` with channel-selector scoring rubric
- Phase 4: Rewrote `editor.md` (new mission: return rewritten content, not reports; absorbed headline-generator formulas). Enhanced `seo-optimizer.md` meta section with meta-creator formulas. Deleted `headline-generator.md` and `meta-creator.md`
- Phase 5: Updated command routing in `write.md` (4→2 agent chain), `audit.md`, `optimize.md`, `strategy.md`
- Phase 6: Standardized "## Context Loading" sections across all 9 content-facing agents
- Phase 7: Deleted merged files (`cro-analyst.md`, `landing-page-optimizer.md`, `internal-linker.md`); swept all commands and skills for stale agent references — fixed 7 additional commands + 1 skill

**Decisions:**
- Renamed `cro-optimizer` → `conversion-optimizer` (user preference)
- Editor returns rewritten content directly, not scored reports — fundamental mission change
- Meta-creator removed from `/write` pipeline — seo-optimizer handles meta when needed
- Channel scoring absorbed into campaign-strategist (no separate agent needed)
- Context Loading sections are essential because agents run as Task sub-processes without parent context

**Next:**
- End-to-end test all commands against real brand context
- Mac Mini infrastructure + maiar.work domain setup
- Configure Resend API key for production email
