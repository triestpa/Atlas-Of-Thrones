const axios = require('axios')

async function searchWiki (term) {
  let response = await axios.get('https://gameofthrones.wikia.com/api/v1/Search/List/',{
    params: {
      query: term,
      limit: 1
    }
  })

  return response.data.items[0].id
}

async function getPageDetails (pageID) {
  let response = await axios.get('http://gameofthrones.wikia.com/api/v1/Articles/Details/',{
    params: {
      ids: pageID,
      abstract: 500,
      width: 400,
      height: 400
    }
  })

  const articleDetails = response.data.items[pageID]
  return articleDetails
}

module.exports = {
  searchWiki,
  getPageDetails
}