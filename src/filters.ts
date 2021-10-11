import { PairsKlines, PairsKobjects } from "./pairs";

export function filterAscendingPairs (pairs: PairsKobjects, days: number, minDays: number = 0): PairsKobjects {
  return Object.fromEntries(
    Object.entries(pairs).filter(([pair, kobjects]) => {
      if (kobjects.length < minDays) { return false }
      // if (kobjects.slice(-days).some(kobject => kobject.c < kobject.o)) {
      //   return false;
      // }

      const closes = kobjects.slice(-days).map(o => o.c)
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

export function filterProgressiveAscendingPairs (pairs: PairsKobjects, days: number, minDays: number = 0): PairsKobjects {
  return Object.fromEntries(
    Object.entries(pairs).filter(([pair, kobjects]) => {
      if (kobjects.length < minDays) { return false }

      const closes = kobjects.slice(-days).map(o => o.c)
      let previous;
      let height;
      for (const close of closes) {
        if (previous) {
          if (close < previous) {
            return false
          }
          if (height !== undefined && height < close - previous) {
            return false;
          }
          height = close - previous;
        }
        previous = close
      }
      return true
    })
  )
}

export function filterPairsKlinesFromCandidates (pairs: PairsKlines, candidates: string[]) {
  const _pairs: PairsKlines = {}
  for (const candidate of candidates) {
    _pairs[candidate] = pairs[candidate]
  }
  return _pairs;
}


export function filterStrictEvolutions (pairs: PairsKobjects, ascending = true, days: number, minDays: number = 0): PairsKobjects {
  return Object.fromEntries(
    Object.entries(pairs).filter(([pair, kobjects]) => {
      if (kobjects.length < minDays || kobjects.length < days) { return false }
      // if (kobjects.slice(-days).some(kobject => kobject.c < kobject.o)) {
      //   return false;
      // }

      const closes = kobjects.slice(-days-1).map(o => o.c)
      let previous;
      for (const close of closes) {
        if (previous) {
          if ((ascending && close < previous) || (!ascending && close > previous)) {
            return false
          }
        }
        previous = close
      }
      return true
    })
  )
}