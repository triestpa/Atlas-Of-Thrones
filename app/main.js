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

    if (window.location.hostname === 'localhost') {
      this.api = new ApiService('http://localhost:5000/')
    } else {
      this.api = new ApiService('https://api.atlasofthrones.com/')
    }

    this.infoContainer = new InfoPanelComponent('info-panel-placeholder', this.api)
    this.mapController = new MapController((name, id, type) => this.infoContainer.showInfo(name, id, type))
    this.searchService = new SearchService()

    this.loadMapData()
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
      this.searchService.addGeoJsonItems(geojson, locationType)
      this.mapController.addLocationGeojson(locationType, geojson, locationLayers[locationType])
      // this.toggleMapLayer(locationType)
    }

    // Download kingdom boundaries
    const kingdomsGeojson = await this.api.getKingdoms()
    this.searchService.addGeoJsonItems(kingdomsGeojson, 'kingdom')
    this.mapController.addKingdomGeojson(kingdomsGeojson)
    this.layerPanel.toggleMapLayer('kingdom')

    this.searchPanel = new SearchPanelComponent('search-panel-placeholder', this.searchService, this.mapController, this.layerPanel)
  }
}

window.ctrl = new ViewController()
