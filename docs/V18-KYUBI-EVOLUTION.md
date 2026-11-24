# v1.8 beta — Kyūbi Evolution

Base v1.7 aprobada. Naruto únicamente. T activa una cola al alcanzar 100 de furia; mientras dura, infligir/recibir daño carga la siguiente forma. T con 100 evoluciona a dos y luego tres colas; no hay cuarta forma. Al expirar o morir, vuelve a normal. No se guarda el estado temporal (save v11). Sandbox permite elegir cada forma directamente.

| Forma | Duración | Físico | Técnicas | Velocidad | Daño recibido |
|---|---:|---:|---:|---:|---:|
| 1 | 15 s | 1.40 | 1.25 | 1.15 | 0.80 |
| 2 | 17 s | 1.65 | 1.45 | 1.23 | 0.72 |
| 3 | 14 s | 1.95 | 1.65 | 1.30 | 0.65 |

Dos colas: remate hasta dos objetivos. Tres colas: segundo golpe hasta dos, remate hasta tres; secundarios 70% de daño. Furia: cada 2.8 s, si libre y con enemigo hostil visible a menos de 5.8 unidades, intenta J automáticamente. No selecciona NPC ni atraviesa obstáculos. FX: atlas procedural de colas extra, aura escalada, pulso de suelo, viñeta roja, sonidos sintéticos y sacudida; sin shader de refracción real. Mantiene Rasengan púrpura de v1.7.

Pruebas: `node tests/smoke.mjs`; suite ejecutada con V8 y adaptador de lectura/aserciones, PASS, renderer/audio/UI simulados. Comprobar visualmente transformación por T, tres botones de sandbox, colas en cuatro direcciones, combos, daño, furia junto a enemigos y ausencia de furia junto a NPC, expiración, retorno de sandbox y FPS. Preview prevista: https://feature-v18-kyubi-evolution.naruto2-5d.pages.dev/ (confirmar despliegue en Cloudflare).
