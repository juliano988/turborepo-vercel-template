#!/usr/bin/env bash
# Uso: bash dev-migrate.sh
#
# Sobe o banco local (PGlite via prisma dev) e aplica o schema com `db push`.
# Nota: prisma migrate dev NÃO funciona com PGlite — ele exige shadow database
# (2ª conexão) mas PGlite suporta apenas 1 conexão simultânea (P1017).
# Para gerar migration files, rode `prisma migrate dev` contra o banco Prisma
# Postgres na nuvem (DATABASE_URL de produção/staging).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
DB_DIR="$SCRIPT_DIR/.."
ENV_FILE="$ROOT_DIR/.env"

echo "🛑 Parando instâncias anteriores (dados preservados)..."
bunx prisma dev stop default 2>/dev/null || true
# Garante que as portas foram liberadas
fuser -k 51213/tcp 51214/tcp 51215/tcp 2>/dev/null || true
sleep 1

echo "�🚀 Iniciando Prisma dev server (detached)..."
OUTPUT=$(bunx prisma dev --detach 2>&1)
echo "$OUTPUT"

DB_URL=$(echo "$OUTPUT" \
  | grep -oP '(?<=DATABASE_URL=")[^"]+' \
  || echo "$OUTPUT" | grep -oP '(?<=DATABASE_URL=)\S+' \
  || echo "$OUTPUT" | grep -oP 'postgres://\S+' | head -1)

if [[ -z "$DB_URL" ]]; then
  echo "❌ Não foi possível extrair DATABASE_URL do output do prisma dev"
  exit 1
fi

# URL completa para o app (pgbouncer=true desativa prepared statements no PGlite)
APP_URL="${DB_URL}&connection_limit=1&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0&pgbouncer=true"
# URL para db push (schema engine não respeita pgbouncer, mas precisa dos outros params)
PUSH_URL="${DB_URL}&connection_limit=1&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"

# Atualiza .env na raiz com URL completa (app usa pgbouncer=true)
if grep -q '^DATABASE_URL=' "$ENV_FILE"; then
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$APP_URL\"|" "$ENV_FILE"
else
  echo "DATABASE_URL=\"$APP_URL\"" >>"$ENV_FILE"
fi
# Cria packages/db/.env para o Prisma Studio encontrar a variável localmente
echo "DATABASE_URL=\"$APP_URL\"" >"$DB_DIR/.env"
echo "📝 .env atualizado"

# db push com URL especial (sem prepared statements) — compatível com PGlite
cd "$DB_DIR"
echo "⬆️  Aplicando schema com db push..."
DATABASE_URL="$PUSH_URL" bunx prisma db push

echo ""
echo "✅ Schema aplicado com sucesso!"
echo ""
echo "ℹ️  Para gerar migration files (produção), use o banco na nuvem:"
echo "   DATABASE_URL=\"<url-prisma-postgres>\" bunx prisma migrate dev --name init"
