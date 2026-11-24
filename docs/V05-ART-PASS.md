# v0.5 beta — Konoha Art Pass
Base: v0.4 validada por el jugador (~90 FPS, sombras correctas, guardado funcional).
## Cambios
- Árbol CommonTree 1 y arbusto Bush_Common de Quaternius (CC0) incluidos localmente como GLB codificados en base64. Carga asíncrona, instanciación por sectores de 20 unidades; conservar árboles procedurales hasta confirmar la carga. Colisiones originales sin cambios. El HUD informa GLB o respaldo.
- Atlas procedural de 256×256 para madera, yeso, hierba, piedra/tejados. Materiales compartidos y proyección según orientación de cara.
- Río con shader animado, detalles decorativos de fachadas, paneles japoneses y macetas. No cambia la topología del mundo.
- Partículas aditivas de Rasengan y aparición de clones, límite de 280 partículas, densidad por calidad, sin bloom de pantalla completa.
- Rostros redondeados, pelo y vestimenta refinados proceduralmente. Transiciones suaves de poses, giro suavizado, respiración en reposo, carrera ninja diferenciada. Se mantiene el rig.
- Guardado v0.4 sin cambios de esquema. Los previews de ramas son orígenes diferentes: exportar e importar JSON.
## Pruebas
Sintaxis y prueba de lógica con adaptador gráfico simulado; validación de cabeceras GLB y texturas embebidas. No se verificó la ejecución real de shaders, GLTFLoader, calidad visual ni FPS. Ejecutar node tests/smoke.mjs.
## Pendiente
Modelos profesionales de Naruto/Kakashi con licencia compatible; texturas externas profesionales; animaciones de autor importadas. Las mejoras de personaje actuales son procedurales. Objetivo 60 FPS. Validar preview antes de fusionar.
## Checklist
- Revisar que HUD indique Árboles GLB y Arbustos GLB, sin árboles duplicados.
- Revisar Konoha, río y bosque, cámara, carrera y Rasengan/clones.
- Comparar FPS alto/medio/bajo, misión, guardado/exportación/importación.
