import { ElementType, exportElements, Frame, importElements } from "../hooks/useElements";
import { Design } from "../services/designService";
import { generateAngularProject } from "../utils/GenerateAngular";

type Props = {
  onAddElement: (type: ElementType) => void;
  elements: Frame[];
  onImport: (data: Frame[]) => void;
  currentDesign: Design | null;
};

export default function Toolbar({ onAddElement, elements, onImport, currentDesign }: Props) {
  const btnBase = "w-full px-4 py-2 text-sm font-medium rounded-md transition";
  const secondaryBtn  = "bg-gray-100 text-gray-800 hover:bg-gray-200";
  const primaryBtn = "bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50";

  return (
    <div className="w-64 bg-white shadow-lg p-5 border-r border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">🛠️ Herramientas</h2>

      <div className="space-y-3">
        <button onClick={() => onAddElement("rectangle")} className={`${btnBase} ${primaryBtn}`}>
          + Rectángulo
        </button>
        <button onClick={() => onAddElement("text")} className={`${btnBase} ${primaryBtn}`}>
          + Texto
        </button>
        <button onClick={() => onAddElement("button")} className={`${btnBase} ${primaryBtn}`}>
          + Botón
        </button>
        <button onClick={() => onAddElement("input")} className={`${btnBase} ${primaryBtn}`}>
          + Input
        </button>
        <button onClick={() => onAddElement("checkbox")} className={`${btnBase} ${primaryBtn}`}>
          + Checkbox
        </button>
        <button onClick={() => onAddElement("image")} className={`${btnBase} ${primaryBtn}`}>
          + Imagen
        </button>
        <button onClick={() => onAddElement("table")} className={`${btnBase} ${primaryBtn}`}>
          + Tabla
        </button>
      </div>

      <div className="border-t border-gray-300 my-6"></div>

      <div className="space-y-3">
        <button onClick={() => exportElements(elements)} className={`${btnBase} ${secondaryBtn}`}>
          💾 Exportar JSON
        </button>
        <button onClick={() => importElements(onImport)} className={`${btnBase} ${secondaryBtn}`}>
          📂 Importar JSON
        </button>
        <button
          onClick={() =>
            currentDesign ? generateAngularProject(currentDesign) : alert("❌ No hay diseño cargado.")
          }
          className={`${btnBase} ${secondaryBtn}`}
          disabled={!currentDesign}
        >
          🚀 Exportar Angular
        </button>
      </div>
    </div>
  );
}
