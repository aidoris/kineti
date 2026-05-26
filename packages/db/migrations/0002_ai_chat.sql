CREATE TABLE "ai_chat_attachment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text NOT NULL,
	"message_id" text,
	"kind" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"mime_type" text NOT NULL,
	"filename" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_key" text NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" jsonb NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_chat_preset" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"system_prompt" text DEFAULT '' NOT NULL,
	"temperature" real,
	"top_p" real,
	"max_output_tokens" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_chat_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text,
	"model_id" text,
	"model_alias_id" text,
	"preset_id" text,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_chat_session_model_xor_alias" CHECK (num_nonnulls("ai_chat_session"."model_id", "ai_chat_session"."model_alias_id") = 1)
);
--> statement-breakpoint
ALTER TABLE "ai_chat_attachment" ADD CONSTRAINT "ai_chat_attachment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_attachment" ADD CONSTRAINT "ai_chat_attachment_session_id_ai_chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_chat_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_attachment" ADD CONSTRAINT "ai_chat_attachment_message_id_ai_chat_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."ai_chat_message"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_message" ADD CONSTRAINT "ai_chat_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_message" ADD CONSTRAINT "ai_chat_message_session_id_ai_chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_chat_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_preset" ADD CONSTRAINT "ai_chat_preset_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_session" ADD CONSTRAINT "ai_chat_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_session" ADD CONSTRAINT "ai_chat_session_model_id_ai_provider_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ai_provider_model"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_session" ADD CONSTRAINT "ai_chat_session_model_alias_id_ai_provider_model_alias_id_fk" FOREIGN KEY ("model_alias_id") REFERENCES "public"."ai_provider_model_alias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_session" ADD CONSTRAINT "ai_chat_session_preset_id_ai_chat_preset_id_fk" FOREIGN KEY ("preset_id") REFERENCES "public"."ai_chat_preset"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_chat_attachment_userId_idx" ON "ai_chat_attachment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_chat_attachment_sessionId_idx" ON "ai_chat_attachment" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "ai_chat_attachment_messageId_idx" ON "ai_chat_attachment" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "ai_chat_attachment_sessionId_status_idx" ON "ai_chat_attachment" USING btree ("session_id","status");--> statement-breakpoint
CREATE INDEX "ai_chat_message_sessionId_idx" ON "ai_chat_message" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "ai_chat_message_userId_idx" ON "ai_chat_message" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_chat_message_session_position_unique" ON "ai_chat_message" USING btree ("session_id","position");--> statement-breakpoint
CREATE INDEX "ai_chat_preset_userId_idx" ON "ai_chat_preset" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_chat_preset_user_default_unique" ON "ai_chat_preset" USING btree ("user_id") WHERE "ai_chat_preset"."is_default" = true;--> statement-breakpoint
CREATE INDEX "ai_chat_session_userId_idx" ON "ai_chat_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_chat_session_userId_lastMessageAt_idx" ON "ai_chat_session" USING btree ("user_id","last_message_at");--> statement-breakpoint
CREATE INDEX "ai_chat_session_modelId_idx" ON "ai_chat_session" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "ai_chat_session_modelAliasId_idx" ON "ai_chat_session" USING btree ("model_alias_id");