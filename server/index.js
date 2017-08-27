const Koa = require('koa')
const cors = require('kcors')
const database = require('./database')
const api = require('./api')
const log = require('./logger')

const app = new Koa()
const port = process.env.PORT

async function setupDB () {
  const client = await database.connect()
  log.info(`Connected To ${client.database} at ${client.host}:${client.port}`)
}

function startServer () {
  app.listen(port, () => {
    log.info(`Server listening at ${port}`)
  })
}

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  log.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${ms}`)
})

app.on('error', (err, ctx) => {
  log.error(`Request Error ${ctx.url} - ${err.message}`, err)
})

app.use(cors({ origin: process.env.CORS_ORIGIN }))

app.use(api.routes(), api.allowedMethods())
setupDB().then(startServer).catch(log.error)
