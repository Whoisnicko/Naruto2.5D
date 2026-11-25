# Mundo 3 — Konoha Art Lab (muestra preliminar)

Fecha: 25/11/2026. Base del blockout aprobado: ac55601aa3b50896d2fcae7bdc659a68136d8ef0. Producción v1.20e.1 permanece en 5197ff0fc03f61a9af51bbcd0cd90d7ac4cce7d0.

## Alcance
La generación de un atlas nuevo falló. Se extrajeron 11 piezas WebP del plano maestro generado y aprobado anteriormente: Monte Hokage, Torre, Academia, Hospital, Ichiraku, tres casas, cerezo, árbol y muestra de pavimento. El manifiesto documenta resolución, anclaje, origen y descripción. Son recursos provisionales: los rótulos ocultan partes de la arquitectura, la montaña tiene bordes incompletos y las viviendas son pequeñas. No son assets oficiales. El pavimento se conserva como referencia; en la muestra se dibuja procedimentalmente. Los otros elementos tienen fallback geométrico. La imagen fuente original no se modifica.

## Muestra navegable
`konoha-art-lab.html` y `src/konoha-art-lab.js` montan sprites sobre el layout aprobado, con profundidad por coordenada Y. Cámara ortográfica Canvas 2D con inclinación equivalente a atan(25/30) del renderer del juego en yaw=0, lookY=0; no integra Three.js. Vista de plaza, plano general, exploración, comparación con el arte apagado, etiquetas. Colisiones y movimiento del blockout sin cambios. El personaje es una marca provisional, no un sprite nuevo. Edificios sin interiores y sin lógica de NPC.

## QA
Chromium: 1366×768, 1920×1080, 1280×720, 390×844; 11/11 recursos cargados, movimiento, reinicio, sin overflow horizontal ni errores de página; simulación de 11 recursos rotos conserva render geométrico. Pruebas del HTML auto contenido, no campaña, FPS, dispositivo táctil real ni despliegue. No se verifica todavía carga de módulos HTTP. El mapa de Mundo 2 no fue modificado.

## Criterio para terminar Mundo 3
No promover esta muestra como arte final. Crear ilustraciones independientes a alta resolución con perspectiva homogénea, sin rótulos ni fondo, para Torre completa, montaña con borde natural, Academia, Hospital, Ichiraku, viviendas y árboles. Probar piezas en Three.js antes de construir toda Konoha. Añadir puerta, murallas, puentes, pavimentos, faroles, mercado y vegetación modular. Aprobar visualmente una sección de plaza antes de Mundo 4. No migrar guardados ni NPC hasta fase Mundo 5.

Producción: https://naruto2-5d.pages.dev/
Repo: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v122-konoha-art-lab
Preview previsto: https://feature-v122-konoha-art-lab.naruto2-5d.pages.dev/konoha-art-lab.html
