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
  const response = await client.query('SELECT NOW() as now')
  return response.rows[0]
}

async function getLocations (type) {
  const locationQuery = `
    SELECT ST_AsGeoJSON(geog), name, type, gid
    FROM locations
    WHERE UPPER(type) = UPPER($1) AND name IS NOT NULL;`
  const response = await client.query(locationQuery, [ type ])

  const locations = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type, id: row.gid }
    return geojson
  })

  return locations
}

async function getPoliticalBoundaries () {
  const boundaryQuery = `
  SELECT ST_AsGeoJSON(geog), name, claimedBy, gid
  FROM political
  WHERE name IS NOT NULL;`
  const response = await client.query(boundaryQuery)

  const boundaries = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, id: row.gid }
    return geojson
  })

  return boundaries
}

async function getRegionSize (id) {
  const sizeQuery = `
    SELECT ST_AREA(geog) as size
    FROM political
    WHERE gid = $1;`
  const response = await client.query(sizeQuery, [ id ])
  const sqKm = response.rows[0].size * (10 ** -6)
  return sqKm
}

async function countCastles (regionId) {
  const countQuery = `
  SELECT count(*)
  FROM political, locations
  WHERE ST_intersects(political.geog, locations.geog)
  AND political.gid = $1
  AND locations.type = 'Castle'
  `

  const response = await client.query(countQuery, [ regionId ])
  return response.rows[0].count
}

async function searchLocations (term) {
  const locationSearchQuery = `
    SELECT name, gid
    FROM locations
    WHERE UPPER(name) LIKE UPPER($1);`
  const response = await client.query(locationSearchQuery, [ `%${term}%` ])
  return response.rows
}

async function getSummary (table, id) {
  const summaryQuery = `
  SELECT summary
  FROM ${table}
  WHERE gid = $1;`

  const response = await client.query(summaryQuery, [ id ])
  return response.rows[0].summary
}

module.exports = {
  connect,
  close,
  queryTime,
  getLocations,
  searchLocations,
  getPoliticalBoundaries,
  getRegionSize,
  countCastles,
  getSummary
}
