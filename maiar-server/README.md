# Maiar Server — Level 2A

Multi-client hosted marketing workspace. Each client gets their own login and isolated Maiar workspace. Admin dashboard for account and usage management.

## Quick Start (Local Dev)

### Prerequisites
- Node.js 20+
- npm 10+

### 1. Install dependencies

```bash
# Server deps
npm install

# UI deps
cd ui && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY and a SESSION_SECRET
```

`SESSION_SECRET` can be any long random string. Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Initialize database + create admin

```bash
npm run db:push    # Creates db/maiar.db with all tables
```

Edit `scripts/seed-admin.js` — change EMAIL and PASSWORD, then:
```bash
npm run seed
```

### 4. Run in development

```bash
npm run dev
# Server: http://localhost:3000
# UI:     http://localhost:5173
```

Open `http://localhost:5173` and log in with your admin credentials.

---

## Production (Mac Mini)

### 1. Infrastructure (do once)

1. Register a domain → point nameservers to Cloudflare
2. In Cloudflare DNS: `A` record → your Mac Mini's public IP, proxy ON
3. Install Caddy: `brew install caddy`
4. Copy `Caddyfile.example` to `/etc/caddy/Caddyfile`, replace `yourdomain.com`
5. `brew services start caddy`

### 2. Build + run

```bash
npm run build      # Builds ui/dist/
NODE_ENV=production npm start
# Serves everything at localhost:3000 — Caddy proxies from your domain
```

### 3. Auto-start on login

Use `pm2` or a launchd plist to start `NODE_ENV=production node server.js` automatically.

---

## Adding a New Client

1. Log in as admin at `/admin`
2. Click "New client" — fill in email, password, and a slug (e.g. `acme-corp`)
3. From the chat, run `/brand-research https://acmecorp.com` — this populates their context
4. Share the login URL and temp password
5. Client logs in and completes onboarding

---

## Backups

Nightly backup to iCloud Drive (or any rsync destination):

```bash
# Edit BACKUP_DEST in scripts/backup.sh, then:
chmod +x scripts/backup.sh

# Add to cron (runs at 2am daily):
crontab -e
# Add: 0 2 * * * /full/path/to/maiar-server/scripts/backup.sh
```

---

## File Structure

```
maiar-server/
├── server.js          Express entry
├── routes/            API route handlers
│   ├── auth.js        Login/logout
│   ├── chat.js        SSE streaming + conversation persistence
│   ├── context.js     Context file CRUD
│   ├── assets.js      Asset file CRUD
│   └── admin.js       Admin dashboard API
├── lib/               Business logic
│   ├── auth.js        Lucia auth setup + middleware
│   ├── claude.js      Anthropic SDK wrapper
│   ├── config.js      Environment config
│   ├── contextLoader.js  Read client context files
│   ├── db.js          Drizzle + SQLite connection
│   ├── fileSystem.js  File read/write helpers
│   └── systemPrompt.js   Build full system prompt
├── db/
│   ├── schema.js      Drizzle schema (users, sessions, usage_logs, conversations)
│   └── maiar.db       SQLite database (gitignored)
├── clients/           Per-client workspaces (gitignored)
│   └── [slug]/
│       ├── context/
│       ├── drafts/
│       ├── published/
│       ├── campaigns/
│       ├── research/
│       └── templates/
├── scripts/
│   ├── seed-admin.js  Create initial admin user
│   └── backup.sh      Nightly rsync backup
└── ui/                SvelteKit frontend
    └── src/
        ├── routes/    Pages (login, chat, assets, context, admin)
        └── lib/       Components, stores, API client
```
