import Arcade from "../../src/shared/Arcade";
import { SlotsEngine } from "./engine";
const create = () => new SlotsEngine();
const buttons = [{ key: " ", label: "Girar" }];
export default function Game() {
  return (
    <Arcade
      id="fruit-slots"
      title="Tragaperras de frutas"
      create={create}
      buttons={buttons}
      pointerAction=" "
      hint="Espacio o toque para girar · P pausa"
      instructions="Tienes cien puntos ficticios y diez tiradas. Cada giro cuesta cinco puntos. Tres figuras iguales dan 50 puntos, tres sietes dan 100 y dos figuras iguales dan 15. Espera a que se detengan los tres rodillos antes del siguiente giro. La partida termina al gastar las diez tiradas o no poder pagar otra. Todo son puntos locales: no se apuesta dinero ni se obtienen premios reales."
    />
  );
}
