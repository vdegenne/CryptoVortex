import { convertKlinesToKobjects, Kline, Kobject } from "./klines";
import pairs from './binance-pairs.json'
import ms from 'ms'
import fs from 'fs'
import { round, wait } from "./util";
import { fetchPairKlines } from "./binance";
import { savePairInformation } from "./io";

export type PairsKlines = {
  [pair: string]: Kline[]
}

export class PairsKobjects {
  [pair: string]: Kobject[]
}




export function getCandidatePairs (symbols: string[] = [], quotes: string[] = [], leverage = false) {
  return pairs.filter(pair => {
    if (!leverage && (pair.s.endsWith('UP') || pair.s.endsWith('DOWN'))) {
      return false
    }
    return symbols.includes(pair.s) || quotes.includes(pair.q)
  }).map(pair => `${pair.s}${pair.q}`)
}


export function getPairsKlinesFromFiles (pairs: string[]) {
  const _pairs: PairsKlines = {}
  for (const pair of pairs) {
    _pairs[pair] = JSON.parse(fs.readFileSync(`${__dirname}/../data/${pair}.json`).toString())
  }
  return _pairs;
}

/**
 * This function hits two birds with one rock.
 * It fetches the pairs' data from Binance and returns an updated PairsKlines structure.
 * As the pairs' data is fetched from Binance, each pair's information is saved in separate
 * file on the filesystem for reusable purpose.
 */
export async function getPairsKlinesFromBinance (pairs: string[], days: number = 180, pauseMs: number = 150, debug = false) {
  // @todo in this function we should check if the pair file exists
  // if it exists we fetch only the missing days.
  const pairsKlines: PairsKlines = {}
  let i = 1
  for (const pair of pairs) {
    // @todo check if the pair file exists (or else we fetch directly)
    if (debug) { console.log(`fetching ${pair}...`) }
    const klines = await fetchPairKlines(pair, Date.now() - ms(`${days}d`))
    // we pop the last kline (which is the current day)
    klines.pop()
    savePairInformation(pair, klines)
    pairsKlines[pair] = klines;
    if (debug) { console.log(`progression: ${(round((i * 100) / pairs.length))}%`) }
    await wait(pauseMs)
    i++;
  }
  return pairsKlines;
}

export function convertPairsKlinesToPairsKobjects (pairsKlines: PairsKlines): PairsKobjects {
  return Object.fromEntries(
    Object.entries(pairsKlines).map(([pair, klines]) => {
      return [pair, convertKlinesToKobjects(klines)]
    })
  )
}