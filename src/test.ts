#!./node_modules/.bin/ts-node

import data from '../dumps/pairs-klines.json'
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKlines } from './pairs'
import fs from 'fs'
import { filterPairsKlinesFromCandidates } from './filters'
import { pairsEvolutions } from './monitoring-functions'
import { round } from './util'
import { dumpPairsKlines } from './vortex'
import _pairsNames from '../dumps/binance-pairs.json'

(async () => {
  const candidates = getCandidatePairs(_pairsNames, ['USDT'], ['USDT'])

  const files = fs.readdirSync(`${__dirname}/../data`)
  const pairs: PairsKlines = {}
  for (const file of files) {
    const name = file.split('.')[0]
    pairs[name] = JSON.parse(fs.readFileSync(`${__dirname}/../data/${file}`).toString())
  }

  fs.writeFileSync(`${__dirname}/../dumps/pairs-klines.json`, JSON.stringify(pairs))

  // // @ts-ignore
  // const pairs = convertPairsKlinesToPairsKobjects(filterPairsKlinesFromCandidates(data as PairsKlines, candidates))
  // const result = pairsPercent(pairs, {days: 5, size: 10})
  // console.log(result.map(([pair, v]) => [pair, `${round(v)}%`]))


  // dumpPairsKlines()
})()