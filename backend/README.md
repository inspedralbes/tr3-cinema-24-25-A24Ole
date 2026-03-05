# 🔧 Backend — API REST Laravel

Módulo de persistencia, lógica de negocio y API REST del sistema de reservas de cine.

## Stack

- **Framework**: Laravel 12 (API REST)
- **Base de Datos**: MySQL 8.0
- **Infraestructura**: Docker
- **Puerto**: `8000`

## Estructura de la Base de Datos

| Tabla       | Descripción                                            |
| ----------- | ------------------------------------------------------ |
| `usuarios`  | Usuarios con roles (`cliente` / `admin`)               |
| `peliculas` | Catálogo de películas sincronizadas desde API externa  |
| `sesiones`  | Sesiones programadas (película + sala + hora + precio) |
| `reservas`  | Cabecera de reserva (usuario / invitado, total pagado) |
| `asientos`  | Asientos ocupados por reserva y sesión                 |

## API Endpoints

### Películas

| Método | Ruta                 | Descripción                    |
| ------ | -------------------- | ------------------------------ |
| `GET`  | `/api/peliculas`     | Lista todas las películas      |
| `GET`  | `/api/pelicula/{id}` | Detalle de una película por ID |

### Reservas

| Método | Ruta                 | Descripción                                      |
| ------ | -------------------- | ------------------------------------------------ |
| `POST` | `/api/reservas`      | Crea una nueva reserva con asientos              |
| `GET`  | `/api/reservas/{id}` | Consulta una reserva con sus asientos y película |

### Admin

| Método | Ruta                 | Descripción                                                |
| ------ | -------------------- | ---------------------------------------------------------- |
| `GET`  | `/api/admin/reports` | Retorna métricas de ventas, ocupación y evolución temporal |

## Comandos Artisan Personalizados

```bash
# Sincroniza 8 películas desde la API externa y las persiste en DB
php artisan app:sincronizar-peliculas
```

## Arranque con Docker

```bash
# Desde la raíz del proyecto
docker compose up --build
```

El contenedor ejecuta automáticamente al arrancar:

```
php artisan migrate --force
php artisan app:sincronizar-peliculas
php artisan serve --host=0.0.0.0 --port=8000
```

## Desarrollo Local

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan app:sincronizar-peliculas
php artisan serve
```

## Datos del Payload de Respuesta

Los campos de película se exponen al frontend con nombres en español:

```json
{
    "id_pelicula_api": 1,
    "titulo": "Nombre de la película",
    "poster_url": "https://...",
    "duracion": 120,
    "genero": "Acción",
    "descripcion": "...",
    "año": 2024
}
```

## Controladores

- `PeliculaController` — Gestión del catálogo de películas
- `ReservaController` — Lógica de creación y consulta de reservas
- `AdminController` — Métricas y reportes del panel de administración
