import React, { useState } from "react";

interface JoinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
}

export default function JoinProjectModal({ isOpen, onClose, onJoin }: JoinProjectModalProps) {
  const [roomId, setRoomId] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">🔗 Unirse a un Proyecto</h2>
        <input
          type="text"
          placeholder="Ingresa el ID del proyecto"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => onJoin(roomId)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Unirse
          </button>
        </div>
      </div>
    </div>
  );
}
