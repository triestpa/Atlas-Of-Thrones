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
  let timeQuery = 'SELECT NOW() as now'
  let response = await client.query('SELECT NOW() as now')
  return response.rows[0]
}

async function getRoads () {
  let roadsQuery = `SELECT ST_AsGeoJSON(geom), name from roads;`
  let response = await client.query(roadsQuery)

  let roads = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    return { geo: geojson, name: row.name }
  })

  return roads
}

async function getLocations () {
  let locationQuery = `SELECT ST_AsGeoJSON(geom), name, type from locations;`
  let response = await client.query(locationQuery)

  let locations = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type }
    return geojson
  })

  return locations
}

async function searchLocations (term) {
  let locationSearchQuery = `
    SELECT name, id
    FROM locations
    WHERE UPPER(name) LIKE UPPER('%${term}%');`
  let response = await client.query(locationSearchQuery)
  return response.rows
}


module.exports = {
  connect,
  queryTime,
  getRoads,
  getLocations,
  searchLocations
}