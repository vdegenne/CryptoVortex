import fetch from 'node-fetch'
import fs from 'fs'

async function main () {
  buildBinancePairs()
}

async function buildBinancePairs () {
  const response = await fetch(`https://www.binance.com/api/v3/exchangeInfo`)
  const data = await response.json()

  // save the file locally
  fs.writeFileSync('./binance/exchangeInfo.json', JSON.stringify(data))

  // build and save the pairs file
  const pairs = data.symbols
    .filter(s => s.status === 'TRADING')
    .map(s => ({
      s: s.baseAsset,
      q: s.quoteAsset
    }))
  // save the file
  fs.writeFileSync(`${__dirname}/binance-pairs.json`, JSON.stringify(pairs))

  console.log(`saved ${pairs.length} pairs`)
}

// async function buildKrakenPairs () {
//   const result = (await (await fetch(`https://api.kraken.com/0/public/AssetPairs`)).json()).result

//   fs.writeFileSync('src/kraken/kraken-pairs.json',
//     JSON.stringify(
//       Object.entries(result)
//       .filter(([id, obj]) => obj.wsname)
//       .map(([id, obj]) => {
//         const p = obj.wsname.split('/')
//         return {
//           id,
//           s: p[0],
//           q: p[1]
//         }
//       })
//     )
//   )
// }

// async function buildCoingeckoPairs () {
//   // first we build the coin list
//   let result = await (await fetch('https://api.coingecko.com/api/v3/coins/list')).json()

//   fs.writeFileSync('src/coingecko/coingecko-symbols.json', JSON.stringify(
//     result.map(o => ({
//       id: o.id,
//       s: o.symbol.toUpperCase()
//     }))
//   ))

//   // then the quotes
//   result = await (await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')).json()

//   fs.writeFileSync('src/coingecko/coingecko-quotes.json', JSON.stringify(
//     result.map(o => o.toUpperCase())
//   ))
// }


main()