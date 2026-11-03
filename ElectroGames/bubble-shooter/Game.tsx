import Arcade from "../../src/shared/Arcade";
import { BubbleEngine } from "./engine";
const create = () => new BubbleEngine();
const buttons = [
  { key: "ArrowLeft", label: "↶" },
  { key: "ArrowRight", label: "↷" },
  { key: " ", label: "Lanzar" },
];
export default function Game() {
  return (
    <Arcade
      id="bubble-shooter"
      title="Bubble Shooter"
      create={create}
      buttons={buttons}
      pointerAction=" "
      hint="Ratón o ← → apuntar · Espacio lanzar · P pausa"
      instructions="Une tres o más burbujas del mismo color para eliminarlas. Las que queden sin conexión con el techo también caen. Apunta con el ratón o las flechas izquierda y derecha y dispara con Espacio o tocando el tablero. Las paredes permiten rebotes. Tras cinco tiros sin eliminar grupos el techo desciende. Despeja todas las burbujas antes de que lleguen a la línea inferior."
    />
  );
}
