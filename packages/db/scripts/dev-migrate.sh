#!/usr/bin/env bash
# Uso: bash dev-migrate.sh
#
# Sobe o banco local (PGlite via prisma dev) e aplica o schema com `db push`.
# Para gerar migration files, use `bun run db:migrate:new`.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$SCRIPT_DIR/.."

# Credenciais do banco local (sempre as mesmas - PGlite deterministico)
BASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable"
PUSH_URL="${BASE_URL}&connection_limit=1&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"

cd "$DB_DIR"

echo "Parando instancias anteriores (dados preservados)..."
bunx prisma dev stop default 2>/dev/null || true
fuser -k 51213/tcp 51214/tcp 51215/tcp 2>/dev/null || true
sleep 1

echo "Iniciando Prisma dev server (detached)..."
bunx prisma dev --port 51213 --db-port 51214 --detach

cat > "$DB_DIR/.env" << 'EOF'
# Gerado automaticamente por dev-migrate.sh — nao edite manualmente
DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=1&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0&pgbouncer=true"
SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:51218/template1?sslmode=disable&connection_limit=1&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"
EOF

echo "Aplicando schema com db push..."
DATABASE_URL="$PUSH_URL" bunx prisma db push

echo ""
echo "Schema aplicado com sucesso!"
