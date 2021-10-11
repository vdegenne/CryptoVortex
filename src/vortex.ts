#!./node_modules/.bin/ts-node

import fs from 'fs'
import yargs from 'yargs';
import { buildPairsFromClassement, getPairsKlinesVolumeClassement } from './classements';
import { assets, daysWindow, dumpSize, includesLeverage, volumeDays } from './defaults';
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKlines } from "./pairs";
import fetch from 'node-fetch'
import { percent, round, wait } from './util';
import { fetchPairKlines } from './binance';
import { savePairInformation } from './io';
import ms from 'ms'
import pairsNames from './binance-pairs.json'

export type Dump = {
  [pair: string]: [string, number, number][]
}

export function vortexDump (pairs: PairsKlines) {
  return Object.fromEntries(
    Object.entries(pairs).map(([pair, klines]) => {
      return [
        pair,
        klines.map(kline => {
          return [
            new Date(kline[0]).toLocaleDateString('fr-FR'),
            percent(parseFloat(kline[1]), parseFloat(kline[2])),
            percent(parseFloat(kline[1]), parseFloat(kline[3]))
          ]
        })
      ]
    })
  ) as Dump
}

export function dumpMmax (pairs: PairsKlines): number[] {
  return Object.values(pairs).map(klines => klines.map(kline => {
    return percent(parseFloat(kline[1]), parseFloat(kline[2]))
  })).reduce((acc, curr) => acc.concat(curr), [])
}
export function dumpDmax (pairs: PairsKlines): number[] {
  return Object.values(pairs).map(klines => klines.map(kline => {
    return percent(parseFloat(kline[1]), parseFloat(kline[3]))
  })).reduce((acc, curr) => acc.concat(curr), [])
}
export function dumpEvolutions (pairs: PairsKlines): number[] {
  return Object.values(pairs).map(klines => klines.map(kline => {
    return percent(parseFloat(kline[1]), parseFloat(kline[4]))
  })).reduce((acc, curr) => acc.concat(curr), [])
}

export function saveVortexDumpToFile (dump: Dump) {
  fs.writeFileSync(`${__dirname}/../dumps/vortex-dump.json`, JSON.stringify(
    Object.entries(dump)
  ))
}


async function buildBinancePairs () {
  const response = await fetch(`https://www.binance.com/api/v3/exchangeInfo`)
  const data = await response.json()

  // save the file locally
  fs.writeFileSync(`${__dirname}/../binance/exchangeInfo.json`, JSON.stringify(data))

  // build and save the pairs file
  const pairs = data.symbols
    .filter(s => s.status === 'TRADING')
    .map(s => ({
      s: s.baseAsset,
      q: s.quoteAsset
    }))
  // save the file
  fs.writeFileSync(`${__dirname}/binance-pairs.json`, JSON.stringify(pairs))

  console.log(`saved ${pairs.length} pairs`)
}

function main () {
  const argv = yargs(process.argv.slice(2))
  .option('assets', {
    describe: 'assets to fetch',
    alias: 'a',
    type: 'array',
    default: assets
  })
  .command('binance-pairs', 'fetch and save Binance available pairs\' information', {}, async () => {
    await buildBinancePairs()
  })
  .command('binance [days] [pause] [options]', 'fetch pairs\' information from Binance', (yargs) => {
    yargs
    .positional('days', {
      describe: 'window of days to fetch for each pair',
      alias: 'd',
      type: 'number',
      default: daysWindow
    })
    .positional('pause', {
      describe: 'time to wait between each requests (milliseconds)',
      alias: 'p',
      type: 'number',
      default: 150
    })
  }, binance)
  .command('dump [size] [volumeDays] [leverage]', 'convert the data slurped by the vortex into a usable json\nvolume sorted and trimmed to size', (yargs) => {
    yargs
    .positional('size', {
      describe: 'size of the final top list',
      alias: 's',
      type: 'number',
      default: dumpSize
    })
    .positional('volumeDays', {
      describe: 'window of days to calculate for the volume classement',
      alias: 'v',
      type: 'number',
      default: volumeDays
    })
    .positional('leverage', {
     describe: 'include the leverage pairs',
     alias: 'l',
     type: 'boolean',
     default: includesLeverage
    })
  }, dump)
  .help()
  .version()
  .argv;
}

async function binance (argv) {
  const candidates = getCandidatePairs(pairsNames, argv.assets, argv.assets)
  console.log(`These assets will be fetched: ${argv.assets.join(', ')}`)
  const pairsKlines = await getPairsKlinesFromBinance(candidates, argv.days, argv.pause, true)
  // save the pairsKlines into a dump for general utilisation
  dumpPairsKlines()
  console.log(`Assets' information fetched`)
}

async function dump (argv) {
  const candidates = getCandidatePairs(argv.assets, argv.assets, argv.leverage)
  const pairs = getPairsKlinesFromFiles(candidates)
  const classement = getPairsKlinesVolumeClassement(pairs, argv.volumeDays).slice(0, argv.size)
  const sortedPairs = buildPairsFromClassement(pairs, classement.map(p => p[0])) as PairsKlines
  // get vortex dump and save to file
  saveVortexDumpToFile(vortexDump(sortedPairs))
  fs.writeFileSync(`${__dirname}/../dumps/m-max.json`, JSON.stringify(dumpMmax(sortedPairs)))
  fs.writeFileSync(`${__dirname}/../dumps/d-max.json`, JSON.stringify(dumpDmax(sortedPairs)))
  fs.writeFileSync(`${__dirname}/../dumps/evolutions.json`, JSON.stringify(dumpEvolutions(sortedPairs)))
  fs.writeFileSync(`${__dirname}/../dumps/test.json`, JSON.stringify(
    Object.fromEntries(Object.entries(convertPairsKlinesToPairsKobjects(sortedPairs)).map(([pair, kobjects]) => {
      return [
        pair,
        kobjects.map(kobject => ({
          j: new Date(kobject.ot).toLocaleDateString('fr-FR'),
          m: percent(kobject.o, kobject.h),
          d: percent(kobject.o, kobject.l)
        }))
      ]
    }))
  ))
  console.log('saved to file successfully')
}

main()


export function getPairsKlinesFromFiles (pairs: string[]) {
  const _pairs: PairsKlines = {}
  for (const pair of pairs) {
    try {
      _pairs[pair] = JSON.parse(fs.readFileSync(`${__dirname}/../data/${pair}.json`).toString())
    }
    catch (e) {}
  }
  return _pairs;
}

/**
 * This function hits two birds with one rock.
 * It fetches the pairs' data from Binance and returns an updated PairsKlines structure.
 * As the pairs' data is fetched from Binance, each pair's information is saved in separate
 * file on the filesystem for reusable purpose.
 */
export async function getPairsKlinesFromBinance (pairs: string[], days: number = 180, pauseMs: number = 150, debug = false) {
  // @todo in this function we should check if the pair file exists
  // if it exists we fetch only the missing days.
  const pairsKlines: PairsKlines = {}
  let i = 1
  for (const pair of pairs) {
    // @todo check if the pair file exists (or else we fetch directly)
    if (debug) { console.log(`fetching ${pair}...`) }
    const klines = await fetchPairKlines(fetch, pair, Date.now() - ms(`${days}d`))
    // we pop the last kline (which is the current day)
    // klines.pop()
    savePairInformation(pair, klines)
    pairsKlines[pair] = klines;
    if (debug) { console.log(`progression: ${(round((i * 100) / pairs.length))}%`) }
    await wait(pauseMs)
    i++;
  }
  return pairsKlines;
}


export function dumpPairsKlines () {
  const files = fs.readdirSync(`${__dirname}/../data/`)
  const pairs: PairsKlines = {}
  for (const file of files) {
    const name = file.split('.')[0]
    pairs[name] = JSON.parse(fs.readFileSync(`${__dirname}/../data/${file}`).toString())
  }
  // save the mega file in the dumps
  fs.writeFileSync(`${__dirname}/../dumps/pairs-klines.json`, JSON.stringify(pairs))
}