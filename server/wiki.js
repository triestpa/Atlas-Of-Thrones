const axios = require('axios')

async function searchWikia (name) {
  try {
    let searchResponse = await axios.get('https://gameofthrones.wikia.com/api/v1/Search/List/', {
      params: { query: name, limit: 1 }
    })

    const distance = levenshteinDistance(searchResponse.data.items[0].title, name)

    if (distance >= name.length * 0.25) {
      return null
    }

    console.log(searchResponse.data.items)
    const url = searchResponse.data.items[0].url
    const pageId = searchResponse.data.items[0].id

    let pageResponse = await axios.get('http://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson/', {
      params: { id: pageId }
    })

    const firstSectionContent = pageResponse.data.sections[0].content
    let summaryResponse = ''
    let contentSection = 0
    while (summaryResponse.length < 400 && firstSectionContent[contentSection]) {
      summaryResponse += `  ${firstSectionContent[contentSection++].text}`
    }

    return {
      summary: summaryResponse,
      url
    }
  } catch (err) {
    console.error('Error Fetching Wikia Data', err.message)
    return null
  }
}

async function searchAWOIAF (name) {
  try {
    let searchResponse = await axios.get('http://awoiaf.westeros.org/api.php', {
      params: {
        list: 'search', srsearch: name, srlimit: 5, format: 'json', action: 'query', redirects: ''
      }
    })

    let bestResult = null
    let bestDistance = 100
    for (let result of searchResponse.data.query.search) {
      const distance = levenshteinDistance(result.title, name)
      if (distance < bestDistance) {
        bestResult = result
        bestDistance = distance
      }
    }

    if (bestDistance > bestResult.title.length * 0.25) {
      return null
    }

    const summaryResponse = await axios.get('http://awoiaf.westeros.org/api.php', {
      params: {
        prop: 'extracts', explaintext: '', exintro: '', titles: bestResult.title, format: 'json', action: 'query'
      }
    })

    const queryBody = summaryResponse.data.query.pages
    const articleId = Object.keys(summaryResponse.data.query.pages)
    return {
      summary: queryBody[articleId].extract,
      url: `http://awoiaf.westeros.org/index.php/${encodeURIComponent(bestResult.title)}`
    }
  } catch (err) {
    console.error('Error Fetching AWOIAF Data', err.message)
    return null
  }
}

async function getArticleDetails (name) {
  const wikiaResult = await searchWikia(name)
  if (wikiaResult && wikiaResult.summary) {
    return wikiaResult
  } else {
    const awoiafResult = await searchAWOIAF(name)
    return awoiafResult
  }
}

function levenshteinDistance (a, b) {
  var tmp
  if (a.length === 0) { return b.length }
  if (b.length === 0) { return a.length }
  if (a.length > b.length) { tmp = a; a = b; b = tmp }

  let i, j, res, alen = a.length, blen = b.length, row = Array(alen)
  for (i = 0; i <= alen; i++) { row[i] = i }

  for (i = 1; i <= blen; i++) {
    res = i
    for (j = 1; j <= alen; j++) {
      tmp = row[j - 1]
      row[j - 1] = res
      res = b[i - 1] === a[j - 1] ? tmp : Math.min(tmp + 1, Math.min(res + 1, row[j] + 1))
    }
  }
  return res
}
// http://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson/?id=2039

module.exports = {
  getArticleDetails
}
