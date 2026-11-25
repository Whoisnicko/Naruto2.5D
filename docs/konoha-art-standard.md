# Konoha — Estándar visual 1.0 (Mundo 3B)

Base experimental: ac32092d64dd9fd56577ad885a5c5ec45035fadc. Producción permanece v1.20e.1. No se modifica el plano aprobado, colisiones, personajes, campaña ni motor principal.

## Dirección artística
- Anime clásico de Naruto, ilustración 2D pintada con contornos entintados discretos, techos de terracota, madera, piedra cálida, vegetación verde natural. Sin mezcla de pixel art ampliado, fotografía y render 3D realista en los edificios.
- Cámara ortográfica frontal elevada ~40°, misma orientación de fachada y cubiertas. Luz diurna desde arriba a la izquierda; sombras ambientales suaves, sin sombras proyectadas pintadas en el exterior del sprite.
- Paleta orientativa: terracota #B7653E, madera #805538, piedra #C5AD88, follaje #64834C, sombra #40534A. No es una paleta restrictiva; colores relativos y material consistente.
- PNG maestro con alfa y WebP de distribución. Sin rótulos del plano, marcos, bordes blancos ni fondos en sprites. Pavimento opaco repetible.

## Escala y resolución
El mapa conserva 144×84 unidades lógicas. Una unidad lógica no equivale a un píxel de pantalla. El ancho de los edificios se deriva de la huella del blockout (1.14 × ancho, como antes); anclaje inferior central y proporción original. El motor ignora márgenes transparentes al dibujar; no deforma ni aumenta resolución para validar. La caja visible usa alfa >32. Las alturas dependen de la proporción real de cada ilustración. La montaña es un fondo escénico, con menor densidad permitida.

Densidad mínima inicial: 32 píxeles de contenido por unidad de ancho mostrado para edificios, vegetación y pavimento; 16 para montaña. Objetivos: 64 y 24 respectivamente. Se mide contra el mayor ancho de uso previsto por categoría, además de los mínimos de dimensiones visibles heredados de Mundo 3B. Estos son objetivos iniciales, no mediciones de calidad artística. Los rangos alto/ancho son controles orientativos para prevenir imágenes incompatibles, definidos en assets/konoha-art-targets.json. La resolución de archivo puede variar; no se fuerza formato cuadrado.

| Categoría | Mínimo visible previo | Densidad objetivo |
|---|---|---|
| Monte Hokage | 2048×640 | 24 px/unidad |
| Torre Hokage | 1024×640 | 64 px/unidad |
| Academia, Hospital, Ichiraku | 512×256 | 64 px/unidad |
| Viviendas | 512×320 | 64 px/unidad |
| Árboles | 256×256 | 64 px/unidad |
| Pavimento | 256×256 | 64 px/unidad |

## Aprobación
1. Control automático: dimensiones visibles, densidad, proporción, alfa.
2. Revisión humana: arte nítido de origen, perspectiva, materiales, iluminación, silueta canónica y relación con personaje; no se puede inferir nitidez real ni origen de una imagen solo por sus dimensiones.
3. Prueba de plaza + Torre + Monte al zoom de juego y en plano general. Revisar que los personajes pasen delante/detrás correctamente, que puerta y huella se correspondan y no haya bordes flotantes.
4. Solo después: atlas restante y muestra Three.js. El pavimento continúa en galería únicamente.

## Entrega
Se actualiza Asset Studio con anclaje común, recorte visual de márgenes y validación de densidad/proporciones; los archivos importados permanecen locales. Los 11 recortes previos siguen provisionales. No hay ilustraciones nuevas (generación volvió a fallar). No se ha validado la campaña ni Three.js.

QA Chromium: 3 resoluciones; importación/exportación, restauración, rechazo de opaco/pequeño/corrupto, movimiento. Prueba adicional con dos lienzos de 1200×800 y 1600×1100, igual contenido visible 1161×761: mismas coordenadas y tamaño dibujados; proporción inválida bloquea exportación. Fixtures sintéticos, no arte.

GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v122-konoha-art-standard
Preview previsto: https://feature-v122-konoha-art-standard.naruto2-5d.pages.dev/konoha-asset-studio.html
Producción: https://naruto2-5d.pages.dev/
