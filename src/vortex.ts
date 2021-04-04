#!./node_modules/.bin/ts-node

import fs from 'fs'
import yargs from 'yargs';
import { buildPairsFromClassement, getPairsKlinesVolumeClassement } from './classements';
import { assets, daysWindow, dumpSize, includesLeverage, volumeDays } from './defaults';
import { getCandidatePairs, getPairsKlinesFromBinance, getPairsKlinesFromFiles, PairsKlines, PairsKobjects } from "./pairs";
import { getMaximalAscent, getMaximalDescent } from "./util";

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
            getMaximalAscent(parseFloat(kline[1]), parseFloat(kline[2])),
            getMaximalDescent(parseFloat(kline[1]), parseFloat(kline[3]))
          ]
        })
      ]
    })
  ) as Dump
}


export function saveVortexDumpToFile (dump: Dump) {
  fs.writeFileSync(`${__dirname}/../vortex-dump.json`, JSON.stringify(
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
  const pairs = getCandidatePairs(argv.assets, argv.assets)
  console.log(`These assets will be fetched: ${argv.assets.join(', ')}`)
  await getPairsKlinesFromBinance(pairs, argv.days, argv.pause, true)
  console.log(`Assets' information fetched`)
}

async function dump (argv) {
  const candidates = getCandidatePairs(argv.assets, argv.assets, argv.leverage)
  const pairs = getPairsKlinesFromFiles(candidates)
  const classement = getPairsKlinesVolumeClassement(pairs, argv.volumeDays).slice(0, argv.size)
  const sortedPairs = buildPairsFromClassement(pairs, classement.map(p => p[0])) as PairsKlines
  // get vortex dump and save to file
  saveVortexDumpToFile(vortexDump(sortedPairs))
  console.log('saved to file successfully')
}

main()