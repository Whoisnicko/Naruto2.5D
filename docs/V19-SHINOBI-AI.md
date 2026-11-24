# v1.9 beta — Shinobi Combat Intelligence

Base v1.8b: única transformación de tres colas. 15 patrullas nuevas en cinco grupos (9 bosque, 6 frontera), más 9 enemigos originales de misión; máximo 24 enemigos base en mapa, hasta 6 clones temporales. Los enemigos de misión siguen vinculados a sus objetivos y no reaparecen en campaña. Patrullas independientes reaparecen 60 s de simulación después de caer, incluso si el jugador explora otra región, excepto pausa y encuentros especiales. En sandbox también reaparecen los enemigos originales y hay un botón manual con contador. Patrullas temporales no se guardan (v11 intacto), se reconstruyen al cargar. Entrar/salir de sandbox restaura las patrullas normales y sus tiempos.

Roles: taijutsu agresivo, caster de fuego, asesino con flanqueo y transparencia, defensor con guardia frontal, médico (+24 HP al aliado herido), invocador con clones temporales (16 s), élite con rayo y cuerpo a cuerpo. Coordinación limita a dos atacantes cuerpo a cuerpo cercanos en preparación; los proyectiles tienen aviso y colisión. Nuevos roles usan sprites existentes con tintes y FX; no son sprites originales individuales aún. Minimapa: todos los hostiles de la región, élite rosa, respawn gris, clones violeta. Los marcadores no dependen de la cercanía del jugador.

QA: suite smoke completa ejecutada con lectura/aserciones adaptadas a V8, PASS (lógica de respawn, misiones, sandbox, médicos, fuego, invocación, flanqueo y coordinación). Render, sonido, FPS y Cloudflare pendientes de verificación real. Dificultades seleccionables y afinidades elementales quedan fuera de esta fase.

Preview prevista: https://feature-v19-shinobi-ai.naruto2-5d.pages.dev/
