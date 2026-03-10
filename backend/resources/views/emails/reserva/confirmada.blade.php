<x-mail::message>
# 🎬 ¡Tu entrada para la Gran Pantalla! 🍿

Hola **{{ $reserva->nombre }}**,

¡Tu reserva en **CinemaFlow** se ha completado con éxito! Prepárate para disfrutar de la mejor experiencia cinematográfica.

<div style="text-align: center; margin-bottom: 20px;">
@if($reserva->pelicula && $reserva->pelicula->poster_url)
<img src="{{ $reserva->pelicula->poster_url }}" alt="{{ $reserva->pelicula->titulo }}" style="width: 200px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
@endif
</div>

<x-mail::panel>
## 🎫 TICKET DIGITAL
---
**Película:** {{ $reserva->pelicula->titulo ?? 'N/A' }}  
**Fecha:** {{ \Carbon\Carbon::parse($reserva->created_at)->format('d/m/Y H:i') }}  
**Butacas:** {{ collect($reserva->asientos)->pluck('asiento_id')->implode(', ') }}  
**Total:** {{ number_format($reserva->total_pagado, 2) }}€
---
</x-mail::panel>

<x-mail::button :url="config('app.url') . '/sesion/' . $reserva->pelicula_id . '/asientos'">
Ver Eticket Online
</x-mail::button>

*Si tienes cualquier duda, puedes responder a este correo.*

Gracias por elegirnos,<br>
**El equipo de {{ config('app.name') }}**
</x-mail::message>
