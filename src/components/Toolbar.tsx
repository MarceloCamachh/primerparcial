import { ElementType, exportElements, Frame, importElements } from "../hooks/useElements";
import { generateAngularProject } from "../utils/GenerateAngular";
import { Design } from "../services/designService";  // Importa el tipo Design

type Props = {
  onAddElement: (type: ElementType) => void;
  elements: Frame[];
  onImport: (data: Frame[]) => void;
  currentDesign: Design | null;
};

export default function Toolbar({ onAddElement, elements, onImport, currentDesign }: Props) {
  return (
    <div className="w-60 bg-white shadow-md p-4">
      <h2 className="font-bold text-lg mb-4">Herramientas</h2>
      <button
        onClick={() => onAddElement("rectangle")}
        className="w-full py-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Rectángulo
      </button>
      <button
        onClick={() => onAddElement("text")}
        className="w-full py-2 mb-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + Texto
      </button>
      <button
        onClick={() => onAddElement("button")}
        className="w-full py-2 mb-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        + Botón
      </button>
      <button
        onClick={() => onAddElement("input")}
        className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        + Input
      </button>
      <button onClick={() => onAddElement('checkbox')} className="w-full mt-2 bg-indigo-500 text-white px-2 py-1 rounded">+ Checkbox</button>
      <button onClick={() => onAddElement('image')} className="w-full mt-2 bg-pink-500 text-white px-2 py-1 rounded">+ Imagen</button>
      <button onClick={() => onAddElement('table')} className="w-full mt-2 bg-yellow-600 text-white px-2 py-1 rounded">+ Tabla</button>
      <button
        onClick={() => exportElements(elements)}
        className="w-full py-2 mt-4 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
        💾 Exportar JSON
        </button>
        <button
            onClick={() => importElements(onImport)}
            className="w-full py-2 mt-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
            📂 Importar JSON
        </button>
        <button
          onClick={() => {
            if (currentDesign) {
              generateAngularProject(currentDesign);
            } else {
              alert("❌ No hay diseño cargado.");
            }
          }}
          className="w-full py-2 mt-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={!currentDesign}
        >
          🚀 Exportar Angular
        </button>
    </div>
  );
}
