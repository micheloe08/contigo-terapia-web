export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/526671234567?text=Hola,%20me%20interesa%20agendar%20una%20sesión"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
    >
      <i className="ti ti-brand-whatsapp text-white text-2xl" />
    </a>
  );
}
