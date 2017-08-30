import { MapApi } from './api'
import { LocationSearch } from './search'
import { MapController } from './map'

export class ViewController {
  /** Initialize View Properties */
  constructor () {
    this.api = new MapApi()
    this.mapController = new MapController((name, id, type) => this.showInfo(name, id, type))
    this.loadMapData()
  }

  /** Load map data from the API */
  async loadMapData () {
    const iconBaseURL = 'https://cdn.patricktriest.com/icons/atlas_of_thrones/'
    const locations = [
      [ 'castle', `${iconBaseURL}castle.svg` ],
      [ 'city', `${iconBaseURL}city.svg` ],
      [ 'town', `${iconBaseURL}village.svg` ],
      [ 'ruin', `${iconBaseURL}ruin.svg` ],
      [ 'landmark', `${iconBaseURL}misc.svg` ]
    ]

    let searchbase = []

    for (let location of locations) {
      let [ name, icon ] = location
      const geojson = await this.api.getLocations(name)
      searchbase = searchbase.concat(geojson.map((entry) => {
        return Object.assign({ layerName: name }, entry.properties)
      }))

      this.mapController.addLocationGeojson(name, geojson, icon)
    }

    const boundaries = await this.api.getPoliticalBoundaries()

    searchbase = searchbase.concat(boundaries.map((entry) => {
      return Object.assign({ type: 'Kingdom', layerName: 'boundaries' }, entry.properties)
    }))

    this.mapController.addBoundaryGeojson(boundaries)

    this.locationSearch = new LocationSearch(searchbase)


    // this.toggleMapLayer('city')
    // this.toggleMapLayer('town')
    // this.toggleMapLayer('ruin')
    // this.toggleMapLayer('landmark')
    // this.toggleMapLayer('castle')
    this.toggleMapLayer('boundaries')

    setTimeout(() => {
      const bestResult = this.locationSearch.search('north')[0]

      if (!this.mapController.isLayerShowing(bestResult.layerName)) {
        this.toggleMapLayer(bestResult.layerName)
      }

      this.mapController.selectLocation(bestResult.id, bestResult.layerName)
    }, 2000)
  }

  /** Show info when a map item is selected */
  async showInfo (name, id, type) {
    const infoTitle = document.getElementById('info-title')
    infoTitle.innerHTML = `<h1>${name}</h1>`

    const infoContent = document.getElementById('info-content')
    infoContent.innerHTML = ''
    let info = {}

    if (id && type === 'regions') {
      let size = await this.api.getRegionSize(id)
      let sizeStr = size.toLocaleString(undefined, { maximumFractionDigits: 0 })
      console.log(sizeStr)
      infoContent.innerHTML += `<div>Size: ${sizeStr} km^2 (estimate)</div>`

      let castles = await this.api.getCastleCount(id)
      infoContent.innerHTML += `<div>Castles: ${castles}</div>`

      info = await this.api.getRegionDetails(id)
    } else {
      info = await this.api.getLocationDetails(id)
    }

    infoContent.innerHTML += `<div>${info.summaryText}  <a href="${info.url}" target="_blank" rel="noopener">Read More...</a></div>`

    // Show info window if hidden, and on desktop
    const infoContainer = document.getElementsByClassName('info-container')[0]
    if (!infoContainer.classList.contains('info-active') && window.innerWidth > 600) {
      this.toggleInfo()
    }
  }

  /** Toggle the info container */
  toggleInfo () {
    const infoContainer = document.getElementsByClassName('info-container')[0]
    infoContainer.classList.toggle('info-active')
  }

  /** Toggle map layer visibility */
  toggleMapLayer (layerName) {
    const button = document.getElementById(`${layerName}-toggle`)
    button.classList.toggle('toggle-active')
    this.mapController.toggleLayer(layerName)
  }
}
