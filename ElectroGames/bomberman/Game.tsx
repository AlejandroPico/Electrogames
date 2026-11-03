import Arcade from "../../src/shared/Arcade";
import { BomberEngine } from "./engine";
const create = () => new BomberEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowUp", label: "↑" },
  { key: "ArrowDown", label: "↓" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Bomba" },
];
export default function Game() {
  return (
    <Arcade
      id="bomberman"
      title="Bomberman"
      create={create}
      buttons={buttons}
      hint="Flechas o WASD · Espacio bomba · P pausa"
      instructions="Elimina a los tres enemigos y entra en la salida de la esquina inferior derecha. Coloca hasta dos bombas con Espacio y aléjate: explotan tras 2,1 segundos y alcanzan tres casillas por dirección. Los muros sólidos bloquean la explosión; los ladrillos se rompen y detienen ese brazo. Las bombas pueden encadenarse y dañarte. Dispones de tres vidas y 150 segundos."
    />
  );
}
