import Arcade from "../../src/shared/Arcade";
import { AsteroidsEngine } from "./engine";
const create = () => new AsteroidsEngine();
const buttons = [
  { key: "ArrowLeft", label: "↶" },
  { key: "ArrowUp", label: "Impulso" },
  { key: "ArrowRight", label: "↷" },
  { key: " ", label: "Disparar" },
];
export default function Game() {
  return (
    <Arcade
      id="asteroids"
      title="Asteroides"
      create={create}
      buttons={buttons}
      hint="← → girar · ↑ impulsar · Espacio disparar · P pausa"
      instructions="Destruye las cinco oleadas de asteroides. Los grandes se dividen en dos pequeños. Tienes tres vidas y protección temporal al reaparecer. La nave mantiene la inercia y cruza de un borde al opuesto. Gira con las flechas izquierda y derecha, impulsa con arriba y dispara manteniendo Espacio. Los asteroides grandes valen 100 puntos y los pequeños 200."
    />
  );
}
