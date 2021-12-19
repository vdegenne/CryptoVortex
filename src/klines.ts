export type Kline = [
  number, // open time
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number, // close time
  string, // quote asset volume
  number, // number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string // Ignore.
]

export type Kobject = {
  ot: number,
  ct: number,
  o: number,
  h: number,
  l: number,
  c: number,
  v: number
}

export type Klines = Kline[]


/**
 * Returns the last date (Date object).
 * This functions doesn't remove the last incomplete kline of the current day (from Binance data)
 * make sure to remove this day if needed in sus-functions.
 */
export function getLastDate (klines: Klines) {
  return new Date(klines[klines.length - 1][0])
}


export function convertKlineToKobject (kline: Kline): Kobject {
  return {
    ot: kline[0],
    ct: kline[6],
    o: parseFloat(kline[1]),
    h: parseFloat(kline[2]),
    l: parseFloat(kline[3]),
    c: parseFloat(kline[4]),
    v: parseFloat(kline[5])
  }
}

export function convertKlinesToKobjects (klines: Klines): Kobject[] {
  // console.log(klines)
  return klines.map(kline => convertKlineToKobject(kline))
}


export function isKline (object: any) {
  return object.v === undefined;
}

export function isKobject (object: any) {
  return object.v !== undefined;
}