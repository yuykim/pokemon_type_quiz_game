import { N_MIN, N_MAX } from "./config.js";
import { buildProblemList } from "./domain/problemGenerator.js";
import { isAttackTargetSolved } from "./domain/attackTarget.js";
import { isDefenseOptimal, normalizeDefenseCombo } from "./domain/optimalDefense.js";

/**
 * @typedef {object} SessionSettings
 * @property {boolean} allowDualDefender
 * @property {"attack" | "defense" | "both"} practiceMode
 * @property {number} n
 */

export class SessionController {
  /** @param {SessionSettings} settings */
  constructor(settings) {
    this.settings = settings;
    this.problems = buildProblemList(
      settings.practiceMode,
      settings.allowDualDefender,
      settings.n
    );
    this.index = 0;

    this.stats = {
      attackHit: 0,
      attackTotal: 0,
      defenseHit: 0,
      defenseTotal: 0,
    };
  }

  get finished() {
    return this.index >= this.problems.length;
  }

  get current() {
    return this.problems[this.index];
  }

  /** @param {number[]} attackIndices */
  recordAttackSubmit(attackIndices) {
    const p = this.current;
    if (p.kind !== "attack") return;
    this.stats.attackTotal += 1;
    const ok = isAttackTargetSolved(
      attackIndices,
      p.defenderIndices,
      p.targetMultiplier
    );
    if (ok) this.stats.attackHit += 1;
  }

  /**
   * @param {number[]} defenseIndices
   */
  recordDefenseSubmit(defenseIndices) {
    const p = this.current;
    if (p.kind !== "defense") return;
    this.stats.defenseTotal += 1;
    const norm = normalizeDefenseCombo(defenseIndices);
    const ok = isDefenseOptimal(norm, p.moveIndex);
    if (ok) this.stats.defenseHit += 1;
  }

  advance() {
    this.index += 1;
  }

  summaryLines() {
    const lines = [];
    if (this.stats.attackTotal > 0) {
      lines.push(
        `공격 문제: 정답 선택 ${this.stats.attackHit} / ${this.stats.attackTotal}`
      );
    }
    if (this.stats.defenseTotal > 0) {
      lines.push(
        `방어 문제: 최선 선택 ${this.stats.defenseHit} / ${this.stats.defenseTotal}`
      );
    }
    return lines;
  }
}

/**
 * @param {boolean} allowDual
 * @param {"attack" | "defense" | "both"} mode
 * @param {string} nRaw
 * @returns {{ ok: true; settings: SessionSettings } | { ok: false; error: string }}
 */
export function parseSetup(allowDual, mode, nRaw) {
  const n = Number.parseInt(String(nRaw).trim(), 10);
  if (!Number.isFinite(n) || n < N_MIN || n > N_MAX) {
    return { ok: false, error: "invalid_n" };
  }
  return {
    ok: true,
    settings: {
      allowDualDefender: allowDual,
      practiceMode: mode,
      n,
    },
  };
}
