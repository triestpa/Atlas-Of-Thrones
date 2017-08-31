/**
 * Postgres DB Module
 */

const postgres = require('pg')
const dbUrl = process.env.DATABASE_URL
let useSSL = true

// Enable SSL based on ENV var
if (process.env.POSTGRES_SSL && process.env.POSTGRES_SSL !== 'true') {
  useSSL = false
}

// Initialize postgres client
const client = new postgres.Client({
  connectionString: dbUrl,
  ssl: useSSL
})

/** Connect to DB */
async function connect () {
  await client.connect()
  return client
}

/** Test query - Query the current time */
async function queryTime () {
  const response = await client.query('SELECT NOW() as now')
  return response.rows[0]
}

/** Query the locations as geojson, for a given type */
async function getLocations (type) {
  const locationQuery = `
    SELECT ST_AsGeoJSON(geog), name, type, gid
    FROM locations
    WHERE UPPER(type) = UPPER($1) AND name IS NOT NULL;`
  const response = await client.query(locationQuery, [ type ])

  // Add row metadata as geojson properties
  const locations = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type, id: row.gid }
    return geojson
  })

  return locations
}

/** Query the political boundaries */
async function getPoliticalBoundaries () {
  const boundaryQuery = `
    SELECT ST_AsGeoJSON(geog), name, claimedBy, gid
    FROM political
    WHERE name IS NOT NULL;`
  const response = await client.query(boundaryQuery)

  // Add row metadata as geojson properties
  const boundaries = response.rows.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, id: row.gid }
    return geojson
  })

  return boundaries
}

/** Calculate the area of a given region, by id */
async function getRegionSize (id) {
  const sizeQuery = `
    SELECT ST_AREA(geog) as size
    FROM political
    WHERE gid = $1;`
  const response = await client.query(sizeQuery, [ id ])

  // Convert response (in square meters) to square kilometers
  const sqKm = response.rows[0].size * (10 ** -6)
  return sqKm
}

/** Count the number of castles in a region, by id */
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

/** Get the summary for a location or region, by id */
async function getSummary (table, id) {
  if (table !== 'political' && table !== 'locations') {
    throw new Error(`Invalid Table - ${table}`)
  }

  const summaryQuery = `
    SELECT summary
    FROM ${table}
    WHERE gid = $1;`

  const response = await client.query(summaryQuery, [ id ])
  return response.rows[0].summary
}

module.exports = {
  connect,
  queryTime,
  getLocations,
  getPoliticalBoundaries,
  getRegionSize,
  countCastles,
  getSummary
}
