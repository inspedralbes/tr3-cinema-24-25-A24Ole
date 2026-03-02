<x-mail::message>
# ¡Reserva Confirmada en CinemaFlow! 🍿

Hola **{{ $reserva->nombre }}**,

¡Tus entradas están aseguradas! Prepárate para una experiencia inmersiva. A continuación tienes los detalles de tu compra:

<x-mail::panel>
### Detalles de la Reserva
- **Película:** {{ $reserva->pelicula->titulo ?? 'N/A' }}
- **Fecha y Hora:** {{ $reserva->fecha_reserva }}
- **Asientos:** {{ collect($reserva->asientos)->pluck('asiento_id')->implode(', ') }}
- **Total Pagado:** ${{ number_format($reserva->total_pagado, 2) }}
</x-mail::panel>

<x-mail::button :url="'http://localhost:3000/booking/' . $reserva->id . '-confirmation'">
Ver Eticket Online
</x-mail::button>

Gracias,<br>
El equipo de {{ config('app.name') }}
</x-mail::message>
