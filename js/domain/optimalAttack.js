import { TYPE_IDS } from "../types.js";
import { multEq, multGreater, multiplierProduct } from "../math/multiplier.js";

/**
 * 주어진 방어 타입(들)에 대해 최대 배율과, 그 배율을 내는 모든 공격 타입 인덱스.
 * @param {number[]} defenderIndices
 */
export function optimalAttacks(defenderIndices) {
  let best = -1;
  /** @type {number[]} */
  let bestAtks = [];
  for (let a = 0; a < TYPE_IDS.length; a++) {
    const m = multiplierProduct(a, defenderIndices);
    if (multGreater(m, best)) {
      best = m;
      bestAtks = [a];
    } else if (multEq(m, best)) {
      bestAtks.push(a);
    }
  }
  return { maxMultiplier: best, optimalAttackIndices: bestAtks };
}

/**
 * @param {number} chosenAttackIndex
 * @param {number[]} defenderIndices
 */
export function isAttackOptimal(chosenAttackIndex, defenderIndices) {
  const { optimalAttackIndices } = optimalAttacks(defenderIndices);
  return optimalAttackIndices.includes(chosenAttackIndex);
}
