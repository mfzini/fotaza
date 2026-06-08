# Fotaza 2

Aplicación web desarrollada para el Trabajo Práctico Integrador de Programación Web II.

## Descripción

Fotaza 2 permite a los usuarios registrados publicar fotografías y videos con etiquetas, comentarios, valoraciones y seguimiento de autores. La aplicación se renderiza en el servidor con Pug y utiliza Node + Express + Bun, PostgreSQL, Redis y almacenamiento compatible con S3.

## Funcionalidades implementadas

- Autenticación de usuarios con registro, login y logout.
- Gestión de publicaciones: título, descripción, etiquetas, múltiples archivos y marca de agua opcional por imagen.
- Búsqueda potente por:
  - etiquetas
  - título de publicación
  - nombre de usuario
- Comentarios en imágenes.
- Valoración de imágenes con un voto por usuario.
- Seguimiento de usuarios (follow/unfollow) y perfil de usuario.
- Base de datos ifuerte>`
   - `S3_KEY_ID`, `S3_SECRET_KEY`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`
   - `TZ=America/Argentina/San_Luis`
5. Configurar `.env.redis` connicializada con `npm run db:init` y datos de ejemplo.

## Tecnologías

- Bun / Node.js
- Express
- Pug
- Passport Local
- Sequelize + sequelize-typescript
- PostgreSQL
- Redis
- AWS S3 compatible (o MinIO / Supabase Storage)
- bcrypt, helmet, multer

## Requisitos

- PostgreSQL
- Redis
- Bucket compatible con S3
- Bun instalado o ambiente compatible con `bun`

## Instalación local

1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Copiar archivos de ejemplo:
   - `.env.example` → `.env`

- Username: `test`
  - Email: `test@test.dev`
  - Password: `test123`
- Username: `alice_creative`
  - Email: `alice@example.com`
  - Password: `password123`
   - `.env.redis.example` → `.env.redis`
4. Configurar variables de entorno en `.env`:
   - `NODE_ENV=production` o `development`
   - `DB_URL=postgres://user:password@localhost/example`
   - `SESSION_SECRET=<secreto fuerte>`
   - `S3_KEY_ID`, `S3_SECRET_KEY`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`
   - `TZ=America/Argentina/San_Luis`
5. Configurar `.env.redis` con la URL de Redis:
   - `REDIS_URL=redis://:password@localhost:6379`
6. Iniciar los servicios de soporte si se utiliza Docker Compose:
   - `docker compose up -d`
7. Inicializar la base de datos:
   - `npm run db:init`
8. Iniciar la aplicación:
   - `npm start`
9. Abrir en el navegador:
   - `http://localhost:3000`

## Scripts disponibles

- `npm start` — inicia la aplicación en producción.
- `npm run dev` — inicia la aplicación en modo desarrollo con watch.
- `npm run db:init` — ejecuta `seed.ts` y crea/llena la base de datos de ejemplo.

## Usuarios de prueba

- Username: `test`
  - Email: `test@test.dev`
  - Password: `test123`
- Username: `alice_creative`
  - Email: `alice@example.com`
  - Password: `password123`

## Notas importantes

- La inicialización de la base de datos se realiza con el script `seed.ts`.
- La aplicación renderiza todas las vistas en el servidor utilizando Pug.
- El proyecto no utiliza frameworks frontend como React, Vue o Angular.

## Limitaciones conocidas

- En esta versión no se implementó el gestor de notificaciones.
- No se incorporó una sección de colecciones/favoritos aún.

## Observaciones

El proyecto está construido para cumplir los requisitos básicos de la consigna: autenticación, publicaciones, búsqueda, comentarios, valoraciones y seguimiento de usuarios. Toda la configuración necesaria para correrlo localmente está documentada en este README.

