# Mundo 3C — Konoha Three Lab

Base experimental: 17c4fb16517e5673030b1b89820fcfd22ac5b66a. Producción v1.20e.1 intacta. Escenario independiente de la campaña, utiliza los datos y colisiones aprobados del blockout (144×84, 12 sectores, 23 huellas, tres puentes). Se seleccionaron 39 de los 92 WebP aprobados; se mantienen bytes nativos. El sprite original Naruto se genera con pixel-art.js (no se usa el rediseño rechazado).

## Implementación
- Three.js r169, versión idéntica a la del juego. Cámara ortográfica elevada atan2(25,30), suelo y caminos con geometría y materiales texturados; planos orientados a cámara para arte 2D. Orden por anclaje al suelo. 123 planos decorativos, más el jugador. Sombras elípticas. Escala de exploración provisional, cámara panorámica, zoom, accesos directos a puente y entrada, teclado y pad táctil.
- Texturas originales repetidas en espejo para evitar salto de color en bordes; no garantiza ausencia de costuras visuales ni patrón repetitivo. Medallón circular no repetible. Murallas laterales de respaldo volumétricas. Puentes son arte más superficie transitable, falta separar barandas y oclusión. Vegetación y mobiliario no añaden colisiones (se preserva plano). Fondo y bordes de ciudad provisionales.
- Fallback de cada asset (color/forma) y del backend: Canvas usa geometrías y cámara de Three.js, no render WebGL. WebGL es la ruta principal, pero el entorno Chromium no pudo inicializarlo. Capturas reales son del fallback Canvas, no de WebGL. No se verifica rendimiento GPU, pantalla táctil física, carga HTTP de módulos ni campaña.

## QA
Tres resoluciones (1366×768, 390×844 y 1024×768). HTML inyectado con mismo código y librería real, sin red. 39/39 recursos cargados; prueba de dos imágenes dañadas (torre y césped) con 37/39 y fallback; movimiento con teclado, cruce real del puente, comprobación de río y edificio bloqueados, entrada, zoom. Sin excepciones de JavaScript de página; mensajes de WebGL por falta de contexto, manejados. Sintaxis JS verificada. Pruebas no equivalen a validación de WebGL.

## Enlaces
- GitHub experimental: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v122-konoha-three-lab
- Preview previsto (no verificado): https://feature-v122-konoha-three-lab.naruto2-5d.pages.dev/konoha-three-lab.html
- Producción: https://naruto2-5d.pages.dev/
- Biblioteca original: https://drive.google.com/file/d/1O2_tGy0ogWvR7OpHM6e0LMmawRP14a9U/view

## Siguiente aprobación
Probar WebGL en equipo real y comprobar que el estado muestre WebGL, verificar escala, profundidad y FPS. Después pulir terreno, skyline, oclusión de puentes y colisiones de props. No migrar campaña ni aprobar 3C hasta validar motor.
