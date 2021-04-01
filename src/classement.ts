import { PairsKlines, PairsPkObjects } from "./pairs";

export function buildVolumeClassement (pairs: PairsPkObjects, volumeDays: number) {
  const volumes: [string, number][] = Object.entries(pairs).map(([pair, pkObjects]) => {
    const volumes = pkObjects.slice(-volumeDays).map(pkObject => pkObject.v)
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

  return volumes.map(v => v[0]);
}