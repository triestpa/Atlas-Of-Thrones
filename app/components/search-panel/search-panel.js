import './search-panel.scss'
import template from './search-panel.html'

export class SearchPanelComponent {
  constructor (placeholderId, searchService, mapController, layerPanel) {
    document.getElementById(placeholderId).outerHTML = template
    this.searchService = searchService
    this.mapController = mapController
    this.layerPanel = layerPanel
    this.searchDebounce = null

    this.inputElem = document.getElementById('search-input')
    this.inputElem.addEventListener('keyup', (e) => this.onSearch(e.target.value))
  }

  /** Receive search bar input, and debounce by 200 ms */
  onSearch (value) {
    clearTimeout(this.searchDebounce)
    this.searchDebounce = setTimeout(() => this.search(value), 50)
  }

  /** Search for the input term, and display results in UI */
  search (term) {
    // Clear search results
    const searchResultsView = document.getElementById('search-results')
    searchResultsView.innerHTML = ''

    // Get the top ten search results
    this.searchResults = this.searchService.search(term).slice(0, 10)

    // Display search results on UI
    for (let i = 0; i < this.searchResults.length; i++) {
      let searchResult = this.searchResults[i]
      let layerItem = document.createElement('div')
      layerItem.textContent = searchResult.name
      layerItem.addEventListener('click', () => this.searchResultSelected(searchResult))
      searchResultsView.appendChild(layerItem)
    }
  }

  /** Display the selected search result  */
  searchResultSelected (searchResult) {
    // Clear search input and results
    document.getElementById('search-input').value = ''
    document.getElementById('search-results').innerHTML = ''

    // Show result layer if currently hidden
    if (!this.mapController.isLayerShowing(searchResult.layerName)) {
      this.layerPanel.toggleMapLayer(searchResult.layerName)
    }

    // Highlight result on map
    this.mapController.selectLocation(searchResult.id, searchResult.layerName)
  }
}
