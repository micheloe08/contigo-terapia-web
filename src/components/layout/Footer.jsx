export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ti ti-heart text-white text-xs" />
              </div>
              <span className="font-medium text-slate-900">
                Contigo Terapia
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4 md:mb-5">
              Conectando personas con el apoyo profesional que merecen.
            </p>
            <div className="flex gap-4">
              <i className="ti ti-brand-instagram text-blue-600 text-xl cursor-pointer hover:text-blue-800" />
              <i className="ti ti-brand-facebook text-blue-600 text-xl cursor-pointer hover:text-blue-800" />
              <i className="ti ti-brand-tiktok text-blue-600 text-xl cursor-pointer hover:text-blue-800" />
            </div>
          </div>
          {[
            {
              title: "Plataforma",
              links: ["Terapeutas", "Especialidades", "Cómo funciona"],
            },
            {
              title: "Legal",
              links: ["Privacidad", "Términos", "Manejo de datos"],
            },
            {
              title: "Contacto",
              links: ["hola@contigo.com", "WhatsApp", "Soporte"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-medium text-slate-900 mb-3 md:mb-4">
                {col.title}
              </p>
              <div className="flex flex-col gap-2 md:gap-3">
                {col.links.map((l) => (
                  <span
                    key={l}
                    className="text-sm text-slate-500 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-5 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-xs md:text-sm text-slate-400 text-center md:text-left">
            © 2026 Contigo Terapia. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-2">
            <i className="ti ti-shield-check text-blue-600" />
            <span className="text-sm text-blue-600">Plataforma segura</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
