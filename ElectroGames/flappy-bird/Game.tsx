import Arcade from "../../src/shared/Arcade";
import { FlappyEngine } from "./engine";
const create = () => new FlappyEngine();
const buttons = [{ key: " ", label: "Aletear" }];
export default function Game() {
  return (
    <Arcade
      id="flappy-bird"
      title="Flappy Bird"
      create={create}
      buttons={buttons}
      pointerAction=" "
      hint="Espacio, ↑ o toque para aletear · P pausa"
      instructions="Pasa por veinte huecos sin tocar los tubos, el suelo ni el techo. Cada pulsación de Espacio o arriba, o cada toque en el tablero, produce un aleteo. La gravedad actúa continuamente. La velocidad aumenta y los huecos se estrechan a medida que avanzas. Dispones de un intento."
    />
  );
}
