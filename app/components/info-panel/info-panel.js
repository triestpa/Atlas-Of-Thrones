import './info-panel.scss'
import template from './info-panel.html'
import { Component } from '../component'

export class InfoPanelComponent extends Component {
  constructor (placeholderId, props) {
    super(placeholderId, template)
    this.api = props.apiService

    // Bind UI elements
    this.containerElem = this.componentElem.querySelector('[rel=container]')
    this.infoTitleElem = this.componentElem.querySelector('[rel=title]')
    this.infoContent = this.componentElem.querySelector('[rel=content]')

    // Toggle info panel on title click
    this.infoTitleElem.addEventListener('click', () => this.toggleInfoPanel())
  }

  /** Show info when a map item is selected */
  async showInfo (name, id, type) {
    this.infoTitleElem.innerHTML = `<h1>${name}</h1>`

    // Download and display information, based on location type
    if (id && type === 'kingdom') {
      this.infoContent.innerHTML = await this.getKingdomDetailHtml(id)
    } else {
      this.infoContent.innerHTML = await this.getLocationDetailHtml(id, type)
    }

    // Show info window if hidden, and always on desktop
    if (!this.containerElem.classList.contains('info-active') && window.innerWidth > 600) {
      this.toggleInfoPanel()
    }
  }

  /** Create kingdom detail HTML string */
  async getKingdomDetailHtml (id) {
    // Get kingdom metadata
    let { kingdomSize, castleCount, kingdomSummary } = await this.api.getAllKingdomDetails(id)

    // Convert size to an easily readable string
    kingdomSize = kingdomSize.toLocaleString(undefined, { maximumFractionDigits: 0 })

    // Format summary HTML
    const summaryHTML = this.getInfoSummaryHtml(kingdomSummary)

    return `
      <h3>KINGDOM</h3>
      <div>Size Estimate - ${kingdomSize} km<sup>2</sup></div>
      <div>Number of Castles - ${castleCount}</div>
      ${summaryHTML}
      `
  }

  /** Create location detail HTML string */
  async getLocationDetailHtml (id, type) {
    const locationInfo = await this.api.getLocationSummary(id)
    const summaryHTML = this.getInfoSummaryHtml(locationInfo)
    return `
      <h3>${type.toUpperCase()}</h3>
      ${summaryHTML}
      `
  }

  /** Format location summary HTML */
  getInfoSummaryHtml (info) {
    return `
      <h3>Summary</h3>
      <div>${info.summary}</div>
      <div>
        <a href="${info.url}" target="_blank" rel="noopener">Read More...</a>
      </div>
    `
  }

  toggleInfoPanel () {
    this.containerElem.classList.toggle('info-active')
  }
}
