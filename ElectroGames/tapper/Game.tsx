import Arcade from "../../src/shared/Arcade";
import { TapperEngine } from "./engine";
const create = () => new TapperEngine();
const buttons = [
  { key: "ArrowUp", label: "↑" },
  { key: "ArrowDown", label: "↓" },
  { key: " ", label: "Servir" },
  { key: "x", label: "Recoger" },
];
export default function Game() {
  return (
    <Arcade
      id="tapper"
      title="Tapper"
      create={create}
      buttons={buttons}
      hint="↑ ↓ cambiar barra · Espacio servir · X recoger · P pausa"
      instructions="Atiende a veinte clientes antes de que lleguen al final de sus barras. Cambia de barra con arriba y abajo, sirve con Espacio y recoge los vasos que vuelven manteniendo X cuando se acerquen al extremo derecho. Fallar un vaso o dejar llegar un cliente cuenta como error. La partida termina con tres errores o al pasar 90 segundos."
    />
  );
}
