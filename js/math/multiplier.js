import { cell } from "../typeChart.js";

/**
 * 기술(공격) 타입 하나가 방어 타입 조합에 대해 주는 최종 배율 (곱).
 * @param {number} attackIndex
 * @param {number[]} defendIndices 1개 또는 2개(서로 다름)
 */
export function multiplierProduct(attackIndex, defendIndices) {
  let p = 1;
  for (const d of defendIndices) {
    p *= cell(attackIndex, d);
  }
  return p;
}

/**
 * 배율 비교용(부동소수 오차)
 * @param {number} a
 * @param {number} b
 */
export function multEq(a, b) {
  return Math.abs(a - b) < 1e-9;
}

/**
 * @param {number} a
 * @param {number} b
 */
export function multLess(a, b) {
  return a < b - 1e-9;
}

/**
 * @param {number} a
 * @param {number} b
 */
export function multGreater(a, b) {
  return a > b + 1e-9;
}
