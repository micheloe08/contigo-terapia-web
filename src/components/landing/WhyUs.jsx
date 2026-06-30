const WHY_US = [
  {
    icon: "ti-shield-check",
    title: "Terapeutas certificados",
    desc: "Todos con cédula profesional verificada y mínimo 5 años de experiencia clínica.",
  },
  {
    icon: "ti-lock",
    title: "Sesiones confidenciales",
    desc: "Tu privacidad garantizada. Videollamadas cifradas y datos protegidos en todo momento.",
  },
  {
    icon: "ti-clock",
    title: "Disponibilidad 7 días",
    desc: "Horarios flexibles incluyendo noches y fines de semana para adaptarse a tu vida.",
  },
  {
    icon: "ti-credit-card",
    title: "Pago seguro y flexible",
    desc: "Múltiples métodos de pago. Cancela hasta 16 horas antes sin ningún cargo.",
  },
  {
    icon: "ti-device-mobile",
    title: "Desde cualquier dispositivo",
    desc: "Accede desde tu celular, tablet o computadora. Sin descargas, sin complicaciones.",
  },
  {
    icon: "ti-messages",
    title: "3 modalidades de atención",
    desc: "Videollamada, chat en tiempo real o consulta presencial. Tú eliges cómo conectar.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-12 md:py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-2">
          Por qué elegirnos
        </p>
        <h2 className="text-2xl md:text-3xl font-medium text-blue-900 mb-8 md:mb-10">
          Tu bienestar es nuestra prioridad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {WHY_US.map((w) => (
            <div
              key={w.title}
              className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <i className={`ti ${w.icon} text-blue-600 text-2xl`} />
              </div>
              <p className="font-medium text-slate-900 text-base md:text-lg mb-2">
                {w.title}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
