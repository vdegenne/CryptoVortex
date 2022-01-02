const Koa = require('koa')
const koaStatic = require('koa-static')

const app = new Koa

app.use(koaStatic('.'))


const port = 8666;
app.listen(port, function () {
  console.log(`Accessible at http://localhost:${port}`)
})