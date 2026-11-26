# Mundo 3C.6.3 — Integración de campaña (candidata)
Fecha: 2026-11-25. Base: 85fb5b3e28a32c3f90d20f00255906ec1707b66e.

## Decisión
El usuario confirmó combate y ambiente del bosque 3C.6.2 y pidió una integración amplia, sin aprobación por microfase. New Game y Continue abren el mundo ilustrado en condiciones seguras. La misión de Kakashi es narrativa, no un selector de motores.

## Cambios
- Entrada automática, retorno al mapa ilustrado después de encuentros especiales y selector de historia con elegibilidad original: Zabuza/Haku, Kabuto, Gaara, Orochimaru, Kimimaro, Sasuke, Jiraiya, exámenes Chūnin, selección Team 7 y epílogo.
- Reutilización de la interfaz de inventario, árbol de habilidades, objetos, equipo, hotbar y perfil ilustrado original (living-hud/finished-hud) con recursos vivos; representación de equipo en sprite; efectos de técnicas del atlas original con fallback.
- Guardado manual, automático cada 20 s en situación segura y salida a título; transacción con validación v11 y posición ilustrada local separada del JSON exportado.
- Los encuentros especiales mantienen motor, arena, cinemática y HUD originales, no están redibujados en geometría ilustrada. El combate normal sigue siendo el adaptador del bosque inicial. Kyūbi fuera de encuentros, entrenamiento repetible, cofres, enemigos regionales, eventos, interiores, menú de pausa y HUD completo del mapa, y descubrimientos persistentes de viaje rápido quedan por integrar. No se regenera HTML offline. No se toca main.

## QA ejecutado
18/18 comprobaciones de lógica con 13 módulos reales: adquisición única, aceptación de misión, baja, bloqueo de baja duplicada, guardado v11, repetición de checkpoint sin recompensa doble, cinco bajas, serialización, región inválida, posición inicial, rechazo revisión ajena y resurrección, bloqueo de historia, apertura Mist/examen/Team 7, presencia de destinos de jefes y bloqueo inicial Sasuke. Comprobación sintáctica de cuerpos JS con imports/import.meta sustituidos y consistencia de IDs HTML. No se ejecutó navegador/GPU, pruebas de cinemática real, FPS ni despliegue Cloudflare.

## Playtest conjunto
Inicio y Continue, mapa y colisiones, ambiente y sprint, entrada/retorno de cada jefe, derrotas/reintentos, secuencia cinemática y recompensas, exámenes, Team 7, inventario/equipo/habilidades/consumibles, efectos de técnicas, guardado/reload y posición, pantalla completa y rendimiento. Reportar todos los bugs juntos. Exportar respaldo antes de reemplazar una partida importante.

Preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c63
Repo: https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
