#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/la-casa-nostra}"
COMPOSE_FILE="$APP_DIR/docker-compose.prod.yml"
ENV_FILE="$APP_DIR/.env"

cd "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "Falta $ENV_FILE. Copia .env.example a .env y rellena los secretos."
  exit 1
fi

mkdir -p uploads backups/db backups/uploads

echo "Actualizando código..."
git pull --ff-only

echo "Construyendo y levantando producción..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo "Estado de contenedores:"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
