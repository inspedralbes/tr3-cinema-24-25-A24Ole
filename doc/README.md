# Documentación del Proyecto

## 1. El Concepto y Objetivo

**Proyecto:** Sistema de gestión de reserva de butacas de cine.
**Tiempo:** 3 semanas (organizado en 3 Sprints).
**Tecnologías:** Vue 3 (Frontend), Laravel (Backend/Persistencia) y Node.js + Socket.io (Tiempo real) + WebRTC (Bloqueo de asientos).
**Funcionalidad estrella:** Cola virtual de acceso (máximo 5 personas reservando a la vez) y gestión de asientos en tiempo real para evitar duplicidades.

## 2. Arquitectura de Estados (Butacas)

Hemos definido que un asiento pasará por tres estados:

- **Disponible:** Estado inicial en la base de datos de Laravel.
- **Bloqueado Temporal (5 min):** Gestionado por Node.js en memoria. Se activa cuando alguien hace clic.
- **Vendido:** Estado final persistido en MySQL a través de Laravel tras el pago.

## 3. Modelo de Datos (Laravel + MySQL)

Se ha implementado una lógica de **"Asiento por excepción"** para optimizar el rendimiento y almacenamiento.

### La Nueva Lógica de la DB

- **Tabla `seats` (Maestra):** Solo contiene la configuración física de la sala (dónde hay un asiento y qué tipo es: standard, vip, disabled). Esta tabla es estática y define el mapa de la sala.
- **Tabla `bookings` / `seat_session` (Dinámica):** Aquí se registran las ocupaciones. Solo se inserta una fila en `seat_session` cuando un asiento es reservado o vendido para una sesión específica.

**¿Cómo sabemos si un asiento está libre?**
Si el asiento X de la Sala Y **no existe** en la tabla `seat_session` para la Sesión Z, entonces está **disponible**.

### Tablas Clave

- `movies`: Títulos y posters.
- `rooms`: Dimensiones de las salas.
- `sessions`: Sesiones programadas (película, sala, hora).
- `seats`: Configuración física de los asientos (Fila, Número, Tipo).
- `bookings`: Cabecera de la reserva (Usuario, Total, Estado).
- `seat_session`: Registro individual de cada asiento ocupado en una sesión.

![Esquema de Base de Datos](./Esquema_de_base_datos.png)

## 4. Capa Realtime (Node.js)

El servidor en la carpeta `/realtime` se encarga de:

- **La Cola:** Si hay > 5 usuarios, los manda a una "sala de espera" y les avisa su posición.
- **El Bloqueo:** Notifica a todos los clientes cuando alguien selecciona un asiento para que se ponga gris/bloqueado instantáneamente.
- **Desconexiones:** Si un usuario se va, libera su sitio y permite pasar al siguiente de la cola.

## 5. Infraestructura y Git

- **Repositorio:** Monorepo con carpetas `/backend`, `/frontend` y `/realtime`.
- **Ramas:** `main` (Producción) y `dev` (Desarrollo).
- **Despliegue:** Uso de Docker para contenedores y GitHub Actions para subir a producción automáticamente al hacer merge a main.

![Esquema de Carpetas](./Esquema_de_carpetes.png)

## 6. Flujo de Usuario (Diseño Stitch)

- **Home:** Selección de película.
- **Tipo de Entrada:** Selección de tarifa (General, Socio, etc.).
- **Cola Virtual:** (Solo si hay más de 5 personas).
- **Mapa de Asientos:** Selección táctil/clic con feedback en tiempo real.
- **Pago y Confirmación:** Simulación de pago y generación de ticket con QR.

![Flujo de Pantalla 1](./Flujo_de_pantalla_1.png)
![Flujo de Pantalla 2](./Flujo_de_pantalla_2.png)
