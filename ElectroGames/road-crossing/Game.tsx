import Arcade from "../../src/shared/Arcade";
import { RoadEngine } from "./engine";
const create = () => new RoadEngine();
export default function Game() {
  return (
    <Arcade
      id="road-crossing"
      title="Cruzar la carretera"
      create={create}
      controls="arrows"
      hint="Flechas o WASD · P pausa"
      instructions="Lleva una rana a cada uno de los cinco refugios de arriba. Esquiva los vehículos, utiliza las zonas verdes para esperar y cruza el río sobre los troncos: estos te arrastran con la corriente. No puedes entrar en un refugio ocupado. Tienes tres vidas y 90 segundos; cada cruce añade 15 segundos. Avanzar da puntos y cada refugio suma 200. Mantén una flecha para repetir los saltos o pulsa para avanzar una casilla."
    />
  );
}
