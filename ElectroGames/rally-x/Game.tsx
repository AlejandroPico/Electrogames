import Arcade from "../../src/shared/Arcade";
import { RallyEngine } from "./engine";
const create = () => new RallyEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowUp", label: "↑" },
  { key: "ArrowDown", label: "↓" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Humo" },
];
export default function Game() {
  return (
    <Arcade
      id="rally-x"
      title="Rally-X"
      create={create}
      buttons={buttons}
      hint="Flechas o WASD · Espacio humo · P pausa"
      instructions="Recoge las diez banderas del circuito evitando los coches perseguidores. El coche continúa en la dirección elegida hasta una pared; puedes preparar el giro antes del cruce. Espacio deja una nube que bloquea temporalmente a los perseguidores y consume cuatro unidades de gasolina. Las banderas recuperan cinco unidades. Tienes tres vidas y combustible limitado."
    />
  );
}
