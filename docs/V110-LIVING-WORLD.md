# v1.10 beta — Living World

Base de producción v1.9 aprobada por el jugador (FPS, respawn y roles). PR #22 fusionado en main, SHA 46913bc34ff32c4db1afd3f3f4e44b9678279d4e; Cloudflare no confirmado. Esta fase permanece en rama separada.

- Cinco NPC con rutas de cuatro fases ligadas al reloj de 240 s; posiciones, interacción y minimapa coordinados. Kakashi queda fijo por campaña.
- Tres interiores caminables (Academia, armería, Ichiraku), geometría y muebles procedurales, límites y colisiones propios. E en puerta turquesa, E junto a encargado o salida dorada. No combate dentro. Guardado v11 conserva posición exterior de entrada. Los interiores no sustituyen comercios y misiones del exterior.
- Clima: despejado, lluvia, niebla, tormenta por reloj; lluvia mediante canvas 2D de tamaño limitado, intensidad por calidad, trueno sintético; niebla por capa visual. Sin cambios de daño ni visibilidad de IA. No lluvia en interiores. No refracción o clima volumétrico real.
- Eventos dinámicos tras misión inicial (quest=3), en bosque/frontera: emboscada de tres ninjas (45 s, 50 XP/45 ryō) o suministros (55 s, 25 XP/30 ryō, ramen/pill). Un evento activo a la vez; marcadores amarillos; sin impacto en objetivos principales. Estado temporal no persistido al recargar. Sandbox permite cambiar clima y generar ambos eventos en zona hostil, sin modificar partida normal.

Pruebas: suite de lógica smoke completa con lectura/aserciones adaptadas a V8 aprobada, incluidas rutas, puertas accesibles, colisiones interiores, bloqueo de ataque/dash, guardado exterior, salida, clima, eventos, recompensa y aislamiento de sandbox. Renderer/audio/UI simulados. Revisión visual, FPS y despliegue Cloudflare pendientes.

Preview prevista: https://feature-v110-living-world.naruto2-5d.pages.dev/
