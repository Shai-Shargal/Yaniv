import { useGameStore } from "../store";

const RoundResults = () => {
  const {
    currentRoundInput,
    currentRoundOutcome,
    confirmRound,
    activePlayers,
  } = useGameStore();

  if (!currentRoundInput || !currentRoundOutcome) return null;

  const { sums } = currentRoundInput;
  const { penalties, asafBy, callerId } = currentRoundOutcome;

  // Find players who hit exact 50 or 100
  const milestonePlayers = activePlayers.filter((p) => {
    const newTotal = p.total + (penalties[p.id] || 0);
    return newTotal === 50 || newTotal === 100;
  });

  // Find newly eliminated players
  const newlyEliminated = activePlayers.filter((p) => {
    const newTotal = p.total + (penalties[p.id] || 0);
    return newTotal > 100 && !p.eliminated;
  });

  const getPlayerName = (id: string) =>
    activePlayers.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Round Results</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review the round outcome and confirm
        </p>
      </div>

      {/* Round Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Round Summary
        </h3>

        {asafBy ? (
          <div className="space-y-3">
            <div className="p-3 bg-warning-800 dark:bg-warning-900 border border-warning-700 dark:border-warning-700 rounded-lg">
              <div className="font-semibold text-warning-100 dark:text-warning-100">
                🎯 Asaf occurred!
              </div>
              <div className="text-sm text-warning-200 dark:text-warning-200">
                {getPlayerName(callerId)} called Yaniv but{" "}
                {getPlayerName(asafBy)} had a lower sum
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="text-center p-2 bg-red-800 dark:bg-red-900 rounded">
                <div className="font-semibold text-red-100 dark:text-red-100">
                  {getPlayerName(callerId)}
                </div>
                <div className="text-red-100 dark:text-red-200">
                  +30 + hand sum penalty
                </div>
              </div>

              <div className="text-center p-2 bg-green-800 dark:bg-green-900 rounded">
                <div className="font-semibold text-green-100 dark:text-green-100">
                  {getPlayerName(asafBy)}
                </div>
                <div className="text-green-100 dark:text-green-200">
                  Hand sum penalty (lowest)
                </div>
              </div>

              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-gray-600 dark:text-gray-400">Others</div>
                <div className="text-gray-800 dark:text-gray-200">
                  Their sum as penalty
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-blue-800 dark:bg-blue-900 border border-blue-700 dark:border-blue-700 rounded-lg">
            <div className="font-semibold text-blue-100 dark:text-blue-100">
              ✅ No Asaf
            </div>
            <div className="text-sm text-blue-100 dark:text-blue-200">
              {getPlayerName(callerId)} had the lowest sum - everyone gets their
              hand sum as penalty
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Round Results
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 font-medium text-gray-900 dark:text-gray-100">
                  Player
                </th>
                <th className="text-center py-2 font-medium text-gray-900 dark:text-gray-100">
                  Hand Sum
                </th>
                <th className="text-center py-2 font-medium text-gray-900 dark:text-gray-100">
                  Penalty
                </th>
                <th className="text-center py-2 font-medium text-gray-900 dark:text-gray-100">
                  New Total
                </th>
              </tr>
            </thead>
            <tbody>
              {activePlayers.map((player) => {
                const penalty = penalties[player.id] || 0;
                const newTotal = player.total + penalty;
                const isMilestone = newTotal === 50 || newTotal === 100;
                const isEliminated = newTotal > 100;

                return (
                  <tr
                    key={player.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {player.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 text-gray-900 dark:text-gray-100">
                      {sums[player.id] || 0}
                    </td>
                    <td className="text-center py-3">
                      <span
                        className={`font-semibold ${
                          penalty === 0
                            ? "text-success-600"
                            : penalty === 30
                            ? "text-warning-600"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {penalty}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span
                        className={`font-bold text-lg ${
                          isMilestone
                            ? "text-success-600"
                            : isEliminated
                            ? "text-danger-600"
                            : newTotal === 0
                            ? "text-success-600"
                            : newTotal >= 50
                            ? "text-warning-600"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {isMilestone ? "0 (reset!)" : newTotal}
                        {isEliminated && " (eliminated)"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Events */}
      {(milestonePlayers.length > 0 || newlyEliminated.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Special Events
          </h3>
          <div className="space-y-3">
            {milestonePlayers.map((player) => {
              const newTotal = player.total + (penalties[player.id] || 0);
              return (
                <div
                  key={player.id}
                  className="p-3 bg-success-800 dark:bg-success-900 border border-success-700 dark:border-success-700 rounded-lg"
                >
                  <div className="font-semibold text-success-100 dark:text-success-100">
                    🎉 {player.name} hit exact {newTotal}!
                  </div>
                  <div className="text-sm text-success-200 dark:text-success-200">
                    Total reset to 0
                  </div>
                </div>
              );
            })}

            {newlyEliminated.map((player) => {
              const newTotal = player.total + (penalties[player.id] || 0);
              return (
                <div
                  key={player.id}
                  className="p-3 bg-danger-800 dark:bg-danger-900 border border-danger-700 dark:border-danger-700 rounded-lg"
                >
                  <div className="font-semibold text-danger-100 dark:text-danger-100">
                    💀 {player.name} eliminated!
                  </div>
                  <div className="text-sm text-danger-200 dark:text-danger-200">
                    Total exceeded 100 ({newTotal})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={confirmRound}
          className="bg-success-600 hover:bg-success-700 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Confirm Round
        </button>
      </div>
    </div>
  );
};

export default RoundResults;
