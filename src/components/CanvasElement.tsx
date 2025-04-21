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
}: {
  frame: Frame;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: (newFrame: Frame) => void;
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
        {frame.type === "rectangle" && <div className="w-full h-full bg-sky-400" />}

        {(frame.type === "text" || frame.type === "button") && !isEditing && (
          <div
            className={
              frame.type === "button"
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "text-black"
            }
            onDoubleClick={() => setIsEditing(true)}
          >
            {frame.content}
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
                <button
                  onClick={() => {
                    const color = prompt("Nuevo color de fondo (ej: red, #ff0, rgb(0,0,255)):");
                    if (color && ref.current) {
                      ref.current.style.backgroundColor = color;
                    }
                    setShowMenu(false);
                  }}
                  className="block w-full px-3 py-1 hover:bg-gray-100 text-left"
                >
                  🎨 Cambiar color
                </button>
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
            socket.emit("element:update", { roomId: "room-1", frame });

            }}
            onResize={({ width, height, drag }) => {
            frame.width = width;
            frame.height = height;
            frame.translate = [
                drag.beforeTranslate[0],
                drag.beforeTranslate[1],
            ];
            applyStyle();
            socket.emit("element:update", { roomId: "room-1", frame });
            }}
            onRotate={({ beforeRotate }) => {
            frame.rotate = beforeRotate;
            applyStyle();
            socket.emit("element:update", { roomId: "room-1", frame });
            }}
            onDragEnd={() => setUpdate((u) => u + 1)}
            onResizeEnd={() => setUpdate((u) => u + 1)}
            onRotateEnd={() => setUpdate((u) => u + 1)}
        />
        )}
    </>
  );
}
