import Arcade from "../../src/shared/Arcade";
import { ClawEngine } from "./engine";
const create = () => new ClawEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Bajar pinza" },
];
export default function Game() {
  return (
    <Arcade
      id="claw-machine"
      title="Máquina de garra"
      create={create}
      buttons={buttons}
      pointerAction=" "
      hint="← → o ratón apuntar · Espacio bajar · P pausa"
      instructions="Consigue tres premios en seis intentos. Coloca la pinza sobre el centro de un premio con las flechas o el ratón y pulsa Espacio, o toca el tablero, para bajar. Debes centrar la pinza a menos de diecisiete unidades del premio. La pinza sube y lleva los premios agarrados a la salida. Cada muñeco vale entre 100 y 200 puntos. No hay dinero ni premios reales."
    />
  );
}
