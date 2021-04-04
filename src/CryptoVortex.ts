import { getPairsKlinesFromBinance, getCandidatePairs, getPairsKlinesFromFiles } from "./pairs";
import ms from 'ms'
import { getVolumeClassement } from "./classements";
import { sortPairsKlinesFromClassement } from "./klines";
import { vortexDump, saveVortexDumpToFile } from "./vortex";
import fs from 'fs'


async function Ailurophilium (symbols: string[], quotes: string[], days: number, volumeDays: number, pairsLength: number) {
  const candidates = getCandidatePairs(symbols, quotes)
  console.log(`numbers of pairs in the process : ${candidates.length}`)
  const start = Date.now()
  await getPairsKlinesFromBinance(candidates, days, true)
  const end = Date.now()
  console.log(`pairs fetched and saved (${ms(end - start)})`)
  // const pairsKlines = getPairsFromFiles(candidates)
  // let volumeClassement = buildVolumeClassement(pairsKlines, volumeDays)
  // we prune the classement to have a constrained pairsKlines length
  // volumeClassement = volumeClassement.slice(0, pairsLength)
  // and we build the sorted pairs klines
  // const sortedPairsKlines = sortPairsKlinesFromClassement(pairsKlines, volumeClassement)

  // time to convert the pairs klines to the AilurophiliumBlock
  // const block = convertPairsKlinesToAilurophiliumBlock(sortedPairsKlines)

  // saveAilurophiliumBlockToFile(block)
  // console.log(Object.keys(prunedPairsKlines))
  // console.log(`number of pairs in the PairsKlines : ${Object.keys(prunedPairsKlines).length}`)
}

Ailurophilium(
  ['USDT', 'EUR'],
  ['USDT', 'EUR'],
  180, // days
  5, // number of days to retain for the volume calculation (classement)
  200, // number of pairs to retain in the final structure
)