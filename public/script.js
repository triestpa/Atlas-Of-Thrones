class MapController {
  constructor (mapId = 'mapid') {
    this.map = L.map(mapId).setView([51.505, -0.09], 13)
    this.api = new MapApi()
    this.layers = {
      castles: null,
      cities: null,
      towns: null,
      ruins: null,
      other: null,
      political: null
    }

    const iconsize = [ 24, 56 ]
    this.icons = {
      castle: L.icon({ iconUrl: 'icons/castle.svg', iconSize: iconsize }),
      village: L.icon({ iconUrl: 'icons/village.svg', iconSize: iconsize }),
      city: L.icon({ iconUrl: 'icons/city.svg', iconSize: iconsize }),
      ruins: L.icon({ iconUrl: 'icons/ruin.svg', iconSize: iconsize }),
      location: L.icon({ iconUrl: 'icons/location.svg', iconSize: iconsize })
    }

    this.loadMapData()
  }

  async loadMapData () {
    L.tileLayer(
      'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(this.map)

    let [lat, lon] = [3.95, 19.08]
    this.map.setView([lat, lon], 4)

    this.layers.castles = await this.loadLocationGeojson('Castle', this.icons.castle)
    this.layers.cities = await this.loadLocationGeojson('City', this.icons.city),
    this.layers.towns = await this.loadLocationGeojson('Town', this.icons.village),
    this.layers.ruins = await this.loadLocationGeojson('Ruin', this.icons.ruins),
    this.layers.other = await this.loadLocationGeojson('Other', this.icons.location)
    this.layers.political = await this.loadBoundaryGeojson()

    this.layers.political.addTo(this.map)
    this.layers.cities.addTo(this.map)
    this.layers.towns.addTo(this.map)
    this.layers.castles.addTo(this.map)

    this.map.removeLayer(this.layers.castles)
    this.map.removeLayer(this.layers.towns)
  }

  async showInfo (name, id, type) {
    const infoWindow = document.getElementById('info')
    infoWindow.innerHTML = `<h1>${name}</h1>`

    if (id && type === 'region') {
      let size = await this.api.getSize(id)
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
    const locations =  await this.api.getLocations('Castle', this.icons.castle)
    return L.geoJSON(locations, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon })
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          layer.bindPopup(feature.properties.name)
        }

        layer.on({
          click: async (e) => {
            this.showInfo(feature.properties.name)
          }
        })
      }
    })
  }

  async loadBoundaryGeojson () {
    const boundaries = await this.api.getPoliticalBoundaries()
    return L.geoJSON(boundaries, {
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          layer.bindPopup(feature.properties.name)
        }

        layer.on({
          click: async (e) => {
            this.showInfo(feature.properties.name, feature.properties.id, 'region')
          }
        })
      }
    })
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

  async getLocations (type, icon) {
    return this.httpGet('locations', { type })
  }

  async getPoliticalBoundaries () {
    return this.httpGet('political/boundaries')
  }

  async getRegionSize (id) {
    return this.httpGet('political/size', { id })
  }

  async getDetails (name) {
    this.cancelSource.cancel('Cancelled Ongoing Request')
    this.cancelSource = this.CancelToken.source()
    return this.httpGet('details', { name }, this.cancelSource.token)
  }
}

const controller = new MapController()

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
