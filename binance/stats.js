const data = require('./exchangeInfo.json')

function main () {
  console.log(
    data.symbols.filter(s => {
      return s.symbol === `${s.baseAsset}${s.quoteAsset}`
    }).length
  )
}

main()