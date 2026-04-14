import { TYPE_IDS } from "../types.js";
import { labelKo } from "../types.js";
import { styleFor } from "../typeStyles.js";

/**
 * @param {HTMLElement} container
 * @param {(typeIndex: number) => void} onPick
 */
export function mountTypeGrid(container, onPick) {
  container.replaceChildren();
  container.classList.add("type-grid");
  TYPE_IDS.forEach((id, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "type-tile";
    btn.dataset.typeIndex = String(index);
    const { bg, fg } = styleFor(id);
    btn.style.setProperty("--tile-bg", bg);
    btn.style.setProperty("--tile-fg", fg);
    btn.textContent = labelKo(id);
    btn.addEventListener("click", () => onPick(index));
    container.appendChild(btn);
  });
}

/**
 * @param {HTMLElement} container
 * @param {Set<number> | number[] | null} selected
 */
export function updateTypeGridSelection(container, selected) {
  const set =
    selected == null
      ? new Set()
      : selected instanceof Set
        ? selected
        : new Set(Array.isArray(selected) ? selected : [selected]);
  container.querySelectorAll(".type-tile").forEach((node) => {
    const el = /** @type {HTMLButtonElement} */ (node);
    const idx = Number(el.dataset.typeIndex);
    el.classList.toggle("type-tile--selected", set.has(idx));
  });
}

/**
 * @param {HTMLElement} container
 */
export function clearTypeGridSelection(container) {
  container.querySelectorAll(".type-tile").forEach((node) => {
    const el = /** @type {HTMLButtonElement} */ (node);
    el.classList.remove("type-tile--selected");
  });
}
