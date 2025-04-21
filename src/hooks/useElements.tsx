import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../socket";

export type ElementType = "rectangle" | "text" | "button" | "input";

export type Frame = {
  id: string;
  type: ElementType;
  content?: string;
  translate: [number, number];
  rotate: number;
  width: number;
  height: number;
};
export function exportElements(elements: Frame[]) {
    const blob = new Blob([JSON.stringify(elements, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  export function importElements(callback: (data: Frame[]) => void) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
  
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (Array.isArray(json)) {
            callback(json as Frame[]);
          } else {
            alert("Archivo inválido.");
          }
        } catch {
          alert("Error al leer el archivo.");
        }
      };
      reader.readAsText(file);
    };
   
    input.click();
  }
export function useElements() {
    const [elements, setElements] = useState<Frame[]>(() => {
        const saved = localStorage.getItem("canvas-elements");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("canvas-elements", JSON.stringify(elements));
      }, [elements]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const setAllElements = (data: Frame[]) => {
    setElements(data);
    setSelectedId(null);
    socket.emit("elements:set", { roomId: "room-1", elements: data });
  };
  const addElement = (type: ElementType) => {
    const id = uuidv4();
    const baseWidth = type === "input" ? 200 : 150;
    const baseHeight = type === "text" ? 40 : 60;
    
    const newElement: Frame = {
      id,
      type,
      content:
        type === "text"
          ? "Texto de ejemplo"
          : type === "button"
          ? "Botón"
          : type === "input"
          ? "Escribe aquí"
          : "",
      translate: [100 + elements.length * 30, 100],
      rotate: 0,
      width: baseWidth,
      height: baseHeight,
    };
    socket.emit("element:add", { roomId: "room-1", frame: newElement });
    setElements((prev) => [...prev, newElement]);
  };

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    socket.emit("element:delete", { roomId: "room-1", elementId: id });
  };

  const duplicateElement = (newFrame: Frame) => {
    setElements((prev) => [...prev, newFrame]);
    socket.emit("element:duplicate", { roomId: "room-1", frame: newFrame });
  };

    useEffect(() => {
    socket.on("element:add", (frame: Frame) => {
      setElements((prev) => [...prev, frame]);
    });

    socket.on("element:update", (updated: Frame) => {
      setElements((prev) =>
        prev.map((el) => (el.id === updated.id ? updated : el))
      );
    });

    socket.on("element:delete", (id: string) => {
      setElements((prev) => prev.filter((el) => el.id !== id));
    });

    return () => {
      socket.off("element:add");
      socket.off("element:update");
      socket.off("element:delete");
    };
  }, []);
  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log("🛰️ Evento recibido:", event, args);
    });
  }, []);
  return {
    elements,
    selectedId,
    addElement,
    deleteElement,
    duplicateElement,
    setSelectedId,
    setAllElements,
  };
}
