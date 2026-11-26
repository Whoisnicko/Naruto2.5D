# Mundo 3C.6.9 — UI Restoration & Render Performance
26/11/2026. Usuario aprueba los seis puntos de recuperación del mapa 3C.6.8, reporta árbol de habilidades roto y diario sin presentación original, 64–70 FPS (antes 144) y pide FPS ilimitados.

## Release
Por instrucción explícita del usuario, main se avanzó sin force desde 0f2da406ef15447b7eb6112dc41cdebf98293163 (último mapa clásico con fullscreen, responsive y foco de itch.io) a 489ba35c470c31b5292a8835a09aa01edec0f9ad (3C.6.8 aprobada). Rama version-vieja creada y verificada en SHA original. Main verificado. Cloudflare despliegue real no verificado; GitHub no informa estados de commit. Desarrollo 3C.6.9 separado en rama feature/world3c-ui-performance y preview/konoha-world3c, no en producción.

## UI
Se incluyen CSS originales konoha-dossier, konoha-polish y shinobi-chronicles. Árbol reutiliza renderJutsuTree y reglas originales de desbloqueo; I/P alternan inventario y skills directamente. Se recupera markup original Shinobi Chronicles (Mission Scroll, capítulos, progreso y Bingo Book con retratos/estados) en modal propio, con estado vivo de campo y datos existentes de campaña, misiones secundarias y exámenes. U o pausa abren diario; Escape/U cierran y limpian input. No se cambia la economía, las técnicas ni los requisitos del árbol. No se afirma reparación visual verificada en navegador real.

## Rendimiento
- El perfil previo balanced/performance heredaba 60 FPS al seleccionarlo. Todos los perfiles de campo ahora nacen unlimited; se migran preferencias antiguas a clave v2 conservando otras opciones y se permiten límites explícitos voluntarios. No se fuerza la frecuencia del monitor/navegador.
- src/konoha-render-performance.js contiene utilidades de presentación, caché de transformaciones, cadencias y telemetría. Mallas opacas de terreno con el mismo material/orden se agrupan en WebGL conservando vértices, UV, triángulos; 42 originales en 3 grupos en Konoha (39 llamadas potenciales menos), 3 en 1 en bosque (2 menos), sin agrupables en puesto. Excluye medallón, transparencias y actores. Toggle en pausa; originales/fallback Canvas disponibles. La reducción de llamadas no equivale a una mejora FPS medida.
- Evita actualizar matrices estáticas sin cambios, reutiliza lista de orden de render, cachea viewport, elimina clon de vector en proyección, evita escrituras DOM sin cambios y limpiezas de capas polvo/combate vacías. HUD 10 Hz y estado 5 Hz, clima hasta 60 Hz independiente del juego; mismos estados/efectos. Día neutro sin filtro CSS redundante. Escala de resolución respecto a píxeles CSS en lugar de multiplicar adicionalmente por DPR hasta 1.5 (puede reducir nitidez en HiDPI; preset alta 125%). El controlador adaptativo original sigue apuntando a piso de 60 FPS, no garantiza 144.
- Esc > Rendimiento y movimiento incluye FPS, p95, CPU (no GPU), escala, dimensiones, backend WebGL/Canvas, draw calls, conteo de texturas/geometrías GPU si disponible, estimación base RGBA de texturas de arte y desglose promedio por simulación/escena/render CPU/capas FX/HUD. Estimación no es memoria total ni VRAM real. El nuevo mapa tiene más ilustraciones/texturas/objetos y composición Canvas 2D; hipótesis de coste, no diagnóstico medido del hardware del usuario.

## QA
15/15 pruebas con módulos reales y DOM simulado (diario, Bingo Book, cuatro árboles y unlock, presets, cadencias, telemetría, transform cache), 8/8 con geometría Three.js r169 real (cinco hashes protegidos exactos, vértices/UV/triángulos, medallón, reversibilidad y regiones, matrices), 7/7 con tick/frame real y módulos de combate/movimiento reales, DOM/render/reloj simulados (288 callbacks a 144Hz -> 288 renders simulados, 120 actualizaciones clima y 20 HUD aproximadas, pausa/reanudación, aislamiento HUD, telemetría). 30 comprobaciones en total; no benchmark GPU/visual/browser/Cloudflare. HTML autónomo no regenerado; builder offline antiguo no validado con módulos nuevos. La versión 3C.6.8 queda establecida como producción aprobada, preview 3C.6.9 para probar.
No se modificaron archivos protegidos del mapa ni combate/reglas RPG. Se conservan las 28 validaciones históricas más seis confirmaciones del mapa (con solapamientos), sin convertir pendientes en aprobados.
## Playtest
1. mapa, plaza, mirador y viajes no cambian; HUD sin barra superior.
2. P abre árbol ilustrado y I/P alternan; desbloqueo con puntos reales.
3. U abre diario original y Bingo Book, Escape vuelve al juego.
4. FPS sin límite; registrar Konoha/bosque/combate, preset, backend y datos de pausa. Comparar agrupación WebGL activada/desactivada. Probar noche/lluvia/niebla y claridad de imagen.
5. Regresión movimiento/combate básico; conservar pendientes de migración original.
Producción: https://naruto2-5d.pages.dev/
Preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c69
Respaldo GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/version-vieja
