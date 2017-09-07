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
    this.infoTitleElem.addEventListener('click', () => this.toggleInfo())
  }

  /** Show info when a map item is selected */
  async showInfo (name, id, type) {
    this.infoTitleElem.innerHTML = `<h1>${name}</h1>`

    if (id && type === 'kingdom') {
      this.infoContent.innerHTML = await this.getKingdomDetailHtml(id)
    } else {
      this.infoContent.innerHTML = await this.getLocationDetailHtml(id, type)
    }

    // Show info window if hidden, and on desktop
    if (!this.containerElem.classList.contains('info-active') && window.innerWidth > 600) {
      this.toggleInfo()
    }
  }

  /** Create kingdom detail HTML string */
  async getKingdomDetailHtml (id) {
    let size = await this.api.getRegionSize(id)
    size = size.toLocaleString(undefined, { maximumFractionDigits: 0 })

    const castleCount = await this.api.getCastleCount(id)
    const kingdomInfo = await this.api.getRegionDetails(id)
    const summaryHTML = this.getInfoSummaryHtml(kingdomInfo)

    return `
      <h3>KINGDOM</h3>
      <div>Size Estimate - ${size} km<sup>2</sup></div>
      <div>Number of Castles - ${castleCount}</div>
      ${summaryHTML}
      `
  }

  /** Create location detail HTML string */
  async getLocationDetailHtml (id, type) {
    const locationInfo = await this.api.getLocationDetails(id)
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

  /** Toggle the info container */
  toggleInfo () {
    this.containerElem.classList.toggle('info-active')
  }
}
