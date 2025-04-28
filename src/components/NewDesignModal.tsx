import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
};

export default function NewDesignModal({ isOpen, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Nuevo Proyecto</h2>

        <input
          type="text"
          placeholder="Título del diseño"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onCreate(title.trim());
                setTitle("");
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
