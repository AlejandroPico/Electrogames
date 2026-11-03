import Arcade from "../../src/shared/Arcade";
import { JetpackEngine } from "./engine";
const create = () => new JetpackEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: " ", label: "Motor" },
  { key: "ArrowRight", label: "→" },
];
export default function Game() {
  return (
    <Arcade
      id="jetpack"
      title="Jetpack"
      create={create}
      buttons={buttons}
      pointerHold=" "
      hint="← → mover · Mantén Espacio o ↑ para propulsar · P pausa"
      instructions="Recoge las cuatro baterías y llega a la salida de la plataforma superior derecha. Mantén Espacio o arriba para encender el propulsor y usa las flechas laterales para moverte. El combustible se gasta al volar y se recupera al descansar sobre una plataforma con el motor apagado. Evita el suelo caliente y los drones. Tienes tres vidas y 120 segundos."
    />
  );
}
