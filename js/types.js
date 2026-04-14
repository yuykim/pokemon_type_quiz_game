/** 타입 순서(표·정규화 기준) — 한글 라벨은 UI 전용 */

export const TYPE_IDS = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

/** @type {Record<string, number>} */
export const TYPE_INDEX = Object.fromEntries(TYPE_IDS.map((id, i) => [id, i]));

const KO = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  grass: "풀",
  electric: "전기",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
};

/**
 * @param {string} typeId
 * @returns {string}
 */
export function labelKo(typeId) {
  return KO[typeId] ?? typeId;
}

/**
 * @param {number} index
 * @returns {string}
 */
export function idAt(index) {
  return TYPE_IDS[index];
}
