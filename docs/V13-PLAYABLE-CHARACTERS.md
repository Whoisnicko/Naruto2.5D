# v1.3 beta — Equipo 7
Base v1.2 validada para continuar, commit d48c07b71e1fbcd20ef5b8c13294731330125081. Estética original 24×32 personajes, 32×32 FX, sin HD. Main intacta.
## Selección
C o botón Personajes. Naruto inicial; Sasuke, Sakura y Kakashi se habilitan al completar misión de Kakashi (quest=3); sandbox permite probarlos desde el inicio. En campaña cambiar a menos de 4 unidades de Kakashi, fuera de combate; sandbox permite cambiar en lugar seguro. No cambiar durante animación, ataque, dash, clones/proyectiles activos, jefe o enemigo cercano. Cooldowns, HP, chakra, XP, dinero, inventario, equipo, árbol y mundo compartidos. Buffs temporales se limpian al cambiar. Narrativa sigue siendo Naruto; no son campañas individuales.
## Técnicas
Espacio/F/L/G:
Naruto: Rasengan, Fūma, Clones, Rasengan gigante (original).
Sasuke: Chidori (68 base, 25 chakra, objetivo único con avance), Katon (proyectil perforante, 45 base), Sharingan (+22 puntos porcentuales crítico durante 5 s), Chidori Nagashi (94 base área). Pasivos +8% velocidad, +6 puntos de crítico, +8% daño combo antes de redondear.
Sakura: puño de chakra (56 base área), onda sísmica (40 base área), curación (+35 HP, 30 chakra, 9 s recarga), impacto devastador (90 base área). Pasivos +2 defensa, -3% velocidad, +15% daño combo.
Kakashi: Raikiri (65 base, avance hasta dos objetivos), dragón de agua (40 base proyectil perforante), muro de tierra (reduce 8 daño durante 4 s), Raikiri múltiple (88 base área). Pasivos +2 chakra/s, +1 defensa, +2 puntos de crítico, +2% velocidad.
G requiere nodo compartido giant. Árbol existente compartido, conserva nombres históricos. J/K/Q/R permanecen. HUD actualiza nombres y duración de buffs. 
## Arte y código
src/character-data.js centraliza perfil y técnicas. Sasuke 88 cuadros, Sakura/Kakashi usan hojas existentes; todos aplican equipo visible también en inventario. Cinco filas de FX 32×32 (relámpago, fuego, curación, tierra, Sharingan), 40 cuadros, Sprite Lab actualizado. Las poses de ataque reutilizan animaciones originales; no se prometen animaciones únicas completas. Smear de Naruto no se usa en otros personajes.
## Guardado y pruebas
v9 carga v2–v8 y antiguo; personaje predeterminado Naruto. Respaldo local v8. Sandbox aislado. Regresión simulada completa, desbloqueo, cambios y cooldowns, curación, Sharingan, regeneración, defensa, ataque de área y avance, guardado/restauración. Raster simulado verifica equipo visible en 4 personajes y 40 cuadros FX no vacíos. GPU real, audio, balance y FPS pendientes. No fusionar antes de validar.
Siguiente: v1.4 exámenes Chūnin.
