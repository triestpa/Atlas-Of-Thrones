import { MapApi } from './api'
import { LocationSearch } from './search'
import { MapController } from './map'

export class ViewController {
  /** Initialize View Properties */
  constructor () {
    // this.api = new MapApi('https://atlas-api.patricktriest.com/')
    this.api = new MapApi()
    this.mapController = new MapController((name, id, type) => this.showInfo(name, id, type))
    this.locationSearch = new LocationSearch()
    this.loadMapData()
    this.searchDebounce = null
  }

  /** Load map data from the API */
  async loadMapData () {
    const iconBaseURL = 'https://cdn.patricktriest.com/icons/atlas_of_thrones/'
    const locationLayers = {
      castle: `${iconBaseURL}castle.svg`,
      city: `${iconBaseURL}city.svg`,
      town: `${iconBaseURL}village.svg`,
      ruin: `${iconBaseURL}ruin.svg`,
      landmark: `${iconBaseURL}misc.svg`
    }

    const locationTypes = Object.keys(locationLayers)
    for (let locationType of locationTypes) {
      const geojson = await this.api.getLocations(locationType)
      this.locationSearch.addGeoJsonItems(geojson, locationType)
      this.mapController.addLocationGeojson(locationType, geojson, locationLayers[locationType])
    }

    const boundariesGeoJson = await this.api.getPoliticalBoundaries()
    this.locationSearch.addGeoJsonItems(boundariesGeoJson, 'boundaries')
    this.mapController.addBoundaryGeojson(boundariesGeoJson)
    this.toggleMapLayer('boundaries')
  }

  onSearch (value) {
    clearTimeout(this.searchDebounce)
    this.searchDebounce = setTimeout(() => this.search(value), 200)
  }

  search (term) {
    const searchResultsView = document.getElementById('search-results')
    searchResultsView.innerHTML = ''

    this.searchResults = this.locationSearch.search(term).slice(0, 10)
    for (let i = 0; i < this.searchResults.length; i++) {
      searchResultsView.innerHTML += `<div onclick="ctrl.searchResultSelected(${i})">${this.searchResults[i].name}</div>`
    }
  }

  searchResultSelected (resultIndex) {
    document.getElementById('search-input').value = ''
    document.getElementById('search-results').innerHTML = ''

    const searchResult = this.searchResults[resultIndex]
    if (!this.mapController.isLayerShowing(searchResult.layerName)) {
      this.toggleMapLayer(searchResult.layerName)
    }

    this.mapController.selectLocation(searchResult.id, searchResult.layerName)
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
