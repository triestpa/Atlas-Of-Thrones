const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const path = require('path')
const database = require('./database')
const api = require('./api')

const app = new Koa()
const port = process.env.PORT

async function setupDB () {
  const client = await database.connect()
  console.log(`Connected To ${client.database} at ${client.host}:${client.port}`)
}

function startServer() {
  app.listen(port)
}

// Logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.status} ${ctx.url} - ${ms}`);
})

app.on('error', (err, ctx) => {
  console.error(`Request Error ${ctx.url} - ${err.message}`, err)
})


publicPath = path.join(__dirname, '../public/')
app.use(mount('/', serve(publicPath)))

app.use(mount('/api', api.routes(), api.allowedMethods()))
setupDB().then(startServer).catch(console.error)
