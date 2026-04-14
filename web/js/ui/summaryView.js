import { qs } from "./dom.js";
import { S } from "../strings.js";

/**
 * @param {HTMLElement} root
 * @param {string[]} lines
 * @param {() => void} onAgain
 */
export function showSummary(root, lines, onAgain) {
  root.innerHTML = `
    <header class="screen-header">
      <h1>${S.sessionDone}</h1>
    </header>
    <section class="card">
      <h2>${S.summaryHeading}</h2>
      <ul class="summary-list" id="summary-lines"></ul>
      <button type="button" class="btn btn-primary" id="btn-again">${S.again}</button>
    </section>
  `;
  const ul = qs(root, "#summary-lines");
  for (const line of lines) {
    const li = document.createElement("li");
    li.textContent = line;
    ul.appendChild(li);
  }
  qs(root, "#btn-again").addEventListener("click", onAgain);
}
