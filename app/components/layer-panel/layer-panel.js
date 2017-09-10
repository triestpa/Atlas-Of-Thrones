import './layer-panel.scss'
import template from './layer-panel.html'
import { Component } from '../component'

/**
 * Layer Panel Component
 * Render and control layer-toggle side-panel
 * @extends Component
 */
export class LayerPanel extends Component {
  /** LayerPanel Component Constructor
   * @param { Object } props.events.layerToggle Layer toggle event listener
   */
  constructor (placeholderId, props) {
    super(placeholderId, props, template)

    // Toggle layer panel on click (mobile only)
    this.refs.toggle.addEventListener('click', () => this.toggleLayerPanel())

    // Add a toggle button for each layer
    props.data.layerNames.forEach((name) => this.addLayerButton(name))
  }

  /** Create and append new layer button DIV */
  addLayerButton (layerName) {
    let layerItem = document.createElement('div')
    layerItem.textContent = `${layerName}s`
    layerItem.setAttribute('ref', `${layerName}-toggle`)
    layerItem.addEventListener('click', (e) => this.toggleMapLayer(layerName))
    this.refs.buttons.appendChild(layerItem)
  }

  /** Toggle the info panel (only applies to mobile) */
  toggleLayerPanel () {
    this.refs.panel.classList.toggle('layer-panel-active')
  }

  /** Toggle map layer visibility */
  toggleMapLayer (layerName) {
    // Toggle active UI status
    this.componentElem.querySelector(`[ref=${layerName}-toggle]`).classList.toggle('toggle-active')

    // Trigger layer toggle callback
    this.triggerEvent('layerToggle', layerName)
  }
}
