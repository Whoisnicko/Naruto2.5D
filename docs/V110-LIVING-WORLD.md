# v1.10 beta — Living World

Base de producción v1.9 aprobada por el jugador (FPS, respawn y roles). PR #22 fusionado en main, SHA 46913bc34ff32c4db1afd3f3f4e44b9678279d4e; Cloudflare no confirmado. Esta fase permanece en rama separada.

- Cinco NPC con rutas de cuatro fases ligadas al reloj de 240 s; posiciones, interacción y minimapa coordinados. Kakashi queda fijo por campaña.
- Tres interiores caminables (Academia, armería, Ichiraku), geometría y muebles procedurales, límites y colisiones propios. E en puerta turquesa, E junto a encargado o salida dorada. No combate dentro. Guardado v11 conserva posición exterior de entrada. Los interiores no sustituyen comercios y misiones del exterior.
- Clima: despejado, lluvia, niebla, tormenta por reloj; lluvia mediante canvas 2D de tamaño limitado, intensidad por calidad, trueno sintético; niebla por capa visual. Sin cambios de daño ni visibilidad de IA. No lluvia en interiores. No refracción o clima volumétrico real.
- Eventos dinámicos tras misión inicial (quest=3), en bosque/frontera: emboscada de tres ninjas (45 s, 50 XP/45 ryō) o suministros (55 s, 25 XP/30 ryō, ramen/pill). Un evento activo a la vez; marcadores amarillos; sin impacto en objetivos principales. Estado temporal no persistido al recargar. Sandbox permite cambiar clima y generar ambos eventos en zona hostil, sin modificar partida normal.

Pruebas: suite de lógica smoke completa con lectura/aserciones adaptadas a V8 aprobada, incluidas rutas, puertas accesibles, colisiones interiores, bloqueo de ataque/dash, guardado exterior, salida, clima, eventos, recompensa y aislamiento de sandbox. Renderer/audio/UI simulados. Revisión visual, FPS y despliegue Cloudflare pendientes.

Preview prevista: https://feature-v110-living-world.naruto2-5d.pages.dev/

## v1.10b — Living World presentation
A pedido del jugador: día, atardecer y noche duran 120 s de simulación cada uno (6 min por ciclo). Reloj de guardado v11 conserva rango 0..240; avanza a 2/3 de unidad por segundo, nuevas partidas empiezan a las 06:00. NPC siguen presentes y accesibles. Iluminación cálida al atardecer y azul oscuro por la noche, transición 2 s, contador visible y botón Cambiar hora en sandbox. Rasengan normal con bordes azul oscuro, centro celeste y ráfagas blancas; tamaño visual 0.74 vs 1.20 Kyūbi a igual carga, sin cambiar daño/colisiones/viaje. Eventos se activan tras 15 s en zona hostil incluso antes de misión inicial; 35 s de enfriamiento al completar, 25 s al expirar; reintento si el terreno no permite aparición. Aviso central 4.5 s, sonido, contador persistente, objetivo, mensaje de éxito/expiración. Menú RPG renovado con sprites reales del Equipo 7, paisaje vectorial original, protector, pergamino, kunai y shuriken; diseño responsive y sin imágenes externas. Suite smoke de lógica superada; validación visual, FPS, sonido y despliegue pendientes. Producción v1.9 intacta.
