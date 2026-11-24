# v1.1 beta — Konoha expansion (pixel art original)
El jugador rechazó el experimento HD y solicitó volver a la RC original. Rama creada directamente desde 45b0d1e45d6aa7cacacbc8ad174cfbb775854766; no se fusionó HD/HD2. RC original y main intactos.
## Cambios
- Naruto conserva sprites 24×32, equipo visible por capas, FX 32×32 y perspectiva 2.5D. 
- Jardín Nara, mercado y mirador Hokage: pavimentos, flores, toldos y relieve estilizado de cuatro rostros al norte. Geometría estática agrupada en chunks existentes; no se añaden luces dinámicas ni obstáculos sólidos. El mapa físico conserva 100×100 y las ubicaciones anteriores.
- Shikamaru, NPC con 88 fotogramas procedurales en la estética original, diálogo y misión de visitar los tres lugares. Recompensa única: 85 EXP, 65 ryō, dos píldoras y amuleto.
- Cofre de la reserva de la aldea: dos ramen, dos vendajes y 20 ryō; apertura persistente.
- Minimap y diario actualizados: 8 lugares, 5 cofres, 3 misiones secundarias. Sprite Lab incluye Shikamaru.
## Guardado y QA
Formato v7 importa v2–v6 y antiguo; agrega misión village sin borrar estado anterior. Respaldo local v6 al actualizar. Exportar JSON v6 antes de probar en otro origen. Las pruebas simuladas de regresión y migración, ubicaciones transitables, recompensa única y cofre nuevo pasaron. Pendiente apariencia, navegación real, audio y FPS. No incluye interiores ni nuevos mapas aún.
## Roadmap
v1.2 regiones conectadas, v1.3 personajes jugables (Sasuke, Sakura, Kakashi), v1.4 exámenes Chūnin, v1.5 validación integral y pulido. Una fase por aprobación. Estética original con mejoras incrementales.
