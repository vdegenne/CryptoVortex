import { Pairs } from "./pairs";

export function buildVolumeClassement (pairs: Pairs, volumeDays: number) {
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