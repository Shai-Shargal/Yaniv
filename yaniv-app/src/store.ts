import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  GameState,
  Player,
  PlayerId,
  RoundInput,
  RoundOutcome,
} from "./lib/scoring.js";
import {
  scoreRoundFromSums,
  applyPenaltiesAndMilestones,
  isGameOver,
  getWinner,
} from "./lib/scoring.js";

interface GameStore extends GameState {
  // Actions
  addPlayer: (name: string) => void;
  updatePlayerName: (id: PlayerId, name: string) => void;
  removePlayer: (id: PlayerId) => void;
  reorderPlayers: (fromIndex: number, toIndex: number) => void;
  startRound: () => void;
  submitRound: (input: RoundInput) => void;
  confirmRound: () => void;
  undoLastRound: () => void;
  newGame: (hardReset?: boolean) => void;
  updateSettings: (settings: Partial<GameState["settings"]>) => void;
  goBack: () => void;

  // Computed state
  currentRoundInput: RoundInput | null;
  currentRoundOutcome: RoundOutcome | null;
  gameOver: boolean;
  winner: Player | null;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialState: Omit<GameState, "settings"> = {
  players: [],
  history: [],
  currentRoundInput: null,
  currentRoundOutcome: null,
  currentView: "players",
  activePlayers: [],
};

const defaultSettings = {
  asafOnTie: false,
  persistence: true,
  rtl: false,
  darkMode: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      settings: defaultSettings,

      // Computed getters

      get gameOver() {
        const state = get();
        return isGameOver(state.players);
      },
      get winner() {
        const state = get();
        return getWinner(state.players);
      },
      // Helper function to determine current view
      _getCurrentView: () => {
        const state = get();
        // Check if there's a winner (game over)
        const winner = getWinner(state.players);
        const gameOver = isGameOver(state.players);

        if (gameOver && winner) return "winner";
        if (state.currentRoundOutcome) return "round-results";
        if (state.currentRoundInput) return "round-entry";
        return "players";
      },

      // Actions
      addPlayer: (name: string) => {
        const { players } = get();
        if (players.length >= 16) return; // Max 16 players

        const newPlayer: Player = {
          id: generateId(),
          name: name.trim(),
          total: 0,
          eliminated: false,
        };

        const newPlayers = [...players, newPlayer];
        set({
          players: newPlayers,
          activePlayers: newPlayers.filter((p) => !p.eliminated),
        });
      },

      updatePlayerName: (id: PlayerId, name: string) => {
        const { players } = get();
        const newPlayers = players.map((p) =>
          p.id === id ? { ...p, name: name.trim() } : p
        );
        set({
          players: newPlayers,
          activePlayers: newPlayers.filter((p) => !p.eliminated),
        });
      },

      removePlayer: (id: PlayerId) => {
        const { players } = get();
        const newPlayers = players.filter((p) => p.id !== id);
        set({
          players: newPlayers,
          activePlayers: newPlayers.filter((p) => !p.eliminated),
        });
      },

      reorderPlayers: (fromIndex: number, toIndex: number) => {
        const { players } = get();
        const newPlayers = [...players];
        const [movedPlayer] = newPlayers.splice(fromIndex, 1);
        newPlayers.splice(toIndex, 0, movedPlayer);
        set({
          players: newPlayers,
          activePlayers: newPlayers.filter((p) => !p.eliminated),
        });
      },

      startRound: () => {
        const { players } = get();
        if (players.length < 2) return;

        const newRoundInput = {
          yanivCallerId: players[0].id,
          sums: Object.fromEntries(players.map((p) => [p.id, 0])),
        };

        console.log("Starting round with:", newRoundInput);

        set({
          currentRoundInput: newRoundInput,
          currentRoundOutcome: null,
          currentView: "round-entry",
          activePlayers: players.filter((p) => !p.eliminated),
        });

        console.log("Round started, new state:", get());
      },

      submitRound: (input: RoundInput) => {
        const { settings } = get();
        const outcome = scoreRoundFromSums(input.sums, input.yanivCallerId, {
          asafOnTie: settings.asafOnTie,
        });

        set({
          currentRoundInput: input,
          currentRoundOutcome: {
            ...outcome,
            callerId: input.yanivCallerId,
          },
          currentView: "round-results",
        });
      },

      confirmRound: () => {
        const { currentRoundInput, currentRoundOutcome, players, history } =
          get();
        if (!currentRoundInput || !currentRoundOutcome) return;

        const { next, eliminated } = applyPenaltiesAndMilestones(
          players,
          currentRoundOutcome.penalties
        );

        const newHistoryEntry = {
          input: currentRoundInput,
          outcome: currentRoundOutcome,
          totalsAfter: Object.fromEntries(next.map((p) => [p.id, p.total])),
          eliminatedAfter: eliminated,
          timestamp: Date.now(),
        };

        // Check if game is over after this round
        const winner = getWinner(next);
        const gameOver = isGameOver(next);

        set({
          players: next,
          history: [...history, newHistoryEntry],
          currentRoundInput: null,
          currentRoundOutcome: null,
          currentView: gameOver && winner ? "winner" : "players",
          activePlayers: next.filter((p) => !p.eliminated),
        });
      },

      goBack: () => {
        const { currentView } = get();
        if (currentView === "round-results") {
          set({ currentRoundOutcome: null, currentView: "round-entry" });
          return;
        }
        if (currentView === "round-entry") {
          set({
            currentRoundInput: null,
            currentRoundOutcome: null,
            currentView: "players",
          });
          return;
        }
        if (currentView === "winner") {
          set({ currentView: "players" });
          return;
        }
        // Default: go to players
        set({ currentView: "players" });
      },

      undoLastRound: () => {
        const { history, players } = get();
        if (history.length === 0) return;

        const lastRound = history[history.length - 1];
        const previousHistory = history.slice(0, -1);

        // Restore previous player states
        const restoredPlayers = players.map((p) => {
          const wasEliminated = lastRound.eliminatedAfter.includes(p.id);
          const previousTotal = lastRound.totalsAfter[p.id] ?? 0;

          return {
            ...p,
            total: previousTotal,
            eliminated: wasEliminated ? false : p.eliminated,
          };
        });

        set({
          players: restoredPlayers,
          history: previousHistory,
          currentRoundInput: null,
          currentRoundOutcome: null,
          currentView: "players",
          activePlayers: restoredPlayers.filter((p) => !p.eliminated),
        });
      },

      newGame: (hardReset = false) => {
        if (hardReset) {
          set({
            ...initialState,
            settings: defaultSettings,
            currentRoundInput: null,
            currentRoundOutcome: null,
          });
        } else {
          const resetPlayers = get().players.map((p) => ({
            ...p,
            total: 0,
            eliminated: false,
          }));
          set({
            players: resetPlayers,
            history: [],
            currentRoundInput: null,
            currentRoundOutcome: null,
            currentView: "players",
            activePlayers: resetPlayers.filter((p) => !p.eliminated),
          });
        }
      },

      updateSettings: (newSettings) => {
        set({ settings: { ...get().settings, ...newSettings } });
      },
    }),
    {
      name: "yaniv-game-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        players: state.players,
        history: state.history,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        // Reset current round state on rehydration
        if (state) {
          state.currentRoundInput = null;
          state.currentRoundOutcome = null;
        }
      },
    }
  )
);
