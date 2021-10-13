import { filterStrictEvolutions } from "./filters";
import { Map, mapEvolutions, mapEvolutionsScores, sortMap } from "./maps";
import { getCandidatePairs, PairsKobjects } from "./pairs";

export type PairsEvolutionsArgv = {
  days: number,
  size: number,
  croissant: boolean,
}

export function pairsEvolutions (pairs: PairsKobjects, argv: PairsEvolutionsArgv): Map {
  return sortMap(mapEvolutions(pairs, argv.days), argv.croissant).slice(0, argv.size)
}


export type PairsEvolutionScoresArgv = {
  days: number,
  minDays: number,
  size: number,
  croissant: boolean,
}

export function pairsEvolutionScores (pairs: PairsKobjects, argv: PairsEvolutionScoresArgv): Map {
  let scores = mapEvolutionsScores(pairs, argv.days, argv.minDays)
  if (argv.croissant) {
    scores = scores.map(([pair, score]) => [pair, 1 - score])
  }
  return sortMap(scores).slice(0, argv.size)
}

export type StrictEvolutionsArgv = {
  days: number,
  minDays: number,
  ascending: boolean,
  size: number
}
export function strictEvolutions (pairs: PairsKobjects, argv: StrictEvolutionsArgv): Map {
  let evolutions = filterStrictEvolutions(pairs, argv.ascending, argv.days, argv.minDays)
  return sortMap(mapEvolutions(evolutions, argv.days), false).slice(0, argv.size)
}

export type AgeArgv = {
  age: number,
  equal: boolean
}
export function ageFunction (pairs: PairsKobjects, argv: AgeArgv): Map {
  return sortMap(Object.entries(pairs).filter(o => {
    if (argv.equal) {
      return o[1].length <= argv.age
    }
    else {
      return o[1].length < argv.age
    }
  })
  .map(([pair, o]) => [pair, o.length]))
}