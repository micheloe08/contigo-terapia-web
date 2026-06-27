const FAQS = [
  {
    q: "¿Los terapeutas están certificados?",
    a: "Sí. Todos nuestros terapeutas cuentan con cédula profesional verificada y mínimo 5 años de experiencia clínica comprobada.",
  },
  {
    q: "¿Mis sesiones son confidenciales?",
    a: "Absolutamente. Todas las sesiones son privadas y cifradas. Tu información nunca será compartida con terceros.",
  },
  {
    q: "¿Puedo cancelar mi cita?",
    a: "Sí, puedes cancelar o reagendar hasta 16 horas antes de tu sesión sin ningún cargo adicional.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito y débito, así como transferencias bancarias a través de plataformas seguras.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs text-blue-600 font-medium tracking-widest uppercase mb-2">
          FAQ
        </p>
        <h2 className="text-3xl font-medium text-slate-900 mb-10">
          Preguntas frecuentes
        </h2>
        <div className="flex flex-col gap-4">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="bg-white border border-slate-200 rounded-xl p-6"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-slate-900">{f.q}</p>
                <i className="ti ti-chevron-down text-blue-600 text-lg" />
              </div>
              <p className="text-slate-500 mt-3 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
