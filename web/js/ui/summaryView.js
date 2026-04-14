import { qs } from "./dom.js";
import { S } from "../strings.js";
import { styleFor } from "../typeStyles.js";

/**
 * @param {HTMLElement} root
 * @param {string[]} lines
 * @param {{typeKo: string; typeId: string; required: number; hit: number; miss: number; wrong: number; completion: number | null}[]} masteryRows
 * @param {() => void} onAgain
 */
export function showSummary(root, lines, masteryRows, onAgain) {
  root.innerHTML = `
    <header class="screen-header">
      <h1>${S.sessionDone}</h1>
    </header>
    <section class="card">
      <h2>${S.summaryHeading}</h2>
      <ul class="summary-list" id="summary-lines"></ul>
      <h3 class="result-opt-title">${S.masteryHeading}</h3>
      <p class="hint">${S.masteryRule}</p>
      <div id="mastery-list" class="mastery-list"></div>
      <button type="button" class="btn btn-primary" id="btn-again">${S.again}</button>
    </section>
  `;
  const ul = qs(root, "#summary-lines");
  for (const line of lines) {
    const li = document.createElement("li");
    li.textContent = line;
    ul.appendChild(li);
  }

  const masteryHost = qs(root, "#mastery-list");
  for (const row of masteryRows) {
    const el = document.createElement("div");
    el.className = "mastery-row";
    const { bg, fg } = styleFor(row.typeId);
    const pct = row.completion === null ? "-" : `${row.completion}%`;
    const barWidth = row.completion === null ? 0 : row.completion;
    el.innerHTML = `
      <div class="mastery-top">
        <span class="mastery-type" style="background:${bg};color:${fg}">${row.typeKo}</span>
        <strong>${pct}</strong>
      </div>
      <div class="mastery-bar"><span style="width:${barWidth}%"></span></div>
      <div class="mastery-meta">정답 ${row.hit} / 놓침 ${row.miss} / 오선택 ${row.wrong}</div>
    `;
    masteryHost.appendChild(el);
  }
  qs(root, "#btn-again").addEventListener("click", onAgain);
}
