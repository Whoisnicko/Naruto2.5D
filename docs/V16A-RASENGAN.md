# v1.6a — Rasengan de referencia
Base v1.5 aprobada, fusionada a main en ca5feaad035b7e0527adef65a9c00fa837322e70. Respaldo previo v1.3: backup/production-v13-before-v15. Esta rama es experimental y no se fusiona antes de validar arte.
## Arte implementado
- Naruto original 24×32 y equipo por capas. Seis poses específicas en cuatro direcciones (24 celdas nuevas): reunir chakra, concentrar, preparar, extender, seguir el golpe, recuperar. Los otros personajes conservan animaciones anteriores. Atlas de actores tiene 44 columnas; celdas adicionales de otros actores son reservas no utilizadas.
- Atlas de FX independiente 576×144, 36 fotogramas de 48×48: 12 esfera en formación con cintas curvas de chakra y núcleo brillante, 12 impacto orientado con destello, corrientes fragmentadas y estelas, 12 onda baja de disipación. Dibujado mediante rutas de píxeles explícitas y variación temporal, no ilustración HD ni arte manual externo.
- Renderizador usa el atlas desde el juego durante preparación e impacto. La esfera sigue una posición aproximada de mano por dirección y pose. Orientación al objetivo en preparación, sin alterar selección de objetivo final ni desplazamiento/alcance. Pool de hasta 4 sprites adicionales; calidad baja omite onda secundaria. Si falla el atlas usa efecto anterior. Sprite Lab permite inspeccionar y exportar el mismo atlas y simular secuencia, no es captura del juego.
## Mecánicas
Rasengan normal (Espacio), solo Naruto. Daño 60, chakra 20, alcance 3.5, recarga 1.6s, preparación .26s y animación corporal .65s sin cambios. Impacto FX .65s. No se cambian las otras técnicas, árbol, mundo, guardado v11 ni sonidos. 
## QA
Regresión completa simulada, seis poses por dirección, evento de impacto, constantes de combate, IDs DOM, sintaxis Sprite Lab. Raster simulado: 36 celdas FX distintas y no vacías, 24 poses distintas, equipo visible. Three.js simulado: selección del atlas en preparación e impacto, calidad baja, limpieza y fallback. Pendiente valoración visual y FPS en navegador real. No se afirma calidad artística aprobada ni resultado medido.
## Siguiente
Validar solo Rasengan a escala real con las cuatro orientaciones, con/sin equipamiento, contra enemigos y al aire. Si no convence, iterar el estándar antes de v1.6b biblioteca de FX y v1.6c otros personajes; v1.6d jefes y v1.6e audio/pulido.
