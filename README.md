# ElectroGames

Los clásicos electrónicos, listos para otra partida. Segunda parte de una trilogía: **Games** (mesa, cartas y lógica), **ElectroGames** (arcade y primeros juegos electrónicos) y **Videogames** (futuro proyecto de emulación, todavía no creado).

**Web:** https://alejandropico.github.io/Electrogames/

## Primera edición

- **Snake:** tablero de 24 × 24, crecimiento y velocidad progresiva, colisiones, teclado y cruceta táctil. Diez puntos por fruto; llenar el tablero da la victoria.
- **Pong:** una persona contra CPU, rebotes según el punto de contacto y velocidad creciente. Gana quien alcance siete puntos. Teclado, ratón, arrastre y botones táctiles.
- **Breakout:** 50 bloques, puntuación por fila, tres vidas y victoria al vaciar el campo. Teclado, ratón, arrastre y controles táctiles.
- **Buscaminas:** iniciación (9 × 9, 10 minas), intermedio (12 × 12, 24 minas) y experto (16 × 16, 40 minas). Primera casilla y sus vecinas seguras, apertura de áreas, banderas y mejor tiempo por dificultad.

Catálogo con cuatro ilustraciones SVG propias, búsqueda, categorías y temas día, tarde, noche y automático según la hora local. Mantiene la familia visual de [Games](https://alejandropico.github.io/Games/): barra fija, fichas cuadradas, tonos suaves y controles compactos.

Los arcades incluyen pausa, reinicio, instrucciones y récord local; se pausan al perder el foco, cambiar de pestaña o abrir información. Los récords se guardan en `localStorage`, con claves versionadas. Si se bloquea el almacenamiento se puede seguir jugando. Buscaminas detiene su contador al ocultar la pestaña o abrir su ayuda. No se conservan partidas al recargar.

## Desarrollo

React 19, TypeScript estricto, Vite y Canvas 2D. Node.js 24 y npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Ruta de desarrollo y publicación: `/Electrogames/`. Los juegos se cargan de forma diferida. No necesita backend ni claves.

## Estructura

```text
ElectroGames/                  # Paquetes en la raíz
  snake/                      # Game.tsx + engine.ts + Art.tsx
  pong/
  breakout/
  minesweeper/
src/
  App.tsx                     # Catálogo, temas y navegación
  catalog.ts                  # Registro e importaciones diferidas
  shared/                     # Presentación, animación y almacenamiento
tests/engines.test.ts          # Reglas y finales de los cuatro juegos
.github/workflows/pages.yml   # Pruebas, compilación y despliegue
```

Cada carpeta de `ElectroGames/` contiene toda la implementación específica de su juego. Los motores no importan reglas de otros juegos; comparten únicamente contratos y presentación. Para añadir otro: crear su carpeta con motor, vista e ilustración, registrarlo en `src/catalog.ts`, documentar controles y comprobar sus reglas. El catálogo solo anuncia juegos jugables.

## Publicación

Pages debe utilizar **GitHub Actions**. Los cambios en `main` ejecutan `npm ci`, pruebas, comprobación TypeScript y compilación, y publican `dist` con las acciones oficiales de Pages. Los pull requests prueban y compilan sin publicar. Se conserva `/Electrogames/` como base; `#snake`, `#pong`, `#breakout` y `#buscaminas` permiten enlaces directos sin rutas de servidor.

## Límites

Pong solo incluye CPU. No hay multijugador, sonido, cuentas, clasificación global, emuladores ni PWA/sin conexión. Los récords pertenecen al navegador y se pierden al borrar sus datos. Canvas tiene controles etiquetados, pero los juegos de reflejos no ofrecen una alternativa completamente no visual. Buscaminas utiliza botones con descripciones de casilla y navegación por flechas, Enter, Espacio y F. El campo de Buscaminas puede desplazarse internamente si necesita más espacio.

La revisión incluye pruebas automatizadas de reglas, compilación y comprobaciones en navegador a tamaños de escritorio y móvil; no equivale a una prueba en un teléfono físico.

Ideas y prioridades: [docs/ROADMAP.md](docs/ROADMAP.md).

## Licencia

GPL-3.0, igual que Games. Motores e ilustraciones propios. React y Vite: MIT; TypeScript: Apache-2.0; Lucide: ISC. Fuentes del sistema, sin descargas externas. Recreaciones independientes, sin ROM, logotipos, sonidos ni recursos gráficos de juegos comerciales.
