import { labelKo, idAt } from "../types.js";
import { formatMultiplier } from "../math/formatMultiplier.js";
import { attackIndicesForTarget, isAttackTargetSolved } from "../domain/attackTarget.js";
import { optimalDefenses } from "../domain/optimalDefense.js";
import { multiplierProduct } from "../math/multiplier.js";
import { S } from "../strings.js";
import { breakdownLines } from "./breakdownLines.js";

/**
 * @param {HTMLElement} root
 * @param {object} p
 * @param {"attack" | "defense"} p.kind
 * @param {number[]} [p.chosenAttacks]
 * @param {number[]} [p.chosenDefense]
 * @param {number[]} [p.defenderIndices]
 * @param {number} [p.targetMultiplier]
 * @param {number} [p.moveIndex]
 */
export function renderResult(root, p) {
  root.hidden = false;
  root.innerHTML = "";

  const multEl = document.createElement("p");
  multEl.className = "result-mult";

  const breakdownEl = document.createElement("div");
  breakdownEl.className = "result-breakdown";

  const optTitle = document.createElement("h3");
  optTitle.className = "result-opt-title";

  const optList = document.createElement("div");
  optList.className = "result-opt-list";

  if (p.kind === "attack") {
    const atks = /** @type {number[]} */ (p.chosenAttacks);
    const defs = /** @type {number[]} */ (p.defenderIndices);
    const target = /** @type {number} */ (p.targetMultiplier);
    multEl.innerHTML = `<strong>${S.targetMultiplier}:</strong> ${formatMultiplier(target)}`;
    breakdownEl.innerHTML = `<strong>${S.yourAttackChoices}</strong><br>${atks
      .map((a) => `${labelKo(idAt(a))}: ${formatMultiplier(multiplierProduct(a, defs))}`)
      .join("<br>")}`;
    const answerIndices = attackIndicesForTarget(defs, target);
    const optimal = isAttackTargetSolved(atks, defs, target);
    optTitle.textContent = S.optimalAttackTitle;
    optList.innerHTML = answerIndices
      .map((i) => `<span class="opt-chip">${labelKo(idAt(i))}</span>`)
      .join(" ");
    const note = document.createElement("p");
    note.className = "result-note";
    note.textContent = optimal ? S.alreadyOptimal : S.betterExistsAttack;
    root.append(multEl, breakdownEl, note, optTitle, optList);
  } else {
    const defs = /** @type {number[]} */ (p.chosenDefense);
    const move = /** @type {number} */ (p.moveIndex);
    const m = multiplierProduct(move, defs);
    multEl.innerHTML = `<strong>${S.yourMultiplier}:</strong> ${formatMultiplier(m)}`;
    breakdownEl.innerHTML = `<strong>${S.breakdown}</strong><br>${breakdownLines(move, defs).join("<br>")}`;
    const { optimalCombos } = optimalDefenses(move);
    const norm = [...defs].sort((a, b) => a - b);
    const optimal = optimalCombos.some(
      (c) => c.length === norm.length && c.every((v, i) => v === norm[i])
    );
    optTitle.textContent = S.optimalDefenseTitle;
    optList.innerHTML = optimalCombos
      .map((combo) => `<div class="opt-row">${combo.map((i) => labelKo(idAt(i))).join(" / ")}</div>`)
      .join("");
    const note = document.createElement("p");
    note.className = "result-note";
    note.textContent = optimal ? S.alreadyOptimal : S.betterExistsDefense;
    root.append(multEl, breakdownEl, note, optTitle, optList);
  }
}
