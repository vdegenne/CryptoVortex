import { fetchPairKlines } from "./binance";
import { savePairInformation } from "./io";
import { getLastDate } from "./klines";
import { getCandidatePairs } from "./pairs";

(async () => {
  // const data = await fetchPairKlines('ETHEUR')
  // console.log(data.pop())
  // console.log(getLastDate(data))
  console.log(getCandidatePairs(['USDT'], ['USDT']))
})()