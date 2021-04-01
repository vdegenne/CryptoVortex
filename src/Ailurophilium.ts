import { buildPairsData, getCandidatePairs } from "./pairs";
import ms from 'ms'


async function Ailurophilium (symbols: string[], quotes: string[], days: number, volumeDays: number) {
  const candidates = getCandidatePairs(symbols, quotes)
  console.log(`numbers of pairs in the process : ${candidates.length}`)
  const start = Date.now()
  await buildPairsData(candidates, days, true)
  const end = Date.now()
  console.log(`pairs fetched and saved (${ms(end - start)})`)
}

Ailurophilium(
  ['USDT'],
  ['USDT'],
  180, // days
  5
)