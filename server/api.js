const Router = require('koa-router')
const database = require('./database')
const wikia = require('./wikia')
const cache = require('./cache')
const router = new Router()

// Check cache before continuing to any endpoint handlers
router.use(async (ctx, next) => {
  try {
    const cachedResponse = await cache.get(ctx.path + ctx.search)
    if (cachedResponse) {
      ctx.body = JSON.parse(cachedResponse)
    } else {
      await next() // Only continue if result not in cache
    }
  } catch (err) {
    console.error('Cache Error', err)
    await next()
  }
})

// Cache the response
router.use(async (ctx, next) => {
  await next()
  await cache.set(ctx.path + ctx.search, JSON.stringify(ctx.body))
})

router.get('/', async ctx => {
  ctx.body = 'Hello World'
})

router.get('/time', async ctx => {
  const time = await database.queryTime()
  ctx.body = time
})

router.get('/roads', async ctx => {
  const roads = await database.getRoads()
  ctx.body = roads
})

router.get('/locations', async ctx => {
  const type = ctx.query.type
  const locations = await database.getLocations(type)
  ctx.body = locations
})


router.get('/politicalClaims', async ctx => {
  console.log('HERE')
  const boundaries = await database.getPoliticalBoundaries()
  ctx.body = boundaries
})

router.get('/search', async ctx => {
  const term = ctx.query.term
  const results = await database.searchLocations(term)
  ctx.body = results
})

router.get('/details', async ctx => {
  const term = ctx.query.term
  const resultId = await wikia.searchWiki(term)
  const details = await wikia.getPageDetails(resultId)
  ctx.body = details
})

router.get('/error', async ctx => {
  throw new Error('Intentional Error')
})

module.exports = router