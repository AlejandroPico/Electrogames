# Colaboración en ElectroGames

- Mantener toda la implementación específica de cada juego en `ElectroGames/<id>/` desde la raíz: motor, vista, ilustraciones y recursos. No importar reglas entre juegos.
- TypeScript estricto, carga diferida, publicación estática con base `/Electrogames/` y navegación por fragmentos.
- Respetar la familia visual de Games: barra fija, arte propio reconocible en fichas cuadradas, controles compactos y temas de iluminación.
- Ofrecer teclado, controles táctiles, instrucciones, pausa y reinicio cuando corresponda. Los arcades se detienen al perder el foco.
- No marcar como jugable un juego pendiente. Las ideas viven en `docs/ROADMAP.md`.
- Ejecutar `npm test` y `npm run build` antes de subir cambios. Conservar `package-lock.json`; Actions utiliza `npm ci`.
- Documentar reglas, límites y arquitectura en README.md. No añadir secretos ni simular servicios persistentes en el cliente.
- No añadir emuladores ni ROM: pertenecen al futuro Videogames.
