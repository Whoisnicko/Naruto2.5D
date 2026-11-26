# Mundo 3C.6.4 — Field Combat & HUD

Fecha: 2026-11-25. Base: c8c0c5770076a9095d6da972b7fc668d15ac4470.

## Playtest anterior
Aprobados por usuario 11 puntos: New Game, Continue, movimiento y colisiones, sprint/polvo, viaje rápido, mirador, luz día/atardecer/noche, faroles, niebla, lluvia/tormenta y ambiente sonoro. Reportó falta de enemigos, HUD/UI incompletos y combate bloqueado en ciudad. Otros 33 puntos sin validar, no necesariamente fallos.

## Cambios
- Combate libre en las tres regiones desde inicio (excepto técnicas avanzadas que conservan requisitos de progresión); ya no depende de misión activa ni de región forest. Tres objetivos de práctica en Konoha, 5 renegados iniciales del bosque (primera baja inicia misión sin necesidad de hablar con Kakashi), cuatro enemigos regionales originales en puesto fronterizo. Entrada segura por botón Bosque disponible desde inicio; entrenamiento por botón Entrenamiento; descubrimiento de viajes exteriores derivado de lugares visitados.
- Práctica en ciudad: no da XP ni monedas; reaparece a los 3 segundos. Rondas de bosque posteriores a primera misión desde Kakashi, recompensas y loot originales, primera ronda recompensa eliteVest. Transacción v11 permite reiniciar los 5 IDs solo en ronda explícita, sin duplicar recompensas ni revertir cofres/guardianes. Sin reset de partida.
- Siete cofres originales remapeados con sprites de pixel art programáticos y estados abierto/cerrado, llave, trampa y guardián; persistencia en save original. Cuatro enemigos regionales con IDs y premios originales, sincronizados con estado del motor de campaña.
- HUD original: perfil, barras vivas, ocho iconos de técnicas y sus costes/cooldowns, bloqueo/carga, accesos rápidos, mapa local con enemigos/NPC/cofres/salidas, objetivo de misión. Reutilización de UI original de inventario, equipo y árbol. Pausa, exportación, guardado, volumen, audio ambiente y efectos procedurales originales. Diseño responsive CSS con fallback de gráficos. Kyūbi de campo después de desbloqueo: ira, duración, bonus, curación, aura y atlas morado; adaptación simplificada (sin todas las fases originales).
- Se mantuvieron los cambios de exploración/ambiente validados; no se modificaron assets del mundo ni reglas de movilidad. Encuentros y cinemáticas especiales aún funcionan por handoff al motor original. Interiores y eventos de mundo aleatorios, pulido cinematográfico visual, equivalencia completa de técnicas avanzadas y controles móviles reales siguen pendientes; no se afirma integración final.

## QA
52/52 comprobaciones lógicas iniciales, 14/14 adicionales tras integrar rondas y Kyūbi (66 en total, algunas coberturas solapadas). Incluyen combate inicial en ciudad, prácticas, primera baja inicia misión, cinco enemigos en bosque, recompensas sin duplicación, cofres con llave y guardián, persistencia v11, posiciones transitables, viajes y entrenamiento repetible. Comprobación sintáctica de cuerpos JS con imports sustituidos; 128 IDs de HTML sin duplicados ni referencias estáticas faltantes, 8 tarjetas originales y 2 controles defensivos. No se verificó navegador/GPU, disposición final visual, FPS, Cloudflare ni descarga efectiva de respaldo. Main intacto.

## Playtest
Retomar los 33 puntos no validados de 3C.6.3 más: atacar en Konoha desde inicio; botón Entrenamiento y práctica; botón Bosque sin misión; enemigos antes de Kakashi; cuatro enemigos regionales; cofres y persistencia; nueva ronda de bosque; minimapa; pausa y exportación; Kyūbi después de País de las Olas. Regresión breve de los 11 puntos aprobados si aparece un problema. No usar la rama de pruebas para una partida importante sin respaldo.

Preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c64
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
Producción (sin cambios): https://naruto2-5d.pages.dev/
