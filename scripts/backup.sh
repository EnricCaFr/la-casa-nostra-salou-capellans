#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/la-casa-nostra}"
COMPOSE_FILE="${COMPOSE_FILE:-$APP_DIR/docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
BACKUP_ROOT="${BACKUP_ROOT:-$APP_DIR/backups}"
DATE="$(date +%Y%m%d-%H%M%S)"

if [ ! -f "$ENV_FILE" ]; then
  echo "No existe $ENV_FILE"
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

mkdir -p "$BACKUP_ROOT/db" "$BACKUP_ROOT/uploads"

echo "Creando backup de PostgreSQL..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists \
  | gzip > "$BACKUP_ROOT/db/db-$DATE.sql.gz"

echo "Comprimiendo uploads..."
if [ -d "$APP_DIR/uploads" ]; then
  tar -czf "$BACKUP_ROOT/uploads/uploads-$DATE.tar.gz" -C "$APP_DIR" uploads
else
  echo "No existe $APP_DIR/uploads, se omite backup de uploads."
fi

find "$BACKUP_ROOT/db" -type f -name "db-*.sql.gz" -mtime +14 -delete
find "$BACKUP_ROOT/uploads" -type f -name "uploads-*.tar.gz" -mtime +14 -delete

echo "Backup terminado:"
echo "  $BACKUP_ROOT/db/db-$DATE.sql.gz"
echo "  $BACKUP_ROOT/uploads/uploads-$DATE.tar.gz"
