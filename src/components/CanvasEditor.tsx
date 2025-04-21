import { useElements } from "../hooks/useElements";
import Toolbar from "./Toolbar";
import CanvasElement from "./CanvasElement";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { socket } from "../socket";

export default function CanvasEditor() {
  const {
    elements,
    selectedId,
    addElement,
    deleteElement,
    duplicateElement,
    setSelectedId,
    setAllElements,
  } = useElements();

  useEffect(() => {
    socket.emit("join", "room-1"); // Puedes cambiar a un ID dinámico
    console.log("Joined room-1");
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex w-full h-[calc(100vh-3.5rem)] bg-gray-100">
      <Toolbar
        onAddElement={addElement}
        elements={elements}
        onImport={setAllElements}
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
            />
          ))}
        </div>
      </div>
    </>
  );
}
