/**
 * Main Server Index File
 */

const Koa = require('koa')
const cors = require('kcors')
const log = require('./logger')
const database = require('./database')
const api = require('./api')

/** Setup Koa app */
const app = new Koa()
const port = process.env.PORT

/** Connect to Postgres DB */
async function setupDB () {
  const client = await database.connect()
  log.info(`Connected To ${client.database} at ${client.host}:${client.port}`)
}

/** Start node server */
function startServer () {
  app.listen(port, () => { log.info(`Server listening at ${port}`) })
}

/** Log all requests */
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const responseTime = Date.now() - start
  log.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${responseTime} ms`)
})

/** Error Handler - All uncaught exceptions will percolate up to here */
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    log.error(`Request Error ${ctx.url} - ${err.message}`)
  }
})

// Apply cors based on env variable
app.use(cors({ origin: process.env.CORS_ORIGIN }))

// Mount routes
app.use(api.routes(), api.allowedMethods())

// Start the app
setupDB().then(startServer).catch(log.error)
