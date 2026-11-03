import Arcade from "../../src/shared/Arcade";
import { TowerEngine } from "./engine";
const create = () => new TowerEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowUp", label: "↑" },
  { key: "ArrowDown", label: "↓" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Saltar" },
];
export default function Game() {
  return (
    <Arcade
      id="donkey-kong"
      title="Donkey Kong"
      create={create}
      buttons={buttons}
      hint="← → mover · ↑ ↓ escalera · Espacio saltar · P pausa"
      instructions="Sube las tres escaleras y alcanza la puerta de la plataforma superior. Las escaleras se alternan a derecha e izquierda. Usa arriba y abajo para trepar cuando estés junto a una, y Espacio para saltar sobre los barriles. Tienes tres vidas y 100 segundos. Esta recreación utiliza una torre y gráficos originales."
    />
  );
}
