import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  displayName: text('display_name').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  botName: text('bot_name'),
  botPersonality: text('bot_personality'),
  botAvatarUrl: text('bot_avatar_url'),
  prioritySkills: text('priority_skills').default('[]'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  clientSlug: text('client_slug').notNull(),
  role: text('role', { enum: ['client', 'client_admin', 'super_admin'] }).notNull().default('client'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  onboardingComplete: integer('onboarding_complete', { mode: 'boolean' }).default(false),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  companyName: text('company_name'),
  companyLogo: text('company_logo'),
  companyWebsite: text('company_website'),
  mustChangePassword: integer('must_change_password', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at', { mode: 'number' }).notNull()
})

export const usageLogs = sqliteTable('usage_logs', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  timestamp: integer('timestamp', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  command: text('command')
})

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: integer('expires_at').notNull(),
  usedAt: integer('used_at')
})

export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  clientSlug: text('client_slug').notNull(),
  title: text('title').notNull(),
  status: text('status', { enum: ['planning', 'active', 'completed', 'archived'] }).notNull().default('planning'),
  planPath: text('plan_path'),
  assetPlan: text('asset_plan', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  clientSlug: text('client_slug'),
  title: text('title').notNull().default('New conversation'),
  messages: text('messages', { mode: 'json' }).notNull().default('[]'),
  campaignId: text('campaign_id').references(() => campaigns.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
})

export const assets = sqliteTable('assets', {
  id: text('id').primaryKey(),
  clientSlug: text('client_slug').notNull(),
  conversationId: text('conversation_id').references(() => conversations.id, { onDelete: 'set null' }),
  campaignId: text('campaign_id').references(() => campaigns.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  filePath: text('file_path').notNull(),
  folder: text('folder').notNull(),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  userId: text('user_id'),
  visibility: text('visibility', { enum: ['private', 'org'] }).notNull().default('private'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})
