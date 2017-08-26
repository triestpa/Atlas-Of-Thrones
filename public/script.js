class ViewController {
  constructor (mapId = 'mapid') {
    this.map = L.map(mapId).setView([51.505, -0.09], 13)
    this.api = new MapApi()
    this.layers = { }
    this.loadMapData()
    this.selectedRegion = null
  }

  icon (iconUrl, iconSize = [ 24, 56 ]) {
    return L.icon({ iconUrl, iconSize })
  }

  async loadMapData () {
    L.tileLayer(
      'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(this.map)

    let [lat, lon] = [3.95, 19.08]
    this.map.setView([lat, lon], 4)

    const locations = [
      [ 'castle', this.icon('icons/castle.svg') ],
      [ 'city', this.icon('icons/city.svg') ],
      [ 'town', this.icon('icons/village.svg') ],
      [ 'ruin', this.icon('icons/ruin.svg') ],
      [ 'other', this.icon('icons/location.svg') ]
    ]

    for (let location of locations) {
      let [ name, icon ] = location
      this.layers[name] = await this.loadLocationGeojson(name, icon)
    }

    this.layers.political = await this.loadBoundaryGeojson()

    this.addLayer('political')
    // this.addLayer('castle')
    this.addLayer('city')
  }

  addLayer (name) {
    this.layers[name].addTo(this.map)
  }

  removeLayer (name) {
    this.map.removeLayer(this.layers[name])
  }

  async showInfo (name, id, type) {
    const infoWindow = document.getElementById('info')
    infoWindow.innerHTML = `<h1>${name}</h1>`

    if (id && type === 'regions') {
      let size = await this.api.getRegionSize(id)
      infoWindow.innerHTML += `<div>Size: ${size}</div>`
    }

    try {
      let info = await this.api.getDetails(name)
      infoWindow.innerHTML += `
        <div>${info.abstract}...</div>
        <a href="http://gameofthrones.wikia.com${info.url}" target="_blank" rel="noopener">Read More</a>`
    } catch (e) {
      console.log('Info Request Failed', e.message)
    }
  }

  async loadLocationGeojson (type, icon) {
    const locations = await this.api.getLocations(type)

    const properties = {}
    properties.pointToLayer = function (feature, latlng) {
      return L.marker(latlng, { icon })
    }

    properties.onEachFeature = (feature, layer) => {
      layer.bindPopup(feature.properties.name)
      layer.on({
        click: async (e) => {
          this.showInfo(feature.properties.name, feature.properties.id, 'location')
          this.setHighlightedRegion(null)
        }
      })
    }

    return L.geoJSON(locations, properties)
  }

  async loadBoundaryGeojson () {
    const boundaries = await this.api.getPoliticalBoundaries()

    const properties = {}
    properties.onEachFeature = (feature, layer) => {
      layer.on({
        click: async (e) => {
          this.showInfo(feature.properties.name, feature.properties.id, 'regions')
          this.setHighlightedRegion(layer)
        }
      })
    }

    return L.geoJSON(boundaries, properties)
  }

  setHighlightedRegion (layer) {
    if (this.selected) {
      this.layers.political.resetStyle(this.selected)
    }

    this.selected = layer
    if (this.selected) {
      this.selected.setStyle({
        'color': 'red'
      })
    }
  }
}

class MapApi {
  constructor (url = '/api/') {
    this.url = url
    this.CancelToken = axios.CancelToken
    this.cancelSource = this.CancelToken.source()
  }

  async httpGet (endpoint = '', params = {}, cancelToken = null) {
    const response = await axios.get(`${this.url}${endpoint}`, { params, cancelToken })
    return response.data
  }

  async getLocations (type) {
    return this.httpGet('locations', { type })
  }

  async getPoliticalBoundaries () {
    return this.httpGet('political/boundaries')
  }

  async getRegionSize (id) {
    return this.httpGet('political/size', { id })
  }

  async getRoads () {
    return this.httpGet('roads')
  }

  async getDetails (name) {
    this.cancelSource.cancel('Cancelled Ongoing Request')
    this.cancelSource = this.CancelToken.source()
    return this.httpGet('details', { name }, this.cancelSource.token)
  }
}

const controller = new ViewController()

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
