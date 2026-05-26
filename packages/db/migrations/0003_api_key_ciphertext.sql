ALTER TABLE "ai_provider_configuration" RENAME COLUMN "api_key" TO "api_key_ciphertext";
--> statement-breakpoint
ALTER TABLE "ai_provider_configuration" ADD COLUMN "encryption_key_id" text;
