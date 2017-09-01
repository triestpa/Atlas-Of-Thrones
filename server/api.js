/**
 * API Routes Module
 */

const Router = require('koa-router')
const database = require('./database')
const cache = require('./cache')
const router = new Router()

// Check cache before continuing to any endpoint handlers
router.use(async (ctx, next) => {
  const cachedResponse = await cache.get(ctx.path + ctx.search)
  if (cachedResponse) { // If cache hit
    ctx.body = JSON.parse(cachedResponse) // return the cached response
  } else {
    await next() // only continue if result not in cache
  }
})

// Insert response into cache on successful response
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
router.get('/locations/:type', async ctx => {
  const type = ctx.params.type
  const locations = await database.getLocations(type)
  ctx.body = locations
})

// Respond with location summary, by id
router.get('/locations/:id/summary', async ctx => {
  const id = ctx.params.id
  const results = await database.getSummary('locations', id)
  ctx.body = results
})

// Respond with boundary geojson for all kingdoms
router.get('/kingdoms', async ctx => {
  const boundaries = await database.getPoliticalBoundaries()
  ctx.body = boundaries
})

// Respond with calculated area of kingdom, by id
router.get('/kingdoms/:id/size', async ctx => {
  const id = ctx.params.id
  const results = await database.getRegionSize(id)
  ctx.body = results
})

// Respond with summary of kingdom, by id
router.get('/kingdoms/:id/summary', async ctx => {
  const id = ctx.params.id
  const results = await database.getSummary('political', id)
  ctx.body = results
})

// Respond with number of castle in kingdom, by id
router.get('/kingdoms/:id/castles', async ctx => {
  const regionId = ctx.params.id
  const results = await database.countCastles(regionId)
  ctx.body = results
})

module.exports = router
