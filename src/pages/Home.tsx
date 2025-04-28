import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewDesignModal from "../components/NewDesignModal";
import { createDesign, getDesignsByUser, Design, getDesignById } from "../services/designService";
import JoinProjectModal from "../components/JoinProjectModal";

export default function Home() {
  const [user, setUser] = useState<{ name: string; picture: string; email: string } | null>(null);
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.email) {
      setUser(storedUser);
      fetchDesigns(storedUser.email);
    }
  }, []);

  const fetchDesigns = async (email: string) => {
    const data = await getDesignsByUser(email);
    setDesigns(data);
  };

  const handleCreateDesign = async (title: string) => {
    const token = localStorage.getItem("token");
    if (!token || !user?.email) {
      alert("Debes estar logueado para crear un diseño.");
      return;
    }

    const newDesign = await createDesign({
      title,
      userEmail: user.email,
      data: [],
    });

    setShowModal(false);
    navigate(`/canvas/${newDesign.id}`);
  };
  const handleJoinProject = async (roomId: string) => {
    try {
      const design = await getDesignById(roomId);
      if (design) {
        setShowJoinModal(false);
        navigate(`/canvas/${design.id}`);
      }
    } catch (error) {
      alert("❌ No se encontró un proyecto con ese ID.");
    }
  };
  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-[calc(100vh-3.5rem)]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">🎨 Bienvenido al Editor Visual</h1>
          <p className="text-gray-600">Crea o únete a una sala de colaboración en tiempo real.</p>
          <div className="flex flex-col items-center gap-4 mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear proyecto
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Unirse a un proyecto
          </button>
          </div>
        </div>

        {user && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">📂 Tus Proyectos Recientes</h2>
            {designs.length === 0 ? (
              <p className="text-gray-500">No tienes proyectos aún.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {designs.map((design) => (
                  <div
                    key={design.id}
                    className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/canvas/${design.id}`)}
                  >
                    <h3 className="font-bold">{design.title}</h3>
                    <p className="text-xs text-gray-500">
                      Última edición: {new Date(design.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <NewDesignModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateDesign}
        />
        <JoinProjectModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinProject}
        />
      </div>
    </>
  );
}
