-- AlterTable
ALTER TABLE "app"."user" ADD COLUMN IF NOT EXISTS "apiKey" VARCHAR(255) DEFAULT '';

-- Backfill existing users with a generated API key when missing
UPDATE "app"."user"
SET "apiKey" = md5(random()::text || id || clock_timestamp()::text)
WHERE "apiKey" IS NULL OR "apiKey" = '';
