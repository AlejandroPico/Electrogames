import {
  Component,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Sun,
  Sunset,
  Moon,
  Info,
  Zap,
  Users,
  ArrowUpRight,
  X,
  Monitor,
  Github,
} from "lucide-react";
import { games } from "./catalog";
import Modal from "./shared/Modal";
import { read, write } from "./shared/storage";
class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty-state">
        <h2>No se ha podido abrir la partida</h2>
        <p>Vuelve a cargar la página para intentarlo de nuevo.</p>
        <button onClick={() => location.reload()}>Volver a cargar</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
const normalized = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function getRoute() {
  return decodeURIComponent(location.hash.slice(1));
}
export default function App() {
  const [route, setRoute] = useState(getRoute),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("Todos"),
    [panel, setPanel] = useState<"search" | "filter" | "theme" | null>(null),
    [about, setAbout] = useState(false),
    [theme, setTheme] = useState(() => read("theme", "day"));
  const game = games.find((g) => g.id === route);
  useEffect(() => {
    if (panel || about) window.dispatchEvent(new Event("electrogames:pause"));
  }, [panel, about]);
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      setPanel(null);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.view = game ? "game" : "catalog";
    document.title = game
      ? `${game.name} · ElectroGames`
      : "ElectroGames · Clásicos de siempre";
  }, [game]);
  useEffect(() => {
    function update() {
      const hour = new Date().getHours();
      document.documentElement.dataset.theme =
        theme === "auto"
          ? hour < 7 || hour >= 21
            ? "night"
            : hour >= 18
              ? "afternoon"
              : "day"
          : theme;
    }
    update();
    write("theme", theme);
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [theme]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const filtered = games.filter(
    (g) =>
      (category === "Todos" || g.category === category) &&
      normalized(`${g.name} ${g.category} ${g.description}`).includes(
        normalized(query),
      ),
  );
  const toggle = (name: typeof panel) =>
    setPanel((p) => (p === name ? null : name));
  return (
    <>
      <header className="site-header">
        {game && (
          <a href="#" className="icon back" aria-label="Volver a la colección">
            <ArrowLeft size={20} />
          </a>
        )}
        <a className="brand" href="#" aria-label="ElectroGames, inicio">
          <span className="brand-mark">
            <Zap size={22} />
          </span>
          <span>
            Electro<span className="brand-light">Games</span>
          </span>
        </a>
        {game && <h1 className="header-game-title">{game.name}</h1>}
        <nav aria-label="Herramientas">
          {!game && (
            <>
              <button
                className={`icon ${panel === "search" ? "active" : ""}`}
                aria-label="Buscar juegos"
                aria-expanded={panel === "search"}
                onClick={() => toggle("search")}
              >
                <Search size={19} />
              </button>
              <button
                className={`icon ${category !== "Todos" ? "active" : ""}`}
                aria-label="Filtrar juegos"
                aria-expanded={panel === "filter"}
                onClick={() => toggle("filter")}
              >
                <SlidersHorizontal size={19} />
              </button>
            </>
          )}
          <button
            className="icon"
            aria-label="Cambiar iluminación"
            aria-expanded={panel === "theme"}
            onClick={() => toggle("theme")}
          >
            {theme === "night" ? (
              <Moon size={19} />
            ) : theme === "afternoon" ? (
              <Sunset size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>
          <button
            className="icon"
            aria-label="Acerca de ElectroGames"
            onClick={() => {
              setPanel(null);
              setAbout(true);
            }}
          >
            <Info size={19} />
          </button>
        </nav>
        {panel && (
          <div className="popover">
            <div className="popover-heading">
              <strong>
                {panel === "search"
                  ? "Encuentra tu próxima partida"
                  : panel === "filter"
                    ? "Filtrar colección"
                    : "Iluminación"}
              </strong>
              <button
                className="icon"
                aria-label="Cerrar panel"
                onClick={() => setPanel(null)}
              >
                <X size={16} />
              </button>
            </div>
            {panel === "search" ? (
              <label className="search-box">
                <Search size={17} />
                <input
                  type="search"
                  aria-label="Nombre o tipo de juego"
                  autoFocus
                  placeholder="Buscar un juego…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            ) : panel === "filter" ? (
              <div className="filter-options">
                {["Todos", "Supervivencia", "Reflejos", "Lógica"].map((c) => (
                  <button
                    key={c}
                    className={category === c ? "selected" : ""}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                    <span>
                      {c === "Todos"
                        ? 4
                        : games.filter((g) => g.category === c).length}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="theme-options">
                  {[
                    { id: "day", name: "Día", Icon: Sun },
                    { id: "afternoon", name: "Tarde", Icon: Sunset },
                    { id: "night", name: "Noche", Icon: Moon },
                    { id: "auto", name: "Automático", Icon: Monitor },
                  ].map((t) => (
                    <button
                      key={t.id}
                      className={theme === t.id ? "selected" : ""}
                      onClick={() => setTheme(t.id)}
                    >
                      <t.Icon size={17} />
                      {t.name}
                    </button>
                  ))}
                </div>
                <p className="small">
                  El modo automático sigue la hora local de tu dispositivo.
                </p>
              </>
            )}
          </div>
        )}
      </header>
      <main>
        {game ? (
          <Boundary key={game.id}>
            <Suspense
              fallback={
                <div className="empty-state">Preparando la partida…</div>
              }
            >
              <game.Game />
            </Suspense>
          </Boundary>
        ) : (
          <div className="collection">
            <div className="collection-intro">
              <div>
                <span className="eyebrow">LA COLECCIÓN ELECTRÓNICA</span>
                <h1>
                  Clásicos de siempre.
                  <br className="mobile-break" /> Una partida más.
                </h1>
                <p>
                  Los juegos con los que empezó todo, de nuevo en tus manos.
                </p>
              </div>
              <span className="edition">
                <span className="status-dot" /> 01 — PRIMERA EDICIÓN
              </span>
            </div>
            <div className="collection-bar">
              <div className="category-tabs" aria-label="Categorías">
                {["Todos", "Reflejos", "Supervivencia", "Lógica"].map((c) => (
                  <button
                    aria-pressed={category === c}
                    className={category === c ? "active" : ""}
                    key={c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                    {c === "Todos" && <span>04</span>}
                  </button>
                ))}
              </div>
              <span className="result-count">
                {filtered.length} {filtered.length === 1 ? "juego" : "juegos"}
              </span>
            </div>
            {query && (
              <div className="search-results">
                Resultados para «{query}»
                <button onClick={() => setQuery("")}>
                  Limpiar búsqueda <X size={14} />
                </button>
              </div>
            )}
            <div className="game-grid">
              {filtered.map((g, i) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="game-card"
                  aria-label={`Jugar a ${g.name}`}
                >
                  <div className="tile">
                    <g.Art />
                    <span className="tile-number">0{games.indexOf(g) + 1}</span>
                    <span className="tile-players">
                      <Users size={12} />
                      {g.players}
                    </span>
                    <div className="tile-hover">
                      <span>
                        Jugar ahora <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>
                  <div className="card-heading">
                    <h2>{g.name}</h2>
                    <ArrowUpRight size={18} />
                  </div>
                  <p>{g.description}</p>
                  <div className="card-meta">
                    <span>{g.category}</span>
                    <span>{g.year}</span>
                  </div>
                </a>
              ))}
            </div>
            {!filtered.length && (
              <div className="empty-state">
                <Search size={30} />
                <h2>No hay juegos con ese filtro</h2>
                <p>
                  Prueba con otro nombre o vuelve a ver la colección completa.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("Todos");
                  }}
                >
                  Ver todos los juegos
                </button>
              </div>
            )}
            <div className="collection-note">
              <Zap size={17} />
              <span>Sin monedas. Sin descargas. Solo jugar.</span>
              <span className="note-end">Hechos para volver a empezar.</span>
            </div>
            <footer>
              <span>
                ElectroGames <span className="footer-divider">/</span> Parte II
                de la colección
              </span>
              <button onClick={() => setAbout(true)}>
                Acerca del proyecto <ArrowUpRight size={13} />
              </button>
            </footer>
          </div>
        )}
      </main>
      {about && (
        <Modal title="Acerca de ElectroGames" close={() => setAbout(false)}>
          <p>
            Una colección de pequeños grandes clásicos: los primeros arcades,
            los juegos del escritorio y los que siempre llevábamos en el móvil.
          </p>
          <p>
            ElectroGames es la segunda parte de una trilogía. Games reúne juegos
            de mesa, cartas y lógica. ElectroGames se dedica a los clásicos
            electrónicos. Videogames será el espacio de emulación y todavía está
            en preparación.
          </p>
          <p>
            Esta primera edición incluye cuatro juegos completos. Los dibujos y
            las versiones jugables están creados para este proyecto. No hace
            falta registrarse; los récords se guardan en tu navegador.
          </p>
          <div className="about-links">
            <a
              href="https://alejandropico.github.io/Games/"
              target="_blank"
              rel="noreferrer"
            >
              Visitar Games <ArrowUpRight size={16} />
            </a>
            <a
              href="https://github.com/AlejandroPico/Electrogames"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} />
              Repositorio
            </a>
          </div>
        </Modal>
      )}
    </>
  );
}
