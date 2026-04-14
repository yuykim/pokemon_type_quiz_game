/**
 * 공격 타입(행) → 방어 타입(열) 단일 배율. 본편 규칙(문서 표 기준).
 * 값: 2 | 1 | 0.5 | 0
 */
import { TYPE_IDS } from "./types.js";

const N = 18;

/** @returns {number[][]} */
function buildChart() {
  const chart = Array.from({ length: N }, () => Array(N).fill(1));
  const I = Object.fromEntries(TYPE_IDS.map((id, i) => [id, i]));

  /**
   * @param {string} atk
   * @param {Record<number, number>} overrides
   */
  function row(atk, overrides) {
    const r = chart[I[atk]];
    for (let j = 0; j < N; j++) {
      if (overrides[j] !== undefined) r[j] = overrides[j];
    }
  }

  // 노말
  row("normal", { [I.rock]: 0.5, [I.steel]: 0.5, [I.ghost]: 0 });
  // 불꽃
  row("fire", {
    [I.grass]: 2,
    [I.ice]: 2,
    [I.bug]: 2,
    [I.steel]: 2,
    [I.fire]: 0.5,
    [I.water]: 0.5,
    [I.rock]: 0.5,
    [I.dragon]: 0.5,
  });
  // 물
  row("water", {
    [I.fire]: 2,
    [I.ground]: 2,
    [I.rock]: 2,
    [I.water]: 0.5,
    [I.grass]: 0.5,
    [I.dragon]: 0.5,
  });
  // 풀
  row("grass", {
    [I.water]: 2,
    [I.ground]: 2,
    [I.rock]: 2,
    [I.fire]: 0.5,
    [I.grass]: 0.5,
    [I.poison]: 0.5,
    [I.flying]: 0.5,
    [I.bug]: 0.5,
    [I.dragon]: 0.5,
    [I.steel]: 0.5,
  });
  // 전기
  row("electric", {
    [I.water]: 2,
    [I.flying]: 2,
    [I.grass]: 0.5,
    [I.electric]: 0.5,
    [I.dragon]: 0.5,
    [I.ground]: 0,
  });
  // 얼음
  row("ice", {
    [I.grass]: 2,
    [I.ground]: 2,
    [I.flying]: 2,
    [I.dragon]: 2,
    [I.fire]: 0.5,
    [I.water]: 0.5,
    [I.ice]: 0.5,
    [I.steel]: 0.5,
  });
  // 격투
  row("fighting", {
    [I.normal]: 2,
    [I.ice]: 2,
    [I.rock]: 2,
    [I.dark]: 2,
    [I.steel]: 2,
    [I.poison]: 0.5,
    [I.flying]: 0.5,
    [I.psychic]: 0.5,
    [I.bug]: 0.5,
    [I.fairy]: 0.5,
    [I.ghost]: 0,
  });
  // 독
  row("poison", {
    [I.grass]: 2,
    [I.fairy]: 2,
    [I.poison]: 0.5,
    [I.ground]: 0.5,
    [I.rock]: 0.5,
    [I.ghost]: 0.5,
    [I.steel]: 0,
  });
  // 땅
  row("ground", {
    [I.fire]: 2,
    [I.electric]: 2,
    [I.poison]: 2,
    [I.rock]: 2,
    [I.steel]: 2,
    [I.grass]: 0.5,
    [I.bug]: 0.5,
    [I.flying]: 0,
  });
  // 비행
  row("flying", {
    [I.grass]: 2,
    [I.fighting]: 2,
    [I.bug]: 2,
    [I.electric]: 0.5,
    [I.rock]: 0.5,
    [I.steel]: 0.5,
  });
  // 에스퍼
  row("psychic", {
    [I.fighting]: 2,
    [I.poison]: 2,
    [I.psychic]: 0.5,
    [I.steel]: 0.5,
    [I.dark]: 0,
  });
  // 벌레
  row("bug", {
    [I.grass]: 2,
    [I.psychic]: 2,
    [I.dark]: 2,
    [I.fire]: 0.5,
    [I.fighting]: 0.5,
    [I.poison]: 0.5,
    [I.flying]: 0.5,
    [I.ghost]: 0.5,
    [I.steel]: 0.5,
    [I.fairy]: 0.5,
  });
  // 바위
  row("rock", {
    [I.fire]: 2,
    [I.ice]: 2,
    [I.flying]: 2,
    [I.bug]: 2,
    [I.fighting]: 0.5,
    [I.ground]: 0.5,
    [I.steel]: 0.5,
  });
  // 고스트
  row("ghost", {
    [I.psychic]: 2,
    [I.ghost]: 2,
    [I.dark]: 0.5,
    [I.normal]: 0,
  });
  // 드래곤
  row("dragon", {
    [I.dragon]: 2,
    [I.steel]: 0.5,
    [I.fairy]: 0,
  });
  // 악
  row("dark", {
    [I.psychic]: 2,
    [I.ghost]: 2,
    [I.fighting]: 0.5,
    [I.dark]: 0.5,
    [I.fairy]: 0.5,
  });
  // 강철
  row("steel", {
    [I.ice]: 2,
    [I.rock]: 2,
    [I.fairy]: 2,
    [I.fire]: 0.5,
    [I.water]: 0.5,
    [I.electric]: 0.5,
    [I.steel]: 0.5,
  });
  // 페어리
  row("fairy", {
    [I.fighting]: 2,
    [I.dragon]: 2,
    [I.dark]: 2,
    [I.fire]: 0.5,
    [I.poison]: 0.5,
    [I.steel]: 0.5,
  });

  return chart;
}

export const CHART = buildChart();

/**
 * @param {number} attackIndex
 * @param {number} defendIndex
 */
export function cell(attackIndex, defendIndex) {
  return CHART[attackIndex][defendIndex];
}
