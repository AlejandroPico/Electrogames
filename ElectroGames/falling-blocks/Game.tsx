import Arcade from "../../src/shared/Arcade";
import { BlocksEngine } from "./engine";
const create = () => new BlocksEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowUp", label: "Girar" },
  { key: "ArrowRight", label: "→" },
  { key: "ArrowDown", label: "Bajar" },
  { key: " ", label: "Caer" },
];
export default function Game() {
  return (
    <Arcade
      id="falling-blocks"
      title="Bloques descendentes"
      create={create}
      buttons={buttons}
      dimensions={{ width: 400, height: 600 }}
      hint="← → mover · ↑ girar · ↓ bajar · Espacio caída · P pausa"
      instructions="Completa filas horizontales sin huecos. Las filas completas desaparecen y las de arriba bajan. Mueve con izquierda y derecha, gira con arriba, acelera la bajada con abajo y suelta la pieza con Espacio. La silueta marca dónde caerá. Cada grupo de siete contiene una pieza de cada tipo. Las líneas dan 100, 300, 500 u 800 puntos multiplicados por el nivel; cada diez líneas aumenta la velocidad. La partida termina al bloquear la entrada de nuevas piezas."
    />
  );
}
