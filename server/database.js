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
    return { geo: geojson, name: row.name, id: row.id }
  })

  return roads
}

async function getLocations (type) {
  let locationQuery = `
    SELECT ST_AsGeoJSON(geom), name, type
    FROM locations
    WHERE type LIKE '${type}';`
  let response = await client.query(locationQuery)

  let locations = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type, id: row.id }
    return geojson
  })

  return locations
}

async function getPoliticalBoundaries () {
  let politicalQuery = `SELECT ST_AsGeoJSON(geom), name, claimedBy, id from political;`
  let response = await client.query(politicalQuery)

  let boundaries = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, owner: row.claimedBy, id: row.id }
    return geojson
  })

  return boundaries
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
  searchLocations,
  getPoliticalBoundaries
}