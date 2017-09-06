import './layer-panel.scss'
import template from './layer-panel.html'

export class LayerPanelComponent {
  constructor (placeholderId, mapController, layers) {
    this.mapController = mapController

    document.getElementById(placeholderId).outerHTML = template
    document.getElementById('layer-toggle').addEventListener('click', () => this.toggleLayerPanel())

    const layerButtons = document.getElementById('layer-buttons')
    for (let layerName of layers) {
      let layerItem = document.createElement('div')
      layerItem.textContent = `${layerName}s`
      layerItem.addEventListener('click', () => this.toggleMapLayer(layerName))
      layerItem.className = 'layer-button'
      layerItem.id = `${layerName}-toggle`
      layerButtons.appendChild(layerItem)
    }
  }

  /** Toggle the info panel (only applies to mobile) */
  toggleLayerPanel () {
    const infoContainer = document.getElementById('layer-panel')
    infoContainer.classList.toggle('layer-panel-active')
  }

  /** Toggle map layer visibility */
  toggleMapLayer (layerName) {
    const button = document.getElementById(`${layerName}-toggle`)
    button.classList.toggle('toggle-active')
    this.mapController.toggleLayer(layerName)
  }
}
