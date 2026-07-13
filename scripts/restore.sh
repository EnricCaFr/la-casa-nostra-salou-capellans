#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/la-casa-nostra}"
COMPOSE_FILE="${COMPOSE_FILE:-$APP_DIR/docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"

DB_BACKUP="${1:-}"
UPLOADS_BACKUP="${2:-}"

if [ -z "$DB_BACKUP" ]; then
  echo "Uso: ./scripts/restore.sh /ruta/db-backup.sql.gz [/ruta/uploads-backup.tar.gz]"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "No existe $ENV_FILE"
  exit 1
fi

if [ ! -f "$DB_BACKUP" ]; then
  echo "No existe el backup de base de datos: $DB_BACKUP"
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

echo "Restaurando base de datos desde $DB_BACKUP..."
gzip -dc "$DB_BACKUP" | docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

if [ -n "$UPLOADS_BACKUP" ]; then
  if [ ! -f "$UPLOADS_BACKUP" ]; then
    echo "No existe el backup de uploads: $UPLOADS_BACKUP"
    exit 1
  fi
  echo "Restaurando uploads desde $UPLOADS_BACKUP..."
  mkdir -p "$APP_DIR/uploads"
  tar -xzf "$UPLOADS_BACKUP" -C "$APP_DIR"
fi

echo "Restauración terminada."
