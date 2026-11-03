import Arcade from "../../src/shared/Arcade";
import { InvadersEngine } from "./engine";
const create = () => new InvadersEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Disparar" },
];
export default function Game() {
  return (
    <Arcade
      id="invaders"
      title="Matamarcianos"
      create={create}
      buttons={buttons}
      hint="← → mover · Espacio disparar · P pausa"
      instructions="Defiende la base durante tres oleadas. Mueve la nave con izquierda y derecha y mantén Espacio para disparar. Los enemigos aceleran al reducirse la formación y descienden al llegar al borde. Los escudos se desgastan con ambos tipos de disparos. Tienes tres vidas; si la formación llega a la base, termina la partida. Las filas superiores dan más puntos."
    />
  );
}
