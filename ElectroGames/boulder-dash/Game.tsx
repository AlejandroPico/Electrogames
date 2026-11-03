import Arcade from "../../src/shared/Arcade";
import { BoulderEngine } from "./engine";
const create = () => new BoulderEngine();
export default function Game() {
  return (
    <Arcade
      id="boulder-dash"
      title="Boulder Dash"
      create={create}
      controls="arrows"
      hint="Flechas o WASD para excavar · P pausa"
      instructions="Excava la tierra, recoge diez diamantes y llega a la salida inferior derecha. Las rocas caen al perder el apoyo y pueden rodar sobre otras rocas o paredes. Puedes empujarlas horizontalmente si la casilla siguiente está libre. Una roca que cae te aplasta; dispones de un intento y 120 segundos. Los diamantes de esta versión permanecen fijos."
    />
  );
}
