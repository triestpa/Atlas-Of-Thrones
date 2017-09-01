const axios = require('axios')
const fs = require('fs')
const path = require('path')

// const url2 = 'http://gameofthrones.wikia.com/api.php?action=query&list=allpages&format=json&aplimit=500'
let entries = []

async function getArticlePages (fromPage) {
  console.log(`From ${fromPage}`)

  let limit = 500
  const url = `https://awoiaf.westeros.org/api.php?action=query&list=allpages&format=json&aplimit=${limit}&apfrom=A_Game_of_Thrones-Chapter_8`
  const pagesResponse = await axios.get(url, {
    params: {
      action: 'query',
      list: 'allpages',
      format: 'json',
      aplimit: limit,
      apfrom: fromPage
    }
  })

  const pages = pagesResponse.data.query.allpages
  entries = entries.concat(pages)

  if (pagesResponse.data['query-continue']) {
    await getArticlePages(pagesResponse.data['query-continue'].allpages.apcontinue)
  } else {
    await writeFile(entries, '0')
  }
}

function writeFile (object, iter) {
  return new Promise((resolve, reject) => {
    let filename = path.resolve(__dirname, 'data', 'allpages.json')
    fs.writeFile(filename, JSON.stringify(object), (err) => {
      if (err) {
        console.error(err)
      }
      console.log(`File ${filename} has been written`)
      resolve()
    })
  })
}

getArticlePages().then(() => process.exit())
