const SPECIALTIES = [
  { icon: "ti-brain", label: "Ansiedad y estrés" },
  { icon: "ti-heart", label: "Terapia de pareja" },
  { icon: "ti-mood-smile", label: "Depresión" },
  { icon: "ti-users", label: "Psicología infantil" },
  { icon: "ti-leaf", label: "Mindfulness" },
  { icon: "ti-refresh", label: "Adicciones" },
  { icon: "ti-star", label: "Autoestima" },
  { icon: "ti-home", label: "Terapia familiar" },
];

const COLORS = [
  'bg-blue-50 hover:bg-blue-100',
  'bg-indigo-50 hover:bg-indigo-100',
  'bg-sky-50 hover:bg-sky-100',
  'bg-cyan-50 hover:bg-cyan-100',
  'bg-teal-50 hover:bg-teal-100',
  'bg-emerald-50 hover:bg-emerald-100',
  'bg-violet-50 hover:bg-violet-100',
  'bg-blue-50 hover:bg-blue-100',
]

export default function Specialties() {
  return (
    <section id="especialidades" className="py-12 md:py-16 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl text-slate-900 mb-8 md:mb-10">
          <span className="font-light">Encontramos al especialista</span> <span className="font-semibold">que necesitas</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {SPECIALTIES.map((s, i) => (
            <div
              key={s.label}
              className={`bg-white border border-slate-200 rounded-xl p-4 md:p-6 text-center transition-colors cursor-pointer ${COLORS[i % COLORS.length]}`}
            >
              <i
                className={`ti ${s.icon} text-blue-600 text-2xl md:text-3xl mb-2 md:mb-3 block`}
              />
              <p className="font-medium text-slate-800 text-sm md:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
