const axios = require('axios')
const postgres = require('pg')
const articles = require('./data/allpages.json')
const Fuse = require('fuse.js')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const fuse = new Fuse(articles, {
  shouldSort: true,
  includeScore: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['title']
})

const dbUrl = process.env.DATABASE_URL
let useSSL = true

if (process.env.POSTGRES_SSL && process.env.POSTGRES_SSL !== 'true') {
  useSSL = false
}

const client = new postgres.Client({
  connectionString: dbUrl,
  ssl: useSSL
})

async function getPlaceSummaries () {
  const pgQuery = `
  SELECT name, type, gid
  FROM locations;`

  const response = await client.query(pgQuery)

  let summaries = []
  for (let row of response.rows) {
    const summary = await getSummary(row.name)

    if (summary) {
      summary.summaryText = cleanText(summary.summaryText)
      summary.pageTitle = cleanText(summary.pageTitle)
      summaries.push({ row, summary })
    }
  }

  await writeFile(summaries, 'place_summaries.json')
}

async function getKingdomSummaries () {
  const pgQuery = `
  SELECT name, gid
  FROM political;`

  const response = await client.query(pgQuery)

  let summaries = []
  for (let row of response.rows) {
    const summary = await getSummary(row.name)

    if (summary) {
      summary.summaryText = cleanText(summary.summaryText)
      summary.pageTitle = cleanText(summary.pageTitle)
      summaries.push({ row, summary })
    }
  }

  await writeFile(summaries, 'kingdom_summaries.json')
}

function cleanText (text) {
  // Remove escape characters
  let clean = text.replace(/'/g, '')

  // Normalize comma spacing
  clean = clean.replace(/,(?=[^\s])/g, ', ')

  // Normalize period spaceing
  clean = clean.replace(/\.(?=[^\s])/g, '. ')
  clean = clean.replace('.  ', '. ')

  // Remove trailing whitespace
  clean = clean.trim()

  return clean
}

async function getSummary (title) {
  const summary = await checkMediaWikiDump(title)
  return summary
}

async function checkMediaWikiDump (title) {
  if (title) {
    let results = fuse.search(title)

    if (results[0].score > 0.2) {
      const summary = await searchWikias(title)
      return summary
    }

    const summaryResponse = await getSummaryFromMediaWiki(results[0].item.pageid)
    return {
      summaryText: summaryResponse.extract,
      pageTitle: summaryResponse.title,
      url: `https://awoiaf.westeros.org/index.php/${encodeURIComponent(summaryResponse.title)}`
    }
  }
}

async function getSummaryFromMediaWiki (id) {
  console.log(`Fetching AWOIAF Summary - ${id}`)
  const summaryResponse = await axios.get('http://awoiaf.westeros.org/api.php', {
    params: {
      prop: 'extracts',
      explaintext: '',
      exintro: '',
      pageids: id,
      format: 'json',
      action: 'query',
      redirects: ''
    }
  })

  // Need to get id here, in case of redirect
  const pages = summaryResponse.data.query.pages
  const pageId = Object.keys(pages)[0]
  return summaryResponse.data.query.pages[pageId]
}

async function searchWikia (url, name) {
  let searchResponse = await axios.get(`${url}/api/v1/Search/List/`, {
    params: { query: name, limit: 1 }
  })

  return searchResponse.data.items[0]
}

async function getWikiaSummary (mediaWikiUrl, pageId) {
  console.log(`Fetching Wikia Summary - ${pageId}`)
  let pageResponse = await axios.get(`${mediaWikiUrl}/api/v1/Articles/AsSimpleJson/`, {
    params: { id: pageId }
  })

  const firstSectionContent = pageResponse.data.sections[0].content
  let summaryResponse = ''
  let contentSection = 0
  while (summaryResponse.length < 400 && firstSectionContent[contentSection]) {
    summaryResponse += `  ${firstSectionContent[contentSection++].text}`
  }

  return summaryResponse
}

async function searchWikias (title) {
  const gotWikiURL = 'http://gameofthrones.wikia.com'
  const westerosWikiUrl = 'http://westeroscraft.wikia.com'
  let wikiSearchResponse = null
  let wikiSummaryResponse = null

  wikiSearchResponse = await searchWikia(gotWikiURL, title)

  if (wikiSearchResponse.title === title) {
    wikiSummaryResponse = await getWikiaSummary(gotWikiURL, wikiSearchResponse.id)
  } else {
    wikiSearchResponse = await searchWikia(westerosWikiUrl, title)

    if (wikiSearchResponse.title === title) {
      wikiSummaryResponse = await getWikiaSummary(westerosWikiUrl, wikiSearchResponse.id)
    }
  }

  if (wikiSummaryResponse) {
    return {
      summaryText: wikiSummaryResponse,
      pageTitle: wikiSearchResponse.title,
      url: wikiSearchResponse.url
    }
  } else {
    console.log('Failure!!', title)
    return null
  }
}

function writeFile (object, name) {
  return new Promise((resolve, reject) => {
    let filename = path.resolve(__dirname, 'data', name)
    fs.writeFile(filename, JSON.stringify(object), (err) => {
      if (err) {
        console.error(err)
      }
      console.log(`File ${filename} has been written`)
      resolve()
    })
  })
}

async function run () {
  try {
    await client.connect()
    await getPlaceSummaries()
    await getKingdomSummaries()
  } catch (err) {
    console.error(err)
  } finally {
    process.exit()
  }
}

run()
