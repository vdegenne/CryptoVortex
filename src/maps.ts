import { PairsKobjects } from "./pairs";
import { percent } from "./util";

export type Map = [string, number][]

export function mapEvolutions (pairs: PairsKobjects, days: number): Map {
  return Object.entries(pairs)
  .filter(([pair, o]) => o.length >= days)
  .map(([pair, o]) => {
    return [
      pair,
      percent(o[o.length - days].o, o[o.length - 1].c)
    ]
  })
}

/**
 * Map the score of the evolutions
 */
export function mapEvolutionsScores (pairs: PairsKobjects, days: number, minDays: number = 0): Map {
  const scores: Map = Object.entries(pairs)
  .filter(([pair, kobjects]) => kobjects.length >= days && kobjects.length >= minDays)
  .map(([pair, kobjects]) => {
    const closes = kobjects.slice(-days-1).map(kobject => kobject.c)
    let aCount = 0;
    let previous;
    for (const close of closes) {
      if (previous) {
        if (close >= previous) {
          aCount++;
        }
      }
      previous = close
    }
    return [pair, aCount/days]
  })

  scores.sort((a, b) => {
    return b[1] - a[1]
  })

  return scores;
}

export function sortMap (map: Map, croissant = false): Map {
  return map.sort((a, b) => {
    if (!croissant) {
      return b[1] - a[1]
    }
    return a[1] - b[1]
  })
}