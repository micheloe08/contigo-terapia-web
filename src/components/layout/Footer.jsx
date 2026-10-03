export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-3 md:mb-4">
              <img src="/logo-blanco.png" alt="Contigo Terapia" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 md:mb-5">
              Conectando personas con el apoyo profesional que merecen.
            </p>
            <div className="flex gap-4">
              <i className="ti ti-brand-instagram text-slate-400 text-xl cursor-pointer hover:text-white" />
              <i className="ti ti-brand-facebook text-slate-400 text-xl cursor-pointer hover:text-white" />
              <i className="ti ti-brand-tiktok text-slate-400 text-xl cursor-pointer hover:text-white" />
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
              <p className="font-medium text-white mb-3 md:mb-4">
                {col.title}
              </p>
              <div className="flex flex-col gap-2 md:gap-3">
                {col.links.map((l) => (
                  <span
                    key={l}
                    className="text-sm text-slate-400 cursor-pointer hover:text-white transition-colors"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-5 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-xs md:text-sm text-slate-500 text-center md:text-left">
            © 2026 Contigo Terapia. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-2">
            <i className="ti ti-shield-check text-blue-400" />
            <span className="text-sm text-blue-400">Plataforma segura</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
