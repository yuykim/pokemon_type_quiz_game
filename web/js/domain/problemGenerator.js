import { TYPE_IDS } from "../types.js";
import { distinctAttackMultipliers } from "./attackTarget.js";

/**
 * @param {number} maxExclusive
 */
function randInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}

/**
 * @returns {[number, number]}
 */
function twoDistinctRandom() {
  const n = TYPE_IDS.length;
  const a = randInt(n);
  let b = randInt(n);
  while (b === a) b = randInt(n);
  return [a, b];
}

/**
 * @param {boolean} allowDual
 * @returns {number[]}
 */
export function randomDefenders(allowDual) {
  if (!allowDual) {
    return [randInt(TYPE_IDS.length)];
  }
  const [a, b] = twoDistinctRandom();
  return [a, b].sort((x, y) => x - y);
}

/**
 * @returns {number}
 */
export function randomMoveType() {
  return randInt(TYPE_IDS.length);
}

/**
 * @param {number[]} defenderIndices
 * @returns {number}
 */
function randomAttackTargetMultiplier(defenderIndices) {
  const values = distinctAttackMultipliers(defenderIndices);
  return values[randInt(values.length)];
}

/**
 * @typedef {{ kind: "attack"; defenderIndices: number[]; targetMultiplier: number }} AttackProblem
 * @typedef {{ kind: "defense"; moveIndex: number }} DefenseProblem
 * @typedef {AttackProblem | DefenseProblem} Problem
 */

/**
 * @param {"attack" | "defense" | "both"} mode
 * @param {boolean} allowDual
 * @param {number} count
 * @returns {Problem[]}
 */
export function buildProblemList(mode, allowDual, count) {
  /** @type {Problem[]} */
  const list = [];
  for (let i = 0; i < count; i++) {
    if (mode === "attack") {
      const defenderIndices = randomDefenders(allowDual);
      list.push({
        kind: "attack",
        defenderIndices,
        targetMultiplier: randomAttackTargetMultiplier(defenderIndices),
      });
    } else if (mode === "defense") {
      list.push({ kind: "defense", moveIndex: randomMoveType() });
    } else {
      const kind = Math.random() < 0.5 ? "attack" : "defense";
      if (kind === "attack") {
        const defenderIndices = randomDefenders(allowDual);
        list.push({
          kind: "attack",
          defenderIndices,
          targetMultiplier: randomAttackTargetMultiplier(defenderIndices),
        });
      } else {
        list.push({ kind: "defense", moveIndex: randomMoveType() });
      }
    }
  }
  return list;
}
