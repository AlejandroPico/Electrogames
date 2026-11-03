import Arcade from "../../src/shared/Arcade";
import { PinballEngine } from "./engine";
const create = () => new PinballEngine();
const buttons = [
  { key: "z", label: "Palanca izq." },
  { key: " ", label: "Lanzar" },
  { key: "x", label: "Palanca der." },
];
export default function Game() {
  return (
    <Arcade
      id="pinball"
      title="Pinball"
      create={create}
      buttons={buttons}
      dimensions={{ width: 500, height: 750 }}
      hint="Z / ← palanca izquierda · X / → derecha · Espacio lanzar · P pausa"
      instructions="Lanza con Espacio desde el carril derecho. Z o flecha izquierda activa la palanca izquierda; X o flecha derecha, la derecha. Tienes tres bolas. Los bumpers dan 100 puntos y el obstáculo central, 25, multiplicados por el nivel de bonus. Enciende las cuatro dianas laterales para conseguir 500 puntos y subir el multiplicador hasta ×5. Evita el desagüe central. La puerta del carril se cierra después del lanzamiento para devolver la bola al campo de juego."
    />
  );
}
