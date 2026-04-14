import { TYPE_IDS } from "../types.js";
import { multEq, multLess, multiplierProduct } from "../math/multiplier.js";

/**
 * 방어 조합 정규화: 인덱스 오름차순 (단일은 [i])
 * @param {number[]} indices
 * @returns {number[]}
 */
export function normalizeDefenseCombo(indices) {
  if (indices.length === 1) return [indices[0]];
  const [a, b] = indices;
  return a < b ? [a, b] : [b, a];
}

/**
 * 들어오는 기술 타입(moveIndex)에 대해 받는 배율이 최소가 되는 모든 방어 조합.
 * @param {number} moveIndex 기술(공격) 타입 인덱스
 */
export function optimalDefenses(moveIndex) {
  const n = TYPE_IDS.length;
  let best = Infinity;
  /** @type {number[][]} */
  const combos = [];

  for (let i = 0; i < n; i++) {
    const m = multiplierProduct(moveIndex, [i]);
    if (multLess(m, best)) {
      best = m;
      combos.length = 0;
      combos.push([i]);
    } else if (multEq(m, best)) {
      combos.push([i]);
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const m = multiplierProduct(moveIndex, [i, j]);
      if (multLess(m, best)) {
        best = m;
        combos.length = 0;
        combos.push([i, j]);
      } else if (multEq(m, best)) {
        combos.push([i, j]);
      }
    }
  }

  return { minMultiplier: best, optimalCombos: combos };
}

/**
 * @param {number[]} chosenDefenseIndices 1 또는 2, 서로 다름
 * @param {number} moveIndex
 */
export function isDefenseOptimal(chosenDefenseIndices, moveIndex) {
  const norm = normalizeDefenseCombo(chosenDefenseIndices);
  const { optimalCombos } = optimalDefenses(moveIndex);
  return optimalCombos.some(
    (c) => c.length === norm.length && c.every((v, k) => v === norm[k])
  );
}
