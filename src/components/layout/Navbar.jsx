import { Link } from "react-router-dom";

const NAV_LINKS = ["Terapeutas", "Especialidades", "Precios"];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ti ti-heart text-white text-sm" />
          </div>
          <span className="font-medium text-slate-900 text-base">
            Contigo Terapia
          </span>
        </div>
        <div className="flex items-center gap-8">
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
      </div>
    </nav>
  );
}
