import { describe, test, expect } from "vitest";
import { scoreRoundFromSums, applyPenaltiesAndMilestones } from "./scoring.js";

describe("scoreRoundFromSums", () => {
  const players = {
    alice: 5,
    bob: 7,
    charlie: 3,
    david: 10,
  };

  test("no asaf when caller has lowest sum", () => {
    const result = scoreRoundFromSums(players, "charlie");
    expect(result.asafBy).toBeNull();
    expect(result.penalties).toEqual({
      alice: 5,
      bob: 7,
      charlie: 3,
      david: 10,
    });
  });

  test("asaf occurs when non-caller has lower sum", () => {
    const result = scoreRoundFromSums(players, "alice");
    expect(result.asafBy).toBe("charlie");
    expect(result.penalties).toEqual({
      alice: 30, // caller gets +30
      bob: 7, // others get their sum
      charlie: 0, // lowest non-caller gets 0
      david: 10,
    });
  });

  test("asaf on tie always occurs now", () => {
    const playersWithTie = { alice: 5, bob: 5, charlie: 8 };
    const result = scoreRoundFromSums(playersWithTie, "alice");
    expect(result.asafBy).toBe("bob"); // asaf occurs on tie
    expect(result.penalties.alice).toBe(35); // 30 + 5
    expect(result.penalties.bob).toBe(0); // lowest non-caller gets 0
  });

  test("asaf on tie with asafOnTie option (no longer relevant)", () => {
    const playersWithTie = { alice: 5, bob: 5, charlie: 8 };
    const result = scoreRoundFromSums(playersWithTie, "alice", {
      asafOnTie: true,
    });
    expect(result.asafBy).toBe("bob"); // asaf occurs on tie regardless of option
    expect(result.penalties.alice).toBe(35); // 30 + 5
    expect(result.penalties.bob).toBe(0); // lowest non-caller gets 0
  });

  test("multiple players below caller - lowest gets 0", () => {
    const playersMultiple = { alice: 8, bob: 3, charlie: 1, david: 12 };
    const result = scoreRoundFromSums(playersMultiple, "alice");
    expect(result.asafBy).toBe("charlie"); // lowest gets 0
    expect(result.penalties.charlie).toBe(0);
    expect(result.penalties.bob).toBe(3); // others get their sum
  });
});

describe("applyPenaltiesAndMilestones", () => {
  const mockPlayers = [
    { id: "alice", name: "Alice", total: 45, eliminated: false },
    { id: "bob", name: "Bob", total: 95, eliminated: false },
    { id: "charlie", name: "Charlie", total: 98, eliminated: false },
  ];

  test("applies penalties and checks milestones", () => {
    const penalties = { alice: 5, bob: 5, charlie: 3 };
    const result = applyPenaltiesAndMilestones(mockPlayers, penalties);

    expect(result.next[0].total).toBe(50); // alice: 45 + 5 = 50
    expect(result.next[1].total).toBe(100); // bob: 95 + 5 = 100
    expect(result.next[2].total).toBe(101); // charlie: 98 + 3 = 101
  });

  test("resets to 0 on exact 50 or 100", () => {
    const penalties = { alice: 5, bob: 5, charlie: 2 };
    const result = applyPenaltiesAndMilestones(mockPlayers, penalties);

    expect(result.next[0].total).toBe(0); // 50 resets to 0
    expect(result.next[1].total).toBe(0); // 100 resets to 0
    expect(result.next[2].total).toBe(100); // 100 resets to 0
  });

  test("eliminates players over 100", () => {
    const penalties = { alice: 10, bob: 10, charlie: 5 };
    const result = applyPenaltiesAndMilestones(mockPlayers, penalties);

    expect(result.next[2].eliminated).toBe(true); // charlie: 98 + 5 = 103
    expect(result.eliminated).toContain("charlie");
  });

  test("handles already eliminated players", () => {
    const eliminatedPlayers = [
      { id: "alice", name: "Alice", total: 45, eliminated: true },
      { id: "bob", name: "Bob", total: 95, eliminated: false },
    ];
    const penalties = { alice: 5, bob: 5 };
    const result = applyPenaltiesAndMilestones(eliminatedPlayers, penalties);

    expect(result.next[0].eliminated).toBe(true); // stays eliminated
    expect(result.next[1].total).toBe(0); // 100 resets to 0
  });
});
