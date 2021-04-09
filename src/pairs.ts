import { convertKlinesToKobjects, Kline, Kobject } from "./klines";
import pairsNames from '../dumps/binance-pairs.json'

export type PairsKlines = {
  [pair: string]: Kline[]
}

export class PairsKobjects {
  [pair: string]: Kobject[]
}


export function getCandidatePairs (symbols: string[] = [], quotes: string[] = [], leverage = false) {
  return pairsNames.filter(pair => {
    if (!leverage && (pair.s.endsWith('UP') || pair.s.endsWith('DOWN'))) {
      return false
    }
    return symbols.includes(pair.s) || quotes.includes(pair.q)
  }).map(pair => `${pair.s}${pair.q}`)
}



export function convertPairsKlinesToPairsKobjects (pairsKlines: PairsKlines): PairsKobjects {
  return Object.fromEntries(
    Object.entries(pairsKlines).map(([pair, klines]) => {
      return [pair, convertKlinesToKobjects(klines)]
    })
  )
}

export function getPairsNameObjectFromName (name: string) {
  return pairsNames.find(object => `${object.s}${object.q}` === name);
}

export function popLastDays (pairs: PairsKobjects) {
  for (const pairsKobjects of Object.values(pairs)) {
    pairsKobjects.pop()
  }
}