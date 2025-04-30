import { useRef, useState } from "react";
import Moveable from "react-moveable";
import { v4 as uuidv4 } from "uuid";
import { Frame } from "../hooks/useElements";
import { socket } from "../socket";

export default function CanvasElement({
  frame,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  roomId,
}: {
  frame: Frame;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: (newFrame: Frame) => void;
  roomId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [update, setUpdate] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(frame.content || "");
  const [showMenu, setShowMenu] = useState(false);

  const applyStyle = () => {
    const el = ref.current;
    if (el) {
      el.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;
      el.style.width = `${frame.width}px`;
      el.style.height = `${frame.height}px`;
    }
  };

  return (
    <>
      <div
        ref={ref}
        onClick={(e) => {
            e.stopPropagation(); // ✅ Esto evita que el click llegue al canvas
            onSelect();          // ✅ Esto selecciona el elemento
        }}
        className="absolute cursor-pointer flex items-center justify-center text-sm select-none"
        style={{
          transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`,
          width: `${frame.width}px`,
          height: `${frame.height}px`,
        }}
      >
        {frame.type === "rectangle" && (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: frame.backgroundColor || "#38bdf8", // "#38bdf8" = tailwind sky-400
            }}
          />
        )}

        {!isEditing && frame.type === "button" && (
            <div
            className="text-white rounded flex items-center justify-center w-full h-full"
            style={{ backgroundColor: frame.backgroundColor || "#3b82f6" }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {frame.content}
          </div>
        )}

        {!isEditing && frame.type === "text" && (
         <div
         className="w-full h-full flex items-center justify-center"
         style={{
           fontSize: `${Math.max(frame.width / 15, 12)}px`,
           color: "black",
         }}
         onDoubleClick={() => setIsEditing(true)}
       >
         {frame.content}
       </div>
        )}
        {/* CHECKBOX */}
          {frame.type === "checkbox" && (
            <label className="flex items-center space-x-2 w-full h-full justify-center">
              <input type="checkbox" className="h-5 w-5" />
              <span>{frame.content || "Opción"}</span>
            </label>
          )}

          {/* IMAGE */}
          {frame.type === "image" && (
          <div className="w-full h-full relative">
            <img
              src={frame.content || "https://via.placeholder.com/150"}
              alt="Imagen"
              className="w-full h-full object-contain"
            />
            {isSelected && (
              <input
                type="file"
                accept="image/*"
                className="absolute bottom-2 left-2 text-xs z-50"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    frame.content = reader.result as string;
                    setUpdate((u) => u + 1);
                    socket.emit("element:update", { roomId, frame });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            )}
          </div>
        )}

          {/* TABLE */}
          {frame.type === "table" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-xs">
    <table className="table-auto border border-black w-full h-full text-center">
      <tbody>
        {Array.from({ length: Number(frame.rows) || 3 }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {Array.from({ length: Number(frame.cols) || 3 }).map((_, colIdx) => (
              <td key={colIdx} className="border border-black">
                {`Celda ${rowIdx + 1}-${colIdx + 1}`}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    {isSelected && (
      <div className="absolute bottom-1 left-1 bg-white bg-opacity-80 px-1 py-0.5 rounded border text-[10px] flex items-center gap-1">
        <label>
          Filas:
          <input
            type="number"
            min={1}
            className="border ml-1 w-10"
            value={frame.rows || 3}
            onChange={(e) => {
              frame.rows = Number(e.target.value);
              setUpdate((u) => u + 1);
              socket.emit("element:update", { roomId, frame });
            }}
          />
        </label>
        <label>
          Columnas:
          <input
            type="number"
            min={1}
            className="border ml-1 w-10"
            value={frame.cols || 3}
            onChange={(e) => {
              frame.cols = Number(e.target.value);
              setUpdate((u) => u + 1);
              socket.emit("element:update", { roomId, frame });
            }}
          />
        </label>
      </div>
    )}
  </div>
)}


        {(frame.type === "text" || frame.type === "button") && isEditing && (
          <input
            autoFocus
            className="border text-xs px-1 py-0.5 rounded w-full"
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            onBlur={() => {
              frame.content = tempContent;
              setIsEditing(false);
              setUpdate((u) => u + 1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                frame.content = tempContent;
                setIsEditing(false);
                setUpdate((u) => u + 1);
              }
            }}
          />
        )}

        {frame.type === "input" && !isEditing && (
          <input
            type="text"
            className="border px-2 py-1 rounded w-full h-full"
            placeholder={frame.content}
            readOnly
            onDoubleClick={() => setIsEditing(true)}
          />
        )}

        {frame.type === "input" && isEditing && (
          <input
            autoFocus
            className="border text-xs px-1 py-0.5 rounded w-full"
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            onBlur={() => {
              frame.content = tempContent;
              setIsEditing(false);
              setUpdate((u) => u + 1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                frame.content = tempContent;
                setIsEditing(false);
                setUpdate((u) => u + 1);
              }
            }}
          />
        )}
      </div>

      {isSelected && (
        <>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="absolute z-20 text-lg bg-white border border-gray-300 rounded px-1 shadow-sm"
            style={{
              top: frame.translate[1] - 20,
              left: frame.translate[0] + frame.width - 30,
            }}
          >
            ⋮
          </button>

          {showMenu && (
            <div
              className="absolute z-30 bg-white border border-gray-300 rounded shadow-md text-sm"
              style={{
                top: frame.translate[1],
                left: frame.translate[0] + frame.width + 10,
              }}
            >
             {(frame.type === "rectangle" || frame.type === "button") && (
                <div className="block w-full px-3 py-1 text-left">
                  🎨 Cambiar color:
                  <input
                    type="color"
                    className="ml-2"
                    value={frame.backgroundColor || "#38bdf8"}
                    onChange={(e) => {
                      frame.backgroundColor = e.target.value;
                      setUpdate((u) => u + 1);
                      setShowMenu(false);
                    }}
                  />
                </div>
              )}
              <button
                onClick={() => {
                  const newFrame = {
                    ...frame,
                    id: uuidv4(),
                    translate: [frame.translate[0] + 20, frame.translate[1] + 20] as [number, number],
                  };
                  onDuplicate(newFrame);
                  setShowMenu(false);
                }}
                className="block w-full px-3 py-1 hover:bg-gray-100 text-left"
              >
                ➕ Duplicar
              </button>

              <button
                onClick={() => {
                  ref.current?.parentElement?.appendChild(ref.current);
                  setShowMenu(false);
                }}
                className="block w-full px-3 py-1 hover:bg-gray-100 text-left"
              >
                🔝 Traer al frente
              </button>

              <button
                onClick={() => {
                  ref.current?.parentElement?.prepend(ref.current);
                  setShowMenu(false);
                }}
                className="block w-full px-3 py-1 hover:bg-gray-100 text-left"
              >
                🔙 Enviar al fondo
              </button>

              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="block w-full px-3 py-1 text-red-600 hover:bg-red-100 text-left"
              >
                🗑️ Eliminar
              </button>
            </div>
          )}
        </>
      )}

        {isSelected && (
        <Moveable
            target={ref}
            origin={false}
            draggable
            resizable
            rotatable
            onDrag={({ beforeTranslate }) => {
            frame.translate = [beforeTranslate[0], beforeTranslate[1]];
            applyStyle();
            socket.emit("element:update", { roomId, frame });

            }}
            onResize={({ width, height, drag }) => {
            frame.width = width;
            frame.height = height;
            frame.translate = [
                drag.beforeTranslate[0],
                drag.beforeTranslate[1],
            ];
            applyStyle();
            socket.emit("element:update", { roomId, frame });
            }}
            onRotate={({ beforeRotate }) => {
            frame.rotate = beforeRotate;
            applyStyle();
            socket.emit("element:update", { roomId, frame });
            }}
            onDragEnd={() => setUpdate((u) => u + 1)}
            onResizeEnd={() => setUpdate((u) => u + 1)}
            onRotateEnd={() => setUpdate((u) => u + 1)}
        />
        )}
    </>
  );
}
