import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function CTAFinal() {
  return (
    <section className="py-16 md:py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6">
          <i className="ti ti-heart text-white text-2xl md:text-3xl" />
        </div>
        <h2 className="text-2xl md:text-4xl font-medium text-white mb-3 md:mb-4">
          Da el primer paso hoy
        </h2>
        <p className="text-blue-100 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto leading-relaxed">
          Tu primera sesión sin compromiso. Cancela cuando quieras. Tu bienestar
          no puede esperar.
        </p>
        <Link to="/registro/paciente">
          <Button variant="cta" className="h-auto px-8 md:px-10 py-3 md:py-4 text-base md:text-lg bg-white text-blue-600 hover:bg-blue-50 border-0">
            Agendar mi primera sesión
          </Button>
        </Link>
        <p className="text-xs md:text-sm text-blue-200 mt-4 md:mt-5">
          Sin tarjeta de crédito requerida para empezar
        </p>
      </div>
    </section>
  );
}
