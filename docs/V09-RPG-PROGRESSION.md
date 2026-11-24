# v0.9 beta — RPG Progression

## Base y despliegue
v0.8 validada por el jugador y fusionada a main mediante PR 6, commit b7f7743c52b9f9d8e4764db3e9aec11341608c4f. Cloudflare Pages check del commit: success; verificación HTTP del dominio principal no disponible. Producción: https://naruto2-5d.pages.dev/. v0.9 parte de main en rama independiente feature/v09-rpg-progression.

## Inventario y equipo
I: inventario, pausa temporal de combate y reanudación al cerrar. 24 espacios; stacks según catálogo, arrastrar/soltar, ordenar, descartar con confirmación, usar, comparar y equipar. Siete slots (cabeza, torso, piernas, pies, arma, secundaria, accesorio). Rarezas común/poco común/raro/épico. 13 objetos con iconos pixel originales, descripción, valor, stats y tipo. Reserva de botín cuando no hay espacio; recoger al liberar plazas. 1–3: acceso rápido a consumibles; asignación desde inventario. Recuperación no consume objeto si el recurso está lleno.
Equipo visible: composición de capas pixel en el sheet de Naruto, regenerada solamente al cambiar equipo. 24×32, cuatro direcciones, 22 cuadros por dirección. Previsualización real en inventario. No añade geometría pesada. El arma suma daño a golpes y proyectiles, defensa reduce daño recibido con mínimo 1, velocidad aumenta desplazamiento normal, crítico aumenta probabilidad, regeneración de chakra aumenta recurso por segundo. Equipo no cambia el máximo de vida o chakra del jugador.

## Progresión
100 EXP por nivel; 1 punto por nivel desde nivel 2. Genin niveles 1–4, Chūnin 5–9, Jōnin 10+. P: árbol de habilidades. Tres ramas de dos nodos: Taijutsu (Puños de acero, Reflejos ninja), Ninjutsu (Control de chakra, Rasengan gigante), Clones (Vínculo de sombra, Sombras resistentes). Segundo nodo requiere primero, nivel 3; Rasengan gigante también consume un pergamino de chakra. G desbloqueado al aprenderlo: 84 daño base, 32 chakra, 6 s cooldown, windup .42 s, rompe guardia, sinergia de clon, FX propio 32×32 de ocho cuadros. Los jutsus anteriores no se bloquean.

## Botín y entrenamiento
Botín fijo por ID de enemigo en primera misión, más EXP/ryō originales. Recompensa de Kakashi: pergamino y ramen, además de recompensa existente. Después de completar misión, regresar a Kakashi y pulsar Entrenar desde el panel. Reinicia cinco enemigos, recupera vida/chakra y mantiene la misión completada. Repetible; cada enemigo da EXP, ryō y consumibles/materiales; primer entrenamiento completo da chaleco épico. No repite recompensa de misión. Economía/comerciantes, cofres, diálogos de árbol y nuevas zonas quedan para v0.10.

## Guardado
Esquema versión 3, mismo almacenamiento local. Lee versión 2 y formato antiguo. Migra inventario inicial y botín correspondiente a enemigos ya vencidos; no duplica recompensas en importación de v3. Guarda inventario, equipo, hotbar, habilidades, reserva y ronda. Al escribir v3, intenta preservar una copia previa v2 bajo shinobi25d-v1-backup-v2. Un archivo v3 no debe importarse en v0.8; exportar copia v2 antes de probar. Los preview de otro origen requieren exportar/importar JSON.

## Código
src/rpg-data.js: catálogo, balance, reglas puras y validación. src/rpg-ui.js: interfaz. src/game.js: integración, loot y entrenamiento. src/save.js: migración. src/pixel-art.js/pixel-renderer.js: capas de equipo y nuevo FX. assets/sprite-lab.html: Rasengan gigante. Mantiene combate y mapa. 

## Pruebas
Prueba simulada completa de regresión v0.8 y RPG: inventario, apilado, movimiento, equipo/intercambio, comparación de stats, consumo, reserva, prerrequisitos y pergamino, entrenamiento y recompensa, migración v2 y persistencia v3. Prueba adicional con DOM y Canvas simulados verificó 24 slots, 7 de equipo, 3 hotbar, tres ramas, pausa/reanudación, diferencia de píxeles de equipo en hoja de Naruto y ocho cuadros de FX gigante no vacíos. Sintaxis Sprite Lab aprobada. Pendiente navegador real, WebGL/FPS, drag/drop real y balance.
