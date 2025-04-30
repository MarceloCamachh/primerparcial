import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewDesignModal from "../components/NewDesignModal";
import JoinProjectModal from "../components/JoinProjectModal";
import { createDesign, getDesignsByUser, Design, getDesignById, deleteDesign } from "../services/designService";
import { generateDesignFromUML } from "../utils/generateDesignFromUML";
import { parseXMLFile } from "../utils/parseXML";

export default function Home() {
  const [user, setUser] = useState<{ name: string; picture: string; email: string } | null>(null);
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const parsed = await parseXMLFile(file);
    const extractedDesign = generateDesignFromUML(parsed);

    if (!user?.email) {
      alert("Debes estar logueado para importar un UML");
      return;
    }

    const savedDesign = await createDesign({
      title: extractedDesign.title,
      data: extractedDesign.elements,
      userEmail: user.email,
    });

    navigate(`/canvas/${savedDesign.id}`);
  };

  const handleCreateDesign = async (title: string) => {
    if (!user?.email) {
      alert("Debes estar logueado para crear un diseño.");
      return;
    }

    const newDesign = await createDesign({ title, userEmail: user.email, data: [] });
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
    } catch {
      alert("❌ No se encontró un proyecto con ese ID.");
    }
  };

  const handleDeleteDesign = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este diseño?")) return;
    try {
      await deleteDesign(id);
      setDesigns(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      alert("❌ Error al eliminar el diseño.");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-800">🎨 Bienvenido al Editor Visual</h1>
          <p className="mt-2 text-gray-600 text-lg">Crea o únete a un proyecto colaborativo en tiempo real.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
            >
              ➕ Crear proyecto
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow hover:bg-emerald-700 transition"
            >
              🤝 Unirse a un proyecto
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition"
            >
              📂 Importar UML
            </button>
          </div>
        </section>

        <input
          type="file"
          accept=".xml"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleUploadXML}
        />

        {user && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📂 Tus Proyectos Recientes</h2>
            {designs.length === 0 ? (
              <p className="text-gray-500">No tienes proyectos aún.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {designs.map((design) => (
                  <div
                    key={design.id}
                    className="relative p-4 border border-gray-200 rounded-lg bg-white shadow hover:shadow-lg hover:border-indigo-400 transition cursor-pointer"
                    onClick={() => navigate(`/canvas/${design.id}`)}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">{design.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Última edición: {new Date(design.updatedAt).toLocaleString()}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDesign(design.id);
                      }}
                      className="absolute top-2 right-2 text-xs px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
         <section className="mt-20 max-w-6xl mx-auto text-center px-4">
  <h2 className="text-3xl font-bold text-gray-800 mb-6">💡 ¿Por qué usar nuestro editor?</h2>
  <div className="grid gap-8 md:grid-cols-3 text-left">
    <div>
      <h3 className="text-xl font-semibold text-indigo-700">Diseño en tiempo real</h3>
      <p className="mt-2 text-gray-600">Colabora en vivo con tu equipo y visualiza cambios al instante.</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-indigo-700">Importa diagramas UML</h3>
      <p className="mt-2 text-gray-600">Convierte bocetos o XML UML directamente en interfaces editables.</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-indigo-700">Exporta código Angular</h3>
      <p className="mt-2 text-gray-600">Transforma tus diseños visuales en componentes listos para producción.</p>
    </div>
  </div>
</section>
<section className="mt-24 bg-white py-12">
  <div className="max-w-4xl mx-auto text-center px-4">
    <p className="text-4xl font-bold text-gray-800 leading-snug">
      “Todo lo que necesitas para crear y compartir interfaces está en una sola herramienta.”
    </p>
    <p className="mt-4 text-lg text-gray-500">– Equipo de desarrollo</p>
  </div>
</section>
<section className="mt-20 max-w-5xl mx-auto px-4">
  <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">✨ Inspiración Visual</h2>
  <div className="grid sm:grid-cols-2 gap-6">
    <img src="https://digitalfactoria.com/wp-content/uploads/2023/04/Figma-1-1024x1024.jpg" alt="Diseño 1" className="rounded-lg shadow-lg" />
    <img src="https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/1f7ebf0e8dca18b664ce79ff3d6c428d11e8a70a" alt="Diseño 2" className="rounded-lg shadow-lg" />
  </div>
</section>

        <NewDesignModal isOpen={showModal} onClose={() => setShowModal(false)} onCreate={handleCreateDesign} />
        <JoinProjectModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} onJoin={handleJoinProject} />
      </main>
     
    </>
  );
}
