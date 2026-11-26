# Mundo 3C.6.5 — HUD Cleanup & Input Recovery
Base: bed2c9cd71b2fac28fec3bca82c43db12cb58278. Fecha: 26/11/2026.

## Incidencia y solución
El usuario mostró una pantalla estática de 3C.6.4, con solo coste Q visible, minimapa vacío, estado Inicializando. El análisis reprodujo ReferenceError: skillModifiers is not defined en la segunda tarjeta (J); faltaba su import desde rpg-data.js. La excepción detenía tick antes del siguiente requestAnimationFrame. Import corregido; el ciclo usa un supervisor frame y aísla errores de perfil/técnicas, minimapa y efectos con avisos visibles; un fallo de simulación se reporta en vez de congelarse silenciosamente.

## Interfaz
Campaña sin barra de laboratorio ni banda del iframe. Perfil, técnicas, consumibles, misión/minimapa, zona y acción contextual permanecen. Accesos de inventario I, habilidades P, diario U (J es ataque), viaje M, Esc pausa. Menú pausa incluye accesos de campaña, guardar, exportar, título, pantalla completa, mirador, sonido/volumen, sandbox separado y salida de emergencia confirmada. Teletransportes de laboratorio y selector de personaje de prueba no se muestran en campaña. Se conserva la selección narrativa Team 7. Minimapa con lienzo posicionado dentro del marco original. Se mantiene el contenido de 3C.6.4.

## QA
11/11 comprobaciones ejecutadas con funciones reales de HUD, minimapa, movimiento, combate, datos y bucle, usando DOM/canvas/renderizador/reloj simulados: reproducción ReferenceError anterior, ocho costes de técnicas, desbloqueo G, cuatro barras, dibujado mapa, cuatro héroes, 90 fotogramas con movimiento, 12 más con fallo HUD deliberado, pausa sin avance, 12 fotogramas al reanudar, IDs únicos. Total 114 fotogramas activos. Sintaxis JS y 137 IDs sin duplicados/referencias estáticas faltantes. No se ejecutó navegador real ni GPU/FPS ni despliegue Cloudflare; red del entorno local no resuelve GitHub. No se actualiza HTML offline. Main intacto.

## Playtest
Primero confirmar movimiento, animaciones, ataque, minimapa, HUD sin barra superior, Esc y regreso, I/P/U/M. Mantener 11 aprobaciones de 3C.6.3 (exploración y ambiente); las 51 pruebas pendientes de 3C.6.4 siguen sin validar, no se dan por aprobadas. No hay nuevas mecánicas de campaña en esta corrección; se prioriza recuperar estabilidad. Jefes aún usan arenas anteriores; interiores y eventos aleatorios pendientes.

Preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c65
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
