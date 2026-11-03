import Arcade from "../../src/shared/Arcade";
import { TanksEngine } from "./engine";
const create = () => new TanksEngine();
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
      id="tanks"
      title="Tanques"
      create={create}
      buttons={buttons}
      hint="Flechas o WASD · Espacio disparar · P pausa"
      instructions="Elimina tres oleadas de tanques. Las flechas mueven y orientan tu tanque; Espacio dispara en la dirección del cañón. Cada enemigo resiste dos impactos y concede 100 puntos. Los muros de ladrillo se destruyen después de tres impactos, tanto tuyos como enemigos. Dispones de tres vidas y protección temporal tras recibir un impacto."
    />
  );
}
