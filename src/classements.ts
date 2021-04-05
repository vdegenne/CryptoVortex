import { PairsKlines, PairsKobjects } from "./pairs";

export function getPairsKlinesVolumeClassement (pairs: PairsKlines, volumeDays: number) {
  const volumes: [string, number][] = Object.entries(pairs).map(([pair, klines]) => {
    const volumes = klines.slice(-volumeDays).map(kline => parseFloat(kline[5]))
    const volumesAverage = volumes.reduce((acc, curr) => acc + curr, 0) / volumes.length
    return [
      pair,
      volumesAverage
    ]
  })

  // sort the volumes
  volumes.sort((a, b) => {
    return b[1] - a[1]
  })

  return volumes;
}

export function getPairsKobjectsVolumeClassement (pairs: PairsKobjects, volumeDays: number) {
  const volumes: [string, number][] = Object.entries(pairs).map(([pair, kobjects]) => {
    const volumes = kobjects.slice(-volumeDays).map(kobject => kobject.v)
    const volumesAverage = volumes.reduce((acc, curr) => acc + curr, 0) / volumes.length
    return [
      pair,
      volumesAverage
    ]
  })

  // sort the volumes
  volumes.sort((a, b) => {
    return b[1] - a[1]
  })

  return volumes;
}


export function getNewestClassement (pairs: PairsKlines|PairsKobjects) {
  const lengths: [string, number][] = Object.entries(pairs).map(([pair, klines]) => [pair, klines.length])

  lengths.sort((a, b) => {
    return a[1] - b[1];
  })

  return lengths;
}

export function getPairsKobjectsAscendingScoresClassement (pairs: PairsKobjects, days: number, minDays: number = 0) {
  const scores: [string, number][] = Object.entries(pairs).map(([pair, kobjects]) => {
    const closes = kobjects.slice(-days).filter(kobject => {
      if (kobjects.length < minDays) { return false }
      return true;
    }).map(kobject => kobject.c)
    let ascendCount = 0;
    let previous;
    for (const close of closes) {
      if (previous) {
        if (close >= previous) {
          ascendCount++;
        }
      }
      previous = close
    }
    return [pair, ascendCount/closes.length]
  })

  scores.sort((a, b) => {
    return b[1] - a[1]
  })

  return scores;
}

export function buildPairsFromClassement (pairs: PairsKlines|PairsKobjects, classement: string[]) {
  const _pairs: PairsKlines|PairsKobjects = {}
  for (const pair of classement) {
    _pairs[pair] = pairs[pair]
  }
  return _pairs;
}