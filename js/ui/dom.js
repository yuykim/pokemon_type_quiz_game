/**
 * @param {ParentNode} root
 * @param {string} sel
 * @returns {HTMLElement}
 */
export function qs(root, sel) {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return /** @type {HTMLElement} */ (el);
}

/**
 * @param {string} sel
 */
export function qsDoc(sel) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return /** @type {HTMLElement} */ (el);
}
