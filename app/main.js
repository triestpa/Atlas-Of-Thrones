import './main.scss'
import template from './main.html'

import { ApiService } from './services/api'
import { SearchService } from './services/search'
import { MapController } from './components/map/map'
import { LayerPanelComponent } from './components/layer-panel/layer-panel'
import { InfoPanelComponent } from './components/info-panel/info-panel'
import { SearchPanelComponent } from './components/search-panel/search-panel'

/** Main UI Controller Class */
export class ViewController {
  /** Initialize View Properties */
  constructor () {
    document.getElementById('app').outerHTML = template

    this.searchService = new SearchService()

    if (window.location.hostname === 'localhost') {
      this.api = new ApiService('http://localhost:5000/')
    } else {
      this.api = new ApiService('https://api.atlasofthrones.com/')
    }

    this.locationPointTypes = [ 'castle', 'city', 'town', 'ruin', 'region', 'landmark' ]
    this.initializeComponents()
    this.loadMapData()
  }

  initializeComponents () {
    this.infoContainer = new InfoPanelComponent('info-panel-placeholder', {
      data: {
        apiService: this.api
      }
    })

    this.mapController = new MapController('map-placeholder', {
      events: {
        locationSelected: event => {
          const { name, id, type } = event.detail
          this.infoContainer.showInfo(name, id, type)
        }
      }
    })

    this.layerPanel = new LayerPanelComponent('layer-panel-placeholder', {
      data: {
        layerNames: ['kingdom', ...this.locationPointTypes]
      },
      events: {
        layerToggle: event => { this.mapController.toggleLayer(event.detail) }
      }
    })

    this.searchPanel = new SearchPanelComponent('search-panel-placeholder', {
      data: {
        searchService: this.searchService
      },
      events: {
        resultSelected: event => this.searchResultSelected(event.detail)
      }
    })
  }

  /** Load map data from the API */
  async loadMapData () {
    // Download kingdom boundaries
    const kingdomsGeojson = await this.api.getKingdoms()

    // Add boundary data to search service
    this.searchService.addGeoJsonItems(kingdomsGeojson, 'kingdom')

    // Add data to map
    this.mapController.addKingdomGeojson(kingdomsGeojson)

    // Show kingdom boundaries
    this.layerPanel.toggleMapLayer('kingdom')

    // Download location point geodata
    for (let locationType of this.locationPointTypes) {
      // Download GeoJSON + metadata
      const geojson = await this.api.getLocations(locationType)

      // Add data to search service
      this.searchService.addGeoJsonItems(geojson, locationType)

      // Add data to map
      this.mapController.addLocationGeojson(locationType, geojson, this.getIconUrl(locationType))
    }
  }

  /** Display the selected search result  */
  searchResultSelected (searchResult) {
    // Show result layer if currently hidden
    if (!this.mapController.isLayerShowing(searchResult.layerName)) {
      this.layerPanel.toggleMapLayer(searchResult.layerName)
    }

    // Highlight result on map
    this.mapController.selectLocation(searchResult.id, searchResult.layerName)
  }

  /** Format Icon Url For Layer Type  */
  getIconUrl (layerName) {
    return `https://cdn.patricktriest.com/atlas-of-thrones/icons/${layerName}.svg`
  }
}

window.ctrl = new ViewController()
