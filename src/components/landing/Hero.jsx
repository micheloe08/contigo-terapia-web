import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <span className="bg-blue-200 text-blue-900 text-xs font-medium px-3 py-1 rounded-full">
            Terapia online certificada
          </span>
          <h1 className="text-3xl md:text-5xl font-medium text-blue-900 mt-4 mb-4 leading-tight">
            Tu bienestar mental,
            <br />
            desde donde estés
          </h1>
          <p className="text-blue-700 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
            Conecta con psicólogos certificados por videollamada, chat o
            presencial. Agenda en minutos, sin listas de espera.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link to="/registro/paciente">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-7 py-3 rounded-lg text-base font-medium transition-colors">
                Encontrar mi terapeuta
              </button>
            </Link>
            <button className="w-full sm:w-auto bg-blue-100 hover:bg-blue-200 text-blue-900 border-2 border-blue-300 px-7 py-3 rounded-lg text-base font-medium transition-colors">
              Ver cómo funciona
            </button>
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
          <div className="w-full max-w-sm md:max-w-md h-56 md:h-80 bg-blue-100 rounded-2xl flex items-center justify-center border border-blue-200">
            <div className="text-center">
              <i className="ti ti-heart text-blue-300 text-6xl md:text-8xl mb-4 block" />
              <p className="text-blue-400 text-sm">Imagen ilustrativa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
