import { Klines } from "./klines";
import fs from 'fs'

export function savePairInformation (pair: string, data: Klines) {
  fs.writeFileSync(`${__dirname}/../data/${pair}.json`, JSON.stringify(data))
}

export function pairFileExists (pair: string) {
  return fs.existsSync(`${__dirname}/../data/${pair}.json`)
}


export function getPairData (pair: string) {
  if (!pairFileExists(pair)) {
    return undefined
  }
  return JSON.parse(fs.readFileSync(`${__dirname}/../data/${pair}.json`).toString())
}