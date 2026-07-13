# Restaurante Girasol

Aplicacion full-stack para una web profesional de restaurante y carta digital QR.

## Stack

- Frontend: Angular 20 standalone, routing, formularios reactivos y SCSS.
- Backend: Spring Boot 3.5, Java 21, Spring Web, Spring Security, JWT, Spring Data JPA, Validation, Flyway, Lombok y OpenAPI.
- Base de datos: PostgreSQL local instalado en Windows.

## Requisitos

- Java 21 o superior.
- Node.js compatible con Angular 20. Este proyecto fue generado con Angular 20 porque Angular 22 requiere Node 24.15+ y este entorno tenia Node 24.14.
- npm.
- PostgreSQL instalado localmente y `psql` disponible en PATH.

## Arranque rapido en Windows

Desde la raiz del proyecto:

```powershell
.\start-all.ps1
```

Esto intenta arrancar el servicio local de PostgreSQL si existe, arranca el backend con Maven Wrapper y el frontend Angular.

Para parar:

```powershell
.\stop-all.ps1
```

## Arranque manual

Base de datos:

```powershell
.\setup-postgres.ps1
```

Cuando pregunte `PostgreSQL admin user`, usa un usuario administrador existente de tu instalacion, normalmente `postgres`.
No uses `girasol` en ese prompt la primera vez: el usuario `girasol` lo crea este script.

El backend espera esta configuracion por defecto:

- Host: `localhost`
- Puerto: `5432`
- Base de datos: `girasol`
- Usuario: `girasol`
- Password: `girasol`

Si quieres usar otros datos, define variables de entorno antes de arrancar backend:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/girasol"
$env:SPRING_DATASOURCE_USERNAME="girasol"
$env:SPRING_DATASOURCE_PASSWORD="girasol"
```

Backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd frontend
npm install
npm start
```

## URLs

- Frontend: http://localhost:4200
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Health: http://localhost:8080/actuator/health
- Admin: http://localhost:4200/admin

## Rutas frontend

- `/`: landing premium con hero, destacados, categorias, galeria, reviews, horario y ubicacion.
- `/carta`: carta digital optimizada para QR y movil, con buscador, categorias sticky, filtros por tags/alergenos y estados vacios.
- `/carta/plato/:slug`: detalle de plato con imagen, precio, categoria y aviso de alergenos.
- `/contacto`: formulario de reserva/contacto que guarda solicitudes en PostgreSQL.
- `/admin/login`: login real de administracion.
- `/admin`: panel protegido para crear categorias, crear/editar/eliminar platos y gestionar reservas.

## Endpoints principales

Publicos:

- `POST /api/auth/login`
- `GET /api/categories`
- `GET /api/menu-items`
- `GET /api/menu-items?category=entrantes&search=pollo&tags=GLUTEN,HALAL`
- `GET /api/menu-items/{id}`
- `GET /api/menu-items/slug/{slug}`
- `GET /api/restaurant-info`
- `POST /api/reservations`

Admin:

- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`
- `GET /api/admin/menu-items`
- `POST /api/admin/menu-items`
- `PUT /api/admin/menu-items/{id}`
- `DELETE /api/admin/menu-items/{id}`
- `GET /api/admin/reservations`
- `PUT /api/admin/reservations/{id}/status`

## Datos iniciales

Flyway crea las tablas e inserta automaticamente al arrancar el backend:

- Informacion editable del restaurante.
- 11 categorias.
- 12 tags/alergenos.
- Carta inicial completa con entrantes, antipasti, ensaladas, carnes, hamburguesas, pescado, arroces, menu infantil, pizzas, calzones, pinsas y pasta.
- Usuario administrador inicial con password BCrypt.

## Estructura

```text
backend/
  src/main/java/com/girasol/restaurant/
    config/
    controller/
    dto/
    entity/
    exception/
    mapper/
    repository/
    service/
  src/main/resources/db/migration/
frontend/
  src/app/core/
  src/app/shared/
  src/app/features/home/
  src/app/features/menu/
  src/app/features/dish-detail/
  src/app/features/contact/
  src/app/features/admin-login/
  src/app/features/admin/
start-all.ps1
stop-all.ps1
setup-postgres.ps1
```

## Admin

La ruta `/admin` esta protegida por login real.

Credenciales iniciales:

- Usuario: `pastel`
- Contrasena: `pastel`

Flujo:

- Si entras a `/admin` sin token, Angular redirige a `/admin/login`.
- El login llama a `POST /api/auth/login`.
- Si las credenciales son correctas, el backend devuelve un JWT con usuario, rol y expiracion.
- Angular guarda el token en `localStorage` y lo anade automaticamente como `Authorization: Bearer <token>` en peticiones `/api/admin/**`.
- Si el backend devuelve `401` o `403` en una llamada admin, Angular borra el token y vuelve a `/admin/login`.
- El boton `Cerrar sesion` borra el token y redirige a `/admin/login`.

El backend protege `/api/admin/**` con Spring Security y rol `ADMIN`. Aunque se manipule el frontend o se llamen endpoints admin desde DevTools/Postman sin token, responderan `401` o `403`.

Para cambiar usuario o contrasena:

- Opcion recomendada: actualizar la fila de `admin_users` con un nuevo hash BCrypt en PostgreSQL.
- El hash actual se crea en `backend/src/main/resources/db/migration/V3__admin_users.sql`.
- Para produccion, cambia tambien `APP_JWT_SECRET` por una clave larga y privada.

## Preparado para produccion

Siguientes mejoras recomendadas:

- Cambiar la contrasena inicial del administrador.
- Cambiar `APP_JWT_SECRET` antes de desplegar.
- Subida de imagenes a storage en lugar de URLs externas.
- Variables de entorno por entorno y despliegue preparado para el hosting que elijas.
- Tests e2e y pipeline CI.
- Integracion real de reservas o notificaciones por email/WhatsApp.
