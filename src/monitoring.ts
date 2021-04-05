#!./node_modules/.bin/ts-node

import _pairs from './binance-pairs.json'
import { getNewestClassement, buildPairsFromClassement, getPairsKobjectsVolumeClassement, getPairsKlinesVolumeClassement, getPairsKobjectsAscendingScoresClassement } from './classements';
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, getPairsKlinesFromFiles, PairsKlines, PairsKobjects } from './pairs';
import yargs from 'yargs'
import { filterAscendingPairs } from './filters';
import { assets, includesLeverage } from './defaults';
import { formatVolume, round } from './util';
import { bold, blue } from 'chalk';



function main () {
  // console.log(`number of available pairs (Binance): ${pairs.length}`)
  // const candidates = getCandidatePairs(['USDT', 'EUR'], ['USDT', 'EUR']);
  // console.log(`number of USDT pairs : ${candidates.length}`)
  // const Pairs = getPairsFromFiles(candidates)
  // const pairsPkObjects = convertPairsKlinesToPairsPkObject(Pairs)

  // getLowerKlinesLengthPair(Pairs)
  // console.log(
  //   buildVolumeClassement(Pairs, 5)
  // )

  const argv = yargs
    .option('assets', { describe: 'assets to include in the process', alias: 'a', type: 'array', default: assets})
    .option('size', { describe: 'size of the output list', alias: 's', type: 'number', default: 10 })
    .option('leverage', {
     describe: 'include the leverage pairs',
     alias: 'l',
     type: 'boolean',
     default: includesLeverage
    })
    .option('volume-sort', { alias: 'v', type: 'boolean', default: false })
    .option('volume-days', { describe: 'number of days for the volume classement (requires -v)', alias: 'vDays', type: 'number', default: 5 })
    .command('volumes [size] [options]', 'sort pairs from volume performance', (yargs) => {
      return yargs
      .positional('size', {})
    }, volumes)
    .command('newests [size] [options]', 'get the newest pairs ', (yargs) => {
      return yargs
      .positional('size', {})
    }, newests)
    .command('ascendings [days] [minDays] [options]', 'get the ascending pairs', (yargs) => {
      return yargs
      .positional('days', {
        describe: 'window of days',
        alias: 'd',
        type: 'number',
        default: 4
      })
      .positional('minDays', {
        describe: 'minimum days that the pairs need to have',
        alias: 'm',
        type: 'number',
        default: 3
      })
    }, ascendings)
    .command('ascendingScores [days] [minDays] [options]', 'get sorted ascending-scored pairs',
    (yargs) => {
      return yargs
      .positional('days', {
        describe: 'window of days',
        alias: 'd',
        type: 'number',
        default: 4
      })
      .positional('minDays', {
        describe: 'minimum days that the pairs need to have',
        alias: 'm',
        type: 'number',
        default: 3
      })
    }, ascendingScores)
    .help()
    .version()
    .argv;
}


function newests (argv: any) {
  const candidates = getCandidatePairs(argv.assets, argv.assets)
  const pairs = getPairsKlinesFromFiles(candidates)
  const pairsKobjects = convertPairsKlinesToPairsKobjects(pairs)
  // first we get the newest classement
  const newestClassement = getNewestClassement(pairsKobjects).slice(0, argv.size)
  // we sort the pairs
  let results = buildPairsFromClassement(pairsKobjects, newestClassement.map(c => c[0])) as PairsKobjects;
  if (argv.v) {
    const volumeClassement = getPairsKobjectsVolumeClassement(results, 2)
    results = buildPairsFromClassement(results, volumeClassement.map(c => c[0])) as PairsKobjects;
  }

  const classement = Object.keys(results).map(pair => `${blue(pair)}(${newestClassement.find(p => p[0] === pair)![1]})`)
  console.log(`${bold(`Newest pairs${argv.v ? ' (volume sorted)' : ''}`)}: ${classement.join(', ')}`)
}

function ascendingScores (argv: any) {
  const candidates = getCandidatePairs(argv.assets, argv.assets, argv.leverage)
  const pairs = getPairsKlinesFromFiles(candidates)
  const pairsKobjects = convertPairsKlinesToPairsKobjects(pairs)
  const ascendingScoresClassement = getPairsKobjectsAscendingScoresClassement(pairsKobjects, argv.days, argv.minDays).slice(0, argv.size)
  let results = buildPairsFromClassement(pairsKobjects, ascendingScoresClassement.map(c => c[0])) as PairsKobjects
  if (argv.v) {
    const volumeClassement = getPairsKobjectsVolumeClassement(results, argv.volumeDays)
    results = buildPairsFromClassement(results, volumeClassement.map(c => c[0])) as PairsKobjects
  }
  const classement = Object.keys(results).map(pair => `${blue(pair)}(${round(ascendingScoresClassement.find(p => p[0] === pair)![1])})`)
  console.log(`${bold(`Ascending scores pairs (${argv.days} days${argv.v ? '; volume sorted' : ''})`)}: ${classement.join(', ')}`)
}

function ascendings (argv: any) {
  const candidates = getCandidatePairs(argv.assets, argv.assets, argv.leverage)
  const pairs = getPairsKlinesFromFiles(candidates)
  const pairsKobjects = convertPairsKlinesToPairsKobjects(pairs)
  let ascendings = filterAscendingPairs(pairsKobjects, argv.days, argv.minDays)
  if (argv.v) {
    const classement = getPairsKobjectsVolumeClassement(ascendings, argv.volumeDays)
    ascendings = buildPairsFromClassement(ascendings, classement.map(c => c[0])) as PairsKobjects
  }
  console.log(`${bold(`Ascending pairs (${argv.days} days${argv.v ? '; volume sorted': ''})`)}: ${Object.keys(ascendings).map(v => blue(v)).join(', ')}`)
}

function volumes (argv: any) {
  const candidates = getCandidatePairs(argv.assets, argv.assets, argv.leverage)
  const pairs = getPairsKlinesFromFiles(candidates)
  const classement = getPairsKlinesVolumeClassement(pairs, argv.volumeDays).slice(0, argv.size)
  // const sortedPairs = buildPairsFromClassement(pairs, classement.map(c => c[0])) as PairsKlines
  console.log(`${bold('Volume sorted pairs')}: ${classement.map(p => `${blue(p[0])}(${formatVolume(p[1])})`).join(', ')}`)
}

main()