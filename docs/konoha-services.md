# Mundo 3C.3 — Misiones y comercios
Base 75a48d3e8451273ad8eb9922c97027cf56152e38. Preview solamente. Reutiliza world-data.js y rpg-data.js sin cambiarlos; nueva sesión en memoria (100 ryō, 60 HP, 50 chakra, 0 EXP, mochila original), no lee ni escribe saves.
- Shikamaru, Iruka y Sakura: tres misiones secundarias originales, recompensas y condiciones originales. Se trasladan los puntos del mapa. Jardín Nara provisional en barrio oeste, bosque representado por su salida (no hay viaje externo aún). Las visitas previas cuentan como en la campaña original. Kakashi conserva saludo; misiones principales requieren integración de campaña.
- Tenten compra/vende, Teuchi vende ramen/píldoras, Sakura cura por 15 ryō. Precios, inventario, consumibles y recompensas originales. Diario/mochila J o botón; objetos comprados no se equipan en este laboratorio.
- Provisiones de práctica: tres telas una sola vez al acercarse al campo de entrenamiento y pulsar E. Reemplazo temporal para el drop de enemigos (combate no conectado). No cambia economía de producción.
- Selector conserva NPC oculto para héroe homónimo: cambiar de héroe para conversar. Cámara, sprint, fast travel y mapa sin cambios; viajes locales registran destino.
- 24 comprobaciones de reglas y posiciones pasaron en motor JS usando funciones originales. Sintaxis de archivos modificados verificada; navegador, GPU, móvil, regresión visual y despliegue pendientes. Script standalone actualizado; HTML autónomo no regenerado.
Preview prevista: https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
PR #34: https://github.com/Whoisnicko/Naruto2.5D/pull/34
Producción: https://naruto2-5d.pages.dev/

QA adicional: ocho interacciones ejecutadas con DOM y Three.js simulados (no navegador real): abrir Shikamaru, aceptar, cerrar, reclamar, comprar ramen, recoger provisiones, completar/curar con Sakura y abrir diario. Se verificó sintaxis del conjunto de módulos JS de standalone, sin empaquetar Three.js ni imágenes. HUD optimizado: no reconstruye inventario cada frame.
