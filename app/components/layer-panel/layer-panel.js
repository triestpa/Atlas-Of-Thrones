import './layer-panel.scss'
import template from './layer-panel.html'
import { Component } from '../component'

export class LayerPanelComponent extends Component {
  constructor (placeholderId, props) {
    super(placeholderId, template)

    // Assign onLayerToggle callback
    this.onLayerToggle = props.onLayerToggle

    // Bind UI elements
    this.layerPanelElem = this.componentElem.querySelector('[rel=panel]')
    this.layerToggleElem = this.componentElem.querySelector('[rel=toggle]')
    const layerButtons = this.componentElem.querySelector('[rel=buttons]')

    // Toggle layer panel on click (mobile only)
    this.layerToggleElem.addEventListener('click', () => this.toggleLayerPanel())

    // Add a toggle button for each layer
    for (let layerName of props.layerNames) {
      let layerItem = document.createElement('div')
      layerItem.textContent = `${layerName}s`
      layerItem.setAttribute('rel', `${layerName}-toggle`)
      layerItem.addEventListener('click', (e) => this.toggleMapLayer(layerName))
      layerButtons.appendChild(layerItem)
    }
  }

  /** Toggle the info panel (only applies to mobile) */
  toggleLayerPanel () {
    this.layerPanelElem.classList.toggle('layer-panel-active')
  }

  /** Toggle map layer visibility */
  toggleMapLayer (layerName) {
    // Toggle active UI status
    this.componentElem.querySelector(`[rel=${layerName}-toggle]`).classList.toggle('toggle-active')

    // Trigger layer toggle callback
    this.onLayerToggle(layerName)
  }
}
