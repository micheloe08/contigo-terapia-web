const STEPS = [
  {
    num: "1",
    icon: "ti-search",
    title: "Elige tu terapeuta",
    desc: "Filtra por especialidad, género, idioma y horario disponible",
  },
  {
    num: "2",
    icon: "ti-calendar",
    title: "Agenda tu sesión",
    desc: "Selecciona el día y hora que mejor se adapte a tu ritmo de vida",
  },
  {
    num: "3",
    icon: "ti-video",
    title: "Conecta y mejora",
    desc: "Tu sesión por videollamada, chat o en persona desde donde estés",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-2">
          Proceso
        </p>
        <h2 className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 md:mb-10">
          Así de fácil es empezar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-5 text-white text-sm font-medium">
                {s.num}
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <i
                  className={`ti ${s.icon} text-blue-600 text-xl md:text-2xl`}
                />
              </div>
              <p className="font-medium text-slate-900 text-base md:text-lg mb-2 md:mb-3">
                {s.title}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
