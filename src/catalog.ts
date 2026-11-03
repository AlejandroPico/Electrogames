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
