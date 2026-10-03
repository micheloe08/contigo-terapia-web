import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <span className="bg-blue-200 text-blue-900 text-xs font-medium px-3 py-1 rounded-full">
            Terapia online certificada
          </span>
          <h1 className="text-3xl md:text-5xl text-blue-900 mt-4 mb-4 leading-tight">
            <span className="font-light">Tu bienestar mental,</span>
            <br />
            <span className="font-semibold">desde donde estés</span>
          </h1>
          <p className="text-blue-700 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
            Conecta con psicólogos certificados por videollamada, chat o
            presencial. Agenda en minutos, sin listas de espera.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link to="/terapeutas">
              <Button variant="cta" className="w-full sm:w-auto h-auto px-7 py-3 text-base">
                Encontrar mi terapeuta
              </Button>
            </Link>
            <Button variant="cta-outline" className="w-full sm:w-auto h-auto px-7 py-3 text-base">
              Ver cómo funciona
            </Button>
          </div>
          <div className="flex justify-center md:justify-start gap-6 md:gap-10 mt-8 md:mt-12">
            {[
              { val: "+150", label: "terapeutas" },
              { val: "4.9", label: "calificación" },
              { val: "48h", label: "primera cita" },
            ].map((s, i) => (
              <div
                key={i}
                className={
                  i > 0 ? "border-l border-blue-300 pl-6 md:pl-10" : ""
                }
              >
                <span className="text-2xl md:text-3xl font-medium text-blue-900">
                  {s.val}
                </span>
                <p className="text-xs md:text-sm text-blue-600 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-sm md:max-w-md h-56 md:h-80 bg-blue-100 rounded-3xl flex items-center justify-center border border-blue-200 relative overflow-hidden">
            <div className="absolute w-48 h-48 bg-blue-200 rounded-full -top-10 -right-10 opacity-50" />
            <div className="absolute w-32 h-32 bg-blue-50 rounded-full -bottom-8 -left-8 opacity-70" />
            <div className="relative z-10 text-center">
              <img src="/logo-negro.png" alt="Contigo Terapia" className="h-28 w-auto mx-auto opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
