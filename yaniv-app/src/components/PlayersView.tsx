import { useState } from "react";
import { useGameStore } from "../store";
import type { Player } from "../lib/scoring.js";

const PlayersView = () => {
  const {
    players,
    addPlayer,
    updatePlayerName,
    removePlayer,
    reorderPlayers,
    startRound,
  } = useGameStore();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      addPlayer(newPlayerName);
      setNewPlayerName("");
    }
  };

  const handleEditStart = (player: Player) => {
    setEditingId(player.id);
    setEditingName(player.name);
  };

  const handleEditSave = () => {
    if (editingId && editingName.trim()) {
      updatePlayerName(editingId, editingName);
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex !== dropIndex) {
      reorderPlayers(dragIndex, dropIndex);
    }
  };

  const canStartGame = players.length >= 2;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Players</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add players to start a new game
        </p>
      </div>

      {/* Add Player Form */}
      <div className="card p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            className="input flex-1"
            maxLength={20}
            onKeyPress={(e) => e.key === "Enter" && handleAddPlayer()}
          />
          <button
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim() || players.length >= 8}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        {players.length >= 8 && (
          <p className="text-sm text-gray-500 mt-2">
            Maximum 8 players reached
          </p>
        )}
      </div>

      {/* Players List */}
      {players.length > 0 && (
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-4">
            Current Players ({players.length}/8)
          </h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Drag Handle */}
                <div className="cursor-move text-gray-400 hover:text-gray-600">
                  ⋮⋮
                </div>

                {/* Player Avatar */}
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {player.name.charAt(0).toUpperCase()}
                </div>

                {/* Player Name */}
                {editingId === player.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="input flex-1"
                      autoFocus
                      onKeyPress={(e) => e.key === "Enter" && handleEditSave()}
                      onKeyDown={(e) =>
                        e.key === "Escape" && handleEditCancel()
                      }
                    />
                    <button
                      onClick={handleEditSave}
                      className="btn-success text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="btn-secondary text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="font-medium">{player.name}</span>
                  </div>
                )}

                {/* Actions */}
                {editingId !== player.id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditStart(player)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="Edit player name"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Remove player"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Game Button */}
      {canStartGame && (
        <div className="text-center">
          <button
            onClick={startRound}
            className="btn-primary text-lg px-8 py-3"
          >
            Start Round
          </button>
        </div>
      )}

      {players.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No players yet. Add at least 2 players to start a game.
        </div>
      )}
    </div>
  );
};

export default PlayersView;
