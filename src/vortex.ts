#!./node_modules/.bin/ts-node

import fs from 'fs'
import yargs from 'yargs';
import { buildPairsFromClassement, getPairsKlinesVolumeClassement } from './classements';
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKlines } from "./pairs";
import { assets, dumpSize, includesLeverage, unitsWidth, volumeDays } from './defaults';
import fetch from 'node-fetch'
import { percent, round, wait } from './util';
import { fetchPairKlines } from './binance';
import { savePairInformation } from './io';
import ms from 'ms'
const _pairsNames = import('../dumps/binance-pairs.json')
let pairsNames = _pairsNames
import path from 'path'

console.log(_pairsNames)
process.exit(1);
export type Dump = {
  [pair: string]: [string, number, number][]
}

/*** VORTEX, sniff all the data Muahahahaha */
async function Vortex (argv) {
  fs.writeFileSync(path.resolve('dumps', 'last-fetch-informations.json'), JSON.stringify({
    date: Date.now(),
    width: argv.width,
    unit: argv.unit
  }))
  await buildBinancePairs();
  const candidates = getCandidatePairs(pairsNames, argv.assets, argv.assets)
  // candidates = ['ADAUSDT', 'ETHUSDT', ... ]
  console.log(`These assets will be fetched: ${argv.assets.join(', ')}`)
  const pairsKlines = await getPairsKlinesFromBinance(candidates, argv.unit, argv.width, argv.pause, true)
  // save the pairsKlines into a dump for general use
  dumpPairsKlines()
  console.log(`Assets' information fetched`)
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
  const data: any = await response.json()

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
  fs.writeFileSync(`${__dirname}/../dumps/binance-pairs.json`, JSON.stringify(pairs))
  pairsNames = pairs

  console.log(`saved ${pairs.length} pairs`)
}



/**
 * This function hits two birds with one rock.
 * It fetches the pairs' data from Binance and returns an updated PairsKlines structure.
 * As the pairs' data is fetched from Binance, each pair's information is saved in separate
 * file on the filesystem for reusable purpose.
 */
export async function getPairsKlinesFromBinance (pairsList: string[], unit: 'd'|'h'|'m' = 'd', klinesNumber: number = 180, pauseMs: number = 100, debug = false) {
  // @todo in this function we should check if the pair file exists
  // if it exists we fetch only the missing days.
  const pairsKlines: PairsKlines = {}

  let pairsClone = pairsList.slice()
  let nPerFetch = 3
  // @TODO: fetch 5 by 5 or so (with Promise)
  while (pairsClone.length) {
    let pairs: string[]|Promise<null>[] = pairsClone.splice(0, nPerFetch)
    if (debug) { console.log(`fetching ${pairs.join(', ')}...`)}
    pairs = pairs.map(pair => new Promise(async resolve => {
      const klines = await fetchPairKlines(fetch, pair, unit, Date.now() - ms(`${klinesNumber}${unit}`))
      // @TODO: save the parameters in a dump file for front feedback
      // klines.pop() // we pop the last kline (which is the current day)
      pairsKlines[pair] = klines;
      savePairInformation(pair, klines)
      resolve(null)
    }))
    await Promise.all(pairs)
    if (debug) { console.log(`progression: ${(round(((pairsList.length - pairsClone.length) * 100) / pairsList.length))}%`) }
    await wait(pauseMs)
  }
  return pairsKlines;
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


function main () {
  const argv = yargs(process.argv.slice(2))
  .option('assets', {
    describe: 'assets to fetch',
    alias: 'a',
    type: 'array',
    default: assets
  })
  .command('binance-pairs', 'fetch and save Binance available pairs', {}, async () => {
    await buildBinancePairs()
  })
  .command('binance [unit] [days] [pause] [options]', 'fetch pairs\' information from Binance', (yargs) => {
    yargs
    .positional('unit', {
      describe: 'day (d), hour (h), minute (m)',
      choices: ['d', 'h', 'm'],
      alias: 'u',
      type: 'string',
      default: 'd'
    })
    .positional('width', {
      describe: 'units width (how many candle) to fetch for each pair',
      alias: 'w',
      type: 'number',
      default: unitsWidth
    })
    .positional('pause', {
      describe: 'time to wait between each requests (milliseconds)',
      alias: 'p',
      type: 'number',
      default: 150
    })
  }, Vortex)
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
