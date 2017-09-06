import './styles.scss'
import { MapApi } from './api'
import { LocationSearch } from './search'
import { MapController } from './map'
import { LayerPanelComponent } from './components/layer-panel/layer-panel'
import { InfoPanelComponent } from './components/info-panel/info-panel'

/** Main UI Controller Class */
export class ViewController {
  /** Initialize View Properties */
  constructor () {
    if (window.location.hostname === 'localhost') {
      this.api = new MapApi('http://localhost:5000/')
    } else {
      this.api = new MapApi('https://api.atlasofthrones.com/')
    }

    this.infoContainer = new InfoPanelComponent('info-panel-placeholder', this.api)
    this.mapController = new MapController((name, id, type) => this.infoContainer.showInfo(name, id, type))
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
      region: `${iconBaseURL}nature.svg`,
      landmark: `${iconBaseURL}misc.svg`
    }

    // Download map locations
    const locationTypes = Object.keys(locationLayers)


    this.layerPanel = new LayerPanelComponent('layer-panel-placeholder', this.mapController, ['kingdom', ...locationTypes])

    for (let locationType of locationTypes) {
      const geojson = await this.api.getLocations(locationType)
      this.locationSearch.addGeoJsonItems(geojson, locationType)
      this.mapController.addLocationGeojson(locationType, geojson, locationLayers[locationType])
      // this.toggleMapLayer(locationType)
    }

    // Download kingdom boundaries
    const kingdomsGeojson = await this.api.getKingdoms()
    this.locationSearch.addGeoJsonItems(kingdomsGeojson, 'kingdom')
    this.mapController.addKingdomGeojson(kingdomsGeojson)
    this.layerPanel.toggleMapLayer('kingdom')
  }

  /** Receive search bar input, and debounce by 200 ms */
  onSearch (value) {
    clearTimeout(this.searchDebounce)
    this.searchDebounce = setTimeout(() => this.search(value), 50)
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
}

window.ctrl = new ViewController()
