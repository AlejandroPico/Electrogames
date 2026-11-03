import Arcade from "../../src/shared/Arcade";
import { MoleEngine } from "./engine";
const create = () => new MoleEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowUp", label: "↑" },
  { key: "ArrowDown", label: "↓" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Golpear" },
];
export default function Game() {
  return (
    <Arcade
      id="whack-a-mole"
      title="Golpear al topo"
      create={create}
      buttons={buttons}
      pointerAction=" "
      hint="Flechas seleccionar · Espacio golpear · O toca un topo"
      instructions="Acierta veinte topos en 45 segundos. En ordenador selecciona un agujero con las flechas y pulsa Espacio, o haz clic directamente sobre el topo. En móvil toca el objetivo. Evita los topos oscuros marcados con una cruz: dan penalización. Los golpes en vacío también cuentan como error. Se permiten cinco errores y los aciertos seguidos aumentan la puntuación."
    />
  );
}
