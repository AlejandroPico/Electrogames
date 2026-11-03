import { lazy } from "react";
import SnakeArt from "../ElectroGames/snake/Art";
import PongArt from "../ElectroGames/pong/Art";
import BreakoutArt from "../ElectroGames/breakout/Art";
import MinesArt from "../ElectroGames/minesweeper/Art";
import AsteroidsArt from "../ElectroGames/asteroids/Art";
import InvadersArt from "../ElectroGames/invaders/Art";
import PacmanArt from "../ElectroGames/pacman/Art";
import PinballArt from "../ElectroGames/pinball/Art";
import RoadArt from "../ElectroGames/road-crossing/Art";
import BlocksArt from "../ElectroGames/falling-blocks/Art";
import TanksArt from "../ElectroGames/tanks/Art";
import LunarArt from "../ElectroGames/lunar-lander/Art";
import PangArt from "../ElectroGames/pang/Art";
import BomberArt from "../ElectroGames/bomberman/Art";
import BubbleArt from "../ElectroGames/bubble-shooter/Art";
import CentipedeArt from "../ElectroGames/centipede/Art";
import TowerArt from "../ElectroGames/donkey-kong/Art";
import BoulderArt from "../ElectroGames/boulder-dash/Art";
import SkiArt from "../ElectroGames/ski-free/Art";
import RallyArt from "../ElectroGames/rally-x/Art";
import PaperboyArt from "../ElectroGames/paperboy/Art";
import TapperArt from "../ElectroGames/tapper/Art";
import FlappyArt from "../ElectroGames/flappy-bird/Art";
import ClawArt from "../ElectroGames/claw-machine/Art";
import MoleArt from "../ElectroGames/whack-a-mole/Art";
import SlotsArt from "../ElectroGames/fruit-slots/Art";
import JetpackArt from "../ElectroGames/jetpack/Art";
export const games = [
  {
    id: "snake",
    name: "Snake",
    category: "Supervivencia",
    players: "1 jugador",
    Art: SnakeArt,
    Game: lazy(() => import("../ElectroGames/snake/Game")),
  },
  {
    id: "pong",
    name: "Pong",
    category: "Reflejos",
    players: "1 jugador · CPU",
    Art: PongArt,
    Game: lazy(() => import("../ElectroGames/pong/Game")),
  },
  {
    id: "breakout",
    name: "Breakout",
    category: "Reflejos",
    players: "1 jugador",
    Art: BreakoutArt,
    Game: lazy(() => import("../ElectroGames/breakout/Game")),
  },
  {
    id: "buscaminas",
    name: "Buscaminas",
    category: "Lógica",
    players: "1 jugador",
    Art: MinesArt,
    Game: lazy(() => import("../ElectroGames/minesweeper/Game")),
  },
  {
    id: "asteroids",
    name: "Asteroides",
    category: "Disparos",
    players: "1 jugador",
    Art: AsteroidsArt,
    Game: lazy(() => import("../ElectroGames/asteroids/Game")),
  },
  {
    id: "invaders",
    name: "Matamarcianos",
    category: "Disparos",
    players: "1 jugador",
    Art: InvadersArt,
    Game: lazy(() => import("../ElectroGames/invaders/Game")),
  },
  {
    id: "pacman",
    name: "Pac-Man",
    category: "Laberintos",
    players: "1 jugador",
    Art: PacmanArt,
    Game: lazy(() => import("../ElectroGames/pacman/Game")),
  },
  {
    id: "pinball",
    name: "Pinball",
    category: "Reflejos",
    players: "1 jugador",
    Art: PinballArt,
    Game: lazy(() => import("../ElectroGames/pinball/Game")),
  },
  {
    id: "road-crossing",
    name: "Cruzar la carretera",
    category: "Supervivencia",
    players: "1 jugador",
    Art: RoadArt,
    Game: lazy(() => import("../ElectroGames/road-crossing/Game")),
  },
  {
    id: "falling-blocks",
    name: "Bloques descendentes",
    category: "Lógica",
    players: "1 jugador",
    Art: BlocksArt,
    Game: lazy(() => import("../ElectroGames/falling-blocks/Game")),
  },
  {
    id: "tanks",
    name: "Tanques",
    category: "Disparos",
    players: "1 jugador",
    Art: TanksArt,
    Game: lazy(() => import("../ElectroGames/tanks/Game")),
  },
  {
    id: "lunar-lander",
    name: "Aterrizaje lunar",
    category: "Simulación",
    players: "1 jugador",
    Art: LunarArt,
    Game: lazy(() => import("../ElectroGames/lunar-lander/Game")),
  },
  {
    id: "pang",
    name: "Pang",
    category: "Reflejos",
    players: "1 jugador",
    Art: PangArt,
    Game: lazy(() => import("../ElectroGames/pang/Game")),
  },
  {
    id: "bomberman",
    name: "Bomberman",
    category: "Laberintos",
    players: "1 jugador",
    Art: BomberArt,
    Game: lazy(() => import("../ElectroGames/bomberman/Game")),
  },
  {
    id: "bubble-shooter",
    name: "Bubble Shooter",
    category: "Lógica",
    players: "1 jugador",
    Art: BubbleArt,
    Game: lazy(() => import("../ElectroGames/bubble-shooter/Game")),
  },
  {
    id: "centipede",
    name: "Centipede",
    category: "Disparos",
    players: "1 jugador",
    Art: CentipedeArt,
    Game: lazy(() => import("../ElectroGames/centipede/Game")),
  },
  {
    id: "donkey-kong",
    name: "Donkey Kong",
    category: "Plataformas",
    players: "1 jugador",
    Art: TowerArt,
    Game: lazy(() => import("../ElectroGames/donkey-kong/Game")),
  },
  {
    id: "boulder-dash",
    name: "Boulder Dash",
    category: "Laberintos",
    players: "1 jugador",
    Art: BoulderArt,
    Game: lazy(() => import("../ElectroGames/boulder-dash/Game")),
  },
  {
    id: "ski-free",
    name: "SkiFree",
    category: "Carreras",
    players: "1 jugador",
    Art: SkiArt,
    Game: lazy(() => import("../ElectroGames/ski-free/Game")),
  },
  {
    id: "rally-x",
    name: "Rally-X",
    category: "Carreras",
    players: "1 jugador",
    Art: RallyArt,
    Game: lazy(() => import("../ElectroGames/rally-x/Game")),
  },
  {
    id: "paperboy",
    name: "Paperboy",
    category: "Habilidad",
    players: "1 jugador",
    Art: PaperboyArt,
    Game: lazy(() => import("../ElectroGames/paperboy/Game")),
  },
  {
    id: "tapper",
    name: "Tapper",
    category: "Reflejos",
    players: "1 jugador",
    Art: TapperArt,
    Game: lazy(() => import("../ElectroGames/tapper/Game")),
  },
  {
    id: "flappy-bird",
    name: "Flappy Bird",
    category: "Habilidad",
    players: "1 jugador",
    Art: FlappyArt,
    Game: lazy(() => import("../ElectroGames/flappy-bird/Game")),
  },
  {
    id: "claw-machine",
    name: "Máquina de garra",
    category: "Habilidad",
    players: "1 jugador",
    Art: ClawArt,
    Game: lazy(() => import("../ElectroGames/claw-machine/Game")),
  },
  {
    id: "whack-a-mole",
    name: "Golpear al topo",
    category: "Reflejos",
    players: "1 jugador",
    Art: MoleArt,
    Game: lazy(() => import("../ElectroGames/whack-a-mole/Game")),
  },
  {
    id: "fruit-slots",
    name: "Tragaperras de frutas",
    category: "Azar",
    players: "1 jugador",
    Art: SlotsArt,
    Game: lazy(() => import("../ElectroGames/fruit-slots/Game")),
  },
  {
    id: "jetpack",
    name: "Jetpack",
    category: "Plataformas",
    players: "1 jugador",
    Art: JetpackArt,
    Game: lazy(() => import("../ElectroGames/jetpack/Game")),
  },
];
export const categories = [...new Set(games.map((g) => g.category))];
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function filterGames<T extends { name: string; category: string }>(
  items: T[],
  selected: string[],
  query: string,
) {
  return items.filter(
    (g) =>
      (!selected.length || selected.includes(g.category)) &&
      normalize(`${g.name} ${g.category}`).includes(normalize(query)),
  );
}
