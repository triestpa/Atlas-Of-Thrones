const Router = require('koa-router')
const database = require('./database')
const wiki = require('./wiki')
const cache = require('./cache')
const router = new Router()

// Check cache before continuing to any endpoint handlers
router.use(async (ctx, next) => {
  const cachedResponse = await cache.get(ctx.path + ctx.search)
  if (cachedResponse) {
    ctx.body = JSON.parse(cachedResponse)
  } else {
    await next() // Only continue if result not in cache
  }
})

// Cache the response
router.use(async (ctx, next) => {
  await next()

  if (ctx.body && ctx.status === 200) {
    await cache.set(ctx.path + ctx.search, JSON.stringify(ctx.body))
  }
})

router.get('/', async ctx => {
  ctx.body = 'Hello World'
})

router.get('/time', async ctx => {
  const time = await database.queryTime()
  ctx.body = time
})

router.get('/locations', async ctx => {
  const type = ctx.query.type
  const locations = await database.getLocations(type)
  ctx.body = locations
})

router.get('/locations/search', async ctx => {
  const term = ctx.query.term
  const results = await database.searchLocations(term)
  ctx.body = results
})

router.get('/locations/summary', async ctx => {
  const id = ctx.query.id
  const results = await database.getSummary('locations', id)
  ctx.body = results
})

router.get('/political/boundaries', async ctx => {
  const boundaries = await database.getPoliticalBoundaries()
  ctx.body = boundaries
})

router.get('/political/size', async ctx => {
  const id = ctx.query.id
  const results = await database.getRegionSize(id)
  ctx.body = results
})

router.get('/political/summary', async ctx => {
  const id = ctx.query.id
  const results = await database.getSummary('political', id)
  ctx.body = results
})

router.get('/political/castles/count/', async ctx => {
  const regionId = ctx.query.id
  const results = await database.countCastles(regionId)
  ctx.body = results
})

router.get('/error', async ctx => {
  throw new Error('Intentional Error')
})

module.exports = router
