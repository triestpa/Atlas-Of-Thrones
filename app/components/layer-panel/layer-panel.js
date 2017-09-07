import './layer-panel.scss'
import template from './layer-panel.html'
import { Component } from '../component'

export class LayerPanelComponent extends Component {
  constructor (placeholderId, props) {
    super(placeholderId, template)
    this.onLayerToggle = props.onLayerToggle
    this.layerPanelElem = this.componentElem.querySelector('[rel=panel]')

    this.layerToggleElem = this.componentElem.querySelector('[rel=toggle]')
    this.layerToggleElem.addEventListener('click', () => this.toggleLayerPanel())

    const layerButtons = this.componentElem.querySelector('[rel=buttons]')
    for (let layerName of props.layerNames) {
      let layerItem = document.createElement('div')
      layerItem.textContent = `${layerName}s`
      layerItem.className = 'layer-button'
      layerItem.setAttribute('rel', `${layerName}-toggle`)
      layerItem.addEventListener('click', () => this.toggleMapLayer(layerName))
      layerButtons.appendChild(layerItem)
    }
  }

  /** Toggle the info panel (only applies to mobile) */
  toggleLayerPanel () {
    this.layerPanelElem.classList.toggle('layer-panel-active')
  }

  /** Toggle map layer visibility */
  toggleMapLayer (layerName) {
    const button = this.componentElem.querySelector(`[rel=${layerName}-toggle]`)
    button.classList.toggle('toggle-active')

    this.onLayerToggle(layerName)
    // this.mapController.toggleLayer(layerName)
  }
}
