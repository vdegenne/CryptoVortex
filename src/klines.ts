export const open_time_index = 0;
export const open_index = 1;
export const high_index = 2;
export const low_index = 3;
export const close_index = 4;
export const volume_index = 5;
export const close_time_index = 6;
export const quote_asset_volume_index = 7;
export const number_of_trades_index = 8;
export const taker_buy_base_asset_volume_index = 9;
export const taker_buy_quote_asset_volume_index = 10;
export const ignore_index = 11;

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

export type ParsedKline = [
  number, // open time
  number, // open
  number, // high
  number, // low
  number, // close
  number, // volume
  number, // close time
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

export function parseKlines (klines: Kline[]): ParsedKline[] {
  return klines.map(k => [
    k[open_time_index],
    parseFloat(k[open_index]),
    parseFloat(k[high_index]),
    parseFloat(k[low_index]),
    parseFloat(k[close_index]),
    parseFloat(k[volume_index]),
    k[close_time_index]
  ])
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

export function convertKlinesToKobjects (klines: Kline[]): Kobject[] {
  // console.log(klines)
  return klines.map(kline => convertKlineToKobject(kline))
}

/**
 * Returns the last date (Date object).
 * This functions doesn't remove the last incomplete kline of the current day (from Binance data)
 * make sure to remove this day if needed in sus-functions.
 */
export function getLastDate (klines: Kline[]) {
  return new Date(klines[klines.length - 1][0])
}

export function isKline (object: any) {
  return object.v === undefined;
}

export function isKobject (object: any) {
  return object.v !== undefined;
}