import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import apiClient from "../../api/client";

// Inicializar Stripe con la clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Formulario de pago interno (necesita el contexto de Elements)
function CheckoutForm({ appointment, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paciente/citas?payment=success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    }
    // Si no hay error, Stripe redirige automáticamente al return_url
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Resumen de la cita */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h3 className="font-medium text-slate-900 mb-2 text-sm">Resumen de la sesión</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Terapeuta</span>
            <span className="font-medium">Dr(a). {appointment.doctor?.user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Especialidad</span>
            <span>{appointment.doctor?.specialty?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fecha</span>
            <span>{new Date(appointment.starts_at).toLocaleString("es-MX", {
              day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
            })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Modalidad</span>
            <span className="capitalize">{appointment.type}</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
            <span className="font-medium text-slate-900">Total</span>
            <span className="font-bold text-blue-600 text-base">
              ${Number(appointment.price).toLocaleString("es-MX")} {appointment.currency ?? "MXN"}
            </span>
          </div>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Información de pago</label>
        <div className="border border-slate-300 rounded-xl p-4">
          <PaymentElement />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando pago...
          </>
        ) : (
          <>
            <i className="ti ti-lock text-sm" />
            Pagar ${Number(appointment.price).toLocaleString("es-MX")} {appointment.currency ?? "MXN"}
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        <i className="ti ti-shield-check text-green-500" />
        Pago seguro procesado por Stripe. Tus datos están protegidos.
      </p>
    </form>
  );
}

// Página principal de checkout
export default function Checkout() {
  const [searchParams]                  = useSearchParams();
  const appointmentId                   = searchParams.get("appointment_id");
  const [clientSecret, setClientSecret] = useState(null);
  const [appointment, setAppointment]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const navigate                        = useNavigate();

  useEffect(() => {
    if (!appointmentId) {
      setError("No se especificó ninguna cita.");
      setLoading(false);
      return;
    }

    // Obtener detalles de la cita y crear el PaymentIntent
    Promise.all([
      apiClient.get(`/patient/appointments/${appointmentId}`),
      apiClient.post("/patient/payments/intent", { appointment_id: appointmentId }),
    ])
      .then(([aptRes, payRes]) => {
        setAppointment(aptRes.data);
        setClientSecret(payRes.data.client_secret);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error al preparar el pago.");
      })
      .finally(() => setLoading(false));
  }, [appointmentId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Preparando el pago...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <i className="ti ti-alert-circle text-5xl text-red-300 block mb-4" />
        <h2 className="text-lg font-medium text-slate-700 mb-2">{error}</h2>
        <button onClick={() => navigate("/paciente/citas")} className="text-blue-600 text-sm hover:underline">
          ← Volver a mis citas
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <img src="/logo-negro.png" alt="Contigo Terapia" className="h-8 w-auto" />
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <i className="ti ti-arrow-left text-sm" /> Volver
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-slate-900">Confirmar pago</h1>
          <p className="text-slate-500 mt-1">Completa el pago para confirmar tu sesión.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {clientSecret && appointment && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#2563eb",
                    borderRadius: "12px",
                    fontFamily: "Geist, system-ui, sans-serif",
                  },
                },
              }}
            >
              <CheckoutForm appointment={appointment} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
