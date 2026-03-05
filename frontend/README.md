# 🎨 Frontend — Nuxt 3 "Dark Neon Cinema"

Interfaz de usuario inmersiva del sistema de reservas de cine. Estética **Dark Neon Cinema** con fondo negro profundo (`#050505`), acentos rojo neón (`#f20d33`) y elementos glassmorphic.

## Stack

- **Framework**: Nuxt 3 (Vue 3 + Nitro)
- **Estilos**: Tailwind CSS con tokens personalizados (`void`, `primary`)
- **Estado global**: Pinia
- **Fuente**: Be Vietnam Pro
- **Tests**: Cypress (E2E)
- **Puerto**: `3000`

## Páginas

| Ruta                    | Archivo                          | Descripción                                            |
| ----------------------- | -------------------------------- | ------------------------------------------------------ |
| `/`                     | `pages/index.vue`                | Home — Catálogo de películas con Hero Section dinámico |
| `/sala-espera`          | `pages/sala-espera.vue`          | Cola virtual (activada por WebSocket)                  |
| `/sesion/[id]/asientos` | `pages/sesion/[id]/asientos.vue` | Mapa interactivo de butacas                            |
| `/sesion/[id]/checkout` | `pages/sesion/[id]/checkout.vue` | Carrito y formulario de pago                           |
| `/reserva/[id]`         | `pages/reserva/[id].vue`         | Confirmación de compra con QR                          |
| `/admin`                | `pages/admin/index.vue`          | Dashboard del panel de administración                  |
| `/admin/informes`       | `pages/admin/informes.vue`       | Informes detallados de ventas y ocupación              |

## Composables

| Archivo               | Responsabilidad                                     |
| --------------------- | --------------------------------------------------- |
| `useRealtime.js`      | Conexión Socket.io (bloqueos, cola, estado de sala) |
| `useWebRTC.js`        | Comunicación P2P para visualización de asientos     |
| `useBooking.js`       | Lógica de selección de asientos y carrito           |
| `useBookingSubmit.js` | Envío de reserva al backend vía API                 |
| `useBookingTimer.js`  | Timer de 5 minutos de bloqueo de asiento            |
| `useSeatLogic.js`     | Lógica de validación de estado de asientos          |
| `useAdmin.js`         | Fetch de datos para el panel de administración      |

## Tests Cypress (E2E)

```bash
cd frontend
npx cypress open
```

| Suite               | Descripción                                   |
| ------------------- | --------------------------------------------- |
| `navigation.cy.js`  | Navegación básica por la aplicación           |
| `book_ticket.cy.js` | Flujo completo de reserva de entrada          |
| `admin_panel.cy.js` | Dashboard y flujo de informes del panel admin |

## Desarrollo Local

```bash
cd frontend
npm install
npm run dev
```

Servidor disponible en `http://localhost:3000`

## Variables de Entorno

```env
# frontend/.env
NUXT_PUBLIC_BACKEND_URL=http://localhost:8000
NUXT_PUBLIC_REALTIME_URL=http://localhost:3002
```

## Arranque con Docker

```bash
# Desde la raíz del proyecto
docker compose up --build
```

## Estructura de Directorios Clave

```
frontend/
├── pages/              # Rutas de la aplicación
│   ├── admin/          # Panel de administración
│   ├── sesion/[id]/    # Flujo de compra por sesión
│   └── reserva/        # Confirmación de reserva
├── components/         # Componentes reutilizables
│   ├── SeatMap.vue     # Mapa visual de butacas
│   ├── MovieCard.vue   # Tarjetas estilo póster
│   └── AppNavbar.vue   # Barra de navegación sticky/glass
├── composables/        # Lógica reutilizable (realtime, booking...)
├── stores/
│   └── booking.js      # Estado global del carrito (Pinia)
├── assets/css/
│   └── main.css        # Fuentes globales y utilidades CSS
└── cypress/e2e/        # Tests de integración E2E
```
