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
  const timeQuery = 'SELECT NOW() as now'
  const response = await client.query('SELECT NOW() as now')
  return response.rows[0]
}

async function getRoads () {
  const roadsQuery = `SELECT ST_AsGeoJSON(geog), name from roads;`
  const response = await client.query(roadsQuery)

  const roads = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    return { geo: geojson, name: row.name, id: row.id }
  })

  return roads
}

async function getLocations (type) {
  const locationQuery = `
    SELECT ST_AsGeoJSON(geog), name, type
    FROM locations
    WHERE type = $1 AND name IS NOT NULL;`
    const response = await client.query(locationQuery, [ type ])

  const locations = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type, id: row.id }
    return geojson
  })

  return locations
}

async function getRegionSize (table, id ) {
  const sizeQuery = `
    SELECT ST_AREA(geog) as size
    FROM ${table}
    WHERE id = $1;`
  const response = await client.query(sizeQuery, [ id ])

  return response.rows[0].size
}

async function getPoliticalBoundaries () {
  const politicalQuery = `
  SELECT ST_AsGeoJSON(geog), name, claimedBy, id
  FROM political
  WHERE name IS NOT NULL;`
  const response = await client.query(politicalQuery)

  const boundaries = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, owner: row.claimedBy, id: row.id }
    return geojson
  })

  return boundaries
}

async function searchLocations (term) {
  const locationSearchQuery = `
    SELECT name, id
    FROM locations
    WHERE UPPER(name) LIKE UPPER($1);`
  const response = await client.query(locationSearchQuery,[ `%${term}%` ])
  return response.rows
}

module.exports = {
  connect,
  queryTime,
  getRoads,
  getLocations,
  searchLocations,
  getPoliticalBoundaries,
  getRegionSize
}