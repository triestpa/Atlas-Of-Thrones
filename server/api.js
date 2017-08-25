const Router = require('koa-router')
const database = require('./database')

const router = new Router()

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
  const locations = await database.getLocations()
  ctx.body = locations
})

router.get('/error', async ctx => {
  throw new Error('Intentional Error')
})

module.exports = router