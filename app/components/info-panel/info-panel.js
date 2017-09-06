import './info-panel.scss'
import template from './info-panel.html'

export class InfoPanelComponent {
  constructor (placeholderId, api) {
    document.getElementById(placeholderId).outerHTML = template
    this.api = api

    const infoTitleElem = document.getElementById('info-title')
    infoTitleElem.addEventListener('click', () => this.toggleInfo())
  }

  /** Show info when a map item is selected */
  async showInfo (name, id, type) {
    const infoTitle = document.getElementById('info-title')
    infoTitle.innerHTML = `<h1>${name}</h1>`

    const infoContent = document.getElementById('info-content')
    if (id && type === 'kingdom') {
      infoContent.innerHTML = await this.getKingdomDetailHtml(id)
    } else {
      infoContent.innerHTML = await this.getLocationDetailHtml(id, type)
    }

    // Show info window if hidden, and on desktop
    const infoContainer = document.getElementById('info-container')
    if (!infoContainer.classList.contains('info-active') && window.innerWidth > 600) {
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
    const infoContainer = document.getElementById('info-container')
    infoContainer.classList.toggle('info-active')
  }
}
