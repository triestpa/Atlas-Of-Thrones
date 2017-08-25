const postgres = require('pg')
const dbUrl = process.env.DATABASE_URL
let useSSL = true

if (process.env.POSTGRES_SSL && process.env.POSTGRES_SSL !== 'true') {
  useSSL = false
}

const client = new postgres.Client({
  connectionString: dbUrl,
  ssl: useSSL
})

async function connect () {
  await client.connect()
  return client
}

function close () {
  client.end()
}

async function queryTime () {
  timeQuery = 'SELECT NOW() as now'
  response = await client.query('SELECT NOW() as now')
  return response.rows[0]
}

async function getRoads () {
  roadsQuery = `SELECT ST_AsGeoJSON(geom), name from roads;`
  response = await client.query(roadsQuery)

  let roads = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    return { geo: geojson, name: row.name }
  })

  return roads
}

async function getLocations () {
  locationQuery = `SELECT ST_AsGeoJSON(geom), name, type from locations;`
  response = await client.query(locationQuery)

  let locations = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type }
    return geojson
  })

  return locations
}


module.exports = {
  connect,
  queryTime,
  getRoads,
  getLocations
}