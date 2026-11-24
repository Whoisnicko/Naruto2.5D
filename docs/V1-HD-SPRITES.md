# v1.0 RC HD — Prueba de integración de arte ilustrado
Base: feature/v1-release-candidate. No se modifica main, no se cambia el guardado v6.
## Recurso
Imagen generada en conversación: naruto_inspired_shinobi_combo_spritesheet.png, RGBA 1774×887. Atlas optimizado real: 576×224, 4×2 celdas de 144×112, transparencia, 192 colores, 34.770 bytes PNG. Misma escala para los ocho cuadros, anclaje de suelo y filtro nearest. Incluido como data URI PNG en assets/chakra-slash-data.js para no depender de otro host. Efectos y siluetas están integrados en la imagen, no separados.
## Integración
Fūma (F), orientación horizontal: preparación 3 cuadros, impacto y recuperación 5 cuadros, sincronizados con los .25 s de windup y .55 s de duración existentes. La izquierda refleja la misma hoja. Norte/sur, caminar, combos J y demás técnicas siguen con sprites originales. El traje ilustrado reemplaza visualmente al actor solo durante F lateral, vuelve al equipo original después; estadísticas no cambian. No cambia daño, chakra, recarga, proyectil, colisiones ni progresión. Arte HD activado por defecto, alternable en Esc → Arte HD; preferencia local independiente. Si textura falla, sprite original. Sprite Lab muestra atlas real, reproducción, paso por cuadro, reflejo y exportación PNG.
## QA
Pruebas simuladas completas de RC aprobadas, más selección de cuadro, UV reflejada, Fūma sin cambios de daño, IDs de interfaz y verificación exacta de los bytes de imagen del repositorio. Pendiente playtest WebGL real, coherencia visual del tamaño, pies y equipamiento, legibilidad a zoom normal, FPS. Probar F hacia izquierda/derecha y vertical, volver a modo original, revisar Sprite Lab. 
## Siguiente etapa
Si la dirección se aprueba, producir hojas de locomoción en las cuatro direcciones, idle, daño, dash, cast y equipo por capas; separar FX de cuerpo. No prometer que la imagen lateral ya cubra todo el sistema.
