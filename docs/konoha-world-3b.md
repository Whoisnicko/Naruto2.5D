# Mundo 3B — Asset Studio (entrega técnica parcial)

Base: Mundo 3A, commit 872e96cca8f1d7cd5c590951ec88d32d6654146a. Producción permanece v1.20e.1, 5197ff0fc03f61a9af51bbcd0cd90d7ac4cce7d0. El generador de imágenes falló; no se crearon ilustraciones nuevas. No se aprueba el arte ni se inicia Mundo 3C.

## Herramienta
Página independiente con los 11 recursos provisionales originales. Importa PNG/WebP de hasta 12 MiB y hasta 4096 px por lado, verifica dimensiones del contenido visible y proporción de transparencia, convierte a WebP con calidad 0,94 y permite exportar solo si los criterios técnicos se cumplen. Puede previsualizar incluso recursos que no cumplen, restaurar el original y navegar con el layout y colisiones de Mundo 2. Los archivos se procesan localmente y no se guardan en el servidor. La textura de pavimento se inspecciona en biblioteca, pero el suelo del escenario sigue dibujado de forma procedural. Los otros diez recursos se ven en el mapa. No hay aprobación artística automatizada: tamaño y alfa no garantizan calidad real, perspectiva, bordes ni ausencia de rótulos. No agrandar recortes para superar el umbral.

## Objetivos de resolución
Los mínimos miden la caja del contenido visible, no un lienzo cuadrado con márgenes. Mantener relación de aspecto original.

| Pieza | Mínimo |
|---|---|
| mountain | 2048 × 640 |
| tower | 1024 × 640 |
| academy | 512 × 256 |
| hospital | 512 × 256 |
| house-round | 512 × 320 |
| house-tile | 512 × 320 |
| house-blue | 512 × 320 |
| cherry | 256 × 256 |
| tree | 256 × 256 |
| ramen | 512 × 256 |
| paving | 256 × 256 |

## Dirección artística
Perspectiva ortográfica frontal elevada ~40° (referencia de la cámara del juego), luz diurna consistente desde arriba a la izquierda, contornos entintados, tonos terrosos, terracota, madera y follaje orgánico. Fondos transparentes y sin sombras externas incorporadas para edificios y árboles; pavimento repetible, sin textos ni números superpuestos. Monte panorámico con cuatro rostros de la época inicial, sin cielo ni rótulos. Torre completa con cubierta, cuerpo circular y fachada. Academia, Hospital, Ichiraku, tres viviendas (y tres variantes adicionales futuras), vegetación, puerta, tramos de muro, puente, faroles y puesto comercial. Las últimas piezas todavía no forman parte del importador ni del escenario artístico.

## Pruebas
Chromium aislado: 1366×768, 1920×1080 y 390×844. Importación válida, exportación y verificación de WebP, restauración, rechazo para exportación de muestras opacas y pequeñas, manejo de archivo corrupto, movimiento, sin errores JS. Muestras de prueba sintéticas no incluidas en el arte. HTML autocontenido; no se verifica HTTP de módulos, Three.js, FPS ni Cloudflare.

## Siguiente paso
Generar y aprobar primero Monte y Torre, luego el atlas restante. No promover a producción ni comenzar construcción final hasta aprobación visual y prueba en Three.js.

Producción: https://naruto2-5d.pages.dev/
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v122-konoha-asset-studio
Preview previsto: https://feature-v122-konoha-asset-studio.naruto2-5d.pages.dev/konoha-asset-studio.html
