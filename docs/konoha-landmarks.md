# Mundo 3B — Konoha Landmarks

Base: d957f142cdd4f8c07990e605bbbe89c3dc0ece32. Se integran las dos ilustraciones aprobadas del Monte y Torre. Producción no se modifica. Los otros nueve recursos siguen provisionales. Monte: interpretación estilizada de cuatro rostros, no una reproducción canónica exacta. Se preservan las dimensiones nativas, se elimina alfa residual inferior a 16 y se codifica WebP a calidad 91. No se reescala. Se retira la corona provisional de la Torre y la geometría plana detrás del Monte cuando el asset está disponible; los fallbacks se conservan. El máximo de relación alto/ancho de Torre se ajusta de 0.80 a 0.84 para acomodar el arte aprobado. Ambos cumplen mínimos técnicos; quedan por debajo de la densidad objetivo de 24 y 64 px/unidad respectivamente. No se presenta como aumento de resolución artificial.

QA: tres resoluciones Chromium en HTML autocontenido, once recursos cargados, métricas mínimas de ambas ilustraciones, movimiento, sin overflow horizontal ni errores JS. Fallback de ambos recursos ausentes comprobado. No Three.js ni campaña, ni FPS de dispositivo, ni Cloudflare verificados. Siguiente: atlas coherente de viviendas, Academia, Hospital e Ichiraku; luego suelo, vegetación y murallas. No iniciar Mundo 3C todavía.

GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v122-konoha-landmarks
Preview previsto: https://feature-v122-konoha-landmarks.naruto2-5d.pages.dev/konoha-asset-studio.html
Producción: https://naruto2-5d.pages.dev/
