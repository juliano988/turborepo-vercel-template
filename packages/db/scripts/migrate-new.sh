#!/usr/bin/env bash
# Uso: bash migrate-new.sh <nome>
# Exemplo: bash migrate-new.sh add-posts-table
#
# Sobe um container PostgreSQL temporario, gera o arquivo de migration e remove o container.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$SCRIPT_DIR/.."

MIGRATION_NAME="${1:-}"
if [[ -z "$MIGRATION_NAME" ]]; then
  read -rp "Nome da migration: " MIGRATION_NAME
fi
if [[ -z "$MIGRATION_NAME" ]]; then
  echo "Erro: nome obrigatorio"
  exit 1
fi

if ! command -v docker &>/dev/null; then
  echo "Erro: Docker nao encontrado. Instale Docker para usar este comando."
  exit 1
fi

cd "$DB_DIR"

CONTAINER="prisma-migrate-$$"
PG_PORT=5499
DB_URL="postgresql://postgres:postgres@localhost:${PG_PORT}/prismadb"

echo "Subindo PostgreSQL temporario..."
docker run --rm -d --name "$CONTAINER"   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_USER=postgres   -e POSTGRES_DB=prismadb   -p "${PG_PORT}:5432"   postgres:latest

trap "docker stop $CONTAINER >/dev/null 2>&1 || true" EXIT

echo "Aguardando PostgreSQL..."
until docker exec "$CONTAINER" pg_isready -U postgres -q 2>/dev/null; do
  sleep 0.5
done

echo "Gerando migration '$MIGRATION_NAME'..."
DATABASE_URL="$DB_URL" bunx prisma migrate dev --name "$MIGRATION_NAME"

echo ""
echo "Migration gerada em prisma/migrations/"
echo "Commit o arquivo antes do deploy."
