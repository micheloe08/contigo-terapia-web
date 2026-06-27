const THERAPISTS = [
  {
    initials: "LG",
    name: "Dra. Laura Gómez",
    specialty: "Ansiedad y depresión",
    exp: "8 años",
    rating: "5.0",
    types: ["Videollamada", "Chat"],
    bg: "#B5D4F4",
    color: "#042C53",
  },
  {
    initials: "MR",
    name: "Dr. Marcos Ruiz",
    specialty: "Terapia de pareja",
    exp: "12 años",
    rating: "4.9",
    types: ["Videollamada", "Presencial"],
    bg: "#CECEEF",
    color: "#3C3489",
  },
  {
    initials: "AP",
    name: "Dra. Ana Ponce",
    specialty: "Psicología infantil",
    exp: "6 años",
    rating: "4.8",
    types: ["Videollamada", "Chat"],
    bg: "#9FE1CB",
    color: "#085041",
  },
];

export default function Therapists() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-2">
              Terapeutas
            </p>
            <h2 className="text-3xl font-medium text-slate-900">
              Conoce a nuestros especialistas
            </h2>
          </div>
          <span className="text-sm text-blue-600 cursor-pointer hover:underline">
            Ver todos →
          </span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {THERAPISTS.map((t) => (
            <div
              key={t.initials}
              className="bg-white border border-slate-200 rounded-2xl p-6 text-center"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-medium text-lg mb-4 mx-auto"
                style={{ background: t.bg, color: t.color }}
              >
                {t.initials}
              </div>
              <p className="font-medium text-slate-900 text-lg mb-1">
                {t.name}
              </p>
              <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full mb-3 inline-block">
                {t.specialty}
              </span>
              <p className="text-sm text-slate-500 mb-3">
                {t.exp} de experiencia
              </p>
              <div className="flex gap-2 flex-wrap mb-3 justify-center">
                {t.types.map((tp) => (
                  <span
                    key={tp}
                    className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-lg"
                  >
                    {tp}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 mb-5 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="ti ti-star text-amber-400 text-sm" />
                ))}
                <span className="text-sm text-slate-500 ml-1">{t.rating}</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Agendar sesión
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
