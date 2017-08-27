import { ViewController } from './view'
require('./styles.scss')

const controller = new ViewController()
controller.loadMapData()

/* Search is too weak right now
async function search (term) {
  let response = await axios.get('/api/locations/search', {
    params: {
      term
    }
  })

  console.log(response)
}
*/

/**
 * Filters
 *
 * cities
 * castles
 * town
 * ruin
 * location
 * roads
 * rivers
 * lakes
 * continents
 * islands
 */

/**
  * Sidebar content

  http://gameofthrones.wikia.com/api/v1/Search/List/?query=winterfell&limit=25&namespaces=0%2C14

  http://gameofthrones.wikia.com/api/v1/Articles/Details/?ids=2039&abstract=500&width=200&height=200

  More endpoints -
  closest town
  closest castle
  closest city

  num cities
  num castles
  num towns
  num ruins
  */
