import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  };

  return (
    <header className="w-full h-14 bg-white shadow flex items-center justify-between px-6 border-b border-gray-200">
      <h1 className="text-lg font-bold">Mi Editor</h1>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <img
                src={user.picture}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <a
            href={`${BACKEND_URL}/auth/google`}
            className="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Iniciar con Google
          </a>
        )}
      </div>
    </header>
  );
}
