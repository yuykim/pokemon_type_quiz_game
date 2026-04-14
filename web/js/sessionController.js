import { N_MIN, N_MAX } from "./config.js";
import { buildProblemList } from "./domain/problemGenerator.js";
import { attackIndicesForTarget, isAttackTargetSolved } from "./domain/attackTarget.js";
import { isDefenseOptimal, normalizeDefenseCombo } from "./domain/optimalDefense.js";
import { TYPE_IDS, idAt, labelKo } from "./types.js";

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
    this.attackTypeStats = Array.from({ length: TYPE_IDS.length }, () => ({
      required: 0,
      hit: 0,
      wrong: 0,
    }));
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
    const chosen = Array.from(new Set(attackIndices)).sort((a, b) => a - b);
    const answer = attackIndicesForTarget(p.defenderIndices, p.targetMultiplier);

    for (const idx of answer) {
      this.attackTypeStats[idx].required += 1;
      if (chosen.includes(idx)) this.attackTypeStats[idx].hit += 1;
    }
    for (const idx of chosen) {
      if (!answer.includes(idx)) this.attackTypeStats[idx].wrong += 1;
    }

    const ok = isAttackTargetSolved(
      chosen,
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

  /**
   * 타입별 암기 완성도(공격 문제 기준).
   * - recall(재현율): 맞아야 하는 상황에서 실제로 맞춘 비율
   * - precision(정밀도): 내가 고른 것 중 실제 정답 비율
   * - completion = 0.6 * recall + 0.4 * precision
   */
  attackMasteryRows() {
    return this.attackTypeStats.map((s, idx) => {
      const miss = s.required - s.hit;
      const precisionDen = s.hit + s.wrong;
      const recall = s.required > 0 ? s.hit / s.required : 1;
      const precision = precisionDen > 0 ? s.hit / precisionDen : 1;
      const exposed = s.required + s.wrong;
      const completion = exposed > 0 ? Math.round((0.6 * recall + 0.4 * precision) * 100) : null;
      return {
        typeIndex: idx,
        typeId: idAt(idx),
        typeKo: labelKo(idAt(idx)),
        required: s.required,
        hit: s.hit,
        miss,
        wrong: s.wrong,
        completion,
      };
    });
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
