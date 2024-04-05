import nlwUniteIcon from "../assets/nlw-unite-icon.svg";
import { NavLink } from "./nav-link";

export function Header() {
  return (
    <div className="flex items-center gap-5 py-2">
      <img src={nlwUniteIcon} alt="Icone da logo" />

      <nav className="flex items-center gap-5">
        <NavLink className="font-medium text-sm text-zinc-300" href="/eventos">
          Eventos
        </NavLink>
        <NavLink className="font-medium text-sm" href="/participantes">
          Participantes
        </NavLink>
      </nav>
    </div>
  );
}
