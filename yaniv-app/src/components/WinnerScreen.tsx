import { useGameStore } from "../store";

const WinnerScreen = () => {
  const { winner: storeWinner, players, history, newGame } = useGameStore();

  // Derive winner defensively in case the computed getter isn't available yet
  const activeRemaining = players.filter((p) => !p.eliminated);
  const winner =
    storeWinner ?? (activeRemaining.length === 1 ? activeRemaining[0] : null);

  const totalRounds = history.length;

  if (!winner) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        No winner yet.
      </div>
    );
  }

  const copyStandings = () => {
    const standings = players
      .map((p) => `${p.name}: ${p.total}${p.eliminated ? " (eliminated)" : ""}`)
      .join("\n");

    navigator.clipboard.writeText(standings).then(() => {
      // Could add a toast notification here
      alert("Standings copied to clipboard!");
    });
  };

  return (
    <div className="space-y-6 text-center">
      {/* Winner Celebration */}
      <div className="space-y-4">
        <div className="text-6xl">🎉</div>
        <h1 className="text-4xl font-bold text-success-600 dark:text-success-400">
          Game Over!
        </h1>
        <h2 className="text-2xl font-semibold">{winner.name} wins!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          After {totalRounds} round{totalRounds !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Final Standings */}
      <div className="card p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Final Standings</h3>
        <div className="space-y-3">
          {players
            .sort((a, b) => {
              if (a.eliminated && !b.eliminated) return 1;
              if (!a.eliminated && b.eliminated) return -1;
              return a.total - b.total;
            })
            .map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.id === winner.id
                    ? "bg-success-800 dark:bg-success-900 border border-success-700 dark:border-success-700"
                    : player.eliminated
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      player.id === winner.id
                        ? "bg-success-500 text-white"
                        : player.eliminated
                        ? "bg-gray-400 text-white"
                        : "bg-primary-500 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`font-medium ${
                      player.id === winner.id
                        ? "text-success-100 dark:text-success-100"
                        : player.eliminated
                        ? "text-gray-500 line-through"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {player.name}
                  </span>
                </div>
                <span
                  className={`font-bold ${
                    player.id === winner.id
                      ? "text-success-100"
                      : player.eliminated
                      ? "text-gray-500"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {player.total}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Game Stats */}
      {totalRounds > 0 && (
        <div className="card p-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Game Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600 dark:text-gray-400">
                Total Rounds
              </div>
              <div className="text-xl font-bold">{totalRounds}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Players</div>
              <div className="text-xl font-bold">{players.length}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Eliminated</div>
              <div className="text-xl font-bold">
                {players.filter((p) => p.eliminated).length}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">
                Winner Score
              </div>
              <div className="text-xl font-bold">{winner.total}</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={copyStandings}
          className="btn-secondary text-lg px-8 py-3"
        >
          📋 Copy Standings
        </button>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => newGame(false)}
            className="btn-primary text-lg px-6 py-3"
          >
            New Game
          </button>
          <button
            onClick={() => newGame(true)}
            className="btn-danger text-lg px-6 py-3"
          >
            Hard Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerScreen;
