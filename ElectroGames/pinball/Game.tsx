import Arcade from "../../src/shared/Arcade";
import { PinballEngine } from "./engine";
const create = () => new PinballEngine();
const buttons = [
  { key: "z", label: "Palanca izq." },
  { key: " ", label: "Lanzar" },
  { key: "x", label: "Palanca der." },
];
export default function Game() {
  return (
    <Arcade
      id="pinball"
      title="Pinball"
      create={create}
      buttons={buttons}
      hint="Z / ← palanca izquierda · X / → derecha · Espacio lanzar · P pausa"
      instructions="Lanza la bola con Espacio. Activa la palanca izquierda con Z o flecha izquierda y la derecha con X o flecha derecha. Evita que la bola salga por el hueco central. Los tres bumpers conceden 100 puntos por impacto. Tienes tres bolas; después de perder una, vuelve a lanzar. Las palancas activas impulsan la bola hacia arriba. Mesa original con gravedad, rebotes y colisiones resueltas en varios pasos por fotograma."
    />
  );
}
