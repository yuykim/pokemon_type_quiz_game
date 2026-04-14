import { multEq } from "./multiplier.js";

/**
 * @param {number} v
 * @returns {string}
 */
export function formatMultiplier(v) {
  if (multEq(v, 0)) return "0×";
  if (multEq(v, 0.25)) return "¼×";
  if (multEq(v, 1 / 3)) return "⅓×";
  if (multEq(v, 0.5)) return "½×";
  if (multEq(v, 1)) return "1×";
  if (multEq(v, 2)) return "2×";
  if (multEq(v, 4)) return "4×";
  if (multEq(v, 8)) return "8×";
  const s = v.toFixed(3).replace(/\.?0+$/, "");
  return `${s}×`;
}
