-- AlterTable
ALTER TABLE "app"."user" ADD COLUMN "apiKey" VARCHAR(255) DEFAULT '';

-- Backfill existing users with a generated API key when missing
UPDATE "app"."user"
SET "apiKey" = encode(gen_random_bytes(32), 'hex')
WHERE "apiKey" IS NULL OR "apiKey" = '';
