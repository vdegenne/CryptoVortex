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

export function getAscendingScoreClassement (pairs: PairsKlines|PairsKobjects, days: number) {

}

export function buildPairsFromClassement (pairs: PairsKlines|PairsKobjects, classement: string[]) {
  const _pairs: PairsKlines|PairsKobjects = {}
  for (const pair of classement) {
    _pairs[pair] = pairs[pair]
  }
  return _pairs;
}