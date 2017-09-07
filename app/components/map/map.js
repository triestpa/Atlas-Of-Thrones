import './map.scss'
import L from 'leaflet'

/** Leaflet Map Controller Class */
export class MapController {
  /** Initialize Map Properties */
  constructor (mapPlaceholderId, props) {
    // Initialize Leaflet map
    this.map = L.map(mapPlaceholderId, {
      center: [ 5, 20 ],
      zoom: 4,
      maxZoom: 8,
      minZoom: 4,
      maxBounds: [ [ 50, -30 ], [ -45, 100 ] ]
    })

    // Position zoom control
    this.map.zoomControl.setPosition('bottomright')

    // Assign location selected callback
    this.onLocationSelected = props.onLocationSelected

    // Initialize state variables
    this.layers = {}
    this.selectedRegion = null

    // Render Carto GoT tile baselayer
    L.tileLayer(
      'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png',
      { crs: L.CRS.EPSG4326 }).addTo(this.map)
  }

  /** Add location geojson to the leaflet instance */
  addLocationGeojson (layerTitle, geojson, iconUrl) {
    // Initialize new geojson layer
    this.layers[layerTitle] = L.geoJSON(geojson, {
      // Show marker on location
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {
          icon: L.icon({ iconUrl, iconSize: [ 24, 56 ] }),
          title: feature.properties.name })
      },
      // Assign on click listener to each location
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name, { closeButton: false })
        layer.on({
          click: async (e) => {
            this.setHighlightedRegion(null) // Deselect highlighed region
            this.onLocationSelected(feature.properties.name, feature.properties.id, feature.properties.type)
          }
        })
      }
    })
  }

  /** Add boundary (kingdom) geojson to the leaflet instance */
  addKingdomGeojson (geojson) {
    // Initialize new geojson layer
    this.layers.kingdom = L.geoJSON(geojson, {
      // Set layer style
      style: {
        'color': '#222',
        'weight': 1,
        'opacity': 0.65
      },
      // Assign on click listener to each location
      onEachFeature: (feature, layer) => {
        layer.on({
          click: async (e) => {
            this.onLocationSelected(feature.properties.name, feature.properties.id, 'kingdom')
            this.map.closePopup() // Deselect selected location marker
            this.setHighlightedRegion(layer)
          }
        })
      }
    })
  }

  /** Highlight the selected region */
  setHighlightedRegion (layer) {
    // If a layer is currently selected, deselect it
    if (this.selected) { this.layers.kingdom.resetStyle(this.selected) }

    // Select the provided region layer
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
    // Find selected layer
    const geojsonLayer = this.layers[layerName]
    const sublayers = geojsonLayer.getLayers()
    const selectedSublayer = sublayers.find(layer => {
      return layer.feature.geometry.properties.id === id
    })

    // Zoom map to selected layer
    if (selectedSublayer.feature.geometry.type === 'Point') {
      this.map.flyTo(selectedSublayer.getLatLng(), 5)
    } else {
      this.map.flyToBounds(selectedSublayer.getBounds(), 5)
    }

    // Fire click event
    selectedSublayer.fireEvent('click')
  }
}
