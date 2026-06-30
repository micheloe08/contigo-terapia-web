import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = ["Terapeutas", "Especialidades", "Precios"];

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
          {NAV_LINKS.map((l) => (
            <span
              key={l}
              className="text-sm text-slate-500 cursor-pointer hover:text-blue-600 transition-colors"
            >
              {l}
            </span>
          ))}
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              Iniciar sesión
            </button>
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
          {NAV_LINKS.map((l) => (
            <span key={l} className="text-sm text-slate-600 cursor-pointer">
              {l}
            </span>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <button className="w-full bg-blue-600 text-white border-2 border-blue-800 py-2.5 rounded-lg text-sm font-medium">
              Iniciar sesión
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
