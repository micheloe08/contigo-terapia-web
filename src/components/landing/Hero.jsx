import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-between gap-12">
        <div className="flex-1">
          <span className="bg-blue-200 text-blue-900 text-xs font-medium px-3 py-1 rounded-full">Terapia online certificada</span>
          <h1 className="text-5xl font-medium text-blue-900 mt-5 mb-5 leading-tight">Tu bienestar mental,<br />desde donde estés</h1>
          <p className="text-blue-700 text-lg leading-relaxed mb-8 max-w-lg">Conecta con psicólogos certificados por videollamada, chat o presencial. Agenda en minutos, sin listas de espera.</p>
          <div className="flex gap-4">
            <Link to="/registro/paciente">
              <button className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-7 py-3 rounded-lg text-base font-medium transition-colors">
                Encontrar mi terapeuta
              </button>
            </Link>
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-900 border-2 border-blue-300 px-7 py-3 rounded-lg text-base font-medium transition-colors">
              Ver cómo funciona
            </button>
          </div>
          <div className="flex gap-10 mt-12">
            {[
              { val: '+150', label: 'terapeutas' },
              { val: '4.9', label: 'calificación promedio' },
              { val: '48h', label: 'primera cita disponible' },
            ].map((s, i) => (
              <div key={i} className={i > 0 ? 'border-l border-blue-300 pl-10' : ''}>
                <span className="text-3xl font-medium text-blue-900">{s.val}</span>
                <p className="text-sm text-blue-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-96 h-80 bg-blue-100 rounded-2xl flex items-center justify-center border border-blue-200">
            <div className="text-center">
              <i className="ti ti-heart text-blue-300 text-8xl mb-4 block" />
              <p className="text-blue-400 text-sm">Imagen ilustrativa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}