const Router = require('koa-router')
const database = require('./database')
const cache = require('./cache')
const router = new Router()

router.use(async (ctx, next) => {
  // Check cache before continuing to any endpoint handlers
  const cachedResponse = await cache.get(ctx.path + ctx.search)
  if (cachedResponse) { // If cache hit
    ctx.body = JSON.parse(cachedResponse) // return the cached response
  } else {
    await next() // only continue if result not in cache
  }
})

router.use(async (ctx, next) => {
  await next() // Wait until other handlers have finished
  if (ctx.body && ctx.status === 200) { // If request was successful
    // Cache the response
    await cache.set(ctx.path + ctx.search, JSON.stringify(ctx.body))
  }
})

// Test endpoint - get time from DB
router.get('/time', async ctx => {
  const time = await database.queryTime()
  ctx.body = time
})

// Response with locations of specified type
router.get('/location/all', async ctx => {
  const type = ctx.query.type
  const locations = await database.getLocations(type)
  ctx.body = locations
})

// Respond with location summary based on id
router.get('/location/summary', async ctx => {
  const id = ctx.query.id
  const results = await database.getSummary('locations', id)
  ctx.body = results
})

// Respond with kingdom boundary geojson
router.get('/kingdom/all', async ctx => {
  const boundaries = await database.getPoliticalBoundaries()
  ctx.body = boundaries
})

// Response with calculated size of
router.get('/kingdom/size', async ctx => {
  const id = ctx.query.id
  const results = await database.getRegionSize(id)
  ctx.body = results
})

router.get('/kingdom/summary', async ctx => {
  const id = ctx.query.id
  const results = await database.getSummary('political', id)
  ctx.body = results
})

router.get('/kingdom/castle/count/', async ctx => {
  const regionId = ctx.query.id
  const results = await database.countCastles(regionId)
  ctx.body = results
})

router.get('/error', async ctx => {
  throw new Error('Intentional Error')
})

module.exports = router
