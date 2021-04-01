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

export type Klines = Kline[]


/**
 * Returns the last date (Date object).
 * This functions doesn't remove the last incomplete kline of the current day (from Binance data)
 * make sure to remove this day if needed in sus-functions.
 */
export function getLastDate (klines: Klines) {
  return new Date(klines[klines.length - 1][0])
}