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