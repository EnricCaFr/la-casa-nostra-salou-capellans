# Despliegue en Contabo con Docker Compose

Esta guía prepara la web de La Casa Nostra para producción en la VPS:

- IP inicial: `169.58.9.185`
- URL inicial: `http://169.58.9.185`
- Carpeta de producción: `/opt/la-casa-nostra`
- Servicios: `frontend` con Nginx, `backend` Spring Boot y `postgres` privado

No se necesita dominio para el primer arranque. Cuando haya dominio se podrá añadir SSL.

## 1. Preparar `.env`

En la VPS, dentro de `/opt/la-casa-nostra`:

```bash
cp .env.example .env
nano .env
```

Rellena como mínimo:

```env
POSTGRES_PASSWORD=CAMBIAR_EN_PRODUCCION
SPRING_DATASOURCE_PASSWORD=CAMBIAR_EN_PRODUCCION
JWT_SECRET=CAMBIAR_POR_SECRET_LARGO_SEGURO_DE_AL_MENOS_32_CARACTERES
PUBLIC_BASE_URL=http://169.58.9.185
FRONTEND_URL=http://169.58.9.185
CORS_ALLOWED_ORIGINS=http://169.58.9.185
```

Importante: `POSTGRES_PASSWORD` y `SPRING_DATASOURCE_PASSWORD` deben tener el mismo valor si usas el usuario definido en `.env.example`.

## 2. Crear carpetas persistentes

```bash
mkdir -p /opt/la-casa-nostra/uploads
mkdir -p /opt/la-casa-nostra/backups/db
mkdir -p /opt/la-casa-nostra/backups/uploads
chmod +x /opt/la-casa-nostra/scripts/*.sh
```

Los datos de PostgreSQL quedan en un volumen Docker llamado `la-casa-nostra_postgres_data`.
Las imágenes subidas quedan en `/opt/la-casa-nostra/uploads/dishes`, dentro de la carpeta persistente `/opt/la-casa-nostra/uploads`.

## 3. Construir y levantar producción

Desde `/opt/la-casa-nostra`:

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

Ver estado:

```bash
docker compose -f docker-compose.prod.yml --env-file .env ps
```

Ver logs:

```bash
docker compose -f docker-compose.prod.yml --env-file .env logs -f
```

Probar:

- Web: `http://169.58.9.185`
- Carta: `http://169.58.9.185/carta`
- Admin: `http://169.58.9.185/admin`
- Health backend por proxy: `http://169.58.9.185/actuator/health`

## 4. Parar producción

```bash
docker compose -f docker-compose.prod.yml --env-file .env down
```

Esto no borra la base de datos ni uploads. No uses `-v` salvo que quieras borrar el volumen de PostgreSQL.

## 5. Arquitectura

```text
Internet
  |
  v
frontend nginx :80
  |-- /              -> Angular
  |-- /carta         -> Angular
  |-- /admin         -> Angular
  |-- /api/          -> backend:8080
  |-- /uploads/      -> backend:8080/uploads/
  |-- /actuator/     -> backend:8080/actuator/

backend Spring Boot :8080
  |
  v
postgres :5432, solo red interna Docker
```

El puerto `5432` de PostgreSQL no se publica a internet. El backend tampoco publica `8080`; solo Nginx expone `80`.

## 6. Backups

Crear backup:

```bash
/opt/la-casa-nostra/scripts/backup.sh
```

Genera:

- `/opt/la-casa-nostra/backups/db/db-FECHA.sql.gz`
- `/opt/la-casa-nostra/backups/uploads/uploads-FECHA.tar.gz`

El script borra automáticamente backups de más de 14 días.

## 7. Restaurar backup

Con contenedores levantados:

```bash
/opt/la-casa-nostra/scripts/restore.sh \
  /opt/la-casa-nostra/backups/db/db-FECHA.sql.gz \
  /opt/la-casa-nostra/backups/uploads/uploads-FECHA.tar.gz
```

Si solo quieres restaurar base de datos:

```bash
/opt/la-casa-nostra/scripts/restore.sh /opt/la-casa-nostra/backups/db/db-FECHA.sql.gz
```

## 8. Subir base de datos local a producción

En tu PC local puedes crear un dump:

```powershell
$env:PGPASSWORD="girasol"
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -h localhost -U girasol -d girasol --clean --if-exists -f .\local-girasol.sql
```

Sube el archivo a la VPS, por ejemplo:

```powershell
scp .\local-girasol.sql root@169.58.9.185:/opt/la-casa-nostra/backups/db/local-girasol.sql
```

En la VPS:

```bash
cat /opt/la-casa-nostra/backups/db/local-girasol.sql | docker compose -f /opt/la-casa-nostra/docker-compose.prod.yml --env-file /opt/la-casa-nostra/.env exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

## 9. Subir uploads locales

Desde tu PC local, si quieres copiar las imágenes actuales:

```powershell
scp -r .\uploads\* root@169.58.9.185:/opt/la-casa-nostra/uploads/
```

Si tus imágenes locales están dentro de `uploads\dishes`, súbelas manteniendo esa carpeta porque las URLs de la base de datos usan `/uploads/dishes/...`.

## 10. Actualizar producción más adelante

En la VPS:

```bash
cd /opt/la-casa-nostra
./scripts/deploy.sh
```

Ese script hace `git pull --ff-only` y después:

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

## 11. Dominio y SSL en el futuro

Cuando tengas dominio:

1. Apunta el registro `A` del dominio a `169.58.9.185`.
2. Cambia en `.env`:

```env
PUBLIC_BASE_URL=https://tudominio.com
FRONTEND_URL=https://tudominio.com
CORS_ALLOWED_ORIGINS=https://tudominio.com
```

3. Añade un proxy SSL delante de este Compose, por ejemplo Caddy, Traefik o Nginx con Certbot.
4. Reinicia:

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```
