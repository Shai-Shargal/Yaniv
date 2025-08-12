export type PlayerId = string;

export type Player = {
  id: PlayerId;
  name: string;
  eliminated?: boolean;
  total: number; // 0..100+
};

export type RoundInput = {
  yanivCallerId: PlayerId;
  sums: Record<PlayerId, number | null>;
};

export type RoundOutcome = {
  penalties: Record<PlayerId, number>;
  asafBy: PlayerId | null; // non-caller who had the lowest qualifying sum
  callerId: PlayerId;
};

export type GameState = {
  players: Player[];
  history: {
    input: RoundInput;
    outcome: RoundOutcome;
    totalsAfter: Record<PlayerId, number>;
    eliminatedAfter: PlayerId[];
    timestamp: number;
  }[];
  settings: {
    asafOnTie: boolean; // default false
    persistence: boolean; // default true
    rtl: boolean; // default false
    darkMode: boolean; // default false
  };
  currentView:
    | "players"
    | "round-entry"
    | "round-results"
    | "winner"
    | "settings";
  currentRoundInput: RoundInput | null;
  currentRoundOutcome: RoundOutcome | null;
  activePlayers: Player[];
};

/**
 * Pure scoring function for calculating round penalties
 */
export function scoreRoundFromSums(
  sums: Record<string, number | null>,
  yanivCallerId: string,
  opts: { asafOnTie?: boolean } = {}
): { penalties: Record<string, number>; asafBy: string | null } {
  const { asafOnTie = false } = opts;
  if (!(yanivCallerId in sums)) throw new Error("yanivCallerId missing");
  const callerSum = sums[yanivCallerId] ?? 0;

  const qualifies = (x: number, y: number) => (asafOnTie ? x <= y : x < y);

  // Find lowest non-caller that qualifies
  let asafBy: string | null = null;
  let best = Infinity;
  for (const [pid, sum] of Object.entries(sums)) {
    if (pid === yanivCallerId) continue;
    const numSum = sum ?? 0;
    if (qualifies(numSum, callerSum) && numSum < best) {
      best = numSum;
      asafBy = pid;
    }
  }

  const penalties: Record<string, number> = {};

  // Check if Yaniv caller has the lowest score
  const allSums = Object.values(sums).map((sum) => sum ?? 0);
  const lowestSum = Math.min(...allSums);
  const yanivCallerWins = callerSum === lowestSum;

  if (asafBy) {
    // Asaf occurred - someone else had a lower or equal score
    for (const [pid, sum] of Object.entries(sums)) {
      const numSum = sum ?? 0;
      if (pid === yanivCallerId)
        penalties[pid] = 30 + numSum; // Yaniv caller gets 30 + their hand sum
      else penalties[pid] = numSum; // Everyone else gets their hand sum as penalty
    }
  } else if (yanivCallerWins) {
    // Yaniv caller wins - they get 0, others get their sum
    for (const [pid, sum] of Object.entries(sums)) {
      const numSum = sum ?? 0;
      if (pid === yanivCallerId)
        penalties[pid] = 0; // Yaniv caller gets 0 (wins!)
      else penalties[pid] = numSum; // Others get their hand sum as penalty
    }
  } else {
    // No Asaf and Yaniv caller doesn't win - everyone gets their sum
    for (const [pid, sum] of Object.entries(sums)) {
      penalties[pid] = sum ?? 0;
    }
  }

  return { penalties, asafBy };
}

/**
 * Apply penalties and check for milestones (50/100 reset) and elimination (>100)
 */
export function applyPenaltiesAndMilestones(
  players: Player[],
  penalties: Record<PlayerId, number>
): { next: Player[]; eliminated: PlayerId[] } {
  const eliminated: PlayerId[] = [];
  const next = players.map((p) => {
    if (p.eliminated) return p;

    const add = penalties[p.id] ?? 0;
    let total = p.total + add;

    // Exact 50 or 100 resets to 0
    if (total === 50 || total === 100) total = 0;

    // Elimination if > 100
    let eliminatedFlag: boolean = p.eliminated || false;
    if (total > 100) {
      eliminatedFlag = true;
      eliminated.push(p.id);
    }

    return { ...p, total, eliminated: eliminatedFlag };
  });

  // Debug logging
  console.log("applyPenaltiesAndMilestones:", {
    input: players.map((p) => ({
      name: p.name,
      total: p.total,
      eliminated: p.eliminated,
    })),
    penalties,
    output: next.map((p) => ({
      name: p.name,
      total: p.total,
      eliminated: p.eliminated,
    })),
    eliminated,
  });

  return { next, eliminated };
}

/**
 * Check if game is over (only one player remaining)
 */
export function isGameOver(players: Player[]): boolean {
  const activePlayers = players.filter((p) => !p.eliminated);
  const result = activePlayers.length <= 1;
  console.log("isGameOver:", {
    totalPlayers: players.length,
    activePlayers: activePlayers.length,
    eliminatedPlayers: players.filter((p) => p.eliminated).length,
    result,
    players: players.map((p) => ({
      name: p.name,
      total: p.total,
      eliminated: p.eliminated,
    })),
  });
  return result;
}

/**
 * Get winner (last remaining player)
 */
export function getWinner(players: Player[]): Player | null {
  const activePlayers = players.filter((p) => !p.eliminated);
  const result = activePlayers.length === 1 ? activePlayers[0] : null;
  console.log("getWinner:", {
    totalPlayers: players.length,
    activePlayers: activePlayers.length,
    eliminatedPlayers: players.filter((p) => p.eliminated).length,
    result: result?.name || "no winner",
    players: players.map((p) => ({
      name: p.name,
      total: p.total,
      eliminated: p.eliminated,
    })),
  });
  return result;
}
