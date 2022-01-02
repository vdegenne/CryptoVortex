import { PairName } from "../pairs";

// export async function fetchBinancePairs () {
//   const response = await fetch(`https://www.binance.com/api/v3/exchangeInfo`)
//   const data = await response.json()
//   const pairs = data.symbols
//     .filter(s => s.status === 'TRADING')
//     .map(s => ({
//       s: s.baseAsset,
//       q: s.quoteAsset
//     }))
//   return pairs as PairName[];
// }

export async function fetchLocalBinancePairs() {
  return await (await fetch('./dumps/binance-pairs.json')).json() as PairName[]
}

export async function fetchLocalPairsKlines() {
  return await (await fetch('./dumps/pairs-klines.json')).json()
}

export function goToCryptowatch (base: string, quote: string) {
  window.open(`https://cryptowat.ch/charts/BINANCE:${base}-${quote}`, '_blank')
}