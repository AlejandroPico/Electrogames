# ElectroGames

Colección de juegos electrónicos clásicos. Segunda parte de una trilogía: **Games** (mesa, cartas y lógica), **ElectroGames** (arcade y primeros juegos electrónicos) y **Videogames** (futuro proyecto de emulación, todavía no creado).

**Web:** https://alejandropico.github.io/Electrogames/

Versión actual: **1.1.0**. La ventana Acerca de lee la versión de `package.json` y muestra identidad, portfolio, repositorio, instalación y estado de la descarga sin conexión.

## Juegos disponibles

- **Snake:** tablero de 24 × 24, crecimiento y velocidad progresiva, colisiones, teclado y cruceta táctil. Diez puntos por fruto; llenar el tablero da la victoria.
- **Pong:** una persona contra CPU, rebotes según el punto de contacto y velocidad creciente. Gana quien alcance siete puntos. Teclado, ratón, arrastre y botones táctiles.
- **Breakout:** 50 bloques, puntuación por fila, tres vidas y victoria al vaciar el campo. Teclado, ratón, arrastre y controles táctiles.
- **Buscaminas:** iniciación (9 × 9, 10 minas), intermedio (12 × 12, 24 minas) y experto (16 × 16, 40 minas). Primera casilla y sus vecinas seguras, apertura de áreas, banderas y mejor tiempo por dificultad.
- **Asteroides:** giro, propulsión, inercia y bordes conectados; disparos, fragmentación, tres vidas y cinco oleadas.
- **Matamarcianos:** formación descendente, disparos enemigos, escudos destructibles, tres vidas y tres oleadas.
- **Pac-Man:** laberinto original conectado, tres fantasmas, puntos, potenciadores temporales, tres vidas y victoria al vaciar el mapa. Los fantasmas comidos reaparecen tras dos segundos.
- **Pinball:** mesa vertical con carril de lanzamiento integrado, puerta de retorno, dos palancas, tres bumpers, obstáculo central y cuatro dianas. Completar las dianas sube el multiplicador hasta ×5. Tres bolas y partida de puntuación. La física utiliza doce pasos por fotograma; la posición de lanzamiento pertenece al carril visible y se prueba su entrada al campo.
- **Cruzar la carretera:** cinco refugios, cinco carriles de tráfico, cinco de río con troncos móviles, tres vidas y contador con bonificación por cada cruce.
- **Bloques descendentes:** siete tipos de piezas distribuidos en bolsas, giro con ajustes horizontales junto a paredes, vista previa, silueta de caída, eliminación de líneas, puntos y velocidad por nivel.
- **Tanques:** movimiento y disparo en cuatro direcciones, tres oleadas, enemigos de dos impactos, muros destructibles y tres vidas.
- **Aterrizaje lunar:** inclinación, gravedad, motor y combustible limitado. La plataforma exige velocidad vertical ≤ 42, horizontal entre −20 y 20 e inclinación menor de 0,16 radianes; un único intento por partida.
- **Pang:** bolas que se fragmentan, arpón vertical, tres fases, tres vidas y límite por fase.
- **Bomberman:** laberinto destructible, bombas temporizadas con reacciones en cadena, tres enemigos y salida que se abre al eliminarlos. Explosiones de tres casillas, dos bombas simultáneas y tres vidas.
- **Bubble Shooter:** puntería con ratón o teclado, rebotes, grupos de tres colores iguales, caída de grupos desconectados y techo descendente tras cinco fallos.
- **Centipede:** ciempiés que desciende y cambia de dirección con las setas, disparos, araña, tres oleadas y tres vidas.
- **Donkey Kong:** torre original de cuatro plataformas, escaleras alternas, saltos y barriles. Tres vidas y una meta superior.
- **Boulder Dash:** excavación, diamantes, empuje de rocas, gravedad y aplastamiento. Reunir diez diamantes y llegar a la salida antes de 120 segundos.
- **SkiFree:** descenso de 5000 metros, obstáculos, rampas, salto y velocidad creciente. Tres vidas.
- **Rally-X:** circuito de calles, diez banderas, perseguidores, humo temporal y gasolina limitada. Tres vidas.
- **Paperboy:** conducción cenital y lanzamientos a buzones en ambos lados. Doce entregas, cuarenta periódicos, obstáculos y tres vidas.
- **Tapper:** cuatro barras, clientes que avanzan, servicio y recogida de vasos vacíos. Veinte clientes, tres errores permitidos y tiempo limitado.
- **Flappy Bird:** vuelo por pulsaciones, gravedad, tubos, huecos que se estrechan y objetivo de veinte pasos.
- **Máquina de garra:** desplazamiento, bajada, agarre por precisión, transporte y entrega de premios ficticios. Tres capturas en seis intentos; sin azar oculto en el agarre.
- **Golpear al topo:** nueve agujeros, objetivos buenos y penalizados, rachas y controles por puntero o teclado. Veinte aciertos en 45 segundos y cinco errores permitidos.
- **Tragaperras de frutas:** tres rodillos, puntos ficticios, coste por tirada y premios por coincidencia. Diez tiradas; sin dinero ni premios reales.
- **Jetpack:** vuelo con propulsor, combustible recuperable al aterrizar, plataformas, drones, cuatro baterías y salida. Tres vidas.

La pantalla principal contiene únicamente el mosaico bajo la barra fija, siguiendo la estructura de [Games](https://alejandropico.github.io/Games/). Veintisiete ilustraciones SVG propias; el nombre se muestra centrado al pasar el ratón o dar foco con el teclado. En dispositivos sin ratón se mantiene visible dentro de la ficha. Jugadores y categoría se integran sobre cada ilustración, sin textos de presentación ni pie de página. El color del tema cubre el documento, cuerpo, raíz y contenido; no deja franjas al filtrar una colección corta. La preferencia se aplica antes del primer pintado.

La búsqueda se combina con filtros de selección múltiple. Elegir varias categorías muestra su unión; desmarcar todas muestra la colección completa. Los filtros y la búsqueda se conservan al volver de una partida. Temas día, tarde, noche y automático según la hora local.

Los arcades incluyen pausa con P, reinicio, instrucciones y récord local; se pausan al perder el foco, cambiar de pestaña o abrir información. Espacio dispara, lanza o deja caer cuando el juego lo requiere; en los otros juegos también pausa. Hay controles táctiles específicos para cada juego. Los récords se guardan en `localStorage`, con claves versionadas. Si se bloquea el almacenamiento se puede seguir jugando. Buscaminas detiene su contador al ocultar la pestaña o abrir su ayuda. No se conservan partidas al recargar.

## Desarrollo

React 19, TypeScript estricto, Vite y Canvas 2D. Node.js 24 y npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run check:pwa
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
  asteroids/
  invaders/
  pacman/                     # Incluye el generador del laberinto
  pinball/
  road-crossing/
  falling-blocks/
  tanks/
  lunar-lander/
favicon.svg                   # Fuente del favicon, en la raíz
favicon.esvg                  # Copia con el nombre solicitado
scripts/prepare-assets.mjs     # Copia ambos iconos a public antes de dev/build
scripts/generate-pwa.mjs       # Precarga todo el paquete compilado
scripts/check-pwa.mjs          # Verifica recursos, iconos y aislamiento de caché
src/
  App.tsx                     # Catálogo, temas y navegación
  catalog.ts                  # Registro e importaciones diferidas
  shared/                     # Presentación, animación y almacenamiento
tests/                        # Reglas, finales y filtros combinables
.github/workflows/pages.yml   # Pruebas, compilación y despliegue
```

Cada carpeta de `ElectroGames/` contiene toda la implementación específica de su juego. Los motores no importan reglas de otros juegos; comparten únicamente contratos y presentación. Para añadir otro: crear su carpeta con motor, vista e ilustración, registrarlo en `src/catalog.ts`, documentar controles y comprobar sus reglas. El catálogo solo anuncia juegos jugables.

## Publicación

Pages utiliza **GitHub Actions**. Los cambios en `main` ejecutan `npm ci`, pruebas, comprobación TypeScript, compilación y comprobación de la PWA, y publican `dist` con las acciones oficiales de Pages. Los pull requests prueban y compilan sin publicar. Se conserva `/Electrogames/` como base y cada identificador del catálogo tiene un enlace directo por fragmento. El navegador utiliza `favicon.svg`; `favicon.esvg` conserva el mismo dibujo en formato SVG. Resvg genera los PNG de instalación desde el SVG raíz; `public/icons/` es salida ignorada.

## Instalación y conexión

El manifiesto utiliza el ámbito `/Electrogames/`, inicio en la colección, modo independiente e iconos de 192 y 512 píxeles más una variante maskable. Si el navegador emite el evento de instalación, Acerca de ofrece el botón de instalación nativo. En otros casos muestra las instrucciones del navegador; distingue la aplicación abierta en modo instalado.

El Service Worker precarga los recursos propios, incluidos todos los módulos de juegos. La navegación intenta la red y usa la copia local si no hay conexión. La primera descarga requiere Internet y almacenamiento suficiente. Las actualizaciones esperan al cierre de las pestañas anteriores; la limpieza solo elimina cachés con prefijo `electrogames-offline-`, sin afectar Games ni otros proyectos del mismo dominio. La comprobación ejecuta el Service Worker con red interrumpida, verifica todos los recursos y comprueba navegación e iconos. La revisión en navegador confirma que Acerca de muestra la descarga inicial completada. No se ha instalado en un teléfono físico.

## Límites

Pong solo incluye CPU. No hay multijugador, sonido, cuentas, clasificación global ni emuladores. Los récords pertenecen al navegador y se pierden al borrar sus datos. Canvas tiene controles etiquetados, pero los juegos de reflejos no ofrecen una alternativa completamente no visual. Buscaminas utiliza botones con descripciones de casilla y navegación por flechas, Enter, Espacio y F. El campo de Buscaminas puede desplazarse internamente si necesita más espacio.

Son versiones propias de reglas concretas: Bloques descendentes no incluye reserva de pieza, T-spins ni el sistema de rotación SRS completo. Pac-Man utiliza un solo laberinto propio, sin túneles laterales ni mapas comerciales. Pinball tiene física 2D con colisiones de segmentos y círculos; no simula una mesa 3D ni incorpora faltas por sacudida. Aterrizaje lunar usa unidades internas, no una simulación física a escala real.

La ampliación también emplea reglas propias: Donkey Kong tiene una torre original, Boulder Dash mantiene fijos los diamantes, Rally-X utiliza movimiento por casillas y Paperboy una vista cenital. La garra es un modelo 2D determinista de precisión, no una simulación física completa de tejidos. Cada ayuda describe el objetivo y las reglas reales de esta edición; no se pretende reproducir todos los modos o niveles de las versiones comerciales.

La revisión incluye pruebas automatizadas de reglas, compilación y comprobaciones en navegador a tamaños de escritorio y móvil; no equivale a una prueba en un teléfono físico.

Ideas y prioridades: [docs/ROADMAP.md](docs/ROADMAP.md).

## Licencia

GPL-3.0, igual que Games. Motores e ilustraciones propios. React y Vite: MIT; TypeScript: Apache-2.0; Lucide: ISC. Fuentes del sistema, sin descargas externas. Recreaciones independientes, sin ROM, logotipos, sonidos ni recursos gráficos de juegos comerciales.
