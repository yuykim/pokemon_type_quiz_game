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
    const chosenSet = new Set(atks);
    const answerSet = new Set(answerIndices);
    const hit = atks.filter((i) => answerSet.has(i));
    const wrong = atks.filter((i) => !answerSet.has(i));
    const missed = answerIndices.filter((i) => !chosenSet.has(i));
    optList.innerHTML = `
      <div class="answer-legend">
        <span class="legend-item"><span class="legend-dot legend-dot--hit"></span> ${S.legendHit}</span>
        <span class="legend-item"><span class="legend-dot legend-dot--wrong"></span> ${S.legendWrong}</span>
        <span class="legend-item"><span class="legend-dot legend-dot--missed"></span> ${S.legendMissed}</span>
      </div>
      <div class="answer-group"><strong>${S.legendHit}</strong><br>${renderTypedChips(hit, "opt-chip--hit")}</div>
      <div class="answer-group"><strong>${S.legendWrong}</strong><br>${renderTypedChips(wrong, "opt-chip--wrong")}</div>
      <div class="answer-group"><strong>${S.legendMissed}</strong><br>${renderTypedChips(missed, "opt-chip--missed")}</div>
    `;
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

/**
 * @param {number[]} indices
 * @param {string} klass
 */
function renderTypedChips(indices, klass) {
  if (indices.length === 0) return `<span class="opt-chip opt-chip--empty">${S.none}</span>`;
  return indices
    .map((i) => `<span class="opt-chip ${klass}">${labelKo(idAt(i))}</span>`)
    .join(" ");
}
