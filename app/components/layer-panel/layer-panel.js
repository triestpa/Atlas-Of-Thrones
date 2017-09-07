import './layer-panel.scss'
import template from './layer-panel.html'
import { Component } from '../component'

export class LayerPanelComponent extends Component {
  constructor (placeholderId, props) {
    super(placeholderId, template, props.events)

    // Toggle layer panel on click (mobile only)
    this.refs.toggle.addEventListener('click', () => this.toggleLayerPanel())

    // Add a toggle button for each layer
    for (let layerName of props.data.layerNames) {
      let layerItem = document.createElement('div')
      layerItem.textContent = `${layerName}s`
      layerItem.setAttribute('rel', `${layerName}-toggle`)
      layerItem.addEventListener('click', (e) => this.toggleMapLayer(layerName))
      this.refs.buttons.appendChild(layerItem)
    }
  }

  /** Toggle the info panel (only applies to mobile) */
  toggleLayerPanel () {
    this.refs.panel.classList.toggle('layer-panel-active')
  }

  /** Toggle map layer visibility */
  toggleMapLayer (layerName) {
    // Toggle active UI status
    this.componentElem.querySelector(`[rel=${layerName}-toggle]`).classList.toggle('toggle-active')

    // Trigger layer toggle callback
    this.triggerEvent('layerToggle', layerName)
  }
}
