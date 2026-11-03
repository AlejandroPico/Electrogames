import Arcade from "../../src/shared/Arcade";
import { CentipedeEngine } from "./engine";
const create = () => new CentipedeEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowUp", label: "↑" },
  { key: "ArrowDown", label: "↓" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Disparar" },
];
export default function Game() {
  return (
    <Arcade
      id="centipede"
      title="Centipede"
      create={create}
      buttons={buttons}
      hint="Flechas o WASD · Espacio disparar · P pausa"
      instructions="Destruye los segmentos del ciempiés durante tres oleadas. Las setas desvían su recorrido y resisten dos impactos; al destruir un segmento aparece una seta. Muévete en la zona inferior con las flechas y mantén Espacio para disparar. Evita la araña y los segmentos que alcancen tu zona. Tienes tres vidas."
    />
  );
}
