import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../api/auth";
import { Button } from "../ui/button";

export default function DashboardNavbar({ icon, label }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo-negro.png" alt="Contigo Terapia" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className={`ti ${icon} text-blue-600 text-sm`} />
            </div>
            <span className="text-sm text-slate-600 hidden sm:inline">
              {label}
            </span>
          </div>
          <Button
            variant="cta-muted"
            onClick={handleLogout}
            className="h-auto px-3 sm:px-4 py-2 text-sm"
          >
            <span className="hidden sm:inline">Cerrar sesión</span>
            <i className="ti ti-logout sm:hidden text-base" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
