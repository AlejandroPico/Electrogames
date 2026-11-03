import Arcade from "../../src/shared/Arcade";
import { SkiEngine } from "./engine";
const create = () => new SkiEngine();
const buttons = [
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowRight", label: "→" },
  { key: " ", label: "Saltar" },
];
export default function Game() {
  return (
    <Arcade
      id="ski-free"
      title="SkiFree"
      create={create}
      buttons={buttons}
      pointerAction=" "
      hint="← → o ratón · Espacio saltar · P pausa"
      instructions="Desciende 5000 metros evitando árboles y rocas. Gira con las flechas o mueve el ratón. Espacio permite un salto corto; las rampas impulsan más alto y dan 50 puntos. Durante un salto no recibes golpes de obstáculos. La velocidad aumenta durante la bajada y tienes tres vidas."
    />
  );
}
