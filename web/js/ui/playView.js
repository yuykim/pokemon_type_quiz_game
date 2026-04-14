import { qs } from "./dom.js";
import { labelKo, idAt } from "../types.js";
import { styleFor } from "../typeStyles.js";
import { mountTypeGrid, updateTypeGridSelection, clearTypeGridSelection } from "./typeGrid.js";
import { renderResult } from "./resultView.js";
import { S } from "../strings.js";
import { formatMultiplier } from "../math/formatMultiplier.js";

/**
 * @param {HTMLElement} root
 * @param {import("../sessionController.js").SessionController} session
 * @param {(finished: boolean) => void} onSessionEnd
 */
export function mountPlayView(root, session, onSessionEnd) {
  root.innerHTML = `
    <div class="play-top">
      <p class="progress" id="play-progress"></p>
      <p class="problem-kind" id="play-kind"></p>
    </div>
    <div class="card play-card">
      <div id="play-context"></div>
      <p class="prompt" id="play-prompt"></p>
      <div id="defense-slots" class="defense-slots" hidden></div>
      <div id="type-grid-host" class="type-grid-host"></div>
      <div class="actions">
        <button type="button" class="btn btn-primary" id="btn-primary"></button>
        <button type="button" class="btn" id="btn-next" hidden>${S.next}</button>
      </div>
    </div>
    <div id="result-panel" class="card result-panel" hidden></div>
  `;

  const elProgress = qs(root, "#play-progress");
  const elKind = qs(root, "#play-kind");
  const elContext = qs(root, "#play-context");
  const elPrompt = qs(root, "#play-prompt");
  const elSlots = qs(root, "#defense-slots");
  const gridHost = qs(root, "#type-grid-host");
  const btnPrimary = qs(root, "#btn-primary");
  const btnNext = qs(root, "#btn-next");
  const resultPanel = qs(root, "#result-panel");

  /** @type {"answer" | "result"} */
  let phase = "answer";
  /** @type {number[]} */
  let attackPicks = [];
  /** @type {number[]} */
  let defensePicks = [];

  function pill(typeIndex) {
    const id = idAt(typeIndex);
    const { bg, fg } = styleFor(id);
    const span = document.createElement("span");
    span.className = "type-pill";
    span.style.background = bg;
    span.style.color = fg;
    span.textContent = labelKo(id);
    return span;
  }

  function renderDefenseSlots() {
    elSlots.hidden = false;
    elSlots.innerHTML = `
      <div class="slot-row"><span class="slot-label">${S.slot1}</span><span id="slot-0" class="slot-value"></span></div>
      <div class="slot-row"><span class="slot-label">${S.slot2}</span><span id="slot-1" class="slot-value"></span></div>
      <button type="button" class="btn btn-small" id="btn-clear-slots">${S.clearSlots}</button>
    `;
    qs(root, "#btn-clear-slots").addEventListener("click", () => {
      defensePicks = [];
      syncDefenseUi();
    });
  }

  function syncDefenseUi() {
    const s0 = root.querySelector("#slot-0");
    const s1 = root.querySelector("#slot-1");
    if (!s0 || !s1) return;
    s0.replaceChildren(defensePicks[0] !== undefined ? pill(defensePicks[0]) : document.createTextNode("—"));
    s1.replaceChildren(defensePicks[1] !== undefined ? pill(defensePicks[1]) : document.createTextNode("—"));
    updateTypeGridSelection(gridHost, defensePicks);
  }

  function handleTypeClick(index) {
    const p = session.current;
    if (phase !== "answer" || !p) return;

    if (p.kind === "attack") {
      const i = attackPicks.indexOf(index);
      if (i === -1) attackPicks.push(index);
      else attackPicks.splice(i, 1);
      updateTypeGridSelection(gridHost, attackPicks);
      return;
    }

    const i = defensePicks.indexOf(index);
    if (i !== -1) {
      defensePicks.splice(i, 1);
      syncDefenseUi();
      return;
    }
    if (defensePicks.length === 0) {
      defensePicks.push(index);
    } else if (defensePicks.length === 1) {
      if (defensePicks[0] === index) return;
      defensePicks.push(index);
    } else {
      const a = defensePicks[0];
      if (index === a) return;
      defensePicks = [a, index];
    }
    syncDefenseUi();
  }

  function renderAnswerPhase() {
    phase = "answer";
    resultPanel.hidden = true;
    btnNext.hidden = true;
    btnPrimary.hidden = false;
    attackPicks = [];
    defensePicks = [];
    clearTypeGridSelection(gridHost);

    const p = session.current;
    if (!p) return;

    elProgress.textContent = S.progress(session.index + 1, session.problems.length);
    elContext.replaceChildren();
    elSlots.hidden = true;
    elSlots.innerHTML = "";

    if (p.kind === "attack") {
      elKind.textContent = S.problemAttack;
      elPrompt.textContent = S.pickAttackType;
      btnPrimary.textContent = S.attackBtn;
      const row = document.createElement("div");
      row.className = "context-row";
      row.innerHTML = `<span class="context-label">${S.opponentTypes}</span>`;
      const pills = document.createElement("span");
      pills.className = "pill-row";
      p.defenderIndices.forEach((di) => pills.appendChild(pill(di)));
      row.appendChild(pills);
      elContext.appendChild(row);

      const row2 = document.createElement("div");
      row2.className = "context-row";
      row2.innerHTML = `<span class="context-label">${S.targetMultiplier}</span><strong>${formatMultiplier(p.targetMultiplier)}</strong>`;
      elContext.appendChild(row2);
    } else {
      elKind.textContent = S.problemDefense;
      elPrompt.textContent = S.pickDefenseTypes;
      btnPrimary.textContent = S.defenseBtn;
      const row = document.createElement("div");
      row.className = "context-row";
      row.innerHTML = `<span class="context-label">${S.incomingMove}</span>`;
      const pills = document.createElement("span");
      pills.className = "pill-row";
      pills.appendChild(pill(p.moveIndex));
      row.appendChild(pills);
      elContext.appendChild(row);
      renderDefenseSlots();
      syncDefenseUi();
    }

    mountTypeGrid(gridHost, handleTypeClick);
    if (p.kind === "attack") {
      updateTypeGridSelection(gridHost, attackPicks);
    }
  }

  function onPrimaryClick() {
    const p = session.current;
    if (!p || phase !== "answer") return;

    if (p.kind === "attack") {
      if (attackPicks.length < 1) return;
      session.recordAttackSubmit(attackPicks);
      phase = "result";
      btnPrimary.hidden = true;
      btnNext.hidden = false;
      renderResult(resultPanel, {
        kind: "attack",
        chosenAttacks: attackPicks,
        defenderIndices: p.defenderIndices,
        targetMultiplier: p.targetMultiplier,
      });
      return;
    }

    if (defensePicks.length < 1) return;
    session.recordDefenseSubmit(defensePicks);
    phase = "result";
    btnPrimary.hidden = true;
    btnNext.hidden = false;
    renderResult(resultPanel, {
      kind: "defense",
      chosenDefense: defensePicks,
      moveIndex: p.moveIndex,
    });
  }

  function onNextClick() {
    session.advance();
    if (session.finished) {
      onSessionEnd(true);
      return;
    }
    renderAnswerPhase();
  }

  btnPrimary.addEventListener("click", onPrimaryClick);
  btnNext.addEventListener("click", onNextClick);

  renderAnswerPhase();
}
