import { PairsKlines, PairsPkObjects } from './pairs'


export function getLowerKlinesLengthPair (pairs: PairsKlines) {
  const lengths: [string, number][] = Object.entries(pairs).map(([pair, klines]) => [pair, klines.length])

  lengths.sort((a, b) => {
    return a[1] - b[1];
  })

  return lengths;
}

export function getAscendingPairs (pairs: PairsPkObjects, days: number, minDays: number) {
  return Object.fromEntries(
    Object.entries(pairs).filter(([pair, pkObjects]) => {
      if (pkObjects.length < minDays) { return false }
      if (pkObjects.slice(-days).some(pkObject => pkObject.c < pkObject.o)) {
        return false;
      }

      const closes = pkObjects.slice(-days).map(o => o.c)
      let previous;
      for (const close of closes) {
        if (previous) {
          if (close < previous) {
            return false
          }
        }
        previous = close
      }
      return true
    })
  )
}

