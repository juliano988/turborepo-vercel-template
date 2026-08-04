-- AlterTable
ALTER TABLE "app"."user" ADD COLUMN "apiKey" VARCHAR(255) DEFAULT '';

-- Backfill existing users with a generated API key when missing
UPDATE "app"."user"
SET "apiKey" = encode(digest(random()::text || clock_timestamp()::text || random()::text, 'sha256'), 'hex')
WHERE "apiKey" IS NULL OR "apiKey" = '';
