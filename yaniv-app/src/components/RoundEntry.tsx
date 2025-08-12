import React, { useState, useEffect } from "react";
import { useGameStore } from "../store";
import type { RoundInput } from "../lib/scoring.js";

const RoundEntry = () => {
  const { activePlayers, currentRoundInput, submitRound } = useGameStore();

  // Initialize input state from store or create default
  const [input, setInput] = useState<RoundInput>(() => {
    if (currentRoundInput && activePlayers.length > 0) {
      return currentRoundInput;
    }
    return {
      yanivCallerId: activePlayers[0]?.id || "",
      sums: Object.fromEntries(activePlayers.map((p) => [p.id, 0])),
    };
  });

  // Update local state when store changes
  useEffect(() => {
    console.log("RoundEntry useEffect:", { currentRoundInput, activePlayers });
    if (currentRoundInput && activePlayers.length > 0) {
      setInput(currentRoundInput);
    }
  }, [currentRoundInput, activePlayers]);

  const handleCallerChange = (playerId: string) => {
    setInput((prev) => ({ ...prev, yanivCallerId: playerId }));
  };

  const handleSumChange = (playerId: string, sum: number) => {
    setInput((prev) => ({
      ...prev,
      sums: { ...prev.sums, [playerId]: sum },
    }));
  };

  const handleSubmit = () => {
    submitRound(input);
  };

  const canSubmit =
    input.yanivCallerId &&
    Object.values(input.sums).every((sum) => sum >= 0) &&
    activePlayers.length >= 2;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Round Entry</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select who called Yaniv and enter hand sums
        </p>
      </div>

      {/* Yaniv Caller Selection */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-4">Who called Yaniv?</h3>
        <div className="grid grid-cols-2 gap-3">
          {activePlayers.map((player) => (
            <label
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                input.yanivCallerId === player.id
                  ? "border-primary-500 bg-primary-100 dark:bg-primary-900/30 text-gray-900 dark:text-gray-100 shadow-md"
                  : "border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
            >
              <input
                type="radio"
                name="yanivCaller"
                value={player.id}
                checked={input.yanivCallerId === player.id}
                onChange={() => handleCallerChange(player.id)}
                className="sr-only"
              />
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{player.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Hand Sums Input */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-4">Hand Sums</h3>
        <div className="space-y-4">
          {activePlayers.map((player) => (
            <div key={player.id} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium flex-1">{player.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={input.sums[player.id] || 0}
                  onChange={(e) =>
                    handleSumChange(player.id, parseInt(e.target.value) || 0)
                  }
                  className="input w-20 text-center"
                  placeholder="0"
                />
                <span className="text-gray-500">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          Calculate Round
        </button>
      </div>

      {/* Current Totals Preview */}
      {activePlayers.length > 0 && (
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-4">Current Totals</h3>
          <div className="space-y-2">
            {activePlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between"
              >
                <span className="font-medium">{player.name}</span>
                <span
                  className={`text-lg font-bold ${
                    player.total === 0
                      ? "text-success-600"
                      : player.total >= 50
                      ? "text-warning-600"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {player.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundEntry;
