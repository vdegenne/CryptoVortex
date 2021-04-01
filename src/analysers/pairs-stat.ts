import pairs from '../binance-pairs.json'

console.log(`number of pairs : ${pairs.length}`)

const candidates = pairs.filter(p => p.s === 'USDT' || p.q === 'USDT')
console.log(`number of USDT pairs : ${candidates.length}`)