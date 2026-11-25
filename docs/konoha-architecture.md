# Mundo 3B — Konoha Architecture

Base: 628b90a2d1e2bea61a89de68340d9ffd1fd166f1. Atlas aprobado visualmente por el usuario. Se conservan ambos PNG maestros de 1448×1086; el primer atlas es el elegido para integración. Se extraen nueve componentes con alfa, sin reescalado, y se codifican en WebP. Se conservan Monte y Torre. Las seis variantes residenciales se asignan determinísticamente a las huellas existentes, también se reutilizan en los comercios hasta tener arte específico. No se altera layout, colisiones ni producción.

Los nueve recortes tienen entre 363 y 470 px de ancho visible, por debajo del mínimo de 512 px. Academia, Hospital y casa con terraza también quedan por debajo de la densidad mínima de 32 px/unidad. Todos pasan proporción y transparencia. Se conservan como arte aprobado para composición, no como resolución definitiva. No se amplían para forzar aprobación técnica. Vegetación, pavimento, puentes y murallas siguen provisionales.

QA: HTML autocontenido Chromium, 3 resoluciones, 14/14 recursos cargados, movimiento, métricas de los nueve recursos correctamente marcadas, sin desbordamiento horizontal ni errores JS. Fallo de los nueve archivos simulado: fallback correcto. No se ha comprobado Three.js, campaña, FPS en dispositivo ni despliegue Cloudflare.

Siguiente lote: suelo y vegetación, y recursos de puerta, murallas, puentes y mercado. Generar edificios individualmente o en lotes menores para alcanzar la resolución objetivo antes de la aprobación técnica final.

GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v122-konoha-architecture
Preview previsto: https://feature-v122-konoha-architecture.naruto2-5d.pages.dev/konoha-asset-studio.html
Producción: https://naruto2-5d.pages.dev/
