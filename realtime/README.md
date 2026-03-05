# ⚡ Realtime — Servidor de Concurrencia Node.js

Servidor dedicado a la gestión de estados efímeros, bloqueos temporales de asientos y control de concurrencia masiva mediante colas de espera virtuales.

## Stack

- **Runtime**: Node.js
- **Comunicación**: Socket.io (WebSockets)
- **P2P**: WebRTC (visualización de asientos en tiempo real)
- **Persistencia**: En memoria (sin base de datos)
- **Puerto**: `3002`

## Funcionalidades

### Bloqueo Temporal de Asientos

Cuando un usuario selecciona un asiento, este queda bloqueado durante **5 minutos** para todos los demás usuarios conectados a la misma sesión. Al expirar el tiempo o desconectarse el usuario, el asiento vuelve a estar disponible automáticamente.

### Cola Virtual (Virtual Queue)

Si hay **más de 5 usuarios** interactuando activamente con el mapa de una sesión:

- Los usuarios excedentes son redirigidos a `sala-espera.vue`
- Se les asigna una posición en la cola en tiempo real
- Al liberarse un slot, el servidor notifica al cliente para permitirle el acceso

### Eventos Socket.io

| Evento (cliente → servidor) | Descripción                                   |
| --------------------------- | --------------------------------------------- |
| `request:lock`              | Solicitar bloqueo de un asiento               |
| `request:purchase`          | Confirmar compra y liberar bloqueo activo     |
| `disconnect`                | Liberar asientas bloqueados y avanzar la cola |

| Evento (servidor → cliente) | Descripción                                     |
| --------------------------- | ----------------------------------------------- |
| `seat:locked`               | Notifica que un asiento ha sido bloqueado       |
| `seat:released`             | Notifica que un asiento ha sido liberado        |
| `queue:position`            | Informa al usuario su posición en la cola       |
| `queue:enter`               | Notifica al usuario que puede acceder a la sala |

## Estructura Modular

```
realtime/src/
├── server.js              # Punto de entrada — configura Express y Socket.io
├── estado.js              # Estado en memoria (rooms, colas, asientos bloqueados)
├── rutas/
│   └── admin.js           # GET /admin/state — consultable por el panel de admin
└── servicios/
│   ├── colas.js           # Lógica de cola virtual (asignación, desconexión, promoción)
│   └── asientos.js        # Validación y expiración de bloqueos de asientos
└── sockets/
    └── eventos.js         # Inicialización de listeners de Socket.io
```

## Arranque con Docker

```bash
# Desde la raíz del proyecto
docker compose up --build
```

## Desarrollo Local

```bash
cd realtime
npm install
node src/server.js
```

Servidor disponible en `http://localhost:3002`
