const TESTIMONIALS = [
  {
    initials: "SM",
    name: "Sara M.",
    city: "Guadalajara",
    text: "Encontré a mi terapeuta en menos de 10 minutos. El proceso fue increíblemente sencillo.",
    bg: "#B5D4F4",
    color: "#042C53",
  },
  {
    initials: "JL",
    name: "Jorge L.",
    city: "CDMX",
    text: "Después de meses buscando, aquí encontré un especialista que realmente entiende lo que vivo.",
    bg: "#E6F1FB",
    color: "#185FA5",
  },
  {
    initials: "CP",
    name: "Carmen P.",
    city: "Monterrey",
    text: "La terapia de pareja nos ha ayudado enormemente. Muy profesionales y con horarios flexibles.",
    bg: "#9FE1CB",
    color: "#085041",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-2">
          Testimonios
        </p>
        <h2 className="text-3xl font-medium text-slate-900 mb-10">
          Lo que dicen nuestros pacientes
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.initials}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="ti ti-star text-amber-400 text-sm" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: t.bg, color: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
