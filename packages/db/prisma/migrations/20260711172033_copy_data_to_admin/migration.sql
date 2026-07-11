-- CopyData: usuarios de auth -> admin (ignora conflitos de email)
INSERT INTO "admin"."user"
  ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "role", "banned", "banReason", "banExpires")
SELECT "id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "role", "banned", "banReason", "banExpires"
FROM "auth"."user"
ON CONFLICT
("email") DO NOTHING;

-- CopyData: files de app -> admin (apenas para users que existem em admin)
INSERT INTO "admin"."file"
  ("id", "name", "sizeBytes", "mimeType", "ownerId", "blobUrl", "uploadedAt")
SELECT f."id", f."name", f."sizeBytes", f."mimeType", f."ownerId", f."blobUrl", f."uploadedAt"
FROM "app"."file" f
  INNER JOIN "admin"."user" u ON u."id" = f."ownerId"
ON CONFLICT
("id") DO NOTHING;
