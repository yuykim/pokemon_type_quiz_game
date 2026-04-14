import { TYPE_IDS } from "../types.js";
import { multEq, multiplierProduct } from "../math/multiplier.js";

/**
 * 주어진 방어 타입(들)에 대해 가능한 공격 배율 목록(중복 제거).
 * @param {number[]} defenderIndices
 * @returns {number[]}
 */
export function distinctAttackMultipliers(defenderIndices) {
  /** @type {number[]} */
  const values = [];
  for (let a = 0; a < TYPE_IDS.length; a++) {
    const m = multiplierProduct(a, defenderIndices);
    if (!values.some((v) => multEq(v, m))) values.push(m);
  }
  return values.sort((x, y) => x - y);
}

/**
 * 목표 배율을 만드는 공격 타입 인덱스 전부.
 * @param {number[]} defenderIndices
 * @param {number} targetMultiplier
 * @returns {number[]}
 */
export function attackIndicesForTarget(defenderIndices, targetMultiplier) {
  /** @type {number[]} */
  const out = [];
  for (let a = 0; a < TYPE_IDS.length; a++) {
    const m = multiplierProduct(a, defenderIndices);
    if (multEq(m, targetMultiplier)) out.push(a);
  }
  return out;
}

/**
 * 사용자가 고른 공격 타입 집합이 목표 배율 정답 집합과 정확히 같은지.
 * @param {number[]} chosenAttackIndices
 * @param {number[]} defenderIndices
 * @param {number} targetMultiplier
 * @returns {boolean}
 */
export function isAttackTargetSolved(
  chosenAttackIndices,
  defenderIndices,
  targetMultiplier
) {
  const expected = attackIndicesForTarget(defenderIndices, targetMultiplier);
  const chosen = Array.from(new Set(chosenAttackIndices)).sort((a, b) => a - b);
  if (chosen.length !== expected.length) return false;
  return chosen.every((v, i) => v === expected[i]);
}

