import Arcade from "../../src/shared/Arcade";
import { PongEngine } from "./engine";
const create = () => new PongEngine();
export default function Game() {
  return (
    <Arcade
      id="pong"
      title="Pong"
      create={create}
      controls="vertical"
      hint="Flechas ↑ ↓, W / S o arrastre vertical"
      instructions="Controlas la pala de la izquierda y juegas contra el ordenador. Devuelve la pelota y consigue que cruce el fondo rival. Gana quien llegue primero a 7 puntos. La pelota acelera con cada intercambio; golpear lejos del centro de la pala cambia su dirección. Utiliza arriba y abajo, W y S, el ratón, el arrastre vertical sobre el tablero o los botones táctiles. El récord cuenta tus puntos en una partida."
    />
  );
}
