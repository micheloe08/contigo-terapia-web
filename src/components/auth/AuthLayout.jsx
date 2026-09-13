export default function AuthLayout({ title, subtitle, error, wide = false, children, footer }) {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className={`w-full ${wide ? "max-w-lg" : "max-w-md"}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-heart text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-medium text-blue-900">{title}</h1>
          <p className="text-blue-600 mt-1 text-sm">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {children}

          {footer && <div className="mt-6 text-center space-y-2">{footer}</div>}
        </div>

        <p className="text-center text-xs text-blue-400 mt-6">
          © 2026 Contigo Terapia · Plataforma segura
        </p>
      </div>
    </div>
  );
}
