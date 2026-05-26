import { relations, sql, type SQL } from "drizzle-orm"
import {
    boolean,
    index,
    integer,
    numeric,
    pgTable,
    text,
    timestamp,
    unique,
    uniqueIndex,
} from "drizzle-orm/pg-core"
import { z } from "zod"

import { user } from "./auth"

export const aiProviderKinds = [
    "openrouter",
    "openai",
    "custom-openai",
    "ollama",
    "lmstudio",
] as const

export const aiProviderKindSchema = z.enum(aiProviderKinds)

export type AiProviderKind = z.infer<typeof aiProviderKindSchema>

export const aiProviderModelSources = [
    "openai-api",
    "models.dev",
    "manual",
] as const

export const aiProviderModelSourceSchema = z.enum(aiProviderModelSources)

export type AiProviderModelSource = z.infer<typeof aiProviderModelSourceSchema>

export const aiProviderModelModalities = [
    "text",
    "image",
    "video",
] as const

export const aiProviderModelModalitySchema = z.enum(aiProviderModelModalities)

export type AiProviderModelModality = z.infer<
    typeof aiProviderModelModalitySchema
>

export const aiProvider = pgTable(
    "ai_provider",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        kind: text("kind", { enum: aiProviderKinds }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_provider_userId_idx").on(table.userId),
        unique("ai_provider_user_name_unique").on(table.userId, table.name),
    ]
)


export const aiProviderConfiguration = pgTable(
    "ai_provider_configuration",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        providerId: text("provider_id")
            .notNull()
            .references(() => aiProvider.id, { onDelete: "cascade" }),
        displayName: text("display_name").notNull(),
        suffixKey: text("suffix_key").notNull(),
        enabled: boolean("enabled").default(false).notNull(),
        apiKeyCiphertext: text("api_key_ciphertext").notNull(),
        encryptionKeyId: text("encryption_key_id"),
        baseUrl: text("base_url").notNull(),
        connectionVerifiedAt: timestamp("connection_verified_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_provider_configuration_userId_idx").on(table.userId),
        unique("ai_provider_configuration_user_provider_suffix_unique").on(
            table.userId,
            table.providerId,
            table.suffixKey
        ),
    ]
)

export const aiProviderModel = pgTable(
    "ai_provider_model",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        configurationId: text("configuration_id")
            .notNull()
            .references(() => aiProviderConfiguration.id, {
                onDelete: "cascade",
            }),
        modelId: text("model_id").notNull(),
        displayName: text("display_name").notNull(),
        enabled: boolean("enabled").default(false).notNull(),
        source: text("source", { enum: aiProviderModelSources }).notNull(),
        attachment: boolean("attachment").default(false).notNull(),
        reasoning: boolean("reasoning").default(false).notNull(),
        toolCall: boolean("tool_call").default(false).notNull(),
        temperature: boolean("temperature").default(false).notNull(),
        modalitiesInput: text("modalities_input", {
            enum: aiProviderModelModalities,
        })
            .array()
            .notNull()
            .default([]),
        modalitiesOutput: text("modalities_output", {
            enum: aiProviderModelModalities,
        })
            .array()
            .notNull()
            .default([]),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_provider_model_userId_idx").on(table.userId),
        unique("ai_provider_model_user_configuration_model_unique").on(
            table.userId,
            table.configurationId,
            table.modelId
        ),
    ]
)

export const aiProviderModelLimit = pgTable(
    "ai_provider_model_limit",
    {
        modelId: text("model_id")
            .primaryKey()
            .references(() => aiProviderModel.id, { onDelete: "cascade" }),
        context: integer("context"),
        output: integer("output"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    }
)

export const aiProviderModelCost = pgTable(
    "ai_provider_model_cost",
    {
        id: text("id").primaryKey(),
        modelId: text("model_id")
            .notNull()
            .references(() => aiProviderModel.id, { onDelete: "cascade" }),
        effectiveFrom: timestamp("effective_from").notNull(),
        effectiveTo: timestamp("effective_to"),
        input: numeric("input", { precision: 12, scale: 6 }),
        output: numeric("output", { precision: 12, scale: 6 }),
        cacheRead: numeric("cache_read", { precision: 12, scale: 6 }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_provider_model_cost_modelId_idx").on(table.modelId),
        index("ai_provider_model_cost_modelId_effectiveFrom_idx").on(
            table.modelId,
            table.effectiveFrom
        ),
        uniqueIndex("ai_provider_model_cost_model_current_unique")
            .on(table.modelId)
            .where(sql`${table.effectiveTo} is null`),
    ]
)

export const aiProviderModelTokenUsage = pgTable(
    "ai_provider_model_token_usage",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        modelId: text("model_id")
            .notNull()
            .references(() => aiProviderModel.id, { onDelete: "cascade" }),
        modelCostId: text("model_cost_id").references(
            () => aiProviderModelCost.id,
            { onDelete: "set null" }
        ),
        occurredAt: timestamp("occurred_at").notNull(),
        inputTokens: integer("input_tokens").notNull().default(0),
        outputTokens: integer("output_tokens").notNull().default(0),
        cacheReadTokens: integer("cache_read_tokens").notNull().default(0),
        totalTokens: integer("total_tokens").notNull().default(0),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("ai_provider_model_token_usage_userId_idx").on(table.userId),
        index("ai_provider_model_token_usage_modelId_idx").on(table.modelId),
        index("ai_provider_model_token_usage_userId_occurredAt_idx").on(
            table.userId,
            table.occurredAt
        ),
        index("ai_provider_model_token_usage_modelId_occurredAt_idx").on(
            table.modelId,
            table.occurredAt
        ),
    ]
)

export const aiProviderModelAlias = pgTable(
    "ai_provider_model_alias",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        modelId: text("model_id")
            .notNull()
            .references(() => aiProviderModel.id, { onDelete: "cascade" }),
        alias: text("alias").notNull(),
        aliasNormalized: text("alias_normalized").generatedAlwaysAs(
            (): SQL => sql`lower(trim(${aiProviderModelAlias.alias}))`
        ),
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("ai_provider_model_alias_userId_idx").on(table.userId),
        unique("ai_provider_model_alias_user_alias_normalized_unique").on(
            table.userId,
            table.aliasNormalized
        ),
    ]
)

export const aiProviderRelations = relations(aiProvider, ({ one, many }) => ({
    user: one(user, {
        fields: [aiProvider.userId],
        references: [user.id],
    }),
    configurations: many(aiProviderConfiguration),
}))

export const aiProviderConfigurationRelations = relations(
    aiProviderConfiguration,
    ({ one, many }) => ({
        user: one(user, {
            fields: [aiProviderConfiguration.userId],
            references: [user.id],
        }),
        provider: one(aiProvider, {
            fields: [aiProviderConfiguration.providerId],
            references: [aiProvider.id],
        }),
        models: many(aiProviderModel),
    })
)

export const aiProviderModelRelations = relations(
    aiProviderModel,
    ({ one, many }) => ({
        user: one(user, {
            fields: [aiProviderModel.userId],
            references: [user.id],
        }),
        configuration: one(aiProviderConfiguration, {
            fields: [aiProviderModel.configurationId],
            references: [aiProviderConfiguration.id],
        }),
        limit: one(aiProviderModelLimit, {
            fields: [aiProviderModel.id],
            references: [aiProviderModelLimit.modelId],
        }),
        costs: many(aiProviderModelCost),
        tokenUsages: many(aiProviderModelTokenUsage),
        aliases: many(aiProviderModelAlias),
    })
)

export const aiProviderModelLimitRelations = relations(
    aiProviderModelLimit,
    ({ one }) => ({
        model: one(aiProviderModel, {
            fields: [aiProviderModelLimit.modelId],
            references: [aiProviderModel.id],
        }),
    })
)

export const aiProviderModelCostRelations = relations(
    aiProviderModelCost,
    ({ one, many }) => ({
        model: one(aiProviderModel, {
            fields: [aiProviderModelCost.modelId],
            references: [aiProviderModel.id],
        }),
        tokenUsages: many(aiProviderModelTokenUsage),
    })
)

export const aiProviderModelTokenUsageRelations = relations(
    aiProviderModelTokenUsage,
    ({ one }) => ({
        user: one(user, {
            fields: [aiProviderModelTokenUsage.userId],
            references: [user.id],
        }),
        model: one(aiProviderModel, {
            fields: [aiProviderModelTokenUsage.modelId],
            references: [aiProviderModel.id],
        }),
        modelCost: one(aiProviderModelCost, {
            fields: [aiProviderModelTokenUsage.modelCostId],
            references: [aiProviderModelCost.id],
        }),
    })
)

export const aiProviderModelAliasRelations = relations(
    aiProviderModelAlias,
    ({ one }) => ({
        user: one(user, {
            fields: [aiProviderModelAlias.userId],
            references: [user.id],
        }),
        model: one(aiProviderModel, {
            fields: [aiProviderModelAlias.modelId],
            references: [aiProviderModel.id],
        }),
    })
)
