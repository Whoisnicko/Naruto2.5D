# v1.7 beta — Kyūbi Awakening
Base producción v1.6b (ccd6514, PR 20). Usuario aprobó revisión artística 02 y solicitó integración y sandbox.
## Mecánica
Naruto únicamente. Medidor 0–100, +0.55 por daño efectivo infligido por jugador/proyectil, +1.8 por daño recibido; no acumula mientras está activo. T o botón Kyūbi al llenar, 15 s de simulación, +40% daño físico, +25% técnicas, +15% movimiento y 20% reducción de daño. No permite activar durante otra acción. No es un cambio permanente de personaje. Al morir, cambiar personaje o iniciar/finalizar examen, se reinicia; los guardados v11 no incluyen estado temporal. Las técnicas iniciadas durante modo conservan su variante hasta terminar.
J usa alcance 4.5/4.8/5.2 por combo, cono estrecho con ancho lateral 0.8, un objetivo, trazado contra colisiones cada 0.1/0.12 unidades. No atraviesa obstáculos. Puño 35 base, remate 53. Rasengan 75, Mega 105, carga/embestida de v1.6b conservadas. Clones, proyectiles, dash y sustitución con acentos rojos. Los bonos de equipo siguen vigentes.
## Arte
Capas aprobadas revisión 02: recortes PNG embebidos del aura animada 512×256, brazo 512×24 y esfera púrpura de remolinos blancos 576×48. El aura lateral se adapta a cuatro filas (izquierda espejo, frente/espalda adaptación); cuerpo original 24×32 con ojos rojos y equipo conservado. Brazo escalado/orientado según alcance y dirección; esfera usa atlas aprobado durante carga/carry, impacto/ondas y estelas usan la variante púrpura del atlas procedimental. Capas con fallback de canvas y pool limitado. No son nuevas poses corporales completas en cuatro direcciones.
## Sandbox
Botón Kyūbi · 15 s activa o renueva si Naruto está seleccionado. Durante modo sandbox G disponible sin aprender habilidad, exclusivamente para probar; en campaña sigue requiriendo árbol. No se guarda ni se altera el estado normal previo. 
## QA
Regresión simulada completa aprobada, +35 daño a cuatro unidades, golpe único, medidor, reducción de daño, ambas técnicas moradas, tiempo/derrota, aislamiento sandbox, v11 e IDs DOM. Falta validar calidad visual, balance y FPS en navegador. No fusionar hasta aprobación.
