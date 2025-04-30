import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => setShowLogoutModal(true);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const logoutMessage = location.pathname.startsWith("/canvas")
    ? "Estás en medio de la edición de un proyecto. Si cierras sesión ahora podrías perder los cambios. ¿Deseas continuar?"
    : "¿Estás seguro que deseas cerrar sesión?";

  return (
    <>
      <header className="w-full h-16 bg-white shadow-md flex items-center justify-between px-8 border-b border-gray-200">
        <Link to="/" className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition">
          🏠 Inicio
        </Link>

        <h1 className="text-4xl font-bold tracking-tight text-black text-indigo-700">MyEDITOR</h1>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <img src={user.picture} alt="avatar" className="w-9 h-9 rounded-full object-cover border" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <a
              href={`${BACKEND_URL}/auth/google`}
              className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Iniciar con Google
            </a>
          )}
        </div>
      </header>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        message={logoutMessage}
      />
    </>
  );
}
