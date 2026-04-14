/** 기획서 §9 커뮤니티 팔레트 — 배경·전경 */

/** @type {Record<string, { bg: string; fg: string }>} */
export const TYPE_STYLE = {
  normal: { bg: "#A8A77A", fg: "#2C2C2C" },
  fire: { bg: "#EE8130", fg: "#FFFFFF" },
  water: { bg: "#6390F0", fg: "#FFFFFF" },
  grass: { bg: "#7AC74C", fg: "#1A1A1A" },
  electric: { bg: "#F7D02C", fg: "#1A1A1A" },
  ice: { bg: "#96D9D6", fg: "#1A1A1A" },
  fighting: { bg: "#C22E28", fg: "#FFFFFF" },
  poison: { bg: "#A33EA1", fg: "#FFFFFF" },
  ground: { bg: "#E2BF65", fg: "#1A1A1A" },
  flying: { bg: "#A98FF3", fg: "#1A1A1A" },
  psychic: { bg: "#F95587", fg: "#FFFFFF" },
  bug: { bg: "#A6B91A", fg: "#1A1A1A" },
  rock: { bg: "#B6A136", fg: "#1A1A1A" },
  ghost: { bg: "#735797", fg: "#FFFFFF" },
  dragon: { bg: "#6F35FC", fg: "#FFFFFF" },
  dark: { bg: "#705746", fg: "#FFFFFF" },
  steel: { bg: "#B7B7CE", fg: "#1A1A1A" },
  fairy: { bg: "#D685AD", fg: "#1A1A1A" },
};

/**
 * @param {string} typeId
 */
export function styleFor(typeId) {
  return TYPE_STYLE[typeId] ?? { bg: "#444", fg: "#fff" };
}
