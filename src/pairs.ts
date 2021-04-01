import { Kline } from "./klines";
import pairs from './binance-pairs.json'
import ms from 'ms'
import fs from 'fs'
import { round, wait } from "./util";
import { fetchPairKlines } from "./binance";
import { savePairInformation } from "./io";

export type PairsKlines = {
  [pair: string]: Kline[]
}

const fetchPauseIntervalMs = 500;

export async function buildPairsData (pairs: string[], days: number = 180, debug = true) {
  // @todo in this function we should check if the pair file exists
  // if it exists we fetch only the missing days.
  let i = 1
  for (const pair of pairs) {
    // @todo check if the pair file exists (or else we fetch directly)
    if (debug) { console.log(`fetching ${pair}...`) }
    const klines = await fetchPairKlines(pair, Date.now() - ms(`${days}d`))
    // we pop the last kline (which is the current day)
    klines.pop()
    savePairInformation(pair, klines)
    if (debug) { console.log(`progression: ${(round((i * 100) / pairs.length))}%`) }
    await wait(fetchPauseIntervalMs)
    i++;
  }
  console.log('end')
}


export function getCandidatePairs (symbols: string[] = [], quotes: string[] = []) {
  return pairs.filter(pair => symbols.includes(pair.s) || quotes.includes(pair.q)).map(pair => `${pair.s}${pair.q}`)
}


export function getPairsFromFiles (pairs: string[]) {
  const _pairs: PairsKlines = {}
  for (const pair of pairs) {
    _pairs[pair] = JSON.parse(fs.readFileSync(`${__dirname}/../data/${pair}.json`).toString())
  }
  return _pairs;
}