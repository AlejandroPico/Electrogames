import { lazy } from "react";
import SnakeArt from "../ElectroGames/snake/Art";
import PongArt from "../ElectroGames/pong/Art";
import BreakoutArt from "../ElectroGames/breakout/Art";
import MinesArt from "../ElectroGames/minesweeper/Art";
export const games = [
  {
    id: "snake",
    name: "Snake",
    category: "Supervivencia",
    players: "1 jugador",
    description: "Un fruto más. Un giro más. Un poco menos de espacio.",
    year: "Clásico de los móviles",
    Art: SnakeArt,
    Game: lazy(() => import("../ElectroGames/snake/Game")),
  },
  {
    id: "pong",
    name: "Pong",
    category: "Reflejos",
    players: "1 jugador · CPU",
    description: "Dos palas, una pelota y toda la esencia del arcade.",
    year: "El origen del arcade",
    Art: PongArt,
    Game: lazy(() => import("../ElectroGames/pong/Game")),
  },
  {
    id: "breakout",
    name: "Breakout",
    category: "Reflejos",
    players: "1 jugador",
    description: "Encuentra el ángulo. Rompe el siguiente bloque.",
    year: "La fiebre de los bloques",
    Art: BreakoutArt,
    Game: lazy(() => import("../ElectroGames/breakout/Game")),
  },
  {
    id: "buscaminas",
    name: "Buscaminas",
    category: "Lógica",
    players: "1 jugador",
    description: "Cada número es una pista. Cada casilla, una decisión.",
    year: "Un icono del escritorio",
    Art: MinesArt,
    Game: lazy(() => import("../ElectroGames/minesweeper/Game")),
  },
];
