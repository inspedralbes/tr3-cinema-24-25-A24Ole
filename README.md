# 🎬 Sistema de Gestión de Reserva de Butacas de Cine

## Descripción

Plataforma de venta de entradas con experiencia de usuario premium, gestión robusta de concurrencia y mapa interactivo de asientos en tiempo real. Diseñada con una estética **"Dark Neon Cinema"** y arquitectura de tres módulos independientes.

## Integrantes

- **Oleksiy Prochko Yatsko**

## Stack Tecnológico

| Módulo              | Tecnología                                    |
| ------------------- | --------------------------------------------- |
| **Frontend**        | Nuxt 3 (Vue 3 + Nitro) + Tailwind CSS + Pinia |
| **Backend**         | Laravel 12 (API REST) + MySQL                 |
| **Realtime**        | Node.js + Socket.io + WebRTC                  |
| **Infraestructura** | Docker (6 contenedores) + GitHub Actions      |
| **Testing**         | Cypress (E2E)                                 |

## Arquitectura de Servicios (Docker)

```
cinema_frontend   → http://localhost:3000
cinema_backend    → http://localhost:8000
cinema_realtime   → http://localhost:3002
cinema_db         → MySQL 8.0 (puerto 3306)
cinema_adminer    → http://localhost:8080
cinema_mailpit    → http://localhost:8025
```

## Funcionalidades Implementadas

### Frontend (Nuxt 3)

- 🏠 **Home** — Catálogo de películas con Hero Section dinámico desde la API
- 🎭 **Selección de Sesión** — Horarios y tipos de entrada (General, VIP, Accesibilidad)
- 💺 **Mapa de Asientos** — Grid interactivo con estados en tiempo real (disponible / bloqueado / vendido)
- ⏳ **Sala de Espera** — Cola virtual activada cuando hay más de 5 usuarios simultáneos
- 🛒 **Checkout** — Carrito glassmorphic con timer de reserva
- ✅ **Confirmación** — Ticket con código QR generado
- 🔴 **Panel de Administración** — Dashboard con métricas e informes detallados
- 🌍 **Multilingüe** — Soporte para múltiples idiomas (Català, Castellano, English) en toda la interfaz
- 🧪 **Tests Cypress** — Suites E2E para navegación, reserva y panel admin

### Backend (Laravel 12)

- `GET /api/peliculas` — Listado de películas
- `GET /api/pelicula/{id}` — Detalle de película
- `POST /api/reservas` — Creación de reserva con asientos
- `GET /api/reservas/{id}` — Consulta de reserva
- `GET /api/admin/reports` — Informes de ventas para el panel admin
- `php artisan app:sincronizar-peliculas` — Sincronización con API externa

### Realtime (Node.js modular)

- Bloqueo temporal de asientos (5 min) gestionado en memoria
- Cola virtual para control de concurrencia (máx. 5 usuarios activos)
- Arquitectura modular: `server.js` + `estado.js` + `servicios/` + `sockets/`

## Inicio Rápido

```bash
docker compose up --build
```

Esto levanta todos los servicios automáticamente. El backend ejecuta las migraciones y sincroniza las películas al arrancar.

## Gestor de Tareas

- [Taiga — TR3 Cinema Oleksiy](https://tree.taiga.io/project/lexk0-tr3-cinema-oleksiy/timeline)

## Estado del Proyecto

✅ **Proyecto Finalizado — Versión 1.0**

- [x] Sprint 1 — Arquitectura base, Docker, DB, API películas
- [x] Sprint 2 — Mapa de asientos, realtime, flujo de compra completo, panel admin
- [x] Sprint 3 — Refactoring modular, tests Cypress, informes admin, soporte multilingüe y correcciones finales
