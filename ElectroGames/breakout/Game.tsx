import Arcade from "../../src/shared/Arcade";
import { BreakoutEngine } from "./engine";
const create = () => new BreakoutEngine();
export default function Game() {
  return (
    <Arcade
      id="breakout"
      title="Breakout"
      create={create}
      hint="Ratón, arrastre o flechas ← →"
      instructions="Mueve la barra para mantener la pelota en juego y romper los 50 bloques. Los bloques de arriba valen más puntos. Dispones de tres vidas. Golpear con un extremo de la barra cambia el ángulo del rebote; con el centro la pelota sale más vertical. Rompe todos los bloques para ganar. Puedes usar el ratón, arrastrar sobre el tablero o utilizar las flechas izquierda y derecha."
    />
  );
}
