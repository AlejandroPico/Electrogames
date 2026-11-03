import Arcade from "../../src/shared/Arcade";
import { PangEngine } from "./engine";
const create = () => new PangEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Arpón" },
];
export default function Game() {
  return (
    <Arcade
      id="pang"
      title="Pang"
      create={create}
      buttons={buttons}
      pointerAction=" "
      hint="← → mover · Espacio arpón · P pausa"
      instructions="Rompe todas las bolas de las tres fases con el arpón vertical. Cada bola grande se divide en dos medianas y estas en dos pequeñas. Evita el contacto: tienes tres vidas y 90 segundos por fase. Mantén Espacio para lanzar cuando el arpón anterior desaparezca. En móvil usa las flechas y Arpón."
    />
  );
}
