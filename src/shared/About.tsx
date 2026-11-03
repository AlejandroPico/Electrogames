import { useEffect, useState } from "react";
import {
  Download,
  UserRound,
  Github,
  ExternalLink,
  Check,
  Gamepad2,
  WifiOff,
} from "lucide-react";
import metadata from "../../package.json";
import Modal from "./Modal";
import { games } from "../catalog";
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export function useInstallation() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null),
    [installed, setInstalled] = useState(
      () =>
        matchMedia("(display-mode: standalone)").matches ||
        !!(navigator as Navigator & { standalone?: boolean }).standalone,
    ),
    [offline, setOffline] = useState(false);
  useEffect(() => {
    const ready = (e: Event) => {
        e.preventDefault();
        setPrompt(e as InstallEvent);
      },
      done = () => {
        setPrompt(null);
        setInstalled(true);
      };
    window.addEventListener("beforeinstallprompt", ready);
    window.addEventListener("appinstalled", done);
    let alive = true;
    if ("serviceWorker" in navigator && !import.meta.env.DEV)
      navigator.serviceWorker.ready.then(() => {
        if (alive) setOffline(true);
      });
    return () => {
      alive = false;
      window.removeEventListener("beforeinstallprompt", ready);
      window.removeEventListener("appinstalled", done);
    };
  }, []);
  return {
    prompt,
    installed,
    offline,
    async install() {
      if (!prompt) return false;
      try {
        await prompt.prompt();
        const result = await prompt.userChoice;
        setPrompt(null);
        return result.outcome === "accepted";
      } catch {
        setPrompt(null);
        return false;
      }
    },
  };
}
export default function About({
  close,
  installation,
}: {
  close: () => void;
  installation: ReturnType<typeof useInstallation>;
}) {
  const [instructions, setInstructions] = useState(false);
  return (
    <Modal
      title="Acerca de ElectroGames"
      className="about-dialog"
      close={close}
    >
      <div className="about-identity">
        <img
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt="Icono de ElectroGames"
        />
        <div>
          <h3>ElectroGames</h3>
          <span className="version-tag">Versión {metadata.version}</span>
          <p>Una colección de Alejandro Pico</p>
        </div>
      </div>
      <p className="about-intro">
        Juegos electrónicos clásicos, arcades y recreaciones para jugar desde el
        navegador. Cada juego incluye sus controles, instrucciones y récords
        locales.
      </p>
      <div className="about-statline">
        <div>
          <Gamepad2 size={20} />
          <strong>{games.length}</strong>
          <span>juegos disponibles</span>
        </div>
        <div>
          <Download size={20} />
          <strong>{installation.installed ? "Instalada" : "Instalable"}</strong>
          <span>Aplicación para tu dispositivo</span>
        </div>
        <div>
          <WifiOff size={20} />
          <strong>Sin conexión</strong>
          <span>
            {installation.offline
              ? "Descarga inicial completada"
              : "Tras la primera descarga completa"}
          </span>
        </div>
      </div>
      <div className="about-link-list">
        <a
          href="https://alejandropico.github.io/Portfolio/"
          target="_blank"
          rel="noreferrer"
        >
          <UserRound size={23} />
          <span>
            Portfolio<small>Más proyectos de Alejandro Pico</small>
          </span>
          <ExternalLink size={17} />
        </a>
        <a
          href="https://github.com/AlejandroPico/Electrogames"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={23} />
          <span>
            Repositorio<small>Código, novedades e historial del proyecto</small>
          </span>
          <ExternalLink size={17} />
        </a>
      </div>
      {installation.installed ? (
        <div className="install-state">
          <Check size={18} />
          ElectroGames está abierta como aplicación instalada.
        </div>
      ) : (
        <button
          className="primary install-button"
          onClick={async () => {
            if (installation.prompt) {
              if (!(await installation.install())) setInstructions(true);
            } else setInstructions((v) => !v);
          }}
        >
          <Download size={19} />
          {installation.prompt
            ? "Instalar ElectroGames"
            : "Cómo instalar ElectroGames"}
        </button>
      )}
      {instructions && (
        <div className="install-instructions">
          <p>
            En Chrome o Edge, abre el menú del navegador y elige «Instalar
            ElectroGames» o «Instalar esta página como aplicación».
          </p>
          <p>
            En Safari de iPhone o iPad: Compartir → Añadir a pantalla de inicio.
            La opción concreta depende del navegador.
          </p>
          <p>
            La primera descarga necesita conexión. Los récords se conservan en
            este dispositivo.
          </p>
        </div>
      )}
      <div className="about-credit">
        <span>Diseño y colección · Alejandro Pico</span>
        <span>Código abierto · GPLv3</span>
      </div>
    </Modal>
  );
}
