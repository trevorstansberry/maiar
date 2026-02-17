# Maiar — Hosted Product Plan

## How to Use This Document

This is the master reference for turning Maiar into a hosted service for clients. It is organized into three build levels. Each level is self-contained — pick a level, follow its checklist, and you can start building in a single session without re-researching.

**The core model:** You own the master Maiar repo. Each client gets an isolated workspace (their own context files, their own conversation history). All Claude API calls happen server-side — clients never see your API key or touch a terminal. You manage everything from one machine.

---

## Level 1 — Local UI (Personal Use / Demos)

### Goal

A chat interface that reads Maiar context files and calls the Claude API. Runs on your laptop or Mac Mini. No auth, no multi-tenancy. Good for your own use and for live demos with potential clients.

### What It Is

A single-user web app with a text input, a response area, and a sidebar of command shortcuts. When you submit a message, the server reads your `context/` folder, prepends the contents as a system prompt, calls the Claude API, and streams the response back to the browser.

### Features

**UI:**
- Chat interface (message input + response display)
- Command shortcut buttons (`/write`, `/social`, `/ideas`, `/research`, etc.)
- Conversation history for the current session (in-memory, resets on restart)
- Markdown rendering for responses

**Server:**
- Reads `context/company/` + active product context on every request
- Injects Maiar's command/skill instructions as system prompt
- Streams Claude API responses to the browser

**No auth.** No database. No usage tracking.

### Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js (Express) |
| UI | Plain HTML + vanilla JS, or SvelteKit |
| API | `@anthropic-ai/sdk` npm package |
| Context loading | `fs.readFileSync` — reads markdown files from disk |
| Config | `.env` with `ANTHROPIC_API_KEY` |

### Build Checklist

- [ ] `npm init` — new project in a `maiar-ui/` folder alongside the main repo
- [ ] Install `express`, `@anthropic-ai/sdk`, `dotenv`
- [ ] `server.js` — Express app with one `POST /chat` route
- [ ] Context loader — function that reads all context files and concatenates them
- [ ] System prompt builder — prepends context + Maiar skill instructions
- [ ] Claude API call with streaming response
- [ ] `index.html` — chat UI with input field, response area, send button
- [ ] Command shortcuts sidebar — buttons that pre-fill the input
- [ ] Markdown rendering (`marked.js` library, client-side)
- [ ] Test with a real `/write` command against your own context

### Approximate Effort

2–4 hours for a working prototype. One day to polish.

---

## Level 2A — Hosted, Multi-Client (3–5 Clients)

### Goal

A securely hosted web app where each client has their own login and their own isolated Maiar workspace. You manage accounts. Clients access it from any browser at a URL you give them. All API calls are server-side. You track usage per client for billing.

### Security Requirements (do these before anything else)

**HTTPS:**
- Use Caddy as your reverse proxy. It handles Let's Encrypt certificates automatically — zero config SSL.
- Never expose your Node app directly on port 80/443. Caddy sits in front.

**DNS + IP masking:**
- Register a domain. Point it to Cloudflare's nameservers.
- Cloudflare proxies requests — your home or office IP is never exposed to clients.
- If your ISP assigns a dynamic IP, use Cloudflare's free DDNS updater to keep it current.

**API key isolation:**
- Your `ANTHROPIC_API_KEY` lives in `.env` on the server only.
- It is never sent to the browser, never logged in full, never included in any response.
- All Claude API calls happen server-side (your app calls Claude; the browser talks only to your app).

**Session security:**
- Use `httpOnly`, `secure`, `sameSite=strict` cookie flags on all session tokens.
- Sessions expire after inactivity (24–48 hours).
- Passwords hashed with bcrypt — never stored in plaintext.

**Client isolation:**
- Each client's context files live in a separate directory on disk.
- The server resolves the correct directory from the authenticated session — no client can access another's files.
- No shared log files that mix client data.

**Backups:**
- Time Machine on the Mac Mini covers local hardware failure.
- Nightly `rsync` of the `clients/` directory and SQLite database to a cloud drive (iCloud, Backblaze B2, or Dropbox).

### Features

**Client-facing:**
- Login (email + password)
- Chat interface — same as Level 1, but scoped to their brand context
- Command shortcuts sidebar
- Conversation history per client (persisted in SQLite across sessions)
- Simple "how to use" help page explaining available commands

**Admin (you only):**
- Admin dashboard at `/admin` (protected by your own login, separate from client accounts)
- Create a new client account (name, email, password, context folder path)
- Disable / re-enable a client account
- View per-client usage: total requests, total tokens (input + output), this month vs last month
- Raw usage log export as CSV for manual billing

**What you do NOT need yet:**
- Self-serve signup (you onboard clients manually)
- Automated billing or Stripe
- Hard usage limits or rate limiting per client
- Audit logs
- Client-facing usage dashboard

### Architecture

```
Mac Mini
├── Caddy (reverse proxy, HTTPS termination)
│   └── → :3000 (your Node app)
├── maiar-server/
│   ├── server.js          Express app
│   ├── routes/
│   │   ├── auth.js        Login, logout, session middleware
│   │   ├── chat.js        POST /chat — context load, Claude call, usage log
│   │   └── admin.js       Admin dashboard routes
│   ├── lib/
│   │   ├── context.js     Reads client's context files from disk
│   │   ├── claude.js      Wraps Anthropic SDK, logs token usage
│   │   └── db.js          SQLite connection via Drizzle ORM
│   ├── db/
│   │   └── maiar.db       SQLite database file
│   └── .env               API key, session secret
├── clients/
│   ├── acme/              Maiar repo fork for Client A
│   │   └── context/
│   ├── clientb/           Maiar repo fork for Client B
│   │   └── context/
│   └── ...
└── Caddyfile
```

### Database Schema (SQLite)

**`users` table:**
| Column | Type | Notes |
|---|---|---|
| id | integer | primary key |
| email | text | unique |
| password_hash | text | bcrypt |
| client_slug | text | maps to `clients/[slug]/` folder |
| role | text | `client` or `admin` |
| active | boolean | false = disabled |
| created_at | timestamp | |

**`usage_logs` table:**
| Column | Type | Notes |
|---|---|---|
| id | integer | primary key |
| user_id | integer | foreign key → users |
| timestamp | timestamp | |
| input_tokens | integer | from Claude API response |
| output_tokens | integer | from Claude API response |
| command | text | first word of message (e.g., `/write`) |

### Stack

| Layer | Tool | Why |
|---|---|---|
| Runtime | Node.js (Express) | Simple, fast, large ecosystem |
| Auth | Lucia v3 | Lightweight, no third-party dependency, runs fully local |
| Database | SQLite via Drizzle ORM | Zero ops, single file, fine for 15 clients |
| Reverse proxy | Caddy | Auto HTTPS, one-line config, no cert management |
| DNS | Cloudflare (free) | IP masking, DDNS, DDoS protection |
| UI | SvelteKit or plain HTML | SvelteKit gives you reactivity without complexity |
| Claude SDK | `@anthropic-ai/sdk` | Official, supports streaming |

**Why Lucia over Clerk:** Clerk is excellent but it's a third-party cloud service — your auth data lives on their servers. For a small number of clients where you want full control and no external dependencies, Lucia runs entirely on your machine. Swap to Clerk if you later move to cloud hosting.

### Caddyfile (what it looks like)

```
app.yourdomain.com {
    reverse_proxy localhost:3000
}
```

That's it. Caddy handles SSL automatically.

### Client Context Architecture

Each client is a fork of the master Maiar repo. On the server, they live in `clients/[slug]/`.

When a client sends a message:
1. The session middleware resolves their `client_slug`
2. `context.js` reads `clients/[slug]/context/company/` and `clients/[slug]/context/products/[active-product]/`
3. The context is concatenated and prepended to the system prompt
4. The Claude API call is made
5. Token counts are written to `usage_logs`

**Pushing Maiar updates to all clients:**
- When you add a new skill or improve a command in master Maiar, you `git pull` each client's repo from master
- Each client's `context/` folder is protected by `.gitignore` in their fork — updates never overwrite client data
- This is a manual operation at 3–5 clients; you could script it with a shell loop

### Usage Tracking + Billing

The `usage_logs` table is your billing source of truth.

Simple monthly billing query:
```sql
SELECT u.email, u.client_slug,
  SUM(l.input_tokens) as total_input,
  SUM(l.output_tokens) as total_output,
  SUM(l.input_tokens + l.output_tokens) as total_tokens
FROM usage_logs l
JOIN users u ON l.user_id = u.id
WHERE l.timestamp >= date('now', 'start of month')
GROUP BY u.id;
```

Claude Sonnet 4.5 pricing reference (as of early 2026):
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens
- A typical `/write` blog post: ~3,000–8,000 tokens total
- Heavy user (50 requests/day): ~$15–40/month in API costs
- Light user (10 requests/day): ~$3–8/month in API costs

**Pricing model options:**
- **Flat retainer** (simplest): $X/month covers setup, access, your time. You absorb API costs into your margin. Works until a client uses so much it eats your margin — set a soft usage cap.
- **Retainer + passthrough**: Base fee covers access and your time. API costs billed at cost + a markup (e.g., 20%). Transparent and scales fairly.
- **Usage tiers**: Light (<500 requests/month) / Standard (<2,000) / Heavy (unlimited). Price each tier. Easiest to explain to clients.

**When to give clients their own Anthropic API key:** When a client's usage is high enough that isolating their API costs matters for both of you. You'd update the server to accept a per-client API key from the database instead of always using yours.

### Build Checklist

**Infrastructure:**
- [ ] Register domain, point to Cloudflare nameservers
- [ ] Install Caddy on Mac Mini
- [ ] Write Caddyfile pointing to localhost:3000
- [ ] Confirm HTTPS works at your domain before writing any app code

**App — auth:**
- [ ] `npm init` new Express project in `maiar-server/`
- [ ] Install: `express`, `lucia`, `@lucia-auth/adapter-drizzle`, `drizzle-orm`, `better-sqlite3`, `bcrypt`, `dotenv`, `@anthropic-ai/sdk`
- [ ] Define database schema (users + usage_logs) with Drizzle
- [ ] Run migrations, confirm tables created
- [ ] `auth.js` routes: `POST /login`, `POST /logout`, `GET /session`
- [ ] Session middleware that blocks unauthenticated requests
- [ ] Login page HTML

**App — chat:**
- [ ] `context.js` — reads all markdown files from `clients/[slug]/context/`
- [ ] `claude.js` — wraps Anthropic SDK, returns response + token counts
- [ ] `POST /chat` route — authenticate, load context, call Claude, log usage, stream response
- [ ] Chat UI (same as Level 1, plus it reads from authenticated session)
- [ ] Command shortcuts sidebar

**App — admin:**
- [ ] Admin middleware (role check: `admin` only)
- [ ] Admin login (separate from client login, or same system with role check)
- [ ] `GET /admin` — dashboard page
- [ ] `POST /admin/clients` — create new client (writes to `users` table + creates `clients/[slug]/` from template)
- [ ] `POST /admin/clients/:id/disable` — toggle active flag
- [ ] `GET /admin/usage` — usage summary table by client, current month
- [ ] `GET /admin/usage.csv` — CSV export

**Client setup:**
- [ ] Create `clients/` directory on server
- [ ] For each client: clone master Maiar repo into `clients/[slug]/`
- [ ] Run `/brand-research` for each client to populate their context files
- [ ] Create their user record in the database
- [ ] Test their login and confirm their context loads

**Backups:**
- [ ] Time Machine configured on Mac Mini
- [ ] `backup.sh` script: rsync `clients/` and `maiar.db` to cloud drive
- [ ] Add `backup.sh` to cron (nightly)

### Approximate Effort

1–2 weeks for a first working version. Infrastructure + auth take the most time if you haven't done it before. The chat logic is nearly identical to Level 1.

---

## Level 2B — Managed Service (5–15 Clients)

### Goal

Everything in 2A, plus: clients can see their own usage, view and manage saved outputs, edit their brand context without involving you, and share access with teammates. You have a proper admin panel with monthly reporting. Skill/command updates flow to all clients automatically.

### Additional Features vs 2A

**Client-facing additions:**
- **Usage dashboard** — "You've made 47 requests this month. Estimated API cost: $12.40." Clients like seeing this — it builds trust and reduces support questions about billing.
- **Saved outputs** — Generated content is saved to a drafts view with timestamp and command used. Clients can browse, copy, or delete their outputs. (Replaces content disappearing after chat session.)
- **Brand context editor** — A form UI that lets clients edit their `overview.md`, `brand-voice.md`, `audience-profiles.md`, and `goals-kpis.md` without touching files directly. Changes save to their context folder on the server.
- **Multi-user per client** — A client can invite teammates to their workspace. All users under the same `client_slug` share context and see each other's saved outputs. One designated admin per client can manage their own team.
- **Notification on high usage** — Email alert to you (and optionally the client) when monthly token usage crosses a threshold.

**Admin panel additions:**
- **Monthly usage report** — Auto-generated report per client: total requests, total tokens, estimated API cost, most-used commands. Viewable in the admin UI and exportable as CSV.
- **Billing status field** — Track which clients are invoiced, pending, or overdue. (Not a full billing system — just a status flag and notes field for your own tracking.)
- **Per-client usage limits** — Set a monthly token cap per client. When reached, requests return a friendly message asking them to contact you. Prevents runaway usage.
- **Update propagation** — A button in admin UI that runs `git pull` on all client repos from master Maiar. Skills, commands, and agents update for all clients simultaneously. Client `context/` folders are unaffected (protected by `.gitignore`).
- **Audit log** — Record of all admin actions: account created, disabled, limit changed, etc.

### Additional Database Tables

**`outputs` table:**
| Column | Type | Notes |
|---|---|---|
| id | integer | primary key |
| user_id | integer | |
| client_slug | text | |
| command | text | |
| prompt | text | |
| response | text | |
| input_tokens | integer | |
| output_tokens | integer | |
| created_at | timestamp | |

**`client_settings` table:**
| Column | Type | Notes |
|---|---|---|
| client_slug | text | primary key |
| monthly_token_limit | integer | null = unlimited |
| billing_status | text | `active`, `invoiced`, `overdue` |
| billing_notes | text | free text |
| notify_threshold | integer | alert when usage crosses this |

### Stripe Integration (Optional)

Only add this if you want self-serve billing. For 5–15 clients, manual invoicing from your usage data is almost certainly simpler. Add Stripe when:
- You have more than 10 clients
- You're spending meaningful time on billing admin each month
- You want clients to self-manage their payment method

If you do add Stripe: use Stripe Billing with metered usage subscriptions. Sync your `usage_logs` token counts to Stripe's usage reporting API nightly. Stripe handles invoicing, card charging, and receipts automatically.

### Automatic Update Propagation

Script to pull Maiar updates to all client repos:

```bash
#!/bin/bash
# update-all-clients.sh
for dir in /path/to/clients/*/; do
  echo "Updating $dir..."
  git -C "$dir" pull origin main
done
```

Run this manually or via a button in the admin panel. Because each client repo has `context/` in `.gitignore`, their brand data is never touched.

### Approximate Effort

4–8 weeks of additional work beyond 2A. The brand context editor and multi-user features take the most time.

---

## Level 3 — Cloud SaaS (15+ Clients)

### When to Make This Move

Move off Mac Mini to cloud hosting when:
- You have more than 10–12 active clients
- A client requires a formal SLA (uptime guarantee)
- Mac Mini hardware or home internet becomes the reliability bottleneck
- You want to stop thinking about infrastructure entirely

### What Changes

| Component | Level 2 | Level 3 |
|---|---|---|
| Server | Mac Mini | Cloud VPS (Hetzner, Railway, Render, or AWS) |
| Database | SQLite | Postgres |
| Auth | Lucia (local) | Lucia or Clerk |
| Client context | Flat files on disk | Files in object storage (S3/R2) or DB |
| Billing | Manual + optional Stripe | Stripe Billing (metered) |
| Updates | Manual git pull | CI/CD pipeline (GitHub Actions) |
| Uptime | Best effort | 99.9% with monitoring |

### Hosting Options

| Provider | Best For | Monthly Cost (small) |
|---|---|---|
| Hetzner VPS | Full control, cheap, European DCs | $5–20 |
| Railway | Easy deploys, auto-scaling | $10–50 |
| Render | Simpler than Railway, good free tier | $7–25 |
| Fly.io | Global edge, more complex | $10–40 |

### Migration Path from Level 2

You do not need to rebuild. The move from 2B to 3 is:
1. Export SQLite database to Postgres (one-time migration script)
2. Move client context files to S3/R2 or keep as flat files on the VPS
3. Deploy the same Express app to a VPS
4. Point Cloudflare DNS at the VPS instead of your Mac Mini

You can migrate one client at a time by running two instances simultaneously during transition.

---

## Tech Stack Quick Reference

### Recommended Stack per Level

| | Level 1 | Level 2A | Level 2B | Level 3 |
|---|---|---|---|---|
| Runtime | Node/Express | Node/Express | Node/Express | Node/Express |
| Auth | None | Lucia v3 | Lucia v3 | Lucia or Clerk |
| Database | None | SQLite + Drizzle | SQLite + Drizzle | Postgres + Drizzle |
| UI | Plain HTML | Plain HTML or Svelte | SvelteKit | SvelteKit |
| Proxy | None | Caddy | Caddy | Cloud-managed |
| DNS | None | Cloudflare | Cloudflare | Cloudflare |
| Billing | None | Manual | Manual + optional Stripe | Stripe Billing |
| Hosting | Local | Mac Mini | Mac Mini | VPS |

### Node vs Python

**Use Node.js** — the Anthropic SDK is first-class in JavaScript, streaming is native to Node's HTTP model, and all the auth/ORM libraries recommended here are JS-first. Only switch to Python if you already have a strong preference for it or need to integrate with Python-specific ML tooling.

### Lucia vs Clerk

**Use Lucia** for Levels 1–2B. It runs locally, has no third-party dependency, and handles everything you need for a small number of clients.

**Switch to Clerk** if you move to cloud hosting (Level 3) and want managed auth without thinking about session storage, MFA, or password reset flows. Clerk's free tier covers up to 10,000 MAUs.

### SQLite vs Postgres

SQLite is the right choice through Level 2B. It's a single file, zero ops, trivially backed up, and handles concurrent reads fine for 15 clients. Only move to Postgres when you hit write contention issues (unlikely at this scale) or when your hosting provider doesn't support persistent disk storage.

---

## Business Model Notes

### Pricing Structures

**Option A — Flat retainer (simplest to sell, simplest to manage):**
- One monthly fee covers setup, access, your time, and API costs
- Works well when clients have predictable, moderate usage
- Risk: a heavy user can compress your margin
- Mitigation: set a soft monthly request cap (e.g., 1,000 requests/month included, above that you discuss)

**Option B — Retainer + API passthrough:**
- Base fee = your time and platform access
- API costs billed at cost + 20–30% markup
- Transparent and fair for clients; protects your margin at high usage
- Slightly more billing complexity — monthly invoice has two line items

**Option C — Usage tiers (easiest to explain at scale):**
- Light: up to 300 requests/month — $X
- Standard: up to 1,500 requests/month — $Y
- Heavy: unlimited — $Z
- Tiers should be priced so the heavy tier still covers API costs with comfortable margin

### What to Charge For

| Service | Notes |
|---|---|
| Setup fee | Brand research, context population, onboarding — one-time |
| Monthly platform access | Hosting, maintenance, your time |
| API cost passthrough | Optional — can be bundled or separated |
| Context refresh | When client rebrands or adds a product line |
| Custom skill development | Building a new skill tailored to their workflow |

### API Cost Estimates (Claude Sonnet 4.5)

| Usage Profile | Requests/Day | Est. Tokens/Month | Est. API Cost/Month |
|---|---|---|---|
| Light (1 person, occasional) | 5–10 | 500K–1M | $3–8 |
| Moderate (1–2 people, regular) | 20–30 | 2M–4M | $12–25 |
| Heavy (small team, daily) | 50–75 | 5M–10M | $35–75 |

These are conservative estimates assuming average request complexity. Long `/write` and `/research` commands use more tokens than simple `/ideas` requests.

### When to Give Clients Their Own Anthropic Key

Consider this when:
- A client's usage is high enough that you want clean cost separation
- You want to let the client self-manage their API spend directly with Anthropic
- You're approaching Anthropic's rate limits and need separate accounts

Implementation: add an `anthropic_api_key` column to the `client_settings` table. If populated, `claude.js` uses the client's key instead of yours for that client's requests.

---

## Uptime and Reliability Notes

**Mac Mini reliability:** Modern Mac Minis are extremely reliable. The failure modes are power outage, internet outage, and hardware failure — not the machine itself crashing. A UPS (uninterruptible power supply) mitigates power outages. A 4G/LTE backup USB dongle can cover internet outages for small periods.

**Expectation-setting with clients:** At Level 2, be upfront that this is a hosted tool with best-effort uptime, not a 99.9% SLA service. Most marketing teams don't need mission-critical uptime — if the tool is down for 2 hours during a planned maintenance window, that's fine.

**Escape hatch:** If one specific client needs more reliability guarantees than your Mac Mini can offer, spin up a $10/month VPS for just that client, deploy the same app, point their subdomain at it. You can do this without touching any other client's setup.

**Monitoring:** Add [UptimeRobot](https://uptimerobot.com) (free) to ping your URL every 5 minutes and email you if it goes down. That's all the monitoring you need at Level 2.

---

## Context Window Management

### Why This Matters

Every Claude API call sends: **system prompt + full conversation history + new message**. Maiar's system prompt is already substantial — once context files are loaded, you're looking at 10–25k tokens before the user types anything. In a hosted chat UI, if conversation history grows unchecked, sessions become expensive and response quality degrades as the model approaches its context limit.

This is a design decision that has to be made at the server level. Clients won't manage it themselves.

### The Core Constraint

```
available_history_budget = model_max_tokens - system_prompt_tokens - response_buffer
```

- Model max (Claude Sonnet): 200,000 tokens
- Maiar system prompt: ~10–25k tokens (varies by how many context files are loaded)
- Response buffer: 4,000 tokens (leave room for the model to generate)
- Effective history budget: ~170–185k tokens

A user doing 30+ back-and-forth turns on a complex task can realistically consume this entire budget. At that point, requests start failing or truncating.

---

### Level 1 — Stateless by Default

**Recommended approach:** Each request sends only the system prompt + the current message. No conversation history.

For command-based usage (`/write`, `/research`, `/social`, `/ideas`) this is almost always fine. These commands are self-contained — the user sends a prompt, gets a result. There's no meaningful multi-turn refinement happening in a typical Level 1 session.

**Optional: rolling window.** If you want some conversational continuity, add a configurable rolling window — last N exchanges only (default: 5). Anything older is dropped. This caps history cost at roughly `N × avg_message_tokens` per request.

---

### Level 2A — Sliding Window + Reset Controls

**Server-side sliding window:**
- The server keeps the full conversation history in SQLite per session
- When building the API call, walk backwards from the most recent message and add messages until the next one would exceed the history budget
- Only those messages are sent — the rest are stored but not transmitted
- Default: last 10 exchanges. Make this configurable per client in the database.

**"Start fresh" button:**
- Prominent in the UI — not buried in settings
- Clears the conversation history for the current session
- Does not delete saved outputs
- Label it clearly: "Start a new task" rather than something technical like "Reset context"
- This is the single most effective UX tool for context management

**Visual context indicator:**
- A simple progress bar or percentage in the UI showing estimated context usage
- Calculated as: `(system_prompt_tokens + history_tokens) / model_max_tokens`
- When it crosses 70%, change color (yellow → red)
- Clients learn to start fresh when it gets high — you won't need to explain context windows to them

**Auto-summarize at 80% capacity:**
- If estimated usage crosses 80%, the server makes one extra API call to summarize the conversation history
- The summary replaces the full history in SQLite for that session
- The user sees a small notice: "Session compressed to save space. Your outputs are unchanged."
- This prevents hard failures without requiring user action

---

### Level 2B — Named Threads + Save-and-Close Workflow

**Named threads:**
- Users start a named thread for each task: "Q4 blog post," "Instagram campaign," "Competitor analysis"
- Each thread has its own isolated conversation history
- Starting a new thread is the natural, intuitive equivalent of a fresh session — no mental model of "context windows" required
- Threads are listed in a sidebar; switching threads switches history

**Save and close:**
- When a user is done with a task, they click "Save output" → content goes to the `outputs` table
- Closing the thread frees its history from active memory (it stays in SQLite but is no longer sent with API calls)
- Saved outputs are always accessible in the drafts view — permanent record, never lost

**Auto-summary on thread close:**
- When a thread is closed, the system generates a one-paragraph summary of what was produced
- Stored alongside the output in the `outputs` table
- Useful for future reference, search, and reporting — without re-reading the full transcript

**Admin visibility:**
- Admin dashboard shows per-client average session length in tokens (rolling 30-day)
- Flag clients whose sessions consistently run long — they may need coaching on the "one task = one thread" workflow, or they're heavy enough to warrant a higher usage tier

---

### Implementation Notes

**Token counting options (pick one):**
- Use Anthropic's token counting API endpoint — accurate, adds one lightweight API call before each request
- Estimate at ~4 characters per token — fast, free, ~10% error margin, sufficient for progress bars and soft limits
- Use the `usage` field returned in every API response — accurate after the fact, useful for billing logs

**Sliding window algorithm:**
```
messages = session.history (newest first)
budget = model_max_tokens - system_prompt_tokens - 4000
selected = []
running_total = 0

for msg in messages:
  estimated_tokens = len(msg.content) / 4
  if running_total + estimated_tokens > budget:
    break
  selected.prepend(msg)
  running_total += estimated_tokens

api_call.messages = selected
```

**Summarization prompt (for auto-compress):**
```
Summarize the following conversation in 3–5 sentences. Focus on what the user was trying to accomplish, what was produced, and any decisions made. This summary will replace the conversation history to free up context space.
```

**Context file size optimization:**
- At server startup, log the token count of each client's system prompt
- If a client's context files total more than 20k tokens, flag it in the admin dashboard
- Large context files are the silent cost driver — trimming them has more impact than any history management

---



Record architectural decisions here as you build so future sessions have context.

| Date | Decision | Rationale |
|---|---|---|
| — | — | — |
