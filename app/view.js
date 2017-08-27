import L from 'leaflet'
import { MapApi } from './api'

export class ViewController {
  constructor (mapId = 'mapid') {
    this.map = L.map(mapId, {
      center: [ 5, 20 ],
      zoom: 4,
      maxZoom: 10,
      minZoom: 4,
      maxBounds: [ [ 50, -30 ], [ -45, 120 ] ]
    })
    this.api = new MapApi()
    this.layers = { }
    this.selectedRegion = null
  }

  icon (iconUrl, iconSize = [ 24, 56 ]) {
    return L.icon({ iconUrl, iconSize })
  }

  async loadMapData () {
    L.tileLayer(
      'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png', {
        crs: L.CRS.EPSG4326
      }).addTo(this.map)

    const iconBaseURL = 'https://cdn.patricktriest.com/icons/'
    const locations = [
      [ 'castle', this.icon(`${iconBaseURL}castle.svg`) ],
      [ 'city', this.icon(`${iconBaseURL}city.svg`) ],
      [ 'town', this.icon(`${iconBaseURL}village.svg`) ],
      [ 'ruin', this.icon(`${iconBaseURL}ruin.svg`) ],
      [ 'other', this.icon(`${iconBaseURL}location.svg`) ]
    ]

    for (let location of locations) {
      let [ name, icon ] = location
      this.layers[name] = await this.loadLocationGeojson(name, icon)
    }

    const boundaries = await this.api.getPoliticalBoundaries()
    this.layers.political = this.showBoundaryGeojson(boundaries)

    this.addLayer('city')
    this.addLayer('town')
    this.addLayer('political')
  }

  addLayer (name) {
    this.layers[name].addTo(this.map)
  }

  removeLayer (name) {
    this.map.removeLayer(this.layers[name])
  }

  async showInfo (name, id, type) {
    const infoTitle = document.getElementById('info-title')
    infoTitle.innerHTML = `<h1>${name}</h1>`

    const infoContent = document.getElementById('info-content')
    infoContent.innerHTML = ''
    if (id && type === 'regions') {
      let size = await this.api.getRegionSize(id)
      infoContent.innerHTML += `<div>Size: ${size}</div>`
    }

    try {
      let info = await this.api.getDetails(name)
      infoContent.innerHTML += `
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
      return L.marker(latlng, { icon, title: feature.properties.name })
    }

    properties.onEachFeature = (feature, layer) => {
      layer.bindPopup(feature.properties.name, { closeButton: false })
      layer.on({
        click: async (e) => {
          this.showInfo(feature.properties.name, feature.properties.id, 'location')
          this.setHighlightedRegion(null)
        }
      })
    }

    return L.geoJSON(locations, properties)
  }

  showBoundaryGeojson (geojson) {
    const properties = {}
    properties.onEachFeature = (feature, layer) => {
      layer.on({
        click: async (e) => {
          this.showInfo(feature.properties.name, feature.properties.id, 'regions')
          this.setHighlightedRegion(layer)
        }
      })
    }

    return L.geoJSON(geojson, properties)
  }

  setHighlightedRegion (layer) {
    if (this.selected) {
      this.layers.political.resetStyle(this.selected)
    }

    this.selected = layer
    if (this.selected) {
      this.selected.bringToFront()
      this.selected.setStyle({
        'color': 'red'
      })
    }
  }

  toggleInfo () {
    console.log('toggle')
    const infoContainer = document.getElementsByClassName('info-container')[0]
    infoContainer.classList.toggle('info-active')
  }
}
