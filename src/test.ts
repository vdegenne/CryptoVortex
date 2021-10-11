#!./node_modules/.bin/ts-node

import data from '../dumps/pairs-klines.json'
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKlines } from './pairs'
import fs from 'fs'
import { filterPairsKlinesFromCandidates } from './filters'
import { pairsEvolutions } from './monitoring-functions'
import { round } from './util'
import { dumpPairsKlines } from './vortex'

(async () => {
  // const candidates = getCandidatePairs(['USDT'], ['USDT'])
  // // @ts-ignore
  // const pairs = convertPairsKlinesToPairsKobjects(filterPairsKlinesFromCandidates(data as PairsKlines, candidates))
  // const result = pairsPercent(pairs, {days: 5, size: 10})
  // console.log(result.map(([pair, v]) => [pair, `${round(v)}%`]))

  dumpPairsKlines()
})()