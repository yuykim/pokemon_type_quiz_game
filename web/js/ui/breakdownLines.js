import { cell } from "../typeChart.js";
import { labelKo, idAt } from "../types.js";
import { formatMultiplier } from "../math/formatMultiplier.js";

/**
 * @param {number} attackIndex
 * @param {number[]} defenderIndices
 * @returns {string[]}
 */
export function breakdownLines(attackIndex, defenderIndices) {
  return defenderIndices.map((d) => {
    const v = cell(attackIndex, d);
    return `${labelKo(idAt(d))}: ${formatMultiplier(v)}`;
  });
}
