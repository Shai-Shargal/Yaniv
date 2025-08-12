import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  GameState,
  Player,
  PlayerId,
  RoundInput,
  RoundOutcome,
} from "./lib/scoring";
import {
  scoreRoundFromSums,
  applyPenaltiesAndMilestones,
  isGameOver,
  getWinner,
} from "./lib/scoring";

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
        const result = isGameOver(state.players);
        console.log(
          "gameOver getter:",
          result,
          "active players:",
          state.players.filter((p) => !p.eliminated).length
        );
        return result;
      },
      get winner() {
        const state = get();
        const result = getWinner(state.players);
        console.log(
          "winner getter:",
          result?.name || "no winner",
          "active players:",
          state.players.filter((p) => !p.eliminated).length,
          "all players:",
          state.players.map((p) => ({
            name: p.name,
            total: p.total,
            eliminated: p.eliminated,
          }))
        );
        return result;
      },

      // Actions
      addPlayer: (name: string) => {
        const { players } = get();
        if (players.length >= 8) return; // Max 8 players

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
          sums: Object.fromEntries(players.map((p) => [p.id, null])),
        };

        set({
          currentRoundInput: newRoundInput,
          currentRoundOutcome: null,
          currentView: "round-entry",
          activePlayers: players.filter((p) => !p.eliminated),
        });
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
        // We need to check the winner from the updated players array that has elimination flags
        const winner = getWinner(next);
        const gameOver = isGameOver(next);

        // Debug logging
        console.log("Game state after round:", {
          gameOver,
          winner: winner?.name,
          activePlayers: next.filter((p) => !p.eliminated).length,
          nextView: gameOver && winner ? "winner" : "players",
          players: next.map((p) => ({
            name: p.name,
            total: p.total,
            eliminated: p.eliminated,
          })),
        });

        set({
          players: next,
          history: [...history, newHistoryEntry],
          currentRoundInput: null,
          currentRoundOutcome: null,
          currentView: gameOver && winner ? "winner" : "players",
          activePlayers: next.filter((p) => !p.eliminated),
        });
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
      storage: createJSONStorage(() => AsyncStorage),
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
