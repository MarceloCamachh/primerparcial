import { useElements } from "../hooks/useElements";
import Toolbar from "./Toolbar";
import CanvasElement from "./CanvasElement";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useParams } from "react-router-dom";
import {getDesignById,updateDesign,Design,} from "../services/designService";

export default function CanvasEditor() {
  const params = useParams<{ roomId?: string }>();
  const roomId = params.roomId;
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  
  if (!roomId) {
    return <div className="text-red-500 text-center mt-10">❌ Room ID inválido</div>;
  }
  const {
    elements,
    selectedId,
    addElement,
    deleteElement,
    duplicateElement,
    setSelectedId,
    setAllElements,
  } = useElements(roomId);

  const handleSave = async () => {
    if (!currentDesign) return alert("⚠️ No hay diseño para guardar");
  
    const updated = await updateDesign(currentDesign.id, {
      data: elements,
    });
  
    setCurrentDesign(updated);
    alert("✅ Diseño actualizado");
  };
  

  useEffect(() => {
  const fetchDesign = async () => {
    if (!roomId) return;
    const design = await getDesignById(roomId);
    setCurrentDesign(design);
    setAllElements(design.data || []);
    socket.emit("join", roomId);
    console.log("🧩 Joined room:", roomId);
  };

  fetchDesign();
}, [roomId]);

  return (
    <>
      <Navbar />
      <div className="flex w-full h-[calc(100vh-3.5rem)] bg-gray-100">
      <Toolbar
        onAddElement={addElement}
        elements={elements}
        onImport={setAllElements}
        currentDesign={currentDesign}  
      />
  
        <div
          className="relative flex-1"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedId(null);
            }
          }}
          >
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              frame={element}
              isSelected={element.id === selectedId}
              onSelect={() => setSelectedId(element.id)}
              onDelete={() => deleteElement(element.id)}
              onDuplicate={duplicateElement}
              roomId={roomId}
            />
          ))}
           <button
          onClick={handleSave}
          className="absolute top-4 right-4 px-4 py-2  text-white rounded hover:bg-green-600 z-50 bg-gray-500 text-gray-800 hover:bg-gray-200"
        >
          💾 Guardar diseño
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(roomId);
            alert("📋 ID copiado al portapapeles: " + roomId);
          }}
          className="px-4 py-2 bg-gray-500 text-white mt-4 ml-4 rounded hover:bg-blue-600"
        >
          🔗 Compartir ID
        </button>
        </div>
      </div>
     
    </>
    
  );
}
