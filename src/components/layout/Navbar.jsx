import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

// "Precios" has no matching landing section yet, so it stays a plain label
// (no href) until that section exists.
const NAV_LINKS = [
  { label: "Terapeutas", href: "#terapeutas" },
  { label: "Especialidades", href: "#especialidades" },
  { label: "Precios", href: null },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ti ti-heart text-white text-sm" />
          </div>
          <span className="font-medium text-slate-900 text-base">
            Contigo Terapia
          </span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) =>
            l.href ? (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <span key={l.label} className="text-sm text-slate-400">
                {l.label}
              </span>
            )
          )}
          <Link to="/login">
            <Button variant="cta" className="h-auto px-5 py-2 text-sm">
              Iniciar sesión
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i
            className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"} text-slate-700 text-xl`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 py-4 flex flex-col gap-4 bg-white">
          {NAV_LINKS.map((l) =>
            l.href ? (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-slate-600"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ) : (
              <span key={l.label} className="text-sm text-slate-400">
                {l.label}
              </span>
            )
          )}
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <Button variant="cta" className="w-full h-auto py-2.5 text-sm">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
