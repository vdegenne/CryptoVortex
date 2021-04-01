const data = require('./exchangeInfo.json')

function main () {
  console.log(getDOWNpairs())
}

function getUPpairs () {
  return data.symbols.map(s => s.baseAsset).filter(name => name.endsWith('UP'))
}
function getDOWNpairs () {
  return data.symbols.map(s => s.baseAsset).filter(name => name.endsWith('DOWN'))
}

main()