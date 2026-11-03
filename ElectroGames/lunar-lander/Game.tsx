import Arcade from "../../src/shared/Arcade";
import { LanderEngine } from "./engine";
const create = () => new LanderEngine();
const buttons = [
  { key: "ArrowLeft", label: "↶" },
  { key: "ArrowUp", label: "Motor" },
  { key: "ArrowRight", label: "↷" },
];
export default function Game() {
  return (
    <Arcade
      id="lunar-lander"
      title="Aterrizaje lunar"
      create={create}
      buttons={buttons}
      hint="← → inclinar · ↑ motor · P pausa"
      instructions="Aterriza dentro de la plataforma iluminada. Inclina la nave con izquierda y derecha y enciende el motor con arriba. La gravedad sigue actuando cuando apagas el motor y el combustible es limitado. Para aterrizar, la velocidad vertical debe ser como máximo 42, la horizontal entre −20 y 20 y la nave casi vertical (menos de 0,16 radianes). Evita el terreno y los bordes. Un aterrizaje correcto da 500 puntos más cinco por cada unidad de combustible restante."
    />
  );
}
