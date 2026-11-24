# v0.10 beta — Living Open World
Base v0.9 aprobada y fusionada a main en PR 7, commit c5199cb975c9ad6c51b0a3a11288e0934f1f1872. Cloudflare Pages confirmó deploy exitoso del commit. Dominio principal https://naruto2-5d.pages.dev/ (sin verificación HTTP directa). v0.10 permanece en rama independiente.
## Mundo
Cuatro NPC: Sakura (-9,2), Teuchi (-21,11.8), Tenten (-4,-2), Iruka (-13,-14.5). Kakashi y sus entrenamientos intactos. Sprites originales de 24×32, retratos derivados de hojas reales, diálogos con opciones condicionadas y texto progresivo saltable. E interactúa, Esc cierra; diálogo pausa combate.
Cuatro cofres persistentes: suministros, raro, sellado con llave y trampa. Apertura animada, sonido, FX y botín. Trampa resta hasta 18 HP sin matar. El alijo consume llave de Iruka. La llave no se vende ni descarta. Reserva de botín mantiene recompensas si mochila llena.
Misiones secundarias: Sakura recibe 3 telas (50 EXP,35 ryō,2 píldoras,1 ramen); Iruka pide visitar Ichiraku, puente y bosque (75 EXP,50 ryō,llave). Visitas registradas incluso antes de aceptar. Recompensas únicas. Comercio en Ichiraku y Tenten; venta al 50% redondeado hacia abajo (mínimo 1), no vende equipo puesto ni llaves/pergaminos. Sakura recupera vida/chakra por 15 ryō.
Minimapa M, posición del jugador/NPC/cofres/enemigos cercanos, ubicaciones y hora. Ciclo de 240 segundos de juego, tinte nocturno y partículas ambientales ligeras, sin mapas de sombras ni luces dinámicas. El mapa físico y la misión principal no cambian.
## Arquitectura y guardado
src/world-data.js contiene reglas, NPC, cofres, comercio, misiones y estado. src/world-ui.js contiene diálogos, minimapa y seguimiento. src/game.js integra interacción/arte y pausa. Sprite Lab incluye cuatro nuevos personajes. Guardado v4, acepta v2/v3 y formato antiguo. Conserva inventario/equipo/EXP/habilidades/rondas/estado de misión, agrega visitas, cofres y hora. Preserva copia local v3 al actualizar desde v3. Exportar respaldo v3 antes del preview; el formato v4 no es retrocompatible con v0.9.
## Validación
Regresión lógica completa aprobada en entorno simulado. Verificados v2/v3→v4, posiciones transitables, apertura única, llave, trap, compra/venta, condiciones, premios y recuperación de partida. También DOM/Canvas simulados para diálogo, compra, aceptación, mapa y pausa/reanudación. Pendiente navegador real, GPU/FPS, audio, apariencia y ergonomía.
## Playtest
Hablar con cuatro NPC, usar comercio/curación, hacer misiones, abrir cofres (incluido sellado), probar minimapa y ciclo, recargar y comprobar persistencia y rendimiento. No fusionar v0.10 hasta validar.
## Siguiente fase
v0.11 Boss Encounters. Jefes, patrones, fases, ataques anunciados y presentación cinematográfica.
