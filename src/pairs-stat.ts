import pairs from './binance-pairs.json'
import { buildVolumeClassement } from './classement';
import { getCandidatePairs, getPairsFromFiles, PairsKlines } from './pairs'


function main () {
  console.log(`number of available pairs (Binance): ${pairs.length}`)
  const candidates = getCandidatePairs(['USDT'], ['USDT']);
  console.log(`number of USDT pairs : ${candidates.length}`)
  const Pairs = getPairsFromFiles(candidates)
  // getLowerKlinesLengthPair(Pairs)
  console.log(
    buildVolumeClassement(Pairs, 5)
  )
}


export function getLowerKlinesLengthPair (pairs: PairsKlines) {
  const lengths: [string, number][] = Object.entries(pairs).map(([pair, klines]) => [pair, klines.length])

  lengths.sort((a, b) => {
    return a[1] - b[1];
  })

  return lengths;
}


main()