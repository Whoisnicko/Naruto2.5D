# Mundo 2 — Konoha compacta, blockout v1

Base estable v1.20e.1 (5197ff0fc03f61a9af51bbcd0cd90d7ac4cce7d0). La maqueta es una página independiente del juego, no reemplaza el motor ni la campaña. Inspirada en el plano maestro del usuario; no es una cartografía oficial del anime.

## Escala y diseño
144 × 84 tiles lógicos, franja norte escénica de 24; referencia artística futura 16 px/tile, no equivalencia directa con las unidades Three.js actuales. Norte: Monte Hokage con cuatro rostros provisionales (época inicial), Torre, Academia, Hospital y entrenamiento. Centro: plaza, avenida, puentes y salida este. Sur: puerta principal, mercado e Ichiraku. Dos barrios residenciales, río y tres puentes. 23 huellas de edificios sólidos. Movimiento base 4,8 tiles/s y carrera 8,4; valores provisionales. Puerta y salida oriental son límites de prueba, no transiciones activas. Los edificios son maquetas, no interiores accesibles.

## Archivos
- `konoha-blockout.html`: interfaz de laboratorio, sin dependencias externas.
- `src/konoha-layout.js`: datos de zonas, huellas, paredes, rutas y colisiones.
- `src/konoha-blockout.js`: cámara, dibujo Canvas 2D en perspectiva oblicua, movimiento, selección y controles táctiles.
- `docs/konoha-blockout-qa.json`: pruebas de lógica y navegador.

## Validación
WASD/flechas, Shift, plano general y explorar, etiquetas y reiniciar. BFS en cuadrícula: todos los 12 puntos jugables alcanzables. Colisión sólida, río y cruces verificados. Chromium: 5 resoluciones, navegación y selección sin errores, usando exactamente el código concatenado porque el navegador de pruebas bloquea navegación localhost. No se valida carga de módulos por HTTP, dispositivo táctil real ni rendimiento del motor del juego.

## Siguiente fase, previa aprobación
Biblioteca artística: puerta/muralla, Torre Hokage, Monte Hokage (cuatro rostros), Academia, Hospital, Ichiraku, viviendas modulares, puestos, caminos, árboles y puentes. Probar una sección visual vertical (plaza + Torre + montaña) en la cámara real antes de completar la ciudad. Migrar luego NPC, quests, colisiones, minimapa y guardados con mapa de coordenadas; conservar la campaña y los sprites aprobados.

Producción: https://naruto2-5d.pages.dev/ ; GitHub: https://github.com/Whoisnicko/Naruto2.5D ; rama: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v122-konoha-blockout ; preview previsto: https://feature-v122-konoha-blockout.naruto2-5d.pages.dev/konoha-blockout.html
