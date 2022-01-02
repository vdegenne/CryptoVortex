// import fetch from 'node-fetch'
import ms from 'ms'
import { Klines } from './klines';

/**
 * This function is in a separate module because it should be accessible from both the back and the front.
 */
export async function fetchPairKlines (fetchMethod: Function, pair: string, unit: 'd'|'h'|'m' = 'd', startTime?: number, endTime?: number): Promise<Klines> {
  let url = `https://www.binance.com/api/v3/klines?symbol=${pair}&interval=1${unit}`;
  if (!startTime) {
    // 180 units by default
    startTime = Date.now() - ms(`180${unit}`)
  }
  url += `&startTime=${startTime}`
  if (endTime) {
    url += `&endTime=${endTime}`
  }
  const response = await fetchMethod(url)
  return await response.json()
}