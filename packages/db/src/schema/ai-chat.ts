import { relations, sql } from "drizzle-orm"
import {
    boolean,
    check,
    index,
    integer,
    jsonb,
    pgTable,
    real,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core"
import { z } from "zod"

import {
    aiProviderModel,
    aiProviderModelAlias,
} from "./ai-provider"
import { user } from "./auth"

export const aiChatMessageRoles = [
    "user",
    "assistant",
    "system",
    "tool",
] as const

export const aiChatMessageRoleSchema = z.enum(aiChatMessageRoles)

export type AiChatMessageRole = z.infer<typeof aiChatMessageRoleSchema>

/** Vision inputs vs other files (PDF, CSV, etc.) — maps to model modality checks. */
export const aiChatAttachmentKinds = ["image", "file"] as const

export const aiChatAttachmentKindSchema = z.enum(aiChatAttachmentKinds)

export type AiChatAttachmentKind = z.infer<typeof aiChatAttachmentKindSchema>

export const aiChatAttachmentStatuses = [
    "pending",
    "ready",
    "failed",
] as const

export const aiChatAttachmentStatusSchema = z.enum(aiChatAttachmentStatuses)

export type AiChatAttachmentStatus = z.infer<
    typeof aiChatAttachmentStatusSchema
>

/** User-defined generation settings; one per user may be marked default. */
export const aiChatPreset = pgTable(
    "ai_chat_preset",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        description: text("description"),
        systemPrompt: text("system_prompt").notNull().default(""),
        temperature: real("temperature"),
        topP: real("top_p"),
        maxOutputTokens: integer("max_output_tokens"),
        isDefault: boolean("is_default").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_chat_preset_userId_idx").on(table.userId),
        uniqueIndex("ai_chat_preset_user_default_unique")
            .on(table.userId)
            .where(sql`${table.isDefault} = true`),
    ]
)

/** Conversation thread bound to exactly one model or model alias, with optional preset. */
export const aiChatSession = pgTable(
    "ai_chat_session",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        title: text("title"),
        modelId: text("model_id").references(() => aiProviderModel.id, {
            onDelete: "cascade",
        }),
        modelAliasId: text("model_alias_id").references(
            () => aiProviderModelAlias.id,
            { onDelete: "cascade" }
        ),
        presetId: text("preset_id").references(() => aiChatPreset.id, {
            onDelete: "set null",
        }),
        lastMessageAt: timestamp("last_message_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_chat_session_userId_idx").on(table.userId),
        index("ai_chat_session_userId_lastMessageAt_idx").on(
            table.userId,
            table.lastMessageAt
        ),
        index("ai_chat_session_modelId_idx").on(table.modelId),
        index("ai_chat_session_modelAliasId_idx").on(table.modelAliasId),
        check(
            "ai_chat_session_model_xor_alias",
            sql`num_nonnulls(${table.modelId}, ${table.modelAliasId}) = 1`
        ),
    ]
)

export const aiChatMessage = pgTable(
    "ai_chat_message",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        sessionId: text("session_id")
            .notNull()
            .references(() => aiChatSession.id, { onDelete: "cascade" }),
        role: text("role", { enum: aiChatMessageRoles }).notNull(),
        content: jsonb("content").notNull(),
        position: integer("position").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("ai_chat_message_sessionId_idx").on(table.sessionId),
        index("ai_chat_message_userId_idx").on(table.userId),
        uniqueIndex("ai_chat_message_session_position_unique").on(
            table.sessionId,
            table.position
        ),
    ]
)

/**
 * Uploaded blob metadata. Bytes live in object storage; Postgres stores keys only.
 * `messageId` is null while the user is composing; set when the message is sent.
 */
export const aiChatAttachment = pgTable(
    "ai_chat_attachment",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        sessionId: text("session_id")
            .notNull()
            .references(() => aiChatSession.id, { onDelete: "cascade" }),
        messageId: text("message_id").references(() => aiChatMessage.id, {
            onDelete: "set null",
        }),
        kind: text("kind", { enum: aiChatAttachmentKinds }).notNull(),
        status: text("status", { enum: aiChatAttachmentStatuses })
            .notNull()
            .default("pending"),
        mimeType: text("mime_type").notNull(),
        filename: text("filename").notNull(),
        sizeBytes: integer("size_bytes").notNull(),
        storageKey: text("storage_key").notNull(),
        width: integer("width"),
        height: integer("height"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_chat_attachment_userId_idx").on(table.userId),
        index("ai_chat_attachment_sessionId_idx").on(table.sessionId),
        index("ai_chat_attachment_messageId_idx").on(table.messageId),
        index("ai_chat_attachment_sessionId_status_idx").on(
            table.sessionId,
            table.status
        ),
    ]
)

export const aiChatPresetRelations = relations(aiChatPreset, ({ one, many }) => ({
    user: one(user, {
        fields: [aiChatPreset.userId],
        references: [user.id],
    }),
    sessions: many(aiChatSession),
}))

export const aiChatSessionRelations = relations(
    aiChatSession,
    ({ one, many }) => ({
        user: one(user, {
            fields: [aiChatSession.userId],
            references: [user.id],
        }),
        model: one(aiProviderModel, {
            fields: [aiChatSession.modelId],
            references: [aiProviderModel.id],
        }),
        modelAlias: one(aiProviderModelAlias, {
            fields: [aiChatSession.modelAliasId],
            references: [aiProviderModelAlias.id],
        }),
        preset: one(aiChatPreset, {
            fields: [aiChatSession.presetId],
            references: [aiChatPreset.id],
        }),
        messages: many(aiChatMessage),
        attachments: many(aiChatAttachment),
    })
)

export const aiChatMessageRelations = relations(
    aiChatMessage,
    ({ one, many }) => ({
        user: one(user, {
            fields: [aiChatMessage.userId],
            references: [user.id],
        }),
        session: one(aiChatSession, {
            fields: [aiChatMessage.sessionId],
            references: [aiChatSession.id],
        }),
        attachments: many(aiChatAttachment),
    })
)

export const aiChatAttachmentRelations = relations(
    aiChatAttachment,
    ({ one }) => ({
        user: one(user, {
            fields: [aiChatAttachment.userId],
            references: [user.id],
        }),
        session: one(aiChatSession, {
            fields: [aiChatAttachment.sessionId],
            references: [aiChatSession.id],
        }),
        message: one(aiChatMessage, {
            fields: [aiChatAttachment.messageId],
            references: [aiChatMessage.id],
        }),
    })
)
