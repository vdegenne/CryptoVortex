import fetch from 'node-fetch'
import ms from 'ms'
import { Klines } from './klines';

export async function fetchPairKlines (pair: string, startTime?: number, endTime?: number): Promise<Klines> {
  let url = `https://www.binance.com/api/v3/klines?symbol=${pair}&interval=1d`;
  if (!startTime) {
    // 180 days by default
    startTime = Date.now() - ms('180d')
  }
  url += `&startTime=${startTime}`
  if (endTime) {
    url += `&endTime=${endTime}`
  }
  const response = await fetch(url)
  return await response.json()
}