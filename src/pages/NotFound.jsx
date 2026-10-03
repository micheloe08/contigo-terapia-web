import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-6xl font-medium text-blue-300 mb-4">404</p>
        <h1 className="text-2xl font-medium text-blue-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-blue-600 mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
