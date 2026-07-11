-- UpdateNulls
UPDATE "admin"."user" SET "role" = 'user' WHERE "role" IS NULL;
UPDATE "admin"."user" SET "banned" = false WHERE "banned" IS NULL;

UPDATE "auth"."user" SET "role" = 'user' WHERE "role" IS NULL;
UPDATE "auth"."user" SET "banned" = false WHERE "banned" IS NULL;

-- AlterTable
ALTER TABLE "admin"."user" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user',
ALTER COLUMN "banned" SET NOT NULL,
ALTER COLUMN "banned" SET DEFAULT false;

-- AlterTable
ALTER TABLE "auth"."user" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user',
ALTER COLUMN "banned" SET NOT NULL,
ALTER COLUMN "banned" SET DEFAULT false;
