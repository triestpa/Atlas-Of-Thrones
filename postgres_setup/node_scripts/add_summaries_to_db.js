const postgres = require('pg')
const placeSummaries = require('./data/place_summaries.json')
const kingdomSummaries = require('./data/kingdom_summaries.json')

require('dotenv').config()

const dbUrl = process.env.DATABASE_URL
let useSSL = true

if (process.env.POSTGRES_SSL && process.env.POSTGRES_SSL !== 'true') {
  useSSL = false
}

const client = new postgres.Client({
  connectionString: dbUrl,
  ssl: useSSL
})

async function appendLocationSummaries () {
  for (let entry of placeSummaries) {
    console.log(entry.summary.summaryText)
    const pgQuery = `
    UPDATE locations
    SET summary = $1, url = $2
    WHERE gid = $3;`

    await client.query(pgQuery, [ entry.summary.summaryText, entry.summary.url, entry.row.gid ])
  }
}

async function appendkingdomSummaries () {
  for (let entry of kingdomSummaries) {
    console.log(entry.summary.summaryText)
    const pgQuery = `
    UPDATE political
    SET summary = $1, url = $2
    WHERE gid = $3;`

    await client.query(pgQuery, [ entry.summary.summaryText, entry.summary.url, entry.row.gid ])
  }
}

async function run () {
  try {
    await client.connect()
    await appendLocationSummaries()
    await appendkingdomSummaries()
  } catch (err) {
    console.error(err)
  } finally {
    process.exit()
  }
}

run()
