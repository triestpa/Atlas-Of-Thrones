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

module.exports = {
  /** Connect to DB */
  connect: async () => {
    await client.connect()
    return client
  },

  /** Test query - Query the current time */
  queryTime: async () => {
    const result = await client.query('SELECT NOW() as now')
    return result.rows[0]
  },

  /** Query the locations as geojson, for a given type */
  getLocations: async (type) => {
    const locationQuery = `
      SELECT ST_AsGeoJSON(geog), name, type, gid
      FROM locations
      WHERE UPPER(type) = UPPER($1);`
    const result = await client.query(locationQuery, [ type ])
    return result.rows
  },

  /** Query the political boundaries */
  getPoliticalBoundaries: async () => {
    const boundaryQuery = `
      SELECT ST_AsGeoJSON(geog), name, claimedBy, gid
      FROM political;`
    const result = await client.query(boundaryQuery)
    return result.rows
  },

  /** Calculate the area of a given region, by id */
  getRegionSize: async (id) => {
    const sizeQuery = `
      SELECT ST_AREA(geog) as size
      FROM political
      WHERE gid = $1
      LIMIT(1);`
    const result = await client.query(sizeQuery, [ id ])
    return result.rows[0]
  },

  /** Count the number of castles in a region, by id */
  countCastles: async (regionId) => {
    const countQuery = `
      SELECT count(*)
      FROM political, locations
      WHERE ST_intersects(political.geog, locations.geog)
      AND political.gid = $1
      AND locations.type = 'Castle';`
    const result = await client.query(countQuery, [ regionId ])
    return result.rows[0]
  },

  /** Get the summary for a location or region, by id */
  getSummary: async (table, id) => {
    if (table !== 'political' && table !== 'locations') {
      throw new Error(`Invalid Table - ${table}`)
    }

    const summaryQuery = `
      SELECT summary
      FROM ${table}
      WHERE gid = $1
      LIMIT(1);`
    const result = await client.query(summaryQuery, [ id ])
    return result.rows[0]
  }
}
