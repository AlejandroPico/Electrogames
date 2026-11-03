import Arcade from "../../src/shared/Arcade";
import { PacmanEngine } from "./engine";
const create = () => new PacmanEngine();
export default function Game() {
  return (
    <Arcade
      id="pacman"
      title="Pac-Man"
      create={create}
      controls="arrows"
      hint="Flechas o WASD · P pausa"
      instructions="Recoge todos los puntos del laberinto evitando a los tres fantasmas. Los puntos grandes dan energía durante siete segundos y permiten comerte a los fantasmas. Dispones de tres vidas y protección temporal al reaparecer. Los puntos pequeños valen 10, los grandes 50 y los fantasmas 200. Puedes indicar el siguiente giro antes de llegar al cruce. Esta versión utiliza un laberinto y dibujos propios."
    />
  );
}
