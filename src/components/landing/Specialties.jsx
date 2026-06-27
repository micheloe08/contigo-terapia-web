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

export default function Specialties() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-2">
          Especialidades
        </p>
        <h2 className="text-3xl font-medium text-slate-900 mb-10">
          Encontramos al especialista que necesitas
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {SPECIALTIES.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
            >
              <i className={`ti ${s.icon} text-blue-600 text-3xl mb-3 block`} />
              <p className="font-medium text-slate-800">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
