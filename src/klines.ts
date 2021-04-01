import { PairsKlines, PairsPkObjects } from "./pairs"

export type Kline = [
  number, // open time
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number, // close time
  string, // quote asset volume
  number, // number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string // Ignore.
]

export type pkObject = {
  ot: number,
  ct: number,
  o: number,
  h: number,
  l: number,
  c: number,
  v: number
}

export type Klines = Kline[]


/**
 * Returns the last date (Date object).
 * This functions doesn't remove the last incomplete kline of the current day (from Binance data)
 * make sure to remove this day if needed in sus-functions.
 */
export function getLastDate (klines: Klines) {
  return new Date(klines[klines.length - 1][0])
}


export function sortPairsKlinesFromClassement (pairs: PairsKlines, classement: string[]) {
  const _pairs: PairsKlines = {}
  for (const pair of classement) {
    _pairs[pair] = pairs[pair]
  }
  return _pairs;
}

export function convertKlineToPkObject (kline: Kline): pkObject {
  return {
    ot: kline[0],
    ct: kline[6],
    o: parseFloat(kline[1]),
    h: parseFloat(kline[2]),
    l: parseFloat(kline[3]),
    c: parseFloat(kline[4]),
    v: parseFloat(kline[5])
  }
}

export function convertKlinesToPkObjects (klines: Klines): pkObject[] {
  return klines.map(kline => convertKlineToPkObject(kline))
}

export function convertPairsKlinesToPairsPkObject (pairsKlines: PairsKlines): PairsPkObjects {
  return Object.fromEntries(
    Object.entries(pairsKlines).map(([pair, klines]) => {
      return [pair, convertKlinesToPkObjects(klines)]
    })
  )
}