import { qs } from "./dom.js";
import { S } from "../strings.js";
import { N_MIN, N_MAX } from "../config.js";

/**
 * @param {HTMLElement} root
 * @param {(payload: { allowDual: boolean; mode: "attack" | "defense" | "both"; nRaw: string }) => void} onStart
 */
export function mountSetupView(root, onStart) {
  root.innerHTML = `
    <header class="screen-header">
      <h1>${S.appTitle}</h1>
      <p class="muted">${S.copyrightNote}</p>
    </header>
    <section class="card" aria-labelledby="setup-h">
      <h2 id="setup-h">${S.setupHeading}</h2>
      <fieldset class="field">
        <legend>${S.defenderMode}</legend>
        <label class="choice"><input type="radio" name="dual" value="single" checked /> ${S.defenderSingle}</label>
        <label class="choice"><input type="radio" name="dual" value="dual" /> ${S.defenderDual}</label>
      </fieldset>
      <fieldset class="field">
        <legend>${S.practiceMode}</legend>
        <label class="choice"><input type="radio" name="mode" value="attack" checked /> ${S.modeAttack}</label>
        <label class="choice"><input type="radio" name="mode" value="defense" /> ${S.modeDefense}</label>
        <label class="choice"><input type="radio" name="mode" value="both" /> ${S.modeBoth}</label>
      </fieldset>
      <div class="field">
        <label for="n-count">${S.questionCount}</label>
        <input id="n-count" class="input-n" type="number" inputmode="numeric" min="${N_MIN}" max="${N_MAX}" value="10" />
        <p class="hint">${S.nHint}</p>
      </div>
      <p class="error" id="setup-error" hidden></p>
      <button type="button" class="btn btn-primary" id="btn-start">${S.start}</button>
    </section>
  `;

  const err = qs(root, "#setup-error");
  const btn = qs(root, "#btn-start");

  btn.addEventListener("click", () => {
    const dual = /** @type {HTMLInputElement} */ (root.querySelector('input[name="dual"]:checked')).value;
    const mode = /** @type {HTMLInputElement} */ (root.querySelector('input[name="mode"]:checked')).value;
    const nRaw = /** @type {HTMLInputElement} */ (qs(root, "#n-count")).value;
    err.hidden = true;
    onStart({
      allowDual: dual === "dual",
      mode: /** @type {"attack" | "defense" | "both"} */ (mode),
      nRaw,
    });
  });
}

/**
 * @param {HTMLElement} root
 * @param {string} messageKey
 */
export function showSetupError(root, messageKey) {
  const err = qs(root, "#setup-error");
  err.hidden = false;
  err.textContent = messageKey === "invalid_n" ? S.nInvalid : messageKey;
}
