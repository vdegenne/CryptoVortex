import fs from 'fs'
import { PairsKlines } from "./pairs";
import { getMaximalAscent, getMaximalDescent } from "./util";

export type AilurophiliumBlock = {
  [pair: string]: [string, number, number][]
}

export function convertPairsKlinesToAilurophiliumBlock (pairs: PairsKlines) {
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
  ) as AilurophiliumBlock
}


export function saveAilurophiliumBlockToFile (block: AilurophiliumBlock) {
  fs.writeFileSync(`${__dirname}/../finalized.json`, JSON.stringify(
    Object.entries(block)
  ))
}