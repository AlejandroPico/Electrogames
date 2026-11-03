import Arcade from "../../src/shared/Arcade";
import { SnakeEngine } from "./engine";
const create = () => new SnakeEngine();
export default function Game() {
  return (
    <Arcade
      id="snake"
      title="Snake"
      create={create}
      controls="arrows"
      hint="Flechas o WASD para moverte"
      instructions="Recoge los frutos dorados y haz crecer la serpiente. Cada fruto vale 10 puntos y aumenta poco a poco la velocidad. Evita los bordes y tu propio cuerpo. No puedes girar directamente hacia atrás. En móvil utiliza las flechas de la pantalla. Llenar el tablero completa la partida."
    />
  );
}
