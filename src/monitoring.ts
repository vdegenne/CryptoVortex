import pairs from './binance-pairs.json'
import { buildVolumeClassement } from './classement';
import { convertPairsKlinesToPairsPkObject } from './klines';
import { getCandidatePairs, getPairsFromFiles, PairsPkObjects } from './pairs';
import { getAscendingPairs } from './pairs-stat';


function logAscendingPairsClassement (pairs: PairsPkObjects, ascendingDays: number, minDays: number, volumeDays: number) {
  const ascendings = getAscendingPairs(pairs, ascendingDays, minDays)
  const classement = buildVolumeClassement(ascendings, volumeDays)
  console.log(`ascending pairs (6 days): ${classement.join(', ')}`)
}

function main () {
  console.log(`number of available pairs (Binance): ${pairs.length}`)
  const candidates = getCandidatePairs(['USDT'], ['USDT']);
  console.log(`number of USDT pairs : ${candidates.length}`)
  const Pairs = getPairsFromFiles(candidates)
  const pairsPkObjects = convertPairsKlinesToPairsPkObject(Pairs)

  // getLowerKlinesLengthPair(Pairs)
  // console.log(
  //   buildVolumeClassement(Pairs, 5)
  // )

  logAscendingPairsClassement(pairsPkObjects, 6, 10, 5)
}

main()