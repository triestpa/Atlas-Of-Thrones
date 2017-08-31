import './styles.scss'
import { MapApi } from './api'
import { LocationSearch } from './search'
import { MapController } from './map'

export class ViewController {
  /** Initialize View Properties */
  constructor () {
    if (window.location.hostname === 'localhost') {
      this.api = new MapApi('http://localhost:5000/')
    } else {
      this.api = new MapApi('https://atlas-api.patricktriest.com/')
    }

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

    // Download map locations
    const locationTypes = Object.keys(locationLayers)
    for (let locationType of locationTypes) {
      const geojson = await this.api.getLocations(locationType)
      this.locationSearch.addGeoJsonItems(geojson, locationType)
      this.mapController.addLocationGeojson(locationType, geojson, locationLayers[locationType])
    }

    // Download kingdom boundaries
    const kingdomsGeojson = await this.api.getKingdoms()
    this.locationSearch.addGeoJsonItems(kingdomsGeojson, 'kingdom')
    this.mapController.addKingdomGeojson(kingdomsGeojson)
    this.toggleMapLayer('kingdom')
  }

  /** Receive search bar input, and debounce by 200 ms */
  onSearch (value) {
    clearTimeout(this.searchDebounce)
    this.searchDebounce = setTimeout(() => this.search(value), 200)
  }

  /** Search for the input term, and display results in UI */
  search (term) {
    // Clear search results
    const searchResultsView = document.getElementById('search-results')
    searchResultsView.innerHTML = ''

    // Get the top ten search results
    this.searchResults = this.locationSearch.search(term).slice(0, 10)

    // Display search results on UI
    for (let i = 0; i < this.searchResults.length; i++) {
      searchResultsView.innerHTML += `<div onclick="ctrl.searchResultSelected(${i})">${this.searchResults[i].name}</div>`
    }
  }

  /** Display the selected search result  */
  searchResultSelected (resultIndex) {
    // Clear search input and results
    document.getElementById('search-input').value = ''
    document.getElementById('search-results').innerHTML = ''

    // Show result layer if currently hidden
    const searchResult = this.searchResults[resultIndex]
    if (!this.mapController.isLayerShowing(searchResult.layerName)) {
      this.toggleMapLayer(searchResult.layerName)
    }

    // Highlight result on map
    this.mapController.selectLocation(searchResult.id, searchResult.layerName)
  }

  /** Show info when a map item is selected */
  async showInfo (name, id, type) {
    const infoTitle = document.getElementById('info-title')
    infoTitle.innerHTML = `<h1>${name}</h1>`

    const infoContent = document.getElementById('info-content')
    infoContent.innerHTML = ''
    let info = {}

    if (id && type === 'kingdom') {
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

window.ctrl = new ViewController()
