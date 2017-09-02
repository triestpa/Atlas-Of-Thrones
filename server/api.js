/**
 * API Routes Module
 */

const Router = require('koa-router')
const database = require('./database')
const cache = require('./cache')
const joi = require('joi')
const validate = require('koa-joi-validate')
const router = new Router()

/**
 * Declare route-wide middleware
 */

// Check cache before continuing to any endpoint handlers
router.use(async (ctx, next) => {
  const cachedResponse = await cache.get(ctx.path)
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
    await cache.set(ctx.path, JSON.stringify(ctx.body))
  }
})

/**
 * Define validation helpers
 */

// Check that id param is valid number
const idValidator = validate({
  params: { id: joi.number().min(0).max(1000).required() }
})

// Check that query param is valid location type
const typeValidator = validate({
  params: { type: joi.string().valid(['castle', 'city', 'town', 'ruin', 'landmark']).required() }
})

/**
 * Assign API routes and handlers
 */

// Test - get time from DB
router.get('/time', async ctx => {
  const result = await database.queryTime()
  ctx.body = result
})

// Respond with locations of specified type
router.get('/locations/:type', typeValidator, async ctx => {
  const type = ctx.params.type
  const results = await database.getLocations(type)
  if (results.length === 0) { ctx.throw(404) }

  // Add row metadata as geojson properties
  const locations = results.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type, id: row.gid }
    return geojson
  })

  ctx.body = locations
})

// Respond with location summary, by id
router.get('/locations/:id/summary', idValidator, async ctx => {
  const id = ctx.params.id
  const result = await database.getSummary('locations', id)
  ctx.body = result ? result.summary : ctx.throw(404)
})

// Respond with boundary geojson for all kingdoms
router.get('/kingdoms', async ctx => {
  const results = await database.getPoliticalBoundaries()
  if (results.length === 0) { ctx.throw(404) }

  // Add row metadata as geojson properties
  const boundaries = results.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, id: row.gid }
    return geojson
  })

  ctx.body = boundaries
})

// Respond with calculated area of kingdom, by id
router.get('/kingdoms/:id/size', idValidator, async ctx => {
  const id = ctx.params.id
  const result = await database.getRegionSize(id)
  if (!result) { ctx.throw(404) }

  // Convert response (in square meters) to square kilometers
  const sqKm = result.size * (10 ** -6)
  ctx.body = sqKm
})

// Respond with summary of kingdom, by id
router.get('/kingdoms/:id/summary', idValidator, async ctx => {
  const id = ctx.params.id
  const result = await database.getSummary('political', id)
  ctx.body = result ? result.summary : ctx.throw(404)
})

// Respond with number of castle in kingdom, by id
router.get('/kingdoms/:id/castles', idValidator, async ctx => {
  const regionId = ctx.params.id
  const result = await database.countCastles(regionId)
  ctx.body = result ? result.count : ctx.throw(404)
})

module.exports = router
