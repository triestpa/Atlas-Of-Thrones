import './map.scss'
import L from 'leaflet'

/** Leaflet Map Controller Class */
export class MapController {
  /** Initialize Map Properties */
  constructor (mapPlaceholderId, props) {
    this.map = L.map(mapPlaceholderId, {
      center: [ 5, 20 ],
      zoom: 4,
      maxZoom: 8,
      minZoom: 4,
      maxBounds: [ [ 50, -30 ], [ -45, 100 ] ]
    })

    this.map.zoomControl.setPosition('bottomright')
    this.onLocationSelected = props.onLocationSelected
    this.layers = { }
    this.selectedRegion = null

    L.tileLayer(
      'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png',
      { crs: L.CRS.EPSG4326 }).addTo(this.map)
  }

  /** Add location geojson to the leaflet instance */
  addLocationGeojson (layerTitle, geojson, iconUrl) {
    const properties = {}
    const icon = L.icon({ iconUrl, iconSize: [ 24, 56 ] })

    properties.pointToLayer = function (feature, latlng) {
      return L.marker(latlng, { icon, title: feature.properties.name })
    }

    properties.onEachFeature = (feature, layer) => {
      layer.bindPopup(feature.properties.name, { closeButton: false })
      layer.on({
        click: async (e) => {
          this.onLocationSelected(feature.properties.name, feature.properties.id, feature.properties.type)
          this.setHighlightedRegion(null)
        }
      })
    }

    this.layers[layerTitle] = L.geoJSON(geojson, properties)
  }

  /** Add boundary (kingdom) geojson to the leaflet instance */
  addKingdomGeojson (geojson) {
    const properties = {
      style: {
        'color': '#222',
        'weight': 1,
        'opacity': 0.65
      }
    }

    properties.onEachFeature = (feature, layer) => {
      layer.on({
        click: async (e) => {
          this.onLocationSelected(feature.properties.name, feature.properties.id, 'kingdom')
          this.map.closePopup()
          this.setHighlightedRegion(layer)
        }
      })
    }

    this.layers.kingdom = L.geoJSON(geojson, properties)
  }

  /** Highlight the selected region */
  setHighlightedRegion (layer) {
    if (this.selected) {
      this.layers.kingdom.resetStyle(this.selected)
    }

    this.selected = layer
    if (this.selected) {
      this.selected.bringToFront()
      this.selected.setStyle({
        'color': 'blue'
      })
    }
  }

  /** Toggle map layer visibility */
  toggleLayer (layerName) {
    const layer = this.layers[layerName]
    if (this.map.hasLayer(layer)) {
      this.map.removeLayer(layer)
    } else {
      this.map.addLayer(layer)
    }
  }

  /** Check if layer is added to map  */
  isLayerShowing (layerName) {
    return this.map.hasLayer(this.layers[layerName])
  }

  /** Trigger "click" on layer with provided name */
  selectLocation (id, layerName) {
    const geojsonLayer = this.layers[layerName]
    const sublayers = geojsonLayer.getLayers()
    const selectedSublayer = sublayers.find(layer => {
      return layer.feature.geometry.properties.id === id
    })

    if (selectedSublayer.feature.geometry.type === 'Point') {
      this.map.flyTo(selectedSublayer.getLatLng(), 5)
    } else {
      this.map.flyToBounds(selectedSublayer.getBounds(), 5)
    }

    selectedSublayer.fireEvent('click')
  }
}
