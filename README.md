# Naruto — Senda del Shinobi | 2.5D v0.3
Prototipo fan-made independiente del juego 2D original. No es una migración completa ni una reproducción del arte conceptual.

## Decisiones
- WebGL nativo, sin dependencias externas; Three.js no estaba disponible para incluir y verificar offline.
- Cámara ortográfica elevada, mundo 3D estilizado de polígonos y colores planos, iluminación precalculada por cara; no hay modelos anime de alta resolución ni cel shading con contornos todavía.
- Geometría estática precalculada y agrupada en sectores de 20 unidades; descarte de sectores lejanos, colisión espacial por celdas de 5 unidades, IA suspendida fuera de 22 unidades, HUD a 5 Hz, resolución limitada y tres calidades manuales.
- Konoha, puente, río, bosque, campo de entrenamiento, Kakashi, cinco enemigos, cuatro técnicas, misión y guardado independiente. No se ha portado todo el contenido anterior. Efectos y personajes dinámicos aún generan geometría cada fotograma; optimizar con buffers reutilizables en fase posterior. Sin audio, sombras dinámicas, mapa o ciclo día/noche.

## Controles
WASD/flechas; Shift correr; E hablar; J taijutsu; K shuriken; L clones; Espacio Rasengan. Guardar y calidad en HUD. Controles táctiles básicos.

## Pruebas
Sintaxis JS comprobada. Prueba automatizada de lógica con WebGL simulado: aceptar misión, Rasengan, bajas y recompensa. WebGL real bloqueado en entorno de prueba; no se verificó imagen, FPS ni guardado real. Objetivo 60 FPS, no garantizado. Requiere navegador con WebGL y aceleración gráfica.

## v0.3 — Dirección artística
- Modelos procedurales articulados con rostro, pelo, vestimenta y accesorios; orientación según movimiento y ataques.
- Sombreado por bandas, materiales con detalle procedural, tejados, Ichiraku, faroles, flores y árboles de copa irregular.
- Sombras de contacto aproximadas, hojas y reflejos de agua animados, efectos de técnicas con densidad según calidad.
- Buffer dinámico reutilizable, sectores y suspensión de enemigos conservados. Sin dependencias externas ni cambios al formato del guardado.
- No incluye modelos profesionales importados, texturas fotográficas, sombras dinámicas reales ni animaciones capturadas. Prueba visual y FPS en GPU real pendientes.

## Estado actual
v0.3 aprobada por el jugador en perspectiva y rendimiento; guardado pendiente de corregir. Próxima fase: modelos 3D con licencias compatibles, animaciones, iluminación y exportación/importación de partidas. Proyecto fan-made no oficial, no comercial; no implica autorización de los titulares de Naruto.

## Jugar
https://naruto2-5d.pages.dev/ (URL de producción informada por el propietario; prueba de acceso externa pendiente).

## v0.4 beta — Three.js
Ver [migración, arquitectura y pruebas](docs/V04-MIGRATION.md). Rama de evaluación: Three.js, esqueletos procedurales, luces/sombras, GLB opcional y guardado portable. No incluye modelos externos profesionales aún. Validación WebGL real y FPS pendientes. La versión anterior está en `legacy-v03.html`.
