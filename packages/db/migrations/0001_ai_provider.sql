CREATE TABLE "ai_provider" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_provider_user_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "ai_provider_configuration" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"display_name" text NOT NULL,
	"suffix_key" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"api_key" text NOT NULL,
	"base_url" text NOT NULL,
	"connection_verified_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_provider_configuration_user_provider_suffix_unique" UNIQUE("user_id","provider_id","suffix_key")
);
--> statement-breakpoint
CREATE TABLE "ai_provider_model" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"configuration_id" text NOT NULL,
	"model_id" text NOT NULL,
	"display_name" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"source" text NOT NULL,
	"attachment" boolean DEFAULT false NOT NULL,
	"reasoning" boolean DEFAULT false NOT NULL,
	"tool_call" boolean DEFAULT false NOT NULL,
	"temperature" boolean DEFAULT false NOT NULL,
	"modalities_input" text[] DEFAULT '{}' NOT NULL,
	"modalities_output" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_provider_model_user_configuration_model_unique" UNIQUE("user_id","configuration_id","model_id")
);
--> statement-breakpoint
CREATE TABLE "ai_provider_model_alias" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"model_id" text NOT NULL,
	"alias" text NOT NULL,
	"alias_normalized" text GENERATED ALWAYS AS (lower(trim("ai_provider_model_alias"."alias"))) STORED,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_provider_model_alias_user_alias_normalized_unique" UNIQUE("user_id","alias_normalized")
);
--> statement-breakpoint
CREATE TABLE "ai_provider_model_cost" (
	"id" text PRIMARY KEY NOT NULL,
	"model_id" text NOT NULL,
	"effective_from" timestamp NOT NULL,
	"effective_to" timestamp,
	"input" numeric(12, 6),
	"output" numeric(12, 6),
	"cache_read" numeric(12, 6),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_provider_model_limit" (
	"model_id" text PRIMARY KEY NOT NULL,
	"context" integer,
	"output" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_provider_model_token_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"model_id" text NOT NULL,
	"model_cost_id" text,
	"occurred_at" timestamp NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"cache_read_tokens" integer DEFAULT 0 NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_provider" ADD CONSTRAINT "ai_provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_configuration" ADD CONSTRAINT "ai_provider_configuration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_configuration" ADD CONSTRAINT "ai_provider_configuration_provider_id_ai_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model" ADD CONSTRAINT "ai_provider_model_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model" ADD CONSTRAINT "ai_provider_model_configuration_id_ai_provider_configuration_id_fk" FOREIGN KEY ("configuration_id") REFERENCES "public"."ai_provider_configuration"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model_alias" ADD CONSTRAINT "ai_provider_model_alias_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model_alias" ADD CONSTRAINT "ai_provider_model_alias_model_id_ai_provider_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_provider_model"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model_cost" ADD CONSTRAINT "ai_provider_model_cost_model_id_ai_provider_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_provider_model"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model_limit" ADD CONSTRAINT "ai_provider_model_limit_model_id_ai_provider_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_provider_model"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model_token_usage" ADD CONSTRAINT "ai_provider_model_token_usage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model_token_usage" ADD CONSTRAINT "ai_provider_model_token_usage_model_id_ai_provider_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_provider_model"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_model_token_usage" ADD CONSTRAINT "ai_provider_model_token_usage_model_cost_id_ai_provider_model_cost_id_fk" FOREIGN KEY ("model_cost_id") REFERENCES "public"."ai_provider_model_cost"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_provider_userId_idx" ON "ai_provider" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_provider_configuration_userId_idx" ON "ai_provider_configuration" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_provider_model_userId_idx" ON "ai_provider_model" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_provider_model_alias_userId_idx" ON "ai_provider_model_alias" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_provider_model_cost_modelId_idx" ON "ai_provider_model_cost" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "ai_provider_model_cost_modelId_effectiveFrom_idx" ON "ai_provider_model_cost" USING btree ("model_id","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_provider_model_cost_model_current_unique" ON "ai_provider_model_cost" USING btree ("model_id") WHERE "ai_provider_model_cost"."effective_to" is null;--> statement-breakpoint
CREATE INDEX "ai_provider_model_token_usage_userId_idx" ON "ai_provider_model_token_usage" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_provider_model_token_usage_modelId_idx" ON "ai_provider_model_token_usage" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "ai_provider_model_token_usage_userId_occurredAt_idx" ON "ai_provider_model_token_usage" USING btree ("user_id","occurred_at");--> statement-breakpoint
CREATE INDEX "ai_provider_model_token_usage_modelId_occurredAt_idx" ON "ai_provider_model_token_usage" USING btree ("model_id","occurred_at");