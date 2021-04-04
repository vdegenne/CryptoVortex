#!./node_modules/.bin/ts-node

import _pairs from './binance-pairs.json'
import { getNewestClassement, buildPairsFromClassement, getPairsKobjectsVolumeClassement } from './classements';
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, getPairsKlinesFromFiles, PairsKobjects } from './pairs';
import yargs from 'yargs'
import { filterAscendingPairs } from './filters';



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
    .options('assets', { alias: 'a', type: 'array', default: ['USDT', 'EUR']})
    .options('volume-sort', { alias: 'v', type: 'boolean', default: false })
    .options('volume-days', { describe: 'number of days for the volume classement (requires -v)', alias: 'vDays', type: 'number', default: 5 })
    .command('newests [size] [options]', 'get the newest pairs ', (yargs) => {
      return yargs
      .positional('size', {
        describe: 'number of pairs to output',
        alias: 's',
        type: 'number',
        default: 10
      })
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
        default: 4
      })
    }, ascendings)
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
    results = buildPairsFromClassement(results, volumeClassement) as PairsKobjects;
  }

  const classement = Object.keys(results).map(pair => `${pair}(${newestClassement.find(p => p[0] === pair)![1]})`)

  console.log(`Newest pairs${argv.v ? ' (volume sorted)' : ''}: ${classement.join(', ')}`)
}

function ascendings (argv: any) {
  const candidates = getCandidatePairs(argv.assets, argv.assets)
  const pairs = getPairsKlinesFromFiles(candidates)
  const pairsKobjects = convertPairsKlinesToPairsKobjects(pairs)
  let ascendings = filterAscendingPairs(pairsKobjects, argv.days, argv.minDays)
  if (argv.v) {
    const classement = getPairsKobjectsVolumeClassement(ascendings, argv.volumeDays)
    ascendings = buildPairsFromClassement(ascendings, classement) as PairsKobjects
  }
  console.log(`Ascending pairs (${argv.days} days${argv.v ? '; volume sorted': ''}): ${Object.keys(ascendings).join(', ')}`)
}

main()