import Arcade from "../../src/shared/Arcade";
import { PaperboyEngine } from "./engine";
const create = () => new PaperboyEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowRight", label: "→" },
  { key: "z", label: "Lanzar izq." },
  { key: "x", label: "Lanzar der." },
];
export default function Game() {
  return (
    <Arcade
      id="paperboy"
      title="Paperboy"
      create={create}
      buttons={buttons}
      hint="← → conducir · Z izquierda · X derecha · P pausa"
      instructions="Entrega doce periódicos en los buzones de los laterales. Conduce con las flechas y lanza a la izquierda con Z o a la derecha con X. Espacio lanza hacia el último lado al que te moviste. Anticipa el avance de los buzones y evita los obstáculos de la carretera. Tienes cuarenta periódicos, tres vidas y 70 segundos."
    />
  );
}
