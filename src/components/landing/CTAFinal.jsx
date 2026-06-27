import { Link } from "react-router-dom";

export default function CTAFinal() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ti ti-heart text-white text-3xl" />
        </div>
        <h2 className="text-4xl font-medium text-blue-900 mb-4">
          Da el primer paso hoy
        </h2>
        <p className="text-blue-700 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Tu primera sesión sin compromiso. Cancela cuando quieras. Tu bienestar
          no puede esperar.
        </p>
        <Link to="/registro/paciente">
          <button className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-10 py-4 rounded-lg text-lg font-medium transition-colors">
            Agendar mi primera sesión
          </button>
        </Link>
        <p className="text-sm text-blue-500 mt-5">
          Sin tarjeta de crédito requerida para empezar
        </p>
      </div>
    </section>
  );
}
