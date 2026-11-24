# v1.2 beta — World Expansion
Base v1.1 aprobada: commit 7bb323e821504de5eaf26390fb0e540c26de2fcc. Mantiene pixel art 24×32, FX 32×32, equipamiento visible y perspectiva original. Main y RC original intactos.
## Región Frontera del viento
Área conectada de 60×40 unidades al este del mapa original (100×100). Entrar caminando hacia el este por el camino central del bosque, paso x49–50, z≈-2. Sin pantalla de carga. Sendero de la frontera, santuario abandonado y ruinas del viento (mazmorra al aire libre). Puerta en x90 bloqueada hasta vencer a tres enemigos del sendero. Guardián final al otro lado. Dos cofres persistentes, el segundo requiere derrotar al guardián. Minimap cambia escala al cruzar, muestra salida y enemigos cercanos. Colisión en límites, puerta y pilares. Nuevos chunks estáticos y árboles pixel existentes; no se añade iluminación dinámica ni texturas HD.
## Enemigos y premios
Bandido (85 HP, 40 EXP, 20 ryō), explorador lanzador (85 HP, 45 EXP, 25 ryō), vigía (100 HP, 55 EXP, 30 ryō), guardián (120 HP, 90 EXP, 55 ryō). Reutilizan roles de combate y sprites originales. Botín individual y cofre de suministros. Relicario: Talismán del viento épico (+3 chakra/s y +6% velocidad), 3 píldoras y 90 ryō. Bajas y cofres únicos; sobrevivientes recuperan HP al cargar.
## Guardado
v8 lee v2–v7 y antiguo. Conserva campaña, inventario y equipo. Agrega registro de enemigos regionales y coordenadas extendidas. Copia v7 al actualizar. Sandbox sigue aislado. Exportar v7 antes de probar otro dominio; v8 no compatible con builds anteriores. 
## QA
Regresión simulada completa: movimiento real entre zonas, ataque J a enemigo regional, gate, recompensas, persistencia, migración y aislamiento de misión original. GPU/audio/UI real pendiente. No fusionar antes de playtest.
## Próxima fase
v1.3 personajes jugables con habilidades propias. v1.4 exámenes Chūnin; v1.5 validación final.
